import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2, AlertCircle, CheckCircle, XCircle, Volume2 } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

// Define the structure of the game details
interface GameItem {
    sound: string;
    image: string;
    answer: string;
    options: string[]; // Added for multiple choice
}
interface Game {
    id: string;
    name:string;
    description: string;
    ageGroup: string;
    content: {
        type: string;
        instructions: string;
        items: GameItem[];
    };
}

const fetchGameDetails = async (id: string | undefined): Promise<Game> => {
    if (!id) throw new Error('Game ID is required');
    const { data } = await axios.get(`/api/educational-games/${id}`);
    return data;
};


const GamePage = () => {
    const { id } = useParams<{ id: string }>();
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const { data: game, isLoading, isError, error } = useQuery<Game, Error>({
        queryKey: ['gameDetails', id],
        queryFn: () => fetchGameDetails(id),
    });

    const handleAnswer = (option: string) => {
        if (selectedAnswer) return; // Prevent answering twice

        setSelectedAnswer(option);
        const correct = option === game?.content.items[currentItemIndex].answer;
        setIsCorrect(correct);
    };

    const handleNext = () => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        setCurrentItemIndex(prev => prev + 1);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }
    if (isError) {
        return <div className="flex justify-center items-center h-screen text-red-500"><AlertCircle className="h-8 w-8" /> {error.message}</div>;
    }
    if (!game) {
        return <div>اللعبة غير موجودة</div>
    }

    const currentItem = game.content.items[currentItemIndex];
    const isFinished = currentItemIndex >= game.content.items.length;

    return (
        <div className="p-6 max-w-2xl mx-auto mt-10 text-center" dir="rtl">
            <h1 className="text-3xl font-bold mb-2">{game.name}</h1>

            {isFinished ? (
                <div className="p-8 bg-green-100 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-green-800">أحسنت! لقد أكملت اللعبة بنجاح!</h2>
                    <Button onClick={() => setCurrentItemIndex(0)} className="mt-4">إعادة اللعبة</Button>
                </div>
            ) : (
                <div className="p-8 bg-white rounded-lg shadow-lg">
                    <p className="text-lg text-gray-600 mb-6">{game.content.instructions}</p>
                    <div className="mb-6">
                        <Button variant="outline">
                            <Volume2 className="w-6 h-6 mr-2" />
                            استمع للصوت
                        </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {currentItem.options.map(option => (
                            <Button
                                key={option}
                                onClick={() => handleAnswer(option)}
                                disabled={!!selectedAnswer}
                                className={`p-4 h-24 text-lg ${selectedAnswer && option === currentItem.answer ? 'bg-green-500' : ''} ${selectedAnswer && option !== currentItem.answer && option === selectedAnswer ? 'bg-red-500' : ''}`}
                            >
                                {option}
                            </Button>
                        ))}
                    </div>

                    {isCorrect === true && <div className="text-green-600 flex items-center justify-center"><CheckCircle/> إجابة صحيحة!</div>}
                    {isCorrect === false && <div className="text-red-600 flex items-center justify-center"><XCircle/> حاول مرة أخرى. الإجابة الصحيحة هي: {currentItem.answer}</div>}

                    {selectedAnswer && <Button onClick={handleNext} className="mt-6">التالي</Button>}
                </div>
            )}
        </div>
    );
};

export default GamePage;
