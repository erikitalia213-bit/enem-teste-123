"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";

export function SignOutButton({ className, label = "Cerrar sesión" }: { className?: string; label?: string }) {
  const [busy, setBusy] = useState(false);
  const supabase = getBrowserSupabase();
  if (!supabase) return null;
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await supabase.auth.signOut();
        // Recarga completa: limpia el estado en memoria de la sesión anterior.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/entrar/";
      }}
      className={cn("inline-flex h-11 items-center gap-2 rounded-xl border border-line-2 px-4 font-semibold text-mist-2 hover:text-snow disabled:opacity-50", className)}
    >
      <LogOut size={17} /> {label}
    </button>
  );
}
