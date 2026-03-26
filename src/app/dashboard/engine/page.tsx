"use client";

import { useState } from "react";
import { Metric, Panel } from "@/components/cards";
import { useApi } from "@/lib/hooks";
import { apiFetch } from "@/lib/utils";
import { Play, Square } from "lucide-react";

interface EngineStatus {
  status: string;
  mode: string;
  exchange: string;
  cycle_count: number;
  uptime_seconds: number;
  error: string;
  timestamp: string;
}

interface Config {
  trading: {
    mode: string;
    base_currency: string;
    max_open_positions: number;
    check_interval_seconds: number;
  };
  exchange: string;
  watchlist: string[];
  risk: {
    max_portfolio_risk_pct: number;
    max_position_size_pct: number;
    stop_loss_pct: number;
    take_profit_pct: number;
    trailing_stop_pct: number;
    max_daily_loss_pct: number;
  };
  ai: {
    provider: string;
    model: string;
  };
}

export default function EnginePage() {
  const { data: status, refetch } = useApi<EngineStatus>("/api/engine/status", 5000);
  const { data: config } = useApi<Config>("/api/config", 60000);
  const [actionLoading, setActionLoading] = useState(false);

  const isRunning = status?.status === "running";

  const uptime = status?.uptime_seconds ?? 0;
  const uptimeStr =
    uptime > 3600
      ? `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${uptime % 60}s`
      : uptime > 60
        ? `${Math.floor(uptime / 60)}m ${uptime % 60}s`
        : `${uptime}s`;

  async function handleAction(action: "start" | "stop") {
    setActionLoading(true);
    try {
      await apiFetch("/api/engine/control", {
        method: "POST",
        body: JSON.stringify({
          action,
          mode: config?.trading.mode || "PAPER",
          exchange: config?.exchange || "binance",
        }),
      });
      setTimeout(refetch, 1000);
    } catch (e) {
      console.error("Engine action failed:", e);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Top bar with action button */}
      <div className="flex items-center justify-between">
        <div />
        <button
          onClick={() => handleAction(isRunning ? "stop" : "start")}
          disabled={actionLoading}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all
            ${
              isRunning
                ? "bg-[var(--red-dim)] text-[var(--red)] hover:bg-[var(--red)]/20 border border-[var(--red)]/30"
                : "bg-[var(--cyan-dim)] text-[var(--cyan)] hover:bg-[var(--cyan)]/20 border border-[var(--cyan)]/30"
            }
            disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {actionLoading ? (
            <span className="animate-spin">⏳</span>
          ) : isRunning ? (
            <Square className="w-3.5 h-3.5" />
          ) : (
            <Play className="w-3.5 h-3.5" />
          )}
          {isRunning ? "Stop" : "Start"}
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Metric
          label="Statut"
          value={isRunning ? "RUNNING" : "STOPPED"}
          trend={isRunning ? "up" : "down"}
        />
        <Metric label="Mode" value={status?.mode || config?.trading.mode || "—"} />
        <Metric label="Uptime" value={uptimeStr} />
        <Metric label="Cycles" value={String(status?.cycle_count ?? 0)} />
      </div>

      {/* Error */}
      {status?.error && (
        <div className="glass rounded-xl p-4 border-[var(--red)]/30">
          <p className="text-[10px] uppercase tracking-widest text-[var(--red)] font-semibold mb-1">Erreur</p>
          <p className="text-sm text-[var(--red)]/80">{status.error}</p>
        </div>
      )}

      <div className="glow-line" />

      {/* Config */}
      {config && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Panel title="Trading Config">
            <div className="space-y-2.5">
              {[
                ["Exchange", config.exchange],
                ["Devise", config.trading.base_currency],
                ["Intervalle", `${config.trading.check_interval_seconds}s`],
                ["Positions max", config.trading.max_open_positions],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between text-sm">
                  <span className="text-[var(--fg-muted)] text-xs uppercase tracking-wider">{label}</span>
                  <span className="font-medium num text-sm">{String(value)}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Risk Management">
            <div className="space-y-2.5">
              {[
                ["Risque max/trade", `${config.risk.max_portfolio_risk_pct}%`],
                ["Taille max position", `${config.risk.max_position_size_pct}%`],
                ["Stop Loss", `${config.risk.stop_loss_pct}%`],
                ["Take Profit", `${config.risk.take_profit_pct}%`],
                ["Trailing Stop", `${config.risk.trailing_stop_pct}%`],
                ["Perte max/jour", `${config.risk.max_daily_loss_pct}%`],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between text-sm">
                  <span className="text-[var(--fg-muted)] text-xs uppercase tracking-wider">{label}</span>
                  <span className="font-medium num text-sm">{value}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="AI Engine">
            <div className="space-y-2.5">
              {[
                ["Provider", config.ai.provider],
                ["Modèle", config.ai.model],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between text-sm">
                  <span className="text-[var(--fg-muted)] text-xs uppercase tracking-wider">{label}</span>
                  <span className="font-medium text-sm">{value}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Watchlist">
            <div className="flex flex-wrap gap-1.5">
              {config.watchlist.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 bg-[var(--cyan-dim)] text-[var(--cyan)] rounded-md text-[10px] font-semibold uppercase tracking-wider"
                >
                  {s}
                </span>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
