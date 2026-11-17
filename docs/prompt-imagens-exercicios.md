# Prompts para gerar as imagens dos exercícios

> Arquivo gerado por `npm run docs:imagens` a partir de `content/exercicios.ts` e `content/poses-imagens.ts`. Não edite à mão: edite as poses e gere de novo.

## Como usar

1. Para cada exercício abaixo, copie o bloco de **início** e depois o de **fim** e gere no Codex (ou outro gerador). Cada bloco já é um prompt completo. Gere as duas imagens do exercício na mesma conversa para manter o mesmo manequim, a mesma câmera e a mesma luz.
2. Salve com o **nome exato do arquivo** indicado em `public/exercicios/` (ex.: `public/exercicios/hip-thrust-barra-inicio.webp`).
3. Rode `npm run imagens:manifesto` (ou só `npm run dev` / `npm run build`, que já rodam sozinhos). O app troca o placeholder pelas imagens automaticamente quando as **duas** imagens do exercício existem.
4. Confira na Biblioteca do app se o enquadramento ficou consistente entre os exercícios.

Referência visual do manequim: `public/img/mapa-base.webp` (silhueta agachando). Se o gerador aceitar imagem de referência, envie esse arquivo junto.

## Estilo comum (já incluído em cada prompt abaixo)

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).
```

## Exercícios (32 × 2 = 64 imagens)

| # | Exercício | Arquivos |
|---|---|---|
| 1 | Elevação pélvica com barra (hip thrust) | `hip-thrust-barra-inicio.webp` · `hip-thrust-barra-fim.webp` |
| 2 | Elevação pélvica no chão | `hip-thrust-chao-inicio.webp` · `hip-thrust-chao-fim.webp` |
| 3 | Elevação pélvica com mochila | `hip-thrust-mochila-inicio.webp` · `hip-thrust-mochila-fim.webp` |
| 4 | Elevação pélvica unilateral (glute bridge com uma perna) | `glute-bridge-unilateral-inicio.webp` · `glute-bridge-unilateral-fim.webp` |
| 5 | Frog pump | `frog-pump-inicio.webp` · `frog-pump-fim.webp` |
| 6 | Ponte com isometria | `ponte-isometria-inicio.webp` · `ponte-isometria-fim.webp` |
| 7 | Coice na polia | `coice-polia-inicio.webp` · `coice-polia-fim.webp` |
| 8 | Coice com elástico em quatro apoios | `coice-elastico-4-apoios-inicio.webp` · `coice-elastico-4-apoios-fim.webp` |
| 9 | Kickback em pé com elástico | `kickback-pe-elastico-inicio.webp` · `kickback-pe-elastico-fim.webp` |
| 10 | Extensão de quadril no banco 45° | `extensao-quadril-banco-45-inicio.webp` · `extensao-quadril-banco-45-fim.webp` |
| 11 | Stiff / levantamento terra romeno (RDL) | `stiff-inicio.webp` · `stiff-fim.webp` |
| 12 | Stiff unilateral | `stiff-unilateral-inicio.webp` · `stiff-unilateral-fim.webp` |
| 13 | Good morning | `good-morning-inicio.webp` · `good-morning-fim.webp` |
| 14 | Mesa flexora | `mesa-flexora-inicio.webp` · `mesa-flexora-fim.webp` |
| 15 | Flexora com toalha no chão | `flexora-toalha-inicio.webp` · `flexora-toalha-fim.webp` |
| 16 | Abdução na máquina | `abducao-maquina-inicio.webp` · `abducao-maquina-fim.webp` |
| 17 | Abdução de quadril em pé na polia | `abducao-quadril-cabo-inicio.webp` · `abducao-quadril-cabo-fim.webp` |
| 18 | Abdução com elástico sentada | `abducao-elastico-sentada-inicio.webp` · `abducao-elastico-sentada-fim.webp` |
| 19 | Abdução com elástico deitada de lado | `abducao-elastico-deitada-inicio.webp` · `abducao-elastico-deitada-fim.webp` |
| 20 | Clam shell (ostra) | `clam-shell-inicio.webp` · `clam-shell-fim.webp` |
| 21 | Caminhada lateral com elástico | `caminhada-lateral-elastico-inicio.webp` · `caminhada-lateral-elastico-fim.webp` |
| 22 | Passada lateral | `afundo-lateral-inicio.webp` · `afundo-lateral-fim.webp` |
| 23 | Agachamento búlgaro | `agachamento-bulgaro-inicio.webp` · `agachamento-bulgaro-fim.webp` |
| 24 | Agachamento sumô | `agachamento-sumo-inicio.webp` · `agachamento-sumo-fim.webp` |
| 25 | Agachamento com pausa | `agachamento-pausa-inicio.webp` · `agachamento-pausa-fim.webp` |
| 26 | Agachamento goblet | `agachamento-goblet-inicio.webp` · `agachamento-goblet-fim.webp` |
| 27 | Passada para trás (afundo reverso) | `passada-para-tras-inicio.webp` · `passada-para-tras-fim.webp` |
| 28 | Subida no banco (step-up) | `step-up-banco-inicio.webp` · `step-up-banco-fim.webp` |
| 29 | Leg press com pés altos | `leg-press-pes-altos-inicio.webp` · `leg-press-pes-altos-fim.webp` |
| 30 | Ativação de glúteo em 5 minutos | `ativacao-5-minutos-inicio.webp` · `ativacao-5-minutos-fim.webp` |
| 31 | Mobilidade de quadril 90/90 | `mobilidade-90-90-inicio.webp` · `mobilidade-90-90-fim.webp` |
| 32 | Alongamento do flexor do quadril | `alongamento-flexor-quadril-inicio.webp` · `alongamento-flexor-quadril-fim.webp` |

### 1a. Elevação pélvica com barra (hip thrust): início

**Arquivo:** `public/exercicios/hip-thrust-barra-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Elevação pélvica com barra (hip thrust). Posição INICIAL do movimento.
Pose: costas apoiadas na borda do banco na altura das escápulas, quadril baixo perto do chão, joelhos dobrados, pés no chão, barra sobre a dobra do quadril.
Equipamento: banco reto baixo e barra olímpica com protetor acolchoado sobre o quadril, anilhas cinza-escuras.
Realce verde-limão #c6f432 em: glúteos inteiros (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Apoie a parte de baixo da escápula na borda do banco e encaixe a barra (com protetor) na dobra do quadril.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 1b. Elevação pélvica com barra (hip thrust): fim

