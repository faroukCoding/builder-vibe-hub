import {
  ArrowLeft,
  Star,
  Circle,
  Square,
  Triangle,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Target,
  Eye,
  Volume2,
  CheckCircle,
  XCircle,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function AttentionExercises() {
  const navigate = useNavigate();
  const [currentGame, setCurrentGame] = useState("menu"); // menu, visual-attention, auditory-attention, sustained-attention, selective-attention
  const [gameSession, setGameSession] = useState({
    correctAnswers: 0,
    wrongAnswers: 0,
    totalQuestions: 0,
    currentQuestion: 1,
    isGameActive: false,
    timeElapsed: 0,
    level: 1
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [gameData, setGameData] = useState({
    shapes: [],
    colors: [],
    targetPosition: 0,
    currentScene: null,
    missingItem: null,
    sequence: [],
    userSequence: []
  });

  // تمرين الانتباه البصري
  const VisualAttentionGame = () => {
    const [currentTask, setCurrentTask] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [taskType, setTaskType] = useState("shapes"); // shapes, colors, patterns, numbers

    const shapes = [
      { name: "مربع", icon: "⬜", color: "#3B82F6" },
      { name: "دائرة", icon: "🔵", color: "#EF4444" },
      { name: "مثلث", icon: "🔺", color: "#10B981" },
      { name: "نجمة", icon: "⭐", color: "#F59E0B" },
      { name: "قلب", icon: "❤️", color: "#EC4899" },
      { name: "معين", icon: "🔷", color: "#8B5CF6" }
    ];

    const colors = [
      { name: "أحمر", value: "#EF4444", emoji: "🔴" },
      { name: "أزرق", value: "#3B82F6", emoji: "🔵" },
      { name: "أخضر", value: "#10B981", emoji: "🟢" },
      { name: "أصفر", value: "#F59E0B", emoji: "🟡" },
      { name: "بنفسجي", value: "#8B5CF6", emoji: "🟣" },
      { name: "برتقالي", value: "#F97316", emoji: "🟠" }
    ];

    const generateTask = () => {
      const level = Math.min(Math.floor(gameSession.currentQuestion / 3) + 1, 4);
      const gridSize = Math.min(3 + level, 6);

      if (taskType === "shapes") {
        const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
        const distractors = shapes.filter(s => s.name !== targetShape.name);
        const items = [];

        // Add target shapes (1-3 based on level)
        const targetCount = Math.min(level, 3);
        for (let i = 0; i < targetCount; i++) {
          items.push({ ...targetShape, isTarget: true, id: `target-${i}` });
        }

        // Fill remaining spots with distractors
        while (items.length < gridSize * gridSize) {
          const distractor = distractors[Math.floor(Math.random() * distractors.length)];
          items.push({ ...distractor, isTarget: false, id: `dist-${items.length}` });
        }

        // Shuffle array
        for (let i = items.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [items[i], items[j]] = [items[j], items[i]];
        }

        setCurrentTask({
          type: "shapes",
          target: targetShape,
          items: items,
          gridSize: gridSize,
          instruction: `ابحث عن جميع ${targetShape.name}`
        });

      } else if (taskType === "colors") {
        const targetColor = colors[Math.floor(Math.random() * colors.length)];
        const distractors = colors.filter(c => c.name !== targetColor.name);
        const items = [];

        const targetCount = Math.min(level, 3);
        for (let i = 0; i < targetCount; i++) {
          items.push({ ...targetColor, isTarget: true, id: `target-${i}` });
        }

        while (items.length < gridSize * gridSize) {
          const distractor = distractors[Math.floor(Math.random() * distractors.length)];
          items.push({ ...distractor, isTarget: false, id: `dist-${items.length}` });
        }

        for (let i = items.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [items[i], items[j]] = [items[j], items[i]];
        }

        setCurrentTask({
          type: "colors",
          target: targetColor,
          items: items,
          gridSize: gridSize,
          instruction: `ابحث عن جميع الألوان ${targetColor.name}`
        });
      }

      playInstruction();
    };

    const playInstruction = () => {
      if ('speechSynthesis' in window && currentTask) {
        const utterance = new SpeechSynthesisUtterance(currentTask.instruction);
        utterance.lang = 'ar-SA';
        speechSynthesis.speak(utterance);
      }
    };

    const handleItemClick = (item) => {
      if (!gameSession.isGameActive) return;

      const newItems = currentTask.items.map(i =>
        i.id === item.id ? { ...i, clicked: true } : i
      );

      setCurrentTask(prev => ({ ...prev, items: newItems }));

      if (item.isTarget) {
        // Check if all targets are found
        const allTargetsFound = newItems.filter(i => i.isTarget).every(i => i.clicked);

        if (allTargetsFound) {
          setFeedback({ type: 'success', message: 'ممتاز! وجدت كل الأهداف!' });
          setGameSession(prev => ({
            ...prev,
            correctAnswers: prev.correctAnswers + 1,
            currentQuestion: prev.currentQuestion + 1,
            totalQuestions: prev.totalQuestions + 1
          }));

          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance('ممتاز! أحسنت!');
            utterance.lang = 'ar-SA';
            speechSynthesis.speak(utterance);
          }

          setTimeout(() => {
            setFeedback(null);
            if (gameSession.currentQuestion < 10) {
              generateTask();
            } else {
              endGame();
            }
          }, 2500);
        } else {
          // Positive feedback for finding one target
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance('أحسنت! ابحث عن المزيد');
            utterance.lang = 'ar-SA';
            speechSynthesis.speak(utterance);
          }
        }

      } else {
        setFeedback({ type: 'error', message: 'ليس هذا الهدف، حاول مرة أخرى' });
        setGameSession(prev => ({
          ...prev,
          wrongAnswers: prev.wrongAnswers + 1
        }));

        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance('ليس هذا الهدف');
          utterance.lang = 'ar-SA';
          speechSynthesis.speak(utterance);
        }

        setTimeout(() => setFeedback(null), 1500);
      }
    };

    const startGame = () => {
      setGameSession({
        correctAnswers: 0,
        wrongAnswers: 0,
        totalQuestions: 0,
        currentQuestion: 1,
        isGameActive: true,
        timeElapsed: 0,
        level: 1
      });
      generateTask();
    };

    const endGame = () => {
      setGameSession(prev => ({ ...prev, isGameActive: false }));
    };

    useEffect(() => {
      if (gameSession.isGameActive && gameSession.currentQuestion === 1) {
        generateTask();
      }
    }, [gameSession.isGameActive, taskType]);

    return (
      <div className="space-y-6">
        {/* Game Header */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">👁️ الانتباه البصري</h2>
                <p className="text-blue-100">ابحث عن الأشكال أو الألوان المطلوبة</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-100 mb-1">المستوى</div>
                <div className="text-2xl font-bold">{Math.min(Math.floor(gameSession.currentQuestion / 3) + 1, 4)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Type Selection */}
        {!gameSession.isGameActive && (
          <Card>
            <CardHeader>
              <CardTitle>اختر نوع التمرين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={taskType === "shapes" ? "default" : "outline"}
                  onClick={() => setTaskType("shapes")}
                  className="p-6 h-auto flex flex-col gap-2"
                >
                  <div className="text-2xl">🔷</div>
                  <div>الأشكال</div>
                </Button>
                <Button
                  variant={taskType === "colors" ? "default" : "outline"}
                  onClick={() => setTaskType("colors")}
                  className="p-6 h-auto flex flex-col gap-2"
                >
                  <div className="text-2xl">🎨</div>
                  <div>الألوان</div>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{gameSession.correctAnswers}</div>
              <div className="text-sm text-green-700">مهام مكتملة</div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 text-center">
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{gameSession.wrongAnswers}</div>
              <div className="text-sm text-red-700">أخطاء</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{gameSession.currentQuestion}/10</div>
              <div className="text-sm text-blue-700">التقدم</div>
            </CardContent>
          </Card>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center gap-4">
          {!gameSession.isGameActive ? (
            <Button
              onClick={startGame}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play className="w-5 h-5 ml-2" />
              ابدأ التمرين
            </Button>
          ) : (
            <>
              <Button
                onClick={endGame}
                size="lg"
                variant="outline"
              >
                <Pause className="w-5 h-5 ml-2" />
                إيقاف
              </Button>
              <Button
                onClick={generateTask}
                size="lg"
                variant="outline"
              >
                <RotateCcw className="w-5 h-5 ml-2" />
                مهمة جديدة
              </Button>
            </>
          )}
        </div>

        {/* Game Area */}
        {gameSession.isGameActive && currentTask && (
          <Card className="min-h-96">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{currentTask.instruction}</CardTitle>
              {currentTask.target && (
                <div className="flex items-center justify-center gap-2 text-lg">
                  <span>الهدف:</span>
                  {currentTask.type === "shapes" ? (
                    <span className="text-2xl">{currentTask.target.icon}</span>
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: currentTask.target.value }}
                    ></div>
                  )}
                  <span className="font-bold">{currentTask.target.name}</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative">
                {/* Feedback */}
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
                      <div className="text-2xl font-bold">{feedback.message}</div>
                    </div>
                  </div>
                )}

                {/* Items Grid */}
                <div
                  className={`grid gap-4 max-w-4xl mx-auto`}
                  style={{
                    gridTemplateColumns: `repeat(${currentTask.gridSize}, minmax(0, 1fr))`
                  }}
                >
                  {currentTask.items.map((item, index) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`
                        aspect-square flex items-center justify-center rounded-lg cursor-pointer
                        transition-all duration-200 border-4 hover:scale-105 text-4xl
                        ${item.clicked
                          ? (item.isTarget ? 'border-green-500 bg-green-100' : 'border-red-500 bg-red-100')
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                        }
                      `}
                    >
                      {currentTask.type === "shapes" ? (
                        <span>{item.icon}</span>
                      ) : (
                        <div
                          className="w-16 h-16 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: item.value }}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-8 max-w-md mx-auto">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>التقدم</span>
                    <span>{gameSession.currentQuestion}/10</span>
                  </div>
                  <Progress value={(gameSession.currentQuestion / 10) * 100} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Game Summary */}
        {!gameSession.isGameActive && gameSession.totalQuestions > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
                ملخص الجلسة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{gameSession.correctAnswers}</div>
                  <div className="text-sm text-gray-600">مهام مكتملة</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{gameSession.wrongAnswers}</div>
                  <div className="text-sm text-gray-600">أخطاء</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {gameSession.totalQuestions > 0 ? Math.round((gameSession.correctAnswers / gameSession.totalQuestions) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-600">معدل النجاح</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const FindMissingGame = () => {
    const scenes = [
      {
        id: 1,
        name: "غرفة المعيشة",
        description: "ابحث عن الكرسي المفقود",
        items: ["أريكة", "طاولة", "تلفزيون", "كرسي"],
        missingItem: "كرسي",
        emoji: "🪑"
      },
      {
        id: 2,
        name: "المطبخ",
        description: "أين الكوب؟",
        items: ["طباخ", "ثلاجة", "حوض", "كوب"],
        missingItem: "كوب",
        emoji: "🥤"
      },
      {
        id: 3,
        name: "الحديقة",
        description: "ابحث عن الكرة",
        items: ["شجرة", "زهور", "مقعد", "كرة"],
        missingItem: "كرة",
        emoji: "⚽"
      }
    ];

    const [currentScene, setCurrentScene] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const startFindingGame = () => {
      const randomScene = scenes[Math.floor(Math.random() * scenes.length)];
      setCurrentScene(randomScene);
      setGameSession(prev => ({ ...prev, isGameActive: true }));

      // تشغيل التعليمات الصوتية
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(randomScene.description);
        utterance.lang = 'ar-SA';
        speechSynthesis.speak(utterance);
      }
    };

    const handleItemClick = (item: string) => {
      if (!gameSession.isGameActive || !currentScene) return;

      if (item === currentScene.missingItem) {
        setFeedback({ type: 'success', message: 'ممتاز! وجدته!' });
        setGameSession(prev => ({
          ...prev,
          correctAnswers: prev.correctAnswers + 1,
          totalQuestions: prev.totalQuestions + 1
        }));

        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance('ممتاز! وجدته!');
          utterance.lang = 'ar-SA';
          speechSynthesis.speak(utterance);
        }

        setTimeout(() => {
          setFeedback(null);
          startFindingGame();
        }, 2000);

      } else {
        setFeedback({ type: 'error', message: 'ليس هذا، حاول مرة أخرى' });
        setGameSession(prev => ({
          ...prev,
          wrongAnswers: prev.wrongAnswers + 1,
          totalQuestions: prev.totalQuestions + 1
        }));

        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance('ليس هذا، حاول مرة أخرى');
          utterance.lang = 'ar-SA';
          speechSynthesis.speak(utterance);
        }

        setTimeout(() => setFeedback(null), 1500);
      }
    };

    return (
      <div className="space-y-6">
        {/* Game Header */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">🔍 البحث عن الأشياء المفقودة</h2>
                <p className="text-purple-100">ابحث عن الأشياء المفقودة في المشاهد المختلفة</p>
              </div>
              <Eye className="w-16 h-16 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        {/* Game Controls */}
        <div className="flex justify-center">
          {!gameSession.isGameActive ? (
            <Button
              onClick={startFindingGame}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Play className="w-5 h-5 ml-2" />
              ابدأ البحث
            </Button>
          ) : (
            <Button
              onClick={() => setGameSession(prev => ({ ...prev, isGameActive: false }))}
              size="lg"
              variant="outline"
            >
              <Pause className="w-5 h-5 ml-2" />
              إيقاف
            </Button>
          )}
        </div>

        {/* Game Area */}
        {gameSession.isGameActive && currentScene && (
          <Card className="min-h-96">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{currentScene.name}</CardTitle>
              <CardDescription className="text-lg font-medium">
                {currentScene.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative">
                {/* Feedback */}
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
                      <div className="text-2xl font-bold">{feedback.message}</div>
                    </div>
                  </div>
                )}

                {/* Scene Items */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                  {currentScene.items.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleItemClick(item)}
                      className={`
                        h-32 flex flex-col items-center justify-center rounded-lg cursor-pointer
                        transition-all duration-200 border-4 hover:scale-105
                        ${item === currentScene.missingItem
                          ? 'border-purple-400 bg-purple-100 hover:bg-purple-200'
                          : 'border-gray-300 bg-gray-100 hover:bg-gray-200'
                        }
                      `}
                    >
                      <div className="text-4xl mb-2">
                        {item === currentScene.missingItem ? currentScene.emoji : "📦"}
                      </div>
                      <div className="text-sm font-medium text-gray-700">{item}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const MainMenu = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-8 text-center">
          <Target className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">تمارين الانتباه والتركيز</h1>
          <p className="text-blue-100">ألعاب تفاعلية لتطوير مهارات الانتباه والتركيز</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentGame("star-selection")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">اختيار النجمة</h3>
                <p className="text-gray-600">ابحث عن النجمة بين الأشكال</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>• تطوير الانتباه البصري</p>
              <p>• تحسين التركيز والملاحظة</p>
              <p>• تعزيز سرعة الاستجابة</p>
            </div>
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ اللعبة
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentGame("find-missing")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">البحث عن المفقود</h3>
                <p className="text-gray-600">ابحث عن الأشياء المفقودة</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>• تطوير مهارات الملاحظة</p>
              <p>• تقوية الذاكرة البصرية</p>
              <p>• تحسين التركيز المكاني</p>
            </div>
            <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ اللعبة
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCurrentGame = () => {
    switch (currentGame) {
      case "star-selection":
        return <StarSelectionGame />;
      case "find-missing":
        return <FindMissingGame />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (currentGame === "menu") {
                    navigate('/specialist-dashboard');
                  } else {
                    setCurrentGame("menu");
                  }
                }}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {currentGame === "menu" ? "العودة للوحة التحكم" : "القائمة الرئيسية"}
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    تمارين الانتباه
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
        {renderCurrentGame()}
      </div>
    </div>
  );
}
