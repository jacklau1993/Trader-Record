"use client";

import { useState, useMemo } from "react";
import Flatpickr from "react-flatpickr";
import {
  Plus,
  Edit,
  Trash2,
  Building2,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  PoundSterling,
} from "lucide-react";
import {
  createAccount,
  updateAccount,
  deleteAccount,
} from "@/app/actions/account-actions";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
} from "@/app/actions/prop-firm-transaction-actions";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";
import { TICKERS } from "@/lib/constants";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PropFirm {
  id: string;
  name: string;
  type: "PROP_FIRM" | "BROKER";
  status?: string;
  accountNumber?: string;
  cost?: number;
  commissionRates?: string;
}

interface Transaction {
  id: string;
  tradingAccountId: string;
  userId: string;
  type: "EXPENSE" | "PAYOUT";
  amount: number;
  currency: string;
  month: string; // "2026-01"
  note?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// ─── Component ───────────────────────────────────────────────────────────────

export function PropFirmManager({
  initialPropFirms,
  initialTransactions,
  availableYears,
}: {
  initialPropFirms: any[];
  initialTransactions: any[];
  availableYears: string[];
}) {
  const router = useRouter();
  const [propFirms, setPropFirms] = useState<PropFirm[]>(initialPropFirms);
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [activeTab, setActiveTab] = useState<
    "firms" | "monthly" | "pnl" | "add"
  >("firms");

  // Year selector
  const currentYear = new Date().getFullYear().toString();
  const yearOptions =
    availableYears.length > 0 ? availableYears : [currentYear];
  const [selectedYear, setSelectedYear] = useState(yearOptions[0]);

  // ─── Firm CRUD state ─────────────────────────────────────────────────────
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentFirm, setCurrentFirm] = useState<Partial<PropFirm>>({});
  const [commissionRates, setCommissionRates] = useState<
    Record<string, number>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const dateInputClassName =
    "w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm";

  // ─── Transaction form state ──────────────────────────────────────────────
  const [txForm, setTxForm] = useState({
    tradingAccountId: "",
    type: "EXPENSE" as "EXPENSE" | "PAYOUT",
    amount: "",
    month: `${currentYear}-01`,
    note: "",
  });
  const [txLoading, setTxLoading] = useState(false);
  const [editingTxId, setEditingTxId] = useState<string | null>(null);

  // ─── Computed data ───────────────────────────────────────────────────────

  const yearTransactions = useMemo(() => {
    return transactions.filter((t) => t.month.startsWith(selectedYear));
  }, [transactions, selectedYear]);

  // Build a grid: { [firmId]: { [monthIndex]: { expense: number, payout: number } } }
  const monthlyGrid = useMemo(() => {
    const grid: Record<
      string,
      Record<number, { expense: number; payout: number }>
    > = {};
    propFirms.forEach((f) => {
      grid[f.id] = {};
      for (let m = 0; m < 12; m++) grid[f.id][m] = { expense: 0, payout: 0 };
    });
    yearTransactions.forEach((t) => {
      const monthIdx = parseInt(t.month.split("-")[1], 10) - 1;
      if (grid[t.tradingAccountId] && monthIdx >= 0 && monthIdx < 12) {
        if (t.type === "EXPENSE")
          grid[t.tradingAccountId][monthIdx].expense += t.amount;
        else grid[t.tradingAccountId][monthIdx].payout += t.amount;
      }
    });
    return grid;
  }, [yearTransactions, propFirms]);

  // P&L per firm
  const pnlData = useMemo(() => {
    return propFirms.map((f) => {
      let totalExpense = 0;
      let totalPayout = 0;
      for (let m = 0; m < 12; m++) {
        totalExpense += monthlyGrid[f.id]?.[m]?.expense || 0;
        totalPayout += monthlyGrid[f.id]?.[m]?.payout || 0;
      }
      const netProfit = totalPayout - totalExpense;
      const roi = totalExpense > 0 ? (netProfit / totalExpense) * 100 : 0;
      return { firm: f, totalExpense, totalPayout, netProfit, roi };
    });
  }, [monthlyGrid, propFirms]);

