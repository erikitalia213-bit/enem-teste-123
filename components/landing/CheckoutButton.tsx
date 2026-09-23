"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { PRICING } from "@/config";
import { track } from "@/lib/analytics";
import { checkoutUrl } from "@/lib/checkout";

/** Botón de compra centralizado: usa CHECKOUT_URL de config.ts y reenvía UTMs. */
export function CheckoutButton({ children, className, size = "lg", location = "landing" }: { children: React.ReactNode; className?: string; size?: "md" | "lg" | "xl"; location?: string }) {
  const [href, setHref] = useState("/#precio");
  useEffect(() => {
    // La URL final depende de los parámetros de la visita (UTMs), solo disponibles en el navegador.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHref(checkoutUrl());
  }, []);
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      onClick={(e) => {
        const url = checkoutUrl();
        e.currentTarget.href = url;
        track("InitiateCheckout", { value: PRICING.offer, currency: "MXN", content_name: "FLAGLAB 5x5", content_ids: ["core_flaglab"], location });
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
