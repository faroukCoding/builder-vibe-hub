import {
  User,
  UserPlus,
  LogIn,
  Stethoscope,
  Baby,
  Sparkles,
  Heart,
  Brain,
  Shield,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Index() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("welcome"); // welcome, accountType, login, register

  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center" dir="rtl">
      <Card className="max-w-2xl mx-4 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          {/* Logo and Title */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 p-2 rounded-3xl w-32 h-32 mx-auto mb-6 flex items-center justify-center shadow-2xl">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F5e05d645cfee4c7f8b53005121a67e35?format=webp&width=800"
                alt="Ortho Smart Logo"
                className="w-28 h-28 rounded-2xl object-contain"
                style={{
                  mixBlendMode: 'multiply',
                  filter: 'brightness(1.2) contrast(1.1)',
                  background: 'transparent'
                }}
              />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Ortho Smart
            </h1>
            <p className="text-2xl text-gray-600 font-semibold mb-2">
              مرحباً بك في Ortho Smart
            </p>
            <p className="text-lg text-gray-500 leading-relaxed">
              منصّة رقمية متخصّصة في الأرطوفونيا لتقييم ومتابعة الأطفال
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">تقييم شامل</p>
            </div>
            <div className="text-center p-4">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Baby className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">تمارين تفاعلية</p>
            </div>
            <div className="text-center p-4">
              <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">متابعة مستمرة</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white text-lg py-4"
              onClick={() => setCurrentView("accountType")}
            >
              <UserPlus className="w-6 h-6 ml-3" />
              اختر نوع الحساب
            </Button>

            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-2 hover:bg-blue-50 text-lg py-4"
                onClick={() => setCurrentView("login")}
              >
                <LogIn className="w-5 h-5 ml-2" />
                دخول
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-2 hover:bg-green-50 text-lg py-4"
                onClick={() => setCurrentView("register")}
              >
                <User className="w-5 h-5 ml-2" />
                حساب جديد
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AccountTypeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center" dir="rtl">
      <Card className="max-w-4xl mx-4 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4"
            onClick={() => setCurrentView("welcome")}
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة
          </Button>
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            اختر نوع حسابك
          </CardTitle>
          <CardDescription className="text-lg">
            حدد نوع الحساب المناسب لك للبدء
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Parent Account */}
            <Card
              className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-green-500 cursor-pointer"
              onClick={() => navigate('/parent-register')}
            >
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Baby className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">ولي الطفل</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  متابعة تقدم طفلك، الاطلاع على التقارير، ومراجعة مواعيد الجلسات
                </p>
                <div className="space-y-2 text-sm text-gray-500 text-right mb-6">
                  <p>• متابعة بيانات الطفل والتطور</p>
                  <p>• الاطلاع على التقارير المفصلة</p>
                  <p>• مراجعة مواعيد الجلسات</p>
                </div>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                  إنشاء حساب ولي
                </Button>
              </CardContent>
            </Card>

            {/* Specialist Account */}
            <Card
              className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500 cursor-pointer"
              onClick={() => navigate('/specialist-register')}
            >
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Stethoscope className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">أخصائي/ة أرطوفوني/ة</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  أدوات التقييم المتقدمة، إدارة الحالات، وإنشاء التقارير المتخصصة
                </p>
                <div className="space-y-2 text-sm text-gray-500 text-right mb-6">
                  <p>• أدوات التقييم والتشخيص</p>
                  <p>• إدارة حالات الأطفال</p>
                  <p>• إنشاء التقارير والخطط</p>
                </div>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  إنشاء حساب أخصائي
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const LoginScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center" dir="rtl">
      <Card className="max-w-md mx-4 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4"
            onClick={() => setCurrentView("welcome")}
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة
          </Button>
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 rounded-2xl w-16 h-16 mx-auto mb-4">
            <LogIn className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">تسجيل الدخول</CardTitle>
          <CardDescription>ادخل بياناتك للوصول إلى حسابك</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="example@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-3"
              onClick={(e) => {
                e.preventDefault();
                // For demo, navigate to specialist dashboard
                navigate('/specialist-dashboard');
              }}
            >
              <LogIn className="w-5 h-5 ml-2" />
              دخول
            </Button>
          </form>
          <div className="text-center mt-6">
            <p className="text-gray-600">ليس لديك حساب؟</p>
            <Button
              variant="link"
              onClick={() => setCurrentView("accountType")}
              className="text-blue-600 hover:text-blue-700"
            >
              إنشاء حساب جد��د
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const RegisterScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center" dir="rtl">
      <Card className="max-w-md mx-4 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4"
            onClick={() => setCurrentView("welcome")}
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة
          </Button>
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-2xl w-16 h-16 mx-auto mb-4">
            <UserPlus className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">إنشاء حساب جديد</CardTitle>
          <CardDescription>اختر نوع الحساب المناسب</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full p-4 text-right border-2 hover:border-green-500 hover:bg-green-50"
              onClick={() => navigate('/parent-register')}
            >
              <div className="flex items-center justify-between w-full">
                <Baby className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold">ولي الطفل</p>
                  <p className="text-sm text-gray-500">لمتابعة طفلك</p>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full p-4 text-right border-2 hover:border-blue-500 hover:bg-blue-50"
              onClick={() => navigate('/specialist-register')}
            >
              <div className="flex items-center justify-between w-full">
                <Stethoscope className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-semibold">أخصائي أرطوفوني</p>
                  <p className="text-sm text-gray-500">للتقييم والعلاج</p>
                </div>
              </div>
            </Button>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600">لديك حساب بالفعل؟</p>
            <Button
              variant="link"
              onClick={() => setCurrentView("login")}
              className="text-blue-600 hover:text-blue-700"
            >
              تسجيل الدخول
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render based on current view
  const renderCurrentView = () => {
    switch (currentView) {
      case "accountType":
        return <AccountTypeScreen />;
      case "login":
        return <LoginScreen />;
      case "register":
        return <RegisterScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return renderCurrentView();
}
