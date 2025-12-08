import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";

export const runtime = "edge";

export async function GET(request: NextRequest) {
    try {
        const auth = getAuth();
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
        const auth = getAuth();
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


