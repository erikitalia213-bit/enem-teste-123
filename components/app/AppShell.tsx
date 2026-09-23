"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  BookOpen,
  ClipboardList,
  Dumbbell,
  FolderOpen,
  Home,
  LayoutGrid,
  Library,
  Menu,
  PenTool,
  Settings,
  Shapes,
  Timer,
  Users,
  Watch,
  X,
  BarChart3,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/components/ui";
import { useProfile } from "@/lib/hooks";
import { useAccount } from "@/components/app/ContentProvider";
import { SignOutButton } from "@/components/app/SignOutButton";

export const NAV = [
  { href: "/app/", label: "Inicio", icon: Home, exact: true },
  { href: "/app/crear/", label: "Crear jugada", icon: PenTool },
  { href: "/app/jugadas/", label: "Mis jugadas", icon: Shapes },
  { href: "/app/biblioteca/", label: "Biblioteca", icon: Library },
  { href: "/app/playbook/", label: "Mi playbook", icon: BookOpen },
  { href: "/app/entrenamientos/", label: "Entrenamientos", icon: Timer },
  { href: "/app/drills/", label: "Drills", icon: Dumbbell },
  { href: "/app/munequeras/", label: "Muñequeras", icon: Watch },
  { href: "/app/equipo/", label: "Mi equipo", icon: Users },
  { href: "/app/tracker/", label: "Tracker", icon: BarChart3 },
  { href: "/app/recursos/", label: "Recursos", icon: FolderOpen },
  { href: "/app/ajustes/", label: "Ajustes", icon: Settings },
];

const BOTTOM = [
  { href: "/app/", label: "Inicio", icon: Home, exact: true },
  { href: "/app/biblioteca/", label: "Jugadas", icon: LayoutGrid },
  { href: "/app/entrenamientos/", label: "Entrenar", icon: ClipboardList },
  { href: "/app/equipo/", label: "Equipo", icon: Users },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  const p = pathname.endsWith("/") ? pathname : pathname + "/";
  return exact ? p === href : p.startsWith(href);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/app/";
  const { profile } = useProfile();
  const account = useAccount();
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Cierra el menú móvil al navegar (patrón de estado derivado)
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  return (
    <div className="app-shell min-h-dvh lg:grid lg:grid-cols-[250px_1fr]">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-ink-2/60 px-3 py-5 lg:flex">
        <Link href="/app/" className="mb-6 px-2">
          <Logo />
        </Link>
        <nav aria-label="Navegación principal" className="flex flex-1 flex-col gap-0.5 overflow-y-auto no-scrollbar">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.93rem] font-medium transition-colors",
                  active ? "bg-volt/10 text-volt" : "text-mist-2 hover:bg-white/5 hover:text-snow",
                )}
              >
                <Icon size={18} className={active ? "text-volt" : "text-mist group-hover:text-snow"} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 rounded-xl border border-line bg-surface px-3 py-3">
          <p className="text-xs text-mist">Coach</p>
          <p className="truncate font-semibold">{profile.coachName}</p>
          {profile.teamName && <p className="truncate text-xs text-volt">{profile.teamName}</p>}
          <p className="mt-1 truncate text-[0.7rem] text-mist">{account.email}</p>
          <SignOutButton className="mt-2 h-8 w-full justify-center rounded-lg px-2 text-xs" />
        </div>
      </aside>

      <div className="min-w-0">
        {/* Header móvil / tablet */}
        <header className="app-header no-print sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-ink/85 px-4 backdrop-blur-md lg:hidden">
          <Link href="/app/" aria-label="Inicio de FLAGLAB">
            <Logo compact />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-snow hover:bg-white/5"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <Menu size={22} />
          </button>
        </header>

        {account.mode === "dev" && (
          <div role="status" className="no-print bg-amber px-4 py-1.5 text-center text-xs font-semibold text-ink">
            Modo desarrollo sin autenticación (FLAGLAB_DEV_BYPASS_AUTH). Nunca se activa en producción.
          </div>
        )}
        <main id="contenido" className="mx-auto w-full max-w-7xl px-4 pb-28 pt-6 md:px-6 lg:px-10 lg:pb-12 lg:pt-10">
          {children}
        </main>
      </div>

      {/* Bottom nav móvil */}
      <nav aria-label="Navegación rápida" className="app-bottom-nav no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {BOTTOM.map((item) => {
            const active = isActive(pathname, item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("flex h-16 flex-col items-center justify-center gap-1 text-[0.7rem] font-semibold", active ? "text-volt" : "text-mist")}>
                <Icon size={21} />
                {item.label}
              </Link>
            );
          })}
          <Link href="/app/crear/" className="flex h-16 flex-col items-center justify-center gap-1 text-[0.7rem] font-semibold text-mist">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-volt text-ink">
              <PenTool size={17} />
            </span>
            Crear
          </Link>
        </div>
      </nav>

      {/* Drawer menú móvil */}
      {menuOpen && (
        <div className="no-print fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú">
          <button className="absolute inset-0 bg-black/70" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} />
          <div className="animate-fade-up absolute right-0 top-0 flex h-full w-[82%] max-w-xs flex-col border-l border-line bg-ink-2 px-3 py-4">
            <div className="mb-4 flex items-center justify-between px-2">
              <Logo compact />
              <button onClick={() => setMenuOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/5" aria-label="Cerrar menú">
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href, item.exact);
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("flex items-center gap-3 rounded-xl px-3 py-3 font-medium", active ? "bg-volt/10 text-volt" : "text-mist-2 hover:bg-white/5")}>
                    <Icon size={19} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <p className="px-3 pt-3 text-xs text-mist">Coach {profile.coachName}</p>
          </div>
        </div>
      )}
    </div>
  );
}
