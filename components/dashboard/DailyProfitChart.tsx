"use client";

import { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/lib/types";
import { format, parseISO, compareAsc } from "date-fns";

export function DailyProfitChart({ trades }: { trades: Trade[] }) {
    const chartAxisColor = "var(--chart-axis)";
    const chartGridColor = "var(--chart-grid)";
    const chartTooltipBackground = "var(--chart-tooltip-bg)";
    const chartTooltipBorder = "var(--chart-tooltip-border)";
    const chartTooltipText = "var(--chart-tooltip-text)";
    const chartCursorFill = "var(--chart-cursor)";

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
        <Card className="col-span-4 min-w-0 h-full">
            <CardHeader>
                <CardTitle>Daily Net P&L</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px] min-w-0 min-h-[300px]">
                    {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke={chartAxisColor}
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke={chartAxisColor}
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: chartTooltipBackground, border: `1px solid ${chartTooltipBorder}`, borderRadius: "8px", color: chartTooltipText }}
                                    itemStyle={{ color: chartTooltipText }}
                                    labelStyle={{ color: chartTooltipText }}
                                    cursor={{ fill: chartCursorFill, opacity: 0.22 }}
                                    formatter={(value: any) => [`$${value}`, "Net P&L"]}
                                />
                                <ReferenceLine y={0} stroke={chartAxisColor} />
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
