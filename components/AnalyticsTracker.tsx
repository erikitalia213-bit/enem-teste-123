"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track, type ClientEvent } from "@/lib/analytics";
import { captureAttribution } from "@/lib/checkout";

/**
 * - Guarda los parámetros de campaña (UTM, fbclid…) de la visita.
 * - Envía PageView en cada navegación interna (el primer PageView lo envía el código base del Pixel/GA).
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    captureAttribution();
    if (first.current) {
      first.current = false;
      return;
    }
    track("PageView");
  }, [pathname]);
  return null;
}

/** Dispara un evento una sola vez al montar (ej. ViewContent en la página de venta). */
export function TrackOnView({ event, params }: { event: ClientEvent; params?: Record<string, unknown> }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    track(event, params);
  }, [event, params]);
  return null;
}
