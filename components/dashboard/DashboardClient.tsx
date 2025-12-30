"use client";

import { useState, useEffect } from "react";
import { DollarSign, Percent, TrendingUp, Activity } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProfitChart } from "@/components/dashboard/ProfitChart";
import { DailyProfitChart } from "@/components/dashboard/DailyProfitChart";
import { CalendarHeatmap } from "@/components/dashboard/CalendarHeatmap";
import { RecentTrades } from "@/components/dashboard/RecentTrades";
import { AddTradeModal } from "@/components/AddTradeModal";
import { AccountSwitcher } from "@/components/dashboard/AccountSwitcher";
import { ImportTradesModal } from "@/components/ImportTradesModal";
import { MigrationComponent } from "@/components/MigrationComponent";

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

        const winRate = (wins / data.length) * 100;
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
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex flex-wrap items-center gap-2">

                    <AccountSwitcher
                        accounts={accounts}
                        selectedAccountId={selectedAccountId}
                        onSelect={setSelectedAccountId}
                    />
                    <ImportTradesModal accounts={accounts} defaultAccountId={selectedAccountId === "all" ? undefined : selectedAccountId} />
                    <AddTradeModal accounts={accounts} defaultAccountId={selectedAccountId} />
                </div>
            </div>

            <MigrationComponent />

            {/* Top Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <StatCard
                    title="Net P&L"
                    value={`$${stats.netPnl.toFixed(2)}`}
                    icon={DollarSign}
                    trend={stats.totalTrades > 0 ? `${stats.totalTrades} trades total` : "No trades yet"}
                    trendUp={stats.netPnl >= 0}
                />
                <StatCard
                    title="Win Rate"
                    value={`${stats.winRate.toFixed(1)}%`}
                    icon={Percent}
                    trendUp={stats.winRate >= 50}
                />
                <StatCard
                    title="Profit Factor"
                    value={stats.profitFactor.toFixed(2)}
                    icon={TrendingUp}
                    trendUp={stats.profitFactor >= 1.5}
                />
                <StatCard
                    title="Avg Win / Loss"
                    value={`$${stats.avgWin.toFixed(0)} / $${stats.avgLoss.toFixed(0)}`}
                    icon={Activity}
                />
                <StatCard
                    title="Avg Daily"
                    value={`$${(stats.totalTrades > 0 ? stats.netPnl / stats.totalTrades : 0).toFixed(2)}`}
                    icon={Activity}
                />
            </div>

            {/* Main Content Area */}
            <div className="grid gap-4 md:grid-cols-7">

                {/* Left Column: Charts */}
                <div className="col-span-4 space-y-4">
                    <ProfitChart trades={filteredTrades} />
                    <DailyProfitChart trades={filteredTrades} />
                </div>

                {/* Right Column: Calendar & Recent Activity */}
                <div className="col-span-3 space-y-4">
                    <CalendarHeatmap trades={filteredTrades} />
                    <RecentTrades trades={filteredTrades} />
                </div>
            </div>
        </div>
    );
}
