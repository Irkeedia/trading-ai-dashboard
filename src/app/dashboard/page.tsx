"use client";

import { TrendingUp, TrendingDown, Zap, Wallet, Activity, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
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

interface Trade {
  id: number;
  timestamp: string;
  symbol: string;
  side: string;
  price: number;
  amount: number;
  pnl: number;
  [key: string]: unknown;
}

export default function DashboardPage() {
  const { data, loading } = useApi<DashboardData>("/api/dashboard", 10000);
  const { data: chartData } = useApi<ChartPoint[]>("/api/portfolio/history", 30000);
  const { data: recentTrades } = useApi<Trade[]>("/api/trades?limit=5", 15000);

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

  const isRunning = engine.status === "running";
  const uptime = engine.uptime_seconds ?? 0;
  const uptimeStr =
    uptime > 3600
      ? `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`
      : `${Math.floor(uptime / 60)}m`;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Engine status banner */}
      <div className="flex items-center justify-between glass rounded-lg px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className={isRunning ? "glow-dot" : "glow-dot-red"} />
          <span className="text-xs font-bold uppercase tracking-wider">
            Moteur {isRunning ? "actif" : "arrêté"}
          </span>
          {isRunning && (
            <span className="text-[10px] text-[var(--fg-muted)] num">{engine.mode} · {uptimeStr}</span>
          )}
        </div>
        <div className="flex items-center gap-4 text-[10px] text-[var(--fg-muted)] num">
          <span className="hidden sm:inline"><Zap className="w-3 h-3 inline mr-1" />{engine.cycle_count ?? 0} cycles</span>
          <span className="hidden sm:inline"><Clock className="w-3 h-3 inline mr-1" />{uptimeStr}</span>
        </div>
      </div>

      {/* KPI row — 2 cols mobile, 4 cols desktop */}
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
          label="PnL Aujourd'hui"
          value={`${todayPnl >= 0 ? "+" : ""}$${todayPnl.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          trend={todayPnl >= 0 ? "up" : "down"}
        />
        <Metric
          label="Win Rate"
          value={`${winRate}%`}
          sub={`${stats.total_trades ?? 0} trades`}
        />
      </div>

      {/* Chart — full width */}
      <Panel title="Courbe de performance" noPad>
        <div className="p-3 sm:p-4 pt-1 sm:pt-2">
          <PortfolioChart data={chartData || []} />
        </div>
      </Panel>

      {/* Two columns: Derniers trades + Signaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Trades */}
        <Panel title="Derniers trades">
          <div className="space-y-0">
            {(!recentTrades || recentTrades.length === 0) ? (
              <p className="text-xs text-[var(--fg-muted)] text-center py-8 uppercase tracking-widest">Aucun trade</p>
            ) : (
              recentTrades.slice(0, 5).map((t, i) => {
                const d = new Date(t.timestamp);
                const isBuy = t.side === "buy";
                return (
                  <div key={t.id ?? i} className="flex items-center justify-between py-2.5 border-b border-[var(--border)] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded flex items-center justify-center ${isBuy ? "bg-[var(--green-dim)]" : "bg-[var(--loss-dim)]"}`}>
                        {isBuy
                          ? <ArrowUpRight className="w-3.5 h-3.5 text-[var(--green)]" />
                          : <ArrowDownRight className="w-3.5 h-3.5 text-[var(--loss)]" />}
                      </div>
                      <div>
                        <span className="text-sm font-medium">{t.symbol}</span>
                        <div className="text-[10px] text-[var(--fg-muted)] num">
                          {d.toLocaleDateString("fr-FR")} {d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold num ${t.pnl >= 0 ? "text-[var(--green)]" : "text-[var(--loss)]"}`}>
                        {t.pnl >= 0 ? "+" : ""}${t.pnl.toFixed(2)}
                      </span>
                      <div className="text-[10px] text-[var(--fg-muted)] num">
                        ${t.price?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Panel>

        {/* Live Signals */}
        <Panel title="Signaux en direct">
          <div className="space-y-0 max-h-[300px] overflow-y-auto no-scrollbar">
            {signals.length === 0 ? (
              <p className="text-xs text-[var(--fg-muted)] text-center py-8 uppercase tracking-widest">
                Aucun signal
              </p>
            ) : (
              signals.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 border-b border-[var(--border)] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Activity className="w-3.5 h-3.5 text-[var(--fg-muted)]" />
                    <div>
                      <span className="text-sm font-medium">{s.symbol}</span>
                      <div className="text-[10px] text-[var(--fg-muted)] uppercase">{s.source}</div>
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

      {/* Bottom stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-lg font-bold num text-[var(--green)]">{stats.wins ?? 0}</p>
          <p className="text-[9px] text-[var(--fg-muted)] uppercase tracking-widest mt-0.5">Gagnants</p>
        </div>
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-lg font-bold num text-[var(--loss)]">{stats.losses ?? 0}</p>
          <p className="text-[9px] text-[var(--fg-muted)] uppercase tracking-widest mt-0.5">Perdants</p>
        </div>
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-lg font-bold num">{engine.cycle_count ?? 0}</p>
          <p className="text-[9px] text-[var(--fg-muted)] uppercase tracking-widest mt-0.5">Cycles</p>
        </div>
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-lg font-bold num text-[var(--amber)]">
            ${(portfolio.available_balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 0 })}
          </p>
          <p className="text-[9px] text-[var(--fg-muted)] uppercase tracking-widest mt-0.5">Libre</p>
        </div>
      </div>
    </div>
  );
}
