"use client";

import { useState } from "react";
import { Metric, Panel } from "@/components/cards";
import { useApi } from "@/lib/hooks";
import { apiFetch } from "@/lib/utils";
import { Play, Square, RotateCcw, Settings } from "lucide-react";
import Link from "next/link";

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
      {/* Big status card */}
      <div className="glass rounded-lg p-6 sm:p-8 text-center">
        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${isRunning ? "bg-[var(--green-dim)]" : "bg-[var(--loss-dim)]"}`}>
          <div className={`w-4 h-4 rounded-full relative ${isRunning ? "glow-dot" : "glow-dot-red"}`}>
            {isRunning && <span className="pulse-ring" />}
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-1">
          {isRunning ? "Moteur actif" : "Moteur arrêté"}
        </h2>
        <p className="text-sm text-[var(--fg-muted)]">
          {isRunning
            ? `${status?.mode || "PAPER"} · ${status?.exchange || "binance"} · ${uptimeStr}`
            : "Démarrez le moteur pour trader automatiquement"
          }
        </p>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => handleAction(isRunning ? "stop" : "start")}
            disabled={actionLoading}
            className={`flex items-center gap-2 px-6 py-2.5 rounded text-sm font-bold uppercase tracking-wider transition-all
              ${isRunning
                ? "bg-[var(--loss)] text-white hover:brightness-110"
                : "bg-[var(--green)] text-white hover:brightness-110"
              }
              disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {actionLoading ? (
              <RotateCcw className="w-4 h-4 animate-spin" />
            ) : isRunning ? (
              <Square className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isRunning ? "Arrêter" : "Démarrer"}
          </button>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 px-5 py-2.5 rounded text-sm font-semibold bg-white/5 text-[var(--fg-dim)] hover:bg-white/10 transition-all"
          >
            <Settings className="w-4 h-4" />
            Configurer
          </Link>
        </div>
      </div>

      {/* Status metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
        <div className="glass rounded-lg p-4 border border-[var(--loss)]/30">
          <p className="text-[10px] uppercase tracking-widest text-[var(--loss)] font-semibold mb-1">Erreur</p>
          <p className="text-sm text-[var(--loss)]/80">{status.error}</p>
        </div>
      )}

      {/* Quick config summary */}
      {config && (
        <>
          <div className="glow-line" />
          <Panel title="Configuration active" action={
            <Link href="/dashboard/settings" className="text-[10px] text-[var(--primary)] hover:underline font-semibold uppercase tracking-wider">
              Modifier
            </Link>
          }>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
              {[
                ["Exchange", config.exchange],
                ["Devise", config.trading.base_currency],
                ["Positions max", config.trading.max_open_positions],
                ["Stop Loss", `${config.risk.stop_loss_pct}%`],
                ["Take Profit", `${config.risk.take_profit_pct}%`],
                ["IA", config.ai.model],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between sm:flex-col sm:gap-0.5">
                  <span className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider">{label}</span>
                  <span className="text-sm font-medium num">{String(value)}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[var(--border)]">
              <span className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider mr-2">Watchlist</span>
              {config.watchlist.map((s) => (
                <span key={s} className="px-2 py-0.5 bg-[var(--primary-dim)] text-[var(--primary)] rounded text-[10px] font-bold uppercase tracking-wider">
                  {s}
                </span>
              ))}
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
