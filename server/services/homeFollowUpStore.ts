import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "server", "data");
const DATA_FILE = path.join(DATA_DIR, "home-follow-up.json");

type DifficultyLevel = "easy" | "medium" | "hard";
type MediaType = "audio" | "video";

export interface DailyTrainingMilestone {
  id: string;
  title: string;
  achieved: boolean;
  achievedAt: string | null;
  description: string;
}

export interface DailyTrainingResource {
  id: string;
  type: MediaType | "guide" | "worksheet" | "card";
  label: string;
  url: string;
  description: string;
}

export interface DailyTrainingEvaluation {
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
    type: MediaType;
    filename: string;
    originalName: string;
    url: string;
  };
}

export interface DailyTrainingExercise {
  id: string;
  title: string;
  stage: string;
  focusArea: string;
  difficulty: DifficultyLevel;
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
  resources: DailyTrainingResource[];
  evaluationHistory: DailyTrainingEvaluation[];
  milestones: DailyTrainingMilestone[];
}

export interface DailyTrainingSummary {
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
}

export interface DailyTrainingData {
  summary: DailyTrainingSummary;
  exercises: DailyTrainingExercise[];
}

export interface EducationalGameSession {
  id: string;
  date: string;
  durationMinutes: number;
  score: number;
  accuracy: number;
  notes: string;
  boosterUnlocked: boolean;
}

export interface EducationalGame {
  id: string;
  title: string;
  description: string;
  objective: string;
  ageRange: string;
  difficulty: DifficultyLevel;
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
  sessions: EducationalGameSession[];
}

export interface EducationalGamesData {
  totalPoints: number;
  activeBadges: string[];
  streakWeeks: number;
  recommendations: string[];
  games: EducationalGame[];
}

export interface AssistantMessage {
  id: string;
  role: "parent" | "assistant";
  timestamp: string;
  content: string;
  suggestedActions?: string[];
  relatedExerciseIds?: string[];
  relatedGameIds?: string[];
}

export interface AssistantData {
  lastTipTimestamp: string | null;
  messages: AssistantMessage[];
  savedTips: Array<{
    id: string;
    title: string;
    content: string;
    category: string;
  }>;
}

export interface ParentFollowUpData {
  parentId: string;
  childName: string;
  dailyTraining: DailyTrainingData;
  educationalGames: EducationalGamesData;
  aiAssistant: AssistantData;
}

interface HomeFollowUpDataFile {
  parents: Record<string, ParentFollowUpData>;
}

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    const seedData: HomeFollowUpDataFile = {
      parents: {},
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(seedData, null, 2), "utf-8");
  }
}

async function readData(): Promise<HomeFollowUpDataFile> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as HomeFollowUpDataFile;
}

async function writeData(payload: HomeFollowUpDataFile) {
  await fs.writeFile(DATA_FILE, JSON.stringify(payload, null, 2), "utf-8");
}

