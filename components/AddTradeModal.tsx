"use client";

import { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import Flatpickr from "react-flatpickr";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";
import { createTrade } from "@/app/actions/trade-actions";
import { createNote, getSections } from "@/app/actions/note-actions";
import { TICKERS, CONTRACT_MULTIPLIERS } from "@/lib/constants";
import { useEffect } from "react";

// Types matching DB schema roughly, or inferred
// For form we can keep simple types
interface TradeData {
    date: string;
    ticker: string;
    type: "Long" | "Short";
    entryPrice: number;
    exitPrice: number;
    quantity: number;
    pnl: number;
    notes: string;
    tradingAccountId?: string;
    entryDate?: string;
    entryTime?: string;
    exitTime?: string;
    tradeId?: string;
}

export function AddTradeModal({ onTradeAdded, accounts = [], defaultAccountId }: { onTradeAdded?: () => void, accounts?: any[], defaultAccountId?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const dateInputClassName = "w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm";
    const timeInputClassName = dateInputClassName;

    // Form State
    const [formData, setFormData] = useState<Partial<TradeData>>({
        type: "Long",
        ticker: TICKERS[0],
        tradingAccountId: defaultAccountId === "all" ? (accounts && accounts.length > 0 ? accounts[0].id : undefined) : defaultAccountId
    });

    useEffect(() => {
        // Update default account if defaultAccountId changes and form isn't dirty (simplified logic)
        if (!isOpen) {
            setFormData(prev => ({
                ...prev,
                tradingAccountId: defaultAccountId === "all" ? (accounts && accounts.length > 0 ? accounts[0].id : undefined) : defaultAccountId
            }));
        }
    }, [defaultAccountId, accounts, isOpen]);


    useEffect(() => {
        const calculatePnL = () => {
            const entry = Number(formData.entryPrice) || 0;
            const exit = Number(formData.exitPrice) || 0;
            const quantity = Number(formData.quantity) || 0;
            const ticker = formData.ticker || "";
            const type = formData.type || "Long";

            if (!entry || !exit || !quantity || !ticker) return;

            const multiplier = CONTRACT_MULTIPLIERS[ticker] || 0;
            let rawPnL = (exit - entry) * quantity * multiplier;

            if (type === "Short") {
                rawPnL = (entry - exit) * quantity * multiplier;
            }

            setFormData(prev => {
                if (prev.pnl === Number(rawPnL.toFixed(2))) return prev;
                return { ...prev, pnl: Number(rawPnL.toFixed(2)) };
            });
        };
        calculatePnL();
    }, [formData.entryPrice, formData.exitPrice, formData.quantity, formData.ticker, formData.type]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const tradeId = `trade_${Date.now()}`;
            const date = formData.date || new Date().toISOString().split('T')[0];
            const ticker = formData.ticker?.toUpperCase() || "";
            const pnl = Number(formData.pnl) || 0;

            const tradeData = {
                id: tradeId,
                date: date,
                ticker: ticker,
                type: formData.type as "Long" | "Short",
                entryPrice: Number(formData.entryPrice) || 0,
                exitPrice: Number(formData.exitPrice) || 0,
                quantity: Number(formData.quantity) || 0,
                pnl: pnl,
                status: "Closed",
                notes: formData.notes || "",
                tradingAccountId: formData.tradingAccountId,
                entryDate: formData.entryDate || date, // Default to main date if not set
                entryTime: formData.entryTime,
                exitTime: formData.exitTime
            };

            // 1. Save Trade to DB
            await createTrade(tradeData);

            // ... (rest is same)
            // 2. Auto-create Note in Notebook
            // Fetch sections to find "Trade Notes"
            const sections = await getSections();
            let tradeSection = sections.find((s: any) => s.name === "Trade Notes");
            const sectionId = tradeSection ? tradeSection.id : (sections[0]?.id || "s1");

            const newNote = {
                id: `note_${Date.now()}`,
                sectionId: sectionId,
                title: `${ticker} ${tradeData.type} (${date})`,
                content: `<p><strong># Trade Details</strong></p><p>- <strong>Ticker</strong>: ${ticker}<br>- <strong>Direction</strong>: ${tradeData.type}<br>- <strong>Date</strong>: ${date}<br>- <strong>Net P&L</strong>: $${pnl.toFixed(2)}</p><p><strong>## Notes</strong></p><p>${(tradeData.notes || "No initial notes.").replace(/\n/g, "<br>")}</p><p><strong>## Review</strong></p><p></p>`,
                date: date,
                tradeId: tradeId
            };

            await createNote(newNote);

            // 3. Refresh UI
            router.refresh();
            if (onTradeAdded) onTradeAdded();
            setIsOpen(false);
            setFormData({
                type: "Long",
                ticker: TICKERS[0],
                tradingAccountId: defaultAccountId === "all" ? (accounts && accounts.length > 0 ? accounts[0].id : undefined) : defaultAccountId
            });

        } catch (error) {
            console.error("Failed to save trade:", error);
            alert("Failed to save trade. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium flex items-center shadow-lg shadow-primary/20 transition-all hover:scale-105"
            >
                <Plus className="h-4 w-4 mr-2" />
                New Trade
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Log New Trade</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Account Selection */}
                    {accounts && accounts.length > 0 && (
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Account</label>
                            <select
                                className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm"
                                value={formData.tradingAccountId || ""}
                                onChange={e => setFormData({ ...formData, tradingAccountId: e.target.value })}
                            >
                                <option value="" disabled>Select Account</option>
                                <optgroup label="Personal Accounts">
                                    {accounts.filter(a => a.type === "BROKER").map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                                    ))}
                                </optgroup>
                                <optgroup label="Prop Firms">
                                    {accounts.filter(a => a.type === "PROP_FIRM").map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                                    ))}
                                </optgroup>
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Exit Date (Close)</label>
                            <Flatpickr
                                options={{ dateFormat: "Y-m-d", disableMobile: true }}
                                value={formData.date || ""}
                                onChange={(_dates, dateStr) => setFormData({ ...formData, date: dateStr })}
                                className={dateInputClassName}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Ticker</label>
                            <select
                                className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm uppercase"
                                value={formData.ticker || ""}
                                onChange={e => setFormData({ ...formData, ticker: e.target.value })}
                            >
                                {TICKERS.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Direction</label>
                            <div className="flex bg-muted/50 rounded p-1">
                                {["Long", "Short"].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: type as any })}
                                        className={`flex-1 text-sm py-1 rounded transition-colors ${formData.type === type ? (type === 'Long' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500') : 'text-muted-foreground'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Quantity</label>
                            <input type="number" placeholder="0" className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm"
                                value={formData.quantity || ""}
                                onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Entry Price</label>
                            <input type="number" step="0.01" placeholder="0.00" required className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm"
                                value={formData.entryPrice || ""}
                                onChange={e => setFormData({ ...formData, entryPrice: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Exit Price</label>
                            <input type="number" step="0.01" placeholder="0.00" required className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm"
                                value={formData.exitPrice || ""}
                                onChange={e => setFormData({ ...formData, exitPrice: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                             <label className="text-xs font-medium text-muted-foreground mb-1 block">Entry Date</label>
                             <Flatpickr
                                options={{ dateFormat: "Y-m-d", disableMobile: true }}
                                value={formData.entryDate || ""}
                                onChange={(_dates, dateStr) => setFormData({ ...formData, entryDate: dateStr })}
                                className={dateInputClassName}
                            />
                        </div>
                        <div>
                            {/* Spacer or potentially move Entry Time here? */}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Entry Time</label>
                            <Flatpickr
                                options={{
                                    enableTime: true,
                                    noCalendar: true,
                                    dateFormat: "H:i",
                                    time_24hr: true,
                                    minuteIncrement: 1,
                                    disableMobile: true,
                                }}
                                value={formData.entryTime || ""}
                                onChange={(_dates, dateStr) => setFormData({ ...formData, entryTime: dateStr })}
                                className={timeInputClassName}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Exit Time</label>
                            <Flatpickr
                                options={{
                                    enableTime: true,
                                    noCalendar: true,
                                    dateFormat: "H:i",
                                    time_24hr: true,
                                    minuteIncrement: 1,
                                    disableMobile: true,
                                }}
                                value={formData.exitTime || ""}
                                onChange={(_dates, dateStr) => setFormData({ ...formData, exitTime: dateStr })}
                                className={timeInputClassName}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Net P&L ($)</label>
                        <input type="number" step="0.01" placeholder="0.00" required className="w-full bg-muted/50 border border-input rounded px-3 py-2 font-bold"
                            value={formData.pnl || ""}
                            readOnly
                        />
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md font-medium flex justify-center items-center">
                        {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Save Trade"}
                    </button>
                </form>
            </Modal>
        </>
    );
}
