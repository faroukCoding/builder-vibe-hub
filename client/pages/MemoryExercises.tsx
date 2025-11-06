import {
  ArrowLeft,
  Volume2,
  RotateCcw,
  CheckCircle,
  XCircle,
  Home,
  Play,
  Brain,
  Ear,
  Eye,
  Timer,
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

export default function MemoryExercises() {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState<string | null>(null);

  const speakArabic = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const memoryTypes = [
    {
      id: "auditory",
      title: "الذاكرة السمعية",
      subtitle: "Auditory Memory",
      icon: <Ear className="w-8 h-8" />,
      color: "bg-green-500",
      description: "صندوق الأصوات المتسلسل - رتب بتسلسل حسب الصوت",
    },
    {
      id: "visual",
      title: "الذاكرة البصرية",
      subtitle: "Visual Memory",
      icon: <Eye className="w-8 h-8" />,
      color: "bg-blue-500",
      description: "مكان الصورة - تذكر مواضع الصور واسحبها لأماكنها",
    },
    {
      id: "working",
      title: "الذاكرة العاملة",
      subtitle: "Working Memory",
      icon: <Brain className="w-8 h-8" />,
      color: "bg-purple-500",
      description: "الترتيب العكسي - تذكر الأشكال ورتبها بشكل عكسي",
    },
  ];

  // Auditory Memory Game
  const AuditoryMemoryGame = ({ onComplete }: { onComplete: () => void }) => {
    const [sequence, setSequence] = useState<string[]>([]);
    const [playerSequence, setPlayerSequence] = useState<string[]>([]);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPlayerTurn, setIsPlayerTurn] = useState(false);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [showResult, setShowResult] = useState(false);

    const sounds = [
      { id: "bell", name: "جرس", emoji: "🔔", sound: "bell" },
      { id: "cat", name: "مواء", emoji: "🐱", sound: "meow" },
      { id: "whistle", name: "صفارة", emoji: "🎵", sound: "whistle" },
    ];

    const availableSounds = sounds.slice(
      0,
      Math.min(2 + Math.floor(currentLevel / 5), sounds.length),
    );

    const playSequence = async () => {
      setIsPlaying(true);
      setIsPlayerTurn(false);

      // Generate new sequence
      const newSequence = [];
      const sequenceLength = Math.min(2 + Math.floor(score / 5), 4);

      for (let i = 0; i < sequenceLength; i++) {
        const randomSound =
          availableSounds[Math.floor(Math.random() * availableSounds.length)];
        newSequence.push(randomSound.id);
      }

      setSequence(newSequence);
      setPlayerSequence([]);

      // Play sequence with delays
      for (let i = 0; i < newSequence.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const sound = sounds.find((s) => s.id === newSequence[i]);
        if (sound) {
          speakArabic(sound.name);
        }
      }

      setTimeout(() => {
        setIsPlaying(false);
        setIsPlayerTurn(true);
        speakArabic("رتب بتسلسل حسب الصوت");
      }, 1000);
    };

    const handleSoundClick = (soundId: string) => {
      if (!isPlayerTurn) return;

      const newPlayerSequence = [...playerSequence, soundId];
      setPlayerSequence(newPlayerSequence);

      // Check if the sequence is correct so far
      const isCorrect = newPlayerSequence.every(
        (sound, index) => sound === sequence[index],
      );

      if (!isCorrect) {
        // Wrong answer
        setLives(lives - 1);
        speakArabic("أوووو حاول مرة أخرى");

        if (lives - 1 <= 0) {
          setShowResult(true);
        } else {
          setTimeout(() => {
            setPlayerSequence([]);
            playSequence();
          }, 1500);
        }
        return;
      }

      // Check if sequence is complete
      if (newPlayerSequence.length === sequence.length) {
        setScore(score + 1);
        speakArabic("ممتاز! إجابة صحيحة");

        setTimeout(() => {
          playSequence();
        }, 1500);
      }
    };

    useEffect(() => {
      playSequence();
    }, []);

    if (showResult) {
      return (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎧</div>
          <h3 className="text-2xl font-bold">انتهت لعبة الذاكرة السمعية!</h3>
          <p className="text-lg">النتيجة: {score} تسلسلات صحيحة</p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => {
                setScore(0);
                setLives(3);
                setShowResult(false);
                setCurrentLevel(1);
                playSequence();
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
          <h3 className="text-xl font-bold mb-4">صندوق الأصوات المتسلسل</h3>
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
            <div className="text-lg font-bold">النتيجة: {score}</div>
          </div>

          {isPlaying && (
            <div className="text-blue-600 font-semibold mb-4">
              <Timer className="w-5 h-5 inline ml-2" />
              استمع للتسلسل...
            </div>
          )}

          {isPlayerTurn && (
            <div className="text-green-600 font-semibold mb-4">
              دورك الآن - اضغط على الأصوات بنفس الترتيب
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto">
          {availableSounds.map((sound) => (
            <Card
              key={sound.id}
              className={`cursor-pointer hover:shadow-lg transition-all ${
                !isPlayerTurn ? "opacity-50 cursor-not-allowed" : ""
              } ${
                playerSequence.includes(sound.id)
                  ? "bg-blue-100 border-blue-400"
                  : ""
              }`}
              onClick={() => handleSoundClick(sound.id)}
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">{sound.emoji}</div>
                <p className="font-semibold">{sound.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={() => speakArabic("يسمع المستخدم تسلسلاً صوتياً")}
            variant="outline"
          >
            <Volume2 className="w-4 h-4 ml-2" />
            إعادة سماع التعليمات
          </Button>
        </div>

        {/* Basket visualization */}
        <div className="text-center">
          <div className="text-6xl mb-2">🧺</div>
          <p className="text-sm text-gray-600">
            كلما جاوب على 5 إجابات صحيحة يتطلب وضع عناصر أكثر في السلة
          </p>
        </div>
      </div>
    );
  };

  // Visual Memory Game
  const VisualMemoryGame = ({ onComplete }: { onComplete: () => void }) => {
    const [gridSize] = useState(4);
    const [images, setImages] = useState<string[]>([]);
    const [showImages, setShowImages] = useState(true);
    const [gamePhase, setGamePhase] = useState<"memorize" | "place">(
      "memorize",
    );
    const [placedImages, setPlacedImages] = useState<{ [key: number]: string }>(
      {},
    );
    const [availableImages, setAvailableImages] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [showResult, setShowResult] = useState(false);
    const [memorizeTime, setMemorizeTime] = useState(5);

    const imageEmojis = ["🐱", "🐸", "🐰", "🦆"];

    const initializeGame = () => {
      // Create a grid with some images
      const newImages = Array(gridSize).fill("");
      const positions = [0, 1, 2, 3]; // First 4 positions
      const selectedImages = imageEmojis.slice(0, 4);

      positions.forEach((pos, index) => {
        newImages[pos] = selectedImages[index];
      });

      setImages(newImages);
      setAvailableImages([...selectedImages]);
      setPlacedImages({});
      setGamePhase("memorize");
      setShowImages(true);
      setMemorizeTime(5);
    };

    useEffect(() => {
      initializeGame();
    }, []);

    useEffect(() => {
      if (gamePhase === "memorize" && memorizeTime > 0) {
        const timer = setTimeout(() => {
          setMemorizeTime(memorizeTime - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else if (gamePhase === "memorize" && memorizeTime === 0) {
        setShowImages(false);
        setGamePhase("place");
        speakArabic("أين مكان الصور");
      }
    }, [memorizeTime, gamePhase]);

    const handleDrop = (position: number, imageEmoji: string) => {
      if (gamePhase !== "place") return;

      const correctImage = images[position];
      const isCorrect = correctImage === imageEmoji;

      if (isCorrect) {
        setPlacedImages({ ...placedImages, [position]: imageEmoji });
        setAvailableImages(availableImages.filter((img) => img !== imageEmoji));
        speakArabic("ممتاز! مكان صحيح");

        // Check if all images are placed correctly
        const newPlaced = { ...placedImages, [position]: imageEmoji };
        const allPlaced = Object.keys(newPlaced).length === imageEmojis.length;

        if (allPlaced) {
          setScore(score + 1);
          setTimeout(() => {
            initializeGame();
          }, 1500);
        }
      } else {
        setLives(lives - 1);
        speakArabic("أوووو حاول مرة أخرى");

        if (lives - 1 <= 0) {
          setShowResult(true);
        }
      }
    };

    if (showResult) {
      return (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">👁️</div>
          <h3 className="text-2xl font-bold">انتهت لعبة الذاكرة البصرية!</h3>
          <p className="text-lg">النتيجة: {score} جولات صحيحة</p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => {
                setScore(0);
                setLives(3);
                setShowResult(false);
                initializeGame();
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
          <h3 className="text-xl font-bold mb-4">مكان الصورة</h3>
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
            <div className="text-lg font-bold">النتيجة: {score}</div>
          </div>

          {gamePhase === "memorize" && (
            <div className="text-blue-600 font-semibold mb-4">
              <Timer className="w-5 h-5 inline ml-2" />
              احفظ مواضع الصور - يتبقى {memorizeTime} ثواني
            </div>
          )}

          {gamePhase === "place" && (
            <div className="text-green-600 font-semibold mb-4">
              اسحب كل صورة إلى مكانها الصحيح
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
          {Array(gridSize)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="w-24 h-24 border-4 border-black rounded-lg flex items-center justify-center text-4xl bg-white hover:bg-gray-50 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const imageEmoji = e.dataTransfer.getData("text/plain");
                  handleDrop(index, imageEmoji);
                }}
              >
                {(showImages && images[index]) || placedImages[index] || ""}
              </div>
            ))}
        </div>

        {/* Available images to drag */}
        {gamePhase === "place" && (
          <div className="flex justify-center gap-4">
            {availableImages.map((imageEmoji, index) => (
              <div
                key={index}
                className="w-16 h-16 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center text-3xl cursor-move hover:scale-110 transition-transform"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", imageEmoji);
                }}
              >
                {imageEmoji}
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Button
            onClick={() => speakArabic("يسمع المستخدم أين مكان الصور")}
            variant="outline"
          >
            <Volume2 className="w-4 h-4 ml-2" />
            استمع للتعليمات
          </Button>
        </div>
      </div>
    );
  };

  // Working Memory Game - الترتيب العكسي
  const WorkingMemoryGame = ({ onComplete }: { onComplete: () => void }) => {
    const [shapes, setShapes] = useState<string[]>([]);
    const [showShapes, setShowShapes] = useState(true);
    const [gamePhase, setGamePhase] = useState<"memorize" | "recall">("memorize");
    const [playerSequence, setPlayerSequence] = useState<string[]>([]);
    const [availableShapes, setAvailableShapes] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [showResult, setShowResult] = useState(false);
    const [memorizeTime, setMemorizeTime] = useState(3);
    const [level, setLevel] = useState(2); // Start with 2 shapes

    const shapeEmojis = ["🔺", "🔵", "⭐", "🟩", "🔶", "🟣"];

    const initializeGame = () => {
      // Generate random sequence of shapes
      const newShapes = [];
      for (let i = 0; i < level; i++) {
        const randomShape = shapeEmojis[Math.floor(Math.random() * shapeEmojis.length)];
        newShapes.push(randomShape);
      }

      setShapes(newShapes);
      setAvailableShapes([...newShapes].sort(() => Math.random() - 0.5)); // Shuffle available shapes
      setPlayerSequence([]);
      setGamePhase("memorize");
      setShowShapes(true);
      setMemorizeTime(3);
    };

    useEffect(() => {
      initializeGame();
    }, [level]);

    useEffect(() => {
      if (gamePhase === "memorize" && memorizeTime > 0) {
        const timer = setTimeout(() => {
          setMemorizeTime(memorizeTime - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else if (gamePhase === "memorize" && memorizeTime === 0) {
        setShowShapes(false);
        setGamePhase("recall");
        speakArabic("الآن رتب الأشكال بشكل عكسي");
      }
    }, [memorizeTime, gamePhase]);

    const handleShapeClick = (shape: string) => {
      if (gamePhase !== "recall") return;

      const newPlayerSequence = [...playerSequence, shape];
      setPlayerSequence(newPlayerSequence);

      // Check if sequence is complete
      if (newPlayerSequence.length === shapes.length) {
        // Check if the sequence is the reverse of the original
        const reversedOriginal = [...shapes].reverse();
        const isCorrect = newPlayerSequence.every(
          (shape, index) => shape === reversedOriginal[index]
        );

        if (isCorrect) {
          setScore(score + 1);
          speakArabic("ممتاز! الترتيب صحيح");

          // Increase level every 3 correct answers
          if (score > 0 && score % 3 === 0) {
            setLevel(level + 1);
          }

          setTimeout(() => {
            initializeGame();
          }, 1500);
        } else {
          setLives(lives - 1);
          speakArabic("أوووو حاول مرة أخرى");

          if (lives - 1 <= 0) {
            setShowResult(true);
          } else {
            setTimeout(() => {
              initializeGame();
            }, 1500);
          }
        }
      }
    };

    if (showResult) {
      return (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🧠</div>
          <h3 className="text-2xl font-bold">انتهت لعبة الذاكرة العاملة!</h3>
          <p className="text-lg">النتيجة: {score} جولات صحيحة</p>
          <p className="text-lg">أعلى مستوى: {level} أشكال</p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => {
                setScore(0);
                setLives(3);
                setLevel(2);
                setShowResult(false);
                initializeGame();
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
          <h3 className="text-xl font-bold mb-4">الترتيب العكسي</h3>
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
            <div className="text-lg font-bold">النتيجة: {score}</div>
            <div className="text-lg font-bold">المستوى: {level}</div>
          </div>

          {gamePhase === "memorize" && (
            <div className="text-blue-600 font-semibold mb-4">
              <Timer className="w-5 h-5 inline ml-2" />
              انظر إلى الأشكال - يتبقى {memorizeTime} ثواني
            </div>
          )}

          {gamePhase === "recall" && (
            <div className="text-green-600 font-semibold mb-4">
              اضغط على الأشكال بالترتيب العكسي
            </div>
          )}
        </div>

        {/* Original Shapes Display */}
        <div className="text-center">
          <h4 className="font-semibold mb-4">الأشكال:</h4>
          <div className="flex justify-center gap-4 mb-8">
            {shapes.map((shape, index) => (
              <div
                key={index}
                className={`w-16 h-16 border-4 rounded-lg flex items-center justify-center text-3xl transition-all ${
                  showShapes
                    ? "border-black bg-white"
                    : "border-gray-300 bg-gray-100"
                }`}
              >
                {showShapes ? shape : "?"}
              </div>
            ))}
          </div>
        </div>

        {/* Player's Sequence */}
        {gamePhase === "recall" && (
          <div className="text-center">
            <h4 className="font-semibold mb-4">ترتيبك:</h4>
            <div className="flex justify-center gap-4 mb-8">
              {playerSequence.map((shape, index) => (
                <div
                  key={index}
                  className="w-16 h-16 border-4 border-green-500 bg-green-100 rounded-lg flex items-center justify-center text-3xl"
                >
                  {shape}
                </div>
              ))}
              {Array(shapes.length - playerSequence.length)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 border-4 border-gray-300 bg-gray-100 rounded-lg flex items-center justify-center text-3xl text-gray-400"
                  >
                    ?
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Available Shapes to Click */}
        {gamePhase === "recall" && (
          <div className="text-center">
            <h4 className="font-semibold mb-4">اختر الأشكال:</h4>
            <div className="flex justify-center gap-4 flex-wrap">
              {availableShapes.map((shape, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-lg transition-all w-20 h-20 flex items-center justify-center"
                  onClick={() => handleShapeClick(shape)}
                >
                  <CardContent className="p-0 flex items-center justify-center text-3xl">
                    {shape}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <Button
            onClick={() => speakArabic("يتظهر في الشاشة أشكال لثواني ثم تختفي وعلى المستخدم ترتيبها بشكل عكسي")}
            variant="outline"
          >
            <Volume2 className="w-4 h-4 ml-2" />
            استمع للتعليمات
          </Button>
        </div>
      </div>
    );
  };

  const renderMemoryGame = () => {
    switch (activeType) {
      case "auditory":
        return <AuditoryMemoryGame onComplete={() => setActiveType(null)} />;
      case "visual":
        return <VisualMemoryGame onComplete={() => setActiveType(null)} />;
      case "working":
        return <WorkingMemoryGame onComplete={() => setActiveType(null)} />;
      default:
        return null;
    }
  };

  if (activeType) {
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
                onClick={() => setActiveType(null)}
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة
              </Button>
              <h1 className="text-2xl font-bold">
                {memoryTypes.find((t) => t.id === activeType)?.title}
              </h1>
            </div>

            {renderMemoryGame()}
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
                  لعبة الذاكرة
                </h1>
                <p className="text-gray-600 text-sm">
                  تمارين الذاكرة السمعية والبصرية والذاكرة العاملة
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
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            MEMORY GAME
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            تطوير الذاكرة السمعية والبصرية والذاكرة العاملة من خلال ألعاب تفاعلية ممتعة
          </p>
        </div>

        {/* Memory Types Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {memoryTypes.map((type) => (
            <Card
              key={type.id}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-gray-300 group"
              onClick={() => setActiveType(type.id)}
            >
              <CardHeader className="text-center">
                <div
                  className={`${type.color} text-white p-6 rounded-xl w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  {type.icon}
                </div>
                <CardTitle className="text-xl">{type.title}</CardTitle>
                <CardDescription className="text-base font-semibold text-gray-500">
                  {type.subtitle}
                </CardDescription>
                <CardDescription className="text-sm">
                  {type.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Button className="w-full" size="lg">
                  <Play className="w-4 h-4 ml-2" />
                  PLAY
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Brain className="w-5 h-5" />
              تعليمات الألعاب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-blue-700">
              <div>
                <h4 className="font-semibold mb-2">الذاكرة السمعية:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• يسمع المستخدم تسلسلاً صوتياً</li>
                  <li>• يُظهر الشاشة رموزاً للأصوات</li>
                  <li>• يُطلب لمسها بنفس الترتيب</li>
                  <li>• تشجيع عند الإجابة الصحيحة</li>
                  <li>• عند الإجابة الخاطئة: "أوووو حاول مرة أخرى"</li>
                  <li>• لديه 3 محاولات في التجربة</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">الذاكرة البصرية:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• يعطي للطفل وقتاً محدداً لمشاهدة الصور ثم تختفي</li>
                  <li>• تظهر الصور أسفل الجدول ويطلب منه سحبها إلى مكانها</li>
                  <li>• يسمع المستخدم "أين مكان الصور"</li>
                  <li>• تشجيع عند الإجابة الصحيحة</li>
                  <li>• عند الإجابة الخاطئة: "أوووو حاول مرة أخرى"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">الذاكرة العاملة:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• يتظهر في الشاشة أشكال لثواني ثم تختفي</li>
                  <li>• وعلى المستخدم ترتيبها بشكل عكسي</li>
                  <li>• يسمع المستخدم "الآن رتب الأشكال بشكل عكسي"</li>
                  <li>• تشجيع عند الإجابة الصحيحة</li>
                  <li>• عند الإجابة الخاطئة: "أوووو حاول مرة أخرى"</li>
                  <li>• تزداد الصعوبة مع تقدم المستوى</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

         
