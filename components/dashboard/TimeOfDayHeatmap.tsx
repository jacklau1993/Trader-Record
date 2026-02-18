"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/lib/types";

type HourBucket = {
    hour: number;
    pnl: number;
    count: number;
};

function getTradeHour(trade: Trade): number | null {
    if (trade.exitTime) {
        const hour = Number.parseInt(trade.exitTime.split(":")[0] || "", 10);
        if (Number.isInteger(hour) && hour >= 0 && hour <= 23) return hour;
    }

    if (trade.date.includes("T")) {
        const parsed = new Date(trade.date);
        if (!Number.isNaN(parsed.getTime())) return parsed.getHours();
    }

    return null;
}

export function TimeOfDayHeatmap({ trades }: { trades: Trade[] }) {
    const data = useMemo(() => {
        const buckets: HourBucket[] = Array.from({ length: 24 }, (_, hour) => ({
            hour,
            pnl: 0,
            count: 0
        }));

        trades
            .filter((trade) => (trade.status || "Closed").toLowerCase() !== "open")
            .forEach((trade) => {
                const hour = getTradeHour(trade);
                if (hour === null) return;

                const netPnl = (trade.pnl || 0) - (trade.commission || 0);
                buckets[hour].pnl += netPnl;
                buckets[hour].count += 1;
            });

        const maxAbsPnl = Math.max(...buckets.map((bucket) => Math.abs(bucket.pnl)), 1);
        return { buckets, maxAbsPnl };
    }, [trades]);

    const hasData = data.buckets.some((bucket) => bucket.count > 0);

    return (
        <Card className="col-span-1 h-full min-w-0">
            <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                    Time-of-day P&amp;L heatmap
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                {!hasData ? (
                    <div className="flex h-[140px] items-center justify-center text-xs text-muted-foreground">
                        No intraday time data available
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="grid grid-cols-6 gap-2">
                            {data.buckets.map((bucket) => {
                                const intensity = Math.min(Math.abs(bucket.pnl) / data.maxAbsPnl, 1);
                                const baseOpacity = bucket.count > 0 ? 0.18 : 0.08;
                                const opacity = baseOpacity + intensity * 0.55;
                                const backgroundColor = bucket.count === 0
                                    ? `rgba(148, 163, 184, ${baseOpacity})`
                                    : bucket.pnl >= 0
                                        ? `rgba(34, 197, 94, ${opacity})`
                                        : `rgba(239, 68, 68, ${opacity})`;

                                return (
                                    <div
                                        key={bucket.hour}
                                        className="rounded-md border border-border/60 p-2"
                                        style={{ backgroundColor }}
                                        title={`${bucket.hour.toString().padStart(2, "0")}:00 • ${bucket.count} trades • ${bucket.pnl >= 0 ? "+" : ""}$${bucket.pnl.toFixed(2)}`}
                                    >
                                        <div className="text-[10px] font-semibold text-muted-foreground">
                                            {bucket.hour.toString().padStart(2, "0")}:00
                                        </div>
                                        <div className={`text-xs font-mono mt-1 ${bucket.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                                            {bucket.count > 0 ? `${bucket.pnl >= 0 ? "+" : ""}${Math.round(bucket.pnl)}` : "—"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>Color intensity = stronger hourly P&amp;L</span>
                            <span>Hours in local trade time</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
