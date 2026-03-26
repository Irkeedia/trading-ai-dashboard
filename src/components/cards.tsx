import { cn } from "@/lib/utils";

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
    <div className={cn(
      "glass rounded-lg p-3 sm:p-4 transition-all group relative overflow-hidden",
      className
    )}>
      {/* Subtle side accent */}
      {trend && (
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-[2px]",
          trend === "up" ? "bg-[var(--green)]" : "bg-[var(--loss)]"
        )} />
      )}
      <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-muted)] mb-1.5 sm:mb-2">
        {label}
      </p>
      <p
        className={cn(
          "num font-bold leading-none",
          large ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl",
          trend === "up" && "text-[var(--green)]",
          trend === "down" && "text-[var(--loss)]",
          !trend && "text-[var(--fg)]"
        )}
      >
        {value}
      </p>
      {sub && <p className="text-[10px] sm:text-[11px] text-[var(--fg-muted)] mt-1 sm:mt-1.5 num">{sub}</p>}
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
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  noPad?: boolean;
}) {
  return (
    <div className={cn("glass rounded-lg overflow-hidden", className)}>
      {title && (
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-[var(--border)]">
          <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
            {title}
          </h2>
          {action}
        </div>
      )}
      <div className={noPad ? "" : "p-4 sm:p-5"}>{children}</div>
    </div>
  );
}

export function Tag({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "buy" | "sell" | "warn" | "ghost";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
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
