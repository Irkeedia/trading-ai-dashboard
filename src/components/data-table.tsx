import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "success" | "danger" | "warning" | "default";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
        variant === "success" && "bg-[var(--green-dim)] text-[var(--green)]",
        variant === "danger" && "bg-[var(--loss-dim)] text-[var(--loss)]",
        variant === "warning" && "bg-[var(--amber-dim)] text-[var(--amber)]",
        variant === "default" && "bg-[var(--primary-dim)] text-[var(--primary-soft)]"
      )}
    >
      {children}
    </span>
  );
}

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  mono?: boolean;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = "Aucune donnée",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--fg-muted)] text-xs uppercase tracking-widest">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:-mx-5">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "text-left text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[var(--fg-muted)] pb-3 px-4 sm:px-5",
                  col.hideOnMobile && "hidden md:table-cell",
                  col.className
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="border-t border-[var(--border)] hover:bg-[var(--primary)]/[0.03] transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "py-2.5 sm:py-3 px-4 sm:px-5 text-xs sm:text-sm",
                    col.mono && "num",
                    col.hideOnMobile && "hidden md:table-cell",
                    col.className
                  )}
                >
                  {col.render ? col.render(row) : String(row[col.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
