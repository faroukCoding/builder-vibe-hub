import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Calculator,
  Calendar,
  Home,
  Copy,
  CheckCircle,
} from "lucide-react";

export default function AgeCalculator() {
  const navigate = useNavigate();
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalMonths: number;
    birthDate: string;
    currentDate: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const calculateAge = () => {
    if (!birthYear || !birthMonth || !birthDay) {
      alert("يرجى إدخال تاريخ الميلاد كاملاً (السنة والشهر واليوم)");
      return;
    }

    const year = parseInt(birthYear);
    const month = parseInt(birthMonth);
    const day = parseInt(birthDay);

    // التحقق من صحة التاريخ
    if (year < 1900 || year > new Date().getFullYear()) {
      alert("يرجى إدخال سنة صحيحة");
      return;
    }

    if (month < 1 || month > 12) {
      alert("يرجى إدخال شهر صحيح (1-12)");
      return;
    }

    if (day < 1 || day > 31) {
      alert("يرجى إدخال يوم صحيح (1-31)");
      return;
    }

    // التحقق من صحة اليوم في الشهر المحدد
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) {
      alert(`الشهر ${month} في سنة ${year} يحتوي على ${daysInMonth} يوم فقط`);
      return;
    }

    const birth = new Date(year, month - 1, day); // month is 0-indexed in JS
    const today = new Date();

    if (birth > today) {
      alert("تاريخ الميلاد لا يمكن أن يكون في المستقبل");
      return;
    }

    // حساب العمر بدقة
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // حساب العدد الإجمالي للأيام والشهور
    const timeDiff = today.getTime() - birth.getTime();
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const totalMonths = years * 12 + months;

    setResult({
      years,
      months,
      days,
      totalDays,
      totalMonths,
      birthDate: birth.toLocaleDateString("ar-SA"),
      currentDate: today.toLocaleDateString("ar-SA"),
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setBirthYear("");
    setBirthMonth("");
    setBirthDay("");
    setResult(null);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50"
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
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                العودة
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-2 rounded-lg">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    أداة حساب العمر الزمني
                  </h1>
                  <p className="text-gray-600">احسب العمر بدقة حتى اليوم</p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              الرئيسية
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Calculator className="w-6 h-6" />
              حساب العمر الزمني
            </CardTitle>
            <CardDescription className="text-lg">
              أدخل تاريخ الميلاد لحساب العمر الحالي بدقة
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">
                تاريخ الميلاد
              </h3>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block text-center">
                    السنة
                  </label>
                  <Input
                    type="number"
                    placeholder="2015"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="text-lg text-center"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block text-center">
                    الشهر
                  </label>
                  <Input
                    type="number"
                    placeholder="3"
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    className="text-lg text-center"
                    min="1"
                    max="12"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block text-center">
                    اليوم
                  </label>
                  <Input
                    type="number"
                    placeholder="15"
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    className="text-lg text-center"
                    min="1"
                    max="31"
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={calculateAge}
                  className="bg-green-600 hover:bg-green-700 text-lg py-6 px-8"
                  size="lg"
                >
                  <Calculator className="w-5 h-5 ml-2" />
                  احسب العمر
                </Button>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="text-lg py-6 px-8"
                  size="lg"
                >
                  إعادة تعيين
                </Button>
              </div>
            </div>

            {result && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mt-8">
                <h3 className="text-xl font-semibold mb-4 text-green-800 text-center">
                  <CheckCircle className="w-6 h-6 inline ml-2" />
                  نتيجة حساب العمر
                </h3>

                <div className="space-y-6">
                  {/* العمر الأساسي */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {result.years} سنة، {result.months} شهر، {result.days} يوم
                    </div>
                    <div className="text-gray-600 text-lg">
                      العمر الحالي بالتفصيل
                    </div>
                  </div>

                  {/* تفاصيل إضافية */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center border">
                      <div className="text-2xl font-bold text-blue-600">
                        {result.totalMonths}
                      </div>
                      <div className="text-sm text-gray-600">إجمالي الشهور</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center border">
                      <div className="text-2xl font-bold text-purple-600">
                        {result.totalDays}
                      </div>
                      <div className="text-sm text-gray-600">إجمالي الأيام</div>
                    </div>
                  </div>

                  {/* معلومات التواريخ */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <div className="font-semibold text-blue-800">
                        تاريخ الميلاد
                      </div>
                      <div className="text-blue-600">{result.birthDate}</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <div className="font-semibold text-green-800">
                        تاريخ اليوم
                      </div>
                      <div className="text-green-600">{result.currentDate}</div>
                    </div>
                  </div>

                  {/* زر النسخ */}
                  <div className="text-center">
                    <Button
                      onClick={() =>
                        copyToClipboard(
                          `${result.years} سنة، ${result.months} شهر، ${result.days} يوم`,
                        )
                      }
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      نسخ النتيجة
                    </Button>
                    {copied && (
                      <p className="text-green-600 text-sm mt-2">
                        تم نسخ النتيجة بنجاح!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* معلومات إضافية */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              معلومات حول حساب العمر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">دقة الحساب:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• يتم الحساب بناءً على التاريخ الحالي</li>
                  <li>• يراعي السنوات الكبيسة</li>
                  <li>• يحسب الأيام بدقة حسب كل شهر</li>
                  <li>• يعطي النتيجة بالسنوات والشهور والأيام</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">الاستخدامات:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• التقييمات النمائية للأطفال</li>
                  <li>• اختيار الاختبارات المناسبة للعمر</li>
                  <li>• كتابة التقارير الطبية والنفسية</li>
                  <li>• متابعة النمو والتطور</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                مثال على الاستخدام:
              </h4>
              <p className="text-blue-700 text-sm">
                إذا وُلد الطفل في 15 مارس 2020، وكان تاريخ اليوم 10 يناير 2024،
                فسيكون عمره 3 سنوات، 9 أشهر، 26 يوم تقريباً.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