**Arquivo:** `public/exercicios/hip-thrust-barra-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Elevação pélvica com barra (hip thrust). Posição FINAL do movimento.
Pose: quadril elevado até o tronco ficar alinhado com as coxas (paralelo ao chão), joelhos a 90°, queixo levemente para dentro, barra no alto.
Equipamento: banco reto baixo e barra olímpica com protetor acolchoado sobre o quadril, anilhas cinza-escuras.
Realce verde-limão #c6f432 em: glúteos inteiros (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Apoie a parte de baixo da escápula na borda do banco e encaixe a barra (com protetor) na dobra do quadril.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 2a. Elevação pélvica no chão: início

**Arquivo:** `public/exercicios/hip-thrust-chao-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Elevação pélvica no chão. Posição INICIAL do movimento.
Pose: deitada de barriga para cima no colchonete, joelhos dobrados, pés apoiados perto do bumbum, quadril no chão, braços ao lado do corpo.
Equipamento: colchonete escuro.
Realce verde-limão #c6f432 em: glúteos inteiros (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Deite de barriga para cima, joelhos dobrados e pés apoiados perto do bumbum.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 2b. Elevação pélvica no chão: fim

**Arquivo:** `public/exercicios/hip-thrust-chao-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Elevação pélvica no chão. Posição FINAL do movimento.
Pose: quadril elevado formando uma linha reta de joelhos a ombros, braços no chão.
Equipamento: colchonete escuro.
Realce verde-limão #c6f432 em: glúteos inteiros (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Deite de barriga para cima, joelhos dobrados e pés apoiados perto do bumbum.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 3a. Elevação pélvica com mochila: início

**Arquivo:** `public/exercicios/hip-thrust-mochila-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Elevação pélvica com mochila. Posição INICIAL do movimento.
Pose: costas apoiadas na borda do sofá, quadril baixo, joelhos dobrados, pés no chão, mochila sobre o quadril.
Equipamento: sofá baixo e mochila escura cheia apoiada sobre o quadril, segurada com as mãos.
Realce verde-limão #c6f432 em: glúteos inteiros (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Apoie as costas na beira do sofá (ou cadeira encostada na parede) e coloque a mochila sobre o quadril.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 3b. Elevação pélvica com mochila: fim

**Arquivo:** `public/exercicios/hip-thrust-mochila-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Elevação pélvica com mochila. Posição FINAL do movimento.
Pose: quadril elevado com o tronco paralelo ao chão, joelhos a 90°, mochila no alto.
Equipamento: sofá baixo e mochila escura cheia apoiada sobre o quadril, segurada com as mãos.
Realce verde-limão #c6f432 em: glúteos inteiros (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Apoie as costas na beira do sofá (ou cadeira encostada na parede) e coloque a mochila sobre o quadril.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 4a. Elevação pélvica unilateral (glute bridge com uma perna): início

**Arquivo:** `public/exercicios/glute-bridge-unilateral-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Elevação pélvica unilateral (glute bridge com uma perna). Posição INICIAL do movimento.
Pose: deitada de barriga para cima, um pé apoiado perto do bumbum, a outra perna esticada no ar apontando para o teto, quadril no chão.
Equipamento: colchonete escuro.
Realce verde-limão #c6f432 em: glúteo da perna de apoio (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Deite de barriga para cima, um pé apoiado perto do bumbum e a outra perna esticada para cima ou dobrada no ar.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 4b. Elevação pélvica unilateral (glute bridge com uma perna): fim