  const grandTotals = useMemo(() => {
    const totals = { expense: 0, payout: 0, net: 0, roi: 0 };
    pnlData.forEach((d) => {
      totals.expense += d.totalExpense;
      totals.payout += d.totalPayout;
    });
    totals.net = totals.payout - totals.expense;
    totals.roi = totals.expense > 0 ? (totals.net / totals.expense) * 100 : 0;
    return totals;
  }, [pnlData]);

  // ─── Firm handlers ───────────────────────────────────────────────────────

  const handleAdd = () => {
    setCurrentFirm({ type: "PROP_FIRM", status: "Active" });
    setCommissionRates({});
    setIsAddOpen(true);
  };

  const handleEdit = (firm: PropFirm) => {
    setCurrentFirm(firm);
    try {
      setCommissionRates(
        firm.commissionRates ? JSON.parse(firm.commissionRates) : {},
      );
    } catch {
      setCommissionRates({});
    }
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this prop firm?")) {
      await deleteAccount(id);
      setPropFirms(propFirms.filter((p) => p.id !== id));
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
        commissionRates: JSON.stringify(commissionRates),
      };
      if (isEditOpen && currentFirm.id) {
        await updateAccount(currentFirm.id, data);
        setPropFirms(
          propFirms.map((p) =>
            p.id === currentFirm.id ? { ...p, ...data } : p,
          ),
        );
      } else {
        await createAccount(data);
        setPropFirms([...propFirms, data as any]);
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

  // ─── Transaction handlers ────────────────────────────────────────────────

  const handleTxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxLoading(true);
    try {
      if (editingTxId) {
        await updateTransaction(editingTxId, {
          tradingAccountId: txForm.tradingAccountId,
          type: txForm.type,
          amount: Number(txForm.amount),
          month: txForm.month,
          note: txForm.note || undefined,
        });
      } else {
        await createTransaction({
          tradingAccountId: txForm.tradingAccountId,
          type: txForm.type,
          amount: Number(txForm.amount),
          month: txForm.month,
          note: txForm.note || undefined,
        });
      }
      // Refresh transactions
      const fresh = await getTransactions();
      setTransactions(fresh);
      setEditingTxId(null);
      setTxForm({
        tradingAccountId: propFirms[0]?.id || "",
        type: "EXPENSE",
        amount: "",
        month: `${selectedYear}-01`,
        note: "",
      });
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to save transaction.");
    } finally {
      setTxLoading(false);
    }
  };

  const handleTxEdit = (tx: Transaction) => {
    setEditingTxId(tx.id);
    setTxForm({
      tradingAccountId: tx.tradingAccountId,
      type: tx.type as "EXPENSE" | "PAYOUT",
      amount: String(tx.amount),
      month: tx.month,
      note: tx.note || "",
    });
    setActiveTab("add");
  };

  const handleTxDelete = async (id: string) => {
    if (confirm("Delete this transaction?")) {
      await deleteTransaction(id);
      const fresh = await getTransactions();
      setTransactions(fresh);
      router.refresh();
    }
  };

  const cancelTxEdit = () => {
    setEditingTxId(null);
    setTxForm({
      tradingAccountId: propFirms[0]?.id || "",
      type: "EXPENSE",
      amount: "",
      month: `${selectedYear}-01`,
      note: "",
    });
  };

  // ─── Formatting ──────────────────────────────────────────────────────────

