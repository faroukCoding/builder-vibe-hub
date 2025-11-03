/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface DailyTrainingExerciseSummary {
  id: string;
  title: string;
  stage: string;
  focusArea: string;
  difficulty: "easy" | "medium" | "hard";
  progress: number;
  attempts: number;
  streak: number;
  scheduledAt: string;
  metrics: {
    accuracy: number;
    clarity: number;
    fluency: number;
    comprehension: number;
  };
  goal: string;
  aiSummary: string;
  aiNextSteps: string[];
  reminders: string[];
  resources: Array<{
    id: string;
    type: "audio" | "video" | "guide" | "worksheet" | "card";
    label: string;
    url: string;
    description: string;
  }>;
}

export interface DailyTrainingSummaryResponse {
  parentId: string;
  retrievedAt: string;
  summary: {
    parentId: string;
    date: string;
    dailyGoalCompletion: number;
    completedExercises: number;
    totalExercises: number;
    weeklyCompletionRate: number;
    streakDays: number;
    streakBest: number;
    aiMotivation: string;
    reminders: Array<{
      id: string;
      time: string;
      message: string;
      channel: "push" | "email" | "sms";
    }>;
  };
  exercises: DailyTrainingExerciseSummary[];
}

export interface DailyTrainingDetailResponse {
  parentId: string;
  retrievedAt: string;
  exercise: {
    id: string;
    title: string;
    stage: string;
    focusArea: string;
    difficulty: "easy" | "medium" | "hard";
    targetSound: string;
    goal: string;
    instructions: string[];
    successCriteria: string[];
    reinforcementTips: string[];
    aiSummary: string;
    aiHighlights: string[];
    aiNextSteps: string[];
    recommendedNextExercises: string[];
    progress: number;
    attempts: number;
    streak: number;
    lastUpdated: string;
    scheduledAt: string;
    weeklyTarget: number;
    metrics: {
      accuracy: number;
      clarity: number;
      fluency: number;
      comprehension: number;
    };
    reminders: string[];
    resources: Array<{
      id: string;
      type: "audio" | "video" | "guide" | "worksheet" | "card";
      label: string;
      url: string;
      description: string;
    }>;
    evaluationHistory: Array<{
      id: string;
      date: string;
      notes: string;
      rating: number;
      metrics: {
        accuracy: number;
        clarity: number;
        fluency: number;
        comprehension: number;
      };
      aiFeedback: string;
      sharedWith: string[];
      media?: {
        id: string;
        type: "audio" | "video";
        filename: string;
        originalName: string;
        url: string;
      };
    }>;
    milestones: Array<{
      id: string;
      title: string;
      achieved: boolean;
      achievedAt: string | null;
      description: string;
    }>;
  };
  relatedExercises: string[];
}

export interface UpdateDailyTrainingProgressRequest {
  progressDelta?: number;
  accuracy?: number;
  clarity?: number;
  fluency?: number;
  comprehension?: number;
  notes?: string;
  sharingTargets?: string[];
}

export interface EducationalGamesResponse {
  parentId: string;
  retrievedAt: string;
  totalPoints: number;
  activeBadges: string[];
  streakWeeks: number;
  recommendations: string[];
  games: Array<{
    id: string;
    title: string;
    description: string;
    objective: string;
    ageRange: string;
    difficulty: "easy" | "medium" | "hard";
    skills: string[];
    points: number;
    badgeProgress: number;
    playCount: number;
    bestScore: number;
    lastPlayed: string | null;
    icon: string;
    durationMinutes: number;
    weeklyChallenge: {
      goal: string;
      targetSessions: number;
      completedSessions: number;
      reward: string;
      expiresAt: string;
    };
    leaderboard: Array<{
      childName: string;
      score: number;
      trend: "up" | "down" | "steady";
    }>;
    sessions: Array<{
      id: string;
      date: string;
      durationMinutes: number;
      score: number;
      accuracy: number;
      notes: string;
      boosterUnlocked: boolean;
    }>;
  }>;
}

export interface RecordGameSessionRequest {
  score: number;
  accuracy: number;
  notes?: string;
  durationMinutes?: number;
}

export interface AssistantHistoryResponse {
  parentId: string;
  count: number;
  lastTipTimestamp: string | null;
  messages: Array<{
    id: string;
    role: "parent" | "assistant";
    timestamp: string;
    content: string;
    suggestedActions?: string[];
    relatedExerciseIds?: string[];
    relatedGameIds?: string[];
  }>;
  savedTips: Array<{
    id: string;
    title: string;
    content: string;
    category: string;
  }>;
}

