import Link from "next/link";
import {
  Brain,
  Zap,
  Shield,
  BarChart3,
  TrendingUp,
  ArrowRight,
  Activity,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="hero-gradient fixed inset-0 pointer-events-none" />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-5 md:px-12 py-4 md:py-5 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded bg-[var(--primary)] opacity-30 blur-md" />
            <div className="relative w-8 h-8 rounded bg-[var(--primary)] flex items-center justify-center skew-x-[-4deg]">
              <span className="text-[11px] font-black text-white tracking-tighter skew-x-[4deg]">AX</span>
            </div>
          </div>
          <span className="font-extrabold tracking-tight">
            AP<span className="text-[var(--primary)]">EX</span>
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="text-xs sm:text-sm text-[var(--fg-dim)] hover:text-[var(--fg)] transition-colors px-3 py-1.5"
          >
            Connexion
          </Link>
          <Link
            href="/login"
            className="text-xs sm:text-sm font-bold bg-[var(--primary)] text-white px-4 py-2 rounded hover:brightness-110 transition-all"
          >
            Commencer
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-5 md:px-12 max-w-[1200px] mx-auto pt-12 md:pt-28 pb-16 md:pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[var(--primary-dim)] text-[var(--primary-soft)] text-[10px] font-bold uppercase tracking-widest mb-5 md:mb-6">
            <div className="relative w-2 h-2">
              <div className="absolute inset-0 rounded-full bg-[var(--primary)] animate-glow" />
              <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
            </div>
            Trading autonome · IA
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
            Le trading crypto.
            <br />
            <span className="text-[var(--primary)]">Automatisé.</span>
            <br />
            <span className="text-[var(--fg-dim)]">Intelligent.</span>
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-[var(--fg-dim)] mt-5 md:mt-6 max-w-xl leading-relaxed">
            APEX analyse le marché 24/7, détecte les opportunités en temps réel
            grâce à l&apos;IA Gemini, et exécute vos trades automatiquement.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-8 md:mt-10">
            <Link
              href="/login"
              className="group flex items-center gap-2 bg-[var(--primary)] text-white font-bold px-6 py-3 rounded text-sm hover:brightness-110 transition-all w-full sm:w-auto justify-center"
            >
              Accéder au terminal
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <span className="text-xs text-[var(--fg-muted)] num self-center">v1.0 · BETA</span>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mt-14 md:mt-20">
          {[
            { label: "Trades exécutés", value: "1,284+", icon: TrendingUp },
            { label: "Signaux analysés", value: "12,000+", icon: BarChart3 },
            { label: "Win Rate moyen", value: "68.5%", icon: Zap },
            { label: "Uptime système", value: "99.9%", icon: Activity },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-lg p-3 sm:p-4 text-center">
              <stat.icon className="w-4 h-4 text-[var(--primary)] mx-auto mb-1.5 sm:mb-2" />
              <p className="text-lg sm:text-xl font-bold num">{stat.value}</p>
              <p className="text-[9px] sm:text-[10px] text-[var(--fg-muted)] uppercase tracking-widest mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-5 md:px-12 max-w-[1200px] mx-auto pb-16 md:pb-20">
        <div className="glow-line mb-10 md:mb-12" />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {[
            {
              icon: Brain,
              title: "IA Gemini intégrée",
              desc: "Analyse technique, sentiment de marché et décision automatisée propulsés par Google Gemini.",
            },
            {
              icon: Shield,
              title: "Risk Management",
              desc: "Stop-loss, take-profit, trailing stops et limites de pertes journalières configurables.",
            },
            {
              icon: Zap,
              title: "Exécution temps réel",
              desc: "Connexion directe aux exchanges via CCXT. Paper trading ou mode live.",
            },
          ].map((f) => (
            <div key={f.title} className="glass rounded-lg p-5 sm:p-6 group hover:border-[var(--primary)]/20 transition-all">
              <div className="w-9 h-9 rounded bg-[var(--primary-dim)] flex items-center justify-center mb-3 sm:mb-4">
                <f.icon className="w-4.5 h-4.5 text-[var(--primary)]" />
              </div>
              <h3 className="font-bold text-sm mb-1.5 sm:mb-2">{f.title}</h3>
              <p className="text-xs text-[var(--fg-dim)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Terminal preview */}
      <section className="relative z-10 px-5 md:px-12 max-w-[1200px] mx-auto pb-16 md:pb-20">
        <div className="glass rounded-lg overflow-hidden border-[var(--primary)]/10">
          <div className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 border-b border-[var(--border)] bg-[var(--primary)]/[0.03]">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--amber)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--green)]" />
            <span className="ml-3 text-[9px] sm:text-[10px] text-[var(--fg-muted)] uppercase tracking-widest font-bold">
              apex terminal
            </span>
          </div>
          <div className="p-4 sm:p-6 md:p-8 font-mono text-[10px] sm:text-xs space-y-1.5 sm:space-y-2 text-[var(--fg-dim)] overflow-x-auto">
            <p><span className="text-[var(--primary)]">$</span> apex.engine.start <span className="text-[var(--fg-muted)]">--mode=paper</span></p>
            <p className="text-[var(--fg-muted)]">[INFO] Connecting to Binance...</p>
            <p className="text-[var(--fg-muted)]">[INFO] Loading watchlist: BTC/USDT, ETH/USDT, SOL/USDT</p>
            <p className="text-[var(--green)]">[OK] Engine started — 11 indicators active</p>
            <p className="text-[var(--fg-muted)]">[AI] Gemini analysis: BTC/USDT → BUY signal (strength: 0.82)</p>
            <p className="text-[var(--primary)]">[TRADE] BUY 0.015 BTC @ $67,432.50 — cost: $1,011.49</p>
            <p className="text-[var(--fg-muted)]">[RISK] Position size: 10.1% | Stop-loss set: $66,083.85</p>
            <p><span className="text-[var(--primary)] animate-glow">█</span></p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-5 md:px-12 max-w-[1200px] mx-auto pb-20 md:pb-24 text-center">
        <div className="glow-line mb-10 md:mb-12" />
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4">
          Prêt à trader <span className="text-[var(--primary)]">intelligemment</span> ?
        </h2>
        <p className="text-xs sm:text-sm text-[var(--fg-dim)] mb-6 sm:mb-8 max-w-md mx-auto">
          Connectez-vous et accédez à votre terminal de trading IA en quelques secondes.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-[var(--primary)] text-white font-bold px-8 py-3.5 rounded text-sm hover:brightness-110 transition-all"
        >
          Accéder au terminal
          <ChevronRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--border)] py-5 sm:py-6 px-5 md:px-12">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[9px] sm:text-[10px] text-[var(--fg-muted)] uppercase tracking-widest font-bold">
            APEX v1.0 · AI Trading Terminal
          </span>
          <span className="text-[9px] sm:text-[10px] text-[var(--fg-muted)]">
            © {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
}
