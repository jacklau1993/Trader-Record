import { getNotes, getSections } from "@/app/actions/note-actions";
import { getNoteTagCategories, getNotesWithTags } from "@/app/actions/note-tag-actions";
import NotebookClient from "@/components/notebook/NotebookClient";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';
export default async function NotebookPage() {
    let sections: any[] = [];
    let notes: any[] = [];
    let noteTagCategories: any[] = [];
    let noteTagMap: Record<string, string[]> = {};
    let tagMap: Record<string, any> = {};

    try {
        sections = await getSections();
        notes = await getNotes();
        noteTagCategories = await getNoteTagCategories();
        const tagsData = await getNotesWithTags();
        noteTagMap = tagsData.noteTagMap;
        tagMap = tagsData.tagMap;
    } catch (e) {
        console.error("Failed to fetch notebook data:", e);
        redirect("/sign-in");
    }

    return (
        <NotebookClient 
            initialSections={sections} 
            initialNotes={notes} 
            noteTagCategories={noteTagCategories}
            noteTagMap={noteTagMap}
            tagMap={tagMap}
        />
    );
}
