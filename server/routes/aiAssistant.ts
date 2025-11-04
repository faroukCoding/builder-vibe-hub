import { RequestHandler } from "express";
import { promises as fs } from "fs";
import OpenAI from "openai";
import path from "path";
import {
  appendAssistantMessage,
  getAssistantData,
  getDailyTraining,
  getEducationalGames,
  getParentFollowUpData,
  updateAssistantTipTimestamp,
} from "../services/homeFollowUpStore";

const DEFAULT_PARENT_ID = "parent-1";

let openAIClient: OpenAI | null = null;

const MAX_HISTORY_MESSAGES = 12;

function getOpenAIClient() {
  const apiKey = (process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "").trim();
  if (!apiKey) {
    return null;
  }

  if (!openAIClient) {
    openAIClient = new OpenAI({ apiKey });
  }

  return openAIClient;
}

function buildSystemPrompt({
  parentId,
  childName,
  trainingHighlights,
  gamesHighlights,
}: {
  parentId: string;
  childName: string;
  trainingHighlights: string;
  gamesHighlights: string;
}) {
  return `أنت مساعد تربوي متخصص يعمل ضمن منصة Ortho Smart لدعم أولياء الأمور في متابعة علاج النطق لأطفالهم.
اسم الطفل: ${childName}.
معرف ولي الأمر: ${parentId}.

ملخص التدريب الحالي:
${trainingHighlights}

ملخص الأنشطة والألعاب التعليمية:
${gamesHighlights}

التعليمات:
- استخدم العربية الفصحى المبسطة مع نبرة داعمة وواقعية.
- قدم توصيات عملية يمكن تنفيذها في المنزل مع ربطها بأهداف التدريب الحالية.
- يمكن أن يتضمن الرد حتى ثلاث فقرات قصيرة فقط.
- إذا كان ذلك مناسبًا، اختم بفقرة بعنوان "اقتراحات سريعة" تحتوي على نقطتين أو ثلاث.
- أعد الرد بصيغة JSON فقط وفق البنية التالية دون أي نص إضافي خارج JSON:
  {
    "reply": "النص الكامل للرد",
    "suggested_actions": ["قائمة مختصرة من الاقتراحات التنفيذية"],
    "tone": "اختياري: وصف موجز للنبرة"
  }
- يجب أن تكون جميع الحقول باللغة العربية وبأسلوب مشجع.`;
}

function buildConversationHistory(messages: Awaited<ReturnType<typeof getAssistantData>>["messages"]) {
  const trimmed = messages.slice(-MAX_HISTORY_MESSAGES);
  return trimmed.map((message) => ({
    role: message.role === "assistant" ? ("assistant" as const) : ("user" as const),
    content: message.content,
  }));
}

function generateFallbackResponse(message: string, childName: string) {
  const normalized = message.toLowerCase();

  if (/حرف|راء|صاد|سين|نطق/.test(normalized)) {
    return {
      reply:
        `${childName} يحتاج إلى تكرار التمرين في بيئة هادئة. خصصوا 3 دقائق لتدريب التنفس، ثم استمعوا للتسجيل النموذجي واطلبوا منه تكرار المقطع (را/ري/رو) ببطء. بعد ذلك، جربوا كلمة قصيرة مثل "ورد" واحتفلوا بأي تحسن صغير.`,
      suggestedActions: [
        "فتح تمرين نطق حرف الراء",
        "تشغيل التسجيل الصوتي النموذجي",
        "تدوين ملاحظة للأخصائي",
      ],
    };
  }

  if (/لعبة|ألعاب|تركيز|تحدي/.test(normalized)) {
    return {
      reply:
        "جربوا لعبة مطابقة الصوت بالصورة اليوم، فهي تقوي الفهم السمعي وتشجع طفلكم على الاستماع بدقة. يمكنكم منح نقطة لكل اختيار صحيح ثم مقارنة النتيجة مع الأسبوع الماضي لتحفيزه أكثر.",
      suggestedActions: [
        "بدء لعبة مطابقة الصوت",
        "عرض لوحة النقاط",
        "تفعيل تحدي النطق السريع",
      ],
    };
  }

  if (/نوم|غضب|تركيز|سلوك/.test(normalized)) {
    return {
      reply:
        "حافظوا على روتين مسائي ثابت: قصص قصيرة مع إضاءة دافئة يتبعها تمرين تنفس بسيط (شهيق 4 ثوانٍ، زفير 4 ثوانٍ). هذا يساعد على تهدئة الطفل وتجهيزه للنوم.",
      suggestedActions: ["تشغيل قصة صوتية", "عرض نصائح النوم", "جدولة تذكير مسائي"],
    };
  }

  return {
    reply:
      "أنا هنا لمساعدتكم في كل ما يتعلق بتطور طفلكم. أخبروني بمستوى التقدم الحالي أو بنوع التحدي الذي تلاحظونه، وسأقدم خطة مخصصة لكم.",
    suggestedActions: ["عرض ملخص التدريب اليومي", "اقتراح تمرين جديد", "الحصول على خطة أسبوعية"],
  };
}

