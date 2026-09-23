-- ============================================================
-- FLAGLAB 5x5 · Esquema de accesos (entitlements)
-- Ejecuta este archivo completo en Supabase → SQL Editor (una sola vez).
--
-- Modelo:
--  * Cada compra aprobada crea/activa una fila en `entitlements` con el correo
--    del comprador y el producto (core_flaglab, defensive_playbook,
--    extra_trainings, school_coach_kit). Solo el servidor (webhook con
--    service_role) puede escribir aquí.
--  * La fila se vincula a la cuenta (user_id) únicamente cuando existe un
--    usuario con ese correo CONFIRMADO. Así nadie puede "reclamar" la compra
--    de otra persona creando una cuenta con su correo.
--  * RLS: cada usuario solo puede LEER sus propias filas. No hay políticas de
--    escritura para usuarios: el navegador jamás puede darse acceso.
-- ============================================================

create table if not exists public.entitlements (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid references auth.users (id) on delete set null,
  email              text not null check (email = lower(email)),
  product            text not null check (product in ('core_flaglab', 'defensive_playbook', 'extra_trainings', 'school_coach_kit')),
  status             text not null default 'active' check (status in ('active', 'revoked')),
  source             text not null default 'manual',          -- hotmart | kiwify | manual
  external_order_id  text not null default gen_random_uuid()::text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (source, external_order_id, product)
);

create index if not exists entitlements_user_idx on public.entitlements (user_id) where status = 'active';
create index if not exists entitlements_email_idx on public.entitlements (email);

alter table public.entitlements enable row level security;

drop policy if exists "entitlements: leer las propias" on public.entitlements;
create policy "entitlements: leer las propias"
  on public.entitlements for select
  to authenticated
  using (user_id = auth.uid());

-- Registro de webhooks (idempotencia + auditoría). Sin políticas: solo service_role.
create table if not exists public.webhook_events (
  id           bigint generated always as identity primary key,
  provider     text not null,
  event_id     text not null,
  event_type   text not null,
  email        text,
  products     text[] not null default '{}',
  action       text not null,                 -- grant | revoke | ignore
  payload      jsonb not null,
  received_at  timestamptz not null default now(),
  unique (provider, event_id)
);
alter table public.webhook_events enable row level security;

-- ------------------------------------------------------------
-- Vincular compras al confirmar el correo (o al cambiarlo y confirmarlo).
-- ------------------------------------------------------------
create or replace function public.claim_entitlements()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is not null and new.email is not null then
    update public.entitlements
       set user_id = new.id, updated_at = now()
     where email = lower(new.email)
       and (user_id is null or user_id <> new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_confirmed on auth.users;
create trigger on_auth_user_confirmed
  after insert or update of email, email_confirmed_at on auth.users
  for each row execute function public.claim_entitlements();

-- ------------------------------------------------------------
-- Otorgar / revocar (las llama el webhook con service_role).
-- ------------------------------------------------------------
create or replace function public.grant_entitlement(p_email text, p_product text, p_source text, p_order text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(p_email));
  v_user uuid;
begin
  select id into v_user from auth.users
   where lower(email) = v_email and email_confirmed_at is not null
   limit 1;

  insert into public.entitlements (email, product, status, source, external_order_id, user_id)
  values (v_email, p_product, 'active', p_source, p_order, v_user)
  on conflict (source, external_order_id, product) do update
    set status = 'active', email = excluded.email,
        user_id = coalesce(excluded.user_id, public.entitlements.user_id),
        updated_at = now();
end;
$$;

create or replace function public.revoke_entitlement(p_source text, p_order text, p_product text default null)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer;
begin
  update public.entitlements
     set status = 'revoked', updated_at = now()
   where source = p_source and external_order_id = p_order
     and (p_product is null or product = p_product);
  get diagnostics n = row_count;
  return n;
end;
$$;

revoke all on function public.grant_entitlement(text, text, text, text) from public, anon, authenticated;
revoke all on function public.revoke_entitlement(text, text, text) from public, anon, authenticated;
grant execute on function public.grant_entitlement(text, text, text, text) to service_role;
grant execute on function public.revoke_entitlement(text, text, text) to service_role;

-- ------------------------------------------------------------
-- Alta manual (soporte): ejecuta en SQL Editor, por ejemplo:
--   select public.grant_entitlement('coach@correo.com', 'core_flaglab', 'manual', 'soporte-001');
-- Revocar:
--   select public.revoke_entitlement('manual', 'soporte-001');
-- ------------------------------------------------------------
