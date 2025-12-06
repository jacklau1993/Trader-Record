import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Trading Journal",
    description: "Advanced Trading Journal and Notebook",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} flex h-screen overflow-hidden bg-background`}>
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </body>
        </html>
    );
}
