"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProfitChart } from "@/components/dashboard/ProfitChart";
import { DailyProfitChart } from "@/components/dashboard/DailyProfitChart";
import { RecentTrades } from "@/components/dashboard/RecentTrades";
import { DashboardCalendar } from "@/components/dashboard/DashboardCalendar";
import { StatsRow } from "@/components/dashboard/StatsRow"; // New component
import { WinLossChart } from "@/components/dashboard/WinLossChart";
import { DurationChart } from "@/components/dashboard/DurationChart";
import { TimeOfDayHeatmap } from "@/components/dashboard/TimeOfDayHeatmap";
import { AddTradeModal } from "@/components/AddTradeModal";
import { AccountSwitcher } from "@/components/dashboard/AccountSwitcher";
import { ImportTradesModal } from "@/components/ImportTradesModal";
import { MigrationComponent } from "@/components/MigrationComponent";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { DateRange } from "@/lib/date-range";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";


export default function DashboardClient({ initialTrades, initialAccounts }: { initialTrades: any[], initialAccounts: any[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [trades, setTrades] = useState(initialTrades);
    const [accounts, setAccounts] = useState(initialAccounts);
    const [selectedAccountId, setSelectedAccountId] = useState<string>("all");
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date())
    });

    useEffect(() => {
        setTrades(initialTrades);
    }, [initialTrades]);

    useEffect(() => {
        setAccounts(initialAccounts);
    }, [initialAccounts]);

    useEffect(() => {
        const accountFromQuery = searchParams.get("account");
        if (!accountFromQuery) {
            setSelectedAccountId((prev) => (prev === "all" ? prev : "all"));
            return;
        }

        const isValidAccount = accounts.some((account) => account.id === accountFromQuery);
        const nextAccount = isValidAccount ? accountFromQuery : "all";
        setSelectedAccountId((prev) => (prev === nextAccount ? prev : nextAccount));
    }, [searchParams, accounts]);

    const handleSelectAccount = (value: string | "all") => {
        setSelectedAccountId(value);

        const nextParams = new URLSearchParams(searchParams.toString());
        if (value === "all") {
            nextParams.delete("account");
        } else {
            nextParams.set("account", value);
        }
        const nextQuery = nextParams.toString();
        router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    };


    const filteredTrades = trades.filter(t => {
        const matchesAccount = selectedAccountId === "all" || t.tradingAccountId === selectedAccountId;
        
        let matchesDate = true;
        if (dateRange?.from) {
            const tradeDate = new Date(t.date);
            if (dateRange.to) {
                matchesDate = isWithinInterval(tradeDate, { start: dateRange.from, end: dateRange.to });
            } else {
                 // If only from date is selected, exact match (or >= from if you prefer range start logic, but typically range picker handles ranges)
                 // DateRange picker usually sets 'to' as well for a range, or just 'from' for single day.
                 // Let's assume inclusive start and end of that day for single day selection or just >= start
                 matchesDate = tradeDate >= dateRange.from;
            }
        }
        
        return matchesAccount && matchesDate;
    });

    const stats = calculateStats(filteredTrades);

    function calculateStats(data: any[]) {
        if (!data || data.length === 0) return {
            netPnl: 0,
            winRate: 0,
            profitFactor: 0,
            avgWin: 0,
            avgLoss: 0,
            totalTrades: 0,
            consistencyPct: null,
            expectancyUsd: 0,
            expectancyR: null
        };

        const closedTrades = data.filter((trade) => (trade.status || "Closed").toLowerCase() !== "open");
        const statsTrades = closedTrades.length > 0 ? closedTrades : data;

        // Helper to get Net P&L (Gross - Commission)
        const getNetPnl = (t: any) => (t.pnl || 0) - (t.commission || 0);
        const getRMultiple = (t: any) => {
            if (typeof t.realizedRR === "number" && Number.isFinite(t.realizedRR)) return t.realizedRR;
            if (!Number.isFinite(t.entryPrice) || !Number.isFinite(t.exitPrice) || !Number.isFinite(t.stopLoss)) return null;

            const riskPerUnit = Math.abs(t.entryPrice - t.stopLoss);
            if (riskPerUnit <= 0) return null;

            const rewardPerUnit = t.type === "Short"
                ? t.entryPrice - t.exitPrice
                : t.exitPrice - t.entryPrice;

            return rewardPerUnit / riskPerUnit;
        };

        let totalPnl = 0;
        let wins = 0;
        let grossProfit = 0;
        let grossLoss = 0;
        let winSum = 0;
        let lossSum = 0;

        // Group trades by date for consistency calculation
        const dailyPnl: { [key: string]: number } = {};
        const rValues: number[] = [];

        statsTrades.forEach(t => {
            const netPnl = getNetPnl(t);
            totalPnl += netPnl;
            
            // Group by date for consistency
            const dateKey = t.date?.split('T')[0] || t.date;
            dailyPnl[dateKey] = (dailyPnl[dateKey] || 0) + netPnl;

            const rMultiple = getRMultiple(t);
            if (typeof rMultiple === "number" && Number.isFinite(rMultiple)) {
                rValues.push(rMultiple);
            }
            
            if (netPnl > 0) {
                wins++;
                grossProfit += netPnl;
                winSum += netPnl;
            } else {
                grossLoss += Math.abs(netPnl);
                lossSum += Math.abs(netPnl);
            }
        });

        const winRate = statsTrades.length > 0 ? (wins / statsTrades.length) * 100 : 0;
        const profitFactor = grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
        const avgWin = wins === 0 ? 0 : winSum / wins;
        const avgLoss = (statsTrades.length - wins) === 0 ? 0 : lossSum / (statsTrades.length - wins);
        const expectancyUsd = statsTrades.length > 0 ? totalPnl / statsTrades.length : 0;
        const expectancyR = rValues.length > 0
            ? rValues.reduce((sum, value) => sum + value, 0) / rValues.length
            : null;

        // Calculate Consistency Percentage
        // Formula: (Largest Single Day Profit / Total Account Profit) * 100
        let consistencyPct: number | null = null;
        if (totalPnl > 0) {
            const dailyProfits = Object.values(dailyPnl);
            const largestDayProfit = Math.max(...dailyProfits);
            consistencyPct = (largestDayProfit / totalPnl) * 100;
        }

        return {
            netPnl: totalPnl,
            winRate,
            profitFactor,
            avgWin,
            avgLoss,
            totalTrades: statsTrades.length,
            consistencyPct,
            expectancyUsd,
            expectancyR
        };
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-4 md:p-8 pt-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h2>
                </div>
                
                <div className="flex flex-col w-full sm:w-auto sm:flex-row items-stretch sm:items-center gap-2">
                    {/* Mock Filters for visuals */}
                     <div className="h-9 w-full sm:w-auto">
                        <DateRangePicker 
                            date={dateRange}
                            setDate={setDateRange}
                        />
                     </div>

                    <div className="w-[1px] h-6 bg-border mx-2 hidden sm:block"></div>

                    <AccountSwitcher
                        accounts={accounts}
                        selectedAccountId={selectedAccountId}
                        onSelect={handleSelectAccount}
                    />
                    <div className="flex gap-2 ml-2">
                         <ImportTradesModal accounts={accounts} defaultAccountId={selectedAccountId === "all" ? undefined : selectedAccountId} />
                         <AddTradeModal accounts={accounts} defaultAccountId={selectedAccountId} />
                    </div>
                </div>
            </div>

            <MigrationComponent />

            {/* Row 1: KPI Stats */}
            <StatsRow stats={stats} />

            {/* Row 2: Charts & Recent Activity */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-12 h-auto">
                <div className="md:col-span-4 h-full min-h-[300px] min-w-0">
                    <ProfitChart trades={filteredTrades} />
                </div>
                <div className="md:col-span-4 h-full min-h-[300px] min-w-0">
                    <DailyProfitChart trades={filteredTrades} />
                </div>
                <div className="md:col-span-4 h-full min-w-0">
                    <RecentTrades trades={filteredTrades} />
                </div>
            </div>

            {/* Row 3: Calendar & Advanced Metrics */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-12 items-start">
                <DashboardCalendar trades={filteredTrades} />
                
                {/* Right Column: Advanced charts */}
                <div className="md:col-span-4 space-y-4 min-w-0">
                     <div className="h-auto min-w-0">
                        <WinLossChart trades={filteredTrades} />
                     </div>
                     <div className="h-auto min-w-0">
                        <DurationChart trades={filteredTrades} />
                     </div>
                     <div className="h-auto min-w-0">
                        <TimeOfDayHeatmap trades={filteredTrades} />
                     </div>
                </div>
            </div>
        </div>
    );
}
