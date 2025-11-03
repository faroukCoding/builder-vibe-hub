import { RequestHandler } from "express";
import OpenAI from "openai";
import "dotenv/config";
import {
  HomeLearningOverviewResponse,
  HomeLearningAssistantMessageRequest,
  HomeLearningAssistantMessageResponse,
  HomeLearningAssistantHistoryMessage,
  HomeLearningAssistantRecommendedGame,
  HomeLearningPronunciationEvaluationRequest,
  HomeLearningPronunciationEvaluationResponse,
  HomeLearningTrainingAnswerRequest,
  HomeLearningTrainingAnswerResponse,
  HomeLearningGameResultRequest,
  HomeLearningGameResultResponse,
} from "@shared/api";

const AI_SYSTEM_PROMPT = `أنت "لغتي" مستشار نطق افتراضي يساعد وليّ أمر الطفل على التعامل مع صعوبات النطق في المنزل.
- استخدم العربية الفصحى المبسطة بنبرة مطمئنة ومحفّزة، وركّز على تقديم حلول عملية يمكن تنفيذها داخل البيت.
- عالج جوانب النطق المختلفة مثل مخارج الحروف، التمييز السمعي، الوعي الفونولوجي، والطلاقة، وقدّم تفسيرات واضحة تساعد وليّ الأمر على فهم السبب.
- ذكّر بضرورة الرجوع إلى أخصائي نطق عند ظهور علامات مقلقة، ولا تقدّم تشخيصاً طبياً أو وعوداً علاجية مؤكدة.
- رتّب الاستجابة في صيغة JSON فقط دون أي نص إضافي وبالهيكل التالي:
  {
    "reply": "شرح تفصيلي يضم خطوات تطبيقية وأمثلة داعمة",
    "simplified": "ملخص سريع في سطرين يوجّه وليّ الأمر",
    "cues": ["تلميحات حول وضع اللسان، الإيقاع، أو الاستفادة من المؤثرات البصرية"],
    "nextActions": ["خطوات وتمارين منزلية واضحة ومقسّمة زمنياً"],
    "personalizedTips": ["نصائح قصيرة موجهة لحالة الطفل"],
    "recommendedGames": [
      {
        "title": "اسم اللعبة",
        "objective": "الهدف العلاجي المرتبط بالصوت أو المهارة",
        "overview": "وصف مختصر يشرح كيفية تنفيذ اللعبة في المنزل",
        "steps": ["خطوة تفصيلية"],
        "materials": ["أدوات بسيطة متاحة في المنزل"],
        "durationMinutes": 5
      }
    ]
  }
- اجعل كل الحقول بالعربية الفصحى وبأسلوب قابل للتنفيذ ومصمم خصيصاً لسياق سؤال وليّ الأمر.
- تأكد من أن الألعاب المقترحة مرتبطة مباشرة بالصعوبة المطروحة وتحتوي هدفاً علاجياً واضحاً وخطوات محددة.`;

let cachedOpenAI: OpenAI | null = null;

const getOpenAIClient = () => {
  const apiKey = (process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "").trim();
  if (!apiKey) {
    console.warn("[HomeLearning] OPENAI_API_KEY is not set. Falling back to canned responses.");
    return null;
  }
  if (!cachedOpenAI) {
    cachedOpenAI = new OpenAI({ apiKey });
  }
  return cachedOpenAI;
};

const CONVERSATION_HISTORY_LIMIT = 10;

const sanitizeHistory = (history?: HomeLearningAssistantHistoryMessage[]) => {
  if (!history?.length) {
    return [] as Array<{ role: "assistant" | "user"; content: string }>;
  }
  const items: Array<{ role: "assistant" | "user"; content: string }> = history
    .slice(-CONVERSATION_HISTORY_LIMIT)
    .map((entry) => ({
      role: entry.role === "assistant" ? "assistant" : "user",
      content: entry.content,
    }));
  return items;
};

const buildUserContent = (message: string, contextTags?: string[]) => {
  if (!contextTags?.length) {
    return message;
  }
  const contextSection = contextTags
    .filter((tag) => Boolean(tag))
    .slice(0, 12)
    .map((tag) => (tag.includes(":") ? tag : `علامة:${tag}`))
    .join("، ");
  return `${message}\n\n# سياق إضافي\n${contextSection}`;
};

