
import { getCategories } from "@/app/actions/tag-actions";
import { getTrades } from "@/app/actions/trade-actions";
import ReportsClient from "@/components/reports/ReportsClient";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function ReportsPage() {
    let categories: any[] = [];
    let trades: any[] = [];

    try {
        categories = await getCategories();
        trades = await getTrades();
    } catch (e) {
        console.error("Failed to fetch reports data:", e);
        redirect("/sign-in");
    }

    return <ReportsClient categories={categories} trades={trades} />;
}

