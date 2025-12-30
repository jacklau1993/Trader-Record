"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/lib/types";
import { format } from "date-fns";

export function RecentTrades({ trades }: { trades: Trade[] }) {
    // Sort trades by date descending and take top 6
    const recentTrades = [...trades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Recent Trades</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentTrades.length === 0 ? (
                        <div className="text-sm text-muted-foreground text-center py-4">No recent trades</div>
                    ) : (
                        recentTrades.map(trade => (
                            <div key={trade.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                                <div className="flex flex-col">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-bold text-sm truncate max-w-[80px]">{trade.ticker}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${trade.type === 'Long' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {trade.type}
                                        </span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{format(new Date(trade.date), 'MMM dd')}</span>
                                </div>
                                <div className={`font-mono font-medium text-sm whitespace-nowrap ${trade.pnl > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {trade.pnl > 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                                </div>

                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
