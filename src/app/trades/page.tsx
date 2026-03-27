"use client";

import { Card } from "@/components/cards";
import { DataTable, Badge } from "@/components/data-table";
import { useApi } from "@/lib/hooks";

interface Trade {
  id: number;
  timestamp: string;
  symbol: string;
  side: string;
  price: number;
  amount: number;
  cost: number;
  pnl: number;
  strategy: string;
  exchange: string;
  notes: string;
  [key: string]: unknown;
}

interface TradeStats {
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  total_pnl: number;
  avg_pnl: number;
  best_trade: number;
  worst_trade: number;
  [key: string]: unknown;
}

export default function TradesPage() {
  const { data: trades, loading } = useApi<Trade[]>("/api/trades?limit=100", 15000);
  const { data: stats } = useApi<TradeStats>("/api/trades/stats", 30000);

  const columns = [
    {
      key: "timestamp",
      label: "Date",
      render: (row: Trade) => {
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
      render: (row: Trade) => <span className="font-medium">{row.symbol}</span>,
    },
    {
      key: "side",
      label: "Côté",
      render: (row: Trade) => (
        <Badge variant={row.side === "buy" ? "success" : "danger"}>
          {row.side.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: "price",
      label: "Prix",
      render: (row: Trade) => `$${row.price.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "amount",
      label: "Montant",
      render: (row: Trade) => row.amount.toFixed(6),
    },
    {
      key: "cost",
      label: "Coût",
      render: (row: Trade) => `$${row.cost.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "pnl",
      label: "PnL",
      render: (row: Trade) => (
        <span className={row.pnl >= 0 ? "text-green-400" : "text-red-400"}>
          {row.pnl >= 0 ? "+" : ""}${row.pnl.toFixed(2)}
        </span>
      ),
    },
    {
      key: "strategy",
      label: "Stratégie",
      render: (row: Trade) => (
        <span className="text-xs text-[var(--muted)]">{row.strategy || "—"}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trades</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Historique complet des trades exécutés
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: "Total", value: stats.total_trades },
            { label: "Gagnants", value: stats.winning_trades, color: "text-green-400" },
            { label: "Perdants", value: stats.losing_trades, color: "text-red-400" },
            { label: "PnL Total", value: `$${stats.total_pnl?.toFixed(2)}`, color: (stats.total_pnl ?? 0) >= 0 ? "text-green-400" : "text-red-400" },
            { label: "PnL Moyen", value: `$${stats.avg_pnl?.toFixed(2)}` },
            { label: "Meilleur", value: `$${stats.best_trade?.toFixed(2)}`, color: "text-green-400" },
            { label: "Pire", value: `$${stats.worst_trade?.toFixed(2)}`, color: "text-red-400" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-3 text-center"
            >
              <p className={`text-lg font-bold ${s.color || ""}`}>{s.value}</p>
              <p className="text-xs text-[var(--muted)]">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <Card title={`Trades (${trades?.length ?? 0})`}>
        {loading ? (
          <div className="text-center py-12 text-[var(--muted)] animate-pulse">
            Chargement...
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={trades || []}
            emptyMessage="Aucun trade enregistré"
          />
        )}
      </Card>
    </div>
  );
}
