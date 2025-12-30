import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// --- BETTER AUTH TABLES ---

export const user = sqliteTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
    image: text("image"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
});

export const session = sqliteTable("session", {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull().references(() => user.id)
});

export const account = sqliteTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => user.id),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
});

export const verification = sqliteTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }),
    updatedAt: integer("updated_at", { mode: "timestamp" })
});

// --- TRADING APP TABLES ---

export const categories = sqliteTable("category", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    color: text("color").default("blue").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date())
});

export const tags = sqliteTable("tag", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    color: text("color"),
    categoryId: text("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date())
});

// ... (previous tables)

export const tradingAccounts = sqliteTable("trading_account", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    type: text("type").notNull(), // "BROKER" | "PROP_FIRM"

    // Prop Firm specifics
    status: text("status"), // e.g., "Active", "Busted", "Passed"
    accountNumber: text("account_number"),
    cost: real("cost"),
    lastPayoutAmount: real("last_payout_amount"),
    lastPayoutDate: integer("last_payout_date", { mode: "timestamp" }),
    totalPayout: real("total_payout"),

    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date())
});


export const trades = sqliteTable("trade", {
    id: text("id").primaryKey(),
    date: text("date").notNull(), // ISO Date String
    ticker: text("ticker").notNull(),
    type: text("type").notNull(), // "Long" | "Short"
    entryPrice: real("entry_price").notNull(),
    exitPrice: real("exit_price").notNull(),
    quantity: real("quantity").notNull(),
    pnl: real("pnl").notNull(),
    status: text("status").default("Closed").notNull(),
    notes: text("notes"),

    // Account link
    tradingAccountId: text("trading_account_id").references(() => tradingAccounts.id, { onDelete: "set null" }),

    // Advanced Metrics
    contracts: real("contracts"),
    points: real("points"),
    ticks: real("ticks"),
    rating: integer("rating"),
    profitTarget: real("profit_target"),
    stopLoss: real("stop_loss"),
    plannedRR: real("planned_rr"),
    realizedRR: real("realized_rr"),

    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),

    // Time Tracking (Text as "HH:MM")
    entryDate: text("entry_date"), // ISO Date String
    entryTime: text("entry_time"),
    exitTime: text("exit_time"),

    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date())
});

// Join table for Trade <-> Tags if needed, but for simplicity storing tags might be easier. 
// However, proper SQL way is a join table.
export const tradeTags = sqliteTable("trade_tag", {
    tradeId: text("trade_id").notNull().references(() => trades.id, { onDelete: "cascade" }),
    tagId: text("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
});

export const sections = sqliteTable("section", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date())
});

export const notes = sqliteTable("note", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    date: text("date").notNull(), // ISO Date String
    sectionId: text("section_id").notNull().references(() => sections.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    tradeId: text("trade_id").references(() => trades.id, { onDelete: "set null" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date())
});

export const noteTags = sqliteTable("note_tag", {
    noteId: text("note_id").notNull().references(() => notes.id, { onDelete: "cascade" }),
    tagId: text("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
});

export const templates = sqliteTable("template", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    content: text("content").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date())
});

export const userPreferences = sqliteTable("user_preferences", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
    currency: text("currency").default("USD").notNull(),
    dateFormat: text("date_format").default("YYYY-MM-DD").notNull(),
    timezone: text("timezone").default("UTC").notNull(),
    theme: text("theme").default("dark").notNull(),
    defaultTradingAccountId: text("default_trading_account_id"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date())
});

