/* Sina dictionary: look up a medical term without leaving the question.
   - Select a word or phrase in a question, an explanation or a lecture: a "Define" chip appears.
   - The settings menu has "Dictionary" with a search bar.
   Definitions are fetched live (never copied into Sina): Wikipedia first, then Wiktionary.
   Both are CC BY-SA; each card names its source and links to it. */
(function () {
  "use strict";
  var WP = "https://en.wikipedia.org", WT = "https://en.wiktionary.org";
  var cache = {};
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function getJSON(u) { return fetch(u, { headers: { "Api-User-Agent": "Sina study site (sina-med.github.io)" } }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }

  function wikiSummary(title) {
    return getJSON(WP + "/api/rest_v1/page/summary/" + encodeURIComponent(title.replace(/ /g, "_")) + "?redirect=true").then(function (j) {
      if (!j || !j.extract || j.type === "disambiguation") throw new Error("none");
      return { title: j.title, text: j.extract, url: j.content_urls && j.content_urls.desktop && j.content_urls.desktop.page, img: j.thumbnail && j.thumbnail.source, src: "Wikipedia" };
    });
  }
  function wikiSearch(q) {
    return getJSON(WP + "/w/api.php?action=opensearch&format=json&limit=6&namespace=0&origin=*&search=" + encodeURIComponent(q)).then(function (j) { return (j && j[1]) || []; });
  }
  function wiktionary(term) {
    return getJSON(WT + "/api/rest_v1/page/definition/" + encodeURIComponent(term.toLowerCase().replace(/ /g, "_"))).then(function (j) {
      var en = j && j.en && j.en[0]; var d = en && en.definitions && en.definitions[0];
      if (!d) throw new Error("none");
      var txt = String(d.definition || "").replace(/<[^>]+>/g, "").trim(); if (!txt) throw new Error("none");
      return { title: term, text: (en.partOfSpeech ? en.partOfSpeech + ". " : "") + txt, url: WT + "/wiki/" + encodeURIComponent(term.replace(/ /g, "_")), src: "Wiktionary" };
    });
  }
  /* best definition for a term: exact Wikipedia page, else the top search hit, else Wiktionary */
  function define(term) {
    var k = term.toLowerCase();
    if (cache[k]) return cache[k];
    return (cache[k] = wikiSummary(term)
      .catch(function () { return wikiSearch(term).then(function (hits) { if (!hits.length) throw new Error("none"); return wikiSummary(hits[0]); }); })
      .catch(function () { return wiktionary(term); })
      .catch(function (e) { delete cache[k]; throw e; }));
  }

  /* ---------- panel (bottom sheet on phones, card on computers) ---------- */
  var panel, input, out, list, chip, timer;
  function build() {
    if (panel) return;
    panel = document.createElement("div");
    panel.className = "dict"; panel.hidden = true;
    panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Dictionary");
    panel.innerHTML =
      '<div class="dict-top"><p class="dict-h">Dictionary</p><button type="button" class="dict-x" aria-label="Close">×</button></div>' +
      '<form class="dict-f" role="search"><input type="search" class="dict-i" placeholder="Search a term, e.g. Roth spots" aria-label="Term to define" autocomplete="off" spellcheck="false"><button type="submit" class="dict-go">Define</button></form>' +
      '<ul class="dict-sug" hidden></ul><div class="dict-out" aria-live="polite"></div>';
    document.body.appendChild(panel);
    input = panel.querySelector(".dict-i"); out = panel.querySelector(".dict-out"); list = panel.querySelector(".dict-sug");
    panel.querySelector(".dict-x").onclick = close;
    panel.querySelector(".dict-f").onsubmit = function (e) { e.preventDefault(); var v = input.value.trim(); if (v) show(v); };
    var st;
    input.addEventListener("input", function () {
      clearTimeout(st); var v = input.value.trim();
      if (v.length < 2) { list.hidden = true; return; }
      st = setTimeout(function () {
        wikiSearch(v).then(function (h) {
          if (input.value.trim() !== v) return;
          list.innerHTML = h.map(function (t) { return '<li><button type="button">' + esc(t) + "</button></li>"; }).join("");
          list.hidden = !h.length;
        }).catch(function () { list.hidden = true; });
      }, 250);
    });
    list.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; input.value = b.textContent; show(b.textContent); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) close(); });
  }
  function show(term) {
    list.hidden = true;
    out.innerHTML = '<p class="dict-wait">Looking up “' + esc(term) + "”…</p>";
    define(term).then(function (d) {
      out.innerHTML = '<article class="dict-card">' + (d.img ? '<img src="' + esc(d.img) + '" alt="" loading="lazy">' : "") +
        "<h3>" + esc(d.title) + "</h3><p>" + esc(d.text) + "</p>" +
        '<p class="dict-src">From <a href="' + esc(d.url) + '" target="_blank" rel="noopener">' + esc(d.src) + "</a> (CC BY-SA). Check it against your lecture: an encyclopedia isn’t the exam’s answer key.</p></article>";
    }).catch(function () {
      out.innerHTML = '<p class="dict-wait">No definition found for “' + esc(term) + "”. Try a shorter or more general term" + (navigator.onLine === false ? " (you seem to be offline)" : "") + ".</p>";
    });
  }
  function open(term) {
    build(); hideChip();
    panel.hidden = false; document.documentElement.classList.add("dict-on");
    if (term) { input.value = term; show(term); } else { out.innerHTML = ""; input.value = ""; setTimeout(function () { input.focus(); }, 30); }
  }
  function close() { if (!panel) return; panel.hidden = true; document.documentElement.classList.remove("dict-on"); }

  /* ---------- "Define" chip on a text selection ---------- */
  var AREAS = ".qtext, .opt, .onote, .fb, #fb, .explain, .lec-body, .summary, .card-back, .card-front, .follow, .qchart, .smb-panel, main article";
  function hideChip() { if (chip) chip.hidden = true; }
  function selTerm() {
    var s = window.getSelection && window.getSelection(); if (!s || s.isCollapsed || !s.rangeCount) return null;
    var t = String(s).replace(/\s+/g, " ").trim().replace(/^[^\w(]+|[^\w)]+$/g, "");
    if (t.length < 3 || t.length > 60 || t.split(" ").length > 6) return null;
    var n = s.anchorNode && (s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentElement);
    if (!n || !n.closest || !n.closest(AREAS) || (panel && panel.contains(n))) return null;
    return { t: t, r: s.getRangeAt(0).getBoundingClientRect() };
  }
  function place() {
    var x = selTerm(); if (!x) { hideChip(); return; }
    if (!chip) {
      chip = document.createElement("button"); chip.type = "button"; chip.className = "dict-chip"; chip.hidden = true;
      chip.addEventListener("mousedown", function (e) { e.preventDefault(); });
      chip.addEventListener("click", function () { var t = chip.dataset.t; hideChip(); open(t); });
      document.body.appendChild(chip);
    }
    chip.dataset.t = x.t;
    chip.textContent = "Define “" + (x.t.length > 24 ? x.t.slice(0, 22) + "…" : x.t) + "”";
    chip.hidden = false;
    /* phones show their own Copy/Look up bar above a selection, so the chip goes below it there */
    var touch = matchMedia("(pointer: coarse)").matches;
    var w = chip.offsetWidth, top = touch ? x.r.bottom + 14 : x.r.top - chip.offsetHeight - 10;
    if (top < 70) top = x.r.bottom + 10;
    if (top > innerHeight - chip.offsetHeight - 8) top = x.r.top - chip.offsetHeight - 10;
    chip.style.top = Math.round(top) + "px";
    chip.style.left = Math.round(Math.max(8, Math.min(innerWidth - w - 8, x.r.left + x.r.width / 2 - w / 2))) + "px";
  }
  document.addEventListener("selectionchange", function () { clearTimeout(timer); timer = setTimeout(place, 220); });
  addEventListener("scroll", hideChip, { passive: true });

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-dict]"); if (!a) return;
    e.preventDefault();
    var m = document.getElementById("settings-menu"), b = document.getElementById("settings-btn");
    if (m && !m.hidden && b) b.click();
    open();
  });
  window.SinaDefine = { open: open, define: define };
})();
