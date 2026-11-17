import type { Metadata } from "next";
import { LifeBuoy, LogOut, Smartphone } from "lucide-react";
import { Cabecalho } from "@/components/app/Cabecalho";
import { InstalarApp } from "@/components/pwa/InstalarApp";
import { ContatoSuporte } from "@/components/ui/ContatoSuporte";
import { sair } from "@/lib/acoes/sessao";
import { formatarData } from "@/lib/datas";
import { montarPlano } from "@/lib/plano";
import { exigirAlunaPronta } from "@/lib/sessao";
import { FormDados, FormRotina, ReiniciarProtocolo } from "./Formularios";

export const metadata: Metadata = { title: "Perfil" };

export default async function Perfil() {
  const { perfil } = await exigirAlunaPronta();
  const plano = montarPlano(perfil);

  return (
    <main className="flex flex-col gap-5">
      <Cabecalho titulo="Perfil" subtitulo={perfil.email} />
      <div className="flex flex-col gap-5 px-5 pb-4">
        <section className="cartao grid grid-cols-2 gap-3 p-4 text-sm">
          <div>
            <p className="text-xs text-suave">Início do protocolo</p>
            <p className="font-semibold">{formatarData(perfil.data_inicio, "d 'de' MMM yyyy")}</p>
          </div>
          <div>
            <p className="text-xs text-suave">Hoje</p>
            <p className="font-semibold">{plano.terminou ? "Protocolo concluído" : `Dia ${plano.diaAtual} de 42`}</p>
          </div>
        </section>

        <FormDados nome={perfil.nome ?? ""} objetivo={perfil.objetivo} nivel={perfil.nivel} />
        <FormRotina local={perfil.local_treino} dias={perfil.dias_semana} diaAtual={plano.diaAtual} />

        <section className="cartao p-4" aria-labelledby="titulo-instalar">
          <h2 id="titulo-instalar" className="mb-1 flex items-center gap-2 font-bold">
            <Smartphone size={18} className="text-limao" aria-hidden /> App no celular
          </h2>
          <p className="mb-3 text-sm text-suave">Instale para abrir direto da tela inicial, em tela cheia, como um app.</p>
          <InstalarApp />
        </section>

        <section className="cartao p-4" aria-labelledby="titulo-suporte">
          <h2 id="titulo-suporte" className="flex items-center gap-2 font-bold">
            <LifeBuoy size={18} className="text-limao" aria-hidden /> Suporte
          </h2>
          <p className="mt-1 text-sm text-suave">Dúvidas sobre acesso, treino ou cardápio? Fale com a gente.</p>
          <ContatoSuporte mensagem={`Oi! Faço o Protocolo 42 Dias (${perfil.email}) e preciso de ajuda.`} />
        </section>

        <ReiniciarProtocolo />

        <form action={sair}>
          <button type="submit" className="botao-secundario w-full">
            <LogOut size={18} aria-hidden /> Sair
          </button>
        </form>
      </div>
    </main>
  );
}
