"use client";

import { CheckCircle2, Loader2, MailWarning } from "lucide-react";
import { useActionState } from "react";
import { ContatoSuporte } from "@/components/ui/ContatoSuporte";
import { solicitarLinkDeAcesso, type EstadoLogin } from "@/lib/acoes/login";

export function FormLogin() {
  const [estado, enviar, enviando] = useActionState<EstadoLogin, FormData>(solicitarLinkDeAcesso, { status: "ocioso" });
  const emailAnterior = "email" in estado ? estado.email : "";

  if (estado.status === "enviado") {
    return (
      <div className="cartao mt-7 p-5 text-center" role="status">
        <CheckCircle2 className="mx-auto text-limao" size={40} aria-hidden />
        <h2 className="titulo mt-3 text-2xl">Link enviado!</h2>
        <p className="mt-2 text-sm leading-relaxed text-suave">
          Mandamos o acesso para <b className="text-texto">{estado.email}</b>. Abra o e-mail no celular e toque no botão. Não chegou em 2
          minutos? Confira as abas <b className="text-texto">Promoções</b> e <b className="text-texto">Spam</b>.
        </p>
        <form action={enviar} className="mt-4">
          <input type="hidden" name="email" value={estado.email} />
          <button type="submit" disabled={enviando} className="text-sm font-semibold text-limao underline-offset-4 hover:underline min-h-11">
            {enviando ? "Reenviando..." : "Reenviar link"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <form action={enviar} className="mt-7 flex flex-col gap-3" noValidate>
      <label htmlFor="email" className="text-sm font-semibold">
        Seu e-mail de compra
      </label>
      <input
        id="email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        defaultValue={emailAnterior}
        placeholder="voce@email.com"
        className="min-h-[54px] w-full rounded-app border-[1.5px] border-borda bg-card px-4 text-base text-texto placeholder:text-suave/60 focus:border-limao focus:outline-none"
        aria-describedby="email-ajuda"
      />
      <button type="submit" disabled={enviando} className="botao-primario mt-1 w-full">
        {enviando ? <Loader2 className="animate-spin" size={20} aria-hidden /> : null}
        {enviando ? "Enviando..." : "Receber link de acesso"}
      </button>
      <p id="email-ajuda" className="text-center text-xs text-suave">
        O link vale por 1 hora e pode ser pedido quantas vezes precisar.
      </p>

      {estado.status === "erro" && (
        <p role="alert" className="rounded-app border border-rosa/40 bg-rosa/10 p-3 text-sm">
          {estado.mensagem}
        </p>
      )}
      {estado.status === "aguarde" && (
        <p role="alert" className="rounded-app border border-dourado/40 bg-dourado/10 p-3 text-sm">
          Acabamos de enviar um link para esse e-mail. Aguarde 1 minuto antes de pedir outro e confira sua caixa de entrada.
        </p>
      )}
      {estado.status === "sem-compra" && (
        <div role="alert" className="rounded-app border border-rosa/40 bg-rosa/10 p-4 text-sm leading-relaxed">
          <p className="flex items-center gap-2 font-bold text-rosa">
            <MailWarning size={18} aria-hidden /> Não encontramos uma compra aprovada
          </p>
          <p className="mt-1.5">
            Não há compra aprovada para <b>{estado.email}</b>. Confira se é o mesmo e-mail usado no pagamento. Se você acabou de comprar
            (principalmente por boleto ou Pix), a liberação pode levar alguns minutos.
          </p>
          <p className="mt-2 text-suave">Continua sem acesso? Fale com o suporte:</p>
          <ContatoSuporte mensagem={`Oi! Comprei o Protocolo 42 Dias com o e-mail ${estado.email} e não consigo acessar.`} />
        </div>
      )}
    </form>
  );
}
