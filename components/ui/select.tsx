"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const SelectContext = React.createContext<{ 
    value: string; 
    onValueChange: (v: string) => void;
    open: boolean;
    setOpen: (o: boolean) => void;
}>({ value: "", onValueChange: () => {}, open: false, setOpen: () => {} });

export const Select = ({ children, value, onValueChange, defaultValue }: any) => {
    const [val, setVal] = React.useState(value || defaultValue || "");
    const [open, setOpen] = React.useState(false);
    
    // Handle outside click to close
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <SelectContext.Provider value={{ value: val, onValueChange: (v) => { setVal(v); onValueChange?.(v); }, open, setOpen }}>
            <div ref={ref} className="relative inline-block w-full">
                {children}
            </div>
        </SelectContext.Provider>
    )
}

export const SelectTrigger = ({ className, children }: any) => {
    const { open, setOpen } = React.useContext(SelectContext);
    return (
        <button
            type="button"
            onClick={() => setOpen(!open)}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
        >
            {children}
            <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)' }} />
        </button>
    )
}

export const SelectValue = ({ placeholder }: any) => {
    const { value } = React.useContext(SelectContext);
    return (
        <span style={{ pointerEvents: 'none' }}>
            {value || placeholder}
        </span>
    )
}

export const SelectContent = ({ className, children, position = "item-aligned" }: any) => {
    const { open } = React.useContext(SelectContext);
    if (!open) return null;
    return (
        <div className={cn(
            "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 mt-1 w-full",
            position === "popper" && "translate-y-1",
            className
        )}>
            <div className="p-1">
                {children}
            </div>
        </div>
    )
}

export const SelectItem = ({ children, value, className }: any) => {
    const { setOpen, onValueChange, value: selectedValue } = React.useContext(SelectContext);
    return (
        <div
            className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-muted cursor-pointer",
                selectedValue === value && "bg-muted font-medium",
                className
            )}
            onClick={() => {
                onValueChange(value);
                setOpen(false);
            }}
        >
            {/* Checkmark placeholder logic could go here */}
            {selectedValue === value && (
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    ✓
                </span>
            )}
            {children}
        </div>
    )
}