function createDefaultDailyTrainingExercises(): DailyTrainingExercise[] {
  const now = new Date();
  const iso = (daysAgo: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
  };

  return [
    {
      id: "letters-r-sound",
      title: "نطق حرف الراء",
      stage: "المرحلة 1: الحروف المفردة",
      focusArea: "تحسين حركة اللسان والارتداد الصحيح",
      difficulty: "medium",
      targetSound: "ر",
      goal: "الوصول إلى وضوح 85% في نطق حرف الراء",
      instructions: [
        "ابدأ بسماع التسجيل النموذجي ثم اطلب من الطفل المحاكاة",
        "شجع الطفل على لمس طرف اللسان بسقف الحنك قبل النطق",
        "كرر المقطع (را، ري، رو) خمس مرات مع متابعة التنفس",
      ],
      successCriteria: [
        "وضوح صوت الراء في 4 من أصل 5 محاولات",
        "قدرة الطفل على الانتقال بين الحركات دون توقف",
        "الحفاظ على سرعة نطق طبيعية",
      ],
      reinforcementTips: [
        "استخدم المرآة ليلاحظ الطفل حركة اللسان",
        "قدم ملصق نجمة عند كل تحسن بنسبة 10%",
        "اختم بتمرين ترفيهي بسيط لترسيخ التعلم",
      ],
      aiSummary:
        "الأداء يتحسن بثبات. يحتاج أحمد إلى المزيد من التركيز على حركة اللسان أثناء الحركات الساكنة.",
      aiHighlights: [
        "تحسن ملحوظ في وضوح الصوت بنسبة 12% مقارنة بالأسبوع الماضي",
        "إيقاع النطق أصبح أكثر ثباتًا في نهاية الجلسة",
      ],
      aiNextSteps: [
        "التركيز على المقاطع المركبة (را، ري، رو) خلال اليومين المقبلين",
        "دمج التمرين مع لعبة مطابقة الصوت لتعزيز التمييز السمعي",
      ],
      recommendedNextExercises: ["syllables-ra-series", "words-sun"],
      progress: 68,
      attempts: 5,
      streak: 3,
      lastUpdated: iso(0),
      scheduledAt: "2025-11-02T17:00:00.000Z",
      weeklyTarget: 5,
      metrics: {
        accuracy: 72,
        clarity: 70,
        fluency: 64,
        comprehension: 80,
      },
      reminders: [
        "ذكر الطفل بالجلوس مستقيمًا قبل النطق",
        "استخدم كوب ماء للتدريب على حركة اللسان",
      ],
      resources: [
        {
          id: "audio-r",
          type: "audio",
          label: "نموذج نطق حرف الراء",
          url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_caf1cc302c.mp3?filename=pronounce-r.mp3",
          description: "تسجيل قصير يوضح النطق الصحيح لحرف الراء",
        },
        {
          id: "guide-r",
          type: "guide",
          label: "دليل حركة اللسان",
          url: "https://storage.googleapis.com/public-assets-ortho/guide-tongue-r.pdf",
          description: "خطوات مرئية لحركة اللسان أثناء نطق حرف الراء",
        },
      ],
      evaluationHistory: [
        {
          id: "eval-r-1",
          date: iso(1),
          notes: "وضوح جيد ولكن حاجه للتكرار البطيء",
          rating: 4,
          metrics: {
            accuracy: 70,
            clarity: 68,
            fluency: 60,
            comprehension: 82,
          },
          aiFeedback:
            "حافظ على تقسيم التمرين إلى مقاطع قصيرة مع تعزيز إيجابي في كل مرة.",
          sharedWith: ["أ. سارة الأخصائية"],
          media: {
            id: "media-r-1",
            type: "audio",
            filename: "parent-1-r-2025-11-01.mp3",
            originalName: "تسجيل أحمد.mp3",
            url: "https://storage.googleapis.com/public-assets-ortho/samples/ahmed-r-session.mp3",
          },
        },
      ],
      milestones: [
        {
          id: "milestone-r-70",
          title: "وضوح 70%",
          achieved: true,
          achievedAt: iso(3),
          description: "تجاوز أحمد نسبة وضوح 70% في نطق حرف الراء",
        },
        {
          id: "milestone-r-85",
          title: "وضوح 85%",
          achieved: false,
          achievedAt: null,
          description: "الهدف القادم: الوصول إلى 85% وضوح",
        },
      ],
    },
    {
      id: "syllables-ra-series",
      title: "تدريب المقاطع: را - ري - رو",
      stage: "المرحلة 2: المقاطع",
      focusArea: "الانتقال بين الحركات",
      difficulty: "medium",
      targetSound: "را / ري / رو",
      goal: "تنفيذ 4 جولات ناجحة بالمقاطع دون توقف",
      instructions: [
        "استمع للنموذج ثم كرر المقاطع بالتسلسل",
        "استخدم بطاقات مصورة لكل مقطع",
        "قم بزيادة السرعة تدريجيًا في الجولة الرابعة",
      ],
      successCriteria: [
        "القدرة على النطق دون تغيير في الصوت",
        "عدم التوقف بين المقاطع",
        "التزامن بين النطق والتنفس",
      ],
      reinforcementTips: [
        "استخدام مؤقت بصري لتشجيع سرعة مناسبة",
        "منح نقطة مكافأة عن كل جولة متقنة",
      ],
      aiSummary:
        "أحمد يلتزم بالتسلسل لكن يحتاج دعمًا إضافيًا للحركة القصيرة (ري).",
      aiHighlights: [
        "تقدم في سرعة النطق بنسبة 8%",
        "جولة ثالثة ممتازة بوضوح عالي",
      ],
      aiNextSteps: [
        "دمج التمرين مع لعبة التحدي السريع",
        "تكرار المقاطع مع كلمات تبدأ بنفس الصوت",
      ],
      recommendedNextExercises: ["words-sun", "sentence-school"],
      progress: 54,
      attempts: 3,
      streak: 2,
      lastUpdated: iso(1),
      scheduledAt: "2025-11-02T17:30:00.000Z",
      weeklyTarget: 4,
      metrics: {
        accuracy: 62,
        clarity: 58,
        fluency: 55,
        comprehension: 78,
      },
      reminders: [
        "ابدأ بالمقطع الأسهل لتعزيز الثقة",
        "استخدم عداد النجوم لمتابعة التقدم",
      ],
      resources: [
        {
          id: "video-syllable",
          type: "video",
          label: "شرح المقاطع",
          url: "https://www.youtube.com/embed/M3AnL0fV3XU",
          description: "فيديو توضيحي قصير حول المقاطع المفتوحة",
        },
        {
          id: "card-syllable",
          type: "card",
          label: "بطاقات المقاطع",
          url: "https://storage.googleapis.com/public-assets-ortho/cards/syllables-ra.pdf",
          description: "بطاقات قابلة للطباعة للمقاطع",
        },
      ],
      evaluationHistory: [
        {
          id: "eval-syllable-1",
          date: iso(2),
          notes: "سرعة جيدة لكن تحتاج إلى وضوح أعلى",
          rating: 3,
          metrics: {
            accuracy: 60,
            clarity: 55,
            fluency: 50,
            comprehension: 76,
          },
          aiFeedback:
            "استخدم التصفيق لمساعدة أحمد على الحفاظ على الإيقاع الصحيح",
          sharedWith: [],
        },
      ],
      milestones: [
        {
          id: "milestone-syllable-3",
          title: "إتمام 3 جولات متتالية",
          achieved: true,
          achievedAt: iso(4),
          description: "أكمل أحمد ثلاث جولات كاملة",
        },
        {
          id: "milestone-syllable-speed",
          title: "سرعة 90 ثانية",
          achieved: false,
          achievedAt: null,
          description: "تنفيذ 4 جولات في أقل من 90 ثانية",
        },
      ],
    },
    {
      id: "words-sun",
      title: "تمييز الكلمات القصيرة",
      stage: "المرحلة 3: الكلمات",
      focusArea: "التمييز السمعي",
      difficulty: "easy",
      targetSound: "س / ش",
      goal: "اختيار الصورة الصحيحة في 4 من أصل 5 محاولات",
      instructions: [
        "استمع للكلمة من التطبيق",
        "اختر الصورة المطابقة",
        "فسر سبب الاختيار لضمان الفهم",
      ],
      successCriteria: [
        "تمييز دقيق بين س و ش",
        "تفسير صحيح للفرق في الصوت",
      ],
      reinforcementTips: [
        "استخدام ملصقات تفاعلية",
        "إضافة مكافأة رقمية عند النجاح الكامل",
      ],
      aiSummary: "أداء ممتاز في التمييز، جاهز للانتقال إلى كلمات أطول.",
      aiHighlights: [
        "دقة 90% خلال آخر جلستين",
        "سرعة استجابة في 4 ثوانٍ",
      ],
      aiNextSteps: [
        "إضافة جمل تحتوي على الكلمات المميزة",
        "مشاركة التقدم مع الأخصائي",
      ],
      recommendedNextExercises: ["sentence-school"],
      progress: 82,
      attempts: 6,
      streak: 5,
      lastUpdated: iso(0),
      scheduledAt: "2025-11-02T18:15:00.000Z",
      weeklyTarget: 3,
      metrics: {
        accuracy: 90,
        clarity: 88,
        fluency: 86,
        comprehension: 92,
      },
      reminders: [
        "غير ترتيب الصور في كل محاولة",
        "استخدم أصوات الخلفية الهادئة",
      ],
      resources: [
        {
          id: "audio-words",
          type: "audio",
          label: "كلمات التمييز",
          url: "https://cdn.pixabay.com/download/audio/2022/04/05/audio_2e5e725f26.mp3?filename=kids-words.mp3",
          description: "ملف صوتي للكلمات المستخدمة في التمرين",
        },
        {
          id: "worksheet-words",
          type: "worksheet",
          label: "ورقة عمل مطابقة",
          url: "https://storage.googleapis.com/public-assets-ortho/worksheets/s-sheen.pdf",
          description: "تمارين إضافية للطباعة",
        },
      ],
      evaluationHistory: [
        {
          id: "eval-words-1",
          date: iso(5),
          notes: "تميز رائع، نقترح الانتقال للمرحلة التالية",
          rating: 5,
          metrics: {
            accuracy: 92,
            clarity: 90,
            fluency: 88,
            comprehension: 95,
          },
          aiFeedback:
            "شجع أحمد على وصف الصور لدمج اللغة التعبيرية",
          sharedWith: ["أ. سارة الأخصائية"],
        },
      ],
      milestones: [
        {
          id: "milestone-words-5",
          title: "5 جلسات ناجحة",
          achieved: true,
          achievedAt: iso(2),
          description: "أكمل أحمد خمس جلسات بنجاح",
        },
        {
          id: "milestone-words-speed",
          title: "سرعة استجابة أقل من 3 ثوانٍ",
          achieved: false,
          achievedAt: null,
          description: "تحقيق سرعة استجابة أقل من 3 ثوانٍ",
        },
      ],
    },
    {
      id: "sentence-school",
      title: "جمل قصيرة: أنا أحب المدرسة",
      stage: "المرحلة 4: الجمل",
      focusArea: "التعبير الكامل",
      difficulty: "medium",
      targetSound: "تركيب الجملة",
      goal: "بناء الجملة مع نبرة صحيحة",
      instructions: [
        "استمع للجملة النموذجية",
        "كرر الجملة مع تعبير وجهي",
        "استخدم بطاقات لمطابقة الكلمات",
      ],
      successCriteria: [
        "إعادة الجملة دون أخطاء",
        "استخدام نبرة مناسبة",
      ],
      reinforcementTips: [
        "استخدام لعبة الدمى لتمثيل الجمل",
        "تشجيع الطفل على ابتكار جملة مشابهة",
      ],
      aiSummary:
        "أحمد يكرر الجملة بثقة لكنه يحتاج تحسين في النبرة",
      aiHighlights: [
        "قدرة على بناء الجملة دون أخطاء",
        "زيادة في التعبير اللفظي",
      ],
      aiNextSteps: [
        "إضافة جمل جديدة مشابهة",
        "تسجيل فيديو قصير لعرض التقدم",
      ],
      recommendedNextExercises: ["listening-comprehension"],
      progress: 48,
      attempts: 2,
      streak: 1,
      lastUpdated: iso(3),
      scheduledAt: "2025-11-03T17:45:00.000Z",
      weeklyTarget: 3,
      metrics: {
        accuracy: 58,
        clarity: 62,
        fluency: 55,
        comprehension: 74,
      },
      reminders: [
        "ركز على نبرة النهاية",
        "شجع الطفل على النظر إلى المتحدث",
      ],
      resources: [
        {
          id: "video-sentence",
          type: "video",
          label: "تمثيل الجملة",
          url: "https://www.youtube.com/embed/8kV9m2n7xPo",
          description: "فيديو قصير لتدريب الجملة مع تعبير",
        },
      ],
      evaluationHistory: [],
      milestones: [
        {
          id: "milestone-sentence-first",
          title: "أول جملة كاملة",
          achieved: true,
          achievedAt: iso(6),
          description: "أكمل أحمد جملة كاملة",
        },
        {
          id: "milestone-sentence-tone",
          title: "نبرة طبيعية",
          achieved: false,
          achievedAt: null,
          description: "الوصول إلى نبرة طبيعية في 3 محاولات",
        },
      ],
    },
    {
      id: "listening-comprehension",
      title: "الفهم السمعي: اختر الصورة الصحيحة",
      stage: "المرحلة 5: الفهم السمعي",
      focusArea: "التمييز السمعي",
      difficulty: "hard",
      targetSound: "مزيج الأصوات",
      goal: "تحقيق 80% دقة في اختيار الصور",
      instructions: [
        "استمع للكلمة",
        "اختر الصورة المطابقة",
        "فسر السبب",
      ],
      successCriteria: [
        "اختيار صحيح في 4 من أصل 5",
        "تفسير واضح للسبب",
      ],
      reinforcementTips: [
        "استخدم لوحة نقاط",
        "اجعلها مسابقة صغيرة",
      ],
      aiSummary:
        "أحمد يظهر تميزًا في الأصوات المفردة، يحتاج دعمًا في الأصوات المركبة.",
      aiHighlights: [
        "تحسن 10% في الدقة",
        "حماس عالٍ أثناء اللعب",
      ],
      aiNextSteps: [
        "دمج التمرين مع لعبة مطابقة الصورة",
        "استخدام سماعات لإزالة التشويش",
      ],
      recommendedNextExercises: [],
      progress: 36,
      attempts: 1,
      streak: 0,
      lastUpdated: iso(7),
      scheduledAt: "2025-11-04T18:30:00.000Z",
      weeklyTarget: 2,
      metrics: {
        accuracy: 48,
        clarity: 60,
        fluency: 52,
        comprehension: 58,
      },
      reminders: [
        "هيئ البيئة بدون تشويش",
        "استخدم بطاقات كبيرة وواضحة",
      ],
      resources: [
        {
          id: "game-sound-match",
          type: "card",
          label: "لعبة مطابقة الصوت",
          url: "https://storage.googleapis.com/public-assets-ortho/games/sound-match.pdf",
          description: "مجموعة بطاقات للتمييز السمعي",
        },
      ],
      evaluationHistory: [],
      milestones: [
        {
          id: "milestone-listening-start",
          title: "بداية التحدي السمعي",
          achieved: true,
          achievedAt: iso(8),
          description: "أكمل أحمد أول جلسة للفهم السمعي",
        },
        {
          id: "milestone-listening-80",
          title: "دقة 80%",
          achieved: false,
          achievedAt: null,
          description: "الوصول إلى دقة 80%",
        },
      ],
    },
  ];
}

