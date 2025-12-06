import { drizzle } from "drizzle-orm/d1";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../db/schema";
import fs from "fs";
import path from "path";

export const getDb = (d1?: any) => {
    // 1. If running on Cloudflare (Production or Preview), use D1
    if (d1) {
        return drizzle(d1, { schema });
    }

    // 2. Fallback: If D1 is not provided (e.g. running locally 'npm run dev', 'npm run build', or 'npm start'),
    // try to connect to the local .wrangler SQLite file.
    const wranglerDir = path.resolve(process.cwd(), ".wrangler/state/v3/d1/miniflare-D1DatabaseObject");

    // Find the .sqlite file
    if (fs.existsSync(wranglerDir)) {
        const files = fs.readdirSync(wranglerDir);
        const sqliteFile = files.find(f => f.endsWith(".sqlite"));

        if (sqliteFile) {
            const dbPath = path.join(wranglerDir, sqliteFile);
            const sqlite = new Database(dbPath);
            return drizzleSqlite(sqlite, { schema });
        }
    }

    // 3. If we are running in a build context (Next.js build) and no DB is found, 
    // we might want to return a dummy or throw a more helpful error.
    // For now, let's throw, but this verifies that we tried both D1 and Local.
    throw new Error("Database connection failed. Ensure local dev is set up or D1 binding is provided.");
};
