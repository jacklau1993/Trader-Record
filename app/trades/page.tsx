
import { getTrades } from "@/app/actions/trade-actions";
import { TradesListClient } from "@/components/trades/TradesListClient";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function TradesListPage() {
    let trades: any[] = [];
    try {
        trades = await getTrades();
    } catch (e) {
        console.error("Failed to fetch trades:", e);
        redirect("/sign-in");
    }

    return <TradesListClient trades={trades} />;
}
