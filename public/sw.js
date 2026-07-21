// Service worker mínimo: solo existe para que el navegador considere el sitio
// instalable como PWA (requisito de Chrome/Android). No cachea nada — todo
// se sirve siempre de la red, para no arriesgar datos obsoletos en el
// dashboard, wallet o sesión de usuario.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
