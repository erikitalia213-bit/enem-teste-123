# Pruebas de punta a punta

Prueban el **build de producción** con un navegador real (Chromium) y un Supabase simulado (`mock-supabase.mjs`: login, RLS de entitlements, RPC y webhook_events en memoria).

```bash
set -a; . tests/e2e/qa.env; set +a
npm run build
node tests/e2e/mock-supabase.mjs &
npx next start -p 3100 &
node tests/e2e/e2e.mjs            # CHROMIUM_PATH=/ruta/a/chrome si hace falta
```
Resultados, capturas y PDFs (playbook A4/Carta, muñequeras 6/9/12/18) quedan en `tests/e2e/out/`.
`qa.env` solo contiene valores falsos de prueba.
