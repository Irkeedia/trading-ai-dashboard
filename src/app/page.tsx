import Link from "next/link";
import {
  Brain,
  Zap,
  Shield,
  BarChart3,
  TrendingUp,
  ArrowRight,
  Activity,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background effects */}
      <div className="hero-gradient fixed inset-0 pointer-events-none" />
      <div className="hero-gradient-secondary fixed inset-0 pointer-events-none" />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-lg bg-[var(--cyan)] opacity-25 blur-md" />
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--cyan)] to-emerald-600 flex items-center justify-center">
              <span className="text-[11px] font-black text-black tracking-tighter">AX</span>
            </div>
          </div>
          <span className="font-bold tracking-tight">APEX</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-[var(--fg-dim)] hover:text-[var(--fg)] transition-colors px-3 py-1.5"
          >
            Connexion
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold bg-[var(--cyan)] text-black px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Commencer
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-6 md:px-12 max-w-[1200px] mx-auto pt-16 md:pt-28 pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--cyan-dim)] text-[var(--cyan)] text-[10px] font-semibold uppercase tracking-widest mb-6">
            <Activity className="w-3 h-3" />
            Trading autonome propulsé par IA
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight">
            Le trading crypto.
            <br />
            <span className="text-[var(--cyan)]">Automatisé.</span>
            <br />
            Intelligent.
          </h1>

          <p className="text-lg md:text-xl text-[var(--fg-dim)] mt-6 max-w-xl leading-relaxed">
            APEX analyse le marché 24/7, détecte les opportunités en temps réel
            grâce à l&apos;IA Gemini, et exécute vos trades automatiquement.
          </p>

          <div className="flex items-center gap-4 mt-10">
            <Link
              href="/login"
              className="group flex items-center gap-2 bg-[var(--cyan)] text-black font-bold px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity"
            >
              Accéder au terminal
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <span className="text-xs text-[var(--fg-muted)] num">v1.0 · BETA</span>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-20">
          {[
            { label: "Trades exécutés", value: "1,284+", icon: TrendingUp },
            { label: "Signaux analysés", value: "12,000+", icon: BarChart3 },
            { label: "Win Rate moyen", value: "68.5%", icon: Zap },
            { label: "Uptime système", value: "99.9%", icon: Activity },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4 text-center">
              <stat.icon className="w-4 h-4 text-[var(--cyan)] mx-auto mb-2" />
              <p className="text-xl font-bold num">{stat.value}</p>
              <p className="text-[10px] text-[var(--fg-muted)] uppercase tracking-widest mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-12 max-w-[1200px] mx-auto pb-20">
        <div className="glow-line mb-12" />
        <div className="grid md:grid-cols-3 gap-4">
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
              desc: "Connexion directe aux exchanges via CCXT. Paper trading ou mode réel.",
            },
          ].map((f) => (
            <div key={f.title} className="glass rounded-xl p-6 group">
              <div className="w-9 h-9 rounded-lg bg-[var(--cyan-dim)] flex items-center justify-center mb-4">
                <f.icon className="w-4.5 h-4.5 text-[var(--cyan)]" />
              </div>
              <h3 className="font-semibold text-sm mb-2">{f.title}</h3>
              <p className="text-xs text-[var(--fg-dim)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Terminal preview */}
      <section className="relative z-10 px-6 md:px-12 max-w-[1200px] mx-auto pb-20">
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--border)]">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--red)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--amber)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--cyan)]" />
            <span className="ml-3 text-[10px] text-[var(--fg-muted)] uppercase tracking-widest">
              apex terminal
            </span>
          </div>
          <div className="p-6 md:p-8 font-mono text-xs space-y-2 text-[var(--fg-dim)]">
            <p><span className="text-[var(--cyan)]">$</span> apex.engine.start <span className="text-[var(--fg-muted)]">--mode=paper</span></p>
            <p className="text-[var(--fg-muted)]">[INFO] Connecting to Binance...</p>
            <p className="text-[var(--fg-muted)]">[INFO] Loading watchlist: BTC/USDT, ETH/USDT, SOL/USDT</p>
            <p className="text-[var(--cyan)]">[OK] Engine started — 11 indicators active</p>
            <p className="text-[var(--fg-muted)]">[AI] Gemini analysis: BTC/USDT → BUY signal (strength: 0.82)</p>
            <p className="text-[var(--cyan)]">[TRADE] BUY 0.015 BTC @ $67,432.50 — cost: $1,011.49</p>
            <p className="text-[var(--fg-muted)]">[RISK] Position size: 10.1% | Stop-loss set: $66,083.85</p>
            <p><span className="text-[var(--cyan)] animate-glow">█</span></p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 md:px-12 max-w-[1200px] mx-auto pb-24 text-center">
        <div className="glow-line mb-12" />
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Prêt à trader intelligemment ?</h2>
        <p className="text-sm text-[var(--fg-dim)] mb-8 max-w-md mx-auto">
          Connectez-vous et accédez à votre terminal de trading IA en quelques secondes.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-[var(--cyan)] text-black font-bold px-8 py-3.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
        >
          Accéder au terminal
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--border)] py-6 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <span className="text-[10px] text-[var(--fg-muted)] uppercase tracking-widest">
            APEX v1.0 · AI Trading Terminal
          </span>
          <span className="text-[10px] text-[var(--fg-muted)]">
            © {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
}
