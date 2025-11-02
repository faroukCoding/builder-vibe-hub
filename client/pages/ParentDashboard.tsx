import {
  ArrowLeft,
  Baby,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  Activity,
  Star,
  Target,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  MessageSquare,
  Brain,
  BarChart3,
  Globe,
  Play,
  Award,
  Gamepad2,
  Sparkles,
  Mic,
  MessageCircle,
  Headphones,
  BellRing,
  Timer,
  ShieldCheck,
  Cloud,
  Cpu,
  Sun,
  Moon,
  BookOpen,
  Database,
  ThumbsUp,
  Repeat,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import type { FormEvent, ChangeEvent } from "react";
import type { HomeLearningAssistantMessageResponse } from "@shared/api";

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [parentData, setParentData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Load parent data from localStorage
    const savedData = localStorage.getItem("parentData");
    if (savedData) {
      setParentData(JSON.parse(savedData));
    }
  }, []);

  // Mock child data
  const childData = {
    name: "أحمد محمد",
    age: parentData?.childAge || 6,
    diagnosis: "تأخر في النطق",
    specialist: "د. فاطمة أحمد",
    startDate: "2024-01-01",
    totalSessions: 12,
    completedSessions: 8,
    overallProgress: 75,
    nextAppointment: {
      date: "2024-01-20",
      time: "10:00 ص",
      type: "جلسة علاج",
    },
  };

  const sessionHistory = [
    {
      id: 1,
      date: "2024-01-15",
      type: "تمارين الانتباه",
      duration: "45 دقيقة",
      progress: 85,
      notes: "تحسن ملحوظ في التركيز والانتباه",
      activities: ["اختيار النجمة", "البحث عن المفقود"],
    },
    {
      id: 2,
      date: "2024-01-12",
      type: "علاج النطق",
      duration: "60 دقيقة",
      progress: 78,
      notes: "تحسن في نطق حرف الراء",
      activities: ["تمارين اللسان", "تكرار الكلمات"],
    },
    {
      id: 3,
      date: "2024-01-08",
      type: "تقييم شامل",
      duration: "90 دقيقة",
      progress: 70,
      notes: "تقييم الميزانية الأرطوفونية",
      activities: ["فحص النطق", "اختبارات الإدراك"],
    },
  ];

  const achievements = [
    { title: "أول جلسة", earned: true, date: "2024-01-01", icon: "🎯" },
    { title: "5 جلسات", earned: true, date: "2024-01-10", icon: "⭐" },
    { title: "تحسن 50%", earned: true, date: "2024-01-12", icon: "📈" },
    { title: "10 جلسات", earned: false, date: null, icon: "🏆" },
    { title: "تحسن 75%", earned: false, date: null, icon: "🎉" },
  ];

  const reports = [
    {
      id: 1,
      title: "تقرير التقييم الأولي",
      date: "2024-01-01",
      type: "تقييم",
      specialist: "د. فاطمة أحمد",
      summary: "تقييم شامل للحالة مع خطة العلاج المقترحة",
    },
    {
      id: 2,
      title: "تقرير التقدم الشهري",
      date: "2024-01-15",
      type: "متابعة",
      specialist: "د. فاطمة أحمد",
      summary: "تقرير مفصل عن التقدم المحرز خلال الشهر الأول",
    },
  ];

  // بيانات المخطط الجغرافي - الجزائر
  const geographicalData = [
    { region: "الجزائر العاصمة", patients: 142, success: 88, cases: 185 },
    { region: "وهران", patients: 118, success: 84, cases: 150 },
    { region: "قسنطينة", patients: 95, success: 86, cases: 125 },
    { region: "عنابة", patients: 78, success: 82, cases: 105 },
    { region: "سطيف", patients: 67, success: 89, cases: 85 },
    { region: "باتنة", patients: 54, success: 85, cases: 70 },
    { region: "تيزي وزو", patients: 49, success: 91, cases: 65 },
    { region: "بسكرة", patients: 38, success: 83, cases: 50 },
  ];

  const cognitiveTestsProgress = [
    {
      month: "يناير",
      fruits: 75,
      vegetables: 68,
      clothes: 82,
      animals: 90,
      vehicles: 77,
    },
    {
      month: "فبراير",
      fruits: 78,
      vegetables: 72,
      clothes: 85,
      animals: 92,
      vehicles: 80,
    },
    {
      month: "مارس",
      fruits: 82,
      vegetables: 75,
      clothes: 88,
      animals: 94,
      vehicles: 83,
    },
    {
      month: "أبريل",
      fruits: 85,
      vegetables: 78,
      clothes: 90,
      animals: 96,
      vehicles: 86,
    },
  ];

  const testCategories = [
    { name: "الفواكه", value: 85, color: "#ff6b6b" },
    { name: "الخضروات", value: 78, color: "#4ecdc4" },
    { name: "الملابس", value: 90, color: "#45b7d1" },
    { name: "الحيوانات", value: 96, color: "#96ceb4" },
    { name: "المركبات", value: 86, color: "#ffeaa7" },
  ];

  type AssistantRole = "assistant" | "child" | "parent";
  type AssistantTone = "prompt" | "feedback" | "encouragement";

  interface AssistantMessage {
    id: string;
    role: AssistantRole;
    content: string;
    createdAt: string;
    tone: AssistantTone;
    mediaLink?: string | null;
  }

  interface AttemptRecord {
    id: string;
    timestamp: string;
    type: "assistant" | "training" | "game";
    activity: string;
    result: "success" | "retry" | "info";
    notes: string;
    mediaLink?: string | null;
  }

  type TrainingModuleKey = "letters" | "words" | "discrimination";

  const moduleLabels: Record<TrainingModuleKey, string> = {
    letters: "تمارين الحروف",
    words: "الكلمات والجمل",
    discrimination: "تمييز الحروف",
  };

  interface LetterExercise {
    id: string;
    level: "easy" | "medium" | "hard";
    prompt: string;
    target: string;
    success: string;
    hint: string;
  }

  interface WordExercise {
    id: string;
    level: "easy" | "medium" | "hard";
    prompt: string;
    target: string;
    success: string;
    hint: string;
  }

  interface DiscriminationExercise {
    id: string;
    level: "easy" | "medium" | "hard";
    prompt: string;
    optionA: string;
    optionB: string;
    correct: string;
    success: string;
    hint: string;
  }

  interface MatchingOption {
    id: string;
    label: string;
    image: string;
    isCorrect: boolean;
    description: string;
  }

  interface MatchingRound {
    id: string;
    prompt: string;
    narration: string;
    reward: string;
    hint: string;
    options: MatchingOption[];
  }

  interface AssemblyLetter {
    id: string;
    char: string;
  }

  interface AssemblyRound {
    id: string;
    word: string;
    hint: string;
    reward: string;
    letters: string[];
  }

  interface RapidWord {
    id: string;
    word: string;
    hint: string;
    encouragement: string;
  }

  const levelLabels: Record<"easy" | "medium" | "hard", string> = {
    easy: "سهل",
    medium: "متوسط",
    hard: "صعب",
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const letterExercises: LetterExercise[] = [
    {
      id: "letters-easy-1",
      level: "easy",
      prompt: "استمع للحرف \"ر\" ثم انطقه بصوت واضح.",
      target: "ر",
      success: "أحسنت! نطقك لحرف الراء واضح وقوي.",
      hint: "جرب أن تلمس طرف لسانك سقف فمك برفق ثم أطلق الصوت.",
    },
    {
      id: "letters-medium-1",
      level: "medium",
      prompt: "انطق المقطع \"را\" مع ابتسامة لطيفة.",
      target: "را",
      success: "ممتاز! لقد نطقت المقطع بشكل متناغم.",
      hint: "ابدأ بصوت راء خفيف ثم افتح فمك قليلاً لصوت الألف.",
    },
    {
      id: "letters-hard-1",
      level: "hard",
      prompt: "جرب قول \"ررر\" ثلاث مرات بسرعة ثابتة.",
      target: "ررر",
      success: "رائع! لديك تحكم جميل في تكرار الحرف.",
      hint: "حافظ على تدفق الهواء مع تحريك اللسان بخفة.",
    },
  ];

  const wordExercises: WordExercise[] = [
    {
      id: "words-easy-1",
      level: "easy",
      prompt: "استمع لكلمة \"قمر\" ثم أعد قولها بوضوح.",
      target: "قمر",
      success: "جميل! كلمة قمر خرجت بنبرة لطيفة.",
      hint: "ركز على حرف القاف أولاً ثم أكمل الكلمة بهدوء.",
    },
    {
      id: "words-medium-1",
      level: "medium",
      prompt: "قل الجملة القصيرة: \"ركب رامي القطار\".",
      target: "ركب رامي القطار",
      success: "أحسنت! الجملة واضحة ولطيفة.",
      hint: "حافظ على صوت الراء في بداية كل كلمة.",
    },
    {
      id: "words-hard-1",
      level: "hard",
      prompt: "كرّر الجملة: \"رندة ترى الورد الأحمر\" دون تسرع.",
      target: "رندة ترى الورد الأحمر",
      success: "رائع! لقد أتقنت الجملة المتقدمة.",
      hint: "خذ نفساً عميقاً قبل البدء ثم انطق كل كلمة بروية.",
    },
  ];

  const discriminationExercises: DiscriminationExercise[] = [
    {
      id: "discrimination-easy-1",
      level: "easy",
      prompt: "سمعنا صوتاً يشبه النسيم: أي الحرفين تسمع؟",
      optionA: "س",
      optionB: "ش",
      correct: "س",
      success: "ممتاز! التقطت الصوت الناعم للحرف س.",
      hint: "صوت س يشبه الهمس الخفيف، جرب أن تستمع لهدوء البداية.",
    },
    {
      id: "discrimination-medium-1",
      level: "medium",
      prompt: "هذا الصوت يبدأ بنقطة صغيرة ثم صوت هواء: أيهما هو؟",
      optionA: "ب",
      optionB: "ف",
      correct: "ب",
      success: "رائع! لديك أذن دقيقة للصوت القصير.",
      hint: "الحرف ب يبدأ بانفجار قصير قبل أن يكمل.",
    },
    {
      id: "discrimination-hard-1",
      level: "hard",
      prompt: "الصوت يبدأ بلسان يلمس سقف الفم ثم ينطلق: ما هو الحرف؟",
      optionA: "ر",
      optionB: "ل",
      correct: "ر",
      success: "أحسنت! ميّزت بين الحرفين بدقة.",
      hint: "صوت الراء يهتز سريعاً بينما صوت اللام ناعم وطويل.",
    },
  ];

  const matchingRounds: MatchingRound[] = [
    {
      id: "match-apple",
      prompt: "أي صورة تناسب كلمة \"تفاحة حمراء\" التي سمعناها للتو؟",
      narration: "استمع للكلمة ثم اختر الصورة الصحيحة.",
      reward: "ملصق تفاحة متألقة 🍎",
      hint: "تذكر أن التفاحة شكلها دائري ولونها أحمر",
      options: [
        {
          id: "apple",
          label: "تفاحة",
          image: "/home-learning/apple.svg",
          isCorrect: true,
          description: "فاكهة حمراء تساعدنا على النطق بالأصوات الصافية.",
        },
        {
          id: "lion",
          label: "أسد",
          image: "/home-learning/lion.svg",
          isCorrect: false,
          description: "ملك الغابة، لكنه لا يناسب الكلمة التي سمعناها الآن.",
        },
        {
          id: "train",
          label: "قطار",
          image: "/home-learning/train.svg",
          isCorrect: false,
          description: "القطار مسلي لكنه ليس الكلمة المطلوبة.",
        },
      ],
    },
    {
      id: "match-bag",
      prompt: "اختر الصورة التي تمثل كلمة \"حقيبة مدرسية\".",
      narration: "ركز في بداية الكلمة ثم اختر الصورة المناسبة.",
      reward: "شارة الحقيبة المضيئة 🎒",
      hint: "الحقيبة لها يد قصيرة ويمكن حملها بسهولة.",
      options: [
        {
          id: "bag",
          label: "حقيبة",
          image: "/home-learning/bag.svg",
          isCorrect: true,
          description: "نضع فيها كتبنا ودفاترنا، أحسنت الاختيار!",
        },
        {
          id: "book",
          label: "كتاب",
          image: "/home-learning/book.svg",
          isCorrect: false,
          description: "الكتاب صديقنا، لكن الكلمة تتحدث عن شيء نحمل الكتب فيه.",
        },
        {
          id: "drum",
          label: "طبل",
          image: "/home-learning/drum.svg",
          isCorrect: false,
          description: "الطبل ممتع لكنه ليس الحقيبة المطلوبة.",
        },
      ],
    },
  ];

  const baseAssemblyRounds: AssemblyRound[] = [
    {
      id: "assembly-train",
      word: "قطار",
      hint: "ابدأ بحرف قوي يصدر من مؤخرة اللسان.",
      reward: "شارة القطار السريع 🚂",
      letters: ["ق", "ط", "ا", "ر"],
    },
    {
      id: "assembly-lion",
      word: "أسد",
      hint: "تذكر أن تبدأ بهمزة ناعمة.",
      reward: "وسام الأسد الشجاع 🦁",
      letters: ["أ", "س", "د"],
    },
    {
      id: "assembly-flower",
      word: "زهرة",
      hint: "ركز على صوت الهاء الأوسط حتى يبقى واضحاً.",
      reward: "زهرة براقة 🌸",
      letters: ["ز", "ه", "ر", "ة"],
    },
  ];

  const rapidWords: RapidWord[] = [
    {
      id: "rapid-tree",
      word: "شجرة",
      hint: "ابدأ بصوت ش ناعم ثم تحرك بهدوء إلى بقية الكلمة.",
      encouragement: "أحسنت! الشجرة أصبحت سعيدة بصوتك الواثق.",
    },
    {
      id: "rapid-rain",
      word: "مطر",
      hint: "جرب أن تجعل صوت الراء في النهاية يهتز قليلاً.",
      encouragement: "رائع! المطر يتساقط بنغمات جميلة الآن.",
    },
    {
      id: "rapid-book",
      word: "كتاب",
      hint: "افتح فمك جيداً عند نطق حرف الألف.",
      encouragement: "مرحى! الكتب تحب من ينطقها بوضوح.",
    },
    {
      id: "rapid-giraffe",
      word: "زرافة",
      hint: "حافظ على صوت الزاي واضحاً في البداية.",
      encouragement: "مذهل! الزرافة تلوح لك بسعادتها.",
    },
    {
      id: "rapid-moon",
      word: "قمر",
      hint: "تأكد من صوت القاف في البداية، فهو قوي وجميل.",
      encouragement: "يا سلام! القمر يضيء أكثر مع نطقك الصحيح.",
    },
  ];

  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>(() => [
    {
      id: "assistant-welcome",
      role: "assistant",
      tone: "encouragement",
      content: "مرحباً! أنا نور، مساعدك الذكي. لنتمرن معاً على النطق بطريقة ممتعة!",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [assistantInput, setAssistantInput] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isRecordingAssistant, setIsRecordingAssistant] = useState(false);
  const [assistantUploading, setAssistantUploading] = useState(false);
  const [savedVoiceNotes, setSavedVoiceNotes] = useState(
    () =>
      [
        {
          id: "voice-1",
          title: "تسجيل حرف الراء",
          url: "/uploads/voice-r-success.mp3",
          note: "نطق ثابت للحرف ر",
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        },
      ] as Array<{ id: string; title: string; url: string; note: string; createdAt: string }>,
  );
  const [attemptHistory, setAttemptHistory] = useState<AttemptRecord[]>([]);
  const [learningStreak, setLearningStreak] = useState(3);
  const [reportText, setReportText] = useState<string | null>(null);

  const [trainingProgress, setTrainingProgress] = useState(
    () =>
      ({
        letters: { currentIndex: 0, completed: false },
        words: { currentIndex: 0, completed: false },
        discrimination: { currentIndex: 0, completed: false },
      }) satisfies Record<TrainingModuleKey, { currentIndex: number; completed: boolean }>,
  );
  const [trainingInputs, setTrainingInputs] = useState({ letters: "", words: "" });
  const [trainingFeedback, setTrainingFeedback] = useState({
    letters: "",
    words: "",
    discrimination: "",
  });
  const [selectedDiscriminationChoice, setSelectedDiscriminationChoice] = useState<string | null>(null);

  const [matchingState, setMatchingState] = useState({
    roundIndex: 0,
    score: 0,
    feedback: "",
    canAdvance: false,
  });
  const [selectedMatchingOption, setSelectedMatchingOption] = useState<string | null>(null);

  const [assemblyRounds] = useState<(AssemblyRound & { scrambled: AssemblyLetter[] })[]>(() =>
    baseAssemblyRounds.map((round) => ({
      ...round,
      scrambled: shuffleArray(
        round.letters.map<AssemblyLetter>((char, index) => ({
          id: `${round.id}-${index}`,
          char,
        })),
      ),
    })),
  );

  const [assemblyState, setAssemblyState] = useState({
    roundIndex: 0,
    selectedLetters: [] as AssemblyLetter[],
    usedLetterIds: [] as string[],
    feedback: "",
    score: 0,
  });

  const [rapidState, setRapidState] = useState({
    isActive: false,
    currentIndex: 0,
    remainingSeconds: 25,
    score: 0,
    feedback: "",
    finishedRound: false,
  });

  const trainingRecorderRef = useRef<MediaRecorder | null>(null);
  const trainingStreamRef = useRef<MediaStream | null>(null);
  const trainingChunksRef = useRef<Blob[]>([]);
  const [recordingModule, setRecordingModule] = useState<TrainingModuleKey | null>(null);
  const [trainingAudioSources, setTrainingAudioSources] = useState<
    Record<TrainingModuleKey, { url: string; label: string } | null>
  >({
    letters: null,
    words: null,
    discrimination: null,
  });
  const rapidRecorderRef = useRef<MediaRecorder | null>(null);
  const rapidStreamRef = useRef<MediaStream | null>(null);
  const rapidChunksRef = useRef<Blob[]>([]);
  const [isRecordingRapid, setIsRecordingRapid] = useState(false);
  const [rapidAudioUrl, setRapidAudioUrl] = useState<string | null>(null);
  const [rapidUploadLoading, setRapidUploadLoading] = useState(false);

  const logAttempt = useCallback(
    (record: Omit<AttemptRecord, "id" | "timestamp">) => {
      const entry: AttemptRecord = {
        id: `attempt-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
        ...record,
      };
      setAttemptHistory((prev) => [entry, ...prev].slice(0, 60));
      if (record.result === "success") {
        setLearningStreak((prev) => prev + 1);
      }
    },
    [],
  );

  useEffect(() => {
    if (!rapidState.isActive) {
      return;
    }
    if (rapidState.remainingSeconds <= 0) {
      setRapidState((prev) => ({
        ...prev,
        isActive: false,
        feedback: `انتهى الوقت! جمعت ${prev.score} نقطة مشجعة.`,
        finishedRound: true,
      }));
      logAttempt({
        type: "game",
        activity: "تحدي النطق السريع",
        result: "info",
        notes: "انتهى الوقت وتم حفظ عدد النقاط الحالية.",
      });
      return;
    }
    const timer = window.setTimeout(() => {
      setRapidState((prev) => ({ ...prev, remainingSeconds: prev.remainingSeconds - 1 }));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [rapidState.isActive, rapidState.remainingSeconds, logAttempt]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (trainingRecorderRef.current && trainingRecorderRef.current.state === "recording") {
        trainingRecorderRef.current.stop();
      }
      if (rapidRecorderRef.current && rapidRecorderRef.current.state === "recording") {
        rapidRecorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      trainingStreamRef.current?.getTracks().forEach((track) => track.stop());
      rapidStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const totalAttempts = attemptHistory.length;
  const successfulAttempts = attemptHistory.filter((record) => record.result === "success").length;
  const successRate = totalAttempts === 0 ? 0 : Math.round((successfulAttempts / totalAttempts) * 100);
  const aiFeedbackCount = assistantMessages.filter((message) => message.role === "assistant").length;
  const uniqueActiveDays = new Set(
    attemptHistory.map((record) => record.timestamp.slice(0, 10)),
  ).size;
  const gamesScore = matchingState.score + assemblyState.score + rapidState.score;

  const derivedNotifications = useMemo(() => {
    const notes: Array<{ id: string; type: "success" | "info" | "warning"; message: string }> = [];
    notes.push({
      id: "notif-progress",
      type: successRate >= 70 ? "success" : "info",
      message:
        successRate >= 70
          ? `🌟 نسبة النجاح الحالية ${successRate}%، عمل رائع!`
          : `لنواصل التدريب! نسبة النجاح الحالية ${successRate}% ويمكننا تحسينها بخطوة جديدة.`,
    });
    notes.push({
      id: "notif-voice",
      type: savedVoiceNotes.length > 0 ? "success" : "info",
      message:
        savedVoiceNotes.length > 0
          ? `🎧 يوجد ${savedVoiceNotes.length} تسجيل صوتي جاهز للمراجعة.`
          : "سجّل محاولة صوتية جديدة لمتابعة التحسّن.",
    });
    const needsRetry = attemptHistory.filter((record) => record.result === "retry").length;
    if (needsRetry > 0) {
      notes.push({
        id: "notif-retry",
        type: "warning",
        message: `🔁 هناك ${needsRetry} محاولات تحتاج إعادة. سنعطي الطفل تلميحات لطيفة لتجاوزها.`,
      });
    }
    return notes;
  }, [attemptHistory, savedVoiceNotes.length, successRate]);

  const quickPrompts = [
    "أريد تمريناً جديداً لحرف الراء.",
    "هل نطقي لكلمة قطار صحيح؟",
    "أعطني نصيحة سريعة قبل اللعب.",
  ];

  const encouragementFallbacks = [
    "أحسنت! حاول الآن حرفاً أصعب ببطء وابتسامة.",
    "رائع! صوتك يزداد صفاءً في كل مرة.",
    "عمل جميل! تنفس بلطف قبل الكلمة التالية.",
  ];

  const correctionFallbacks = [
    "حاول مجدداً: ركز على الصوت الأول واستمع لهدوء البداية.",
    "لا بأس! كرر الكلمة ببطء، وسأخبرك حين تصبح ممتازاً.",
  ];

  const saveAssistantAudioMessage = (audioUrl: string, label: string) => {
    const timestamp = new Date().toISOString();
    const message: AssistantMessage = {
      id: `child-audio-${Date.now()}`,
      role: "child",
      tone: "prompt",
      content: label ? `تسجيل صوتي: ${label}` : "تسجيل صوتي جديد",
      createdAt: timestamp,
      mediaLink: audioUrl,
    };
    setAssistantMessages((prev) => [...prev, message]);
    setSavedVoiceNotes((prev) => [
      {
        id: `voice-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
        title: label || "تسجيل صوتي جديد",
        url: audioUrl,
        note: label || "تسجيل صوتي من الطفل",
        createdAt: timestamp,
      },
      ...prev,
    ]);
    logAttempt({
      type: "assistant",
      activity: "رسالة صوتية",
      result: "info",
      notes: `تم إرسال تسجيل صوتي (${label || "دون اسم"})`,
      mediaLink: audioUrl,
    });
  };

  const handleAssistantAudioSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setAssistantUploading(true);
    const audioUrl = URL.createObjectURL(file);
    saveAssistantAudioMessage(audioUrl, file.name);
    setAssistantUploading(false);
    event.target.value = "";
  };

  const stopAssistantRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const handleAssistantRecordingToggle = async () => {
    if (isRecordingAssistant) {
      stopAssistantRecording();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setAssistantMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          tone: "feedback",
          content: "يبدو أن المتصفح لا يدعم التسجيل المباشر. يمكنك رفع ملف صوتي بدلاً من ذلك.",
          createdAt: new Date().toISOString(),
        },
      ]);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (blob.size > 0) {
          const url = URL.createObjectURL(blob);
          saveAssistantAudioMessage(url, "تسجيل مباشر");
        }
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        mediaRecorderRef.current = null;
        audioChunksRef.current = [];
        setIsRecordingAssistant(false);
      };
      recorder.start();
      setIsRecordingAssistant(true);
    } catch (error) {
      setIsRecordingAssistant(false);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setAssistantMessages((prev) => [
        ...prev,
        {
          id: `assistant-record-error-${Date.now()}`,
          role: "assistant",
          tone: "feedback",
          content: "تعذّر بدء التسجيل. تأكد من منح الإذن للميكروفون أو استخدم رفع ملف صوتي.",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleStopAssistantRecordingEarly = () => {
    if (!isRecordingAssistant) {
      return;
    }
    stopAssistantRecording();
  };

  const saveTrainingAudio = (module: TrainingModuleKey, audioUrl: string, label: string) => {
    setTrainingAudioSources((prev) => {
      const previous = prev[module];
      if (previous?.url && previous.url.startsWith("blob:") && previous.url !== audioUrl) {
        URL.revokeObjectURL(previous.url);
      }
      return {
        ...prev,
        [module]: { url: audioUrl, label },
      };
    });
    logAttempt({
      type: "training",
      activity: `${moduleLabels[module]} - تسجيل صوتي`,
      result: "info",
      notes: label,
      mediaLink: audioUrl,
    });
  };

  const handleTrainingAudioUpload = (module: TrainingModuleKey, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const url = URL.createObjectURL(file);
    saveTrainingAudio(module, url, `ملف مرفوع - ${file.name}`);
    event.target.value = "";
  };

  const handleStopTrainingRecording = () => {
    if (!trainingRecorderRef.current) {
      return;
    }
    trainingRecorderRef.current.stop();
  };

  const handleStartTrainingRecording = async (module: TrainingModuleKey) => {
    if (recordingModule && recordingModule !== module) {
      handleStopTrainingRecording();
    }
    if (recordingModule === module && trainingRecorderRef.current) {
      handleStopTrainingRecording();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setTrainingFeedback((prev) => ({
        ...prev,
        [module]: "المتصفح لا يدعم التسجيل المباشر، يمكنك رفع ملف صوتي بدلاً من ذلك.",
      } as typeof prev));
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      trainingStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      trainingRecorderRef.current = recorder;
      trainingChunksRef.current = [];
      const moduleKey = module;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          trainingChunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(trainingChunksRef.current, { type: "audio/webm" });
        if (blob.size > 0) {
          const url = URL.createObjectURL(blob);
          saveTrainingAudio(moduleKey, url, "تسجيل مباشر");
        }
        trainingStreamRef.current?.getTracks().forEach((track) => track.stop());
        trainingStreamRef.current = null;
        trainingRecorderRef.current = null;
        trainingChunksRef.current = [];
        setRecordingModule(null);
      };
      recorder.start();
      setRecordingModule(module);
    } catch (error) {
      trainingStreamRef.current?.getTracks().forEach((track) => track.stop());
      trainingStreamRef.current = null;
      trainingRecorderRef.current = null;
      trainingChunksRef.current = [];
      setRecordingModule(null);
      setTrainingFeedback((prev) => ({
        ...prev,
        [module]: "تعذّر تشغيل الميكروفون. تأكد من منح الإذن أو استخدم رفع ملف صوتي.",
      } as typeof prev));
    }
  };

  const handleClearTrainingAudio = (module: TrainingModuleKey) => {
    setTrainingAudioSources((prev) => {
      const source = prev[module];
      if (source?.url && source.url.startsWith("blob:")) {
        URL.revokeObjectURL(source.url);
      }
      return {
        ...prev,
        [module]: null,
      };
    });
    logAttempt({
      type: "training",
      activity: `${moduleLabels[module]} - حذف التسجيل الصوتي`,
      result: "info",
      notes: "تم حذف التسجيل الصوتي لإعادة المحاولة.",
    });
  };

  const saveRapidAudio = (audioUrl: string, label: string) => {
    setRapidAudioUrl((prev) => {
      if (prev && prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return audioUrl;
    });
    logAttempt({
      type: "game",
      activity: "تحدي النطق السريع - تسجيل صوتي",
      result: "info",
      notes: label,
      mediaLink: audioUrl,
    });
  };

  const handleRapidAudioUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setRapidUploadLoading(true);
    const url = URL.createObjectURL(file);
    saveRapidAudio(url, `ملف مرفوع - ${file.name}`);
    setRapidUploadLoading(false);
    event.target.value = "";
  };

  const stopRapidRecording = () => {
    rapidRecorderRef.current?.stop();
  };

  const handleRapidRecordingToggle = async () => {
    if (isRecordingRapid) {
      stopRapidRecording();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setRapidState((prev) => ({
        ...prev,
        feedback: "المتصفح لا يدعم التسجيل المباشر، يمكنك رفع ملف صوتي بدلاً من ذلك.",
      }));
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      rapidStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      rapidRecorderRef.current = recorder;
      rapidChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          rapidChunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(rapidChunksRef.current, { type: "audio/webm" });
        if (blob.size > 0) {
          const url = URL.createObjectURL(blob);
          saveRapidAudio(url, "تسجيل مباشر");
        }
        rapidStreamRef.current?.getTracks().forEach((track) => track.stop());
        rapidStreamRef.current = null;
        rapidRecorderRef.current = null;
        rapidChunksRef.current = [];
        setIsRecordingRapid(false);
      };
      recorder.start();
      setIsRecordingRapid(true);
    } catch (error) {
      rapidStreamRef.current?.getTracks().forEach((track) => track.stop());
      rapidStreamRef.current = null;
      rapidRecorderRef.current = null;
      rapidChunksRef.current = [];
      setIsRecordingRapid(false);
      setRapidState((prev) => ({
        ...prev,
        feedback: "تعذّر تشغيل الميكروفون. تأكد من منح الإذن أو استخدم رفع ملف صوتي.",
      }));
    }
  };

  const handleClearRapidAudio = () => {
    setRapidAudioUrl((prev) => {
      if (prev && prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
    logAttempt({
      type: "game",
      activity: "تحدي النطق السريع - حذف التسجيل",
      result: "info",
      notes: "تم حذف التسجيل الصوتي للتحدي.",
    });
  };

  const createAssistantReply = (message: string): AssistantMessage => {
    const normalized = message.replace(/[!?؟.]/g, "").toLowerCase();
    let content: string;
    let tone: AssistantTone = "encouragement";

    const nextLetterExercise = letterExercises[trainingProgress.letters.currentIndex];
    const nextWordExercise = wordExercises[trainingProgress.words.currentIndex];

    if (normalized.includes("حرف") && nextLetterExercise) {
      content = `لنتمرن على الحرف ${nextLetterExercise.target}. ${nextLetterExercise.hint}`;
      tone = "feedback";
    } else if (normalized.includes("كلمة") && nextWordExercise) {
      content = `كلمة اليوم هي "${nextWordExercise.target}". ${nextWordExercise.hint}`;
      tone = "feedback";
    } else if (normalized.includes("لعبة") || normalized.includes("مرح")) {
      content = "لننطلق إلى لعبة مطابقة الصوت بالصورة، تذكّر أن تختار الصورة التي سمعت اسمها!";
      tone = "encouragement";
    } else if (normalized.includes("صح") || normalized.includes("صحيح")) {
      content = "أحسنت! نطقك يبدو واضحاً. إذا شئت يمكننا إعادة الاستماع للتأكد أكثر.";
      tone = "feedback";
    } else if (normalized.includes("خطأ") || normalized.includes("مجدداً")) {
      content = correctionFallbacks[Math.floor(Math.random() * correctionFallbacks.length)];
      tone = "feedback";
    } else {
      content = encouragementFallbacks[Math.floor(Math.random() * encouragementFallbacks.length)];
    }

    return {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      tone,
      content,
      createdAt: new Date().toISOString(),
    };
  };

  const handleAssistantSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = assistantInput.trim();
    if (!trimmed) {
      return;
    }
    const createdAt = new Date().toISOString();
    const childMessage: AssistantMessage = {
      id: `child-${Date.now()}`,
      role: "child",
      tone: "prompt",
      content: trimmed,
      createdAt,
    };
    const placeholderId = `assistant-pending-${Date.now()}`;
    const placeholderMessage: AssistantMessage = {
      id: placeholderId,
      role: "assistant",
      tone: "encouragement",
      content: "🤖 المساعد يفكر الآن...",
      createdAt,
    };

    setAssistantMessages((prev) => [...prev, childMessage, placeholderMessage]);
    setAssistantInput("");

    logAttempt({
      type: "assistant",
      activity: "رسالة الطفل",
      result: "info",
      notes: trimmed,
    });

    try {
      const response = await fetch("/api/home-learning/assistant/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          childId: childData.name,
          sender: "child",
          modality: "text",
          message: trimmed,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI service responded with status ${response.status}`);
      }

      const data = (await response.json()) as HomeLearningAssistantMessageResponse;
      const storedAt = data.storedAt || new Date().toISOString();

      setAssistantMessages((prev) => {
        const updated = prev.map((message) =>
          message.id === placeholderId
            ? {
                ...message,
                content: data.reply,
                tone: "feedback",
                createdAt: storedAt,
              }
            : message,
        );

        if (data.simplifiedReply && data.simplifiedReply.trim() && data.simplifiedReply.trim() !== data.reply.trim()) {
          updated.push({
            id: `${placeholderId}-simplified`,
            role: "assistant",
            tone: "encouragement",
            content: data.simplifiedReply.trim(),
            createdAt: storedAt,
          });
        }

        return updated;
      });

      if (data.cues?.length) {
        data.cues.forEach((cue) =>
          logAttempt({
            type: "assistant",
            activity: "إرشاد النطق",
            result: "info",
            notes: cue,
          }),
        );
      }

      if (data.nextActions?.length) {
        data.nextActions.forEach((action) =>
          logAttempt({
            type: "assistant",
            activity: "اقتراح متابعة",
            result: "info",
            notes: action,
          }),
        );
      }

      logAttempt({
        type: "assistant",
        activity: "رد المساعد",
        result: "success",
        notes: data.reply,
      });
    } catch (error) {
      console.error("Failed to contact AI assistant:", error);
      const fallback = createAssistantReply(trimmed);
      setAssistantMessages((prev) =>
        prev.map((message) =>
          message.id === placeholderId
            ? {
                ...message,
                content: fallback.content,
                tone: fallback.tone,
                createdAt: fallback.createdAt,
              }
            : message,
        ),
      );
      logAttempt({
        type: "assistant",
        activity: "رد المساعد (بديل)",
        result: "info",
        notes: fallback.content,
      });
    }
  };

  const handleMockVoiceSave = () => {
    const timestamp = Date.now();
    const voiceUrl = `/uploads/home-learning-voice-${timestamp}.mp3`;
    const newNote = {
      id: `voice-${timestamp}`,
      title: `تسجيل متابعة ${savedVoiceNotes.length + 1}`,
      url: voiceUrl,
      note: "تسجيل محاكاة لتقييم النطق.",
      createdAt: new Date().toISOString(),
    };
    setSavedVoiceNotes((prev) => [newNote, ...prev]);
    logAttempt({
      type: "assistant",
      activity: "تسجيل صوتي",
      result: "info",
      notes: newNote.note,
      mediaLink: voiceUrl,
    });
  };

  const normalizeAnswer = (value: string) => value.replace(/[\sـ]/g, "").trim();

  const advanceModule = (module: TrainingModuleKey) => {
    setTrainingProgress((prev) => {
      const nextIndex = prev[module].currentIndex + 1;
      const total =
        module === "letters"
          ? letterExercises.length
          : module === "words"
            ? wordExercises.length
            : discriminationExercises.length;
      if (nextIndex >= total) {
        return {
          ...prev,
          [module]: { currentIndex: prev[module].currentIndex, completed: true },
        } as typeof prev;
      }
      return {
        ...prev,
        [module]: { currentIndex: nextIndex, completed: false },
      } as typeof prev;
    });
  };

  const handleLettersSubmit = () => {
    const exercise = letterExercises[trainingProgress.letters.currentIndex];
    if (!exercise || trainingProgress.letters.completed) {
      return;
    }
    const answer = trainingInputs.letters.trim();
    if (!answer) {
      setTrainingFeedback((prev) => ({ ...prev, letters: "اكتب محاولتك أولاً، أنا أستمع إليك." }));
      return;
    }
    const isCorrect = normalizeAnswer(answer) === normalizeAnswer(exercise.target);
    if (isCorrect) {
      setTrainingFeedback((prev) => ({ ...prev, letters: `👍 ${exercise.success}` }));
      logAttempt({
        type: "training",
        activity: `تمرين الحروف: ${exercise.target}`,
        result: "success",
        notes: exercise.success,
      });
      advanceModule("letters");
      setTrainingInputs((prev) => ({ ...prev, letters: "" }));
    } else {
      setTrainingFeedback((prev) => ({ ...prev, letters: `🔁 ${exercise.hint}` }));
      logAttempt({
        type: "training",
        activity: `تمرين الحروف: ${exercise.target}`,
        result: "retry",
        notes: exercise.hint,
      });
    }
  };

  const handleLettersReset = () => {
    setTrainingInputs((prev) => ({ ...prev, letters: "" }));
    setTrainingFeedback((prev) => ({ ...prev, letters: "لنحاول مجدداً بخطوات هادئة." }));
  };

  const handleWordsSubmit = () => {
    const exercise = wordExercises[trainingProgress.words.currentIndex];
    if (!exercise || trainingProgress.words.completed) {
      return;
    }
    const answer = trainingInputs.words.trim();
    if (!answer) {
      setTrainingFeedback((prev) => ({ ...prev, words: "اكتب الجملة بصوتك الجميل ثم اضغط تقييم." }));
      return;
    }
    const isCorrect = normalizeAnswer(answer) === normalizeAnswer(exercise.target);
    if (isCorrect) {
      setTrainingFeedback((prev) => ({ ...prev, words: `🏅 ${exercise.success}` }));
      logAttempt({
        type: "training",
        activity: `كلمة/جملة: ${exercise.target}`,
        result: "success",
        notes: `الكلمة المستهدفة: ${exercise.target}`,
      });
      advanceModule("words");
      setTrainingInputs((prev) => ({ ...prev, words: "" }));
    } else {
      setTrainingFeedback((prev) => ({ ...prev, words: `✨ ${exercise.hint}` }));
      logAttempt({
        type: "training",
        activity: `كلمة/جملة: ${exercise.target}`,
        result: "retry",
        notes: `الكلمة المستهدفة: ${exercise.target}`,
      });
    }
  };

  const handleWordsReset = () => {
    setTrainingInputs((prev) => ({ ...prev, words: "" }));
    setTrainingFeedback((prev) => ({ ...prev, words: "لنكرر الجملة معاً بإيقاع هادئ." }));
  };

  const handleDiscriminationChoice = (choice: string) => {
    const exercise = discriminationExercises[trainingProgress.discrimination.currentIndex];
    if (!exercise || trainingProgress.discrimination.completed) {
      return;
    }
    setSelectedDiscriminationChoice(choice);
    const isCorrect = choice === exercise.correct;
    if (isCorrect) {
      setTrainingFeedback((prev) => ({ ...prev, discrimination: `🎉 ${exercise.success}` }));
      logAttempt({
        type: "training",
        activity: `تمييز الحروف: ${exercise.correct}`,
        result: "success",
        notes: exercise.success,
      });
      advanceModule("discrimination");
      setTimeout(() => {
        setSelectedDiscriminationChoice(null);
      }, 600);
    } else {
      setTrainingFeedback((prev) => ({ ...prev, discrimination: `💡 ${exercise.hint}` }));
      logAttempt({
        type: "training",
        activity: "تمييز الحروف",
        result: "retry",
        notes: exercise.hint,
      });
    }
  };

  const currentMatchingRound = matchingRounds[matchingState.roundIndex];

  const handleMatchingChoice = (option: MatchingOption) => {
    if (!currentMatchingRound) {
      return;
    }
    setSelectedMatchingOption(option.id);
    if (option.isCorrect) {
      setMatchingState((prev) => ({
        ...prev,
        feedback: `${currentMatchingRound.reward} ${option.description}`,
        score: prev.score + 1,
        canAdvance: true,
      }));
      logAttempt({
        type: "game",
        activity: "مطابقة الصوت بالصورة",
        result: "success",
        notes: `تم اختيار الصورة الصحيحة: ${option.label}`,
      });
    } else {
      setMatchingState((prev) => ({
        ...prev,
        feedback: `حاول مرة أخرى: ${currentMatchingRound.hint}`,
        canAdvance: false,
      }));
      logAttempt({
        type: "game",
        activity: "مطابقة الصوت بالصورة",
        result: "retry",
        notes: `اختيار غير مناسب: ${option.label}`,
      });
    }
  };

  const handleNextMatchingRound = () => {
    setMatchingState((prev) => {
      if (!prev.canAdvance) {
        return prev;
      }
      const nextIndex = prev.roundIndex + 1;
      if (nextIndex >= matchingRounds.length) {
        return {
          ...prev,
          feedback: "🎊 أنهيت جميع بطاقات المطابقة! استمر في الاستماع الجيد.",
          canAdvance: false,
        };
      }
      return {
        roundIndex: nextIndex,
        score: prev.score,
        feedback: "هيا للتحدي التالي! استمع جيداً قبل الاختيار.",
        canAdvance: false,
      };
    });
    setSelectedMatchingOption(null);
  };

  const currentAssemblyRound = assemblyRounds[assemblyState.roundIndex];

  const handleSelectAssemblyLetter = (letter: AssemblyLetter) => {
    if (!currentAssemblyRound) {
      return;
    }
    if (assemblyState.usedLetterIds.includes(letter.id)) {
      return;
    }
    const updatedSelected = [...assemblyState.selectedLetters, letter];
    const updatedUsed = [...assemblyState.usedLetterIds, letter.id];
    const attemptWord = updatedSelected.map((item) => item.char).join("");

    if (attemptWord === currentAssemblyRound.word) {
      setAssemblyState((prev) => ({
        ...prev,
        selectedLetters: updatedSelected,
        usedLetterIds: updatedUsed,
        feedback: `${currentAssemblyRound.reward} الكلمة مكتملة!` ,
        score: prev.score + 1,
      }));
      logAttempt({
        type: "game",
        activity: "تركيب الحروف",
        result: "success",
        notes: `تم تركيب كلمة ${currentAssemblyRound.word}`,
      });
      setTimeout(() => {
        setAssemblyState((prev) => {
          const nextIndex = prev.roundIndex + 1;
          const hasNext = nextIndex < assemblyRounds.length;
          return {
            roundIndex: hasNext ? nextIndex : prev.roundIndex,
            selectedLetters: [],
            usedLetterIds: [],
            feedback: hasNext
              ? "كلمة جديدة بانتظارك!"
              : "🌟 أنجزت جميع كلمات تركيب الحروف!",
            score: prev.score,
          };
        });
      }, 650);
    } else if (attemptWord.length === currentAssemblyRound.word.length) {
      setAssemblyState((prev) => ({
        ...prev,
        selectedLetters: updatedSelected,
        usedLetterIds: updatedUsed,
        feedback: `حاول مجدداً: ${currentAssemblyRound.hint}`,
      }));
      logAttempt({
        type: "game",
        activity: "تركيب الحروف",
        result: "retry",
        notes: `الكلمة الصحيحة: ${currentAssemblyRound.word}`,
      });
    } else {
      setAssemblyState((prev) => ({
        ...prev,
        selectedLetters: updatedSelected,
        usedLetterIds: updatedUsed,
        feedback: "تابع اختيار الحروف بترتيب هادئ.",
      }));
    }
  };

  const handleResetAssembly = () => {
    setAssemblyState((prev) => ({
      ...prev,
      selectedLetters: [],
      usedLetterIds: [],
      feedback: "لنرتب الحروف من جديد بخطوات ثابتة.",
    }));
  };

  const currentRapidWord = rapidWords[rapidState.currentIndex];

  const handleStartRapidGame = () => {
    setRapidState({
      isActive: true,
      currentIndex: 0,
      remainingSeconds: 25,
      score: 0,
      feedback: "انطلق! اقرأ الكلمات بصوت واضح قبل انتهاء الوقت.",
      finishedRound: false,
    });
    logAttempt({
      type: "game",
      activity: "تحدي النطق السريع",
      result: "info",
      notes: "بدأ الطفل تحدي السرعة لمدة 25 ثانية.",
    });
  };

  const handleRapidAttempt = (isCorrect: boolean) => {
    if (!rapidState.isActive || !currentRapidWord) {
      return;
    }
    if (isCorrect) {
      setRapidState((prev) => ({
        ...prev,
        score: prev.score + 1,
        currentIndex: (prev.currentIndex + 1) % rapidWords.length,
        feedback: currentRapidWord.encouragement,
      }));
      logAttempt({
        type: "game",
        activity: "تحدي النطق السريع",
        result: "success",
        notes: `كلمة ${currentRapidWord.word} نُطقت بنجاح`,
      });
    } else {
      setRapidState((prev) => ({
        ...prev,
        feedback: `حاول مجدداً: ${currentRapidWord.hint}`,
      }));
      logAttempt({
        type: "game",
        activity: "تحدي النطق السريع",
        result: "retry",
        notes: `كلمة ${currentRapidWord.word} تحتاج إعادة`,
      });
    }
  };

  const handleStopRapidGame = () => {
    setRapidState((prev) => ({
      ...prev,
      isActive: false,
      feedback: `تم إيقاف التحدي. حصلت على ${prev.score} نقطة مشجعة!`,
      finishedRound: true,
    }));
    logAttempt({
      type: "game",
      activity: "تحدي النطق السريع",
      result: "info",
      notes: "تم إيقاف التحدي قبل انتهاء الوقت.",
    });
  };

  const generateParentReport = () => {
    if (attemptHistory.length === 0) {
      setReportText("لم تبدأ المحاولات بعد. شجع طفلك على أول تمرين ممتع اليوم!");
      return;
    }
    const retryCount = attemptHistory.filter((record) => record.result === "retry").length;
    const trainingSuccess = attemptHistory.filter(
      (record) => record.type === "training" && record.result === "success",
    ).length;
    const challengingActivities = attemptHistory
      .filter((record) => record.result === "retry")
      .slice(0, 3)
      .map((record) => `- ${record.activity}: ${record.notes}`);
    const lines = [
      `📌 إجمالي المحاولات: ${totalAttempts}`,
      `✅ المحاولات الناجحة: ${successfulAttempts}`,
      `🔁 محاولات تحتاج متابعة: ${retryCount}`,
      `🎮 نقاط الألعاب الحالية: ${gamesScore}`,
      trainingProgress.letters.completed ? "🌟 تم إكمال جميع تمارين الحروف." : "",
      trainingProgress.words.completed ? "🌟 تم إكمال تمارين الكلمات والجمل." : "",
      trainingProgress.discrimination.completed
        ? "🌟 تم إتقان تمارين تمييز الحروف المتشابهة."
        : "",
      trainingSuccess === 0
        ? "شجع طفلك على إتمام تمرين واحد على الأقل اليوم."
        : "أحسنتم! واصلوا التدريب المنتظم للحفاظ على التقدم.",
      challengingActivities.length > 0
        ? `📝 ملاحظات سريعة:\n${challengingActivities.join("\n")}`
        : "",
    ].filter(Boolean);
    setReportText(lines.join("\n"));
  };

  const renderTrainingAudioControls = (module: TrainingModuleKey) => {
    const source = trainingAudioSources[module];
    const isRecording = recordingModule === module;
    const inputId = `training-audio-upload-${module}`;
    return (
      <div className="space-y-2 rounded-xl border border-slate-200 bg-white/80 p-3">
        <p className="text-xs font-semibold text-slate-600">أرسل أو سجل محاولة صوتية للتدريب.</p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => handleStartTrainingRecording(module)}
            className={isRecording ? "bg-rose-500 hover:bg-rose-600" : "bg-sky-500 hover:bg-sky-600"}
          >
            {isRecording ? "إيقاف التسجيل المباشر" : "تسجيل صوتي مباشر"}
          </Button>
          <label className="cursor-pointer rounded-md border border-dashed border-sky-300 px-3 py-2 text-sm text-sky-700 hover:bg-sky-50">
            رفع ملف صوتي
            <input
              id={inputId}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(event) => handleTrainingAudioUpload(module, event)}
            />
          </label>
          {source && (
            <Button type="button" variant="ghost" onClick={() => handleClearTrainingAudio(module)}>
              إزالة التسجيل
            </Button>
          )}
        </div>
        {isRecording && <p className="text-xs text-rose-600">🔴 جاري التسجيل... اضغط لإيقافه عند الانتهاء.</p>}
        {source && (
          <div className="space-y-1">
            <p className="text-xs text-slate-500">{source.label}</p>
            <audio controls src={source.url} className="w-full" />
          </div>
        )}
      </div>
    );
  };

  const renderRapidAudioControls = () => (
    <div className="space-y-2 rounded-xl border border-indigo-200 bg-white/80 p-3">
      <p className="text-xs font-semibold text-indigo-700">
        أرسل تسجيلك الخاص لتحدي النطق السريع واستمع إليه مع وليّ الأمر.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={handleRapidRecordingToggle}
          className={isRecordingRapid ? "bg-rose-500 hover:bg-rose-600" : "bg-indigo-500 hover:bg-indigo-600"}
        >
          {isRecordingRapid ? "إيقاف التسجيل المباشر" : "تسجيل صوتي مباشر"}
        </Button>
        <label className="cursor-pointer rounded-md border border-dashed border-indigo-300 px-3 py-2 text-sm text-indigo-700 hover:bg-indigo-50">
          رفع ملف صوتي
          <input type="file" accept="audio/*" className="hidden" onChange={handleRapidAudioUpload} />
        </label>
        {rapidAudioUrl && (
          <Button type="button" variant="ghost" onClick={handleClearRapidAudio}>
            إزالة التسجيل
          </Button>
        )}
      </div>
      {isRecordingRapid && <p className="text-xs text-rose-600">🔴 التسجيل قيد العمل... اضغط لإيقافه عند الانتهاء.</p>}
      {rapidUploadLoading && <p className="text-xs text-indigo-600">⏳ جاري تحميل الملف الصوتي...</p>}
      {rapidAudioUrl && (
        <div className="space-y-1">
          <audio controls src={rapidAudioUrl} className="w-full" />
        </div>
      )}
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Child Progress Overview */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{childData.name}</h2>
              <p className="text-green-100 mb-1">
                العمر: {childData.age} سنوات
              </p>
              <p className="text-green-100 mb-4">
                التشخيص: {childData.diagnosis}
              </p>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-green-100">التقدم العام</p>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={childData.overallProgress}
                      className="w-32 h-2"
                    />
                    <span className="text-lg font-bold">
                      {childData.overallProgress}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-6xl">👶</div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <Calendar className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {childData.completedSessions}/{childData.totalSessions}
            </div>
            <div className="text-sm text-blue-700">الجلسات المكتملة</div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-600 mb-1">
              +
              {Math.round(
                childData.overallProgress / childData.completedSessions,
              )}
              %
            </div>
            <div className="text-sm text-green-700">معدل التحسن</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6 text-center">
            <Star className="w-10 h-10 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {achievements.filter((a) => a.earned).length}
            </div>
            <div className="text-sm text-purple-700">الإنجازات</div>
          </CardContent>
        </Card>
      </div>

      {/* Next Appointment */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            الموعد القادم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">
                {childData.nextAppointment.type}
              </p>
              <p className="text-gray-600">
                {childData.nextAppointment.date} -{" "}
                {childData.nextAppointment.time}
              </p>
              <p className="text-sm text-gray-500">مع {childData.specialist}</p>
            </div>
            <div className="text-center">
              <Badge
                variant="outline"
                className="border-orange-500 text-orange-700"
              >
                قريباً
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            آخر الأنشطة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessionHistory.slice(0, 3).map((session) => (
              <div
                key={session.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
              >
                <div className="bg-blue-100 p-2 rounded-full">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{session.type}</p>
                  <p className="text-sm text-gray-600">
                    {session.date} - {session.duration}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {session.progress}%
                  </div>
                  <div className="text-xs text-gray-500">تقدم</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SessionsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>تاريخ الجلسات</CardTitle>
          <CardDescription>سجل مفصل بجميع الجلسات والأنشطة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sessionHistory.map((session) => (
              <Card key={session.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{session.type}</h3>
                      <p className="text-gray-600">
                        {session.date} - {session.duration}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${
                        session.progress >= 80
                          ? "border-green-500 text-green-700"
                          : session.progress >= 60
                            ? "border-yellow-500 text-yellow-700"
                            : "border-red-500 text-red-700"
                      }`}
                    >
                      {session.progress}% تقدم
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 mb-2">{session.notes}</p>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        الأنشطة:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {session.activities.map((activity, index) => (
                          <Badge key={index} variant="secondary">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Progress value={session.progress} className="flex-1 h-2" />
                    <span className="text-sm font-medium">
                      {session.progress}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ReportsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            التقارير الطبية
          </CardTitle>
          <CardDescription>
            التقارير والتقييمات من الأخصائي المعالج
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <Card
                key={report.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {report.title}
                        </h3>
                        <p className="text-gray-600 mb-2">{report.summary}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📅 {report.date}</span>
                          <span>👨‍⚕️ {report.specialist}</span>
                          <Badge variant="outline">{report.type}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 ml-2" />
                        عرض
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 ml-2" />
                        تحميل
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AchievementsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            إنجازات {childData.name}
          </CardTitle>
          <CardDescription>الإنجازات والأهداف المحققة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <Card
                key={index}
                className={`${
                  achievement.earned
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200 opacity-60"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3
                        className={`font-semibold ${
                          achievement.earned
                            ? "text-green-800"
                            : "text-gray-600"
                        }`}
                      >
                        {achievement.title}
                      </h3>
                      {achievement.earned ? (
                        <p className="text-sm text-green-600">
                          تم الحصول عليه في {achievement.date}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">
                          لم يتم تحقيقه بعد
                        </p>
                      )}
                    </div>
                    {achievement.earned && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const HomeFollowUpTab = () => {
    const currentLetterExercise = letterExercises[trainingProgress.letters.currentIndex];
    const currentWordExercise = wordExercises[trainingProgress.words.currentIndex];
    const currentDiscriminationExercise =
      discriminationExercises[trainingProgress.discrimination.currentIndex];
    const latestAttempts = attemptHistory.slice(0, 6);
    const activeMatchingRound = currentMatchingRound;
    const activeAssemblyRound = currentAssemblyRound;
    const activeRapidWord = currentRapidWord;
    const todayLabel = new Date().toLocaleDateString("ar-DZ", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    return (
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-sky-400 to-indigo-500 text-white">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-wide opacity-80">سلسلة التعلم</span>
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold">{learningStreak} يوم</div>
              <p className="text-sm opacity-85">نشاط متواصل حتى {todayLabel}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-600">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">ردود المساعد</span>
              </div>
              <div className="text-3xl font-bold text-indigo-700">{aiFeedbackCount}</div>
              <p className="text-sm text-indigo-600/80">رسائل صوتية ونصية مشجعة تم حفظها.</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600">
                <ThumbsUp className="w-5 h-5" />
                <span className="font-medium">نسبة النجاح</span>
              </div>
              <div className="text-3xl font-bold text-emerald-700">{successRate}%</div>
              <p className="text-sm text-emerald-600/80">كل نجاح يفتح مستوى أعلى للطفل.</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-600">
                <Trophy className="w-5 h-5" />
                <span className="font-medium">نقاط اللعب</span>
              </div>
              <div className="text-3xl font-bold text-amber-700">{gamesScore}</div>
              <p className="text-sm text-amber-600/80">نقاط تراكمية من الألعاب التعليمية الثلاث.</p>
            </CardContent>
          </Card>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-0 shadow-md bg-gradient-to-br from-sky-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-sky-700">
                  <Mic className="w-5 h-5" />
                  المساعد الذكي (نص + صوت)
                </CardTitle>
                <CardDescription>رسائل مشجعة وتحليل مبسط للنطق في كل لحظة.</CardDescription>
              </div>
              <Badge className="bg-sky-500 text-white">جاهز للمساعدة</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white rounded-xl border border-sky-100 p-4 space-y-3 max-h-72 overflow-y-auto">
                {assistantMessages.map((message) => {
                  const timeLabel = new Date(message.createdAt).toLocaleTimeString("ar-DZ", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const isAssistant = message.role === "assistant";
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                          isAssistant
                            ? "bg-sky-100 text-sky-900"
                            : "bg-indigo-500 text-white"
                        }`}
                      >
                        <p>{message.content}</p>
                        <span className="block text-xs mt-2 opacity-70 text-right">{timeLabel}</span>
                        {message.mediaLink && (
                          <a
                            href={message.mediaLink}
                            className="mt-1 block text-xs underline"
                          >
                            الاستماع للتسجيل
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    type="button"
                    variant="secondary"
                    onClick={() => setAssistantInput(prompt)}
                    className="bg-sky-100 text-sky-700 hover:bg-sky-200"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>

              <div className="space-y-2 rounded-xl border border-sky-200 bg-white/80 p-3">
                <p className="text-xs font-semibold text-sky-700">
                  سجّل رسالة صوتية حقيقية أو ارفع ملفاً ليقوم المساعد بتحليل النطق.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={handleAssistantRecordingToggle}
                    className={isRecordingAssistant ? "bg-rose-500 hover:bg-rose-600" : "bg-sky-500 hover:bg-sky-600"}
                  >
                    {isRecordingAssistant ? "إيقاف التسجيل المباشر" : "تسجيل صوتي مباشر"}
                  </Button>
                  <label className="cursor-pointer rounded-md border border-dashed border-sky-300 px-3 py-2 text-sm text-sky-700 hover:bg-sky-50">
                    رفع ملف صوتي
                    <input type="file" accept="audio/*" className="hidden" onChange={handleAssistantAudioSelect} />
                  </label>
                  {isRecordingAssistant && (
                    <Button type="button" variant="ghost" onClick={handleStopAssistantRecordingEarly}>
                      حفظ التسجيل الحالي
                    </Button>
                  )}
                </div>
                {isRecordingAssistant && (
                  <p className="text-xs text-rose-600">🔴 جاري التسجيل... عند الانتهاء اضغط إيقاف للحفظ.</p>
                )}
                {assistantUploading && (
                  <p className="text-xs text-sky-600">⏳ يتم معالجة الملف الصوتي المرفوع...</p>
                )}
              </div>

              <form onSubmit={handleAssistantSubmit} className="space-y-3">
                <Textarea
                  placeholder="اكتب سؤالك أو اطلب نصيحة للنطق هنا..."
                  value={assistantInput}
                  onChange={(event) => setAssistantInput(event.target.value)}
                  className="min-h-[90px] border-sky-200 focus-visible:ring-sky-400"
                />
                <div className="flex flex-wrap gap-3">
                  <Button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white">
                    أرسل الرسالة
                  </Button>
                  <Button type="button" variant="outline" onClick={handleMockVoiceSave}>
                    حفظ تسجيل صوتي (محاكاة)
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-600">
                <BellRing className="w-5 h-5" />
                التسجيلات والإشعارات
              </CardTitle>
              <CardDescription>سجل سريع للتسجيلات الصوتية والتنبيهات اليومية.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 space-y-3">
                <h3 className="text-sm font-semibold text-emerald-700">
                  التسجيلات الصوتية المحفوظة
                </h3>
                {savedVoiceNotes.length === 0 ? (
                  <p className="text-sm text-emerald-600">لم يتم حفظ تسجيلات بعد.</p>
                ) : (
                  <div className="space-y-2">
                    {savedVoiceNotes.map((note) => (
                      <div
                        key={note.id}
                        className="flex items-center justify-between rounded-lg border border-emerald-100 bg-white px-3 py-2 text-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-700">{note.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(note.createdAt).toLocaleString("ar-DZ")}
                          </p>
                        </div>
                        <a
                          href={note.url}
                          className="text-xs text-emerald-700 underline"
                        >
                          الاستماع
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {derivedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-xl border px-3 py-2 text-sm shadow-sm ${
                      notification.type === "success"
                        ? "border-emerald-200 bg-emerald-50"
                        : notification.type === "warning"
                          ? "border-amber-200 bg-amber-50"
                          : "border-sky-200 bg-sky-50"
                    }`}
                  >
                    {notification.message}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-600">
              <BookOpen className="w-5 h-5" /> خطة التدريب اليومية
            </CardTitle>
            <CardDescription>
              الانتقال التدريجي بين المستويات مع منع الانتقال قبل الإجابة الصحيحة.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-white to-sky-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-sky-500/20 text-sky-700">تمارين الحروف</Badge>
                  <Badge variant="outline">{currentLetterExercise ? levelLabels[currentLetterExercise.level] : "منجز"}</Badge>
                </div>
                {trainingProgress.letters.completed || !currentLetterExercise ? (
                  <p className="text-sm text-sky-700">
                    🎉 تم إكمال جميع تمارين الحروف. استمر في المراجعة للحفاظ على الدقة.
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-gray-700">{currentLetterExercise.prompt}</p>
                    <Input
                      value={trainingInputs.letters}
                      onChange={(event) =>
                        setTrainingInputs((prev) => ({ ...prev, letters: event.target.value }))
                      }
                      placeholder="اكتب الحرف كما نطقته"
                      className="border-sky-200 focus-visible:ring-sky-400"
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={handleLettersSubmit} className="bg-sky-500 text-white">
                        تقييم النطق
                      </Button>
                      <Button type="button" variant="ghost" onClick={handleLettersReset}>
                        إعادة المحاولة
                      </Button>
                    </div>
                  </>
                )}
                <p className="text-sm text-sky-700 min-h-[20px]">{trainingFeedback.letters}</p>
                <p className="text-xs text-gray-500">
                  لن ينتقل الطفل للمستوى التالي إلا بعد إجابة صحيحة واحدة على الأقل.
                </p>
                {renderTrainingAudioControls("letters")}
              </div>

              <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-white to-purple-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-500/20 text-purple-700">الكلمات والجمل</Badge>
                  <Badge variant="outline">{currentWordExercise ? levelLabels[currentWordExercise.level] : "منجز"}</Badge>
                </div>
                {trainingProgress.words.completed || !currentWordExercise ? (
                  <p className="text-sm text-purple-700">
                    🌟 أُنجزت جميع الجمل المستهدفة. يمكن تكرار المراجعة بصوت عالٍ يومياً.
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-gray-700">{currentWordExercise.prompt}</p>
                    <Textarea
                      value={trainingInputs.words}
                      onChange={(event) =>
                        setTrainingInputs((prev) => ({ ...prev, words: event.target.value }))
                      }
                      placeholder="دوّن ما قلته أو ما سمعته من طفلك"
                      className="min-h-[70px] border-purple-200 focus-visible:ring-purple-400"
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={handleWordsSubmit} className="bg-purple-500 text-white">
                        تقييم الجملة
                      </Button>
                      <Button type="button" variant="ghost" onClick={handleWordsReset}>
                        إعادة المحاولة
                      </Button>
                    </div>
                  </>
                )}
                <p className="text-sm text-purple-700 min-h-[20px]">{trainingFeedback.words}</p>
                <p className="text-xs text-gray-500">التشجيع اللطيف يساعد الطفل على التقدم بثقة.</p>
                {renderTrainingAudioControls("words")}
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-emerald-500/20 text-emerald-700">تمييز الحروف</Badge>
                  <Badge variant="outline">
                    {currentDiscriminationExercise
                      ? levelLabels[currentDiscriminationExercise.level]
                      : "منجز"}
                  </Badge>
                </div>
                {trainingProgress.discrimination.completed || !currentDiscriminationExercise ? (
                  <p className="text-sm text-emerald-700">
                    ✅ تم إتقان أصوات الحروف المتشابهة. حافظ على مهارة الاستماع اليومي.
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-gray-700">{currentDiscriminationExercise.prompt}</p>
                    <div className="flex gap-2">
                      {[currentDiscriminationExercise.optionA, currentDiscriminationExercise.optionB].map((option) => {
                        const isSelected = selectedDiscriminationChoice === option;
                        const isCorrect = option === currentDiscriminationExercise.correct;
                        return (
                          <Button
                            key={option}
                            type="button"
                            onClick={() => handleDiscriminationChoice(option)}
                            className={`flex-1 ${
                              isSelected
                                ? isCorrect
                                  ? "bg-emerald-500 text-white"
                                  : "bg-amber-500 text-white"
                                : ""
                            }`}
                            variant={isSelected ? "default" : "outline"}
                          >
                            {option}
                          </Button>
                        );
                      })}
                    </div>
                  </>
                )}
                <p className="text-sm text-emerald-700 min-h-[20px]">{trainingFeedback.discrimination}</p>
                <p className="text-xs text-gray-500">الاستماع الدقيق يساعد على بناء قراءة سليمة.</p>
                {renderTrainingAudioControls("discrimination")}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Gamepad2 className="w-5 h-5" /> مطابقة الصوت بالصورة
              </CardTitle>
              <CardDescription>
                استمع للكلمة واختَر الصورة المناسبة للمساعدة في الدمج السمعي والبصري.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeMatchingRound ? (
                <>
                  <p className="text-sm text-gray-700">{activeMatchingRound.prompt}</p>
                  <p className="text-xs text-gray-500">{activeMatchingRound.narration}</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {activeMatchingRound.options.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleMatchingChoice(option)}
                        className={`rounded-xl border-2 p-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                          selectedMatchingOption === option.id
                            ? option.isCorrect
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-amber-500 bg-amber-50"
                            : "border-transparent bg-white hover:border-orange-300"
                        }`}
                      >
                        <img
                          src={option.image}
                          alt={option.label}
                          className="h-24 w-full rounded-lg object-contain"
                        />
                        <div className="mt-2 font-semibold text-gray-700">{option.label}</div>
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      onClick={handleNextMatchingRound}
                      disabled={!matchingState.canAdvance}
                      className="bg-orange-500 text-white disabled:opacity-40"
                    >
                      التحدي التالي
                    </Button>
                    <span className="text-sm text-orange-700">{matchingState.feedback}</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-700">🎉 أنهيت جميع بطاقات المطابقة!</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-rose-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rose-600">
                <Zap className="w-5 h-5" /> تركيب الحروف
              </CardTitle>
              <CardDescription>
                كوِّن الكلمة المسموعة بترتيب صحيح لتقوية الربط بين السمع والكتابة.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeAssemblyRound ? (
                <>
                  <p className="text-sm text-gray-700">أكمل كلمة: {activeAssemblyRound.word.length} حروف</p>
                  <div className="flex flex-wrap gap-2 min-h-[40px]">
                    {assemblyState.selectedLetters.map((letter) => (
                      <span
                        key={letter.id}
                        className="rounded-full bg-rose-500/20 px-3 py-1 text-sm text-rose-700"
                      >
                        {letter.char}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {activeAssemblyRound.scrambled.map((letter) => (
                      <Button
                        key={letter.id}
                        type="button"
                        onClick={() => handleSelectAssemblyLetter(letter)}
                        disabled={assemblyState.usedLetterIds.includes(letter.id)}
                        variant={assemblyState.usedLetterIds.includes(letter.id) ? "secondary" : "outline"}
                      >
                        {letter.char}
                      </Button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="ghost" onClick={handleResetAssembly}>
                      إعادة الترتيب
                    </Button>
                  </div>
                  <p className="text-sm text-rose-700">{assemblyState.feedback}</p>
                </>
              ) : (
                <p className="text-sm text-rose-700">🌈 جميع كلمات تركيب الحروف مكتملة بنجاح.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600">
                <Play className="w-5 h-5" /> تحدي النطق السريع
              </CardTitle>
              <CardDescription>
                كلمات متتابعة تتطلب نطقاً واضحاً قبل انتهاء الوقت المحدد.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>الوقت المتبقي: {rapidState.remainingSeconds} ثانية</span>
                <Badge variant="outline" className="border-purple-300 text-purple-700">
                  النقاط: {rapidState.score}
                </Badge>
              </div>
              {rapidState.isActive && activeRapidWord ? (
                <>
                  <div className="rounded-xl bg-white border border-purple-200 px-4 py-5 text-center">
                    <p className="text-2xl font-bold text-purple-700">{activeRapidWord.word}</p>
                    <p className="text-xs text-gray-500 mt-2">{activeRapidWord.hint}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      onClick={() => handleRapidAttempt(true)}
                      className="bg-emerald-500 text-white"
                    >
                      نطق صحيح
                    </Button>
                    <Button type="button" variant="outline" onClick={() => handleRapidAttempt(false)}>
                      أحتاج تلميحاً
                    </Button>
                    <Button type="button" variant="ghost" onClick={handleStopRapidGame}>
                      إنهاء مبكر
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    {rapidState.feedback || "ابدأ التحدي واجمع أكبر عدد من النقاط خلال الوقت المحدد."}
                  </p>
                  <Button
                    type="button"
                    onClick={handleStartRapidGame}
                    className="bg-purple-500 text-white"
                  >
                    ابدأ التحدي
                  </Button>
                </div>
              )}
              {rapidState.isActive ? (
                <p className="text-sm text-purple-600">{rapidState.feedback}</p>
              ) : null}
              {!rapidState.isActive && rapidState.finishedRound ? (
                <p className="text-sm text-purple-600">{rapidState.feedback}</p>
              ) : null}
              {renderRapidAudioControls()}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-600">
                <Target className="w-5 h-5" /> سجل المحاولات الحديثة
              </CardTitle>
              <CardDescription>متابعة دقيقة لكل محاولة مع نتيجتها الدقيقة.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {latestAttempts.length === 0 ? (
                <p className="text-sm text-gray-600">لم يتم تسجيل محاولات بعد.</p>
              ) : (
                latestAttempts.map((record) => (
                  <div
                    key={record.id}
                    className="rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{record.activity}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(record.timestamp).toLocaleString("ar-DZ")}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`border-2 ${
                          record.result === "success"
                            ? "border-emerald-300 text-emerald-700"
                            : record.result === "retry"
                              ? "border-amber-300 text-amber-700"
                              : "border-sky-300 text-sky-700"
                        }`}
                      >
                        {record.result === "success"
                          ? "صحيح"
                          : record.result === "retry"
                            ? "حاول مجدداً"
                            : "معلومة"}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-gray-600">{record.notes}</p>
                    {record.mediaLink && (
                      <a href={record.mediaLink} className="text-xs text-sky-600 underline">
                        رابط التسجيل الصوتي
                      </a>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-600">
                <Database className="w-5 h-5" /> تقرير ولي الأمر النصي
              </CardTitle>
              <CardDescription>
                ملخص سريع عن المحاولات الناجحة، التمارين المتكررة، والكلمات التي تحتاج دعماً إضافياً.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <Button onClick={generateParentReport} className="bg-indigo-500 text-white">
                  توليد تقرير التقدم
                </Button>
              </div>
              {reportText && (
                <pre className="whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
                  {reportText}
                </pre>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const CognitiveTestsTab = () => (
    <div className="space-y-6">
      {/* الاختبارات التشخيصية */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-pink-600" />
            الاختبارات التشخيصية
          </CardTitle>
          <CardDescription>
            ألعاب نظرية العقل وأدوات التقييم التشخيصي الشاملة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Button
              onClick={() => navigate("/diagnostic-tests")}
              className="h-32 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white flex flex-col items-center justify-center gap-3"
            >
              <div className="text-3xl">🧠</div>
              <div className="text-center">
                <div className="font-semibold">ألعاب نظرية العقل</div>
                <div className="text-xs opacity-80">9 ألعاب ت��خيصية</div>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/diagnostic-tests")}
              className="h-32 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white flex flex-col items-center justify-center gap-3"
            >
              <div className="text-3xl">📋</div>
              <div className="text-center">
                <div className="font-semibold">ورقة الاستجابة</div>
                <div className="text-xs opacity-80">تحليل وتفسير النتائج</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* المكتسبات القبلية والمجموعة الضمنية */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-green-600" />
            المكتسبات الأساسية
          </CardTitle>
          <CardDescription>المكتسبات القبلية والمجموعة الضمنية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Button
              onClick={() => navigate("/pre-basic-acquisitions")}
              className="h-32 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white flex flex-col items-center justify-center gap-3"
            >
              <div className="text-3xl">🎨</div>
              <div className="text-center">
                <div className="font-semibold">المكتسبات القبلية</div>
                <div className="text-xs opacity-80">
                  الألوان، الأرقام، الجسم، الجانبية
                </div>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/implicit-group")}
              className="h-32 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white flex flex-col items-center justify-center gap-3"
            >
              <div className="text-3xl">🗂️</div>
              <div className="text-center">
                <div className="font-semibold">المجموعة الضمنية</div>
                <div className="text-xs opacity-80">
                  الفواكه، الخضر، المواصلات، الطيور
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* تمارين الإدراك والانتباه ��الذاكرة */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-orange-600" />
            التمارين المعرفية المتقدمة
          </CardTitle>
          <CardDescription>
            تمارين الإدراك البصري والانتباه والذاكرة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Button
              onClick={() => navigate("/perceptual-exercises")}
              className="h-32 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white flex flex-col items-center justify-center gap-3"
            >
              <div className="text-3xl">👁️</div>
              <div className="text-center">
                <div className="font-semibold">الإدراك البصري</div>
                <div className="text-xs opacity-80">3 مراحل متدرجة</div>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/attention-exercises")}
              className="h-32 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white flex flex-col items-center justify-center gap-3"
            >
              <div className="text-3xl">🎯</div>
              <div className="text-center">
                <div className="font-semibold">تمارين الانتباه</div>
                <div className="text-xs opacity-80">3 أنواع انتباه</div>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/memory-exercises")}
              className="h-32 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white flex flex-col items-center justify-center gap-3"
            >
              <div className="text-3xl">🧠</div>
              <div className="text-center">
                <div className="font-semibold">تمارين الذاكرة</div>
                <div className="text-xs opacity-80">سمعية وبصرية</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* تمارين الإدراك المعرفية */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            تمارين الإدراك المعرفية
          </CardTitle>
          <CardDescription>
            تمارين تفاعلية لتطوير مهارات الإدراك والتعرف على الأشياء
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Button
              onClick={() => navigate("/cognitive-tests")}
              className="h-24 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white flex flex-col items-center justify-center gap-2"
            >
              <div className="text-2xl">🍎</div>
              <span>الفواكه</span>
            </Button>
            <Button
              onClick={() => navigate("/cognitive-tests")}
              className="h-24 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white flex flex-col items-center justify-center gap-2"
            >
              <div className="text-2xl">🥕</div>
              <span>الخضروات</span>
            </Button>
            <Button
              onClick={() => navigate("/cognitive-tests")}
              className="h-24 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white flex flex-col items-center justify-center gap-2"
            >
              <div className="text-2xl">👕</div>
              <span>الملابس</span>
            </Button>
            <Button
              onClick={() => navigate("/cognitive-tests")}
              className="h-24 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white flex flex-col items-center justify-center gap-2"
            >
              <div className="text-2xl">🐘</div>
              <span>الحيوانات</span>
            </Button>
            <Button
              onClick={() => navigate("/cognitive-tests")}
              className="h-24 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white flex flex-col items-center justify-center gap-2"
            >
              <div className="text-2xl">🚗</div>
              <span>المركبات</span>
            </Button>
            <Button
              onClick={() => navigate("/cognitive-tests")}
              className="h-24 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white flex flex-col items-center justify-center gap-2"
            >
              <div className="text-2xl">🧠</div>
              <span>المطابقة الذكية</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* إحصائيات التقدم */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              التقدم الشهري في التمارين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cognitiveTestsProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  axisLine={true}
                  tickLine={true}
                  type="category"
                  orientation="bottom"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  axisLine={true}
                  tickLine={true}
                  type="number"
                  orientation="left"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="fruits"
                  stroke="#ff6b6b"
                  strokeWidth={2}
                  name="الفواكه"
                />
                <Line
                  type="monotone"
                  dataKey="vegetables"
                  stroke="#4ecdc4"
                  strokeWidth={2}
                  name="الخضروات"
                />
                <Line
                  type="monotone"
                  dataKey="clothes"
                  stroke="#45b7d1"
                  strokeWidth={2}
                  name="الملابس"
                />
                <Line
                  type="monotone"
                  dataKey="animals"
                  stroke="#96ceb4"
                  strokeWidth={2}
                  name="الحيوانات"
                />
                <Line
                  type="monotone"
                  dataKey="vehicles"
                  stroke="#ffeaa7"
                  strokeWidth={2}
                  name="المركبات"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              نسب النجاح الحالية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart width="100%" height="100%">
                <Pie
                  data={testCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  startAngle={0}
                  endAngle={360}
                  innerRadius={0}
                >
                  {testCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const GeographicalChartTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            الإحصائيات الجغرا��ية للجمهورية الجزائرية الديمقراطية الشعبية
          </CardTitle>
          <CardDescription>
            توزيع المرضى ونسب النجاح ح��ب الولايات
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* مخطط المرضى حسب الولايات */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  عدد المرضى حسب الولاية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={geographicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="region"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      axisLine={true}
                      tickLine={true}
                      type="category"
                      orientation="bottom"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={true}
                      tickLine={true}
                      type="number"
                      orientation="left"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey="patients" fill="#4f46e5" name="عدد المرضى" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* مخطط نسب النجاح */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  نسب النجاح حسب الولاية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={geographicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="region"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      axisLine={true}
                      tickLine={true}
                      type="category"
                      orientation="bottom"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={true}
                      tickLine={true}
                      type="number"
                      orientation="left"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="success"
                      fill="#10b981"
                      name="نسبة النجاح %"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* جدول الإحصائيات التفصيلية */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>الإحصائيات التفصيلية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-3">الولاية</th>
                      <th className="text-right p-3">عدد المرضى</th>
                      <th className="text-right p-3">إجمالي الحالات</th>
                      <th className="text-right p-3">نسبة النجاح</th>
                      <th className="text-right p-3">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {geographicalData.map((row, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">🏛️ {row.region}</td>
                        <td className="p-3">{row.patients}</td>
                        <td className="p-3">{row.cases}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={row.success}
                              className="flex-1 h-2"
                            />
                            <span className="text-sm font-medium">
                              {row.success}%
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge
                            variant="outline"
                            className={`${
                              row.success >= 85
                                ? "border-green-500 text-green-700"
                                : row.success >= 75
                                  ? "border-yellow-500 text-yellow-700"
                                  : "border-red-500 text-red-700"
                            }`}
                          >
                            {row.success >= 85
                              ? "ممتاز"
                              : row.success >= 75
                                ? "جيد"
                                : "يحتاج تحسن"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* إحصائيات عامة */}
          <div className="grid md:grid-cols-4 gap-4 mt-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {geographicalData.reduce(
                    (sum, region) => sum + region.patients,
                    0,
                  )}
                </div>
                <div className="text-sm text-blue-700">إجمالي المرضى</div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(
                    geographicalData.reduce(
                      (sum, region) => sum + region.success,
                      0,
                    ) / geographicalData.length,
                  )}
                  %
                </div>
                <div className="text-sm text-green-700">متوسط النجاح</div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {geographicalData.length}
                </div>
                <div className="text-sm text-purple-700">الولايات المغطاة</div>
              </CardContent>
            </Card>
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {geographicalData.reduce(
                    (sum, region) => sum + region.cases,
                    0,
                  )}
                </div>
                <div className="text-sm text-orange-700">إجمالي الحالات</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50"
      dir="rtl"
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("isLoggedIn");
                  localStorage.removeItem("userType");
                  localStorage.removeItem("userEmail");
                  navigate("/");
                }}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                تسجيل الخروج
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-3 rounded-xl">
                  <Baby className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Ortho Smart
                  </h1>
                  <p className="text-gray-600">لوحة تحكم ولي الطفل</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-semibold text-gray-800">
                  {parentData?.fullName || "ولي الطفل"}
                </p>
                <p className="text-sm text-gray-600">
                  {parentData?.state || "المنطقة"}
                </p>
              </div>
              <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-semibold">
                {parentData?.fullName?.charAt(0) || "و"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          {/* Tabs Navigation */}
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <TabsList className="grid grid-cols-7 w-full">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                نظرة عامة
              </TabsTrigger>
              <TabsTrigger
                value="home-follow-up"
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                المتابعة المنزلية
              </TabsTrigger>
              <TabsTrigger
                value="cognitive"
                className="flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                التمارين المعرفية
              </TabsTrigger>
              <TabsTrigger value="sessions" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                الجلسات
              </TabsTrigger>
              <TabsTrigger
                value="geography"
                className="flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                المخطط الجغرافي
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                التقارير
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                الإنجازات
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="home-follow-up">
            <HomeFollowUpTab />
          </TabsContent>

          <TabsContent value="cognitive">
            <CognitiveTestsTab />
          </TabsContent>

          <TabsContent value="sessions">
            <SessionsTab />
          </TabsContent>

          <TabsContent value="geography">
            <GeographicalChartTab />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsTab />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
