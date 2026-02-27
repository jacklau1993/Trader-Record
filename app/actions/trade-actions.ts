"use server";
// Force Rebuild

import { getAuthenticatedUser } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";
import { trades, tradeTags, notes, sections, tradingAccounts } from "@/db/schema";
import { eq, desc, and, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { CONTRACT_MULTIPLIERS } from "@/lib/constants";

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

type NormalizedTradeImport = {
    rawSymbol: string;
    ticker: string;
    quantity: number;
    type: "Long" | "Short";
    entryPrice: number;
    exitPrice: number;
    pnl: number;
    commission: number;
    profitTarget?: number;
    stopLoss?: number;
    entryAt: Date;
    exitAt: Date;
    duration?: string;
    notes?: string;
};

type ParseResult = {
    trades: NormalizedTradeImport[];
    errors: string[];
};

const KNOWN_TICKERS = ["MYM", "MNQ", "MGC", "YM", "NQ", "GC"];

function cleanCsvValue(value?: string): string {
    return value ? value.trim().replace(/^"|"$/g, "") : "";
}

function normalizeHeaderKey(header: string): string {
    return cleanCsvValue(header).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function parseCsvText(text: string): string[][] {
    const rows: string[][] = [];
    let currentCell = "";
    let currentRow: string[] = [];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char === '"') {
            if (inQuotes && text[i + 1] === '"') {
                currentCell += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (char === "," && !inQuotes) {
            currentRow.push(currentCell);
            currentCell = "";
            continue;
        }

        if ((char === "\n" || char === "\r") && !inQuotes) {
            if (char === "\r" && text[i + 1] === "\n") i++;
            currentRow.push(currentCell);
            if (currentRow.some((cell) => cell.trim() !== "")) {
                rows.push(currentRow);
            }
            currentRow = [];
            currentCell = "";
            continue;
        }

        currentCell += char;
    }

    if (currentCell.length > 0 || currentRow.length > 0) {
        currentRow.push(currentCell);
        if (currentRow.some((cell) => cell.trim() !== "")) {
            rows.push(currentRow);
        }
    }

    return rows;
}

function parseNumeric(value?: string): number {
    const cleaned = cleanCsvValue(value);
    if (!cleaned) return NaN;

    const negativeFromParentheses = cleaned.includes("(") && cleaned.includes(")");
    const normalized = cleaned.replace(/[$,()]/g, "");
    const parsed = Number.parseFloat(normalized);

    if (Number.isNaN(parsed)) return NaN;
    return negativeFromParentheses ? -Math.abs(parsed) : parsed;
}

function parseDateTime(value: string, preferredOrder?: "mdy" | "dmy"): Date | null {
    const cleaned = cleanCsvValue(value);
    if (!cleaned) return null;

    const withSlash = cleaned.match(
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:,?\s+)(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*(AM|PM))?(?:\s*(GMT|UTC))?$/i
    );
    if (withSlash) {
        const a = Number.parseInt(withSlash[1], 10);
        const b = Number.parseInt(withSlash[2], 10);
        const year = Number.parseInt(withSlash[3], 10);
        let hour = Number.parseInt(withSlash[4], 10);
        const minute = Number.parseInt(withSlash[5], 10);
        const second = withSlash[6] ? Number.parseInt(withSlash[6], 10) : 0;
        const ampm = withSlash[7]?.toUpperCase();
        const timezone = withSlash[8]?.toUpperCase();

        if (ampm === "AM" && hour === 12) hour = 0;
        if (ampm === "PM" && hour < 12) hour += 12;

        const useDmy = preferredOrder === "dmy" || (preferredOrder !== "mdy" && a > 12);
        const month = useDmy ? b : a;
        const day = useDmy ? a : b;

        if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            const date = timezone
                ? new Date(Date.UTC(year, month - 1, day, hour, minute, second))
                : new Date(year, month - 1, day, hour, minute, second);
            if (!Number.isNaN(date.getTime())) return date;
        }
    }

    const fallback = new Date(cleaned);
    if (!Number.isNaN(fallback.getTime())) return fallback;
    return null;
}

function formatDuration(entryAt: Date, exitAt: Date): string {
    const totalSec = Math.max(0, Math.round((exitAt.getTime() - entryAt.getTime()) / 1000));
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    if (min === 0) return `${sec}sec`;
    return `${min}min ${sec}sec`;
}

