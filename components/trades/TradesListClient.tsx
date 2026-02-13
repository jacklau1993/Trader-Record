"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { DollarSign, TrendingUp, Percent, Activity } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Trade, Category } from "@/lib/types";
import { buildAccountLabels } from "@/lib/account-labels";

const ACCOUNT_FILTER_STORAGE_KEY = "trades:selectedAccountId";

function normalizeAccountSelection(value: string | null | undefined, validAccountIds: Set<string>) {
    if (!value || value === "all") return "all";
    return validAccountIds.has(value) ? value : "all";
}

export function TradesListClient({ trades, categories, accounts = [] }: { trades: Trade[], categories: Category[], accounts?: any[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [selectedAccountId, setSelectedAccountId] = useState<string>("all");
    const accountLabels = useMemo(() => buildAccountLabels(accounts), [accounts]);
    const validAccountIds = useMemo(() => new Set(accounts.map((account) => account.id)), [accounts]);
    const brokerAccounts = useMemo(() => accounts.filter((account) => account.type === "BROKER"), [accounts]);
    const propFirmAccounts = useMemo(() => accounts.filter((account) => account.type === "PROP_FIRM"), [accounts]);
    const queryAccount = searchParams.get("account");

    useEffect(() => {
        const fromQuery = normalizeAccountSelection(queryAccount, validAccountIds);
        if (queryAccount) {
            setSelectedAccountId((prev) => (prev === fromQuery ? prev : fromQuery));
            return;
        }

        if (typeof window === "undefined") return;
        const savedSelection = window.localStorage.getItem(ACCOUNT_FILTER_STORAGE_KEY);
        const fromStorage = normalizeAccountSelection(savedSelection, validAccountIds);
        setSelectedAccountId((prev) => (prev === fromStorage ? prev : fromStorage));
    }, [queryAccount, validAccountIds]);

    const handleAccountChange = (value: string) => {
        const normalized = normalizeAccountSelection(value, validAccountIds);
        setSelectedAccountId(normalized);

        if (typeof window !== "undefined") {
            window.localStorage.setItem(ACCOUNT_FILTER_STORAGE_KEY, normalized);
        }

        const nextParams = new URLSearchParams(searchParams.toString());
        if (normalized === "all") {
            nextParams.delete("account");
        } else {
            nextParams.set("account", normalized);
        }
        const nextQuery = nextParams.toString();
        router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    };

    const filteredTrades = useMemo(() => {
        if (selectedAccountId === "all") return trades;
        return trades.filter((trade) => trade.tradingAccountId === selectedAccountId);
    }, [selectedAccountId, trades]);

    const stats = calculateStats(filteredTrades);

    // Helper to get tag name by category
    const getTagNameByCategory = (tradeTags: string[], categoryName: string) => {
        const category = categories.find(c => c.name === categoryName);
        if (!category) return "-";
        
        // precise mapping: find a tag in this category that matches one of the trade's tags
        const tag = category.tags.find(t => tradeTags.includes(t.id));
        return tag ? tag.name : "-";
    };

    // Helper to convert rating number to grade
    const ratingToGrade = (rating: number | null | undefined): string => {
        if (rating === 3) return "A+";
        if (rating === 2) return "B+";
        if (rating === 1) return "C+";
        return "-";
    };

    const classByValue = (value: string, positiveText: string, negativeText: string) => {
        if (value === positiveText) return "border border-emerald-500/25 bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300";
        if (value === negativeText) return "border border-red-500/25 bg-red-500/15 text-red-700 dark:bg-red-500/15 dark:text-red-300";
        return "border border-border/60 bg-muted/55 text-muted-foreground";
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-3xl font-bold tracking-tight">Trades</h2>
                {accounts.length > 1 && (
                    <select
                        className="w-full sm:w-[260px] h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        value={selectedAccountId}
                        onChange={(e) => handleAccountChange(e.target.value)}
                    >
                        <option value="all">All Accounts</option>
                        {brokerAccounts.length > 0 && (
                            <optgroup label="Personal Accounts">
                                {brokerAccounts.map((account) => (
                                    <option key={account.id} value={account.id}>
                                        {accountLabels.get(account.id) || account.name}
                                    </option>
                                ))}
                            </optgroup>
                        )}
                        {propFirmAccounts.length > 0 && (
                            <optgroup label="Prop Firms">
                                {propFirmAccounts.map((account) => (
                                    <option key={account.id} value={account.id}>
                                        {accountLabels.get(account.id) || account.name}
                                    </option>
                                ))}
                            </optgroup>
                        )}
                    </select>
                )}
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Net Cumulative P&L"
                    value={`$${stats.netPnl.toFixed(2)}`}
                    icon={DollarSign}
                    trendUp={stats.netPnl >= 0}
                />
                <StatCard
                    title="Profit Factor"
                    value={stats.profitFactor === Infinity ? "Inf" : stats.profitFactor.toFixed(2)}
                    icon={TrendingUp}
                    trendUp={stats.profitFactor >= 1.5}
                />
                <StatCard
                    title="Trade Win %"
                    value={`${stats.winRate.toFixed(1)}%`}
                    icon={Percent}
                    trendUp={stats.winRate >= 50}
                />
                <StatCard
                    title="Avg Win / Loss"
                    value={`$${stats.avgWin.toFixed(0)} / $${stats.avgLoss.toFixed(0)}`}
                    icon={Activity}
                />
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b border-border/80 bg-muted/45">
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-foreground/80">Date</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-foreground/80">Ticker</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-foreground/80">Type</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-foreground/80">Price</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-foreground/80">Contracts</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-foreground/80">是否符合計劃</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-foreground/80">沒情緒還會否進場</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-foreground/80">Grade</th>
                                    <th className="h-12 px-4 text-right align-middle font-semibold text-foreground/80">Net P&L</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {filteredTrades.length === 0 ? (
                                    <tr className="border-b border-border/70 transition-colors hover:bg-accent/60">
                                        <td colSpan={9} className="p-4 text-center text-muted-foreground">
                                            {selectedAccountId === "all" ? "No trades found." : "No trades found for this account."}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTrades.map(trade => {
                                        const netPnl = (trade.pnl || 0) - ((trade as any).commission || 0);
                                        return (
                                        <tr
                                            key={trade.id}
                                            className="border-b border-border/70 transition-colors hover:bg-accent/60 cursor-pointer"
                                            onClick={() => router.push(`/trades/${trade.id}`)}
                                        >
                                            <td className="p-4 align-middle">{format(new Date(trade.date), 'MMM dd, yyyy')}</td>
                                            <td className="p-4 align-middle font-bold">{trade.ticker}</td>
                                            <td className="p-4 align-middle">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold border ${trade.type === 'Long' ? 'border-emerald-500/25 bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'border-red-500/25 bg-red-500/15 text-red-700 dark:bg-red-500/15 dark:text-red-300'}`}>
                                                    {trade.type}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle">${trade.entryPrice} &rarr; ${trade.exitPrice}</td>
                                            <td className="p-4 align-middle">{trade.contracts || trade.quantity || '-'}</td>
                                            <td className="p-4 align-middle">
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    classByValue(getTagNameByCategory(trade.tags, "是否符合計劃"), "是", "否")
                                                }`}>
                                                    {getTagNameByCategory(trade.tags, "是否符合計劃")}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle">
                                                 <span className={`px-2 py-1 rounded text-xs ${
                                                    classByValue(getTagNameByCategory(trade.tags, "沒情緒還會否進場"), "會", "不會")
                                                }`}>
                                                    {getTagNameByCategory(trade.tags, "沒情緒還會否進場")}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    trade.rating === 3 ? "border border-emerald-500/25 bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" :
                                                    trade.rating === 2 ? "border border-amber-500/25 bg-amber-500/15 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" :
                                                    trade.rating === 1 ? "border border-red-500/25 bg-red-500/15 text-red-700 dark:bg-red-500/15 dark:text-red-300" :
                                                    "border border-border/60 bg-muted/55 text-muted-foreground"
                                                }`}>
                                                    {ratingToGrade(trade.rating)}
                                                </span>
                                            </td>
                                            <td className={`p-4 align-middle text-right font-bold ${netPnl > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                ${netPnl.toFixed(2)}
                                            </td>
                                        </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function calculateStats(trades: Trade[]) {
    let netPnl = 0;
    let grossProfit = 0;
    let grossLoss = 0;
    let wins = 0;
    let totalTrades = trades.length;

    // Helper to get Net P&L
    const getNetPnl = (t: Trade) => (t.pnl || 0) - ((t as any).commission || 0);

    trades.forEach(t => {
        const pnl = getNetPnl(t);
        netPnl += pnl;
        if (pnl > 0) {
            grossProfit += pnl;
            wins++;
        } else if (pnl < 0) {
            grossLoss += pnl;
        }
    });

    const losingTradesCount = trades.filter(t => getNetPnl(t) < 0).length;

    const profitFactor = Math.abs(grossLoss) > 0 ? (grossProfit / Math.abs(grossLoss)) : (grossProfit > 0 ? Infinity : 0);
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
    const avgWin = wins > 0 ? grossProfit / wins : 0;
    const avgLoss = losingTradesCount > 0 ? Math.abs(grossLoss) / losingTradesCount : 0;

    return {
        netPnl,
        profitFactor,
        winRate,
        avgWin,
        avgLoss
    };
}
