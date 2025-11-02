import { RequestHandler } from "express";
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

export const handlePostHomeLearningAssistantMessage: RequestHandler = (req, res) => {
  const body = req.body as HomeLearningAssistantMessageRequest;

  const response: HomeLearningAssistantMessageResponse = {
    conversationId: body.childId ? `conv-${body.childId}` : "conv-temp",
    reply: "رائع! حاول أن تبتسم قليلاً أثناء النطق لتحسين الوضوح.",
    simplifiedReply: "أحسنت! قل ررر مع ابتسامة 😀",
    voiceEnabled: body.modality !== "text",
    storedAt: new Date().toISOString(),
    cues: ["خفض السرعة", "ركز على اهتزاز اللسان"],
    nextActions: [
      "جرب تمرين تمييز س/ش",
      "سجّل نطق كلمة \"قطار\" وأعد المحاولة إذا لزم الأمر",
    ],
  };

  res.status(201).json(response);
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
