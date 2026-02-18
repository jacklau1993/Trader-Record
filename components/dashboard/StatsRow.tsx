"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface DashboardStats {
    netPnl: number;
    winRate: number;
    profitFactor: number;
    avgWin: number;
    avgLoss: number;
    totalTrades: number;
    consistencyPct: number | null;
    expectancyUsd: number;
    expectancyR: number | null;
}

interface StatsRowProps {
    stats: DashboardStats;
}

export function StatsRow({ stats }: StatsRowProps) {
    const GAUGE_TRACK_COLOR = "var(--chart-track)";

    // Data for Win % Gauge (Semi-circle)
    const winData = [
        { name: 'Win', value: stats.winRate },
        { name: 'Loss', value: 100 - stats.winRate }
    ];
    // Colors: Green for win, muted track for remainder
    const WIN_COLORS = ['#22c55e', GAUGE_TRACK_COLOR];

    // Data for Profit Factor (Radial/Ring)
    const pfValue = Math.min(stats.profitFactor, 10); // Cap for visualization
    const pfData = [
        { name: 'Factor', value: pfValue },
        { name: 'Remaining', value: 10 - pfValue }
    ];
    const PF_COLORS = ['#22c55e', GAUGE_TRACK_COLOR];

    // Data for Consistency % Gauge (Semi-circle) - Green if <= 50%, Red if > 50%
    const consistencyValue = stats.consistencyPct ?? 0;
    const isConsistencyPassing = consistencyValue <= 50;
    const consistencyData = [
        { name: 'Consistency', value: Math.min(consistencyValue, 100) },
        { name: 'Remaining', value: Math.max(100 - consistencyValue, 0) }
    ];
    const CONSISTENCY_COLORS = isConsistencyPassing ? ['#22c55e', GAUGE_TRACK_COLOR] : ['#ef4444', GAUGE_TRACK_COLOR];

    return (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {/* NET P&L */}
            <Card className="min-w-0">
                <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        Net P&L
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="h-3 w-3" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Total realized profit and loss</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardTitle>
                    <div />
                </CardHeader>
                <CardContent className="px-4 pb-4">
                    <div className={`text-2xl font-bold ${stats.netPnl >= 0 ? "text-red-500" : "text-red-500"} ${stats.netPnl > 0 ? "!text-green-500" : ""}`}>
                        ${stats.netPnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </CardContent>
            </Card>

            {/* WIN RATE */}
            <Card className="relative overflow-hidden min-w-0">
                <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        Trade win %
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="h-3 w-3" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Percentage of winning trades</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 flex items-center justify-between">
                    <div className="text-2xl font-bold text-foreground">
                        {stats.winRate.toFixed(2)}%
                    </div>
                    {/* Small Semi-Circle Chart */}
                    <div className="h-10 w-20 min-w-[80px] min-h-[40px]">
                         <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <PieChart>
                                <Pie
                                    data={winData}
                                    cx="50%"
                                    cy="100%"
                                    startAngle={180}
                                    endAngle={0}
                                    innerRadius={25}
                                    outerRadius={35}
                                    paddingAngle={0}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {winData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={WIN_COLORS[index % WIN_COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* PROFIT FACTOR */}
            <Card className="min-w-0">
                <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        Profit factor
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="h-3 w-3" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Gross profit divided by gross loss</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 flex items-center justify-between">
                    <div className="text-2xl font-bold text-foreground">
                        {stats.profitFactor.toFixed(2)}
                    </div>
                    {/* Small Ring Chart */}
                    <div className="h-10 w-10 min-w-[40px] min-h-[40px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <PieChart>
                                <Pie
                                    data={pfData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={12}
                                    outerRadius={18}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pfData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PF_COLORS[index % PF_COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* AVG WIN/LOSS */}
            <Card className="min-w-0">
                <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        Avg win/loss trade
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="h-3 w-3" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Average win amount vs Average loss amount</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                    <div className="flex flex-col gap-1">
                        <div className="text-2xl font-bold text-foreground">
                            {(stats.avgWin / (stats.avgLoss || 1)).toFixed(2)}
                        </div>
                        <div className="flex items-center text-[10px] gap-2">
                             <div className="flex items-center gap-1 text-green-500">
                                <span>${stats.avgWin.toFixed(0)}</span>
                                <div className="h-1 w-8 bg-green-500/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-full"></div>
                                </div>
                             </div>
                             <div className="flex items-center gap-1 text-red-500">
                                <div className="h-1 w-8 bg-red-500/20 rounded-full overflow-hidden">
                                     <div className="h-full bg-red-500 w-full"></div>
                                </div>
                                <span>-${stats.avgLoss.toFixed(0)}</span>
                             </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

             {/* TRADE EXPECTANCY */}
             <Card className="min-w-0">
                <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        Trade expectancy
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="h-3 w-3" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Average net result per trade in both dollars and R</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardTitle>

                </CardHeader>
                <CardContent className="px-4 pb-4">
                    <div className={`text-2xl font-bold ${stats.expectancyUsd >= 0 ? "text-green-500" : "text-red-500"}`}>
                        ${stats.expectancyUsd.toFixed(2)}
                    </div>
                    <div className={`mt-1 text-xs font-mono ${stats.expectancyR === null ? "text-muted-foreground" : stats.expectancyR >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {stats.expectancyR === null
                            ? "R: N/A"
                            : `R: ${stats.expectancyR >= 0 ? "+" : ""}${stats.expectancyR.toFixed(2)}R`}
                    </div>
                </CardContent>
            </Card>

             {/* CONSISTENCY % */}
             <Card className="relative overflow-hidden min-w-0">
                <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        Consistency %
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="h-3 w-3" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[250px]">
                                    <p>(Largest Day Profit / Total Profit) × 100</p>
                                    <p className="text-xs text-muted-foreground mt-1">Target: ≤50% for consistent trading</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 flex items-center justify-between">
                    <div className={`text-2xl font-bold ${stats.consistencyPct === null ? 'text-muted-foreground' : isConsistencyPassing ? 'text-green-500' : 'text-red-500'}`}>
                        {stats.consistencyPct === null ? 'N/A' : `${stats.consistencyPct.toFixed(1)}%`}
                    </div>
                    {/* Small Semi-Circle Chart */}
                    {stats.consistencyPct !== null && (
                        <div className="h-10 w-20 min-w-[80px] min-h-[40px]">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <PieChart>
                                    <Pie
                                        data={consistencyData}
                                        cx="50%"
                                        cy="100%"
                                        startAngle={180}
                                        endAngle={0}
                                        innerRadius={25}
                                        outerRadius={35}
                                        paddingAngle={0}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {consistencyData.map((entry, index) => (
                                            <Cell key={`cell-consistency-${index}`} fill={CONSISTENCY_COLORS[index % CONSISTENCY_COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
