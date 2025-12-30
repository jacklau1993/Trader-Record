"use client";

import { useState, useEffect } from "react";
import { ProfitChart } from "@/components/dashboard/ProfitChart";
import { DailyProfitChart } from "@/components/dashboard/DailyProfitChart";
import { RecentTrades } from "@/components/dashboard/RecentTrades";
import { DashboardCalendar } from "@/components/dashboard/DashboardCalendar";
import { StatsRow } from "@/components/dashboard/StatsRow"; // New component
import { AddTradeModal } from "@/components/AddTradeModal";
import { AccountSwitcher } from "@/components/dashboard/AccountSwitcher";
import { ImportTradesModal } from "@/components/ImportTradesModal";
import { MigrationComponent } from "@/components/MigrationComponent";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Filter } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function DashboardClient({ initialTrades, initialAccounts }: { initialTrades: any[], initialAccounts: any[] }) {
    const [trades, setTrades] = useState(initialTrades);
    const [accounts, setAccounts] = useState(initialAccounts);
    const [selectedAccountId, setSelectedAccountId] = useState<string>("all");

    useEffect(() => {
        setTrades(initialTrades);
    }, [initialTrades]);

    useEffect(() => {
        setAccounts(initialAccounts);
    }, [initialAccounts]);


    const filteredTrades = selectedAccountId === "all"
        ? trades
        : trades.filter(t => t.tradingAccountId === selectedAccountId);

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
        <div className="min-h-screen bg-black/95 text-foreground p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Dashboard</h2>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                    {/* Mock Filters for visuals */}
                    <Button variant="outline" size="sm" className="h-9 gap-2 bg-[#111111] border-[#27272a] text-muted-foreground hover:text-white">
                        <Filter className="h-4 w-4" />
                        Filters
                    </Button>
                    <div className="h-9 w-[180px]">
                         <Select defaultValue="this-month">
                            <SelectTrigger className="h-9 bg-[#111111] border-[#27272a]">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="this-month">This month</SelectItem>
                                <SelectItem value="last-month">Last month</SelectItem>
                                <SelectItem value="all-time">All time</SelectItem>
                            </SelectContent>
                        </Select>
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
                
                {/* Right Column: Placeholder for future advanced charts */}
                <div className="md:col-span-4 space-y-4">
                     {/* Placeholder for Win % Chart */}
                     <div className="rounded-xl border border-border bg-[#111111] p-6 h-[240px] flex items-center justify-center text-muted-foreground text-sm">
                        Win % - Avg Win - Avg Loss Chart (Coming Soon)
                     </div>
                     {/* Placeholder for Trade Duration Chart */}
                     <div className="rounded-xl border border-border bg-[#111111] p-6 h-[240px] flex items-center justify-center text-muted-foreground text-sm">
                        Trade Duration Performance (Coming Soon)
                     </div>
                </div>
            </div>
        </div>
    );
}
