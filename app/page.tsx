import { getTrades } from "@/app/actions/trade-actions";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { redirect } from "next/navigation";

// Force dynamic since we use headers/cookies for auth
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    let trades: any[] = [];
    try {
        trades = await getTrades();
    } catch (e) {
        // Assume any error in getTrades for main page is likely auth or critical failure
        // For a better UX, redirect to sign-in if unauthorized.
        // Since we can't easily distinguish server action errors without parsing message:
        console.error("Failed to fetch trades:", e);
        redirect("/sign-in");
    }

    return <DashboardClient initialTrades={trades} />;
}