function createDefaultEducationalGames(): EducationalGamesData {
  const now = new Date();
  const iso = (daysAgo: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
  };

  return {
    totalPoints: 720,
    activeBadges: ["بطل النطق", "خبير الأصوات"],
    streakWeeks: 4,
    recommendations: [
      "جربوا لعبة تركيب الحروف لتعزيز التهجئة",
      "حافظوا على تحدي النطق السريع مرتين أسبوعيًا",
    ],
    games: [
      {
        id: "sound-picture-match",
        title: "مطابقة الصوت بالصورة",
        description:
          "يستمع الطفل لكلمة ويختار الصورة المطابقة لتعزيز الفهم السمعي.",
        objective: "تمييز الكلمات القصيرة والتعرف على الأصوات المتشابهة",
        ageRange: "4-7",
        difficulty: "medium",
        skills: ["الفهم السمعي", "التمييز البصري", "المفردات"],
        points: 210,
        badgeProgress: 80,
        playCount: 14,
        bestScore: 96,
        lastPlayed: iso(1),
        icon: "🎧",
        durationMinutes: 8,
        weeklyChallenge: {
          goal: "إكمال 3 جلسات بدقة 80%",
          targetSessions: 3,
          completedSessions: 2,
          reward: "شارة خبير الأصوات",
          expiresAt: iso(-2),
        },
        leaderboard: [
          { childName: "أحمد", score: 96, trend: "up" },
          { childName: "ليلى", score: 92, trend: "steady" },
          { childName: "سليم", score: 88, trend: "down" },
        ],
        sessions: [
          {
            id: "session-spm-1",
            date: iso(1),
            durationMinutes: 9,
            score: 94,
            accuracy: 92,
            notes: "تمييز رائع للأصوات",
            boosterUnlocked: true,
          },
          {
            id: "session-spm-2",
            date: iso(4),
            durationMinutes: 8,
            score: 90,
            accuracy: 88,
            notes: "استخدم البطاقات بشكل ممتاز",
            boosterUnlocked: false,
          },
        ],
      },
      {
        id: "letter-build",
        title: "تركيب الحروف",
        description:
          "يسمع الطفل الكلمة ويجمع الحروف المناسبة بالترتيب الصحيح.",
        objective: "تعزيز الربط بين الصوت والحرف",
        ageRange: "5-8",
        difficulty: "medium",
        skills: ["التهجئة", "التنسيق البصري الحركي", "الذاكرة"],
        points: 185,
        badgeProgress: 65,
        playCount: 11,
        bestScore: 88,
        lastPlayed: iso(3),
        icon: "🧩",
        durationMinutes: 10,
        weeklyChallenge: {
          goal: "إكمال تحدي 5 كلمات جديدة",
          targetSessions: 2,
          completedSessions: 1,
          reward: "مضاعفة النقاط",
          expiresAt: iso(-1),
        },
        leaderboard: [
          { childName: "ليلى", score: 90, trend: "up" },
          { childName: "أحمد", score: 88, trend: "steady" },
          { childName: "يونس", score: 84, trend: "up" },
        ],
        sessions: [
          {
            id: "session-lb-1",
            date: iso(3),
            durationMinutes: 11,
            score: 86,
            accuracy: 82,
            notes: "تحسن في ترتيب الحروف",
            boosterUnlocked: false,
          },
        ],
      },
      {
        id: "speed-pronunciation",
        title: "تحدي النطق السريع",
        description:
          "يعرض على الطفل كلمات متعددة ليقوم بنطقها قبل انتهاء الوقت.",
        objective: "رفع السرعة مع الحفاظ على وضوح النطق",
        ageRange: "6-9",
        difficulty: "hard",
        skills: ["السرعة", "الوضوح", "الثقة بالنفس"],
        points: 165,
        badgeProgress: 52,
        playCount: 8,
        bestScore: 82,
        lastPlayed: iso(2),
        icon: "⚡",
        durationMinutes: 5,
        weeklyChallenge: {
          goal: "الفوز في جولتين متتاليتين",
          targetSessions: 3,
          completedSessions: 1,
          reward: "شارة البرق",
          expiresAt: iso(-2),
        },
        leaderboard: [
          { childName: "سليم", score: 88, trend: "up" },
          { childName: "أحمد", score: 82, trend: "up" },
          { childName: "ليلى", score: 80, trend: "down" },
        ],
        sessions: [
          {
            id: "session-sp-1",
            date: iso(2),
            durationMinutes: 6,
            score: 80,
            accuracy: 78,
            notes: "تحكم جيد في الوقت",
            boosterUnlocked: true,
          },
        ],
      },
      {
        id: "weekly-challenge",
        title: "التحدي الأسبوعي",
        description:
          "يختبر الطفل في 5 كلمات أو أصوات جديدة كل أسبوع للحصول على شارة بطل النطق.",
        objective: "تقييم شامل للتقدم الأسبوعي",
        ageRange: "5-9",
        difficulty: "medium",
        skills: ["التذكر", "النطق", "الاستماع"],
        points: 160,
        badgeProgress: 40,
        playCount: 4,
        bestScore: 78,
        lastPlayed: iso(5),
        icon: "🏅",
        durationMinutes: 12,
        weeklyChallenge: {
          goal: "تحقيق 4 من 5 كلمات صحيحة",
          targetSessions: 1,
          completedSessions: 0,
          reward: "شارة بطل النطق",
          expiresAt: iso(-3),
        },
        leaderboard: [
          { childName: "أحمد", score: 78, trend: "steady" },
          { childName: "ليلى", score: 82, trend: "up" },
          { childName: "سليم", score: 76, trend: "down" },
        ],
        sessions: [],
      },
    ],
  };
}

