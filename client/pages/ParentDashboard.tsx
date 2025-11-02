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
  ClipboardList,
  MessageCircle,
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
import { useState, useEffect } from "react";
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

      {/* أدوات المتابعة المنزلية الذكية */}
      <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-teal-600" />
            أدوات المتابعة المنزلية الذكية
          </CardTitle>
          <CardDescription>
            تمارين يومية، ألعاب تعليمية، ومساعد ذكي لدعم تطور طفلك.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Button
              onClick={() => navigate("/daily-training")}
              className="h-32 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white flex flex-col items-center justify-center gap-3"
            >
              <div className="text-3xl">📋</div>
              <div className="text-center">
                <div className="font-semibold">التدريب اليومي</div>
                <div className="text-xs opacity-80">تمارين نطق ومتابعة</div>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/educational-games")}
              className="h-32 bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white flex flex-col items-center justify-center gap-3"
            >
              <div className="text-3xl">🎮</div>
              <div className="text-center">
                <div className="font-semibold">الألعاب التعليمية</div>
                <div className="text-xs opacity-80">تفاعل ومرح هادف</div>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/smart-assistant")}
              className="h-32 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white flex flex-col items-center justify-center gap-3"
            >
              <div className="text-3xl">🤖</div>
              <div className="text-center">
                <div className="font-semibold">المساعد الذكي</div>
                <div className="text-xs opacity-80">نصائح وإجابات فورية</div>
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
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                نظرة عامة
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
