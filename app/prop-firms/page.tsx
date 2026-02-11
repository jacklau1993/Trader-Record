import { getAccounts } from "@/app/actions/account-actions";
import {
  getTransactions,
  getAvailableYears,
} from "@/app/actions/prop-firm-transaction-actions";
import { PropFirmManager } from "@/components/prop-firms/PropFirmManager";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function PropFirmsPage() {
  let accounts: any[] = [];
  let transactions: any[] = [];
  let availableYears: string[] = [];

  try {
    accounts = await getAccounts();
  } catch (e) {
    console.error("Failed to fetch accounts:", e);
    redirect("/sign-in");
  }

  // Fetch transactions separately — table may not exist yet after migration
  try {
    [transactions, availableYears] = await Promise.all([
      getTransactions(),
      getAvailableYears(),
    ]);
  } catch (e) {
    console.error("Failed to fetch transactions (table may not exist yet):", e);
    transactions = [];
    availableYears = [];
  }

  const propFirms = accounts.filter((a: any) => a.type === "PROP_FIRM");

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Prop Firms</h2>
      </div>
      <PropFirmManager
        initialPropFirms={propFirms}
        initialTransactions={transactions}
        availableYears={availableYears}
      />
    </div>
  );
}
