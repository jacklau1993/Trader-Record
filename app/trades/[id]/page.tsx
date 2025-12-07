
import { getTrade } from "@/app/actions/trade-actions";
import { getCategories } from "@/app/actions/tag-actions";
import { TradeDetailClient } from "@/components/trades/TradeDetailClient";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function TradeDetailPage({ params }: { params: { id: string } }) {
    // Wait for params if needed in Next 15+, but in Next 14 it's sync.
    // Actually in recent Next.js versions params is a promise.
    // If we are on latest, `params` might be a promise.
    // Let's assume standard behavior. If error, I'll fix.

    // In Next.js 15, params is a Promise. In 14 it is not.
    // User info says Next.js 16.0.7? If so, params is Promise.
    // But `params` prop type is usually `{ id: string }` in 14.
    // I will await just in case.

    // Actually, let's treat it as Promise just in case if type checks fail.
    // "Property 'id' does not exist on type 'Promise<{ id: string; }>'."

    const { id } = await Promise.resolve(params); // Safe wrapper

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
