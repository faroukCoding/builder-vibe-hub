import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import { handleDemo } from "./routes/demo";
import {
  handleAttachDailyTrainingMedia,
  handleGetDailyTraining,
  handleGetDailyTrainingExercise,
  handleUpdateDailyTrainingProgress,
} from "./routes/dailyTraining";
import {
  handleGetEducationalGames,
  handleRecordEducationalGameSession,
} from "./routes/educationalGames";
import {
  handleAssistantChat,
  handleAssistantHistory,
  handleAssistantTip,
} from "./routes/aiAssistant";
import {
  handleGetHomeLearningOverview,
  handlePostHomeLearningAssistantMessage,
  handlePostHomeLearningPronunciation,
  handlePostHomeLearningTrainingAnswer,
  handlePostHomeLearningGameResult,
} from "./routes/homeLearning";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const uploadDir = path.join(process.cwd(), "server", "uploads");
  fs.mkdir(uploadDir, { recursive: true }).catch(() => undefined);

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const sanitized = file.originalname.replace(/\s+/g, "-");
      cb(null, `${Date.now()}-${sanitized}`);
    },
  });

  const upload = multer({
    storage,
    limits: {
      fileSize: 25 * 1024 * 1024,
    },
  });

  app.use("/uploads", express.static(uploadDir));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Daily training endpoints
  app.get("/api/daily-training", handleGetDailyTraining);
  app.get("/api/daily-training/:exerciseId", handleGetDailyTrainingExercise);
  app.post("/api/daily-training/:exerciseId/progress", handleUpdateDailyTrainingProgress);
  app.post(
    "/api/daily-training/:exerciseId/media",
    upload.single("media"),
    handleAttachDailyTrainingMedia,
  );

  // Educational games endpoints
  app.get("/api/educational-games", handleGetEducationalGames);
  app.post("/api/educational-games/:gameId/session", handleRecordEducationalGameSession);

  // AI assistant endpoints
  app.get("/api/ai-assistant/history", handleAssistantHistory);
  app.post("/api/ai-assistant/chat", handleAssistantChat);
  app.post("/api/ai-assistant/tip", handleAssistantTip);

  // Home learning tools endpoints
  app.get("/api/home-learning/overview", handleGetHomeLearningOverview);
  app.post(
    "/api/home-learning/assistant/message",
    handlePostHomeLearningAssistantMessage,
  );
  app.post(
    "/api/home-learning/assistant/pronunciation",
    handlePostHomeLearningPronunciation,
  );
  app.post(
    "/api/home-learning/training/answer",
    handlePostHomeLearningTrainingAnswer,
  );
  app.post("/api/home-learning/games/result", handlePostHomeLearningGameResult);

  return app;
}
