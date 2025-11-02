import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getDailyTraining, getTrainingDetails } from "./routes/dailyTraining";
import { getEducationalGames, getGameDetails } from "./routes/educationalGames";
import { handleSmartAssistant } from "./routes/smartAssistant";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Smart Dashboard API Routes
  app.get("/api/daily-training", getDailyTraining);
  app.get("/api/daily-training/:id", getTrainingDetails);
  app.get("/api/educational-games", getEducationalGames);
  app.get("/api/educational-games/:id", getGameDetails);
  app.post("/api/smart-assistant", handleSmartAssistant);


  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);


  return app;
}
