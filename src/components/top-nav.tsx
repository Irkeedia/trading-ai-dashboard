"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useApi } from "@/lib/hooks";
import { Settings } from "lucide-react";

const tabs = [
  { href: "/dashboard", label: "Vue d’ensemble" },
  { href: "/dashboard/trades", label: "Trades" },
  { href: "/dashboard/signals", label: "Signaux" },
  { href: "/dashboard/analyses", label: "IA" },
  { href: "/dashboard/news", label: "Flux" },
  { href: "/dashboard/engine", label: "Moteur" },
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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--bg)_65%,transparent)] shadow-[var(--shadow-nav)]">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-8 lg:px-12 flex items-center h-[4.25rem] gap-4 md:gap-6">
        <Link href="/dashboard" className="flex items-center gap-3 shrink-0 group">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] opacity-40 blur-lg group-hover:opacity-55 transition-opacity" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-rose-600 flex items-center justify-center shadow-lg ring-1 ring-white/20">
              <span className="text-[11px] font-black text-white tracking-tight">AX</span>
            </div>
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-bold text-[15px] tracking-tight text-[var(--fg)]">APEX</span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--fg-muted)] mt-0.5">
              Terminal
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar py-1 px-1 rounded-2xl bg-white/[0.03] border border-white/[0.06] min-w-0">
          {tabs.map((t) => {
            const active =
              pathname === t.href || (t.href !== "/dashboard" && pathname.startsWith(t.href));
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-[11px] font-semibold tracking-wide transition-all duration-200 whitespace-nowrap",
                  active
                    ? "bg-white/[0.12] text-white shadow-inner ring-1 ring-white/10"
                    : "text-[var(--fg-dim)] hover:text-[var(--fg)] hover:bg-white/[0.06]"
                )}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <div
            className={cn(
              "flex items-center gap-2 pl-3 pr-3 py-2 rounded-xl border transition-colors",
              isRunning
                ? "bg-emerald-500/10 border-emerald-500/25"
                : "bg-white/[0.04] border-white/[0.08]"
            )}
          >
            <div className={cn("w-2 h-2 rounded-full shrink-0", isRunning ? "glow-dot" : "glow-dot-red")} />
            <span className="text-[10px] font-bold num tracking-widest text-[var(--fg-dim)] hidden sm:inline uppercase">
              {isRunning ? "Live" : "Off"}
            </span>
          </div>
          <Link
            href="/dashboard/settings"
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all border",
              pathname.startsWith("/dashboard/settings")
                ? "bg-white/15 text-white border-white/15"
                : "bg-white/[0.05] text-[var(--fg-muted)] border-white/[0.08] hover:bg-white/10 hover:text-[var(--fg)]"
            )}
            aria-label="Paramètres"
          >
            <Settings className="w-[18px] h-[18px]" />
          </Link>
          <div
            className="hidden sm:flex w-10 h-10 rounded-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/10 items-center justify-center text-xs font-bold text-white"
            title="Profil"
          >
            M
          </div>
        </div>
      </div>
      <div className="glow-line opacity-60" />
    </header>
  );
}
