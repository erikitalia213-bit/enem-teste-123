# Checkout y entrega del producto

## 1. Link de pago
En `config.ts`:
```ts
export const CHECKOUT_URL = "https://pay.hotmart.com/XXXX"; // o Kiwify, Stripe Payment Link, Mercado Pago…
```
o en `.env.local`: `NEXT_PUBLIC_CHECKOUT_URL=https://...`

Todos los botones de compra usan `checkoutUrl()` (`lib/checkout.ts`), que reenvía `utm_*`, `fbclid`, `gclid`, `src` y `sck` al checkout.
Mientras sea `"#"`, los botones llevan a la sección de precio.

## 2. Order bumps
Créalos en tu plataforma (Hotmart/Kiwify los llaman *order bump*). En `config.ts → ORDER_BUMPS` puedes poner un `checkoutUrl` propio por complemento si los vendes por separado.

## 3. Entrega
- Página de acceso: `https://tudominio.com/entrar/`
- Opcional: define `ACCESS_CODE` en `config.ts` y envíalo en el correo de compra (barrera simple del lado del cliente).
- Complementos: define códigos en `BUMP_UNLOCK_CODES`. Si están vacíos, los complementos aparecen desbloqueados para todos.
- Para control de acceso real por comprador, conecta Supabase (ver `docs/SUPABASE.md`) o usa el área de miembros de tu plataforma apuntando a la app.

## 4. Pixel y Analytics
`.env.local`:
```
NEXT_PUBLIC_META_PIXEL_ID=123...
NEXT_PUBLIC_GA_ID=G-XXXX
```
Se registra `PageView` y, al hacer clic en cualquier botón de compra, `InitiateCheckout` (Meta) / `begin_checkout` (GA4). Configura el evento `Purchase` en la página de gracias de tu plataforma.
