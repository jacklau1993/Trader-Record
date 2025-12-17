"use server";
// Force Rebuild

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/db";
import { trades, tradeTags, notes, sections } from "@/db/schema";
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

    try {
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
    } catch (e) {
        console.error("SERVER ERROR in createTrade:", e);
        throw e; // Re-throw to ensure client sees failure
    }
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

// Helper to normalize ticker
function normalizeTicker(rawSymbol: string): string {
    // Remove month codes (e.g., H6, Z5) and trailing digits
    // Common futures months: F, G, H, J, K, M, N, Q, U, V, X, Z
    // Simple heuristic: if it ends with digit, remove digit. Then if ends with known month letter, remove it.
    // Or, simpler: match against known tickers in CONSTANT.

    // Try to match start of string with known tickers (longest match first)
    // defined in lib/constants.ts but we can hardcode or import.
    // Let's import TICKERS if possible, but here we can just do string manipulation.
    // "MYMH6" -> "MYM"
    // "NQZ5" -> "NQ"

    const knownTickers = ['MYM', 'MNQ', 'MGC', 'YM', 'NQ', 'GC'];

    for (const t of knownTickers) {
        if (rawSymbol.startsWith(t)) {
            // Check if the rest is just suffix (1 letter + 1 digit or just digits)
            // simplified: just return the known ticker if it starts with it?
            // Be careful with MYM vs M.
            // "MYMH6" starts with "MYM" -> OK.
            // "MYM" starts with "MYM" -> OK.
            return t;
        }
    }
    // Fallback: return raw if no match
    return rawSymbol;
}

export async function importTradesFromCsv(formData: FormData) {
    const user = await getUser();
    const db = getDb();

    const file = formData.get("file") as File;
    const accountId = formData.get("accountId") as string;

    if (!file) throw new Error("No file provided");
    if (!accountId) throw new Error("No account provided");

    const text = await file.text();
    const lines = text.split(/\r?\n/);

    // Header: symbol,_priceFormat,_priceFormatType,_tickSize,buyFillId,sellFillId,qty,buyPrice,sellPrice,pnl,boughtTimestamp,soldTimestamp,duration
    // We expect header at line 0
    if (lines.length < 2) return { success: false, message: "Empty CSV" };

    const headers = lines[0].split(",");

    // Simple index mapping
    const getIdx = (name: string) => headers.indexOf(name);

    const idxSymbol = 0; // usually 0
    const idxQty = getIdx("qty");
    const idxBuyPrice = getIdx("buyPrice");
    const idxSellPrice = getIdx("sellPrice");
    const idxPnl = getIdx("pnl");
    const idxBoughtTs = getIdx("boughtTimestamp");
    const idxSoldTs = getIdx("soldTimestamp");
    const idxDuration = getIdx("duration"); // optional, maybe for notes

    let importedCount = 0;

    // Fetch or create "Trade Notes" section
    let tradeSections = await db.select().from(sections).where(and(eq(sections.userId, user.id), eq(sections.name, "Trade Notes")));
    let sectionId;
    if (tradeSections.length > 0) {
        sectionId = tradeSections[0].id;
    } else {
        // Create if missing (though unlikely if user used app before)
        sectionId = `sec_${Date.now()}_import`;
        await db.insert(sections).values({
            id: sectionId,
            name: "Trade Notes",
            userId: user.id
        });
    }

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Handle CSV split respecting quotes if needed, 
        // but Performance.csv seems simple. "$0.00" might have quotes? 
        // Example: MYMH6,0,0,1,3.46188E+11,3.46188E+11,20,48768,48768,$0.00,12/16/2025 14:45:00,12/16/2025 14:38:47,6min 12sec
        // $0.00 is not quoted in example.
        const cols = line.split(",");

        if (cols.length < 5) continue;

        const rawSymbol = cols[idxSymbol];
        const ticker = normalizeTicker(rawSymbol);

        const qty = parseFloat(cols[idxQty]);
        const buyPrice = parseFloat(cols[idxBuyPrice]);
        const sellPrice = parseFloat(cols[idxSellPrice]);

        // PnL might have '$'
        let pnlStr = cols[idxPnl] || "0";
        pnlStr = pnlStr.replace("$", "").replace(",", "");
        const pnl = parseFloat(pnlStr);

        const boughtTs = cols[idxBoughtTs];
        const soldTs = cols[idxSoldTs];

        const boughtDate = new Date(boughtTs);
        const soldDate = new Date(soldTs);

        // Determine type
        // If bought before sold -> Long
        // If sold before bought -> Short
        const isLong = boughtDate.getTime() < soldDate.getTime();
        const type = isLong ? "Long" : "Short";

        // Entry/Exit mapping
        const entryPrice = isLong ? buyPrice : sellPrice;
        const exitPrice = isLong ? sellPrice : buyPrice;

        // Date: use entry date
        const entryDateObj = isLong ? boughtDate : soldDate;
        const exitDateObj = isLong ? soldDate : boughtDate;
        const dateStr = entryDateObj.toISOString().split('T')[0];

        // Time strings HH:mm
        const entryTime = entryDateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        const exitTime = exitDateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        const duration = cols[idxDuration];

        const tradeId = `trade_${Date.now()}_${i}`;
        const noteId = `note_${Date.now()}_${i}`;

        const tradeData = {
            id: tradeId,
            date: dateStr,
            ticker: ticker,
            type: type as "Long" | "Short",
            entryPrice: entryPrice,
            exitPrice: exitPrice,
            quantity: qty,
            pnl: pnl,
            status: "Closed",
            notes: `Imported from CSV. Raw Symbol: ${rawSymbol}. Duration: ${duration}`,
            tradingAccountId: accountId,
            entryTime: entryTime,
            exitTime: exitTime,
            userId: user.id,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await db.insert(trades).values(tradeData);

        // Create Note
        const noteContent = `<p><strong># Trade Details</strong></p><p>- <strong>Ticker</strong>: ${ticker}<br>- <strong>Direction</strong>: ${type}<br>- <strong>Date</strong>: ${dateStr}<br>- <strong>Net P&L</strong>: $${pnl.toFixed(2)}</p><p><strong>## Notes</strong></p><p>Imported from CSV.<br>Raw Symbol: ${rawSymbol}<br>Duration: ${duration}</p><p><strong>## Review</strong></p><p></p>`;

        // Ensure unique ID collision avoidance if loop is fast
        const uniqueNoteId = noteId + Math.random().toString(36).substr(2, 5);

        await db.insert(notes).values({
            id: uniqueNoteId,
            sectionId: sectionId,
            title: `${ticker} ${type} (${dateStr})`,
            content: noteContent,
            date: dateStr,
            tradeId: tradeId,
            userId: user.id,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        importedCount++;
    }

    revalidatePath("/trades");
    revalidatePath("/");
    revalidatePath("/reports");
    revalidatePath("/notebook");

    return { success: true, count: importedCount };
}
