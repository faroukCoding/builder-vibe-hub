import {
  ArrowLeft,
  Brain,
  Eye,
  MessageSquare,
  Users,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  Volume2,
  Home,
  ThoughtBubble,
  Heart,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

export default function TheoryOfMind() {
  const navigate = useNavigate();
  const [currentTest, setCurrentTest] = useState("menu");
  const [testSession, setTestSession] = useState({
    correctAnswers: 0,
    wrongAnswers: 0,
    totalQuestions: 0,
    currentQuestion: 1,
    isTestActive: false,
    testType: "",
  });
  const [feedback, setFeedback] = useState(null);
  const [currentScenario, setCurrentScenario] = useState(null);

  // سيناريوهات اختبار نظرية العقل
  const scenarios = [
    {
      id: 1,
      title: "اختبار الاعتقاد الخاطئ - الصندوق",
      story:
        "سارة تضع قلمها في الصندوق الأزرق، ثم تغادر الغرفة. بينما هي خارجة، يأتي أحمد وينقل القلم إلى الصندوق الأحمر.",
      question: "عندما تعود سارة، أين ستبحث عن قلمها؟",
      options: [
        "الصندوق الأزرق",
        "الصندوق الأحمر",
        "لن تبحث عنه",
        "ستسأل أحمد",
      ],
      correctAnswer: "الصندوق الأزرق",
      explanation: "سارة لا تعلم أن أحمد نقل القل��، لذا ستبحث حيث تركته.",
      ageGroup: "4-6 سنو��ت",
      scenario: "🧒👧📦📝",
    },
    {
      id: 2,
      title: "اختبار المشاعر - الهدية المفاجئة",
      story:
        "يوم عيد ميلاد علي، أعطته أمه صندوقاً جميلاً. علي يعتقد أنه يحتوي على لعبة، لكن عندما فتحه وجد ملابس.",
      question: "كيف شعر علي عندما فتح الصندوق؟",
      options: ["سعيد جداً", "حزين أو مخيب للآمال", "غاضب", "خائف"],
      correctAnswer: "حزين أو مخيب للآمال",
      explanation: "علي توقع لعبة لكنه وجد ملابس، مما سبب له خيبة أمل.",
      ageGroup: "5-7 سنوات",
      scenario: "🎂🎁👦😞",
    },
    {
      id: 3,
      title: "اختبار فهم النوايا",
      story:
        "فاطمة تراقب نورا وهي تحاول الوصول إلى كتاب على الرف العالي. نورا تقف على كرسي وتمد يدها لكنها لا تستطيع الوصول.",
      question: "ماذا تريد نورا أن تفعل؟",
      options: [
        "تريد أن تنظف الرف",
        "تريد أن تأخذ الكتاب",
        "تريد أن تلعب بالكرسي",
        "تريد أن تنام",
      ],
      correctAnswer: "تريد أن تأخذ الكتاب",
      explanation: "من خلال أفعال نورا، يمكن فهم أنها تريد الوصول للكتاب.",
      ageGroup: "4-6 سنوات",
      scenario: "👩📚🪑🙋‍♀️",
    },
    {
      id: 4,
      title: "اختبار التعاطف",
      story: "في الملعب، سقط محمد وجرح ركبته وبدأ يبكي. رآه أصدقاؤه من بعيد.",
      question: "ماذا يجب أن يفعل أصدقاء محمد؟",
      options: [
        "يضحكون عليه",
        "يساعدونه ويهتمون به",
        "يتجاهلونه",
        "يبتعدون عنه",
      ],
      correctAnswer: "يساعدونه ويهتمون به",
      explanation: "التعاطف يتطلب فهم مشاعر الآخرين ومساعدتهم عند الحاجة.",
      ageGroup: "5-8 سنوات",
      scenario: "👦😢🤕👥❤️",
    },
    {
      id: 5,
      title: "اختبار الرغبات المختلفة",
      story:
        "ليلى تحب الآيس كريم بالفراولة، بينما أختها مريم تحب الآيس كريم بالشوكولاتة. أمهما تشتري لكل منهما آيس كريم.",
      question: "أ�� نوع آيس كريم ستشتري الأم لمريم؟",
      options: ["فراولة", "شوكولاتة", "فانيليا", "لن تشتري لها"],
      correctAnswer: "شوكولاتة",
      explanation: "فهم أن الأشخاص المختلفين لديهم تفضيلات مختلفة.",
      ageGroup: "3-5 سنوات",
      scenario: "🍦🍓🍫👧👱‍♀️",
    },
    {
      id: 6,
      title: "اختبار الكذبة البيضاء",
      story:
        "جدة سلمى طبخت لها طعاماً لا تحبه سلمى، لكن الجدة تسأل: 'هل أعجبك الطعام يا حبيبتي؟'",
      question: "ماذا يجب أن تقول سلمى لجدتها؟",
      options: [
        "الطعام سيء",
        "الطعام لذيذ شكراً",
        "لا أريد أن آكل",
        "أريد طعاماً آخر",
      ],
      correctAnswer: "الطعام لذيذ شكراً",
      explanation: "أحياناً نقول أشياء لطيفة لعدم إيذاء مشاعر الآخرين.",
      ageGroup: "6-8 سنوات",
      scenario: "👵🍽️👧💭😊",
    },
    {
      id: 7,
      title: "اختبار التواصل غير اللفظي",
      story: "أبو يوسف يشير بإصبعه نحو الباب، وينظر إلى يوس�� نظرة ��دية.",
      question: "ماذا يريد أب�� يوسف من يوسف؟",
      options: [
        "أن يفتح الباب",
        "أن يغادر الغرفة",
        "أن ينظر للباب",
        "أن يقف هناك",
      ],
      correctAnswer: "أن يغادر الغرفة",
      explanation: "فهم الإشارات غير اللفظية جزء مهم من التواصل.",
      ageGroup: "4-7 سنوات",
      scenario: "👨👉🚪👦",
    },
    {
      id: 8,
      title: "اختبار السببية النفسية",
      story:
        "عندما رأت ليلا أن صديقتها نالت درجة عالية في الامتحان، ابتسمت وصفقت لها.",
      question: "لماذا ابتسمت ليلا وصفقت؟",
      options: [
        "لأنها سعيدة لصديقتها",
        "لأنها تريد أن تلعب",
        "لأنها جائعة",
        "لأنها تريد أن تذهب",
      ],
      correctAnswer: "لأنها سعيدة لصديقتها",
      explanation: "فهم أن المشاعر تنتج عن الأحداث والمواقف.",
      ageGroup: "5-8 سنوات",
      scenario: "👧📝✅😊👏",
    },
  ];

  const playAudio = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";
      speechSynthesis.speak(utterance);
    }
  };

  const handleAnswer = (
    selectedAnswer: string,
    correctAnswer: string,
    explanation: string,
  ) => {
    if (!testSession.isTestActive) return;

    const isCorrect = selectedAnswer === correctAnswer;

    if (isCorrect) {
      setFeedback({
        type: "success",
        message: "ممتاز! إجابة صحيحة!",
        explanation: explanation,
      });
      setTestSession((prev) => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        totalQuestions: prev.totalQuestions + 1,
        currentQuestion: prev.currentQuestion + 1,
      }));
      playAudio("ممتاز! إجابة صحيحة!");
    } else {
      setFeedback({
        type: "error",
        message: `الإجابة الصحيحة هي: ${correctAnswer}`,
        explanation: explanation,
      });
      setTestSession((prev) => ({
        ...prev,
        wrongAnswers: prev.wrongAnswers + 1,
        totalQuestions: prev.totalQuestions + 1,
        currentQuestion: prev.currentQuestion + 1,
      }));
      playAudio(`الإجابة الصحيحة هي ${correctAnswer}`);
    }

    setTimeout(() => {
      setFeedback(null);
      if (testSession.currentQuestion >= 8) {
        endTest();
      } else {
        generateNextQuestion();
      }
    }, 4000);
  };

  const generateNextQuestion = () => {
    const nextScenario = scenarios[testSession.currentQuestion - 1];
    setCurrentScenario(nextScenario);
    playAudio(nextScenario.story + " " + nextScenario.question);
  };

  const startTest = () => {
    setTestSession({
      correctAnswers: 0,
      wrongAnswers: 0,
      totalQuestions: 0,
      currentQuestion: 1,
      isTestActive: true,
      testType: "theory-of-mind",
    });
    setCurrentTest("test");
    const firstScenario = scenarios[0];
    setCurrentScenario(firstScenario);
    playAudio(firstScenario.story + " " + firstScenario.question);
  };

  const endTest = () => {
    setTestSession((prev) => ({ ...prev, isTestActive: false }));
  };

  const resetTest = () => {
    setTestSession({
      correctAnswers: 0,
      wrongAnswers: 0,
      totalQuestions: 0,
      currentQuestion: 1,
      isTestActive: false,
      testType: "",
    });
    setCurrentTest("menu");
    setCurrentScenario(null);
    setFeedback(null);
  };

  // مكون الاختبار
  const TheoryOfMindTest = () => {
    if (!testSession.isTestActive || testSession.currentQuestion > 8) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              ملخص اختبار نظرية العقل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {testSession.correctAnswers}
                </div>
                <div className="text-sm text-gray-600">صحيحة</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">
                  {testSession.wrongAnswers}
                </div>
                <div className="text-sm text-gray-600">خاطئة</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {testSession.totalQuestions}
                </div>
                <div className="text-sm text-gray-600">إجمالي</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {testSession.totalQuestions > 0
                    ? Math.round(
                        (testSession.correctAnswers /
                          testSession.totalQuestions) *
                          100,
                      )
                    : 0}
                  %
                </div>
                <div className="text-sm text-gray-600">نسبة النجاح</div>
              </div>
            </div>

            {/* تقييم النتا��ج */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">
                تقييم الأداء:
              </h4>
              <div className="text-blue-700">
                {testSession.totalQuestions > 0 && (
                  <div>
                    {Math.round(
                      (testSession.correctAnswers /
                        testSession.totalQuestions) *
                        100,
                    ) >= 75 && (
                      <p>✅ أداء ممتاز! الطفل يظهر فهماً جيداً لنظرية العقل</p>
                    )}
                    {Math.round(
                      (testSession.correctAnswers /
                        testSession.totalQuestions) *
                        100,
                    ) >= 50 &&
                      Math.round(
                        (testSession.correctAnswers /
                          testSession.totalQuestions) *
                          100,
                      ) < 75 && <p>⚠️ أداء متوسط، يحتاج المزيد من التطوير</p>}
                    {Math.round(
                      (testSession.correctAnswers /
                        testSession.totalQuestions) *
                        100,
                    ) < 50 && <p>🔄 يحتاج إلى المزيد من التدريب والدعم</p>}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={startTest}
                className="bg-pink-600 hover:bg-pink-700"
              >
                <RotateCcw className="w-4 h-4 ml-2" />
                إعادة الاختبار
              </Button>
              <Button onClick={resetTest} variant="outline">
                العودة للقائمة
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">اختبار نظرية العقل</CardTitle>
          <CardDescription className="text-center">
            السيناريو {testSession.currentQuestion} من 8
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedback && (
            <div
              className={`absolute inset-0 flex items-center justify-center z-10 ${
                feedback.type === "success"
                  ? "bg-green-500/90"
                  : "bg-red-500/90"
              } text-white rounded-lg`}
            >
              <div className="text-center p-6">
                {feedback.type === "success" ? (
                  <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                ) : (
                  <XCircle className="w-16 h-16 mx-auto mb-4" />
                )}
                <div className="text-xl font-bold mb-2">{feedback.message}</div>
                <div className="text-sm bg-white/20 p-3 rounded-lg">
                  💡 {feedback.explanation}
                </div>
              </div>
            </div>
          )}

          {currentScenario && (
            <div className="space-y-6">
              {/* العنوان والمجموعة العمرية */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">
                  {currentScenario.title}
                </h3>
                <Badge
                  variant="outline"
                  className="border-purple-300 text-purple-700"
                >
                  {currentScenario.ageGroup}
                </Badge>
              </div>

              {/* السيناريو بالرموز التعبيرية */}
              <div className="text-center">
                <div className="text-6xl mb-4">{currentScenario.scenario}</div>
              </div>

              {/* القصة */}
              <div className="bg-purple-50 p-4 rounded-lg border-r-4 border-purple-400">
                <h4 className="font-semibold text-purple-800 mb-2">القصة:</h4>
                <p className="text-purple-700 leading-relaxed">
                  {currentScenario.story}
                </p>
              </div>

              {/* السؤال */}
              <div className="bg-blue-50 p-4 rounded-lg border-r-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-2">السؤال:</h4>
                <p className="text-blue-700 text-lg font-medium">
                  {currentScenario.question}
                </p>
              </div>

              {/* الخيارات */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentScenario.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 text-lg p-4 border-2 hover:border-pink-400 hover:bg-pink-50"
                    onClick={() => {
                      handleAnswer(
                        option,
                        currentScenario.correctAnswer,
                        currentScenario.explanation,
                      );
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {/* شريط التقدم */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>التقدم</span>
                  <span>{testSession.currentQuestion - 1}/8</span>
                </div>
                <Progress
                  value={((testSession.currentQuestion - 1) / 8) * 100}
                  className="h-3"
                />
              </div>

              {/* زر إعادة قراءة */}
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    playAudio(
                      currentScenario.story + " " + currentScenario.question,
                    )
                  }
                >
                  <Volume2 className="w-4 h-4 ml-2" />
                  إعادة القراءة
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // القائمة الرئيسية
  const MainMenu = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <CardContent className="p-8 text-center">
          <Brain className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">اختبار نظرية العقل</h1>
          <p className="text-pink-100">
            تقييم قدرة الطفل على فهم الحالات الذهنية للآخرين
          </p>
        </CardContent>
      </Card>

      {/* معلومات عن الاختبار */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              ما هي نظرية العقل؟
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              نظرية العقل هي القدرة على فهم أن الآخرين لديهم أفكار ومشاعر
              ومعتقدات قد تختلف عن أفكارنا ومشاعرنا الخاصة. هذه القدرة ضرورية
              للتواصل الاجتماعي الناجح.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              أهمية الاختبار
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-gray-700 space-y-2">
              <li>• تقييم النمو الاجتماعي والعاطفي</li>
              <li>• فهم قدرات التواصل</li>
              <li>• تحديد احتياجات التدخل العلاجي</li>
              <li>• متابعة التطور المعرفي</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* تفاصيل الاختبار */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            تفاصيل الاختبار
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">8 سيناريوهات</h4>
              <p className="text-sm text-gray-600">
                مواقف متنوعة لتقييم جوانب مختلفة
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">للأعمار 3-8</h4>
              <p className="text-sm text-gray-600">
                مناسب للمراحل العمرية المختلفة
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Volume2 className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">دعم صوتي</h4>
              <p className="text-sm text-gray-600">قراءة صوتية لجميع النصوص</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* زر بدء الاختبار */}
      <div className="text-center">
        <Button
          onClick={startTest}
          size="lg"
          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
        >
          <Play className="w-6 h-6 ml-3" />
          ابدأ اختبار نظرية العقل
        </Button>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentTest) {
      case "test":
        return <TheoryOfMindTest />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50"
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
                onClick={() => {
                  if (currentTest === "menu") {
                    navigate("/specialist-dashboard");
                  } else {
                    resetTest();
                  }
                }}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {currentTest === "menu"
                  ? "العودة للوحة التحكم"
                  : "القائمة الرئيسية"}
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-2 rounded-lg">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    اختبار نظرية العقل
                  </h1>
                  <p className="text-gray-600">Ortho Smart</p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/specialist-dashboard")}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              الرئيسية
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">{renderCurrentView()}</div>
    </div>
  );
}
