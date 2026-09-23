import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { ContentProvider } from "@/components/app/ContentProvider";
import { AccessMessage } from "@/components/app/AccessMessage";
import { getAccess } from "@/lib/server/access";
import { loadContent } from "@/lib/server/content";

export const metadata: Metadata = {
  title: "App",
  robots: { index: false, follow: false },
};

// La app depende de la sesión del usuario: siempre se renderiza en el servidor por request.
export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const access = await getAccess();
  if (access.status === "anonymous") redirect("/entrar/?next=/app/");
  if (access.status === "not_configured") return <AccessMessage kind="not_configured" />;
  const content = loadContent(access.entitlements);
  if (!content) return <AccessMessage kind="no_product" email={access.account.email} />;
  const account = { ...access.account, mode: access.mode, entitlements: access.entitlements };
  return (
    <ContentProvider content={content} account={account}>
      <AppShell>{children}</AppShell>
    </ContentProvider>
  );
}