function formatTradeTime(date: Date): string {
    return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}

function getColumnIndex(headerMap: Map<string, number>, aliases: string[]): number {
    for (const alias of aliases) {
        const idx = headerMap.get(normalizeHeaderKey(alias));
        if (idx !== undefined) return idx;
    }
    return -1;
}

function resolveTickerSymbol(rawSymbol: string): string {
    const cleaned = cleanCsvValue(rawSymbol).toUpperCase();
    if (!cleaned) return cleaned;

    const withoutExchange = cleaned.includes(":") ? cleaned.split(":").pop() || cleaned : cleaned;
    const stripped = withoutExchange.replace(/[^A-Z0-9]/g, "");

    for (const ticker of KNOWN_TICKERS) {
        if (stripped.startsWith(ticker)) return ticker;
    }

    const futuresRoot = stripped.replace(/[FGHJKMNQUVXZ]\d{1,2}$/i, "");
    if (futuresRoot) {
        for (const ticker of KNOWN_TICKERS) {
            if (futuresRoot.startsWith(ticker)) return ticker;
        }
    }

    return stripped;
}

// Backward-compatible alias used elsewhere in this file.
function normalizeTicker(rawSymbol: string): string {
    return resolveTickerSymbol(rawSymbol);
}

function parseTradovatePerformanceCsv(rows: string[][], headers: string[], commissionRates: Record<string, number>): ParseResult {
    const errors: string[] = [];
    const parsedTrades: NormalizedTradeImport[] = [];
    const headerMap = new Map<string, number>();
    headers.forEach((header, index) => headerMap.set(normalizeHeaderKey(header), index));

    const idxSymbol = getColumnIndex(headerMap, ["symbol"]);
    const idxQty = getColumnIndex(headerMap, ["qty", "quantity"]);
    const idxBuyPrice = getColumnIndex(headerMap, ["buyPrice"]);
    const idxSellPrice = getColumnIndex(headerMap, ["sellPrice"]);
    const idxPnl = getColumnIndex(headerMap, ["pnl", "profit"]);
    const idxBoughtTs = getColumnIndex(headerMap, ["boughtTimestamp", "buyTimestamp", "entryTimestamp"]);
    const idxSoldTs = getColumnIndex(headerMap, ["soldTimestamp", "sellTimestamp", "exitTimestamp"]);
    const idxDuration = getColumnIndex(headerMap, ["duration"]);

    if (idxSymbol < 0 || idxQty < 0 || idxBuyPrice < 0 || idxSellPrice < 0 || idxPnl < 0 || idxBoughtTs < 0 || idxSoldTs < 0) {
        return {
            trades: [],
            errors: [
                `Tradovate format detected, but required columns are missing. Found headers: ${headers.join(", ")}`
            ]
        };
    }

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const rowNumber = i + 1;

        const rawSymbol = cleanCsvValue(row[idxSymbol]);
        const ticker = normalizeTicker(rawSymbol);
        const qty = parseNumeric(row[idxQty]);
        const buyPrice = parseNumeric(row[idxBuyPrice]);
        const sellPrice = parseNumeric(row[idxSellPrice]);
        const pnl = parseNumeric(row[idxPnl]);
        const boughtDate = parseDateTime(row[idxBoughtTs] || "", "mdy");
        const soldDate = parseDateTime(row[idxSoldTs] || "", "mdy");

        if (!boughtDate || !soldDate) {
            errors.push(`Row ${rowNumber}: Invalid bought/sold timestamps.`);
            continue;
        }
        if (Number.isNaN(qty) || Number.isNaN(buyPrice) || Number.isNaN(sellPrice) || Number.isNaN(pnl)) {
            errors.push(`Row ${rowNumber}: Invalid numeric values.`);
            continue;
        }

        const isLong = boughtDate.getTime() < soldDate.getTime();
        const entryAt = isLong ? boughtDate : soldDate;
        const exitAt = isLong ? soldDate : boughtDate;
        const entryPrice = isLong ? buyPrice : sellPrice;
        const exitPrice = isLong ? sellPrice : buyPrice;
        const duration = idxDuration >= 0 ? cleanCsvValue(row[idxDuration]) : formatDuration(entryAt, exitAt);
        const commissionRate = commissionRates[ticker] || 0;
        const commission = commissionRate * qty * 2;

        parsedTrades.push({
            rawSymbol,
            ticker,
            quantity: qty,
            type: isLong ? "Long" : "Short",
            entryPrice,
            exitPrice,
            pnl,
            commission,
            entryAt,
            exitAt,
            duration,
            notes: `Imported from Tradovate Performance CSV. Raw Symbol: ${rawSymbol}. Duration: ${duration}`
        });
    }

    return { trades: parsedTrades, errors };
}

