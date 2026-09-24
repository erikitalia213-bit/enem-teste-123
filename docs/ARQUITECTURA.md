# Arquitectura de FLAGLAB 5x5

## Stack
- **Next.js 16 (App Router) + React 19 + TypeScript**
- **Tailwind CSS 4** (tokens de marca en `app/globals.css` → `@theme`)
- **lucide-react** para íconos · **@fontsource** (Inter + Barlow Condensed) servidas localmente
- **Supabase** (Auth + tabla `entitlements` con RLS) y rutas de servidor de Next (`/api/webhooks/*`, `/auth/callback`).
- El contenido de pago (`data/*.ts`) solo se importa en el servidor (`lib/server/content.ts`); `app/app/layout.tsx` decide qué productos tiene el usuario y pasa ese contenido a `ContentProvider`. Verificado con `npm run leak-scan`.
- Lo que crea el coach se guarda en `localStorage`, con prefijo por usuario (`flaglab:v1:u:<id>:`).

## Carpetas
```
app/                 Rutas (landing, /entrar, /app/*, /extras/*)
  app/               Aplicación del coach (dashboard y herramientas)
components/          UI, diagramas, creador, landing, etc.
  diagram/           PlayDiagram: render SVG único para app, impresión y creativos
  creator/           Creador de jugadas (campo interactivo + inspector)
data/                Contenido: jugadas, drills, clases, manual, bonus, extras, copy
lib/                 Motor de campo/rutas, generador, storage, hooks, checkout, analytics
content/             Exportación Markdown del contenido (npm run content:export)
marketing/           Creativos de imagen, storyboards de video y copy
scripts/             Validación de datos, exportación de contenido y creativos
public/              OG image, íconos PWA, manifest
config.ts            Precios, checkout, analytics y datos legales (sin secretos)
lib/server/          Acceso, contenido por producto, webhooks, conversiones
supabase/migrations/ Esquema SQL (entitlements, webhook_events, RLS)
tests/               Pruebas unitarias (npm test) y de punta a punta (tests/e2e)
```

## Motor de diagramas (`lib/field.ts`)
- Campo de 100 × 90 unidades (25 yardas de ancho → 4 unidades por yarda), línea de scrimmage en `y = 62`.
- Formaciones: Spread, Trips Right, Trips Left, Twins, Stack, Bunch, Empty.
- Rutas generadas por tipo (go, slant, out, in, corner, post, drag, hook, screen, flat, wheel, etc.) → puntos SVG editables.
- Las jugadas de la biblioteca se escriben en notación compacta y se convierten con `buildDiagram()`.

## Generador de entrenamientos (`lib/generator.ts`)
Reglas sin IA: plantilla por objetivo (`data/trainingTemplates.ts`) → reparto de minutos → selección de drills por puntuación (edad, nivel, jugadores) con semilla para variaciones.

## Persistencia (`lib/storage.ts`)
`useStored` / `useCollection` sobre `useSyncExternalStore`. Llaves con prefijo `flaglab:v1:u:<userId>:`. Respaldo/importación JSON en Ajustes. Ver `docs/SUPABASE.md` para conectar un backend.
