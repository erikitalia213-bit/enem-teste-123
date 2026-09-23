"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { ORDER_BUMPS, PRICING, type OrderBumpId } from "@/config";
import { track } from "@/lib/analytics";
import { checkoutUrl } from "@/lib/checkout";

/**
 * Botón de compra centralizado: usa el link de checkout configurado y reenvía UTMs/fbclid.
 * `product` = complemento vendido por separado (si tiene su propio link).
 */
export function CheckoutButton({ children, className, size = "lg", location = "landing", product }: { children: React.ReactNode; className?: string; size?: "md" | "lg" | "xl"; location?: string; product?: OrderBumpId }) {
  const [href, setHref] = useState("/#precio");
  useEffect(() => {
    // La URL final depende de los parámetros de la visita (UTMs), solo disponibles en el navegador.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHref(checkoutUrl(product));
  }, [product]);
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      onClick={(e) => {
        e.currentTarget.href = checkoutUrl(product);
        const item = product ? { value: ORDER_BUMPS[product].price, content_name: ORDER_BUMPS[product].name, content_ids: [product] } : { value: PRICING.offer, content_name: "FLAGLAB 5x5", content_ids: ["core_flaglab"] };
        track("InitiateCheckout", { ...item, currency: "MXN", content_type: "product", location });
      }}
      {...(external ? { rel: "noopener" } : {})}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-2xl bg-volt font-display font-extrabold uppercase tracking-wide text-ink shadow-[0_14px_40px_-12px_rgba(73,240,90,0.7)] transition-all hover:bg-[#62f771] hover:shadow-[0_18px_50px_-12px_rgba(73,240,90,0.85)] active:translate-y-px",
        size === "md" && "h-12 px-5 text-lg",
        size === "lg" && "h-14 px-7 text-xl",
        size === "xl" && "h-16 px-8 text-2xl",
        className,
      )}
    >
      {children}
      <ArrowRight size={size === "md" ? 18 : 22} className="transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}
