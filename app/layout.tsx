import type { Metadata } from "next";
import { Rajdhani } from "next/font/google";
import "./globals.css";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
});

export const metadata: Metadata = {
  title: "TraderRecord — Your Trading Journal, Elevated",
  description:
    "Professional cloud-first trading journal. Track trades, analyze performance with advanced metrics, manage prop firm accounts, and maintain a rich-text trading notebook. Built on the edge.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export const runtime = "edge";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${rajdhani.variable} bg-background`}>{children}</body>
    </html>
  );
}
