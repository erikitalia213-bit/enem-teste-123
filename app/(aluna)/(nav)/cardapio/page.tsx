import type { Metadata } from "next";
import { Cabecalho } from "@/components/app/Cabecalho";
import { refeicoesDoDia } from "@/lib/cardapioDia";
import { AVISO_CARDAPIO } from "@/lib/config";
import { somarDias } from "@/lib/datas";
import { montarPlano } from "@/lib/plano";
import { faseDoDia } from "@/lib/protocolo/calendario";
import { exigirAlunaPronta } from "@/lib/sessao";
import { CardapioSemana, type DiaDoCardapio } from "./CardapioSemana";

export const metadata: Metadata = { title: "Cardápio" };

export default async function Cardapio() {
  const { repo, usuario, perfil } = await exigirAlunaPronta();
  const plano = montarPlano(perfil);

  // Semana do protocolo em que a aluna está (depois do dia 42, continua no ciclo da reta final).
  const semana = plano.terminou ? 6 : plano.diaHojePlano.semana;
  const primeiroDia = plano.terminou ? plano.diaReal : (semana - 1) * 7 + 1;
  const dias: DiaDoCardapio[] = Array.from({ length: 7 }, (_, k) => {
    const diaProtocolo = primeiroDia + k;
    const data = somarDias(perfil.data_inicio, diaProtocolo - 1);
    const fase = plano.terminou || diaProtocolo > 42 ? 3 : faseDoDia(diaProtocolo);
    return { diaProtocolo, data, itens: refeicoesDoDia(diaProtocolo, fase) };
  });

  const marcadas = await repo.listarRefeicoes(usuario, dias[0]!.data, dias[6]!.data);

  return (
    <main className="flex flex-col">
      <Cabecalho titulo="Cardápio" subtitulo={`Semana ${semana} · 4 refeições por dia, ricas em proteína`} />
      <p role="note" className="sticky top-0 z-10 mx-5 mb-3 rounded-app border border-dourado/30 bg-[#1d1a0e]/95 p-3 text-[12px] leading-relaxed text-dourado/95 backdrop-blur">
        ⚠️ {AVISO_CARDAPIO}
      </p>
      <CardapioSemana dias={dias} hoje={plano.hoje} semana={semana} marcadas={marcadas} />
    </main>
  );
}
