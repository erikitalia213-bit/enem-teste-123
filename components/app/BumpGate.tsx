"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui";
import { ORDER_BUMPS, formatPrice, type OrderBumpId } from "@/config";
import { useHas } from "@/components/app/ContentProvider";

/**
 * Muestra un complemento solo si la cuenta tiene el entitlement.
 * El contenido del complemento ni siquiera llega al navegador si no lo tiene
 * (lo decide el servidor en lib/server/content.ts); esto solo muestra el aviso.
 */
export function BumpGate({ id, children }: { id: OrderBumpId; children: ReactNode }) {
  const has = useHas();
  if (has(id)) return <>{children}</>;
  const bump = ORDER_BUMPS[id];
  return (
    <Card className="mx-auto max-w-lg p-8 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-volt/10 text-volt">
        <Lock size={26} />
      </span>
      <h1 className="h-display mt-4 text-4xl">{bump.name}</h1>
      <p className="mt-2 text-mist-2">Este complemento no está incluido en tu cuenta. Si ya lo compraste con este mismo correo, la activación puede tardar unos minutos.</p>
      <Link href={`/extras/${bump.slug}/`} className="mt-5 inline-flex h-11 items-center rounded-xl bg-volt px-5 font-semibold text-ink">
        Conocer {bump.name} · {formatPrice(bump.price)}
      </Link>
    </Card>
  );
}
