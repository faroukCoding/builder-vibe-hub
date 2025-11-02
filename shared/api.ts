/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// ===============================================
//           SMART DASHBOARD API TYPES
// ===============================================

// Types for Daily Training
export interface TrainingExerciseDetails {
  description: string;
  media: {
    type: 'audio' | 'video';
    url: string;
  };
  aiAnalysis: string;
  nextRecommendation: string;
}

export interface DailyExercise {
  id: string;
  name: string;
  difficulty: 'سهل' | 'متوسط' | 'صعب';
  progress: number;
  details: TrainingExerciseDetails;
}

// Types for Educational Games
export interface EducationalGame {
  id: string;
  name: string;
  description: string;
  ageGroup: string;
}

// Types for Smart Assistant
export interface SmartAssistantRequest {
  message: string;
}

export interface SmartAssistantResponse {
  reply: string;
}