**Arquivo:** `public/exercicios/glute-bridge-unilateral-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Elevação pélvica unilateral (glute bridge com uma perna). Posição FINAL do movimento.
Pose: quadril elevado e nivelado, apoiado em um só pé, perna livre esticada para cima.
Equipamento: colchonete escuro.
Realce verde-limão #c6f432 em: glúteo da perna de apoio (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Deite de barriga para cima, um pé apoiado perto do bumbum e a outra perna esticada para cima ou dobrada no ar.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 5a. Frog pump: início

**Arquivo:** `public/exercicios/frog-pump-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Frog pump. Posição INICIAL do movimento.
Pose: deitada de barriga para cima, solas dos pés juntas e joelhos abertos como borboleta, cotovelos apoiados, quadril no chão.
Equipamento: colchonete escuro.
Realce verde-limão #c6f432 em: glúteos inteiros (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Deite de barriga para cima e junte as solas dos pés, deixando os joelhos abrirem como uma borboleta.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 5b. Frog pump: fim

**Arquivo:** `public/exercicios/frog-pump-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Frog pump. Posição FINAL do movimento.
Pose: quadril elevado mantendo as solas dos pés juntas e os joelhos abertos.
Equipamento: colchonete escuro.
Realce verde-limão #c6f432 em: glúteos inteiros (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Deite de barriga para cima e junte as solas dos pés, deixando os joelhos abrirem como uma borboleta.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 6a. Ponte com isometria: início

**Arquivo:** `public/exercicios/ponte-isometria-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Ponte com isometria. Posição INICIAL do movimento.
Pose: deitada de barriga para cima, joelhos dobrados, pés na largura do quadril, quadril no chão, mini band acima dos joelhos.
Equipamento: colchonete escuro e mini band nos joelhos.
Realce verde-limão #c6f432 em: glúteos inteiros (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Deite de barriga para cima, joelhos dobrados e pés na largura do quadril.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 6b. Ponte com isometria: fim

**Arquivo:** `public/exercicios/ponte-isometria-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Ponte com isometria. Posição FINAL do movimento.
Pose: quadril elevado e parado em linha reta de joelhos a ombros, joelhos empurrando o elástico para fora.
Equipamento: colchonete escuro e mini band nos joelhos.
Realce verde-limão #c6f432 em: glúteos inteiros (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Deite de barriga para cima, joelhos dobrados e pés na largura do quadril.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 7a. Coice na polia: início

**Arquivo:** `public/exercicios/coice-polia-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Coice na polia. Posição INICIAL do movimento.
Pose: em pé de frente para a polia, segurando o aparelho, tronco levemente inclinado, perna de trabalho ao lado da perna de apoio.
Equipamento: aparelho de polia baixa cinza com tornozeleira presa no tornozelo.
Realce verde-limão #c6f432 em: glúteo da perna que chuta (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Prenda a tornozeleira na polia baixa e segure o aparelho com as duas mãos, tronco levemente inclinado.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 7b. Coice na polia: fim

**Arquivo:** `public/exercicios/coice-polia-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Coice na polia. Posição FINAL do movimento.
Pose: perna de trabalho estendida para trás e um pouco para cima, calcanhar empurrando, tronco estável sem arquear a lombar.
Equipamento: aparelho de polia baixa cinza com tornozeleira presa no tornozelo.
Realce verde-limão #c6f432 em: glúteo da perna que chuta (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Prenda a tornozeleira na polia baixa e segure o aparelho com as duas mãos, tronco levemente inclinado.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 8a. Coice com elástico em quatro apoios: início

**Arquivo:** `public/exercicios/coice-elastico-4-apoios-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Coice com elástico em quatro apoios. Posição INICIAL do movimento.
Pose: em quatro apoios, mãos sob os ombros, joelhos sob o quadril, joelho da perna de trabalho perto do chão.
Equipamento: colchonete escuro e elástico passando pela sola do pé, pontas presas sob as mãos.
Realce verde-limão #c6f432 em: glúteo da perna que empurra (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Fique em quatro apoios: mãos embaixo dos ombros, joelhos embaixo do quadril.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 8b. Coice com elástico em quatro apoios: fim

**Arquivo:** `public/exercicios/coice-elastico-4-apoios-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Coice com elástico em quatro apoios. Posição FINAL do movimento.
Pose: perna de trabalho empurrada para trás e para cima até a coxa alinhar com o tronco, elástico esticado, costas retas.
Equipamento: colchonete escuro e elástico passando pela sola do pé, pontas presas sob as mãos.
Realce verde-limão #c6f432 em: glúteo da perna que empurra (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Fique em quatro apoios: mãos embaixo dos ombros, joelhos embaixo do quadril.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 9a. Kickback em pé com elástico: início

**Arquivo:** `public/exercicios/kickback-pe-elastico-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Kickback em pé com elástico. Posição INICIAL do movimento.
Pose: em pé, mãos apoiadas na parede, tronco levemente inclinado, pés juntos com a mini band nos tornozelos.
Equipamento: mini band nos tornozelos e parede para apoio das mãos.
Realce verde-limão #c6f432 em: glúteo da perna que vai para trás (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Coloque a mini band nos tornozelos e apoie as mãos na parede ou no encosto de uma cadeira.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 9b. Kickback em pé com elástico: fim

