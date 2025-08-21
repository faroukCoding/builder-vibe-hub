import { 
  Users, 
  Baby, 
  Heart, 
  Mic, 
  Brain, 
  Gamepad2, 
  FileText,
  ArrowLeft,
  Stethoscope,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary-blue text-white p-3 rounded-full">
                <Mic className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary-dark">
                  عيادة النطق الذكية
                </h1>
                <p className="text-text-secondary">منصة متطورة لعلاج صعوبات النطق عند الأطفال</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary-blue to-primary-green bg-clip-text text-transparent mb-6">
            <Brain className="w-20 h-20 mx-auto mb-4 text-primary-blue" />
            <h2 className="text-5xl font-bold mb-4">
              حلول ذكية لعلاج النطق
            </h2>
          </div>
          <p className="text-xl text-text-secondary mb-12 leading-relaxed max-w-2xl mx-auto">
            منصة شاملة تجمع بين الأدوات الطبية المتقدمة والألعاب التفاعلية 
            لمساعدة الأطفال على تطوير مهارات النطق والتواصل
          </p>

          {/* User Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Doctor Interface */}
            <Card 
              className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary-blue cursor-pointer bg-white/80 backdrop-blur-sm"
              onClick={() => navigate('/doctor')}
            >
              <CardHeader className="text-center pb-6">
                <div className="bg-gradient-to-r from-primary-blue to-primary-green p-4 rounded-full w-20 h-20 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Stethoscope className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-primary-dark mb-2">
                  واجهة الأطباء والأخصائيين
                </CardTitle>
                <CardDescription className="text-lg text-text-secondary">
                  أدوات تقييم شاملة وإدارة ملفات المرضى
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-text-secondary">
                  <FileText className="w-5 h-5 text-primary-blue flex-shrink-0" />
                  <span>نماذج التقييم الأرطوفوني الشاملة</span>
                </div>
                <div className="flex items-center gap-3 text-text-secondary">
                  <Users className="w-5 h-5 text-primary-blue flex-shrink-0" />
                  <span>إدارة ملفات المرضى والمتابعة</span>
                </div>
                <div className="flex items-center gap-3 text-text-secondary">
                  <Brain className="w-5 h-5 text-primary-blue flex-shrink-0" />
                  <span>تقارير مفصلة وخطط العلاج</span>
                </div>
                <Button className="w-full mt-6 bg-primary-blue hover:bg-primary-blue/90 text-white font-semibold py-3">
                  دخول واجهة الأطباء
                </Button>
              </CardContent>
            </Card>

            {/* Child Interface */}
            <Card 
              className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary-green cursor-pointer bg-white/80 backdrop-blur-sm"
              onClick={() => navigate('/child')}
            >
              <CardHeader className="text-center pb-6">
                <div className="bg-gradient-to-r from-primary-green to-primary-accent p-4 rounded-full w-20 h-20 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Baby className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-primary-dark mb-2">
                  واجهة الأطفال التفاعلية
                </CardTitle>
                <CardDescription className="text-lg text-text-secondary">
                  ألعاب وتمارين ممتعة لتطوير النطق
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-text-secondary">
                  <Gamepad2 className="w-5 h-5 text-primary-green flex-shrink-0" />
                  <span>ألعاب تفاعلية لتمارين النطق</span>
                </div>
                <div className="flex items-center gap-3 text-text-secondary">
                  <Sparkles className="w-5 h-5 text-primary-green flex-shrink-0" />
                  <span>تجربة ممتعة ومحفزة للأطفال</span>
                </div>
                <div className="flex items-center gap-3 text-text-secondary">
                  <Heart className="w-5 h-5 text-primary-green flex-shrink-0" />
                  <span>متابعة التقدم والإنجازات</span>
                </div>
                <Button className="w-full mt-6 bg-primary-green hover:bg-primary-green/90 text-white font-semibold py-3">
                  دخول واجهة الأطفال
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-primary-dark mb-4">
              مميزات المنصة
            </h3>
            <p className="text-text-secondary text-lg">
              حلول متكاملة لعلاج صعوبات النطق والتواصل
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-blue/10 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary-blue mx-auto" />
              </div>
              <h4 className="font-semibold text-primary-dark mb-2">
                تقييم شامل
              </h4>
              <p className="text-text-secondary text-sm">
                نماذج تقييم مفصلة تغطي جميع جوانب النطق والتواصل
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-green/10 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                <Gamepad2 className="w-8 h-8 text-primary-green mx-auto" />
              </div>
              <h4 className="font-semibold text-primary-dark mb-2">
                تمارين تفاعلية
              </h4>
              <p className="text-text-secondary text-sm">
                ألعاب وأنش��ة محفزة تساعد الأطفال على التعلم والتطور
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-accent/10 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                <Brain className="w-8 h-8 text-primary-accent mx-auto" />
              </div>
              <h4 className="font-semibold text-primary-dark mb-2">
                متابعة ذكية
              </h4>
              <p className="text-text-secondary text-sm">
                نظام متابعة متطور لرصد التقدم ووضع خطط العلاج
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-dark text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Mic className="w-8 h-8 text-primary-accent" />
            <h4 className="text-2xl font-bold">عيادة النطق الذكية</h4>
          </div>
          <p className="text-gray-300 mb-8">
            منصة متخصصة لعلاج صعوبات النطق والتواصل عند الأطفال
          </p>
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-400">
              © 2024 عيادة النطق الذكية - جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
