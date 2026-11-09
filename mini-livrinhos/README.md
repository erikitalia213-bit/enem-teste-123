# Mini Livrinhos — landing page

Página de vendas estática em um único arquivo (`index.html`), sem build. Para ver, abra o arquivo no navegador ou publique a pasta em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages).

## Seções (em ordem)

1. Hero verde com neve, luzes de Natal, caixa com 6 temas, CTA e selos de confiança
2. Carrossel infinito de temas + faixa listrada + 3 benefícios
3. Catálogo com abas (Todos, Natal, Princesas, Super-heróis, Animais, Bíblicos), chips e banner "+600 TEMAS"
4. Bônus de Natal (Natal Mágico / Natal com Jesus)
5. Como funciona em 3 passos
6. Transformação (antes/depois)
7. Ideias para usar
8. Para quem é
9. Bônus do Kit Completo
10. Oferta com 2 kits (`#oferta`, `#pacote-basico`, `#pacote-completo`) e contagem regressiva
11. Avaliações (carrossel de prints)
12. FAQ em acordeão
13. Garantia de 7 dias
14. CTA final + rodapé + barra fixa com contagem regressiva

## O que editar (bloco `CONFIG` no fim do `index.html`)

| Campo | Para quê |
|---|---|
| `brand` | Nome no rodapé |
| `deadline` | Data final da oferta. Os dias restantes são calculados sozinhos |
| `prices` | Preço "de" e "por" de cada kit e dos bônus. O % de desconto é calculado |
| `checkout.basic` / `checkout.full` | **Seus links de pagamento** (estão como `#`) |
| `facebookPixelId` | Opcional. Dispara PageView e InitiateCheckout |
| `rating` | Nota e número de avaliações. Use só números reais; vazio = não aparece |
| `reviews` | Caminhos dos prints reais de clientes (ex.: `img/print-1.jpg`) |

Os temas ficam na lista `THEMES`. Para trocar a ilustração de um tema por uma imagem sua, adicione `img`: `{ name: "Dinossauros", img: "img/dinos.jpg", ... }`.

As perguntas do FAQ ficam na lista `FAQ`.

## Observações

- As ilustrações são SVGs originais. Não há imagens, textos, prints nem links do site usado como referência.
- Não use personagens licenciados (Disney, Marvel, Barbie, Patrulha Canina, Pokémon etc.) sem licença. Vender páginas de colorir com eles gera risco de denúncia e bloqueio na plataforma de pagamento.
