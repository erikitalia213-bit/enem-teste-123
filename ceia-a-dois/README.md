# Ceia a Dois — Natal e Réveillon em Casa

Landing page do guia digital **Ceia a Dois**: 4 cardápios (2 de Natal, 2 de Réveillon) para duas pessoas.
Stack: React 19 + TypeScript + Vite 7 + CSS próprio (`client/src/index.css`). O servidor Express/tRPC do template original continua no projeto, mas a página não depende dele.

## Como rodar

Requer Node 20+ e pnpm 10.

```bash
pnpm install
```

```bash
pnpm dev:static
```

Abre em http://localhost:3000 (só o front-end, ideal para revisar a página).

```bash
pnpm build:static
```

Gera o site estático em `dist/public/` — pode ser publicado em qualquer hospedagem estática (Vercel, Netlify, Hostinger, Cloudflare Pages…). Configuração na Vercel: *Build command* `pnpm build:static`, *Output directory* `dist/public`.

Outros comandos: `pnpm check` (tipos), `pnpm test` (testes, inclusive do repasse de UTM), `pnpm build` + `pnpm start` (build completo com o servidor Express do template).

## Onde configurar a oferta

**Tudo fica em um arquivo só: `client/src/config/oferta.ts`.**

| Campo | O que é | Estado atual |
|---|---|---|
| `precoCentavos` | Preço em centavos (`1000` = R$ 10,00). Aparece na oferta e no FAQ. | `1000` (proposta de teste) |
| `checkoutUrl` | Link real do checkout. Enquanto estiver `""`, o botão “Quero minha Ceia a Dois” fica **desativado** com o aviso “As vendas ainda não abriram”. | **vazio** |
| `entrega` | Como o cliente recebe o acesso (canal e prazo confirmados com a plataforma). Aparece na oferta e no FAQ só se preenchido. | **vazio** |
| `suporte` | Canal de suporte: `{ tipo: "email" \| "whatsapp" \| "url", valor: "..." }`. Aparece na oferta, no FAQ e no rodapé só se preenchido. | **vazio** |
| `garantia` | `{ dias: 7 }`, por exemplo. Com `null` nada sobre garantia é exibido. | **`null`** (oculta) |
| `responsavel` | Nome/razão social (e CNPJ, se quiser) no rodapé. | vazio |
| `produto` | Nome do produto. | preenchido |

### UTM

O link do checkout recebe automaticamente os parâmetros `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` e `utm_term` **da visita real** (só os que vierem preenchidos na URL). Não há mais `utm_source=organic` fixo. Para repassar outros parâmetros (ex.: `src`, `sck` da Hotmart), adicione o nome em `PARAMETROS_REPASSADOS` no mesmo arquivo. Lógica em `client/src/lib/checkout.ts`, testes em `client/src/lib/checkout.test.ts`.

Não há pixel instalado. Se for usar Meta/Google/TikTok, adicione o código oficial da sua conta em `client/index.html`.

## Estrutura da página (`client/src/pages/Home.tsx`)

1. **Topo** — título, subtítulo, botão “Quero os 4 cardápios” (`href="#oferta"`, sem JavaScript) e aviso de material digital. Capa `01` com prioridade de carregamento.
2. **Escolha a ceia** (`#cardapios`) — grupos Natal e Réveillon, 2 cards cada, pratos em texto HTML. Conteúdo no array `CARDAPIOS`.
3. **Por dentro do guia** (`#guia`) — mockup `06` com legenda “Prévia ilustrativa” e três blocos (`CONTEUDO_GUIA`).
4. **Como usar** (`#como-usar`) — foto `07`, texto curto e 3 passos.
5. **Oferta** (`#oferta`) — um produto, um preço, um botão, um checkout.
6. **FAQ** (`#duvidas`) e rodapé — acordeão com botões nativos (`aria-expanded`), funciona com Tab + Enter/Espaço.

Imagens em `client/public/assets/ceia-a-dois/` (originais de 1440 px + versões `-720.webp` para celular via `srcset`). Todas com `width`/`height`, `alt` descritivo e `loading="lazy"` abaixo da dobra.

Visual: bordô, marfim e dourado suave; Playfair Display nos títulos e DM Sans no texto (Google Fonts em `client/index.html`).

## O que mudou em relação ao projeto antigo

- Removidos: Air Fryer, Chef Lu, “101/188/200 receitas”, os dois checkouts wiapy com `utm_source=organic`, barra com data fixa de promoção, preço “De R$ 97”, avaliações/curtidas, “3.500+ pessoas”, nota 4.9, selo de garantia de 15 dias, promessa de entrega no WhatsApp/e-mail e todas as imagens antigas.
- Título da aba, descrição, Open Graph, `manus-routes.json`, `app.config.ts` e nome do pacote atualizados.
- Adicionado `postcss.config.mjs` vazio para o Vite não herdar configuração de pastas acima.
