"use client";

import { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";
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
}

export function AddTradeModal({ onTradeAdded }: { onTradeAdded?: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Form State
    const [formData, setFormData] = useState<Partial<TradeData>>({
        type: "Long",
        ticker: TICKERS[0]
    });

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
                notes: formData.notes || ""
            };

            // 1. Save Trade to DB
            await createTrade(tradeData);

            // 2. Auto-create Note in Notebook
            // Fetch sections to find "Trade Notes"
            const sections = await getSections();
            let tradeSection = sections.find((s: any) => s.name === "Trade Notes");
            const sectionId = tradeSection ? tradeSection.id : (sections[0]?.id || "s1");

            const newNote = {
                id: `note_${Date.now()}`,
                sectionId: sectionId,
                title: `${ticker} ${tradeData.type} (${date})`,
                content: `\n# Trade Details\n- **Ticker**: ${ticker}\n- **Direction**: ${tradeData.type}\n- **Date**: ${date}\n- **Net P&L**: $${pnl.toFixed(2)}\n\n## Notes\n${tradeData.notes || "No initial notes."}\n\n## Review\n`,
                date: date,
            };

            await createNote(newNote);

            // 3. Refresh UI
            router.refresh();
            if (onTradeAdded) onTradeAdded();
            setIsOpen(false);
            setFormData({ type: "Long" });

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
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
                            <input type="date" required className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm"
                                value={formData.date || ""}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
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

                    <div className="grid grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-2 gap-4">
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
