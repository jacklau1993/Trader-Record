"use client";

import { useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/lib/types";
import { Info } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, parseISO, compareAsc } from "date-fns";

export function WinLossChart({ trades }: { trades: Trade[] }) {
    const data = useMemo(() => {
        if (!trades || trades.length === 0) return [];

        // 1. Group by date
        const dailyTrades: Record<string, Trade[]> = {};
        trades.forEach(t => {
            if (!t.date) return;
            const dateStr = t.date; 
            if (!dailyTrades[dateStr]) dailyTrades[dateStr] = [];
            dailyTrades[dateStr].push(t);
        });

        // 2. Sort dates
        const sortedDates = Object.keys(dailyTrades).sort((a, b) => 
            compareAsc(parseISO(a), parseISO(b))
        );

        // 3. Calculate Cumulative Stats
        let cumulativeWins = 0;
        let cumulativeLosses = 0;
        let cumulativeWinSum = 0;
        let cumulativeLossSum = 0;

        return sortedDates.map(date => {
            const dayTrades = dailyTrades[date];
            dayTrades.forEach(t => {
                if (t.pnl > 0) {
                    cumulativeWins++;
                    cumulativeWinSum += t.pnl;
                } else {
                    cumulativeLosses++;
                    cumulativeLossSum += Math.abs(t.pnl);
                }
            });

            const totalTrades = cumulativeWins + cumulativeLosses;
            const winRate = totalTrades > 0 ? (cumulativeWins / totalTrades) * 100 : 0;
            const avgWin = cumulativeWins > 0 ? cumulativeWinSum / cumulativeWins : 0;
            const avgLoss = cumulativeLosses > 0 ? cumulativeLossSum / cumulativeLosses : 0;

            return {
                date: format(parseISO(date), 'MMM dd'),
                winRate: parseFloat(winRate.toFixed(2)),
                avgWin: parseFloat(avgWin.toFixed(2)),
                avgLoss: parseFloat(avgLoss.toFixed(2)),
            };
        });
    }, [trades]);

    return (
        <Card className="col-span-1 h-full">
            <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1 flex-wrap">
                    Win % - Avg Win - Avg Loss Chart
                    <TooltipProvider>
                        <UITooltip>
                            <TooltipTrigger>
                                <Info className="h-3 w-3" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Cumulative Win %, Average Win, and Average Loss over time</p>
                            </TooltipContent>
                        </UITooltip>
                    </TooltipProvider>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pb-2">
                 <div className="h-[250px] sm:h-[200px] w-full">
                    {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#64748b" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                    minTickGap={30}
                                />
                                <YAxis 
                                    yAxisId="left"
                                    orientation="left"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <YAxis 
                                    yAxisId="right"
                                    orientation="right"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                    labelStyle={{ color: '#f8fafc' }}
                                    formatter={(value: number, name: string) => {
                                        if (name === "Win %") return [`${value}%`, name];
                                        return [`$${value}`, name];
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                
                                <Line 
                                    yAxisId="right"
                                    type="monotone" 
                                    dataKey="winRate" 
                                    name="Win %" 
                                    stroke="#3b82f6" 
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line 
                                    yAxisId="left"
                                    type="monotone" 
                                    dataKey="avgWin" 
                                    name="Avg Win" 
                                    stroke="#22c55e" 
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line 
                                    yAxisId="left"
                                    type="monotone" 
                                    dataKey="avgLoss" 
                                    name="Avg Loss" 
                                    stroke="#ef4444" 
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                         <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                            No data
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
