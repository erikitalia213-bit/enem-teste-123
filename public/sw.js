/* Service worker do Protocolo 42 Dias.
 * - Assets estáticos (/_next/static, /img, /exercicios, /icones, fontes): cache primeiro.
 * - Páginas: rede primeiro; sem internet, usa a última versão salva ou a página /offline.
 * - Nunca guarda /api, /auth nem respostas de outros domínios.
 * Para forçar atualização em todos os aparelhos, aumente a VERSAO.
 */
const VERSAO = "p42-v1";
const CACHE_ESTATICO = `${VERSAO}-estatico`;
const CACHE_PAGINAS = `${VERSAO}-paginas`;
const PRECACHE = [
  "/offline",
  "/img/logo-42dias.webp",
  "/img/logo-42-icone.webp",
  "/img/mapa-base.webp",
  "/img/celebracao.webp",
  "/img/calendario-reveillon.webp",
  "/icones/icone-192.png",
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches
      .open(CACHE_ESTATICO)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((chaves) => Promise.all(chaves.filter((c) => !c.startsWith(VERSAO)).map((c) => caches.delete(c))))
      .then(() => self.clients.claim()),
  );
});

// Ao sair da conta, o app pede para apagar as páginas salvas deste aparelho.
self.addEventListener("message", (evento) => {
  if (evento.data && evento.data.tipo === "limpar-paginas") {
    evento.waitUntil(caches.delete(CACHE_PAGINAS));
  }
});

function ehEstatico(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/img/") ||
    url.pathname.startsWith("/exercicios/") && /\.(webp|png|jpg|jpeg|avif)$/.test(url.pathname) ||
    url.pathname.startsWith("/icones/") ||
    url.pathname.startsWith("/_next/image") ||
    /\.(woff2?|ttf)$/.test(url.pathname)
  );
}

self.addEventListener("fetch", (evento) => {
  const req = evento.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/")) return;

  if (ehEstatico(url)) {
    evento.respondWith(
      caches.open(CACHE_ESTATICO).then(async (cache) => {
        const salvo = await cache.match(req);
        if (salvo) return salvo;
        const resp = await fetch(req);
        if (resp.ok) cache.put(req, resp.clone());
        return resp;
      }),
    );
    return;
  }

  if (req.mode === "navigate") {
    evento.respondWith(
      fetch(req)
        .then((resp) => {
          // Só guarda páginas normais (não redirecionamentos para o login).
          if (resp.ok && !resp.redirected) {
            const copia = resp.clone();
            caches.open(CACHE_PAGINAS).then((cache) => cache.put(req, copia));
          }
          return resp;
        })
        .catch(async () => (await caches.match(req)) || (await caches.match("/offline")) || Response.error()),
    );
  }
});
