import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  mono?: boolean;
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
    <div className="overflow-x-auto -mx-5">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "text-left text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-muted)] pb-3 px-5",
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
              className="border-t border-[var(--border)] hover:bg-white/[0.015] transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "py-3 px-5 text-sm",
                    col.mono && "num",
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
