import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db";
import * as schema from "../db/schema";

// In local dev `npm run dev`, getDb() will find the local file.
// In prod (Cloudflare), this might fail if initialized globally without binding.
// But for now, let's target local dev to get it working.
const db = getDb();

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema: schema
    }),
    emailAndPassword: {
        enabled: true,
    }
});
