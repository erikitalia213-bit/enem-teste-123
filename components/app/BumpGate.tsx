"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Lock } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { ORDER_BUMPS, formatPrice, type OrderBumpId } from "@/config";
import { useUnlocked } from "@/lib/hooks";

/** Muestra el contenido de un order bump solo si está desbloqueado (config.ts → BUMP_UNLOCK_CODES). */
export function BumpGate({ id, children }: { id: OrderBumpId; children: ReactNode }) {
  const { unlocked, tryUnlock } = useUnlocked(id);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  if (unlocked) return <>{children}</>;
  const bump = ORDER_BUMPS[id];
  return (
    <Card className="mx-auto max-w-lg p-8 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-volt/10 text-volt">
        <Lock size={26} />
      </span>
      <h1 className="h-display mt-4 text-4xl">{bump.name}</h1>
      <p className="mt-2 text-mist-2">Este complemento no está activado en tu cuenta. Si ya lo compraste, escribe el código que recibiste.</p>
      <form
        className="mt-5 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const ok = tryUnlock(code);
          setError(!ok);
        }}
      >
        <label className="flex-1">
          <span className="sr-only">Código de desbloqueo</span>
          <input className="input h-11 uppercase" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código" />
        </label>
        <Button type="submit">Activar</Button>
      </form>
      {error && <p role="alert" className="mt-2 text-sm text-coral">Código incorrecto.</p>}
      <Link href={`/extras/${bump.slug}/`} className="mt-5 inline-block text-sm font-semibold text-volt hover:underline">
        Conocer {bump.name} · {formatPrice(bump.price)}
      </Link>
    </Card>
  );
}
