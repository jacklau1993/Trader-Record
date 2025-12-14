"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
    AreaChart, Area, CartesianGrid
} from "recharts";
import {
    Activity, TrendingUp, TrendingDown, DollarSign, Percent, Clock, Calendar, BarChart2
} from "lucide-react";
import { format, parseISO, differenceInMinutes, parse } from "date-fns";

interface PerformanceReportProps {
    trades: any[];
}

export default function PerformanceReport({ trades }: PerformanceReportProps) {
    const stats = useMemo(() => {
        if (!trades || trades.length === 0) return null;

        const totalTrades = trades.length;
        const wins = trades.filter((t: any) => t.pnl > 0);
        const losses = trades.filter((t: any) => t.pnl <= 0);

        const winCount = wins.length;
        const lossCount = losses.length;

        const grossProfit = wins.reduce((sum: number, t: any) => sum + t.pnl, 0);
        const grossLoss = losses.reduce((sum: number, t: any) => sum + t.pnl, 0);
        const netPnL = grossProfit + grossLoss;

        const winRate = totalTrades > 0 ? (winCount / totalTrades) * 100 : 0;
        const avgWin = winCount > 0 ? grossProfit / winCount : 0;
        const avgLoss = lossCount > 0 ? Math.abs(grossLoss) / lossCount : 0;
        const maxWin = wins.length > 0 ? Math.max(...wins.map((t: any) => t.pnl)) : 0;
        const maxLoss = losses.length > 0 ? Math.min(...losses.map((t: any) => t.pnl)) : 0; // It's negative
        const profitFactor = Math.abs(grossLoss) > 0 ? grossProfit / Math.abs(grossLoss) : grossProfit > 0 ? 100 : 0;

        const expectancy = (winRate / 100 * avgWin) - ((1 - winRate / 100) * avgLoss);

        // R-Multiple
        const avgPlannedR = trades.reduce((sum: number, t: any) => sum + (t.plannedRR || 0), 0) / totalTrades;
        const avgRealizedR = trades.reduce((sum: number, t: any) => sum + (t.realizedRR || 0), 0) / totalTrades;

        // Volume
        const totalVolume = trades.reduce((sum: number, t: any) => sum + (t.quantity || 0), 0);
        const uniqueDays = new Set(trades.map((t: any) => t.date)).size;
        const avgDailyVolume = uniqueDays > 0 ? totalVolume / uniqueDays : 0;

        // Drawdown
        // Group by Date for Daily Net PnP
        const dailyPnLMap: Record<string, number> = {};
        trades.forEach((t: any) => {
            if (!dailyPnLMap[t.date]) dailyPnLMap[t.date] = 0;
            dailyPnLMap[t.date] += t.pnl;
        });
        const dailyPnLs = Object.values(dailyPnLMap);
        const maxDailyNetDrawdown = dailyPnLs.length > 0 ? Math.min(...dailyPnLs) : 0; // Worst day
        const negativeDays = dailyPnLs.filter(p => p < 0);
        const avgDailyNetDrawdown = negativeDays.length > 0 ? negativeDays.reduce((a, b) => a + b, 0) / negativeDays.length : 0;

        // Hold Time
        let totalHoldTimeMinutes = 0;
        let holdTimeCount = 0;
        trades.forEach((t: any) => {
            if (t.entryTime && t.exitTime && t.date) {
                try {
                    // entryTime/exitTime are "HH:MM", date is "YYYY-MM-DD"
                    // Construct timestamps
                    const dateStr = t.date.includes('T') ? t.date.split('T')[0] : t.date;
                    const entry = parse(`${dateStr} ${t.entryTime}`, 'yyyy-MM-dd HH:mm', new Date());
                    const exit = parse(`${dateStr} ${t.exitTime}`, 'yyyy-MM-dd HH:mm', new Date());
                    const diff = differenceInMinutes(exit, entry);
                    if (!isNaN(diff) && diff >= 0) {
                        totalHoldTimeMinutes += diff;
                        holdTimeCount++;
                    }
                } catch (e) {
                    console.warn("Error parsing dates for hold time", e);
                }
            }
        });
        const avgHoldTimeMinutes = holdTimeCount > 0 ? totalHoldTimeMinutes / holdTimeCount : 0;

        return {
            netPnL,
            profitFactor,
            winRate,
            totalTrades,
            avgWin,
            avgLoss,
            maxWin,
            maxLoss,
            expectancy,
            avgPlannedR,
            avgRealizedR,
            avgDailyVolume,
            loggedDays: uniqueDays,
            maxDailyNetDrawdown,
            avgDailyNetDrawdown,
            avgHoldTimeMinutes,

            // For Charts
            dailyPnLMap
        };
    }, [trades]);

    // Chart Data Preparation
    const equityCurveData = useMemo(() => {
        if (!trades || trades.length === 0) return [];
        // Sort trades by date
        const sortedTrades = [...trades].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

        let cumulative = 0;
        const data: any[] = [];

        // Group by day for smoother curve? Or trade by trade?
        // Let's do daily cumulative
        const dailyMap: Record<string, number> = {};
        sortedTrades.forEach(t => {
            if (!dailyMap[t.date]) dailyMap[t.date] = 0;
            dailyMap[t.date] += t.pnl;
        });

        // Convert to array and accumulate
        Object.entries(dailyMap).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()).forEach(([date, pnl]) => {
            cumulative += pnl;
            data.push({ date, pnl, cumulative });
        });
        return data;
    }, [trades]);

    if (!trades || trades.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border border-dashed border-border rounded-lg">
                <p>No trades found. Start trading to see performance metrics!</p>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-6">

            {/* Top Row: Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Net P&L"
                    value={`$${stats.netPnL.toFixed(2)}`}
                    icon={DollarSign}
                    trend={stats.netPnL >= 0 ? "Profitable" : "Loss"}
                    trendUp={stats.netPnL >= 0}
                />
                <StatCard
                    title="Profit Factor"
                    value={stats.profitFactor.toFixed(2)}
                    icon={TrendingUp}
                    trend="Gross Win / Gross Loss"
                />
                <StatCard
                    title="Win Rate"
                    value={`${stats.winRate.toFixed(1)}%`}
                    icon={Percent}
                    trend={`${stats.totalTrades} Total Trades`}
                />
                <StatCard
                    title="Expectancy"
                    value={`$${stats.expectancy.toFixed(2)}`}
                    icon={Activity}
                    trend="Per Trade"
                />
            </div>

            {/* Second Row: Detailed Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader><CardTitle>Equity Curve</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={equityCurveData}>
                                <defs>
                                    <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis dataKey="date" tickFormatter={(str) => format(parseISO(str), 'MM/dd')} fontSize={12} />
                                <YAxis fontSize={12} tickFormatter={(val) => `$${val}`} />
                                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                                <Area type="monotone" dataKey="cumulative" stroke="#8884d8" fillOpacity={1} fill="url(#colorPnL)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Metrics List */}
                <Card>
                    <CardHeader><CardTitle>Detailed Metrics</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Avg Win</span>
                                <span className="text-green-500 font-medium">${stats.avgWin.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Avg Loss</span>
                                <span className="text-red-500 font-medium">-${stats.avgLoss.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Largest Win</span>
                                <span className="text-green-500 font-medium">${stats.maxWin.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Largest Loss</span>
                                <span className="text-red-500 font-medium">${stats.maxLoss.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-border my-2"></div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Logged Days</span>
                                <span>{stats.loggedDays}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Avg Daily Volume</span>
                                <span>{stats.avgDailyVolume.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Avg Hold Time</span>
                                <span>{stats.avgHoldTimeMinutes.toFixed(0)} mins</span>
                            </div>
                            <div className="border-t border-border my-2"></div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Max Daily Drawdown</span>
                                <span className="text-red-500">${stats.maxDailyNetDrawdown.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Avg Daily Drawdown</span>
                                <span className="text-red-500">${stats.avgDailyNetDrawdown.toFixed(2)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Daily P&L Chart */}
            <Card>
                <CardHeader><CardTitle>Daily Net P&L</CardTitle></CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={equityCurveData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis dataKey="date" tickFormatter={(str) => format(parseISO(str), 'MM/dd')} fontSize={12} />
                            <YAxis fontSize={12} tickFormatter={(val) => `$${val}`} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                            <Bar dataKey="pnl" name="Daily P&L">
                                {equityCurveData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#22c55e' : '#ef4444'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

        </div>
    );
}
