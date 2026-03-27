import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Carte avec bandeau titre (pages moteur, analyses, etc.). */
export function Card({
  title,
  children,
  action,
  className,
}: {
  title?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass rounded-2xl overflow-hidden", className)}>
      {title && (
        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
          <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary-soft)]">
            {title}
          </h2>
          {action}
        </div>
      )}
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

/** Métrique avec icône (page moteur). */
export function StatCard({
  title,
  value,
  trend,
  icon: Icon,
}: {
  title: string;
  value: string;
  trend?: "up" | "down";
  icon?: LucideIcon;
}) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-4 sm:p-5 relative overflow-hidden",
        trend === "up" && "ring-1 ring-emerald-500/20",
        trend === "down" && "ring-1 ring-red-500/20"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-muted)] mb-1.5">
            {title}
          </p>
          <p
            className={cn(
              "num font-bold text-xl sm:text-2xl leading-none text-[var(--fg)]",
              trend === "up" && "text-[var(--green)]",
              trend === "down" && "text-[var(--loss)]"
            )}
          >
            {value}
          </p>
        </div>
        {Icon && (
          <Icon className="h-5 w-5 text-[var(--fg-muted)] shrink-0 opacity-70" aria-hidden />
        )}
      </div>
    </div>
  );
}

interface MetricProps {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  large?: boolean;
  className?: string;
}

export function Metric({ label, value, sub, trend, large, className }: MetricProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-5 sm:p-6 transition-all group relative overflow-hidden",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
        aria-hidden
      />
      {trend && (
        <div
          className={cn(
            "absolute left-0 top-3 bottom-3 w-0.5 rounded-full",
            trend === "up" ? "bg-[var(--green)] shadow-[0_0_12px_var(--green)]" : "bg-[var(--loss)] shadow-[0_0_12px_var(--loss)]"
          )}
        />
      )}
      <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--fg-muted)] mb-2 sm:mb-2.5 pl-0.5">
        {label}
      </p>
      <p
        className={cn(
          "num font-bold leading-none",
          large ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
          trend === "up" && "text-[var(--green)]",
          trend === "down" && "text-[var(--loss)]",
          !trend && "text-[var(--fg)]"
        )}
      >
        {value}
      </p>
      {sub && <p className="text-[11px] sm:text-xs text-[var(--fg-muted)] mt-2 num">{sub}</p>}
    </div>
  );
}

export function Panel({
  title,
  children,
  className,
  action,
  noPad,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
  noPad?: boolean;
}) {
  return (
    <div className={cn("glass rounded-2xl overflow-hidden", className)}>
      {title && (
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
          <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary-soft)]">
            {title}
          </h2>
          {action}
        </div>
      )}
      <div className={noPad ? "" : "p-5 sm:p-6"}>{children}</div>
    </div>
  );
}

export function Tag({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "buy" | "sell" | "warn" | "ghost";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
        variant === "buy" && "bg-[var(--green-dim)] text-[var(--green)]",
        variant === "sell" && "bg-[var(--loss-dim)] text-[var(--loss)]",
        variant === "warn" && "bg-[var(--amber-dim)] text-[var(--amber)]",
        variant === "ghost" && "bg-white/5 text-[var(--fg-dim)]",
        variant === "default" && "bg-[var(--primary-dim)] text-[var(--primary-soft)]"
      )}
    >
      {children}
    </span>
  );
}
