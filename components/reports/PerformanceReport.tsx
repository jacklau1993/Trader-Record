"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
    AreaChart, Area, CartesianGrid
} from "recharts";
import {
    Activity, DollarSign, Percent, TrendingDown, TrendingUp
} from "lucide-react";
import {
    addDays, differenceInCalendarDays, differenceInMinutes, format, isValid, parse, parseISO
} from "date-fns";

interface PerformanceReportProps {
    trades: any[];
}

interface SideStats {
    count: number;
    wins: number;
    netPnl: number;
    winRate: number;
}

interface TickerStats {
    ticker: string;
    count: number;
    wins: number;
    winRate: number;
    netPnl: number;
    avgPnl: number;
}

interface RatingStats {
    rating: number;
    count: number;
    wins: number;
    winRate: number;
    netPnl: number;
    avgPnl: number;
}

interface EquityPoint {
    date: string;
    pnl: number;
    cumulative: number;
}

interface PerformanceStats {
    netPnL: number;
    totalGrossPnl: number;
    totalCommissions: number;
    commissionDragPct: number | null;
    profitFactor: number;
    winRate: number;
    totalTrades: number;
    avgWin: number;
    avgLoss: number;
    maxWin: number;
    maxLoss: number;
    expectancy: number;
    avgPlannedR: number | null;
    avgRealizedR: number | null;
    avgDailyVolume: number;
    loggedDays: number;
    worstDayPnl: number;
    avgRedDayPnl: number;
    avgHoldTimeMinutes: number;
    maxDrawdownAbs: number;
    maxDrawdownPct: number | null;
    recoveryDays: number | null;
    maxWinStreak: number;
    maxLossStreak: number;
    maxRedDayStreak: number;
    dailyReturnVolatility: number | null;
    longShortBreakdown: Record<"long" | "short", SideStats>;
    tickerBreakdown: TickerStats[];
    ratingBreakdown: RatingStats[];
    equityCurveData: EquityPoint[];
    dailyPnlBarData: EquityPoint[];
}

function toDatePart(value?: string | null) {
    if (!value) return null;
    return value.includes("T") ? value.split("T")[0] : value;
}

function parseDateTime(dateValue?: string | null, timeValue?: string | null) {
    if (!dateValue || !timeValue) return null;
    const datePart = toDatePart(dateValue);
    if (!datePart) return null;

    const parsed = parse(`${datePart} ${timeValue}`, "yyyy-MM-dd HH:mm", new Date());
    if (!isValid(parsed)) return null;
    return parsed;
}

function formatSignedCurrency(value: number) {
    const sign = value > 0 ? "+" : "";
    return `${sign}$${value.toFixed(2)}`;
}

