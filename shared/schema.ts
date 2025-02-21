import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const translations = pgTable("translations", {
  id: serial("id").primaryKey(),
  input: text("input").notNull(),
  output: text("output").notNull(),
  type: text("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTranslationSchema = createInsertSchema(translations).pick({
  input: true,
  output: true,
  type: true,
});

export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type Translation = typeof translations.$inferSelect;

export const translationTypes = [
  "binary",
  "hexadecimal",
  "base64",
  "morse",
  "piglatin",
  "leetspeak",
  "atbash",
  "oneZeroOne",
  "caesar",
  "vigenere"
] as const;