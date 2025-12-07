import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db";
import * as schema from "../db/schema";

// Cache for the auth instance
let _auth: ReturnType<typeof betterAuth> | null = null;

// Function to get or create auth instance with proper DB binding
export const getAuth = () => {
    // Always get fresh DB in case context changed
    const db = getDb();

    // Create auth instance with current DB
    return betterAuth({
        database: drizzleAdapter(db, {
            provider: "sqlite",
            schema: schema
        }),
        emailAndPassword: {
            enabled: true,
        }
    });
};

// For backward compatibility, export a lazy getter
// This will be called during request handling, not module initialization
export const auth = new Proxy({} as ReturnType<typeof betterAuth>, {
    get(target, prop) {
        const authInstance = getAuth();
        return (authInstance as any)[prop];
    }
});
