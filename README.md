# FLAGLAB 5x5

**Sistema digital para coaches de tocho bandera (flag football) 5x5.**
Planea entrenamientos, crea jugadas y organiza tu equipo en minutos.

Producto digital completo listo para vender en México: aplicación web, biblioteca de contenido, documentos imprimibles, bonus, order bumps, landing page comercial y assets de marketing.

> FLAGLAB es una herramienta educativa independiente. No está afiliada a la NFL ni a ninguna liga, federación o equipo.

---

## Qué incluye

| Área | Contenido | Dónde |
|---|---|---|
| Landing page | Hero, problema, sistema, demo interactiva real, cómo funciona, biblioteca, profesores, bonus, precio, garantía neutra, FAQ, footer | `/` · `app/page.tsx` |
| App (dashboard) | Saludo, 8 herramientas, estadísticas, acceso rápido, jugada del día | `/app` |
| Creador de jugadas | Campo 5x5 interactivo: mover jugadores, rutas por plantilla o punto por punto, colores, trazos, texto, zonas, motion, ataque/defensa, 7 formaciones, deshacer/rehacer, voltear, PNG, guardar/duplicar/borrar, agregar al playbook | `/app/crear` |
| Biblioteca | **130 jugadas originales** en 13 categorías con diagrama, formación, objetivo, descripción, lecturas, consejo y nivel. Filtros + búsqueda | `/app/biblioteca` |
| Playbook | Varios playbooks, datos del equipo, 5 secciones, drag & drop, numeración automática, vista de impresión (1/2/4 por hoja), exportar/importar JSON | `/app/playbook` |
| Tarjetas para muñequera | 6/9/12/18 jugadas, carta/A4, 3 tamaños, numeración configurable, hoja del coach | `/app/munequeras` |
| Generador de entrenamientos | Edad, nivel, duración, jugadores y objetivo → sesión por reglas internas. Guardar, editar, duplicar, imprimir | `/app/entrenamientos` |
| Drills | **68 drills** con objetivo, edad, nivel, jugadores, material, duración, pasos, variaciones, errores y consejo | `/app/drills` |
| Profesores | **20 clases** listas para educación física (vista imprimible) | `/app/clases` |
| Mi equipo | Roster (editar, eliminar, filtrar) + depth chart visual | `/app/equipo` |
| Tracker | Sesiones de entrenamiento/partido con PC, REC, TD, INT, flags y notas + resumen | `/app/tracker` |
| Manual | *Manual Práctico Tocho Bandera 5x5*: introducción + 18 capítulos, imprimible | `/app/manual` |
| Bonus 1-6 | 50 entrenamientos listos · Checklist del día de partido · Plan de 30 días · Kit de torneo interactivo · Guía QB · Guía receptores | `/app/bonus/*` |
| Order bumps | Playbook Defensivo (30 esquemas) · Pack 50 Entrenamientos Extra · Kit Coach Escolar (20 clases, planeación, rúbrica, torneo, diplomas) + páginas de venta | `/app/extras/*` · `/extras/*` |
| Marketing | 3 creativos 1080×1350 (HTML editable + PNG), 3 storyboards de video, copy de anuncios y correos | `/marketing` |
| Contenido en Markdown | Manual, clases, drills, jugadas, bonus y order bumps | `/content` |

---

## Instalar y ejecutar

Requisitos: **Node.js 20+**.

```bash
npm install
npm run dev          # http://localhost:3000
```

## Build de producción

```bash
npm run build        # exporta el sitio estático a /out
npm start            # sirve /out en http://localhost:3000
```

Sube la carpeta `out/` a Vercel, Netlify, Cloudflare Pages o cualquier hosting (ver `docs/DEPLOY.md`).

Otros comandos:

