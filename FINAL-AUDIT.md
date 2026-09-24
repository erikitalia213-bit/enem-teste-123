# FLAGLAB 5x5 — Final Launch Audit

Data: 24/09/2026 · Branch: `claude/flaglab-5x5-complete-0d5xuf`

Este relatório registra **o que foi efetivamente testado**, como foi testado, o que foi corrigido e **o que ainda tem limitação**. Onde algo não pôde ser testado de verdade (ex.: Supabase real, pagamento real, impressora física), isso está dito explicitamente.

---

## Resumo

| Área | Estado | Evidência |
|---|---|---|
| Acesso / segurança | ✅ Implementado (Supabase + entitlements) | E2E com Supabase simulado + leak-scan do build |
| Checkout / UTMs | ✅ | Unit + E2E (URL final verificada parâmetro por parâmetro) |
| Analytics | ✅ Purchase só no servidor | Código + E2E (nenhum Purchase no cliente) |
| Jogadas | ✅ 130 → **110** | `npm run audit:plays`: 0 bloqueantes |
| Drills | ✅ 68, segurança revisada | `npm run validate` ampliado |
| Gerador | ✅ | 6.000 combinações testadas, soma exata sempre |
| Criador de jogadas | ✅ + correções de toque | E2E mouse + toque (CDP) |
| Impressão playbook A4/Carta | ✅ corrigido | PDFs gerados e inspecionados visualmente |
| Pulseiras 6/9/12/18 | ✅ redesenhado | 8 PDFs inspecionados |
| Responsivo 390→1440 | ✅ corrigido | 10 páginas × 6 larguras, 0 overflow |
| Landing CRO | ✅ | Hero novo + demo real logo abaixo |
| Espanhol MX / claims | ✅ | Varredura de termos + correções |
| Páginas legais | ✅ base (precisa dados + revisão jurídica) | 3 páginas publicadas |
| Performance | ✅ Mobile 94 | Lighthouse 12 (mobile) |
| Lint / TS / build / testes | ✅ | ver seção 16 |

---

## 1. Acesso e segurança

**Antes:** código de acesso no frontend (`ACCESS_CODE`) + todo o conteúdo pago dentro dos bundles JS públicos (qualquer pessoa podia ler o JS).

**Agora:**
- Supabase Auth: conta própria por usuário (e-mail + senha, link mágico, recuperação de senha), sessão persistente por cookies (`@supabase/ssr`), `proxy.ts` renova a sessão e protege `/app/*`.
- Tabela `entitlements` com produtos `core_flaglab`, `defensive_playbook`, `extra_trainings`, `school_coach_kit` (`supabase/migrations/001_init.sql`).
  - RLS: usuário só **lê** as próprias linhas; não existe política de escrita para usuários.
  - Escrita só via funções `grant_entitlement` / `revoke_entitlement` executáveis apenas pelo `service_role` (webhook).
  - A compra só é vinculada à conta quando o **e-mail está confirmado** (trigger em `auth.users`) → ninguém “reivindica” a compra de outro criando conta com o e-mail dele.
- O conteúdo pago (`data/*.ts`) só é importado no servidor (`lib/server/content.ts`). O layout `/app` verifica os produtos do usuário e envia ao navegador **somente** o conteúdo que ele possui.
- Nenhum segredo no frontend: `SUPABASE_SERVICE_ROLE_KEY`, `HOTMART_HOTTOK`, `KIWIFY_WEBHOOK_TOKEN`, `META_CAPI_ACCESS_TOKEN`, `GA_API_SECRET` sem prefixo `NEXT_PUBLIC_`, usados só em `server-only`.
- Dados locais do coach separados por usuário (`flaglab:v1:u:<id>:`).
- Headers de segurança (nosniff, frame, referrer, permissions) e `noindex` + `no-store` em `/app`.

**Testado:**
- `npm run leak-scan` no build de produção: **459 textos pagos** (jogadas, drills, manual, aulas, playbook defensivo, kit escolar, pack extra) procurados em **47 arquivos públicos** → **0 encontrados**.
- E2E: sem sessão `/app/*` → redireciona para `/entrar/`; usuário sem compra vê “Tu cuenta aún no tiene FLAGLAB” e nenhum conteúdo; usuário com core vê 110 jogadas; complemento não comprado aparece bloqueado **e o texto dele não está no HTML**; senha errada mostra erro em espanhol.

