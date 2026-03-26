"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useApi } from "@/lib/hooks";
import { Settings } from "lucide-react";

const tabs = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/trades", label: "Trades" },
  { href: "/dashboard/signals", label: "Signals" },
  { href: "/dashboard/analyses", label: "AI Brain" },
  { href: "/dashboard/news", label: "Feed" },
  { href: "/dashboard/engine", label: "Engine" },
];

interface EngineStatus {
  status?: string;
  mode?: string;
}

export function TopNav() {
  const pathname = usePathname();
  const { data: engine } = useApi<EngineStatus>("/api/engine/status", 8000);

  if (!pathname.startsWith("/dashboard")) return null;

  const isRunning = engine?.status === "running";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-t-0 border-x-0">
      <div className="px-4 sm:px-6 md:px-10 lg:px-16 flex items-center h-16 gap-4 md:gap-7">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-md bg-[var(--primary)] opacity-30 blur-md" />
            <div className="relative w-8 h-8 rounded-md bg-[var(--primary)] flex items-center justify-center skew-x-[-4deg]">
              <span className="text-[11px] font-black text-white tracking-tighter skew-x-[4deg]">AX</span>
            </div>
          </div>
          <span className="font-extrabold text-base tracking-tight hidden sm:block">
            AP<span className="text-[var(--primary)]">EX</span>
          </span>
        </Link>

        {/* Tabs */}
        <nav className="flex items-center gap-0.5 flex-1 overflow-x-auto no-scrollbar">
          {tabs.map((t) => {
            const active =
              pathname === t.href ||
              (t.href !== "/dashboard" && pathname.startsWith(t.href));
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  "px-3.5 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap",
                  active
                    ? "bg-[var(--primary)] text-white shadow-[0_0_24px_rgba(225,29,72,0.35)]"
                    : "text-[var(--fg-dim)] hover:text-[var(--fg)] hover:bg-white/10"
                )}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 border border-[var(--border)]">
            <div className={cn("w-1.5 h-1.5 rounded-full", isRunning ? "glow-dot" : "glow-dot-red")} />
            <span className="text-[11px] font-semibold num tracking-wider uppercase hidden sm:inline">
              {isRunning ? "LIVE" : "OFF"}
            </span>
          </div>
          <Link
            href="/dashboard/settings"
            className={cn(
              "w-8 h-8 rounded-md flex items-center justify-center transition-colors",
              pathname.startsWith("/dashboard/settings")
                ? "bg-[var(--primary)] text-white"
                : "bg-white/10 text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-white/20"
            )}
          >
            <Settings className="w-4 h-4" />
          </Link>
          <div className="w-8 h-8 rounded-md bg-[var(--primary)] flex items-center justify-center text-[11px] font-bold text-white">
            M
          </div>
        </div>
      </div>
      <div className="glow-line" />
    </header>
  );
}
