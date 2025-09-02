import React from "react";
import {
  ArrowLeft,
  Home,
  Download,
  Printer,
  FileText,
  RotateCcw,
  Eye,
  Volume2,
  CheckCircle,
  XCircle,
  Brain,
  Trophy,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Filter,
  Search,
  Save,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

interface ChildInfo {
  child_id: string;
  name: string;
  age: number;
  grade_level: string;
  test_date: string;
}

interface QuestionMetadata {
  question_id: number;
  task: string;
  label: string;
  skill_group: string;
  media: {
    image_url?: string;
    audio_url?: string;
  };
  correct_answer: string;
  choices: string[];
}

interface ChildAnswer {
  question_id: number;
  task: string;
  chosen_answer: string;
  correct_answer: string;
  is_correct: boolean;
  score: number;
  time_spent_ms: number;
}

interface ResponseSheetData {
  child: ChildInfo;
  summary: {
    total_score: number;
    max_score: number;
    correct_count: number;
    wrong_count: number;
    completion_percentage: number;
    duration_minutes: number;
    by_group: Record<string, { correct: number; total: number; percentage: number }>;
  };
  answers: ChildAnswer[];
  metadata: QuestionMetadata[];
}

export default function DiagnosticResponseSheet() {
  const navigate = useNavigate();
  const location = useLocation();
  const [responseData, setResponseData] = useState<ResponseSheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterTask, setFilterTask] = useState<string>("all");
  const [filterResult, setFilterResult] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // مفتاح الإجابات الصحيحة
  const answerKey: QuestionMetadata[] = [
    // المهمة A: الوجوه الانفعالية (1-4)
    {
      question_id: 1,
      task: "A",
      label: "ضع إصبعك على الوجه السعيد",
      skill_group: "الانفعالات",
      media: { image_url: "/assets/emotions/happy.png", audio_url: "/assets/audio/q1.mp3" },
      correct_answer: "😊",
      choices: ["😊", "😢", "😠", "😨"]
    },
    {
      question_id: 2,
      task: "A",
      label: "أين الوجه الحزين؟",
      skill_group: "الانفعالات",
      media: { image_url: "/assets/emotions/sad.png", audio_url: "/assets/audio/q2.mp3" },
      correct_answer: "😢",
      choices: ["😊", "😢", "😠", "😨"]
    },
    {
      question_id: 3,
      task: "A",
      label: "اختر الوجه الغاضب",
      skill_group: "الانفعالات",
      media: { image_url: "/assets/emotions/angry.png", audio_url: "/assets/audio/q3.mp3" },
      correct_answer: "😠",
      choices: ["😊", "😢", "😠", "😨"]
    },
    {
      question_id: 4,
      task: "A",
      label: "أين الوجه الخائف؟",
      skill_group: "الانفعالات",
      media: { image_url: "/assets/emotions/scared.png", audio_url: "/assets/audio/q4.mp3" },
      correct_answer: "😨",
      choices: ["😊", "😢", "😠", "😨"]
    },
    // المهمة B: مها والبسكويت (5-6)
    {
      question_id: 5,
      task: "B",
      label: "ماذا تريد مها؟",
      skill_group: "الرغبات والمشاعر",
      media: { image_url: "/assets/maha/cookie1.png", audio_url: "/assets/audio/q5.mp3" },
      correct_answer: "🍪 بسكويت",
      choices: ["🍪 بسكويت", "🍎 تفاحة", "🧃 عصير"]
    },
    {
      question_id: 6,
      task: "B",
      label: "كيف ستشعر مها؟",
      skill_group: "الرغبات والمشاعر",
      media: { image_url: "/assets/maha/cookie2.png", audio_url: "/assets/audio/q6.mp3" },
      correct_answer: "😊 سعيدة",
      choices: ["😊 سعيدة", "😢 حزينة", "😠 غاضبة"]
    },
    // المهمة C: أمجاد والنظارة (7)
    {
      question_id: 7,
      task: "C",
      label: "أين تظن أمجاد أن نظارتها ستكون؟",
      skill_group: "المعتقد الخاطئ",
      media: { image_url: "/assets/amjad/glasses.png", audio_url: "/assets/audio/q7.mp3" },
      correct_answer: "📱 على الطاولة",
      choices: ["📱 على الطاولة", "📦 في الدرج", "🛏️ على السرير"]
    },
    // المهمة D: ياسمينة وسعيد مع التمثال (8-9)
    {
      question_id: 8,
      task: "D",
      label: "ماذا ترى ياسمينة؟",
      skill_group: "وجهات النظر",
      media: { image_url: "/assets/yasmina/statue1.png", audio_url: "/assets/audio/q8.mp3" },
      correct_answer: "😊 وجه التمثال",
      choices: ["😊 وجه التمثال", "🔙 ظهر التمثال", "👂 جانب التمثال"]
    },
    {
      question_id: 9,
      task: "D",
      label: "ماذا يرى سعيد؟",
      skill_group: "وجهات النظر",
      media: { image_url: "/assets/yasmina/statue2.png", audio_url: "/assets/audio/q9.mp3" },
      correct_answer: "🔙 ظهر التمثال",
      choices: ["😊 وجه التمثال", "🔙 ظهر التمثال", "👂 جانب التمثال"]
    },
    // المهمة E: ناصر والمفاتيح (10)
    {
      question_id: 10,
      task: "E",
      label: "أين سيبحث ناصر أولاً؟",
      skill_group: "الأماكن والتتبع",
      media: { image_url: "/assets/nasser/keys.png", audio_url: "/assets/audio/q10.mp3" },
      correct_answer: "👖 في جيبه",
      choices: ["👖 في جيبه", "📱 على الطاولة", "🚗 في السيارة"]
    },
    // المهمة F: فيصل والكتاب (11-13)
    {
      question_id: 11,
      task: "F",
      label: "أين وضع فيصل الكتاب؟",
      skill_group: "المعتقد الخاطئ",
      media: { image_url: "/assets/faisal/book1.png", audio_url: "/assets/audio/q11.mp3" },
      correct_answer: "📱 على الطاولة",
      choices: ["📱 على الطاولة", "📦 في الدرج", "🛏️ على السرير"]
    },
    {
      question_id: 12,
      task: "F",
      label: "أين الكتاب الآن؟",
      skill_group: "المعتقد الخاطئ",
      media: { image_url: "/assets/faisal/book2.png", audio_url: "/assets/audio/q12.mp3" },
      correct_answer: "📦 في الدرج",
      choices: ["📱 على الطاولة", "📦 في الدرج", "🛏️ على السرير"]
    },
    {
      question_id: 13,
      task: "F",
      label: "أين سيبحث فيصل أولاً؟",
      skill_group: "المعتقد الخاطئ",
      media: { image_url: "/assets/faisal/book3.png", audio_url: "/assets/audio/q13.mp3" },
      correct_answer: "📱 على الطاولة",
      choices: ["📱 على الطاولة", "📦 في الدرج", "🛏️ على السرير"]
    },
    // المهمة G: خالد وهدية العيد (14-19)
    {
      question_id: 14,
      task: "G",
      label: "ماذا يريد خالد؟",
      skill_group: "المعتقد الخاطئ",
      media: { image_url: "/assets/khalid/gift1.png", audio_url: "/assets/audio/q14.mp3" },
      correct_answer: "✈️ طائرة",
      choices: ["✈️ طائرة", "🚂 قطار", "🚗 سيارة"]
    },
    {
      question_id: 15,
      task: "G",
      label: "ماذا ��عتقد الأب أن خالد يريد؟",
      skill_group: "المعتقد الخاطئ",
      media: { image_url: "/assets/khalid/gift2.png", audio_url: "/assets/audio/q15.mp3" },
      correct_answer: "🚂 قطار",
      choices: ["✈️ طائرة", "🚂 قطار", "🚗 سيارة"]
    },
    {
      question_id: 16,
      task: "G",
      label: "كيف سيشعر خالد عندما يرى القطار؟",
      skill_group: "المعتقد الخاطئ",
      media: { image_url: "/assets/khalid/gift3.png", audio_url: "/assets/audio/q16.mp3" },
      correct_answer: "😢 حزين",
      choices: ["😊 سعيد", "😢 حزين", "😐 عادي"]
    },
    {
      question_id: 17,
      task: "G",
      label: "ماذا يظن الأب أن خالد سيشعر؟",
      skill_group: "المعتقد الخاطئ",
      media: { image_url: "/assets/khalid/gift4.png", audio_url: "/assets/audio/q17.mp3" },
      correct_answer: "😊 سعيد",
      choices: ["😊 سعيد", "😢 حزين", "😐 عادي"]
    },
    // المهمة H: رامي ومريم مع الصحون (18-22)
    {
      question_id: 18,
      task: "H",
      label: "أي صحن وضعه رامي بجانب الموقد؟",
      skill_group: "��لأماكن والتتبع",
      media: { image_url: "/assets/rami/plates1.png", audio_url: "/assets/audio/q18.mp3" },
      correct_answer: "🍝 المكرونة",
      choices: ["🍝 المكرونة", "🥗 السلطة", "🍞 الخبز"]
    },
    {
      question_id: 19,
      task: "H",
      label: "أي صحن وض��ته مريم بجانب الموقد؟",
      skill_group: "الأماكن والتتبع",
      media: { image_url: "/assets/rami/plates2.png", audio_url: "/assets/audio/q19.mp3" },
      correct_answer: "🥗 السلطة",
      choices: ["🍝 المكرونة", "🥗 السلطة", "🍞 الخبز"]
    },
    {
      question_id: 20,
      task: "H",
      label: "أين سيبحث رامي عن المكرونة؟",
      skill_group: "الأماكن والتتبع",
      media: { image_url: "/assets/rami/plates3.png", audio_url: "/assets/audio/q20.mp3" },
      correct_answer: "🔥 بجانب الموقد",
      choices: ["🔥 بجانب الموقد", "📱 على الطاولة", "❄️ في الثلاجة"]
    },
    // المهمة I: منصور والدراجة (21-22)
    {
      question_id: 21,
      task: "I",
      label: "ماذا يتوقع منصور أن يحصل عليه؟",
      skill_group: "المعتقد الخاطئ",
      media: { image_url: "/assets/mansour/bike1.png", audio_url: "/assets/audio/q21.mp3" },
      correct_answer: "🛼 سكيت",
      choices: ["🚲 دراجة", "🛼 سكيت", "⚽ كرة"]
    },
    {
      question_id: 22,
      task: "I",
      label: "ماذا ستخبر الأم الجد؟",
      skill_group: "المعتقد الخاطئ",
      media: { image_url: "/assets/mansour/bike2.png", audio_url: "/assets/audio/q22.mp3" },
      correct_answer: "🚲 دراجة",
      choices: ["🚲 دراجة", "🛼 سكيت", "🎁 مفاجأة"]
    }
  ];

  // محاكاة البيانات (في التطبيق الحقيقي ستأتي من localStorage أو قاعدة البيانات)
  const mockResponseData: ResponseSheetData = {
    child: {
      child_id: "child_001",
      name: "أحمد محمد الأمين",
      age: 7,
      grade_level: "الصف الثاني الابتدائي",
      test_date: new Date().toISOString()
    },
    summary: {
      total_score: 20,
      max_score: 22,
      correct_count: 20,
      wrong_count: 2,
      completion_percentage: 91,
      duration_minutes: 8,
      by_group: {
        "الانفعالات": { correct: 4, total: 4, percentage: 100 },
        "الرغبات والمشاعر": { correct: 2, total: 2, percentage: 100 },
        "وجهات النظر": { correct: 2, total: 2, percentage: 100 },
        "المعتقد الخاطئ": { correct: 8, total: 10, percentage: 80 },
        "الأماكن والتتبع": { correct: 4, total: 4, percentage: 100 }
      }
    },
    answers: [
      { question_id: 1, task: "A", chosen_answer: "😊", correct_answer: "😊", is_correct: true, score: 1, time_spent_ms: 3200 },
      { question_id: 2, task: "A", chosen_answer: "😢", correct_answer: "😢", is_correct: true, score: 1, time_spent_ms: 2800 },
      { question_id: 3, task: "A", chosen_answer: "😠", correct_answer: "😠", is_correct: true, score: 1, time_spent_ms: 2500 },
      { question_id: 4, task: "A", chosen_answer: "😨", correct_answer: "😨", is_correct: true, score: 1, time_spent_ms: 3100 },
      { question_id: 5, task: "B", chosen_answer: "🍪 بسكويت", correct_answer: "🍪 بسكويت", is_correct: true, score: 1, time_spent_ms: 4200 },
      { question_id: 6, task: "B", chosen_answer: "😊 سعيدة", correct_answer: "😊 سعيدة", is_correct: true, score: 1, time_spent_ms: 3800 },
      { question_id: 7, task: "C", chosen_answer: "📦 في الدرج", correct_answer: "📱 على الطاولة", is_correct: false, score: 0, time_spent_ms: 6500 },
      { question_id: 8, task: "D", chosen_answer: "😊 وجه التمثال", correct_answer: "😊 وجه التمثال", is_correct: true, score: 1, time_spent_ms: 5200 },
      { question_id: 9, task: "D", chosen_answer: "🔙 ظهر التمثال", correct_answer: "🔙 ظهر التمثال", is_correct: true, score: 1, time_spent_ms: 4800 },
      { question_id: 10, task: "E", chosen_answer: "👖 في جيبه", correct_answer: "👖 في جيبه", is_correct: true, score: 1, time_spent_ms: 5800 },
      { question_id: 11, task: "F", chosen_answer: "📱 على الطاولة", correct_answer: "📱 على الطاولة", is_correct: true, score: 1, time_spent_ms: 4200 },
      { question_id: 12, task: "F", chosen_answer: "📦 في الدرج", correct_answer: "📦 في الدرج", is_correct: true, score: 1, time_spent_ms: 3900 },
      { question_id: 13, task: "F", chosen_answer: "📱 على الطاولة", correct_answer: "📱 على الطاولة", is_correct: true, score: 1, time_spent_ms: 4600 },
      { question_id: 14, task: "G", chosen_answer: "✈️ طائرة", correct_answer: "✈️ طائرة", is_correct: true, score: 1, time_spent_ms: 3800 },
      { question_id: 15, task: "G", chosen_answer: "🚂 قطار", correct_answer: "🚂 قطار", is_correct: true, score: 1, time_spent_ms: 4100 },
      { question_id: 16, task: "G", chosen_answer: "😊 سعيد", correct_answer: "😢 حزين", is_correct: false, score: 0, time_spent_ms: 7200 },
      { question_id: 17, task: "G", chosen_answer: "😊 سعيد", correct_answer: "😊 سعيد", is_correct: true, score: 1, time_spent_ms: 5400 },
      { question_id: 18, task: "H", chosen_answer: "🍝 المكرونة", correct_answer: "🍝 المكرونة", is_correct: true, score: 1, time_spent_ms: 4800 },
      { question_id: 19, task: "H", chosen_answer: "🥗 السلطة", correct_answer: "🥗 السلطة", is_correct: true, score: 1, time_spent_ms: 4200 },
      { question_id: 20, task: "H", chosen_answer: "🔥 بجانب الموقد", correct_answer: "🔥 بجانب الموقد", is_correct: true, score: 1, time_spent_ms: 5100 },
      { question_id: 21, task: "I", chosen_answer: "🛼 سكيت", correct_answer: "🛼 سكيت", is_correct: true, score: 1, time_spent_ms: 6200 },
      { question_id: 22, task: "I", chosen_answer: "🚲 دراجة", correct_answer: "🚲 دراجة", is_correct: true, score: 1, time_spent_ms: 5800 }
    ],
    metadata: answerKey
  };

  useEffect(() => {
    // في التطبيق الحقيقي، ستأتي البيانات من location.state أو API
    setResponseData(mockResponseData);
    setLoading(false);
  }, []);

  const speakArabic = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleExportPDF = async () => {
    // في التطبيق الحقيق��، استخدم مكتبة مثل jsPDF
    const printWindow = window.open('', '_blank');
    if (printWindow && responseData) {
      printWindow.document.write(`
        <html dir="rtl">
          <head>
            <title>ورقة الاستجابة - ${responseData.child.name}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; direction: rtl; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
              .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
              .card { border: 1px solid #ddd; padding: 10px; text-align: center; border-radius: 5px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
              th { background-color: #f5f5f5; }
              .correct { color: green; }
              .incorrect { color: red; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>الاختبارات التشخيصية - ورقة الاستجابة</h1>
              <h2>نظرية العقل</h2>
              <p><strong>الاسم:</strong> ${responseData.child.name}</p>
              <p><strong>العمر:</strong> ${responseData.child.age} سنوات</p>
              <p><strong>المستوى:</strong> ${responseData.child.grade_level}</p>
              <p><strong>التاريخ:</strong> ${new Date(responseData.child.test_date).toLocaleDateString('ar-SA')}</p>
            </div>

            <div class="summary">
              <div class="card">
                <h3>النتيجة الكلية</h3>
                <p>${responseData.summary.total_score}/${responseData.summary.max_score}</p>
              </div>
              <div class="card">
                <h3>الإجابات الصحيحة</h3>
                <p>${responseData.summary.correct_count} ✅</p>
              </div>
              <div class="card">
                <h3>الإجابات الخاطئة</h3>
                <p>${responseData.summary.wrong_count} ❌</p>
              </div>
              <div class="card">
                <h3>نسبة الإنجاز</h3>
                <p>${responseData.summary.completion_percentage}%</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>رقم السؤال</th>
                  <th>المهمة</th>
                  <th>السؤال</th>
                  <th>إجابة الطفل</th>
                  <th>الإجابة الصحيحة</th>
                  <th>النتيجة</th>
                </tr>
              </thead>
              <tbody>
                ${responseData.answers.map(answer => {
                  const metadata = responseData.metadata.find(m => m.question_id === answer.question_id);
                  return `
                    <tr>
                      <td>${answer.question_id}</td>
                      <td>${answer.task}</td>
                      <td>${metadata?.label || ''}</td>
                      <td>${answer.chosen_answer}</td>
                      <td>${answer.correct_answer}</td>
                      <td class="${answer.is_correct ? 'correct' : 'incorrect'}">
                        ${answer.is_correct ? '✅' : '❌'}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleExportExcel = () => {
    if (!responseData) return;

    const csvData = [
      ['رقم السؤال', 'المهمة', 'المجموعة', 'السؤال', 'إجابة الطفل', 'الإجابة الصحيحة', 'صحيح/خطأ', 'النقاط'],
      ...responseData.answers.map(answer => {
        const metadata = responseData.metadata.find(m => m.question_id === answer.question_id);
        return [
          answer.question_id,
          answer.task,
          metadata?.skill_group || '',
          metadata?.label || '',
          answer.chosen_answer,
          answer.correct_answer,
          answer.is_correct ? 'صحيح' : 'خطأ',
          answer.score
        ];
      })
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `نتائج_${responseData.child.name}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const toggleRowExpansion = (questionId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedRows(newExpanded);
  };

  const filteredAnswers = responseData?.answers.filter(answer => {
    const metadata = responseData.metadata.find(m => m.question_id === answer.question_id);
    const matchesTask = filterTask === "all" || answer.task === filterTask;
    const matchesResult = filterResult === "all" ||
      (filterResult === "correct" && answer.is_correct) ||
      (filterResult === "incorrect" && !answer.is_correct);
    const matchesSearch = searchTerm === "" ||
      metadata?.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      answer.chosen_answer.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTask && matchesResult && matchesSearch;
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">جاري تحضير ورقة الاستجابة...</p>
        </div>
      </div>
    );
  }

  if (!responseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center" dir="rtl">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">لا توجد بيانات</h2>
            <p className="text-gray-600 mb-6">لم يتم العثور على نتائج الاختبار</p>
            <Button onClick={() => navigate('/theory-of-mind-games')}>
              العودة للاختبار
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/theory-of-mind-games')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                العودة للاختبار
              </Button>
              <Button
                onClick={() => navigate('/specialist-dashboard')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                الرئيسية
              </Button>
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">الاختبارات التشخيصية - ورقة الاستجابة</h1>
              <p className="text-sm text-gray-600">نظرية العقل</p>
            </div>

            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-600" />
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                اكتمل
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* معلومات الطفل */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              بيانات الطفل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">الاسم</p>
                <p className="text-lg font-bold text-gray-800">{responseData.child.name}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">العمر</p>
                <p className="text-lg font-bold text-gray-800">{responseData.child.age} سنوات</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">المستوى الدراسي</p>
                <p className="text-lg font-bold text-gray-800">{responseData.child.grade_level}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">تاريخ الاختبار</p>
                <p className="text-lg font-bold text-gray-800">
                  {new Date(responseData.child.test_date).toLocaleDateString('ar-SA')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ملخص النتائج */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* مخطط دائري للنتيجة الإجمالية */}
          <Card className="md:col-span-4 lg:col-span-1 mb-6 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="p-6 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60" cy="60" r="50"
                    stroke="#e5e7eb" strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="60" cy="60" r="50"
                    stroke={responseData.summary.completion_percentage >= 85 ? "#10b981" :
                           responseData.summary.completion_percentage >= 70 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${responseData.summary.completion_percentage * 3.14} 314`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">
                    {responseData.summary.completion_percentage}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">نسبة الإنجاز</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">النتيجة الكلية</p>
              <p className="text-3xl font-bold text-blue-600">
                {responseData.summary.total_score}/{responseData.summary.max_score}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">الإجابات الصحيحة</p>
              <p className="text-3xl font-bold text-green-600">{responseData.summary.correct_count} ✅</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">الإجابات الخاطئة</p>
              <p className="text-3xl font-bold text-red-600">{responseData.summary.wrong_count} ❌</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">المدة المستغرقة</p>
              <p className="text-3xl font-bold text-purple-600">{responseData.summary.duration_minutes}:00</p>
            </CardContent>
          </Card>
        </div>

        {/* النتائج حسب المجموعات */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              النتائج حسب المهارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(responseData.summary.by_group).map(([group, stats]) => (
                <div key={group} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">{group}</p>
                  <p className="text-xl font-bold text-gray-800">{stats.correct}/{stats.total}</p>
                  <Progress value={stats.percentage} className="h-2 mt-2" />
                  <p className="text-xs text-gray-500 mt-1">{stats.percentage}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* تفسير النتائج */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              تفسير النتائج والتوصيات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-gray-800">تقييم عام:</h4>
                {responseData.summary.completion_percentage >= 85 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">✅ أداء ممتاز</p>
                    <p className="text-sm text-green-700 mt-1">
                      الطفل يُظهر فهماً متقدماً لنظرية العقل ومهارات تفكير اجتماعي قوية.
                    </p>
                  </div>
                )}
                {responseData.summary.completion_percentage >= 70 && responseData.summary.completion_percentage < 85 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 font-medium">⚠️ أداء جيد</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      الطفل يُظهر فهماً أساسياً جيداً مع إمكانية للتطوير في بعض المجالات.
                    </p>
                  </div>
                )}
                {responseData.summary.completion_percentage < 70 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">🔄 يحتاج دعم إضافي</p>
                    <p className="text-sm text-red-700 mt-1">
                      يُنصح بالمزيد من التمارين والدعم في مهارات نظرية العقل.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-gray-800">التوصيات:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  {responseData.summary.by_group["الانفعالات"]?.percentage < 75 && (
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>تمارين إضافية للتعرف على المشاعر والانفعالات</span>
                    </li>
                  )}
                  {responseData.summary.by_group["المعتقد الخاطئ"]?.percentage < 75 && (
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>أنشطة لتطوير فهم المعتقدات الخاطئة والتوقعات</span>
                    </li>
                  )}
                  {responseData.summary.by_group["وجهات النظر"]?.percentage < 75 && (
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      <span>تمارين لفهم وجهات النظر المختلفة</span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>متابعة دورية كل 3-6 أشهر لتقييم التقدم</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600">•</span>
                    <span>تطبيق أنشطة التفكير الاجتماعي في الحياة اليومية</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* أدوات التصفية */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="البحث في الأسئلة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              <Select value={filterTask} onValueChange={setFilterTask}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="تصفية حسب المهمة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المهام</SelectItem>
                  <SelectItem value="A">المهمة A - الانفعالات</SelectItem>
                  <SelectItem value="B">المهمة B - مها والبسكويت</SelectItem>
                  <SelectItem value="C">المهمة C - أمجاد والنظارة</SelectItem>
                  <SelectItem value="D">المهمة D - ياسمينة وسعيد</SelectItem>
                  <SelectItem value="E">المهمة E - ناصر والمفاتيح</SelectItem>
                  <SelectItem value="F">المهمة F - فيصل والكتاب</SelectItem>
                  <SelectItem value="G">المهمة G - خالد والهدية</SelectItem>
                  <SelectItem value="H">المهمة H - رامي ومريم</SelectItem>
                  <SelectItem value="I">المهمة I - منصور والدراجة</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterResult} onValueChange={setFilterResult}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="تصفية حسب النتيجة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع النتائج</SelectItem>
                  <SelectItem value="correct">الإجابات الصحيحة</SelectItem>
                  <SelectItem value="incorrect">الإجابات الخاطئة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* جدول الإجابات التفصيلي */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              جدول الإجابات التفصيلي
            </CardTitle>
            <CardDescription>
              انقر على أي صف لعرض تفاصيل إضافية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 sticky top-0 bg-white">
                    <th className="text-right p-3 font-semibold">رقم السؤال</th>
                    <th className="text-right p-3 font-semibold">المهمة</th>
                    <th className="text-right p-3 font-semibold">المجموعة</th>
                    <th className="text-right p-3 font-semibold">السؤال</th>
                    <th className="text-right p-3 font-semibold">إجابة الطفل</th>
                    <th className="text-right p-3 font-semibold">الإجابة الصحيحة</th>
                    <th className="text-right p-3 font-semibold">النتيجة</th>
                    <th className="text-right p-3 font-semibold">الوقت</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnswers.map((answer) => {
                    const metadata = responseData.metadata.find(m => m.question_id === answer.question_id);
                    const isExpanded = expandedRows.has(answer.question_id);

                    return (
                      <React.Fragment key={answer.question_id}>
                        <tr
                          className={`border-b hover:bg-gray-50 cursor-pointer ${answer.is_correct ? 'bg-green-50' : 'bg-red-50'}`}
                          onClick={() => toggleRowExpansion(answer.question_id)}
                        >
                          <td className="p-3 font-medium">{answer.question_id}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              {answer.task}
                            </Badge>
                          </td>
                          <td className="p-3 text-xs">{metadata?.skill_group}</td>
                          <td className="p-3 max-w-xs truncate">{metadata?.label}</td>
                          <td className="p-3">{answer.chosen_answer}</td>
                          <td className="p-3">{answer.correct_answer}</td>
                          <td className="p-3">
                            <Badge variant={answer.is_correct ? "default" : "destructive"}>
                              {answer.is_correct ? "✅ صحيح" : "❌ خطأ"}
                            </Badge>
                          </td>
                          <td className="p-3 text-xs text-gray-500">
                            {(answer.time_spent_ms / 1000).toFixed(1)}ث
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="bg-gray-100">
                            <td colSpan={8} className="p-4">
                              <div className="flex items-center gap-4">
                                {metadata?.media.image_url && (
                                  <div className="text-6xl">📋</div>
                                )}

                                <div className="flex-1">
                                  <p className="font-medium text-gray-800 mb-2">
                                    {metadata?.label}
                                  </p>
                                  <div className="flex gap-2 mb-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => speakArabic(metadata?.label || '')}
                                    >
                                      <Volume2 className="w-4 h-4 ml-1" />
                                      تشغيل الصوت
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => navigate(`/theory-of-mind-games?review=true&question=${answer.question_id}`)}
                                    >
                                      <Eye className="w-4 h-4 ml-1" />
                                      مراجعة السؤال
                                    </Button>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    الخيارات المتاحة: {metadata?.choices.join(" | ")}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* أزرار الإجراءات */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">التصدير والطباعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleExportPDF}
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              >
                <Download className="w-4 h-4 ml-2" />
                تصدير PDF
              </Button>
              <Button
                onClick={handleExportExcel}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                <FileText className="w-4 h-4 ml-2" />
                تصدير Excel
              </Button>
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="w-full"
              >
                <Printer className="w-4 h-4 ml-2" />
                طباعة
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">المراجعة والتكرار</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => navigate('/theory-of-mind-games?mode=review')}
                variant="outline"
                className="w-full"
              >
                <Eye className="w-4 h-4 ml-2" />
                مراجعة الأسئلة
              </Button>
              <Button
                onClick={() => navigate('/theory-of-mind-games')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                <RotateCcw className="w-4 h-4 ml-2" />
                إعادة المحاولة
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">حفظ وإدارة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  localStorage.setItem(`test_result_${responseData.child.child_id}`, JSON.stringify(responseData));
                  alert('تم حفظ النتائج بنجاح');
                }}
              >
                <Save className="w-4 h-4 ml-2" />
                حفظ السجل
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/specialist-dashboard')}
              >
                <Home className="w-4 h-4 ml-2" />
                العودة للوحة التحكم
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
