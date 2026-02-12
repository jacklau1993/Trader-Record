"use client";

import { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/lib/types";
import { format, parseISO, compareAsc } from "date-fns";

export function ProfitChart({ trades }: { trades: Trade[] }) {
    const data = useMemo(() => {
        if (trades.length === 0) return [];

        // Aggregate by date - using Net P&L (pnl - commission)
        const dailyPnl: Record<string, number> = {};
        trades.forEach(t => {
            const date = t.date;
            const netPnl = (t.pnl || 0) - ((t as any).commission || 0);
            dailyPnl[date] = (dailyPnl[date] || 0) + netPnl;
        });

        // Create sorted array and compute cumulative
        const sortedDates = Object.keys(dailyPnl).sort((a, b) => compareAsc(parseISO(a), parseISO(b)));

        let cumulative = 0;
        return sortedDates.map(date => {
            cumulative += dailyPnl[date];
            return {
                date: format(parseISO(date), 'MMM dd'),
                pl: cumulative, // Cumulative P&L
                daily: dailyPnl[date]
            };
        });
    }, [trades]);

    return (
        <Card className="col-span-4 min-w-0">
            <CardHeader>
                <CardTitle>Cumulative Net P&L</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px] min-w-0 min-h-[300px]">
                    {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorPl" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                    labelStyle={{ color: '#f8fafc' }}
                                    formatter={(value: any) => [`$${value}`, "Net P&L"]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="pl"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorPl)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            No data available
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
