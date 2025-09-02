import {
  ArrowLeft,
  Brain,
  Target,
  Users,
  Eye,
  Timer,
  Star,
  Home,
  Play,
  BookOpen,
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

export default function CognitiveTests() {
  const navigate = useNavigate();

  const cognitiveCategories = [
    {
      id: "implicit-group",
      title: "المجموعة الضمنية",
      description: "الفواكه، الخضر، المواصلات، الطيور، الملابس، الفصول، المهن، الأشكال",
      icon: <Users className="w-8 h-8" />,
      color: "bg-green-500",
      route: "/implicit-group",
      count: "8 فئات",
      details: [
        "🍎 الفواكه - التفاح، الموز، البرتقال، العنب",
        "🥕 الخضر - الجزر، الطماطم، الخيار، الفلفل",
        "🚗 المواصلات - السيارة، الحافلة، الطائرة، القطار",
        "🐦 الطيور - العصفور، النسر، البطة، الديك",
        "👕 الملابس - القميص، الفستان، البنطلون، الحذاء",
        "🌸 الفصول - الربيع، الصيف، الخريف، الشتاء",
        "👨‍⚕️ المهن - الطبيب، المعلم، المطافئ، الشرطي",
        "🔺 الأشكال - الدائرة، المربع، المثلث، المستطيل",
      ],
    },
    {
      id: "pre-basic",
      title: "المكتسبات القبلية",
      description: "الألوان، الأرقام، أعضاء الجسم، الجانبية",
      icon: <Brain className="w-8 h-8" />,
      color: "bg-blue-500",
      route: "/pre-basic-acquisitions",
      count: "4 مجالات",
      details: [
        "🎨 الألوان - الأحمر، الأزرق، الأخضر، الأصفر",
        "🔢 الأرقام - من 0 إلى 10 مع التعرف على الكمية",
        "👤 أعضاء الجسم - الرأس، العين، الأنف، الفم، اليد",
        "↔️ الجانبية - اليمين، اليسار، فوق، تحت، داخل، خارج",
      ],
    },
    {
      id: "perceptual",
      title: "تمارين الإدراك البصري",
      description: "تدرج من السهل إلى الصعب - جعل التعلم ممتعاً",
      icon: <Eye className="w-8 h-8" />,
      color: "bg-purple-500",
      route: "/perceptual-exercises",
      count: "3 مراحل",
      details: [
        "🟢 المرحلة الأولى (السهلة) - إيجاد الشيء المختلف",
        "🟡 المرحلة الثانية (الصعبة) - مطابقة الأشكال",
        "🔴 المرحلة الثالثة (المتوسطة) - اختيار الظل المناسب",
      ],
    },
    {
      id: "attention",
      title: "تمارين الانتباه",
      description: "الانتباه المتواصل�� الانتقائي، المشترك",
      icon: <Target className="w-8 h-8" />,
      color: "bg-red-500",
      route: "/attention-exercises",
      count: "3 أنواع",
      details: [
        "⭐ الانتباه المتواصل - اصطياد النجمة",
        "🔍 الانتباه الانتقائي - الأشياء المفقودة",
        "👥 الانتباه المشترك - حامل الرسالة",
      ],
    },
    {
      id: "memory",
      title: "تمارين الذاكرة",
      description: "الذاكرة السمعية والبصرية",
      icon: <Timer className="w-8 h-8" />,
      color: "bg-yellow-500",
      route: "/memory-exercises",
      count: "نوعان",
      details: [
        "🎧 الذاكرة السمعية - صندوق الأصوات المتسلسل",
        "👁️ الذاكرة البصرية - مكان الصورة",
      ],
    },
  ];

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
                  اختبارات الإدراك المعرفية
                </h1>
                <p className="text-gray-600 text-sm">
                  تمارين تفاعلية لتطوير مهارات الإدراك والتعرف على الأشياء
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
              >
                <Home className="w-4 h-4 ml-2" />
                الرئيسية
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="text-8xl mb-6">🧠</div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            التمارين المعرفية
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            تطوير المهارات المعرفية والإدراكية من خلال مجموعة شاملة من التمارين التفاعلية المصممة خصيصاً للأطفال
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {cognitiveCategories.map((category) => (
            <Card
              key={category.id}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-gray-300 group"
              onClick={() => navigate(category.route)}
            >
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`${category.color} text-white p-4 rounded-xl group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <CardDescription className="text-base">
                      {category.description}
                    </CardDescription>
                    <Badge variant="secondary" className="mt-2">
                      {category.count}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-sm text-gray-700">المحتويات:</h4>
                  <div className="grid gap-2">
                    {category.details.map((detail, index) => (
                      <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  <Play className="w-4 h-4 ml-2" />
                  ابدأ التمارين
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <BookOpen className="w-5 h-5" />
              دليل التمارين المعرفية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-blue-700">
              <div>
                <h4 className="font-semibold mb-2">المجموعة الضمنية:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• تصنيف العناصر حسب الفئات</li>
                  <li>• 8 فئات مختلفة للتعلم</li>
                  <li>• مرحلة تعلم ومرحلة اختبار</li>
                  <li>• تعزيز صوتي لكل عنصر</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">المكتسبات القبلية:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• المفاهيم الأساسية الضرورية</li>
                  <li>• الألوان والأرقام وأعضاء الجسم</li>
                  <li>• فهم الاتجاهات والمواضع</li>
                  <li>• تفاعل بصري وسمعي</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">الإدراك البصري:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• تطوير مهارات التمييز البصري</li>
                  <li>• 3 مراحل متدرجة الصعوبة</li>
                  <li>• مطابقة الأشكال والظلال</li>
                  <li>• إيجاد العنصر المختلف</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">تمارين الانتباه:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• تطوير أنواع الانتباه المختلفة</li>
                  <li>• ألعاب تفاعلية ممتعة</li>
                  <li>• تحديات متزايدة الصعوبة</li>
                  <li>• تقييم فوري وتشجيع</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">تمارين الذاكرة:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• تقوية الذاكرة السمعية والبصرية</li>
                  <li>• تسلسل الأصوات والمواضع</li>
                  <li>• تدرج في مستوى التعقيد</li>
                  <li>• ألعاب تفاعلية شيقة</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">مميزات عامة:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• صوت ناطق باللغة العربية</li>
                  <li>• تصميم ملائم للأطفال</li>
                  <li>• تقييم فوري للأداء</li>
                  <li>• نظام نقاط وتشجيع</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Navigation */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>وصول سريع</CardTitle>
            <CardDescription>
              انتقل بسرعة إلى التمارين المختلفة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => navigate("/diagnostic-tests")}
              >
                <Brain className="w-6 h-6" />
                الاختبارات التشخيصية
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => navigate("/age-calculator")}
              >
                <Star className="w-6 h-6" />
                حساب العمر الزمني
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => navigate("/portage-report")}
              >
                <Target className="w-6 h-6" />
                تقرير بورتاج
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
