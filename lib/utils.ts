import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Calculate Net P&L (Gross P&L minus Commission)
 */
export function getNetPnl(trade: { pnl?: number; commission?: number }): number {
    return (trade.pnl || 0) - (trade.commission || 0);
}
