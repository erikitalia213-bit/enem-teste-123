"use client";

import { Check, Download, Share, SquarePlus } from "lucide-react";
import { useEffect, useState } from "react";

interface EventoInstalacao extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Botão "Instalar no celular". No Android/Chrome usa o prompt nativo; no iPhone
 * (Safari não tem prompt) mostra o passo a passo de "Adicionar à Tela de Início".
 */
export function InstalarApp() {
  const [evento, setEvento] = useState<EventoInstalacao | null>(null);
  const [instalado, setInstalado] = useState(false);
  const [ios, setIos] = useState(false);
  const [mostrarIos, setMostrarIos] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
    /* eslint-disable react-hooks/set-state-in-effect -- detecção só possível no navegador */
    setInstalado(standalone);
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    /* eslint-enable react-hooks/set-state-in-effect */
    const aoOferecer = (e: Event) => {
      e.preventDefault();
      setEvento(e as EventoInstalacao);
    };
    const aoInstalar = () => setInstalado(true);
    window.addEventListener("beforeinstallprompt", aoOferecer);
    window.addEventListener("appinstalled", aoInstalar);
    return () => {
      window.removeEventListener("beforeinstallprompt", aoOferecer);
      window.removeEventListener("appinstalled", aoInstalar);
    };
  }, []);

  if (instalado) {
    return (
      <p className="flex items-center gap-2 text-sm text-limao">
        <Check size={18} aria-hidden /> App instalado neste aparelho
      </p>
    );
  }

  const instalar = async () => {
    if (evento) {
      await evento.prompt();
      const escolha = await evento.userChoice;
      if (escolha.outcome === "accepted") setInstalado(true);
      setEvento(null);
    } else {
      setMostrarIos((v) => !v);
    }
  };

  return (
    <div>
      <button type="button" onClick={instalar} className="botao-primario w-full">
        <Download size={20} aria-hidden /> Instalar no celular
      </button>
      {mostrarIos && (
        <div className="mt-3 rounded-app border border-borda bg-card-2 p-3 text-sm leading-relaxed" role="note">
          {ios ? (
            <ol className="flex flex-col gap-2">
              <li className="flex items-center gap-2">
                1. Abra este app no <b>Safari</b> e toque em <Share size={16} className="text-limao" aria-label="Compartilhar" />
              </li>
              <li className="flex items-center gap-2">
                2. Escolha <b>Adicionar à Tela de Início</b> <SquarePlus size={16} className="text-limao" aria-hidden />
              </li>
              <li>3. Toque em <b>Adicionar</b>. Pronto: o 42 Dias vira um ícone no seu celular.</li>
            </ol>
          ) : (
            <p>
              No Chrome, toque no menu <b>⋮</b> e escolha <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
