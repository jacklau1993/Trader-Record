"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/db";
import { tradingAccounts } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Helper to get authenticated user
async function getUser() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session?.user) {
        throw new Error("Unauthorized");
    }
    return session.user;
}

export async function getAccounts() {
    const user = await getUser();
    const db = getDb();

    return await db.select()
        .from(tradingAccounts)
        .where(eq(tradingAccounts.userId, user.id))
        .orderBy(desc(tradingAccounts.createdAt));
}

export async function getAccount(id: string) {
    const user = await getUser();
    const db = getDb();

    return await db.select()
        .from(tradingAccounts)
        .where(and(
            eq(tradingAccounts.id, id),
            eq(tradingAccounts.userId, user.id)
        ))
        .get();
}

type CreateAccountInput = Omit<typeof tradingAccounts.$inferInsert, "userId" | "createdAt" | "updatedAt">;

export async function createAccount(data: CreateAccountInput) {
    const user = await getUser();
    const db = getDb();

    await db.insert(tradingAccounts).values({
        ...data,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    revalidatePath("/prop-firms");
    revalidatePath("/");
    revalidatePath("/settings");
    return { success: true };
}

export async function updateAccount(id: string, data: Partial<CreateAccountInput>) {
    const user = await getUser();
    const db = getDb();

    await db.update(tradingAccounts)
        .set({ ...data, updatedAt: new Date() })
        .where(and(
            eq(tradingAccounts.id, id),
            eq(tradingAccounts.userId, user.id)
        ));

    revalidatePath("/prop-firms");
    revalidatePath("/");
    revalidatePath("/settings");
    return { success: true };
}

export async function deleteAccount(id: string) {
    const user = await getUser();
    const db = getDb();

    await db.delete(tradingAccounts)
        .where(and(
            eq(tradingAccounts.id, id),
            eq(tradingAccounts.userId, user.id)
        ));

    revalidatePath("/prop-firms");
    revalidatePath("/");
    revalidatePath("/settings");
    return { success: true };
}
