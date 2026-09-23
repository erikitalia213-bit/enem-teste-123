"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Mail, MailCheck } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button, Field, cn } from "@/components/ui";
import PlayDiagram from "@/components/diagram/PlayDiagram";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { track } from "@/lib/analytics";
import type { Diagram } from "@/lib/types";

type Mode = "login" | "signup" | "magic" | "reset";

const ERRORS: Record<string, string> = {
  "Invalid login credentials": "Correo o contraseña incorrectos.",
  "Email not confirmed": "Primero confirma tu correo: revisa tu bandeja de entrada (y spam).",
  "User already registered": "Ya existe una cuenta con ese correo. Inicia sesión o recupera tu contraseña.",
};
const translate = (msg: string) => ERRORS[msg] ?? (msg.toLowerCase().includes("rate limit") ? "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." : "No pudimos completar la operación. Inténtalo de nuevo.");

export function EntryForm({ next, configured, devBypass, sample, initialError }: { next: string; configured: boolean; devBypass: boolean; sample: Diagram; initialError: string }) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [coachName, setCoachName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState(initialError);
  const [sent, setSent] = useState("");
  const [busy, setBusy] = useState(false);
  const supabase = getBrowserSupabase();

  const callback = (to: string) => `${window.location.origin}/auth/callback/?next=${encodeURIComponent(to)}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSent("");
    if (!supabase) return;
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Escribe un correo válido.");
    setBusy(true);
    try {
      if (mode === "login") {
        const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (err) return setError(translate(err.message));
        window.location.href = next;
      } else if (mode === "signup") {
        if (password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
        const { data, error: err } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: callback(next), data: { coach_name: coachName.trim(), team_name: teamName.trim() } },
        });
        if (err) return setError(translate(err.message));
        track("Lead", { content_name: "FLAGLAB 5x5" });
        if (data.session) window.location.href = next;
        else setSent("Te enviamos un correo para confirmar tu cuenta. Ábrelo desde este dispositivo para entrar.");
      } else if (mode === "magic") {
        const { error: err } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: callback(next), shouldCreateUser: true } });
        if (err) return setError(translate(err.message));
        setSent("Te enviamos un enlace de acceso. Ábrelo desde este dispositivo.");
      } else {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: callback("/cuenta/nueva-contrasena/") });
        if (err) return setError(translate(err.message));
        setSent("Si existe una cuenta con ese correo, te enviamos un enlace para crear una nueva contraseña.");
      }
    } finally {
      setBusy(false);
    }
  };

  const titles: Record<Mode, string> = { login: "Entra a FLAGLAB", signup: "Crea tu cuenta", magic: "Entra con un enlace", reset: "Recupera tu contraseña" };

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-line bg-pitch-2 lg:block">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" aria-label="FLAGLAB 5x5 inicio">
            <Logo />
          </Link>
          <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-volt/25 shadow-[var(--shadow-glow)]">
            <PlayDiagram diagram={sample} title="Jugada de ejemplo" />
          </div>
          <p className="h-display text-5xl">
            Crea jugadas. Organiza tu playbook.
            <br />
            <span className="text-volt">Llévalo al campo.</span>
          </p>
        </div>
      </div>
      <main id="contenido" className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <p className="eyebrow">Tu cuenta de coach</p>
          <h1 className="h-display mt-1 text-5xl">{titles[mode]}</h1>

          {!configured ? (
            <div className="mt-6 space-y-4">
              {devBypass ? (
                <>
                  <p className="rounded-xl border border-amber/40 bg-amber/10 p-4 text-sm text-amber">Modo desarrollo: Supabase no está configurado y FLAGLAB_DEV_BYPASS_AUTH está activo. Este acceso no existe en producción.</p>
                  <Link href="/app/" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-volt font-semibold text-ink">
                    Entrar en modo desarrollo <ArrowRight size={18} />
                  </Link>
                </>
              ) : (
                <p className="rounded-xl border border-line bg-surface p-4 text-sm text-mist-2">El acceso con cuenta todavía no está configurado en este sitio. Si eres el administrador, revisa docs/DEPLOY.md.</p>
              )}
            </div>
          ) : sent ? (
            <div className="mt-6 rounded-2xl border border-volt/30 bg-volt/10 p-5">
              <MailCheck className="text-volt" size={28} />
              <p className="mt-2 font-semibold">{sent}</p>
              <p className="mt-1 text-sm text-mist-2">¿No llegó? Revisa spam o promociones. Puede tardar unos minutos.</p>
              <button type="button" className="mt-3 text-sm font-semibold text-volt hover:underline" onClick={() => setSent("")}>
                Volver
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              {(mode === "login" || mode === "signup") && (
                <div className="grid grid-cols-2 gap-1 rounded-xl border border-line-2 bg-ink-2 p-1" role="tablist">
                  {(["login", "signup"] as const).map((m) => (
                    <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => (setMode(m), setError(""))} className={cn("h-10 rounded-lg text-sm font-semibold", mode === m ? "bg-volt text-ink" : "text-mist-2 hover:text-snow")}>
                      {m === "login" ? "Iniciar sesión" : "Crear cuenta"}
                    </button>
                  ))}
                </div>
              )}
              {mode === "signup" && (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Tu nombre">{(id) => <input id={id} className="input h-12" autoComplete="name" value={coachName} onChange={(e) => setCoachName(e.target.value)} />}</Field>
                  <Field label="Equipo (opcional)">{(id) => <input id={id} className="input h-12" value={teamName} onChange={(e) => setTeamName(e.target.value)} />}</Field>
                </div>
              )}
              <Field label="Correo electrónico" hint={mode === "signup" ? "Usa el mismo correo con el que compraste." : undefined}>
                {(id) => <input id={id} type="email" className="input h-12" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} required />}
              </Field>
              {(mode === "login" || mode === "signup") && (
                <Field label="Contraseña" hint={mode === "signup" ? "Mínimo 8 caracteres." : undefined}>
                  {(id) => <input id={id} type="password" className="input h-12" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />}
                </Field>
              )}
              {error && (
                <p role="alert" className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">
                  {error}
                </p>
              )}
              <Button type="submit" size="lg" className="w-full" disabled={busy}>
                {busy ? "Un momento…" : mode === "login" ? "Entrar" : mode === "signup" ? "Crear cuenta" : mode === "magic" ? "Enviarme el enlace" : "Enviar enlace de recuperación"}
                {!busy && (mode === "magic" || mode === "reset" ? <Mail size={18} /> : <ArrowRight size={18} />)}
              </Button>
              <div className="flex flex-wrap justify-between gap-2 text-sm">
                {mode !== "magic" ? (
                  <button type="button" className="font-semibold text-volt hover:underline" onClick={() => (setMode("magic"), setError(""))}>
                    Entrar sin contraseña (enlace por correo)
                  </button>
                ) : (
                  <button type="button" className="font-semibold text-volt hover:underline" onClick={() => (setMode("login"), setError(""))}>
                    Entrar con contraseña
                  </button>
                )}
                {mode === "login" && (
                  <button type="button" className="text-mist hover:text-snow" onClick={() => (setMode("reset"), setError(""))}>
                    Olvidé mi contraseña
                  </button>
                )}
                {mode === "reset" && (
                  <button type="button" className="text-mist hover:text-snow" onClick={() => (setMode("login"), setError(""))}>
                    Volver
                  </button>
                )}
              </div>
            </form>
          )}
          <p className="mt-8 text-center text-sm text-mist">
            ¿Aún no tienes FLAGLAB?{" "}
            <Link href="/#precio" className="font-semibold text-volt hover:underline">
              Conócelo aquí
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-mist">
            <Link href="/privacidad/" className="hover:underline">
              Aviso de privacidad
            </Link>{" "}
            ·{" "}
            <Link href="/terminos/" className="hover:underline">
              Términos
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
