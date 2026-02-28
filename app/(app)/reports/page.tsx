
import { getCategories } from "@/app/actions/tag-actions";
import { getTrades } from "@/app/actions/trade-actions";
import { getAccounts } from "@/app/actions/account-actions";
import ReportsClient from "@/components/reports/ReportsClient";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
    let categories: any[] = [];
    let trades: any[] = [];
    let accounts: any[] = [];

    try {
        const [fetchedCategories, fetchedTrades, fetchedAccounts] = await Promise.all([
            getCategories(),
            getTrades(),
            getAccounts(),
        ]);
        categories = fetchedCategories;
        trades = fetchedTrades;
        accounts = fetchedAccounts;
    } catch (e) {
        console.error("Failed to fetch reports data:", e);
        redirect("/sign-in");
    }

    return (
        <ReportsClient 
            categories={categories} 
            trades={trades}
            accounts={accounts}
        />
    );
}