  const fmt = (val: number, currency: "GBP" | "USD" = "USD") => {
    const symbol = currency === "GBP" ? "£" : "$";
    return `${symbol}${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const fmtSigned = (val: number) => {
    const prefix = val >= 0 ? "" : "-";
    return `${prefix}$${Math.abs(val).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // ─── Tab buttons ─────────────────────────────────────────────────────────

  const tabs = [
    { key: "firms" as const, label: "Prop Firms", icon: Building2 },
    { key: "monthly" as const, label: "Monthly View", icon: FileSpreadsheet },
    { key: "pnl" as const, label: "P&L Summary", icon: TrendingUp },
    { key: "add" as const, label: "Transactions", icon: DollarSign },
  ];

  return (
    <div className="space-y-4">
      {/* ─── Tabs ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1 border-b border-border pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}

        {/* Year selector for monthly/pnl tabs */}
        {(activeTab === "monthly" ||
          activeTab === "pnl" ||
          activeTab === "add") && (
          <div className="ml-auto flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Year:</label>
            <select
              className="bg-muted/50 border border-input rounded px-2 py-1 text-sm"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ─── Tab: Prop Firms ──────────────────────────────────── */}
      {activeTab === "firms" && (
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
              <div
                key={firm.id}
                className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{firm.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {firm.accountNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {firm.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(firm)}
                      className="p-2 hover:bg-muted rounded-full"
                    >
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDelete(firm.id)}
                      className="p-2 hover:bg-muted rounded-full"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Tab: Monthly View ───────────────────────────────── */}
      {activeTab === "monthly" && (
        <div className="space-y-6">
          {/* Expense Table */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <PoundSterling className="h-5 w-5 text-red-400" /> Expenses (£
              GBP)
            </h3>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                      Month
                    </th>
                    {propFirms.map((f) => (
                      <th
                        key={f.id}
                        className="px-3 py-2 text-right font-medium text-muted-foreground"
                      >
                        {f.name}
                      </th>
                    ))}
                    <th className="px-3 py-2 text-right font-semibold">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MONTHS.map((m, i) => {
                    const rowTotal = propFirms.reduce(
                      (sum, f) => sum + (monthlyGrid[f.id]?.[i]?.expense || 0),
                      0,
                    );
                    return (
                      <tr
                        key={i}
                        className="border-t border-border/50 hover:bg-muted/20"
                      >
                        <td className="px-3 py-2 font-medium">
                          {selectedYear}/{m}
                        </td>
                        {propFirms.map((f) => {
                          const val = monthlyGrid[f.id]?.[i]?.expense || 0;
                          return (
                            <td
                              key={f.id}
                              className="px-3 py-2 text-right tabular-nums"
                            >
                              {val > 0 ? (
                                fmt(val, "GBP")
                              ) : (
                                <span className="text-muted-foreground/40">
                                  -
                                </span>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-3 py-2 text-right font-semibold tabular-nums">
                          {rowTotal > 0 ? fmt(rowTotal, "GBP") : "-"}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="border-t-2 border-border bg-muted/20 font-bold">
                    <td className="px-3 py-2">Total</td>
                    {propFirms.map((f) => {
                      const total = Array.from(
                        { length: 12 },
                        (_, i) => monthlyGrid[f.id]?.[i]?.expense || 0,
                      ).reduce((a, b) => a + b, 0);
                      return (
                        <td
                          key={f.id}
                          className="px-3 py-2 text-right tabular-nums"
                        >
                          {fmt(total, "GBP")}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-right tabular-nums">
                      {fmt(grandTotals.expense, "GBP")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payout Table */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-400" /> Payouts ($ USD)
            </h3>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                      Month
                    </th>
                    {propFirms.map((f) => (
                      <th
                        key={f.id}
                        className="px-3 py-2 text-right font-medium text-muted-foreground"
                      >
                        {f.name}
                      </th>
                    ))}
                    <th className="px-3 py-2 text-right font-semibold">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MONTHS.map((m, i) => {
                    const rowTotal = propFirms.reduce(
                      (sum, f) => sum + (monthlyGrid[f.id]?.[i]?.payout || 0),
                      0,
                    );
                    return (
                      <tr
                        key={i}
                        className="border-t border-border/50 hover:bg-muted/20"
                      >
                        <td className="px-3 py-2 font-medium">
                          {selectedYear}/{m}
                        </td>
                        {propFirms.map((f) => {
                          const val = monthlyGrid[f.id]?.[i]?.payout || 0;
                          return (
                            <td
                              key={f.id}
                              className="px-3 py-2 text-right tabular-nums"
                            >
                              {val > 0 ? (
                                fmt(val, "USD")
                              ) : (
                                <span className="text-muted-foreground/40">
                                  -
                                </span>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-3 py-2 text-right font-semibold tabular-nums text-green-500">
                          {rowTotal > 0 ? fmt(rowTotal, "USD") : "-"}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="border-t-2 border-border bg-muted/20 font-bold">
                    <td className="px-3 py-2">Total</td>
                    {propFirms.map((f) => {
                      const total = Array.from(
                        { length: 12 },
                        (_, i) => monthlyGrid[f.id]?.[i]?.payout || 0,
                      ).reduce((a, b) => a + b, 0);
                      return (
                        <td
                          key={f.id}
                          className="px-3 py-2 text-right tabular-nums text-green-500"
                        >
                          {fmt(total, "USD")}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-right tabular-nums text-green-500">
                      {fmt(grandTotals.payout, "USD")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue Summary */}
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" /> Monthly Revenue
              (Payout − Expense)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                      Month
                    </th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MONTHS.map((m, i) => {
                    const totalPayout = propFirms.reduce(
                      (sum, f) => sum + (monthlyGrid[f.id]?.[i]?.payout || 0),
                      0,
                    );
                    const totalExpense = propFirms.reduce(
                      (sum, f) => sum + (monthlyGrid[f.id]?.[i]?.expense || 0),
                      0,
                    );
                    const revenue = totalPayout - totalExpense;
                    return (
                      <tr
                        key={i}
                        className="border-t border-border/50 hover:bg-muted/20"
                      >
                        <td className="px-3 py-2 font-medium">{m}</td>
                        <td
                          className={`px-3 py-2 text-right font-semibold tabular-nums ${revenue >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {revenue !== 0 ? (
                            fmtSigned(revenue)
                          ) : (
                            <span className="text-muted-foreground/40">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="border-t-2 border-border bg-muted/20 font-bold">
                    <td className="px-3 py-2">Total</td>
                    <td
                      className={`px-3 py-2 text-right tabular-nums ${grandTotals.net >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {fmtSigned(grandTotals.net)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab: P&L Summary ────────────────────────────────── */}
      {activeTab === "pnl" && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="px-4 py-3 text-left font-semibold">Firm</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Expenses (£)
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Payouts ($)
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Net Profit
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    ROI (%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {pnlData.map(
                  ({ firm, totalExpense, totalPayout, netProfit, roi }) => (
                    <tr
                      key={firm.id}
                      className="border-t border-border/50 hover:bg-muted/20"
                    >
                      <td className="px-4 py-3 font-medium">{firm.name}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-red-400">
                        {fmt(totalExpense, "GBP")}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-green-500">
                        {fmt(totalPayout, "USD")}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-semibold tabular-nums ${netProfit >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {fmtSigned(netProfit)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right tabular-nums ${roi >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {roi.toFixed(1)}%
                      </td>
                    </tr>
                  ),
                )}
                <tr className="border-t-2 border-border bg-muted/20 font-bold">
                  <td className="px-4 py-3">Total</td>
                  <td className="px-4 py-3 text-right tabular-nums text-red-400">
                    {fmt(grandTotals.expense, "GBP")}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-green-500">
                    {fmt(grandTotals.payout, "USD")}
                  </td>
                  <td
                    className={`px-4 py-3 text-right tabular-nums ${grandTotals.net >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {fmtSigned(grandTotals.net)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right tabular-nums ${grandTotals.roi >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {grandTotals.roi.toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Tab: Add/Edit Transactions ──────────────────────── */}
      {activeTab === "add" && (
        <div className="space-y-6">
          {/* Transaction form */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingTxId ? "Edit Transaction" : "Add Transaction"}
            </h3>
            <form
              onSubmit={handleTxSubmit}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Prop Firm
                </label>
                <select
                  required
                  className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm"
                  value={txForm.tradingAccountId}
                  onChange={(e) =>
                    setTxForm({ ...txForm, tradingAccountId: e.target.value })
                  }
                >
                  <option value="">Select firm...</option>
                  {propFirms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                      {f.accountNumber ? ` - ${f.accountNumber}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Type</label>
                <select
                  className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm"
                  value={txForm.type}
                  onChange={(e) =>
                    setTxForm({
                      ...txForm,
                      type: e.target.value as "EXPENSE" | "PAYOUT",
                    })
                  }
                >
                  <option value="EXPENSE">Expense (£ GBP)</option>
                  <option value="PAYOUT">Payout ($ USD)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Amount ({txForm.type === "EXPENSE" ? "£" : "$"})
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm"
                  value={txForm.amount}
                  onChange={(e) =>
                    setTxForm({ ...txForm, amount: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Month</label>
                <input
                  required
                  type="month"
                  className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm"
                  value={txForm.month}
                  onChange={(e) =>
                    setTxForm({ ...txForm, month: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Note (optional)
                </label>
                <input
                  className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm"
                  value={txForm.note}
                  onChange={(e) =>
                    setTxForm({ ...txForm, note: e.target.value })
                  }
                  placeholder="e.g. Challenge fee"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  disabled={txLoading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium flex items-center"
                >
                  {txLoading ? "Saving..." : editingTxId ? "Update" : "Add"}
                </button>
                {editingTxId && (
                  <button
                    type="button"
                    onClick={cancelTxEdit}
                    className="bg-muted text-muted-foreground px-4 py-2 rounded-md font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Transaction list */}
          <div className="rounded-lg border">
            <div className="px-4 py-3 bg-muted/30 font-semibold text-sm border-b">
              Transactions ({selectedYear})
            </div>
            {yearTransactions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No transactions for {selectedYear}.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left text-muted-foreground font-medium">
                      Month
                    </th>
                    <th className="px-4 py-2 text-left text-muted-foreground font-medium">
                      Firm
                    </th>
                    <th className="px-4 py-2 text-left text-muted-foreground font-medium">
                      Type
                    </th>
                    <th className="px-4 py-2 text-right text-muted-foreground font-medium">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-left text-muted-foreground font-medium">
                      Note
                    </th>
                    <th className="px-4 py-2 text-right text-muted-foreground font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {yearTransactions.map((tx) => {
                    const firm = propFirms.find(
                      (f) => f.id === tx.tradingAccountId,
                    );
                    return (
                      <tr
                        key={tx.id}
                        className="border-t border-border/50 hover:bg-muted/20"
                      >
                        <td className="px-4 py-2">{tx.month}</td>
                        <td className="px-4 py-2 font-medium">
                          {firm?.name || "Unknown"}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              tx.type === "EXPENSE"
                                ? "bg-red-500/10 text-red-500"
                                : "bg-green-500/10 text-green-500"
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums font-medium">
                          {fmt(tx.amount, tx.currency as "GBP" | "USD")}
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">
                          {tx.note || "-"}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => handleTxEdit(tx)}
                            className="p-1 hover:bg-muted rounded"
                          >
                            <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleTxDelete(tx.id)}
                            className="p-1 hover:bg-muted rounded ml-1"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ─── Firm Add/Edit Modal ─────────────────────────────── */}
      <Modal
        isOpen={isAddOpen || isEditOpen}
        onClose={() => {
          setIsAddOpen(false);
          setIsEditOpen(false);
        }}
      >
        <h2 className="text-xl font-bold mb-4">
          {isAddOpen ? "Add Prop Firm" : "Edit Prop Firm"}
        </h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Firm Name</label>
            <input
              required
              className={dateInputClassName}
              value={currentFirm.name || ""}
              onChange={(e) =>
                setCurrentFirm({ ...currentFirm, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Account Number
            </label>
            <input
              className={dateInputClassName}
              value={currentFirm.accountNumber || ""}
              onChange={(e) =>
                setCurrentFirm({
                  ...currentFirm,
                  accountNumber: e.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <select
                className={dateInputClassName}
                value={currentFirm.status || "Active"}
                onChange={(e) =>
                  setCurrentFirm({ ...currentFirm, status: e.target.value })
                }
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
                className={dateInputClassName}
                value={currentFirm.cost || ""}
                onChange={(e) =>
                  setCurrentFirm({
                    ...currentFirm,
                    cost: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2 mt-4">
              Commission Rates ($ per side)
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Enter the per-side commission for each instrument. Total
              commission = rate × quantity × 2
            </p>
            <div className="grid grid-cols-3 gap-3">
              {TICKERS.map((ticker) => (
                <div key={ticker}>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    {ticker}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className={dateInputClassName}
                    value={commissionRates[ticker] || ""}
                    onChange={(e) =>
                      setCommissionRates({
                        ...commissionRates,
                        [ticker]: Number(e.target.value),
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md font-medium mt-4"
          >
            {isLoading ? "Saving..." : "Save Prop Firm"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
