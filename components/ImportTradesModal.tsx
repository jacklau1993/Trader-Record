"use client";

import { useState } from "react";
import { Upload, Loader2, FileUp } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";
import { importTradesFromCsv } from "@/app/actions/trade-actions";

export function ImportTradesModal({ accounts = [], defaultAccountId }: { accounts?: any[], defaultAccountId?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(defaultAccountId || "");
    const [file, setFile] = useState<File | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !selectedAccount) return;

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("accountId", selectedAccount);

            const result = await importTradesFromCsv(formData);

            if (result.success) {
                setIsOpen(false);
                setFile(null);
                router.refresh();
                alert(`Successfully imported ${result.count} trades.`);
            } else {
                alert(`Import failed: ${result.message}`);
            }
        } catch (error) {
            console.error("Import error:", error);
            alert("An error occurred during import.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md font-medium flex items-center shadow-sm transition-all hover:scale-105"
            >
                <FileUp className="h-4 w-4 mr-2" />
                Import CSV
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Import Trades from CSV</h2>
                <div className="mb-4 text-sm text-muted-foreground">
                    <p>Upload your <code>Performance.csv</code> file to import trades.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Account Selection */}
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Account</label>
                        <select
                            className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm"
                            value={selectedAccount}
                            onChange={e => setSelectedAccount(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select Account</option>
                            {/* Personal Accounts */}
                            {accounts.filter(a => a.type === "BROKER").length > 0 && (
                                <optgroup label="Personal Accounts">
                                    {accounts.filter(a => a.type === "BROKER").map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                                    ))}
                                </optgroup>
                            )}

                            {/* Prop Firms */}
                            {accounts.filter(a => a.type === "PROP_FIRM").length > 0 && (
                                <optgroup label="Prop Firms">
                                    {accounts.filter(a => a.type === "PROP_FIRM").map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                                    ))}
                                </optgroup>
                            )}
                        </select>
                    </div>

                    {/* File Input */}
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">CSV File</label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={e => setFile(e.target.files?.[0] || null)}
                                className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                                required
                            />
                            {file && <p className="mt-2 text-sm font-medium text-foreground">{file.name}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !file || !selectedAccount}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                            {isLoading ? "Importing..." : "Import Trades"}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