function createDefaultAssistantData(): AssistantData {
  const now = new Date();
  const iso = (daysAgo: number, minutesAgo = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setMinutes(d.getMinutes() - minutesAgo);
    return d.toISOString();
  };

  return {
    lastTipTimestamp: iso(0, 120),
    messages: [
      {
        id: "msg-1",
        role: "assistant",
        timestamp: iso(0, 300),
        content:
          "مرحبًا 👋، ابنك أنجز تمرينين اليوم بنسبة دقة 82%. أنصح بتجربة لعبة مطابقة الصوت لتثبيت حرف الراء.",
        suggestedActions: [
          "بدء تمرين نطق حرف الراء",
          "تشغيل لعبة مطابقة الصوت",
        ],
        relatedExerciseIds: ["letters-r-sound"],
        relatedGameIds: ["sound-picture-match"],
      },
      {
        id: "msg-2",
        role: "parent",
        timestamp: iso(0, 290),
        content: "كيف أساعده على نطق حرف الصاد بشكل أوضح؟",
      },
      {
        id: "msg-3",
        role: "assistant",
        timestamp: iso(0, 285),
        content:
          "ابدأ بتمرين التنفس، ثم استخدم بطاقة حرف الصاد واطلب منه نطق (صا، صي، صو). شجع النطق البطيء وتابع تقدمك في لوحة التدريب اليومي.",
        suggestedActions: ["عرض تمرين الفهم السمعي", "تحميل بطاقة حرف الصاد"],
      },
      {
        id: "msg-4",
        role: "parent",
        timestamp: iso(1, 180),
        content: "ما الأنشطة المناسبة قبل النوم لزيادة التركيز؟",
      },
      {
        id: "msg-5",
        role: "assistant",
        timestamp: iso(1, 170),
        content:
          "جربوا قراءة قصة صوتية قصيرة ثم لعبة ترتيب الصور قبل النوم. حافظوا على إضاءة هادئة وأوقفوا الشاشات قبل 30 دقيقة من النوم.",
        suggestedActions: ["تشغيل قصة صوتية", "عرض نصائح النوم"],
      },
    ],
    savedTips: [
      {
        id: "tip-1",
        title: "نصيحة اليوم",
        content:
          "خصصوا 10 دقائق للتمارين الصوتية بعد الإفطار مباشرة. الزمن الصباحي يساعد على تعزيز التركيز.",
        category: "تنظيم اليوم",
      },
      {
        id: "tip-2",
        title: "تعزيز النطق",
        content:
          "استخدموا الألعاب الصوتية لجعل التدريب ممتعًا. بعد كل نجاح، امنحوا الطفل مكافأة بسيطة.",
        category: "النطق",
      },
    ],
  };
}

