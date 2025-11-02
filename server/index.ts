import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getDailyTraining } from "./routes/dailyTraining";
import { getEducationalGames } from "./routes/educationalGames";
import { handleAIAssistant } from "./routes/aiAssistant";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // New routes
  app.get("/api/daily-training", getDailyTraining);
  app.get("/api/educational-games", getEducationalGames);
  app.post("/api/ai-assistant", handleAIAssistant);

  return app;
}
