"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Home,
  Book,
  Tags,
  Settings,
  BarChart2,
  List,
  LogIn,
  Briefcase,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { authClient } from "@/lib/auth-client";
import { Sheet } from "@/components/ui/sheet";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Trades", href: "/trades", icon: List },
  { name: "Notebook", href: "/notebook", icon: Book },
  { name: "Reports", href: "/reports", icon: BarChart2 },
  { name: "Trade Tags", href: "/tags", icon: Tags },
  { name: "Note Tags", href: "/note-tags", icon: Tags },
  { name: "Prop Firms", href: "/prop-firms", icon: Briefcase },
  { name: "Settings", href: "/settings", icon: Settings },
];

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();
  const accountQuery = searchParams.get("account");

  // Get user initials for avatar
  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "?";
  };

  const user = session?.user;
  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const initials = getInitials(user?.name, user?.email);

  return (
    <div className="relative flex h-full flex-col border-r border-border/80 bg-card/90 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-primary/5" />
      <div className="relative flex h-14 items-center border-b border-border/80 px-6">
        <span className="text-xl font-bold tracking-wide bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
          TraderRecord
        </span>
      </div>
      <nav className="relative flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const shouldCarryAccount =
            item.href === "/trades" || item.href === "/reports";
          const href =
            shouldCarryAccount && accountQuery
              ? { pathname: item.href, query: { account: accountQuery } }
              : item.href;
          return (
            <Link
              key={item.name}
              href={href}
              prefetch={false}
              onClick={onNavigate}
              className={cn(
                "group flex items-center rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                isActive
                  ? "border-primary/35 bg-primary/10 text-foreground shadow-[0_0_0_1px_rgba(19,157,114,0.14)] dark:shadow-[0_0_0_1px_rgba(94,242,183,0.14)]"
                  : "border-transparent text-muted-foreground hover:border-border hover:bg-accent/60 hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="relative border-t border-border/80 p-4">
        {isPending ? (
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-muted/70 animate-pulse" />
            <div className="ml-3 space-y-1">
              <div className="h-4 w-20 rounded bg-muted/70 animate-pulse" />
              <div className="h-3 w-16 rounded bg-muted/70 animate-pulse" />
            </div>
          </div>
        ) : user ? (
          <>
            <div className="flex items-center mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/35 bg-primary/10 font-bold text-primary">
                {initials}
              </div>
              <div className="ml-3">
                <p className="max-w-[140px] truncate text-sm font-medium text-foreground">
                  {displayName}
                </p>
                <p className="max-w-[140px] truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
            <SignOutButton />
          </>
        ) : (
          <Link
            href="/sign-in"
            prefetch={false}
            onClick={onNavigate}
            className="flex w-full items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-border hover:bg-accent/60 hover:text-foreground"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export function Sidebar() {
  return (
    <div className="hidden md:flex h-screen w-64 flex-col">
      <Suspense
        fallback={
          <div className="flex h-full flex-col border-r border-border/80 bg-card/90 animate-pulse" />
        }
      >
        <SidebarContent />
      </Suspense>
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border/80 bg-card/90 px-4 backdrop-blur-xl pointer-events-auto md:hidden">
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="relative z-[60] inline-flex h-9 w-9 items-center justify-center rounded-lg border border-primary/35 bg-primary/10 text-primary shadow-[0_0_0_1px_rgba(19,157,114,0.12)] dark:shadow-[0_0_0_1px_rgba(94,242,183,0.12)] transition hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/60"
      >
        <Menu className="h-5 w-5" strokeWidth={2.4} />
        <span className="sr-only">Open sidebar</span>
      </button>
      <div className="font-semibold tracking-wide text-foreground">TraderRecord</div>
      <Sheet open={open} onOpenChange={setOpen}>
        <Suspense
          fallback={
            <div className="h-full border-r border-border/80 bg-card/90 animate-pulse" />
          }
        >
          <SidebarContent onNavigate={() => setOpen(false)} />
        </Suspense>
      </Sheet>
    </div>
  );
}
