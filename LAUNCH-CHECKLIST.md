# FLAGLAB 5x5 — Checklist de lançamento

Siga na ordem. Cada item tem como verificar. Detalhes em `docs/`.

## 1. Supabase (≈ 20 min) — `docs/SUPABASE.md`
- [ ] Projeto criado; `supabase/migrations/001_init.sql` executado sem erro no SQL Editor.
- [ ] Authentication → Email ativado e **Confirm email ATIVADO**.
- [ ] Site URL = domínio final; Redirect URLs incluem `https://SEU-DOMINIO/auth/callback/**`.
- [ ] **SMTP próprio** configurado (Resend/Brevo/SES) e templates de e-mail traduzidos para espanhol.
- [ ] Copiadas: Project URL, anon key, service_role key.

## 2. Plataforma de pagamento — `docs/CHECKOUT.md`
- [ ] Produto principal (MX$199) + 3 order bumps (MX$79, MX$99, MX$79) criados.
- [ ] IDs anotados → `HOTMART_PRODUCT_MAP` ou `KIWIFY_PRODUCT_MAP`.
- [ ] Webhook apontando para `https://SEU-DOMINIO/api/webhooks/hotmart` (ou `/kiwify`) com os eventos de aprovação, reembolso e chargeback.
- [ ] Hottok / token do webhook copiado.
- [ ] Página de obrigado/entrega aponta para `https://SEU-DOMINIO/entrar/` com a instrução: “crie sua conta com o MESMO e-mail da compra”.
- [ ] Garantia/reembolso configurada na plataforma (o site só diz “consulta las condiciones en el checkout”).

## 3. Variáveis de ambiente (hosting) — lista completa em `.env.example`
Obrigatórias:
- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] `NEXT_PUBLIC_SUPPORT_EMAIL`
- [ ] `NEXT_PUBLIC_LEGAL_OWNER`, `NEXT_PUBLIC_LEGAL_ADDRESS`, `NEXT_PUBLIC_PRIVACY_EMAIL`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (secreto)
- [ ] `NEXT_PUBLIC_CHECKOUT_PROVIDER`, `NEXT_PUBLIC_CHECKOUT_URL`
- [ ] `HOTMART_HOTTOK` + `HOTMART_PRODUCT_MAP` **ou** `KIWIFY_WEBHOOK_TOKEN` + `KIWIFY_PRODUCT_MAP` (secretos)

Opcionais:
- [ ] `NEXT_PUBLIC_CHECKOUT_URL_DEFENSIVE`, `_EXTRA_TRAININGS`, `_SCHOOL_KIT` (venda avulsa dos complementos)
- [ ] `NEXT_PUBLIC_META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`, `META_TEST_EVENT_CODE` (só durante o teste)
- [ ] `NEXT_PUBLIC_GA_ID`, `GA_API_SECRET`
- [ ] `FLAGLAB_DEV_BYPASS_AUTH` **vazio** em produção (é ignorado em produção de qualquer forma)

## 4. Deploy — `docs/DEPLOY.md`
- [ ] Deploy na Vercel (ou host com Node). Domínio com HTTPS.
- [ ] Após mudar qualquer `NEXT_PUBLIC_*`, fazer novo deploy.

## 5. Teste de ponta a ponta em produção (obrigatório antes dos anúncios)
- [ ] Abrir `https://SEU-DOMINIO/?utm_source=teste&utm_campaign=lancamento&fbclid=abc` → clicar em comprar → a URL do checkout contém os parâmetros.
- [ ] Fazer **uma compra real** (ou em modo teste) do principal **+ 1 order bump** com um e-mail seu.
- [ ] Supabase → `webhook_events`: evento com `action = grant` para os 2 produtos. (Se `unmapped` apareceu, o ID no mapa está errado.)
- [ ] Criar conta em `/entrar/` com o mesmo e-mail → confirmar e-mail → entrar: app abre, complemento comprado desbloqueado, os outros bloqueados.
- [ ] Criar uma jogada no celular, adicionar ao playbook, imprimir 1 folha de pulseira (100%, sem “ajustar à página”) e conferir se o diagrama se lê.
- [ ] Reembolsar a compra de teste → na próxima carga o acesso some.
- [ ] Meta → Gerenciador de eventos → Testar eventos (com `META_TEST_EVENT_CODE`): ver PageView, ViewContent, InitiateCheckout (navegador) e Purchase (servidor). Depois **apagar** `META_TEST_EVENT_CODE`.
- [ ] Se a plataforma também envia Purchase ao Pixel pela integração nativa, deixar **apenas uma** fonte ativa.

## 6. Conteúdo e legal
- [ ] `/privacidad/`, `/terminos/` e `/aviso-de-independencia/` sem marcadores amarelos “[pendiente…]”.
- [ ] Revisão por advogado no México (privacidade e termos).
- [ ] Criativos em `marketing/creatives/` revisados (números = 110 jogadas, 68 drills, 50 treinos, 20 aulas).
- [ ] Nenhum anúncio promete vitórias ou resultados esportivos; nenhuma menção de afiliação com NFL/ligas.

## 7. Performance e monitoramento
- [ ] Lighthouse mobile no domínio final (meta: Performance ≥ 90, CLS < 0,1).
- [ ] Logs da Vercel sem erros nos webhooks nas primeiras vendas.
- [ ] Rotina de suporte: consulta SQL de acessos por e-mail (em `docs/SUPABASE.md`).
