"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

interface SheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        if (!open) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onOpenChange(false);
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, onOpenChange]);

    if (!mounted || !open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[120] flex">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-[1px] transition-opacity animate-in fade-in-0"
                onClick={() => onOpenChange(false)}
            />

            {/* Drawer */}
            <div className={cn(
                "relative z-[121] h-full w-3/4 max-w-[300px] border-r border-white/10 bg-[#0d1420]/95 p-0 shadow-2xl backdrop-blur-xl transition ease-in-out animate-in slide-in-from-left-full duration-300 sm:max-w-sm",
            )}>
                <button
                    type="button"
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
                    onClick={() => onOpenChange(false)}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
}
