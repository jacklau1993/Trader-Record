"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Book, Tags, Settings, BarChart2, List, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { authClient } from "@/lib/auth-client";

const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Trades", href: "/trades", icon: List },
    { name: "Notebook", href: "/notebook", icon: Book },
    { name: "Reports", href: "/reports", icon: BarChart2 },
    { name: "Tags", href: "/tags", icon: Tags },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { data: session, isPending } = authClient.useSession();

    // Get user initials for avatar
    const getInitials = (name?: string | null, email?: string | null) => {
        if (name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        if (email) {
            return email[0].toUpperCase();
        }
        return '?';
    };

    const user = session?.user;
    const displayName = user?.name || user?.email?.split('@')[0] || 'User';
    const initials = getInitials(user?.name, user?.email);

    return (
        <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
            <div className="flex h-14 items-center border-b border-border px-6">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                    TraderRecord
                </span>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0",
                                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                )}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t border-border p-4">
                {isPending ? (
                    <div className="flex items-center mb-4">
                        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                        <div className="ml-3 space-y-1">
                            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                            <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                ) : user ? (
                    <>
                        <div className="flex items-center mb-4">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                {initials}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium truncate max-w-[140px]">{displayName}</p>
                                <p className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</p>
                            </div>
                        </div>
                        <SignOutButton />
                    </>
                ) : (
                    <Link
                        href="/sign-in"
                        className="flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <LogIn className="h-4 w-4" />
                        Sign In
                    </Link>
                )}
            </div>
        </div>
    );
}

