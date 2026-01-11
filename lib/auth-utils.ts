"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Get the authenticated user from the current session.
 * Throws an error if the user is not authenticated.
 */
export async function getAuthenticatedUser() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session?.user) {
        throw new Error("Unauthorized");
    }
    return session.user;
}
