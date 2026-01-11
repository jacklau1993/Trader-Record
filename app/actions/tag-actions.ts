"use server";

import { getAuthenticatedUser } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";
import { categories, tags } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- Categories ---
export async function getCategories() {
    const user = await getAuthenticatedUser();
    const db = getDb();

    // Fetch categories and their tags
    // Drizzle doesn't do deep nesting automatically easily without `with` query which requires relations defined.
    // For simplicity, we'll fetch both and assemble in JS, or use a join.
    // Let's fetch all categories for user
    const userCats = await db.select().from(categories).where(eq(categories.userId, user.id));
    const userTags = await db.select().from(tags).where(eq(tags.userId, user.id));

    // Assemble
    return userCats.map((cat: any) => ({
        ...cat,
        tags: userTags.filter((t: any) => t.categoryId === cat.id)
    }));
}

export async function createCategory(data: Omit<typeof categories.$inferInsert, "userId">) {
    const user = await getAuthenticatedUser();
    const db = getDb();

    await db.insert(categories).values({
        ...data,
        userId: user.id
    });

    revalidatePath("/tags");
    revalidatePath("/reports");
    return { success: true };
}

export async function deleteCategory(id: string) {
    const user = await getAuthenticatedUser();
    const db = getDb();

    await db.delete(categories).where(and(eq(categories.id, id), eq(categories.userId, user.id)));
    revalidatePath("/tags");
    return { success: true };
}

export async function updateCategory(id: string, data: Partial<typeof categories.$inferInsert>) {
    const user = await getAuthenticatedUser();
    const db = getDb();

    await db.update(categories)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(categories.id, id), eq(categories.userId, user.id)));

    // If color changed, update tags? The current logic does that in UI, 
    // but in DB we might want to cascade or keep them separate.
    // The previous app logic updated all tags.
    if (data.color) {
        await db.update(tags)
            .set({ color: data.color }) // We might need to adjust formatting if color logic changes
            .where(and(eq(tags.categoryId, id), eq(tags.userId, user.id)));
    }

    revalidatePath("/tags");
    return { success: true };
}

// --- Tags ---
export async function createTag(data: Omit<typeof tags.$inferInsert, "userId">) {
    const user = await getAuthenticatedUser();
    const db = getDb();

    await db.insert(tags).values({
        ...data,
        userId: user.id
    });

    revalidatePath("/tags");
    return { success: true };
}

export async function deleteTag(id: string) {
    const user = await getAuthenticatedUser();
    const db = getDb();

    await db.delete(tags).where(and(eq(tags.id, id), eq(tags.userId, user.id)));
    revalidatePath("/tags");
    return { success: true };
}
