import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./db/schema";
import { trades } from "./db/schema";

const dbPath = ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/423c60534c20823e3775c6e1de8b0d6f1fb85ef14b525413932d985d8dc6abf5.sqlite";
const sqlite = new Database(dbPath);
const db = drizzle(sqlite, { schema });

async function main() {
    console.log("Attempting insert...");
    try {
        const newTrade = {
            id: `test_${Date.now()}`,
            userId: "user_test", // This assumes no foreign key constraint check or we need a valid user
            // User ID is a foreign key. We need a valid user ID. 
            // We can check for existing users.
            date: "2025-01-01",
            ticker: "TEST",
            type: "Long",
            entryPrice: 100,
            exitPrice: 110,
            quantity: 1,
            pnl: 10,
            status: "Closed",
            entryTime: "09:00",
            exitTime: "10:00"
        } as any;

        // Force disable FK for test? Or fetch a user.
        const user = await db.query.user.findFirst();
        if (!user) {
            console.error("No user found to test with.");
            return;
        }
        newTrade.userId = user.id;

        await db.insert(trades).values(newTrade);
        console.log("Insert successful!");

        // cleanup
        const { eq } = require("drizzle-orm");
        await db.delete(trades).where(eq(trades.id, newTrade.id));
        console.log("Cleanup successful!");

    } catch (e) {
        console.error("Insert failed:", e);
    }
}

main();