**Limitação:** não havia um projeto Supabase real neste ambiente. Os testes usaram um **Supabase simulado** (`tests/e2e/mock-supabase.mjs`) que imita Auth, RLS e RPC. O SQL da migração **não foi executado** num Postgres real — rode-o e faça o teste do checklist antes de lançar.

## 2. Checkout
- Links 100% por variáveis de ambiente (`NEXT_PUBLIC_CHECKOUT_URL`, `_PROVIDER`, links separados por complemento).
- Preserva `utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid` (+ `gclid, src, sck`), guardados 30 dias; nunca sobrescreve parâmetros do link. Hotmart: gera `src`/`sck` automaticamente.
- Webhooks: `/api/webhooks/hotmart` (Hottok) e `/api/webhooks/kiwify` (HMAC-SHA1). Aprovado → libera; reembolso/chargeback/cancelado → revoga; idempotente.
- Documentação: `docs/CHECKOUT.md`.

**Testado (E2E):** URL final `https://pay.hotmart.com/TEST123?off=abc&utm_source=facebook&utm_medium=paid&utm_campaign=lanzamiento&utm_content=video1&utm_term=coach&fbclid=FBCLID123&src=facebook&sck=facebook|paid|lanzamiento|video1`; atribuição mantida ao navegar para outra página sem parâmetros; webhook com token inválido → 401; aprovado → complemento desbloqueia na app; reenvio do mesmo evento → `duplicate: true`; reembolso → bloqueia de novo; produto fora do mapa → ignorado.

**Limitação:** payloads reais de Hotmart/Kiwify não foram recebidos (sem contas). O parser do Hotmart segue o formato 2.0; o do **Kiwify** segue a documentação pública e deve ser conferido com um evento de teste real.

## 3. Analytics
- Cliente: PageView, ViewContent (landing e páginas de complementos), Lead (criar conta), InitiateCheckout (botão de compra, com produto e valor).
- **Purchase só no servidor**, disparado pelo webhook no primeiro processamento de um pagamento aprovado (Meta Conversions API + GA4 Measurement Protocol), com `event_id` estável para deduplicação. Nunca por abrir página.
- Sem IDs configurados, nenhum script de terceiros é carregado (verificado).

**Limitação:** envio real para Meta/GA4 não testado (sem tokens). Use `META_TEST_EVENT_CODE` para validar no Gerenciador de Eventos.

## 4. Auditoria das jogadas (130 → 110)
Script `npm run audit:plays` verifica: diagramas duplicados, mesmo conceito com nomes diferentes, nomes repetidos, rotas fora do campo, quebras curtas demais, dois recebedores terminando no mesmo ponto, texto de leitura contraditório com a rota, leitura primária inconsistente.
- **Removidas 20** jogadas duplicadas/artificiais: cv-01, se-02, cz-04, se-05, cs-05, pr-06, rz-07, cs-07, ch-04, ch-05, ch-03, cv-06, sc-10, js-10, js-04, js-05, js-08, cz-06, cs-08, cv-04.
- Corrigidas: pp-02 (texto de leitura), cs-03 (profundidade do hook do C), cs-09 (seam), cz-08 (drag), js-02 (rota e descrição); renomeadas ch-01, ch-02, se-09.
- Motor de rotas: compressão proporcional perto da linha lateral e formações realinhadas (recebedores abertos a ~3 jardas da lateral) → acabou com 48 rotas “esmagadas” na lateral.
- Textos absolutos corrigidos (“triângulo imposible de cubrir” → “difícil de cubrir”).
- Resultado: **110 jogadas, 0 problemas bloqueantes, 1 aviso intencional** (Rayo / Motion Corto usam o mesmo conceito de slant duplo, mas uma com motion — mantidas de propósito).
- Todos os números atualizados para 110 (landing, FAQ, app, manual, README, anúncios, criativos regenerados).

