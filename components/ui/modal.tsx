"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm">
            <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/15 bg-card/95 p-6 shadow-2xl backdrop-blur-md">
                <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
}
