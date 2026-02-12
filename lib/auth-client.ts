import { createAuthClient } from "better-auth/react"

// Client uses same-origin /api/auth endpoints.
// OAuth provider callback URLs are decided server-side by BETTER_AUTH_URL.
export const authClient = createAuthClient()
