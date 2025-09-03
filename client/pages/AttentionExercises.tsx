import {
  ArrowLeft,
  Volume2,
  RotateCcw,
  CheckCircle,
  XCircle,
  Home,
  Play,
  Star,
  Target,
  Eye,
  Users,
  Timer,
  Search,
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
import { useState, useEffect, useRef } from "react";

export default function AttentionExercises() {
  const navigate = useNavigate();
  const [activeExercise, setActiveExercise] = useState<string | null>(null);

  const speakArabic = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const attentionTypes = [
    {
      id: "sustained",
      title: "الانتباه المتواصل",
      subtitle: "اصطياد النجمة",
      icon: <Star className="w-8 h-8" />,
      color: "bg-blue-500",
      description:
        "ظهور نجوم متساقطة بسرعة ثابتة - تظهر نجمة حمراء بين النجوم الزرقاء",
    },
    {
      id: "selective",
      title: "الانتباه الانتقائي",
      subtitle: "الأشياء المفقودة",
      icon: <Search className="w-8 h-8" />,
      color: "bg-green-500",
      description: "ابحث عن جميع الأشياء باللون الأصفر و��ض��ط عليها",
    },
    {
      id: "joint",
      title: "الانتباه المشترك",
      subtitle: "حامل الرسالة",
      icon: <Users className="w-8 h-8" />,
      color: "bg-purple-500",
      description:
        "4 شخصيات حاملة للرسالة تتحرك وتتحدث - انتبه للصوت وحدد مصدره",
    },
  ];

  // Sustained Attention - Star Catching
  const SustainedAttention = ({ onComplete }: { onComplete: () => void }) => {
    const [stars, setStars] = useState<
      Array<{ id: number; x: number; y: number; isRed: boolean; speed: number }>
    >([]);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameRunning, setGameRunning] = useState(false);
    const [gameTime, setGameTime] = useState(60); // 60 seconds game
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
      if (gameRunning && gameTime > 0) {
        const timer = setTimeout(() => setGameTime(gameTime - 1), 1000);
        return () => clearTimeout(timer);
      } else if (gameTime === 0) {
        setGameRunning(false);
        setShowResult(true);
      }
    }, [gameRunning, gameTime]);

    useEffect(() => {
      if (gameRunning) {
        const interval = setInterval(
          () => {
            // Add new star
            const newStar = {
              id: Date.now() + Math.random(),
              x: Math.random() * 80 + 10, // 10% to 90% of width
              y: 0,
              isRed: Math.random() < 0.2, // 20% chance of red star
              speed: 2 + Math.random() * 3, // Random speed
            };

            setStars((prev) => [...prev, newStar]);
          },
          1000 + Math.random() * 2000,
        ); // Random interval

        const moveInterval = setInterval(() => {
          setStars(
            (prev) =>
              prev
                .map((star) => ({ ...star, y: star.y + star.speed }))
                .filter((star) => star.y < 100), // Remove stars that went off screen
          );
        }, 50);

        return () => {
          clearInterval(interval);
          clearInterval(moveInterval);
        };
      }
    }, [gameRunning]);

    const handleStarClick = (star: any) => {
      if (star.isRed) {
        setScore(score + 1);
        speakArabic("ممتاز!");
        setStars((prev) => prev.filter((s) => s.id !== star.id));
      } else {
        setLives(lives - 1);
        speakArabic("أوووو حاول مرة أخرى");
        if (lives - 1 <= 0) {
          setGameRunning(false);
          setShowResult(true);
        }
      }
    };

    const startGame = () => {
      setGameRunning(true);
      setScore(0);
      setLives(3);
      setGameTime(60);
      setStars([]);
      setShowResult(false);
    };

    if (showResult) {
      return (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-2xl font-bold">انتهت لعبة اصطياد النجمة!</h3>
          <p className="text-lg">النتيجة: {score} نجمة حمراء</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={startGame}>
              <RotateCcw className="w-4 h-4 ml-2" />
              إعادة اللعب
            </Button>
            <Button onClick={onComplete} variant="outline">
              العودة
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">اصطياد النجمة</h3>
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="flex">
              {[...Array(3)].map((_, i) => (
                <span
                  key={i}
                  className={`text-2xl ${i < lives ? "text-red-500" : "text-gray-300"}`}
                >
                  ❤️
                </span>
              ))}
            </div>
            <div className="text-lg font-bold">��لنتيجة: {score}</div>
            <div className="text-lg font-bold">الوقت: {gameTime}ث</div>
          </div>

          {!gameRunning && !showResult && (
            <Button
              onClick={startGame}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Play className="w-4 h-4 ml-2" />
              ابدأ اللعبة
            </Button>
          )}
        </div>

        {gameRunning && (
          <div className="relative bg-black h-96 rounded-lg overflow-hidden">
            {stars.map((star) => (
              <div
                key={star.id}
                className={`absolute text-4xl cursor-pointer hover:scale-125 transition-transform ${
                  star.isRed ? "text-red-500" : "text-blue-500"
                }`}
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => handleStarClick(star)}
>
                <span className="select-none">★</span>
              </div>
            ))}

            <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 p-2 rounded">
              اضغط على النجوم الحمراء فقط!
            </div>
          </div>
        )}
      </div>
    );
  };

  // Selective Attention - Find Yellow Objects
  const SelectiveAttention = ({ onComplete }: { onComplete: () => void }) => {
    const [currentLevel, setCurrentLevel] = useState(1);
    const [foundObjects, setFoundObjects] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [gameObjects, setGameObjects] = useState<
      Array<{
        id: number;
        emoji: string;
        isYellow: boolean;
        x: number;
        y: number;
      }>
    >([]);

    const generateLevel = (level: number) => {
      const objectEmojis = [
        "🌟",
        "🌞",
        "🍌",
        "🔔",
        "⚡",
        "🏠",
        "🚗",
        "🌸",
        "🍎",
        "🌊",
        "🌳",
        "🎾",
      ];
      const yellowEmojis = ["🌟", "🌞", "🍌", "🔔"];
      const nonYellowEmojis = objectEmojis.filter(
        (e) => !yellowEmojis.includes(e),
      );

      const yellowCount = Math.min(2 + level, 6);
      const totalCount = Math.min(8 + level * 2, 20);

      const objects = [];

      // Add yellow objects
      for (let i = 0; i < yellowCount; i++) {
        objects.push({
          id: i,
          emoji: yellowEmojis[Math.floor(Math.random() * yellowEmojis.length)],
          isYellow: true,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
        });
      }

      // Add non-yellow objects
      for (let i = yellowCount; i < totalCount; i++) {
        objects.push({
          id: i,
          emoji:
            nonYellowEmojis[Math.floor(Math.random() * nonYellowEmojis.length)],
          isYellow: false,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
        });
      }

      setGameObjects(objects);
      setFoundObjects([]);
    };

    useEffect(() => {
      generateLevel(currentLevel);
    }, [currentLevel]);

    const handleObjectClick = (obj: any) => {
      if (obj.isYellow && !foundObjects.includes(obj.id)) {
        setFoundObjects([...foundObjects, obj.id]);
        setScore(score + 1);
        speakArabic("ممتاز!");

        // Check if all yellow objects found
        const totalYellow = gameObjects.filter((o) => o.isYellow).length;
        if (foundObjects.length + 1 === totalYellow) {
          if (currentLevel < 5) {
            setTimeout(() => {
              setCurrentLevel(currentLevel + 1);
              speakArabic(`المستوى ${currentLevel + 1}`);
            }, 1000);
          } else {
            setTimeout(() => setShowResult(true), 1000);
          }
        }
      } else if (!obj.isYellow) {
        speakArabic("هذا ليس أصفر! حاول مرة أخرى");
      }
    };

    if (showResult) {
      return (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🟡</div>
          <h3 className="text-2xl font-bold">انتهت لعبة الأشياء المفقودة!</h3>
          <p className="text-lg">النتيجة: {score} شيء أصفر</p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => {
                setCurrentLevel(1);
                setScore(0);
                setShowResult(false);
                generateLevel(1);
              }}
            >
              <RotateCcw className="w-4 h-4 ml-2" />
              إعادة اللعب
            </Button>
            <Button onClick={onComplete} variant="outline">
              العودة
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">��لأشياء المفقودة</h3>
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="text-lg font-bold">ا��مستوى: {currentLevel}</div>
            <div className="text-lg font-bold">النتيجة: {score}</div>
            <div className="text-lg font-bold">
              الأهداف: {foundObjects.length}/
              {gameObjects.filter((o) => o.isYellow).length}
            </div>
          </div>

          <Button
            onClick={() =>
              speakArabic("اختر الأشياء باللون الأصفر واضغط عليها")
            }
          >
            <Volume2 className="w-4 h-4 ml-2" />
            استمع للتعليمة
          </Button>
        </div>

        <div className="relative bg-gradient-to-br from-blue-100 to-green-100 h-96 rounded-lg overflow-hidden">
          {gameObjects.map((obj) => (
            <div
              key={obj.id}
              className={`absolute text-4xl cursor-pointer hover:scale-125 transition-transform ${
                foundObjects.includes(obj.id) ? "opacity-50 scale-75" : ""
              }`}
              style={{
                left: `${obj.x}%`,
                top: `${obj.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => handleObjectClick(obj)}
            >
              {obj.emoji}
            </div>
          ))}

          <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-2 rounded text-sm">
            ابحث عن جميع الأشياء الصفراء!
          </div>
        </div>
      </div>
    );
  };

  // Joint Attention - Message Carrier
  const JointAttention = ({ onComplete }: { onComplete: () => void }) => {
    const [gamePhase, setGamePhase] = useState<
      "listen" | "identify" | "watch" | "answer"
    >("listen");
    const [currentCharacter, setCurrentCharacter] = useState("");
    const [targetCharacter, setTargetCharacter] = useState("");
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [showResult, setShowResult] = useState(false);

    // Envelope animation state
    const containerRef = useRef<HTMLDivElement | null>(null);
    const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [messagePos, setMessagePos] = useState<{ x: number; y: number } | null>(null);
    const [showEnvelope, setShowEnvelope] = useState(false);

    const characters = [
      { id: "rabbit", name: "الأرنب", emoji: "🐰" },
      { id: "turtle", name: "السلحفاة", emoji: "🐢" },
      { id: "duck", name: "البطة", emoji: "🦆" },
      { id: "mouse", name: "الفأر", emoji: "🐭" },
    ];

    const startNewRound = () => {
      const messageCarrier =
        characters[Math.floor(Math.random() * characters.length)];
      const receiver = characters.filter((c) => c.id !== messageCarrier.id)[
        Math.floor(Math.random() * 3)
      ];

      setCurrentCharacter(messageCarrier.id);
      setTargetCharacter(receiver.id);
      setGamePhase("listen");

      // Simulate speaking
      setTimeout(() => {
        speakArabic(`${receiver.name} تعال وخذ الرسالة`);
        setGamePhase("identify");
      }, 1000);
    };

    useEffect(() => {
      startNewRound();
    }, []);

    const handleCharacterClick = (characterId: string) => {
      if (gamePhase === "identify") {
        if (characterId === currentCharacter) {
          setGamePhase("watch");
          speakArabic("ممتاز! انتبه الآن لتسليم الرسالة");

          // Animate envelope moving from the speaker to the receiver
          setTimeout(() => {
            const container = containerRef.current;
            const fromEl = cardRefs.current[currentCharacter!];
            const toEl = cardRefs.current[targetCharacter!];
            if (container && fromEl && toEl) {
              const contRect = container.getBoundingClientRect();
              const fromRect = fromEl.getBoundingClientRect();
              const toRect = toEl.getBoundingClientRect();
              const from = {
                x: fromRect.left + fromRect.width / 2 - contRect.left,
                y: fromRect.top + fromRect.height / 2 - contRect.top,
              };
              const to = {
                x: toRect.left + toRect.width / 2 - contRect.left,
                y: toRect.top + toRect.height / 2 - contRect.top,
              };
              let start: number | null = null;
              const duration = 1200;
              setShowEnvelope(true);
              const step = (ts: number) => {
                if (start === null) start = ts;
                const t = Math.min((ts - start) / duration, 1);
                const x = from.x + (to.x - from.x) * t;
                const y = from.y + (to.y - from.y) * t;
                setMessagePos({ x, y });
                if (t < 1) requestAnimationFrame(step);
                else setTimeout(() => setShowEnvelope(false), 200);
              };
              setMessagePos(from);
              requestAnimationFrame(step);
            }
          }, 300);

          setTimeout(() => {
            setGamePhase("answer");
            speakArabic(
              `لمن ${characters.find((c) => c.id === currentCharacter)?.name} الرسالة؟`,
            );
          }, 2000);
        } else {
          speakArabic("هذا ليس الصحيح، استمع جيداً");
        }
      } else if (gamePhase === "answer") {
        if (characterId === targetCharacter) {
          setScore(score + 1);
          speakArabic("ممتاز! إجابة صحيحة");

          if (round < 5) {
            setRound(round + 1);
            setTimeout(startNewRound, 2000);
          } else {
            setShowResult(true);
          }
        } else {
          speakArabic("هذا ليس الصحيح، فكر مرة أخرى");
        }
      }
    };

    if (showResult) {
      return (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">📮</div>
          <h3 className="text-2xl font-bold">انتهت لعبة حامل الرسالة!</h3>
          <p className="text-lg">النتيجة: {score} من 5</p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => {
                setScore(0);
                setRound(1);
                setShowResult(false);
                startNewRound();
              }}
            >
              <RotateCcw className="w-4 h-4 ml-2" />
              إعادة اللعب
            </Button>
            <Button onClick={onComplete} variant="outline">
              العودة
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">حامل الرسالة</h3>
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="text-lg font-bold">الجولة: {round}/5</div>
            <div className="text-lg font-bold">النتيجة: {score}</div>
          </div>

          <div className="mb-4">
            {gamePhase === "listen" && (
              <p className="text-blue-600 font-semibold">استمع للرسالة...</p>
            )}
            {gamePhase === "identify" && (
              <p className="text-green-600 font-semibold">
                اضغط على الشخصية التي تحدثت
              </p>
            )}
            {gamePhase === "watch" && (
              <p className="text-purple-600 font-semibold">
                انتبه لتسليم الرسالة...
              </p>
            )}
            {gamePhase === "answer" && (
              <p className="text-orange-600 font-semibold">
                من استلم الرسالة؟
              </p>
            )}
          </div>
        </div>

        <div className="relative max-w-lg mx-auto" ref={containerRef}>
          {showEnvelope && messagePos && (
            <div
              className="absolute z-20 text-4xl select-none"
              style={{ left: messagePos.x, top: messagePos.y, transform: 'translate(-50%, -50%)' }}
            >
              <svg width="42" height="32" viewBox="0 0 42 32" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="6" width="40" height="24" rx="4" fill="#ffffff" stroke="#4b5563" strokeWidth="2"/>
                <path d="M2 8 L21 20 L40 8" fill="none" stroke="#4b5563" strokeWidth="2"/>
              </svg>
            </div>
          )}
          {gamePhase === "watch" && !showEnvelope && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <svg width="64" height="48" viewBox="0 0 42 32" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
                <rect x="1" y="6" width="40" height="24" rx="4" fill="#ffffff" stroke="#4b5563" strokeWidth="2"/>
                <path d="M2 8 L21 20 L40 8" fill="none" stroke="#4b5563" strokeWidth="2"/>
              </svg>
            </div>
          )}
          <div className="grid grid-cols-2 gap-6">
            {characters.map((character) => (
              <div key={character.id} ref={(el) => { (cardRefs.current as any)[character.id] = el; }}>
                <Card
                  className={`cursor-pointer hover:shadow-lg transition-all text-center ${
                    gamePhase === "watch" && character.id === currentCharacter
                      ? "animate-pulse border-blue-500"
                      : ""
                  } ${
                    gamePhase === "watch" && character.id === targetCharacter
                      ? "border-green-500"
                      : ""
                  }`}
                  onClick={() => handleCharacterClick(character.id)}
                >
                  <CardContent className="p-6">
                    <div className="text-6xl mb-2">{character.emoji}</div>
                    <p className="font-semibold text-lg">{character.name}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={() => speakArabic("استمع للرسالة وحدد من الذي تكلم")}
            variant="outline"
          >
            <Volume2 className="w-4 h-4 ml-2" />
            إعادة الاستماع
          </Button>
        </div>
      </div>
    );
  };

  const renderExercise = () => {
    switch (activeExercise) {
      case "sustained":
        return (
          <SustainedAttention onComplete={() => setActiveExercise(null)} />
        );
      case "selective":
        return (
          <SelectiveAttention onComplete={() => setActiveExercise(null)} />
        );
      case "joint":
        return <JointAttention onComplete={() => setActiveExercise(null)} />;
      default:
        return null;
    }
  };

  if (activeExercise) {
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
                onClick={() => setActiveExercise(null)}
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة
              </Button>
              <h1 className="text-2xl font-bold">
                {attentionTypes.find((t) => t.id === activeExercise)?.title}
              </h1>
            </div>

            {renderExercise()}
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
                  تمارين الانتباه
                </h1>
                <p className="text-gray-600 text-sm">
                  تمارين تفاعلية لتطوير مهارات الانتباه والتركيز
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
          <div className="text-8xl mb-6">���</div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            طريقة اللعب
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            تطوير مهارات الانتباه من خلال ثلاثة أنواع من التمارين التفاعلية
          </p>
        </div>

        {/* Attention Types Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {attentionTypes.map((type) => (
            <Card
              key={type.id}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-gray-300 group"
              onClick={() => setActiveExercise(type.id)}
            >
              <CardHeader className="text-center">
                <div
                  className={`${type.color} text-white p-6 rounded-xl w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  {type.icon}
                </div>
                <CardTitle className="text-xl">{type.title}</CardTitle>
                <CardDescription className="text-base font-semibold text-purple-600">
                  {type.subtitle}
                </CardDescription>
                <CardDescription className="text-sm">
                  {type.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Button className="w-full" size="lg">
                  <Play className="w-4 h-4 ml-2" />
                  ابدأ التمرين
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Target className="w-5 h-5" />
              كيفية أداء التمارين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-blue-700">
              <div>
                <h4 className="font-semibold mb-2">الانتباه المتواصل:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• ظهور نجوم متساقطة بسرعة ثابتة</li>
                  <li>• تظهر نجمة حمراء بين النجوم الزرقاء</li>
                  <li>• اضغط على النجمة الحمر��ء فقط</li>
                  <li>• عند الإجابة الصحيحة يظهر صوت تصفيق</li>
                  <li>• عند الخطأ تظهر علامة X حمراء مع صوت "أعد المحاولة"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">الانتباه الانتقائي:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• ابحث عن كل الأشياء باللون الأصفر</li>
                  <li>• في البداية عدد قليل ثم يزداد</li>
                  <li>• اضغط على الأشياء الصفراء فقط</li>
                  <li>• مع ظهور صوت ناطق: "اختر الأشياء باللون الأصفر"</li>
                  <li>• تشجيع عند الإجابة الصحيحة</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">الانتباه المشترك:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• 4 شخصيات حاملة للرسالة تتحرك وتتحدث</li>
                  <li>• انتبه للصوت وحدد مصدره</li>
                  <li>• اضغط على الشخص��ة الصحيحة</li>
                  <li>• شاهد تسليم الرسالة</li>
                  <li>• اجب على "لمن الأرنب الرسالة؟"</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
              <p className="text-blue-800 font-semibold mb-2">ملاحظات:</p>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• نهاية كل تمرين يظهر الإجابات الصحيحة والخاطئة</li>
                <li>• الصوت في كل تمرين</li>
                <li>• تدرج في مستوى الصعوبة</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
