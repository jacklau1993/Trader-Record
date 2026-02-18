import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db";
import * as schema from "../db/schema";
// import { Resend } from "resend"; // Uncomment when you have a verified domain

const DEFAULT_AUTH_URL = "https://trader-record.pages.dev";

const normalizeOrigin = (url: string) => {
  try {
    return new URL(url).origin;
  } catch {
    return url.replace(/\/+$/, "");
  }
};

const isLocalDevOrigin = (origin: string) => {
  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
};

// Function to get or create auth instance with proper DB binding
export const getAuth = (customOrigin?: string | null) => {
  // Always get fresh DB in case context changed
  const db = getDb();

  const trustedOrigins = [
    "https://trader-record.pages.dev",
    "https://traderrecord.uk",
    "http://localhost:3000", // next dev
    "http://localhost:8787", // OpenNext + Wrangler preview
    "http://localhost:8788", // legacy wrangler pages dev
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8787",
    "http://127.0.0.1:8788",
  ];

  // Use a stable OAuth base URL to avoid Google redirect_uri_mismatch on preview domains.
  const configuredBaseURL = normalizeOrigin(
    process.env.BETTER_AUTH_URL || DEFAULT_AUTH_URL,
  );
  let baseURL = configuredBaseURL;

  if (!trustedOrigins.includes(configuredBaseURL)) {
    trustedOrigins.push(configuredBaseURL);
  }

  // Only allow dynamic origin in local development.
  if (customOrigin && isLocalDevOrigin(customOrigin)) {
    const localOrigin = normalizeOrigin(customOrigin);
    baseURL = localOrigin;
    if (!trustedOrigins.includes(localOrigin)) {
      trustedOrigins.push(localOrigin);
    }
  }

  // Note: Email verification is disabled because Resend's test domain (onboarding@resend.dev)
  // can only send to the email registered with your Resend account.
  // To enable, verify a custom domain in Resend and uncomment the email sections below.

  // Create auth instance with current DB
  return betterAuth({
    baseURL, // Stable OAuth base URL (except localhost dev)
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: schema,
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
    plugins: [],
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
    trustedOrigins: trustedOrigins,
  });
};

// For backward compatibility, export a lazy getter
export const auth = new Proxy({} as ReturnType<typeof betterAuth>, {
  get(target, prop) {
    const authInstance = getAuth();
    return (authInstance as any)[prop];
  },
});
