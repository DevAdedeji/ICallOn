import { pgTable, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";

export const users = pgTable("users", {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    username: text("username").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
})

export const rooms = pgTable("rooms", {
    id: text("id").primaryKey(),
    code: text("code").notNull().unique(),
    hostId: text("host_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("lobby"),
    maxRounds: integer("max_rounds").notNull().default(5),
    timePerRound: integer("time_per_round").notNull().default(60),
    currentRound: integer("current_round").notNull().default(0),
    currentRoundId: text("current_round_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    startedAt: timestamp("started_at"),
    endedAt: timestamp("ended_at")
})

export const players = pgTable("players", {
    id: text("id").primaryKey(),
    room_id: text("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
    user_id: text("user_id").references(() => users.id, { onDelete: "set null" }),
    display_name: text("display_name").notNull(),
    isHost: boolean("is_host").notNull().default(false),
    totalScore: integer("total_score").notNull().default(0),
    isConnected: boolean("is_connected").notNull().default(true),
    joinedAt: timestamp("joined_at").defaultNow().notNull()
})

export const rounds = pgTable("rounds", {
    id: text("id").primaryKey(),
    room_id: text("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
    round_number: integer("round_number").notNull(),
    letter: text("letter").notNull(),
    status: text("status").notNull().default("active"),
    startedAt: timestamp("started_at").defaultNow().notNull(),
    endedAt: timestamp("ended_at")
})


export const answers = pgTable("answers", {
    id: text("id").primaryKey(),
    room_id: text("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
    round_id: text("round_id").notNull().references(() => rounds.id, { onDelete: "cascade" }),
    player_id: text("player_id").notNull().references(() => players.id, { onDelete: "cascade" }),
    player_name: text("name").notNull(),
    animal: text("animal"),
    name: text("name"),
    place: text("place"),
    thing: text("thing"),
    animal_valid: boolean("animal_valid").default(false),
    name_valid: boolean("name_valid").default(false),
    place_valid: boolean("place_valid").default(false),
    thing_valid: boolean("thing_valid").default(false),
    points_earned: integer("points_earned").notNull().default(0),
    time_taken: integer("time_taken"),
    submitted_at: timestamp("submitted_at"),
    validated_at: timestamp("validated_at"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
})

// Users
export type User = InferSelectModel<typeof users>

// Rooms
export type Room = InferSelectModel<typeof rooms>

// Players
export type Player = InferSelectModel<typeof players>

// Rounds
export type Round = InferSelectModel<typeof rounds>

// Answers
export type Answer = InferSelectModel<typeof answers>
