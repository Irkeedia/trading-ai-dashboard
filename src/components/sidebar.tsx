"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Signal,
  Brain,
  Newspaper,
  Settings,
  Activity,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trades", label: "Trades", icon: ArrowLeftRight },
  { href: "/signals", label: "Signaux", icon: Signal },
  { href: "/analyses", label: "Analyses IA", icon: Brain },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/engine", label: "Moteur", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[var(--card)] border-r border-[var(--card-border)] flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--card-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Trading IA</h1>
            <p className="text-xs text-[var(--muted)]">Système autonome</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium",
                isActive
                  ? "bg-[var(--accent)]/15 text-[var(--accent-light)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Status bar */}
      <div className="p-4 border-t border-[var(--card-border)]">
        <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <Activity className="w-3 h-3 text-[var(--green)]" />
          <span>Connecté à l&apos;API</span>
        </div>
      </div>
    </aside>
  );
}
