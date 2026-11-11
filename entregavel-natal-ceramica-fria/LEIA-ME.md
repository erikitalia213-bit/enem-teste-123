# Entregável · Natal em Cerâmica Fria 2026

O que a compradora recebe depois de pagar a landing `/natalemceramicafria`.

## O que tem na pasta `entregavel/`

| Arquivo | O que é | Páginas | Quem recebe |
|---|---|---|---|
| `01-Natal-em-Ceramica-Fria-2026-50-Enfeites.pdf` | Guia principal: massa caseira, ferramentas, 8 técnicas, cores, 50 enfeites com passo a passo, acabamentos e soluções | 67 | Kit Completo |
| `Bonus-01-Kit-de-Moldes-Natalinos.pdf` | Moldes dos 50 enfeites em tamanho real, com régua de conferência | 17 | Kit Completo |
| `Bonus-02-Guia-de-Secagem-e-Acabamento.pdf` | Secagem por espessura, rachaduras, lixa, pintura, verniz, dourado, checklist | 7 | Kit Completo |
| `Bonus-03-Ceramica-Fria-para-Vender-no-Natal.pdf` | Cálculo de preço, tabela, kits, embalagem, fotos, Instagram, mensagens de WhatsApp, calendário e ficha de encomenda | 9 | Kit Completo |
| `Bonus-04-15-Enfeites-com-as-Criancas.pdf` | 15 enfeites com a parte do adulto indicada e certificado para imprimir | 8 | Kit Completo |
| `Bonus-05-Vila-Natalina-Iluminada.pdf` | 7 casinhas, igreja com torre e pinheiros, com moldes de todas as placas | 21 | Kit Completo |
| `Bonus-06-Lista-Completa-de-Materiais.pdf` | O que comprar, onde e pelo que trocar, receita da massa e checklist | 5 | Kit Completo |
| `Kit-Basico-20-Enfeites-para-Comecar.pdf` | 20 enfeites + intro + moldes no final | 45 | Kit Básico |
| `index.html` | Área de acesso do Kit Completo (links para os 7 PDFs) | | Kit Completo |
| `index-kit-basico.html` | Área de acesso do Kit Básico | | Kit Básico |

Tudo bate com o que a landing promete: os 15 enfeites das fotos da seção “Peças que você pode fazer” estão no guia com o mesmo nome (Estrela com renda, Bola em relevo, Floco de neve vazado, Anjinho, Árvore texturizada, Biscoito de gengibre, Gorro de Papai Noel, Enfeite com nome, Casinha nórdica, Guirlanda de estrelas, Igrejinha com torre, Porta-vela estrela, Presépio minimalista, Vila natalina e Centro de mesa), e os 6 bônus têm os mesmos títulos e descrições.

## Como entregar

**Opção A: Google Drive (a mais rápida)**
1. Crie duas pastas no Drive: “Natal Cerâmica Fria · Kit Completo” (os 7 PDFs) e “Natal Cerâmica Fria · Kit Básico” (só o PDF do Kit Básico).
2. Em cada pasta: Compartilhar → “Qualquer pessoa com o link” → Leitor.
3. Coloque o link de cada pasta como entrega do produto correspondente no ggcheckout (página de obrigado e e-mail de acesso).

**Opção B: página de acesso própria**
1. Suba a pasta `entregavel/` inteira na mesma hospedagem da landing (por exemplo em `/natalemceramicafria/acesso-XXXX/`, com um nome difícil de adivinhar).
2. Use `index.html` como link do Kit Completo e `index-kit-basico.html` como link do Kit Básico.
3. As duas páginas têm `noindex`, para não aparecerem no Google.

## E-mail de acesso (pronto para colar no ggcheckout)

> **Assunto:** Seu acesso chegou! Natal em Cerâmica Fria 2026 🎄
>
> Oi, {nome}!
>
> Que alegria ter você com a gente! Seu pagamento foi confirmado e o seu material já está liberado.
>
> 👉 **Acesse aqui:** {link}
>
> **Por onde começar:** abra o guia principal, leia os capítulos 1 a 5 (são rápidos) e faça a Estrela com renda. Em 15 minutos você já tem o primeiro enfeite secando.
>
> **Para imprimir os moldes:** escolha “Tamanho real” ou “100%” na impressora e confira o quadrado de 1 cm no topo da folha.
>
> Você tem 7 dias de garantia. Qualquer dúvida, é só responder este e-mail.
>
> Feliz Natal e boas criações!
> Equipe Natal em Cerâmica Fria

## Como editar e gerar de novo

Os textos ficam em arquivos simples dentro de `src/`:

- `src/enfeites.js`: os 50 enfeites (nome, materiais, passos, dica, variação; `basico: true` coloca a peça no Kit Básico)
- `src/bonus.js`: crianças, casinhas da vila e lista de materiais
- `src/bonus-pdfs.js`: textos dos bônus 2 a 6
- `src/guia.js`: capítulos de introdução e encerramento do guia
- `src/shapes.js`: ilustrações e moldes

Depois de editar, gere os PDFs de novo (precisa de Node e Playwright):

```bash
node build.js
```

Ou só um deles: `node build.js guia`, `moldes`, `secagem`, `vender`, `criancas`, `vila`, `materiais` ou `basico`.

## Observações

- As ilustrações são desenhos vetoriais simples (não são fotos). Se quiser, troque pelas fotos que você tem dos enfeites, que ficam ainda mais vendedoras.
- A tabela de preços do Bônus 3 é uma referência de mercado. Revise para a sua região antes de vender.
