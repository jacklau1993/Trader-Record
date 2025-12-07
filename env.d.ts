// Type declarations for Cloudflare environment
interface CloudflareEnv {
    DB: D1Database;
    BETTER_AUTH_SECRET?: string;
    BETTER_AUTH_URL?: string;
}

declare module "@cloudflare/next-on-pages" {
    export function getRequestContext(): {
        env: CloudflareEnv;
        cf: unknown;
        ctx: ExecutionContext;
    };
}
