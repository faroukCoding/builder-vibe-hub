import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  UserPlus,
  LogIn,
  User,
  Stethoscope,
  Baby,
  Heart,
  Brain,
  Target,
  Eye,
  Users,
  FileText,
  Calculator,
  BarChart3,
  Gamepad2,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [showAccountTypes, setShowAccountTypes] = useState(false);

  const features = [
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: "تقييم شامل",
      description: "أدوات تقييم متكاملة للمهارات الأرطوفونية",
    },
    {
      icon: <Baby className="w-8 h-8" />,
      title: "تمارين تفاعلية",
      description: "ألعاب وأنشطة ممتعة لتطوير المهارات",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "متابعة مستمرة",
      description: "تتبع التقدم وإعداد التقارير المفصلة",
    },
  ];

  const toolCategories = [
    {
      title: "الميزانية الأرطوفونية",
      description: "استمارة التقييم الشاملة",
      icon: <FileText className="w-6 h-6" />,
      color: "bg-blue-500",
    },
    {
      title: "المكتسبات القبلية",
      description: "الألوان، الأرقام، أعضاء الجسم، الجانبية",
      icon: <Brain className="w-6 h-6" />,
      color: "bg-green-500",
    },
    {
      title: "المجموعة الضمنية",
      description: "الفواكه، الخضر، المواصلات، الطيور، المهن",
      icon: <Users className="w-6 h-6" />,
      color: "bg-purple-500",
    },
    {
      title: "الاختبارات التشخيصية",
      description: "ألعاب نظرية العقل وورقة الاستجابة",
      icon: <Gamepad2 className="w-6 h-6" />,
      color: "bg-pink-500",
    },
    {
      title: "تمارين الإدراك البصري",
      description: "3 مراحل متدرجة الصعوبة",
      icon: <Eye className="w-6 h-6" />,
      color: "bg-indigo-500",
    },
    {
      title: "تمارين الانتباه",
      description: "المتواصل، الانتقائي، المشترك",
      icon: <Target className="w-6 h-6" />,
      color: "bg-red-500",
    },
    {
      title: "أداة حساب العمر",
      description: "حساب العمر الزمني بدقة",
      icon: <Calculator className="w-6 h-6" />,
      color: "bg-yellow-500",
    },
    {
      title: "تقرير بورتاج",
      description: "حساب وعرض بياني لمقياس بورتاج",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "bg-teal-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="bg-blue-600 text-white p-8 rounded-full w-32 h-32 mx-auto mb-6 shadow-xl flex items-center justify-center">
            <Stethoscope className="w-16 h-16" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Ortho Smart
          </h1>
          <p className="text-2xl text-gray-600 font-semibold mb-4">
            مرحباً بك في Ortho Smart
          </p>
          <div className="text-sm text-blue-600 bg-blue-50 inline-block px-4 py-2 rounded-full">
            منصة رقمية متخصصة في الأرطوفونيا
          </div>
        </div>



        {/* Action Buttons */}
        <div className="text-center space-y-6">
          {!showAccountTypes ? (
            <div className="space-y-4">
              <Button
                onClick={() => setShowAccountTypes(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                <UserPlus className="w-6 h-6 ml-3" />
                اختر نوع الحساب
              </Button>

              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  className="border-blue-200 hover:bg-blue-50 text-lg py-4"
                  size="lg"
                >
                  <LogIn className="w-5 h-5 ml-2" />
                  دخول
                </Button>
                <Button
                  variant="outline"
                  className="border-green-200 hover:bg-green-50 text-lg py-4"
                  size="lg"
                >
                  <User className="w-5 h-5 ml-2" />
                  حساب جديد
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                اختر نوع الحساب
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card
                  className="cursor-pointer hover:shadow-xl transition-all border-2 hover:border-blue-400 group"
                  onClick={() => navigate("/specialist-register")}
                >
                  <CardContent className="pt-8 text-center">
                    <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 group-hover:scale-110 transition-transform">
                      <Stethoscope className="w-10 h-10" />
                    </div>
                    <h4 className="text-xl font-semibold mb-2">أنا أخصائي أرطوفوني</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      وصول شامل لجميع أدوات التقييم والتشخيص
                    </p>
                    <div className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
                      حساب مهني
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-xl transition-all border-2 hover:border-green-400 group"
                  onClick={() => navigate("/parent-register")}
                >
                  <CardContent className="pt-8 text-center">
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 group-hover:scale-110 transition-transform">
                      <Baby className="w-10 h-10" />
                    </div>
                    <h4 className="text-xl font-semibold mb-2">أنا ولي أمر</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      متابعة تقدم طفلك والوصول للتمارين التفاعلية
                    </p>
                    <div className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block">
                      حساب عائلي
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button
                variant="ghost"
                onClick={() => setShowAccountTypes(false)}
                className="mt-6 text-gray-500 hover:text-gray-700"
              >
                العودة
              </Button>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}
