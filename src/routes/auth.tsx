import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { btnGhost, btnPrimary, inputCls } from "@/components/ui-kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — SkillBridge AI" },
      { name: "description", content: "Sign in to your SkillBridge AI competency portfolio to track evidence, skill gaps and opportunities." },
      { property: "og:title", content: "Sign in — SkillBridge AI" },
      { property: "og:description", content: "Access your evidence-backed competency profile." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, student, loading } = useStore();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !session) return;
    void navigate({ to: student && !student.onboarded ? "/onboarding" : "/" });
  }, [session, student, loading, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fn =
      mode === "signup"
        ? supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } })
        : supabase.auth.signInWithPassword({ email, password });
    const { error: err } = await fn;
    if (err) setError(err.message);
    setBusy(false);
  }

  async function google() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) setError("Google sign-in failed. Try email instead.");
  }

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-unit-4 py-unit-8">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant">
        <div className="px-unit-6 py-unit-5 border-b border-outline-variant bg-surface-container-low">
          <div className="flex items-center gap-unit-2">
            <div className="w-8 h-8 bg-primary text-on-primary flex items-center justify-center font-headline-sm text-headline-sm">AF</div>
            <div>
              <h1 className="font-headline-sm text-headline-sm text-primary leading-none">ApexForge SkillBridge AI</h1>
              <p className="font-code-sm text-code-sm text-on-surface-variant">SIH26044 prototype</p>
            </div>
          </div>
        </div>

        <form className="p-unit-6 space-y-unit-4" onSubmit={submit}>
          <div>
            <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant" htmlFor="email">Email</label>
            <input id="email" type="email" required className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant" htmlFor="password">Password</label>
            <input id="password" type="password" required minLength={6} className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <p className="font-body-sm text-body-sm text-error">{error}</p>}

          <button type="submit" className={`${btnPrimary} w-full justify-center`} disabled={busy}>
            {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
          </button>
          <button type="button" className={`${btnGhost} w-full justify-center`} onClick={() => void google()}>
            Continue with Google
          </button>

          <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
            {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
            <button type="button" className="text-primary underline" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}>
              {mode === "signup" ? "Sign in" : "Create one"}
            </button>
          </p>
        </form>
      </div>
    </main>
  );
}
