import { getCategories } from "@/app/actions/tag-actions";
import TagsClient from "@/components/tags/TagsClient";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function TagsPage() {
    let categories: any[] = [];
    try {
        categories = await getCategories();
    } catch (e) {
        console.error("Failed to fetch categories:", e);
        redirect("/sign-in");
    }

    return <TagsClient initialCategories={categories} />;
}
