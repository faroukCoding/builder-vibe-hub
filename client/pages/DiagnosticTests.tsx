import {
  ArrowLeft,
  Brain,
  ClipboardList,
  Gamepad2,
  Download,
  Eye,
  Target,
  Play,
  FileBarChart,
  Settings,
  BookOpen,
  PenTool,
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
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function DiagnosticTests() {
  const navigate = useNavigate();
  const [completedGames, setCompletedGames] = useState(0);
  const [totalGames] = useState(9);
  const [hasResponses, setHasResponses] = useState(false);

  useEffect(() => {
    // Check for completed games and responses in localStorage
    const gameProgress = localStorage.getItem("theoryOfMindProgress");
    const responses = localStorage.getItem("diagnosticResponses");
    
    if (gameProgress) {
      try {
        const progress = JSON.parse(gameProgress);
        const completed = Object.values(progress).filter(Boolean).length;
        setCompletedGames(completed);
      } catch (error) {
        console.error("Error parsing game progress:", error);
      }
    }

    setHasResponses(!!responses);
  }, []);

  const diagnosticTools = [
    {
      id: "theory-of-mind-games",
      title: "ألعاب نظرية العقل",
      description: "9 ألعاب تفاعلية لتقييم نظرية العقل والقدرات المعرفية العليا",
      icon: Gamepad2,
      color: "blue",
      route: "/theory-of-mind-games",
      status: completedGames > 0 ? "في الت��دم" : "لم يبدأ",
      progress: Math.round((completedGames / totalGames) * 100),
      features: [
        "تقييم فهم المشاعر",
        "اختبار المعتقدات الخاطئة", 
        "تقييم وجهات النظر",
        "ألعاب الذاكرة المكانية"
      ],
      difficulty: "متدرج",
      duration: "45-60 دقيقة",
    },
    {
      id: "response-sheet",
      title: "ورقة الاستجابة التشخيصية",
      description: "تحليل شامل للنتائج مع تفسيرات مهنية وتوصيات علاجية",
      icon: ClipboardList,
      color: "green",
      route: "/diagnostic-response-sheet",
      status: hasResponses ? "متوفر" : "يتطلب إكمال الألعاب",
      progress: hasResponses ? 100 : 0,
      features: [
        "تحليل مفصل للإجابات",
        "تفسيرات مهنية",
        "توصيات علاجية",
        "تصدير التقارير PDF/Excel"
      ],
      difficulty: "تلقائي",
      duration: "15-20 دقيقة",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مكتمل":
        return "bg-green-500";
      case "في التقدم":
        return "bg-blue-500";
      case "متوفر":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
      green: "bg-green-100 text-green-600 hover:bg-green-200",
      purple: "bg-purple-100 text-purple-600 hover:bg-purple-200",
      orange: "bg-orange-100 text-orange-600 hover:bg-orange-200",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  الاختبارات التشخيصية
                </h1>
                <p className="text-gray-600 text-sm">
                  أدوات شاملة لتقييم وتشخيص القدرات المعرفية
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{completedGames}</p>
                <p className="text-xs text-gray-600">مكتملة</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{totalGames}</p>
                <p className="text-xs text-gray-600">إجمالي</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">الألعاب المكتملة</p>
                  <p className="text-3xl font-bold">{completedGames}/{totalGames}</p>
                </div>
                <Brain className="w-10 h-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">نسبة الإنجاز</p>
                  <p className="text-3xl font-bold">{Math.round((completedGames / totalGames) * 100)}%</p>
                </div>
                <Target className="w-10 h-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">حالة التقرير</p>
                  <p className="text-xl font-bold">{hasResponses ? "جاهز" : "قيد الإعداد"}</p>
                </div>
                <FileBarChart className="w-10 h-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <BookOpen className="w-5 h-5" />
              تعليمات الاستخدام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-blue-700">
              <div>
                <h4 className="font-semibold mb-2">خطوات التقييم:</h4>
                <ol className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                    ابدأ بألعاب نظرية العقل (9 مهام تفاعلية)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                    أكمل جميع المهام حسب مستوى الصعوبة
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                    راجع النتائج في ورقة الاستجابة التشخيصية
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">4</span>
                    صدّر التقرير النهائي بصيغة PDF أو Excel
                  </li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">نصائح مهمة:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    تأكد من وجود بيئة هادئة ومريحة
                  </li>
                  <li className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    راقب ردود فعل الطفل وسجل الملاحظات
                  </li>
                  <li className="flex items-center gap-2">
                    <PenTool className="w-4 h-4" />
                    لا تتدخل في إجابات الطفل إلا عند الضرورة
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diagnostic Tools Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {diagnosticTools.map((tool) => (
            <Card
              key={tool.id}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-gray-300 group"
              onClick={() => navigate(tool.route)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-4 rounded-xl ${getColorClasses(tool.color)} group-hover:scale-110 transition-transform`}
                    >
                      <tool.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{tool.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          className={`${getStatusColor(tool.status)} text-white`}
                        >
                          {tool.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {tool.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-base">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>نسبة الإنجاز</span>
                    <span>{tool.progress}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className={`${tool.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'} rounded-full h-2 transition-all duration-500`}
                      style={{ width: `${tool.progress}%` }}
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">المميزات:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {tool.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full mt-4 group-hover:bg-primary/90 transition-colors"
                  size="lg"
                >
                  <Play className="w-4 h-4 ml-2" />
                  {tool.id === "response-sheet" && !hasResponses ? "عرض المتطلبات" : "البدء"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
            <CardDescription>
              إجراءات مفيدة لإدارة التقييم التشخيصي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => navigate("/theory-of-mind-games")}
                disabled={completedGames === 0}
              >
                <Eye className="w-6 h-6" />
                استعراض النتائج
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => navigate("/diagnostic-response-sheet")}
                disabled={!hasResponses}
              >
                <Download className="w-6 h-6" />
                تصدير التقرير
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => {
                  localStorage.removeItem("theoryOfMindProgress");
                  localStorage.removeItem("diagnosticResponses");
                  window.location.reload();
                }}
              >
                <Target className="w-6 h-6" />
                إعادة البدء
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
