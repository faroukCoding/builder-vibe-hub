import { RequestHandler } from "express";
import OpenAI from "openai";
import {
  HomeLearningOverviewResponse,
  HomeLearningAssistantMessageRequest,
  HomeLearningAssistantMessageResponse,
  HomeLearningPronunciationEvaluationRequest,
  HomeLearningPronunciationEvaluationResponse,
  HomeLearningTrainingAnswerRequest,
  HomeLearningTrainingAnswerResponse,
  HomeLearningGameResultRequest,
  HomeLearningGameResultResponse,
} from "@shared/api";

const AI_SYSTEM_PROMPT = `أنت "نور" مساعد نطق عربي للأطفال من عمر 5 إلى 10 سنوات.
- استخدم اللغة العربية الفصحى المبسطة مع الحفاظ على نبرة مشجعة وودية.
- قدّم نصائح دقيقة حول مخارج الحروف والتنفس وتحريك اللسان عند الحاجة.
- شجّع الطفل على إعادة المحاولة واذكر خطوات صغيرة واضحة.
- لا تتحدث عن السياسات أو الموضوعات غير المناسبة للأطفال.
- دائمًا أعد الرد بصيغة JSON بالهيكل التالي دون أي نص آخر:
  {
    "reply": "النص الأساسي المفصل",
    "simplified": "نسخة مبسطة وجملة قصيرة",
    "cues": ["تلميحات قصيرة"],
    "nextActions": ["أنشطة مقترحة" ]
  }
- اجعل جميع القيم عربية مشجعة ومحفزة على التعلم.`;

let cachedOpenAI: OpenAI | null = null;

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!cachedOpenAI) {
    cachedOpenAI = new OpenAI({ apiKey });
  }
  return cachedOpenAI;
};

const buildAssistantFallback = (
  body: HomeLearningAssistantMessageRequest,
  overrides: Partial<HomeLearningAssistantMessageResponse> = {},
): HomeLearningAssistantMessageResponse => {
  const storedAt = new Date().toISOString();
  return {
    conversationId: body.childId ? `conv-${body.childId}` : "conv-temp",
    reply: "رائع! حاول أن تبتسم قليلاً أثناء النطق لتحسين الوضوح.",
    simplifiedReply: "أحسنت! قل ررر مع ابتسامة 😀",
    voiceEnabled: body.modality !== "text",
    storedAt,
    cues: ["خفض السرعة أثناء النطق", "ركز على اهتزاز اللسان بلطف"],
    nextActions: [
      "أعد الكلمة ببطء ثم بسرعة معتدلة",
      "سجل صوتك واستمع له مع وليّ أمرك",
    ],
    ...overrides,
  };
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
      reply: "أخبرني ما الحرف أو الكلمة التي تريد أن نتدرّب عليها اليوم كي أساعدك فورًا!",
      simplifiedReply: "اخبرني بالكلمة أو الحرف لنبدأ التدريب معًا.",
      storedAt,
      cues: ["اختر حرفًا تحبه", "فكر بكلمة صعبة عليك"],
      nextActions: ["اطلب تدريبًا لحرف محدد", "اسأل عن لعبة تساعدك على النطق"],
    });
    return res.status(200).json(fallback);
  }

  const client = getOpenAIClient();
  if (!client) {
    const fallback = buildAssistantFallback(body, {
      reply: "سأشاركك تدريبًا بسيطًا الآن! (لتفعيل الذكاء الاصطناعي الكامل تأكد من إعداد المفتاح السري)، كرر الكلمة ببطء ثلاث مرات ثم بسرعة معتدلة.",
      simplifiedReply: "كرّر الكلمة ببطء ثم بسرعة، ويمكنك تسجيل صوتك أيضاً.",
      storedAt,
    });
    return res.status(200).json(fallback);
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      response_format: { type: "json_object" },
      max_tokens: 600,
      messages: [
        { role: "system", content: AI_SYSTEM_PROMPT },
        { role: "user", content: sanitizedMessage },
      ],
    });

    const rawContent = completion.choices[0]?.message?.content ?? "{}";
    let parsed: {
      reply?: string;
      simplified?: string;
      cues?: string[];
      nextActions?: string[];
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
          .slice(0, 4)
      : [];

    const response: HomeLearningAssistantMessageResponse = {
      conversationId: body.childId ? `conv-${body.childId}` : "conv-temp",
      reply,
      simplifiedReply: simplified.length > 0 ? simplified : reply,
      voiceEnabled: body.modality !== "text",
      storedAt,
      cues,
      nextActions,
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error("OpenAI assistant error", error);
    const fallback = buildAssistantFallback(body, {
      reply: "واجهنا مشكلة بسيطة في الاتصال بالذكاء الاصطناعي. لنواصل التدريب يدويًا: كرر الحرف ببطء مع ابتسامة لطيفة.",
      simplifiedReply: "كرر الحرف بهدوء ثم أسرع قليلاً.",
      storedAt,
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
