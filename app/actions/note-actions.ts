"use server";

import { getAuthenticatedUser } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";
import { notes, sections } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getNotes() {
    const user = await getAuthenticatedUser();
    const db = getDb();

    // Fetch notes descending by date
    return await db.select()
        .from(notes)
        .where(eq(notes.userId, user.id))
        .orderBy(desc(notes.date));
}

export async function getSections() {
    const user = await getAuthenticatedUser();
    const db = getDb();

    // Fetch sections or return defaults if empty?
    // User might need to init sections.
    const userSections = await db.select().from(sections).where(eq(sections.userId, user.id));

    if (userSections.length === 0) {
        // Init default sections
        const defaults = ["Trade Notes", "Daily Journal", "Strategy", "Backtesting"];
        for (const name of defaults) {
            await db.insert(sections).values({
                id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name,
                userId: user.id
            });
        }
        return await db.select().from(sections).where(eq(sections.userId, user.id));
    }

    return userSections;
}

export async function createNote(data: Omit<typeof notes.$inferInsert, "userId">) {
    const user = await getAuthenticatedUser();
    const db = getDb();

    await db.insert(notes).values({
        ...data,
        userId: user.id
    });

    revalidatePath("/notebook");
    return { success: true };
}

export async function getNoteByTradeId(tradeId: string) {
    const user = await getAuthenticatedUser();
    const db = getDb();

    const note = await db.select()
        .from(notes)
        .where(and(eq(notes.tradeId, tradeId), eq(notes.userId, user.id)))
        .get();

    return note;
}

export async function updateNote(id: string, data: Partial<typeof notes.$inferInsert>) {
    const user = await getAuthenticatedUser();
    const db = getDb();

    await db.update(notes)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(notes.id, id), eq(notes.userId, user.id)));

    revalidatePath("/notebook");
    return { success: true };
}

export async function deleteNote(id: string) {
    const user = await getAuthenticatedUser();
    const db = getDb();

    await db.delete(notes)
        .where(and(eq(notes.id, id), eq(notes.userId, user.id)));

    revalidatePath("/notebook");
    return { success: true };
}
