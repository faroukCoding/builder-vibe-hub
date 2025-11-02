import { RequestHandler } from "express";
import {
  attachExerciseMedia,
  getDailyTraining,
  getDailyTrainingExercise,
  updateExerciseProgress,
} from "../services/homeFollowUpStore";

const DEFAULT_PARENT_ID = "parent-1";

export const handleGetDailyTraining: RequestHandler = async (req, res) => {
  try {
    const parentId = (req.query.parentId as string) || DEFAULT_PARENT_ID;
    const data = await getDailyTraining(parentId);

    res.json({
      parentId,
      retrievedAt: new Date().toISOString(),
      summary: data.summary,
      exercises: data.exercises.map((exercise) => ({
        id: exercise.id,
        title: exercise.title,
        stage: exercise.stage,
        focusArea: exercise.focusArea,
        difficulty: exercise.difficulty,
        progress: exercise.progress,
        attempts: exercise.attempts,
        streak: exercise.streak,
        scheduledAt: exercise.scheduledAt,
        metrics: exercise.metrics,
        goal: exercise.goal,
        aiSummary: exercise.aiSummary,
        aiNextSteps: exercise.aiNextSteps,
        reminders: exercise.reminders,
        resources: exercise.resources,
      })),
    });
  } catch (error) {
    res.status(500).json({
      error: "فشل في تحميل بيانات التدريب اليومي",
      details: (error as Error).message,
    });
  }
};

export const handleGetDailyTrainingExercise: RequestHandler = async (req, res) => {
  try {
    const parentId = (req.query.parentId as string) || DEFAULT_PARENT_ID;
    const { exerciseId } = req.params;

    const exercise = await getDailyTrainingExercise(parentId, exerciseId);

    if (!exercise) {
      return res.status(404).json({ error: "التمرين غير موجود" });
    }

    res.json({
      parentId,
      retrievedAt: new Date().toISOString(),
      exercise,
      relatedExercises: exercise.recommendedNextExercises,
    });
  } catch (error) {
    res.status(500).json({
      error: "فشل في تحميل تفاصيل التمرين",
      details: (error as Error).message,
    });
  }
};

export const handleUpdateDailyTrainingProgress: RequestHandler = async (req, res) => {
  try {
    const parentId = (req.query.parentId as string) || DEFAULT_PARENT_ID;
    const { exerciseId } = req.params;
    const { progressDelta, accuracy, clarity, fluency, comprehension, notes, sharingTargets } =
      req.body ?? {};

    const updatedExercise = await updateExerciseProgress(parentId, exerciseId, {
      progressDelta,
      accuracy,
      clarity,
      fluency,
      comprehension,
      notes,
      sharingTargets,
    });

    res.json({
      message: "تم تحديث التقدم بنجاح",
      exercise: updatedExercise,
    });
  } catch (error) {
    res.status(500).json({
      error: "تعذر تحديث التقدم",
      details: (error as Error).message,
    });
  }
};

export const handleAttachDailyTrainingMedia: RequestHandler = async (req, res) => {
  try {
    const parentId = (req.query.parentId as string) || DEFAULT_PARENT_ID;
    const { exerciseId } = req.params;
    const file = req.file as Express.Multer.File | undefined;
    const { notes } = req.body ?? {};

    if (!file) {
      return res.status(400).json({ error: "لم يتم استلام ملف للتسجيل" });
    }

    const mediaRecord = await attachExerciseMedia(parentId, exerciseId, {
      type: (req.body?.type as "audio" | "video") ?? "audio",
      filename: file.filename,
      originalName: file.originalname,
      url: `/uploads/${file.filename}`,
      notes,
    });

    res.json({
      message: "تم حفظ التسجيل وتحليله",
      evaluation: mediaRecord,
    });
  } catch (error) {
    res.status(500).json({
      error: "تعذر حفظ التسجيل",
      details: (error as Error).message,
    });
  }
};