**Arquivo:** `public/exercicios/kickback-pe-elastico-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Kickback em pé com elástico. Posição FINAL do movimento.
Pose: uma perna estendida para trás em diagonal contra o elástico, quadril alinhado, tronco parado.
Equipamento: mini band nos tornozelos e parede para apoio das mãos.
Realce verde-limão #c6f432 em: glúteo da perna que vai para trás (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Coloque a mini band nos tornozelos e apoie as mãos na parede ou no encosto de uma cadeira.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 10a. Extensão de quadril no banco 45°: início

**Arquivo:** `public/exercicios/extensao-quadril-banco-45-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Extensão de quadril no banco 45°. Posição INICIAL do movimento.
Pose: no banco 45°, quadril logo acima do apoio, tronco dobrado para baixo, costas levemente arredondadas.
Equipamento: banco de hiperextensão 45° cinza.
Realce verde-limão #c6f432 em: glúteos e parte de cima do posterior de coxa (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Ajuste o apoio logo abaixo da linha do quadril, para conseguir dobrar o corpo livremente.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 10b. Extensão de quadril no banco 45°: fim

**Arquivo:** `public/exercicios/extensao-quadril-banco-45-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Extensão de quadril no banco 45°. Posição FINAL do movimento.
Pose: corpo em linha reta da cabeça aos pés (sem passar da linha), glúteos contraídos.
Equipamento: banco de hiperextensão 45° cinza.
Realce verde-limão #c6f432 em: glúteos e parte de cima do posterior de coxa (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Ajuste o apoio logo abaixo da linha do quadril, para conseguir dobrar o corpo livremente.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 11a. Stiff / levantamento terra romeno (RDL): início

**Arquivo:** `public/exercicios/stiff-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Stiff / levantamento terra romeno (RDL). Posição INICIAL do movimento.
Pose: em pé, barra na frente das coxas, joelhos levemente dobrados, coluna reta.
Equipamento: barra olímpica com anilhas cinza-escuras.
Realce verde-limão #c6f432 em: posterior de coxa e glúteos (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Em pé, pés na largura do quadril, segure a barra na frente das coxas com os joelhos levemente dobrados.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 11b. Stiff / levantamento terra romeno (RDL): fim

**Arquivo:** `public/exercicios/stiff-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Stiff / levantamento terra romeno (RDL). Posição FINAL do movimento.
Pose: quadril empurrado para trás, tronco inclinado com a coluna reta, barra rente às pernas na altura das canelas.
Equipamento: barra olímpica com anilhas cinza-escuras.
Realce verde-limão #c6f432 em: posterior de coxa e glúteos (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Em pé, pés na largura do quadril, segure a barra na frente das coxas com os joelhos levemente dobrados.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 12a. Stiff unilateral: início

**Arquivo:** `public/exercicios/stiff-unilateral-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Stiff unilateral. Posição INICIAL do movimento.
Pose: em pé sobre uma perna, joelho levemente dobrado, halter ao lado da coxa.
Equipamento: halter cinza na mão oposta à perna de apoio.
Realce verde-limão #c6f432 em: posterior de coxa e glúteo da perna de apoio (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Em pé sobre uma perna, joelho de apoio levemente dobrado, peso na mão do lado oposto.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 12b. Stiff unilateral: fim

**Arquivo:** `public/exercicios/stiff-unilateral-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Stiff unilateral. Posição FINAL do movimento.
Pose: tronco inclinado à frente e perna livre estendida para trás formando uma linha (gangorra), quadril nivelado, halter perto da canela.
Equipamento: halter cinza na mão oposta à perna de apoio.
Realce verde-limão #c6f432 em: posterior de coxa e glúteo da perna de apoio (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Em pé sobre uma perna, joelho de apoio levemente dobrado, peso na mão do lado oposto.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 13a. Good morning: início

**Arquivo:** `public/exercicios/good-morning-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Good morning. Posição INICIAL do movimento.
Pose: em pé, barra nas costas, joelhos levemente dobrados, coluna reta.
Equipamento: barra apoiada no trapézio.
Realce verde-limão #c6f432 em: posterior de coxa e glúteos (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Em pé, pés na largura do quadril, barra apoiada no trapézio (ou mochila abraçada no peito).
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 13b. Good morning: fim

**Arquivo:** `public/exercicios/good-morning-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Good morning. Posição FINAL do movimento.
Pose: quadril para trás e tronco quase paralelo ao chão, coluna reta, barra nas costas.
Equipamento: barra apoiada no trapézio.
Realce verde-limão #c6f432 em: posterior de coxa e glúteos (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Em pé, pés na largura do quadril, barra apoiada no trapézio (ou mochila abraçada no peito).
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 14a. Mesa flexora: início

**Arquivo:** `public/exercicios/mesa-flexora-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Mesa flexora. Posição INICIAL do movimento.
Pose: deitada de barriga para baixo na mesa flexora, pernas estendidas, rolo acima dos calcanhares.
Equipamento: mesa flexora cinza.
Realce verde-limão #c6f432 em: posterior de coxa (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Deite de barriga para baixo com o joelho logo depois da borda do banco e o rolo acima do calcanhar.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 14b. Mesa flexora: fim

