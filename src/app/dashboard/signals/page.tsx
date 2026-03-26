"use client";

import { Panel, Tag } from "@/components/cards";
import { DataTable } from "@/components/data-table";
import { useApi } from "@/lib/hooks";

interface Signal {
  id: number;
  timestamp: string;
  symbol: string;
  signal_type: string;
  strength: number;
  source: string;
  timeframe: string;
  details: string;
  acted_on: boolean;
  [key: string]: unknown;
}

export default function SignalsPage() {
  const { data: signals, loading } = useApi<Signal[]>("/api/signals?limit=100", 10000);

  const columns = [
    {
      key: "timestamp",
      label: "Date",
      mono: true,
      render: (row: Signal) => {
        const d = new Date(row.timestamp);
        return `${d.toLocaleDateString("fr-FR")} ${d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
      },
    },
    {
      key: "symbol",
      label: "Pair",
      render: (row: Signal) => <span className="font-medium">{row.symbol}</span>,
    },
    {
      key: "signal_type",
      label: "Signal",
      render: (row: Signal) => (
        <Tag variant={row.signal_type === "BUY" ? "buy" : row.signal_type === "SELL" ? "sell" : "warn"}>
          {row.signal_type}
        </Tag>
      ),
    },
    {
      key: "strength",
      label: "Force",
      render: (row: Signal) => {
        const pct = Math.min(Math.abs(row.strength) * 100, 100);
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1 bg-[var(--border)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--primary)] animate-fill"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] num">{pct.toFixed(0)}%</span>
          </div>
        );
      },
    },
    {
      key: "source",
      label: "Source",
      render: (row: Signal) => (
        <span className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider">{row.source}</span>
      ),
    },
    {
      key: "timeframe",
      label: "TF",
      mono: true,
      hideOnMobile: true,
    },
    {
      key: "acted_on",
      label: "Exec",
      render: (row: Signal) => (
        <span className={row.acted_on ? "text-[var(--green)]" : "text-[var(--fg-muted)]"}>
          {row.acted_on ? "✓" : "—"}
        </span>
      ),
    },
    {
      key: "details",
      label: "Détails",
      hideOnMobile: true,
      render: (row: Signal) => (
        <span className="text-[10px] text-[var(--fg-muted)] max-w-[180px] truncate block">
          {row.details || "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <Panel title={`Signaux · ${signals?.length ?? 0}`}>
        {loading ? (
          <div className="text-center py-12 text-[var(--fg-muted)] animate-glow text-xs uppercase tracking-widest">
            Chargement...
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={signals || []}
            emptyMessage="Aucun signal enregistré"
          />
        )}
      </Panel>
    </div>
  );
}
