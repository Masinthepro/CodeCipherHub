import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTranslationSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all translations
  app.get("/api/translations", async (_req, res) => {
    try {
      const translations = await storage.getAllTranslations();
      res.json(translations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch translations" });
    }
  });

  // Create a new translation
  app.post("/api/translations", async (req, res) => {
    try {
      const translation = insertTranslationSchema.parse(req.body);
      const result = await storage.createTranslation(translation);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid translation data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create translation" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}