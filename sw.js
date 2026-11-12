const CACHE = "sina-v211";
const CORE = ["./", "index.html", "css/style.css", "js/app.js", "js/data/highlights.js", "js/data/midscope.js", "js/data/qalias.js", "js/data/photos.js", "js/data/occl.js", "js/i18n.js", "js/data/index.js", "js/data/papers.js", "js/data/paperlec.js", "js/data/paperqs.js", "js/data/mocks1.js", "js/data/updates.js", "js/data/m3d.js", "js/data/extras.js", "js/data/lectures-anat3.js", "js/data/lectures-physio.js", "js/data/lectures-semio.js", "js/data/lectures-biochem.js", "js/data/lectures-fa.js", "js/data/lectures-pathanat.js", "js/data/lectures-history.js", "js/data/lectures-toxico.js", "js/data/lectures-pharma.js", "js/data/lectures-infect.js", "js/data/lectures-parasito.js", "js/data/lectures-term1.js", "js/data/lectures-pubhealth1.js", "js/data/lectures-genetics1.js", "js/data/lectures-chem1.js", "js/data/lectures-cellbio1.js", "js/data/lectures-biophys1.js", "js/data/lectures-physics1.js", "js/data/lectures-biochem1.js", "js/data/lectures-anat1.js", "js/data/lectures-immuno1.js", "js/data/lectures-anat2.js", "js/data/lectures-hemato1.js", "js/data/lectures-embryo1.js", "js/data/lectures-histo1.js", "js/data/lectures-bacterio1.js", "js/data/lectures-physio1.js", "js/data/lectures-viro1.js", "manifest.webmanifest", "icons/apple-touch-icon.png", "icons/favicon.svg", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === location.origin;
  const isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!sameOrigin && !isFont) return; // other sites (3D models, pictures, links): network only
  if (sameOrigin && url.pathname.indexOf('/files/ak/i/') > -1) return; // locked AnKing pictures: network only, not kept in the offline cache
  if (isFont) {
    // fonts: cache first
    e.respondWith(caches.open(CACHE).then((cache) => cache.match(req).then((hit) => hit || fetch(req).then((res) => { if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone()); return res; }))));
    return;
  }
  // the site's own files: network first so updates show up straight away, cache as offline fallback
  e.respondWith(
    fetch(req.mode === "navigate" ? req.url : req, { cache: "no-cache" }).then((res) => { if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; })
      .catch(() => caches.match(req).then((hit) => hit || caches.match("index.html")))
  );
});

// study reminders
self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { title: "Sina", body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "Sina", { body: d.body || "Time to study.", icon: "icons/icon-192.png", badge: "icons/icon-192.png", tag: "sina-reminder", data: { url: d.url || "#/" } }));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = new URL("./" + ((e.notification.data && e.notification.data.url) || ""), self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
    for (const c of cs) { if (c.url.startsWith(self.registration.scope)) { c.focus(); return c.navigate(url); } }
    return self.clients.openWindow(url);
  }));
});
