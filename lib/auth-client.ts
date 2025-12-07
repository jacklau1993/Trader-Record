import { createAuthClient } from "better-auth/react"

// No baseURL needed - the client will use relative URLs
// which automatically work on any domain (localhost, staging, production)
export const authClient = createAuthClient()

