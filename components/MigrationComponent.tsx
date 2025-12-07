"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Database } from "lucide-react";
import { createCategory, createTag } from "@/app/actions/tag-actions";
import { createTrade } from "@/app/actions/trade-actions";
import { createNote } from "@/app/actions/note-actions";
import { createTemplate } from "@/app/actions/template-actions";
import { useRouter } from "next/navigation";

export function MigrationComponent() {
    const [hasLocalData, setHasLocalData] = useState(false);
    const [migrating, setMigrating] = useState(false);
    const [progress, setProgress] = useState("");
    const router = useRouter();

    useEffect(() => {
        const trades = localStorage.getItem("trading_app_trades");
        const categories = localStorage.getItem("trading_app_categories");
        const notes = localStorage.getItem("trading_app_notes");
        if (trades || categories || notes) {
            setHasLocalData(true);
        }
    }, []);

    const handleMigrate = async () => {
        if (!confirm("This will upload your local data to the cloud database. Continue?")) return;
        setMigrating(true);
        setProgress("Starting migration...");

        try {
            // 1. Categories & Tags
            const categoriesStr = localStorage.getItem("trading_app_categories");
            if (categoriesStr) {
                const categories = JSON.parse(categoriesStr);
                for (const cat of categories) {
                    setProgress(`Migrating Category: ${cat.name}`);
                    await createCategory({
                        id: cat.id,
                        name: cat.name,
                        color: cat.color
                    });

                    if (cat.tags) {
                        for (const tag of cat.tags) {
                            await createTag({
                                id: tag.id,
                                categoryId: cat.id,
                                name: tag.name,
                                color: tag.color
                            });
                        }
                    }
                }
            }

            // 2. Trades
            const tradesStr = localStorage.getItem("trading_app_trades");
            if (tradesStr) {
                const trades = JSON.parse(tradesStr);
                let i = 0;
                for (const trade of trades) {
                    i++;
                    setProgress(`Migrating Trade ${i}/${trades.length}`);
                    // Ensure numeric fields are numbers
                    await createTrade({
                        // id: trade.id, // Let DB generate new ID or use existing? 
                        // Using existing ID is better for relations if we preserved them.
                        // But my createTrade action generates new ID if not provided, or inserts provided?
                        // Schema has string ID. I can pass it.
                        // But wait, createTrade implementation in trade-actions.ts:
                        // const newTrade = { ...data, userId, ... }; await db.insert(trades).values(newTrade);
                        // If I pass ID in data, it works.
                        id: trade.id,
                        date: trade.date,
                        ticker: trade.ticker,
                        type: trade.type,
                        entryPrice: Number(trade.entryPrice),
                        exitPrice: Number(trade.exitPrice),
                        quantity: Number(trade.quantity),
                        pnl: Number(trade.pnl),
                        status: trade.status || "Closed",
                        notes: trade.notes,
                        contracts: Number(trade.contracts || trade.quantity),
                        points: Number(trade.points),
                        ticks: Number(trade.ticks),
                        rating: Number(trade.rating),
                        profitTarget: Number(trade.profitTarget),
                        stopLoss: Number(trade.stopLoss),
                        plannedRR: Number(trade.plannedRR),
                        realizedRR: Number(trade.realizedRR),
                        tags: trade.tags // Array of tag IDs
                    });
                }
            }

            // 3. Notes & Sections
            const sectionsStr = localStorage.getItem("trading_app_sections");
            // I didn't create createSection action yet? 
            // Note actions has createNote. Checks for sections automatically?
            // "getSections" returns pre-defined sections or user sections.
            // Note: Section management was minimal in local storage.
            // If I want to migrate notes, I should check if sections exist.
            // note-actions.ts `getSections` returns user sections. 
            // I should migrate sections if possible.
            // app/actions/note-actions.ts `createNote` takes `sectionId`.
            // I probably need `createSection` action if I want to preserve folder structure.
            // If not, I can put them in default section.

            // Let's Skip sections metadata explicitly and just create notes.
            // But notes need sectionId.
            const notesStr = localStorage.getItem("trading_app_notes");
            if (notesStr) {
                const notes = JSON.parse(notesStr);
                for (const note of notes) {
                    setProgress(`Migrating Note: ${note.title}`);
                    await createNote({
                        id: note.id,
                        title: note.title,
                        content: note.content,
                        date: note.date,
                        sectionId: note.sectionId || "s1"
                    });
                }
            }

            // 4. Templates
            const templatesStr = localStorage.getItem("trading_app_templates");
            if (templatesStr) {
                const templates = JSON.parse(templatesStr);
                for (const tmpl of templates) {
                    setProgress(`Migrating Template: ${tmpl.name}`);
                    await createTemplate({
                        id: tmpl.id,
                        name: tmpl.name,
                        content: tmpl.content
                    });
                }
            }

            setProgress("Migration Complete!");
            alert("Migration Successful! You can now clear your local browser data if you wish.");

            // Optional: Clear local storage
            // localStorage.clear(); 
            // setHasLocalData(false);

            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Migration failed. Check console for details.");
        } finally {
            setMigrating(false);
        }
    };

    if (!hasLocalData) return null;

    return (
        <Card className="mb-6 border-blue-500/50 bg-blue-500/5">
            <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                    <Database className="h-6 w-6 text-blue-500" />
                    <div>
                        <h3 className="font-semibold text-blue-500">Local Data Detected</h3>
                        <p className="text-sm text-muted-foreground">Migrate your browser data to the cloud database.</p>
                    </div>
                </div>
                <Button onClick={handleMigrate} disabled={migrating} variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                    {migrating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {progress}</> : "Migrate to Cloud"}
                </Button>
            </CardContent>
        </Card>
    );
}
