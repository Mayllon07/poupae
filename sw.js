/* Poupaê — service worker
   Deixa o app instalável e funcionando offline. */

/* Ao mudar a versão, atualize também os dois selos .app-version
   do index.html — são eles que revelam qual versão o aparelho roda. */
const VERSION = "poupae-v32";
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./core.js",
  "./app.js",
  "./manifest.webmanifest",
  "./icons/logo-mark.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/acento/anel.png",
  "./icons/acento/medidor.png",
  "./icons/acento/menta.png",
  "./icons/acento/bolha-menta.png",
  "./icons/acento/bolha-violeta.png",
  "./icons/acento/bolha-suave.png",
  "./icons/acento/bolha-ouro.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      // addAll falha inteiro se um item falhar: tolera ausências
      .then((cache) => Promise.allSettled(SHELL.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // o .apk é um download de 1,4 MB: não faz sentido guardar em cache
  // nem passar pelo service worker
  if (/\.(apk|aab)$/i.test(url.pathname)) return;

  // navegação: rede primeiro (pega atualizações), cai para o cache offline
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request, { cache: "no-cache" })
        .then((response) => {
          const copy = response.clone();
          caches.open(SHELL_CACHE).then((c) => c.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html").then((r) => r || caches.match("./")))
    );
    return;
  }

  if (url.origin === self.location.origin) {
    // código e manifesto: rede primeiro, para nunca ficar uma versão atrasado
    const isCode = /\.(js|css|webmanifest|json)$/i.test(url.pathname);

    if (isCode) {
      /* "no-cache" força revalidar com o servidor. Sem isso o fetch pode
         ser atendido pelo cache HTTP do navegador e o "rede primeiro"
         entrega código velho do mesmo jeito — o GitHub Pages manda
         max-age=600, então dava até 10 minutos servindo versão antiga. */
      event.respondWith(
        fetch(request, { cache: "no-cache" })
          .then((response) => {
            if (response && response.status === 200) {
              const copy = response.clone();
              caches.open(SHELL_CACHE).then((c) => c.put(request, copy));
            }
            return response;
          })
          .catch(() => caches.match(request))
      );
      return;
    }

    // imagens e resto: cache primeiro, revalidando em segundo plano
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const copy = response.clone();
              caches.open(SHELL_CACHE).then((c) => c.put(request, copy));
            }
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // externo (fontes): usa o cache se houver, senão busca e guarda
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy)).catch(() => {});
          return response;
        })
        .catch(() => cached);
    })
  );
});
