# Narração para ElevenLabs: Meu Natal ARMY

## Personagem "Apresentadora ARMY" (cardigan lilás, microfone e caderno)

Fala de fã para fã, com energia de apresentadora. Voz feminina jovem, animada e brasileira.

### A, identidade ("seu Natal tá incompleto")
```
Atenção, ARMY! <break time="0.3s"/> Se o seu Natal não tiver isso, tá incompleto. <break time="0.4s"/> Olha só: oitenta desenhos pra colorir, <break time="0.2s"/> mil e quinhentos photocards pra imprimir, <break time="0.2s"/> calendário três dê de dois mil e vinte e sete <break time="0.2s"/> e ainda diário de bônus. <break time="0.4s"/> Tudo por dezenove e noventa, e chega na hora, sem frete. <break time="0.2s"/> Toca em Saiba mais e me agradece depois!
```

### B, último minuto ("não chega a tempo? esquece")
```
ARMY, alerta de Natal! <break time="0.3s"/> Presente que não chega a tempo? Esquece. <break time="0.4s"/> Esse kit é digital: você compra, baixa e imprime em casa no mesmo dia. <break time="0.3s"/> São oitenta desenhos pra colorir, mil e quinhentos photocards e sete calendários três dê. <break time="0.4s"/> Dezenove e noventa, pagamento único. Toca em Saiba mais!
```

### C, presente para a amiga ("missão")
```
Tô aqui com uma missão: achar o presente perfeito pra sua amiga ARMY. <break time="0.4s"/> E achei! <break time="0.3s"/> Um kit de Natal pra imprimir, com desenhos pra colorir, photocards, diário e calendário de dois mil e vinte e sete. <break time="0.4s"/> Custa dezenove e noventa. <break time="0.2s"/> Manda esse vídeo pra ela, ou compra um pra cada uma! Toca em Saiba mais.
```

---

## Versão 2: hook para pais (sua filha é ARMY)

Fala direto com mãe/pai que procura presente de Natal para a filha fã de BTS.
Cada texto tem uns 38 palavras, que cabem em ~15s numa fala animada.
Se a voz falar "BTS" estranho, escreva **"Bí Tí És"**; para "ARMY", **"Ármi"**.

### Vídeo 1, "Folheie o kit"
```
Se sua filha é ARMY, para tudo e olha isso. <break time="0.3s"/> Um kit de Natal pra imprimir em casa: <break time="0.2s"/> oitenta desenhos pra colorir, diário de músicas, memórias de Natal <break time="0.2s"/> e calendário três dê. <break time="0.3s"/> Só dezenove e noventa. Toca em Saiba mais!
```

### Vídeo 2, "Tudo isso por R$ 19,90"
```
Sua filha ama BTS? <break time="0.2s"/> Esse presente custa menos que um lanche. <break time="0.3s"/> São oitenta desenhos pra colorir, <break time="0.2s"/> mil e quinhentos photocards, <break time="0.2s"/> sete calendários três dê <break time="0.2s"/> e ainda três diários de bônus. <break time="0.3s"/> Kit completo por dezenove e noventa. Garanta o dela!
```

### Vídeo 3, "Checklist do Natal ARMY"
```
Mãe de ARMY, salva esse vídeo. <break time="0.3s"/> Nesse Natal ela vai colorir ouvindo as músicas favoritas, <break time="0.2s"/> escrever as memórias, <break time="0.2s"/> colecionar photocards <break time="0.2s"/> e montar o calendário de dois mil e vinte e sete. <break time="0.3s"/> Tudo num kit só, por dezenove e noventa. Toca em Saiba mais!
```

### Vídeo 3 (versão final para gravar)
Segue as 5 linhas do checklist na tela, na mesma ordem.
```
Mãe de ARMY, salva esse vídeo. <break time="0.4s"/> Esse é o checklist de Natal que a sua filha vai amar: <break time="0.3s"/> colorir ouvindo as músicas favoritas… <break time="0.3s"/> escrever as memórias de Natal… <break time="0.3s"/> imprimir e colecionar photocards… <break time="0.3s"/> montar o calendário de dois mil e vinte e sete… <break time="0.3s"/> e presentear a amiga ARMY. <break time="0.4s"/> Tudo num kit só, por dezenove e noventa. Toca em Saiba mais!
```

### Vídeo 3, variação "manda pra amiga" (fala com a própria fã, feita para compartilhar)
```
Manda esse vídeo pra sua amiga ARMY. <break time="0.4s"/> Esse é o nosso checklist de Natal: <break time="0.3s"/> colorir ouvindo BTS no repeat… <break time="0.3s"/> escrever as memórias desse ano… <break time="0.3s"/> imprimir e trocar photocards… <break time="0.3s"/> montar o calendário de dois mil e vinte e sete… <break time="0.3s"/> e dar um de presente pra sua melhor amiga. <break time="0.4s"/> Tudo num kit só, por dezenove e noventa. Toca em Saiba mais!
```