function parseTradeseaOrdersCsv(rows: string[][], headers: string[], commissionRates: Record<string, number>): ParseResult {
    const errors: string[] = [];
    const parsedTrades: NormalizedTradeImport[] = [];
    const headerMap = new Map<string, number>();
    headers.forEach((header, index) => headerMap.set(normalizeHeaderKey(header), index));

    const idxTime = getColumnIndex(headerMap, ["time", "timestamp", "filledTime"]);
    const idxSymbol = getColumnIndex(headerMap, ["symbol", "instrument", "contract"]);
    const idxQty = getColumnIndex(headerMap, ["qty", "quantity", "filledQty"]);
    const idxSide = getColumnIndex(headerMap, ["side", "direction"]);
    const idxOrderType = getColumnIndex(headerMap, ["orderType", "type"]);
    const idxLimitPrice = getColumnIndex(headerMap, ["limitPrice", "limit"]);
    const idxStopPrice = getColumnIndex(headerMap, ["stopPrice", "stop"]);
    const idxAvgPrice = getColumnIndex(headerMap, ["avgPrice", "averagePrice", "fillPrice", "price"]);
    const idxCommission = getColumnIndex(headerMap, ["commission", "fees", "fee"]);
    const idxStatus = getColumnIndex(headerMap, ["status", "orderStatus"]);

    if (idxTime < 0 || idxSymbol < 0 || idxQty < 0 || idxSide < 0 || idxAvgPrice < 0 || idxStatus < 0) {
        return {
            trades: [],
            errors: [
                `Tradesea format detected, but required columns are missing. Found headers: ${headers.join(", ")}`
            ]
        };
    }

    type ParsedOrder = {
        rowNumber: number;
        rawSymbol: string;
        ticker: string;
        side: "Buy" | "Sell";
        qty: number;
        status: string;
        orderType: string;
        avgPrice: number;
        limitPrice: number;
        stopPrice: number;
        commissionPerQty: number;
        timestamp: Date;
    };

    type FilledOrder = ParsedOrder & { price: number };

    const allOrders: ParsedOrder[] = [];
    const filledOrders: FilledOrder[] = [];

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const rowNumber = i + 1;

        const status = cleanCsvValue(row[idxStatus]).toLowerCase();
        const rawSymbol = cleanCsvValue(row[idxSymbol]);
        const ticker = normalizeTicker(rawSymbol);
        const qty = parseNumeric(row[idxQty]);
        const sideRaw = cleanCsvValue(row[idxSide]).toLowerCase();
        const side: "Buy" | "Sell" | null = sideRaw === "buy" ? "Buy" : sideRaw === "sell" ? "Sell" : null;
        const orderType = idxOrderType >= 0 ? cleanCsvValue(row[idxOrderType]).toLowerCase() : "";
        const avgPrice = parseNumeric(row[idxAvgPrice]);
        const limitPrice = idxLimitPrice >= 0 ? parseNumeric(row[idxLimitPrice]) : NaN;
        const stopPrice = idxStopPrice >= 0 ? parseNumeric(row[idxStopPrice]) : NaN;
        const commissionValue = idxCommission >= 0 ? parseNumeric(row[idxCommission]) : NaN;
        const timestamp = parseDateTime(row[idxTime] || "", "dmy");

        if (!timestamp) {
            errors.push(`Row ${rowNumber}: Invalid time value.`);
            continue;
        }
        if (!side) {
            errors.push(`Row ${rowNumber}: Unsupported side "${row[idxSide] || ""}".`);
            continue;
        }
        if (Number.isNaN(qty) || qty <= 0) {
            errors.push(`Row ${rowNumber}: Invalid qty.`);
            continue;
        }

        const safeCommission = Number.isNaN(commissionValue) ? 0 : commissionValue;
        const parsedOrder: ParsedOrder = {
            rowNumber,
            rawSymbol,
            ticker,
            side,
            qty,
            status,
            orderType,
            avgPrice,
            limitPrice,
            stopPrice,
            commissionPerQty: safeCommission / qty,
            timestamp
        };
        allOrders.push(parsedOrder);

        if (!/\bfilled\b/.test(status)) continue;

        if (Number.isNaN(avgPrice)) {
            errors.push(`Row ${rowNumber}: Filled order is missing avg price.`);
            continue;
        }

        filledOrders.push({
            ...parsedOrder,
            price: avgPrice
        });
    }

    if (filledOrders.length === 0) {
        return {
            trades: [],
            errors: ["No filled orders were found in this Tradesea CSV."]
        };
    }

    filledOrders.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    type OpenLot = {
        side: "Buy" | "Sell";
        remainingQty: number;
        price: number;
        timestamp: Date;
        commissionPerQty: number;
        rawSymbol: string;
        orderType: string;
    };

    const openLotsByTicker = new Map<string, OpenLot[]>();

    for (const order of filledOrders) {
        const lots = openLotsByTicker.get(order.ticker) || [];
        let remaining = order.qty;

        while (remaining > 1e-9) {
            const oppositeIndex = lots.findIndex((lot) => lot.remainingQty > 1e-9 && lot.side !== order.side);
            if (oppositeIndex === -1) {
                lots.push({
                    side: order.side,
                    remainingQty: remaining,
                    price: order.price,
                    timestamp: order.timestamp,
                    commissionPerQty: order.commissionPerQty,
                    rawSymbol: order.rawSymbol,
                    orderType: order.orderType
                });
                remaining = 0;
                break;
            }

            const lot = lots[oppositeIndex];
            const matchedQty = Math.min(remaining, lot.remainingQty);
            const type: "Long" | "Short" = lot.side === "Buy" ? "Long" : "Short";
            const entryPrice = lot.price;
            const exitPrice = order.price;
            const multiplier = CONTRACT_MULTIPLIERS[order.ticker] ?? 1;
            const grossPnl =
                type === "Long"
                    ? (exitPrice - entryPrice) * matchedQty * multiplier
                    : (entryPrice - exitPrice) * matchedQty * multiplier;

            let commission = (lot.commissionPerQty + order.commissionPerQty) * matchedQty;
            if (!commission || commission < 0) {
                const commissionRate = commissionRates[order.ticker] || 0;
                commission = commissionRate * matchedQty * 2;
            }

            const entryAt = lot.timestamp;
            const exitAt = order.timestamp;
            const duration = formatDuration(entryAt, exitAt);
            let profitTarget: number | undefined;
            let stopLoss: number | undefined;

            if (order.orderType.includes("limit")) profitTarget = exitPrice;
            if (order.orderType.includes("stop")) stopLoss = exitPrice;

            parsedTrades.push({
                rawSymbol: lot.rawSymbol || order.rawSymbol,
                ticker: order.ticker,
                quantity: matchedQty,
                type,
                entryPrice,
                exitPrice,
                pnl: grossPnl,
                commission,
                profitTarget,
                stopLoss,
                entryAt,
                exitAt,
                duration,
                notes: `Imported from Tradesea Orders CSV (reconstructed from filled orders). Duration: ${duration}`
            });

            lot.remainingQty -= matchedQty;
            remaining -= matchedQty;

            if (lot.remainingQty <= 1e-9) {
                lots.splice(oppositeIndex, 1);
            }
        }

        openLotsByTicker.set(order.ticker, lots);
    }

    const nonFilledOrders = allOrders.filter((order) => !/\bfilled\b/.test(order.status));

    parsedTrades.forEach((trade) => {
        const closingSide: "Buy" | "Sell" = trade.type === "Long" ? "Sell" : "Buy";
        const lowerBoundMs = trade.entryAt.getTime() - 2 * 60 * 1000;
        const upperBoundMs = trade.exitAt.getTime() + 5 * 60 * 1000;

        const candidates = nonFilledOrders.filter((order) => {
            const t = order.timestamp.getTime();
            return (
                order.ticker === trade.ticker &&
                order.side === closingSide &&
                t >= lowerBoundMs &&
                t <= upperBoundMs
            );
        });

        const stopCandidates: Array<{ price: number; timestampMs: number }> = [];
        const targetCandidates: Array<{ price: number; timestampMs: number }> = [];

        for (const candidate of candidates) {
            const timestampMs = candidate.timestamp.getTime();
            const orderType = candidate.orderType;

            if (orderType.includes("stop")) {
                const stopPrice = !Number.isNaN(candidate.stopPrice)
                    ? candidate.stopPrice
                    : !Number.isNaN(candidate.avgPrice)
                        ? candidate.avgPrice
                        : candidate.limitPrice;
                if (!Number.isNaN(stopPrice)) {
                    stopCandidates.push({ price: stopPrice, timestampMs });
                }
            }

            if (orderType.includes("limit")) {
                const targetPrice = !Number.isNaN(candidate.limitPrice)
                    ? candidate.limitPrice
                    : !Number.isNaN(candidate.avgPrice)
                        ? candidate.avgPrice
                        : candidate.stopPrice;
                if (!Number.isNaN(targetPrice)) {
                    targetCandidates.push({ price: targetPrice, timestampMs });
                }
            }
        }

        const pickClosestToExit = (items: Array<{ price: number; timestampMs: number }>): number | undefined => {
            if (items.length === 0) return undefined;
            const exitMs = trade.exitAt.getTime();
            const sorted = [...items].sort(
                (a, b) => Math.abs(a.timestampMs - exitMs) - Math.abs(b.timestampMs - exitMs)
            );
            return sorted[0].price;
        };

        if (trade.stopLoss === undefined) {
            trade.stopLoss = pickClosestToExit(stopCandidates);
        }
        if (trade.profitTarget === undefined) {
            trade.profitTarget = pickClosestToExit(targetCandidates);
        }
    });

    openLotsByTicker.forEach((lots, ticker) => {
        const openQty = lots.reduce((sum: number, lot: OpenLot) => sum + lot.remainingQty, 0);
        if (openQty > 1e-9) {
            errors.push(`Info: ${ticker} has ${openQty.toFixed(2)} unmatched open quantity. Open positions were skipped.`);
        }
    });

    return { trades: parsedTrades, errors };
}

