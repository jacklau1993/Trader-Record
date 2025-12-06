"use client";

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Category, getCategories, Trade, saveTrade, getSections, saveNote, Section, Note } from "@/lib/storage";

import { Modal } from "@/components/ui/modal";

export function AddTradeModal({ onTradeAdded }: { onTradeAdded: () => void }) {
    const [isOpen, setIsOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Trade>>({
        type: "Long"
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trade: Trade = {
            id: `trade_${Date.now()}`,
            date: formData.date || new Date().toISOString().split('T')[0],
            ticker: formData.ticker?.toUpperCase() || "",
            type: formData.type as "Long" | "Short",
            entryPrice: Number(formData.entryPrice) || 0,
            exitPrice: Number(formData.exitPrice) || 0,
            quantity: Number(formData.quantity) || 0,
            pnl: Number(formData.pnl) || 0,
            tags: [],
            notes: formData.notes || ""
        };
        saveTrade(trade);

        // Auto-create Note in Notebook
        const sections = getSections();
        let tradeSection = sections.find(s => s.name === "Trade Notes");
        // If "Trade Notes" doesn't exist (e.g. user renamed it), fallback to first section or create one?
        // Current implementation has fixed sections in INITIAL_SECTIONS. 
        // "s1" is default "Trade Notes".
        const sectionId = tradeSection ? tradeSection.id : "s1";

        const newNote: Note = {
            id: `note_${Date.now()}`,
            sectionId: sectionId,
            title: `${trade.ticker} ${trade.type} (${trade.date})`,
            date: trade.date,
            content: `\n# Trade Details\n- **Ticker**: ${trade.ticker}\n- **Direction**: ${trade.type}\n- **Date**: ${trade.date}\n- **Net P&L**: $${trade.pnl.toFixed(2)}\n\n## Notes\n${trade.notes || "No initial notes."}\n\n## Review\n`,
            tags: []
        };
        saveNote(newNote);

        onTradeAdded();
        setIsOpen(false);
        setFormData({ type: "Long" }); // Reset
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
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Ticker</label>
                            <input type="text" placeholder="AAPL" required className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm uppercase"
                                onChange={e => setFormData({ ...formData, ticker: e.target.value })}
                            />
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
                                onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Entry Price</label>
                            <input type="number" step="0.01" placeholder="0.00" required className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm"
                                onChange={e => setFormData({ ...formData, entryPrice: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Exit Price</label>
                            <input type="number" step="0.01" placeholder="0.00" required className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm"
                                onChange={e => setFormData({ ...formData, exitPrice: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Net P&L ($)</label>
                        <input type="number" step="0.01" placeholder="0.00" required className="w-full bg-muted/50 border border-input rounded px-3 py-2 font-bold"
                            onChange={e => setFormData({ ...formData, pnl: Number(e.target.value) })}
                        />
                    </div>

                    <button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md font-medium">
                        Save Trade
                    </button>
                </form>
            </Modal>
        </>
    );
}
