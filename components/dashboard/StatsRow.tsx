"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, ExternalLink } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface DashboardStats {
    netPnl: number;
    winRate: number;
    profitFactor: number;
    avgWin: number;
    avgLoss: number;
    totalTrades: number;
}

interface StatsRowProps {
    stats: DashboardStats;
}

export function StatsRow({ stats }: StatsRowProps) {
    // Data for Win % Gauge (Semi-circle)
    const winData = [
        { name: 'Win', value: stats.winRate },
        { name: 'Loss', value: 100 - stats.winRate }
    ];
    // Colors: Green for win, dark for loss background
    const WIN_COLORS = ['#22c55e', '#1e293b']; 

    // Data for Profit Factor (Radial/Ring)
    const pfValue = Math.min(stats.profitFactor, 10); // Cap for visualization
    const pfData = [
        { name: 'Factor', value: pfValue },
        { name: 'Remaining', value: 10 - pfValue }
    ];
    const PF_COLORS = ['#22c55e', '#1e293b'];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* NET P&L */}
            <Card>
                <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        Net P&L <Info className="h-3 w-3" />
                    </CardTitle>
                    <div className="h-6 w-6 rounded bg-[#1e293b] flex items-center justify-center text-blue-500">
                        <span className="text-[10px]">👁</span>
                    </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                    <div className={`text-2xl font-bold ${stats.netPnl >= 0 ? "text-red-500" : "text-red-500"} ${stats.netPnl > 0 ? "!text-green-500" : ""}`}>
                        ${stats.netPnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </CardContent>
            </Card>

            {/* WIN RATE */}
            <Card className="relative overflow-hidden">
                <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        Trade win % <Info className="h-3 w-3" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 flex items-center justify-between">
                    <div className="text-2xl font-bold text-white">
                        {stats.winRate.toFixed(2)}%
                    </div>
                    {/* Small Semi-Circle Chart */}
                    <div className="h-10 w-20">
                         <ResponsiveContainer width="100%" height="100%">
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
            <Card>
                <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        Profit factor <Info className="h-3 w-3" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 flex items-center justify-between">
                    <div className="text-2xl font-bold text-white">
                        {stats.profitFactor.toFixed(2)}
                    </div>
                    {/* Small Ring Chart */}
                    <div className="h-10 w-10">
                        <ResponsiveContainer width="100%" height="100%">
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
            <Card>
                <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        Avg win/loss trade <Info className="h-3 w-3" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                    <div className="flex flex-col gap-1">
                        <div className="text-2xl font-bold text-white">
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
             <Card>
                <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        Trade expectancy <Info className="h-3 w-3" />
                    </CardTitle>
                    <ExternalLink className="h-3 w-3 text-blue-500 cursor-pointer" />
                </CardHeader>
                <CardContent className="px-4 pb-4">
                    <div className={`text-2xl font-bold ${((stats.winRate / 100 * stats.avgWin) - ((1 - stats.winRate / 100) * stats.avgLoss)) >= 0 ? "text-green-500" : "text-red-500"}`}>
                        ${((stats.winRate / 100 * stats.avgWin) - ((1 - stats.winRate / 100) * stats.avgLoss)).toFixed(2)}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