function parseTradovateOrdersCsv(rows: string[][], headers: string[], commissionRates: Record<string, number>): ParseResult {
    const errors: string[] = [];
    const parsedTrades: NormalizedTradeImport[] = [];
    const headerMap = new Map<string, number>();
    headers.forEach((header, index) => headerMap.set(normalizeHeaderKey(header), index));

    const idxSide = getColumnIndex(headerMap, ["B/S", "side", "direction"]);
    const idxSymbol = getColumnIndex(headerMap, ["contract", "product", "symbol"]);
    const idxStatus = getColumnIndex(headerMap, ["status"]);
    const idxOrderType = getColumnIndex(headerMap, ["type", "orderType"]);
    const idxFillTime = getColumnIndex(headerMap, ["fillTime", "time", "timestamp"]);
    const idxTimestamp = getColumnIndex(headerMap, ["timestamp", "time"]);
    const idxFilledQty = getColumnIndex(headerMap, ["filledQty", "filledquantity", "filled qty"]);
    const idxQty = getColumnIndex(headerMap, ["quantity", "qty"]);
    const idxAvgPrice = getColumnIndex(headerMap, ["avgFillPrice", "avgPrice", "averagePrice", "fillPrice", "price"]);
    const idxLimitPrice = getColumnIndex(headerMap, ["limitPrice", "limit"]);
    const idxStopPrice = getColumnIndex(headerMap, ["stopPrice", "stop"]);

    if (idxSide < 0 || idxSymbol < 0 || idxStatus < 0 || idxOrderType < 0 || idxAvgPrice < 0 || (idxFillTime < 0 && idxTimestamp < 0)) {
        return {
            trades: [],
            errors: [
                `Tradovate Orders format detected, but required columns are missing. Found headers: ${headers.join(", ")}`
            ]
        };
    }

    type ParsedOrder = {
        rowNumber: number;
        rawSymbol: string;
        ticker: string;
        side: "Buy" | "Sell";
        qty: number;
        status: string;
        orderType: string;
        avgPrice: number;
        limitPrice: number;
        stopPrice: number;
        commissionPerQty: number;
        timestamp: Date;
    };

    type FilledOrder = ParsedOrder & { price: number };

    const allOrders: ParsedOrder[] = [];
    const filledOrders: FilledOrder[] = [];

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const rowNumber = i + 1;

        const status = cleanCsvValue(row[idxStatus]).toLowerCase();
        const rawSymbol = cleanCsvValue(row[idxSymbol]);
        const ticker = normalizeTicker(rawSymbol);
        const sideRaw = cleanCsvValue(row[idxSide]).toLowerCase();
        const side: "Buy" | "Sell" | null = sideRaw === "buy" ? "Buy" : sideRaw === "sell" ? "Sell" : null;
        const orderType = cleanCsvValue(row[idxOrderType]).toLowerCase();
        const qtyFromFilled = idxFilledQty >= 0 ? parseNumeric(row[idxFilledQty]) : NaN;
        const qtyFromOrder = idxQty >= 0 ? parseNumeric(row[idxQty]) : NaN;
        const qty = Number.isNaN(qtyFromFilled) ? qtyFromOrder : qtyFromFilled;
        const avgPrice = parseNumeric(row[idxAvgPrice]);
        const limitPrice = idxLimitPrice >= 0 ? parseNumeric(row[idxLimitPrice]) : NaN;
        const stopPrice = idxStopPrice >= 0 ? parseNumeric(row[idxStopPrice]) : NaN;
        const timestampValue = (idxFillTime >= 0 ? row[idxFillTime] : "") || (idxTimestamp >= 0 ? row[idxTimestamp] : "");
        const timestamp = parseDateTime(timestampValue || "", "mdy");

        if (!timestamp) {
            errors.push(`Row ${rowNumber}: Invalid timestamp/fill time.`);
            continue;
        }
        if (!side) {
            errors.push(`Row ${rowNumber}: Unsupported side "${row[idxSide] || ""}".`);
            continue;
        }
        if (Number.isNaN(qty) || qty <= 0) {
            errors.push(`Row ${rowNumber}: Invalid quantity.`);
            continue;
        }

        const parsedOrder: ParsedOrder = {
            rowNumber,
            rawSymbol,
            ticker,
            side,
            qty,
            status,
            orderType,
            avgPrice,
            limitPrice,
            stopPrice,
            commissionPerQty: 0,
            timestamp
        };
        allOrders.push(parsedOrder);

        if (!/\bfilled\b/.test(status)) continue;

        if (Number.isNaN(avgPrice)) {
            errors.push(`Row ${rowNumber}: Filled order is missing avg price.`);
            continue;
        }

        filledOrders.push({
            ...parsedOrder,
            price: avgPrice
        });
    }

    if (filledOrders.length === 0) {
        return {
            trades: [],
            errors: ["No filled orders were found in this Tradovate Orders CSV."]
        };
    }

    filledOrders.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    type OpenLot = {
        side: "Buy" | "Sell";
        remainingQty: number;
        price: number;
        timestamp: Date;
        commissionPerQty: number;
        rawSymbol: string;
    };

    const openLotsByTicker = new Map<string, OpenLot[]>();

    for (const order of filledOrders) {
        const lots = openLotsByTicker.get(order.ticker) || [];
        let remaining = order.qty;

        while (remaining > 1e-9) {
            const oppositeIndex = lots.findIndex((lot) => lot.remainingQty > 1e-9 && lot.side !== order.side);
            if (oppositeIndex === -1) {
                lots.push({
                    side: order.side,
                    remainingQty: remaining,
                    price: order.price,
                    timestamp: order.timestamp,
                    commissionPerQty: order.commissionPerQty,
                    rawSymbol: order.rawSymbol
                });
                remaining = 0;
                break;
            }

            const lot = lots[oppositeIndex];
            const matchedQty = Math.min(remaining, lot.remainingQty);
            const type: "Long" | "Short" = lot.side === "Buy" ? "Long" : "Short";
            const entryPrice = lot.price;
            const exitPrice = order.price;
            const multiplier = CONTRACT_MULTIPLIERS[order.ticker] ?? 1;
            const grossPnl =
                type === "Long"
                    ? (exitPrice - entryPrice) * matchedQty * multiplier
                    : (entryPrice - exitPrice) * matchedQty * multiplier;

            const commissionRate = commissionRates[order.ticker] || 0;
            const commission = commissionRate * matchedQty * 2;

            const entryAt = lot.timestamp;
            const exitAt = order.timestamp;
            const duration = formatDuration(entryAt, exitAt);
            let profitTarget: number | undefined;
            let stopLoss: number | undefined;

            if (order.orderType.includes("limit")) profitTarget = exitPrice;
            if (order.orderType.includes("stop")) stopLoss = exitPrice;

            parsedTrades.push({
                rawSymbol: lot.rawSymbol || order.rawSymbol,
                ticker: order.ticker,
                quantity: matchedQty,
                type,
                entryPrice,
                exitPrice,
                pnl: grossPnl,
                commission,
                profitTarget,
                stopLoss,
                entryAt,
                exitAt,
                duration,
                notes: `Imported from Tradovate Orders CSV (reconstructed from filled orders). Duration: ${duration}`
            });

            lot.remainingQty -= matchedQty;
            remaining -= matchedQty;

            if (lot.remainingQty <= 1e-9) {
                lots.splice(oppositeIndex, 1);
            }
        }

        openLotsByTicker.set(order.ticker, lots);
    }

    const nonFilledOrders = allOrders.filter((order) => !/\bfilled\b/.test(order.status));

    parsedTrades.forEach((trade) => {
        const closingSide: "Buy" | "Sell" = trade.type === "Long" ? "Sell" : "Buy";
        const lowerBoundMs = trade.entryAt.getTime() - 2 * 60 * 1000;
        const upperBoundMs = trade.exitAt.getTime() + 5 * 60 * 1000;

        const candidates = nonFilledOrders.filter((order) => {
            const t = order.timestamp.getTime();
            return (
                order.ticker === trade.ticker &&
                order.side === closingSide &&
                t >= lowerBoundMs &&
                t <= upperBoundMs
            );
        });

        const stopCandidates: Array<{ price: number; timestampMs: number }> = [];
        const targetCandidates: Array<{ price: number; timestampMs: number }> = [];

        for (const candidate of candidates) {
            const timestampMs = candidate.timestamp.getTime();
            const orderType = candidate.orderType;

            if (orderType.includes("stop")) {
                const stopPrice = !Number.isNaN(candidate.stopPrice)
                    ? candidate.stopPrice
                    : !Number.isNaN(candidate.avgPrice)
                        ? candidate.avgPrice
                        : candidate.limitPrice;
                if (!Number.isNaN(stopPrice)) {
                    stopCandidates.push({ price: stopPrice, timestampMs });
                }
            }

            if (orderType.includes("limit")) {
                const targetPrice = !Number.isNaN(candidate.limitPrice)
                    ? candidate.limitPrice
                    : !Number.isNaN(candidate.avgPrice)
                        ? candidate.avgPrice
                        : candidate.stopPrice;
                if (!Number.isNaN(targetPrice)) {
                    targetCandidates.push({ price: targetPrice, timestampMs });
                }
            }
        }

        const pickClosestToExit = (items: Array<{ price: number; timestampMs: number }>): number | undefined => {
            if (items.length === 0) return undefined;
            const exitMs = trade.exitAt.getTime();
            const sorted = [...items].sort(
                (a, b) => Math.abs(a.timestampMs - exitMs) - Math.abs(b.timestampMs - exitMs)
            );
            return sorted[0].price;
        };

        if (trade.stopLoss === undefined) {
            trade.stopLoss = pickClosestToExit(stopCandidates);
        }
        if (trade.profitTarget === undefined) {
            trade.profitTarget = pickClosestToExit(targetCandidates);
        }
    });

    openLotsByTicker.forEach((lots, ticker) => {
        const openQty = lots.reduce((sum: number, lot: OpenLot) => sum + lot.remainingQty, 0);
        if (openQty > 1e-9) {
            errors.push(`Info: ${ticker} has ${openQty.toFixed(2)} unmatched open quantity. Open positions were skipped.`);
        }
    });

    return { trades: parsedTrades, errors };
}

