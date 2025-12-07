import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import * as schema from "@/db/schema";

export const runtime = "edge";

// Create auth instance fresh for each request (ensures D1 binding is available)
function createAuth() {
    const db = getDb();
    return betterAuth({
        database: drizzleAdapter(db, {
            provider: "sqlite",
            schema: schema
        }),
        emailAndPassword: {
            enabled: true,
        },
    });
}

export async function GET(request: NextRequest) {
    try {
        const auth = createAuth();
        const handler = toNextJsHandler(auth);
        return await handler.GET(request);
    } catch (error: any) {
        console.error("Auth GET error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const auth = createAuth();
        const handler = toNextJsHandler(auth);
        return await handler.POST(request);
    } catch (error: any) {
        console.error("Auth POST error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}


