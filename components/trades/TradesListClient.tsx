"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { DollarSign, TrendingUp, Percent, Activity } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Trade } from "@/lib/types";

export function TradesListClient({ trades }: { trades: Trade[] }) {
    const router = useRouter();

    const stats = calculateStats(trades);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
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
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Net P&L</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {trades.length === 0 ? (
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <td colSpan={6} className="p-4 text-center text-muted-foreground">No trades found.</td>
                                    </tr>
                                ) : (
                                    trades.map(trade => (
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
                                            <td className={`p-4 align-middle text-right font-bold ${trade.pnl > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                ${trade.pnl.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
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

    trades.forEach(t => {
        netPnl += t.pnl;
        if (t.pnl > 0) {
            grossProfit += t.pnl;
            wins++;
        } else if (t.pnl < 0) {
            grossLoss += t.pnl;
        }
    });

    const losingTradesCount = trades.filter(t => t.pnl < 0).length;

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
