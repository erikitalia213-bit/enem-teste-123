import type { Metadata } from "next";
import { Cabecalho } from "@/components/app/Cabecalho";
import { AVISO_CARDAPIO } from "@/lib/config";
import { gerarListaDaSemana } from "@/lib/listaCompras";
import { montarPlano } from "@/lib/plano";
import { exigirAlunaPronta } from "@/lib/sessao";
import { ListaCompras } from "./ListaCompras";

export const metadata: Metadata = { title: "Lista de compras" };

export default async function PaginaListaCompras({ searchParams }: { searchParams: Promise<{ semana?: string }> }) {
  const { perfil } = await exigirAlunaPronta();
  const plano = montarPlano(perfil);
  const pedida = Number((await searchParams).semana);
  const semana = Number.isInteger(pedida) && pedida >= 1 && pedida <= 6 ? pedida : plano.terminou ? 6 : plano.diaHojePlano.semana;
  const listas = Object.fromEntries([1, 2, 3, 4, 5, 6].map((s) => [s, gerarListaDaSemana(s)]));

  return (
    <main className="flex flex-col">
      <Cabecalho titulo="Lista de compras" subtitulo="Gerada a partir do cardápio da semana" voltar="/cardapio" />
      <ListaCompras listas={listas} semanaInicial={semana} />
      <p className="mx-5 mt-4 text-[11px] leading-relaxed text-suave">{AVISO_CARDAPIO}</p>
    </main>
  );
}
