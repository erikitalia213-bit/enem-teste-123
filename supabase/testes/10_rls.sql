-- Testes de RLS e das funções de acesso. Falha (ERROR) se alguma regra quebrar.
\set ON_ERROR_STOP on
insert into auth.users (id, email, raw_user_meta_data) values
  ('11111111-1111-1111-1111-111111111111', 'Ana@Teste.com', '{"nome":"Ana"}'),
  ('22222222-2222-2222-2222-222222222222', 'bia@teste.com', '{}');

do $$ begin
  assert (select count(*) from public.profiles) = 2, 'gatilho deveria criar 2 profiles';
  assert (select email from public.profiles where id = '11111111-1111-1111-1111-111111111111') = 'ana@teste.com', 'e-mail em minúsculas';
  assert (select nome from public.profiles where id = '11111111-1111-1111-1111-111111111111') = 'Ana', 'nome vindo do metadata';
end $$;

insert into public.compras (email, provedor, transacao_id, status, produto, valor)
values ('ana@teste.com', 'wiapy', 'TX-1', 'aprovada', 'Protocolo 42 Dias', 47.00),
       ('bia@teste.com', 'kirvano', 'TX-2', 'reembolsada', 'Protocolo 42 Dias', 47.00);

insert into public.treinos_concluidos (user_id, dia_protocolo, treino_id)
values ('22222222-2222-2222-2222-222222222222', 1, 'f1-A');

-- Ana logada
set role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', false);
select set_config('request.jwt.claims', '{"email":"ana@teste.com"}', false);

do $$ begin
  assert public.tem_acesso() = true, 'Ana tem compra aprovada';
  assert (select count(*) from public.profiles) = 1, 'Ana só vê o próprio perfil';
  assert (select count(*) from public.treinos_concluidos) = 0, 'Ana não vê treinos da Bia';
end $$;

insert into public.treinos_concluidos (user_id, dia_protocolo, treino_id)
values ('11111111-1111-1111-1111-111111111111', 1, 'f1-A');
update public.profiles set dias_semana = 4 where id = '22222222-2222-2222-2222-222222222222';
insert into public.refeicoes_marcadas (user_id, data, refeicao, receita_id)
values ('11111111-1111-1111-1111-111111111111', current_date, 'cafe', 'ovos-mexidos');

do $$
begin
  begin
    insert into public.treinos_concluidos (user_id, dia_protocolo, treino_id)
    values ('22222222-2222-2222-2222-222222222222', 2, 'f1-B');
    raise exception 'Ana NÃO deveria inserir treino para a Bia';
  exception when insufficient_privilege then null;
  end;
  begin
    perform count(*) from public.compras;
    raise exception 'Ana NÃO deveria ler compras';
  exception when insufficient_privilege then null;
  end;
  begin
    perform count(*) from public.webhook_logs;
    raise exception 'Ana NÃO deveria ler webhook_logs';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.email_tem_acesso('bia@teste.com');
    raise exception 'Ana NÃO deveria chamar email_tem_acesso';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

do $$ begin
  assert (select dias_semana from public.profiles where id = '22222222-2222-2222-2222-222222222222') is null, 'update na Bia deveria ser ignorado pelo RLS';
end $$;

-- Bia logada: compra reembolsada = sem acesso
set role authenticated;
select set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', false);
select set_config('request.jwt.claims', '{"email":"bia@teste.com"}', false);
do $$ begin
  assert public.tem_acesso() = false, 'reembolso bloqueia o acesso';
  assert (select count(*) from public.treinos_concluidos) = 1, 'Bia vê só o próprio treino';
end $$;
reset role;

-- Anônimo não lê nada
set role anon;
do $$ begin
  begin
    perform count(*) from public.profiles;
    raise exception 'anon NÃO deveria ler profiles';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

-- service_role lê tudo e chama a função de acesso por e-mail
set role service_role;
do $$ begin
  assert public.email_tem_acesso(' ANA@teste.com ') = true, 'service role consulta acesso por e-mail';
  assert (select count(*) from public.compras) = 2;
end $$;
reset role;

-- Chargeback na Ana bloqueia
update public.compras set status = 'chargeback' where transacao_id = 'TX-1';
do $$ begin
  assert public.email_tem_acesso('ana@teste.com') = false, 'chargeback bloqueia o acesso';
end $$;

select 'RLS OK' as resultado;
