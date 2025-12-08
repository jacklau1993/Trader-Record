"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { updateTrade } from "@/app/actions/trade-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade, Category } from "@/lib/types";

export function TradeDetailClient({ trade: initialTrade, categories }: { trade: Trade, categories: Category[] }) {
    const router = useRouter();
    const [trade, setTrade] = useState<Trade>(initialTrade);
    const [isSaving, setIsSaving] = useState(false);

    // Auto-calculation logic
    const calculateMetrics = useCallback((currentTrade: Trade) => {
        // Must ensure fields exist (could be null from DB)
        const entryPrice = currentTrade.entryPrice ?? 0;
        const exitPrice = currentTrade.exitPrice ?? 0;
        const stopLoss = currentTrade.stopLoss ?? 0;
        const profitTarget = currentTrade.profitTarget ?? 0;
        const type = currentTrade.type;

        let updates: Partial<Trade> = {};
        let changed = false;

        // 1. Points Captured
        if (entryPrice && exitPrice) {
            const points = type === 'Long' ? exitPrice - entryPrice : entryPrice - exitPrice;
            const roundedPoints = Number(points.toFixed(2));
            if (currentTrade.points !== roundedPoints) {
                updates.points = roundedPoints;
                changed = true;
            }
        }

        // 2. Risk (R)
        let risk = 0;
        if (entryPrice && stopLoss) {
            risk = Math.abs(entryPrice - stopLoss);
        }

        // 3. Planned R:R
        if (risk > 0 && profitTarget) {
            const reward = Math.abs(profitTarget - entryPrice);
            const rr = Number((reward / risk).toFixed(2));
            if (currentTrade.plannedRR !== rr) {
                updates.plannedRR = rr;
                changed = true;
            }
        }

        // 4. Realized R:R
        if (risk > 0 && exitPrice) {
            const realizedReward = type === 'Long' ? (exitPrice - entryPrice) : (entryPrice - exitPrice);
            // Realized Reward can be negative
            const rr = Number((realizedReward / risk).toFixed(2));
            if (currentTrade.realizedRR !== rr) {
                updates.realizedRR = rr;
                changed = true;
            }
        }

        return changed ? updates : null;
    }, []);

    // Effect to trigger calculation when relevant fields change
    useEffect(() => {
        if (!trade) return;
        const updates = calculateMetrics(trade);
        if (updates) {
            setTrade(prev => ({ ...prev, ...updates }));
        }
    }, [trade.entryPrice, trade.exitPrice, trade.stopLoss, trade.profitTarget, trade.type, calculateMetrics]); // Dependencies for recalc

    // Helper for safe number conversion
    const safeNumber = (value: any, fallback = 0) => {
        const num = Number(value);
        return isFinite(num) ? num : fallback;
    };

    const safeNullableNumber = (value: any) => {
        if (value === null || value === "" || value === undefined) return null;
        const num = Number(value);
        return isFinite(num) ? num : null;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Fix: Create a clean payload object with only allowed fields
            // Exclude ID, userId, dates, and UI-only fields (plannedRR, realizedRR, points) which are not in schema for direct update? 
            // Actually schema has them, but let's be safe and ensure numbers are numbers.

            const payload: any = {
                date: trade.date,
                ticker: trade.ticker,
                type: trade.type,
                entryPrice: safeNumber(trade.entryPrice),
                exitPrice: safeNumber(trade.exitPrice),
                quantity: safeNumber(trade.quantity),
                pnl: safeNumber(trade.pnl),
                status: trade.status,
                notes: trade.notes,
                contracts: safeNullableNumber(trade.contracts),
                points: safeNullableNumber(trade.points),
                ticks: safeNullableNumber(trade.ticks),
                rating: safeNullableNumber(trade.rating),
                profitTarget: safeNullableNumber(trade.profitTarget),
                stopLoss: safeNullableNumber(trade.stopLoss),
                plannedRR: safeNullableNumber(trade.plannedRR),
                realizedRR: safeNullableNumber(trade.realizedRR),
                tags: trade.tags
            };

            console.log("Sending Payload via API:", payload);

            // CHANGED: Use standard API Route instead of Server Action
            const response = await fetch(`/api/trades/${trade.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update trade");
            }

            alert("Trade saved successfully!"); // Simple feedback
            router.push('/trades');
            router.refresh();
        } catch (error: any) {
            console.error("Failed to save:", error);
            alert(`Failed to save trade: ${error.message || "Unknown error"}`);
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this trade?")) return;
        try {
            // CHANGED: Use standard API Route instead of Server Action
            const response = await fetch(`/api/trades/${trade.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete trade");
            }

            // Client-side navigation or refresh might be safer to prevent 404 on current page
            router.push('/trades');
            router.refresh();
        } catch (error: any) {
            console.error("Failed to delete:", error);
            alert(`Failed to delete trade: ${error.message || "Unknown error"}`);
        }
    };

    const toggleTag = (tagId: string) => {
        // handle nullable tags array
        const currentTags = trade.tags || [];
        const newTags = currentTags.includes(tagId)
            ? currentTags.filter(t => t !== tagId)
            : [...currentTags, tagId];
        setTrade({ ...trade, tags: newTags });
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h2 className="text-3xl font-bold tracking-tight">Edit Trade</h2>
                </div>
                <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-md text-sm font-medium"
                >
                    Delete Trade
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">

                    {/* Basic Info */}
                    <Card>
                        <CardHeader><CardTitle>Trade Details</CardTitle></CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Date</label>
                                    <input
                                        type="date"
                                        className="w-full mt-1 bg-background border border-input rounded px-3 py-2"
                                        value={trade.date}
                                        onChange={e => setTrade({ ...trade, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Ticker</label>
                                    <input
                                        type="text"
                                        className="w-full mt-1 bg-background border border-input rounded px-3 py-2 uppercase"
                                        value={trade.ticker}
                                        onChange={e => setTrade({ ...trade, ticker: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Direction</label>
                                    <select
                                        className="w-full mt-1 bg-background border border-input rounded px-3 py-2"
                                        value={trade.type}
                                        onChange={e => setTrade({ ...trade, type: e.target.value as any })}
                                    >
                                        <option value="Long">Long</option>
                                        <option value="Short">Short</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Quantity/Contracts</label>
                                    <input
                                        type="number"
                                        className="w-full mt-1 bg-background border border-input rounded px-3 py-2"
                                        value={trade.contracts || trade.quantity}
                                        onChange={e => setTrade({ ...trade, contracts: Number(e.target.value), quantity: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Entry Price</label>
                                    <input
                                        type="number" step="0.01"
                                        className="w-full mt-1 bg-background border border-input rounded px-3 py-2"
                                        value={trade.entryPrice}
                                        onChange={e => setTrade({ ...trade, entryPrice: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Exit Price</label>
                                    <input
                                        type="number" step="0.01"
                                        className="w-full mt-1 bg-background border border-input rounded px-3 py-2"
                                        value={trade.exitPrice}
                                        onChange={e => setTrade({ ...trade, exitPrice: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Net P&L ($)</label>
                                <input
                                    type="number" step="0.01"
                                    className={`w-full mt-1 bg-background border border-input rounded px-3 py-2 font-bold ${trade.pnl > 0 ? 'text-green-500' : 'text-red-500'}`}
                                    value={trade.pnl}
                                    onChange={e => setTrade({ ...trade, pnl: Number(e.target.value) })}
                                    readOnly={false}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Advanced Metrics */}
                    <Card>
                        <CardHeader><CardTitle>Metrics & Risk</CardTitle></CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Profit Target</label>
                                    <input
                                        type="number" step="0.01"
                                        className="w-full mt-1 bg-background border border-input rounded px-3 py-2"
                                        value={trade.profitTarget || ""}
                                        onChange={e => setTrade({ ...trade, profitTarget: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Stop Loss</label>
                                    <input
                                        type="number" step="0.01"
                                        className="w-full mt-1 bg-background border border-input rounded px-3 py-2"
                                        value={trade.stopLoss || ""}
                                        onChange={e => setTrade({ ...trade, stopLoss: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Planned R:R (Auto)</label>
                                    <input
                                        type="number" step="0.1"
                                        className="w-full mt-1 bg-muted border border-input rounded px-3 py-2 text-muted-foreground"
                                        value={trade.plannedRR || ""}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Realized R:R (Auto)</label>
                                    <input
                                        type="number" step="0.1"
                                        className={`w-full mt-1 bg-muted border border-input rounded px-3 py-2 font-bold ${Number(trade.realizedRR) > 0 ? 'text-green-500' : 'text-red-500'}`}
                                        value={trade.realizedRR || ""}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Points Captured (Auto)</label>
                                    <input
                                        type="number" step="0.25"
                                        className="w-full mt-1 bg-muted border border-input rounded px-3 py-2"
                                        value={trade.points || ""}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Rating (1-10)</label>
                                    <input
                                        type="number" min="1" max="10"
                                        className="w-full mt-1 bg-background border border-input rounded px-3 py-2"
                                        value={trade.rating || ""}
                                        onChange={e => setTrade({ ...trade, rating: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    <Card className="md:col-span-2">
                        <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-4">
                                {categories.map(cat => (
                                    <div key={cat.id} className="border border-border p-3 rounded-lg">
                                        <h4 className="text-xs uppercase font-bold text-muted-foreground mb-2">{cat.name}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {cat.tags.map(tag => (
                                                <button
                                                    key={tag.id}
                                                    type="button"
                                                    onClick={() => toggleTag(tag.id)}
                                                    className={`text-xs px-2 py-1 rounded border transition-colors ${(trade.tags || []).includes(tag.id)
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "bg-background border-border text-muted-foreground hover:border-primary/50"
                                                        }`}
                                                >
                                                    {tag.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card className="md:col-span-2">
                        <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
                        <CardContent>
                            <textarea
                                className="w-full min-h-[150px] bg-background border border-input rounded px-3 py-2 font-mono text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Trade execution notes..."
                                value={trade.notes || ""}
                                onChange={e => setTrade({ ...trade, notes: e.target.value })}
                            />
                        </CardContent>
                    </Card>

                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-md font-medium text-lg flex items-center shadow-lg disabled:opacity-50"
                    >
                        <Save className="h-5 w-5 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