### Hooks alternativos para testar (troque só a primeira frase)
1. Se sua filha é ARMY, esse é o presente de Natal que ela vai amar.
2. Não sabe o que dar pra sua filha que ama BTS? Eu resolvo.
3. Sua filha vive ouvindo BTS? Então você precisa ver isso.
4. Mãe, pai: o presente mais barato que sua filha ARMY vai amar.
5. Esse Natal, dá pra sua filha ARMY um presente que ela vai lembrar.
6. Sua filha pediu presente do BTS? Olha esse por dezenove e noventa.

---

## Versão 1: fala para a própria fã

Cada vídeo tem 15s. Os textos foram escritos para caber no tempo de cada cena,
numa fala animada um pouco acima do normal (velocidade 1.05 a 1.1).

Os números já estão por extenso (R$ 19,90 → "dezenove e noventa",
2027 → "dois mil e vinte e sete", 3D → "três dê") para a voz não errar.
Os `<break time="..."/>` são pausas que o ElevenLabs entende; se a voz ler
a tag em voz alta, apague a tag.

**Configuração sugerida**
- Modelo: Eleven Multilingual v2 (ou v3)
- Voz: feminina, jovem, brasileira, animada (tom de amiga contando novidade)
- Stability 35–45 · Similarity 75 · Style 30–40 · Speaker boost ligado
- Se a voz pronunciar "ARMY" errado, troque por **"Ármi"**

---

## Vídeo 1, "Folheie o kit" (`natal-army-01-folheie.mp4`)

| Tempo | Na tela | Narração |
|---|---|---|
| 0–2s | Gancho + capa | POV: seu Natal ARMY esse ano. |
| 2–10s | Páginas virando | Oitenta desenhos pra colorir, um diário criativo de bônus, espaço pras suas músicas, suas memórias de Natal… e calendário três dê de dois mil e vinte e sete. |
| 10–15s | Kit + preço + CTA | Tudo isso por só dezenove e noventa. Baixa e imprime hoje. Toca em Saiba mais! |

**Texto para colar:**

```
POV: seu Natal ARMY esse ano. <break time="0.3s"/> Oitenta desenhos pra colorir, <break time="0.2s"/> um diário criativo de bônus, <break time="0.2s"/> espaço pras suas músicas, <break time="0.2s"/> suas memórias de Natal… <break time="0.2s"/> e calendário três dê de dois mil e vinte e sete. <break time="0.4s"/> Tudo isso por só dezenove e noventa. Baixa e imprime hoje. Toca em Saiba mais!
```

---

## Vídeo 2, "Tudo isso por R$ 19,90" (`natal-army-02-oferta.mp4`)

| Tempo | Na tela | Narração |
|---|---|---|
| 0–2s | Gancho | Isso tudo custa menos que um lanche. |
| 2–4s | 80 desenhos | São oitenta desenhos pra colorir… |
| 4–6s | 1.500 photocards | mil e quinhentos photocards pra imprimir… |
| 6–9s | 7 calendários | sete calendários três dê de dois mil e vinte e sete… |
| 9–11s | + 3 diários | e ainda três diários de bônus! |
| 11–15s | Preço + selo + CTA | Kit completo: dezenove e noventa, pagamento único. Garanta o seu! |

**Texto para colar:**

```
Isso tudo custa menos que um lanche. <break time="0.4s"/> São oitenta desenhos pra colorir… <break time="0.3s"/> mil e quinhentos photocards pra imprimir… <break time="0.3s"/> sete calendários três dê de dois mil e vinte e sete… <break time="0.3s"/> e ainda três diários de bônus! <break time="0.4s"/> Kit completo: dezenove e noventa, pagamento único. Garanta o seu!
```

---

## Vídeo 3, "Checklist do Natal ARMY" (`natal-army-03-checklist.mp4`)

| Tempo | Na tela | Narração |
|---|---|---|
| 0–2s | Gancho | Se você é ARMY, salva esse vídeo. |
| 2–4s | ✓ Colorir | Colorir ouvindo suas músicas favoritas. |
| 4–6s | ✓ Memórias | Escrever suas memórias de Natal. |
| 6–8s | ✓ Photocards | Imprimir e colecionar photocards. |
| 8–10s | ✓ Calendário | Montar seu calendário de dois mil e vinte e sete. |
| 10–12s | ✓ Presentear | E presentear sua amiga ARMY. |
| 12–15s | Kit + preço + CTA | Tudo num kit só: dezenove e noventa. Toca em Saiba mais! |

**Texto para colar:**

```
Se você é ARMY, salva esse vídeo. <break time="0.4s"/> Colorir ouvindo suas músicas favoritas. <break time="0.3s"/> Escrever suas memórias de Natal. <break time="0.3s"/> Imprimir e colecionar photocards. <break time="0.3s"/> Montar seu calendário de dois mil e vinte e sete. <break time="0.3s"/> E presentear sua amiga ARMY. <break time="0.4s"/> Tudo num kit só: dezenove e noventa. Toca em Saiba mais!
```

---

**Dica de sincronia:** se o áudio passar de 15s, aumente a velocidade da voz
ou tire as pausas. Se quiser acertar cena por cena, gere cada linha da tabela
separada e encaixe no editor.
