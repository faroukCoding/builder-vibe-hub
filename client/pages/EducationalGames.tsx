import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EducationalGame } from "@shared/api";
import { AlertCircle, Gamepad2, Loader2, Play } from "lucide-react";

const EducationalGames = () => {
  const [games, setGames] = useState<EducationalGame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/educational-games');
        if (!response.ok) {
          throw new Error('فشل في جلب بيانات الألعاب.');
        }
        const data: EducationalGame[] = await response.json();
        setGames(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2">جاري تحميل الألعاب...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <AlertCircle className="h-8 w-8" />
        <p className="ml-2">خطأ: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-500 to-green-500 bg-clip-text text-transparent">الألعاب التعليمية</h1>
            <p className="text-gray-600 mt-2">مجموعة من الألعاب التفاعلية لتقوية النطق والتركيز بطريقة ممتعة.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => (
            <Card key={game.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="bg-lime-100 p-3 rounded-full">
                        <Gamepad2 className="w-6 h-6 text-lime-600" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-semibold text-gray-800">{game.name}</CardTitle>
                        <Badge className="mt-1 bg-lime-100 text-lime-800">{game.ageGroup}</Badge>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{game.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-lime-500 hover:bg-lime-600 text-white"
                  onClick={() => navigate(`/educational-games/${game.id}`)}
                >
                    <Play className="w-4 h-4 ml-2" />
                    ابدأ اللعبة
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationalGames;