**Arquivo:** `public/exercicios/mesa-flexora-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Mesa flexora. Posição FINAL do movimento.
Pose: joelhos dobrados trazendo o rolo em direção ao bumbum, quadril colado no banco.
Equipamento: mesa flexora cinza.
Realce verde-limão #c6f432 em: posterior de coxa (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Deite de barriga para baixo com o joelho logo depois da borda do banco e o rolo acima do calcanhar.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 15a. Flexora com toalha no chão: início

**Arquivo:** `public/exercicios/flexora-toalha-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Flexora com toalha no chão. Posição INICIAL do movimento.
Pose: deitada de barriga para cima, quadril elevado, pernas quase esticadas com os calcanhares sobre a toalha.
Equipamento: toalha sob os calcanhares e piso liso.
Realce verde-limão #c6f432 em: posterior de coxa (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Deite de barriga para cima com os calcanhares sobre uma toalha no piso liso.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 15b. Flexora com toalha no chão: fim

**Arquivo:** `public/exercicios/flexora-toalha-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Flexora com toalha no chão. Posição FINAL do movimento.
Pose: quadril ainda elevado, calcanhares puxados com a toalha até perto do bumbum, joelhos dobrados.
Equipamento: toalha sob os calcanhares e piso liso.
Realce verde-limão #c6f432 em: posterior de coxa (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Deite de barriga para cima com os calcanhares sobre uma toalha no piso liso.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 16a. Abdução na máquina: início

**Arquivo:** `public/exercicios/abducao-maquina-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Abdução na máquina. Posição INICIAL do movimento.
Pose: sentada na cadeira abdutora, tronco levemente inclinado à frente, pernas fechadas contra as almofadas.
Equipamento: cadeira abdutora cinza.
Realce verde-limão #c6f432 em: glúteo médio (lateral do quadril) (realce mais suave, músculo alongado).
Vista frontal levemente em 3/4 (este movimento acontece para o lado e não aparece de perfil).
Técnica correta: Sente com as costas no encosto e as pernas apoiadas nas almofadas.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 16b. Abdução na máquina: fim

**Arquivo:** `public/exercicios/abducao-maquina-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Abdução na máquina. Posição FINAL do movimento.
Pose: pernas abertas ao máximo empurrando as almofadas para fora.
Equipamento: cadeira abdutora cinza.
Realce verde-limão #c6f432 em: glúteo médio (lateral do quadril) (realce mais intenso, músculo contraído).
Vista frontal levemente em 3/4 (este movimento acontece para o lado e não aparece de perfil).
Técnica correta: Sente com as costas no encosto e as pernas apoiadas nas almofadas.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 17a. Abdução de quadril em pé na polia: início

**Arquivo:** `public/exercicios/abducao-quadril-cabo-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Abdução de quadril em pé na polia. Posição INICIAL do movimento.
Pose: em pé de lado para a polia, mão apoiada no aparelho, perna de trabalho cruzada levemente à frente da perna de apoio.
Equipamento: polia baixa com tornozeleira.
Realce verde-limão #c6f432 em: glúteo médio da perna que se move (realce mais suave, músculo alongado).
Vista frontal levemente em 3/4 (este movimento acontece para o lado e não aparece de perfil).
Técnica correta: Fique de lado para a polia, com a tornozeleira na perna mais distante do aparelho.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 17b. Abdução de quadril em pé na polia: fim

**Arquivo:** `public/exercicios/abducao-quadril-cabo-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Abdução de quadril em pé na polia. Posição FINAL do movimento.
Pose: perna de trabalho levada para o lado e um pouco para trás, tronco reto.
Equipamento: polia baixa com tornozeleira.
Realce verde-limão #c6f432 em: glúteo médio da perna que se move (realce mais intenso, músculo contraído).
Vista frontal levemente em 3/4 (este movimento acontece para o lado e não aparece de perfil).
Técnica correta: Fique de lado para a polia, com a tornozeleira na perna mais distante do aparelho.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 18a. Abdução com elástico sentada: início

**Arquivo:** `public/exercicios/abducao-elastico-sentada-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Abdução com elástico sentada. Posição INICIAL do movimento.
Pose: sentada na ponta da cadeira, tronco levemente inclinado, pés e joelhos juntos com o elástico acima dos joelhos.
Equipamento: cadeira simples e mini band acima dos joelhos.
Realce verde-limão #c6f432 em: glúteo médio (lateral do quadril) (realce mais suave, músculo alongado).
Vista frontal levemente em 3/4 (este movimento acontece para o lado e não aparece de perfil).
Técnica correta: Sente na ponta da cadeira com a mini band logo acima dos joelhos e os pés juntos no chão.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 18b. Abdução com elástico sentada: fim

