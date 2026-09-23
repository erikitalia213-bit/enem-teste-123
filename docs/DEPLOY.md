# Publicar FLAGLAB

```bash
npm install
npm run build      # genera /out
npm start          # vista previa local de /out en http://localhost:3000
```

- **Vercel / Netlify / Cloudflare Pages:** comando `npm run build`, carpeta de salida `out`.
- **Hosting tradicional (Hostinger, cPanel):** sube el contenido de `out/` a `public_html`.
- Define `NEXT_PUBLIC_SITE_URL` con tu dominio para que el OpenGraph y el sitemap usen la URL correcta.
