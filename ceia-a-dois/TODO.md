# Pendências para publicar a Ceia a Dois

Tudo abaixo depende de dados reais do responsável pelo produto. Campos em `client/src/config/oferta.ts`.

- [ ] Criar o produto na plataforma de pagamento e colar o link em `checkoutUrl` (o botão da oferta só é liberado com ele).
- [ ] Confirmar o preço final (`precoCentavos`; hoje R$ 10,00 como teste).
- [ ] Confirmar canal e prazo de entrega com a plataforma e preencher `entrega`.
- [ ] Preencher `suporte` com um e-mail ou WhatsApp real.
- [ ] Definir a política de garantia na plataforma e, só então, preencher `garantia.dias`.
- [ ] (Opcional) Preencher `responsavel` para o rodapé.
- [ ] Comparar os 4 cardápios da página (array `CARDAPIOS` em `client/src/pages/Home.tsx`) com o PDF final e ajustar nomes/fotos se houver diferença.
- [ ] Trocar o mockup `06-previa-do-guia.webp` por uma página real do PDF quando disponível (e, se quiser, incluir uma amostra no lugar dos antigos depoimentos).
- [ ] Definir o domínio e ativar `og:image` com URL absoluta em `client/index.html`.
- [ ] (Opcional) Instalar o pixel oficial da sua conta de anúncios em `client/index.html`.
