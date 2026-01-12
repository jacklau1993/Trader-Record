"use server";

import { getAuthenticatedUser } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";
import { noteTagCategories, noteTagDefinitions, noteTagAssignments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- Note Tag Categories ---

export async function getNoteTagCategories() {
    const user = await getAuthenticatedUser();
    const db = getDb();

    const userCats = await db.select().from(noteTagCategories).where(eq(noteTagCategories.userId, user.id));
    const userTags = await db.select().from(noteTagDefinitions).where(eq(noteTagDefinitions.userId, user.id));

    return userCats.map((cat: any) => ({
        ...cat,
        tags: userTags.filter((t: any) => t.categoryId === cat.id)
    }));
}

export async function createNoteTagCategory(data: Omit<typeof noteTagCategories.$inferInsert, "userId">) {
    const user = await getAuthenticatedUser();
    const db = getDb();

    await db.insert(noteTagCategories).values({
        ...data,
        userId: user.id
    });

    revalidatePath("/note-tags");
    revalidatePath("/notebook");
    revalidatePath("/reports");
    return { success: true };
}

export async function updateNoteTagCategory(id: string, data: Partial<typeof noteTagCategories.$inferInsert>) {
    const user = await getAuthenticatedUser();
    const db = getDb();

    await db.update(noteTagCategories)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(noteTagCategories.id, id), eq(noteTagCategories.userId, user.id)));

    // If color changed, update all tags in this category
    if (data.color) {
        await db.update(noteTagDefinitions)
            .set({ color: data.color })
            .where(and(eq(noteTagDefinitions.categoryId, id), eq(noteTagDefinitions.userId, user.id)));
    }

    revalidatePath("/note-tags");
    revalidatePath("/notebook");
    return { success: true };
}

export async function deleteNoteTagCategory(id: string) {
    const user = await getAuthenticatedUser();
    const db = getDb();

    await db.delete(noteTagCategories).where(and(eq(noteTagCategories.id, id), eq(noteTagCategories.userId, user.id)));
    revalidatePath("/note-tags");
    revalidatePath("/notebook");
    return { success: true };
}

// --- Note Tags ---

export async function createNoteTag(data: Omit<typeof noteTagDefinitions.$inferInsert, "userId">) {
    const user = await getAuthenticatedUser();
    const db = getDb();

    await db.insert(noteTagDefinitions).values({
        ...data,
        userId: user.id
    });

    revalidatePath("/note-tags");
    revalidatePath("/notebook");
    return { success: true };
}

export async function deleteNoteTag(id: string) {
    const user = await getAuthenticatedUser();
    const db = getDb();

    await db.delete(noteTagDefinitions).where(and(eq(noteTagDefinitions.id, id), eq(noteTagDefinitions.userId, user.id)));
    revalidatePath("/note-tags");
    revalidatePath("/notebook");
    return { success: true };
}

// --- Note Tag Assignments ---

export async function assignNoteTagToNote(noteId: string, tagId: string) {
    const user = await getAuthenticatedUser();
    const db = getDb();

    // Verify tag belongs to user
    const tag = await db.select().from(noteTagDefinitions)
        .where(and(eq(noteTagDefinitions.id, tagId), eq(noteTagDefinitions.userId, user.id)))
        .get();

    if (!tag) {
        throw new Error("Tag not found or unauthorized");
    }

    // Insert assignment (ignore if already exists)
    try {
        await db.insert(noteTagAssignments).values({ noteId, tagId });
    } catch (e: any) {
        // Ignore duplicate key errors
        if (!e.message?.includes("UNIQUE constraint")) {
            throw e;
        }
    }

    revalidatePath("/notebook");
    revalidatePath("/reports");
    return { success: true };
}

export async function unassignNoteTagFromNote(noteId: string, tagId: string) {
    const db = getDb();

    await db.delete(noteTagAssignments)
        .where(and(eq(noteTagAssignments.noteId, noteId), eq(noteTagAssignments.tagId, tagId)));

    revalidatePath("/notebook");
    revalidatePath("/reports");
    return { success: true };
}

export async function getNoteTagsForNote(noteId: string) {
    const user = await getAuthenticatedUser();
    const db = getDb();

    // Get all tag assignments for this note
    const assignments = await db.select()
        .from(noteTagAssignments)
        .where(eq(noteTagAssignments.noteId, noteId));

    if (assignments.length === 0) return [];

    // Get tag details
    const tagIds = assignments.map((a: { tagId: string }) => a.tagId);
    const tags = await db.select().from(noteTagDefinitions)
        .where(and(
            eq(noteTagDefinitions.userId, user.id)
        ));

    return tags.filter((t: { id: string }) => tagIds.includes(t.id));
}

export async function getNotesWithTags() {
    const user = await getAuthenticatedUser();
    const db = getDb();

    // Get all assignments
    const assignments = await db.select().from(noteTagAssignments);

    // Get all tags for this user
    const tags = await db.select().from(noteTagDefinitions)
        .where(eq(noteTagDefinitions.userId, user.id));

    // Build a map of noteId -> tagIds
    const noteTagMap: Record<string, string[]> = {};
    assignments.forEach((a: { noteId: string; tagId: string }) => {
        if (!noteTagMap[a.noteId]) noteTagMap[a.noteId] = [];
        noteTagMap[a.noteId].push(a.tagId);
    });

    // Build a map of tagId -> tag
    const tagMap: Record<string, typeof tags[0]> = {};
    tags.forEach((t: typeof tags[0]) => { tagMap[t.id] = t; });

    return { noteTagMap, tagMap };
}
