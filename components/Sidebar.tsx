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
    <div className="relative flex h-full flex-col border-r border-white/10 bg-[#0d1420]/95 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-300/10 via-transparent to-cyan-300/5" />
      <div className="relative flex h-14 items-center border-b border-white/10 px-6">
        <span className="text-xl font-bold tracking-wide bg-gradient-to-r from-emerald-200 to-cyan-100 bg-clip-text text-transparent">
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
                  ? "border-emerald-300/30 bg-emerald-300/12 text-emerald-200 shadow-[0_0_0_1px_rgba(94,242,183,0.14)]"
                  : "border-transparent text-zinc-300 hover:border-white/10 hover:bg-white/[0.04] hover:text-white",
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive
                    ? "text-emerald-200"
                    : "text-zinc-500 group-hover:text-zinc-200",
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="relative border-t border-white/10 p-4">
        {isPending ? (
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />
            <div className="ml-3 space-y-1">
              <div className="h-4 w-20 rounded bg-white/10 animate-pulse" />
              <div className="h-3 w-16 rounded bg-white/10 animate-pulse" />
            </div>
          </div>
        ) : user ? (
          <>
            <div className="flex items-center mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200/30 bg-emerald-200/15 font-bold text-emerald-100">
                {initials}
              </div>
              <div className="ml-3">
                <p className="max-w-[140px] truncate text-sm font-medium text-zinc-100">
                  {displayName}
                </p>
                <p className="max-w-[140px] truncate text-xs text-zinc-400">
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
            className="flex w-full items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
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
          <div className="flex h-full flex-col border-r border-white/10 bg-[#0d1420]/95 animate-pulse" />
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
    <div className="sticky top-0 z-40 flex h-14 items-center border-b border-white/10 bg-[#0d1420]/95 px-4 backdrop-blur-xl md:hidden">
      <button
        onClick={() => setOpen(true)}
        className="mr-2 rounded-md p-2 text-zinc-300 hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open sidebar</span>
      </button>
      <div className="font-semibold tracking-wide text-zinc-100">TraderRecord</div>
      <Sheet open={open} onOpenChange={setOpen}>
        <Suspense
          fallback={
            <div className="h-full border-r border-white/10 bg-[#0d1420]/95 animate-pulse" />
          }
        >
          <SidebarContent onNavigate={() => setOpen(false)} />
        </Suspense>
      </Sheet>
    </div>
  );
}