## 5. Drills (68)
Validador ampliado (`npm run validate`): IDs/nomes duplicados, **similaridade de texto entre drills** (limite 45%; maior par encontrado 38% → sem duplicatas), duração 4–25 min, mínimo de jogadores coerente com o ideal, passos e erros comuns presentes, compatibilidade de idade com as 100 sessões prontas.
Correções de segurança/clareza:
- vc-03: removida variação “olhos fechados”.
- wu-05: removido “5 saltos” como punição.
- fp-02 e manual: “empurrar o portador” → “direcionar sem tocar”.
- de-05 (interceptação): passes a meia altura para 6-8 anos, disputa com recebedor só 12+ e sem contato, piso livre de obstáculos.
- “tacklear” → “taclear”; “campo/reglas oficiales” → “las de tu liga”.
- Idades ajustadas em wu-04, co-03, vc-04 (4 sessões usavam drills fora da faixa etária).

## 6. Gerador de treinos
Teste automatizado com **6.000 combinações** (5 idades × 3 níveis × 5 durações × 8 quantidades de jogadores de 4 a 30 × 10 objetivos). Em todas: soma **exatamente** igual ao tempo escolhido, blocos ≥ 3 min, drills sempre da idade, nunca mais de 1 nível acima, nunca exigem mais jogadores do que há, sem drill repetido na sessão.
E2E na interface: 6-8 anos/30 min/6 jogadores → 4 blocos = 30 min; Adultos/90 min/20 jogadores → 6 blocos = 90 min.

## 7. Criador de jogadas
**Problemas encontrados e corrigidos:**
- `touch-action: none` no campo inteiro impedia rolar a página no celular ao tocar no campo → agora o fundo permite rolar e pinch-zoom; só jogadores, pontos, notas e zonas bloqueiam o gesto (para arrastar).
- Pontos de ajuste de rota tinham ~5 px de raio no celular → área de toque invisível ampliada (~10 mm).
- Sem zoom → botões **Acercar/Alejar** (até 250%) com rolagem interna.

**Testado (E2E, build de produção):** arrastar jogador com mouse; desfazer volta exatamente à coordenada original; refazer; aplicar rota; salvar; baixar PNG (arquivo gerado); adicionar ao playbook; duplicar (original + cópia aparecem em “Mis jugadas”). Tablet 820 px com toque real via CDP: jogador arrastado com o dedo (Δ 77 px), fundo com `touch-action: manipulation`, zoom funcionando.

**Limitação:** toque testado em Chromium com emulação; **não testado em iPhone/Safari real**.

## 8. Impressão do playbook (A4 e Carta)
PDFs gerados pelo Chromium com CSS de impressão e inspecionados como imagem.
**Problemas encontrados e corrigidos:** margens da página saíam pretas quando “gráficos de fundo” estava ligado (tema escuro) → `color-scheme: light` na impressão; **página em branco no final** → removida; títulos agora não ficam sozinhos no fim da página.
**Resultado:** A4 e Carta com 6 páginas (capa, índice, jogadas), nada cortado, rotas e nomes legíveis, menu lateral oculto.

## 9. Pulseiras (6/9/12/18)
**Problemas graves encontrados e corrigidos:**
- Na grade de 18 (e 12) colunas ficavam desiguais e a última coluna era cortada; o segundo cartão saía cortado na borda do papel.
- Diagramas minúsculos.
- O 4º cartão ia para uma página extra (margem da pré-visualização entrava na impressão) e Carta cabia só 1 cartão por linha por 1 mm.

**Agora:** células horizontais (6 = 2×3, 9 = 3×3, 12 = 3×4, 18 = 3×6), colunas iguais, número em faixa lateral no 12/18, diagrama “mini” com rotas e jogadores mais grossos e campo sem linhas de jarda, cálculo de cartões por página considerando o espaço entre eles. Carta: 6 cartões médios por folha; A4: 4.
**Testado:** 8 PDFs (4 layouts × Carta/A4) com 15 jogadas: número de páginas exato (grupos + folha do coach), nada cortado.
**Limitação:** **não houve impressão física**. No 18 por cartão médio (9,5 × 6 cm) cada célula tem ~3,2 × 1 cm: legível para quem já conhece a jogada, mas recomendamos tamanho **Grande** ou 12 por cartão. Imprima uma folha de teste em 100% (sem “ajustar à página”).

## 10. Responsividade
10 páginas (landing, entrar, dashboard, biblioteca, criador, treinos, playbook, pulseiras, manual, equipe) × 390, 430, 768, 820, 1024, 1440 px. **Encontrado e corrigido:** overflow horizontal de 19 px na lista de pulseiras em 1024 px. Final: **0 páginas com rolagem horizontal**. Capturas em `tests/e2e/out/`.

