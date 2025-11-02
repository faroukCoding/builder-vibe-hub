import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Define the structure of the exercise details
interface ExerciseDetails {
    description: string;
    media: {
        type: string;
        url: string;
    };
    aiAnalysis: string;
    nextRecommendation: string;
}

const fetchExerciseDetails = async (id: string | undefined): Promise<ExerciseDetails> => {
    if (!id) throw new Error('Exercise ID is required');
    const { data } = await axios.get(`/api/daily-training/${id}`);
    return data;
};

const ExerciseDetailsPage = () => {
    const { id } = useParams<{ id: string }>();

    const { data: exerciseDetails, isLoading, isError, error } = useQuery<ExerciseDetails, Error>({
        queryKey: ['exerciseDetails', id],
        queryFn: () => fetchExerciseDetails(id),
    });

    if (isLoading) {
        return <div className="p-4">تحميل تفاصيل التمرين...</div>;
    }

    if (isError) {
        return <div className="p-4 text-red-500">حدث خطأ: {error.message}</div>;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4 text-blue-800">تفاصيل التمرين</h1>
            {exerciseDetails && (
                <div>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">الوصف</h2>
                        <p>{exerciseDetails.description}</p>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">التحليل الذكي</h2>
                        <p className="text-gray-700">{exerciseDetails.aiAnalysis}</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">التوصية التالية</h2>
                        <p className="text-green-600">{exerciseDetails.nextRecommendation}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExerciseDetailsPage;