const buildAssistantFallback = (
  body: HomeLearningAssistantMessageRequest,
  overrides: Partial<HomeLearningAssistantMessageResponse> = {},
): HomeLearningAssistantMessageResponse => {
  const storedAt = new Date().toISOString();
  const baseResponse: HomeLearningAssistantMessageResponse = {
    conversationId: body.childId ? `conv-${body.childId}` : "conv-temp",
    reply: "ابدأ بجلسة قصيرة لا تتجاوز ثلاث دقائق تركز على الصوت الصعب. قف أنت وطفلك أمام مرآة، ووضّح له حركة اللسان والشفاه ببطء، ثم اطلب منه تقليدك بثقة. بعد كل محاولة ناجحة، عزّزها بعبارة تشجيع وسجّل التقدّم في دفتر صغير.",
    simplifiedReply: "جلسة مرآة لمدة 3 دقائق + تقليد بطيء وتشجيع بعد كل محاولة.",
    voiceEnabled: body.modality !== "text",
    storedAt,
    cues: ["أظهر لطفلك موضع اللسان أمام المرآة", "قلّل السرعة إلى نصف الوتيرة المعتادة", "شجع على أخذ نفس عميق قبل النطق"],
    nextActions: [
      "اختر كلمة واحدة تحتوي الصوت الصعب ورددها مع طفلك خمس مرات ببطء",
      "سجّل المحاولة بواسطة الهاتف واستمعا لها معاً لتحديد التحسّن",
    ],
    personalizedTips: [
      "أثناء التدريب احرص على بيئة هادئة لكي يركّز الطفل على الأصوات.",
      "استخدم مرآة أمامية أو تسجيل فيديو كي يرى طفلك حركة فمه.",
    ],
    recommendedGames: [
      {
        title: "لعبة صائد الأصوات",
        objective: "ترسيخ النطق السليم للصوت المستهدف في كلمات معزولة ثم جمل قصيرة",
        overview: "ضع صوراً أو بطاقات لأشياء تحتوي الصوت الصعب واطلب من طفلك نطقها وجمعها في سلة المكافآت.",
        steps: [
          "حضّر 5 بطاقات لأشياء يعيشها الطفل وتحتوي الصوت المستهدف.",
          "اطلب من الطفل نطق اسم البطاقة مرتين ببطء مع مراقبة حركة لسانه.",
          "بعد النطق الصحيح ضع البطاقة في السلة واحتفلوا بالصوت الصحيح.",
        ],
        materials: ["بطاقات مصورة", "سلة صغيرة"],
        durationMinutes: 8,
      },
    ],
  };
  const merged: HomeLearningAssistantMessageResponse = {
    ...baseResponse,
    ...overrides,
    cues: overrides.cues ?? baseResponse.cues,
    nextActions: overrides.nextActions ?? baseResponse.nextActions,
    personalizedTips: overrides.personalizedTips ?? baseResponse.personalizedTips,
    recommendedGames: overrides.recommendedGames ?? baseResponse.recommendedGames,
  };
  return merged;
};

