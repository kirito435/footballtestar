import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const gameRooms = pgTable("game_rooms", {
  id: serial("id").primaryKey(),
  roomCode: text("room_code").notNull().unique(),
  hostId: integer("host_id").notNull(),
  gameMode: text("game_mode").notNull(), // 'individual' or 'team'
  questionMode: text("question_mode").notNull(), // 'single' or 'rapidfire'
  maxPlayers: integer("max_players").notNull().default(4),
  currentRound: integer("current_round").notNull().default(1),
  totalRounds: integer("total_rounds").notNull().default(10),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const gamePlayers = pgTable("game_players", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  playerId: text("player_id").notNull(),
  playerName: text("player_name").notNull(),
  score: integer("score").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  answers: json("answers").$type<string[]>().notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull().default("medium"),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameRoomSchema = createInsertSchema(gameRooms).pick({
  roomCode: true,
  hostId: true,
  gameMode: true,
  questionMode: true,
  maxPlayers: true,
  totalRounds: true,
});

export const insertGamePlayerSchema = createInsertSchema(gamePlayers).pick({
  roomId: true,
  playerId: true,
  playerName: true,
});

export const insertQuestionSchema = createInsertSchema(questions).pick({
  text: true,
  answers: true,
  correctAnswer: true,
  category: true,
  difficulty: true,
});

// Relations
export const gameRoomsRelations = relations(gameRooms, ({ many }) => ({
  players: many(gamePlayers),
}));

export const gamePlayersRelations = relations(gamePlayers, ({ one }) => ({
  room: one(gameRooms, {
    fields: [gamePlayers.roomId],
    references: [gameRooms.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type GameRoom = typeof gameRooms.$inferSelect;
export type InsertGameRoom = z.infer<typeof insertGameRoomSchema>;

export type GamePlayer = typeof gamePlayers.$inferSelect;
export type InsertGamePlayer = z.infer<typeof insertGamePlayerSchema>;

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

// WebSocket message types
export type WebSocketMessage = 
  | { type: "join_room"; payload: { roomCode: string; playerName: string } }
  | { type: "player_joined"; payload: { player: GamePlayer } }
  | { type: "game_started"; payload: { roomId: number } }
  | { type: "question_presented"; payload: { question: Question; timeLimit: number } }
  | { type: "answer_submitted"; payload: { playerId: string; answerIndex: number; timeRemaining: number } }
  | { type: "answer_result"; payload: { playerId: string; correct: boolean; correctAnswer: number; score: number } }
  | { type: "round_ended"; payload: { scores: Record<string, number>; nextRound: boolean } }
  | { type: "game_ended"; payload: { finalScores: Record<string, number>; winner: string } }
  | { type: "timer_update"; payload: { timeRemaining: number } }
  | { type: "error"; payload: { message: string } };
