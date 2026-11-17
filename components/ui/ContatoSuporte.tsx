"use client";

import { Mail, MessageCircle } from "lucide-react";
import { linkWhatsappSuporte, suporte } from "@/lib/config";

/** Botões de contato com o suporte (WhatsApp e/ou e-mail, configuráveis por variável de ambiente). */
export function ContatoSuporte({ mensagem }: { mensagem?: string }) {
  const whatsapp = linkWhatsappSuporte(mensagem);
  if (!suporte.email && !whatsapp) return null;
  return (
    <div className="mt-3 flex flex-col gap-2">
      {whatsapp && (
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="botao-secundario w-full">
          <MessageCircle size={18} aria-hidden /> Falar no WhatsApp
        </a>
      )}
      {suporte.email && (
        <a href={`mailto:${suporte.email}?subject=${encodeURIComponent("Acesso ao Protocolo 42 Dias")}`} className="botao-secundario w-full">
          <Mail size={18} aria-hidden /> {suporte.email}
        </a>
      )}
    </div>
  );
}
