import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { trades, tradeTags, notes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth"; // Need to check if this imports correctly in route handler context
import { headers } from "next/headers";

export const runtime = 'edge';

// Helper to get user in API route
async function getUser() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    return session?.user || null;
}

export async function PATCH(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { id } = params;
        const { tags: tagIds, ...tradeData } = body;
        const db = getDb();

        if (Object.keys(tradeData).length > 0) {
            await db.update(trades)
                .set({ ...tradeData, updatedAt: new Date() })
                .where(and(eq(trades.id, id), eq(trades.userId, user.id)));

            // Sync with Note if exists
            try {
                // We need to fetch the updated trade or just use the data we have + what's in DB?
                // For simplicity let's just fetch the full trade to get latest state for the note
                const updatedTrade = await db.select().from(trades).where(and(eq(trades.id, id), eq(trades.userId, user.id))).get();

                if (updatedTrade) {
                    const note = await db.select().from(notes).where(eq(notes.tradeId, id)).get();
                    if (note) {
                        // Reconstruct content
                        // 1. Parse existing note to find split points? 
                        // Or just regex replace the "Trade Details" section?
                        // The user request says: "Trade Notes section still remain unchanged"
                        // Structure: 
                        // # Trade Details ... ## Notes ... ## Review

                        // Use HTML for TipTap
                        const newDetails = `<p><strong># Trade Details</strong></p>
                        <p>
                        - <strong>Ticker</strong>: ${updatedTrade.ticker}<br>
                        - <strong>Direction</strong>: ${updatedTrade.type}<br>
                        - <strong>Date</strong>: ${updatedTrade.date}<br>
                        - <strong>Net P&L</strong>: $${updatedTrade.pnl.toFixed(2)}
                        </p>`;

                        let newContent = note.content;

                        // Replace Trade Details section
                        // We need to match likely HTML structure or plain text
                        // Simple approach: Match from "# Trade Details" to "## Notes" loosely
                        // We assume the markers might be inside tags like <p># Trade Details</p>
                        const detailsRegex = /# Trade Details[\s\S]*?(?=## Notes)/;
                        if (detailsRegex.test(newContent)) {
                            // If we found the text marker, we replace the block.
                            // We need to be careful not to leave dangling tags if we split HTML.
                            // But usually these sections are somewhat distinct paragraphs.
                            newContent = newContent.replace(detailsRegex, newDetails + "<p></p>");
                        } else {
                            newContent = newDetails + "<p></p>" + newContent;
                        }

                        if (tradeData.notes !== undefined) {
                            const notesHeader = "## Notes";
                            const notesRegex = /## Notes[\s\S]*?(?=## Review|$)/;

                            // Convert newlines in user notes to <br>
                            const formattedNotes = (updatedTrade.notes || "No notes.").replace(/\n/g, "<br>");
                            const newNotesSection = `<p><strong>${notesHeader}</strong></p><p>${formattedNotes}</p><p></p>`;

                            if (notesRegex.test(newContent)) {
                                newContent = newContent.replace(notesRegex, newNotesSection);
                            } else {
                                newContent = newContent + newNotesSection;
                            }
                        }

                        // Update Note Title as well if relevant fields changed
                        if (tradeData.ticker || tradeData.type || tradeData.date) {
                            await db.update(notes)
                                .set({
                                    content: newContent,
                                    title: `${updatedTrade.ticker} ${updatedTrade.type} (${updatedTrade.date})`,
                                    updatedAt: new Date()
                                })
                                .where(eq(notes.id, note.id));
                        } else {
                            await db.update(notes)
                                .set({
                                    content: newContent,
                                    updatedAt: new Date()
                                })
                                .where(eq(notes.id, note.id));
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to sync note:", err);
                // Do not fail the request just because note sync failed?
            }
        }

        if (tagIds !== undefined) {
            // Replace tags
            await db.delete(tradeTags).where(eq(tradeTags.tradeId, id));
            if (tagIds.length > 0) {
                for (const tagId of tagIds) {
                    await db.insert(tradeTags).values({
                        tradeId: id,
                        tagId: tagId
                    });
                }
            }
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("API Update Trade Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update trade" },
            { status: 500 }
        );
    }
}


export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const db = getDb();

        // Safe Delete: Unlink notes first to avoid FK constraints issues on D1
        await db.update(notes)
            .set({ tradeId: null })
            .where(eq(notes.tradeId, id));

        await db.delete(trades)
            .where(and(eq(trades.id, id), eq(trades.userId, user.id)));

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("API Delete Trade Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to delete trade" },
            { status: 500 }
        );
    }
}
