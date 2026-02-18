import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params;
        const ctx = getCloudflareContext();
        const bucket = ctx.env.IMAGES;

        if (!bucket) {
            return NextResponse.json(
                { error: "Image storage not configured" },
                { status: 500 }
            );
        }

        const object = await bucket.get(filename);

        if (!object) {
            return NextResponse.json(
                { error: "Image not found" },
                { status: 404 }
            );
        }

        const headers = new Headers();
        headers.set("Content-Type", object.httpMetadata?.contentType || "image/jpeg");
        headers.set("Cache-Control", "public, max-age=31536000"); // Cache for 1 year

        return new NextResponse(object.body, {
            status: 200,
            headers,
        });
    } catch (error: any) {
        console.error("Image fetch error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch image" },
            { status: 500 }
        );
    }
}
