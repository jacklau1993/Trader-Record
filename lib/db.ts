import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
// Static ESM import - this package only exports ESM, not CommonJS
import { getRequestContext } from "@cloudflare/next-on-pages";

export const getDb = (d1?: any) => {
    // 1. If explicitly passed
    if (d1) {
        return drizzle(d1, { schema });
    }

    // 2. Try to get from Cloudflare Context (Production/Edge)
    try {
        const ctx = getRequestContext();
        if (ctx && ctx.env && ctx.env.DB) {
            console.log("Successfully got D1 binding from context");
            return drizzle(ctx.env.DB, { schema });
        } else {
            console.log("Context available but no DB binding:", ctx?.env ? Object.keys(ctx.env) : "no env");
        }
    } catch (e) {
        // Context not available (e.g., during build or not in Cloudflare)
        console.log("getRequestContext failed:", e);
    }

    // 3. Fallback: Local SQLite (Development only)
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
        try {
            const fs = require("fs");
            const path = require("path");
            const Database = require("better-sqlite3");
            const { drizzle: drizzleSqlite } = require("drizzle-orm/better-sqlite3");

            const cwd = process["cwd"]();
            const wranglerDir = path.resolve(cwd, ".wrangler/state/v3/d1/miniflare-D1DatabaseObject");

            if (fs.existsSync(wranglerDir)) {
                const files = fs.readdirSync(wranglerDir);
                const sqliteFile = files.find((f: string) => f.endsWith(".sqlite"));

                if (sqliteFile) {
                    const dbPath = path.join(wranglerDir, sqliteFile);
                    const sqlite = new Database(dbPath);
                    return drizzleSqlite(sqlite, { schema });
                }
            }
        } catch (e) {
            // Ignore if local dev setup fails
        }
    }

    // 4. Verification/Build phase fallback - return Mock DB
    console.warn("D1 Database not found. Returning Mock DB.");
    const mockD1 = {
        prepare: () => ({
            bind: () => ({
                all: async () => ({ results: [] }),
                run: async () => ({ meta: {} }),
                first: async () => null,
                raw: async () => []
            })
        }),
        dump: async () => new ArrayBuffer(0),
        batch: async () => [],
        exec: async () => { }
    };
    return drizzle(mockD1 as any, { schema });
};
