"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
    ComposedChart, Line, CartesianGrid, Legend
} from "recharts";
import { StatCard } from "@/components/dashboard/StatCard";
import { Activity, Award, TrendingDown, TrendingUp, DollarSign, Percent } from "lucide-react";

interface TagMetric {
    tagId: string;
    tagName: string;
    pnl: number;
    trades: number;
    winRate: number;
    avgWin: number;
    avgLoss: number;
    avgVolume: number;
    wins: number;
    losses: number;
}

interface TagsReportProps {
    categories: any[];
    trades: any[];
    selectedCategoryId: string;
    setSelectedCategoryId: (id: string) => void;
}

export default function TagsReport({ categories, trades, selectedCategoryId, setSelectedCategoryId }: TagsReportProps) {
    const chartAxisColor = "var(--chart-axis)";
    const chartGridColor = "var(--chart-grid)";
    const chartTooltipBackground = "var(--chart-tooltip-bg)";
    const chartTooltipBorder = "var(--chart-tooltip-border)";
    const chartTooltipText = "var(--chart-tooltip-text)";
    const legendTextColor = "var(--muted-foreground)";

    const selectedCategory = categories.find(c => c.id === selectedCategoryId);

    // --- Metrics Calculation ---
    const tagMetrics: TagMetric[] = useMemo(() => {
        if (!selectedCategory) return [];

        // Helper to get Net P&L
        const getNetPnl = (t: any) => (t.pnl || 0) - (t.commission || 0);

        return selectedCategory.tags.map((tag: any) => {
            const tagTrades = trades.filter((t: any) => t.tags && t.tags.includes(tag.id));
            const total = tagTrades.length;
            const wins = tagTrades.filter((t: any) => getNetPnl(t) > 0).length;
            const losses = total - wins;
            const pnl = tagTrades.reduce((sum: number, t: any) => sum + getNetPnl(t), 0);

            // Gross Profit/Loss for Avg Win/Loss
            const grossProfit = tagTrades.reduce((sum: number, t: any) => getNetPnl(t) > 0 ? sum + getNetPnl(t) : sum, 0);
            const grossLoss = tagTrades.reduce((sum: number, t: any) => getNetPnl(t) < 0 ? sum + getNetPnl(t) : sum, 0);

            return {
                tagId: tag.id,
                tagName: tag.name,
                pnl,
                trades: total,
                winRate: total > 0 ? (wins / total) * 100 : 0,
                avgWin: wins > 0 ? grossProfit / wins : 0,
                avgLoss: losses > 0 ? Math.abs(grossLoss) / losses : 0,
                wins,
                losses,
                avgVolume: total > 0 ? (tagTrades.reduce((sum: number, t: any) => sum + (t.quantity || 0), 0) / total) : 0
            };
        }).sort((a: any, b: any) => b.pnl - a.pnl);

    }, [trades, selectedCategory]);

    const stats = useMemo(() => {
        if (tagMetrics.length === 0) return null;

        const bestPerforming = [...tagMetrics].sort((a, b) => b.pnl - a.pnl)[0];
        const worstPerforming = [...tagMetrics].sort((a, b) => a.pnl - b.pnl)[0]; // Smallest (most negative) P&L
        const mostActive = [...tagMetrics].sort((a, b) => b.trades - a.trades)[0];
        const bestWinRate = [...tagMetrics].sort((a, b) => b.winRate - a.winRate)[0];

        return {
            bestPerforming,
            worstPerforming,
            mostActive,
            bestWinRate
        };
    }, [tagMetrics]);

    // Cross Analysis - Ticker Performance within this Category
    const tickerMetrics = useMemo(() => {
        if (!selectedCategory) return [];

        // Filter trades that have at least one tag from this category
        const contentTrades = trades.filter((t: any) => t.tags && t.tags.some((tagId: string) => selectedCategory.tags.find((ct: any) => ct.id === tagId)));

        const tickerMap: Record<string, { wins: number, total: number }> = {};

        contentTrades.forEach((t: any) => {
            const netPnl = (t.pnl || 0) - (t.commission || 0);
            if (!tickerMap[t.ticker]) tickerMap[t.ticker] = { wins: 0, total: 0 };
            tickerMap[t.ticker].total++;
            if (netPnl > 0) tickerMap[t.ticker].wins++;
        });

        return Object.entries(tickerMap).map(([ticker, data]) => ({
            ticker,
            winRate: (data.wins / data.total) * 100,
            trades: data.total
        })).sort((a, b) => b.winRate - a.winRate);
    }, [trades, selectedCategory]);

    return (
        <div className="space-y-6">
            {/* 1. Category Tabs */}
            <div className="flex space-x-2 border-b border-border pb-1 overflow-x-auto">
                {categories.map((cat: any) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategoryId(cat.id)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${selectedCategoryId === cat.id
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            {tagMetrics.length > 0 ? (
                <>
                    {/* 2. Mini Dashboard (4 Cards) */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Best Performing Tag"
                            value={stats?.bestPerforming.tagName || "-"}
                            icon={Award}
                            trend={`${stats?.bestPerforming.trades} trades | $${stats?.bestPerforming.pnl.toFixed(0)}`}
                            trendUp={true}
                        />
                        <StatCard
                            title="Least Performing Tag"
                            value={stats?.worstPerforming.tagName || "-"}
                            icon={TrendingDown}
                            trend={`${stats?.worstPerforming.trades} trades | $${stats?.worstPerforming.pnl.toFixed(0)}`}
                            trendUp={false}
                        />
                        <StatCard
                            title="Most Active Tag"
                            value={stats?.mostActive.tagName || "-"}
                            icon={Activity}
                            trend={`${stats?.mostActive.trades} trades`}
                        />
                        <StatCard
                            title="Best Win Rate Tag"
                            value={stats?.bestWinRate.tagName || "-"}
                            icon={Percent}
                            trend={`${stats?.bestWinRate.winRate.toFixed(1)}% Win Rate`}
                            trendUp={true}
                        />
                    </div>

                    {/* 3. Charts Row */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* A. Composed Chart: Net P&L (Bar) and Trade Count (Line) */}
                        <Card className="min-w-0">
                            <CardHeader><CardTitle>Net P&L & Volume by Tag</CardTitle></CardHeader>
                            <CardContent className="h-[300px] min-w-0 min-h-[300px]">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <ComposedChart data={tagMetrics}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} opacity={0.3} />
                                        <XAxis dataKey="tagName" stroke={chartAxisColor} fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis yAxisId="left" orientation="left" stroke={chartAxisColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                                        <YAxis yAxisId="right" orientation="right" stroke={chartAxisColor} fontSize={12} tickLine={false} axisLine={false} />
                                        <RechartsTooltip contentStyle={{ backgroundColor: chartTooltipBackground, border: `1px solid ${chartTooltipBorder}`, color: chartTooltipText }} itemStyle={{ color: chartTooltipText }} labelStyle={{ color: chartTooltipText }} />
                                        <Legend wrapperStyle={{ color: legendTextColor }} />
                                        <Bar yAxisId="left" dataKey="pnl" name="Net P&L" fill="#8884d8" barSize={20} radius={[4, 4, 0, 0]}>
                                            {tagMetrics.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#22c55e' : '#ef4444'} />
                                            ))}
                                        </Bar>
                                        <Line yAxisId="right" type="monotone" dataKey="trades" name="Trade Count" stroke="#fbbf24" strokeWidth={2} dot={{ r: 4 }} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* B. Win % Bar Chart */}
                        <Card className="min-w-0">
                            <CardHeader><CardTitle>Win Rate by Tag</CardTitle></CardHeader>
                            <CardContent className="h-[300px] min-w-0 min-h-[300px]">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <BarChart data={tagMetrics} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} opacity={0.3} horizontal={false} />
                                        <XAxis type="number" domain={[0, 100]} unit="%" stroke={chartAxisColor} fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis dataKey="tagName" type="category" width={100} stroke={chartAxisColor} fontSize={12} tickLine={false} axisLine={false} />
                                        <RechartsTooltip contentStyle={{ backgroundColor: chartTooltipBackground, border: `1px solid ${chartTooltipBorder}`, color: chartTooltipText }} itemStyle={{ color: chartTooltipText }} labelStyle={{ color: chartTooltipText }} cursor={{ fill: "transparent" }} />
                                        <Bar dataKey="winRate" name="Win %" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 4. Summary Table */}
                    <Card>
                        <CardHeader><CardTitle>Performance Summary</CardTitle></CardHeader>
                        <CardContent>
                            <table className="w-full text-sm">
                                <thead className="text-muted-foreground border-b border-border text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="text-left py-3 pl-4">Tag</th>
                                        <th className="text-right py-3">Win %</th>
                                        <th className="text-right py-3">Net P&L</th>
                                        <th className="text-right py-3">Trades</th>
                                        <th className="text-right py-3">Avg Volume</th>
                                        <th className="text-right py-3">Avg Win</th>
                                        <th className="text-right py-3 pr-4">Avg Loss</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tagMetrics.map(tag => (
                                        <tr key={tag.tagId} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                            <td className="py-3 pl-4 font-medium">{tag.tagName}</td>
                                            <td className={`text-right py-3 ${tag.winRate >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                                                {tag.winRate.toFixed(1)}%
                                            </td>
                                            <td className={`text-right py-3 font-bold ${tag.pnl > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                ${tag.pnl.toFixed(2)}
                                            </td>
                                            <td className="text-right py-3">{tag.trades}</td>
                                            <td className="text-right py-3 text-muted-foreground">{tag.avgVolume.toFixed(0)}</td>
                                            <td className="text-right py-3 text-green-500">${tag.avgWin.toFixed(0)}</td>
                                            <td className="text-right py-3 pr-4 text-red-500">${tag.avgLoss.toFixed(0)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    {/* 5. Cross Analysis Table */}
                    <Card>
                        <CardHeader><CardTitle>Cross Analysis (Ticker Win Rates)</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {tickerMetrics.map(tm => (
                                    <div key={tm.ticker} className="p-3 border border-border rounded-lg bg-muted/10 flex flex-col items-center justify-center">
                                        <span className="font-bold text-lg">{tm.ticker}</span>
                                        <span className={`text-sm font-bold ${tm.winRate >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                                            {tm.winRate.toFixed(1)}%
                                        </span>
                                        <span className="text-xs text-muted-foreground">{tm.trades} trades</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border border-dashed border-border rounded-lg">
                    <p>No trades or tags found for this category (or no category selected).</p>
                </div>
            )}
        </div>
    );
}
