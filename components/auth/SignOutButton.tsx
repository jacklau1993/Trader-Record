"use client";

import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SignOutButtonProps {
    className?: string;
    collapsed?: boolean;
}

export function SignOutButton({ className, collapsed }: SignOutButtonProps) {
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in");
                },
            },
        });
    };

    return (
        <button
            onClick={handleSignOut}
            className={cn(
                "flex w-full items-center rounded-lg border border-transparent p-2 text-sm font-medium text-destructive/80 transition-all hover:border-destructive/25 hover:bg-destructive/10 hover:text-destructive",
                className
            )}
            title="Sign Out"
        >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-3">Sign Out</span>}
        </button>
    );
}
