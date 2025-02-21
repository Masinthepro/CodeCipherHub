import { users, type User, type InsertUser } from "@shared/schema";
import { translations, type Translation, type InsertTranslation } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getTranslation(id: number): Promise<Translation | undefined>;
  getAllTranslations(): Promise<Translation[]>;
  createTranslation(translation: InsertTranslation): Promise<Translation>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async getTranslation(id: number): Promise<Translation | undefined> {
    throw new Error("Method not implemented.");
  }
  async getAllTranslations(): Promise<Translation[]> {
    throw new Error("Method not implemented.");
  }
  async createTranslation(translation: InsertTranslation): Promise<Translation> {
    throw new Error("Method not implemented.");
  }
}

export class DatabaseStorage implements IStorage {
  async getTranslation(id: number): Promise<Translation | undefined> {
    const [translation] = await db.select().from(translations).where(eq(translations.id, id));
    return translation;
  }

  async getAllTranslations(): Promise<Translation[]> {
    return await db.select().from(translations).orderBy(translations.createdAt);
  }

  async createTranslation(insertTranslation: InsertTranslation): Promise<Translation> {
    const [translation] = await db
      .insert(translations)
      .values(insertTranslation)
      .returning();
    return translation;
  }
  async getUser(id: number): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
  async createUser(user: InsertUser): Promise<User> {
    throw new Error("Method not implemented.");
  }
}

export const storage = new DatabaseStorage();