export interface AssistantChatRequest {
  parentId?: string;
  message: string;
}

export interface AssistantChatResponse {
  message: string;
  reply: string;
  suggestedActions?: string[];
  usedOpenAI: boolean;
  context: {
    trainingHighlights: string;
    gamesHighlights: string;
    conversationLength: number;
  };
}

export interface AssistantTipResponse {
  message: string;
  tip: {
    id: string;
    title: string;
    content: string;
    category: string;
    deliveredAt: string;
  };
}

export interface HomeLearningOverviewResponse {
  childId: string;
  generatedAt: string;
  summary: {
    streakDays: number;
    totalSessionsThisWeek: number;
    weeklyImprovementPercent: number;
    aiFeedbackCount: number;
    nextPlannedSession: string;
  };
  assistant: {
    activeConversationId: string;
    lastInteractionAt: string | null;
    suggestedFocus: string;
    conversationPreview: Array<{
      id: string;
      role: "assistant" | "child" | "parent";
      timestamp: string;
      message: string;
      pronunciationScore?: number;
    }>;
  };
  training: {
    modules: Array<{
      id: string;
      title: string;
      type: "letter" | "word" | "sentence" | "discrimination";
      difficulty: "easy" | "medium" | "hard";
      progress: number;
      nextReviewAt: string;
      lockedUntilSuccess: boolean;
    }>;
    currentLevel: number;
    nextMilestone: string;
  };
  games: {
    weeklyScore: number;
    unlockedBadges: string[];
    highlights: Array<{
      id: string;
      title: string;
      accuracy: number;
      lastPlayed: string;
    }>;
  };
}

export interface HomeLearningAssistantHistoryMessage {
  role: "assistant" | "child" | "parent";
  content: string;
  createdAt?: string;
  tone?: string;
}

export interface HomeLearningAssistantMessageRequest {
  childId: string;
  sender: "child" | "parent";
  modality: "text" | "audio";
  message?: string;
  audioSampleUrl?: string;
  targetSound?: string;
  contextTags?: string[];
  history?: HomeLearningAssistantHistoryMessage[];
}

export interface HomeLearningAssistantRecommendedGame {
  title: string;
  objective: string;
  overview: string;
  steps: string[];
  materials?: string[];
  durationMinutes?: number;
}

export interface HomeLearningAssistantMessageResponse {
  conversationId: string;
  reply: string;
  simplifiedReply: string;
  voiceEnabled: boolean;
  storedAt: string;
  cues: string[];
  nextActions: string[];
  personalizedTips: string[];
  recommendedGames: HomeLearningAssistantRecommendedGame[];
}

export interface HomeLearningPronunciationEvaluationRequest {
  childId: string;
  exerciseId: string;
  attemptId: string;
  expectedPhonemes: string[];
  audioSampleUrl?: string;
  transcript?: string;
}

export interface HomeLearningPronunciationEvaluationResponse {
  attemptId: string;
  overallScore: number;
  metrics: {
    accuracy: number;
    clarity: number;
    fluency: number;
    pacing: number;
  };
  phonemeBreakdown: Array<{
    phoneme: string;
    score: number;
    tips: string[];
  }>;
  passed: boolean;
  requiredRetry: boolean;
  feedback: string;
}

export interface HomeLearningTrainingAnswerRequest {
  childId: string;
  moduleId: string;
  answer: string;
  isCorrect: boolean;
  retryCount: number;
  responseTimeMs?: number;
}

export interface HomeLearningTrainingAnswerResponse {
  moduleId: string;
  isCorrect: boolean;
  nextStep: "repeat" | "advance";
  unlocksNextLevel: boolean;
  encouragementMessage: string;
  updatedProgress: number;
}

export interface HomeLearningGameResultRequest {
  childId: string;
  gameId: string;
  mode: "audio-matching" | "letter-assembly" | "rapid-pronunciation";
  score: number;
  accuracy: number;
  timeRemainingSeconds: number;
}

export interface HomeLearningGameResultResponse {
  gameId: string;
  newWeeklyScore: number;
  badgeUnlocked?: string;
  leaderboardPosition?: number;
  message: string;
}
