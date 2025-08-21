import { 
  ArrowLeft, 
  Save, 
  User, 
  Calendar, 
  MapPin, 
  Users, 
  Baby, 
  School, 
  Stethoscope,
  Eye,
  Ear,
  Brain,
  FileText,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function PatientForm() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("basic");
  const [formData, setFormData] = useState({
    // Basic Information
    specialist: "",
    examDate: "",
    fullName: "",
    birthDate: "",
    bloodType: "",
    apgarScore: "",
    address: "",
    referredBy: "",
    medicalDiagnosis: "",
    psychologicalDiagnosis: "",
    
    // Family Structure
    fatherName: "",
    fatherAge: "",
    fatherBloodType: "",
    fatherEducation: "",
    fatherJob: "",
    motherName: "",
    motherAge: "",
    motherBloodType: "",
    motherEducation: "",
    motherJob: "",
    economicStatus: "",
    relativeBetweenParents: "",
    maritalRelation: "",
    familyMedicalHistory: "",
    homeLanguage: "",
    numberOfChildren: "",
    maleChildren: "",
    femaleChildren: "",
    childOrder: "",
    
    // Pregnancy and Birth History
    pregnancyWanted: "",
    genderWanted: "",
    pregnancyNormal: "",
    motherAgeAtPregnancy: "",
    fatherAgeAtPregnancy: "",
    motherIllnessDuringPregnancy: "",
    medicationDuringPregnancy: "",
    motherPsychologicalStateDuringPregnancy: "",
    birthNormal: "",
    birthOnTime: "",
    birthCry: "",
    bornPremature: "",
    bornBlue: "",
    incubator: "",
    hospitalStayDuration: "",
    motherStateAfterBirth: "",
    breastfeedingType: "",
    
    // Emotional/Behavioral Development
    parentChildAttention: "",
    siblingRelationship: "",
    relationshipWithOthers: "",
    childStability: "",
    behaviorAtHome: "",
    behaviorOutside: "",
    sleepsAlone: "",
    gainedCleanliness: "",
    stillWearsDiapers: "",
    followsInstructions: "",
    
    // Pre-basic Acquisitions
    colorConcept: "",
    sizeConcept: "",
    lateralityConcept: "",
    bodyImage: "",
    spatialTemporal: "",
    smallMovementImitation: "",
    facialExpressionUnderstanding: "",
    gestureUnderstanding: "",
    
    // Pre-school and Schooling
    quranSchool: "",
    kindergarten: "",
    preparatoryPhase: "",
    enrolled: "",
    schoolType: "",
    schoolingAge: "",
    schoolingConditions: "",
    schoolAdaptation: "",
    schoolProblems: "",
    schoolResults: "",
    teacherRelationship: "",
    studentRelationship: "",
    
    // Medical Examinations
    hearingNormal: "",
    hearingProblems: "",
    attentionToSounds: "",
    visionNormal: "",
    visionProblems: "",
    nervousProblems: "",
    headFalls: "",
    eatsAlone: "",
    preferredFood: "",
    swallowingDifficulty: "",
    chewingDifficulty: "",
    voiceUseNormal: "",
    voiceIntensity: "",
    voicePitch: "",
    voiceType: "",
    voiceTone: "",
    throatProblems: "",
    
    // Speech Organs Examination
    lips: "normal",
    teeth: "normal",
    tongue: "normal",
    uvula: "normal",
    cheeks: "normal",
    jaw: "normal",
    palate: "normal",
    oralCavity: "normal",
    nasalCavity: "normal",
    larynx: "normal",
    pharynx: "normal",
    vocalCords: "normal",
    lungs: "normal",
    surgicalOperations: "",
    
    // Oral-Facial Apraxia
    lipMovements: "normal",
    tongueRestraint: "",
    tongueMovements: "normal",
    tongueToChin: "normal",
    tongueToTeeth: "normal",
    tongueToLips: "normal",
    teethDeformity: "",
    teethAlignment: "",
    cheekInflation: "normal",
    whistling: "normal",
    paperBlowing: "normal",
    balloonBlowing: "normal",
    longSound: "normal",
    shortSound: "normal",
    soundWithMovement: "normal"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveProgress = () => {
    // Save form data to localStorage or send to API
    localStorage.setItem('patientFormData', JSON.stringify(formData));
    alert('تم حفظ البيانات بنجاح');
  };

  const submitForm = () => {
    // Validate and submit form
    console.log('Submitting form:', formData);
    alert('تم إرسال النموذج بنجاح');
    navigate('/doctor');
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/doctor')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                العودة للوحة التحكم
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-primary-blue text-white p-2 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-primary-dark">
                    الميزانية الأرطوفونية
                  </h1>
                  <p className="text-text-secondary">نموذج التقييم الشامل</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={saveProgress}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                حفظ التقدم
              </Button>
              <Button 
                onClick={submitForm}
                className="bg-primary-blue hover:bg-primary-blue/90 text-white flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                إرسال النموذج
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          {/* Tabs Navigation */}
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <TabsList className="grid grid-cols-7 w-full">
              <TabsTrigger value="basic" className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4" />
                البيانات الأساسية
              </TabsTrigger>
              <TabsTrigger value="family" className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4" />
                بنية العائلة
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2 text-sm">
                <Baby className="w-4 h-4" />
                تاريخ الحالة
              </TabsTrigger>
              <TabsTrigger value="development" className="flex items-center gap-2 text-sm">
                <Brain className="w-4 h-4" />
                النمو والسلوك
              </TabsTrigger>
              <TabsTrigger value="education" className="flex items-center gap-2 text-sm">
                <School className="w-4 h-4" />
                التعليم
              </TabsTrigger>
              <TabsTrigger value="examination" className="flex items-center gap-2 text-sm">
                <Stethoscope className="w-4 h-4" />
                الفحص الطبي
              </TabsTrigger>
              <TabsTrigger value="speech" className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4" />
                فحص النطق
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Basic Information */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  البيانات الأساسية للمريض
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="specialist">الأخصائية الأرطوفونية</Label>
                    <Input 
                      id="specialist"
                      value={formData.specialist}
                      onChange={(e) => handleInputChange('specialist', e.target.value)}
                      placeholder="اسم الأخصائية"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="examDate">تاريخ الفحص</Label>
                    <Input 
                      id="examDate"
                      type="date"
                      value={formData.examDate}
                      onChange={(e) => handleInputChange('examDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">الإسم واللقب</Label>
                    <Input 
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="الاسم الكامل للطفل"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">تاريخ الإزدياد</Label>
                    <Input 
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">فصيلة الدم</Label>
                    <Select value={formData.bloodType} onValueChange={(value) => handleInputChange('bloodType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر فصيلة الدم" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apgarScore">نتيجة أبقار</Label>
                    <Input 
                      id="apgarScore"
                      value={formData.apgarScore}
                      onChange={(e) => handleInputChange('apgarScore', e.target.value)}
                      placeholder="0-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referredBy">موجه من طرف</Label>
                    <Input 
                      id="referredBy"
                      value={formData.referredBy}
                      onChange={(e) => handleInputChange('referredBy', e.target.value)}
                      placeholder="اسم الطبيب أو المؤسسة"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">العنوان</Label>
                  <Textarea 
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="العنوان الكامل"
                    rows={2}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="medicalDiagnosis">التشخيص الطبي</Label>
                    <Textarea 
                      id="medicalDiagnosis"
                      value={formData.medicalDiagnosis}
                      onChange={(e) => handleInputChange('medicalDiagnosis', e.target.value)}
                      placeholder="التشخيص الطبي للحالة"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="psychologicalDiagnosis">التشخيص النفسي</Label>
                    <Textarea 
                      id="psychologicalDiagnosis"
                      value={formData.psychologicalDiagnosis}
                      onChange={(e) => handleInputChange('psychologicalDiagnosis', e.target.value)}
                      placeholder="التشخيص النفسي للحالة"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Family Structure */}
          <TabsContent value="family">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  بنية العائلة + السوابق المرضية العائلية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Father Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4 text-blue-800">بيانات الأب</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fatherName">إسم ولقب الأب</Label>
                      <Input 
                        id="fatherName"
                        value={formData.fatherName}
                        onChange={(e) => handleInputChange('fatherName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fatherAge">السن</Label>
                      <Input 
                        id="fatherAge"
                        type="number"
                        value={formData.fatherAge}
                        onChange={(e) => handleInputChange('fatherAge', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fatherBloodType">فصيلة الدم</Label>
                      <Select value={formData.fatherBloodType} onValueChange={(value) => handleInputChange('fatherBloodType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="فصيلة الدم" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fatherEducation">المستوى</Label>
                      <Input 
                        id="fatherEducation"
                        value={formData.fatherEducation}
                        onChange={(e) => handleInputChange('fatherEducation', e.target.value)}
                        placeholder="المستوى التعليمي"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fatherJob">المهنة</Label>
                      <Input 
                        id="fatherJob"
                        value={formData.fatherJob}
                        onChange={(e) => handleInputChange('fatherJob', e.target.value)}
                        placeholder="المهنة"
                      />
                    </div>
                  </div>
                </div>

                {/* Mother Information */}
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4 text-pink-800">بيانات الأم</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="motherName">إسم ولقب الأم</Label>
                      <Input 
                        id="motherName"
                        value={formData.motherName}
                        onChange={(e) => handleInputChange('motherName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="motherAge">السن</Label>
                      <Input 
                        id="motherAge"
                        type="number"
                        value={formData.motherAge}
                        onChange={(e) => handleInputChange('motherAge', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="motherBloodType">فصيلة الدم</Label>
                      <Select value={formData.motherBloodType} onValueChange={(value) => handleInputChange('motherBloodType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="فصيلة الدم" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="motherEducation">المستوى</Label>
                      <Input 
                        id="motherEducation"
                        value={formData.motherEducation}
                        onChange={(e) => handleInputChange('motherEducation', e.target.value)}
                        placeholder="المستوى التعليمي"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="motherJob">المهنة</Label>
                      <Input 
                        id="motherJob"
                        value={formData.motherJob}
                        onChange={(e) => handleInputChange('motherJob', e.target.value)}
                        placeholder="المهنة"
                      />
                    </div>
                  </div>
                </div>

                {/* Family Status */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>الحالة الإقتصادية للعائلة</Label>
                      <RadioGroup value={formData.economicStatus} onValueChange={(value) => handleInputChange('economicStatus', value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="بسيطة" id="economic-simple" />
                          <Label htmlFor="economic-simple">بسيطة</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="متوسطة" id="economic-medium" />
                          <Label htmlFor="economic-medium">متوسطة</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="جيدة" id="economic-good" />
                          <Label htmlFor="economic-good">جيدة</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>طبيعة العلاقة الزوجية</Label>
                      <RadioGroup value={formData.maritalRelation} onValueChange={(value) => handleInputChange('maritalRelation', value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="مستقرة" id="relation-stable" />
                          <Label htmlFor="relation-stable">مستقرة</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="مضطربة" id="relation-troubled" />
                          <Label htmlFor="relation-troubled">مضطربة</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="relativeBetweenParents">هل توجد قرابة بين الزوجين؟</Label>
                      <Textarea 
                        id="relativeBetweenParents"
                        value={formData.relativeBetweenParents}
                        onChange={(e) => handleInputChange('relativeBetweenParents', e.target.value)}
                        placeholder="نوع القرابة إن وجدت"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="familyMedicalHistory">هل توجد سوابق مرضية في العائلة؟</Label>
                      <Textarea 
                        id="familyMedicalHistory"
                        value={formData.familyMedicalHistory}
                        onChange={(e) => handleInputChange('familyMedicalHistory', e.target.value)}
                        placeholder="السوابق المرضية العائلية"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Children Information */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4 text-green-800">معلومات الأطفال</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numberOfChildren">عدد الأبناء</Label>
                      <Input 
                        id="numberOfChildren"
                        type="number"
                        value={formData.numberOfChildren}
                        onChange={(e) => handleInputChange('numberOfChildren', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maleChildren">الذكور</Label>
                      <Input 
                        id="maleChildren"
                        type="number"
                        value={formData.maleChildren}
                        onChange={(e) => handleInputChange('maleChildren', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="femaleChildren">الإناث</Label>
                      <Input 
                        id="femaleChildren"
                        type="number"
                        value={formData.femaleChildren}
                        onChange={(e) => handleInputChange('femaleChildren', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="childOrder">رتبته بين اخوته</Label>
                      <Input 
                        id="childOrder"
                        value={formData.childOrder}
                        onChange={(e) => handleInputChange('childOrder', e.target.value)}
                        placeholder="الأول، الثاني، إلخ"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="homeLanguage">اللغة المستعملة في المنزل</Label>
                      <Input 
                        id="homeLanguage"
                        value={formData.homeLanguage}
                        onChange={(e) => handleInputChange('homeLanguage', e.target.value)}
                        placeholder="العربية، الفرنسية، إلخ"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Continue with other tabs... */}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                const tabs = ["basic", "family", "history", "development", "education", "examination", "speech"];
                const currentIndex = tabs.indexOf(currentTab);
                if (currentIndex > 0) setCurrentTab(tabs[currentIndex - 1]);
              }}
              disabled={currentTab === "basic"}
            >
              السابق
            </Button>
            <Button 
              onClick={() => {
                const tabs = ["basic", "family", "history", "development", "education", "examination", "speech"];
                const currentIndex = tabs.indexOf(currentTab);
                if (currentIndex < tabs.length - 1) setCurrentTab(tabs[currentIndex + 1]);
              }}
              disabled={currentTab === "speech"}
              className="bg-primary-blue hover:bg-primary-blue/90"
            >
              التالي
            </Button>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