## 11. Landing CRO
- H1: **“Crea jugadas. Organiza tu playbook. Llévalo al campo.”** (visível no primeiro scroll em 390 px — testado).
- Demo real (criar rota, gerar treino, pulseira) logo abaixo do hero e dos números, antes da seção de problemas.
- Menos texto: problemas 5 → 3; subtítulo mais curto; sem animação no texto do hero (melhora LCP).
- FAQ novas: como recebo o acesso, onde ficam meus dados, “garante vitórias?” (não).

## 12–13. Espanhol do México e claims
Varredura de termos de Espanha/Brasil (móvil, ordenador, coger, vale, vosotros, jogada, treino…) → só apareciam em comentários de código. Eyebrow “Wristbands” → “Muñequeras”; plural “1 jugadas” corrigido.
Claims removidos/ajustados: “La defensa gana partidos”, “imposible de cubrir”, “no puede cubrir a los dos”, “casi imposible completar pases profundos”. Microcopy “Acceso inmediato” → “Acceso con tu cuenta al pagar”. FAQ explícita: nenhuma ferramenta garante resultados.

## 14. Legal
Páginas `/privacidad/`, `/terminos/`, `/aviso-de-independencia/` com links no rodapé, sitemap e login. Dados do responsável vêm de variáveis (`NEXT_PUBLIC_LEGAL_*`); se faltarem, aparece um marcador amarelo **[pendiente…]** em vez de dados inventados.
**Limitação:** são modelos base. **Devem ser revisados por um advogado no México** (LFPDPPP, PROFECO) antes de escalar anúncios.

## 15. Performance (Lighthouse 12, mobile, build local)
| Página | Perf | A11y | Best practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| Landing (antes) | 80 | 100 | 100 | 100 | 3,0 s | **0,257** |
| **Landing (depois)** | **94** | 100 | 100 | 100 | 3,0 s | **0** |
| /entrar | 96 | 100 | 100 | 63* | 2,7 s | 0,04 |
| /app | 92 | 100 | 100 | – | 3,3 s | 0 |
| /app/crear | 97 | 94 | 100 | – | 2,6 s | 0 |
| /app/biblioteca | 95 | 98 | 100 | – | 2,9 s | 0 |

\* `/entrar` tem `noindex` de propósito.
Correção principal: fontes via `next/font/local` (pré-carregadas, fallback com métricas ajustadas) → eliminou o salto de layout do botão de compra.
**Limitação:** medido em servidor local com throttling simulado, não na CDN de produção. Rode de novo após o deploy.

## 16. Testes executados (todos passando)
| Comando | Resultado |
|---|---|
| `npm run lint` | 0 erros, 0 avisos |
| `npm run typecheck` | 0 erros |
| `npm run build` | OK (Next 16, Turbopack) |
| `npm test` | 11/11 (checkout/UTMs, product map, webhooks Hotmart e Kiwify, splitMinutes, 6.000 combinações do gerador, jogadas dentro do campo, espelho, reordenar playbook) |
| `npm run validate` | 110 jogadas · 68 drills · 20 aulas · 100 sessões — válidos |
| `npm run audit:plays` | 0 bloqueantes, 1 aviso intencional |
| `npm run leak-scan` | 0 textos pagos em arquivos públicos |
| `tests/e2e/e2e.mjs` | **22/22** — inclui links internos e páginas públicas (200), **0 erros de console** |

## Limitações que continuam existindo
1. Supabase, Hotmart, Kiwify, Meta CAPI e GA4 **reais** não foram testados (sem contas neste ambiente) — testados com simuladores e testes unitários.
2. Jogadas, playbooks e treinos do coach ficam **no navegador do dispositivo** (exportar/importar em Ajustes). Não há sincronização em nuvem entre celular e computador.
3. Sem impressão física; sem teste em iPhone/Safari real.
4. Páginas legais precisam dos dados do responsável e revisão jurídica.
5. O e-mail padrão do Supabase tem limite baixo de envio: configure SMTP próprio antes dos anúncios.
6. Regras de tocho bandera variam por liga (distância do rusher, oportunidades); o produto avisa o coach para conferir o regulamento.
