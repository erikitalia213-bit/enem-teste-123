"use client";

import { useEffect, useState } from "react";
import { PRICING, formatPrice } from "@/config";
import { CheckoutButton } from "./CheckoutButton";

/** Barra inferior en móvil que aparece al pasar el hero. */
export function StickyCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const pricing = document.getElementById("precio");
      const pastHero = window.scrollY > 700;
      const inPricing = pricing ? pricing.getBoundingClientRect().top < window.innerHeight && pricing.getBoundingClientRect().bottom > 0 : false;
      setShow(pastHero && !inPricing);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 md:hidden ${show ? "translate-y-0" : "translate-y-full"}`} aria-hidden={!show}>
      <div className="flex items-center gap-3">
        <div className="leading-tight">
          <p className="text-xs text-mist line-through">{formatPrice(PRICING.regular)}</p>
          <p className="font-display text-2xl font-extrabold text-volt">{formatPrice(PRICING.offer)}</p>
        </div>
        <CheckoutButton size="md" className="flex-1" location="sticky">
          Quiero acceso
        </CheckoutButton>
      </div>
    </div>
  );
}
