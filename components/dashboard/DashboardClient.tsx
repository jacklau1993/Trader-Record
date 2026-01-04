"use client";

import { useState, useEffect } from "react";
import { ProfitChart } from "@/components/dashboard/ProfitChart";
import { DailyProfitChart } from "@/components/dashboard/DailyProfitChart";
import { RecentTrades } from "@/components/dashboard/RecentTrades";
import { DashboardCalendar } from "@/components/dashboard/DashboardCalendar";
import { StatsRow } from "@/components/dashboard/StatsRow"; // New component
import { WinLossChart } from "@/components/dashboard/WinLossChart";
import { DurationChart } from "@/components/dashboard/DurationChart";
import { AddTradeModal } from "@/components/AddTradeModal";
import { AccountSwitcher } from "@/components/dashboard/AccountSwitcher";
import { ImportTradesModal } from "@/components/ImportTradesModal";
import { MigrationComponent } from "@/components/MigrationComponent";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { DateRange } from "@/lib/date-range";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";


export default function DashboardClient({ initialTrades, initialAccounts }: { initialTrades: any[], initialAccounts: any[] }) {
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
            netPnl: 0, winRate: 0, profitFactor: 0, avgWin: 0, avgLoss: 0, totalTrades: 0
        };

        let totalPnl = 0;
        let wins = 0;
        let grossProfit = 0;
        let grossLoss = 0;
        let winSum = 0;
        let lossSum = 0;

        data.forEach(t => {
            totalPnl += t.pnl;
            if (t.pnl > 0) {
                wins++;
                grossProfit += t.pnl;
                winSum += t.pnl;
            } else {
                grossLoss += Math.abs(t.pnl);
                lossSum += Math.abs(t.pnl);
            }
        });

        const winRate = data.length > 0 ? (wins / data.length) * 100 : 0;
        const profitFactor = grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
        const avgWin = wins === 0 ? 0 : winSum / wins;
        const avgLoss = (data.length - wins) === 0 ? 0 : lossSum / (data.length - wins);

        return {
            netPnl: totalPnl,
            winRate,
            profitFactor,
            avgWin,
            avgLoss,
            totalTrades: data.length
        };
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-4 md:p-8 pt-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Dashboard</h2>
                </div>
                
                <div className="flex flex-col w-full sm:w-auto sm:flex-row items-stretch sm:items-center gap-2">
                    {/* Mock Filters for visuals */}
                     <div className="h-9 w-full sm:w-auto">
                        <DateRangePicker 
                            date={dateRange}
                            setDate={setDateRange}
                        />
                     </div>

                    <div className="w-[1px] h-6 bg-[#27272a] mx-2 hidden sm:block"></div>

                    <AccountSwitcher
                        accounts={accounts}
                        selectedAccountId={selectedAccountId}
                        onSelect={setSelectedAccountId}
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
                <div className="md:col-span-4 h-full min-h-[300px]">
                    <ProfitChart trades={filteredTrades} />
                </div>
                <div className="md:col-span-4 h-full min-h-[300px]">
                    <DailyProfitChart trades={filteredTrades} />
                </div>
                <div className="md:col-span-4 h-full">
                    <RecentTrades trades={filteredTrades} />
                </div>
            </div>

            {/* Row 3: Calendar & Advanced Metrics */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-12">
                <DashboardCalendar trades={filteredTrades} />
                
                {/* Right Column: Advanced charts */}
                <div className="md:col-span-4 space-y-4">
                     <div className="h-auto">
                        <WinLossChart trades={filteredTrades} />
                     </div>
                     <div className="h-auto">
                        <DurationChart trades={filteredTrades} />
                     </div>
                </div>
            </div>
        </div>
    );
}
