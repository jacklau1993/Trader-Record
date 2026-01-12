"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { DollarSign, TrendingUp, Percent, Activity } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Trade, Category } from "@/lib/types";

export function TradesListClient({ trades, categories }: { trades: Trade[], categories: Category[] }) {
    const router = useRouter();

    const stats = calculateStats(trades);

    // Helper to get tag name by category
    const getTagNameByCategory = (tradeTags: string[], categoryName: string) => {
        const category = categories.find(c => c.name === categoryName);
        if (!category) return "-";
        
        // precise mapping: find a tag in this category that matches one of the trade's tags
        const tag = category.tags.find(t => tradeTags.includes(t.id));
        return tag ? tag.name : "-";
    };

    // Helper to convert rating number to grade
    const ratingToGrade = (rating: number | null | undefined): string => {
        if (rating === 3) return "A+";
        if (rating === 2) return "B+";
        if (rating === 1) return "C+";
        return "-";
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Trades</h2>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Net Cumulative P&L"
                    value={`$${stats.netPnl.toFixed(2)}`}
                    icon={DollarSign}
                    trendUp={stats.netPnl >= 0}
                />
                <StatCard
                    title="Profit Factor"
                    value={stats.profitFactor === Infinity ? "Inf" : stats.profitFactor.toFixed(2)}
                    icon={TrendingUp}
                    trendUp={stats.profitFactor >= 1.5}
                />
                <StatCard
                    title="Trade Win %"
                    value={`${stats.winRate.toFixed(1)}%`}
                    icon={Percent}
                    trendUp={stats.winRate >= 50}
                />
                <StatCard
                    title="Avg Win / Loss"
                    value={`$${stats.avgWin.toFixed(0)} / $${stats.avgLoss.toFixed(0)}`}
                    icon={Activity}
                />
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Ticker</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contracts</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">是否符合計劃</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">沒情緒還會否進場</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Grade</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Net P&L</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {trades.length === 0 ? (
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <td colSpan={9} className="p-4 text-center text-muted-foreground">No trades found.</td>
                                    </tr>
                                ) : (
                                    trades.map(trade => {
                                        const netPnl = (trade.pnl || 0) - ((trade as any).commission || 0);
                                        return (
                                        <tr
                                            key={trade.id}
                                            className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                                            onClick={() => router.push(`/trades/${trade.id}`)}
                                        >
                                            <td className="p-4 align-middle">{format(new Date(trade.date), 'MMM dd, yyyy')}</td>
                                            <td className="p-4 align-middle font-bold">{trade.ticker}</td>
                                            <td className="p-4 align-middle">
                                                <span className={`px-2 py-1 rounded text-xs ${trade.type === 'Long' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {trade.type}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle">${trade.entryPrice} &rarr; ${trade.exitPrice}</td>
                                            <td className="p-4 align-middle">{trade.contracts || trade.quantity || '-'}</td>
                                            <td className="p-4 align-middle">
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    getTagNameByCategory(trade.tags, "是否符合計劃") === "是" ? "bg-green-500/10 text-green-500" : 
                                                    getTagNameByCategory(trade.tags, "是否符合計劃") === "否" ? "bg-red-500/10 text-red-500" : "text-muted-foreground"
                                                }`}>
                                                    {getTagNameByCategory(trade.tags, "是否符合計劃")}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle">
                                                 <span className={`px-2 py-1 rounded text-xs ${
                                                    getTagNameByCategory(trade.tags, "沒情緒還會否進場") === "會" ? "bg-green-500/10 text-green-500" : 
                                                    getTagNameByCategory(trade.tags, "沒情緒還會否進場") === "不會" ? "bg-red-500/10 text-red-500" : "text-muted-foreground"
                                                }`}>
                                                    {getTagNameByCategory(trade.tags, "沒情緒還會否進場")}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    trade.rating === 3 ? "bg-green-500/10 text-green-500" :
                                                    trade.rating === 2 ? "bg-yellow-500/10 text-yellow-500" :
                                                    trade.rating === 1 ? "bg-red-500/10 text-red-500" : "text-muted-foreground"
                                                }`}>
                                                    {ratingToGrade(trade.rating)}
                                                </span>
                                            </td>
                                            <td className={`p-4 align-middle text-right font-bold ${netPnl > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                ${netPnl.toFixed(2)}
                                            </td>
                                        </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function calculateStats(trades: Trade[]) {
    let netPnl = 0;
    let grossProfit = 0;
    let grossLoss = 0;
    let wins = 0;
    let totalTrades = trades.length;

    // Helper to get Net P&L
    const getNetPnl = (t: Trade) => (t.pnl || 0) - ((t as any).commission || 0);

    trades.forEach(t => {
        const pnl = getNetPnl(t);
        netPnl += pnl;
        if (pnl > 0) {
            grossProfit += pnl;
            wins++;
        } else if (pnl < 0) {
            grossLoss += pnl;
        }
    });

    const losingTradesCount = trades.filter(t => getNetPnl(t) < 0).length;

    const profitFactor = Math.abs(grossLoss) > 0 ? (grossProfit / Math.abs(grossLoss)) : (grossProfit > 0 ? Infinity : 0);
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
    const avgWin = wins > 0 ? grossProfit / wins : 0;
    const avgLoss = losingTradesCount > 0 ? Math.abs(grossLoss) / losingTradesCount : 0;

    return {
        netPnl,
        profitFactor,
        winRate,
        avgWin,
        avgLoss
    };
}
