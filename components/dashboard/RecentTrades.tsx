"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trade } from "@/lib/types";
import { format } from "date-fns";

export function RecentTrades({ trades }: { trades: Trade[] }) {
    const parseTradeDate = (trade: Trade) => {
        const timestamp = new Date(`${trade.date}T${trade.exitTime || "00:00"}:00`).getTime();
        if (Number.isFinite(timestamp)) return timestamp;
        return new Date(trade.date).getTime();
    };

    const getRMultiple = (trade: Trade) => {
        if (typeof trade.realizedRR === "number" && Number.isFinite(trade.realizedRR)) {
            return trade.realizedRR;
        }

        if (typeof trade.stopLoss !== "number" || !Number.isFinite(trade.stopLoss)) return null;
        if (!Number.isFinite(trade.entryPrice) || !Number.isFinite(trade.exitPrice)) return null;

        const riskPerUnit = Math.abs(trade.entryPrice - trade.stopLoss);
        if (riskPerUnit <= 0) return null;

        const rewardPerUnit = trade.type === "Short"
            ? trade.entryPrice - trade.exitPrice
            : trade.exitPrice - trade.entryPrice;

        return rewardPerUnit / riskPerUnit;
    };

    const recentTrades = [...trades]
        .filter((trade) => (trade.status || "Closed").toLowerCase() !== "open")
        .sort((a, b) => parseTradeDate(b) - parseTradeDate(a))
        .slice(0, 10);

    return (
        <Card className="col-span-3 h-full">
            <CardHeader className="px-6 pt-6 pb-2">
                <h3 className="text-sm font-semibold tracking-tight">Recent closed trades</h3>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                {recentTrades.length === 0 ? (
                    <div className="text-sm text-muted-foreground text-center py-8">No recent trades</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="text-muted-foreground uppercase tracking-wide border-b border-border">
                                    <th className="py-2 px-2 text-left font-semibold">Close Date</th>
                                    <th className="py-2 px-2 text-left font-semibold">Symbol</th>
                                    <th className="py-2 px-2 text-left font-semibold">Direction</th>
                                    <th className="py-2 px-2 text-right font-semibold">R</th>
                                    <th className="py-2 px-2 text-right font-semibold">P&L</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTrades.map((trade) => {
                                    const netPnl = (trade.pnl || 0) - (trade.commission || 0);
                                    const rMultiple = getRMultiple(trade);
                                    const isLong = trade.type === "Long";

                                    return (
                                        <tr key={trade.id} className="border-b border-border/50 hover:bg-muted/30">
                                            <td className="py-2 px-2 text-muted-foreground">
                                                {format(new Date(trade.date), "MM/dd/yyyy")}
                                            </td>
                                            <td className="py-2 px-2 font-medium">{trade.ticker}</td>
                                            <td className={`py-2 px-2 font-medium ${isLong ? "text-green-500" : "text-red-500"}`}>
                                                {trade.type}
                                            </td>
                                            <td className={`py-2 px-2 text-right font-mono ${rMultiple === null ? "text-muted-foreground" : rMultiple >= 0 ? "text-green-500" : "text-red-500"}`}>
                                                {rMultiple === null ? "—" : `${rMultiple >= 0 ? "+" : ""}${rMultiple.toFixed(2)}R`}
                                            </td>
                                            <td className={`py-2 px-2 text-right font-mono font-semibold ${netPnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                                                {netPnl >= 0 ? "+" : ""}${netPnl.toFixed(0)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
