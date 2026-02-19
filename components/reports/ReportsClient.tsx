"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";
import TagsReport from "./TagsReport";
import PerformanceReport from "./PerformanceReport";
import NoteTagsReport from "./NoteTagsReport";
import { buildAccountLabels } from "@/lib/account-labels";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { DateRange } from "@/lib/date-range";

interface ReportsClientProps {
    categories: any[];
    trades: any[];
    notes: any[];
    noteTagCategories: any[];
    noteTagMap: Record<string, string[]>;
    tagMap: Record<string, any>;
    accounts?: any[];
}

const ACCOUNT_FILTER_STORAGE_KEY = "reports:selectedAccountId";

function normalizeAccountSelection(value: string | null | undefined, validAccountIds: Set<string>) {
    if (!value || value === "all") return "all";
    return validAccountIds.has(value) ? value : "all";
}

export default function ReportsClient({ 
    categories, 
    trades,
    notes,
    noteTagCategories,
    noteTagMap,
    tagMap,
    accounts = []
}: ReportsClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [selectedNoteTagCategoryId, setSelectedNoteTagCategoryId] = useState<string>("");
    const [activeTab, setActiveTab] = useState<"performance" | "tradeTags" | "noteTags">("performance");
    const [selectedAccountId, setSelectedAccountId] = useState<string>("all");
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const accountLabels = useMemo(() => buildAccountLabels(accounts), [accounts]);
    const validAccountIds = useMemo(() => new Set(accounts.map((account) => account.id)), [accounts]);
    const brokerAccounts = useMemo(() => accounts.filter((account) => account.type === "BROKER"), [accounts]);
    const propFirmAccounts = useMemo(() => accounts.filter((account) => account.type === "PROP_FIRM"), [accounts]);
    const queryAccount = searchParams.get("account");

    useEffect(() => {
        if (categories.length > 0 && !selectedCategoryId) {
            setSelectedCategoryId(categories[0].id);
        }
    }, [categories, selectedCategoryId]);

    useEffect(() => {
        if (noteTagCategories.length > 0 && !selectedNoteTagCategoryId) {
            setSelectedNoteTagCategoryId(noteTagCategories[0].id);
        }
    }, [noteTagCategories, selectedNoteTagCategoryId]);

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
        return trades.filter((trade) => {
            const matchesAccount = selectedAccountId === "all" || trade.tradingAccountId === selectedAccountId;
            if (!matchesAccount) return false;

            if (!dateRange?.from) return true;

            const tradeDate = new Date(trade.date);
            if (Number.isNaN(tradeDate.getTime())) return false;

            const from = startOfDay(dateRange.from);
            const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);

            return isWithinInterval(tradeDate, { start: from, end: to });
        });
    }, [selectedAccountId, trades, dateRange]);

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Reports</h2>
                    <div className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        {activeTab !== "noteTags" && (
                            <DateRangePicker date={dateRange} setDate={setDateRange} />
                        )}
                        {accounts.length > 1 && activeTab !== "noteTags" && (
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
                </div>

                {/* Main Tab Switcher */}
                <div className="flex space-x-2 bg-muted p-1 rounded-lg w-fit">
                    <button
                        onClick={() => setActiveTab("performance")}
                        className={`px-3 md:px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "performance"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Performance
                    </button>
                    <button
                        onClick={() => setActiveTab("tradeTags")}
                        className={`px-3 md:px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "tradeTags"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Trade Tags
                    </button>
                    <button
                        onClick={() => setActiveTab("noteTags")}
                        className={`px-3 md:px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "noteTags"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Note Tags
                    </button>
                </div>
            </div>


            {activeTab === "performance" ? (
                <PerformanceReport trades={filteredTrades} />
            ) : activeTab === "tradeTags" ? (
                <TagsReport
                    categories={categories}
                    trades={filteredTrades}
                    selectedCategoryId={selectedCategoryId}
                    setSelectedCategoryId={setSelectedCategoryId}
                />
            ) : (
                <NoteTagsReport
                    noteTagCategories={noteTagCategories}
                    notes={notes}
                    noteTagMap={noteTagMap}
                    tagMap={tagMap}
                    selectedCategoryId={selectedNoteTagCategoryId}
                    setSelectedCategoryId={setSelectedNoteTagCategoryId}
                />
            )}
        </div>
    );
}
