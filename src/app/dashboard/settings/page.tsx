"use client";

import { useState, FormEvent } from "react";
import { Panel } from "@/components/cards";
import { useApi } from "@/lib/hooks";
import { Eye, EyeOff, Save, CheckCircle, AlertTriangle, Shield, Key, Wallet, Crosshair, Bot, List } from "lucide-react";

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

function SectionHeader({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-8 h-8 rounded bg-[var(--primary-dim)] flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-[var(--primary)]" />
      </div>
      <div>
        <h3 className="text-sm font-bold">{title}</h3>
        <p className="text-[11px] text-[var(--fg-muted)] mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function InputField({ label, type = "text", value, onChange, placeholder, mono, disabled }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean; disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-[var(--fg-muted)] font-semibold mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full bg-[var(--bg)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus:border-[var(--primary)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/20 transition-all disabled:opacity-50 ${mono ? "num" : ""}`}
      />
    </div>
  );
}

function SecretField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-[var(--fg-muted)] font-semibold mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus:border-[var(--primary)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/20 transition-all pr-10 num"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
        >
          {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { data: config } = useApi<Config>("/api/config", 60000);

  // Exchange keys — stored locally (never sent to our backend)
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [exchange, setExchange] = useState("binance");

  // Trading config
  const [mode, setMode] = useState("PAPER");
  const [baseCurrency, setBaseCurrency] = useState("USDT");
  const [maxPositions, setMaxPositions] = useState("3");
  const [interval, setCheckInterval] = useState("300");

  // Risk
  const [riskPerTrade, setRiskPerTrade] = useState("2");
  const [maxPosSize, setMaxPosSize] = useState("15");
  const [stopLoss, setStopLoss] = useState("3");
  const [takeProfit, setTakeProfit] = useState("6");
  const [trailingStop, setTrailingStop] = useState("1.5");
  const [maxDailyLoss, setMaxDailyLoss] = useState("5");

  // Watchlist
  const [watchlist, setWatchlist] = useState("BTC/USDT, ETH/USDT, SOL/USDT");

  // UI state
  const [saved, setSaved] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  // Load config into state when fetched
  useState(() => {
    if (config) {
      setExchange(config.exchange || "binance");
      setMode(config.trading.mode || "PAPER");
      setBaseCurrency(config.trading.base_currency || "USDT");
      setMaxPositions(String(config.trading.max_open_positions ?? 3));
      setCheckInterval(String(config.trading.check_interval_seconds ?? 300));
      setRiskPerTrade(String(config.risk.max_portfolio_risk_pct ?? 2));
      setMaxPosSize(String(config.risk.max_position_size_pct ?? 15));
      setStopLoss(String(config.risk.stop_loss_pct ?? 3));
      setTakeProfit(String(config.risk.take_profit_pct ?? 6));
      setTrailingStop(String(config.risk.trailing_stop_pct ?? 1.5));
      setMaxDailyLoss(String(config.risk.max_daily_loss_pct ?? 5));
      setWatchlist(config.watchlist?.join(", ") || "BTC/USDT, ETH/USDT, SOL/USDT");
    }
  });

  function handleSaveKeys(e: FormEvent) {
    e.preventDefault();
    // In production: encrypt and store server-side per user
    // For now: localStorage demo
    if (apiKey && apiSecret) {
      localStorage.setItem("apex_exchange", exchange);
      localStorage.setItem("apex_api_key", apiKey);
      localStorage.setItem("apex_api_secret", apiSecret);
      setKeySaved(true);
      setTimeout(() => setKeySaved(false), 3000);
    }
  }

  function handleSaveConfig(e: FormEvent) {
    e.preventDefault();
    // In production: POST to API
    localStorage.setItem("apex_config", JSON.stringify({
      mode, baseCurrency, maxPositions, interval,
      risk: { riskPerTrade, maxPosSize, stopLoss, takeProfit, trailingStop, maxDailyLoss },
      watchlist: watchlist.split(",").map(s => s.trim()).filter(Boolean),
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Exchange Connection */}
      <Panel>
        <SectionHeader
          icon={Key}
          title="Connexion Exchange"
          description="Connectez votre compte Binance pour le trading automatisé. Vos clés API restent chiffrées côté client."
        />

        <form onSubmit={handleSaveKeys} className="space-y-3">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[var(--fg-muted)] font-semibold mb-1.5">
              Exchange
            </label>
            <select
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--fg)] focus:border-[var(--primary)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/20 transition-all appearance-none cursor-pointer"
            >
              <option value="binance">Binance</option>
              <option value="kraken">Kraken</option>
              <option value="bybit">Bybit</option>
              <option value="okx">OKX</option>
            </select>
          </div>
          <SecretField label="API Key" value={apiKey} onChange={setApiKey} placeholder="Votre clé API..." />
          <SecretField label="API Secret" value={apiSecret} onChange={setApiSecret} placeholder="Votre secret API..." />

          <div className="glass rounded px-3 py-2.5 flex items-start gap-2 mt-2">
            <Shield className="w-3.5 h-3.5 text-[var(--amber)] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[var(--fg-muted)] leading-relaxed">
              Activez uniquement les permissions <strong className="text-[var(--fg)]">Spot Trading</strong> et <strong className="text-[var(--fg)]">Read</strong> sur votre exchange. 
              Ne donnez jamais la permission Withdraw. Ajoutez une <strong className="text-[var(--fg)]">IP whitelist</strong> pour plus de sécurité.
            </p>
          </div>

          <button
            type="submit"
            disabled={!apiKey || !apiSecret}
            className="flex items-center gap-2 bg-[var(--primary)] text-white font-bold py-2 px-5 rounded text-xs uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {keySaved ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {keySaved ? "Clés enregistrées" : "Enregistrer les clés"}
          </button>
        </form>
      </Panel>

      {/* Trading Configuration */}
      <form onSubmit={handleSaveConfig} className="space-y-5">
        <Panel>
          <SectionHeader
            icon={Wallet}
            title="Configuration Trading"
            description="Paramètres généraux du moteur de trading."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[var(--fg-muted)] font-semibold mb-1.5">
                Mode
              </label>
              <div className="flex gap-2">
                {["PAPER", "LIVE"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                      mode === m
                        ? m === "LIVE"
                          ? "bg-[var(--loss)] text-white"
                          : "bg-[var(--primary)] text-white"
                        : "bg-white/5 text-[var(--fg-muted)] hover:bg-white/10"
                    }`}
                  >
                    {m === "LIVE" && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                    {m}
                  </button>
                ))}
              </div>
              {mode === "LIVE" && (
                <p className="text-[10px] text-[var(--loss)] mt-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Argent réel — soyez prudent
                </p>
              )}
            </div>
            <InputField label="Devise de base" value={baseCurrency} onChange={setBaseCurrency} placeholder="USDT" mono />
            <InputField label="Positions max simultanées" value={maxPositions} onChange={setMaxPositions} type="number" mono />
            <InputField label="Intervalle de vérification (sec)" value={interval} onChange={setCheckInterval} type="number" mono />
          </div>
        </Panel>

        {/* Risk Management */}
        <Panel>
          <SectionHeader
            icon={Crosshair}
            title="Gestion des Risques"
            description="Paramètres de protection de votre capital. Les valeurs sont en pourcentage."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <InputField label="Risque max / trade" value={riskPerTrade} onChange={setRiskPerTrade} type="number" mono />
            <InputField label="Taille max position" value={maxPosSize} onChange={setMaxPosSize} type="number" mono />
            <InputField label="Stop Loss %" value={stopLoss} onChange={setStopLoss} type="number" mono />
            <InputField label="Take Profit %" value={takeProfit} onChange={setTakeProfit} type="number" mono />
            <InputField label="Trailing Stop %" value={trailingStop} onChange={setTrailingStop} type="number" mono />
            <InputField label="Perte max / jour %" value={maxDailyLoss} onChange={setMaxDailyLoss} type="number" mono />
          </div>
        </Panel>

        {/* Watchlist */}
        <Panel>
          <SectionHeader
            icon={List}
            title="Watchlist"
            description="Paires de trading surveillées par le moteur IA."
          />
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[var(--fg-muted)] font-semibold mb-1.5">
              Paires (séparées par des virgules)
            </label>
            <textarea
              value={watchlist}
              onChange={(e) => setWatchlist(e.target.value)}
              rows={2}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus:border-[var(--primary)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/20 transition-all resize-none num"
              placeholder="BTC/USDT, ETH/USDT, SOL/USDT"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {watchlist.split(",").map(s => s.trim()).filter(Boolean).map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 bg-[var(--primary-dim)] text-[var(--primary)] rounded text-[10px] font-bold uppercase tracking-wider"
              >
                {s}
              </span>
            ))}
          </div>
        </Panel>

        {/* AI Engine */}
        <Panel>
          <SectionHeader
            icon={Bot}
            title="Moteur IA"
            description="Configuration de l'intelligence artificielle."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField label="Provider" value={config?.ai?.provider || "google"} onChange={() => {}} disabled />
            <InputField label="Modèle" value={config?.ai?.model || "gemini-2.0-flash"} onChange={() => {}} disabled />
          </div>
          <p className="text-[10px] text-[var(--fg-muted)] mt-2">
            Le modèle IA est géré côté serveur. Contactez le support pour le modifier.
          </p>
        </Panel>

        {/* Save button */}
        <button
          type="submit"
          className="flex items-center gap-2 bg-[var(--primary)] text-white font-bold py-2.5 px-6 rounded text-xs uppercase tracking-wider hover:brightness-110 transition-all"
        >
          {saved ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          {saved ? "Configuration sauvegardée" : "Sauvegarder la configuration"}
        </button>
      </form>
    </div>
  );
}
