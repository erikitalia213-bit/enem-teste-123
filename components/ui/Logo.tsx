import Image from "next/image";

export function Logo({ largura = 220, prioridade = false, className = "" }: { largura?: number; prioridade?: boolean; className?: string }) {
  const altura = Math.round((largura * 211) / 779);
  return (
    <Image
      src="/img/logo-42dias.webp"
      alt="Protocolo 42 Dias: Bumbum pro Réveillon"
      width={largura}
      height={altura}
      priority={prioridade}
      className={`mx-auto h-auto mix-blend-lighten ${className}`}
      style={{ width: largura, maxWidth: "72vw" }}
    />
  );
}
