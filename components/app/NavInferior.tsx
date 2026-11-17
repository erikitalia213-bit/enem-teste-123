"use client";

import { CalendarCheck2, Dumbbell, House, User, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITENS = [
  { href: "/hoje", rotulo: "Hoje", icone: House, ativo: ["/hoje"] },
  { href: "/treino", rotulo: "Treino", icone: Dumbbell, ativo: ["/treino", "/biblioteca", "/exercicios"] },
  { href: "/jornada", rotulo: "Jornada", icone: CalendarCheck2, ativo: ["/jornada"] },
  { href: "/cardapio", rotulo: "Cardápio", icone: UtensilsCrossed, ativo: ["/cardapio"] },
  { href: "/perfil", rotulo: "Perfil", icone: User, ativo: ["/perfil"] },
] as const;

export function NavInferior() {
  const caminho = usePathname();
  return (
    <nav aria-label="Navegação principal" className="fixed inset-x-0 bottom-0 z-40">
      <div className="mx-auto max-w-[480px] border-t border-borda bg-fundo/95 backdrop-blur-md area-segura-baixo">
        <ul className="grid grid-cols-5">
          {ITENS.map(({ href, rotulo, icone: Icone, ativo }) => {
            const atual = ativo.some((a) => caminho === a || caminho.startsWith(`${a}/`));
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={atual ? "page" : undefined}
                  className={`flex min-h-[60px] flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
                    atual ? "text-limao" : "text-suave hover:text-texto"
                  }`}
                >
                  <Icone size={22} strokeWidth={atual ? 2.4 : 1.9} aria-hidden />
                  {rotulo}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