export const handleGetHomeLearningOverview: RequestHandler = (_req, res) => {
  const response: HomeLearningOverviewResponse = {
    childId: "child-123",
    generatedAt: new Date().toISOString(),
    summary: {
      streakDays: 7,
      totalSessionsThisWeek: 18,
      weeklyImprovementPercent: 12,
      aiFeedbackCount: 34,
      nextPlannedSession: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
    },
    assistant: {
      activeConversationId: "conv-456",
      lastInteractionAt: new Date().toISOString(),
      suggestedFocus: "تمارين حرف الراء مع تباطؤ في النهاية",
      conversationPreview: [
        {
          id: "msg-1",
          role: "assistant",
          timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
          message: "مرحباً أحمد! دعنا نتمرن على نطق حرف الراء اليوم",
          pronunciationScore: 0.86,
        },
        {
          id: "msg-2",
          role: "child",
          timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
          message: "ررر... هل قمت بها بشكل صحيح؟",
          pronunciationScore: 0.74,
        },
      ],
    },
    training: {
      modules: [
        {
          id: "letters-r",
          title: "نطق الحروف المفردة - حرف ر",
          type: "letter",
          difficulty: "easy",
          progress: 65,
          nextReviewAt: new Date(Date.now() + 1000 * 60 * 60 * 7).toISOString(),
          lockedUntilSuccess: true,
        },
        {
          id: "words-sentence",
          title: "كلمات بها حرف الراء",
          type: "word",
          difficulty: "medium",
          progress: 48,
          nextReviewAt: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
          lockedUntilSuccess: true,
        },
        {
          id: "discrimination-s-sh",
          title: "تمييز سمعي بين س و ش",
          type: "discrimination",
          difficulty: "hard",
          progress: 35,
          nextReviewAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
          lockedUntilSuccess: true,
        },
      ],
      currentLevel: 2,
      nextMilestone: "إتقان جمل قصيرة بنطق صحيح لحرف الراء",
    },
    games: {
      weeklyScore: 1075,
      unlockedBadges: ["قاهر الحروف", "بطل المطابقة"],
      highlights: [
        {
          id: "game-audio-match",
          title: "مطابقة الصوت بالصورة",
          accuracy: 0.92,
          lastPlayed: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        {
          id: "game-letter-assembly",
          title: "تركيب الحروف",
          accuracy: 0.84,
          lastPlayed: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        },
      ],
    },
  };

  res.json(response);
};

export const handlePostHomeLearningAssistantMessage: RequestHandler = async (req, res) => {
  const body = req.body as HomeLearningAssistantMessageRequest;
  const sanitizedMessage = body.message?.trim();
  const storedAt = new Date().toISOString();

  if (!sanitizedMessage) {
    const fallback = buildAssistantFallback(body, {
      reply: "للبدء ساعدني بذكر الصوت أو الكلمة التي يواجه طفلك صعوبة في نطقها مع توضيح الموقف الذي تظهر فيه المشكلة، كي أوجّهك بخطوات دقيقة.",
      simplifiedReply: "اذكر الصوت أو الكلمة الصعبة ومتى تظهر المشكلة لنقترح خطة مباشرة.",
      storedAt,
      cues: ["حدد موقع الصوت داخل الكلمة (بداية / وسط / نهاية)", "اذكر إن كان الطفل يستبدل الصوت بآخر"],
      nextActions: ["صف موقفًا حدث مؤخرًا وأزعج الطفل بسبب صعوبة النطق", "اذكر ما إذا كان الطفل يتلقى جلسات علاجية حالياً"],
      personalizedTips: [
        "كلما زادت التفاصيل حول الموقف، أصبح الرد أكثر دقة وملاءمة لطفلك.",
        "اذكر الأعمار أو الظروف الخاصة (مثل التوتر أو التعب) إن وُجدت.",
      ],
      recommendedGames: [
        {
          title: "بطاقات الصوت المفقود",
          objective: "تحديد الصوت المستهدف داخل كلمات مألوفة",
          overview: "اعرض على طفلك بطاقات لكلمات مختلفة واطلب منه تحديد البطاقة التي يظهر فيها الصوت الصعب.",
          steps: [
            "حضّر 6 بطاقات لكلمات يعرفها طفلك.",
            "اجعل الطفل يشير إلى الكلمات التي يسمع فيها الصوت المستهدف.",
            "اطلب منه إعادة الكلمة ببطء مع التركيز على الصوت.",
          ],
          materials: ["بطاقات مطبوعة أو مرسومة"],
          durationMinutes: 6,
        },
      ],
    });
    return res.status(200).json(fallback);
  }

  const client = getOpenAIClient();
  if (!client) {
    const fallback = buildAssistantFallback(body, {
      reply: "سأقترح خطة أساسية إلى حين تفعيل التكامل الكامل مع OpenAI: خصّص دقيقتين لتدريب الصوت الصعب ببطء مع استخدام مرآة، ثم انتقل إلى تكرار الكلمة في جملة قصيرة. دوّن الملاحظات حول الأصوات التي تحسّن أداؤها طفلك.",
      simplifiedReply: "تدريب بطيء أمام مرآة + استعمال الكلمة في جملة قصيرة وتدوين الملاحظات.",
      storedAt,
      personalizedTips: [
        "قسّم التمرين إلى محاولات قصيرة متعددة خلال اليوم بدلاً من جلسة واحدة طويلة.",
        "استخدم مكافأة لفظية ثابتة بعد كل نطق صحيح لتعزيز الثقة.",
      ],
      recommendedGames: [
        {
          title: "رحلة الحروف المخفية",
          objective: "دمج الصوت الصعب داخل جمل بسيطة مع تعزيز الطلاقة",
          overview: "اصنعوا خريطة كنز منزلية حيث يتوجب على الطفل نطق جملة تحتوي الصوت المستهدف قبل الانتقال إلى المحطة التالية.",
          steps: [
            "حددوا 4 محطات داخل المنزل (غرفة، مطبخ، صالون...).",
            "في كل محطة، قدّم جملة قصيرة تحتوي الصوت الصعب واطلب من الطفل تقليدها.",
            "إذا نطق الجملة بسلاسة، انتقلوا إلى المحطة التالية مع تشويق.",
          ],
          materials: ["بطاقات محطات", "ملصقات تشجيعية"],
          durationMinutes: 12,
        },
      ],
    });
    return res.status(200).json(fallback);
  }

  try {
    const historyMessages = sanitizeHistory(body.history);
    const userContent = buildUserContent(sanitizedMessage, body.contextTags);
    const messages = [
      { role: "system" as const, content: AI_SYSTEM_PROMPT },
      ...historyMessages.map((entry) => ({ role: entry.role, content: entry.content })),
      { role: "user" as const, content: userContent },
    ];
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      response_format: { type: "json_object" },
      max_tokens: 700,
      messages: messages as any,
    });

    const rawContent = completion.choices[0]?.message?.content ?? "{}";
    let parsed: {
      reply?: string;
      simplified?: string;
      cues?: string[];
      nextActions?: string[];
      personalizedTips?: string[];
      recommendedGames?: Array<Partial<HomeLearningAssistantRecommendedGame> | string>;
    } = {};

    try {
      parsed = JSON.parse(rawContent);
    } catch {
      parsed = { reply: rawContent };
    }

    const reply = (parsed.reply ?? rawContent ?? sanitizedMessage).trim();
    const simplified = (parsed.simplified ?? reply).trim();
    const cues = Array.isArray(parsed.cues)
      ? parsed.cues
          .map((cue) => (typeof cue === "string" ? cue.trim() : ""))
          .filter((cue) => cue.length > 0)
          .slice(0, 4)
      : [];
    const nextActions = Array.isArray(parsed.nextActions)
      ? parsed.nextActions
          .map((action) => (typeof action === "string" ? action.trim() : ""))
          .filter((action) => action.length > 0)
          .slice(0, 5)
      : [];

    const personalizedTips = Array.isArray(parsed.personalizedTips)
      ? parsed.personalizedTips
          .map((tip) => (typeof tip === "string" ? tip.trim() : ""))
          .filter((tip) => tip.length > 0)
          .slice(0, 5)
      : [];

    const recommendedGames = Array.isArray(parsed.recommendedGames)
      ? parsed.recommendedGames
          .map((raw) => {
            if (!raw) {
              return null;
            }
            if (typeof raw === "string") {
              const trimmed = raw.trim();
              if (!trimmed) {
                return null;
              }
              return {
                title: trimmed,
                objective: "دعم النطق الصحيح للصوت المستهدف",
                overview: trimmed,
                steps: [trimmed],
              } as HomeLearningAssistantRecommendedGame;
            }
            const title = typeof raw.title === "string" ? raw.title.trim() : "نشاط علاجي";
            const objective = typeof raw.objective === "string" ? raw.objective.trim() : "تعزيز مهارة النطق";
            const overview = typeof raw.overview === "string" ? raw.overview.trim() : objective;
            const steps = Array.isArray(raw.steps)
              ? raw.steps
                  .map((step) => (typeof step === "string" ? step.trim() : ""))
                  .filter((step) => step.length > 0)
              : [];
            const materials = Array.isArray(raw.materials)
              ? raw.materials
                  .map((material) => (typeof material === "string" ? material.trim() : ""))
                  .filter((material) => material.length > 0)
              : undefined;
            const durationMinutes =
              typeof raw.durationMinutes === "number" && Number.isFinite(raw.durationMinutes) && raw.durationMinutes > 0
                ? Math.round(raw.durationMinutes)
                : undefined;

            return {
              title: title || "نشاط علاجي",
              objective,
              overview,
              steps: steps.length > 0 ? steps.slice(0, 6) : [overview],
              materials,
              durationMinutes,
            } as HomeLearningAssistantRecommendedGame;
          })
          .filter((game): game is HomeLearningAssistantRecommendedGame => Boolean(game))
          .slice(0, 3)
      : [];

    const response: HomeLearningAssistantMessageResponse = {
      conversationId: body.childId ? `conv-${body.childId}` : "conv-temp",
      reply,
      simplifiedReply: simplified.length > 0 ? simplified : reply,
      voiceEnabled: body.modality !== "text",
      storedAt,
      cues,
      nextActions,
      personalizedTips,
      recommendedGames,
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error("OpenAI assistant error", error);
    const fallback = buildAssistantFallback(body, {
      reply: "حدث خلل لحظي في خدمة الذكاء الاصطناعي، لذلك إليك خطة بديلة: جزّئ التمرين إلى ثلاث محاولات بطيئة أمام المرآة، ثم جرّب إدخال الصوت في كلمة، وأخيراً سجّل تقدّم طفلك مع وضع تاريخ لكل جلسة.",
      simplifiedReply: "3 محاولات بطيئة أمام المرآة + كلمة تطبيق + تدوين التقدّم.",
      storedAt,
      personalizedTips: [
        "حافظ على نبرة صوت مشجعة وابتعد عن التصحيح المتكرر أمام الآخرين.",
        "قدّم مكافأة بسيطة بعد إنهاء الجلسة لدعم الدافعية.",
      ],
      recommendedGames: [
        {
          title: "ساعي البريد المتلعثم",
          objective: "زيادة الطلاقة وتقليل التلعثم عبر تكرار جمل قصيرة",
          overview: "يتظاهر الطفل بأنه ساعي بريد يسلّم بطاقات تحمل كلمات بالصوت الصعب وينطق الجملة كاملة قبل التسليم.",
          steps: [
            "حضّر 4 بطاقات تشتمل على كلمات بالصوت المستهدف.",
            "اطلب من الطفل قراءة الكلمة داخل جملة قصيرة وتسليم البطاقة بعد النطق الصحيح.",
            "كرّروا الجولة مع مؤقت بسيط لزيادة السرعة تدريجياً دون ضغط.",
          ],
          materials: ["بطاقات", "مغلفات صغيرة"],
          durationMinutes: 10,
        },
      ],
    });
    return res.status(200).json(fallback);
  }
};