function createDefaultParentData(parentId: string): ParentFollowUpData {
  const now = new Date();
  const iso = now.toISOString();
  const exercises = createDefaultDailyTrainingExercises();

  return {
    parentId,
    childName: "أحمد محمد",
    dailyTraining: {
      summary: {
        parentId,
        date: iso,
        dailyGoalCompletion: 64,
        completedExercises: 2,
        totalExercises: exercises.length,
        weeklyCompletionRate: 72,
        streakDays: 5,
        streakBest: 9,
        aiMotivation:
          "أحمد يحرز تقدمًا رائعًا! استمروا في تدريب حرف الراء اليوم لتحسين الوضوح بنسبة 5% إضافية.",
        reminders: [
          {
            id: "reminder-morning",
            time: "08:30",
            message: "موعد تدريب المقاطع بعد وجبة الإفطار",
            channel: "push",
          },
          {
            id: "reminder-evening",
            time: "18:00",
            message: "تدريب الفهم السمعي قبل النوم",
            channel: "sms",
          },
        ],
      },
      exercises,
    },
    educationalGames: createDefaultEducationalGames(),
    aiAssistant: createDefaultAssistantData(),
  };
}

async function getOrCreateParentData(parentId: string): Promise<ParentFollowUpData> {
  const data = await readData();

  if (!data.parents[parentId]) {
    data.parents[parentId] = createDefaultParentData(parentId);
    await writeData(data);
  }

  return data.parents[parentId];
}

