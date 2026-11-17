# 5 Domingos com Jesus

Landing page do kit digital em PDF para pais e responsáveis montarem um presépio de papel com crianças de 5 a 9 anos, em cinco encontros antes do Natal.

Projeto adaptado da página de referência (React 19 + Vite + Express/tRPC), mantendo a mesma tecnologia e o fluxo responsivo.

## Comandos

- `pnpm install`: instala as dependências.
- `pnpm dev`: servidor completo (Express + Vite) na porta `PORT` (padrão 3000).
- `pnpm dev:static`: só o front-end via Vite.
- `pnpm build` / `pnpm start`: gera e serve `dist/`.
- `pnpm build:static`: gera só o site estático em `dist/public/`.
- `pnpm check` / `pnpm test`: tipos e testes.

## Onde editar

| O quê | Arquivo |
|---|---|
| Preço, checkout, PDF da amostra, entrega, suporte e selo de prévia | `shared/offer.ts` (ponto único) |
| Textos dos encontros, passos, itens do kit e mapa de imagens | `client/src/content/landing.ts` |
| Estrutura da página | `client/src/pages/Home.tsx` |
| Cores, tipografia e layout | `client/src/index.css` |
| Título, descrição e fontes | `client/index.html` |
| Imagens | `client/public/assets/` |

### Regras da página (definidas em `shared/offer.ts`)

- O preço só aparece com `price.confirmed: true`. R$ 29,90 (`amountCents: 2990`) é uma hipótese.
- O botão de compra só aparece com preço confirmado **e** `checkout.url` em https. Até lá, a oferta mostra "As vendas abrem em breve".
- O download da amostra fica desativado, com aviso visível, até `sample.pdfUrl` ser preenchido. Para servir o PDF pelo próprio site, coloque-o em `client/public/downloads/` e use `"/downloads/nome.pdf"`.
- A resposta "Como vou receber os arquivos?" usa `deliveryNote`, a ser escrita conforme a integração de pagamento real.
- O suporte aparece no FAQ e no rodapé quando `support.email` ou `support.whatsapp` estiverem preenchidos.
- Com `imagesAreIllustrative: true`, toda foto recebe o selo "Prévia ilustrativa". Troque para `false` quando as fotos forem do material final.

## Pendências de configuração

1. Confirmar o preço.
2. Informar a URL do checkout da nova oferta.
3. Fornecer o PDF final do primeiro domingo (amostra).
4. Descrever a forma de entrega dos arquivos conforme a integração.
5. Definir o e-mail e/ou WhatsApp de suporte.
6. Substituir as prévias ilustrativas por fotos do material final (mantendo os nomes de arquivo, ou atualizando `landing.ts`).
