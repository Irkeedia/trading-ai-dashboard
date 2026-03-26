"use client";

import { Metric, Panel, Tag } from "@/components/cards";
import { DataTable } from "@/components/data-table";
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
      mono: true,
      render: (row: Trade) => {
        const d = new Date(row.timestamp);
        return `${d.toLocaleDateString("fr-FR")} ${d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
      },
    },
    {
      key: "symbol",
      label: "Pair",
      render: (row: Trade) => <span className="font-medium">{row.symbol}</span>,
    },
    {
      key: "side",
      label: "Side",
      render: (row: Trade) => (
        <Tag variant={row.side === "buy" ? "buy" : "sell"}>
          {row.side.toUpperCase()}
        </Tag>
      ),
    },
    {
      key: "price",
      label: "Prix",
      mono: true,
      render: (row: Trade) => `$${row.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "amount",
      label: "Qty",
      mono: true,
      render: (row: Trade) => row.amount.toFixed(6),
    },
    {
      key: "cost",
      label: "Coût",
      mono: true,
      render: (row: Trade) => `$${row.cost.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "pnl",
      label: "PnL",
      mono: true,
      render: (row: Trade) => (
        <span className={row.pnl >= 0 ? "text-[var(--green)]" : "text-[var(--loss)]"}>
          {row.pnl >= 0 ? "+" : ""}${row.pnl.toFixed(2)}
        </span>
      ),
    },
    {
      key: "strategy",
      label: "Stratégie",
      render: (row: Trade) => (
        <span className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider">{row.strategy || "—"}</span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <Metric label="Total" value={String(stats.total_trades)} />
          <Metric label="Gagnants" value={String(stats.winning_trades)} trend="up" />
          <Metric label="Perdants" value={String(stats.losing_trades)} trend="down" />
          <Metric
            label="PnL Total"
            value={`$${stats.total_pnl?.toFixed(2)}`}
            trend={(stats.total_pnl ?? 0) >= 0 ? "up" : "down"}
          />
          <Metric label="PnL Moyen" value={`$${stats.avg_pnl?.toFixed(2)}`} />
          <Metric label="Meilleur" value={`$${stats.best_trade?.toFixed(2)}`} trend="up" />
          <Metric label="Pire" value={`$${stats.worst_trade?.toFixed(2)}`} trend="down" />
        </div>
      )}

      <div className="glow-line" />

      {/* Table */}
      <Panel title={`Trades · ${trades?.length ?? 0}`}>
        {loading ? (
          <div className="text-center py-12 text-[var(--fg-muted)] animate-glow text-xs uppercase tracking-widest">
            Chargement...
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={trades || []}
            emptyMessage="Aucun trade enregistré"
          />
        )}
      </Panel>
    </div>
  );
}
