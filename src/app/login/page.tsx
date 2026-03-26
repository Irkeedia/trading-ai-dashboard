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

    await new Promise((r) => setTimeout(r, 800));

    if (email && password.length >= 4) {
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
        <div className="flex items-center justify-center gap-2 mb-8 sm:mb-10">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 rounded bg-[var(--primary)] opacity-30 blur-md" />
            <div className="relative w-9 h-9 rounded bg-[var(--primary)] flex items-center justify-center skew-x-[-4deg]">
              <span className="text-xs font-black text-white tracking-tighter skew-x-[4deg]">AX</span>
            </div>
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            AP<span className="text-[var(--primary)]">EX</span>
          </span>
        </div>

        {/* Form card */}
        <div className="glass rounded-lg p-6 sm:p-8">
          <h1 className="text-lg font-bold text-center mb-1">Connexion</h1>
          <p className="text-[10px] text-[var(--fg-muted)] text-center mb-6 sm:mb-8 uppercase tracking-widest font-semibold">
            Accédez à votre terminal
          </p>

          {error && (
            <div className="bg-[var(--loss-dim)] text-[var(--loss)] text-xs font-semibold rounded px-4 py-2.5 mb-5 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[var(--fg-muted)] font-semibold mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-4 py-2.5 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus:border-[var(--primary)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/20 transition-all num"
                placeholder="trader@apex.io"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[var(--fg-muted)] font-semibold mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-4 py-2.5 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus:border-[var(--primary)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/20 transition-all pr-10"
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
              className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] text-white font-bold py-2.5 rounded text-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-6"
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

        <p className="text-center mt-5 sm:mt-6 text-xs text-[var(--fg-muted)]">
          Pas encore de compte ?{" "}
          <Link href="/login" className="text-[var(--primary)] hover:underline font-semibold">
            Demander un accès
          </Link>
        </p>

        <p className="text-center mt-6 sm:mt-8 text-[9px] sm:text-[10px] text-[var(--fg-muted)] uppercase tracking-widest font-bold">
          APEX v1.0 · AI Trading Terminal
        </p>
      </div>
    </div>
  );
}
