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
  const [currentGame, setCurrentGame] = useState("menu"); // menu, star-selection, find-missing
  const [gameSession, setGameSession] = useState({
    correctAnswers: 0,
    wrongAnswers: 0,
    totalQuestions: 0,
    currentQuestion: 1,
    isGameActive: false,
    timeElapsed: 0
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [gameData, setGameData] = useState({
    shapes: [],
    targetPosition: 0,
    currentScene: null,
    missingItem: null
  });

  // تمرين اختيار النجمة
  const StarSelectionGame = () => {
    const shapes = [Circle, Square, Triangle, Star];
    const [currentShapes, setCurrentShapes] = useState([]);
    const [targetIndex, setTargetIndex] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const generateLevel = () => {
      const numShapes = Math.min(4 + Math.floor(gameSession.currentQuestion / 3), 8);
      const shuffledShapes = [];
      const starPosition = Math.floor(Math.random() * numShapes);
      
      for (let i = 0; i < numShapes; i++) {
        if (i === starPosition) {
          shuffledShapes.push({ Component: Star, isTarget: true, id: i });
        } else {
          const randomShape = shapes[Math.floor(Math.random() * (shapes.length - 1))];
          shuffledShapes.push({ Component: randomShape, isTarget: false, id: i });
        }
      }
      
      setCurrentShapes(shuffledShapes);
      setTargetIndex(starPosition);
      playInstruction();
    };

    const playInstruction = () => {
      // تشغيل التعليمات الصوتية "اختر النجمة"
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('اختر النجمة');
        utterance.lang = 'ar-SA';
        speechSynthesis.speak(utterance);
      }
    };

    const handleShapeClick = (index: number, isTarget: boolean) => {
      if (!gameSession.isGameActive) return;

      if (isTarget) {
        setFeedback({ type: 'success', message: 'أحسنت!' });
        setGameSession(prev => ({
          ...prev,
          correctAnswers: prev.correctAnswers + 1,
          currentQuestion: prev.currentQuestion + 1,
          totalQuestions: prev.totalQuestions + 1
        }));
        
        // تشغيل صوت التصفيق
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance('أحسنت! ممتاز');
          utterance.lang = 'ar-SA';
          speechSynthesis.speak(utterance);
        }
        
        setTimeout(() => {
          setFeedback(null);
          if (gameSession.currentQuestion < 10) {
            generateLevel();
          } else {
            endGame();
          }
        }, 2000);
        
      } else {
        setFeedback({ type: 'error', message: 'أعد المحاولة' });
        setGameSession(prev => ({
          ...prev,
          wrongAnswers: prev.wrongAnswers + 1,
          totalQuestions: prev.totalQuestions + 1
        }));
        
        // تشغيل صوت "أعد المحاولة"
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance('أعد المحاولة');
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
        timeElapsed: 0
      });
      generateLevel();
    };

    const endGame = () => {
      setGameSession(prev => ({ ...prev, isGameActive: false }));
    };

    useEffect(() => {
      if (gameSession.isGameActive && gameSession.currentQuestion === 1) {
        generateLevel();
      }
    }, [gameSession.isGameActive]);

    return (
      <div className="space-y-6">
        {/* Game Header */}
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">🌟 اختيار النجمة</h2>
                <p className="text-yellow-100">ابحث عن النجمة بين الأشكال واضغط عليها</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-yellow-100 mb-1">السؤال</div>
                <div className="text-2xl font-bold">{gameSession.currentQuestion}/10</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{gameSession.correctAnswers}</div>
              <div className="text-sm text-green-700">إجابات صحيحة</div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 text-center">
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{gameSession.wrongAnswers}</div>
              <div className="text-sm text-red-700">إجابات خاطئة</div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {gameSession.totalQuestions > 0 ? Math.round((gameSession.correctAnswers / gameSession.totalQuestions) * 100) : 0}%
              </div>
              <div className="text-sm text-blue-700">نسبة النجاح</div>
            </CardContent>
          </Card>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center gap-4">
          {!gameSession.isGameActive ? (
            <Button 
              onClick={startGame} 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Play className="w-5 h-5 ml-2" />
              ابدأ اللعبة
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
                onClick={generateLevel} 
                size="lg" 
                variant="outline"
              >
                <RotateCcw className="w-5 h-5 ml-2" />
                سؤال جديد
              </Button>
            </>
          )}
        </div>

        {/* Game Area */}
        {gameSession.isGameActive && (
          <Card className="min-h-96">
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

                {/* Shapes Grid */}
                <div className="grid grid-cols-4 gap-6 max-w-2xl mx-auto">
                  {currentShapes.map((shape, index) => (
                    <div
                      key={shape.id}
                      onClick={() => handleShapeClick(index, shape.isTarget)}
                      className={`
                        w-20 h-20 flex items-center justify-center rounded-lg cursor-pointer
                        transition-all duration-200 border-4 hover:scale-110
                        ${shape.isTarget 
                          ? 'border-yellow-400 bg-yellow-100 hover:bg-yellow-200' 
                          : 'border-gray-300 bg-gray-100 hover:bg-gray-200'
                        }
                        ${feedback?.type === 'error' && !shape.isTarget ? 'animate-pulse border-red-400' : ''}
                      `}
                    >
                      <shape.Component 
                        className={`w-12 h-12 ${
                          shape.isTarget ? 'text-yellow-600' : 'text-gray-600'
                        }`}
                      />
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-8 max-w-md mx-auto">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>التقدم</span>
                    <span>{gameSession.currentQuestion - 1}/10</span>
                  </div>
                  <Progress value={((gameSession.currentQuestion - 1) / 10) * 100} className="h-3" />
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{gameSession.correctAnswers}</div>
                  <div className="text-sm text-gray-600">صحيحة</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{gameSession.wrongAnswers}</div>
                  <div className="text-sm text-gray-600">خاطئة</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{gameSession.totalQuestions}</div>
                  <div className="text-sm text-gray-600">إجمالي</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round((gameSession.correctAnswers / gameSession.totalQuestions) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">نسبة النجاح</div>
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
