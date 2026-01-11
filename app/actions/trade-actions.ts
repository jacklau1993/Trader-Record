"use server";
// Force Rebuild

import { getAuthenticatedUser } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";
import { trades, tradeTags, notes, sections, tradingAccounts } from "@/db/schema";
import { eq, desc, and, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTrades() {
    const user = await getAuthenticatedUser();
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
    const user = await getAuthenticatedUser();
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
    const user = await getAuthenticatedUser();
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
    const user = await getAuthenticatedUser();
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
    const user = await getAuthenticatedUser();
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
    const user = await getAuthenticatedUser();
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
    const user = await getAuthenticatedUser();
    const db = getDb();

    const file = formData.get("file") as File;
    const accountId = formData.get("accountId") as string;

    if (!file) throw new Error("No file provided");
    if (!accountId) throw new Error("No account provided");

    // Fetch account's commission rates
    const account = await db.select().from(tradingAccounts).where(eq(tradingAccounts.id, accountId)).get();
    let commissionRates: Record<string, number> = {};
    if (account?.commissionRates) {
        try {
            commissionRates = JSON.parse(account.commissionRates);
        } catch {
            // Ignore parse errors, default to empty
        }
    }

    const text = await file.text();
    const lines = text.split(/\r?\n/);

    // Header: symbol,_priceFormat,_priceFormatType,_tickSize,buyFillId,sellFillId,qty,buyPrice,sellPrice,pnl,boughtTimestamp,soldTimestamp,duration
    // We expect header at line 0
    if (lines.length < 2) return { success: false, message: "Empty CSV" };

    // Helper to parse CSV line respecting quotes
    const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuote = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                // If we are in a quote and see another quote, check if it's escaped (double quote)
                // However, standard CSV usually escapes quotes by doubling them.
                // For simplicity here, we toggle inQuote.
                if (inQuote && line[i + 1] === '"') {
                    current += '"';
                    i++; // skip next quote
                } else {
                    inQuote = !inQuote;
                }
            } else if (char === ',' && !inQuote) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
    }

    // Parse header using helper
    const headerCols = parseCSVLine(lines[0]);
    const headers = headerCols.map(h => h.trim().replace(/^"|"$/g, ''));

    // Simple index mapping
    const getIdx = (name: string) => headers.indexOf(name);

    // Verify necessary headers
    const idxSymbol = 0;
    const idxQty = getIdx("qty");
    const idxBuyPrice = getIdx("buyPrice");
    const idxSellPrice = getIdx("sellPrice");
    const idxPnl = getIdx("pnl");
    const idxBoughtTs = getIdx("boughtTimestamp");
    const idxSoldTs = getIdx("soldTimestamp");
    const idxDuration = getIdx("duration");

    if (idxBoughtTs === -1 || idxSoldTs === -1) {
        return { success: false, message: `Missing timestamp columns. Found: ${headers.join(', ')}` };
    }

    let importedCount = 0;
    let errors: string[] = [];

    // Fetch or create "Trade Notes" section
    let tradeSections = await db.select().from(sections).where(and(eq(sections.userId, user.id), eq(sections.name, "Trade Notes")));
    let sectionId;
    if (tradeSections.length > 0) {
        sectionId = tradeSections[0].id;
    } else {
        sectionId = `sec_${Date.now()}_import`;
        await db.insert(sections).values({
            id: sectionId,
            name: "Trade Notes",
            userId: user.id
        });
    }

    // Helper to clean CSV value
    const clean = (val: string) => val ? val.trim().replace(/^"|"$/g, '') : "";

    // Helper for date parsing: "MM/DD/YYYY HH:mm:ss" -> Date object
    const parseDate = (str: string) => {
        if (!str) return null;
        const cleaned = clean(str);
        try {
            // Try standard Date constructor first if it matches standard ISO or supported formats
            const dSimple = new Date(cleaned);
            if (!isNaN(dSimple.getTime())) return dSimple;

            // Fallback to manual parsing for MM/DD/YYYY HH:mm:ss
            const [datePart, timePart] = cleaned.split(' ');
            if (!datePart) return null;
            const [month, day, year] = datePart.split('/');

            // If time is missing, default to 00:00:00
            let hours = 0, minutes = 0, seconds = 0;
            if (timePart) {
                const parts = timePart.split(':');
                hours = parseInt(parts[0]) || 0;
                minutes = parseInt(parts[1]) || 0;
                seconds = parseInt(parts[2]) || 0;
            }

            // Note: Month is 0-indexed in JS Date
            const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hours, minutes, seconds);
            if (isNaN(d.getTime())) return null;
            return d;
        } catch (e) {
            return null;
        }
    };

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        try {
            const cols = parseCSVLine(line);

            // Check if we have enough columns. 
            // Note: cols.length should match headers.length ideally, or at least be enough to cover our indices.
            const maxIdx = Math.max(idxSymbol, idxQty, idxBuyPrice, idxSellPrice, idxPnl, idxBoughtTs, idxSoldTs, idxDuration);
            if (cols.length <= maxIdx) {
                errors.push(`Line ${i}: Not enough columns (Found ${cols.length}, required > ${maxIdx})`);
                continue;
            }

            const rawSymbol = clean(cols[idxSymbol]);
            const ticker = normalizeTicker(rawSymbol);

            const qty = parseFloat(clean(cols[idxQty]));
            const buyPrice = parseFloat(clean(cols[idxBuyPrice]));
            const sellPrice = parseFloat(clean(cols[idxSellPrice]));

            // start/end timestamp check
            const boughtTsStr = cols[idxBoughtTs];
            const soldTsStr = cols[idxSoldTs];

            const boughtDate = parseDate(boughtTsStr);
            const soldDate = parseDate(soldTsStr);

            if (!boughtDate || !soldDate) {
                errors.push(`Row ${i + 1}: Invalid dates. Bought: "${boughtTsStr}", Sold: "${soldTsStr}"`);
                continue;
            }

            // PnL processing
            let pnlStr = clean(cols[idxPnl] || "0");

            // Detect negative parenthesis format e.g. (100), $(100), ($100)
            const isNegativeParenthesis = pnlStr.includes('(') && pnlStr.includes(')');

            // Remove characters that are not digits, dot, or minus
            // We remove $, ( ) and commas
            pnlStr = pnlStr.replace(/[$,()]/g, "");

            let pnl = parseFloat(pnlStr);

            if (isNegativeParenthesis) {
                pnl = -Math.abs(pnl);
            }

            const isLong = boughtDate.getTime() < soldDate.getTime();
            const type = isLong ? "Long" : "Short";

            const entryPrice = isLong ? buyPrice : sellPrice;
            const exitPrice = isLong ? sellPrice : buyPrice;

            // Date string YYYY-MM-DD
            const entryDateObj = isLong ? boughtDate : soldDate;
            const exitDateObj = isLong ? soldDate : boughtDate;
            const dateStr = exitDateObj.toISOString().split('T')[0]; // Use Exit Date as the main Date (Close Date)
            const entryDateStr = entryDateObj.toISOString().split('T')[0];

            const entryTime = entryDateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            const exitTime = exitDateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

            const duration = clean(cols[idxDuration]);

            const tradeId = `trade_${Date.now()}_${importedCount}`;

            // Calculate commission: rate × quantity × 2 (both sides)
            const commissionRate = commissionRates[ticker] || 0;
            const commission = commissionRate * (isNaN(qty) ? 0 : qty) * 2;

            const tradeData = {
                id: tradeId,
                date: dateStr,
                ticker: ticker,
                type: type as "Long" | "Short",
                entryPrice: isNaN(entryPrice) ? 0 : entryPrice,
                exitPrice: isNaN(exitPrice) ? 0 : exitPrice,
                quantity: isNaN(qty) ? 0 : qty,
                pnl: isNaN(pnl) ? 0 : pnl,
                commission: commission,
                status: "Closed",
                notes: `Imported from CSV. Raw Symbol: ${rawSymbol}. Duration: ${duration}`,
                tradingAccountId: accountId,
                entryDate: entryDateStr,
                entryTime: entryTime,
                exitTime: exitTime,
                userId: user.id,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await db.insert(trades).values(tradeData);

            const noteContent = `
# Trade Details

## Ticker: ${ticker}
## Direction: ${type}
## Date: ${dateStr}
## Net P&L: $${(isNaN(pnl) ? 0 : pnl).toFixed(2)}

## Notes
- Imported from CSV. Raw Symbol: ${rawSymbol}. Duration: ${duration}

## Review
`;

            const uniqueNoteId = `note_${Date.now()}_${importedCount}`;

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
        } catch (err: any) {
            console.error(`Error processing line ${i}:`, err);
            errors.push(`Line ${i}: Error - ${err.message || String(err)}`);
        }
    }

    revalidatePath("/trades");
    revalidatePath("/");
    revalidatePath("/reports");
    revalidatePath("/notebook");

    return { success: true, count: importedCount, errors: errors.slice(0, 10) }; // Return first 10 errors
}
