import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface Game {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  icon: string;
}

export default function EducationalGames() {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/educational-games');
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/parent-dashboard')}
            className="ml-4"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">الألعاب التعليمية</h1>
            <p className="text-gray-500">مجموعة من الألعاب الممتعة والهادفة</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <p>جاري تحميل الألعاب...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card key={game.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>{game.title}</CardTitle>
                  <div className="text-3xl">{game.icon}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{game.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge>{game.difficulty}</Badge>
                    <Button size="sm">
                      <Gamepad2 className="w-4 h-4 ml-2" />
                      ابدأ اللعبة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
