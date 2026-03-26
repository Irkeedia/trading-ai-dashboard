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
    <div className={cn("glass rounded-xl p-4 transition-all group", className)}>
      <p className="text-[10px] font-medium uppercase tracking-widest text-[var(--fg-muted)] mb-2">
        {label}
      </p>
      <p
        className={cn(
          "num font-bold leading-none",
          large ? "text-3xl" : "text-xl",
          trend === "up" && "text-[var(--cyan)]",
          trend === "down" && "text-[var(--red)]",
          !trend && "text-[var(--fg)]"
        )}
      >
        {value}
      </p>
      {sub && <p className="text-[11px] text-[var(--fg-muted)] mt-1.5 num">{sub}</p>}
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
    <div className={cn("glass rounded-xl overflow-hidden", className)}>
      {title && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)]">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-dim)]">
            {title}
          </h2>
          {action}
        </div>
      )}
      <div className={noPad ? "" : "p-5"}>{children}</div>
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
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider",
        variant === "buy" && "bg-[var(--cyan-dim)] text-[var(--cyan)]",
        variant === "sell" && "bg-[var(--red-dim)] text-[var(--red)]",
        variant === "warn" && "bg-[var(--amber-dim)] text-[var(--amber)]",
        variant === "ghost" && "bg-white/5 text-[var(--fg-dim)]",
        variant === "default" && "bg-white/8 text-[var(--fg)]"
      )}
    >
      {children}
    </span>
  );
}