**Arquivo:** `public/exercicios/abducao-elastico-sentada-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Abdução com elástico sentada. Posição FINAL do movimento.
Pose: joelhos abertos ao máximo contra o elástico, pés juntos no chão.
Equipamento: cadeira simples e mini band acima dos joelhos.
Realce verde-limão #c6f432 em: glúteo médio (lateral do quadril) (realce mais intenso, músculo contraído).
Vista frontal levemente em 3/4 (este movimento acontece para o lado e não aparece de perfil).
Técnica correta: Sente na ponta da cadeira com a mini band logo acima dos joelhos e os pés juntos no chão.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 19a. Abdução com elástico deitada de lado: início

**Arquivo:** `public/exercicios/abducao-elastico-deitada-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Abdução com elástico deitada de lado. Posição INICIAL do movimento.
Pose: deitada de lado, pernas esticadas uma sobre a outra, cabeça apoiada no braço.
Equipamento: colchonete escuro e mini band nos tornozelos.
Realce verde-limão #c6f432 em: glúteo médio da perna de cima (realce mais suave, músculo alongado).
Vista frontal levemente em 3/4 (este movimento acontece para o lado e não aparece de perfil).
Técnica correta: Deite de lado com as pernas esticadas, uma sobre a outra, e o elástico nos tornozelos ou acima dos joelhos.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 19b. Abdução com elástico deitada de lado: fim

**Arquivo:** `public/exercicios/abducao-elastico-deitada-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Abdução com elástico deitada de lado. Posição FINAL do movimento.
Pose: perna de cima elevada um pouco acima da altura do quadril, pé apontando para a frente.
Equipamento: colchonete escuro e mini band nos tornozelos.
Realce verde-limão #c6f432 em: glúteo médio da perna de cima (realce mais intenso, músculo contraído).
Vista frontal levemente em 3/4 (este movimento acontece para o lado e não aparece de perfil).
Técnica correta: Deite de lado com as pernas esticadas, uma sobre a outra, e o elástico nos tornozelos ou acima dos joelhos.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 20a. Clam shell (ostra): início

**Arquivo:** `public/exercicios/clam-shell-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Clam shell (ostra). Posição INICIAL do movimento.
Pose: deitada de lado, joelhos dobrados a 45°, pés e joelhos juntos.
Equipamento: colchonete escuro e mini band acima dos joelhos.
Realce verde-limão #c6f432 em: glúteo médio e rotadores (realce mais suave, músculo alongado).
Vista frontal levemente em 3/4 (este movimento acontece para o lado e não aparece de perfil).
Técnica correta: Deite de lado, joelhos dobrados a 45° e calcanhares alinhados com o bumbum.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 20b. Clam shell (ostra): fim

**Arquivo:** `public/exercicios/clam-shell-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Clam shell (ostra). Posição FINAL do movimento.
Pose: joelho de cima aberto como uma ostra, pés ainda juntos, quadril empilhado.
Equipamento: colchonete escuro e mini band acima dos joelhos.
Realce verde-limão #c6f432 em: glúteo médio e rotadores (realce mais intenso, músculo contraído).
Vista frontal levemente em 3/4 (este movimento acontece para o lado e não aparece de perfil).
Técnica correta: Deite de lado, joelhos dobrados a 45° e calcanhares alinhados com o bumbum.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 21a. Caminhada lateral com elástico: início

**Arquivo:** `public/exercicios/caminhada-lateral-elastico-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Caminhada lateral com elástico. Posição INICIAL do movimento.
Pose: em meio agachamento, pés na largura do quadril, elástico esticado acima dos joelhos.
Equipamento: mini band acima dos joelhos.
Realce verde-limão #c6f432 em: glúteo médio dos dois lados (realce mais suave, músculo alongado).
Vista frontal levemente em 3/4 (este movimento acontece para o lado e não aparece de perfil).
Técnica correta: Coloque o elástico, afaste os pés na largura do quadril e fique em meio agachamento.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 21b. Caminhada lateral com elástico: fim

**Arquivo:** `public/exercicios/caminhada-lateral-elastico-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Caminhada lateral com elástico. Posição FINAL do movimento.
Pose: ainda em meio agachamento, um passo largo para o lado, pés afastados além da largura dos ombros.
Equipamento: mini band acima dos joelhos.
Realce verde-limão #c6f432 em: glúteo médio dos dois lados (realce mais intenso, músculo contraído).
Vista frontal levemente em 3/4 (este movimento acontece para o lado e não aparece de perfil).
Técnica correta: Coloque o elástico, afaste os pés na largura do quadril e fique em meio agachamento.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 22a. Passada lateral: início

**Arquivo:** `public/exercicios/afundo-lateral-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Passada lateral. Posição INICIAL do movimento.
Pose: em pé, pés juntos, halter junto ao peito.
Equipamento: halter segurado junto ao peito.
Realce verde-limão #c6f432 em: glúteo da perna dobrada (realce mais suave, músculo alongado).
Vista frontal levemente em 3/4 (este movimento acontece para o lado e não aparece de perfil).
Técnica correta: Em pé, pés juntos, segure o peso na frente do peito (opcional).
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 22b. Passada lateral: fim

**Arquivo:** `public/exercicios/afundo-lateral-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Passada lateral. Posição FINAL do movimento.
Pose: passo largo para o lado, quadril sentado para trás sobre a perna dobrada, outra perna esticada, pés apontando para a frente.
Equipamento: halter segurado junto ao peito.
Realce verde-limão #c6f432 em: glúteo da perna dobrada (realce mais intenso, músculo contraído).
Vista frontal levemente em 3/4 (este movimento acontece para o lado e não aparece de perfil).
Técnica correta: Em pé, pés juntos, segure o peso na frente do peito (opcional).
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 23a. Agachamento búlgaro: início

**Arquivo:** `public/exercicios/agachamento-bulgaro-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Agachamento búlgaro. Posição INICIAL do movimento.
Pose: em pé, peito do pé de trás apoiado no banco, perna da frente à frente com passo longo, tronco levemente inclinado.
Equipamento: banco reto atrás e halteres nas mãos.
Realce verde-limão #c6f432 em: glúteo da perna da frente (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: De costas para o banco, apoie o peito do pé de trás nele e dê um passo largo à frente com a outra perna.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 23b. Agachamento búlgaro: fim

