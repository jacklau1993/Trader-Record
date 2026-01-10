
import { getTrades } from "@/app/actions/trade-actions";
import { getCategories } from "@/app/actions/tag-actions";
import { TradesListClient } from "@/components/trades/TradesListClient";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function TradesListPage() {
    let trades: any[] = [];
    let categories: any[] = [];
    try {
        trades = await getTrades();
        categories = await getCategories();
    } catch (e) {
        console.error("Failed to fetch trades or categories:", e);
        redirect("/sign-in");
    }

    return <TradesListClient trades={trades} categories={categories} />;
}
