import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EntryForm } from "./EntryForm";
import { getAccess } from "@/lib/server/access";
import { PLAY_MAP } from "@/data/plays";
import { devBypassAuth, supabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EntrarPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const sp = await searchParams;
  const next = sp.next && sp.next.startsWith("/app") ? sp.next : "/app/";
  const access = await getAccess();
  if (access.status === "ok" && access.mode === "supabase") redirect(next);
  return <EntryForm next={next} configured={supabaseConfigured} devBypass={devBypassAuth} sample={PLAY_MAP["pp-03"].diagram} initialError={sp.error ? "El enlace no es válido o ya expiró. Pide uno nuevo." : ""} />;
}
