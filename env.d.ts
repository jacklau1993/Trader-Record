/// <reference types="@cloudflare/workers-types" />

// Type declarations for Cloudflare environment
interface CloudflareEnv {
    DB: D1Database;
    IMAGES: R2Bucket;
    BETTER_AUTH_SECRET?: string;
    BETTER_AUTH_URL?: string;
    RESEND_API_KEY?: string;
}

declare module "@opennextjs/cloudflare" {
    export function getCloudflareContext(): {
        env: CloudflareEnv;
        cf: unknown;
        ctx: ExecutionContext;
    };
}

// Extend Node.js process.env
declare namespace NodeJS {
    interface ProcessEnv {
        RESEND_API_KEY?: string;
        BETTER_AUTH_SECRET?: string;
        BETTER_AUTH_URL?: string;
    }
}
