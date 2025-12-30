import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar, MobileSidebar } from "@/components/Sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "TraderRecord",
    description: "Advanced Trading Journal and Notebook",
    icons: {
        icon: "/favicon.png",
    },
};

export const runtime = 'edge';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={`${inter.className} flex h-screen overflow-hidden bg-background flex-col md:flex-row`}>
                <MobileSidebar />
                <Sidebar />
                <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
                    {children}
                </main>
            </body>
        </html>
    );
}
