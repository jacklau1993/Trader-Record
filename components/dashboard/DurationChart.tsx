"use client";

import { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/lib/types";
import { Info } from "lucide-react";
import { differenceInMinutes, parseISO } from "date-fns";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function DurationChart({ trades }: { trades: Trade[] }) {
    const data = useMemo(() => {
        if (!trades || trades.length === 0) return [];

        // Initialize buckets
        const bucketCounts: Record<string, number> = {
            "< 2m": 0,
            "2-5m": 0,
            "5-15m": 0,
            "15-30m": 0,
            "30m-1h": 0,
            "1h-4h": 0,
            "4h+": 0
        };
        
        // This is for P&L sum per bucket? Or just count? 
        // "Performance" usually implies P&L. Let's aim for Total P&L per bucket to show "Performance".
        // Use a separate object for P&L
        const bucketPnl: Record<string, number> = {
            "< 2m": 0,
            "2-5m": 0,
            "5-15m": 0,
            "15-30m": 0,
            "30m-1h": 0,
            "1h-4h": 0,
            "4h+": 0
        };

        const bucketOrder = ["< 2m", "2-5m", "5-15m", "15-30m", "30m-1h", "1h-4h", "4h+"];

        trades.forEach(t => {
            // Need entryDate/Time and date(exit)/exitTime
            if (!t.entryTime || !t.exitTime) return;

            try {
                // Construct Date objects
                // Assuming 'date' is the Close Date
                const exitDateStr = t.date; 
                // Entry Date: use entryDate field if available, else fallback to same day (intraday assumption)
                const entryDateStr = t.entryDate || t.date;

                const entryDateTime = parseISO(`${entryDateStr}T${t.entryTime}:00`);
                const exitDateTime = parseISO(`${exitDateStr}T${t.exitTime}:00`);

                const minutes = differenceInMinutes(exitDateTime, entryDateTime);
                
                if (minutes < 0) return; // Invalid data

                let bucket = "4h+";
                if (minutes < 2) bucket = "< 2m";
                else if (minutes < 5) bucket = "2-5m";
                else if (minutes < 15) bucket = "5-15m";
                else if (minutes < 30) bucket = "15-30m";
                else if (minutes < 60) bucket = "30m-1h";
                else if (minutes < 240) bucket = "1h-4h";

                bucketCounts[bucket]++;
                bucketPnl[bucket] += t.pnl;
            } catch (e) {
                // Ignore parse errors
            }
        });

        // Transform to array
        return bucketOrder.map(name => ({
            name,
            value: bucketPnl[name], // Showing P&L
            count: bucketCounts[name]
        }));
    }, [trades]);

    return (
        <Card className="col-span-1 h-full">
            <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1 flex-wrap">
                    Trade Duration Performance
                    <TooltipProvider>
                        <UITooltip>
                            <TooltipTrigger>
                                <Info className="h-3 w-3" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Performance based on trade duration</p>
                            </TooltipContent>
                        </UITooltip>
                    </TooltipProvider>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pb-2">
                 <div className="h-[250px] sm:h-[200px] w-full">
                    {data.some(d => d.count > 0) ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={40} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                    labelStyle={{ color: '#f8fafc' }}
                                    formatter={(value: any, name: any, props: any) => [
                                        `$${value.toFixed(2)}`, 
                                        `Net P&L (${props.payload.count} trades)`
                                    ]}
                                />
                                <ReferenceLine x={0} stroke="#64748b" />
                                <Bar dataKey="value" barSize={15} radius={[0, 4, 4, 0]}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#22c55e' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                         <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                            No duration data available
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <Card className="col-span-1 h-full">
            <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    Trade Duration Performance
                    <TooltipProvider>
                        <UITooltip>
                            <TooltipTrigger>
                                <Info className="h-3 w-3" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Performance based on trade duration</p>
                            </TooltipContent>
                        </UITooltip>
                    </TooltipProvider>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-2">
                 <div className="h-[200px] flex items-center justify-center text-muted-foreground text-xs">
                    Duration data unavailable
                </div>
            </CardContent>
        </Card>
    );
}
