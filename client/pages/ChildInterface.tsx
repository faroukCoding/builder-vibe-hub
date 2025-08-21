import { 
  Star, 
  Play, 
  Heart, 
  Gift, 
  Volume2, 
  ArrowLeft,
  Sparkles,
  GamepadIcon,
  Trophy,
  Mic,
  Baby,
  Smile,
  Music
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ChildInterface() {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: 1,
      title: "حديقة الحروف",
      description: "تعلم نطق الحروف مع الحيوانات",
      icon: "🦁",
      difficulty: "سهل",
      stars: 3,
      color: "from-green-400 to-green-500"
    },
    {
      id: 2,
      title: "عالم الأصوات",
      description: "اكتشف أصوات الطبيعة والأشياء",
      icon: "🎵",
      difficulty: "متوسط",
      stars: 4,
      color: "from-blue-400 to-blue-500"
    },
    {
      id: 3,
      title: "مغامرة الكلمات",
      description: "اجمع الكلمات وكون جملاً جميلة",
      icon: "✨",
      difficulty: "متقدم",
      stars: 5,
      color: "from-purple-400 to-purple-500"
    },
    {
      id: 4,
      title: "قطار الحروف",
      description: "رتب الحروف لتكوين كلمات ممتعة",
      icon: "🚂",
      difficulty: "سهل",
      stars: 2,
      color: "from-yellow-400 to-orange-500"
    },
    {
      id: 5,
      title: "بيت الأصوات",
      description: "تدرب على نطق الأصوات المختلفة",
      icon: "🏠",
      difficulty: "متوسط",
      stars: 4,
      color: "from-pink-400 to-pink-500"
    },
    {
      id: 6,
      title: "سفينة التقليد",
      description: "قلد الأصوات والحركات",
      icon: "⛵",
      difficulty: "سهل",
      stars: 3,
      color: "from-cyan-400 to-blue-500"
    }
  ];

  const achievements = [
    { title: "نجمة الحروف", earned: true, icon: "⭐" },
    { title: "بطل الأصوات", earned: true, icon: "🏆" },
    { title: "ملك الكلمات", earned: false, icon: "👑" },
    { title: "ساحر النطق", earned: false, icon: "🎭" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100" dir="rtl">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 bg-white/60"
              >
                <ArrowLeft className="w-4 h-4" />
                العودة
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-3 rounded-2xl">
                  <Baby className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    عالم المرح والتعلم
                  </h1>
                  <p className="text-text-secondary">مرحباً أيها البطل الصغير! 🌟</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/60 rounded-2xl px-4 py-2 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-purple-600">240</span>
                <span className="text-sm text-gray-600">نقطة</span>
              </div>
              <div className="bg-white/60 rounded-2xl px-4 py-2 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="font-bold text-purple-600">12</span>
                <span className="text-sm text-gray-600">نجمة</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Message */}
            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">أهلاً وسهلاً يا بطل! 🎉</h2>
                    <p className="text-purple-100 text-lg mb-4">
                      هيا نتعلم ونلعب معاً لنصبح أبطال النطق الخارقين!
                    </p>
                    <div className="flex items-center gap-4">
                      <Button 
                        className="bg-white text-purple-600 hover:bg-gray-100 font-bold"
                        size="lg"
                      >
                        <Play className="w-5 h-5 ml-2" />
                        ابدأ اللعب الآن
                      </Button>
                      <div className="text-purple-100">
                        <p className="text-sm">التقدم اليومي</p>
                        <Progress value={65} className="w-32 mt-1" />
                      </div>
                    </div>
                  </div>
                  <div className="text-6xl">🚀</div>
                </div>
              </CardContent>
            </Card>

            {/* Games Grid */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <GamepadIcon className="w-8 h-8 text-purple-600" />
                <h3 className="text-2xl font-bold text-gray-800">ألعابنا الممتعة</h3>
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {games.map((game) => (
                  <Card 
                    key={game.id} 
                    className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:scale-105 cursor-pointer overflow-hidden"
                    onClick={() => setSelectedGame(game)}
                  >
                    <div className={`h-32 bg-gradient-to-br ${game.color} flex items-center justify-center relative`}>
                      <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                        {game.icon}
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white/20 text-white border-0">
                          {game.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold text-lg text-gray-800 mb-2">{game.title}</h4>
                      <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < game.stars 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white rounded-full">
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Activities */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Music className="w-6 h-6 text-blue-500" />
                  أنشطة سريعة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
                  >
                    <Volume2 className="w-6 h-6 text-blue-500" />
                    <span className="text-sm font-medium">تسجيل صوتي</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2 border-2 border-green-200 hover:border-green-400 hover:bg-green-50"
                  >
                    <Mic className="w-6 h-6 text-green-500" />
                    <span className="text-sm font-medium">تمرين النطق</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50"
                  >
                    <Smile className="w-6 h-6 text-purple-500" />
                    <span className="text-sm font-medium">تمارين الوجه</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-b from-yellow-50 to-orange-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  تقدمك اليوم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>الألعاب المكتملة</span>
                      <span>3/5</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>التمارين اليومية</span>
                      <span>4/6</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div className="bg-yellow-100 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">🎯</div>
                    <p className="text-sm font-medium text-yellow-800">
                      لعبة واحدة للوصول للهدف!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-0 shadow-lg bg-gradient-to-b from-purple-50 to-pink-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-600" />
                  إنجازاتي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-3 p-2 rounded-lg ${
                        achievement.earned 
                          ? 'bg-purple-100 border border-purple-200' 
                          : 'bg-gray-100 opacity-50'
                      }`}
                    >
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <p className={`text-sm font-medium ${
                          achievement.earned ? 'text-purple-800' : 'text-gray-600'
                        }`}>
                          {achievement.title}
                        </p>
                        {achievement.earned && (
                          <p className="text-xs text-purple-600">مكتسب! 🎉</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Motivation Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-b from-green-50 to-blue-50">
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-3">🌟</div>
                <h4 className="font-bold text-green-800 mb-2">أنت رائع!</h4>
                <p className="text-sm text-green-700 mb-3">
                  استمر في التعلم واللعب لتصبح بطل النطق الخارق!
                </p>
                <Button 
                  size="sm" 
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full"
                >
                  <Heart className="w-4 h-4 ml-1" />
                  شكراً
                </Button>
              </CardContent>
            </Card>

            {/* Rewards */}
            <Card className="border-0 shadow-lg bg-gradient-to-b from-pink-50 to-purple-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gift className="w-5 h-5 text-pink-600" />
                  جوائزي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl mb-2">🎁</div>
                  <p className="text-sm text-gray-600 mb-3">
                    اجمع 50 نجمة أخرى للحصول على جائزة رائعة!
                  </p>
                  <Progress value={24} className="mb-2" />
                  <p className="text-xs text-gray-500">12/50 نجمة</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Game Modal (when a game is selected) */}
      {selectedGame && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedGame(null)}>
          <Card className="max-w-md mx-4 border-0 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className={`h-32 bg-gradient-to-br ${selectedGame.color} flex items-center justify-center relative`}>
              <div className="text-6xl">{selectedGame.icon}</div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 left-2 text-white hover:bg-white/20"
                onClick={() => setSelectedGame(null)}
              >
                ✕
              </Button>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">{selectedGame.title}</h3>
              <p className="text-gray-600 mb-4">{selectedGame.description}</p>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline">{selectedGame.difficulty}</Badge>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < selectedGame.stars 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
              </div>
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                <Play className="w-4 h-4 ml-2" />
                ابدأ اللعبة
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
