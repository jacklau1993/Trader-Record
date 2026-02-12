
import { getTrade } from "@/app/actions/trade-actions";
import { getCategories } from "@/app/actions/tag-actions";
import { TradeDetailClient } from "@/components/trades/TradeDetailClient";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function TradeDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;

    let trade = null;
    let categories: any[] = [];

    try {
        trade = await getTrade(id);
        if (!trade) notFound();
        categories = await getCategories();
    } catch (e) {
        console.error("Failed to fetch trade details:", e);
        // notFound()
    }

    if (!trade) return <div className="p-8">Trade not found</div>;

    return <TradeDetailClient trade={trade} categories={categories} />;
}
