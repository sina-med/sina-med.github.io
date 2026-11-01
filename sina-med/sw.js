/* Old address retired: remove the old offline copy and send open tabs to the new address. */
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) {
  e.waitUntil(self.registration.unregister().then(function () { return self.clients.matchAll({ type: "window" }); })
    .then(function (cs) { cs.forEach(function (c) { var u = new URL(c.url); c.navigate("/" + u.search + u.hash); }); }));
});
