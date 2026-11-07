/* ==========================================================================
   TORRE 4000 - Guardado de imagenes en el dispositivo
   --------------------------------------------------------------------------
   La primera visita descarga las imagenes; las siguientes salen del
   dispositivo sin gastar datos. Una vez al dia se comprueba en silencio si
   cambiaron (si no cambiaron, el servidor responde "sin cambios" y no baja nada).
   Para forzar que todos vuelvan a bajar todo: cambia CACHE (v1 -> v2).
   ========================================================================== */
const CACHE = "t4-media-v1";
const IMAGES = /\.(?:jpe?g|png|webp|avif|gif|svg|ico)$/i;
const REFRESH_AFTER = 24 * 60 * 60 * 1000;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key.startsWith("t4-media-") && key !== CACHE).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || request.headers.has("range")) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !IMAGES.test(url.pathname)) return;

  event.respondWith(serve(request, event));
});

function isFresh(response) {
  const date = Date.parse(response.headers.get("date") || "");
  return Number.isFinite(date) && Date.now() - date < REFRESH_AFTER;
}

async function update(cache, request, event) {
  const response = await fetch(request, { cache: "no-cache" });
  // Se guarda en segundo plano para no retrasar la imagen que ya se esta mostrando
  if (response && response.status === 200) event.waitUntil(cache.put(request, response.clone()));
  return response;
}

async function serve(request, event) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);

  if (hit) {
    if (!isFresh(hit)) event.waitUntil(update(cache, request, event).catch(() => undefined));
    return hit;
  }

  try {
    return await update(cache, request, event);
  } catch {
    return Response.error();
  }
}