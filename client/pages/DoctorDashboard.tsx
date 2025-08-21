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
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("patients");

  // Mock data
  const patients = [
    {
      id: 1,
      name: "أحمد محمد السعيد",
      age: 6,
      lastVisit: "2024-01-15",
      status: "متابعة",
      diagnosis: "تأخر في النطق",
      progress: 75
    },
    {
      id: 2,
      name: "فاطمة علي أحمد",
      age: 5,
      lastVisit: "2024-01-10",
      status: "تقييم أولي",
      diagnosis: "صعوبة في نطق الحروف",
      progress: 45
    },
    {
      id: 3,
      name: "محمد عبدالله",
      age: 7,
      lastVisit: "2024-01-08",
      status: "علاج متقدم",
      diagnosis: "تلعثم في الكلام",
      progress: 90
    }
  ];

  const appointments = [
    { time: "09:00", patient: "أحمد محمد", type: "متابعة" },
    { time: "10:30", patient: "سارة أحمد", type: "تقييم أولي" },
    { time: "14:00", patient: "يوسف علي", type: "جلسة علاج" },
  ];

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
                العودة للرئيسية
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-primary-blue text-white p-2 rounded-lg">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-primary-dark">
                    لوحة تحكم الأطباء
                  </h1>
                  <p className="text-text-secondary">إدارة المرضى والتقييمات</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => navigate('/patient-form')}
                className="bg-primary-blue hover:bg-primary-blue/90 text-white"
              >
                <Plus className="w-4 h-4 ml-2" />
                مريض جديد
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-primary-blue to-primary-blue/80 text-white">
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

          <Card className="bg-gradient-to-r from-primary-green to-primary-green/80 text-white">
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

          <Card className="bg-gradient-to-r from-primary-accent to-primary-accent/80 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">مواعيد اليوم</p>
                  <p className="text-3xl font-bold">8</p>
                </div>
                <Calendar className="w-10 h-10 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-600 to-purple-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">نسبة التحسن</p>
                  <p className="text-3xl font-bold">85%</p>
                </div>
                <TrendingUp className="w-10 h-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Navigation Tabs */}
            <div className="flex gap-2 bg-white rounded-lg p-2">
              <Button
                variant={activeTab === "patients" ? "default" : "ghost"}
                onClick={() => setActiveTab("patients")}
                className={`flex-1 ${activeTab === "patients" ? "bg-primary-blue text-white" : ""}`}
              >
                <Users className="w-4 h-4 ml-2" />
                المرضى
              </Button>
              <Button
                variant={activeTab === "assessments" ? "default" : "ghost"}
                onClick={() => setActiveTab("assessments")}
                className={`flex-1 ${activeTab === "assessments" ? "bg-primary-blue text-white" : ""}`}
              >
                <FileText className="w-4 h-4 ml-2" />
                التقييمات
              </Button>
              <Button
                variant={activeTab === "reports" ? "default" : "ghost"}
                onClick={() => setActiveTab("reports")}
                className={`flex-1 ${activeTab === "reports" ? "bg-primary-blue text-white" : ""}`}
              >
                <ClipboardList className="w-4 h-4 ml-2" />
                التقارير
              </Button>
            </div>

            {/* Patients List */}
            {activeTab === "patients" && (
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
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patients.map((patient) => (
                      <div key={patient.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="bg-primary-blue text-white rounded-full w-12 h-12 flex items-center justify-center font-semibold">
                              {patient.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-primary-dark">{patient.name}</h3>
                              <p className="text-sm text-text-secondary">العمر: {patient.age} سنوات</p>
                              <p className="text-sm text-text-secondary">{patient.diagnosis}</p>
                            </div>
                          </div>
                          <div className="text-left">
                            <Badge 
                              variant={patient.status === "متابعة" ? "default" : "secondary"}
                              className="mb-2"
                            >
                              {patient.status}
                            </Badge>
                            <div className="text-sm text-text-secondary">
                              آخر زيارة: {patient.lastVisit}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="bg-gray-200 rounded-full h-2 w-16">
                                <div 
                                  className="bg-primary-green rounded-full h-2" 
                                  style={{ width: `${patient.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-text-secondary">{patient.progress}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/patient-form?id=${patient.id}`)}
                          >
                            عرض الملف
                          </Button>
                          <Button size="sm" variant="outline">
                            جلسة جديدة
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
            )}

            {/* Assessments */}
            {activeTab === "assessments" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">نماذج التقييم</CardTitle>
                  <CardDescription>
                    النماذج المتاحة للتقييم الأرطوفوني
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card 
                      className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary-blue"
                      onClick={() => navigate('/patient-form')}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-primary-blue/10 p-2 rounded-lg">
                            <FileText className="w-6 h-6 text-primary-blue" />
                          </div>
                          <h3 className="font-semibold">الميزانية الأرطوفونية</h3>
                        </div>
                        <p className="text-sm text-text-secondary mb-4">
                          تقييم شامل لحالة النطق والتواصل
                        </p>
                        <Button size="sm" className="w-full">
                          بدء التقييم
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary-green">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-primary-green/10 p-2 rounded-lg">
                            <ClipboardList className="w-6 h-6 text-primary-green" />
                          </div>
                          <h3 className="font-semibold">فحص الأبراكسيا</h3>
                        </div>
                        <p className="text-sm text-text-secondary mb-4">
                          تقييم الأبراكسيا الفمية الوجهية
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          بدء الفحص
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary-accent">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-primary-accent/10 p-2 rounded-lg">
                            <Activity className="w-6 h-6 text-primary-accent" />
                          </div>
                          <h3 className="font-semibold">تقييم النطق</h3>
                        </div>
                        <p className="text-sm text-text-secondary mb-4">
                          فحص أعضاء النطق والتصويت
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          بدء التقييم
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-purple-500">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <User className="w-6 h-6 text-purple-600" />
                          </div>
                          <h3 className="font-semibold">تقييم السلوك</h3>
                        </div>
                        <p className="text-sm text-text-secondary mb-4">
                          تقييم النمو العاطفي والسلوكي
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          بدء التقييم
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reports */}
            {activeTab === "reports" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">التقارير والإحصائيات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-text-secondary">قريباً - سيتم إضافة التقارير والإحصائيات التفصيلية</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  مواعيد اليوم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments.map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{appointment.patient}</p>
                        <p className="text-xs text-text-secondary">{appointment.type}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {appointment.time}
                      </Badge>
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
                  onClick={() => navigate('/patient-form')}
                >
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة مريض جديد
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 ml-2" />
                  جدولة موعد
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 ml-2" />
                  تقرير سريع
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 ml-2" />
                  الإعدادات
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
