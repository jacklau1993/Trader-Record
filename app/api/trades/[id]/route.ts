import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { trades, tradeTags } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth"; // Need to check if this imports correctly in route handler context
import { headers } from "next/headers";

export const runtime = 'edge';

// Helper to get user in API route
async function getUser() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    return session?.user || null;
}

export async function PATCH(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { id } = params;
        const { tags: tagIds, ...tradeData } = body;
        const db = getDb();

        if (Object.keys(tradeData).length > 0) {
            await db.update(trades)
                .set({ ...tradeData, updatedAt: new Date() })
                .where(and(eq(trades.id, id), eq(trades.userId, user.id)));
        }

        if (tagIds !== undefined) {
            // Replace tags
            await db.delete(tradeTags).where(eq(tradeTags.tradeId, id));
            if (tagIds.length > 0) {
                for (const tagId of tagIds) {
                    await db.insert(tradeTags).values({
                        tradeId: id,
                        tagId: tagId
                    });
                }
            }
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("API Update Trade Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update trade" },
            { status: 500 }
        );
    }
}


export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const db = getDb();

        await db.delete(trades)
            .where(and(eq(trades.id, id), eq(trades.userId, user.id)));

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("API Delete Trade Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to delete trade" },
            { status: 500 }
        );
    }
}
