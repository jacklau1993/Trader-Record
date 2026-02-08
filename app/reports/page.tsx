
import { getCategories } from "@/app/actions/tag-actions";
import { getTrades } from "@/app/actions/trade-actions";
import { getNotes } from "@/app/actions/note-actions";
import { getNoteTagCategories, getNotesWithTags } from "@/app/actions/note-tag-actions";
import { getAccounts } from "@/app/actions/account-actions";
import ReportsClient from "@/components/reports/ReportsClient";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function ReportsPage() {
    let categories: any[] = [];
    let trades: any[] = [];
    let notes: any[] = [];
    let noteTagCategories: any[] = [];
    let noteTagMap: Record<string, string[]> = {};
    let tagMap: Record<string, any> = {};
    let accounts: any[] = [];

    try {
        const [fetchedCategories, fetchedTrades, fetchedNotes, fetchedNoteTagCategories, tagsData, fetchedAccounts] = await Promise.all([
            getCategories(),
            getTrades(),
            getNotes(),
            getNoteTagCategories(),
            getNotesWithTags(),
            getAccounts(),
        ]);
        categories = fetchedCategories;
        trades = fetchedTrades;
        notes = fetchedNotes;
        noteTagCategories = fetchedNoteTagCategories;
        noteTagMap = tagsData.noteTagMap;
        tagMap = tagsData.tagMap;
        accounts = fetchedAccounts;
    } catch (e) {
        console.error("Failed to fetch reports data:", e);
        redirect("/sign-in");
    }

    return (
        <ReportsClient 
            categories={categories} 
            trades={trades}
            notes={notes}
            noteTagCategories={noteTagCategories}
            noteTagMap={noteTagMap}
            tagMap={tagMap}
            accounts={accounts}
        />
    );
}
