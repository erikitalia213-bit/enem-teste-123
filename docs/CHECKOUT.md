# Checkout (Hotmart o Kiwify) y atribución

## Links de pago
En variables de entorno (no hace falta tocar código):
```
NEXT_PUBLIC_CHECKOUT_PROVIDER=hotmart        # o kiwify / generic
NEXT_PUBLIC_CHECKOUT_URL=https://pay.hotmart.com/XXXX?off=YYYY
# opcionales: venta de complementos por separado (para quien ya tiene FLAGLAB)
NEXT_PUBLIC_CHECKOUT_URL_DEFENSIVE=
NEXT_PUBLIC_CHECKOUT_URL_EXTRA_TRAININGS=
NEXT_PUBLIC_CHECKOUT_URL_SCHOOL_KIT=
```
Los 3 complementos se configuran como **order bumps** dentro del checkout del producto principal en la plataforma.

## Atribución de campañas
Todos los botones de compra reenvían `utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid, gclid, src, sck`. Se guardan 30 días en el navegador, así que no se pierden si el visitante navega o regresa después. Nunca se sobrescriben parámetros que ya trae el link.
Con Hotmart, si faltan `src`/`sck` se generan: `src = utm_source`, `sck = source|medium|campaign|content` (así ves las ventas por anuncio en el reporte de Hotmart).

## Hotmart
1. Crea 4 productos (principal + 3 complementos) y agrega los complementos como order bump del principal.
2. Anota el **ID** de cada producto → `HOTMART_PRODUCT_MAP=IDprincipal:core_flaglab,IDdef:defensive_playbook,IDpack:extra_trainings,IDkit:school_coach_kit`
3. Herramientas → Webhook (API y notificaciones) → nueva configuración:
   - URL: `https://tu-dominio.com/api/webhooks/hotmart`
   - Versión 2.0
   - Eventos: Compra aprobada, Compra completa, Compra reembolsada, Chargeback, Compra cancelada, Disputa.
4. Copia el **Hottok** → `HOTMART_HOTTOK`.
5. Usa “Enviar prueba” y revisa en Supabase `webhook_events` que llegó.
6. Página de agradecimiento / acceso: `https://tu-dominio.com/entrar/` (el comprador crea su cuenta con el MISMO correo).

## Kiwify
1. Crea los productos y los order bumps. ID de cada producto (en la URL del producto) → `KIWIFY_PRODUCT_MAP=uuid:core_flaglab,...`
2. Apps → Webhooks → crear: URL `https://tu-dominio.com/api/webhooks/kiwify`, eventos: compra aprobada, reembolso, chargeback.
3. Copia el **token** → `KIWIFY_WEBHOOK_TOKEN` (la firma HMAC-SHA1 llega en `?signature=`).
4. Envía un evento de prueba y confirma en `webhook_events`.

> Kiwify cambia sus nombres de campo de vez en cuando. El parser (`lib/server/webhooks.ts → parseKiwify`) usa `order_id`, `order_status`, `webhook_event_type`, `Product.product_id`, `Customer.email`, `Commissions.charge_amount`. Compara con un payload real de prueba antes de lanzar.

## Respuestas del webhook
`{ ok, action: grant|revoke|ignore, duplicate, unmapped?, conversions }`. `unmapped` = llegó un producto que no está en el mapa (revisa el ID). Un token/firma inválido responde 401.

## Eventos de analítica
| Evento | Dónde | Cuándo |
|---|---|---|
| PageView | navegador | cada página |
| ViewContent | navegador | landing y páginas de complementos |
| InitiateCheckout | navegador | clic en un botón de compra |
| Lead | navegador | al crear cuenta |
| **Purchase** | **servidor** | solo cuando el webhook confirma un pago nuevo (Meta Conversions API + GA4 Measurement Protocol). Nunca por abrir una página. |

Variables: `NEXT_PUBLIC_META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`, `META_TEST_EVENT_CODE` (solo pruebas), `NEXT_PUBLIC_GA_ID`, `GA_API_SECRET`. El `event_id` del Purchase es `proveedor:pedido`, así los reintentos no duplican. Si Hotmart/Kiwify también mandan Purchase a tu Pixel desde su integración nativa, **activa solo una de las dos fuentes** para no contar doble.
