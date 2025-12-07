"use server";

import { getDb } from "@/lib/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";

// Helper to get current user
async function getCurrentUser() {
    const auth = getAuth();
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }
    return session.user;
}

// Get user preferences (or create default if none exist)
export async function getUserPreferences() {
    const user = await getCurrentUser();
    const db = getDb();

    const existing = await db
        .select()
        .from(schema.userPreferences)
        .where(eq(schema.userPreferences.userId, user.id))
        .get();

    if (existing) {
        return existing;
    }

    // Create default preferences
    const id = `pref_${Date.now()}`;
    const newPrefs = {
        id,
        userId: user.id,
        currency: "USD",
        dateFormat: "YYYY-MM-DD",
        timezone: "UTC",
        theme: "dark",
    };

    await db.insert(schema.userPreferences).values(newPrefs);
    return newPrefs;
}

// Update user preferences
export async function updateUserPreferences(data: {
    currency?: string;
    dateFormat?: string;
    timezone?: string;
    theme?: string;
}) {
    const user = await getCurrentUser();
    const db = getDb();

    // Ensure preferences exist
    await getUserPreferences();

    await db
        .update(schema.userPreferences)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(eq(schema.userPreferences.userId, user.id));

    return { success: true };
}

// Update user profile (name)
export async function updateUserProfile(data: { name: string }) {
    const user = await getCurrentUser();
    const db = getDb();

    await db
        .update(schema.user)
        .set({
            name: data.name,
            updatedAt: new Date(),
        })
        .where(eq(schema.user.id, user.id));

    return { success: true };
}

// Get all trades for export
export async function getTradesForExport() {
    const user = await getCurrentUser();
    const db = getDb();

    const trades = await db
        .select()
        .from(schema.trades)
        .where(eq(schema.trades.userId, user.id))
        .all();

    return trades;
}

// Delete user account
export async function deleteUserAccount() {
    const user = await getCurrentUser();
    const db = getDb();

    // Delete user (cascade will handle related data)
    await db.delete(schema.user).where(eq(schema.user.id, user.id));

    return { success: true };
}
