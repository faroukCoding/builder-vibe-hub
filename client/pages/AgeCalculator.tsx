import { 
  ArrowLeft, 
  Calculator, 
  Calendar, 
  Clock, 
  Baby,
  User,
  Target,
  TrendingUp,
  Home,
  Copy,
  Download,
  RefreshCw,
  Info,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AgeCalculator() {
  const navigate = useNavigate();
  const [birthDate, setBirthDate] = useState("");
  const [assessmentDate, setAssessmentDate] = useState("");
  const [childName, setChildName] = useState("");
  const [ageResult, setAgeResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // تعيين تاريخ اليوم كافتراضي لتاريخ التقييم
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setAssessmentDate(today);
  }, []);

  // حساب العمر بالتفصيل
  const calculateDetailedAge = (birth: string, assessment: string) => {
    if (!birth || !assessment) return null;

    const birthDate = new Date(birth);
    const assessmentDate = new Date(assessment);

    if (assessmentDate < birthDate) {
      return { error: "تاريخ التقييم لا يمكن أن يكون قبل تاريخ الميلاد" };
    }

    // حساب الفرق بالتفصيل
    let years = assessmentDate.getFullYear() - birthDate.getFullYear();
    let months = assessmentDate.getMonth() - birthDate.getMonth();
    let days = assessmentDate.getDate() - birthDate.getDate();

    // تعديل الحسابات
    if (days < 0) {
      months--;
      const lastMonth = new Date(assessmentDate.getFullYear(), assessmentDate.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // حساب إجمالي الأيام والأسابيع
    const totalDays = Math.floor((assessmentDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    // تحديد المرحلة العمرية
    const getAgeStage = (years: number, months: number) => {
      const totalMonthsAge = years * 12 + months;
      
      if (totalMonthsAge < 3) return { stage: "وليد", color: "pink", description: "مرحلة الولادة المبكرة" };
      if (totalMonthsAge < 12) return { stage: "رضيع", color: "blue", description: "مرحلة الرضاعة" };
      if (totalMonthsAge < 24) return { stage: "طفل صغير", color: "green", description: "مرحلة الطفولة المبكرة" };
      if (totalMonthsAge < 36) return { stage: "طفل دارج", color: "yellow", description: "مرحلة المشي والاستكشاف" };
      if (totalMonthsAge < 60) return { stage: "طفل ما قبل المدرسة", color: "purple", description: "مرحلة ما قبل المدرسة" };
      if (totalMonthsAge < 72) return { stage: "طفل مدرسة مبكرة", color: "orange", description: "بداية المرحلة المدرسية" };
      return { stage: "طفل مدرسة", color: "red", description: "المرحلة المدرسية" };
    };

    const ageStage = getAgeStage(years, months);

    // المعالم التطويرية المتوقعة
    const getDevelopmentalMilestones = (totalMonthsAge: number) => {
      const milestones = [];
      
      if (totalMonthsAge >= 2) milestones.push("الابتسام الاجتماعي");
      if (totalMonthsAge >= 6) milestones.push("الجلوس بدون مساعدة");
      if (totalMonthsAge >= 12) milestones.push("المشي الأولى");
      if (totalMonthsAge >= 18) milestones.push("كلمات أولى واضحة");
      if (totalMonthsAge >= 24) milestones.push("جملة من كلمتين");
      if (totalMonthsAge >= 36) milestones.push("اللعب التخيلي");
      if (totalMonthsAge >= 48) milestones.push("التفاعل الاجتماعي المعقد");
      if (totalMonthsAge >= 60) milestones.push("الاستعداد للمدرسة");
      
      return milestones;
    };

    const milestones = getDevelopmentalMilestones(totalMonths);

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      ageStage,
      milestones,
      formatted: {
        detailed: `${years} سنة و ${months} شهر و ${days} يوم`,
        simple: `${years} سنة و ${months} شهر`,
        months: `${totalMonths} شهر`,
        clinical: `${years};${months}` // التنسيق المستخدم في التقارير الطبية
      }
    };
  };

  // حساب العمر عند تغيير التواريخ
  useEffect(() => {
    if (birthDate && assessmentDate) {
      const result = calculateDetailedAge(birthDate, assessmentDate);
      setAgeResult(result);
    } else {
      setAgeResult(null);
    }
  }, [birthDate, assessmentDate]);

  // نسخ النتيجة للحافظة
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setBirthDate("");
    setChildName("");
    const today = new Date().toISOString().split('T')[0];
    setAssessmentDate(today);
    setAgeResult(null);
  };

  // تبويب الحاسبة الأساسية
  const BasicCalculatorTab = () => (
    <div className="space-y-6">
      {/* نموذج الإدخال */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            حساب العمر الزمني
          </CardTitle>
          <CardDescription>
            أدخل البيانات لحساب العمر الزمني بدقة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="childName">اسم الطفل (اختياري)</Label>
                <Input
                  id="childName"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="أدخل اسم الطفل"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthDate">تاريخ الميلاد *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assessmentDate">تاريخ التقييم *</Label>
                <Input
                  id="assessmentDate"
                  type="date"
                  value={assessmentDate}
                  onChange={(e) => setAssessmentDate(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={resetForm} 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  إعادة تعيين
                </Button>
                <Button 
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    setAssessmentDate(today);
                  }}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  اليوم
                </Button>
              </div>
            </div>

            {/* النتيجة */}
            <div className="space-y-4">
              {ageResult?.error ? (
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{ageResult.error}</AlertDescription>
                </Alert>
              ) : ageResult ? (
                <div className="space-y-4">
                  {/* العمر الأساسي */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Baby className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-blue-800 mb-2">
                          {childName || "الطفل"}
                        </h3>
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          {ageResult.formatted.detailed}
                        </div>
                        <Badge 
                          className={`bg-${ageResult.ageStage.color}-500 text-white`}
                        >
                          {ageResult.ageStage.stage}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* تفاصيل ��ضافية */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="font-semibold">{ageResult.totalMonths}</div>
                      <div className="text-gray-600">شهر</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="font-semibold">{ageResult.totalDays}</div>
                      <div className="text-gray-600">يوم</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="font-semibold">{ageResult.totalWeeks}</div>
                      <div className="text-gray-600">أسبوع</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="font-semibold">{ageResult.formatted.clinical}</div>
                      <div className="text-gray-600">تنسيق طبي</div>
                    </div>
                  </div>

                  {/* أزرار النسخ */}
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => copyToClipboard(ageResult.formatted.detailed)}
                    >
                      <Copy className="w-4 h-4 ml-2" />
                      نسخ العمر التفصيلي
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => copyToClipboard(ageResult.formatted.clinical)}
                    >
                      <Copy className="w-4 h-4 ml-2" />
                      نسخ التنسيق الطبي
                    </Button>
                  </div>

                  {copied && (
                    <Alert>
                      <CheckCircle className="w-4 h-4" />
                      <AlertDescription>تم نسخ النتيجة بنجاح!</AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 p-8">
                  <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>أدخل تاريخ الميلاد وتاريخ التقييم لحساب العمر</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // تبويب المعلومات التطويرية
  const DevelopmentalInfoTab = () => (
    <div className="space-y-6">
      {ageResult && !ageResult.error ? (
        <>
          {/* معلومات المرحلة العمرية */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                معلومات المرحلة العمرية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                  <div className={`p-3 rounded-full bg-${ageResult.ageStage.color}-100`}>
                    <Baby className={`w-6 h-6 text-${ageResult.ageStage.color}-600`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{ageResult.ageStage.stage}</h3>
                    <p className="text-gray-600">{ageResult.ageStage.description}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* المعالم التطويرية */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                المعالم التطويرية المتوقعة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ageResult.milestones.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-3">
                  {ageResult.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-green-800">{milestone}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  لا توجد معالم تطويرية محددة لهذا العمر
                </p>
              )}
            </CardContent>
          </Card>

          {/* إرشادات التقييم */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                إرشادات التقييم حسب العمر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ageResult.totalMonths < 12 && (
                  <Alert>
                    <Info className="w-4 h-4" />
                    <AlertDescription>
                      في هذا العمر، ركز على تقييم الاستجابات الحسية، التواصل البصري، والأصوات الأولى.
                    </AlertDescription>
                  </Alert>
                )}
                
                {ageResult.totalMonths >= 12 && ageResult.totalMonths < 24 && (
                  <Alert>
                    <Info className="w-4 h-4" />
                    <AlertDescription>
                      تقييم الكلمات الأولى، فهم التعليمات البسيطة، والتفاعل الاجتماعي الأساسي.
                    </AlertDescription>
                  </Alert>
                )}
                
                {ageResult.totalMonths >= 24 && ageResult.totalMonths < 48 && (
                  <Alert>
                    <Info className="w-4 h-4" />
                    <AlertDescription>
                      تقييم تكوين الجمل، المفردات، اللعب التخيلي، والتفاعل مع الأقران.
                    </AlertDescription>
                  </Alert>
                )}
                
                {ageResult.totalMonths >= 48 && (
                  <Alert>
                    <Info className="w-4 h-4" />
                    <AlertDescription>
                      تقييم الحديث المعقد، القواعد النحوية، المهارات ما قبل الأكاديمية، والمهارات الاجتماعية المتقدمة.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">احسب العمر أولاً لعرض المعلومات التطويرية</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/specialist-dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                العودة للوحة التحكم
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-2 rounded-lg">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    حساب العمر الزمني
                  </h1>
                  <p className="text-gray-600">أداة دقيقة لحساب الأعمار</p>
                </div>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate('/specialist-dashboard')}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              الرئيسية
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="calculator" className="space-y-6">
          {/* Tabs Navigation */}
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="calculator" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                حساب العمر
              </TabsTrigger>
              <TabsTrigger value="developmental" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                المعلومات التطويرية
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="calculator">
            <BasicCalculatorTab />
          </TabsContent>

          <TabsContent value="developmental">
            <DevelopmentalInfoTab />
          </TabsContent>
        </Tabs>

        {/* معلومات إضافية */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              معلومات مهمة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">دقة الحساب:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• يتم الحساب بدقة تصل إلى اليوم</li>
                  <li>• يراعي السنوات الكبيسة</li>
                  <li>• يتعامل مع اختلاف أيام الشهور</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">الاستخدامات:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• التقييمات النمائية</li>
                  <li>• اختيار الاختبارات المناسبة</li>
                  <li>• كتابة التقارير الطبية</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
