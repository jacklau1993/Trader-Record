
import { getTrades } from "@/app/actions/trade-actions";
import { getCategories } from "@/app/actions/tag-actions";
import { getAccounts } from "@/app/actions/account-actions";
import { TradesListClient } from "@/components/trades/TradesListClient";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function TradesListPage() {
    let trades: any[] = [];
    let categories: any[] = [];
    let accounts: any[] = [];
    try {
        [trades, categories, accounts] = await Promise.all([
            getTrades(),
            getCategories(),
            getAccounts(),
        ]);
    } catch (e) {
        console.error("Failed to fetch trades, categories, or accounts:", e);
        redirect("/sign-in");
    }

    return <TradesListClient trades={trades} categories={categories} accounts={accounts} />;
}
