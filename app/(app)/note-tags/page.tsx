import { getNoteTagCategories } from "@/app/actions/note-tag-actions";
import NoteTagsClient from "@/components/note-tags/NoteTagsClient";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function NoteTagsPage() {
    let categories: any[] = [];

    try {
        categories = await getNoteTagCategories();
    } catch (e) {
        console.error("Failed to fetch note tag categories:", e);
        redirect("/sign-in");
    }

    return <NoteTagsClient initialCategories={categories} />;
}