export const handleAssistantHistory: RequestHandler = async (req, res) => {
  try {
    const parentId = (req.query.parentId as string) || DEFAULT_PARENT_ID;
    const data = await getAssistantData(parentId);
    const from = req.query.from ? new Date(req.query.from as string) : null;
    const to = req.query.to ? new Date(req.query.to as string) : null;
    const limit = req.query.limit ? Number(req.query.limit) : 100;

    let messages = data.messages;

    if (from) {
      messages = messages.filter((message) => new Date(message.timestamp) >= from);
    }

    if (to) {
      messages = messages.filter((message) => new Date(message.timestamp) <= to);
    }

    messages = messages.slice(-limit);

    res.json({
      parentId,
      count: messages.length,
      lastTipTimestamp: data.lastTipTimestamp,
      messages,
      savedTips: data.savedTips,
    });
  } catch (error) {
    res.status(500).json({
      error: "تعذر تحميل المحادثة",
      details: (error as Error).message,
    });
  }
};

export const handleAssistantChat: RequestHandler = async (req, res) => {
  try {
    const parentId = (req.body?.parentId as string) || DEFAULT_PARENT_ID;
    const message = (req.body?.message as string)?.trim();
    // Optional: when the frontend already has a local canned reply (from client DB),
    // it can send it here to persist both the parent message and the assistant reply
    // without invoking OpenAI. This helps keep server history consistent with client.
    const localReply = typeof req.body?.localReply === "string" ? (req.body.localReply as string) : undefined;
    const localItemId = typeof req.body?.localItemId === "string" ? (req.body.localItemId as string) : undefined;
    const providedSuggestedActions = Array.isArray(req.body?.suggestedActions)
      ? (req.body.suggestedActions as string[])
      : undefined;

    if (!message) {
      return res.status(400).json({ error: "يرجى كتابة رسالة للمساعد" });
    }

    await appendAssistantMessage(parentId, {
      id: `parent-${Date.now()}`,
      role: "parent",
      timestamp: new Date().toISOString(),
      content: message,
    });

    // If the client provided a local reply, persist it and return immediately
    if (localReply) {
      const assistantMessage = await appendAssistantMessage(parentId, {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        timestamp: new Date().toISOString(),
        content: localReply,
        suggestedActions: providedSuggestedActions?.length ? providedSuggestedActions : undefined,
      });

      return res.json({
        message: "تم إرسال الرد",
        reply: assistantMessage.content,
        suggestedActions: assistantMessage.suggestedActions,
        usedOpenAI: false,
        context: {
          trainingHighlights: "",
          gamesHighlights: "",
          conversationLength: (await getAssistantData(parentId)).messages.length,
        },
      });
    }

    const [training, games, assistant, parentProfile] = await Promise.all([
      getDailyTraining(parentId),
      getEducationalGames(parentId),
      getAssistantData(parentId),
      getParentFollowUpData(parentId),
    ]);

    const childName = parentProfile.childName;

    const trainingHighlights = `التقدم العام: ${training.summary.dailyGoalCompletion}%، عدد التمارين: ${training.summary.totalExercises}، أبرز تمرين: ${training.exercises[0]?.title} (التقدم ${training.exercises[0]?.progress}%).`;
    const gamesHighlights = `النقاط الإجمالية: ${games.totalPoints}، التحدي النشط: ${games.games[0]?.weeklyChallenge.goal}، آخر نتيجة: ${games.games[0]?.sessions[0]?.score ?? "لا توجد"}.`;

    const client = getOpenAIClient();
    let reply = "";
    let suggestedActions: string[] = [];
    let usedOpenAI = false;

    if (client) {
      try {
        const systemPrompt = buildSystemPrompt({
          parentId,
          childName,
          trainingHighlights,
          gamesHighlights,
        });

        const historyForModel = buildConversationHistory(assistant.messages);

        const completion = await client.chat.completions.create({
          model: "gpt-4o-mini",
          temperature: 0.7,
          max_tokens: 600,
          response_format: { type: "json_object" },
          messages: [{ role: "system", content: systemPrompt }, ...historyForModel],
        });

        const rawContent = completion.choices[0]?.message?.content?.trim() ?? "";
        let parsed: {
          reply?: string;
          suggested_actions?: string[];
        } = {};

        if (rawContent) {
          try {
            parsed = JSON.parse(rawContent);
          } catch {
            parsed = { reply: rawContent };
          }
        }

        reply = (parsed.reply ?? "").trim();
        if (Array.isArray(parsed.suggested_actions)) {
          suggestedActions = parsed.suggested_actions
            .map((item) => (typeof item === "string" ? item.trim() : ""))
            .filter((item) => item.length > 0)
            .slice(0, 4);
        }

        usedOpenAI = reply.length > 0;
      } catch (error) {
        console.error("[AI Assistant] OpenAI completion failed", error);
      }
    }

    if (!reply) {
      const fallback = generateFallbackResponse(message, childName);
      reply = fallback.reply;
      suggestedActions = fallback.suggestedActions;
    }

    const assistantMessage = await appendAssistantMessage(parentId, {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      timestamp: new Date().toISOString(),
      content: reply,
      suggestedActions: suggestedActions.length ? suggestedActions : undefined,
    });

    res.json({
      message: "تم إرسال الرد",
      reply: assistantMessage.content,
      suggestedActions: assistantMessage.suggestedActions,
      usedOpenAI,
      context: {
        trainingHighlights,
        gamesHighlights,
        conversationLength: assistant.messages.length + 1,
      },
    });
  } catch (error) {
    // Log the error stack to a server-side log file for easier debugging
    try {
      const logDir = path.join(process.cwd(), "server", "logs");
      await fs.mkdir(logDir, { recursive: true });
      const logPath = path.join(logDir, "assistant-errors.log");
      const entry = `[${new Date().toISOString()}] ${String((error as Error).stack ?? (error as Error).message)}\n`;
      await fs.appendFile(logPath, entry, "utf-8");
    } catch (logErr) {
      // If logging fails, print to console as a fallback
      console.error("Failed to write assistant error log:", logErr);
    }

    res.status(500).json({
      error: "تعذر الحصول على رد من المساعد",
      details: (error as Error).message,
    });
  }
};

export const handleAssistantTip: RequestHandler = async (req, res) => {
  try {
    const parentId = (req.body?.parentId as string) || DEFAULT_PARENT_ID;
    const assistant = await getAssistantData(parentId);
    const nextTip = assistant.savedTips[Math.floor(Math.random() * assistant.savedTips.length)];

    await updateAssistantTipTimestamp(parentId);

    res.json({
      message: "تم جلب نصيحة جديدة",
      tip: {
        ...nextTip,
        deliveredAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "تعذر جلب نصيحة اليوم",
      details: (error as Error).message,
    });
  }
};

