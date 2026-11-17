"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { lerParametrosQuiz, lerQuizSalvo, salvarQuiz } from "@/lib/quiz";
import { FormLogin } from "../login/FormLogin";

function Conteudo({ logada }: { logada: boolean }) {
  const params = useSearchParams();
  const router = useRouter();
  const [nome, setNome] = useState<string | undefined>();

  useEffect(() => {
    salvarQuiz(lerParametrosQuiz(params));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage só existe no navegador
    setNome(lerQuizSalvo().nome);
    if (logada) router.replace("/onboarding");
  }, [params, logada, router]);

  return (
    <main className="moldura flex flex-col px-5 pb-10">
      <div aria-hidden className="pointer-events-none fixed inset-0 mx-auto max-w-[480px] bg-[url('/img/bg-quiz.webp')] bg-cover bg-[center_20%] opacity-20" />
      <div aria-hidden className="pointer-events-none fixed inset-0 mx-auto max-w-[480px] bg-gradient-to-b from-fundo/40 via-fundo/90 to-fundo" />
      <div className="relative z-10 flex flex-1 flex-col justify-center pt-8">
        <Logo largura={240} prioridade />
        <Image src="/img/calendario-reveillon.webp" alt="" width={120} height={120} className="mx-auto mt-6" priority />
        <h1 className="titulo mt-4 text-center text-[32px]">
          {nome ? `${nome}, ` : ""}
          <span className="text-limao">deu tudo certo!</span>
        </h1>
        <p className="mt-2 text-center text-[15px] leading-relaxed text-suave">
          {logada
            ? "Vamos montar o seu protocolo..."
            : "Seu acesso foi enviado para o e-mail da compra. Não achou? Peça o link de novo aqui embaixo."}
        </p>
        {!logada && <FormLogin />}
      </div>
    </main>
  );
}

export function BemVinda({ logada }: { logada: boolean }) {
  return (
    <Suspense>
      <Conteudo logada={logada} />
    </Suspense>
  );
}
