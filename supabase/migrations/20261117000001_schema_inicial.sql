-- =============================================================================
-- Protocolo 42 Dias: Bumbum pro Réveillon — schema inicial
-- Tabelas, gatilhos, funções de acesso e Row Level Security (RLS).
-- Regra geral: cada aluna só lê e escreve os próprios dados. Tabelas internas
-- (compras, webhook_logs) só são acessadas pelo servidor com a service role.
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Função utilitária: mantém updated_at atualizado
-- -----------------------------------------------------------------------------
create or replace function public.definir_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- profiles: dados da aluna (1:1 com auth.users)
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text,
  email text not null,
  local_treino text check (local_treino in ('academia', 'casa', 'ambos')),
  dias_semana integer check (dias_semana between 2 and 6),
  objetivo text check (objetivo in ('volume', 'empinado', 'firme', 'flacidez')),
  nivel text check (nivel in ('iniciante', 'intermediario', 'estagnada')),
  data_inicio date,
  onboarding_completo boolean not null default false,
  -- Histórico de mudanças de rotina feitas no perfil. Cada item:
  -- { "desde_dia": 1..42, "dias_semana": 2..6, "local_treino": "academia"|"casa"|"ambos" }
  -- O gerador do protocolo aplica cada ajuste a partir do dia indicado, preservando
  -- os dias anteriores exatamente como eram (histórico intacto).
  ajustes_plano jsonb not null default '[]'::jsonb check (jsonb_typeof(ajustes_plano) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles (lower(email));

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.definir_updated_at();

-- -----------------------------------------------------------------------------
-- compras: eventos de compra recebidos pelos webhooks (Kirvano / Wiapy)
-- -----------------------------------------------------------------------------
create table if not exists public.compras (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email = lower(email)),
  nome text,
  provedor text not null check (provedor in ('kirvano', 'wiapy')),
  transacao_id text not null unique,
  status text not null check (status in ('aprovada', 'reembolsada', 'chargeback')),
  produto text,
  valor numeric(10, 2),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists compras_email_idx on public.compras (email);

drop trigger if exists compras_updated_at on public.compras;
create trigger compras_updated_at
  before update on public.compras
  for each row execute function public.definir_updated_at();

-- -----------------------------------------------------------------------------
-- treinos_concluidos: um registro por dia do protocolo concluído
-- -----------------------------------------------------------------------------
create table if not exists public.treinos_concluidos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  dia_protocolo integer not null check (dia_protocolo between 1 and 42),
  treino_id text not null,
  concluido_em timestamptz not null default now(),
  unique (user_id, dia_protocolo)
);

create index if not exists treinos_concluidos_user_idx on public.treinos_concluidos (user_id);

-- -----------------------------------------------------------------------------
-- refeicoes_marcadas: refeições do cardápio marcadas como feitas
-- -----------------------------------------------------------------------------
create table if not exists public.refeicoes_marcadas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  data date not null,
  refeicao text not null check (refeicao in ('cafe', 'almoco', 'lanche', 'jantar')),
  receita_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, data, refeicao)
);

create index if not exists refeicoes_marcadas_user_data_idx on public.refeicoes_marcadas (user_id, data);

-- -----------------------------------------------------------------------------
-- webhook_logs: payloads crus capturados pela rota /api/webhooks/debug
-- (e também pelos webhooks oficiais quando o payload não pôde ser interpretado)
-- -----------------------------------------------------------------------------
create table if not exists public.webhook_logs (
  id bigint generated always as identity primary key,
  origem text not null,
  metodo text not null default 'POST',
  headers jsonb not null default '{}'::jsonb,
  query jsonb not null default '{}'::jsonb,
  corpo_bruto text,
  corpo_json jsonb,
  observacao text,
  created_at timestamptz not null default now()
);

create index if not exists webhook_logs_created_idx on public.webhook_logs (created_at desc);

