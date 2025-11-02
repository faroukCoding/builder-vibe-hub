import { RequestHandler } from "express";
import { getEducationalGames, recordGameSession } from "../services/homeFollowUpStore";

const DEFAULT_PARENT_ID = "parent-1";

export const handleGetEducationalGames: RequestHandler = async (req, res) => {
  try {
    const parentId = (req.query.parentId as string) || DEFAULT_PARENT_ID;
    const payload = await getEducationalGames(parentId);

    res.json({
      parentId,
      retrievedAt: new Date().toISOString(),
      ...payload,
    });
  } catch (error) {
    res.status(500).json({
      error: "فشل في تحميل الألعاب التعليمية",
      details: (error as Error).message,
    });
  }
};

export const handleRecordEducationalGameSession: RequestHandler = async (req, res) => {
  try {
    const parentId = (req.query.parentId as string) || DEFAULT_PARENT_ID;
    const { gameId } = req.params;
    const { score, accuracy, notes, durationMinutes } = req.body ?? {};

    if (typeof score !== "number" || typeof accuracy !== "number") {
      return res.status(400).json({
        error: "يجب إرسال نتيجة ودقة رقمية للجلسة",
      });
    }

    const updatedGame = await recordGameSession(parentId, gameId, {
      score,
      accuracy,
      notes,
      durationMinutes,
    });

    res.json({
      message: "تم تسجيل جلسة اللعبة",
      game: updatedGame,
    });
  } catch (error) {
    res.status(500).json({
      error: "تعذر تسجيل الجلسة",
      details: (error as Error).message,
    });
  }
};

