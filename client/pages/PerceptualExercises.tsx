import {
  ArrowLeft,
  Volume2,
  RotateCcw,
  CheckCircle,
  XCircle,
  Home,
  Play,
  Eye,
  Star,
  Brain,
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
import { useState, useEffect } from "react";

export default function PerceptualExercises() {
  const navigate = useNavigate();
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [currentGame, setCurrentGame] = useState<string | null>(null);

  const speakArabic = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const levels = [
    {
      id: "easy",
      title: "المرحلة الأولى: السهلة",
      subtitle: "إيجاد الشيء المختلف",
      color: "bg-green-500",
      description: "إختيار الشكل المختلف من بين 4 أشكال",
      difficulty: 1,
    },
    {
      id: "medium",
      title: "المرحلة الثانية: المتوسطة",
      subtitle: "تطابق الأشكال",
      color: "bg-yellow-500",
      description: "عرض اشكال اساسية دائرة مربع مثلث و يطابقها مع نظائرها من الأشكال",
      difficulty: 2,
    },
    {
      id: "hard",
      title: "المرحلة الثالثة: الصعبة",
      subtitle: "اختر الظل المناسب",
      color: "bg-red-500",
      description: "يعرض على الطفل شكل مع ظله ومجموعة من الظلال",
      difficulty: 3,
    },
  ];

  // Easy Level - Find Different Shape
  const EasyLevel = ({ onComplete }: { onComplete: () => void }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [maxAttempts] = useState(3);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    const questions = [
      {
        shapes: [
          { type: "square", color: "blue" },
          { type: "square", color: "blue" },
          { type: "square", color: "blue" },
          { type: "circle", color: "blue" },
        ],
        correct: 3,
      },
      {
        shapes: [
          { type: "apple", color: "red" },
          { type: "apple", color: "red" },
          { type: "apple", color: "green" },
          { type: "apple", color: "red" },
        ],
        correct: 2,
      },
      {
        shapes: [
          { type: "triangle", color: "red" },
          { type: "square", color: "red" },
          { type: "square", color: "red" },
          { type: "square", color: "red" },
        ],
        correct: 0,
      },
    ];

    const handleAnswer = (selectedIndex: number) => {
      const isCorrect = selectedIndex === questions[currentQuestion].correct;

      if (isCorrect) {
        setScore(score + 1);
        setFeedback("correct");
        speakArabic("ممتاز! إجابة صحيحة");

        setTimeout(() => {
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setAttempts(0);
            setFeedback(null);
          } else {
            setShowResult(true);
          }
        }, 1500);
      } else {
        setAttempts(attempts + 1);
        setFeedback("wrong");
        speakArabic("أوووو حاول مرة أخرى");

        if (attempts + 1 >= maxAttempts) {
          setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
              setCurrentQuestion(currentQuestion + 1);
              setAttempts(0);
              setFeedback(null);
            } else {
              setShowResult(true);
            }
          }, 1500);
        }
      }
    };

    const renderShape = (shape: any, index: number) => {
      const baseClasses =
        "w-20 h-20 cursor-pointer hover:scale-110 transition-transform rounded-lg flex items-center justify-center text-2xl";

      if (shape.type === "square") {
        return (
          <div
            key={index}
            className={`${baseClasses} ${shape.color === "blue" ? "bg-blue-500" : "bg-yellow-500"}`}
            onClick={() => handleAnswer(index)}
          />
        );
      } else if (shape.type === "circle") {
        return (
          <div
            key={index}
            className={`${baseClasses} ${shape.color === "blue" ? "bg-blue-500" : "bg-yellow-500"} rounded-full`}
            onClick={() => handleAnswer(index)}
          />
        );
      } else if (shape.type === "apple") {
        return (
          <div
            key={index}
            className={`${baseClasses} ${shape.color === "red" ? "text-red-500" : "text-green-500"}`}
            onClick={() => handleAnswer(index)}
          >
            🍎
          </div>
        );
      } else if (shape.type === "triangle") {
        return (
          <div
            key={index}
            className={`${baseClasses} bg-red-500`}
            style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
            onClick={() => handleAnswer(index)}
          />
        );
      }
    };

    if (showResult) {
      return (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold">انتهيت من المرحلة الأولى!</h3>
          <p className="text-lg">
            النتيجة: {score} من {questions.length}
          </p>
          <Button
            onClick={onComplete}
            className="bg-blue-600 hover:bg-blue-700"
          >
            التالي
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">إختر الشكل المختلف</h3>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex">
              {[...Array(3)].map((_, i) => (
                <span key={i} className="text-red-500 text-2xl">
                  ❤️
                </span>
              ))}
            </div>
            <div className="text-2xl font-bold">
              {currentQuestion + 1}/{questions.length}
            </div>
          </div>
          <Button onClick={() => speakArabic("إختر الشكل المختلف")}>
            <Volume2 className="w-4 h-4 ml-2" />
            استمع للتعليمة
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
          {questions[currentQuestion].shapes.map((shape, index) =>
            renderShape(shape, index),
          )}
        </div>

        {feedback && (
          <div className="text-center">
            {feedback === "correct" ? (
              <div className="text-green-600 text-xl font-bold">
                ✓ إجابة صحيحة!
              </div>
            ) : (
              <div className="text-red-600 text-xl font-bold">
                ✗ حاول مرة أخرى ({attempts}/{maxAttempts})
              </div>
            )}
          </div>
        )}

        <Progress
          value={(currentQuestion / questions.length) * 100}
          className="w-full"
        />
      </div>
    );
  };

  // Medium Level - Shape Matching
  const MediumLevel = ({ onComplete }: { onComplete: () => void }) => {
    const [currentPair, setCurrentPair] = useState(0);
    const [score, setScore] = useState(0);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [matched, setMatched] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
      speakArabic("اسحب الشكل إلى صورته المتطابقة أو ربط بينهما و تصفيق اذا كانت إجابة صحيحة");
    }, []);

    const shapePairs = [
      {
        left: [
          { id: "circle", shape: "circle", color: "#ef4444" },
          { id: "square", shape: "square", color: "#3b82f6" },
          { id: "triangle", shape: "triangle", color: "#10b981" },
        ],
        right: [
          { id: "circle-match", shape: "circle", color: "#ef4444" },
          { id: "square-match", shape: "square", color: "#3b82f6" },
          { id: "triangle-match", shape: "triangle", color: "#10b981" },
        ],
      },
    ];

    const handleDrop = (targetId: string) => {
      if (draggedItem) {
        const sourceItem = shapePairs[0].left.find(
          (item) => item.id === draggedItem,
        );
        const targetItem = shapePairs[0].right.find(
          (item) => item.id === targetId,
        );

        if (
          sourceItem &&
          targetItem &&
          sourceItem.shape === targetItem.shape &&
          sourceItem.color === targetItem.color
        ) {
          setMatched([...matched, draggedItem, targetId]);
          setScore(score + 1);
          speakArabic("ممتاز! مطابقة صحيحة");
          try {
            const ctx = new (window as any).AudioContext();
            const duration = 0.5;
            const sampleRate = ctx.sampleRate;
            const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < data.length; i++) {
              const t = i / sampleRate;
              const envelope = Math.exp(-4 * t);
              data[i] = (Math.random() * 2 - 1) * envelope;
            }
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            const gain = ctx.createGain();
            gain.gain.value = 0.25;
            source.connect(gain).connect(ctx.destination);
            source.start();
          } catch {}

          if (matched.length + 2 >= shapePairs[0].left.length * 2) {
            setTimeout(() => setShowResult(true), 1000);
          }
        } else {
          speakArabic("حاول مرة أخرى");
        }
        setDraggedItem(null);
      }
    };

    if (showResult) {
      return (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold">انتهيت من المرحلة الثانية!</h3>
          <p className="text-lg">النتيجة: {score} مطابقات صحيحة</p>
          <Button
            onClick={onComplete}
            className="bg-blue-600 hover:bg-blue-700"
          >
            التالي
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">
            اسحب الشكل إلى صورته المتطابقة
          </h3>
          <Button onClick={() => speakArabic("اسحب الشكل إلى صورته المتطابقة أو ربط بينهما و تصفيق اذا كانت إجابة صحيحة")}>
            <Volume2 className="w-4 h-4 ml-2" />
            استمع للتعليمة
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Left side - draggable items */}
          <div className="space-y-4">
            <h4 className="text-center font-bold">طابق الشكل مع نظيره</h4>
            {shapePairs[0].left.map((item) => (
              <div
                key={item.id}
                className={`p-4 border-2 border-gray-300 rounded-lg text-center cursor-move hover:shadow-lg transition-shadow ${matched.includes(item.id) ? "opacity-50" : ""}`}
                draggable={!matched.includes(item.id)}
                onDragStart={() => setDraggedItem(item.id)}
              >
                <div className="flex items-center justify-center h-16">
                  {item.shape === "circle" ? (
                    <div style={{ width: 48, height: 48, backgroundColor: item.color, borderRadius: "9999px" }} />
                  ) : item.shape === "square" ? (
                    <div style={{ width: 48, height: 48, backgroundColor: item.color }} />
                  ) : (
                    <div style={{ width: 0, height: 0, borderLeft: `24px solid transparent`, borderRight: `24px solid transparent`, borderBottom: `48px solid ${item.color}` }} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right side - drop targets */}
          <div className="space-y-4">
            {shapePairs[0].right.map((item, index) => (
              <div
                key={item.id}
                className={`p-4 border-2 border-dashed border-gray-400 rounded-lg text-center min-h-[80px] flex flex-col items-center justify-center hover:bg-gray-50 transition-colors ${
                  matched.includes(item.id)
                    ? "bg-green-100 border-green-400"
                    : ""
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(item.id)}
              >
                {matched.includes(item.id) ? (
                  <div className="flex items-center justify-center h-16">
                    {item.shape === "circle" ? (
                      <div style={{ width: 48, height: 48, backgroundColor: item.color, borderRadius: "9999px" }} />
                    ) : item.shape === "square" ? (
                      <div style={{ width: 48, height: 48, backgroundColor: item.color }} />
                    ) : (
                      <div style={{ width: 0, height: 0, borderLeft: `24px solid transparent`, borderRight: `24px solid transparent`, borderBottom: `48px solid ${item.color}` }} />
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-16 opacity-40">
                    {item.shape === "circle" ? (
                      <div style={{ width: 48, height: 48, backgroundColor: item.color, borderRadius: "9999px" }} />
                    ) : item.shape === "square" ? (
                      <div style={{ width: 48, height: 48, backgroundColor: item.color }} />
                    ) : (
                      <div style={{ width: 0, height: 0, borderLeft: `24px solid transparent`, borderRight: `24px solid transparent`, borderBottom: `48px solid ${item.color}` }} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Hard Level - Shadow Matching
  const HardLevel = ({ onComplete }: { onComplete: () => void }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const shadowQuestions = [
      {
        object: "🐥",
        name: "كتكوت",
        shadows: ["🐾", "🐥", "🦆", "🐧"],
        correct: 1,
      },
      {
        object: "🚗",
        name: "سيارة",
        shadows: ["🚲", "🚗", "��", "✈️"],
        correct: 1,
      },
    ];

    const handleAnswer = (selectedIndex: number) => {
      const isCorrect =
        selectedIndex === shadowQuestions[currentQuestion].correct;

      if (isCorrect) {
        setScore(score + 1);
        speakArabic("ممتاز! إجابة صحيحة");

        setTimeout(() => {
          if (currentQuestion < shadowQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
          } else {
            setShowResult(true);
          }
        }, 1500);
      } else {
        speakArabic("حاول مرة أخرى");
      }
    };

    if (showResult) {
      return (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold">انتهيت من جميع المراحل!</h3>
          <p className="text-lg">
            النتيجة النهائية: {score} من {shadowQuestions.length}
          </p>
          <Button
            onClick={onComplete}
            className="bg-green-600 hover:bg-green-700"
          >
            إنهاء التمارين
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">اختر الشكل المناسب</h3>
          <div className="text-6xl mb-4">
            {shadowQuestions[currentQuestion].object}
          </div>
          <p className="text-lg mb-4">
            اخ��ر ظل {shadowQuestions[currentQuestion].name}
          </p>
          <Button onClick={() => speakArabic("إختر الظل المناسب")}>
            <Volume2 className="w-4 h-4 ml-2" />
            استمع للتعليمة
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {shadowQuestions[currentQuestion].shadows.map((shadow, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleAnswer(index)}
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl filter brightness-0">{shadow}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Progress
          value={(currentQuestion / shadowQuestions.length) * 100}
          className="w-full"
        />
      </div>
    );
  };

  const renderLevel = () => {
    switch (activeLevel) {
      case "easy":
        return <EasyLevel onComplete={() => setActiveLevel("medium")} />;
      case "medium":
        return <MediumLevel onComplete={() => setActiveLevel("hard")} />;
      case "hard":
        return <HardLevel onComplete={() => setActiveLevel(null)} />;
      default:
        return null;
    }
  };

  if (activeLevel) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
        dir="rtl"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveLevel(null)}
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة
              </Button>
              <h1 className="text-2xl font-bold">
                {levels.find((l) => l.id === activeLevel)?.title}
              </h1>
            </div>

            {renderLevel()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
      dir="rtl"
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  تمارين الإدراك البصري
                </h1>
                <p className="text-gray-600 text-sm">
                  تدرج من السهل إلى الصعب - جعل التعلم ممتعاً
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                <Home className="w-4 h-4 ml-2" />
                الرئيسية
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="text-8xl mb-6">🧠</div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            تمارين الإدراك البصري
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            جعل التعلم ممتعاً من خلال التدرج من السهل إلى الصعب
          </p>
        </div>

        {/* Levels Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {levels.map((level, index) => (
            <Card
              key={level.id}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-gray-300 group"
              onClick={() => setActiveLevel(level.id)}
            >
              <CardHeader className="text-center">
                <div
                  className={`${level.color} text-white p-6 rounded-xl w-20 h-20 mx-auto mb-4 flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform`}
                >
                  {index + 1}
                </div>
                <CardTitle className="text-xl">{level.title}</CardTitle>
                <CardDescription className="text-base font-semibold text-purple-600">
                  {level.subtitle}
                </CardDescription>
                <CardDescription className="text-sm">
                  {level.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>مستوى الصعوبة</span>
                    <div className="flex">
                      {[...Array(3)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < level.difficulty ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    <Play className="w-4 h-4 ml-2" />
                    ابدأ المرحلة
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Eye className="w-5 h-5" />
              كيفية أداء التمارين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-blue-700">
              <div>
                <h4 className="font-semibold mb-2">المرحلة الأولى - السهلة:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• اختيار الشكل المختلف</li>
                  <li>• 4 أشكال، 3 متشابهة وواحد مختلف</li>
                  <li>• صوت تشجيعي عند الإجابة</li>
                  <li>• 3 محاولات لكل سؤال</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  المرحلة الثانية - المتوسطة:
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>• تطابق الأشكال</li>
                  <li>• اسحب الشكل لصورته المتطابقة</li>
                  <li>• أشكال أساسية: دائرة، مربع، مثلث</li>
                  <li>• تفاعل بالسحب والإفلات</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  المرحلة الثالثة - الصعبة:
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>• اختيار الظل المناسب</li>
                  <li>• ربط الشكل بظله الصحيح</li>
                  <li>• تطوير الإدراك البصري</li>
                  <li>• مهارات التمييز المتقدمة</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
