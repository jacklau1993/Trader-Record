import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";

export const runtime = "edge";

// Helper to get origin from request (works for both direct requests and OAuth callbacks)
function getOriginFromRequest(request: NextRequest): string | null {
    // First try the origin header (for direct requests)
    const originHeader = request.headers.get("origin");
    if (originHeader) return originHeader;
    
    // For OAuth callbacks, derive from the request URL
    const url = new URL(request.url);
    return `${url.protocol}//${url.host}`;
}

export async function GET(request: NextRequest) {
    try {
        const origin = getOriginFromRequest(request);
        const auth = getAuth(origin);
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
        const origin = getOriginFromRequest(request);
        const auth = getAuth(origin);
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
