import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: NextRequest) {
    try {
        const ctx = getCloudflareContext();
        const bucket = ctx.env.IMAGES;

        if (!bucket) {
            return NextResponse.json(
                { error: "Image storage not configured" },
                { status: 500 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP" },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File too large. Maximum size: 5MB" },
                { status: 400 }
            );
        }

        // Generate unique filename
        const ext = file.name.split(".").pop() || "jpg";
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

        // Upload to R2
        const arrayBuffer = await file.arrayBuffer();
        await bucket.put(filename, arrayBuffer, {
            httpMetadata: {
                contentType: file.type,
            },
        });

        // Return the URL to access the image
        // Note: You need to set up public access for the R2 bucket or create a GET endpoint
        const imageUrl = `/api/images/${filename}`;

        return NextResponse.json({
            success: true,
            url: imageUrl,
            filename,
        });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: error.message || "Upload failed" },
            { status: 500 }
        );
    }
}