**Arquivo:** `public/exercicios/agachamento-bulgaro-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Agachamento búlgaro. Posição FINAL do movimento.
Pose: agachada com a coxa da frente quase paralela ao chão, joelho de trás perto do chão.
Equipamento: banco reto atrás e halteres nas mãos.
Realce verde-limão #c6f432 em: glúteo da perna da frente (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: De costas para o banco, apoie o peito do pé de trás nele e dê um passo largo à frente com a outra perna.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 24a. Agachamento sumô: início

**Arquivo:** `public/exercicios/agachamento-sumo-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Agachamento sumô. Posição INICIAL do movimento.
Pose: em pé, pés bem afastados com as pontas para fora, kettlebell pendurado entre as pernas.
Equipamento: kettlebell segurado com os braços esticados entre as pernas.
Realce verde-limão #c6f432 em: glúteos e parte interna das coxas (realce mais suave, músculo alongado).
Vista frontal levemente em 3/4 (este movimento acontece para o lado e não aparece de perfil).
Técnica correta: Pés bem afastados (mais que a largura dos ombros) e pontas viradas para fora.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 24b. Agachamento sumô: fim

**Arquivo:** `public/exercicios/agachamento-sumo-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Agachamento sumô. Posição FINAL do movimento.
Pose: agachada com o quadril baixo, joelhos apontando na direção dos pés, peito aberto.
Equipamento: kettlebell segurado com os braços esticados entre as pernas.
Realce verde-limão #c6f432 em: glúteos e parte interna das coxas (realce mais intenso, músculo contraído).
Vista frontal levemente em 3/4 (este movimento acontece para o lado e não aparece de perfil).
Técnica correta: Pés bem afastados (mais que a largura dos ombros) e pontas viradas para fora.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 25a. Agachamento com pausa: início

**Arquivo:** `public/exercicios/agachamento-pausa-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Agachamento com pausa. Posição INICIAL do movimento.
Pose: em pé, pés na largura dos ombros, braços estendidos à frente.
Equipamento: nenhum (peso do corpo), braços estendidos à frente.
Realce verde-limão #c6f432 em: glúteos e coxas (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Pés na largura dos ombros, pontas levemente para fora.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 25b. Agachamento com pausa: fim

**Arquivo:** `public/exercicios/agachamento-pausa-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Agachamento com pausa. Posição FINAL do movimento.
Pose: agachamento profundo e parado, quadril para trás e para baixo, coluna reta, braços à frente.
Equipamento: nenhum (peso do corpo), braços estendidos à frente.
Realce verde-limão #c6f432 em: glúteos e coxas (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Pés na largura dos ombros, pontas levemente para fora.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 26a. Agachamento goblet: início

**Arquivo:** `public/exercicios/agachamento-goblet-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Agachamento goblet. Posição INICIAL do movimento.
Pose: em pé, halter junto ao peito, pés na largura dos ombros.
Equipamento: halter segurado junto ao peito.
Realce verde-limão #c6f432 em: coxas (frente) e glúteos (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Segure o peso junto ao peito com os cotovelos apontando para baixo.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 26b. Agachamento goblet: fim

**Arquivo:** `public/exercicios/agachamento-goblet-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Agachamento goblet. Posição FINAL do movimento.
Pose: agachada com os cotovelos passando por dentro dos joelhos, peito aberto, calcanhares no chão.
Equipamento: halter segurado junto ao peito.
Realce verde-limão #c6f432 em: coxas (frente) e glúteos (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Segure o peso junto ao peito com os cotovelos apontando para baixo.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 27a. Passada para trás (afundo reverso): início

**Arquivo:** `public/exercicios/passada-para-tras-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Passada para trás (afundo reverso). Posição INICIAL do movimento.
Pose: em pé, pés na largura do quadril, halteres ao lado do corpo.
Equipamento: halteres nas mãos ao lado do corpo.
Realce verde-limão #c6f432 em: glúteo da perna da frente (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Em pé, pés na largura do quadril.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 27b. Passada para trás (afundo reverso): fim

**Arquivo:** `public/exercicios/passada-para-tras-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Passada para trás (afundo reverso). Posição FINAL do movimento.
Pose: passo grande para trás, joelho de trás quase tocando o chão, coxa da frente paralela ao chão.
Equipamento: halteres nas mãos ao lado do corpo.
Realce verde-limão #c6f432 em: glúteo da perna da frente (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Em pé, pés na largura do quadril.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 28a. Subida no banco (step-up): início

**Arquivo:** `public/exercicios/step-up-banco-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Subida no banco (step-up). Posição INICIAL do movimento.
Pose: um pé inteiro apoiado em cima do banco, outro pé no chão, tronco levemente inclinado.
Equipamento: banco reto ou caixote.
Realce verde-limão #c6f432 em: glúteo da perna que está no banco (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Apoie o pé inteiro em cima do banco, com o joelho na altura do quadril ou um pouco abaixo.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 28b. Subida no banco (step-up): fim

