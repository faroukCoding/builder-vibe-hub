import { 
  ArrowLeft, 
  Brain, 
  Eye, 
  Palette, 
  Shapes, 
  Car,
  Heart,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  Volume2,
  Home,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

export default function CognitiveTests() {
  const navigate = useNavigate();
  const [currentTest, setCurrentTest] = useState("menu");
  const [testSession, setTestSession] = useState({
    correctAnswers: 0,
    wrongAnswers: 0,
    totalQuestions: 0,
    currentQuestion: 1,
    isTestActive: false,
    testType: ""
  });
  const [feedback, setFeedback] = useState(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // بيانات الصور المرفقة
  const imageCategories = {
    animals: [
      {
        id: 1,
        name: "أسد",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F98a7789d43744a46988dda779122f2dc?format=webp&width=800",
        category: "حيوانات"
      },
      {
        id: 2,
        name: "نمر",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F5d5d832e02ec4a92a62b029ff20388a6?format=webp&width=800",
        category: "حيوانات"
      },
      {
        id: 3,
        name: "دب",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F25d2db6beec64c938f1b3f106525863e?format=webp&width=800",
        category: "حيوانات"
      },
      {
        id: 4,
        name: "ثعلب",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Ff9da0592a9534bcbb8b8ec0fa3700363?format=webp&width=800",
        category: "حيوانات"
      },
      {
        id: 5,
        name: "زرافة",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F6932171555a342309126302e012c11d3?format=webp&width=800",
        category: "حيوانات"
      },
      {
        id: 6,
        name: "ذئب",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F18ff4c13294840f49ef57311d63b3d67?format=webp&width=800",
        category: "حيوانات"
      },
      {
        id: 7,
        name: "ديك",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F85d6f143bfd542af91bc9e23c31bce0d?format=webp&width=800",
        category: "حيوانات"
      },
      {
        id: 8,
        name: "جمل",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F81ed82645a254678b25be28d54b0b66b?format=webp&width=800",
        category: "حيوانات"
      },
      {
        id: 9,
        name: "بطة",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fb8383ff406544f75a5888bd2613d9e49?format=webp&width=800",
        category: "حيوانات"
      },
      {
        id: 10,
        name: "دجاجة",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fdb7fb90da95846b98bf4c482240cd189?format=webp&width=800",
        category: "حيوانات"
      },
      {
        id: 11,
        name: "حصان",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F5523aa9398b14586bca9bffd1ff4b325?format=webp&width=800",
        category: "حيوانات"
      },
      {
        id: 12,
        name: "حمار",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fb107c72f7a1645299f3e5c23a9b04b8f?format=webp&width=800",
        category: "حيوانات"
      },
      {
        id: 13,
        name: "أرنب",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F70b43ed85183406481a3d760811c6416?format=webp&width=800",
        category: "حيوانات"
      },
      {
        id: 14,
        name: "بقرة",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F81b10719ec974592adcf3ef1fd740e75?format=webp&width=800",
        category: "حيوانات"
      },
      {
        id: 15,
        name: "خروف",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F2027cb53fd2846e1b16b0fafc4d85cc9?format=webp&width=800",
        category: "حيوانات"
      },
      {
        id: 16,
        name: "كلب",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F1def7d453ce04c81a7e7e97df6e2fd50?format=webp&width=800",
        category: "حيوانات"
      },
      {
        id: 17,
        name: "قطة",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F5d5d832e02ec4a92a62b029ff20388a6?format=webp&width=800",
        category: "حيوانات"
      }
    ],
    vehicles: [
      {
        id: 1,
        name: "طائرة هليكوبتر",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fdbe4a29629e1473a96ed091dd66f1950?format=webp&width=800",
        category: "مركبات"
      },
      {
        id: 2,
        name: "سيارة إطفاء",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Ff2add4a77dbb4d8abae8b7621e504230?format=webp&width=800",
        category: "مركبات"
      },
      {
        id: 3,
        name: "جرار زراعي",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fa9187d2671754e51943af7947d02ae30?format=webp&width=800",
        category: "مركبات"
      },
      {
        id: 4,
        name: "سيارة إسعاف",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F5272a8084f114b36be05e3435795b5b1?format=webp&width=800",
        category: "مركبات"
      },
      {
        id: 5,
        name: "شاحنة",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F18ebe955ad0b49eeaf3b47acc5d31af1?format=webp&width=800",
        category: "مركبات"
      },
      {
        id: 6,
        name: "دراجة نارية",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F57f0bef6a1c144ea967dd6843b6bccd6?format=webp&width=800",
        category: "مركبات"
      },
      {
        id: 7,
        name: "دراجة هوائية",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F79b66164ae24496daae69e1995a04783?format=webp&width=800",
        category: "مركبات"
      },
      {
        id: 8,
        name: "ترام",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fca56b6f9185f43ff85df99fc195db0f7?format=webp&width=800",
        category: "مركبات"
      },
      {
        id: 9,
        name: "سفينة",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fd87d5df245b343c195098269b0394b9f?format=webp&width=800",
        category: "مركبات"
      },
      {
        id: 10,
        name: "حافلة",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fb8fe0a7b5baf4a8abbba37cbe393790d?format=webp&width=800",
        category: "مركبات"
      },
      {
        id: 11,
        name: "طائرة",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2Fcba25725a99c48688321df072fd908c1?format=webp&width=800",
        category: "مركبات"
      },
      {
        id: 12,
        name: "سيارة جيب",
        src: "https://cdn.builder.io/api/v1/image/assets%2F7d0caf934e794ae2afa6a9944c5b8775%2F3a190ff018184a3b98882ae31cba1f9b?format=webp&width=800",
        category: "مركبات"
      }
    ]
  };

  const colors = [
    { name: "أحمر", color: "#ef4444", rgb: "239,68,68" },
    { name: "أزرق", color: "#3b82f6", rgb: "59,130,246" },
    { name: "أخضر", color: "#22c55e", rgb: "34,197,94" },
    { name: "أصفر", color: "#eab308", rgb: "234,179,8" },
    { name: "برتقالي", color: "#f97316", rgb: "249,115,22" },
    { name: "بنفسجي", color: "#a855f7", rgb: "168,85,247" },
    { name: "وردي", color: "#ec4899", rgb: "236,72,153" },
    { name: "بني", color: "#a3a3a3", rgb: "163,163,163" }
  ];

  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      speechSynthesis.speak(utterance);
    }
  };

  const handleAnswer = (selectedAnswer: string, correctAnswer: string, questionText: string) => {
    if (!testSession.isTestActive) return;

    const isCorrect = selectedAnswer === correctAnswer;
    
    if (isCorrect) {
      setFeedback({ type: 'success', message: 'ممتاز! إجابة صحيحة!' });
      setTestSession(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        totalQuestions: prev.totalQuestions + 1,
        currentQuestion: prev.currentQuestion + 1
      }));
      playAudio('ممتاز! إجابة صحيحة!');
    } else {
      setFeedback({ type: 'error', message: `غير صحيح. الإجابة الصحيحة هي: ${correctAnswer}` });
      setTestSession(prev => ({
        ...prev,
        wrongAnswers: prev.wrongAnswers + 1,
        totalQuestions: prev.totalQuestions + 1,
        currentQuestion: prev.currentQuestion + 1
      }));
      playAudio(`غير صحيح. الإجابة الصحيحة هي ${correctAnswer}`);
    }

    setTimeout(() => {
      setFeedback(null);
      if (testSession.currentQuestion >= 10) {
        endTest();
      }
    }, 3000);
  };

  const startTest = (testType: string) => {
    setTestSession({
      correctAnswers: 0,
      wrongAnswers: 0,
      totalQuestions: 0,
      currentQuestion: 1,
      isTestActive: true,
      testType
    });
    setCurrentTest(testType);
  };

  const endTest = () => {
    setTestSession(prev => ({ ...prev, isTestActive: false }));
  };

  const resetTest = () => {
    setTestSession({
      correctAnswers: 0,
      wrongAnswers: 0,
      totalQuestions: 0,
      currentQuestion: 1,
      isTestActive: false,
      testType: ""
    });
    setCurrentTest("menu");
    setFeedback(null);
  };

  // اختبار التعرف على الحيوانات
  const AnimalRecognitionTest = () => {
    const [currentAnimal, setCurrentAnimal] = useState(null);
    const [options, setOptions] = useState([]);

    const generateQuestion = () => {
      const randomAnimal = imageCategories.animals[Math.floor(Math.random() * imageCategories.animals.length)];
      const wrongOptions = imageCategories.animals
        .filter(animal => animal.id !== randomAnimal.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const allOptions = [randomAnimal, ...wrongOptions].sort(() => 0.5 - Math.random());
      
      setCurrentAnimal(randomAnimal);
      setOptions(allOptions);
      playAudio(`ما اسم هذا الحيوان؟`);
    };

    if (testSession.isTestActive && !currentAnimal && testSession.currentQuestion <= 10) {
      generateQuestion();
    }

    if (!testSession.isTestActive || testSession.currentQuestion > 10) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              ملخص اختبار الحيوانات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
              <div>
                <div className="text-3xl font-bold text-green-600">{testSession.correctAnswers}</div>
                <div className="text-sm text-gray-600">صحيحة</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">{testSession.wrongAnswers}</div>
                <div className="text-sm text-gray-600">خاطئة</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{testSession.totalQuestions}</div>
                <div className="text-sm text-gray-600">إجمالي</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {testSession.totalQuestions > 0 ? Math.round((testSession.correctAnswers / testSession.totalQuestions) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">نسبة النجاح</div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => startTest('animals')} className="bg-green-600 hover:bg-green-700">
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
          <CardTitle className="text-center">اختبار التعرف على الحيوانات</CardTitle>
          <CardDescription className="text-center">
            السؤال {testSession.currentQuestion} من 10
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedback && (
            <div className={`absolute inset-0 flex items-center justify-center z-10 ${
              feedback.type === 'success' ? 'bg-green-500/90' : 'bg-red-500/90'
            } text-white rounded-lg`}>
              <div className="text-center">
                {feedback.type === 'success' ? (
                  <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                ) : (
                  <XCircle className="w-16 h-16 mx-auto mb-4" />
                )}
                <div className="text-xl font-bold">{feedback.message}</div>
              </div>
            </div>
          )}

          {currentAnimal && (
            <div className="space-y-6">
              <div className="text-center">
                <img 
                  src={currentAnimal.src} 
                  alt={currentAnimal.name}
                  className="w-48 h-48 object-contain mx-auto mb-4 rounded-lg shadow-lg"
                />
                <p className="text-lg font-semibold mb-4">ما اسم هذا الحيوان؟</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 text-lg"
                    onClick={() => {
                      handleAnswer(option.name, currentAnimal.name, "ما اسم هذا الحيوان؟");
                      setTimeout(() => {
                        if (testSession.currentQuestion <= 10) {
                          generateQuestion();
                        }
                      }, 3500);
                    }}
                  >
                    {option.name}
                  </Button>
                ))}
              </div>

              <div className="mt-6">
                <Progress value={(testSession.currentQuestion - 1) / 10 * 100} className="h-3" />
                <div className="text-center text-sm text-gray-600 mt-2">
                  التقدم: {testSession.currentQuestion - 1}/10
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // اختبار التعرف على المركبات
  const VehicleRecognitionTest = () => {
    const [currentVehicle, setCurrentVehicle] = useState(null);
    const [options, setOptions] = useState([]);

    const generateQuestion = () => {
      const randomVehicle = imageCategories.vehicles[Math.floor(Math.random() * imageCategories.vehicles.length)];
      const wrongOptions = imageCategories.vehicles
        .filter(vehicle => vehicle.id !== randomVehicle.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const allOptions = [randomVehicle, ...wrongOptions].sort(() => 0.5 - Math.random());
      
      setCurrentVehicle(randomVehicle);
      setOptions(allOptions);
      playAudio(`ما اسم هذه المركبة؟`);
    };

    if (testSession.isTestActive && !currentVehicle && testSession.currentQuestion <= 10) {
      generateQuestion();
    }

    if (!testSession.isTestActive || testSession.currentQuestion > 10) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              ملخص اختبار المركبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
              <div>
                <div className="text-3xl font-bold text-green-600">{testSession.correctAnswers}</div>
                <div className="text-sm text-gray-600">صحيحة</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">{testSession.wrongAnswers}</div>
                <div className="text-sm text-gray-600">خاطئة</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{testSession.totalQuestions}</div>
                <div className="text-sm text-gray-600">إجمالي</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {testSession.totalQuestions > 0 ? Math.round((testSession.correctAnswers / testSession.totalQuestions) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">نسبة النجاح</div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => startTest('vehicles')} className="bg-blue-600 hover:bg-blue-700">
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
          <CardTitle className="text-center">اختبار التعرف على المركبات</CardTitle>
          <CardDescription className="text-center">
            السؤال {testSession.currentQuestion} من 10
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedback && (
            <div className={`absolute inset-0 flex items-center justify-center z-10 ${
              feedback.type === 'success' ? 'bg-green-500/90' : 'bg-red-500/90'
            } text-white rounded-lg`}>
              <div className="text-center">
                {feedback.type === 'success' ? (
                  <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                ) : (
                  <XCircle className="w-16 h-16 mx-auto mb-4" />
                )}
                <div className="text-xl font-bold">{feedback.message}</div>
              </div>
            </div>
          )}

          {currentVehicle && (
            <div className="space-y-6">
              <div className="text-center">
                <img 
                  src={currentVehicle.src} 
                  alt={currentVehicle.name}
                  className="w-48 h-48 object-contain mx-auto mb-4 rounded-lg shadow-lg"
                />
                <p className="text-lg font-semibold mb-4">ما اسم هذه المركبة؟</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 text-lg"
                    onClick={() => {
                      handleAnswer(option.name, currentVehicle.name, "ما اسم هذه المركبة؟");
                      setTimeout(() => {
                        if (testSession.currentQuestion <= 10) {
                          generateQuestion();
                        }
                      }, 3500);
                    }}
                  >
                    {option.name}
                  </Button>
                ))}
              </div>

              <div className="mt-6">
                <Progress value={(testSession.currentQuestion - 1) / 10 * 100} className="h-3" />
                <div className="text-center text-sm text-gray-600 mt-2">
                  التقدم: {testSession.currentQuestion - 1}/10
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // اختبار الألوان
  const ColorRecognitionTest = () => {
    const [currentColor, setCurrentColor] = useState(null);
    const [options, setOptions] = useState([]);

    const generateQuestion = () => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const wrongOptions = colors
        .filter(color => color.name !== randomColor.name)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const allOptions = [randomColor, ...wrongOptions].sort(() => 0.5 - Math.random());
      
      setCurrentColor(randomColor);
      setOptions(allOptions);
      playAudio(`ما لون هذا المربع؟`);
    };

    if (testSession.isTestActive && !currentColor && testSession.currentQuestion <= 10) {
      generateQuestion();
    }

    if (!testSession.isTestActive || testSession.currentQuestion > 10) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              ملخص اختبار الألوان
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
              <div>
                <div className="text-3xl font-bold text-green-600">{testSession.correctAnswers}</div>
                <div className="text-sm text-gray-600">صحيحة</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">{testSession.wrongAnswers}</div>
                <div className="text-sm text-gray-600">خاطئة</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{testSession.totalQuestions}</div>
                <div className="text-sm text-gray-600">إجمالي</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {testSession.totalQuestions > 0 ? Math.round((testSession.correctAnswers / testSession.totalQuestions) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">نسبة النجاح</div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => startTest('colors')} className="bg-purple-600 hover:bg-purple-700">
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
          <CardTitle className="text-center">اختبار التعرف على الألوان</CardTitle>
          <CardDescription className="text-center">
            السؤال {testSession.currentQuestion} من 10
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedback && (
            <div className={`absolute inset-0 flex items-center justify-center z-10 ${
              feedback.type === 'success' ? 'bg-green-500/90' : 'bg-red-500/90'
            } text-white rounded-lg`}>
              <div className="text-center">
                {feedback.type === 'success' ? (
                  <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                ) : (
                  <XCircle className="w-16 h-16 mx-auto mb-4" />
                )}
                <div className="text-xl font-bold">{feedback.message}</div>
              </div>
            </div>
          )}

          {currentColor && (
            <div className="space-y-6">
              <div className="text-center">
                <div 
                  className="w-48 h-48 mx-auto mb-4 rounded-lg shadow-lg border-4 border-gray-300"
                  style={{ backgroundColor: currentColor.color }}
                />
                <p className="text-lg font-semibold mb-4">ما لون هذا المربع؟</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 text-lg"
                    onClick={() => {
                      handleAnswer(option.name, currentColor.name, "ما لون هذا المربع؟");
                      setTimeout(() => {
                        if (testSession.currentQuestion <= 10) {
                          generateQuestion();
                        }
                      }, 3500);
                    }}
                  >
                    {option.name}
                  </Button>
                ))}
              </div>

              <div className="mt-6">
                <Progress value={(testSession.currentQuestion - 1) / 10 * 100} className="h-3" />
                <div className="text-center text-sm text-gray-600 mt-2">
                  التقدم: {testSession.currentQuestion - 1}/10
                </div>
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
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="p-8 text-center">
          <Brain className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">اختبارات الإدراك والمكتسبات القبلية</h1>
          <p className="text-purple-100">تقييم قدرات الطفل المعرفية والإدراكية</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startTest('animals')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">التعرف على الحيوانات</h3>
                <p className="text-gray-600">تقييم معرفة أسماء الحيوانات</p>
              </div>
            </div>
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ الاختبار
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startTest('vehicles')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">التعرف على المركبات</h3>
                <p className="text-gray-600">تقييم معرفة أسماء المركبات</p>
              </div>
            </div>
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ الاختبار
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startTest('colors')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Palette className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">التعرف على الألوان</h3>
                <p className="text-gray-600">تقييم معرفة الألوان الأساسية</p>
              </div>
            </div>
            <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ الاختبار
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-75">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Shapes className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">الأشكال الهندسية</h3>
                <p className="text-gray-600">قريباً - تقييم معرفة الأشكال</p>
              </div>
            </div>
            <Button className="w-full" variant="outline" disabled>
              قريباً
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-75">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <Star className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">الأرقام 1-10</h3>
                <p className="text-gray-600">قريباً - تقييم معرفة الأرقام</p>
              </div>
            </div>
            <Button className="w-full" variant="outline" disabled>
              قريباً
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-75">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-teal-100 p-3 rounded-lg">
                <Eye className="w-8 h-8 text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">أعضاء الجسم</h3>
                <p className="text-gray-600">قريباً - تقييم معرفة الجسم</p>
              </div>
            </div>
            <Button className="w-full" variant="outline" disabled>
              قريباً
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCurrentTest = () => {
    switch (currentTest) {
      case "animals":
        return <AnimalRecognitionTest />;
      case "vehicles":
        return <VehicleRecognitionTest />;
      case "colors":
        return <ColorRecognitionTest />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50" dir="rtl">
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
                    navigate('/specialist-dashboard');
                  } else {
                    resetTest();
                  }
                }}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {currentTest === "menu" ? "العودة للوحة التحكم" : "القائمة الرئيسية"}
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-lg">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    اختبارات الإدراك
                  </h1>
                  <p className="text-gray-600">Ortho Smart</p>
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {renderCurrentTest()}
      </div>
    </div>
  );
}
