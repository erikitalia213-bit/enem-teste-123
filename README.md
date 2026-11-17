# Protocolo 42 Dias: Bumbum pro Réveillon

App (PWA) que é o **entregável** do infoproduto: treino de glúteo guiado por 42 dias (6 semanas, 3 fases), com versões academia e casa, cardápio sugerido de 14 dias, lista de compras e acompanhamento da jornada até o Réveillon. Os exercícios são ensinados com imagens (início e fim), passos curtos, "onde sentir" e "erro comum". O produto não tem vídeo.

**Stack:** Next.js 16 (App Router) · TypeScript estrito · Tailwind CSS 4 · Supabase (Postgres, Auth com link mágico e RLS) · Vercel · Resend (SMTP) · Vitest · Playwright.

---

## Sumário

1. [Rodar localmente](#1-rodar-localmente)
2. [Estrutura do projeto](#2-estrutura-do-projeto)
3. [Variáveis de ambiente](#3-variáveis-de-ambiente)
4. [Supabase: banco, Auth e templates de e-mail](#4-supabase-banco-auth-e-templates-de-e-mail)
5. [E-mail com SMTP próprio (Resend)](#5-e-mail-com-smtp-próprio-resend)
6. [Deploy na Vercel](#6-deploy-na-vercel)
7. [Webhooks de compra (Wiapy e Kirvano)](#7-webhooks-de-compra-wiapy-e-kirvano)
8. [Quiz → app (parâmetros de personalização)](#8-quiz--app-parâmetros-de-personalização)
9. [Como editar exercícios, treinos e receitas](#9-como-editar-exercícios-treinos-e-receitas)
10. [Imagens dos exercícios](#10-imagens-dos-exercícios)
11. [Testes](#11-testes)
12. [Seed de desenvolvimento](#12-seed-de-desenvolvimento)
13. [Como o app funciona por dentro](#13-como-o-app-funciona-por-dentro)
14. [Checklist de lançamento](#14-checklist-de-lançamento)

---

## 1. Rodar localmente

Requisitos: **Node.js 20 ou mais novo**.

```bash
npm install
```

```bash
cp .env.example .env.local
```

Preencha o `.env.local` (veja a seção 3) e rode:

```bash
npm run dev
```

Abra http://localhost:3000.

### Explorar o app sem configurar nada (modo de teste)

Para ver todas as telas sem Supabase nem e-mail, use o modo de teste, que guarda tudo em memória:

```bash
MODO_TESTE_E2E=1 npm run dev
```

Entre com o e-mail `aluna@teste.com` na tela de login (o acesso é imediato, sem e-mail). Qualquer outro e-mail mostra a mensagem de "compra não encontrada". Os dados somem quando o servidor reinicia. **Esse modo nunca liga na Vercel** (o app checa a variável `VERCEL`).

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm start` | Build e servidor de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | Checagem de tipos |
| `npm test` | Testes unitários (Vitest) |
| `npm run test:e2e` | Teste ponta a ponta (Playwright) |
| `npm run test:rls` | Testa migrations e RLS num Postgres local (opcional) |
| `npm run validar:conteudo` | Confere exercícios, treinos, receitas e cardápio |
| `npm run seed:dev` | Cria compra aprovada fake e usuária de teste |
| `npm run docs:imagens` | Regenera `docs/prompt-imagens-exercicios.md` |
| `npm run imagens:manifesto` | Atualiza a lista de exercícios que já têm imagem |
| `npm run icones` | Regenera ícones do PWA e o logo do e-mail |

---

## 2. Estrutura do projeto

```
app/
  (publico)/login, bem-vinda        Telas sem login
  (aluna)/onboarding                4 perguntas + comemoração
  (aluna)/acesso-bloqueado          Reembolso/chargeback/sem compra
  (aluna)/(nav)/...                 Telas com barra inferior: hoje, treino, jornada,
                                    cardapio (+ lista-compras), biblioteca, exercicios/[slug], perfil
  (aluna)/(foco)/treino/[dia]       Treino guiado em tela cheia
  api/webhooks/[provedor]           Webhook oficial (kirvano | wiapy)
  api/webhooks/debug                Captura de payload cru
  auth/confirmar                    Destino dos links dos e-mails
  manifest.ts, offline, not-found, error
components/                         UI, cardápio, treino, PWA
content/                            CONTEÚDO EDITÁVEL (exercícios, protocolo, receitas, cardápio)
lib/
  protocolo/                        Gerador do calendário, montagem do treino, progresso
  webhooks/                         Adaptadores, token, processamento idempotente, exemplos/
  dados/                            Repositório Supabase (RLS) e repositório em memória (testes)
  acoes/                            Server Actions (login, onboarding, treino, refeições, perfil)
  listaCompras.ts, plano.ts, sessao.ts, datas.ts, quiz.ts
supabase/
  migrations/                       Schema + RLS
  templates/                        E-mails em PT-BR (convite e link mágico)
  config.toml                       Config do Supabase CLI (SMTP, templates, limites)
  testes/                           Teste do RLS num Postgres puro
scripts/                            Seed, validação, ícones, manifesto de imagens, prompts
tests/unit, tests/e2e               Vitest e Playwright
docs/prompt-imagens-exercicios.md   Prompts das 64 imagens dos exercícios
proxy.ts                            Proteção das rotas logadas (antigo middleware)
```

---

## 3. Variáveis de ambiente

Cadastre no `.env.local` (local) e em **Vercel → Project → Settings → Environment Variables** (produção).

| Variável | Obrigatória | Para quê |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | sim | URL do projeto (Supabase → Project Settings → API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | sim | Chave `anon`/publishable |
| `SUPABASE_SERVICE_ROLE_KEY` | sim | Chave `service_role`. **Só no servidor**, nunca no navegador. Usada pelos webhooks, pelo login (checar compra) e pelo seed |
| `WEBHOOK_SECRET_WIAPY` | sim | Token secreto do webhook da Wiapy |
| `WEBHOOK_SECRET_KIRVANO` | se usar Kirvano | Token secreto do webhook da Kirvano |
| `WEBHOOK_SECRET_DEBUG` | não | Token da rota de captura `/api/webhooks/debug`. Vazio = rota desligada |
| `NEXT_PUBLIC_APP_URL` | sim | URL pública, sem barra no final (ex.: `https://app.seudominio.com.br`) |
| `NEXT_PUBLIC_SUPORTE_EMAIL` | recomendado | E-mail de suporte exibido no login, no bloqueio e no perfil |
| `NEXT_PUBLIC_SUPORTE_WHATSAPP` | não | WhatsApp de suporte, só números com DDI+DDD (ex.: `5511999999999`) |
| `WEBHOOK_PRODUTOS_ACEITOS` | não | Lista (vírgula) de trechos do nome do produto que liberam acesso. Use se a mesma conta da Wiapy/Kirvano vende outros produtos. Ex.: `protocolo 42` |
| `RESEND_API_KEY` | ver seção 5 | Senha do SMTP do Resend. Configurada **no Supabase** (o app não envia e-mail direto); fica no `.env` só para o Supabase CLI |
| `SMTP_REMETENTE_EMAIL` / `SMTP_REMETENTE_NOME` | ver seção 5 | Remetente dos e-mails (usado pelo Supabase CLI) |

Gere tokens fortes para os webhooks:

```bash
openssl rand -hex 32
```

> As variáveis `NEXT_PUBLIC_*` entram no build. Se mudar alguma na Vercel, faça um novo deploy.

---

## 4. Supabase: banco, Auth e templates de e-mail

### 4.1 Criar o projeto e rodar a migration

1. Crie um projeto em https://supabase.com (região **South America (São Paulo)**).
2. Rode a migration de um destes jeitos:
   - **Pelo painel:** SQL Editor → New query → cole o conteúdo de `supabase/migrations/20261117000001_schema_inicial.sql` → Run.
   - **Pelo CLI:** `npx supabase link --project-ref SEU_REF` e depois `npx supabase db push`.
3. Confira em Table Editor: `profiles`, `compras`, `treinos_concluidos`, `refeicoes_marcadas` e `webhook_logs`, todas com RLS ligado (cadeado).

O que a migration cria:
- Tabelas com `check` nos valores permitidos e `unique` onde precisa (ex.: `transacao_id`, um treino por dia por aluna).
- Gatilho que cria o `profile` quando uma conta nasce no Auth.
- `tem_acesso()`, chamada pela aluna logada, e `email_tem_acesso(email)`, só para a service role: o acesso existe se houver compra `aprovada` para o e-mail.
- RLS: cada aluna só lê e escreve as próprias linhas. `compras` e `webhook_logs` são inacessíveis para alunas.

### 4.2 Configurar o Auth (link mágico)

Em **Authentication → URL Configuration**:
- **Site URL:** a mesma de `NEXT_PUBLIC_APP_URL` (ex.: `https://app.seudominio.com.br`).
- **Redirect URLs:** adicione `https://app.seudominio.com.br/**` e `http://localhost:3000/**`.

Em **Authentication → Sign In / Providers → Email**:
- **Email** habilitado.
- **Confirm email:** pode ficar desligado. As contas são criadas pelo webhook com convite e o link já confirma o e-mail.
- **Email OTP Expiration:** `3600` (1 hora).

### 4.3 Templates de e-mail em PT-BR

Em **Authentication → Emails → Templates**:

| Template | Assunto | Corpo (cole o HTML) |
|---|---|---|
| **Invite user** (boas-vindas para quem acabou de comprar) | `Seu acesso ao Protocolo 42 Dias chegou 🎆` | `supabase/templates/convite.html` |
| **Magic Link** (quem já tem conta pede um novo link) | `Seu link de acesso ao Protocolo 42 Dias` | `supabase/templates/link-magico.html` |

Os templates usam `{{ .TokenHash }}` e apontam para `/auth/confirmar`. Por isso o link funciona mesmo se a aluna pedir o acesso no computador e abrir o e-mail no celular. **Não troque por `{{ .ConfirmationURL }}`.** O logo do e-mail é `public/img/email-logo.png`, servido pelo próprio app (precisa estar no ar).

---

## 5. E-mail com SMTP próprio (Resend)

O SMTP padrão do Supabase envia **pouquíssimos e-mails por hora** e não serve para produção: num dia de vendas os convites travam. Configure um SMTP próprio com o Resend:

1. Crie uma conta em https://resend.com.
2. **Domains → Add Domain:** adicione um domínio seu (de preferência um subdomínio, ex.: `mail.seudominio.com.br`) e crie no seu DNS os registros que o Resend mostrar (SPF/MX e DKIM). Espere o status **Verified**.
3. **API Keys → Create API Key:** permissão **Sending access**, restrita ao domínio verificado. Guarde a chave (`re_...`).
4. No Supabase, vá em **Authentication → Emails → SMTP Settings** e ligue **Enable Custom SMTP**:

   | Campo | Valor |
   |---|---|
   | Sender email | `acesso@mail.seudominio.com.br` (do domínio verificado) |
   | Sender name | `Protocolo 42 Dias` |
   | Host | `smtp.resend.com` |
   | Port | `465` |
   | Username | `resend` |
   | Password | a API key do Resend (`re_...`) |
   | Minimum interval | `60` segundos (padrão) |

5. Em **Authentication → Rate Limits**, aumente **Rate limit for sending emails** (ex.: 300 por hora ou mais, conforme o seu plano do Resend). Esse limite só pode ser alterado com SMTP próprio ligado.
6. Teste: rode o seed (seção 12) ou peça um link na tela de login e confira em **Resend → Emails** se o envio aparece como *Delivered*.

Quem usa o Supabase CLI já tem tudo isso em `supabase/config.toml` (lê `RESEND_API_KEY`, `SMTP_REMETENTE_EMAIL` e `SMTP_REMETENTE_NOME` do ambiente). Para aplicar no projeto remoto:

```bash
npx supabase config push
```

---

## 6. Deploy na Vercel

1. Suba o repositório no GitHub.
2. Em https://vercel.com → **Add New → Project** → importe o repositório. O framework (Next.js) é detectado sozinho, sem mudar comandos.
3. Cadastre as variáveis da seção 3 em **Settings → Environment Variables** (ambiente *Production*; repita em *Preview* se for usar).
4. **Deploy.**
5. (Recomendado) Em **Settings → Domains**, ligue um domínio próprio (ex.: `app.seudominio.com.br`). Depois atualize `NEXT_PUBLIC_APP_URL` na Vercel e a **Site URL** no Supabase, e faça **Redeploy**.
6. Confira:
   - `https://SEU_DOMINIO/login` abre.
   - `https://SEU_DOMINIO/api/webhooks/wiapy` responde `{"ok":true,...}` (GET).
   - No celular, abra o app e use **Perfil → Instalar no celular**.

O build roda `scripts/gerar-manifesto-imagens.mjs` sozinho (via `prebuild`), então imagens novas em `public/exercicios/` aparecem no próximo deploy.

---

## 7. Webhooks de compra (Wiapy e Kirvano)

### URLs

| Plataforma | URL do webhook |
|---|---|
| **Wiapy** (checkout principal) | `https://SEU_DOMINIO/api/webhooks/wiapy?token=SEU_WEBHOOK_SECRET_WIAPY` |
| Kirvano | `https://SEU_DOMINIO/api/webhooks/kirvano?token=SEU_WEBHOOK_SECRET_KIRVANO` |
| Captura (debug) | `https://SEU_DOMINIO/api/webhooks/debug?token=SEU_WEBHOOK_SECRET_DEBUG&origem=wiapy` |

O token pode ir na query (`?token=`), no cabeçalho `x-webhook-token`, em `Authorization: Bearer ...` ou num campo `token` do JSON. Use o que a plataforma permitir. Se a plataforma tiver um campo próprio de "token"/"secret", coloque nele o mesmo valor da variável de ambiente.

**Eventos a marcar na plataforma:** compra aprovada/paga, reembolso e chargeback. Os demais (boleto/Pix gerado, carrinho abandonado, recusado) são aceitos e ignorados.

### O que acontece em cada evento

- **Aprovada:** grava em `compras` (upsert por `transacao_id`). Se a compradora ainda não tem conta, recebe o **convite** (e-mail de boas-vindas). Se já tem, recebe um **link mágico**.
- **Reembolso ou chargeback:** atualiza o status. O acesso é bloqueado na próxima tela que ela abrir e ela vê "Acesso indisponível" com o contato do suporte.
- **Repetições:** o mesmo evento enviado de novo não faz nada e não reenvia e-mail.
- **Fora de ordem:** uma aprovação que chegue *depois* de um reembolso da mesma transação é ignorada.
- **Falha no envio do e-mail:** a compra fica salva (a aluna consegue pedir o link no login) e o aviso vai para `webhook_logs`.
- **Payload que não deu para entender:** responde 422 e o JSON vai para `webhook_logs`, para você ajustar o adaptador.

### Passo a passo na Wiapy (recomendado: capturar o payload real primeiro)

O adaptador da Wiapy (`lib/webhooks/adaptadores/wiapy.ts`) foi escrito de forma tolerante, aceitando os nomes de campo mais comuns. Ainda assim, o formato exato precisa ser confirmado com um payload real:

1. Defina `WEBHOOK_SECRET_DEBUG` na Vercel e faça o deploy.
2. No painel da Wiapy, abra a área de **Webhooks / Integrações** (fica nas configurações da conta ou do produto/checkout) e cadastre a URL de **captura (debug)** da tabela acima, marcando os eventos de aprovação, reembolso e chargeback.
3. Faça uma compra de teste (e, se possível, o reembolso dela).
4. No Supabase, abra **Table Editor → webhook_logs** e copie o `corpo_json` recebido.
5. Me envie esse JSON (ou ajuste você mesmo): os caminhos ficam em `CAMPOS_WIAPY`, no topo do adaptador. Atualize os exemplos em `lib/webhooks/exemplos/wiapy-*.json` e rode `npm test`.
6. Troque a URL na Wiapy pela URL **oficial** (`/api/webhooks/wiapy?token=...`).
7. Quando estiver tudo certo, apague `WEBHOOK_SECRET_DEBUG` para desligar a rota de captura.

### Kirvano

No painel da Kirvano, abra **Integrações → Webhooks**, crie um webhook com a URL da Kirvano, selecione os eventos de **venda aprovada**, **reembolso** e **chargeback** e salve. O adaptador (`lib/webhooks/adaptadores/kirvano.ts`) entende o formato `{ event: "SALE_APPROVED", sale_id, customer: { email, name }, products, total_price }`. Se o formato que chegar for outro, use a captura (debug) do mesmo jeito descrito acima.

### Testar na mão

```bash
curl -X POST "http://localhost:3000/api/webhooks/wiapy?token=SEU_TOKEN" -H "content-type: application/json" --data @lib/webhooks/exemplos/wiapy-aprovada.json
```

```bash
curl -X POST "http://localhost:3000/api/webhooks/wiapy?token=SEU_TOKEN" -H "content-type: application/json" --data @lib/webhooks/exemplos/wiapy-reembolso.json
```

### Adicionar outra plataforma

Crie `lib/webhooks/adaptadores/NOVA.ts` implementando `normalizar(payload)` (veja os dois existentes), registre-o em `adaptadores/index.ts` e em `PROVEDORES` (`lib/webhooks/tipos.ts`), crie a variável `WEBHOOK_SECRET_NOVA` e acrescente o nome no `check` da coluna `compras.provedor` com uma nova migration.

---

## 8. Quiz → app (parâmetros de personalização)

Configure a página de obrigado do checkout (ou o botão final do quiz) para levar a compradora a:

```
https://SEU_DOMINIO/bem-vinda?nome=Maria&local=casa&dias=3&objetivo=empinado&nivel=iniciante
```

| Parâmetro | Valores aceitos |
|---|---|
| `nome` | primeiro nome (é limpo e capitalizado) |
| `local` | `academia`, `casa`, `ambos` (o `parada` do quiz vira `casa`) |
| `dias` | `2` a `6` |
| `objetivo` | `volume`, `empinado`, `firme`, `flacidez` |
| `nivel` ou `tempo` | `iniciante`, `intermediario`, `estagnada`, ou os valores do quiz: `menos1`, `mais1` |

Todos são opcionais. Os valores ficam salvos no aparelho e pré-preenchem o onboarding. Se a aluna já estiver logada, vai direto para o onboarding; se não, vê "deu tudo certo" e pode pedir o link de acesso ali mesmo.

---

## 9. Como editar exercícios, treinos e receitas

Todo o conteúdo fica em `/content`, em TypeScript tipado. Depois de editar, rode:

```bash
npm run validar:conteudo
```

O script aponta slugs inexistentes, receitas no lugar errado, exercício de academia na versão de casa, falta de passos etc. Os testes (`npm test`) também rodam essa validação.

| Arquivo | O que tem | Dicas |
|---|---|---|
| `content/exercicios.ts` | 32 exercícios: nome, local, equipamento, músculo, 3–4 passos, onde sentir, erro comum, dica de ouro | O `slug` vira URL e nome das imagens: não mude depois de gerar as imagens |
| `content/protocolo.ts` | Fases, treinos A/B/C/D das 3 fases, descanso ativo, dicas por objetivo | Cada linha de treino tem `academia` e `casa` lado a lado: as duas versões são geradas sozinhas. Use `repsCasa` quando a versão de casa precisar de mais repetições, `tecnica` para todas e `tecnicaSeEstagnada` só para o nível estagnada |
| `content/receitas.ts` | 46 receitas com ingredientes, preparo, proteína aprox. e tags | Ingredientes usam chaves do catálogo: `i("ovo", 2)`, `i("azeite", 1, "colher-sopa")` |
| `content/ingredientes.ts` | Catálogo: nome, plural, seção do mercado, unidade padrão e dica de compra | Ingrediente novo? Cadastre aqui primeiro |
| `content/cardapio.ts` | Cardápio de 14 dias e trocas por fase | Trocas: `{ "receita-original": "receita-da-fase" }`, sempre da mesma refeição |
| `content/poses-imagens.ts` | Poses de início/fim de cada exercício (para os prompts de imagem) | Exercício novo precisa de pose aqui |

Regras do protocolo que ficam no código (`lib/protocolo/`):
- **Dias de treino:** 2 = seg/qui · 3 = seg/qua/sex · 4 = seg/ter/qui/sex · 5 = seg/ter/qua/sex/sáb · 6 = seg a sáb. Os outros dias são descanso ativo de 5 minutos.
- **Rodízio:** 2–3 dias usam A, B, C; 4 ou mais usam A, B, C, D. Cada fase começa pelo treino A.
- **Nível:** iniciante faz 1 série a menos na Fase 1 (mínimo 2); estagnada recebe as técnicas extras a partir da Fase 2.

Mudanças no conteúdo valem para todas as alunas no próximo deploy: o plano é calculado a partir do conteúdo, não fica gravado no banco.

---

## 10. Imagens dos exercícios

- Caminho: `public/exercicios/{slug}-inicio.webp` e `public/exercicios/{slug}-fim.webp` (800×800).
- Os prompts prontos das 64 imagens, com nome de arquivo e estilo padronizado, estão em **`docs/prompt-imagens-exercicios.md`**.
- Enquanto as duas imagens de um exercício não existirem, o app mostra um placeholder com a silhueta (`public/img/mapa-base.webp`) e o nome do exercício. Nunca aparece imagem quebrada.
- Ao adicionar imagens, o `npm run dev`/`npm run build` atualiza a lista sozinho (ou rode `npm run imagens:manifesto`).

---

## 11. Testes

```bash
npm test
```

Testes unitários (Vitest): gerador de calendário (os 5 mapas de dias, fases, rodízio, ajustes no meio do protocolo, nível), progresso e medalhas, adaptadores Kirvano/Wiapy, token, processamento idempotente, rotas de webhook (com o Supabase simulado), lista de compras, formatação e parâmetros do quiz.

```bash
npm run test:e2e
```

Teste E2E (Playwright): login sem compra, proteção das rotas e o fluxo **onboarding → hoje → concluir treino → jornada**. Ele faz o build e sobe o app em `MODO_TESTE_E2E=1`, com banco em memória. No container de desenvolvimento o Chromium já vem instalado; na sua máquina, rode uma vez `npx playwright install chromium`.

```bash
PGHOST=localhost PGUSER=postgres npm run test:rls
```

Teste do RLS (opcional): aplica a migration num Postgres local descartável, com um schema `auth` simulado, e confere que cada aluna só vê os próprios dados, que alunas não leem `compras` e que reembolso e chargeback bloqueiam o acesso.

Para testar contra um Supabase real: configure o `.env.local`, rode `npm run seed:dev` e use o link impresso.

---

## 12. Seed de desenvolvimento

Cria uma **compra aprovada fake** e uma **usuária de teste** e imprime um link de acesso direto (não depende de e-mail):

```bash
npm run seed:dev
```

```bash
npm run seed:dev -- --email=bia@teste.com --nome=Bia --pronta --dias=10
```

`--pronta` deixa o onboarding feito e `--dias=10` coloca a usuária no dia 10, com os dias anteriores concluídos. Por segurança, o seed só roda contra Supabase **local**. Para um projeto na nuvem usado só para testes, acrescente `--projeto-de-testes`. **Nunca rode no projeto de produção:** a compra fake libera acesso de verdade.

---

## 13. Como o app funciona por dentro

- **Acesso:** o `proxy.ts` renova a sessão e manda para `/login` quem não está logada. Em toda página da área logada, o servidor chama `tem_acesso()`: sem compra aprovada, a aluna cai em `/acesso-bloqueado`; sem onboarding, em `/onboarding`.
- **Login:** a tela só envia o link mágico se o e-mail tiver compra aprovada. Caso contrário, mostra a mensagem com o contato do suporte.
- **Plano:** é calculado na hora (`lib/protocolo/calendario.ts`) a partir de `data_inicio`, `dias_semana`, `local_treino` e `ajustes_plano`. Quando a aluna troca local ou dias no perfil, um ajuste é registrado "a partir do dia de hoje": os dias anteriores continuam exatamente como eram.
- **"Hoje":** usa o fuso de Brasília (`America/Sao_Paulo`), independente do servidor.
- **Sequência 🔥:** dias seguidos cumpridos (treino ou descanso ativo concluído). Não fazer o dia de hoje ainda não quebra a sequência.
- **Jornada:** dias futuros ficam bloqueados; dias passados não feitos podem ser recuperados. As medalhas saem ao concluir todos os treinos da fase.
- **Treino guiado:** o progresso fica salvo no aparelho (se a tela recarregar, continua de onde parou), a tela fica acesa durante o treino e o fim do descanso vibra e apita.
- **Lista de compras:** soma os ingredientes das receitas da semana. Receitas de várias porções contam como receitas inteiras. Os checkboxes ficam salvos no aparelho.
- **PWA:** `app/manifest.ts` + `public/sw.js` (assets com cache primeiro, páginas pela rede com fallback offline). Ao sair da conta, as páginas salvas no aparelho são apagadas.

---

## 14. Checklist de lançamento

- [ ] Migration aplicada e RLS ligado em todas as tabelas
- [ ] Site URL e Redirect URLs do Supabase apontando para o domínio final
- [ ] Templates **Invite user** e **Magic Link** colados, com os assuntos em PT-BR
- [ ] SMTP do Resend ligado, domínio verificado e rate limit aumentado
- [ ] Variáveis na Vercel (inclusive suporte) e redeploy depois de mudar `NEXT_PUBLIC_*`
- [ ] Webhook da Wiapy: payload real capturado, adaptador conferido, URL oficial cadastrada
- [ ] Compra de teste → e-mail de boas-vindas chega → onboarding → treino
- [ ] Reembolso de teste → acesso bloqueado
- [ ] `WEBHOOK_SECRET_DEBUG` removido depois da captura
- [ ] Página de obrigado/quiz redirecionando para `/bem-vinda?...`
- [ ] App instalado e testado num Android e num iPhone
- [ ] Imagens dos exercícios geradas (ou placeholder aprovado para o lançamento)