function parseTradesFromCsvText(csvText: string, commissionRates: Record<string, number>): ParseResult {
    const rows = parseCsvText(csvText);
    if (rows.length < 2) {
        return { trades: [], errors: ["Empty CSV"] };
    }

    const headers = rows[0].map((header) => cleanCsvValue(header));
    const normalizedHeaders = new Set(headers.map((header) => normalizeHeaderKey(header)));

    const hasTradovateShape =
        normalizedHeaders.has("symbol") &&
        normalizedHeaders.has("qty") &&
        normalizedHeaders.has("buyprice") &&
        normalizedHeaders.has("sellprice") &&
        normalizedHeaders.has("pnl") &&
        normalizedHeaders.has("boughttimestamp") &&
        normalizedHeaders.has("soldtimestamp");

    if (hasTradovateShape) {
        return parseTradovatePerformanceCsv(rows, headers, commissionRates);
    }

    const hasTradeseaShape =
        normalizedHeaders.has("time") &&
        normalizedHeaders.has("symbol") &&
        normalizedHeaders.has("qty") &&
        normalizedHeaders.has("side") &&
        normalizedHeaders.has("avgprice") &&
        normalizedHeaders.has("status");

    if (hasTradeseaShape) {
        return parseTradeseaOrdersCsv(rows, headers, commissionRates);
    }

    const hasTradovateOrdersShape =
        normalizedHeaders.has("bs") &&
        normalizedHeaders.has("contract") &&
        normalizedHeaders.has("status") &&
        normalizedHeaders.has("type") &&
        normalizedHeaders.has("filltime") &&
        normalizedHeaders.has("avgprice");

    if (hasTradovateOrdersShape) {
        return parseTradovateOrdersCsv(rows, headers, commissionRates);
    }

    return {
        trades: [],
        errors: [
            `Unsupported CSV format. Found headers: ${headers.join(", ")}`
        ]
    };
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
    const parsed = parseTradesFromCsvText(text, commissionRates);
    if (parsed.trades.length === 0) {
        return {
            success: false,
            message: parsed.errors[0] || "No importable trades found in CSV.",
            errors: parsed.errors.slice(0, 10)
        };
    }

    let importedCount = 0;
    const errors: string[] = [...parsed.errors];

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

    for (const parsedTrade of parsed.trades) {
        try {
            const dateStr = parsedTrade.exitAt.toISOString().split("T")[0];
            const entryDateStr = parsedTrade.entryAt.toISOString().split("T")[0];

            const tradeId = `trade_${Date.now()}_${importedCount}`;

            const tradeData = {
                id: tradeId,
                date: dateStr,
                ticker: parsedTrade.ticker,
                type: parsedTrade.type,
                entryPrice: parsedTrade.entryPrice,
                exitPrice: parsedTrade.exitPrice,
                quantity: parsedTrade.quantity,
                pnl: parsedTrade.pnl,
                commission: parsedTrade.commission,
                profitTarget: parsedTrade.profitTarget,
                stopLoss: parsedTrade.stopLoss,
                status: "Closed",
                notes: parsedTrade.notes || `Imported from CSV. Raw Symbol: ${parsedTrade.rawSymbol}`,
                tradingAccountId: accountId,
                entryDate: entryDateStr,
                entryTime: formatTradeTime(parsedTrade.entryAt),
                exitTime: formatTradeTime(parsedTrade.exitAt),
                userId: user.id,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await db.insert(trades).values(tradeData);

            const noteContent = `
# Trade Details

## Ticker: ${parsedTrade.ticker}
## Direction: ${parsedTrade.type}
## Date: ${dateStr}
## Gross P&L: $${parsedTrade.pnl.toFixed(2)}
## Commission: $${parsedTrade.commission.toFixed(2)}
## Net P&L: $${(parsedTrade.pnl - parsedTrade.commission).toFixed(2)}
${parsedTrade.profitTarget !== undefined ? `## Profit Target: ${parsedTrade.profitTarget}` : ""}
${parsedTrade.stopLoss !== undefined ? `## Stop Loss: ${parsedTrade.stopLoss}` : ""}

## Notes
- ${parsedTrade.notes || `Imported from CSV. Raw Symbol: ${parsedTrade.rawSymbol}`}

## Review
`;

            const uniqueNoteId = `note_${Date.now()}_${importedCount}`;

            await db.insert(notes).values({
                id: uniqueNoteId,
                sectionId: sectionId,
                title: `${parsedTrade.ticker} ${parsedTrade.type} (${dateStr})`,
                content: noteContent,
                date: dateStr,
                tradeId: tradeId,
                userId: user.id,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            importedCount++;
        } catch (err: any) {
            console.error("Error processing imported trade:", err);
            errors.push(`Error importing parsed trade: ${err.message || String(err)}`);
        }
    }

    revalidatePath("/trades");
    revalidatePath("/");
    revalidatePath("/reports");
    revalidatePath("/notebook");

    return { success: true, count: importedCount, errors: errors.slice(0, 10) }; // Return first 10 errors
}