| Comando | Qué hace |
|---|---|
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run validate` | Valida integridad de jugadas, drills y sesiones (duplicados, minutos, referencias) |
| `npm run content:export` | Regenera los Markdown de `/content` |
| `npm run creatives` | Regenera creativos (HTML + PNG), `public/og.png` e íconos (requiere Chromium; `CHROMIUM_PATH=/ruta` si no está en `/opt/pw-browsers/chromium`) |

---

## Dónde cambiar…

### Precio
`config.ts`
```ts
export const PRICING = { regular: 599, offer: 199 };
export const ORDER_BUMPS = { defensa: { price: 79, … }, pack50: { price: 99, … }, escolar: { price: 79, … } };
```
El formato `MX$199` se aplica automáticamente en toda la landing.

### Checkout
`config.ts → CHECKOUT_URL` (o `NEXT_PUBLIC_CHECKOUT_URL` en `.env.local`). Todos los botones usan `checkoutUrl()` y reenvían UTMs. Detalles en `docs/CHECKOUT.md`.

### Copy de la landing
`data/copy.ts` (hero, problema, beneficios, pasos, precio, FAQ, footer). Garantía: `config.ts → GUARANTEE`.

### Jugadas
`data/plays.ts`. Cada jugada se escribe en notación compacta:
```ts
play("pc-01", "Rayo", "Pases cortos", P, "spread",
  [["X", "slant", 1], ["Z", "slant", 2], ["Y", "flat"], ["C", "hook", 0, { depth: 4 }]],
  ["Objetivo", "Descripción", "Lectura principal", "Lectura secundaria", "Consejo"]),
```
Jugadores `QB, C, X, Y, Z` · lectura `1` (verde) / `2` (amarillo) · opciones `depth`, `dir`, `pts` (ruta libre), `m` (motion). Ejecuta `npm run validate` después de editar.

### Drills
`data/drills.ts` (función `d(...)`). El generador los usa automáticamente según categoría, edad, nivel y jugadores. Plantillas del generador: `data/trainingTemplates.ts`.

### Clases, manual, bonus y extras
`data/classes.ts` · `data/manual.ts` · `data/bonuses.ts` · `data/readySessions.ts` · `data/defense.ts` · `data/schoolKit.ts` · `data/bumpPages.ts`.

### Colores y tipografías
`app/globals.css` (`@theme`). Paleta: `#070909`, `#49F05A`, `#173B20`, `#FFFFFF`, `#9DA3A3`.

---

## Exportar PDFs

Todas las vistas con botón **IMPRIMIR** tienen estilos de impresión (hoja blanca, sin navegación, saltos de página):
playbook, muñequeras, entrenamientos, drills, clases, manual, checklist, plan de 30 días, kit de torneo, guías, extras y diplomas.

1. Presiona **IMPRIMIR** (o Ctrl/Cmd + P).
2. Destino: **Guardar como PDF**.
3. Tamaño carta o A4. Para muñequeras imprime al **100%** (sin “ajustar a página”).
4. Activa “Gráficos de fondo” si quieres conservar colores.

Las versiones en Markdown de todos los documentos están en `/content`.

---

## Agregar checkout y acceso

1. Crea el producto en Hotmart, Kiwify, Stripe o Mercado Pago y pega el link en `CHECKOUT_URL`.
2. Configura los order bumps en tu plataforma con los precios de `config.ts`.
3. En el correo de entrega envía el link `https://tudominio.com/entrar/`.
4. Opcional: `ACCESS_CODE` y `BUMP_UNLOCK_CODES` en `config.ts` (barrera simple del lado del cliente).
5. Para cuentas reales y sincronización, conecta Supabase (`docs/SUPABASE.md`).

## Analytics
`.env.local`:
```
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_GA_ID=
```
Vacío = no se carga ningún script. Con IDs: `PageView` + `InitiateCheckout` en cada botón de compra.

---

## Datos del usuario
Todo se guarda en el navegador (`localStorage`, prefijo `flaglab:v1:`): jugadas, playbooks, entrenamientos, equipo, depth chart, tracker, torneo y preferencias. En **Ajustes** el coach puede exportar/importar un respaldo JSON. Arquitectura lista para Supabase (`lib/storage.ts → StorageDriver`).

## Estructura
Ver `docs/ARQUITECTURA.md`.

## Calidad
- `npm run build`, `npm run lint` y `npm run validate` sin errores.
- QA con navegador real (Playwright) en desktop 1440, tablet 820 y móvil 390: sin errores de consola ni scroll horizontal en landing y todas las rutas de la app; flujo completo probado (crear jugada → playbook → muñequeras → entrenamiento → equipo → tracker).
- Accesibilidad: contraste alto, labels en formularios, `focus-visible`, navegación por teclado (atajos en el creador), textos alternativos en diagramas, `prefers-reduced-motion`.
