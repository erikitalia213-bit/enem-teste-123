"use client";

import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button, Field } from "@/components/ui";
import { getBrowserSupabase } from "@/lib/supabase/client";

export function NewPasswordForm() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <main id="contenido" className="flex min-h-dvh items-center justify-center px-5">
      <form
        className="card w-full max-w-md space-y-4 p-8"
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          if (password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
          const supabase = getBrowserSupabase();
          if (!supabase) return;
          setBusy(true);
          const { error: err } = await supabase.auth.updateUser({ password });
          setBusy(false);
          if (err) return setError("No se pudo actualizar. Pide un nuevo enlace de recuperación.");
          setMsg("Contraseña actualizada.");
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/app/";
        }}
      >
        <Logo />
        <h1 className="h-display text-4xl">Nueva contraseña</h1>
        <Field label="Nueva contraseña" hint="Mínimo 8 caracteres.">
          {(id) => <input id={id} type="password" className="input h-12" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />}
        </Field>
        {error && (
          <p role="alert" className="text-sm text-coral">
            {error}
          </p>
        )}
        {msg && <p className="text-sm text-volt">{msg}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          Guardar contraseña
        </Button>
      </form>
    </main>
  );
}
