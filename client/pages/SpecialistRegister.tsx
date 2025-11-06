import { 
  ArrowLeft, 
  User, 
  Mail, 
  Lock, 
  MapPin, 
  Building,
  Stethoscope,
  UserPlus,
  Check,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const algerianStates = [
  "أدرار", "الشلف", "الأغواط", "أم البواقي", "باتنة", "بجاية", "بسكرة", "بشار",
  "البليدة", "البويرة", "تمنراست", "تبسة", "تلمسان", "تيارت", "تيزي وزو", "الجزائر",
  "الجلفة", "جيجل", "سطيف", "سعيدة", "سكيكدة", "سيدي بلعباس", "عنابة", "قالمة",
  "قسنطينة", "المدية", "مستغانم", "المسيلة", "معسكر", "ورقلة", "وهران", "البيض",
  "إليزي", "برج بوعريريج", "بومرداس", "الطارف", "تندوف", "تيسمسيلت", "الوادي",
  "خنشلة", "سوق أهراس", "تيبازة", "ميلة", "عين الدفلى", "النعامة", "عين تموشنت",
  "غرداية", "غليزان"
];

export default function SpecialistRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    state: "",
    workplace: "",
    specialization: "",
    experience: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("كلمة المرور غير متطابقة");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('userType', 'specialist');
      localStorage.setItem('specialistData', JSON.stringify(formData));
      setIsSubmitting(false);
      navigate('/specialist-dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12" dir="rtl">
      <Card className="max-w-2xl mx-4 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center relative">
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute top-0 right-0"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة
          </Button>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl w-20 h-20 mx-auto mb-4">
            <Stethoscope className="w-8 h-8" />
          </div>
          
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            إنشاء حساب أخصائي أرطوفوني
          </CardTitle>
          <CardDescription className="text-lg">
            أنشئ حسابك المتخصص للوصول إلى أدوات التقييم والتشخيص
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-right flex items-center gap-2">
                <User className="w-4 h-4" />
                الاسم الكامل
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="أدخل اسمك الكامل"
                required
                className="text-right"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right flex items-center gap-2">
                <Mail className="w-4 h-4" />
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="example@email.com"
                required
                className="text-right"
              />
            </div>

            {/* Password Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-right flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  كلمة المرور
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••"
                  required
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-right flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  تأكيد كلمة المرور
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  required
                  className="text-right"
                />
              </div>
            </div>

            {/* State and Workplace */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-right flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  الولاية
                </Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)} required>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر الولاية" />
                  </SelectTrigger>
                  <SelectContent>
                    {algerianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workplace" className="text-right flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  مكان العمل
                </Label>
                <Input
                  id="workplace"
                  type="text"
                  value={formData.workplace}
                  onChange={(e) => handleInputChange('workplace', e.target.value)}
                  placeholder="مثال: مستشفى الأطفال، عيادة خاصة"
                  required
                  className="text-right"
                />
              </div>
            </div>

            {/* Specialization */}
            <div className="space-y-2">
              <Label className="text-right flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                التخصص
              </Label>
              <Select value={formData.specialization} onValueChange={(value) => handleInputChange('specialization', value)} required>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر تخصصك" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="speech-therapy">علاج النطق واللغة</SelectItem>
                  <SelectItem value="developmental-therapy">العلاج التطويري</SelectItem>
                  <SelectItem value="autism-therapy">علاج طيف التوحد</SelectItem>
                  <SelectItem value="general-orthophony">الأرطوفونيا العامة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label className="text-right flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                سنوات الخبرة
              </Label>
              <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)} required>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر سنوات خبرتك" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">أقل من سنة</SelectItem>
                  <SelectItem value="1-3">1-3 سنوات</SelectItem>
                  <SelectItem value="3-5">3-5 سنوات</SelectItem>
                  <SelectItem value="5-10">5-10 سنوات</SelectItem>
                  <SelectItem value="10+">أكثر من 10 سنوات</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Terms Agreement */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <input type="checkbox" required className="mt-1" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium mb-1">أوافق على الشروط والأحكام</p>
                  <p>بإنشاء هذا الحساب، أؤكد أنني أخصائي أرطوفوني مؤهل وأتعهد بالالتزام بأخلاقيات المهنة وسرية المعلومات الطبية.</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 text-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري إنشاء الحساب...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  إنشاء الحساب
                </div>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">لديك حساب بالفعل؟</p>
            <Button 
              variant="link" 
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700"
            >
              تسجيل الدخول
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
