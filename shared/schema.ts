import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  planType: text("plan_type").notNull().default("free"), // "free" or "pro"
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  generationsUsed: integer("generations_used").notNull().default(0),
  generationsLimit: integer("generations_limit").notNull().default(5),
  resetDate: timestamp("reset_date").notNull().default(sql`date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'`),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  sessionType: text("session_type").notNull(), // "outfield" or "goalkeeping"
  sessionFocus: text("session_focus").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  participants: integer("participants").notNull(),
  level: text("level"),
  objectives: text("objectives").array().notNull(),
  equipment: text("equipment").array().notNull(),
  safetyNotes: text("safety_notes").array().notNull(),
  warmup: jsonb("warmup").notNull(),
  practices: jsonb("practices").notNull(),
  smallSidedGame: jsonb("small_sided_game").notNull(),
  cooldown: jsonb("cooldown").notNull(),
  diagrams: jsonb("diagrams").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  generationsUsed: true,
  generationsLimit: true,
  resetDate: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;

export const sessionGenerationSchema = z.object({
  sessionType: z.enum(["outfield", "goalkeeping"]),
  sessionFocus: z.string().min(1),
  durationMinutes: z.number().min(15).max(90),
  participants: z.number().min(1).max(30),
  level: z.string().optional(),
});

export type SessionGeneration = z.infer<typeof sessionGenerationSchema>;
