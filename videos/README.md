# Vídeos de anúncio: Meu Natal ARMY (Remotion)

3 vídeos 1080x1920, 30fps, 15s, para Reels/Stories.

| Composição | Arquivo |
|---|---|
| `NatalArmy01-Folheie` | `out/natal-army-01-folheie.mp4` |
| `NatalArmy02-Oferta` | `out/natal-army-02-oferta.mp4` |
| `NatalArmy03-Checklist` | `out/natal-army-03-checklist.mp4` |

Os PNGs `out/*-gancho-1s.png` mostram o frame do segundo 1 de cada vídeo.

## Onde mexer
- **Textos:** `src/video0X-*/textos.ts` (ganchos, legendas, preço, CTA). Use `\n` para quebrar linha no botão.
- **Imagens:** `src/compartilhado/imagens.ts` (caminhos dentro de `public/`).
- **Componentes reutilizáveis:** `src/compartilhado/componentes.tsx` (Fundo, Estrelas, Neve, TextoGancho, Legenda, Preco, CTA, Selo, Contador, Coracoes…).
- **Cores, fonte e zona segura:** `src/compartilhado/tema.ts`.
- **Trilha:** coloque `public/trilha.mp3`. Se o arquivo não existir, o vídeo sai sem áudio.

## Comandos
```bash
npm install
npm run studio        # abre o Remotion Studio
npm run render        # renderiza os 3 vídeos + PNGs
npm run render -- 02  # renderiza só o vídeo 02
```
Se o download automático do Chrome falhar, aponte para um Chrome instalado:
`CHROME_PATH=/caminho/do/chrome npm run render`
