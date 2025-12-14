"use server";
// Force Rebuild

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/db";
import { trades, tradeTags } from "@/db/schema";
import { eq, desc, and, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Helper to get authenticated user
async function getUser() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session?.user) {
        throw new Error("Unauthorized");
    }
    return session.user;
}

export async function getTrades() {
    const user = await getUser();
    const db = getDb();

    // 1. Fetch trades
    let query = db.select()
        .from(trades)
        .where(eq(trades.userId, user.id))
        .$dynamic(); // Prepare for potential dynamic chain

    // If implementing filtering by account, we can add it here as an argument to getTrades
    // For now, returning all trades, client can filter or we can add param later.
    const userTrades = await query.orderBy(desc(trades.date));

    // 2. Fetch tags for these trades
    // We can do this efficiently by fetching all trade_tags for these trade IDs
    const tradeIds = userTrades.map((t: any) => t.id);
    let tagsMap: Record<string, string[]> = {};

    if (tradeIds.length > 0) {
        const relatedTags = await db.select()
            .from(tradeTags)
            .where(inArray(tradeTags.tradeId, tradeIds));

        relatedTags.forEach((rt: any) => {
            if (!tagsMap[rt.tradeId]) tagsMap[rt.tradeId] = [];
            tagsMap[rt.tradeId].push(rt.tagId);
        });
    }

    // 3. Merge
    return userTrades.map((t: any) => ({
        ...t,
        tags: tagsMap[t.id] || []
    }));
}

export async function getTradesByAccount(accountId?: string) {
    const user = await getUser();
    const db = getDb();

    let whereClause = eq(trades.userId, user.id);
    if (accountId) {
        whereClause = and(whereClause, eq(trades.tradingAccountId, accountId)) as any;
    }

    const userTrades = await db.select()
        .from(trades)
        .where(whereClause)
        .orderBy(desc(trades.date));

    // 2. Fetch tags for these trades
    // We can do this efficiently by fetching all trade_tags for these trade IDs
    const tradeIds = userTrades.map((t: any) => t.id);
    let tagsMap: Record<string, string[]> = {};

    if (tradeIds.length > 0) {
        const relatedTags = await db.select()
            .from(tradeTags)
            .where(inArray(tradeTags.tradeId, tradeIds));

        relatedTags.forEach((rt: any) => {
            if (!tagsMap[rt.tradeId]) tagsMap[rt.tradeId] = [];
            tagsMap[rt.tradeId].push(rt.tagId);
        });
    }

    // 3. Merge
    return userTrades.map((t: any) => ({
        ...t,
        tags: tagsMap[t.id] || []
    }));
}

export async function getTrade(id: string) {
    const user = await getUser();
    const db = getDb();

    const trade = await db.select().from(trades).where(and(eq(trades.id, id), eq(trades.userId, user.id))).get();

    if (!trade) return null;

    const tags = await db.select().from(tradeTags).where(eq(tradeTags.tradeId, id));

    return {
        ...trade,
        tags: tags.map((t: any) => t.tagId)
    };
}

// Define Input Type
type CreateTradeInput = Omit<typeof trades.$inferInsert, "userId"> & { tags?: string[] };

export async function createTrade(data: CreateTradeInput) {
    const user = await getUser();
    const db = getDb();

    const { tags: tagIds, ...tradeData } = data;

    // Force userId to match session
    const newTrade = {
        ...tradeData,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    await db.insert(trades).values(newTrade);

    if (tagIds && tagIds.length > 0) {
        for (const tagId of tagIds) {
            await db.insert(tradeTags).values({
                tradeId: newTrade.id,
                tagId: tagId
            });
        }
    }

    revalidatePath("/trades");
    revalidatePath("/");
    revalidatePath("/reports");
    return { success: true };
}

export async function updateTrade(id: string, data: Partial<CreateTradeInput>) {
    const user = await getUser();
    const db = getDb();

    const { tags: tagIds, ...tradeData } = data;

    if (Object.keys(tradeData).length > 0) {
        await db.update(trades)
            .set({ ...tradeData, updatedAt: new Date() })
            .where(and(eq(trades.id, id), eq(trades.userId, user.id)));
    }

    if (tagIds !== undefined) {
        // Replace tags
        // 1. Delete existing for this trade
        await db.delete(tradeTags).where(eq(tradeTags.tradeId, id));

        // 2. Insert new
        if (tagIds.length > 0) {
            for (const tagId of tagIds) {
                await db.insert(tradeTags).values({
                    tradeId: id,
                    tagId: tagId
                });
            }
        }
    }

    revalidatePath("/trades");
    revalidatePath(`/trades/${id}`);
    revalidatePath("/");
    revalidatePath("/reports");
    return { success: true };
}

export async function deleteTrade(id: string) {
    const user = await getUser();
    const db = getDb();

    await db.delete(trades)
        .where(and(eq(trades.id, id), eq(trades.userId, user.id)));
    // Cascade should handle tradeTags deletion or we can do manual if needed.
    // Schema has onDelete: cascade, so it should be fine.

    revalidatePath("/trades");
    revalidatePath("/");
    revalidatePath("/reports");
    return { success: true };
}
