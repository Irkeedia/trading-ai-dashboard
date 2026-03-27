"use client";

import { Card } from "@/components/cards";
import { DataTable, Badge } from "@/components/data-table";
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
      render: (row: Signal) => {
        const d = new Date(row.timestamp);
        return (
          <span className="text-xs">
            {d.toLocaleDateString("fr-FR")} {d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </span>
        );
      },
    },
    {
      key: "symbol",
      label: "Symbole",
      render: (row: Signal) => <span className="font-medium">{row.symbol}</span>,
    },
    {
      key: "signal_type",
      label: "Signal",
      render: (row: Signal) => (
        <Badge
          variant={
            row.signal_type === "BUY"
              ? "success"
              : row.signal_type === "SELL"
                ? "danger"
                : "warning"
          }
        >
          {row.signal_type}
        </Badge>
      ),
    },
    {
      key: "strength",
      label: "Force",
      render: (row: Signal) => {
        const pct = (row.strength * 100).toFixed(0);
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-[var(--card-border)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--accent)]"
                style={{ width: `${Math.min(Math.abs(row.strength) * 100, 100)}%` }}
              />
            </div>
            <span className="text-xs">{pct}%</span>
          </div>
        );
      },
    },
    {
      key: "source",
      label: "Source",
      render: (row: Signal) => (
        <span className="text-xs text-[var(--muted)]">{row.source}</span>
      ),
    },
    {
      key: "timeframe",
      label: "Timeframe",
    },
    {
      key: "acted_on",
      label: "Exécuté",
      render: (row: Signal) => (
        <span className={row.acted_on ? "text-green-400" : "text-[var(--muted)]"}>
          {row.acted_on ? "✓" : "—"}
        </span>
      ),
    },
    {
      key: "details",
      label: "Détails",
      render: (row: Signal) => (
        <span className="text-xs text-[var(--muted)] max-w-[200px] truncate block">
          {row.details || "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Signaux</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Signaux de trading générés par l&apos;analyse
        </p>
      </div>

      <Card title={`Signaux (${signals?.length ?? 0})`}>
        {loading ? (
          <div className="text-center py-12 text-[var(--muted)] animate-pulse">
            Chargement...
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={signals || []}
            emptyMessage="Aucun signal enregistré"
          />
        )}
      </Card>
    </div>
  );
}