export default function PerformanceReport({ trades }: PerformanceReportProps) {
    const chartAxisColor = "var(--chart-axis)";
    const chartGridColor = "var(--chart-grid)";
    const chartTooltipBackground = "var(--chart-tooltip-bg)";
    const chartTooltipBorder = "var(--chart-tooltip-border)";
    const chartTooltipText = "var(--chart-tooltip-text)";
    const chartCursorFill = "var(--chart-cursor)";

    const stats = useMemo<PerformanceStats | null>(() => {
        if (!trades || trades.length === 0) return null;

        const closedTrades = trades.filter((trade: any) => (trade.status || "Closed").toLowerCase() !== "open");
        const statsTrades = closedTrades.length > 0 ? closedTrades : trades;

        const getNetPnl = (trade: any) => (trade.pnl || 0) - (trade.commission || 0);

        const totalTrades = statsTrades.length;
        const wins = statsTrades.filter((trade: any) => getNetPnl(trade) > 0);
        const losses = statsTrades.filter((trade: any) => getNetPnl(trade) < 0);

        const winCount = wins.length;
        const lossCount = losses.length;

        const grossProfit = wins.reduce((sum: number, trade: any) => sum + getNetPnl(trade), 0);
        const grossLossAbs = losses.reduce((sum: number, trade: any) => sum + Math.abs(getNetPnl(trade)), 0);
        const netPnL = grossProfit - grossLossAbs;

        const totalGrossPnl = statsTrades.reduce((sum: number, trade: any) => sum + (trade.pnl || 0), 0);
        const totalCommissions = statsTrades.reduce((sum: number, trade: any) => sum + (trade.commission || 0), 0);
        const commissionDragPct = Math.abs(totalGrossPnl) > 0
            ? (totalCommissions / Math.abs(totalGrossPnl)) * 100
            : null;

        const winRate = totalTrades > 0 ? (winCount / totalTrades) * 100 : 0;
        const avgWin = winCount > 0 ? grossProfit / winCount : 0;
        const avgLoss = lossCount > 0 ? grossLossAbs / lossCount : 0;
        const maxWin = wins.length > 0 ? Math.max(...wins.map((trade: any) => getNetPnl(trade))) : 0;
        const maxLoss = losses.length > 0 ? Math.min(...losses.map((trade: any) => getNetPnl(trade))) : 0;
        const profitFactor = grossLossAbs > 0 ? grossProfit / grossLossAbs : grossProfit > 0 ? 100 : 0;
        const expectancy = totalTrades > 0 ? netPnL / totalTrades : 0;

        const plannedRs = statsTrades
            .map((trade: any) => trade.plannedRR)
            .filter((value: unknown) => typeof value === "number" && Number.isFinite(value)) as number[];
        const realizedRs = statsTrades
            .map((trade: any) => trade.realizedRR)
            .filter((value: unknown) => typeof value === "number" && Number.isFinite(value)) as number[];

        const avgPlannedR = plannedRs.length > 0
            ? plannedRs.reduce((sum, value) => sum + value, 0) / plannedRs.length
            : null;
        const avgRealizedR = realizedRs.length > 0
            ? realizedRs.reduce((sum, value) => sum + value, 0) / realizedRs.length
            : null;

        const totalVolume = statsTrades.reduce((sum: number, trade: any) => sum + (trade.quantity || 0), 0);

        const dailyPnLMap: Record<string, number> = {};
        statsTrades.forEach((trade: any) => {
            const dateKey = toDatePart(trade.date);
            if (!dateKey) return;
            dailyPnLMap[dateKey] = (dailyPnLMap[dateKey] || 0) + getNetPnl(trade);
        });

        const dailyEntries = Object.entries(dailyPnLMap).sort(
            (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
        );

        const uniqueDays = dailyEntries.length;
        const avgDailyVolume = uniqueDays > 0 ? totalVolume / uniqueDays : 0;
        const dailyPnLs = dailyEntries.map(([, pnl]) => pnl);

        const worstDayPnl = dailyPnLs.length > 0 ? Math.min(...dailyPnLs) : 0;
        const redDays = dailyPnLs.filter((pnl) => pnl < 0);
        const avgRedDayPnl = redDays.length > 0
            ? redDays.reduce((sum, pnl) => sum + pnl, 0) / redDays.length
            : 0;

        let cumulative = 0;
        const equityCurveData = dailyEntries.map(([date, pnl]) => {
            cumulative += pnl;
            return { date, pnl, cumulative };
        });
        const dailyPnlBarData = [...equityCurveData];

        let runningPeak = 0;
        let maxDrawdownAbs = 0;
        let maxDrawdownPct: number | null = null;
        let maxDrawdownPeak = 0;
        let maxDrawdownTroughDate: string | null = null;

        equityCurveData.forEach((point) => {
            if (point.cumulative > runningPeak) {
                runningPeak = point.cumulative;
            }

            const drawdownAbs = runningPeak - point.cumulative;
            if (drawdownAbs > maxDrawdownAbs) {
                maxDrawdownAbs = drawdownAbs;
                maxDrawdownPct = runningPeak > 0 ? (drawdownAbs / runningPeak) * 100 : null;
                maxDrawdownPeak = runningPeak;
                maxDrawdownTroughDate = point.date;
            }
        });

        let recoveryDays: number | null = null;
        if (maxDrawdownAbs > 0 && maxDrawdownTroughDate) {
            const troughIndex = equityCurveData.findIndex((point) => point.date === maxDrawdownTroughDate);
            const recoveryPoint = troughIndex >= 0
                ? equityCurveData.slice(troughIndex + 1).find((point) => point.cumulative >= maxDrawdownPeak)
                : undefined;

            if (recoveryPoint) {
                recoveryDays = differenceInCalendarDays(parseISO(recoveryPoint.date), parseISO(maxDrawdownTroughDate));
            }
        }

        let totalHoldTimeMinutes = 0;
        let holdTimeCount = 0;

        statsTrades.forEach((trade: any) => {
            const entry = parseDateTime(trade.entryDate || trade.date, trade.entryTime);
            const exitCandidate = parseDateTime(trade.date || trade.entryDate, trade.exitTime);
            if (!entry || !exitCandidate) return;

            let exit = exitCandidate;
            if (exit.getTime() < entry.getTime()) {
                exit = addDays(exit, 1);
            }

            const diff = differenceInMinutes(exit, entry);
            if (!Number.isNaN(diff) && diff >= 0) {
                totalHoldTimeMinutes += diff;
                holdTimeCount++;
            }
        });
        const avgHoldTimeMinutes = holdTimeCount > 0 ? totalHoldTimeMinutes / holdTimeCount : 0;

        const chronologicallySortedTrades = [...statsTrades].sort((a: any, b: any) => {
            const aDate = toDatePart(a.date) || "";
            const bDate = toDatePart(b.date) || "";
            const aKey = `${aDate} ${a.exitTime || a.entryTime || "00:00"}`;
            const bKey = `${bDate} ${b.exitTime || b.entryTime || "00:00"}`;
            return aKey.localeCompare(bKey);
        });

        let currentWinStreak = 0;
        let currentLossStreak = 0;
        let maxWinStreak = 0;
        let maxLossStreak = 0;

        chronologicallySortedTrades.forEach((trade: any) => {
            const net = getNetPnl(trade);
            if (net > 0) {
                currentWinStreak++;
                currentLossStreak = 0;
                maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
            } else if (net < 0) {
                currentLossStreak++;
                currentWinStreak = 0;
                maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
            } else {
                currentWinStreak = 0;
                currentLossStreak = 0;
            }
        });

        let currentRedDayStreak = 0;
        let maxRedDayStreak = 0;
        dailyEntries.forEach(([, pnl]) => {
            if (pnl < 0) {
                currentRedDayStreak++;
                maxRedDayStreak = Math.max(maxRedDayStreak, currentRedDayStreak);
            } else {
                currentRedDayStreak = 0;
            }
        });

        const dailyReturns: number[] = [];
        for (let index = 1; index < dailyPnlBarData.length; index++) {
            const previousEquity = dailyPnlBarData[index - 1].cumulative;
            const dayPnl = dailyPnlBarData[index].pnl;
            if (previousEquity === 0) continue;
            dailyReturns.push(dayPnl / Math.abs(previousEquity));
        }

        const avgDailyReturn = dailyReturns.length > 0
            ? dailyReturns.reduce((sum, value) => sum + value, 0) / dailyReturns.length
            : null;
        const dailyReturnVolatility = dailyReturns.length > 1
            ? Math.sqrt(
                dailyReturns.reduce((sum, value) => sum + Math.pow(value - (avgDailyReturn || 0), 2), 0) / dailyReturns.length
            )
            : null;

        const longShortBreakdown: Record<"long" | "short", SideStats> = {
            long: { count: 0, wins: 0, netPnl: 0, winRate: 0 },
            short: { count: 0, wins: 0, netPnl: 0, winRate: 0 }
        };

        statsTrades.forEach((trade: any) => {
            const side = `${trade.type || ""}`.toLowerCase();
            const net = getNetPnl(trade);

            if (side === "long" || side === "short") {
                longShortBreakdown[side].count += 1;
                longShortBreakdown[side].netPnl += net;
                if (net > 0) longShortBreakdown[side].wins += 1;
            }
        });

        (["long", "short"] as const).forEach((side) => {
            const sideStats = longShortBreakdown[side];
            sideStats.winRate = sideStats.count > 0 ? (sideStats.wins / sideStats.count) * 100 : 0;
        });

        const tickerMap = new Map<string, { count: number; wins: number; netPnl: number }>();
        statsTrades.forEach((trade: any) => {
            const ticker = `${trade.ticker || "Unknown"}`.toUpperCase();
            const previous = tickerMap.get(ticker) || { count: 0, wins: 0, netPnl: 0 };
            const net = getNetPnl(trade);

            tickerMap.set(ticker, {
                count: previous.count + 1,
                wins: previous.wins + (net > 0 ? 1 : 0),
                netPnl: previous.netPnl + net
            });
        });

        const tickerBreakdown: TickerStats[] = Array.from(tickerMap.entries())
            .map(([ticker, value]) => ({
                ticker,
                count: value.count,
                wins: value.wins,
                winRate: value.count > 0 ? (value.wins / value.count) * 100 : 0,
                netPnl: value.netPnl,
                avgPnl: value.count > 0 ? value.netPnl / value.count : 0
            }))
            .sort((a, b) => b.netPnl - a.netPnl)
            .slice(0, 6);

        const ratingMap = new Map<number, { count: number; wins: number; netPnl: number }>();
        statsTrades.forEach((trade: any) => {
            if (!Number.isFinite(trade.rating)) return;
            const rating = Number(trade.rating);
            const previous = ratingMap.get(rating) || { count: 0, wins: 0, netPnl: 0 };
            const net = getNetPnl(trade);

            ratingMap.set(rating, {
                count: previous.count + 1,
                wins: previous.wins + (net > 0 ? 1 : 0),
                netPnl: previous.netPnl + net
            });
        });

        const ratingBreakdown: RatingStats[] = Array.from(ratingMap.entries())
            .map(([rating, value]) => ({
                rating,
                count: value.count,
                wins: value.wins,
                winRate: value.count > 0 ? (value.wins / value.count) * 100 : 0,
                netPnl: value.netPnl,
                avgPnl: value.count > 0 ? value.netPnl / value.count : 0
            }))
            .sort((a, b) => b.rating - a.rating);

        return {
            netPnL,
            totalGrossPnl,
            totalCommissions,
            commissionDragPct,
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
            worstDayPnl,
            avgRedDayPnl,
            avgHoldTimeMinutes,
            maxDrawdownAbs,
            maxDrawdownPct,
            recoveryDays,
            maxWinStreak,
            maxLossStreak,
            maxRedDayStreak,
            dailyReturnVolatility,
            longShortBreakdown,
            tickerBreakdown,
            ratingBreakdown,
            equityCurveData,
            dailyPnlBarData
        };
    }, [trades]);

    if (!trades || trades.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border border-dashed border-border rounded-lg">
                <p>No trades found. Start trading to see performance metrics!</p>
            </div>
        );
    }

    if (!stats) return null;

    const maxDrawdownPctText = typeof stats.maxDrawdownPct === "number"
        ? ` (${stats.maxDrawdownPct.toFixed(1)}%)`
        : "";

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <StatCard
                    title="Net P&L"
                    value={`$${stats.netPnL.toFixed(2)}`}
                    icon={DollarSign}
                    trend={stats.netPnL >= 0 ? "Profitable" : "Net Loss"}
                    trendUp={stats.netPnL >= 0}
                />
                <StatCard
                    title="Profit Factor"
                    value={stats.profitFactor.toFixed(2)}
                    icon={TrendingUp}
                    trend="Gross Win / Gross Loss"
                    trendUp={stats.profitFactor >= 1}
                />
                <StatCard
                    title="Win Rate"
                    value={`${stats.winRate.toFixed(1)}%`}
                    icon={Percent}
                    trend={`${stats.totalTrades} Closed Trades`}
                    trendUp={stats.winRate >= 50}
                />
                <StatCard
                    title="Expectancy"
                    value={`$${stats.expectancy.toFixed(2)}`}
                    icon={Activity}
                    trend="Per Trade"
                    trendUp={stats.expectancy >= 0}
                />
                <StatCard
                    title="Commissions"
                    value={`$${stats.totalCommissions.toFixed(2)}`}
                    icon={TrendingDown}
                    trend={
                        stats.commissionDragPct === null
                            ? "No gross P&L baseline"
                            : `${stats.commissionDragPct.toFixed(1)}% of gross P&L`
                    }
                    trendUp={false}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="md:col-span-2 min-w-0 flex flex-col">
                    <CardHeader><CardTitle>Equity Curve</CardTitle></CardHeader>
                    <CardContent className="min-w-0 min-h-[300px] flex-1">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <AreaChart data={stats.equityCurveData}>
                                <defs>
                                    <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} opacity={0.3} />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(str) => format(parseISO(str), "MM/dd")}
                                    stroke={chartAxisColor}
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={24}
                                />
                                <YAxis
                                    stroke={chartAxisColor}
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <RechartsTooltip
                                    contentStyle={{
                                        backgroundColor: chartTooltipBackground,
                                        border: `1px solid ${chartTooltipBorder}`,
                                        color: chartTooltipText
                                    }}
                                    itemStyle={{ color: chartTooltipText }}
                                    labelStyle={{ color: chartTooltipText }}
                                />
                                <Area type="monotone" dataKey="cumulative" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPnL)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="min-w-0">
                    <CardHeader><CardTitle>Detailed Metrics</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Gross P&L</span>
                                <span className="font-medium">{formatSignedCurrency(stats.totalGrossPnl)}</span>
                            </div>
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
                                <span className="text-muted-foreground">Avg Planned R</span>
                                <span>{stats.avgPlannedR === null ? "N/A" : `${stats.avgPlannedR.toFixed(2)}R`}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Avg Realized R</span>
                                <span>{stats.avgRealizedR === null ? "N/A" : `${stats.avgRealizedR.toFixed(2)}R`}</span>
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
                                <span className="text-muted-foreground">Worst Day P&L</span>
                                <span className="text-red-500">${stats.worstDayPnl.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Avg Red Day P&L</span>
                                <span className="text-red-500">${stats.avgRedDayPnl.toFixed(2)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="min-w-0">
                <CardHeader><CardTitle>Daily Net P&L</CardTitle></CardHeader>
                <CardContent className="h-[300px] min-w-0 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <BarChart data={stats.dailyPnlBarData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} opacity={0.3} />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(str) => format(parseISO(str), "MM/dd")}
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
                            <RechartsTooltip
                                contentStyle={{
                                    backgroundColor: chartTooltipBackground,
                                    border: `1px solid ${chartTooltipBorder}`,
                                    color: chartTooltipText
                                }}
                                itemStyle={{ color: chartTooltipText }}
                                labelStyle={{ color: chartTooltipText }}
                                cursor={{ fill: chartCursorFill, opacity: 0.22 }}
                            />
                            <Bar dataKey="pnl" name="Daily P&L">
                                {stats.dailyPnlBarData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? "#22c55e" : "#ef4444"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader><CardTitle>Risk & Stability</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Max Drawdown</span>
                            <span className="text-red-500">
                                -${stats.maxDrawdownAbs.toFixed(2)}
                                {maxDrawdownPctText}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Recovery Time</span>
                            <span>{stats.recoveryDays === null ? "Not recovered yet" : `${stats.recoveryDays} days`}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Longest Win Streak</span>
                            <span>{stats.maxWinStreak}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Longest Loss Streak</span>
                            <span>{stats.maxLossStreak}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Longest Red Day Streak</span>
                            <span>{stats.maxRedDayStreak}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Daily Return Volatility</span>
                            <span>
                                {stats.dailyReturnVolatility === null
                                    ? "N/A"
                                    : `${(stats.dailyReturnVolatility * 100).toFixed(2)}%`}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Long vs Short Breakdown</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        {(["long", "short"] as const).map((side) => {
                            const sideStats = stats.longShortBreakdown[side];
                            return (
                                <div key={side} className="rounded-md border border-border p-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium capitalize">{side}</span>
                                        <span className={sideStats.netPnl >= 0 ? "text-green-500" : "text-red-500"}>
                                            {formatSignedCurrency(sideStats.netPnl)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-muted-foreground">
                                        <span>Trades</span>
                                        <span>{sideStats.count}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-muted-foreground">
                                        <span>Win Rate</span>
                                        <span>{sideStats.winRate.toFixed(1)}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Setup Quality (Rating)</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        {stats.ratingBreakdown.length === 0 && (
                            <p className="text-muted-foreground">No rated trades found.</p>
                        )}
                        {stats.ratingBreakdown.map((row: RatingStats) => (
                            <div key={row.rating} className="flex items-center justify-between rounded-md border border-border px-2 py-1.5">
                                <span>★ {row.rating}</span>
                                <span>{row.count} trades</span>
                                <span>{row.winRate.toFixed(0)}%</span>
                                <span className={row.netPnl >= 0 ? "text-green-500" : "text-red-500"}>
                                    {formatSignedCurrency(row.netPnl)}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Ticker Breakdown</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                    {stats.tickerBreakdown.length === 0 && (
                        <p className="text-muted-foreground">No ticker data available.</p>
                    )}
                    {stats.tickerBreakdown.map((row: TickerStats) => (
                        <div key={row.ticker} className="grid grid-cols-5 gap-2 items-center rounded-md border border-border px-2 py-1.5">
                            <span className="font-medium">{row.ticker}</span>
                            <span className="text-muted-foreground">{row.count} trades</span>
                            <span className="text-muted-foreground">{row.winRate.toFixed(0)}% win</span>
                            <span className="text-muted-foreground">{formatSignedCurrency(row.avgPnl)} avg</span>
                            <span className={row.netPnl >= 0 ? "text-green-500 text-right" : "text-red-500 text-right"}>
                                {formatSignedCurrency(row.netPnl)}
                            </span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
