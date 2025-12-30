import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db";
import * as schema from "../db/schema";
// import { Resend } from "resend"; // Uncomment when you have a verified domain

// Function to get or create auth instance with proper DB binding
export const getAuth = () => {
    // Always get fresh DB in case context changed
    const db = getDb();

    // Note: Email verification is disabled because Resend's test domain (onboarding@resend.dev)
    // can only send to the email registered with your Resend account.
    // To enable, verify a custom domain in Resend and uncomment the email sections below.

    // Create auth instance with current DB
    return betterAuth({
        database: drizzleAdapter(db, {
            provider: "sqlite",
            schema: schema
        }),
        emailAndPassword: {
            enabled: true,
            // requireEmailVerification: true, // Enable when you have a verified domain
        },
        socialProviders: {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            },
        },
        // Uncomment this section when you have a verified domain in Resend:
        // emailVerification: {
        //     sendOnSignUp: true,
        //     autoSignInAfterVerification: true,
        //     sendVerificationEmail: async ({ user, url }) => {
        //         const resend = new Resend(process.env.RESEND_API_KEY);
        //         await resend.emails.send({
        //             from: "TraderRecord <noreply@yourdomain.com>",
        //             to: user.email,
        //             subject: "Verify Your Email",
        //             html: `<a href="${url}">Verify Email</a>`
        //         });
        //     }
        // },
        trustedOrigins: [
            "https://trader-record.pages.dev",
            // Allow all subdomains for preview deployments
            "https://*.trader-record.pages.dev"
        ]
    });
};

// For backward compatibility, export a lazy getter
export const auth = new Proxy({} as ReturnType<typeof betterAuth>, {
    get(target, prop) {
        const authInstance = getAuth();
        return (authInstance as any)[prop];
    }
});


