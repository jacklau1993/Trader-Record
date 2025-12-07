import { getNotes, getSections } from "@/app/actions/note-actions";
import NotebookClient from "@/components/notebook/NotebookClient";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function NotebookPage() {
    let sections: any[] = [];
    let notes: any[] = [];

    try {
        sections = await getSections();
        notes = await getNotes();
    } catch (e) {
        console.error("Failed to fetch notebook data:", e);
        redirect("/sign-in");
    }

    return <NotebookClient initialSections={sections} initialNotes={notes} />;
}
