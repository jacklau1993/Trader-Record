"use client";

import { useState } from "react";
import Flatpickr from "react-flatpickr";
import { Plus, Edit, Trash2, Check, X, Building2 } from "lucide-react";
import { createAccount, updateAccount, deleteAccount } from "@/app/actions/account-actions";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";
import { TICKERS } from "@/lib/constants";

interface PropFirm {
    id: string;
    name: string;
    type: "PROP_FIRM" | "BROKER";
    status?: string;
    accountNumber?: string;
    cost?: number;
    lastPayoutAmount?: number;
    lastPayoutDate?: string; // ISO string from JSON/DB serialization
    totalPayout?: number;
    commissionRates?: string; // JSON: {"MNQ": 0.50, ...}
}

export function PropFirmManager({ initialPropFirms }: { initialPropFirms: any[] }) {
    const [propFirms, setPropFirms] = useState<PropFirm[]>(initialPropFirms);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentFirm, setCurrentFirm] = useState<Partial<PropFirm>>({});
    const [commissionRates, setCommissionRates] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const dateInputClassName = "w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm";

    const handleAdd = () => {
        setCurrentFirm({ type: "PROP_FIRM", status: "Active" });
        setCommissionRates({});
        setIsAddOpen(true);
    };

    const handleEdit = (firm: PropFirm) => {
        setCurrentFirm(firm);
        // Parse commission rates JSON
        try {
            setCommissionRates(firm.commissionRates ? JSON.parse(firm.commissionRates) : {});
        } catch {
            setCommissionRates({});
        }
        setIsEditOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this prop firm?")) {
            await deleteAccount(id);
            setPropFirms(propFirms.filter(p => p.id !== id));
            router.refresh();
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = {
                id: currentFirm.id || `acc_${Date.now()}`,
                name: currentFirm.name || "Unnamed Firm",
                type: "PROP_FIRM" as const,
                status: currentFirm.status,
                accountNumber: currentFirm.accountNumber,
                cost: Number(currentFirm.cost) || 0,
                lastPayoutAmount: Number(currentFirm.lastPayoutAmount) || 0,
                totalPayout: Number(currentFirm.totalPayout) || 0,
                // Handle date: if string, keep it? Server expecting Date object or handled by DB adapter?
                // Drizzle with { mode: 'timestamp' } expects Date object for insert/update usually.
                lastPayoutDate: currentFirm.lastPayoutDate ? new Date(currentFirm.lastPayoutDate) : undefined,
                commissionRates: JSON.stringify(commissionRates)
            };

            if (isEditOpen && currentFirm.id) {
                await updateAccount(currentFirm.id, data);
                setPropFirms(propFirms.map(p => p.id === currentFirm.id ? { ...p, ...data, lastPayoutDate: data.lastPayoutDate?.toISOString() } : p));
            } else {
                await createAccount(data);
                setPropFirms([...propFirms, { ...data, lastPayoutDate: data.lastPayoutDate?.toISOString() } as any]);
            }

            setIsAddOpen(false);
            setIsEditOpen(false);
            router.refresh();
        } catch (err) {
            console.error(err);
            alert("Failed to save.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={handleAdd}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium flex items-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Prop Firm
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {propFirms.map((firm) => (
                    <div key={firm.id} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Building2 className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{firm.name}</h3>
                                    <p className="text-xs text-muted-foreground">{firm.accountNumber}</p>
                                    <p className="text-xs text-muted-foreground">{firm.status}</p>
                                </div>
                            </div>
                            <div className="flex space-x-1">
                                <button onClick={() => handleEdit(firm)} className="p-2 hover:bg-muted rounded-full">
                                    <Edit className="h-4 w-4 text-muted-foreground" />
                                </button>
                                <button onClick={() => handleDelete(firm.id)} className="p-2 hover:bg-muted rounded-full">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-muted-foreground">Cost:</div>
                            <div className="font-medium text-right">£{firm.cost?.toFixed(2)}</div>

                            <div className="text-muted-foreground">Total Payout:</div>
                            <div className="font-medium text-right text-green-500">£{firm.totalPayout?.toFixed(2)}</div>

                            <div className="text-muted-foreground">Last Payout:</div>
                            <div className="font-medium text-right">
                                {firm.lastPayoutAmount ? `£${firm.lastPayoutAmount.toFixed(2)}` : "-"}
                            </div>

                            <div className="text-muted-foreground">Payout Date:</div>
                            <div className="font-medium text-right">
                                {firm.lastPayoutDate ? new Date(firm.lastPayoutDate).toLocaleDateString() : "-"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isAddOpen || isEditOpen} onClose={() => { setIsAddOpen(false); setIsEditOpen(false); }}>
                <h2 className="text-xl font-bold mb-4">{isAddOpen ? "Add Prop Firm" : "Edit Prop Firm"}</h2>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Firm Name</label>
                        <input
                            required
                            className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm"
                            value={currentFirm.name || ""}
                            onChange={e => setCurrentFirm({ ...currentFirm, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Account Number</label>
                        <input
                            className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm"
                            value={currentFirm.accountNumber || ""}
                            onChange={e => setCurrentFirm({ ...currentFirm, accountNumber: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Status</label>
                            <select
                                className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm"
                                value={currentFirm.status || "Active"}
                                onChange={e => setCurrentFirm({ ...currentFirm, status: e.target.value })}
                            >
                                <option value="Active">Active</option>
                                <option value="Passed">Passed</option>
                                <option value="Failed">Failed / Busted</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Cost (£)</label>
                            <input
                                type="number"
                                className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm"
                                value={currentFirm.cost || ""}
                                onChange={e => setCurrentFirm({ ...currentFirm, cost: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold mb-2 mt-4">Payout Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Last Payout Amount (£)</label>
                                <input
                                    type="number"
                                    className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm"
                                    value={currentFirm.lastPayoutAmount || ""}
                                    onChange={e => setCurrentFirm({ ...currentFirm, lastPayoutAmount: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Last Payout Date</label>
                                <Flatpickr
                                    options={{ dateFormat: "Y-m-d", disableMobile: true }}
                                    value={currentFirm.lastPayoutDate ? currentFirm.lastPayoutDate.split("T")[0] : ""}
                                    onChange={(_dates, dateStr) => setCurrentFirm({ ...currentFirm, lastPayoutDate: dateStr })}
                                    className={dateInputClassName}
                                />
                            </div>
                        </div>
                        <div className="mt-2">
                            <label className="text-xs text-muted-foreground mb-1 block">Total Payout (£)</label>
                            <input
                                type="number"
                                className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm"
                                value={currentFirm.totalPayout || ""}
                                onChange={e => setCurrentFirm({ ...currentFirm, totalPayout: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold mb-2 mt-4">Commission Rates ($ per side)</h3>
                        <p className="text-xs text-muted-foreground mb-3">Enter the per-side commission for each instrument. Total commission = rate × quantity × 2</p>
                        <div className="grid grid-cols-3 gap-3">
                            {TICKERS.map(ticker => (
                                <div key={ticker}>
                                    <label className="text-xs text-muted-foreground mb-1 block">{ticker}</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm"
                                        value={commissionRates[ticker] || ""}
                                        onChange={e => setCommissionRates({ ...commissionRates, [ticker]: Number(e.target.value) })}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md font-medium mt-4">
                        {isLoading ? "Saving..." : "Save Prop Firm"}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
