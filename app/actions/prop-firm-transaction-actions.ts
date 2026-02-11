"use server";

import { getAuthenticatedUser } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";
import { propFirmTransactions } from "@/db/schema";
import { eq, and, like, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTransactions(year?: string) {
  const user = await getAuthenticatedUser();
  const db = getDb();

  const conditions = [eq(propFirmTransactions.userId, user.id)];
  if (year) {
    conditions.push(like(propFirmTransactions.month, `${year}-%`));
  }

  return await db
    .select()
    .from(propFirmTransactions)
    .where(and(...conditions))
    .orderBy(propFirmTransactions.month);
}

export async function getAvailableYears() {
  const user = await getAuthenticatedUser();
  const db = getDb();

  const rows = await db
    .select({ month: propFirmTransactions.month })
    .from(propFirmTransactions)
    .where(eq(propFirmTransactions.userId, user.id));

  const yearSet = new Set<string>(
    rows.map((r: { month: string }) => r.month.split("-")[0]),
  );
  const years = Array.from(yearSet).sort().reverse();
  return years;
}

type CreateTransactionInput = {
  tradingAccountId: string;
  type: "EXPENSE" | "PAYOUT";
  amount: number;
  month: string; // "2026-01"
  note?: string;
};

export async function createTransaction(data: CreateTransactionInput) {
  const user = await getAuthenticatedUser();
  const db = getDb();

  const currency = data.type === "EXPENSE" ? "GBP" : "USD";

  await db.insert(propFirmTransactions).values({
    id: `txn_${Date.now()}`,
    tradingAccountId: data.tradingAccountId,
    userId: user.id,
    type: data.type,
    amount: data.amount,
    currency,
    month: data.month,
    note: data.note || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  revalidatePath("/prop-firms");
  return { success: true };
}

export async function updateTransaction(
  id: string,
  data: Partial<CreateTransactionInput>,
) {
  const user = await getAuthenticatedUser();
  const db = getDb();

  const updateData: any = { updatedAt: new Date() };
  if (data.amount !== undefined) updateData.amount = data.amount;
  if (data.month) updateData.month = data.month;
  if (data.note !== undefined) updateData.note = data.note;
  if (data.type) {
    updateData.type = data.type;
    updateData.currency = data.type === "EXPENSE" ? "GBP" : "USD";
  }

  await db
    .update(propFirmTransactions)
    .set(updateData)
    .where(
      and(
        eq(propFirmTransactions.id, id),
        eq(propFirmTransactions.userId, user.id),
      ),
    );

  revalidatePath("/prop-firms");
  return { success: true };
}

export async function deleteTransaction(id: string) {
  const user = await getAuthenticatedUser();
  const db = getDb();

  await db
    .delete(propFirmTransactions)
    .where(
      and(
        eq(propFirmTransactions.id, id),
        eq(propFirmTransactions.userId, user.id),
      ),
    );

  revalidatePath("/prop-firms");
  return { success: true };
}
