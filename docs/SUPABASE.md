# Supabase: cuentas y accesos

FLAGLAB usa Supabase **solo** para dos cosas: cuentas de usuario (Auth) y la tabla de accesos comprados (`entitlements`). Las jugadas, playbooks y entrenamientos que crea el coach siguen guardándose en su navegador (separados por usuario).

## 1. Crear el proyecto
1. https://supabase.com → New project (región cercana a México, p. ej. `us-east-1`).
2. **SQL Editor** → pega y ejecuta completo `supabase/migrations/001_init.sql`.
3. **Project Settings → API**: copia
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` / `publishable` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**secreto**, solo en el servidor; nunca con `NEXT_PUBLIC_`).

## 2. Configurar Auth (obligatorio)
- **Authentication → Sign In / Providers → Email**: activado.
- **Confirm email: ACTIVADO.** Es lo que impide que alguien cree una cuenta con el correo de otro comprador y reclame su acceso: la compra solo se vincula cuando el correo está confirmado.
- **Authentication → URL Configuration**
  - Site URL: `https://tu-dominio.com`
  - Redirect URLs: `https://tu-dominio.com/auth/callback/**` (y `http://localhost:3000/auth/callback/**` para desarrollo).
- **SMTP propio (muy recomendado para lanzar con anuncios)**: Authentication → Emails → SMTP Settings (Resend, Brevo, SES, etc.). El correo por defecto de Supabase tiene un límite muy bajo de envíos por hora y no sirve para tráfico pagado.
- Plantillas de correo: tradúcelas al español (Authentication → Emails → Templates).

## 3. Cómo funciona el acceso
```
Pago aprobado ─► webhook /api/webhooks/{hotmart|kiwify} (valida firma/token)
             ─► grant_entitlement(correo, producto)   [service_role]
Usuario crea cuenta con ese correo y lo confirma
             ─► trigger on_auth_user_confirmed vincula la compra a su user_id
/app (servidor) ─► lee entitlements del usuario (RLS: solo sus filas)
             ─► envía al navegador SOLO el contenido de los productos que tiene
```
Productos: `core_flaglab`, `defensive_playbook`, `extra_trainings`, `school_coach_kit`.
Reembolso o contracargo → `revoke_entitlement` → el acceso se retira en la siguiente carga.

## 4. Operación manual (soporte)
En SQL Editor:
```sql
-- dar acceso
select public.grant_entitlement('coach@correo.com', 'core_flaglab', 'manual', 'soporte-001');
-- quitar acceso
select public.revoke_entitlement('manual', 'soporte-001');
-- ver accesos de un correo
select product, status, source, external_order_id, user_id from public.entitlements where email = 'coach@correo.com';
-- últimos webhooks recibidos
select provider, event_type, action, email, products, received_at from public.webhook_events order by id desc limit 50;
```
Si el cliente compró con un correo y se registró con otro: vuelve a otorgar el producto con el correo de su cuenta.

## 5. Desarrollo local sin Supabase
`FLAGLAB_DEV_BYPASS_AUTH=true` en `.env.local` + `npm run dev` → entras con todos los productos. Se ignora en producción (`NODE_ENV=production`).
