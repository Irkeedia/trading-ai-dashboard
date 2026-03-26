"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useApi } from "@/lib/hooks";

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
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center h-14 gap-4 md:gap-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="relative w-7 h-7">
            <div className="absolute inset-0 rounded bg-[var(--primary)] opacity-30 blur-md" />
            <div className="relative w-7 h-7 rounded bg-[var(--primary)] flex items-center justify-center skew-x-[-4deg]">
              <span className="text-[10px] font-black text-white tracking-tighter skew-x-[4deg]">AX</span>
            </div>
          </div>
          <span className="font-extrabold text-sm tracking-tight hidden sm:block">
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
                  "px-3 py-1.5 rounded text-[11px] font-semibold transition-all whitespace-nowrap",
                  active
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--fg-dim)] hover:text-[var(--fg)] hover:bg-white/5"
                )}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-white/5 border border-[var(--border)]">
            <div className={cn("w-1.5 h-1.5 rounded-full", isRunning ? "glow-dot" : "glow-dot-red")} />
            <span className="text-[10px] font-semibold num tracking-wider uppercase hidden sm:inline">
              {isRunning ? "LIVE" : "OFF"}
            </span>
          </div>
          <div className="w-7 h-7 rounded bg-[var(--primary)] flex items-center justify-center text-[10px] font-bold text-white">
            M
          </div>
        </div>
      </div>
      <div className="glow-line" />
    </header>
  );
}
