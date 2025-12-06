import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    // baseURL can be auto-detected or set via env
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
})
