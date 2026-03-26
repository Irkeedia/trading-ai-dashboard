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

  // Don't show nav on landing/auth pages
  if (!pathname.startsWith("/dashboard")) return null;

  const isRunning = engine?.status === "running";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center h-14 gap-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <div className="relative w-7 h-7">
            <div className="absolute inset-0 rounded-md bg-[var(--cyan)] opacity-20 blur-sm" />
            <div className="relative w-7 h-7 rounded-md bg-gradient-to-br from-[var(--cyan)] to-emerald-600 flex items-center justify-center">
              <span className="text-[10px] font-black text-black tracking-tighter">AX</span>
            </div>
          </div>
          <span className="font-bold text-sm tracking-tight hidden sm:block">APEX</span>
        </Link>

        {/* Tabs */}
        <nav className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
          {tabs.map((t) => {
            const active =
              pathname === t.href ||
              (t.href !== "/dashboard" && pathname.startsWith(t.href));
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap",
                  active
                    ? "bg-white/10 text-[var(--fg)]"
                    : "text-[var(--fg-dim)] hover:text-[var(--fg)] hover:bg-white/5"
                )}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/5 border border-[var(--border)]">
            <div className={cn("w-1.5 h-1.5 rounded-full", isRunning ? "glow-dot" : "glow-dot-red")} />
            <span className="text-[10px] font-medium num tracking-wider uppercase">
              {isRunning ? "LIVE" : "OFF"}
            </span>
          </div>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-[10px] font-bold text-black">
            M
          </div>
        </div>
      </div>
      <div className="glow-line" />
    </header>
  );
}
