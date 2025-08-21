import {
  Users,
  Plus,
  FileText,
  Search,
  Calendar,
  Activity,
  User,
  ArrowLeft,
  Stethoscope,
  ClipboardList,
  TrendingUp,
  Settings,
  Brain,
  Star,
  Target,
  Calculator,
  BarChart3,
  Eye,
  Gamepad2,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function SpecialistDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data
  const patients = [
    {
      id: 1,
      name: "أحمد ��حمد السعيد",
      age: 6,
      lastVisit: "2024-01-15",
      status: "متابعة",
      diagnosis: "تأخر في النطق",
      progress: 75,
      parent: "فاطمة السعيد"
    },
    {
      id: 2,
      name: "سارة علي أحمد",
      age: 5,
      lastVisit: "2024-01-10",
      status: "تقييم أولي",
      diagnosis: "صعوبة في نطق الحروف",
      progress: 45,
      parent: "نورا أحمد"
    },
    {
      id: 3,
      name: "يوسف عبدالله",
      age: 7,
      lastVisit: "2024-01-08",
      status: "علاج متقدم",
      diagnosis: "تلعثم في الكلام",
      progress: 90,
      parent: "خديجة عبدالله"
    }
  ];

  const appointments = [
    { time: "09:00", patient: "أحمد محمد", type: "متابعة", parent: "فاطمة السعيد" },
    { time: "10:30", patient: "سارة علي", type: "تقييم أولي", parent: "نورا أحمد" },
    { time: "14:00", patient: "يوسف عبدالله", type: "جلسة علاج", parent: "خديجة عبدالله" },
  ];

  // بيانات جغرافية للجزائر
  const geographicalData = [
    { region: "الجزائر العاصمة", patients: 142, success: 88, cases: 185 },
    { region: "وهران", patients: 118, success: 84, cases: 150 },
    { region: "قسنطينة", patients: 95, success: 79, cases: 120 },
    { region: "عنابة", patients: 87, success: 82, cases: 110 },
    { region: "سطيف", patients: 76, success: 76, cases: 98 },
    { region: "باتنة", patients: 69, success: 73, cases: 89 },
    { region: "بجاية", patients: 58, success: 80, cases: 74 },
    { region: "تلمسان", patients: 52, success: 77, cases: 68 },
    { region: "البليدة", patients: 64, success: 85, cases: 78 },
    { region: "مستغانم", patients: 45, success: 74, cases: 61 }
  ];

  // بيانات توزيع الحالات
  const casesDistribution = [
    { name: "تأخر النطق", value: 35, color: "#0088FE" },
    { name: "صعوبة النطق", value: 28, color: "#00C49F" },
    { name: "التلعثم", value: 20, color: "#FFBB28" },
    { name: "اضطرابات الصوت", value: 17, color: "#FF8042" }
  ];

  const assessmentTools = [
    {
      id: "balance",
      title: "الميزانية الأرطوفونية",
      description: "استمارة سريرية ��املة للتقييم",
      icon: FileText,
      color: "blue",
      route: "/orthophonic-balance"
    },
    {
      id: "age-calc",
      title: "حساب العمر الزمني",
      description: "أداة حساب العمر بدقة",
      icon: Calculator,
      color: "green",
      route: "/age-calculator"
    },
    {
      id: "portage",
      title: "تقرير بورتاج",
      description: "حساب وعرض بياني لمقياس بو��تاج",
      icon: BarChart3,
      color: "purple",
      route: "/portage-report"
    },
    {
      id: "cognitive",
      title: "اختبارات الإدراك",
      description: "المكتسبات القبلية والإدراكية",
      icon: Brain,
      color: "orange",
      route: "/cognitive-tests"
    },
    {
      id: "theory-mind",
      title: "اختبار نظرية العقل",
      description: "تقييم القدرات المعرفية العليا",
      icon: Eye,
      color: "pink",
      route: "/theory-of-mind"
    },
    {
      id: "attention",
      title: "تمارين الانتباه",
      description: "ألعاب تفاعلية للانتباه والتركيز",
      icon: Target,
      color: "red",
      route: "/attention-exercises"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
      green: "bg-green-100 text-green-600 hover:bg-green-200",
      purple: "bg-purple-100 text-purple-600 hover:bg-purple-200",
      orange: "bg-orange-100 text-orange-600 hover:bg-orange-200",
      pink: "bg-pink-100 text-pink-600 hover:bg-pink-200",
      red: "bg-red-100 text-red-600 hover:bg-red-200"
    };
    return colors[color] || colors.blue;
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">إجمالي المرضى</p>
                <p className="text-3xl font-bold">127</p>
              </div>
              <Users className="w-10 h-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">الحالات النشطة</p>
                <p className="text-3xl font-bold">64</p>
              </div>
              <Activity className="w-10 h-10 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">مواعيد اليوم</p>
                <p className="text-3xl font-bold">8</p>
              </div>
              <Calendar className="w-10 h-10 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">نسبة التحسن</p>
                <p className="text-3xl font-bold">85%</p>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Tools Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">أدوات التقييم والتشخيص</CardTitle>
          <CardDescription>
            الأدوات المتاحة للتقييم الأرطوفوني الشامل
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessmentTools.map((tool) => (
              <Card
                key={tool.id}
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-gray-300"
                onClick={() => navigate(tool.route)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${getColorClasses(tool.color)}`}>
                      <tool.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{tool.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                  <Button size="sm" className="w-full">
                    بدء التقييم
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PatientsTab = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">قائمة المرضى</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="البحث عن مريض..."
                className="pr-10 w-64"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 ml-2" />
              مريض جديد
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {patients.map((patient) => (
            <div key={patient.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-semibold">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{patient.name}</h3>
                    <p className="text-sm text-gray-600">العمر: {patient.age} سنوات | ولي الأمر: {patient.parent}</p>
                    <p className="text-sm text-gray-600">{patient.diagnosis}</p>
                  </div>
                </div>
                <div className="text-left">
                  <Badge
                    variant={patient.status === "متابعة" ? "default" : "secondary"}
                    className="mb-2"
                  >
                    {patient.status}
                  </Badge>
                  <div className="text-sm text-gray-600">
                    آخر زيارة: {patient.lastVisit}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="bg-gray-200 rounded-full h-2 w-16">
                      <div
                        className="bg-green-500 rounded-full h-2"
                        style={{ width: `${patient.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{patient.progress}%</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline">
                  عرض الملف
                </Button>
                <Button size="sm" variant="outline">
                  بدء جلسة
                </Button>
                <Button size="sm" variant="outline">
                  التقارير
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const ReportsTab = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">التقارير والإحصائيات</CardTitle>
        <CardDescription>
          تقارير مفصلة حول أداء المرضى والتقدم العلاجي
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">تقرير شامل للمرضى</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                تقرير تفصيلي عن جميع المرضى وتقدمهم العلاجي
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 ml-2" />
                تحميل التقرير
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold">تقرير ا��أداء الشهري</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                إحصائيات شهرية عن عدد الجلسات ونسب التحسن
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 ml-2" />
                تحميل التقرير
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                تسجيل الخروج
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white p-3 rounded-xl">
                  <Brain className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    Ortho Smart
                  </h1>
                  <p className="text-gray-600">لوحة تحكم الأخصائي</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-semibold text-gray-800">د. أحمد محمد</p>
                <p className="text-sm text-gray-600">أخصائي أرطوفوني</p>
              </div>
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-semibold">
                أ
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              {/* Tabs Navigation */}
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    نظرة عامة
                  </TabsTrigger>
                  <TabsTrigger value="patients" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    المرضى
                  </TabsTrigger>
                  <TabsTrigger value="reports" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    التقارير
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    الإعدادات
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview">
                <OverviewTab />
              </TabsContent>

              <TabsContent value="patients">
                <PatientsTab />
              </TabsContent>

              <TabsContent value="reports">
                <div className="space-y-6">
                  <ReportsTab />

                  {/* الرسم البياني الجغرافي */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                          التوزيع الجغرافي للمرضى - الجزائر
                        </CardTitle>
                        <CardDescription>
                          عدد المرضى حسب الولايات الجزائرية
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={geographicalData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="region"
                                tick={{ fontSize: 12 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                axisLine={true}
                                tickLine={true}
                                type="category"
                                orientation="bottom"
                              />
                              <YAxis
                                axisLine={true}
                                tickLine={true}
                                type="number"
                                orientation="left"
                                tick={{ fontSize: 12 }}
                              />
                              <Tooltip
                                formatter={(value, name) => [value, name === 'patients' ? 'عدد المرضى' : 'معدل النجاح']}
                                labelFormatter={(label) => `الولاية: ${label}`}
                              />
                              <Bar dataKey="patients" fill="#3B82F6" name="عدد المرضى" />
                              <Bar dataKey="success" fill="#10B981" name="معدل النجاح %" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {geographicalData.reduce((sum, item) => sum + item.patients, 0)}
                            </div>
                            <div className="text-sm text-gray-600">إجمالي المرضى</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {Math.round(geographicalData.reduce((sum, item) => sum + item.success, 0) / geographicalData.length)}%
                            </div>
                            <div className="text-sm text-gray-600">متوسط معدل النجاح</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-purple-600" />
                          توزيع أنواع الحالات
                        </CardTitle>
                        <CardDescription>
                          التوزيع النسبي لأنواع اضطرابات النطق
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={casesDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {casesDistribution.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => [`${value}%`, 'النسبة']} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          {casesDistribution.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: item.color }}
                              ></div>
                              <span>{item.name}</span>
                              <span className="font-semibold text-gray-600">{item.value}%</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* جدول تفصيلي للبيانات الجغرافية */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        تفاصيل البيان��ت الجغرافية
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-right p-3 font-semibold">الولاية</th>
                              <th className="text-right p-3 font-semibold">عدد المرضى</th>
                              <th className="text-right p-3 font-semibold">إجمالي الحالات</th>
                              <th className="text-right p-3 font-semibold">معدل النجاح</th>
                              <th className="text-right p-3 font-semibold">الحالة</th>
                            </tr>
                          </thead>
                          <tbody>
                            {geographicalData.map((item, index) => (
                              <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{item.region}</td>
                                <td className="p-3">{item.patients}</td>
                                <td className="p-3">{item.cases}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    item.success >= 80 ? 'bg-green-100 text-green-800' :
                                    item.success >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {item.success}%
                                  </span>
                                </td>
                                <td className="p-3">
                                  <Badge variant={item.success >= 80 ? 'default' : 'secondary'}>
                                    {item.success >= 80 ? 'ممتاز' : item.success >= 70 ? 'جيد' : 'يحتاج تحسين'}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-6">
                  {/* Profile Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        معلومات الحساب
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">الاسم الكامل</label>
                          <Input defaultValue="د. أحمد محمد" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">التخصص</label>
                          <Input defaultValue="أخصائي أرطوفوني" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">البريد الإلكتروني</label>
                          <Input type="email" defaultValue="ahmed.mohamed@example.com" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">رقم الهاتف</label>
                          <Input defaultValue="+966 50 123 4567" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">رقم الترخيص المهني</label>
                          <Input defaultValue="SPT-2024-001" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">جهة العمل</label>
                          <Input defaultValue="مستشفى الملك فهد التخصصي" />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          حفظ التغييرات
                        </Button>
                        <Button variant="outline">
                          إلغاء
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Notification Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        إعدادات التنبيهات
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">تنبيهات ��لمواعيد</p>
                          <p className="text-sm text-gray-600">إرسال تذكير قبل المواعيد</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">تنبيهات المرضى الجدد</p>
                          <p className="text-sm text-gray-600">إشعار عند تسجيل مريض جديد</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">تنبيهات التقارير</p>
                          <p className="text-sm text-gray-600">إشعار عند إنجاز التقارير الدورية</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">تنبيهات البريد الإلكتروني</p>
                          <p className="text-sm text-gray-600">استقبال التنبيهات عبر البريد</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* System Preferences */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        تفضيلات النظام
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">اللغة</label>
                          <select className="w-full p-2 border rounded-md">
                            <option value="ar">العربية</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">المنطقة الزمنية</label>
                          <select className="w-full p-2 border rounded-md">
                            <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                            <option value="Asia/Dubai">دبي (GMT+4)</option>
                            <option value="Africa/Cairo">القاهرة (GMT+2)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">تنسيق التاريخ</label>
                          <select className="w-full p-2 border rounded-md">
                            <option value="dd/mm/yyyy">ي��م/شهر/سنة</option>
                            <option value="mm/dd/yyyy">شهر/يوم/سنة</option>
                            <option value="yyyy-mm-dd">سنة-شهر-يوم</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">عدد المرضى في الصفحة</label>
                          <select className="w-full p-2 border rounded-md">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">الوضع المظلم</p>
                          <p className="text-sm text-gray-600">تفعيل المظهر المظلم للتطبيق</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">الصوت في التمارين</p>
                          <p className="text-sm text-gray-600">تشغيل الصوت في تمارين الأطفال</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Privacy & Security */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        الخصوصية والأمان
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">
                          تغيير كلمة ا��مرور
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          إعداد المصادقة الثنائية
                        </Button>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">مشاركة البيانات للتطوير</p>
                            <p className="text-sm text-gray-600">المساعدة في تحسين النظام (بيانات مجهولة)</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">حفظ جلسات العمل</p>
                            <p className="text-sm text-gray-600">البقاء مسجلاً لفترة أطول</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Data Management */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        إدارة البيانات
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          تصدير بيانات المرضى
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          ��صدير التقارير
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          نسخ احتياطية
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50">
                          <Activity className="w-4 h-4" />
                          حذف البيانات
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Support & Help */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="w-5 h-5" />
                        الدعم والمساعدة
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Button variant="outline" className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          دليل المستخدم
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          التواصل مع الدعم
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          تقييم التطبيق
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Brain className="w-4 h-4" />
                          معلومات النسخة
                        </Button>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-2">معلومات النسخة</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Ortho Smart v2.1.0</p>
                          <p>تاريخ آخر تحديث: 15 يناير 2024</p>
                          <p>رقم البناء: 2024.01.15.001</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  مواع��د اليوم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments.map((appointment, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {appointment.time}
                        </Badge>
                        <span className="text-xs text-gray-500">{appointment.type}</span>
                      </div>
                      <p className="font-medium text-sm">{appointment.patient}</p>
                      <p className="text-xs text-gray-600">ولي الأمر: {appointment.parent}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  عرض جميع المواعيد
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">إجراءات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/attention-exercises')}
                >
                  <Target className="w-4 h-4 ml-2" />
                  تمارين الانتباه
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/orthophonic-balance')}
                >
                  <FileText className="w-4 h-4 ml-2" />
                  الميزانية الأرطوفونية
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/age-calculator')}
                >
                  <Calculator className="w-4 h-4 ml-2" />
                  حساب العمر
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 ml-2" />
                  مريض جديد
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