-- -----------------------------------------------------------------------------
-- Gatilho: cria o profile automaticamente quando um usuário nasce no Auth
-- -----------------------------------------------------------------------------
create or replace function public.criar_profile_novo_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, nome)
  values (
    new.id,
    lower(coalesce(new.email, '')),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'nome', '')), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists ao_criar_usuario on auth.users;
create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_profile_novo_usuario();

-- -----------------------------------------------------------------------------
-- Funções de acesso
-- Acesso liberado = existe ao menos uma compra 'aprovada' para o e-mail.
-- Quando a compra vira 'reembolsada' ou 'chargeback', o status é atualizado na
-- mesma linha (mesmo transacao_id) e o acesso deixa de existir.
-- -----------------------------------------------------------------------------
create or replace function public.email_tem_acesso(p_email text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.compras c
    where c.email = lower(trim(p_email))
      and c.status = 'aprovada'
  );
$$;

-- Versão para a aluna logada: usa o e-mail do próprio token (não aceita parâmetro).
create or replace function public.tem_acesso()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.email_tem_acesso(coalesce(auth.jwt() ->> 'email', ''));
$$;

revoke all on function public.email_tem_acesso(text) from public;
revoke all on function public.tem_acesso() from public;
grant execute on function public.tem_acesso() to authenticated;
grant execute on function public.email_tem_acesso(text) to service_role;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.compras enable row level security;
alter table public.treinos_concluidos enable row level security;
alter table public.refeicoes_marcadas enable row level security;
alter table public.webhook_logs enable row level security;

-- Visitantes anônimos não têm nada a fazer nestas tabelas.
revoke all on public.profiles, public.compras, public.treinos_concluidos,
  public.refeicoes_marcadas, public.webhook_logs from anon;

-- Tabelas internas: nenhuma política para alunas (somente service role).
revoke all on public.compras, public.webhook_logs from authenticated;

-- profiles
drop policy if exists "aluna lê o próprio perfil" on public.profiles;
create policy "aluna lê o próprio perfil" on public.profiles
  for select to authenticated using (id = auth.uid());

drop policy if exists "aluna cria o próprio perfil" on public.profiles;
create policy "aluna cria o próprio perfil" on public.profiles
  for insert to authenticated with check (id = auth.uid());

drop policy if exists "aluna atualiza o próprio perfil" on public.profiles;
create policy "aluna atualiza o próprio perfil" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

grant select, insert, update on public.profiles to authenticated;
revoke delete on public.profiles from authenticated;

-- treinos_concluidos
drop policy if exists "aluna lê os próprios treinos" on public.treinos_concluidos;
create policy "aluna lê os próprios treinos" on public.treinos_concluidos
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "aluna registra os próprios treinos" on public.treinos_concluidos;
create policy "aluna registra os próprios treinos" on public.treinos_concluidos
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "aluna atualiza os próprios treinos" on public.treinos_concluidos;
create policy "aluna atualiza os próprios treinos" on public.treinos_concluidos
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "aluna apaga os próprios treinos" on public.treinos_concluidos;
create policy "aluna apaga os próprios treinos" on public.treinos_concluidos
  for delete to authenticated using (user_id = auth.uid());

grant select, insert, update, delete on public.treinos_concluidos to authenticated;

-- refeicoes_marcadas
drop policy if exists "aluna lê as próprias refeições" on public.refeicoes_marcadas;
create policy "aluna lê as próprias refeições" on public.refeicoes_marcadas
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "aluna marca as próprias refeições" on public.refeicoes_marcadas;
create policy "aluna marca as próprias refeições" on public.refeicoes_marcadas
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "aluna atualiza as próprias refeições" on public.refeicoes_marcadas;
create policy "aluna atualiza as próprias refeições" on public.refeicoes_marcadas
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "aluna desmarca as próprias refeições" on public.refeicoes_marcadas;
create policy "aluna desmarca as próprias refeições" on public.refeicoes_marcadas
  for delete to authenticated using (user_id = auth.uid());

grant select, insert, update, delete on public.refeicoes_marcadas to authenticated;