export async function getDailyTraining(parentId: string): Promise<DailyTrainingData> {
  const parentData = await getOrCreateParentData(parentId);
  return parentData.dailyTraining;
}

export async function getDailyTrainingExercise(
  parentId: string,
  exerciseId: string,
): Promise<DailyTrainingExercise | undefined> {
  const training = await getDailyTraining(parentId);
  return training.exercises.find((exercise) => exercise.id === exerciseId);
}

export interface UpdateExerciseProgressInput {
  progressDelta?: number;
  accuracy?: number;
  clarity?: number;
  fluency?: number;
  comprehension?: number;
  notes?: string;
  sharingTargets?: string[];
}

export async function updateExerciseProgress(
  parentId: string,
  exerciseId: string,
  input: UpdateExerciseProgressInput,
) {
  const data = await readData();
  const parent = data.parents[parentId] ?? createDefaultParentData(parentId);
  const exercise = parent.dailyTraining.exercises.find((item) => item.id === exerciseId);

  if (!exercise) {
    throw new Error("Exercise not found");
  }

  const timestamp = new Date().toISOString();
  exercise.attempts += 1;
  exercise.lastUpdated = timestamp;

  if (typeof input.progressDelta === "number") {
    exercise.progress = Math.min(100, Math.max(0, exercise.progress + input.progressDelta));
  }

  exercise.metrics = {
    accuracy: input.accuracy ?? exercise.metrics.accuracy,
    clarity: input.clarity ?? exercise.metrics.clarity,
    fluency: input.fluency ?? exercise.metrics.fluency,
    comprehension: input.comprehension ?? exercise.metrics.comprehension,
  };

  const newEvaluation: DailyTrainingEvaluation = {
    id: `eval-${exerciseId}-${exercise.attempts}`,
    date: timestamp,
    notes: input.notes ?? "تم تسجيل جلسة تدريب جديدة",
    rating: Math.round((exercise.metrics.accuracy + exercise.metrics.clarity) / 40),
    metrics: {
      accuracy: exercise.metrics.accuracy,
      clarity: exercise.metrics.clarity,
      fluency: exercise.metrics.fluency,
      comprehension: exercise.metrics.comprehension,
    },
    aiFeedback:
      input.notes ??
      "استمروا بالتمرين الحالي. حافظوا على الجلسات القصيرة والمتكررة لتحسين الثبات.",
    sharedWith: input.sharingTargets ?? [],
  };

  exercise.evaluationHistory.unshift(newEvaluation);
  if (exercise.evaluationHistory.length > 10) {
    exercise.evaluationHistory = exercise.evaluationHistory.slice(0, 10);
  }

  // Update summary progress
  const completed = parent.dailyTraining.exercises.filter((item) => item.progress >= 80).length;
  parent.dailyTraining.summary.completedExercises = completed;
  parent.dailyTraining.summary.dailyGoalCompletion = Math.round(
    (completed / parent.dailyTraining.exercises.length) * 100,
  );
  parent.dailyTraining.summary.date = timestamp;

  data.parents[parentId] = parent;
  await writeData(data);

  return exercise;
}

