"use server";

import { getAuthenticatedUser } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";
import { templates } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTemplates() {
    const user = await getAuthenticatedUser();
    const db = getDb();

    const userTemplates = await db.select().from(templates).where(eq(templates.userId, user.id));

    if (userTemplates.length === 0) {
        // Init defaults
        const defaults = [
            { name: "Daily Plan", content: "\n# Daily Plan\n- [ ] Review Overnight Action\n- [ ] Check Economic Calendar\n- [ ] Key Levels to Watch:\n  - ES: \n  - NQ: \n" },
            { name: "Trade Review", content: "\n# Trade Review\n- Setup:\n- Execution:\n- Psychology:\n- Outcome:\n- Improvements:\n" },
            { name: "Weekly Review", content: "\n# Weekly Review\n- P&L: \n- Best Trade:\n- Worst Trade:\n- Lessons Learned:\n" }
        ];

        for (const t of defaults) {
            await db.insert(templates).values({
                id: `tmpl_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                userId: user.id,
                name: t.name,
                content: t.content
            });
        }
        return await db.select().from(templates).where(eq(templates.userId, user.id));
    }

    return userTemplates;
}

export async function createTemplate(data: Omit<typeof templates.$inferInsert, "userId">) {
    const user = await getAuthenticatedUser();
    const db = getDb();

    await db.insert(templates).values({
        ...data,
        userId: user.id
    });
    // No specific page to revalidate for templates unless we have a manager page. 
    // But Editor uses them. 
    return { success: true };
}

export async function updateTemplate(id: string, data: Partial<typeof templates.$inferInsert>) {
    const user = await getAuthenticatedUser();
    const db = getDb();

    await db.update(templates)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(templates.id, id), eq(templates.userId, user.id)));
    return { success: true };
}

export async function deleteTemplate(id: string) {
    const user = await getAuthenticatedUser();
    const db = getDb();

    await db.delete(templates).where(and(eq(templates.id, id), eq(templates.userId, user.id)));
    return { success: true };
}
