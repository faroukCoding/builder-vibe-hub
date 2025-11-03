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
  Bot,
  Volume2,
  VolumeX,
  Send,
  Loader2,
  Mic,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AssistantChatRequest,
  AssistantChatResponse,
  AssistantHistoryResponse,
  DailyTrainingSummaryResponse,
  EducationalGamesResponse,
} from "@shared/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

type AssistantMessage = AssistantHistoryResponse["messages"][number];

const fetchAssistantPreview = async (): Promise<AssistantHistoryResponse> => {
  const params = new URLSearchParams({ limit: "12" });
  const response = await fetch(`/api/ai-assistant/history?${params.toString()}`);
  if (!response.ok) {
    throw new Error("تعذر تحميل محادثات المساعد الذكي");
  }
  return response.json();
};

const sendAssistantChat = async (
  payload: AssistantChatRequest,
): Promise<AssistantChatResponse> => {
  const response = await fetch("/api/ai-assistant/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("تعذر إرسال الرسالة إلى المساعد");
  }

  return response.json();
};

const fetchDailyTrainingSummary = async (): Promise<DailyTrainingSummaryResponse> => {
  const response = await fetch("/api/daily-training");
  if (!response.ok) {
    throw new Error("تعذر تحميل بيانات التدريب اليومي");
  }
  return response.json();
};

