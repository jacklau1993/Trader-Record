"use client";

import { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/lib/types";
import { Info } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function WinLossChart({ trades }: { trades: Trade[] }) {
    const data = useMemo(() => {
        if (!trades || trades.length === 0) return [];

        let wins = 0;
        let losses = 0;
        let winSum = 0;
        let lossSum = 0;

        trades.forEach(t => {
            if (t.pnl > 0) {
                wins++;
                winSum += t.pnl;
            } else {
                losses++;
                lossSum += Math.abs(t.pnl);
            }
        });

        const avgWin = wins > 0 ? winSum / wins : 0;
        const avgLoss = losses > 0 ? lossSum / losses : 0;

        return [
            { name: "Avg Win", value: avgWin, color: "#22c55e" },
            { name: "Avg Loss", value: avgLoss, color: "#ef4444" } // Display as positive bar
        ];
    }, [trades]);

    return (
        <Card className="col-span-1 h-full">
             <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    Win % - Avg Win - Avg Loss Chart
                    <TooltipProvider>
                        <UITooltip>
                            <TooltipTrigger>
                                <Info className="h-3 w-3" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Comparison of Win %, Average Win, and Average Loss</p>
                            </TooltipContent>
                        </UITooltip>
                    </TooltipProvider>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-2">
                 <div className="h-[200px]">
                    {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                    labelStyle={{ color: '#f8fafc' }}
                                    formatter={(value: any) => [`$${value.toFixed(2)}`, "Value"]}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
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
