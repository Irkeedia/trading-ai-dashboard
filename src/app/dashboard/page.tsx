"use client";

import { TrendingUp, TrendingDown, Zap, Wallet } from "lucide-react";
import { Metric, Panel, Tag } from "@/components/cards";
import { PortfolioChart } from "@/components/portfolio-chart";
import { useApi } from "@/lib/hooks";

interface DashboardData {
  portfolio: {
    total_value_usdt?: number;
    available_balance?: number;
    positions_value?: number;
    daily_pnl?: number;
    total_pnl?: number;
  };
  stats: {
    total_trades?: number;
    wins?: number;
    losses?: number;
    total_pnl?: number;
    today_pnl?: number;
  };
  engine: {
    status?: string;
    mode?: string;
    cycle_count?: number;
    uptime_seconds?: number;
  };
  recent_signals: Array<{
    symbol: string;
    signal_type: string;
    strength: number;
    source: string;
    timestamp: string;
  }>;
}

interface ChartPoint {
  date: string;
  value: number;
  pnl: number;
}

export default function DashboardPage() {
  const { data, loading } = useApi<DashboardData>("/api/dashboard", 10000);
  const { data: chartData } = useApi<ChartPoint[]>("/api/portfolio/history", 30000);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-glow text-[var(--fg-muted)] text-xs uppercase tracking-widest">
          Initialisation du terminal...
        </div>
      </div>
    );
  }

  const portfolio = data?.portfolio || {};
  const stats = data?.stats || {};
  const engine = data?.engine || {};
  const signals = data?.recent_signals || [];

  const totalValue = portfolio.total_value_usdt ?? 10000;
  const totalPnl = stats.total_pnl ?? 0;
  const todayPnl = stats.today_pnl ?? 0;
  const winRate =
    (stats.total_trades ?? 0) > 0
      ? (((stats.wins ?? 0) / (stats.total_trades ?? 1)) * 100).toFixed(1)
      : "0.0";

  const uptime = engine.uptime_seconds ?? 0;
  const uptimeStr =
    uptime > 3600
      ? `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`
      : `${Math.floor(uptime / 60)}m`;

  return (
    <div className="space-y-5">
      {/* Metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Metric
          label="Portfolio"
          value={`$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          sub={`Libre: $${(portfolio.available_balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 0 })}`}
          large
        />
        <Metric
          label="PnL Total"
          value={`${totalPnl >= 0 ? "+" : ""}$${totalPnl.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          trend={totalPnl >= 0 ? "up" : "down"}
          large
        />
        <Metric
          label="PnL Today"
          value={`${todayPnl >= 0 ? "+" : ""}$${todayPnl.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          trend={todayPnl >= 0 ? "up" : "down"}
        />
        <Metric
          label="Win Rate"
          value={`${winRate}%`}
          sub={`${stats.total_trades ?? 0} trades · ${uptimeStr} uptime`}
        />
      </div>

      <div className="glow-line" />

      {/* Chart + Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel title="Performance" className="lg:col-span-2" noPad>
          <div className="p-4 pt-2">
            <PortfolioChart data={chartData || []} />
          </div>
        </Panel>

        <Panel title="Signaux live">
          <div className="space-y-2 max-h-[280px] overflow-y-auto">
            {signals.length === 0 ? (
              <p className="text-xs text-[var(--fg-muted)] text-center py-8 uppercase tracking-widest">
                Aucun signal
              </p>
            ) : (
              signals.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0"
                >
                  <div>
                    <span className="text-sm font-medium">{s.symbol}</span>
                    <div className="text-[10px] text-[var(--fg-muted)] uppercase">
                      {s.source}
                    </div>
                  </div>
                  <Tag variant={s.signal_type === "BUY" ? "buy" : s.signal_type === "SELL" ? "sell" : "ghost"}>
                    {s.signal_type} {(s.strength * 100).toFixed(0)}%
                  </Tag>
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass rounded-xl p-4 text-center">
          <Zap className="w-4 h-4 text-[var(--cyan)] mx-auto mb-1.5" />
          <p className="text-lg font-bold num">{engine.cycle_count ?? 0}</p>
          <p className="text-[10px] text-[var(--fg-muted)] uppercase tracking-widest">Cycles</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <TrendingUp className="w-4 h-4 text-[var(--cyan)] mx-auto mb-1.5" />
          <p className="text-lg font-bold num">{stats.wins ?? 0}</p>
          <p className="text-[10px] text-[var(--fg-muted)] uppercase tracking-widest">Gagnants</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <TrendingDown className="w-4 h-4 text-[var(--red)] mx-auto mb-1.5" />
          <p className="text-lg font-bold num">{stats.losses ?? 0}</p>
          <p className="text-[10px] text-[var(--fg-muted)] uppercase tracking-widest">Perdants</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <Wallet className="w-4 h-4 text-[var(--amber)] mx-auto mb-1.5" />
          <p className="text-lg font-bold num">
            ${(portfolio.available_balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 0 })}
          </p>
          <p className="text-[10px] text-[var(--fg-muted)] uppercase tracking-widest">Balance</p>
        </div>
      </div>
    </div>
  );
}