export interface SaveExerciseMediaInput {
  type: MediaType;
  filename: string;
  originalName: string;
  url: string;
  notes?: string;
}

export async function attachExerciseMedia(
  parentId: string,
  exerciseId: string,
  input: SaveExerciseMediaInput,
) {
  const data = await readData();
  const parent = data.parents[parentId] ?? createDefaultParentData(parentId);
  const exercise = parent.dailyTraining.exercises.find((item) => item.id === exerciseId);

  if (!exercise) {
    throw new Error("Exercise not found");
  }

  const timestamp = new Date().toISOString();

  const evaluation: DailyTrainingEvaluation = {
    id: `eval-${exerciseId}-${timestamp}`,
    date: timestamp,
    notes: input.notes ?? "تمت إضافة تسجيل جديد",
    rating: 4,
    metrics: exercise.metrics,
    aiFeedback:
      "تم حفظ التسجيل بنجاح. سيتم تحليله في الجلسة القادمة لتحديث التوصيات.",
    sharedWith: [],
    media: {
      id: `media-${exerciseId}-${timestamp}`,
      type: input.type,
      filename: input.filename,
      originalName: input.originalName,
      url: input.url,
    },
  };

  exercise.evaluationHistory.unshift(evaluation);
  exercise.lastUpdated = timestamp;

  data.parents[parentId] = parent;
  await writeData(data);

  return evaluation;
}

