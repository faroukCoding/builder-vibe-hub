import { 
  ArrowLeft, 
  BarChart3, 
  Download, 
  Calendar, 
  User,
  TrendingUp,
  Target,
  CheckCircle,
  AlertCircle,
  Home,
  Calculator,
  Eye,
  Brain,
  Heart,
  Users,
  Baby,
  School,
  Play,
  Palette,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function PortageReport() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("assessment");
  const [childData, setChildData] = useState({
    name: "",
    birthDate: "",
    assessmentDate: "",
    chronologicalAge: { years: 0, months: 0 },
    assessor: ""
  });

  // مجالات مقياس بورتاج
  const portageAreas = [
    {
      id: "social",
      name: "التطور الاجتماعي",
      description: "التفاعل مع الآخرين والمهارات الاجتماعية",
      icon: Users,
      color: "blue",
      maxScore: 50,
      items: [
        { id: 1, skill: "يبتسم استجابة للوجوه المألوفة", ageRange: "0-1", score: 0 },
        { id: 2, skill: "يحافظ على التواصل البصري", ageRange: "0-1", score: 0 },
        { id: 3, skill: "يظهر استمتاعاً باللعب الاجتماعي", ageRange: "1-2", score: 0 },
        { id: 4, skill: "يشارك الألعاب مع ال��طفال الآخرين", ageRange: "2-3", score: 0 },
        { id: 5, skill: "يتبع القواعد البسيطة في اللعب", ageRange: "3-4", score: 0 },
        { id: 6, skill: "يعبر عن المشاعر بطريقة مناسبة", ageRange: "4-5", score: 0 },
        { id: 7, skill: "يساعد في المهام المنزلية البسيطة", ageRange: "4-5", score: 0 },
        { id: 8, skill: "يظهر تعاطفاً مع الآخرين", ageRange: "5-6", score: 0 },
        { id: 9, skill: "يتعاون في الأنشطة الجماعية", ageRange: "5-6", score: 0 },
        { id: 10, skill: "يحل النزاعات بطريقة سلمية", ageRange: "6+", score: 0 }
      ]
    },
    {
      id: "language",
      name: "تطور اللغة",
      description: "الفهم والتعبير اللغوي",
      icon: MessageSquare,
      color: "green",
      maxScore: 50,
      items: [
        { id: 1, skill: "يستجيب لاسمه عند مناداته", ageRange: "0-1", score: 0 },
        { id: 2, skill: "يفهم كلمة 'لا'", ageRange: "0-1", score: 0 },
        { id: 3, skill: "يقول كلمات بسيطة (ماما، بابا)", ageRange: "1-2", score: 0 },
        { id: 4, skill: "يتبع التعليمات البسيطة", ageRange: "1-2", score: 0 },
        { id: 5, skill: "يكون جملاً من كلمتين", ageRange: "2-3", score: 0 },
        { id: 6, skill: "يسأل أسئلة بسيطة", ageRange: "3-4", score: 0 },
        { id: 7, skill: "يحكي قصصاً بسيطة", ageRange: "4-5", score: 0 },
        { id: 8, skill: "يستخدم القواعد النحوية الأساسية", ageRange: "4-5", score: 0 },
        { id: 9, skill: "يفهم التعليمات المعقدة", ageRange: "5-6", score: 0 },
        { id: 10, skill: "يستخدم اللغة للتفكير والتخطيط", ageRange: "6+", score: 0 }
      ]
    },
    {
      id: "cognitive",
      name: "التطور المعرفي",
      description: "التفكير وحل المشكلات",
      icon: Brain,
      color: "purple",
      maxScore: 50,
      items: [
        { id: 1, skill: "يتابع الأشياء بالعين", ageRange: "0-1", score: 0 },
        { id: 2, skill: "يستكشف الأشياء بالفم واليدين", ageRange: "0-1", score: 0 },
        { id: 3, skill: "يفهم السبب والنتيجة", ageRange: "1-2", score: 0 },
        { id: 4, skill: "يصنف الأشياء حسب الشكل أو اللون", ageRange: "2-3", score: 0 },
        { id: 5, skill: "يحل الألغاز البسيطة", ageRange: "3-4", score: 0 },
        { id: 6, skill: "يفهم مفهوم العدد", ageRange: "4-5", score: 0 },
        { id: 7, skill: "يخطط للأنشطة المستقبلية", ageRange: "4-5", score: 0 },
        { id: 8, skill: "يستخدم الرموز في اللعب", ageRange: "5-6", score: 0 },
        { id: 9, skill: "يفهم مفاهيم الوقت الأساسية", ageRange: "5-6", score: 0 },
        { id: 10, skill: "يحل المشكلات المعقدة", ageRange: "6+", score: 0 }
      ]
    },
    {
      id: "motor",
      name: "التطور الحركي",
      description: "المهارات الحركية الكبيرة والدقيقة",
      icon: Target,
      color: "orange",
      maxScore: 50,
      items: [
        { id: 1, skill: "يرفع رأسه وهو على بطنه", ageRange: "0-1", score: 0 },
        { id: 2, skill: "يجلس بدون مساعدة", ageRange: "0-1", score: 0 },
        { id: 3, skill: "يمشي بمساعدة", ageRange: "1-2", score: 0 },
        { id: 4, skill: "يجري ويقفز", ageRange: "2-3", score: 0 },
        { id: 5, skill: "يرسم خطوطاً ودوائر", ageRange: "3-4", score: 0 },
        { id: 6, skill: "يستخدم المقص", ageRange: "4-5", score: 0 },
        { id: 7, skill: "يربط الحذاء", ageRange: "4-5", score: 0 },
        { id: 8, skill: "يكتب اسمه", ageRange: "5-6", score: 0 },
        { id: 9, skill: "يرمي الكرة بدقة", ageRange: "5-6", score: 0 },
        { id: 10, skill: "يشارك في الرياضات الجماعية", ageRange: "6+", score: 0 }
      ]
    },
    {
      id: "selfcare",
      name: "الرعاية الذاتية",
      description: "المهارات الحياتية والاستقلالية",
      icon: Heart,
      color: "pink",
      maxScore: 50,
      items: [
        { id: 1, skill: "يشرب من الكوب", ageRange: "0-1", score: 0 },
        { id: 2, skill: "يأكل بالملعقة", ageRange: "1-2", score: 0 },
        { id: 3, skill: "يخبر عن الحاجة لدخول الحمام", ageRange: "2-3", score: 0 },
        { id: 4, skill: "يغسل يديه", ageRange: "3-4", score: 0 },
        { id: 5, skill: "يرتدي ملابسه بمساعدة قليلة", ageRange: "4-5", score: 0 },
        { id: 6, skill: "ينظف أسنانه", ageRange: "4-5", score: 0 },
        { id: 7, skill: "يحضر وجبة بسيطة", ageRange: "5-6", score: 0 },
        { id: 8, skill: "ينظم غرفته", ageRange: "5-6", score: 0 },
        { id: 9, skill: "يتحمل مسؤوليات منزلية", ageRange: "6+", score: 0 },
        { id: 10, skill: "يدير وقته بفعالية", ageRange: "6+", score: 0 }
      ]
    }
  ];

  const [assessmentData, setAssessmentData] = useState(portageAreas);

  // حساب العمر الزمني
  const calculateAge = (birthDate: string, assessmentDate: string) => {
    if (!birthDate || !assessmentDate) return { years: 0, months: 0 };
    
    const birth = new Date(birthDate);
    const assessment = new Date(assessmentDate);
    
    let years = assessment.getFullYear() - birth.getFullYear();
    let months = assessment.getMonth() - birth.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return { years, months };
  };

  // تحديث النقاط
  const updateScore = (areaId: string, itemId: number, score: number) => {
    setAssessmentData(prev => 
      prev.map(area => 
        area.id === areaId 
          ? {
              ...area,
              items: area.items.map(item => 
                item.id === itemId ? { ...item, score } : item
              )
            }
          : area
      )
    );
  };

  // حساب النتائج
  const calculateResults = () => {
    return assessmentData.map(area => {
      const totalScore = area.items.reduce((sum, item) => sum + item.score, 0);
      const percentage = (totalScore / area.maxScore) * 100;
      const developmentalAge = (percentage / 100) * 72; // تقدير العمر التطويري بالشهور
      
      return {
        ...area,
        totalScore,
        percentage: Math.round(percentage),
        developmentalAge: Math.round(developmentalAge),
        status: percentage >= 80 ? 'متقدم' : percentage >= 60 ? 'طبيعي' : percentage >= 40 ? 'متأخر قليلاً' : 'يحتاج تدخل'
      };
    });
  };

  const results = calculateResults();

  // حساب العمر عند تغيير التواريخ
  const handleDateChange = (field: string, value: string) => {
    const newChildData = { ...childData, [field]: value };
    if (field === 'birthDate' || field === 'assessmentDate') {
      const age = calculateAge(
        field === 'birthDate' ? value : childData.birthDate,
        field === 'assessmentDate' ? value : childData.assessmentDate
      );
      newChildData.chronologicalAge = age;
    }
    setChildData(newChildData);
  };

  // مكون الرسم البياني
  const Chart = ({ results }) => {
    const maxValue = Math.max(...results.map(r => r.percentage));
    
    return (
      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={result.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <result.icon className={`w-5 h-5 text-${result.color}-600`} />
                <span className="font-medium">{result.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{result.totalScore}/{result.maxScore}</span>
                <Badge 
                  variant={result.percentage >= 60 ? "default" : "destructive"}
                  className={`text-xs ${result.percentage >= 80 ? 'bg-green-500' : result.percentage >= 60 ? 'bg-blue-500' : result.percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                >
                  {result.percentage}%
                </Badge>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 relative">
              <div 
                className={`h-6 rounded-full bg-gradient-to-r ${
                  result.percentage >= 80 ? 'from-green-400 to-green-500' :
                  result.percentage >= 60 ? 'from-blue-400 to-blue-500' :
                  result.percentage >= 40 ? 'from-yellow-400 to-yellow-500' :
                  'from-red-400 to-red-500'
                } transition-all duration-500`}
                style={{ width: `${result.percentage}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
                {result.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // تبويب التقييم
  const AssessmentTab = () => (
    <div className="space-y-6">
      {/* بيانات الطفل */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            بيانات الطفل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="childName">اسم الطفل</Label>
              <Input
                id="childName"
                value={childData.name}
                onChange={(e) => setChildData({...childData, name: e.target.value})}
                placeholder="أدخل اسم الطفل"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">تاريخ الميلاد</Label>
              <Input
                id="birthDate"
                type="date"
                value={childData.birthDate}
                onChange={(e) => handleDateChange('birthDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assessmentDate">تاريخ التقييم</Label>
              <Input
                id="assessmentDate"
                type="date"
                value={childData.assessmentDate}
                onChange={(e) => handleDateChange('assessmentDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>العمر الزمني</Label>
              <div className="p-3 bg-blue-50 rounded-lg border">
                <span className="font-semibold text-blue-800">
                  {childData.chronologicalAge.years} سنة و {childData.chronologicalAge.months} شهر
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assessor">الأخصائي المقيم</Label>
              <Input
                id="assessor"
                value={childData.assessor}
                onChange={(e) => setChildData({...childData, assessor: e.target.value})}
                placeholder="اسم الأخصائي"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* مجالات التقييم */}
      {assessmentData.map((area) => (
        <Card key={area.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <area.icon className={`w-5 h-5 text-${area.color}-600`} />
              {area.name}
            </CardTitle>
            <CardDescription>{area.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {area.items.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{item.skill}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {item.ageRange} سنوات
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">النقاط:</Label>
                    <Select 
                      value={item.score.toString()} 
                      onValueChange={(value) => updateScore(area.id, item.id, parseInt(value))}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // تبويب التقرير
  const ReportTab = () => (
    <div className="space-y-6">
      {/* ملخص النتائج */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            ملخص نتائج التقييم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {results.map((result) => (
              <Card key={result.id} className="border-2">
                <CardContent className="p-4 text-center">
                  <result.icon className={`w-8 h-8 text-${result.color}-600 mx-auto mb-2`} />
                  <h4 className="font-semibold text-sm mb-1">{result.name}</h4>
                  <div className="text-2xl font-bold mb-1">{result.percentage}%</div>
                  <Badge 
                    variant={result.percentage >= 60 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {result.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* الرسم البياني */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            الرسم البياني للنتائج
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Chart results={results} />
        </CardContent>
      </Card>

      {/* تفسير النتائج */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            تفسير النتائج والتوصيات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="border-l-4 border-gray-300 pl-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <result.icon className={`w-4 h-4 text-${result.color}-600`} />
                  {result.name}
                </h4>
                <p className="text-gray-600 mt-2">
                  {result.percentage >= 80 && 
                    `الطفل يظهر تطوراً ممتازاً في ${result.name}. يفوق المتوقع لعمره الزمني.`
                  }
                  {result.percentage >= 60 && result.percentage < 80 && 
                    `الطفل يظهر تطوراً طبيعياً في ${result.name}. ضمن المعدل المتوقع لعمره.`
                  }
                  {result.percentage >= 40 && result.percentage < 60 && 
                    `الطفل يظهر تأخراً طفيفاً في ${result.name}. يحتاج دعم إضافي.`
                  }
                  {result.percentage < 40 && 
                    `الطفل يحتاج تدخل مكثف في ${result.name}. ينصح بوضع برنامج علاجي.`
                  }
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* زر تصدير التقرير */}
      <div className="text-center">
        <Button size="lg" className="bg-green-600 hover:bg-green-700">
          <Download className="w-5 h-5 ml-2" />
          تصدير التقرير PDF
        </Button>
      </div>
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
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    تقرير بورتاج
                  </h1>
                  <p className="text-gray-600">مقياس التطور النمائي</p>
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

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tabs Navigation */}
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="assessment" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                التقييم
              </TabsTrigger>
              <TabsTrigger value="report" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                التقرير والنتائج
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="assessment">
            <AssessmentTab />
          </TabsContent>

          <TabsContent value="report">
            <ReportTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
