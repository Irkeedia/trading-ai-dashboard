"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simple demo auth — in production, call a real auth API
    await new Promise((r) => setTimeout(r, 800));

    if (email && password.length >= 4) {
      // Store a simple session token
      document.cookie = "apex_session=authenticated; path=/; max-age=86400; SameSite=Strict";
      router.push("/dashboard");
    } else {
      setError("Email ou mot de passe invalide");
    }

    setLoading(false);
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="hero-gradient fixed inset-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 rounded-lg bg-[var(--cyan)] opacity-25 blur-md" />
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--cyan)] to-emerald-600 flex items-center justify-center">
              <span className="text-xs font-black text-black tracking-tighter">AX</span>
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight">APEX</span>
        </div>

        {/* Form card */}
        <div className="glass rounded-2xl p-8">
          <h1 className="text-lg font-bold text-center mb-1">Connexion</h1>
          <p className="text-xs text-[var(--fg-muted)] text-center mb-8 uppercase tracking-widest">
            Accédez à votre terminal
          </p>

          {error && (
            <div className="bg-[var(--red-dim)] text-[var(--red)] text-xs font-medium rounded-lg px-4 py-2.5 mb-5 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[var(--fg-muted)] font-medium mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus:border-[var(--cyan)]/50 focus:outline-none transition-colors num"
                placeholder="trader@apex.io"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[var(--fg-muted)] font-medium mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus:border-[var(--cyan)]/50 focus:outline-none transition-colors pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[var(--cyan)] text-black font-bold py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <span className="animate-spin text-xs">⏳</span>
              ) : (
                <>
                  Connexion
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs text-[var(--fg-muted)]">
          Pas encore de compte ?{" "}
          <Link href="/login" className="text-[var(--cyan)] hover:underline">
            Demander un accès
          </Link>
        </p>

        <p className="text-center mt-8 text-[10px] text-[var(--fg-muted)] uppercase tracking-widest">
          APEX v1.0 · AI Trading Terminal
        </p>
      </div>
    </div>
  );
}