export async function getEducationalGames(parentId: string) {
  const parentData = await getOrCreateParentData(parentId);
  return parentData.educationalGames;
}

export interface RecordGameSessionInput {
  score: number;
  accuracy: number;
  notes?: string;
  durationMinutes?: number;
}

export async function recordGameSession(
  parentId: string,
  gameId: string,
  input: RecordGameSessionInput,
) {
  const data = await readData();
  const parent = data.parents[parentId] ?? createDefaultParentData(parentId);
  const game = parent.educationalGames.games.find((item) => item.id === gameId);

  if (!game) {
    throw new Error("Game not found");
  }

  const timestamp = new Date().toISOString();
  const session: EducationalGameSession = {
    id: `session-${gameId}-${game.sessions.length + 1}`,
    date: timestamp,
    durationMinutes: input.durationMinutes ?? game.durationMinutes,
    score: input.score,
    accuracy: input.accuracy,
    notes: input.notes ?? "تم تسجيل جلسة لعب جديدة",
    boosterUnlocked: input.score >= 85,
  };

  game.sessions.unshift(session);
  if (game.sessions.length > 10) {
    game.sessions = game.sessions.slice(0, 10);
  }

  game.playCount += 1;
  game.lastPlayed = timestamp;
  game.bestScore = Math.max(game.bestScore, input.score);
  game.badgeProgress = Math.min(100, game.badgeProgress + (input.score >= 80 ? 15 : 8));
  game.weeklyChallenge.completedSessions = Math.min(
    game.weeklyChallenge.targetSessions,
    game.weeklyChallenge.completedSessions + 1,
  );

  parent.educationalGames.totalPoints += Math.round(input.score / 5);
  parent.educationalGames.recommendations = Array.from(
    new Set([
      ...parent.educationalGames.recommendations,
      input.score >= 85
        ? "حافظوا على التحديات الأسبوعية للحصول على شارة جديدة"
        : "جربوا إعادة اللعبة مع تقسيم الكلمات إلى مقاطع",
    ]),
  ).slice(0, 4);

  data.parents[parentId] = parent;
  await writeData(data);

  return game;
}

export async function getAssistantData(parentId: string) {
  const parentData = await getOrCreateParentData(parentId);
  return parentData.aiAssistant;
}

export async function saveAssistantData(parentId: string, payload: AssistantData) {
  const data = await readData();
  const parent = data.parents[parentId] ?? createDefaultParentData(parentId);
  parent.aiAssistant = payload;
  data.parents[parentId] = parent;
  await writeData(data);
}

export async function appendAssistantMessage(parentId: string, message: AssistantMessage) {
  const data = await readData();
  const parent = data.parents[parentId] ?? createDefaultParentData(parentId);
  parent.aiAssistant.messages.push(message);
  data.parents[parentId] = parent;
  await writeData(data);
  return message;
}

export async function updateAssistantTipTimestamp(parentId: string) {
  const data = await readData();
  const parent = data.parents[parentId] ?? createDefaultParentData(parentId);
  parent.aiAssistant.lastTipTimestamp = new Date().toISOString();
  data.parents[parentId] = parent;
  await writeData(data);
}

export async function getParentFollowUpData(parentId: string) {
  return getOrCreateParentData(parentId);
}

