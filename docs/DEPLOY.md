# Deploy

FLAGLAB necesita **servidor Node** (ya no es un sitio estático): valida sesiones, entrega solo el contenido comprado y recibe webhooks. Recomendado: **Vercel** (plan Hobby alcanza para empezar; Pro si hay uso comercial fuerte).

## Vercel
1. Sube el repositorio a GitHub → vercel.com → Add New Project → importa.
2. Framework: Next.js (automático). Build: `npm run build`. Node 20+.
3. Settings → Environment Variables: carga todas las de `.env.example` (Production). Los secretos (`SUPABASE_SERVICE_ROLE_KEY`, `HOTMART_HOTTOK`, `KIWIFY_WEBHOOK_TOKEN`, `META_CAPI_ACCESS_TOKEN`, `GA_API_SECRET`) **sin** prefijo `NEXT_PUBLIC_`.
4. Deploy. Luego Settings → Domains → tu dominio.
5. Cambiaste una variable `NEXT_PUBLIC_*` → vuelve a desplegar (se incrustan en el build).

## Otro hosting (Render, Railway, VPS)
```
npm ci
npm run build
npm start          # next start, puerto 3000 (PORT=xxxx para cambiarlo)
```
Pon un proxy HTTPS (Nginx/Caddy) delante. No sirve un hosting solo estático (Hostinger compartido, GitHub Pages).

## Después del deploy
- Supabase → URL Configuration con el dominio final (ver `docs/SUPABASE.md`).
- Webhooks de Hotmart/Kiwify apuntando al dominio final (ver `docs/CHECKOUT.md`).
- Sigue `LAUNCH-CHECKLIST.md`.
