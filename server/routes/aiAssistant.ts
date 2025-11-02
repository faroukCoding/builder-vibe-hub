import { RequestHandler } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  appendAssistantMessage,
  getAssistantData,
  getDailyTraining,
  getEducationalGames,
  getParentFollowUpData,
  updateAssistantTipTimestamp,
} from "../services/homeFollowUpStore";

const DEFAULT_PARENT_ID = "parent-1";

let generativeModel: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null;

function getGenerativeModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  if (!generativeModel) {
    const client = new GoogleGenerativeAI(apiKey);
    generativeModel = client.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  return generativeModel;
}

function buildAssistantPrompt({
  message,
  parentId,
  childName,
  trainingHighlights,
  gamesHighlights,
}: {
  message: string;
  parentId: string;
  childName: string;
  trainingHighlights: string;
  gamesHighlights: string;
}) {
  return `أنت مساعد تربوي متخصص يعمل ضمن منصة Ortho Smart لمتابعة الأطفال في علاج النطق.
المستخدم هو ولي الطفل ${childName} (معرف ولي الأمر: ${parentId}).

بيانات التدريب الحالية:
${trainingHighlights}

بيانات الألعاب التعليمية:
${gamesHighlights}

تعليمات الرد:
- استخدم العربية الفصحى المبسطة مع نبرة داعمة ودقيقة.
- قدم اقتراحات عملية يمكن تنفيذها في المنزل.
- اربط الرد بالأهداف الحالية للطفل كلما أمكن.
- إذا طلب المستخدم خطة أسبوعية أو نصائح إضافية، قدم جدولاً مختصراً.
- إذا لم تتوفر بيانات كافية، اقترح جمع معلومات إضافية بطريقة لطيفة.
- لا تُطل في الحديث أكثر من ثلاث فقرات قصيرة.
- أضف فقرة قصيرة في النهاية بعنوان "اقتراحات سريعة" إذا كانت مناسبة.

رسالة ولي الأمر:
"${message}"`;
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

    if (!message) {
      return res.status(400).json({ error: "يرجى كتابة رسالة للمساعد" });
    }

    await appendAssistantMessage(parentId, {
      id: `parent-${Date.now()}`,
      role: "parent",
      timestamp: new Date().toISOString(),
      content: message,
    });

    const [training, games, assistant, parentProfile] = await Promise.all([
      getDailyTraining(parentId),
      getEducationalGames(parentId),
      getAssistantData(parentId),
      getParentFollowUpData(parentId),
    ]);

    const childName = parentProfile.childName;

    const trainingHighlights = `التقدم العام: ${training.summary.dailyGoalCompletion}%، عدد التمارين: ${training.summary.totalExercises}، أبرز تمرين: ${training.exercises[0]?.title} (التقدم ${training.exercises[0]?.progress}%).`;
    const gamesHighlights = `النقاط الإجمالية: ${games.totalPoints}، التحدي النشط: ${games.games[0]?.weeklyChallenge.goal}، آخر نتيجة: ${games.games[0]?.sessions[0]?.score ?? "لا توجد"}.`;

    const model = getGenerativeModel();
    let reply: string;
    let suggestedActions: string[] = [];
    let usedGemini = false;

    if (model) {
      try {
        const prompt = buildAssistantPrompt({
          message,
          parentId,
          childName,
          trainingHighlights,
          gamesHighlights,
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        reply = text || "لم أتمكن من فهم الطلب، هل يمكن إعادة صياغته؟";
        usedGemini = Boolean(text);
      } catch (error) {
        const fallback = generateFallbackResponse(message, childName);
        reply = fallback.reply;
        suggestedActions = fallback.suggestedActions;
      }
    } else {
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
      usedGemini,
      context: {
        trainingHighlights,
        gamesHighlights,
        conversationLength: assistant.messages.length + 1,
      },
    });
  } catch (error) {
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

