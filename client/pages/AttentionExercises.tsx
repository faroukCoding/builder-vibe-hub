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
  Home,
  Search,
  Users,
  Palette,
  Hash,
  MapPin,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

interface Star {
  id: string;
  x: number;
  y: number;
  isRed: boolean;
  speed: number;
}

interface Character {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  emoji: string;
  hasMessage: boolean;
  message?: string;
}

interface ColoredItem {
  id: string;
  name: string;
  color: string;
  emoji: string;
  x: number;
  y: number;
}

export default function AttentionExercises() {
  const navigate = useNavigate();
  const [currentGame, setCurrentGame] = useState("menu");
  const [gameSession, setGameSession] = useState({
    correctAnswers: 0,
    wrongAnswers: 0,
    totalQuestions: 0,
    currentQuestion: 1,
    isGameActive: false,
    timeElapsed: 0,
    level: 1,
    score: 0
  });

  const speakArabic = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // الانتباه المتواصل - نجوم متساقطة
  const SustainedAttentionGame = () => {
    const [stars, setStars] = useState<Star[]>([]);
    const [gameActive, setGameActive] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [redStarClicked, setRedStarClicked] = useState(false);
    const gameAreaRef = useRef<HTMLDivElement>(null);

    const createStar = () => {
      const isRed = Math.random() < 0.15; // 15% احتمال للنجمة الحمراء
      const newStar: Star = {
        id: Math.random().toString(36).substr(2, 9),
        x: Math.random() * 90, // نسبة مئوية من العرض
        y: -5,
        isRed,
        speed: 1 + Math.random() * 2
      };
      setStars(prev => [...prev, newStar]);
    };

    const handleStarClick = (star: Star) => {
      if (!gameActive) return;

      if (star.isRed) {
        setScore(prev => prev + 10);
        setRedStarClicked(true);
        speakArabic("ممتاز! نجمة حمراء");
        setTimeout(() => setRedStarClicked(false), 500);
      } else {
        setScore(prev => Math.max(0, prev - 5));
        speakArabic("انتبه! هذه نجمة زرقاء");
      }

      // إزالة النجمة المضغوطة
      setStars(prev => prev.filter(s => s.id !== star.id));
    };

    const startSustainedGame = () => {
      setGameActive(true);
      setScore(0);
      setTimeLeft(60);
      setStars([]);
      speakArabic("ابدأ! اضغط على النجوم الحمراء فقط");
    };

    const endSustainedGame = () => {
      setGameActive(false);
      setStars([]);
      speakArabic(`انتهت اللعبة! نقاطك ${score}`);
    };

    useEffect(() => {
      if (!gameActive) return;

      const starCreationInterval = setInterval(createStar, 1500);
      const starMovementInterval = setInterval(() => {
        setStars(prev =>
          prev.map(star => ({
            ...star,
            y: star.y + star.speed
          })).filter(star => star.y < 100) // إزالة النجوم التي خرجت من الشاشة
        );
      }, 50);

      const timerInterval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endSustainedGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(starCreationInterval);
        clearInterval(starMovementInterval);
        clearInterval(timerInterval);
      };
    }, [gameActive]);

    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <Button onClick={() => setCurrentGame("menu")} variant="outline">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للقائمة
          </Button>
          <h2 className="text-2xl font-bold text-center">الانتباه المتواصل</h2>
          <div></div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              لعبة النجوم المتساقطة
            </CardTitle>
            <CardDescription>
              اضغط على النجوم الحمراء فقط! تجنب النجوم الزرقاء
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4">
                <Badge variant="outline">النقاط: {score}</Badge>
                <Badge variant="outline">الوقت: {timeLeft}ث</Badge>
              </div>
              {!gameActive ? (
                <Button onClick={startSustainedGame} className="bg-green-500 hover:bg-green-600">
                  <Play className="w-4 h-4 ml-2" />
                  ابدأ اللعبة
                </Button>
              ) : (
                <Button onClick={endSustainedGame} variant="destructive">
                  <Pause className="w-4 h-4 ml-2" />
                  إيقاف
                </Button>
              )}
            </div>

            <div
              ref={gameAreaRef}
              className="relative w-full h-96 bg-gradient-to-b from-indigo-900 to-purple-900 rounded-lg overflow-hidden border-4 border-yellow-400"
              style={{ position: 'relative' }}
            >
              {stars.map(star => (
                <div
                  key={star.id}
                  className={`absolute cursor-pointer transition-all duration-100 ${redStarClicked ? 'animate-pulse' : ''}`}
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => handleStarClick(star)}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star.isRed
                        ? 'text-red-400 fill-red-400 animate-pulse'
                        : 'text-blue-400 fill-blue-400'
                    } hover:scale-110 transition-transform`}
                  />
                </div>
              ))}
              {!gameActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="text-center text-white">
                    <Star className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                    <p className="text-xl mb-2">اضغط على "ابدأ اللعبة" للبدء</p>
                    <p className="text-sm">اضغط على النجوم الحمراء فقط!</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // الانتباه الانتقائي - اختيار الألوان
  const SelectiveAttentionGame = () => {
    const [coloredItems, setColoredItems] = useState<ColoredItem[]>([]);
    const [targetColor, setTargetColor] = useState("");
    const [gameActive, setGameActive] = useState(false);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [timeLeft, setTimeLeft] = useState(45);

    const items = [
      { name: "تفاحة", emoji: "🍎" },
      { name: "كرة", emoji: "⚽" },
      { name: "سيارة", emoji: "🚗" },
      { name: "زهرة", emoji: "🌸" },
      { name: "قلم", emoji: "✏️" },
      { name: "كتاب", emoji: "📖" },
      { name: "بيت", emoji: "🏠" },
      { name: "شمس", emoji: "☀️" }
    ];

    const colors = [
      { name: "أحمر", value: "red", bg: "bg-red-400" },
      { name: "أزرق", value: "blue", bg: "bg-blue-400" },
      { name: "أخضر", value: "green", bg: "bg-green-400" },
      { name: "أصفر", value: "yellow", bg: "bg-yellow-400" },
      { name: "برتقالي", value: "orange", bg: "bg-orange-400" },
      { name: "بنفسجي", value: "purple", bg: "bg-purple-400" }
    ];

    const generateItems = () => {
      const numItems = Math.min(8, 6 + level); // حد أقصى 8 عناصر
      const newItems: ColoredItem[] = [];

      // تأكد من وجود على الأقل عنصرين من اللون المطلوب
      const targetColorObj = colors.find(c => c.value === targetColor);
      if (targetColorObj) {
        const minTargetItems = Math.max(2, Math.floor(numItems / 3));

        // إضافة العناصر من اللون المطلوب
        for (let i = 0; i < minTargetItems; i++) {
          const item = items[Math.floor(Math.random() * items.length)];
          newItems.push({
            id: `target-${i}-${Date.now()}-${Math.random()}`,
            name: item.name,
            color: targetColor,
            emoji: item.emoji,
            x: 15 + Math.random() * 70,
            y: 15 + Math.random() * 70
          });
        }

        // إضافة باقي العناصر بألوان مختلفة
        for (let i = minTargetItems; i < numItems; i++) {
          const item = items[Math.floor(Math.random() * items.length)];
          const availableColors = colors.filter(c => c.value !== targetColor);
          const color = availableColors[Math.floor(Math.random() * availableColors.length)];
          newItems.push({
            id: `other-${i}-${Date.now()}-${Math.random()}`,
            name: item.name,
            color: color.value,
            emoji: item.emoji,
            x: 15 + Math.random() * 70,
            y: 15 + Math.random() * 70
          });
        }
      }

      // خلط العناصر
      const shuffledItems = newItems.sort(() => Math.random() - 0.5);
      setColoredItems(shuffledItems);
    };

    const startSelectiveGame = () => {
      setGameActive(true);
      setScore(0);
      setTimeLeft(45);
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setTargetColor(randomColor.value);
      generateItems();
      speakArabic(`اختر الأشياء باللون ${randomColor.name}`);
    };

    const handleItemClick = (item: ColoredItem) => {
      if (!gameActive) return;

      if (item.color === targetColor) {
        setScore(prev => prev + 10);
        speakArabic("ممتاز!");
        setColoredItems(prev => prev.filter(i => i.id !== item.id));

        // تحقق من انتهاء المستوى
        if (coloredItems.filter(i => i.color === targetColor).length === 1) {
          setTimeout(() => {
            setLevel(prev => prev + 1);
            generateItems();
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            setTargetColor(randomColor.value);
            speakArabic(`مس��وى جديد! اختر الأشياء باللون ${colors.find(c => c.value === randomColor.value)?.name}`);
          }, 1000);
        }
      } else {
        setScore(prev => Math.max(0, prev - 5));
        speakArabic("حاول مرة أخرى");
      }
    };

    const endSelectiveGame = () => {
      setGameActive(false);
      setColoredItems([]);
      speakArabic(`انتهت اللعبة! نقاطك ${score}`);
    };

    useEffect(() => {
      if (!gameActive) return;

      const timerInterval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endSelectiveGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerInterval);
    }, [gameActive]);

    const currentColorName = colors.find(c => c.value === targetColor)?.name || "";
    const currentColorBg = colors.find(c => c.value === targetColor)?.bg || "";

    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <Button onClick={() => setCurrentGame("menu")} variant="outline">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للقائمة
          </Button>
          <h2 className="text-2xl font-bold text-center">الانتباه الانتقائي</h2>
          <div></div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-6 h-6" />
              لعبة اختيار الألوان
            </CardTitle>
            <CardDescription>
              اختر الأشياء باللون المطلوب فقط
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4">
                <Badge variant="outline">النقاط: {score}</Badge>
                <Badge variant="outline">المستوى: {level}</Badge>
                <Badge variant="outline">الوقت: {timeLeft}ث</Badge>
              </div>
              {!gameActive ? (
                <Button onClick={startSelectiveGame} className="bg-blue-500 hover:bg-blue-600">
                  <Play className="w-4 h-4 ml-2" />
                  ابدأ اللعبة
                </Button>
              ) : (
                <Button onClick={endSelectiveGame} variant="destructive">
                  <Pause className="w-4 h-4 ml-2" />
                  إيقاف
                </Button>
              )}
            </div>

            {gameActive && targetColor && (
              <div className="mb-4 p-4 bg-gray-100 rounded-lg text-center">
                <p className="text-lg font-bold mb-2">اختر الأشياء باللون:</p>
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-8 h-8 rounded-full ${currentColorBg} border-2 border-gray-600`}></div>
                  <span className="text-xl font-bold">{currentColorName}</span>
                </div>
              </div>
            )}

            <div className="relative w-full h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg border-4 border-blue-300 overflow-hidden">
              {coloredItems.map(item => (
                <div
                  key={item.id}
                  className="absolute cursor-pointer transition-all duration-200 hover:scale-110"
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => handleItemClick(item)}
                >
                  <div className={`p-3 rounded-full border-4 border-gray-600
                    ${item.color === 'red' ? 'bg-red-400' : ''}
                    ${item.color === 'blue' ? 'bg-blue-400' : ''}
                    ${item.color === 'green' ? 'bg-green-400' : ''}
                    ${item.color === 'yellow' ? 'bg-yellow-400' : ''}
                    ${item.color === 'orange' ? 'bg-orange-400' : ''}
                    ${item.color === 'purple' ? 'bg-purple-400' : ''}
                    shadow-lg hover:shadow-xl transition-shadow`}>
                    <span className="text-2xl">{item.emoji}</span>
                  </div>
                </div>
              ))}
              {!gameActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="text-center text-white">
                    <Palette className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                    <p className="text-xl mb-2">اضغط على "ابدأ اللعبة" للبدء</p>
                    <p className="text-sm">اختر الأشياء باللون المطلوب!</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // الانتباه المشترك - شخصيات متحركة
  const JointAttentionGame = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [targetCharacter, setTargetCharacter] = useState("");
    const [gameActive, setGameActive] = useState(false);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);

    const characterData = [
      { name: "أحمد", color: "red", emoji: "👦" },
      { name: "فاطمة", color: "blue", emoji: "👧" },
      { name: "علي", color: "green", emoji: "🧒" },
      { name: "زينب", color: "purple", emoji: "👶" }
    ];

    const messages = [
      "أريد أن ألعب",
      "هل يمكنك مساعدتي؟",
      "أنا جائع",
      "أريد أن أذهب للحديقة",
      "هل نقرأ قصة؟",
      "أريد أن أرسم"
    ];

    const generateCharacters = () => {
      const newCharacters: Character[] = characterData.map((char, index) => ({
        id: char.name,
        name: char.name,
        x: 20 + (index * 20),
        y: 50 + Math.sin(index) * 20,
        color: char.color,
        emoji: char.emoji,
        hasMessage: false
      }));

      // اختيار شخصية عشوائية لتحمل الرسالة
      const randomIndex = Math.floor(Math.random() * newCharacters.length);
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      newCharacters[randomIndex].hasMessage = true;
      newCharacters[randomIndex].message = randomMessage;

      setCharacters(newCharacters);
      setTargetCharacter(newCharacters[randomIndex].name);
      setCurrentMessage(randomMessage);
    };

    const startJointGame = () => {
      setGameActive(true);
      setScore(0);
      setRound(1);
      generateCharacters();
      setTimeout(() => {
        speakArabic("اختر الشخصية التي تحمل الرسالة");
      }, 1000);
    };

    const handleCharacterClick = (character: Character) => {
      if (!gameActive) return;

      if (character.hasMessage) {
        setScore(prev => prev + 20);
        speakArabic(`ممتاز! ${character.name} يقول: ${character.message}`);

        setTimeout(() => {
          setRound(prev => prev + 1);
          generateCharacters();
          speakArabic("جولة جديدة! اختر الشخصية التي تحمل الرسالة");
        }, 2000);
      } else {
        setScore(prev => Math.max(0, prev - 10));
        speakArabic(`هذا ${character.name}، لكنه لا يحمل رسالة`);
      }
    };

    const endJointGame = () => {
      setGameActive(false);
      setCharacters([]);
      speakArabic(`انتهت اللعبة! أكملت ${round} جولات بنقاط ${score}`);
    };

    // تحريك الشخص��ات
    useEffect(() => {
      if (!gameActive) return;

      const animationInterval = setInterval(() => {
        setCharacters(prev => prev.map(char => ({
          ...char,
          y: char.y + Math.sin(Date.now() * 0.001 + char.x * 0.1) * 0.5
        })));
      }, 100);

      return () => clearInterval(animationInterval);
    }, [gameActive]);

    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <Button onClick={() => setCurrentGame("menu")} variant="outline">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للقائمة
          </Button>
          <h2 className="text-2xl font-bold text-center">الانتباه المشترك</h2>
          <div></div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6" />
              لعبة الشخصيات المتحركة
            </CardTitle>
            <CardDescription>
              اختر الشخصية التي تحمل الرسالة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4">
                <Badge variant="outline">النقاط: {score}</Badge>
                <Badge variant="outline">الجولة: {round}</Badge>
              </div>
              {!gameActive ? (
                <Button onClick={startJointGame} className="bg-purple-500 hover:bg-purple-600">
                  <Play className="w-4 h-4 ml-2" />
                  ابدأ اللعبة
                </Button>
              ) : (
                <Button onClick={endJointGame} variant="destructive">
                  <Pause className="w-4 h-4 ml-2" />
                  إيقاف
                </Button>
              )}
            </div>

            {gameActive && currentMessage && (
              <div className="mb-4 p-4 bg-yellow-100 rounded-lg text-center border-2 border-yellow-300">
                <p className="text-lg font-bold text-yellow-800">الرسالة: "{currentMessage}"</p>
                <p className="text-sm text-yellow-600 mt-1">اضغط على الشخصية التي تحمل هذه الرسالة</p>
              </div>
            )}

            <div className="relative w-full h-96 bg-gradient-to-br from-pink-100 to-yellow-100 rounded-lg border-4 border-pink-300 overflow-hidden">
              {characters.map(character => (
                <div
                  key={character.id}
                  className="absolute cursor-pointer transition-all duration-200 hover:scale-110"
                  style={{
                    left: `${character.x}%`,
                    top: `${character.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => handleCharacterClick(character)}
                >
                  <div className={`relative p-4 rounded-full border-4 border-gray-600 shadow-lg hover:shadow-xl transition-shadow
                    ${character.color === 'red' ? 'bg-red-200' : ''}
                    ${character.color === 'blue' ? 'bg-blue-200' : ''}
                    ${character.color === 'green' ? 'bg-green-200' : ''}
                    ${character.color === 'purple' ? 'bg-purple-200' : ''}
                    ${character.hasMessage ? 'animate-bounce' : ''}`}>
                    <span className="text-4xl">{character.emoji}</span>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700">
                      {character.name}
                    </div>
                    {character.hasMessage && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-xs">💬</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {!gameActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="text-center text-white">
                    <Users className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                    <p className="text-xl mb-2">اضغط على "ابدأ اللعبة" للبدء</p>
                    <p className="text-sm">اختر الشخصية التي تحمل الرسالة!</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // المهارات الأساسية - الألوان
  const ColorsSkillGame = () => {
    const [currentColor, setCurrentColor] = useState("");
    const [colorOptions, setColorOptions] = useState<string[]>([]);
    const [gameActive, setGameActive] = useState(false);
    const [score, setScore] = useState(0);
    const [question, setQuestion] = useState(1);

    const colorsData = [
      { name: "أحمر", value: "red", bg: "bg-red-500" },
      { name: "أزرق", value: "blue", bg: "bg-blue-500" },
      { name: "أخضر", value: "green", bg: "bg-green-500" },
      { name: "أصفر", value: "yellow", bg: "bg-yellow-500" },
      { name: "برتقالي", value: "orange", bg: "bg-orange-500" },
      { name: "بنفسجي", value: "purple", bg: "bg-purple-500" },
      { name: "وردي", value: "pink", bg: "bg-pink-500" },
      { name: "بني", value: "brown", bg: "bg-amber-700" }
    ];

    const generateColorQuestion = () => {
      const correctColor = colorsData[Math.floor(Math.random() * colorsData.length)];
      setCurrentColor(correctColor.value);

      // إنشاء خيارات (الصحيح + 3 خاطئة)
      const wrongOptions = colorsData.filter(c => c.value !== correctColor.value);
      const selectedWrong = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
      const allOptions = [correctColor, ...selectedWrong].sort(() => 0.5 - Math.random());

      setColorOptions(allOptions.map(c => c.value));
      speakArabic(`اختر اللون ${correctColor.name}`);
    };

    const startColorsGame = () => {
      setGameActive(true);
      setScore(0);
      setQuestion(1);
      generateColorQuestion();
    };

    const handleColorClick = (selectedColor: string) => {
      if (!gameActive) return;

      if (selectedColor === currentColor) {
        setScore(prev => prev + 10);
        speakArabic("ممتاز!");

        if (question < 10) {
          setQuestion(prev => prev + 1);
          setTimeout(generateColorQuestion, 1000);
        } else {
          endColorsGame();
        }
      } else {
        setScore(prev => Math.max(0, prev - 5));
        speakArabic("حاول مرة أخرى");
      }
    };

    const endColorsGame = () => {
      setGameActive(false);
      speakArabic(`انتهت اللعبة! نقاطك ${score} من ${question * 10}`);
    };

    const getCurrentColorName = () => {
      return colorsData.find(c => c.value === currentColor)?.name || "";
    };

    const getColorBg = (color: string) => {
      return colorsData.find(c => c.value === color)?.bg || "";
    };

    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <Button onClick={() => setCurrentGame("menu")} variant="outline">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للقائمة
          </Button>
          <h2 className="text-2xl font-bold text-center">تع��م الألوان</h2>
          <div></div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-6 h-6" />
              اختبار الألوان
            </CardTitle>
            <CardDescription>
              اختر اللون الصحيح
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4">
                <Badge variant="outline">النقاط: {score}</Badge>
                <Badge variant="outline">السؤال: {question}/10</Badge>
              </div>
              {!gameActive ? (
                <Button onClick={startColorsGame} className="bg-red-500 hover:bg-red-600">
                  <Play className="w-4 h-4 ml-2" />
                  ابدأ الاختبار
                </Button>
              ) : (
                <Button onClick={endColorsGame} variant="destructive">
                  <Pause className="w-4 h-4 ml-2" />
                  إيقاف
                </Button>
              )}
            </div>

            {gameActive && currentColor && (
              <div className="text-center space-y-6">
                <div className="p-6 bg-gray-100 rounded-lg">
                  <p className="text-2xl font-bold mb-4">اختر اللون: {getCurrentColorName()}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {colorOptions.map((color, index) => (
                    <Button
                      key={index}
                      onClick={() => handleColorClick(color)}
                      className={`h-24 w-full ${getColorBg(color)} hover:scale-105 transition-transform border-4 border-gray-600`}
                      variant="outline"
                    >
                      <div className="w-full h-full rounded-lg"></div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {!gameActive && (
              <div className="text-center py-12">
                <Palette className="w-16 h-16 mx-auto mb-4 text-red-400" />
                <p className="text-xl mb-2">اضغط على "ابدأ الاختبار" للبدء</p>
                <p className="text-sm text-gray-600">اختر اللون الصحيح من الخيارات!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  // المهارات الأساسية - الأرقام
  const NumbersSkillGame = () => {
    const [currentNumber, setCurrentNumber] = useState(0);
    const [numberOptions, setNumberOptions] = useState<number[]>([]);
    const [gameActive, setGameActive] = useState(false);
    const [score, setScore] = useState(0);
    const [question, setQuestion] = useState(1);

    const generateNumberQuestion = () => {
      const correctNumber = Math.floor(Math.random() * 10) + 1; // 1-10
      setCurrentNumber(correctNumber);

      // إنشاء خيارات (الصحيح + 3 خاطئة)
      const wrongOptions = [];
      while (wrongOptions.length < 3) {
        const wrongNum = Math.floor(Math.random() * 10) + 1;
        if (wrongNum !== correctNumber && !wrongOptions.includes(wrongNum)) {
          wrongOptions.push(wrongNum);
        }
      }

      const allOptions = [correctNumber, ...wrongOptions].sort(() => 0.5 - Math.random());
      setNumberOptions(allOptions);
      speakArabic(`اختر الرقم ${correctNumber}`);
    };

    const startNumbersGame = () => {
      setGameActive(true);
      setScore(0);
      setQuestion(1);
      generateNumberQuestion();
    };

    const handleNumberClick = (selectedNumber: number) => {
      if (!gameActive) return;

      if (selectedNumber === currentNumber) {
        setScore(prev => prev + 10);
        speakArabic("ممتاز!");

        if (question < 10) {
          setQuestion(prev => prev + 1);
          setTimeout(generateNumberQuestion, 1000);
        } else {
          endNumbersGame();
        }
      } else {
        setScore(prev => Math.max(0, prev - 5));
        speakArabic("حاول مرة أخرى");
      }
    };

    const endNumbersGame = () => {
      setGameActive(false);
      speakArabic(`انتهت اللعبة! نقاطك ${score} من ${question * 10}`);
    };

    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <Button onClick={() => setCurrentGame("menu")} variant="outline">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للقائمة
          </Button>
          <h2 className="text-2xl font-bold text-center">تعل�� الأرقام</h2>
          <div></div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-6 h-6" />
              اختبار الأرقام
            </CardTitle>
            <CardDescription>
              اختر الرقم الصحيح
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4">
                <Badge variant="outline">النقاط: {score}</Badge>
                <Badge variant="outline">السؤال: {question}/10</Badge>
              </div>
              {!gameActive ? (
                <Button onClick={startNumbersGame} className="bg-blue-500 hover:bg-blue-600">
                  <Play className="w-4 h-4 ml-2" />
                  ابدأ الاختبار
                </Button>
              ) : (
                <Button onClick={endNumbersGame} variant="destructive">
                  <Pause className="w-4 h-4 ml-2" />
                  إيقاف
                </Button>
              )}
            </div>

            {gameActive && currentNumber && (
              <div className="text-center space-y-6">
                <div className="p-6 bg-gray-100 rounded-lg">
                  <p className="text-2xl font-bold mb-4">اختر الرقم: {currentNumber}</p>
                  <div className="flex justify-center">
                    {[...Array(currentNumber)].map((_, i) => (
                      <Circle key={i} className="w-6 h-6 text-blue-500 fill-blue-500 mx-1" />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {numberOptions.map((number, index) => (
                    <Button
                      key={index}
                      onClick={() => handleNumberClick(number)}
                      className="h-20 text-3xl font-bold bg-blue-100 hover:bg-blue-200 text-blue-800 border-4 border-blue-300 hover:scale-105 transition-transform"
                      variant="outline"
                    >
                      {number}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {!gameActive && (
              <div className="text-center py-12">
                <Hash className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <p className="text-xl mb-2">اضغط على "ابدأ الاختبار" للبدء</p>
                <p className="text-sm text-gray-600">اختر الرقم الصحيح!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  // المهارات الأساسية - المفاهيم المكانية
  const SpatialSkillGame = () => {
    const [currentDirection, setCurrentDirection] = useState("");
    const [gameActive, setGameActive] = useState(false);
    const [score, setScore] = useState(0);
    const [question, setQuestion] = useState(1);
    const [objectPosition, setObjectPosition] = useState("");

    const directions = [
      { name: "فوق", value: "top", position: "top-4" },
      { name: "تحت", value: "bottom", position: "bottom-4" },
      { name: "يمين", value: "right", position: "right-4" },
      { name: "يسار", value: "left", position: "left-4" }
    ];

    const generateSpatialQuestion = () => {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      setCurrentDirection(direction.value);
      setObjectPosition(direction.position);
      speakArabic(`أين الكرة؟ الكرة ${direction.name} الصندوق`);
    };

    const startSpatialGame = () => {
      setGameActive(true);
      setScore(0);
      setQuestion(1);
      generateSpatialQuestion();
    };

    const handleDirectionClick = (selectedDirection: string) => {
      if (!gameActive) return;

      if (selectedDirection === currentDirection) {
        setScore(prev => prev + 10);
        speakArabic("ممتاز!");

        if (question < 8) {
          setQuestion(prev => prev + 1);
          setTimeout(generateSpatialQuestion, 1000);
        } else {
          endSpatialGame();
        }
      } else {
        setScore(prev => Math.max(0, prev - 5));
        speakArabic("حاول مرة أخرى");
      }
    };

    const endSpatialGame = () => {
      setGameActive(false);
      speakArabic(`انتهت اللعبة! نقاطك ${score} من ${question * 10}`);
    };

    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <Button onClick={() => setCurrentGame("menu")} variant="outline">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للقائمة
          </Button>
          <h2 className="text-2xl font-bold text-center">المفاهيم المكانية</h2>
          <div></div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              اختبار المفاهيم المكانية
            </CardTitle>
            <CardDescription>
              حدد موقع الكرة بالنسبة للصندوق
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4">
                <Badge variant="outline">النقاط: {score}</Badge>
                <Badge variant="outline">السؤال: {question}/8</Badge>
              </div>
              {!gameActive ? (
                <Button onClick={startSpatialGame} className="bg-green-500 hover:bg-green-600">
                  <Play className="w-4 h-4 ml-2" />
                  ابدأ الاختبار
                </Button>
              ) : (
                <Button onClick={endSpatialGame} variant="destructive">
                  <Pause className="w-4 h-4 ml-2" />
                  إيقاف
                </Button>
              )}
            </div>

            {gameActive && currentDirection && (
              <div className="text-center space-y-6">
                <div className="p-6 bg-gray-100 rounded-lg">
                  <p className="text-xl font-bold mb-6">أين الكرة؟</p>

                  <div className="relative w-48 h-48 mx-auto">
                    {/* الصندوق */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 bg-amber-600 rounded-lg border-4 border-amber-800 shadow-lg flex items-center justify-center">
                        <span className="text-2xl">📦</span>
                      </div>
                    </div>

                    {/* الكرة */}
                    <div className={`absolute ${objectPosition} left-1/2 transform -translate-x-1/2 ${currentDirection === 'left' || currentDirection === 'right' ? '-translate-y-1/2 top-1/2' : ''}`}>
                      <div className="w-12 h-12 bg-red-500 rounded-full border-4 border-red-700 shadow-lg flex items-center justify-center">
                        <span className="text-lg">⚽</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {directions.map((direction, index) => (
                    <Button
                      key={index}
                      onClick={() => handleDirectionClick(direction.value)}
                      className="h-16 text-xl font-bold bg-green-100 hover:bg-green-200 text-green-800 border-4 border-green-300 hover:scale-105 transition-transform"
                      variant="outline"
                    >
                      {direction.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {!gameActive && (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-green-400" />
                <p className="text-xl mb-2">اضغط على "ابدأ الاختبار" للبدء</p>
                <p className="text-sm text-gray-600">حدد موقع الكرة بالنسبة للصندوق!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  // المهارات الأساسية - أجزاء الجسم
  const BodyPartsSkillGame = () => {
    const [currentBodyPart, setCurrentBodyPart] = useState("");
    const [gameActive, setGameActive] = useState(false);
    const [score, setScore] = useState(0);
    const [question, setQuestion] = useState(1);

    const bodyParts = [
      { name: "رأس", value: "head", position: "top-4" },
      { name: "عين", value: "eye", position: "top-12" },
      { name: "أنف", value: "nose", position: "top-16" },
      { name: "فم", value: "mouth", position: "top-20" },
      { name: "يد", value: "hand", position: "top-32" },
      { name: "قدم", value: "foot", position: "bottom-8" }
    ];

    const generateBodyPartQuestion = () => {
      const bodyPart = bodyParts[Math.floor(Math.random() * bodyParts.length)];
      setCurrentBodyPart(bodyPart.value);
      speakArabic(`أين ${bodyPart.name}؟`);
    };

    const startBodyPartsGame = () => {
      setGameActive(true);
      setScore(0);
      setQuestion(1);
      generateBodyPartQuestion();
    };

    const handleBodyPartClick = (selectedPart: string) => {
      if (!gameActive) return;

      if (selectedPart === currentBodyPart) {
        setScore(prev => prev + 10);
        speakArabic("ممتاز!");

        if (question < 6) {
          setQuestion(prev => prev + 1);
          setTimeout(generateBodyPartQuestion, 1000);
        } else {
          endBodyPartsGame();
        }
      } else {
        setScore(prev => Math.max(0, prev - 5));
        speakArabic("حاول مرة أخرى");
      }
    };

    const endBodyPartsGame = () => {
      setGameActive(false);
      speakArabic(`انتهت اللعبة! نقاطك ${score} من ${question * 10}`);
    };

    const getCurrentBodyPartName = () => {
      return bodyParts.find(p => p.value === currentBodyPart)?.name || "";
    };

    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <Button onClick={() => setCurrentGame("menu")} variant="outline">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للقائمة
          </Button>
          <h2 className="text-2xl font-bold text-center">أجزاء الجسم</h2>
          <div></div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-6 h-6" />
              اختبار أجزاء الجسم
            </CardTitle>
            <CardDescription>
              اضغط على الجزء الصحيح من الجسم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4">
                <Badge variant="outline">النقاط: {score}</Badge>
                <Badge variant="outline">السؤال: {question}/6</Badge>
              </div>
              {!gameActive ? (
                <Button onClick={startBodyPartsGame} className="bg-purple-500 hover:bg-purple-600">
                  <Play className="w-4 h-4 ml-2" />
                  ابدأ الاختبار
                </Button>
              ) : (
                <Button onClick={endBodyPartsGame} variant="destructive">
                  <Pause className="w-4 h-4 ml-2" />
                  إيقاف
                </Button>
              )}
            </div>

            {gameActive && currentBodyPart && (
              <div className="text-center space-y-6">
                <div className="p-6 bg-gray-100 rounded-lg">
                  <p className="text-2xl font-bold mb-4">أين {getCurrentBodyPartName()}؟</p>
                </div>

                <div className="relative w-64 h-96 mx-auto bg-gradient-to-b from-pink-100 to-blue-100 rounded-3xl border-4 border-gray-400">
                  {/* الرأس */}
                  <button
                    onClick={() => handleBodyPartClick("head")}
                    className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-yellow-300 rounded-full border-4 border-yellow-600 hover:scale-110 transition-transform"
                  >
                    <span className="text-2xl">👤</span>
                  </button>

                  {/* العين */}
                  <button
                    onClick={() => handleBodyPartClick("eye")}
                    className="absolute top-12 left-1/2 transform -translate-x-1/2 translate-x-2 w-6 h-6 bg-blue-400 rounded-full border-2 border-blue-600 hover:scale-110 transition-transform"
                  >
                    <span className="text-xs">👁️</span>
                  </button>

                  {/* الأنف */}
                  <button
                    onClick={() => handleBodyPartClick("nose")}
                    className="absolute top-16 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-pink-400 rounded border-2 border-pink-600 hover:scale-110 transition-transform"
                  >
                    <span className="text-xs">👃</span>
                  </button>

                  {/* الفم */}
                  <button
                    onClick={() => handleBodyPartClick("mouth")}
                    className="absolute top-20 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-red-400 rounded-full border-2 border-red-600 hover:scale-110 transition-transform"
                  >
                    <span className="text-xs">👄</span>
                  </button>

                  {/* اليد */}
                  <button
                    onClick={() => handleBodyPartClick("hand")}
                    className="absolute top-32 right-4 w-12 h-12 bg-orange-300 rounded-full border-4 border-orange-600 hover:scale-110 transition-transform"
                  >
                    <span className="text-lg">✋</span>
                  </button>

                  {/* القدم */}
                  <button
                    onClick={() => handleBodyPartClick("foot")}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-brown-400 rounded-lg border-4 border-amber-700 hover:scale-110 transition-transform"
                  >
                    <span className="text-lg">🦶</span>
                  </button>
                </div>
              </div>
            )}

            {!gameActive && (
              <div className="text-center py-12">
                <User className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                <p className="text-xl mb-2">اضغط على "ابدأ الاختبار" للبدء</p>
                <p className="text-sm text-gray-600">اضغط على الجزء الصحيح من الجسم!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  // القائمة الرئيسية
  const MainMenu = () => (
    <div className="space-y-8" dir="rtl">
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold mb-2">تمارين الانتباه والمهارات الأساسية</CardTitle>
          <p className="text-blue-100">برنامج شامل لتطوير مهارات الانتباه والمهارات الأساسية</p>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* تمارين الانتباه */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentGame("sustained-attention")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold">الانتباه المتواصل</h3>
                <p className="text-gray-600 text-sm">نجوم متساقطة</p>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-600 mb-4">
              <p>• تطوير التركيز المستمر</p>
              <p>• تحسين الانتباه الانتقائي</p>
              <p>• تعزيز سرعة الاستجابة</p>
            </div>
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ التمرين
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentGame("selective-attention")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Palette className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold">الانتباه الانتقائي</h3>
                <p className="text-gray-600 text-sm">اختيار الألوان</p>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-600 mb-4">
              <p>• تطوير الانتباه الانتقائي</p>
              <p>• تحسين التمييز البصري</p>
              <p>• تعزيز التركيز</p>
            </div>
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ التمرين
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentGame("joint-attention")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold">الانتباه المشترك</h3>
                <p className="text-gray-600 text-sm">شخصيات متحركة</p>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-600 mb-4">
              <p>• تطوير الانتباه المشترك</p>
              <p>• تحسين التفاعل الاجتماعي</p>
              <p>• تعزيز التواصل</p>
            </div>
            <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ التمرين
            </Button>
          </CardContent>
        </Card>

        {/* المهارات الأساسية */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentGame("colors-skill")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <Palette className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold">تعلم الألوان</h3>
                <p className="text-gray-600 text-sm">المهارات الأساسية</p>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-600 mb-4">
              <p>• تعلم أسماء الألوان</p>
              <p>• تطوير التمييز اللوني</p>
              <p>• تحسين المفردات</p>
            </div>
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ التمرين
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentGame("numbers-skill")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Hash className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold">تعلم الأرقام</h3>
                <p className="text-gray-600 text-sm">المهارات الأساسية</p>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-600 mb-4">
              <p>• تعلم الأرقام 1-10</p>
              <p>• تطوير مهارات العد</p>
              <p>• تحسين الذاكرة العددية</p>
            </div>
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ التمرين
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentGame("spatial-skill")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold">المفاهيم المكانية</h3>
                <p className="text-gray-600 text-sm">المهارات الأساسية</p>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-600 mb-4">
              <p>• تعلم الاتجاهات</p>
              <p>• تطوير الوعي المكاني</p>
              <p>• تحسين الإدراك البصري</p>
            </div>
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ التمرين
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentGame("body-parts-skill")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <User className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold">أجزاء الجسم</h3>
                <p className="text-gray-600 text-sm">المهارات الأساسية</p>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-600 mb-4">
              <p>• تعلم أجزاء الجسم</p>
              <p>• تطوير الوعي الجسدي</p>
              <p>• تحسين المفردات</p>
            </div>
            <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
              <Play className="w-4 h-4 ml-2" />
              ابدأ التمرين
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Instructions Section */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Circle className="w-5 h-5" />
            إرشادات التمارين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-gray-800">أهداف التمارين:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• تطوير أنواع مختلفة من الانتباه</li>
                <li>• تحسين التركيز والتحكم المعرفي</li>
                <li>• ��يادة مدة الانتباه وجودته</li>
                <li>• تعلم المهارات الأساسية</li>
                <li>• تعزيز المعالجة البصرية والسمعية</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-800">نصائح للحصول على أفضل النتائج:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• تأكد من بيئة هادئة وخالية من المشتتات</li>
                <li>• ابدأ بالمستويات السهلة وارتق تدريجياً</li>
                <li>• خذ استراحات منتظمة لتجنب التعب</li>
                <li>• مارس التمارين بانتظام للحصول على تحسن مستمر</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCurrentGame = () => {
    switch (currentGame) {
      case "sustained-attention":
        return <SustainedAttentionGame />;
      case "selective-attention":
        return <SelectiveAttentionGame />;
      case "joint-attention":
        return <JointAttentionGame />;
      case "colors-skill":
        return <ColorsSkillGame />;
      case "numbers-skill":
        return <NumbersSkillGame />;
      case "spatial-skill":
        return <SpatialSkillGame />;
      case "body-parts-skill":
        return <BodyPartsSkillGame />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Button
              onClick={() => navigate('/specialist-dashboard')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              العودة للوحة التحكم
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">تمارين الانتباه والمهارات الأساسية</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline">النقاط الإجمالية: {gameSession.score}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentGame()}
      </div>
    </div>
  );
}