**Arquivo:** `public/exercicios/step-up-banco-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Subida no banco (step-up). Posição FINAL do movimento.
Pose: em pé em cima do banco sobre a perna de trabalho, outra perna dobrada no ar.
Equipamento: banco reto ou caixote.
Realce verde-limão #c6f432 em: glúteo da perna que está no banco (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Apoie o pé inteiro em cima do banco, com o joelho na altura do quadril ou um pouco abaixo.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 29a. Leg press com pés altos: início

**Arquivo:** `public/exercicios/leg-press-pes-altos-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Leg press com pés altos. Posição INICIAL do movimento.
Pose: sentada no leg press, lombar colada, pés na parte alta da plataforma, pernas quase estendidas.
Equipamento: leg press 45° cinza.
Realce verde-limão #c6f432 em: glúteos e coxas (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Sente com a lombar colada no encosto e apoie os pés na parte de cima da plataforma, na largura dos ombros.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 29b. Leg press com pés altos: fim

**Arquivo:** `public/exercicios/leg-press-pes-altos-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Leg press com pés altos. Posição FINAL do movimento.
Pose: plataforma descida, joelhos dobrados em direção ao peito, bumbum colado no banco.
Equipamento: leg press 45° cinza.
Realce verde-limão #c6f432 em: glúteos e coxas (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Sente com a lombar colada no encosto e apoie os pés na parte de cima da plataforma, na largura dos ombros.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 30a. Ativação de glúteo em 5 minutos: início

**Arquivo:** `public/exercicios/ativacao-5-minutos-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Ativação de glúteo em 5 minutos. Posição INICIAL do movimento.
Pose: deitada de barriga para cima, joelhos dobrados, pés no chão, mini band nos joelhos (início da ponte de ativação).
Equipamento: colchonete escuro e mini band.
Realce verde-limão #c6f432 em: glúteos inteiros (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: 1 minuto de elevação pélvica no chão, apertando o glúteo 2 segundos no topo.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 30b. Ativação de glúteo em 5 minutos: fim

**Arquivo:** `public/exercicios/ativacao-5-minutos-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Ativação de glúteo em 5 minutos. Posição FINAL do movimento.
Pose: quadril elevado na ponte, joelhos empurrando o elástico para fora.
Equipamento: colchonete escuro e mini band.
Realce verde-limão #c6f432 em: glúteos inteiros (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: 1 minuto de elevação pélvica no chão, apertando o glúteo 2 segundos no topo.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 31a. Mobilidade de quadril 90/90: início

**Arquivo:** `public/exercicios/mobilidade-90-90-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Mobilidade de quadril 90/90. Posição INICIAL do movimento.
Pose: sentada no chão, uma perna dobrada à frente a 90° e a outra dobrada ao lado a 90°, tronco reto.
Equipamento: colchonete escuro.
Realce verde-limão #c6f432 em: glúteo da perna da frente (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Sente no chão com uma perna dobrada à frente (joelho a 90°) e a outra dobrada ao lado (também a 90°).
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 31b. Mobilidade de quadril 90/90: fim

**Arquivo:** `public/exercicios/mobilidade-90-90-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Mobilidade de quadril 90/90. Posição FINAL do movimento.
Pose: mesma posição com as pernas trocadas para o outro lado, tronco inclinado sobre a perna da frente.
Equipamento: colchonete escuro.
Realce verde-limão #c6f432 em: glúteo da perna da frente (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Sente no chão com uma perna dobrada à frente (joelho a 90°) e a outra dobrada ao lado (também a 90°).
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 32a. Alongamento do flexor do quadril: início

**Arquivo:** `public/exercicios/alongamento-flexor-quadril-inicio.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Alongamento do flexor do quadril. Posição INICIAL do movimento.
Pose: ajoelhada com uma perna à frente (pé no chão, joelho a 90°) e o joelho de trás apoiado, tronco reto.
Equipamento: colchonete escuro.
Realce verde-limão #c6f432 em: frente do quadril da perna de trás e glúteo dessa mesma perna (realce mais suave, músculo alongado).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Ajoelhe com uma perna à frente (pé no chão) e o joelho de trás apoiado numa almofada.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```

### 32b. Alongamento do flexor do quadril: fim

**Arquivo:** `public/exercicios/alongamento-flexor-quadril-fim.webp`

```text
Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).

Exercício: Alongamento do flexor do quadril. Posição FINAL do movimento.
Pose: corpo levemente projetado à frente, quadril encaixado, glúteo da perna de trás contraído.
Equipamento: colchonete escuro.
Realce verde-limão #c6f432 em: frente do quadril da perna de trás e glúteo dessa mesma perna (realce mais intenso, músculo contraído).
Vista lateral (perfil esquerdo do manequim voltado para a câmera).
Técnica correta: Ajoelhe com uma perna à frente (pé no chão) e o joelho de trás apoiado numa almofada.
Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.
```