export const handlePostHomeLearningPronunciation: RequestHandler = (req, res) => {
  const body = req.body as HomeLearningPronunciationEvaluationRequest;

  const response: HomeLearningPronunciationEvaluationResponse = {
    attemptId: body.attemptId,
    overallScore: 0.82,
    metrics: {
      accuracy: 0.85,
      clarity: 0.78,
      fluency: 0.8,
      pacing: 0.86,
    },
    phonemeBreakdown: body.expectedPhonemes.map((phoneme) => ({
      phoneme,
      score: phoneme === "ر" ? 0.9 : 0.75,
      tips:
        phoneme === "ر"
          ? ["احرص على اهتزاز طرف اللسان"]
          : ["استمع جيداً للنموذج ثم أعد المحاولة"],
    })),
    passed: true,
    requiredRetry: false,
    feedback: "نطق ممتاز! تابع على نفس الوتيرة، وحاول زيادة السرعة تدريجياً.",
  };

  res.json(response);
};

export const handlePostHomeLearningTrainingAnswer: RequestHandler = (req, res) => {
  const body = req.body as HomeLearningTrainingAnswerRequest;

  const response: HomeLearningTrainingAnswerResponse = {
    moduleId: body.moduleId,
    isCorrect: body.isCorrect,
    nextStep: body.isCorrect ? "advance" : "repeat",
    unlocksNextLevel: body.isCorrect && body.retryCount < 2,
    encouragementMessage: body.isCorrect
      ? "أحسنت! تم فتح التمرين التالي بعد هذا الإنجاز."
      : "لا بأس! دعنا نعيد التمرين مع بعض التلميحات لتحسين النطق.",
    updatedProgress: body.isCorrect ? 0.75 : 0.62,
  };

  res.json(response);
};

export const handlePostHomeLearningGameResult: RequestHandler = (req, res) => {
  const body = req.body as HomeLearningGameResultRequest;

  const response: HomeLearningGameResultResponse = {
    gameId: body.gameId,
    newWeeklyScore: 1200,
    badgeUnlocked: body.score > 400 ? "مستمع محترف" : undefined,
    leaderboardPosition: body.score > 400 ? 2 : 5,
    message:
      body.score > 400
        ? "إنجاز رائع! تم فتح تحدٍ جديد للنطق السريع."
        : "تقدم جيد، حاول مرة أخرى لتحسين دقة النطق واحصل على نقاط إضافية.",
  };

  res.status(201).json(response);
};
