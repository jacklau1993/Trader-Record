"use client";

import { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/lib/types";
import { Info } from "lucide-react";
import { differenceInMinutes, parseISO } from "date-fns";

export function DurationChart({ trades }: { trades: Trade[] }) {
    const data = useMemo(() => {
        if (!trades || trades.length === 0) return [];

        // Buckets
        const buckets = {
            "< 2m": 0,
            "2-5m": 0,
            "5-15m": 0,
            "15-30m": 0,
            "30m-1h": 0,
            "1h-4h": 0,
            "4h+": 0
        };

        // This assumes we can calculate duration. 
        // Since Trade type doesn't explicitly have 'closeDate' distinct from 'date' (usually 'date' is close date), 
        // and we might lack 'openDate', we'll might need to rely on a 'duration' field if it exists, or skip this if data is unavailable.
        // CHECK: lib/types.ts shows we don't have duration. 
        // Mocking behavior for now assuming 'duration' might be property or we just use random distribution to show the chart concept 
        // as originally requesting "make chart work" implying visual implementation.
        // However, I should check if I can infer it. 
        // The Trade type has `entryDate`? Let's assume standard 'date' is close and we might have 'entry_date' or similar.
        // Inspecting types shows: id, ticker, type, quantity, price, date, pnl, status, notes, tradingAccountId.
        // It does NOT have entryTime or duration. 
        // I will display a "No duration data" message or use a mock distribution if strictly requested to "make it work" visually.
        // But usually "make it work" means implementation.
        // I'll check types.ts again. 
        
        return []; 
    }, [trades]);

    // Since we likely don't have duration data, I will render a placeholder state closer to the final UI but indicating missing data
    // OR if I should assume there is a way to get it. 
    // Given the constraints, I will implement the UI shell which is robust.

    return (
        <Card className="col-span-1 h-full">
            <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    Trade Duration Performance <Info className="h-3 w-3" />
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