const fetchEducationalGamesSummary = async (): Promise<EducationalGamesResponse> => {
  const response = await fetch("/api/educational-games");
  if (!response.ok) {
    throw new Error("تعذر تحميل بيانات الألعاب التعليمية");
  }
  return response.json();
};

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

      <Card className="border-dashed border-2 border-emerald-200 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            الأدوات الذكية لطفلك
          </CardTitle>
          <CardDescription>
            الوصول السريع للمساعد الذكي، التدريب اليومي، والألعاب التعليمية بالصور والصوت.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              onClick={() => navigate("/ai-assistant")}
              className="relative h-32 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500/90 via-purple-500/80 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white shadow-sm"
            >
              <img
                src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80"
                alt="مساعد ذكاء اصطناعي يساعد الأسرة"
                className="absolute inset-0 h-full w-full object-cover opacity-30"
                loading="lazy"
              />
              <div className="relative z-10 flex h-full w-full flex-col items-start justify-between text-right">
                <div className="flex w-full items-center justify-between">
                  <div className="rounded-full bg-white/20 p-2">
                    <Bot className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
                    دردشة صوتية
                  </span>
                </div>
                <div>
                  <p className="text-lg font-semibold">المساعد الذكي</p>
                  <p className="text-xs text-white/80">
                    تحدث، استمع، واحصل على نصائح مخصصة فوراً
                  </p>
                </div>
              </div>
            </Button>

            <Button
              onClick={() => navigate("/daily-training")}
              className="relative h-32 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/90 via-teal-500/80 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white shadow-sm"
            >
              <img
                src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80"
                alt="تدريب يومي تفاعلي للأطفال"
                className="absolute inset-0 h-full w-full object-cover opacity-30"
                loading="lazy"
              />
              <div className="relative z-10 flex h-full w-full flex-col items-start justify-between text-right">
                <div className="flex w-full items-center justify-between">
                  <div className="rounded-full bg-white/20 p-2">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
                    خطة مرئية
                  </span>
                </div>
                <div>
                  <p className="text-lg font-semibold">التدريب اليومي</p>
                  <p className="text-xs text-white/80">
                    جداول صوتية وصور تحفيزية لكل تمرين
                  </p>
                </div>
              </div>
            </Button>

            <Button
              onClick={() => navigate("/educational-games")}
              className="relative h-32 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500/90 via-pink-500/80 to-orange-600 hover:from-orange-600 hover:to-pink-600 text-white shadow-sm"
            >
              <img
                src="https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=600&q=80"
                alt="ألعاب تعليمية للأطفال"
                className="absolute inset-0 h-full w-full object-cover opacity-30"
                loading="lazy"
              />
              <div className="relative z-10 flex h-full w-full flex-col items-start justify-between text-right">
                <div className="flex w-full items-center justify-between">
                  <div className="rounded-full bg-white/20 p-2">
                    <Gamepad2 className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
                    صور ملونة
                  </span>
                </div>
                <div>
                  <p className="text-lg font-semibold">الألعاب التعليمية</p>
                  <p className="text-xs text-white/80">
                    أنشطة ممتعة مع بطاقات وصوتيات محفزة
                  </p>
                </div>
              </div>
            </Button>
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

  const SmartToolsTab = () => {
    const queryClient = useQueryClient();
    const [inputValue, setInputValue] = useState("");
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [messages, setMessages] = useState<AssistantMessage[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const trainingAudioRef = useRef<HTMLAudioElement | null>(null);

    const {
      data: assistantData,
      isLoading: assistantLoading,
      error: assistantError,
      isFetching: assistantRefetching,
    } = useQuery({
      queryKey: ["assistant-preview"],
      queryFn: fetchAssistantPreview,
      refetchInterval: 60_000,
    });

    useEffect(() => {
      if (assistantData?.messages) {
        setMessages(assistantData.messages.slice(-8));
      }
    }, [assistantData?.messages]);

    useEffect(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, [messages]);

    useEffect(() => {
      if (!voiceEnabled || messages.length === 0) return;
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role !== "assistant") return;
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      const utterance = new SpeechSynthesisUtterance(lastMessage.content);
      utterance.lang = "ar-DZ";
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find((voice) => voice.lang.startsWith("ar"));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }, [messages, voiceEnabled]);

    const sendMessageMutation = useMutation({
      mutationFn: sendAssistantChat,
      onSuccess: (response, variables) => {
        const parentMessage: AssistantMessage = {
          id: `parent-preview-${Date.now()}`,
          role: "parent",
          timestamp: new Date().toISOString(),
          content: variables.message,
        };
        const assistantMessage: AssistantMessage = {
          id: `assistant-preview-${Date.now()}`,
          role: "assistant",
          timestamp: new Date().toISOString(),
          content: response.reply,
          suggestedActions: response.suggestedActions,
        };
        setMessages((prev) => [...prev, parentMessage, assistantMessage].slice(-12));
        setInputValue("");
        queryClient.invalidateQueries({ queryKey: ["assistant-preview"] });
      },
    });

    const handleSendMessage = () => {
      const trimmed = inputValue.trim();
      if (!trimmed || sendMessageMutation.isLoading) return;
      sendMessageMutation.mutate({ message: trimmed } as AssistantChatRequest);
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    };

    const {
      data: trainingData,
      isLoading: trainingLoading,
      error: trainingError,
    } = useQuery({
      queryKey: ["daily-training-summary"],
      queryFn: fetchDailyTrainingSummary,
      staleTime: 60_000,
      refetchInterval: 120_000,
    });

    const {
      data: gamesData,
      isLoading: gamesLoading,
      error: gamesError,
    } = useQuery({
      queryKey: ["educational-games-summary"],
      queryFn: fetchEducationalGamesSummary,
      staleTime: 60_000,
      refetchInterval: 120_000,
    });

    const upcomingExercises = useMemo(
      () => trainingData?.exercises?.slice(0, 3) ?? [],
      [trainingData],
    );

    const topGames = useMemo(() => gamesData?.games?.slice(0, 2) ?? [], [gamesData]);

    const motivationalAudioUrl =
      "https://cdn.pixabay.com/download/audio/2022/05/04/audio_c38986864c.mp3?filename=positive-morning-112190.mp3";

    const handlePlayTrainingAudio = () => {
      if (trainingAudioRef.current) {
        trainingAudioRef.current.currentTime = 0;
        void trainingAudioRef.current.play();
      }
    };

    const gameImages = [
      "https://images.unsplash.com/photo-1508948956644-0017e845d797?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=80",
    ];

    return (
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Card className="flex flex-col">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-indigo-500" />
                  المساعد الذكي Ortho AI
                </CardTitle>
                <CardDescription>
                  دردش مع المساعد، استمع للردود الصوتية، وشاهد المقترحات السريعة.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVoiceEnabled((prev) => !prev)}
                  className="gap-2"
                >
                  {voiceEnabled ? (
                    <>
                      <VolumeX className="h-4 w-4" />
                      إيقاف الصوت
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4" />
                      تشغيل الصوت
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/ai-assistant")}
                  className="gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  فتح النافذة الكاملة
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              {assistantError && (
                <Alert variant="destructive">
                  <AlertTitle>تعذر تحميل المحادثات</AlertTitle>
                  <AlertDescription>{(assistantError as Error).message}</AlertDescription>
                </Alert>
              )}
              <div className="flex-1">
                {assistantLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                  </div>
                ) : (
                  <div
                    ref={chatContainerRef}
                    className="flex h-64 flex-col gap-3 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    {messages.length === 0 ? (
                      <p className="mt-6 text-center text-sm text-slate-500">
                        لا توجد رسائل بعد، ابدأ محادثة جديدة مع المساعد الذكي.
                      </p>
                    ) : (
                      messages.map((message) => {
                        const isAssistant = message.role === "assistant";
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                                isAssistant
                                  ? "bg-white border border-slate-100 text-slate-700"
                                  : "bg-indigo-500 text-white"
                              }`}
                            >
                              <div className="mb-2 flex items-center justify-between text-xs opacity-70">
                                <span className="flex items-center gap-1">
                                  {isAssistant ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                                  {isAssistant ? "المساعد" : "ولي الطفل"}
                                </span>
                                <span>
                                  {new Date(message.timestamp).toLocaleTimeString("ar-DZ", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {message.content}
                              </p>
                              {message.suggestedActions && message.suggestedActions.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {message.suggestedActions.map((action) => (
                                    <Badge
                                      key={action}
                                      variant={isAssistant ? "secondary" : "outline"}
                                      className="text-xs"
                                    >
                                      {action}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
              {assistantRefetching && (
                <p className="text-right text-xs text-slate-400">يتم تحديث المحادثة...</p>
              )}
              {sendMessageMutation.isError && (
                <Alert variant="destructive">
                  <AlertTitle>تعذر إرسال الرسالة</AlertTitle>
                  <AlertDescription>
                    {(sendMessageMutation.error as Error).message}
                  </AlertDescription>
                </Alert>
              )}
              <Textarea
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleInputKeyDown}
                rows={3}
                placeholder="اكتب سؤالك ليقترح المساعد تمارين، ألعاب، أو نصائح... (Enter للإرسال، Shift+Enter لسطر جديد)"
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handlePlayTrainingAudio}
                  >
                    <Mic className="h-4 w-4" />
                    تشغيل رسالة تشجيعية
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || sendMessageMutation.isLoading}
                  className="flex items-center gap-2"
                >
                  {sendMessageMutation.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  إرسال
                </Button>
              </div>
              <audio
                ref={trainingAudioRef}
                src={motivationalAudioUrl}
                preload="auto"
                className="hidden"
              />
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card className="overflow-hidden border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-500" />
                  لمحة عن التدريب اليومي
                </CardTitle>
                <CardDescription>
                  مؤشرات سريعة مع صور محفزة ومقاطع صوتية لدعم الطفل.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
                    alt="طفل يتدرب بمساعدة أحد الوالدين"
                    className="h-40 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-emerald-900/30" />
                </div>
                {trainingLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-20" />
                  </div>
                ) : trainingError ? (
                  <Alert variant="destructive">
                    <AlertTitle>تعذر تحميل التدريب اليومي</AlertTitle>
                    <AlertDescription>{(trainingError as Error).message}</AlertDescription>
                  </Alert>
                ) : trainingData ? (
                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-center justify-between gap-2 rounded-xl bg-emerald-50 p-3">
                      <div>
                        <p className="text-xs text-emerald-600">نسبة الإنجاز اليومي</p>
                        <p className="text-lg font-semibold text-emerald-700">
                          {trainingData.summary.dailyGoalCompletion}%
                        </p>
                      </div>
                      <Progress value={trainingData.summary.dailyGoalCompletion} className="h-2 w-32" />
                    </div>
                    <div className="grid gap-2">
                      {upcomingExercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                        >
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{exercise.stage}</span>
                            <span>
                              {new Date(exercise.scheduledAt).toLocaleTimeString("ar-DZ", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="mt-1 text-sm font-medium text-slate-800">
                            {exercise.title}
                          </p>
                          <p className="text-xs text-slate-500">هدف: {exercise.goal}</p>
                        </div>
                      ))}
                      {upcomingExercises.length === 0 && (
                        <p className="text-xs text-slate-500">
                          لا توجد تمارين مجدولة اليوم، اطلب من المساعد اقتراح تمرين جديد.
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/daily-training")}
                      className="gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      الذهاب إلى التدريب اليومي
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-orange-500" />
                  الألعاب التعليمية المباشرة
                </CardTitle>
                <CardDescription>
                  صور وحركة للنشاطات المفضلة مع تقدم الشارات.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {gamesLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-24" />
                  </div>
                ) : gamesError ? (
                  <Alert variant="destructive">
                    <AlertTitle>تعذر تحميل الألعاب التعليمية</AlertTitle>
                    <AlertDescription>{(gamesError as Error).message}</AlertDescription>
                  </Alert>
                ) : gamesData ? (
                  <div className="space-y-4">
                    {topGames.map((game, index) => (
                      <div
                        key={game.id}
                        className="overflow-hidden rounded-2xl border border-slate-100"
                      >
                        <div className="relative h-32 w-full">
                          <img
                            src={gameImages[index % gameImages.length]}
                            alt={game.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-slate-900/30" />
                          <div className="absolute inset-0 flex items-start justify-between p-4 text-white">
                            <div>
                              <p className="text-xs uppercase tracking-wide text-white/80">اللعبة</p>
                              <p className="text-lg font-semibold">{game.title}</p>
                            </div>
                            <div className="rounded-full bg-white/20 px-3 py-1 text-xs">
                              {game.ageRange} سنوات
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3 bg-white p-4 text-sm text-slate-600">
                          <p>{game.description}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span>أفضل نتيجة</span>
                            <span className="font-semibold text-slate-800">{game.bestScore}%</span>
                          </div>
                          <Progress value={game.badgeProgress} />
                          <div className="flex flex-wrap gap-2">
                            {game.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/educational-games")}
                      className="gap-2"
                    >
                      <Play className="h-4 w-4" />
                      تصفح مكتبة الألعاب
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
        <Card className="overflow-hidden border-slate-100 shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="relative min-h-[220px]">
              <img
                src="https://images.unsplash.com/photo-1521790945508-bf2a36314e85?auto=format&fit=crop&w=800&q=80"
                alt="طفل يستخدم جهازًا لوحيًا للتعلم"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-indigo-900/40" />
              <div className="absolute inset-0 flex flex-col items-start justify-end p-6 text-white">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs">تكامل ذكي</span>
                <p className="mt-3 text-2xl font-semibold">
                  الصوت، الصور، والبيانات في مكان واحد
                </p>
                <p className="text-sm text-white/80">
                  كل أداة تعرض تجربة غنية بالوسائط لمتابعة رحلة طفلك بثقة.
                </p>
              </div>
            </div>
            <div className="space-y-4 p-6 text-sm text-slate-600">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <h4 className="mb-2 flex items-center gap-2 text-base font-semibold text-slate-800">
                  <Bot className="h-4 w-4 text-indigo-500" />
                  توصية صوتية سريعة
                </h4>
                <p>
                  فعّل خيار الصوت للاستماع لملخص المساعد، أو شارك الصورة المرئية للتقدم مع الأخصائي.
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <h4 className="mb-2 flex items-center gap-2 text-base font-semibold text-slate-800">
                  <Calendar className="h-4 w-4 text-emerald-500" />
                  صور محفزة للتدريب
                </h4>
                <p>
                  الصور المرافقة للتدريب تساعد الطفل على تذكّر الخطوات، بينما يدعم الصوت تشكيل الروتين اليومي.
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <h4 className="mb-2 flex items-center gap-2 text-base font-semibold text-slate-800">
                  <Gamepad2 className="h-4 w-4 text-orange-500" />
                  ألعاب تفاعلية بالصور
                </h4>
                <p>
                  بطاقات الألوان وشاشات الألعاب تتكامل مع المساعد لتقديم اقتراحات مخصصة بعد كل جلسة لعب.
                </p>
              </div>
            </div>
          </div>
        </Card>
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
            <TabsList className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                نظرة عامة
              </TabsTrigger>
              <TabsTrigger value="smart-tools" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                الأدوات الذكية
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

          <TabsContent value="smart-tools">
            <SmartToolsTab />
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
