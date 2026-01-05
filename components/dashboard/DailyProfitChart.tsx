"use client";

import { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/lib/types";
import { format, parseISO, compareAsc } from "date-fns";

export function DailyProfitChart({ trades }: { trades: Trade[] }) {
    const data = useMemo(() => {
        if (trades.length === 0) return [];

        // Using Net P&L (pnl - commission)
        const dailyPnl: Record<string, number> = {};
        trades.forEach(t => {
            const date = t.date;
            const netPnl = (t.pnl || 0) - ((t as any).commission || 0);
            dailyPnl[date] = (dailyPnl[date] || 0) + netPnl;
        });

        const sortedDates = Object.keys(dailyPnl).sort((a, b) => compareAsc(parseISO(a), parseISO(b)));

        // Take the last 30 days of activity ideally, or all
        return sortedDates.map(date => ({
            date: format(parseISO(date), 'MMM dd'),
            pl: dailyPnl[date]
        }));
    }, [trades]);

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Daily Net P&L</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px]">
                    {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
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
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                    labelStyle={{ color: '#f8fafc' }}
                                    cursor={{ fill: '#334155', opacity: 0.2 }}
                                    formatter={(value: any) => [`$${value}`, "Net P&L"]}
                                />
                                <ReferenceLine y={0} stroke="#64748b" />
                                <Bar dataKey="pl">
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.pl >= 0 ? '#22c55e' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
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
