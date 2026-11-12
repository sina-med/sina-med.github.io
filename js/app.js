(function () {
  "use strict";
  var S = window.SINA;
  /* past papers turned into online quizzes live in js/data/paperqs.js */
  (S.papers || []).forEach(function (p) { var q = S.paperQs && S.paperQs[p.id]; if (q && !(p.questions && p.questions.length)) { p.questions = q; p.keyBy = (S.paperKeyBy || {})[p.id] || p.keyBy; } });
  var app = document.getElementById("app");
  /* Picture (diagram) questions are kept out of quizzes until the new picture-question design is approved.
     They stay in each lecture as picMcqs, and the Visual tab and picture flashcards are unchanged. */
  Object.keys(S.lectures || {}).forEach(function (lid) {
    var L = S.lectures[lid]; if (!L.mcqs) return;
    L.picMcqs = L.mcqs.filter(function (q) { return q.target; });
    L.mcqs = L.mcqs.filter(function (q) { return !q.target; });
  });
  /* Flowchart questions (model D): box diagrams become a vertical chain of steps with one step blank. */
  function flowOrder(fig) {
    if (fig._flow) return fig._flow;
    var box = {}, keys = Object.keys(fig.parts || {});
    keys.forEach(function (k) { var m = /x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/.exec(fig.parts[k].shape || ""); if (m) box[k] = [+m[1], +m[2], +m[3], +m[4]]; });
    function near(x, y) { var best = null, bd = 1e9; keys.forEach(function (k) { var b = box[k]; if (!b) return; var dx = Math.max(b[0] - x, 0, x - b[0] - b[2]), dy = Math.max(b[1] - y, 0, y - b[1] - b[3]), d = dx * dx + dy * dy; if (d < bd) { bd = d; best = k; } }); return bd < 900 ? best : null; }
    var next = {}, indeg = {}; keys.forEach(function (k) { indeg[k] = 0; next[k] = []; });
    String(fig.base || "").replace(/<line[^>]*x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"/g, function (_, a, b, c, d) { var u = near(+a, +b), v = near(+c, +d); if (u && v && u !== v && next[u].indexOf(v) < 0) { next[u].push(v); indeg[v]++; } });
    var pos = function (k) { var b = box[k] || [0, 0]; return b[1] * 10 + b[0]; }, order = [], linked = {};
    keys.forEach(function (k) { if (next[k].length) { linked[k] = 1; next[k].forEach(function (v) { linked[v] = 1; }); } });
    var q = keys.filter(function (k) { return !indeg[k] && linked[k]; }).sort(function (a, b) { return pos(a) - pos(b); });
    while (q.length) { var k = q.shift(); order.push(k); next[k].forEach(function (v) { if (--indeg[v] === 0) q.push(v); }); }
    keys.forEach(function (k) { if (order.indexOf(k) < 0) order.push(k); });
    fig._next = next; fig._indeg = {}; keys.forEach(function (k) { fig._indeg[k] = 0; }); keys.forEach(function (k) { next[k].forEach(function (v) { fig._indeg[v]++; }); });
    return (fig._flow = order);
  }
  Object.keys(S.lectures || {}).forEach(function (lid) {
    var L = S.lectures[lid], fig = L.visual && L.visual.figure;
    if (!fig || !L.picMcqs || !L.picMcqs.length || !isBoxFig(fig)) return;
    var info = {};
    L.picMcqs.forEach(function (q) { var a = q.answers ? q.answers[0] : q.answer, m = /^The arrow points to: (.*?)\.\s*(.*)$/.exec(q.why || ""); info[q.target] = { name: q.options[a], desc: m ? m[2] : "" }; });
    var order = flowOrder(fig).filter(function (k) { return info[k]; });
    if (order.length < 3) return;
    L.flow = { title: fig.alt || "", steps: order.map(function (k) { return { k: k, name: info[k].name, desc: info[k].desc }; }) };
    /* plain text questions: the step's description is given, the student names the step.
       Stems never name another step, so moving between questions gives nothing away. */
    var topic = (fig.alt || L.title).replace(/,?\s*step by step\.?$/i, "").replace(/\.$/, ""), names = order.map(function (k) { return info[k].name; });
    order.forEach(function (u) {
      var d = info[u].desc; if (!d || d.length < 25) return;
      var nm = info[u].name, lowd = d.toLowerCase();
      if (nm.toLowerCase().split(/[^a-z0-9]+/).some(function (w) { return w.length > 3 && lowd.indexOf(w.slice(0, 5)) > -1; })) return;
      var rnd = seeded(lid + "|" + u), pool = names.filter(function (n) { return n !== nm; });
      for (var k = pool.length - 1; k > 0; k--) { var j = Math.floor(rnd() * (k + 1)), t = pool[k]; pool[k] = pool[j]; pool[j] = t; }
      var opts = pool.slice(0, 3).concat([nm]);
      for (k = opts.length - 1; k > 0; k--) { j = Math.floor(rnd() * (k + 1)); t = opts[k]; opts[k] = opts[j]; opts[j] = t; }
      if (opts.length < 3) return;
      L.mcqs.push({ q: topic + ": which step is this? \u201c" + d.replace(/\.$/, "") + ".\u201d", options: opts, answer: opts.indexOf(nm), why: "This describes " + nm + "." });
    });
  });
  /* Covered-label questions (model A): real labelled atlas plates, labels hidden under tiles, one tile asked. */
  function seeded(str) { var h = 1779033703 ^ str.length; for (var i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; } return function () { h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; }; }
  function occBase(t) { return t.replace(/\s*\([^)]*\)\s*$/, "").replace(/,.*$/, "").toLowerCase(); }
  Object.keys(S.occl || {}).forEach(function (fk) {
    var f = S.occl[fk], seen = {};
    f.labels.forEach(function (lb, i) {
      var t = lb[4]; if (seen[t]) return; seen[t] = 1;
      var rnd = seeded(fk + "|" + t), pool = f.labels.map(function (x) { return x[4]; }).filter(function (x, j, a) { return a.indexOf(x) === j && occBase(x) !== occBase(t); });
      for (var k = pool.length - 1; k > 0; k--) { var j = Math.floor(rnd() * (k + 1)), tmp = pool[k]; pool[k] = pool[j]; pool[j] = tmp; }
      var opts = pool.slice(0, 3).concat([t]);
      for (k = opts.length - 1; k > 0; k--) { j = Math.floor(rnd() * (k + 1)); tmp = opts[k]; opts[k] = opts[j]; opts[j] = tmp; }
      if (opts.length < 2) return;
      var q = { q: "Which structure is under the yellow tile?", options: opts, answer: opts.indexOf(t), occ: { f: fk, i: i }, why: "The yellow tile hides the printed label: " + t + "." };
      ((f.lecMap && f.lecMap[t]) ? [f.lecMap[t]] : f.lecs).forEach(function (lid) { var L = S.lectures[lid]; if (L && L.mcqs) L.mcqs.push(q); });
    });
  });

  /* ---------- helpers ---------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} syncTouch(k); },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} syncTouch(k); }
  };
  /* ---------- account sync: which saved keys travel between devices ---------- */
  var SYNC_SKIP = /^sina:(akkey|dev|remind|lb|lbPending|midsheet|acct|mt|welcomed|psaDismissed|ann\w*|lang|sumLang)$/;
  function syncable(k) { return /^sina:/.test(k) && !SYNC_SKIP.test(k.split(":").slice(0, 2).join(":")) && !SYNC_SKIP.test(k); }
  var syncTimer = 0;
  function syncTouch(k) {
    if (!syncable(k)) return;
    try { var mt = JSON.parse(localStorage.getItem("sina:mt") || "{}"); mt[k] = Date.now(); localStorage.setItem("sina:mt", JSON.stringify(mt)); } catch (e) {}
    if (window.SinaSync && SinaSync.on()) { clearTimeout(syncTimer); syncTimer = setTimeout(function () { SinaSync.run(); }, 15000); }
  }
  function subjectById(id) { return S.subjects.filter(function (s) { return s.id === id; })[0]; }
  var T = S.t || function (k) { return k; };
  /* ---------- year / program ---------- */
  var PROGS = S.programs || [{ id: "y3-anglo" }];
  function progValid(id) { return PROGS.some(function (p) { return p.id === id; }); }
  var PROG = store.get("sina:program", null);
  if (!progValid(PROG)) PROG = S.DEFAULT_PROGRAM || PROGS[PROGS.length - 1].id;
  function progName(id) { return T("program." + (id || PROG)); }
  function progSubjects() { return S.subjects.filter(function (x) { return (x.program || S.DEFAULT_PROGRAM) === PROG; }); }
  function progSemesters() {
    var seen = []; progSubjects().forEach(function (x) { if (seen.indexOf(x.semester) < 0) seen.push(x.semester); });
    return seen.sort();
  }
  function readyCount(sub) {
    var n = 0;
    (sub.groups || []).forEach(function (g) { g.items.forEach(function (it) { if (S.lectures[it.id]) n++; }); });
    return n;
  }
  function totalCount(sub) {
    if (!sub.groups) return sub.count || 0;
    var n = 0; sub.groups.forEach(function (g) { n += g.items.length; }); return n;
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ---------- settings menu (light or dark) and suggestion button ---------- */
  var setBtn = document.getElementById("settings-btn"), setMenu = document.getElementById("settings-menu");
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    setMenu.querySelectorAll("[data-theme-choice]").forEach(function (b) { b.setAttribute("aria-checked", String(b.dataset.themeChoice === t)); });
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", t === "dark" ? "#1b1d20" : "#ffffff");
  }
  var theme = store.get("sina:theme", null) || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  if (theme !== "dark") theme = "light";
  applyTheme(theme);
  function openSettings(open) {
    setMenu.hidden = !open;
    setBtn.setAttribute("aria-expanded", String(open));
    if (open) { var cur = setMenu.querySelector('[aria-checked="true"]') || setMenu.querySelector("button"); cur.focus(); }
  }
  setBtn.addEventListener("click", function (e) { e.stopPropagation(); openSettings(setMenu.hidden); });
  setMenu.querySelectorAll("[data-theme-choice]").forEach(function (b) {
    b.addEventListener("click", function () {
      theme = b.dataset.themeChoice; store.set("sina:theme", theme); applyTheme(theme);
      openSettings(false); setBtn.focus();
    });
  });
  setMenu.addEventListener("keydown", function (e) {
    var items = [].slice.call(setMenu.querySelectorAll("button:not([disabled])")), k = items.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); items[(k + 1) % items.length].focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); items[(k - 1 + items.length) % items.length].focus(); }
  });
  document.addEventListener("click", function (e) { if (!setMenu.hidden && !setMenu.contains(e.target)) openSettings(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !setMenu.hidden) { openSettings(false); setBtn.focus(); } });

  /* ---------- year selector (top left): opens on hover or click ---------- */
  var progBox = document.getElementById("prog"), progBtn = document.getElementById("prog-btn"), progMenu = document.getElementById("prog-menu"), progCur = document.getElementById("prog-cur"), progTimer;
  function renderProgMenu() {
    progCur.textContent = progName();
    progMenu.innerHTML = '<p class="sm-title">' + esc(T("program.choose")) + "</p>" + PROGS.map(function (p) {
      var n = S.subjects.filter(function (x) { return (x.program || S.DEFAULT_PROGRAM) === p.id && x.groups; }).length;
      return '<button type="button" role="menuitemradio" data-prog="' + p.id + '" aria-checked="' + (p.id === PROG) + '"><span class="pm-name">' + esc(progName(p.id)) + '</span>' +
        (n ? "" : '<span class="pm-soon">' + esc(T("settings.soon")) + "</span>") + '<span class="sm-tick" aria-hidden="true">&#10003;</span></button>';
    }).join("") + (S.usmle ? '<a class="pm-usmle" role="menuitem" href="#/usmle"><span class="pm-name">USMLE prep</span><span class="pm-soon">Step 1</span></a>' : "");
    var pu = progMenu.querySelector(".pm-usmle"); if (pu) pu.addEventListener("click", function () { openProg(false); });
    progMenu.querySelectorAll("[data-prog]").forEach(function (b) {
      b.addEventListener("click", function () { setProgram(b.dataset.prog); openProg(false); progBtn.focus(); });
    });
  }
  function openProg(open) {
    progMenu.hidden = !open; progBtn.setAttribute("aria-expanded", String(open));
  }
  function setProgram(id, quiet) {
    if (!progValid(id)) return;
    var changed = id !== PROG; PROG = id; store.set("sina:program", id); if (changed && typeof IDX !== "undefined") IDX = null;
    if (changed || quiet) { try { track("year-" + id, "Year chosen: " + progName(id), true); } catch (e) {} }
    renderProgMenu(); if (typeof renderDrawer === "function") renderDrawer();
    if (changed && !quiet) {
      var t = document.getElementById("toast") || document.body.appendChild(Object.assign(document.createElement("div"), { id: "toast", className: "toast", role: "status" }));
      t.textContent = T("program.switched", { name: progName() }); t.classList.add("show"); setTimeout(function () { t.classList.remove("show"); }, 2200);
    }
    if (changed) { if (location.hash === "#/" || location.hash === "" ) route(); else location.hash = "#/"; }
  }
  progBtn.setAttribute("aria-label", T("program.label"));
  progBtn.addEventListener("click", function (e) { e.stopPropagation(); openProg(progMenu.hidden); if (!progMenu.hidden) { var c = progMenu.querySelector('[aria-checked="true"]'); if (c) c.focus(); } });
  if (window.matchMedia && matchMedia("(hover: hover)").matches) {
    progBox.addEventListener("mouseenter", function () { clearTimeout(progTimer); openProg(true); });
    progBox.addEventListener("mouseleave", function () { progTimer = setTimeout(function () { openProg(false); }, 180); });
  }
  progMenu.addEventListener("keydown", function (e) {
    var items = [].slice.call(progMenu.querySelectorAll("button")), k = items.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); items[(k + 1) % items.length].focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); items[(k - 1 + items.length) % items.length].focus(); }
  });
  document.addEventListener("click", function (e) { if (!progMenu.hidden && !progBox.contains(e.target)) openProg(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !progMenu.hidden) { openProg(false); progBtn.focus(); } });
  renderProgMenu();

  /* ---------- first visit: ask which year the visitor is in ---------- */
  function yearChooser() {
    var box = document.createElement("div");
    box.className = "yc-backdrop"; box.id = "year-chooser";
    box.innerHTML = '<div class="yc" role="dialog" aria-modal="true" aria-labelledby="yc-title">' +
      '<p class="yc-kicker">' + esc(T("welcome.kicker")) + '</p><h2 id="yc-title">' + esc(T("welcome.title")) + '</h2><p class="yc-sub">' + esc(T("welcome.sub")) + '</p>' +
      '<div class="yc-grid">' + PROGS.map(function (p) {
        var n = S.subjects.filter(function (x) { return (x.program || S.DEFAULT_PROGRAM) === p.id && x.groups; }).length;
        return '<button type="button" class="yc-opt" data-year="' + p.id + '"><span class="yc-name">' + esc(progName(p.id)) + '</span>' +
          '<span class="yc-meta">' + esc(n ? T("welcome.ready", { n: n }) : T("settings.soon")) + "</span></button>";
      }).join("") + '</div>' + (S.usmle ? '<a class="yc-usmle" href="#/usmle">Preparing for the USMLE? Open USMLE prep</a>' : "") + '<button type="button" class="yc-skip">' + esc(T("welcome.skip")) + "</button></div>";
    document.body.appendChild(box);
    var last = document.activeElement;
    function close() { store.set("sina:yearAsked", "1"); box.remove(); document.removeEventListener("keydown", onKey, true); if (last && last.focus) last.focus(); }
    function onKey(e) {
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.key === "Tab") {
        var f = [].slice.call(box.querySelectorAll("button")), i = f.indexOf(document.activeElement);
        e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    }
    document.addEventListener("keydown", onKey, true);
    box.querySelectorAll("[data-year]").forEach(function (b) {
      b.addEventListener("click", function () { close(); setProgram(b.dataset.year, true); if (location.hash !== "#/" && location.hash !== "") location.hash = "#/"; else route(); });
    });
    box.querySelector(".yc-skip").addEventListener("click", close);
    var yu = box.querySelector(".yc-usmle"); if (yu) yu.addEventListener("click", close);
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    var first = box.querySelector('[data-year="' + PROG + '"]') || box.querySelector("[data-year]"); if (first) first.focus();
  }
  (function () {
    var h = location.hash || "#/", deep = /^#\/(lecture|year|papers|apps|updates|usmle)\//.test(h + "/") && h !== "#/";
    if (!document.getElementById("welcome") && !store.get("sina:program", null) && !store.get("sina:yearAsked", null) && !deep) setTimeout(yearChooser, 0);
  })();

  /* ---------- language (Settings) ---------- */
  var LANGS = S.languages || [{ id: "en", label: "English", available: true }];
  S.lang = store.get("sina:lang", "en");
  if (!LANGS.some(function (l) { return l.id === S.lang && l.available; })) S.lang = "en";
  document.documentElement.setAttribute("lang", S.lang);
  function applyI18n() { document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = T(el.getAttribute("data-i18n")); }); var si = document.getElementById("search-input"); if (si) { si.placeholder = T("search.placeholder"); } }
  var langBox = document.getElementById("lang-items");
  if (langBox) {
    langBox.innerHTML = LANGS.map(function (l) {
      return '<button type="button" role="menuitemradio" data-lang="' + l.id + '" aria-checked="' + (l.id === S.lang) + '"' + (l.available ? "" : ' disabled aria-disabled="true"') + '><span class="sm-ico" aria-hidden="true">' + l.id.toUpperCase() + "</span>" + esc(l.label) +
        (l.available ? "" : '<span class="pm-soon">' + esc(T("settings.soon")) + "</span>") + '<span class="sm-tick" aria-hidden="true">&#10003;</span></button>';
    }).join("");
    langBox.querySelectorAll("[data-lang]:not([disabled])").forEach(function (b) {
      b.addEventListener("click", function () {
        S.lang = b.dataset.lang; store.set("sina:lang", S.lang); document.documentElement.setAttribute("lang", S.lang);
        langBox.querySelectorAll("[data-lang]").forEach(function (x) { x.setAttribute("aria-checked", String(x.dataset.lang === S.lang)); });
        applyI18n(); renderProgMenu(); if (typeof renderDrawer === "function") renderDrawer(); route(); openSettings(false);
      });
    });
  }
  applyI18n();

  var sugBtn = document.getElementById("suggest-btn"), formUrl = (sugBtn.getAttribute("data-form") || "").trim();
  if (/^https?:\/\//.test(formUrl)) sugBtn.href = formUrl;
  else sugBtn.addEventListener("click", function (e) {
    e.preventDefault();
    var t = document.getElementById("toast") || document.body.appendChild(Object.assign(document.createElement("div"), { id: "toast", className: "toast", role: "status" }));
    t.textContent = "The suggestion form is coming soon."; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 2600);
  });

  /* ---------- orbit diagram (schematic, right orbit, front view) ---------- */
  var RIM = "M 140 75 H 420 Q 480 75 480 135 V 325 Q 480 385 420 385 H 140 Q 80 385 80 325 V 135 Q 80 75 140 75 Z";
  var WALLS = {
    roof: "80,75 480,75 360,245", floor: "80,385 480,385 360,245",
    lateral: "80,75 80,385 360,245", medial: "480,75 480,385 360,245"
  };
  var ARROWS = {
    "optic-canal": [{ t: [360, 245], d: [64, 54] }],
    sof: [{ t: [296, 206], d: [-12, -66] }],
    iof: [{ t: [258, 296], d: [-30, 60] }],
    supraorbital: [{ t: [347, 75], d: [0, -54] }],
    infraorbital: [{ t: [335, 418], d: [-64, 14] }],
    ethmoid: [{ t: [434, 140], d: [58, -30] }, { t: [408, 177], d: [70, 10] }],
    "lacrimal-fossa": [{ t: [458, 300], d: [58, 44] }],
    "trochlear-fossa": [{ t: [432, 100], d: [56, -40] }]
  };
  function arrowSVG(a) {
    var sx = a.t[0] + a.d[0], sy = a.t[1] + a.d[1];
    var dx = a.t[0] - sx, dy = a.t[1] - sy, len = Math.sqrt(dx * dx + dy * dy);
    var ux = dx / len, uy = dy / len, gap = 12;
    var ex = a.t[0] - ux * gap, ey = a.t[1] - uy * gap;
    var px = -uy, py = ux, hl = 14, hw = 7;
    var bx = ex - ux * hl, by = ey - uy * hl;
    var pts = ex + "," + ey + " " + (bx + px * hw) + "," + (by + py * hw) + " " + (bx - px * hw) + "," + (by - py * hw);
    return '<path class="arrow-halo" d="M ' + sx + " " + sy + " L " + bx + " " + by + '"/><path class="arrow-line" d="M ' + sx + " " + sy + " L " + bx + " " + by + '"/><polygon class="arrow-head" points="' + pts + '"/>';
  }
  function orbitSVG(cfg) {
    var quiz = cfg.mode === "quiz";
    var cls = "orbit " + (quiz ? "quiz" : "explore layer-" + (cfg.layer || "walls"));
    var out = '<svg class="' + cls + '" viewBox="-20 0 600 450" role="img" aria-label="' + esc(cfg.aria || "Schematic of the right orbit seen from the front") + '"><defs><clipPath id="rimclip' + (cfg.uid || "") + '"><path d="' + RIM + '"/></clipPath></defs>';
    out += '<g clip-path="url(#rimclip' + (cfg.uid || "") + ')">';
    Object.keys(WALLS).forEach(function (id) {
      out += '<polygon class="wall' + (quiz && cfg.target === id ? " hl" : "") + '" data-id="' + id + '" points="' + WALLS[id] + '"/>';
    });
    out += "</g>";
    out += '<path class="rim" d="' + RIM + '"/>';
    // margins
    var M = { "m-sup": [140, 75, 420, 75], "m-lat": [80, 135, 80, 325], "m-inf": [140, 385, 420, 385], "m-med": [480, 135, 480, 325] };
    Object.keys(M).forEach(function (id) {
      var m = M[id];
      out += '<g class="margin" data-id="' + id + '"><line class="hit" x1="' + m[0] + '" y1="' + m[1] + '" x2="' + m[2] + '" y2="' + m[3] + '"/><line x1="' + m[0] + '" y1="' + m[1] + '" x2="' + m[2] + '" y2="' + m[3] + '"/></g>';
    });
    // openings
    out += '<g class="opening" data-id="optic-canal"><circle class="hit" cx="360" cy="245" r="20"/><circle class="shape" cx="360" cy="245" r="10"/></g>';
    out += '<g class="opening" data-id="sof"><line class="hit" x1="332" y1="228" x2="262" y2="185"/><line class="shape" x1="332" y1="228" x2="262" y2="185"/></g>';
    out += '<g class="opening" data-id="iof"><line class="hit" x1="321" y1="265" x2="196" y2="327"/><line class="shape" x1="321" y1="265" x2="196" y2="327"/></g>';
    out += '<g class="opening" data-id="supraorbital"><circle class="hit" cx="347" cy="75" r="18"/><circle class="shape" cx="347" cy="75" r="6"/></g>';
    out += '<g class="opening" data-id="infraorbital"><circle class="hit" cx="335" cy="418" r="18"/><circle class="shape" cx="335" cy="418" r="6"/></g>';
    out += '<g class="opening" data-id="ethmoid"><circle class="hit" cx="434" cy="140" r="14"/><circle class="hit" cx="408" cy="177" r="14"/><circle class="shape" cx="434" cy="140" r="5"/><circle class="shape" cx="408" cy="177" r="5"/></g>';
    // landmarks
    out += '<g class="landmark" data-id="lacrimal-fossa"><ellipse class="hit" cx="458" cy="300" rx="20" ry="32"/><ellipse class="shape" cx="458" cy="300" rx="13" ry="25"/></g>';
    out += '<g class="landmark" data-id="trochlear-fossa"><circle class="hit" cx="432" cy="100" r="16"/><circle class="shape" cx="432" cy="100" r="6"/></g>';
    out += '<g class="landmark" data-id="lacrimal-gland-fossa"><ellipse class="hit" cx="125" cy="105" rx="30" ry="20"/><ellipse class="shape" cx="125" cy="105" rx="23" ry="13"/></g>';
    // orientation tags
    out += '<text class="tag" x="14" y="20">Superior</text><text class="tag" x="14" y="442">Inferior</text><text class="tag" x="14" y="235">Lateral</text><text class="tag" x="546" y="235" text-anchor="end">Medial</text>';
    if (!quiz) {
      var L = function (layer, x, y, txt, anchor) { return '<text class="lbl lbl-' + layer + '" x="' + x + '" y="' + y + '" text-anchor="' + (anchor || "middle") + '">' + txt + "</text>"; };
      out += L("walls", 307, 135, "Roof") + L("walls", 307, 345, "Floor") + L("walls", 175, 235, "Lateral wall") + L("walls", 428, 240, "Medial wall");
      out += L("margins", 280, 56, "Superior margin") + L("margins", 280, 372, "Inferior margin") + L("margins", 92, 300, "Lateral", "start") + L("margins", 470, 190, "Medial", "end");
      out += L("openings", 372, 274, "Optic canal", "start") + L("openings", 232, 168, "Superior orbital fissure") + L("openings", 205, 352, "Inferior orbital fissure") + L("openings", 347, 54, "Supraorbital notch") + L("openings", 335, 440, "Infraorbital foramen") + L("openings", 480, 152, "Ethmoidal", "start") + L("openings", 480, 170, "foramina", "start");
      out += L("landmarks", 486, 298, "Lacrimal", "start") + L("landmarks", 486, 316, "fossa", "start") + L("landmarks", 430, 56, "Trochlear fossa") + L("landmarks", 125, 66, "Lacrimal gland fossa");
    } else {
      (ARROWS[cfg.target] || []).forEach(function (a) { out += arrowSVG(a); });
    }
    out += "</svg>";
    return out;
  }

  /* ---------- 3D viewer (Sketchfab embed, loaded on tap) and figures ---------- */
  function viewer3dHTML(list) {
    var models = Array.isArray(list) ? list : [list], i = 0;
    var tabs = models.length > 1
      ? '<div class="model-switch" role="group" aria-label="Choose a model">' + models.map(function (m, n) {
          return '<button type="button" data-m="' + n + '" aria-pressed="' + (n === 0) + '">' + esc(m.tab || m.title) + "</button>";
        }).join("") + "</div>"
      : "";
    return '<div class="viewer3d" data-models=\'' + esc(JSON.stringify(models)).replace(/'/g, "&#39;") + '\'>' + tabs + '<div class="mbody"></div></div>';
  }
  function renderModel(box, n) {
    var models = JSON.parse(box.getAttribute("data-models").replace(/&#39;/g, "'"));
    var m = models[n];
    box.querySelector(".mbody").innerHTML = '<div class="frame" data-embed="' + esc(m.embed) + '" data-title="' + esc(m.title) + '"><button class="btn primary load3d" type="button">Load the 3D model</button></div>' +
      '<p class="how">' + esc(m.how) + '</p><p class="credit">' + esc(m.credit) + ' <a href="' + esc(m.url) + '" target="_blank" rel="noopener">Open on Sketchfab</a></p>';
    wireMedia(box);
  }
  function wireMedia(root) {
    root.querySelectorAll(".viewer3d").forEach(function (box) {
      if (box.dataset.wired) return;
      box.dataset.wired = "1";
      box.querySelectorAll(".model-switch button").forEach(function (b) {
        b.addEventListener("click", function () {
          box.querySelectorAll(".model-switch button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
          renderModel(box, +b.dataset.m);
        });
      });
      renderModel(box, 0);
    });
    root.querySelectorAll(".load3d").forEach(function (b) {
      b.addEventListener("click", function () {
        var f = b.parentNode;
        f.innerHTML = '<iframe title="3D model: ' + esc(f.dataset.title) + '" allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen src="https://sketchfab.com/models/' + f.dataset.embed + '/embed?autostart=1&ui_infos=0&ui_ar=0&tracking=0&ui_watermark=0"></iframe>';
      });
    });
    root.querySelectorAll("figure.fig img").forEach(function (img) {
      img.addEventListener("error", function () {
        var cap = img.parentNode.querySelector("figcaption");
        img.replaceWith(Object.assign(document.createElement("p"), { className: "src", textContent: "The picture could not load. It needs an internet connection." }));
        if (cap) cap.style.display = "block";
      });
    });
  }

  /* ---------- left menu: subjects slide open to chapters, chapters slide open to lectures ---------- */
  var drawer = document.getElementById("drawer"), backdrop = document.getElementById("backdrop"), menuBtn = document.getElementById("menu-btn");
  var accN = 0;
  function accHTML(label, meta, inner, cls) {
    var id = "acc" + (++accN);
    return '<div class="acc ' + cls + '"><button class="accbtn" type="button" aria-expanded="false" aria-controls="' + id + '"><span class="lbl">' + esc(label) + "</span>" + (meta ? '<span class="pn">' + esc(meta) + "</span>" : "") + '<span class="chev" aria-hidden="true">\u203a</span></button>' +
      '<div class="accpanel" id="' + id + '"><div class="accinner">' + inner + "</div></div></div>";
  }
  function renderDrawer() {
    accN = 0;
    var h = '<div class="dhead"><span class="wordmark">Sina<span>.</span></span><button class="btn dclose" type="button">' + esc(T("nav.close")) + '</button></div>' +
      '<p class="dprog">' + esc(progName()) + '</p>' +
      '<a class="dlink" href="#/">' + esc(T("nav.home")) + '</a>';

    /* Category 0: Upcoming midterm lectures */
    if (progMidterms().length) {
      var midHTML = '<a class="dlink sub" href="#/midterm">All upcoming midterm lectures</a>' + progMidterms().map(function (m) {
        return '<p class="dsem">' + esc(m.title) + "</p>" + m.groups.map(function (g) {
          return accHTML(g.name, g.items.length + " lectures", '<ul class="dlist">' + g.items.map(function (id) {
            return S.lectures[id] ? '<li><a href="#/lecture/' + id + '">' + esc(lectureTitle(id)) + '<span class="dtag">Midterm</span></a></li>' : '<li><span class="dsoon-item"><span>' + esc(lectureTitle(id)) + "</span><em>Coming</em></span></li>";
          }).join("") + "</ul>", "chapter");
        }).join("");
      }).join("");
      h += accHTML("Upcoming midterm lectures", "", midHTML, "cat");
    }

    /* Category 1: Browse subjects (semesters, subjects, chapters, lectures) */
    var subjectsHTML = "";
    progSemesters().forEach(function (sem) {
      subjectsHTML += '<p class="dsem">' + esc(T("home.semester", { n: sem.replace(/^S/, "") })) + "</p>";
      progSubjects().filter(function (x) { return x.semester === sem; }).forEach(function (sub) {
        if (!sub.groups) { subjectsHTML += '<div class="dsoon"><span>' + esc(sub.name) + "</span><em>" + (sub.status === "next" ? "Up next" : "Planned") + "</em></div>"; return; }
        var chapters = sub.groups.map(function (g) {
          var n = g.items.filter(function (it) { return S.lectures[it.id]; }).length;
          var lectures = '<ul class="dlist">' + g.items.map(function (it) {
            if (!S.lectures[it.id]) return '<li><span class="dsoon-item"><span>' + esc(it.title) + "</span><em>Coming</em></span></li>";
            return '<li><a href="#/lecture/' + it.id + '">' + esc(it.title) + (onMidterm(it.id) ? '<span class="dtag">Midterm</span>' : "") + "</a></li>";
          }).join("") + "</ul>";
          return accHTML(g.name, n + " of " + g.items.length + " ready", lectures, "chapter");
        }).join("") + '<a class="dlink sub" href="#/subject/' + sub.id + '">Open the ' + esc(sub.name) + " page</a>";
        subjectsHTML += accHTML(sub.name, "", chapters, "subject");
      });
    });
    h += accHTML("Browse subjects", "", subjectsHTML, "cat");

    /* Category 2: Past papers, by subject */
    var withPapers = progSubjects().filter(function (sb) { return (S.papers || []).some(function (x) { return x.subject === sb.id; }); });
    var hasOther = (S.papers || []).some(function (x) { return x.program === PROG && !subjectById(x.subject); });
    var papersHTML = '<a class="dlink sub" href="#/papers">All past papers</a>' + withPapers.map(function (sb) {
      var n = (S.papers || []).filter(function (x) { return x.subject === sb.id; }).length;
      return '<a class="dlink sub" href="#/papers/' + sb.id + '"><span>' + esc(sb.name) + '</span><span class="pn">' + n + "</span></a>";
    }).join("") + (hasOther ? '<a class="dlink sub" href="#/papers">Other modules</a>' : "");
    var practiceSubs = progSubjects().filter(function (sb) { return practiceCount(sb).lec || practiceCount(sb).papers; });
    if (practiceSubs.length) h += accHTML("Practice questions", "", '<a class="dlink sub" href="#/practice">Choose a subject</a>' + practiceSubs.map(function (sb) {
      var c = practiceCount(sb);
      return '<a class="dlink sub" href="#/practice/' + sb.id + '"><span>' + esc(sb.name) + '</span><span class="pn">' + c.lec + "</span></a>";
    }).join(""), "cat");
    h += accHTML("Past papers", "", papersHTML, "cat");

    /* Category 3: Useful apps */
    var appsList = '<a class="dlink sub" href="#/apps">All useful apps</a>' + (S.apps || []).map(function (r) {
      return '<a class="dlink sub" href="' + esc(r.url) + '" target="_blank" rel="noopener"><span>' + esc(r.title) + '</span><span class="pn">' + esc(r.kind || "") + "</span></a>";
    }).join("");
    h += accHTML("Useful apps", "", appsList, "cat");
    if (S.usmle) h += '<a class="dlink" href="#/usmle"><span>USMLE prep</span><span class="pn">Step 1</span></a>';

    h += '<a class="dlink" href="#/updates"><span>' + esc(T("nav.updates")) + '</span>' + (newBadge() ? '<span class="badge">new</span>' : "") + "</a>";
    drawer.innerHTML = h;
    drawer.scrollTop = 0;
    drawer.querySelector(".dclose").addEventListener("click", function () {
      closeDrawer();
    });
    drawer.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeDrawer); });
    var dc = drawer.querySelector(".dclose");
    if (dc) dc.textContent = "Close";
    drawer.querySelectorAll(".accbtn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var acc = btn.parentNode, open = !acc.classList.contains("open");
        if (open) Array.prototype.forEach.call(acc.parentNode.children, function (sib) {
          if (sib !== acc && sib.classList && sib.classList.contains("acc")) { sib.classList.remove("open"); sib.querySelector(".accbtn").setAttribute("aria-expanded", "false"); }
        });
        acc.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", String(open));
      });
    });
  }
  function isOpen() { return drawer.classList.contains("is-open"); }
  function showDrawer(on, withBackdrop) {
    drawer.classList.toggle("is-open", on);
    drawer.setAttribute("aria-hidden", String(!on));
    backdrop.classList.toggle("is-open", !!(on && withBackdrop));
  }
  function openDrawer() {
    renderDrawer();
    showDrawer(true, true);
    document.body.classList.add("noscroll");
    menuBtn.setAttribute("aria-expanded", "true");
    var dc = drawer.querySelector(".dclose"); if (dc) dc.focus({ preventScroll: true });
  }
  function closeDrawer() {
    if (document.body.classList.contains("pinned")) return;
    if (!isOpen()) return;
    showDrawer(false, false);
    document.body.classList.remove("noscroll");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.focus({ preventScroll: true });
  }
  /* the menu is always an overlay: it never moves or resizes the page */
  function applyLayout() {
    if (document.body.classList.contains("pinned")) { document.body.classList.remove("pinned"); showDrawer(false, false); menuBtn.setAttribute("aria-expanded", "false"); }
  }
  menuBtn.addEventListener("click", function () { isOpen() ? closeDrawer() : openDrawer(); });
  backdrop.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeDrawer(); hideSearch(); } });
  drawer.querySelector && 0;

  /* ---------- search ---------- */
  function searchIndex() {
    var out = [];
    progSubjects().forEach(function (sub) {
      out.push({ kind: "Subject", title: sub.name, sub: sub.semester, href: sub.groups ? "#/subject/" + sub.id : null, hay: sub.name + " " + (sub.blurb || "") });
      (sub.groups || []).forEach(function (g) {
        g.items.forEach(function (it) {
          var lec = S.lectures[it.id], extra = "";
          if (lec) extra = (lec.exam || []).join(" ") + " " + (lec.summary || []).map(function (x) { return x.title; }).join(" ");
          out.push({ kind: lec ? "Lecture" : "Coming soon", title: it.title, sub: sub.name + " \u00b7 " + g.name,
                     href: lec ? "#/lecture/" + it.id : null, hay: it.title + " " + g.name + " " + sub.name + " " + extra });
        });
      });
    });
    progSubjects().forEach(function (sub) { (sub.groups || []).forEach(function (g) { g.items.forEach(function (it) {
      var L = S.lectures[it.id]; if (!L) return;
      var fig = L.visual && L.visual.figure;
      (L.mcqs || []).forEach(function (q, n) {
        if (q.target && !fig) return;
        out.push({ kind: "Question", deep: 1, title: q.q.replace(/\s*\(choose all\)\s*$/i, ""), sub: it.title, href: "#/find/q/" + it.id + "/" + n, hay: q.q + " " + q.options.join(" ") + " " + (q.why || "") + " " + (q.notes || []).join(" ") });
      });
      (L.cards || []).forEach(function (c) {
        if (c.type === "image") return;
        out.push({ kind: "Flashcard", deep: 1, title: c.front, sub: it.title, href: "#/find/c/" + it.id + "/" + encodeURIComponent(c.id), hay: c.front + " " + c.back });
      });
    }); }); });
    (S.papers || []).forEach(function (x) {
      out.push({ kind: "Past paper", title: x.title, sub: (subjectById(x.subject) || {}).name || "", href: "#/paper/" + x.id, hay: x.title + " " + (x.year || "") });
    });
    return out;
  }
  var IDX = null, sBox = document.getElementById("search"), sInput = document.getElementById("search-input"), sRes = document.getElementById("search-results");
  function hideSearch() { sRes.hidden = true; sBox.classList.remove("open"); }
  function searchHits(q) {
    q = q.toLowerCase();
    if (!IDX) IDX = searchIndex();
    var words = q.split(/\s+/), scored = [], deepN = { Question: 0, Flashcard: 0 };
    var rx = words.map(function (w) { return new RegExp("(^|[^a-z0-9])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![0-9])", "i"); });
    IDX.forEach(function (r) {
      if (r.deep) {
        if (!rx.every(function (x) { return x.test(r.hay); })) return;
        scored.push({ r: r, score: 3 + (rx.every(function (x) { return x.test(r.title); }) ? 0 : 0.5) + (r.kind === "Flashcard" ? 0.2 : 0) });
        return;
      }
      var title = r.title.toLowerCase(), hay = r.hay.toLowerCase();
      var inTitle = words.every(function (w) { return title.indexOf(w) > -1; });
      var inAll = words.every(function (w) { return hay.indexOf(w) > -1; });
      var anyTitle = words.some(function (w) { return title.indexOf(w) > -1; });
      if (!inTitle && !inAll && !anyTitle) return;
      var score = inTitle ? 0 : anyTitle ? 1 : 2;
      if (r.kind === "Lecture") score -= 0.5;
      scored.push({ r: r, score: score });
    });
    scored.sort(function (a, b) { return a.score - b.score; });
    var res = [];
    scored.forEach(function (x) { if (res.length >= 24) return; if (x.r.deep) { if (deepN[x.r.kind] >= (x.r.kind === "Question" ? 8 : 5)) return; deepN[x.r.kind]++; } res.push(x.r); });
    res.q = q; return res;
  }
  function markHit(text, q) {
    var h = esc(text); if (!q) return h;
    q.split(/\s+/).filter(Boolean).forEach(function (w) { var e = esc(w).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); h = h.replace(new RegExp("(^|[^a-z0-9&;])(" + e + ")(?![0-9])", "gi"), "$1<mark>$2</mark>"); });
    return h;
  }
  function hitsHTML(hits) {
    return hits.length
      ? hits.map(function (r) {
          var tt = r.deep ? markHit(r.title.length > 110 ? r.title.slice(0, 107) + "…" : r.title, hits.q) : esc(r.title);
          var inner = '<span class="sk' + (r.deep ? " deep" : "") + '">' + esc(r.kind) + '</span><span class="st">' + tt + '</span><span class="ss">' + esc(r.sub) + "</span>";
          return r.href ? '<a href="' + r.href + '">' + inner + "</a>" : '<span class="dim">' + inner + "</span>";
        }).join("")
      : '<p class="none">Nothing matches that yet.</p>';
  }
  function runSearch() {
    var q = sInput.value.trim();
    if (q.length < 2) { hideSearch(); return; }
    sRes.innerHTML = hitsHTML(searchHits(q));
    sRes.hidden = false; sBox.classList.add("open");
    sRes.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { sInput.value = ""; hideSearch(); closePhoneSearch(); }); });
  }
  /* On phones the header search is a magnifier button that opens a full-width bar. */
  var sToggle = document.getElementById("search-toggle");
  function closePhoneSearch() { document.body.classList.remove("search-open"); if (sToggle) sToggle.setAttribute("aria-expanded", "false"); }
  if (sToggle) sToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    var on = !document.body.classList.contains("search-open");
    document.body.classList.toggle("search-open", on); sToggle.setAttribute("aria-expanded", String(on));
    if (on) sInput.focus(); else hideSearch();
  });
  sInput.addEventListener("keydown", function (e) { if (e.key === "Escape") { hideSearch(); closePhoneSearch(); sInput.blur(); } });
  sInput.addEventListener("input", runSearch);
  sInput.addEventListener("focus", runSearch);
  document.addEventListener("click", function (e) { if (!sBox.contains(e.target) && e.target !== sToggle) { hideSearch(); closePhoneSearch(); } });

  /* ---------- generic labelled figure (schematic, drawn for this site) ---------- */
  function figArrow(a) {
    var sx = a.t[0] + a.d[0], sy = a.t[1] + a.d[1];
    var dx = a.t[0] - sx, dy = a.t[1] - sy, len = Math.sqrt(dx * dx + dy * dy) || 1;
    var ux = dx / len, uy = dy / len, gap = a.gap || 10;
    var ex = a.t[0] - ux * gap, ey = a.t[1] - uy * gap;
    var px = -uy, py = ux, hl = 13, hw = 6.5;
    var bx = ex - ux * hl, by = ey - uy * hl;
    return '<path class="arrow-halo" d="M ' + sx + " " + sy + " L " + bx + " " + by + '"/><path class="arrow-line" d="M ' + sx + " " + sy + " L " + bx + " " + by + '"/><polygon class="arrow-head" points="' + ex + "," + ey + " " + (bx + px * hw) + "," + (by + py * hw) + " " + (bx - px * hw) + "," + (by - py * hw) + '"/>';
  }
  /* wide box diagrams scroll sideways on phones: bring the target box into view */
  function centerTarget(root) {
    (root || document).querySelectorAll(".diagram-box").forEach(function (b) {
      var t = b.querySelector(".fpart.hl"); if (!t || b.scrollWidth <= b.clientWidth) return;
      var br = b.getBoundingClientRect(), tr = t.getBoundingClientRect();
      b.scrollLeft += (tr.left + tr.width / 2) - (br.left + br.width / 2);
    });    (root || document).querySelectorAll(".occ-scroll").forEach(function (b) {
      var t = b.querySelector(".otile.q"); if (!t || b.scrollWidth <= b.clientWidth) return;
      requestAnimationFrame(function () { var br = b.getBoundingClientRect(), tr = t.getBoundingClientRect(); b.scrollLeft += (tr.left + tr.width / 2) - (br.left + br.width / 2); });
    });
  }
  /* real anatomy pictures (js/data/photos.js): arrow on the structure for questions, numbered markers for the Visual tab */
  function photoFor(lid, target) { var ph = S.photos && S.photos[lid]; return ph && (!target || ph.pts[target]) ? ph : null; }
  function photoQ(lid, target) {
    var ph = photoFor(lid, target); if (!ph) return "";
    var p = ph.pts[target], X = p[0] * ph.w / 100, Y = p[1] * ph.h / 100, cx = ph.w / 2, cy = ph.h / 2;
    var dx = X - cx, dy = Y - cy, L = Math.sqrt(dx * dx + dy * dy) || 1, len = Math.max(ph.w, ph.h) * 0.13;
    var ux = L > 5 ? dx / L : -0.7, uy = L > 5 ? dy / L : -0.7;
    var tx = X + ux * len, ty = Y + uy * len;
    if (tx < 8 || tx > ph.w - 8 || ty < 8 || ty > ph.h - 8) { ux = -ux; uy = -uy; tx = X + ux * len; ty = Y + uy * len; }
    var gap = Math.max(ph.w, ph.h) * 0.012, hx = X + ux * gap, hy = Y + uy * gap, sw = Math.max(ph.w, ph.h) / 180;
    var hl = sw * 4.2, hw = sw * 2.6, bx = hx + ux * hl, by = hy + uy * hl, px = -uy, py = ux;
    var head = hx + "," + hy + " " + (bx + px * hw) + "," + (by + py * hw) + " " + (bx - px * hw) + "," + (by - py * hw);
    var arrow = '<line x1="' + tx + '" y1="' + ty + '" x2="' + bx + '" y2="' + by + '" class="pa-o" stroke-width="' + sw * 2.4 + '"/><polygon points="' + head + '" class="pa-o" stroke-width="' + sw * 1.4 + '"/>' +
      '<line x1="' + tx + '" y1="' + ty + '" x2="' + bx + '" y2="' + by + '" class="pa" stroke-width="' + sw + '"/><polygon points="' + head + '" class="pa-f"/>';
    return '<figure class="photo-q"><div class="photo-wrap"><img src="' + esc(ph.src) + '" alt="Anatomy picture with an arrow" width="' + ph.w + '" height="' + ph.h + '"><svg viewBox="0 0 ' + ph.w + " " + ph.h + '" aria-hidden="true">' + arrow + "</svg></div><figcaption>" + esc(ph.credit) + "</figcaption></figure>";
  }
  function photoLabelled(lid, fig) {
    var ph = photoFor(lid); if (!ph) return "";
    var ids = Object.keys(fig.parts).filter(function (id) { return ph.pts[id]; }), r = Math.max(ph.w, ph.h) / 60;
    var marks = ids.map(function (id, n) { var p = ph.pts[id], X = p[0] * ph.w / 100, Y = p[1] * ph.h / 100;
      return '<circle cx="' + X + '" cy="' + Y + '" r="' + r + '" class="pm"/><text x="' + X + '" y="' + (Y + r * 0.42) + '" font-size="' + r * 1.25 + '" class="pmt">' + (n + 1) + "</text>"; }).join("");
    return '<figure class="photo-q"><div class="photo-wrap"><img src="' + esc(ph.src) + '" alt="Labelled anatomy picture" width="' + ph.w + '" height="' + ph.h + '"><svg viewBox="0 0 ' + ph.w + " " + ph.h + '" aria-hidden="true">' + marks + "</svg></div><figcaption>" + esc(ph.credit) + "</figcaption></figure>" +
      '<ol class="photo-legend">' + ids.map(function (id) { return "<li>" + esc([].concat(fig.parts[id].label || id).join(" ")) + "</li>"; }).join("") + "</ol>";
  }
  function isBoxFig(fig) { var ks = Object.keys(fig.parts || {}); return ks.length > 0 && ks.every(function (id) { return /^\s*<rect/.test(fig.parts[id].shape || ""); }); }
  function figQText(q, fig) { return q.target && fig && isBoxFig(fig) && /at the arrow\?$/.test(q.q) ? "Which element belongs in the box marked \u201c?\u201d?" : String(q.q).replace(/\s*\(choose all\)\s*$/i, ""); }
  function figureSVG(fig, cfg) {
    cfg = cfg || {};
    var quiz = cfg.mode === "quiz", uid = cfg.uid || "f";
    /* box diagrams (flowcharts, timelines): in a quiz, show every label except the target, which shows "?" */
    var boxes = quiz && isBoxFig(fig);
    var out = '<svg class="fig-svg' + (quiz ? " quiz" : "") + (isBoxFig(fig) ? " boxfig" : "") + '" viewBox="' + fig.viewBox + '" role="img" aria-label="' + esc(fig.alt || "Schematic diagram") + '">';
    out += fig.base || "";
    Object.keys(fig.parts).forEach(function (id) {
      var pt = fig.parts[id];
      var on = quiz && cfg.target === id;
      out += '<g class="fpart' + (on ? " hl" : "") + '" data-id="' + id + '">' + (pt.shape || "") + "</g>";
    });
    if (!quiz || boxes) {
      Object.keys(fig.parts).forEach(function (id) {
        var pt = fig.parts[id];
        if (boxes && id === cfg.target) { out += '<text class="flbl qmark" x="' + pt.lx + '" y="' + (pt.ly + (Array.isArray(pt.label) && pt.label.length > 1 ? 8 : 0)) + '" text-anchor="' + (pt.anchor || "middle") + '">?</text>'; return; }
        if (!pt.label) return;
        if (pt.lead) out += '<path class="guide" d="M ' + pt.lead.map(function (q) { return q[0] + " " + q[1]; }).join(" L ") + '"/>';
        (Array.isArray(pt.label) ? pt.label : [pt.label]).forEach(function (line, i) {
          out += '<text class="flbl" x="' + pt.lx + '" y="' + (pt.ly + i * 16) + '" text-anchor="' + (pt.anchor || "middle") + '">' + esc(line) + "</text>";
        });
      });
    }
    if (quiz && !boxes) {
      ((fig.arrows && fig.arrows[cfg.target]) || []).forEach(function (a) { out += figArrow(a); });
    }
    return out + "</svg>";
  }

  /* ---------- views ---------- */
  function setView(html, title) {
    app.innerHTML = html;
    app.classList.remove("page-in"); void app.offsetWidth; app.classList.add("page-in");
    document.title = (title ? title + " | " : "") + "Sina";
    window.scrollTo(0, 0);
    var h = app.querySelector("h1"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }

  function appsHTML() {
    var list = S.usefulApps || []; if (!list.length) return "";
    return '<ul class="apps-grid">' + list.map(function (a) {
      var mono = esc(a.name.charAt(0));
      return '<li class="app-card"><div class="app-top"><span class="app-icon" aria-hidden="true"><span class="mono">' + mono + '</span>' +
        (a.domain ? '<img alt="" loading="lazy" src="https://www.google.com/s2/favicons?domain=' + esc(a.domain) + '&sz=64" onerror="this.remove()">' : "") + "</span>" +
        '<span class="app-head"><span class="app-name">' + esc(a.name) + '</span><span class="app-kind">' + esc(a.kind || "") + "</span></span></div>" +
        '<p class="app-desc">' + esc(a.desc) + "</p>" +
        '<div class="app-plat">' + (a.platforms || []).map(function (p) { return '<span class="chip">' + esc(p) + "</span>"; }).join("") + "</div>" +
        '<div class="app-actions">' + a.links.map(function (l, n) { return '<a class="btn' + (n === 0 ? " primary" : "") + '" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>"; }).join("") + "</div></li>";
    }).join("") + "</ul>";
  }
  function appsView() {
    setView('<div class="wrap wide"><p class="crumbs"><a href="#/">Home</a> / Useful apps</p><h1>Useful apps and resources</h1><p class="meta">Apps and websites recommended for medical students. They open in a new tab.</p>' + appsHTML() + "</div>", "Useful apps");
  }

  /* ---------- USMLE prep ---------- */
  function usmleView() {
    var U = S.usmle || { sections: [] };
    var COST = { "Free": "free", "Free trial": "trial", "Paid": "paid" };
    var html = '<div class="wrap wide"><p class="crumbs"><a href="#/">Home</a> / USMLE prep</p><h1>USMLE Step 1 prep</h1>' +
      '<p class="lede">Resources for students preparing for the USMLE Step 1 alongside the medical school curriculum. Start with the free ones; the paid ones are listed so you know what people mean when they mention them.</p>';
    html += '<div class="usmle-drive usmle-ak"><div><h2>AnKing Step 1</h2><p>All AnKing Step 1 flashcards as MCQs or Anki flashcards, with pictures.<br>Needs password.</p></div><a class="btn primary" href="#/anking">Open</a></div>';
    if (U.drive) html += '<div class="usmle-drive"><div><h2>Shared PDF folder</h2><p>High-yield PDFs and documents collected for the promo, all in one Google Drive folder. New files are added regularly.</p></div><a class="btn primary" href="' + esc(U.drive) + '" target="_blank" rel="noopener">Open the Drive folder</a></div>';
    U.sections.forEach(function (sec) {
      html += "<h2>" + esc(sec.title) + '</h2><ul class="apps-grid">' + sec.items.map(function (a) {
        return '<li class="app-card"><div class="app-top"><span class="app-icon" aria-hidden="true"><span class="mono">' + esc(a.name.charAt(0)) + '</span>' +
          (a.domain ? '<img alt="" loading="lazy" src="https://www.google.com/s2/favicons?domain=' + esc(a.domain) + '&sz=64" onerror="this.remove()">' : "") + "</span>" +
          '<span class="app-head"><span class="app-name">' + esc(a.name) + '</span><span class="app-kind">' + esc(a.kind || "") + "</span></span></div>" +
          '<div class="app-plat"><span class="chip cost-' + (COST[a.cost] || "paid") + '">' + esc(a.cost) + "</span></div>" +
          '<p class="app-desc">' + esc(a.desc) + "</p>" +
          '<div class="app-actions">' + a.links.map(function (l, n) { return '<a class="btn' + (n === 0 ? " primary" : "") + '" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>"; }).join("") + "</div></li>";
      }).join("") + "</ul>";
    });
    html += '<p class="src" style="margin-top:1.6rem">Links open the official sites in a new tab. Suggestions for this page are welcome through the feedback form.</p>';
    setView(html + "</div>", "USMLE prep");
  }

  /* ---------- Anki-style flashcard scheduling, shared by AnKing and lecture flashcards ----------
     entry = [due day, interval in days (0 = still learning), ease x100, lapses] */
  function srsNext(e, g) {
    var d = dayNo(), ivl = e ? e[1] : 0, ease = e ? e[2] : 250, lap = e ? e[3] : 0, n;
    if (g === 1) { if (ivl > 0) { lap++; ease = Math.max(130, ease - 20); } return [d, 0, ease, lap]; }
    if (ivl < 1) { if (g === 2) return [d, 0, ease, lap]; n = g === 4 ? 4 : 1; }
    else if (g === 2) { n = Math.max(ivl + 1, Math.round(ivl * 1.2)); ease = Math.max(130, ease - 15); }
    else if (g === 3) n = Math.max(ivl + 1, Math.round(ivl * ease / 100));
    else { n = Math.max(ivl + 2, Math.round(ivl * ease / 100 * 1.3)); ease += 15; }
    n = Math.min(n, 3650); return [d + n, n, ease, lap];
  }
  function srsFmt(n) { return !n ? "<10m" : n < 30 ? n + "d" : n < 365 ? Math.round(n / 30) + "mo" : Math.round(n / 36.5) / 10 + "y"; }
  function rateHTML(e) {
    return '<div class="fc-rate" role="group" aria-label="How well did you know it?">' + [[1, "Again", "r1"], [2, "Hard", "r2"], [3, "Good", "r3"], [4, "Easy", "r4"]].map(function (b) {
      return '<button type="button" class="btn ' + b[2] + '" data-g="' + b[0] + '"><span>' + b[1] + "</span><small>" + srsFmt(srsNext(e, b[0])[1]) + "</small></button>";
    }).join("") + "</div>";
  }
  function akLog(k) { var l = store.get("sina:aklog", {}), d = dayNo(); l[d] = l[d] || [0, 0]; l[d][k]++; var ks = Object.keys(l); if (ks.length > 400) ks.sort().slice(0, ks.length - 400).forEach(function (x) { delete l[x]; }); store.set("sina:aklog", l); }
  function fcLog() { var l = store.get("sina:fclog", {}), d = dayNo(); l[d] = (l[d] || 0) + 1; var ks = Object.keys(l); if (ks.length > 400) ks.sort().slice(0, ks.length - 400).forEach(function (x) { delete l[x]; }); store.set("sina:fclog", l); }
  /* Anki-style review heatmap: the last year, one square per day, darker = more reviews */
  function heatHTML(cnt, what) {
    var d = dayNo(), start = d - 364, MS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    start -= (new Date(start * 864e5).getUTCDay() + 6) % 7;
    var mx = 0, tot = 0, act = 0, first = null, best = 0, run = 0;
    for (var x = start; x <= d; x++) { var v = cnt[x] || 0; if (v > mx) mx = v; tot += v; if (v) { act++; if (first === null) first = x; run++; if (run > best) best = run; } else run = 0; }
    var cur = 0; for (var y = d; cnt[y]; y--) cur++; if (!cur) for (var z = d - 1; cnt[z]; z--) cur++;
    var cols = "", months = "";
    for (var c = start, ci = 0; c <= d; c += 7, ci++) {
      var col = "";
      for (var k = 0; k < 7; k++) {
        var day = c + k; if (day > d) { col += '<i class="hm-x"></i>'; continue; }
        var n = cnt[day] || 0, lv = n ? Math.min(4, Math.ceil(n / Math.max(mx, 1) * 4)) : 0, dt = new Date(day * 864e5);
        col += '<i class="hm-' + lv + (day === d ? " hm-today" : "") + '" data-h="' + dt.getUTCDate() + " " + MS[dt.getUTCMonth()] + " " + dt.getUTCFullYear() + ": " + n + " " + what + '" title="' + dt.getUTCDate() + " " + MS[dt.getUTCMonth()] + ": " + n + '"></i>';
      }
      var m0 = new Date(c * 864e5), m6 = new Date(Math.min(c + 6, d) * 864e5);
      months += "<span>" + (ci === 0 || m6.getUTCMonth() !== m0.getUTCMonth() || m0.getUTCDate() === 1 ? MS[m6.getUTCMonth()] : "") + "</span>";
      cols += '<div class="hm-col">' + col + "</div>";
    }
    var span = first === null ? 0 : d - first + 1;
    return '<div class="hm"><div class="hm-scroll"><div class="hm-months">' + months + '</div><div class="hm-grid">' + cols + "</div></div>" +
      '<p class="hm-tip" aria-live="polite">' + (tot ? "Tap a day to see its count." : "Each square is a day. It fills in as you study.") + "</p>" +
      '<div class="hm-stats"><div><b>' + (act ? Math.round(tot / act) : 0) + '</b><span>daily average</span></div><div><b>' + (span ? Math.round(act / span * 100) : 0) + '%</b><span>days studied</span></div><div><b>' + best + '</b><span>longest streak</span></div><div><b>' + cur + '</b><span>current streak</span></div></div>' +
      '<div class="hm-key" aria-hidden="true">Less <i class="hm-0"></i><i class="hm-1"></i><i class="hm-2"></i><i class="hm-3"></i><i class="hm-4"></i> More</div></div>';
  }
  function heatWire(root) {
    root.querySelectorAll(".hm").forEach(function (h) {
      var sc = h.querySelector(".hm-scroll"), tip = h.querySelector(".hm-tip"); sc.scrollLeft = sc.scrollWidth;
      h.querySelector(".hm-grid").addEventListener("click", function (e) { var c = e.target.closest("[data-h]"); if (!c) return; h.querySelectorAll(".hm-sel").forEach(function (x) { x.classList.remove("hm-sel"); }); c.classList.add("hm-sel"); tip.textContent = c.dataset.h; });
    });
  }
  function akDue(day) { var a = store.get("sina:aksrs", {}), n = 0; if (day == null) day = dayNo(); Object.keys(a).forEach(function (f) { var m = a[f]; for (var k in m) if (m[k][0] <= day) n++; }); return n; }
  function fcDue(day) { var a = store.get("sina:fcsrs", {}), n = 0; if (day == null) day = dayNo(); for (var k in a) if (a[k][0] <= day && inProgram(k.split("|")[0])) n++; return n; }
  function allDue(day) { return dueList(day).length + akDue(day) + fcDue(day); }
  var remT; function remindSoon() { clearTimeout(remT); remT = setTimeout(remindSync, 4000); }
  /* keyboard for the card on screen: space or Enter flips, 1-4 rates */
  var FCK = null;
  document.addEventListener("keydown", function (e) {
    if (!FCK || !document.body.contains(FCK.el) || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.ctrlKey || e.metaKey || e.altKey) return;
    FCK.key(e);
  });
  function fcKeys(el, shown, flip, rate) {
    FCK = { el: el, key: function (e) {
      if ((e.key === " " || e.key === "Enter") && !shown()) { if (e.target.closest && e.target.closest("button, a")) return; e.preventDefault(); flip(); }
      else if (shown() && /^[1-4]$/.test(e.key)) { e.preventDefault(); rate(+e.key); }
    } };
  }
  /* tap to show the answer; once shown, swipe right = Good, left = Again */
  function fcWire(card, shown, flip, swipe) {
    var sx = 0, sy = 0, dx = 0, drag = false, moved = false;
    card.addEventListener("touchstart", function (e) { moved = false; dx = 0; drag = shown(); if (!drag) return; sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    card.addEventListener("touchmove", function (e) {
      if (!drag) return; dx = e.touches[0].clientX - sx; var dy = e.touches[0].clientY - sy;
      if (!moved && Math.abs(dy) > Math.abs(dx)) { drag = false; return; }
      if (Math.abs(dx) > 8) moved = true;
      card.classList.toggle("lean-r", dx > 60); card.classList.toggle("lean-l", dx < -60);
    }, { passive: true });
    card.addEventListener("touchend", function () {
      if (!drag) return; drag = false; card.classList.remove("lean-r", "lean-l");
      if (Math.abs(dx) > 90) swipe(dx > 0 ? 1 : -1);
    });
    card.addEventListener("click", function (e) { if (moved) { moved = false; return; } if (e.target.closest("a, button")) return; flip(); });
  }
  function fcOut(card, dir, done) { done(); }
  /* question bar: previous / position (opens the question map) / mark / next, right above the question */
  var CHK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function qbarHTML(i, n, marked, fwdLab, primary, sticky) {
    return '<div class="qbar' + (sticky ? " sticky" : "") + '"><button class="btn qb-prev" id="prev" type="button"' + (i ? "" : " disabled") + ' aria-label="Previous question">&larr;<span class="qb-l"> Previous</span></button>' +
      '<button type="button" class="qb-pos" id="qgrid" aria-expanded="false" aria-controls="qgridp"></button>' +
      '<button type="button" class="qb-mark" id="qmark" aria-pressed="' + !!marked[i] + '" title="Mark this question to come back to it">' + CHK + "<span>" + (marked[i] ? "Marked" : "Mark") + "</span></button>" +
      '<button class="btn qb-next' + (primary ? " primary" : "") + '" id="fwd" type="button">' + fwdLab + " &rarr;</button></div>" +
      '<div class="qgrid" id="qgridp" hidden></div>';
  }
  function qbarWire(root, o) {
    var mb = root.querySelector("#qmark"), gb = root.querySelector("#qgrid"), gp = root.querySelector("#qgridp");
    function cnt() { var m = 0; for (var k in o.marked) if (o.marked[k]) m++; return m; }
    function lab() { var m = cnt(); gb.innerHTML = "<span>" + (o.i + 1) + " / " + o.n + "</span>" + (m ? '<span class="qb-mn">' + CHK + m + "</span>" : "") + '<svg class="qb-chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'; gb.setAttribute("aria-label", "Question " + (o.i + 1) + " of " + o.n + (m ? ", " + m + " marked" : "") + ". Show all questions"); }
    function fill() {
      var h = '<p class="qg-h">Tap a number to go to that question.' + (cnt() ? " Ticked ones are marked." : "") + '</p><div class="qg-list">';
      for (var k = 0; k < o.n; k++) h += '<button type="button" class="qg ' + o.state(k) + (o.marked[k] ? " mk" : "") + (k === o.i ? " cur" : "") + '" data-k="' + k + '">' + (k + 1) + "</button>";
      gp.innerHTML = h + "</div>";
      gp.querySelectorAll("[data-k]").forEach(function (b) { b.onclick = function () { o.go(+b.dataset.k); }; });
    }
    mb.onclick = function () { var on = !o.marked[o.i]; o.marked[o.i] = on; mb.setAttribute("aria-pressed", String(on)); mb.querySelector("span").textContent = on ? "Marked" : "Mark"; lab(); if (!gp.hidden) fill(); };
    gb.onclick = function () { var op = gp.hidden; gp.hidden = !op; gb.setAttribute("aria-expanded", String(op)); if (op) fill(); };
    lab();
  }
  function markedList(m) { return Object.keys(m).filter(function (k) { return m[k]; }).map(Number).sort(function (a, b) { return a - b; }); }

  /* ---------- AnKing Step 1 as MCQs: password-locked, everything stored encrypted (files/ak) ----------
     Key = PBKDF2-SHA256(password, salt) -> AES-GCM. The key (not the password) is kept on the device after the first unlock. */
  var AK = { meta: null, key: null, subs: {}, img: {} }, LET = "abcdefgh";
  function akHex(h) { var a = new Uint8Array(h.length / 2); for (var i = 0; i < a.length; i++) a[i] = parseInt(h.substr(i * 2, 2), 16); return a; }
  function akDec(buf) { var b = new Uint8Array(buf); return crypto.subtle.decrypt({ name: "AES-GCM", iv: b.slice(0, 12) }, AK.key, b.slice(12)); }
  function akText(hex) { return akDec(akHex(hex)).then(function (x) { return new TextDecoder().decode(x); }); }
  function akMeta() { return AK.meta ? Promise.resolve(AK.meta) : fetch("files/ak/meta.json", { cache: "no-cache" }).then(function (r) { return r.json(); }).then(function (m) { AK.meta = m; return m; }); }
  /* the password unlocks the data key (meta.wrap); curly quotes from phone keyboards count as straight ones */
  function akPw(p) { return String(p).trim().replace(/[\u2018\u2019\u201B\u2032`\u00B4]/g, "'"); }
  function akUnlock(pw) {
    return akMeta().then(function (m) {
      return crypto.subtle.importKey("raw", new TextEncoder().encode(akPw(pw)), "PBKDF2", false, ["deriveKey"]).then(function (base) {
        return crypto.subtle.deriveKey({ name: "PBKDF2", salt: akHex(m.wsalt), iterations: m.iter, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
      }).then(function (kek) { var w = akHex(m.wrap); return crypto.subtle.decrypt({ name: "AES-GCM", iv: w.slice(0, 12) }, kek, w.slice(12)); })
        .then(function (raw) { return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, true, ["decrypt"]); });
    }).then(function (k) { AK.key = k; return akText(AK.meta.check); }).then(function (t) {
      if (t !== "sina-ak-ok") throw new Error("bad");
      return crypto.subtle.exportKey("raw", AK.key).then(function (raw) { store.set("sina:akkey", Array.prototype.map.call(new Uint8Array(raw), function (x) { return ("0" + x.toString(16)).slice(-2); }).join("")); });
    });
  }
  function akSaved() {
    var h = store.get("sina:akkey", ""); if (!h || !window.crypto || !crypto.subtle) return Promise.reject();
    return akMeta().then(function () { return crypto.subtle.importKey("raw", akHex(h), { name: "AES-GCM" }, true, ["decrypt"]); })
      .then(function (k) { AK.key = k; return akText(AK.meta.check); }).then(function (t) { if (t !== "sina-ak-ok") throw new Error("bad"); });
  }
  function akSubject(s) {
    if (AK.subs[s.f]) return Promise.resolve(AK.subs[s.f]);
    return fetch("files/ak/q/" + s.f + ".bin").then(function (r) { if (!r.ok) throw new Error("net"); return r.arrayBuffer(); }).then(akDec).then(function (gz) {
      return new Response(new Blob([gz]).stream().pipeThrough(new DecompressionStream("gzip"))).text();
    }).then(function (t) { var a = JSON.parse(t); a.forEach(function (q) { q._f = s.f; }); AK.subs[s.f] = a; return a; });
  }
  var AK_MEDIA = "https://sina-med.github.io/ak-media/i/";
  function akImages(root) {
    root.querySelectorAll("img[data-ak], img[data-akr]").forEach(function (im) {
      var r = im.hasAttribute("data-akr"), id = im.getAttribute(r ? "data-akr" : "data-ak"); im.removeAttribute(r ? "data-akr" : "data-ak"); im.className = "ak-img"; im.loading = "lazy";
      if (AK.img[id]) { im.src = AK.img[id]; return; }
      fetch((r ? AK_MEDIA : "files/ak/i/") + id + ".bin").then(function (r) { if (!r.ok) throw new Error("net"); return r.arrayBuffer(); }).then(akDec)
        .then(function (b) { AK.img[id] = URL.createObjectURL(new Blob([b], { type: r ? "image/avif" : "image/webp" })); im.src = AK.img[id]; })
        .catch(function () { im.remove(); });
    });
  }
  /* question HTML was cleaned at build time; strip anything but simple formatting again here */
  function akSafe(h) { return String(h || "").replace(/<(\/?)([a-z0-9]+)([^>]*)>/gi, function (m, c, n, rest) { n = n.toLowerCase(); if (n === "img") { var d = /data-ak="([0-9a-f]+)"/.exec(rest); return d ? '<img data-ak="' + d[1] + '" alt="">' : ""; } if (n === "span" && !c) return /ak-blank/.test(rest) ? '<span class="ak-blank">' : "<span>"; return /^(b|i|u|sub|sup|br|ul|ol|li|table|tbody|thead|tr|td|th|span)$/.test(n) ? "<" + c + n + ">" : ""; }); }
  /* Sketchy / Pixorize / Physeo pictures: one slider, swipe or arrows, tap a picture to enlarge it */
  function akCarousel(res) {
    var sl = [], names = [];
    (res || []).forEach(function (r) {
      var ids = r[1].filter(function (x) { return /^[0-9a-f]+$/.test(x); }); if (!ids.length) return;
      names.push(r[0] + " (" + ids.length + ")");
      ids.forEach(function (id, n) { sl.push({ id: id, cap: r[0] + (ids.length > 1 ? " · " + (n + 1) + " of " + ids.length : "") }); });
    });
    if (!sl.length) return "";
    return '<section class="ak-car" aria-label="Pictures"><div class="ak-car-head"><span class="ak-car-t">' + esc(names.join(" · ")) + '</span><span class="ak-car-n" aria-live="polite">1 / ' + sl.length + "</span></div>" +
      '<div class="ak-car-track" tabindex="0" aria-label="Pictures, swipe to see the next one">' + sl.map(function (x) { return '<figure class="ak-slide" data-id="' + x.id + '"><div class="ak-slide-img"><span class="ak-car-load">Loading…</span></div><figcaption>' + esc(x.cap) + "</figcaption></figure>"; }).join("") + "</div>" +
      (sl.length > 1 ? '<button type="button" class="ak-car-b prev" aria-label="Previous picture">&lsaquo;</button><button type="button" class="ak-car-b next" aria-label="Next picture">&rsaquo;</button>' + (sl.length <= 20 ? '<div class="ak-car-dots" aria-hidden="true">' + sl.map(function (x, j) { return "<i" + (j ? "" : ' class="on"') + "></i>"; }).join("") + "</div>" : "") : "") + "</section>";
  }
  function akCarInit(root) {
    root.querySelectorAll(".ak-car").forEach(function (c) {
      if (c._on) return; c._on = 1;
      var tr = c.querySelector(".ak-car-track"), sl = tr.children, cnt = c.querySelector(".ak-car-n"), dots = c.querySelectorAll(".ak-car-dots i"), cur = -1;
      function load(k) { var f = sl[k]; if (!f || f.dataset.l) return; f.dataset.l = "1"; var box = f.querySelector(".ak-slide-img"); box.innerHTML = '<img data-akr="' + f.dataset.id + '" alt="' + esc(f.querySelector("figcaption").textContent) + '">'; akImages(box); }
      function at() {
        var k = Math.max(0, Math.min(sl.length - 1, Math.round(tr.scrollLeft / Math.max(1, tr.clientWidth)))); if (k === cur) return; cur = k;
        load(k); load(k + 1); cnt.textContent = (k + 1) + " / " + sl.length;
        dots.forEach(function (d, j) { d.classList.toggle("on", j === k); });
        var pv = c.querySelector(".prev"), nx = c.querySelector(".next"); if (pv) pv.disabled = k === 0; if (nx) nx.disabled = k === sl.length - 1;
      }
      function go(k) { k = Math.max(0, Math.min(sl.length - 1, k)); load(k); tr.scrollTo({ left: k * tr.clientWidth, behavior: REDUCE ? "auto" : "smooth" }); }
      tr.addEventListener("scroll", function () { clearTimeout(tr._t); tr._t = setTimeout(at, 60); }, { passive: true });
      var pv = c.querySelector(".prev"), nx = c.querySelector(".next");
      if (pv) pv.onclick = function () { go(cur - 1); }; if (nx) nx.onclick = function () { go(cur + 1); };
      tr.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") { e.preventDefault(); go(cur + 1); } else if (e.key === "ArrowLeft") { e.preventDefault(); go(cur - 1); } });
      tr.addEventListener("click", function (e) { var im = e.target.closest("img"); if (im && im.src) akZoom(im.src, im.alt); });
      at();
    });
  }
  function akZoom(src, alt) {
    var o = document.createElement("div"); o.className = "ak-zoom"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", "Picture");
    o.innerHTML = '<button type="button" class="ak-zoom-x" aria-label="Close">&times;</button><div class="ak-zoom-in"><img alt=""></div><p class="ak-zoom-tip">Tap the picture to zoom in or out</p>';
    var im = o.querySelector("img"); im.src = src; im.alt = alt || "";
    document.body.appendChild(o); document.body.style.overflow = "hidden";
    function close() { o.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", k); window.removeEventListener("hashchange", close); }
    function k(e) { if (e.key === "Escape") close(); }
    o.querySelector(".ak-zoom-x").onclick = close; document.addEventListener("keydown", k); window.addEventListener("hashchange", close);
    o.addEventListener("click", function (e) { if (e.target === o || e.target.classList.contains("ak-zoom-in")) close(); });
    im.onclick = function () { im.classList.toggle("big"); };
    o.querySelector(".ak-zoom-x").focus();
  }
  /* the answer filled into the blanks, for the back of a flashcard */
  function akFill(q) {
    var h = akSafe(q.q), parts = String(q.options[q.answer]).split(" … "), n = (h.match(/<span class="ak-blank">[^<]*<\/span>/g) || []).length, k = 0;
    if (parts.length !== n) parts = [q.options[q.answer]];
    return h.replace(/<span class="ak-blank">[^<]*<\/span>/g, function () { var p = parts[k++]; return p === undefined ? "" : '<span class="ak-ans">' + esc(p) + "</span>"; });
  }
  function akBase() { return '<div class="wrap"><p class="crumbs"><a href="#/">Home</a> / <a href="#/usmle">USMLE prep</a> / AnKing</p><h1>AnKing Step 1</h1>'; }
  function akFail() { setView('<div class="wrap"><p>Could not load these cards. Check the connection and try again.</p><p><a class="btn" href="#/anking">Back</a></p></div>', "AnKing"); }
  function akGoHome() { if (location.hash === "#/anking") akHome(); else location.hash = "#/anking"; }
  function ankingView(sub) {
    var base = akBase(), go = sub === "review" ? akReviewAll : akHome;
    if (!window.crypto || !crypto.subtle || typeof DecompressionStream === "undefined") { setView(base + "<p>This browser is too old for this section. Update it, or open the site in a recent Chrome or Safari.</p></div>", "AnKing"); return; }
    setView(base + '<p class="meta">Loading…</p></div>', "AnKing");
    akSaved().then(go, function () { akLock(base, null, go); });
  }
  function akLock(base, err, go) {
    setView(base + '<p class="lede-s">This section is private. Enter the password you were given.</p>' +
      '<form id="akf" class="ak-lock"><input id="akpw" type="password" autocomplete="current-password" placeholder="Password" aria-label="Password"><button class="btn primary" type="submit">Unlock</button></form>' +
      (err ? '<p class="ak-err" role="alert">' + esc(err) + "</p>" : "") + "</div>", "AnKing");
    var f = document.getElementById("akf"), pw = document.getElementById("akpw"); pw.focus();
    f.onsubmit = function (e) {
      e.preventDefault(); if (!pw.value) return;
      f.querySelector("button").disabled = true; f.querySelector("button").textContent = "Checking…";
      akUnlock(pw.value).then(function () { ev("anking-unlock"); (go || akHome)(); }, function () { akLock(base, "Wrong password.", go); });
    };
  }
  function akLabels() { return Promise.all(AK.meta.subjects.map(function (s) { return s.label ? s.label : akText(s.name).then(function (t) { s.label = t; return t; }); })); }
  function akCards_() { return store.get("sina:akmode", "q") === "c"; }
  function akToolsHTML() {
    var cm = akCards_(), cnt = store.get("sina:akcount", "20");
    return '<div class="ak-tools"><div class="lang-tog ak-mode" role="group" aria-label="Study mode"><button type="button" data-mode="q" aria-pressed="' + !cm + '">Questions</button><button type="button" data-mode="c" aria-pressed="' + cm + '">Flashcards</button></div>' +
      '<div class="chips quick" role="group" aria-label="' + (cm ? "New cards per session" : "Number of questions") + '">' + ["10", "20", "40", "100"].map(function (n) { return '<button type="button" data-c="' + n + '"' + (n === cnt ? ' class="on" aria-pressed="true"' : ' aria-pressed="false"') + ">" + n + (cm ? " new cards" : " questions") + "</button>"; }).join("") + "</div></div>";
  }
  function akToolsWire(redraw) {
    app.querySelectorAll("[data-mode]").forEach(function (b) { b.onclick = function () { store.set("sina:akmode", b.dataset.mode); redraw(); }; });
    app.querySelectorAll("[data-c]").forEach(function (b) { b.onclick = function () { store.set("sina:akcount", b.dataset.c); app.querySelectorAll("[data-c]").forEach(function (x) { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", String(x === b)); }); }; });
  }
  function akDueHTML() {
    var due = akDue();
    return '<div class="ak-due' + (due ? " hot" : "") + '"><div><strong>' + (due ? due.toLocaleString("en") + " flashcard" + (due > 1 ? "s" : "") + " due today" : "No flashcards due today") + "</strong><span>" +
      (due ? "From every chapter you have started." : "Cards you study come back here when they are due.") + "</span></div>" +
      (due ? '<a class="btn primary" href="#/anking/review">Review now</a>' : '<a class="btn" href="#/reminders">Daily reminder</a>') + "</div>";
  }
  /* progress tracker: cards learned, questions seen, accuracy, streak, the next 7 days and each chapter */
  function akTrackHTML() {
    var m = AK.meta, seen = store.get("sina:akseen", {}), sr = store.get("sina:aksrs", {}), log = store.get("sina:aklog", {}), d = dayNo();
    var learned = 0, studied = 0, qs = 0, ok = 0, fc = [0, 0, 0, 0, 0, 0, 0], rows = [];
    m.subjects.forEach(function (s) {
      var a = seen[s.f] || {}, b = sr[s.f] || {}, cov = {};
      for (var k in a) { qs++; if (a[k]) ok++; cov[k] = 1; }
      for (var k2 in b) { studied++; if (b[k2][1] > 0) learned++; cov[k2] = 1; var dd = Math.max(0, b[k2][0] - d); if (dd < 7) fc[dd]++; }
      var n = Object.keys(cov).length; if (n) rows.push({ s: s, n: n, pct: Math.round(n / s.n * 100) });
    });
    var streak = 0; for (var x = d; log[x] && (log[x][0] || log[x][1]); x--) streak++;
    if (!streak && log[d - 1]) for (var y = d - 1; log[y] && (log[y][0] || log[y][1]); y--) streak++;
    var today = log[d] || [0, 0], C = 2 * Math.PI * 42, tot = m.total;
    function ring(pct, cls, lab) { return '<div class="ak-ring"><svg class="pring ' + cls + '" viewBox="0 0 100 100" aria-hidden="true"><circle class="bg" cx="50" cy="50" r="42"/><circle class="fg" cx="50" cy="50" r="42" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '" data-to="' + (C * (1 - Math.min(100, pct) / 100)) + '"/><text x="50" y="57">' + (pct < 1 && pct > 0 ? "<1" : Math.round(pct)) + "%</text></svg><span>" + lab + "</span></div>"; }
    var mx = Math.max.apply(null, fc.concat([1])), DN = ["Today", "Tomorrow"];
    var wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], now = new Date();
    if (!studied && !qs) return '<section class="ak-track empty"><p><strong>Your AnKing progress</strong> shows up here once you start: cards learned, questions seen, accuracy, your streak and what is due this week.</p></section>';
    rows.sort(function (a, b) { return b.pct - a.pct; });
    return '<section class="ak-track" aria-label="Your AnKing progress"><div class="ak-track-top">' +
      ring(learned / tot * 100, "ak-r1", learned.toLocaleString("en") + (learned === 1 ? " card" : " cards") + " learned") + ring(qs / tot * 100, "ak-r2", qs.toLocaleString("en") + (qs === 1 ? " question" : " questions") + " seen") +
      '<div class="ak-stats"><div><b>' + (qs ? Math.round(ok / qs * 100) + "%" : "–") + "</b><span>questions right</span></div><div><b>" + akDue().toLocaleString("en") + "</b><span>cards due today</span></div>" +
      "<div><b>" + (today[0] + today[1]) + "</b><span>done today</span></div><div><b>" + streak + '</b><span>day streak</span></div></div></div>' +
      (function () { var c = {}; for (var k in log) c[k] = (log[k][0] || 0) + (log[k][1] || 0); return '<div class="ak-heat"><p class="ak-fc-h">Review heatmap</p>' + heatHTML(c, "cards and questions") + "</div>"; })() +
      (studied ? '<div class="ak-fc"><p class="ak-fc-h">Cards due, next 7 days</p><div class="ak-fc-bars">' + fc.map(function (v, k) { var dt = new Date(now.getTime() + k * 864e5); return '<div class="ak-fc-col" title="' + v + ' due"><span class="ak-fc-v">' + (v || "") + '</span><span class="ak-fc-b" style="height:' + Math.max(v ? 6 : 2, Math.round(v / mx * 56)) + 'px"></span><span class="ak-fc-d">' + (DN[k] || wd[dt.getDay()]) + "</span></div>"; }).join("") + "</div></div>" : "") +
      (rows.length ? '<details class="ak-chaps"><summary>By chapter (' + rows.length + ' started)</summary><ul class="pbars">' + rows.map(function (r) {
        return '<li><a href="#/anking" data-tr="' + r.s.f + '"><span class="pb-name">' + esc(r.s.label) + '</span><span class="pb-num">' + (r.pct ? r.pct : "<1") + "% · " + r.n.toLocaleString("en") + "/" + r.s.n.toLocaleString("en") + '</span><span class="pb-track"><span class="pb-fill ' + (r.pct >= 60 ? "good" : r.pct >= 25 ? "mid" : "low") + '" style="--w:' + Math.max(1, r.pct) + '%"></span></span></a></li>';
      }).join("") + "</ul></details>" : "") + "</section>";
  }
  /* several chapters at once, each whole or only some of its parts. sina:akmix = { f: null (whole chapter) | [section names] } */
  function akMixSel() { var v = store.get("sina:akmix", {}); if (Array.isArray(v)) { var o = {}; v.forEach(function (f) { o[f] = null; }); v = o; } return v; }
  function akMixHTML() {
    var sel = akMixSel(), cm = akCards_(), any = Object.keys(sel).length;
    return '<details class="ak-mix"' + (any ? " open" : "") + '><summary>Mix several chapters</summary><p class="meta">Tick the chapters to ' + (cm ? "study" : "be quizzed on") + ' together. Open a chapter with the arrow to pick only some of its parts.</p><ul class="mx-list">' +
      AK.meta.subjects.map(function (s) {
        var on = s.f in sel, part = on && sel[s.f] !== null;
        return '<li class="mx-row" data-row="' + s.f + '"><div class="mx-top"><label class="mx-ch"><input type="checkbox" data-mx="' + s.f + '"' + (on ? " checked" : "") + '><span>' + esc(s.label.replace(/ \(no First Aid chapter\)/, "")) + '</span></label>' +
          '<span class="mx-n">' + (part ? sel[s.f].length + " part" + (sel[s.f].length > 1 ? "s" : "") : s.n.toLocaleString("en")) + '</span><button type="button" class="mx-exp" aria-expanded="false" aria-label="Choose parts of ' + esc(s.label) + '"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div><div class="mx-secs" hidden></div></li>';
      }).join("") + '</ul><div class="row mx-acts"><button class="btn primary" id="mxgo" type="button"></button><button class="btn" id="mxall" type="button">Select all</button><button class="btn" id="mxnone" type="button">Clear</button></div></details>';
  }
  function akMixWire() {
    var go = document.getElementById("mxgo"); if (!go) return;
    var sel = akMixSel();
    function save() { store.set("sina:akmix", sel); }
    function row(f) { return app.querySelector('[data-row="' + f + '"]'); }
    function sync(f) {
      var r = row(f), cb = r.querySelector("[data-mx]"), n = r.querySelector(".mx-n"), s = AK.meta.subjects.filter(function (x) { return x.f === f; })[0];
      var on = f in sel, part = on && sel[f] !== null;
      cb.checked = on && !part; cb.indeterminate = part;
      n.textContent = part ? sel[f].length + " part" + (sel[f].length > 1 ? "s" : "") : s.n.toLocaleString("en");
      r.querySelectorAll("[data-ms]").forEach(function (x) { x.checked = on && (!part || sel[f].indexOf(x.dataset.ms) > -1); });
    }
    function upd() {
      var fs = Object.keys(sel); save(); go.disabled = !fs.length;
      go.textContent = fs.length ? (akCards_() ? "Study " : "Quiz me on ") + fs.length + " chapter" + (fs.length > 1 ? "s" : "") : "Tick at least one chapter";
    }
    app.querySelectorAll("[data-mx]").forEach(function (cb) { cb.onchange = function () { var f = cb.dataset.mx; if (cb.checked) sel[f] = null; else delete sel[f]; sync(f); upd(); }; });
    app.querySelectorAll(".mx-exp").forEach(function (b) { b.onclick = function () {
      var r = b.closest(".mx-row"), f = r.dataset.row, box = r.querySelector(".mx-secs"), op = box.hidden;
      box.hidden = !op; b.setAttribute("aria-expanded", String(op)); r.classList.toggle("open", op);
      if (!op || box.dataset.l) return; box.dataset.l = "1"; box.innerHTML = '<p class="meta">Loading parts…</p>';
      var s = AK.meta.subjects.filter(function (x) { return x.f === f; })[0];
      akSubject(s).then(function (all) {
        box.innerHTML = akSecList(all).map(function (x) { return '<label class="mx-sec"><input type="checkbox" data-ms="' + esc(x[0]) + '"><span>' + esc(x[0]) + '</span><span class="mx-n">' + x[1].toLocaleString("en") + "</span></label>"; }).join("");
        box.querySelectorAll("[data-ms]").forEach(function (x) { x.onchange = function () {
          var all2 = Array.prototype.map.call(box.querySelectorAll("[data-ms]"), function (y) { return y.dataset.ms; });
          var cur = f in sel ? (sel[f] === null ? all2.slice() : sel[f].slice()) : [];
          if (x.checked) { if (cur.indexOf(x.dataset.ms) < 0) cur.push(x.dataset.ms); } else cur = cur.filter(function (y) { return y !== x.dataset.ms; });
          if (!cur.length) delete sel[f]; else sel[f] = cur.length === all2.length ? null : cur;
          sync(f); upd();
        }; });
        sync(f);
      }, function () { box.innerHTML = '<p class="meta">Could not load. Check the connection.</p>'; delete box.dataset.l; });
    }; });
    document.getElementById("mxall").onclick = function () { AK.meta.subjects.forEach(function (s) { sel[s.f] = null; sync(s.f); }); upd(); };
    document.getElementById("mxnone").onclick = function () { Object.keys(sel).forEach(function (f) { delete sel[f]; sync(f); }); upd(); };
    go.onclick = function () {
      var subs = AK.meta.subjects.filter(function (s) { return s.f in sel; }); if (!subs.length) return;
      var pick = {}; subs.forEach(function (s) { pick[s.f] = sel[s.f]; });
      var partial = subs.some(function (s) { return pick[s.f] !== null; });
      var filt = partial ? function (q) { var p = pick[q._f]; return p === null || p.indexOf(q.s || "General") > -1; } : null;
      var lab = subs.length === AK.meta.subjects.length && !partial ? "All chapters" : subs.map(function (s) { return s.label.split(/[ ,]/)[0] + (pick[s.f] ? " (" + pick[s.f].join(", ") + ")" : ""); }).join(", ");
      Promise.all(subs.map(akSubject)).then(function (ls) { ls.forEach(akNorm);
        if (akCards_()) akCardStart(subs, filt, lab, akGoHome);
        else akStart(subs, +store.get("sina:akcount", "20"), filt, lab, akGoHome);
      }, akFail);
    };
    app.querySelectorAll("[data-tr]").forEach(function (a) { a.onclick = function (e) { e.preventDefault(); var s = AK.meta.subjects.filter(function (x) { return x.f === a.dataset.tr; })[0]; if (s) akChapter(s); }; });
    upd();
  }
  /* counts shown next to a chapter, section or topic */
  function akFrac(o, cm) {
    if (cm) return '<span class="qn">' + (o.du ? '<b class="ak-dn">' + o.du.toLocaleString("en") + " due</b> · " : "") + (o.st ? o.st.toLocaleString("en") + " / " : "") + o.n.toLocaleString("en") + "</span>";
    return '<span class="qn">' + (o.d ? o.d.toLocaleString("en") + " / " : "") + o.n.toLocaleString("en") + "</span>";
  }
  function akHome() {
    var m = AK.meta;
    akLabels().then(function () {
      var seen = store.get("sina:akseen", {}), sr = store.get("sina:aksrs", {}), day = dayNo(), cm = akCards_();
      var h = akBase() +
        '<p class="lede-s">All AnKing Step 1 flashcards as MCQs or Anki flashcards, with pictures.</p>' +
        akTrackHTML() + akToolsHTML() + akDueHTML() + akMixHTML() +
        '<ul class="lec-list ak-subs">' + m.subjects.map(function (s, n) {
          var o = { n: s.n, d: seen[s.f] ? Object.keys(seen[s.f]).length : 0, st: 0, du: 0 }, mm = sr[s.f] || {};
          for (var k in mm) { o.st++; if (mm[k][0] <= day) o.du++; }
          return '<li><a href="#/anking" data-s="' + n + '"><span>' + esc(s.label) + "</span>" + akFrac(o, cm) + "</a></li>";
        }).join("") + '</ul><p class="src"><button type="button" class="linkbtn" id="akout">Lock this section on this device</button></p></div>';
      setView(h, "AnKing"); animateRings(); heatWire(app);
      akToolsWire(akHome); akMixWire();
      app.querySelectorAll("[data-s]").forEach(function (a) { a.onclick = function (e) { e.preventDefault(); akChapter(m.subjects[+a.dataset.s]); }; });
      document.getElementById("akout").onclick = function () { store.del("sina:akkey"); AK.key = null; ankingView(); };
    });
  }
  /* one First Aid chapter: its sections (Pathology, Physiology...) and their topics */
  function akChapter(s) {
    setView('<div class="wrap"><p class="meta">Loading ' + esc(s.label) + "…</p></div>", "AnKing");
    akSubject(s).then(function (all) {
      var seen = (store.get("sina:akseen", {})[s.f]) || {}, srm = store.get("sina:aksrs", {})[s.f] || {}, day = dayNo(), cm = akCards_(), secs = {}, order = [];
      function add(o, q) { o.n++; if (seen[q.id] !== undefined) o.d++; var e = srm[q.id]; if (e) { o.st++; if (e[0] <= day) o.du++; } }
      all.forEach(function (q) {
        var sec = q.s || "General", top = q.t || "";
        if (!secs[sec]) { secs[sec] = { n: 0, d: 0, st: 0, du: 0, tops: {}, to: [] }; order.push(sec); }
        var S2 = secs[sec]; add(S2, q);
        if (top) { if (!S2.tops[top]) { S2.tops[top] = { n: 0, d: 0, st: 0, du: 0 }; S2.to.push(top); } add(S2.tops[top], q); }
      });
      /* tiny sections (a handful of mis-tagged cards) join "More topics" */
      if (!all._norm) { akNorm(all); return akChapter(s); }
      order.sort(function (a, b) { return a === "More topics" ? 1 : b === "More topics" ? -1 : secs[b].n - secs[a].n; });
      var tot = { n: all.length, d: 0, st: 0, du: 0 }; order.forEach(function (k) { tot.d += secs[k].d; tot.st += secs[k].st; tot.du += secs[k].du; });
      var h = '<div class="wrap"><p class="crumbs"><a href="#/anking">AnKing</a> / ' + esc(s.label) + "</p><h1>" + esc(s.label) + "</h1>" + akToolsHTML() +
        '<p class="ak-whole"><button class="btn primary" type="button" data-go="">' + (cm ? "Study the whole chapter" : "Whole chapter") + "</button>" + akFrac(tot, cm) + "</p>" +
        order.map(function (k, si) {
          var o = secs[k];
          return '<details class="ak-sec"><summary><span>' + esc(k) + "</span>" + akFrac(o, cm) + '</summary><ul class="lec-list"><li><a href="#/anking" data-go="' + si + '"><span><strong>All of ' + esc(k) + "</strong></span>" + akFrac(o, cm) + "</a></li>" +
            o.to.sort(function (a, b) { return o.tops[b].n - o.tops[a].n; }).map(function (t, ti) { return '<li><a href="#/anking" data-go="' + si + ":" + ti + '"><span>' + esc(t) + "</span>" + akFrac(o.tops[t], cm) + "</a></li>"; }).join("") + "</ul></details>";
        }).join("") + "</div>";
      setView(h, "AnKing");
      akToolsWire(function () { akChapter(s); });
      app.querySelectorAll("[data-go]").forEach(function (a) { a.onclick = function (e) {
        e.preventDefault(); var g = a.dataset.go, filt = null, lab = s.label;
        if (g !== "") { var pr = g.split(":"), sec = order[+pr[0]], top = pr.length > 1 ? secs[sec].to[+pr[1]] : null; lab = s.label + " · " + (top || sec);
          filt = function (q) { return (q.s || "General") === sec && (!top || q.t === top); }; }
        if (akCards_()) akCardStart([s], filt, lab, function () { akChapter(s); });
        else akStart([s], +store.get("sina:akcount", "20"), filt, lab, function () { akChapter(s); });
      }; });
    }, akFail);
  }
  function akNorm(all) {
    if (all._norm) return all; var cnt = {};
    all.forEach(function (q) { var k = q.s || "General"; cnt[k] = (cnt[k] || 0) + 1; });
    var ks = Object.keys(cnt);
    if (ks.length > 1) all.forEach(function (q) { var k = q.s || "General"; if (k !== "More topics" && cnt[k] < 10) { q.t = q.t || k; q.s = "More topics"; } });
    all._norm = 1; return all;
  }
  function akSecList(all) {
    var c = {}; akNorm(all).forEach(function (q) { var k = q.s || "General"; c[k] = (c[k] || 0) + 1; });
    return Object.keys(c).sort(function (a, b) { return a === "More topics" ? 1 : b === "More topics" ? -1 : c[b] - c[a]; }).map(function (k) { return [k, c[k]]; });
  }
  function akStart(subs, n, filt, lab, back) {
    setView('<div class="wrap"><p class="meta">Loading questions…</p></div>', "AnKing");
    Promise.all(subs.map(akSubject)).then(function (lists) {
      var all = [].concat.apply([], lists); if (filt) all = all.filter(filt);
      var seen = store.get("sina:akseen", {});
      function sn(q) { return (seen[q._f] || {})[q.id] !== undefined; }
      var fresh = shuffle(all.filter(function (q) { return !sn(q); })), old = shuffle(all.filter(sn));
      akQuiz(subs, fresh.concat(old).slice(0, n), filt, lab, back);
    }, akFail);
  }
  function akQuiz(subs, qs, filt, lab, back) {
    var i = 0, score = 0, done = [], marked = {}, onlyMk = false, byF = {}, one = subs.length === 1;
    subs.forEach(function (x) { byF[x.f] = x; });
    function mark(q, ok) { var seen = store.get("sina:akseen", {}); seen[q._f] = seen[q._f] || {}; seen[q._f][q.id] = ok ? 1 : 0; store.set("sina:akseen", seen); akLog(1); }
    function nextIdx(k) { if (!onlyMk) return k + 1; for (var j = k + 1; j < qs.length; j++) if (marked[j]) return j; return qs.length; }
    function render() {
      if (i >= qs.length) {
        var mk = markedList(marked);
        setView('<div class="wrap"><p class="crumbs"><a href="#/anking">AnKing</a> / ' + esc(lab) + "</p><h1>" + score + " / " + qs.length + "</h1>" +
          '<div class="row">' + (mk.length ? '<button class="btn primary" id="akmk">Go back to marked questions (' + mk.length + ")</button>" : "") +
          '<button class="btn' + (mk.length ? "" : " primary") + '" id="akmore">' + qs.length + ' more</button><button class="btn" id="akback">' + (one ? "Back to " + esc(subs[0].label) : "Back") + '</button><a class="btn" href="#/anking">AnKing home</a></div></div>', "AnKing");
        if (mk.length) document.getElementById("akmk").onclick = function () { onlyMk = true; i = mk[0]; render(); window.scrollTo(0, 0); };
        document.getElementById("akmore").onclick = function () { akStart(subs, qs.length, filt, lab, back); };
        document.getElementById("akback").onclick = back;
        return;
      }
      var q = qs[i], d = done[i], last = nextIdx(i) >= qs.length;
      var h = '<div class="wrap"><p class="crumbs"><a href="#/anking">AnKing</a> / ' + esc(lab) + "</p>" +
        qbarHTML(i, qs.length, marked, last ? "Finish" : d ? "Next" : "Skip", !!d, true) +
        ecgProgress(done.filter(Boolean).length / qs.length) + (one ? "" : '<p class="ak-from">' + esc((byF[q._f] || {}).label || "") + (q.t ? " · " + esc(q.t) : "") + "</p>") + '<div class="qtext ak-q">' + akSafe(q.q) + "</div>" +
        q.options.map(function (o, n) {
          var cls = d ? (n === q.answer ? " correct" : n === d.c ? " wrong" : "") : "";
          return '<button class="opt' + cls + '" data-n="' + n + '"' + (d ? " disabled" : "") + '><span class="letter">' + LET[n].toUpperCase() + "</span><span>" + esc(o) + "</span></button>";
        }).join("") +
        (d ? '<div class="why"><strong>' + (d.c === q.answer ? "Correct." : "Not quite.") + "</strong> Answer: " + esc(q.options[q.answer]) + "." + (q.extra ? '<div class="ak-extra">' + akSafe(q.extra) + "</div>" : "") + "</div>" + akCarousel(q.res) : "") + "</div>";
      setView(h, "AnKing"); akImages(app); akCarInit(app);
      app.querySelectorAll(".opt").forEach(function (b) {
        b.onclick = function () { if (done[i]) return; var c = +b.dataset.n; done[i] = { c: c }; if (c === q.answer) score++; mark(q, c === q.answer); var y = window.scrollY; render(); window.scrollTo(0, y); };
      });
      function goTo(k) { i = k; render(); window.scrollTo(0, 0); }
      qbarWire(app, { i: i, n: qs.length, marked: marked, state: function (k) { var x = done[k]; return x ? (x.c === qs[k].answer ? "ok" : "bad") : ""; }, go: function (k) { onlyMk = false; goTo(k); } });
      document.getElementById("prev").onclick = function () { if (i) goTo(i - 1); };
      document.getElementById("fwd").onclick = function () { goTo(nextIdx(i)); };
    }
    render();
  }
  /* ---------- AnKing flashcards (Anki-style scheduling, stored per device in sina:aksrs) ---------- */
  function akCardStart(subs, filt, lab, back, nNew) {
    setView('<div class="wrap"><p class="meta">Loading cards…</p></div>', "AnKing flashcards");
    if (nNew == null) nNew = +store.get("sina:akcount", "20");
    Promise.all(subs.map(akSubject)).then(function (lists) {
      var sr = store.get("sina:aksrs", {}), day = dayNo(), due = [], nw = [];
      lists.forEach(function (all, k) {
        var s = subs[k], m = sr[s.f] || {};
        all.forEach(function (q) { if (filt && !filt(q)) return; var e = m[q.id]; if (e) { if (e[0] <= day) due.push({ s: s, q: q }); } else nw.push({ s: s, q: q }); });
      });
      akCards(shuffle(due).concat(shuffle(nw).slice(0, nNew)), lab, back);
    }, akFail);
  }
  function akReviewAll() {
    akLabels().then(function () {
      var sr = store.get("sina:aksrs", {}), day = dayNo();
      var subs = AK.meta.subjects.filter(function (s) { var m = sr[s.f] || {}; for (var k in m) if (m[k][0] <= day) return true; return false; });
      if (!subs.length) { setView(akBase() + '<p class="empty-note">No AnKing flashcards are due today. Study new cards from a chapter.</p><p><a class="btn" href="#/anking">Back to AnKing</a></p></div>', "AnKing flashcards"); return; }
      akCardStart(subs, null, "All due cards", akGoHome, 0);
    });
  }
  function akCards(queue, lab, back) {
    var shown = false, nDone = 0, total = queue.length;
    function render() {
      if (!queue.length) {
        remindSoon();
        var left = akDue();
        setView('<div class="wrap"><p class="crumbs"><a href="#/anking">AnKing</a> / ' + esc(lab) + "</p><h1>" + (total ? "Done for now" : "Nothing to study here") + '</h1><p class="lede-s">' +
          (total ? nDone + " card" + (nDone === 1 ? "" : "s") + " studied. They will come back when they are due." : "No cards are due here and there are no new cards left.") + (left ? " " + left + " more card" + (left > 1 ? "s are" : " is") + " due in other chapters." : "") + "</p>" +
          '<div class="row">' + (left && location.hash !== "#/anking/review" ? '<a class="btn primary" href="#/anking/review">Review the other due cards</a>' : "") + '<button class="btn" id="akbk" type="button">Back</button></div></div>', "AnKing flashcards");
        document.getElementById("akbk").onclick = back;
        return;
      }
      var sr = store.get("sina:aksrs", {}), it = queue[0], q = it.q, e = (sr[it.s.f] || {})[q.id], nN = 0, nL = 0, nR = 0;
      queue.forEach(function (x) { var y = (sr[x.s.f] || {})[x.q.id]; if (!y) nN++; else if (!y[1]) nL++; else nR++; });
      var h = '<div class="wrap"><p class="crumbs"><a href="#/anking">AnKing</a> / ' + esc(lab) + "</p>" +
        '<div class="ak-cbar"><span class="ak-cn"><b class="c-new">' + nN + '</b> new · <b class="c-lrn">' + nL + '</b> learning · <b class="c-rev">' + nR + '</b> to review</span><button class="linkbtn" id="akstop" type="button">End session</button></div>' +
        '<div class="fc-stage"><div class="fcard flip3d ak-card' + (shown ? " flipped" : "") + '" aria-live="polite"><div class="fc-face fc-front"><div class="kind">' + esc(it.s.label + (q.t ? " · " + q.t : "")) + (e ? "" : ' <span class="ak-newtag">New</span>') + '</div><div class="qtext ak-q">' + akSafe(q.q) + '</div><p class="fc-tap">Tap to flip</p></div>' +
        '<div class="fc-face fc-back"><div class="kind">Answer</div><div class="qtext ak-q">' + akFill(q) + "</div>" + (q.extra ? '<div class="ak-extra">' + akSafe(q.extra) + "</div>" : "") + "</div></div></div>" +
        '<div class="fc-actions" id="fcact"></div><div id="akcar"' + (shown ? "" : " hidden") + ">" + akCarousel(q.res) + "</div>" +
        '<p class="fc-swipe">Tap the card to flip it. Then swipe right for Good, left for Again.</p></div>';
      setView(h, "AnKing flashcards"); akImages(app);
      var card = app.querySelector(".fcard"), act = document.getElementById("fcact"), car = document.getElementById("akcar");
      function acts() {
        act.innerHTML = shown ? rateHTML(e) : '<button class="btn primary fc-show" id="fcshow" type="button">Show answer</button>';
        act.querySelectorAll("[data-g]").forEach(function (b) { b.onclick = function () { rate(+b.dataset.g); }; });
        var sb = document.getElementById("fcshow"); if (sb) sb.onclick = flip;
      }
      function flip() { shown = !shown; card.classList.toggle("flipped", shown); car.hidden = !shown; if (shown) akCarInit(car); acts(); }
      function rate(g) {
        var s2 = store.get("sina:aksrs", {}), nx = srsNext(e, g); s2[it.s.f] = s2[it.s.f] || {}; s2[it.s.f][q.id] = nx; store.set("sina:aksrs", s2); akLog(0);
        queue.shift(); if (!nx[1]) queue.splice(Math.min(4, queue.length), 0, it); else nDone++;
        fcOut(card, g === 1 ? -1 : 1, function () { shown = false; render(); window.scrollTo(0, 0); });
      }
      acts(); if (shown) akCarInit(car);
      fcWire(card, function () { return shown; }, flip, function (dir) { rate(dir > 0 ? 3 : 1); });
      fcKeys(card, function () { return shown; }, flip, rate);
      document.getElementById("akstop").onclick = function () { remindSoon(); back(); };
    }
    render();
  }

  function firstLecture() {
    var subs = progSubjects().filter(function (x) { return x.groups; });
    for (var i = 0; i < subs.length; i++) for (var j = 0; j < subs[i].groups.length; j++) for (var k = 0; k < subs[i].groups[j].items.length; k++) { var id = subs[i].groups[j].items[k].id; if (S.lectures[id]) return id; }
    return "";
  }
  function homeView() {
    var sems = {}, semList = progSemesters();
    semList.forEach(function (k) { sems[k] = []; });
    progSubjects().forEach(function (s) { sems[s.semester].push(s); });
    function row(s) {
      var tag, inner, n = totalCount(s), r = s.groups ? readyCount(s) : 0;
      if (s.groups) tag = '<span class="tag live">' + (r === n ? n + " lectures" : r + " of " + n + " ready") + "</span>";
      else if (s.status === "next") tag = '<span class="tag">Up next</span>';
      else tag = '<span class="tag">Planned</span>';
      inner = '<span><span class="name">' + esc(s.name) + '</span>' + (s.blurb ? '<span class="desc">' + esc(s.blurb) + "</span>" : "") + "</span>" + tag;
      if (s.groups && s.groups.length > 1 && /^(anatomy|physiology|semiology)/i.test(s.name)) {
        var subs = s.groups.map(function (g, gi) {
          var ready = g.items.filter(function (it) { return S.lectures[it.id]; }).length;
          return '<a class="subgroup" href="#/subject/' + s.id + "/lectures/g" + gi + '"><span>' + esc(g.name) + '</span><span class="sg-n">' + (ready === g.items.length ? ready : ready + " of " + g.items.length) + " lecture" + (g.items.length > 1 ? "s" : "") + "</span></a>";
        }).join("");
        return '<li class="has-sub"><div class="sub-row"><a href="#/subject/' + s.id + '">' + inner + '</a><button type="button" class="sub-toggle" aria-expanded="false" aria-label="Show ' + esc(s.name) + ' sections"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div><div class="sub-list"><div class="sub-inner">' + subs + "</div></div></li>";
      }
      return s.groups ? '<li><a href="#/subject/' + s.id + '">' + inner + "</a></li>" : '<li><span class="static planned">' + inner + "</span></li>";
    }
    var mids = progMidterms(), midHTML = "";
    mids.forEach(function (m) {
      var n = 0; m.groups.forEach(function (g) { n += g.items.length; });
      var dl = midDaysLeft(m), cram = dl !== null && dl >= 0 && dl <= 7;
      midHTML += '<div class="mid-card' + (cram ? " cram" + (dl <= 1 ? " cram-red" : "") : "") + '"><div class="mid-main"><p class="mid-eyebrow">' + (cram ? (dl === 0 ? "Midterm today" : dl === 1 ? "Midterm tomorrow" : "Midterm week") : "Upcoming") + '</p><h2>' + esc(m.title) + '</h2>' + midCountdown(m) + '<p class="meta">' + esc(midLine(m)) + '</p><div class="row">' +
        (n === 1 ? '<a class="btn primary" href="#/lecture/' + m.groups[0].items[0] + '">Revise the lecture</a>' : '<a class="btn primary" href="#/midterm">Revise the lectures</a>') + midSubs(m).map(function (sid) { var sb = subjectById(sid); return '<a class="btn" href="#/practice/' + sid + '/lectures/midterm">' + (midSubs(m).length > 1 && sb ? esc(sb.name) + " questions" : "Practice questions") + "</a>"; }).join("") + '<a class="btn" href="#/weak/midterm">Weak-spot quiz</a>' +
        (midSubs(m).length === 1 && (S.papers || []).some(function (x) { return x.subject === m.subject; }) ? '<a class="btn" href="#/practice/' + m.subject + '/papers">Past papers as quizzes</a>' : "") + "</div></div>" + midWidgets(m) + (cram ? cramPlan(m, dl) : "") + "</div>";
    });
    var ann = /^y2/.test(PROG) && Date.now() < Date.parse("2026-11-09T00:00:00Z") && !store.get("sina:ann1108", false) ? '<div class="note announce" role="status"><button type="button" class="ann-x" aria-label="Close this message">&times;</button><p><strong>About the questions.</strong> A lot of people have been complaining about the difficulty of the questions and that some target non-midterm content. <strong>PLEASE NOTE</strong> that the MCQs cover the <strong>WHOLE lecture</strong>, not just midterm-specific topics. I don’t trust what the teachers say, and I believe knowing everything instead of specific things is the best way to be prepared for the midterm <strong>AND</strong> the exam.</p><p>However, as a compromise, I’ll divide the questions into midterm-specific and non-midterm questions. The change will be published tonight at <strong>11:59 pm</strong>.</p></div>' : "";
    var html = '<div class="wrap wide">' + ann + '<section class="hero slim"><div class="hero-grid"><div class="hero-text"><p class="hero-brand">Sina<span>.</span></p><h1>Study each lecture, then test yourself on it.</h1>' +
      '<div class="home-search"><input id="home-search" type="search" placeholder="Search a lecture, subject or past paper" aria-label="Search lectures, subjects and past papers" autocomplete="off"><div class="home-results" id="home-results" hidden></div></div></div>' + caduceusHTML() + "</div>" +
      quickTiles() + midHTML + "</section>" +
      '<h2 id="subjects">' + esc(T("home.subjects")) + ' <span class="prog-tag">' + esc(progName()) + '</span></h2>' +
      (semList.length ? semList.map(function (k) { return '<h3 class="sem-title">' + esc(T("home.semester", { n: k.replace(/^S/, "") })) + '</h3><ul class="subject-list">' + sems[k].map(row).join("") + "</ul>"; }).join("")
        : '<div class="empty-prog"><h3>' + esc(T("home.empty.title", { name: progName() })) + '</h3><p>' + esc(T("home.empty.body")) + '</p></div>') +
      "</div>";
    setView(html, "");
    startCaduceus(document.getElementById("cad")); animateRings(); flipCountdowns();
    var ax = app.querySelector(".ann-x"); if (ax) ax.onclick = function () { store.set("sina:ann1108", true); var n = ax.closest(".announce"); if (n) n.remove(); };
    revealOnScroll(app.querySelectorAll(".subject-list > li, .sem-title"));
    app.querySelectorAll(".sub-toggle").forEach(function (b) { b.onclick = function () { var li = b.closest("li"), o = !li.classList.contains("open"); li.classList.toggle("open", o); b.setAttribute("aria-expanded", String(o)); }; });
    app.querySelectorAll(".cram-bar").forEach(function (b) { b.onclick = function () { var pl = b.closest(".cram-plan"), o = !pl.classList.contains("open"); pl.classList.toggle("open", o); b.setAttribute("aria-expanded", String(o)); store.set("sina:cramOpen", o); }; });
    var art = app.querySelector(".hero-art"), cvh = document.getElementById("cad");
    if (art && cvh) { var excite = function () { art.classList.add("excited"); cvh.dataset.fast = "1"; clearTimeout(art._t); art._t = setTimeout(function () { art.classList.remove("excited"); delete cvh.dataset.fast; }, 2500); }; art.addEventListener("mouseenter", excite); art.addEventListener("click", excite); }
    var hi = document.getElementById("home-search"), hr = document.getElementById("home-results");
    function hs() {
      var q = hi.value.trim();
      if (q.length < 2) { hr.hidden = true; return; }
      hr.innerHTML = hitsHTML(searchHits(q)); hr.hidden = false;
    }
    hi.addEventListener("input", hs);
  }


  /* Midterms */
  function progMidterms() { var t = today(); return (S.midterms || []).filter(function (m) { return (m.program || S.DEFAULT_PROGRAM) === PROG && (!m.date || m.date >= t); }); }
  function midSubs(m) { return m.subjects || [m.subject]; }
  /* "Endocrine: 4 lectures set. Digestive: exact lectures not announced yet." */
  function midLine(m) {
    var n = 0; m.groups.forEach(function (g) { n += g.items.length; });
    if (m.tbc) return "Exact lectures not announced yet. For now this covers " + midScope(m) + ".";
    if (!m.part) return (n === 1 ? "1 lecture" : n + " lectures") + " on this exam.";
    return m.groups.map(function (g) { return g.name + ": " + (g.tbc ? "exact lectures not announced yet" : g.items.length + (g.items.length === 1 ? " lecture set" : " lectures set")); }).join(". ") + ".";
  }
  function midScope(m) {
    var subs = midSubs(m).map(subjectById).filter(Boolean), n = 0; m.groups.forEach(function (g) { n += g.items.length; });
    var what = m.auto ? "all of " + subs.map(function (x) { return x.name; }).join(" and ") : "the " + m.groups.map(function (g) { return g.name; }).join(" and ") + " chapter" + (m.groups.length > 1 ? "s" : "");
    return what + " (" + n + " lecture" + (n === 1 ? "" : "s") + ")";
  }
  function onMidterm(id) { return progMidterms().some(function (m) { return m.groups.some(function (g) { return g.items.indexOf(id) >= 0; }); }); }
  function lectureTitle(id) {
    var t = "";
    S.subjects.forEach(function (s) { (s.groups || []).forEach(function (g) { g.items.forEach(function (it) { if (it.id === id) t = it.title; }); }); });
    return t || (S.lectures[id] ? S.lectures[id].title : id);
  }
  function midtermView() {
    var ms = progMidterms();
    var html = '<div class="wrap"><p class="crumbs"><a href="#/">Home</a> / Upcoming midterm lectures</p><h1>Upcoming midterm lectures</h1>';
    if (!ms.length) html += "<p>No midterm is listed for this year yet.</p>";
    else html += '<div class="note">Questions on Sina cover each <strong>whole lecture</strong>, not only the parts announced for the midterm, so you are ready if the scope changes or something unexpected comes up.</div>';
    ms.forEach(function (m) {
      var sb = subjectById(m.subject), n = 0;
      m.groups.forEach(function (g) { n += g.items.length; });
      html += '<section class="midterm"><h2 class="group-title">' + esc(m.title) + '</h2>' + (m.part ? '<p class="meta">' + esc(midLine(m)) + "</p>" : m.tbc ? '<p class="meta">Exact lectures not announced yet. Until they are, this covers ' + esc(midScope(m)) + ".</p>" : '<p class="meta">' + (n === 1 ? "1 lecture" : n + " lectures") + (sb ? ' from <a href="#/subject/' + sb.id + '">' + esc(sb.name) + "</a>" : "") + (n === 1 ? ". Only this lecture is on this midterm.</p>" : ". Only these lectures are on this midterm.</p>")) + (m.practice ? '<p><a class="btn primary" href="' + esc(m.practice.url) + '">' + esc(m.practice.label) + "</a></p>" : "");
      m.groups.forEach(function (g) {
        var tb = m.tbc || (m.part && g.tbc), nt = m.notes || {};
        html += '<h3 class="mid-group">' + esc(g.name) + '</h3>' + (m.part && g.tbc ? '<p class="meta">Exact lectures not announced yet: for now, the whole chapter.</p>' : "") + '<ul class="lec-list">' + g.items.map(function (id) {
          var note = nt[id] ? '<span class="mid-note">Only: ' + esc(nt[id]) + "</span>" : !tb && m.part ? '<span class="mid-note">Whole lecture</span>' : "";
          return S.lectures[id]
            ? '<li><a href="#/lecture/' + id + '"><span>' + esc(lectureTitle(id)) + note + '</span><span class="pill mid">' + (tb ? "Midterm scope" : "On the midterm") + "</span></a></li>"
            : '<li><span class="soon"><span>' + esc(lectureTitle(id)) + note + '</span><span class="pill muted">Coming</span></span></li>';
        }).join("") + "</ul>";
      });
      html += "</section>";
    });
    setView(html + "</div>", "Upcoming midterm lectures");
  }
  /* ---------- class page: Lectures, Questions, Visual, High yield, Resources, Past papers ---------- */
  function subLectures(s) {
    var out = [];
    (s.groups || []).forEach(function (g) { g.items.forEach(function (it) { if (S.lectures[it.id]) out.push({ id: it.id, title: it.title, group: g.name }); }); });
    return out;
  }
  function subSections(s) {
    var L = subLectures(s).map(function (x) { return S.lectures[x.id]; });
    var secs = [["lectures", "Lectures"], ["questions", "Questions"]];
    if (L.some(function (l) { return l.visual && (l.visual.figure || l.visual.regions || l.visual.mindmap || l.visual.model3d || galleryImages(l.visual).length); })) secs.push(["visual", "Visual"]);
    if (L.some(function (l) { return l.highYield && l.highYield.length; })) secs.push(["highyield", "High yield"]);
    if (L.some(function (l) { return l.resources && l.resources.length; })) secs.push(["resources", "Resources"]);
    if ((S.papers || []).some(function (x) { return x.subject === s.id; })) secs.push(["papers", "Past papers"]);
    return secs;
  }
  function subjectMid(s) { return progMidterms().filter(function (m) { return midSubs(m).indexOf(s.id) > -1; })[0]; }
  function wireTabs(root) {
    var cur = root.querySelector('.tab[aria-selected="true"]');
    if (cur && cur.scrollIntoView) { var t = cur.parentNode; t.scrollLeft = cur.offsetLeft - (t.clientWidth - cur.clientWidth) / 2; }
  }
  function subjectView(id, sec, arg) {
    var s = subjectById(id);
    if (!s || !s.groups) return notFound();
    var secs = subSections(s);
    if (!secs.some(function (x) { return x[0] === sec; })) sec = "lectures";
    var n = totalCount(s), r = readyCount(s);
    var html = '<div class="wrap"><p class="crumbs"><a href="#/">Home</a> / ' + esc(s.name) + "</p><h1>" + esc(s.name) + "</h1>" +
      '<p class="meta">' + (r === n ? n + " lectures" : r + " of " + n + " lectures ready") + (s.blurb ? ". " + esc(s.blurb) : "") + "</p>" +
      '<nav class="tabs sticky" aria-label="' + esc(s.name) + ' sections">' + secs.map(function (t) {
        return '<a class="tab" href="#/subject/' + s.id + (t[0] === "lectures" ? "" : "/" + t[0]) + '" aria-selected="' + (t[0] === sec) + '"' + (t[0] === sec ? ' aria-current="page"' : "") + ">" + t[1] + "</a>";
      }).join("") + '</nav><div id="panel"></div></div>';
    setView(html, s.name + (sec !== "lectures" ? " | " + secs.filter(function (x) { return x[0] === sec; })[0][1] : ""));
    wireTabs(app);
    var p = document.getElementById("panel");
    ({ lectures: subLecturesPanel, questions: subQuestionsPanel, visual: subVisualPanel, highyield: subHighYieldPanel, resources: subResourcesPanel, papers: subPapersPanel })[sec](p, s, arg);
  }
  function subLecturesPanel(p, s, arg) {
    var gsel = /^g(\d+)$/.test(arg || "") ? +RegExp.$1 : -1; if (!s.groups[gsel]) gsel = -1;
    var mid = subjectMid(s), h = s.groups.length > 1 ? '<div class="grp-chips" role="group" aria-label="Sections"><a class="gchip' + (gsel < 0 ? " on" : "") + '" href="#/subject/' + s.id + '">All</a>' + s.groups.map(function (g, gi) { return '<a class="gchip' + (gi === gsel ? " on" : "") + '" href="#/subject/' + s.id + "/lectures/g" + gi + '">' + esc(g.name) + "</a>"; }).join("") + "</div>" : "";
    var allIds = [].concat.apply([], s.groups.map(function (g) { return g.items.map(function (it) { return it.id; }); })).filter(function (x) { return S.lectures[x]; });
    var nRev = allIds.filter(revisedOn).length;
    h += '<p class="rev-count"><span class="rc-bar"><i style="width:' + (allIds.length ? Math.round(nRev / allIds.length * 100) : 0) + '%"></i></span>' + nRev + " of " + allIds.length + " lectures revised</p>";
    h += mid ? '<p class="mid-note"><span class="pill mid">Midterm</span> marks the lectures on the ' + esc(mid.title) + '. <a href="#/subject/' + s.id + '/questions/midterm">Practise just those</a>.</p>' : "";
    s.groups.forEach(function (g, gi) {
      if (gsel > -1 && gi !== gsel) return;
      h += '<h2 class="group-title">' + esc(g.name) + '</h2><ul class="lec-list">' + g.items.map(function (it) {
        return S.lectures[it.id]
          ? '<li' + (revisedOn(it.id) ? ' class="done"' : "") + '><a href="#/lecture/' + it.id + '"><span class="lec-tick" aria-label="' + (revisedOn(it.id) ? "Revised" : "Not revised") + '"></span><span>' + esc(it.title) + "</span>" + (onMidterm(it.id) ? '<span class="pill mid">Midterm</span>' : "") + "</a></li>"
          : '<li><span class="soon"><span>' + esc(it.title) + '</span><span class="pill muted">Coming</span></span></li>';
      }).join("") + "</ul>";
    });
    p.innerHTML = h;
  }
  /* Lecture picker shared by Visual (one lecture) */
  function lecSelect(s, cur, filter) {
    return '<label class="pick"><span>Lecture</span><select id="lec-pick">' + s.groups.map(function (g) {
      var its = g.items.filter(function (it) { return S.lectures[it.id] && (!filter || filter(S.lectures[it.id])); });
      return its.length ? '<optgroup label="' + esc(g.name) + '">' + its.map(function (it) { return '<option value="' + it.id + '"' + (it.id === cur ? " selected" : "") + ">" + esc(it.title) + "</option>"; }).join("") + "</optgroup>" : "";
    }).join("") + "</select></label>";
  }
  /* question count presets, and "not asked yet" first so a run of quizzes covers every question of the chosen lectures */
  var PRESETS = ["10", "20", "25", "40", "50", "70", "100"];
  function dayNo() { return Math.floor(Date.now() / 864e5); }
  /* midterm scope of lecture questions: SINA.midOff lists the questions of partly-examined lectures that are not on the midterm */
  function midLecs(s) { var m = subjectMid(s), o = {}; if (m) m.groups.forEach(function (g) { g.items.forEach(function (id) { o[id] = 1; }); }); return o; }
  var MOFF = null;
  function qOffMid(lid, q) { if (!MOFF) { MOFF = {}; Object.keys(S.midOff || {}).forEach(function (l) { MOFF[l] = {}; S.midOff[l].forEach(function (k) { MOFF[l][k] = 1; }); }); } return !!(MOFF[lid] && MOFF[lid][qKey(q)]); }
  function newCount(ids) { var a = store.get("sina:asked", {}), n = 0; ids.forEach(function (id) { (S.lectures[id].mcqs || []).forEach(function (q) { if (!a[qKey(q)]) n++; }); }); return n; }
  function pickFresh(pool, want) {
    /* not-asked first, oldest-asked next, and each chosen lecture gets its fair share of the quiz */
    var a = store.get("sina:asked", {}), by = {}, ids = [], quota = {}, given = 0, rem = [], out = [];
    want = Math.min(want, pool.length);
    pool.forEach(function (q) { var id = q._lid || "x"; if (!by[id]) { by[id] = []; ids.push(id); } by[id].push(q); });
    ids.forEach(function (id) {
      by[id] = shuffle(by[id]).sort(function (x, y) { return (a[x._k || qKey(x)] || 0) - (a[y._k || qKey(y)] || 0); });
      var x = want * by[id].length / pool.length; quota[id] = Math.floor(x); given += quota[id]; rem.push({ id: id, r: x - quota[id] });
    });
    rem.sort(function (x, y) { return y.r - x.r; }).forEach(function (x) { if (given < want) { quota[x.id]++; given++; } });
    ids.forEach(function (id) { out = out.concat(by[id].slice(0, quota[id])); });
    return shuffle(out);
  }

  function subQuestionsPanel(p, s, arg) {
    var mid = subjectMid(s), lecs = subLectures(s), key = "sina:pick:" + s.id;
    var picked = arg === "midterm" && mid ? [].concat.apply([], mid.groups.map(function (g) { return g.items; }))
      : (arg && S.lectures[arg] ? [arg] : store.get(key, []));
    picked = picked.filter(function (id) { return S.lectures[id] && S.lectures[id].subject === s.id; });
    var count = store.get("sina:qcount", "20"), ML = midLecs(s), midOnly = store.get("sina:midOnly", true);
    function hasMid(ids) { return ids.some(function (id) { return ML[id]; }); }
    var with3d = store.get("sina:m3dq", true), has3d = s.groups.some(function (g) { return g.items.some(function (it) { return S.lectures[it.id] && (S.lectures[it.id].mcqs || []).some(function (q) { return q.m3d; }); }); });
    function qsOf(id) { return (S.lectures[id].mcqs || []).filter(function (q) { return !(midOnly && ML[id] && qOffMid(id, q)) && !(q.m3d && !with3d); }); }
    /* a question shared by two lectures (e.g. one labelled picture for both ear lectures) counts once */
    function uniq(ids) { var seen = new Set(), out = []; ids.forEach(function (id) { qsOf(id).forEach(function (q) { if (!seen.has(q)) { seen.add(q); out.push(q); } }); }); return out; }
    function nQ(ids) { return uniq(ids).length; }
    function freshQ(ids) { var a = store.get("sina:asked", {}), n = 0; uniq(ids).forEach(function (q) { if (!a[qKey(q)]) n++; }); return n; }
    function picker() {
      var h = resumeBanner(function (r) { return /^mix:/.test(r.id) && r.id.slice(4).split(":")[0].split("+").every(function (x) { return S.lectures[x] && S.lectures[x].subject === s.id; }); }) + '<p class="lede-s">Choose one or more lectures, then start. Questions from all the chosen lectures are mixed into one quiz.</p>' + (mid ? '<div class="scope-box"><p class="scope-h">Which questions?</p><div class="chips quick scope-chips" role="group" aria-label="Which questions"><button type="button" data-sc="mid" aria-pressed="' + midOnly + '"' + (midOnly ? ' class="on"' : "") + '>Midterm topics only</button><button type="button" data-sc="all" aria-pressed="' + !midOnly + '"' + (!midOnly ? ' class="on"' : "") + '>Whole lecture</button></div>' +
          '<p class="scope-list">' + esc(mid.title) + ": " + (S.midNote && S.midNote[s.id] ? S.midNote[s.id] + "</p></div>" : [].concat.apply([], mid.groups.map(function (g) { return g.items; })).filter(function (id) { return S.midOff && S.midOff[id] || /semio-endo-thyroid/.test(id); }).map(function (id) { return "<strong>" + esc(lectureTitle(id) || S.lectures[id].title) + "</strong>: " + esc((mid.notes || {})[id] || "whole lecture"); }).join(" · ") + (mid.groups.length ? " · other lectures: whole lecture" : "") + "</p></div>") : "") +
        '<p class="meta scope-note">Questions on Sina cover each <strong>whole lecture</strong>, not only the parts announced for the midterm, so you are ready if the scope changes or something unexpected comes up.</p>' +
        (has3d ? '<label class="m3d-opt"><input type="checkbox" id="m3dq"' + (with3d ? " checked" : "") + '> Include 3D model questions</label>' : "") +
        '<div class="chips quick" role="group" aria-label="Quick choices"><button type="button" data-q="all">All lectures</button>' + (mid ? '<button type="button" data-q="mid">Midterm lectures</button>' : "") + '<button type="button" data-q="none">Clear</button></div>';
      s.groups.forEach(function (g, gi) {
        var its = g.items.filter(function (it) { return S.lectures[it.id]; });
        if (!its.length) return;
        h += '<div class="pick-group" role="group" aria-label="' + esc(g.name) + '"><label class="pick-row pick-head"><input type="checkbox" class="gchk" data-g="' + gi + '"><span>' + esc(g.name) + '</span><span class="qn">' + its.length + " lecture" + (its.length > 1 ? "s" : "") + "</span></label>" + its.map(function (it) {
          return '<label class="pick-row"><input type="checkbox" class="lchk" data-g="' + gi + '" value="' + it.id + '"' + (picked.indexOf(it.id) > -1 ? " checked" : "") + "><span>" + esc(it.title) + '</span><span class="qn">' + qsOf(it.id).length + "</span></label>";
        }).join("") + "</div>";
      });
      h += '<div class="start-bar"><label class="pick"><span>Questions</span><select id="qcount"></select></label><input id="qcustom" class="qcustom" type="number" inputmode="numeric" min="1" step="1" aria-label="Number of questions" hidden>' +
        '<button class="btn primary" id="qstart" type="button">Start</button><button class="btn" id="qexam" type="button">Exam mode</button>' + (spotTasks(lecs.map(function (l) { return l.id || l; })).length ? '<button class="btn" id="qspot" type="button">Spotter: tap the structure</button>' : "") + '<span class="qsel" id="qsel"></span></div>';
      p.innerHTML = h;
      var boxes = p.querySelectorAll(".lchk");
      function sync() {
        picked = []; boxes.forEach(function (b) { if (b.checked) picked.push(b.value); });
        p.querySelectorAll(".gchk").forEach(function (g) {
          var mine = [].filter.call(boxes, function (b) { return b.dataset.g === g.dataset.g; }), on = mine.filter(function (b) { return b.checked; }).length;
          g.checked = on === mine.length && on > 0; g.indeterminate = on > 0 && on < mine.length;
        });
        var n = nQ(picked);
        p.querySelector("#qsel").textContent = picked.length ? picked.length + " lecture" + (picked.length > 1 ? "s" : "") + ", " + n + " questions" : "No lecture chosen";
        var fresh = freshQ(picked);
        if (picked.length) p.querySelector("#qsel").textContent += fresh === n ? " (all new)" : fresh ? ", " + fresh + " not asked yet" : ", all asked once (oldest come back first)";
        var sel = p.querySelector("#qcount"), cu = p.querySelector("#qcustom"), opts = PRESETS.filter(function (v) { return +v < n; }).concat(["all", "custom"]);
        var isCustom = count !== "all" && PRESETS.indexOf(count) < 0 && +count > 0 && +count < n, shown = isCustom ? "custom" : opts.indexOf(count) > -1 ? count : "all";
        sel.innerHTML = opts.map(function (v) { return '<option value="' + v + '"' + (v === shown ? " selected" : "") + ">" + (v === "all" ? "All (" + n + ")" : v === "custom" ? "Custom number…" : v) + "</option>"; }).join("");
        cu.max = n; cu.hidden = shown !== "custom"; if (isCustom) cu.value = count; else if (shown !== "custom") cu.value = "";
        p.querySelector("#qstart").disabled = !picked.length; p.querySelector("#qexam").disabled = !picked.length;
        var qs2 = p.querySelector("#qspot"); if (qs2) qs2.disabled = !spotTasks(picked).length;
      }
      boxes.forEach(function (b) { b.addEventListener("change", sync); });
      var m3c = p.querySelector("#m3dq"); if (m3c) m3c.addEventListener("change", function () { with3d = m3c.checked; store.set("sina:m3dq", with3d); sync(); });
      p.querySelectorAll("[data-sc]").forEach(function (b) { b.addEventListener("click", function () {
        midOnly = b.dataset.sc === "mid"; store.set("sina:midOnly", midOnly);
        /* Midterm topics only starts the quiz at once: the ticked midterm lectures, or all of them if none is ticked */
        if (midOnly) { var mine = picked.filter(function (id) { return ML[id]; }); picked = mine.length ? mine : Object.keys(ML).filter(function (id) { return S.lectures[id] && S.lectures[id].subject === s.id; }); if (picked.length) { start(false); return; } }
        picker();
      }); });
      p.querySelectorAll(".gchk").forEach(function (g) { g.addEventListener("change", function () { boxes.forEach(function (b) { if (b.dataset.g === g.dataset.g) b.checked = g.checked; }); sync(); }); });
      p.querySelectorAll(".quick button[data-q]").forEach(function (b) {
        b.addEventListener("click", function () {
          var ids = b.dataset.q === "all" ? lecs.map(function (x) { return x.id; }) : b.dataset.q === "mid" ? [].concat.apply([], mid.groups.map(function (g) { return g.items; })) : [];
          boxes.forEach(function (x) { x.checked = ids.indexOf(x.value) > -1; }); sync();
        });
      });
      p.querySelector("#qcount").addEventListener("change", function () {
        var cu = p.querySelector("#qcustom");
        if (this.value === "custom") { cu.hidden = false; cu.value = cu.value || Math.min(30, nQ(picked)); count = String(cu.value); cu.focus(); cu.select(); }
        else { cu.hidden = true; count = this.value; }
        store.set("sina:qcount", count);
      });
      p.querySelector("#qcustom").addEventListener("input", function () {
        var v = Math.round(+this.value), n = nQ(picked);
        if (v > 0) { count = String(Math.min(v, n)); store.set("sina:qcount", count); }
      });
      p.querySelector("#qstart").addEventListener("click", function () { start(false); });
      p.querySelector("#qexam").addEventListener("click", function () { start(true); });
      var qsp = p.querySelector("#qspot"); if (qsp) qsp.addEventListener("click", function () {
        store.set(key, picked);
        p.innerHTML = '<div class="quiz-top"><button class="btn small-btn" id="qback" type="button">&larr; Change lectures</button><span class="meta">Spotter · ' + esc(picked.length === 1 ? lectureTitle(picked[0]) : picked.length + " lectures") + '</span></div><div id="quiz"></div>';
        p.querySelector("#qback").addEventListener("click", picker);
        spotterPanel(p.querySelector("#quiz"), picked, picker); window.scrollTo(0, 0);
      });
      sync();
    }
    function start(exam) {
      store.set(key, picked);
      var pool = [], seenQ = new Set();
      picked.forEach(function (id) {
        var L = S.lectures[id], fig = L.visual && L.visual.figure;
        (L.mcqs || []).forEach(function (q) {
          if (q.target && !fig) return;
          if (seenQ.has(q)) return; seenQ.add(q);
          if (q.m3d && !with3d) return;
          var off = ML[id] && qOffMid(id, q);
          if (off && midOnly) return;
          var c = {}; for (var k in q) c[k] = q[k];
          if (off) c._off = 1;
          c._fig = fig; c._lid = id; c._from = picked.length > 1 ? lectureTitle(id) : ""; pool.push(c);
        });
      });
      pool = pickFresh(pool, count === "all" ? pool.length : Math.max(1, +count || 20));
      var seenKey = "sina:seen:" + picked.slice().sort().join("+");
      if (store.get(seenKey, false)) pool = pool.map(shuffleQ); else store.set(seenKey, true);
      p.innerHTML = '<div class="quiz-top"><button class="btn small-btn" id="qback" type="button">' + (picked.length === 1 ? "+ Add more lectures" : "&larr; Change lectures") + '</button><span class="meta"' + (picked.length > 1 ? ' title="' + esc(picked.map(lectureTitle).join(", ")) + '"' : "") + ">" + esc(picked.length === 1 ? lectureTitle(picked[0]) : picked.length + " lectures mixed") + '</span></div><div id="quiz"></div>';
      p.querySelector("#qback").addEventListener("click", function () { lecDialog(exam); });
      (function () {
        var qt = p.querySelector(".quiz-top"), total = 0, sel = document.createElement("select");
        picked.forEach(function (id) { total += qsOf(id).length; });
        sel.className = "qt-count"; sel.setAttribute("aria-label", "Number of questions");
        [10, 20, 40, 60, 100].filter(function (n) { return n < total; }).concat(["all"]).forEach(function (n) {
          var o = document.createElement("option"); o.value = String(n); o.textContent = n === "all" ? "All " + total + " questions" : n + " questions";
          if (String(n) === String(count) || (n === "all" && !(+count < total))) o.selected = true; sel.appendChild(o);
        });
        if (count !== "all" && +count < total && [10, 20, 40, 60, 100].indexOf(+count) < 0) { var o2 = document.createElement("option"); o2.value = count; o2.textContent = count + " questions"; o2.selected = true; sel.insertBefore(o2, sel.firstChild); }
        sel.addEventListener("change", function () { count = sel.value; store.set("sina:qcount", count); start(exam); });
        qt.insertBefore(sel, qt.querySelector(".meta"));
      })();
      if (hasMid(picked) && Object.keys(S.midOff || {}).some(function (l) { return picked.indexOf(l) > -1; })) {
        var qt = p.querySelector(".quiz-top"), sb = document.createElement("button");
        sb.className = "btn small-btn"; sb.type = "button"; sb.id = "qscope"; sb.textContent = midOnly ? "Show the whole lecture" : "Midterm topics only";
        sb.title = midOnly ? "Now showing midterm topics only" : "Now showing the whole lecture";
        sb.addEventListener("click", function () { midOnly = !midOnly; store.set("sina:midOnly", midOnly); start(exam); });
        qt.insertBefore(sb, qt.querySelector(".meta"));
        qt.querySelector(".meta").textContent += midOnly ? " · midterm topics" : " · whole lecture";
      }
      var set = { id: "mix:" + picked.slice().sort().join("+") + ":" + count + (midOnly && hasMid(picked) ? ":mid" : ""), mcqs: pool };
      if (exam) examIntro(p.querySelector("#quiz"), set, picker); else questionsPanel(p.querySelector("#quiz"), set);
      window.scrollTo(0, 0);
    }
    /* the subject's lectures in a pop-up over the quiz: tick more (or fewer) and restart with them */
    function lecDialog(exam) {
      var v = document.createElement("div"), h = "";
      v.className = "rdlg"; v.setAttribute("role", "dialog"); v.setAttribute("aria-modal", "true"); v.setAttribute("aria-label", "Choose lectures");
      s.groups.forEach(function (g, gi) {
        var its = g.items.filter(function (it) { return S.lectures[it.id]; });
        if (!its.length) return;
        h += '<div class="pick-group" role="group" aria-label="' + esc(g.name) + '"><label class="pick-row pick-head"><input type="checkbox" class="gchk" data-g="' + gi + '"><span>' + esc(g.name) + '</span><span class="qn">' + its.length + " lecture" + (its.length > 1 ? "s" : "") + "</span></label>" +
          its.map(function (it) { return '<label class="pick-row"><input type="checkbox" class="lchk" data-g="' + gi + '" value="' + it.id + '"' + (picked.indexOf(it.id) > -1 ? " checked" : "") + "><span>" + esc(it.title) + '</span><span class="qn">' + qsOf(it.id).length + "</span></label>"; }).join("") + "</div>";
      });
      v.innerHTML = '<div class="rdlg-box ldlg"><h2>Lectures</h2><p class="meta">Tick the lectures to practise together.</p><div class="ldlg-list">' + h + '</div>' +
        '<div class="row ldlg-foot"><button class="btn primary" id="ld-go" type="button">Start</button><button class="btn" id="ld-x" type="button">Cancel</button><span class="meta" id="ld-n"></span></div></div>';
      document.body.appendChild(v); document.body.classList.add("noscroll");
      var boxes = v.querySelectorAll(".lchk"), sel = picked.slice();
      function close() { v.remove(); document.body.classList.remove("noscroll"); }
      function sync() {
        sel = []; boxes.forEach(function (b) { if (b.checked) sel.push(b.value); });
        v.querySelectorAll(".gchk").forEach(function (g) {
          var mine = [].filter.call(boxes, function (b) { return b.dataset.g === g.dataset.g; }), on = mine.filter(function (b) { return b.checked; }).length;
          g.checked = on === mine.length && on > 0; g.indeterminate = on > 0 && on < mine.length;
        });
        v.querySelector("#ld-n").textContent = sel.length ? sel.length + " lecture" + (sel.length > 1 ? "s" : "") + ", " + nQ(sel) + " questions" : "No lecture chosen";
        v.querySelector("#ld-go").disabled = !sel.length;
      }
      boxes.forEach(function (b) { b.addEventListener("change", sync); });
      v.querySelectorAll(".gchk").forEach(function (g) { g.addEventListener("change", function () { boxes.forEach(function (b) { if (b.dataset.g === g.dataset.g) b.checked = g.checked; }); sync(); }); });
      v.querySelector("#ld-x").onclick = close;
      v.addEventListener("click", function (e) { if (e.target === v) close(); });
      v.querySelector("#ld-go").onclick = function () { picked = sel; close(); start(exam); };
      sync();
      var first = v.querySelector(".lchk:checked"); if (first) { var L = v.querySelector(".ldlg-list"); L.scrollTop = first.closest(".pick-row").offsetTop - L.offsetTop - 40; }
    }
    /* a link to one lecture (cram plan, Continue) starts that lecture's quiz right away; "Change lectures" goes back to the list */
    if (arg && arg !== "midterm" && S.lectures[arg] && picked.length === 1) start(false); else picker();
  }
  function subVisualPanel(p, s, arg) {
    var has = function (l) { return l.visual && (l.visual.figure || l.visual.regions || l.visual.mindmap || l.visual.model3d || galleryImages(l.visual).length); };
    var ids = subLectures(s).map(function (x) { return x.id; }).filter(function (id) { return has(S.lectures[id]); });
    var cur = ids.indexOf(arg) > -1 ? arg : ids[0];
    p.innerHTML = lecSelect(s, cur, has) + '<div id="vis"></div>';
    p.querySelector("#lec-pick").addEventListener("change", function () { location.replace("#/subject/" + s.id + "/visual/" + this.value); });
    visualPanel(p.querySelector("#vis"), S.lectures[cur]);
  }
  /* Collapsible list, one row per lecture: used by High yield and Resources */
  function perLecture(p, s, arg, intro, test, render, countLabel) {
    var lecs = subLectures(s).filter(function (x) { return test(S.lectures[x.id]); });
    var h = intro + '<div class="row exp"><button class="btn small-btn" type="button" data-x="1">Expand all</button><button class="btn small-btn" type="button" data-x="0">Collapse all</button></div>', lastG = "";
    lecs.forEach(function (x) {
      if (x.group !== lastG) { h += '<h2 class="group-title">' + esc(x.group) + "</h2>"; lastG = x.group; }
      h += '<details class="lec-acc" id="acc-' + x.id + '"' + (x.id === arg ? " open" : "") + '><summary><span>' + esc(x.title) + '</span><span class="qn">' + countLabel(S.lectures[x.id]) + '</span></summary><div class="acc-body" data-id="' + x.id + '"></div></details>';
    });
    p.innerHTML = h;
    function fill(d) { var b = d.querySelector(".acc-body"); if (!b.dataset.done) { b.dataset.done = "1"; render(b, S.lectures[b.dataset.id]); } }
    p.querySelectorAll(".lec-acc").forEach(function (d) { if (d.open) fill(d); d.addEventListener("toggle", function () { if (d.open) fill(d); }); });
    p.querySelectorAll(".exp button").forEach(function (b) { b.addEventListener("click", function () { p.querySelectorAll(".lec-acc").forEach(function (d) { d.open = b.dataset.x === "1"; }); }); });
    if (arg) { var t = document.getElementById("acc-" + arg); if (t) setTimeout(function () { t.scrollIntoView({ block: "start" }); }, 30); }
  }
  function subHighYieldPanel(p, s, arg) {
    perLecture(p, s, arg, '<p class="lede-s">Quick revision notes for each lecture: key facts, clinical links and memory aids. Open a lecture to see its notes.</p>',
      function (l) { return l.highYield && l.highYield.length; },
      function (b, l) { highYieldPanel(b, l, true); },
      function (l) { return l.highYield.length + " notes"; });
  }
  function resCard(r, kind) {
    return '<li class="rcard"><a class="rlink" href="' + esc(r.url) + '" target="_blank" rel="noopener"><span class="rthumb" data-host="' + esc(hostOf(r.url)) + '"><img loading="lazy" alt="" src="' + esc(previewSrc(r)) + '"><span class="rkind">' + esc(kind || r.kind) + '</span></span>' +
      '<span class="rbody"><span class="t">' + esc(r.title) + '</span><span class="w">' + esc(r.why) + '</span><span class="dom">' + esc(hostOf(r.url)) + "</span>" + (r.note ? '<span class="n">' + esc(r.note) + "</span>" : "") + "</span></a></li>";
  }
  function wireThumbs(root) {
    root.querySelectorAll(".rthumb img").forEach(function (img) {
      if (img.dataset.w) return; img.dataset.w = "1";
      img.addEventListener("error", function () {
        var box = img.parentNode; img.remove(); box.classList.add("nofoto");
        var f = document.createElement("span"); f.className = "rfallback"; f.textContent = box.dataset.host; box.insertBefore(f, box.firstChild);
      });
    });
  }
  function subResourcesPanel(p, s, arg) {
    perLecture(p, s, arg, '<p class="lede-s">Videos, websites and books chosen for each lecture. Open a lecture to see its links; they open in a new tab.</p>',
      function (l) { return l.resources && l.resources.length; },
      function (b, l) { b.innerHTML = '<ul class="rgrid">' + l.resources.map(function (r) { return resCard(r); }).join("") + "</ul>"; wireThumbs(b); },
      function (l) { return l.resources.length + " links"; });
    var chans = [], seen = {};
    [s.id].concat(subLectures(s).map(function (x) { return x.id; })).forEach(function (k) {
      ((S.channels && S.channels[k]) || []).forEach(function (r) { if (!seen[r.url]) { seen[r.url] = 1; chans.push(r); } });
    });
    var extra = "";
    if (chans.length) extra += '<details class="lec-acc"><summary><span>Channels worth following</span><span class="qn">' + chans.length + '</span></summary><div class="acc-body"><ul class="rgrid">' + chans.map(function (r) { return resCard(r, "Channel"); }).join("") + "</ul></div></details>";
    if (S.apps && S.apps.length) extra += '<details class="lec-acc"><summary><span>Apps and practice sites</span><span class="qn">' + S.apps.length + '</span></summary><div class="acc-body"><ul class="rgrid">' + S.apps.map(function (r) { return resCard(r); }).join("") + "</ul></div></details>";
    if (extra) { p.insertAdjacentHTML("beforeend", '<h2 class="group-title">For the whole class</h2>' + extra); wireThumbs(p); }
  }
  /* papers of one subject split by part (Anatomy 3: neuroanatomy, ENT, normal anatomy, mixed) */
  var PART_ORDER = ["Neuroanatomy", "ENT (ear, larynx, thyroid)", "Anatomy (face, mouth, nose, eye)", "Whole course (mixed)"];
  function paperParts(list) {
    if (!list.some(function (x) { return x.part; })) return null;
    var g = {}; list.forEach(function (x) { (g[x.part || "Other"] = g[x.part || "Other"] || []).push(x); });
    return Object.keys(g).sort(function (a, b) { var i = PART_ORDER.indexOf(a), j = PART_ORDER.indexOf(b); return (i < 0 ? 99 : i) - (j < 0 ? 99 : j); }).map(function (k) { return [k, g[k]]; });
  }
  function subPapersPanel(p, s) {
    var list = (S.papers || []).filter(function (x) { return x.subject === s.id; }), parts = paperParts(list);
    p.innerHTML = parts ? parts.map(function (g) { return '<h2 class="group-title">' + esc(g[0]) + '</h2><ul class="lec-list">' + g[1].map(paperRow).join("") + "</ul>"; }).join("") : '<ul class="lec-list">' + list.map(paperRow).join("") + "</ul>";
  }

  function psaHTML() {
    if (store.get("sina:psaDismissed", false)) return "";
    return PSA;
  }
  var PSA = '<div class="psa"><button class="psa-close" type="button" aria-label="Close this note for good">&times;</button><strong>A quick word before you close this.</strong> Everything here is a study aid built from the lecture slides, not a replacement for them. Sit in your lectures, read your professor\'s slides and your textbooks, and use this site to make sense of them, revise them and test yourself. If something here disagrees with your professor, your professor is right.</div>';
  function wirePSA(root) {
    var x = root.querySelector(".psa-close");
    if (x) x.addEventListener("click", function () { store.set("sina:psaDismissed", true); x.closest(".psa").remove(); });
  }
  var TABS = [["summary", "Summary"], ["cards", "Flashcards"], ["deeper", "Go deeper"]];
  var MOVED = { questions: "questions", visual: "visual", highyield: "highyield", resources: "resources" };

  function lectureView(id, tab, secN) {
    var lec = S.lectures[id];
    if (!lec) return notFound();
    var sub = subjectById(lec.subject);
    if (MOVED[tab]) { location.replace("#/subject/" + sub.id + "/" + MOVED[tab] + "/" + id); return; }
    tab = tab || "summary";
    if (!TABS.some(function (t) { return t[0] === tab; })) tab = "summary";
    var secs = subSections(sub).map(function (x) { return x[0]; });
    var did = driveId(lec.sourceUrl), ppt = /\.pptx?\b/i.test(lec.sourceFile || ""), who = lecturer(lec);
    var more = [];
    if (lec.sourcePdf) { var pdfName = (lectureTitle(lec.id) || lec.title || "lecture").replace(/[\\/:*?"<>|]+/g, "") + ".pdf"; more.push('<a role="menuitem" href="' + esc(lec.sourcePdf) + '" data-pdf="' + esc(lec.sourcePdf) + '" data-name="' + esc(pdfName) + '" download="' + esc(pdfName) + '">' + ICON.dl + "Download lecture (PDF)</a>"); }
    else if (did) more.push('<a role="menuitem" href="https://drive.google.com/uc?export=download&amp;id=' + esc(did) + '" target="_blank" rel="noopener">' + ICON.dl + "Download lecture" + (ppt ? " (PowerPoint)" : "") + "</a>");
    more.push('<a role="menuitem" href="#/subject/' + sub.id + "/questions/" + id + '">' + ICON.q + "Practice questions</a>");
    if (secs.indexOf("visual") > -1 && lec.visual) more.push('<a role="menuitem" href="#/subject/' + sub.id + "/visual/" + id + '">' + ICON.v + "Visual</a>");
    if (lec.highYield && lec.highYield.length) more.push('<a role="menuitem" href="#/subject/' + sub.id + "/highyield/" + id + '">' + ICON.hy + "High yield notes</a>");
    if (lec.resources && lec.resources.length) more.push('<a role="menuitem" href="#/subject/' + sub.id + "/resources/" + id + '">' + ICON.r + "Videos and websites</a>");
    var html = '<div class="wrap"><p class="crumbs"><a href="#/">Home</a> / <a href="#/subject/' + sub.id + '">' + esc(sub.name) + "</a></p>" +
      '<div class="lec-head"><h1>' + esc(lec.title) + '</h1><div class="more"><button class="more-btn" id="more-btn" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Lecture options">' + ICON.dots + '</button><div class="more-menu" id="more-menu" role="menu" hidden>' + more.join("") + "</div></div></div>" +
      '<p class="meta lec-meta">' + [who ? esc(who) : "", onMidterm(id) ? '<span class="pill mid">Midterm</span>' : "", revisedHTML(id, false)].filter(Boolean).join(" &middot; ") + "</p>" +
      '<div class="tabs sticky" role="tablist" aria-label="Lecture sections">' + TABS.map(function (t) {
        return '<button class="tab" role="tab" id="tab-' + t[0] + '" aria-selected="' + (t[0] === tab) + '" data-tab="' + t[0] + '">' + t[1] + "</button>";
      }).join("") + '</div><div id="panel" role="tabpanel" aria-labelledby="tab-' + tab + '"></div>' + prevNextHTML(sub, id) + psaHTML() + "</div>";
    setView(html, lec.title);
    wireTabs(app); wireRevised(app.querySelector(".lec-meta"), id);
    var panel = document.getElementById("panel");
    ({ summary: summaryPanel, cards: cardsPanel, deeper: deeperPanel })[tab](panel, lec);
    if (tab !== "cards") readingLine(panel);
    if (tab === "summary" && secN != null && document.getElementById("sec-" + secN)) setTimeout(function () { var h = document.getElementById("sec-" + secN); window.scrollTo(0, h.getBoundingClientRect().top + window.scrollY - 130); h.classList.add("sec-flash"); }, 60);
    else if (tab === "summary") readPos(id, panel);
    app.querySelectorAll(".tab").forEach(function (b) {
      b.addEventListener("click", function () { location.hash = "#/lecture/" + id + (b.dataset.tab === "summary" ? "" : "/" + b.dataset.tab); });
    });
    var mb = document.getElementById("more-btn"), mm = document.getElementById("more-menu");
    function openMore(on) { mm.hidden = !on; mb.setAttribute("aria-expanded", String(on)); if (on) { var f = mm.querySelector("a"); if (f) f.focus(); } }
    mb.addEventListener("click", function (e) { e.stopPropagation(); openMore(mm.hidden); });
    mm.addEventListener("keydown", function (e) { if (e.key === "Escape") { openMore(false); mb.focus(); } });
    document.addEventListener("click", function off(e) { if (!mm.contains(e.target)) { mm.hidden = true; mb.setAttribute("aria-expanded", "false"); } if (!document.body.contains(mm)) document.removeEventListener("click", off); });
    wirePSA(app);
  }
  var ICON = {
    dots: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>',
    dl: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/></svg>',
    q: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M9 11l3 3L21 5M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h11"/></svg>',
    v: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 5h16v14H4zM4 15l5-5 4 4 3-3 4 4"/></svg>',
    hy: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
    r: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>'
  };
  function prevNextHTML(sub, id) {
    var L = subLectures(sub), i = L.map(function (x) { return x.id; }).indexOf(id);
    if (i < 0) return "";
    var pv = L[i - 1], nx = L[i + 1];
    return '<nav class="prevnext" aria-label="Other lectures">' +
      (pv ? '<a class="pn prev" href="#/lecture/' + pv.id + '"><span class="pn-k">&larr; Previous</span><span class="pn-t">' + esc(pv.title) + "</span></a>" : "<span></span>") +
      (nx ? '<a class="pn next" href="#/lecture/' + nx.id + '"><span class="pn-k">Next &rarr;</span><span class="pn-t">' + esc(nx.title) + "</span></a>" : "<span></span>") + "</nav>";
  }

  function highYieldPanel(p, lec, noIntro) {
    var HYT = { note: "Note", clinic: "Clinical", mnemo: "Memory aid" };
    var order = ["note", "clinic", "mnemo"];
    var counts = {}; lec.highYield.forEach(function (x) { counts[x.t] = (counts[x.t] || 0) + 1; });
    var h = (noIntro ? "" : '<p class="hy-intro">Quick notes to help you revise this lecture: key facts, clinical links and a few memory aids. Nothing here is extra to learn by heart; the Summary tab has the full explanation.</p>') +
      '<div class="hy-filter" role="group" aria-label="Show">' +
      '<button class="chip hy-f" data-f="all" aria-pressed="true">All (' + lec.highYield.length + ')</button>' +
      order.filter(function (t) { return counts[t]; }).map(function (t) {
        return '<button class="chip hy-f" data-f="' + t + '" aria-pressed="false"><span class="hy-dot hy-' + t + '"></span>' + HYT[t] + " (" + counts[t] + ")</button>";
      }).join("") + "</div>" +
      '<ul class="hy-list">' + lec.highYield.map(function (x) {
        return '<li data-t="' + esc(x.t) + '"><span class="hy-tag hy-' + esc(x.t) + '">' + esc(HYT[x.t] || x.t) + "</span> " + x.html + "</li>";
      }).join("") + "</ul>";
    p.innerHTML = h;
    p.querySelectorAll(".hy-f").forEach(function (b) {
      b.addEventListener("click", function () {
        var f = b.dataset.f;
        p.querySelectorAll(".hy-f").forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
        p.querySelectorAll(".hy-list li").forEach(function (li) { li.hidden = !(f === "all" || li.dataset.t === f); });
      });
    });
  }

  function summaryPanel(p, lec) {
    var h = '<div class="lang-row"><div class="lang-tog" role="group" aria-label="Summary language"><button type="button" data-lang="en" aria-pressed="true">English</button><button type="button" data-lang="fr" aria-pressed="false">Français</button></div><span class="lang-msg" aria-live="polite"></span></div>' +
      '<div id="sum-body"><p class="buildnote">' + ICON.info + "Built from the lecture slides. If your professor says otherwise, trust your professor.</p>";
    if (lec.summary.length > 3) h += '<details class="toc"><summary>On this page</summary><ol>' + lec.summary.map(function (s, i) { return '<li><button type="button" data-to="sec-' + i + '">' + esc(s.title) + "</button></li>"; }).join("") + '<li><button type="button" data-to="sec-key">Key points</button></li></ol></details>';
    lec.summary.forEach(function (s, i) { h += '<h2 id="sec-' + i + '">' + esc(s.title) + "</h2>" + s.html; });
    h += "<h2 id='sec-key'>Key points</h2><ul class='exam-list'>" + lec.exam.map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul>";
    h += (lec.sources && lec.sources.length)
      ? '<div class="foot"><p>Facts on this page were checked against these references (last check ' + esc(lec.verified) + "). Student flashcard sets were used only as a secondary consistency check.</p><ul class='sources'>" + lec.sources.map(function (s) { return '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.name) + "</a></li>"; }).join("") + "</ul></div>"
      : '<div class="foot"><p>Built from the lecture slides (last check ' + esc(lec.verified) + "). Outside references will be added with the full version.</p></div>";
    h += "</div>" + revisedHTML(lec.id, true);
    p.innerHTML = h;
    wireRevised(p, lec.id);
    wireFrench(p, lec);
    p.querySelectorAll(".toc button").forEach(function (b) {
      b.addEventListener("click", function () { var t = document.getElementById(b.dataset.to); if (t) { t.scrollIntoView({ behavior: "smooth", block: "start" }); b.closest("details").open = false; } });
    });
    wireMedia(p);
  }
  ICON.info = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 11v6M12 7.5v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  /* ---------- reference pictures: a small carousel, broken pictures drop out ---------- */

  /* Source slides: Drive preview can fail on big or heavy files (often PowerPoints),
     so every Drive source also gets a direct download link. */
  function driveId(u) { var m = /drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-]{20,})/.exec(u || ""); return m ? m[1] : ""; }
  /* One "Download lecture" button instead of the long source line. The professor's name
     (taken from the source note) sits beside it in small text. */
  function lecturer(lec) {
    var m = /\(([^()]*)\)\s*$/.exec(lec.sourceFile || "");
    if (!m) return "";
    var p = m[1].split(/,\s*/).filter(function (x) { return /^(Prof|Pr|Dr)\b/.test(x); });
    return p.join(", ");
  }
  function sourceLine(lec) {
    var who = lecturer(lec);
    var id = driveId(lec.sourceUrl), ppt = /\.pptx?\b/i.test(lec.sourceFile || "");
    if (!id && !lec.sourcePdf) return who ? '<p class="meta">' + esc(who) + "</p>" : "";
    if (lec.sourcePdf) ppt = false;
    var fname = (lectureTitle(lec.id) || lec.title || "lecture").replace(/[\\/:*?"<>|]+/g, "") + ".pdf";
    return '<p class="srcline"><a class="dlbtn" href="' + (lec.sourcePdf ? esc(lec.sourcePdf) : "https://drive.google.com/uc?export=download&amp;id=" + esc(id)) + '"' + (lec.sourcePdf ? ' data-pdf="' + esc(lec.sourcePdf) + '" data-name="' + esc(fname) + '" download="' + esc(fname) + '"' : ' target="_blank" rel="noopener"') + ' title="' + esc(lec.sourceFile || "") + '">' +
      '<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/></svg>' +
      "Download lecture" + (ppt ? " (PowerPoint)" : "") + "</a>" + (who ? '<span class="srcwho">' + esc(who) + "</span>" : "") + "</p>";
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-pdf]"); if (!a || !window.fetch || !window.Blob) return;
    e.preventDefault(); if (a.dataset.busy) return;
    var lab = a.lastChild, old = lab && lab.nodeType === 3 ? lab.nodeValue : null; a.dataset.busy = "1";
    function say(t) { if (old !== null) lab.nodeValue = t; }
    function done() { delete a.dataset.busy; if (old !== null) lab.nodeValue = old; }
    say("Preparing the PDF…");
    fetch(a.dataset.pdf).then(function (r) { if (!r.ok) throw new Error("net"); return r.blob(); }).then(function (b) {
      var name = a.dataset.name || "lecture.pdf", file = null;
      try { file = new File([b], name, { type: "application/pdf" }); } catch (err) {}
      var touch = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) || /Android/.test(navigator.userAgent);
      if (touch && file && navigator.canShare && navigator.canShare({ files: [file] })) {
        return navigator.share({ files: [file] }).catch(function (err) { if (!err || err.name !== "AbortError") throw err; });
      }
      var u = URL.createObjectURL(b), l = document.createElement("a"); l.href = u; l.download = name; document.body.appendChild(l); l.click(); l.remove();
      setTimeout(function () { URL.revokeObjectURL(u); }, 60000);
    }).then(done, function () { done(); window.open(a.getAttribute("href"), "_blank"); });
  });
  function galleryImages(v) { return (v.images && v.images.length ? v.images : (v.image ? [v.image] : [])).filter(function (im) { return im && im.src; }); }
  function galleryHTML(v) {
    var ims = galleryImages(v); if (!ims.length) return "";
    return "<h2 style='margin-top:0'>Reference pictures</h2><div class='gallery' data-ims='" + esc(JSON.stringify(ims)).replace(/'/g, "&#39;") + "'></div>";
  }
  function commonsPage(src) { var m = /Special:FilePath\/([^?]+)/.exec(src); return m ? "https://commons.wikimedia.org/wiki/File:" + m[1] : src; }
  function wireGallery(root) {
    root.querySelectorAll(".gallery").forEach(function (g) {
      if (g.dataset.wired) return; g.dataset.wired = "1";
      var ims = JSON.parse(g.getAttribute("data-ims").replace(/&#39;/g, "'")), i = 0, x0 = null;
      function draw() {
        if (!ims.length) { g.innerHTML = "<p class='src'>The pictures could not load. They need an internet connection.</p>"; return; }
        if (i >= ims.length) i = 0;
        var im = ims[i], many = ims.length > 1;
        g.innerHTML = "<figure class='fig gfig'><div class='gstage'>" +
          (many ? "<button type='button' class='gnav prev' aria-label='Previous picture'>&#8249;</button>" : "") +
          "<img src='" + esc(im.src) + "' alt='" + esc(im.alt || im.caption || "") + "'>" +
          (many ? "<button type='button' class='gnav next' aria-label='Next picture'>&#8250;</button>" : "") +
          "</div><figcaption>" + (many ? "<span class='gcount'>" + (i + 1) + " / " + ims.length + "</span>" : "") + esc(im.caption || "") +
          " <a href='" + esc(commonsPage(im.src)) + "' target='_blank' rel='noopener'>Full size</a>" + (im.credit ? "<span class='gcredit'>" + esc(im.credit) + "</span>" : "") + "</figcaption>" +
          (many ? "<div class='gdots' role='group' aria-label='Choose a picture'>" + ims.map(function (m, n) { return "<button type='button' data-n='" + n + "' aria-label='Picture " + (n + 1) + ": " + esc(m.caption || "") + "' aria-pressed='" + (n === i) + "'></button>"; }).join("") + "</div>" : "") +
          "</figure>";
        var img = g.querySelector("img");
        img.addEventListener("error", function () { ims.splice(i, 1); draw(); });
        var pv = g.querySelector(".prev"), nx = g.querySelector(".next");
        if (pv) pv.addEventListener("click", function () { go(-1); });
        if (nx) nx.addEventListener("click", function () { go(1); });
        g.querySelectorAll(".gdots button").forEach(function (b) { b.addEventListener("click", function () { i = +b.dataset.n; draw(); }); });
      }
      function go(d) { i = (i + d + ims.length) % ims.length; draw(); var b = g.querySelector(d < 0 ? ".prev" : ".next"); if (b) b.focus(); }
      g.addEventListener("keydown", function (e) { if (ims.length < 2) return; if (e.key === "ArrowLeft") go(-1); else if (e.key === "ArrowRight") go(1); });
      g.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      g.addEventListener("touchend", function (e) { if (x0 === null || ims.length < 2) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1); x0 = null; });
      draw();
    });
  }

  /* mind map: root + colour-coded branches; nodes are "text" or ["text", [children]] */
  function mmNode(n, depth) {
    var label = Array.isArray(n) ? n[0] : n, kids = Array.isArray(n) ? (n[1] || []) : [];
    if (!kids.length) return '<li class="mm-leaf">' + esc(label) + "</li>";
    return '<li class="mm-sub"><button type="button" class="mm-tog" aria-expanded="false"><span class="mm-caret" aria-hidden="true"></span>' + esc(label) +
      '</button><ul class="mm-kids" hidden>' + kids.map(function (k) { return mmNode(k, depth + 1); }).join("") + "</ul></li>";
  }
  function mindmapHTML(mm) {
    if (!mm || !mm.branches) return "";
    return '<h2 style="margin-top:0">Mind map</h2><p class="meta">The whole lecture at a glance. Tap a branch to open it.</p>' +
      '<div class="mm"><div class="mm-tools"><button type="button" class="btn mm-all" data-open="1">Expand all</button><button type="button" class="btn mm-all" data-open="0">Collapse all</button></div>' +
      '<div class="mm-root">' + esc(mm.root) + '</div><div class="mm-branches">' +
      mm.branches.map(function (b, i) {
        var label = Array.isArray(b) ? b[0] : b, kids = Array.isArray(b) ? (b[1] || []) : [];
        return '<div class="mm-branch" style="--mmc:var(--mm' + (i % 6 + 1) + ')"><button type="button" class="mm-head mm-tog" aria-expanded="false"><span class="mm-caret" aria-hidden="true"></span>' + esc(label) +
          (kids.length ? '<span class="mm-n">' + kids.length + "</span>" : "") + '</button><ul class="mm-kids" hidden>' + kids.map(function (k) { return mmNode(k, 1); }).join("") + "</ul></div>";
      }).join("") + "</div></div>";
  }
  function wireMindmap(p) {
    function set(btn, open) { btn.setAttribute("aria-expanded", String(open)); var ul = btn.nextElementSibling; if (ul) ul.hidden = !open; }
    p.querySelectorAll(".mm-tog").forEach(function (b) { b.addEventListener("click", function () { set(b, b.getAttribute("aria-expanded") !== "true"); }); });
    p.querySelectorAll(".mm-all").forEach(function (b) { b.addEventListener("click", function () { var o = b.dataset.open === "1"; p.querySelectorAll(".mm-tog").forEach(function (t) { set(t, o); }); }); });
  }


  /* ---------- mind map: radial map (M1) and focus cards (M3) ---------- */
  function mmFlat(n) { if (!Array.isArray(n)) return String(n); var k = (n[1] || []).map(mmFlat); return n[0] + (k.length ? ": " + k.join("; ") : ""); }
  function mmData(mm) { return { root: mm.root, b: (mm.branches || []).map(function (b) { return Array.isArray(b) ? [b[0], (b[1] || []).map(mmFlat)] : [b, []]; }) }; }
  function mmRadialSVG(d) {
    var W = 1080, H = 660, cx = W / 2, cy = H / 2, n = d.b.length, s = '<svg class="mm-radial" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Mind map: ' + esc(d.root) + '">';
    d.b.forEach(function (b, i) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / n, bx = cx + Math.cos(a) * 175, by = cy + Math.sin(a) * 150, col = "var(--mm" + (i % 6 + 1) + ")";
      s += '<g class="mmr-br" data-i="' + i + '"><path class="mmr-bl" style="stroke:' + col + '" d="M' + cx + " " + cy + " Q" + (cx + Math.cos(a) * 80) + " " + (cy + Math.sin(a) * 90) + " " + bx + " " + by + '"/>';
      var m = b[1].length;
      b[1].forEach(function (l, j) {
        var aa = a + (m > 1 ? (j - (m - 1) / 2) * 0.88 / (m - 1) * 1.6 : 0), lx = cx + Math.cos(aa) * 290, ly = cy + Math.sin(aa) * 265, right = Math.cos(aa) > 0.05, left = Math.cos(aa) < -0.05;
        var txt = l.length > 32 ? l.slice(0, 31) + "…" : l;
        s += '<g class="mmr-leaf"><title>' + esc(l) + '</title><path class="mmr-ll" style="stroke:' + col + '" d="M' + bx + " " + by + " Q" + (bx + (lx - bx) * 0.5) + " " + by + " " + lx + " " + ly + '"/><circle cx="' + lx + '" cy="' + ly + '" r="3.5" style="fill:' + col + '"/><text class="mmr-lt" x="' + (lx + (right ? 7 : left ? -7 : 0)) + '" y="' + (ly + 4) + '" text-anchor="' + (right ? "start" : left ? "end" : "middle") + '">' + esc(txt) + "</text></g>";
      });
      var tw = Math.min(260, b[0].length * 7.6 + 28);
      s += '<rect x="' + (bx - tw / 2) + '" y="' + (by - 17) + '" width="' + tw + '" height="34" rx="17" class="mmr-bn" style="stroke:' + col + '"/><text class="mmr-bt" x="' + bx + '" y="' + (by + 5) + '" text-anchor="middle">' + esc(b[0].length > 32 ? b[0].slice(0, 31) + "…" : b[0]) + "</text></g>";
    });
    var words = d.root.split(" "), l1 = "", l2 = "", pm = /^(.*?)\s*\((.*)\)\s*$/.exec(d.root);
    if (pm && pm[1].length <= 28) { l1 = pm[1]; l2 = pm[2]; }
    else words.forEach(function (w) { if ((l1 + " " + w).trim().length <= 24 && !l2) l1 = (l1 + " " + w).trim(); else l2 = (l2 + " " + w).trim(); });
    if (l2.length > 28) l2 = l2.slice(0, 27) + "…";
    s += '<rect class="mmr-root" x="' + (cx - 135) + '" y="' + (cy - 32) + '" width="270" height="64" rx="32"/><text class="mmr-rt" x="' + cx + '" y="' + (cy + (l2 ? -4 : 6)) + '" text-anchor="middle">' + esc(l1) + "</text>" + (l2 ? '<text class="mmr-rt2" x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle">' + esc(l2) + "</text>" : "");
    return s + "</svg>";
  }
  function mindmap2HTML(mm) {
    if (!mm || !mm.branches) return "";
    var d = mmData(mm), total = d.b.reduce(function (a, b) { return a + b[1].length; }, 0), view = store.get("sina:mmView", window.innerWidth < 700 ? "cards" : "map");
    return '<h2 style="margin-top:0">Mind map</h2><div class="mm2" data-view="' + view + '"><div class="mm2-bar"><div class="lang-tog" role="group" aria-label="Mind map view"><button type="button" data-v="map" aria-pressed="' + (view === "map") + '">Map</button><button type="button" data-v="cards" aria-pressed="' + (view === "cards") + '">Cards</button></div><button type="button" class="tg mm2-test" aria-pressed="false">Test me</button></div>' +
      '<div class="mm2-map"><div class="mm2-scroll">' + mmRadialSVG(d) + '</div><p class="mm2-hint">Tap a branch to focus it and read its details below.</p><div class="mm2-focus"></div></div>' +
      '<div class="mm2-cards"><div class="mm2-hero"><b>' + esc(d.root) + "</b><span>" + d.b.length + " branches · " + total + ' details</span></div><div class="mm2-chips">' +
      d.b.map(function (b, i) { return '<button type="button" class="mm2-chip" style="--cc:var(--mm' + (i % 6 + 1) + ')" data-i="' + i + '">' + esc(b[0]) + "</button>"; }).join("") + '</div><div class="mm2-leaves"></div><p class="mm2-prog"></p></div></div>';
  }
  function wireMindmap2(p, mm) {
    var box = p.querySelector(".mm2"); if (!box) return;
    var d = mmData(mm), cur = 0, rec = false, shown = {}, total = d.b.reduce(function (a, b) { return a + b[1].length; }, 0);
    var leaves = box.querySelector(".mm2-leaves"), chips = box.querySelectorAll(".mm2-chip"), prog = box.querySelector(".mm2-prog"), focus = box.querySelector(".mm2-focus");
    function cards() {
      chips.forEach(function (c, i) { c.classList.toggle("on", i === cur); });
      var b = d.b[cur]; leaves.classList.toggle("recall", rec);
      leaves.innerHTML = b[1].map(function (l, j) { var k = cur + "-" + j; return '<div class="mm2-leaf' + (shown[k] ? " shown" : "") + '" style="--cc:var(--mm' + (cur % 6 + 1) + ')" data-k="' + k + '"><span class="k">' + esc(b[0]) + " · " + (j + 1) + '</span><span class="t">' + esc(l) + "</span></div>"; }).join("") || '<p class="src">No details on this branch.</p>';
      leaves.querySelectorAll(".mm2-leaf").forEach(function (c) { c.onclick = function () { if (!rec) return; shown[c.dataset.k] = 1; c.classList.add("shown"); pg(); }; });
      pg();
    }
    function pg() { prog.textContent = rec ? Object.keys(shown).length + " of " + total + " details revealed" : ""; }
    chips.forEach(function (c) { c.onclick = function () { cur = +c.dataset.i; cards(); }; });
    var foc = -1;
    box.querySelectorAll(".mmr-br").forEach(function (g) {
      g.addEventListener("click", function () {
        var i = +g.dataset.i; foc = foc === i ? -1 : i;
        box.querySelectorAll(".mmr-br").forEach(function (h) { h.classList.toggle("dim", foc > -1 && +h.dataset.i !== foc); });
        focus.innerHTML = foc < 0 ? "" : '<div class="mm2-fhead" style="--cc:var(--mm' + (foc % 6 + 1) + ')">' + esc(d.b[foc][0]) + "</div><ul>" + d.b[foc][1].map(function (l) { return "<li" + (rec ? ' class="hid"' : "") + ">" + esc(l) + "</li>"; }).join("") + "</ul>";
        focus.querySelectorAll("li.hid").forEach(function (li) { li.onclick = function () { li.classList.remove("hid"); }; });
      });
    });
    box.querySelectorAll(".mm2-bar [data-v]").forEach(function (b) { b.onclick = function () { box.dataset.view = b.dataset.v; store.set("sina:mmView", b.dataset.v); box.querySelectorAll(".mm2-bar [data-v]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); }; });
    var t = box.querySelector(".mm2-test");
    t.onclick = function () { rec = t.getAttribute("aria-pressed") !== "true"; t.setAttribute("aria-pressed", String(rec)); shown = {}; box.classList.toggle("testing", rec); cards(); foc = -1; focus.innerHTML = ""; box.querySelectorAll(".mmr-br").forEach(function (h) { h.classList.remove("dim"); }); };
    cards();
  }
  /* ---------- pathway as a metro line (P2) ---------- */
  function metroHTML(f) {
    return '<div class="metro"><div class="metro-scroll"><div class="metro-line" style="--n:' + f.steps.length + '"><div class="metro-fill"></div>' + f.steps.map(function (st, i) { return '<button type="button" class="metro-stop" data-i="' + i + '"><i></i><span>' + esc(st.name) + "</span></button>"; }).join("") +
      '</div></div><div class="metro-det" aria-live="polite"></div><div class="metro-nav"><button type="button" class="btn" data-d="-1">&larr; Previous</button><button type="button" class="btn" data-d="1">Next &rarr;</button></div></div>';
  }
  function wireMetro(p, f) {
    var m = p.querySelector(".metro"); if (!m) return;
    var k = 0, stops = m.querySelectorAll(".metro-stop"), sc = m.querySelector(".metro-scroll"), fill = m.querySelector(".metro-fill"), det = m.querySelector(".metro-det");
    function show() {
      stops.forEach(function (s, i) { s.classList.toggle("past", i < k); s.classList.toggle("cur", i === k); });
      var a = stops[0], c = stops[k]; fill.style.width = (c.offsetLeft + c.offsetWidth / 2 - (a.offsetLeft + a.offsetWidth / 2)) + "px";
      det.innerHTML = "<small>Step " + (k + 1) + " of " + f.steps.length + "</small><h3>" + esc(f.steps[k].name) + "</h3>" + (f.steps[k].desc ? "<p>" + esc(f.steps[k].desc) + "</p>" : "");
      sc.scrollTo({ left: c.offsetLeft - sc.clientWidth / 2 + c.offsetWidth / 2, behavior: "smooth" });
      m.querySelector('[data-d="-1"]').disabled = k === 0; m.querySelector('[data-d="1"]').disabled = k === f.steps.length - 1;
    }
    stops.forEach(function (s) { s.onclick = function () { k = +s.dataset.i; show(); }; });
    m.querySelectorAll("[data-d]").forEach(function (b) { b.onclick = function () { k = Math.max(0, Math.min(f.steps.length - 1, k + +b.dataset.d)); show(); }; });
    requestAnimationFrame(show);
  }
  /* ---------- anatomy: real labelled plate with a "Hide labels" switch ---------- */
  function plateFor(lid) { var out = null; Object.keys(S.occl || {}).forEach(function (k) { if (!out && S.occl[k].lecs.indexOf(lid) > -1) out = S.occl[k]; }); return out; }
  function plateHTML(f) {
    return '<div class="plate"><div class="mm2-bar"><button type="button" class="tg plate-tog" aria-pressed="false">Hide labels</button><span class="src">Hide the labels, name each structure, then tap a tile to check it.</span></div><div class="occ"><div class="occ-scroll"><div class="occ-wrap plate-wrap" style="aspect-ratio:' + f.w + "/" + f.h + '"><img src="' + esc(f.src) + '" alt="Labelled anatomy picture" width="' + f.w + '" height="' + f.h + '" loading="lazy">' +
      f.labels.map(function (b) { return '<span class="otile ptile" style="left:' + b[0] + "%;top:" + b[1] + "%;width:" + b[2] + "%;height:" + b[3] + '%"></span>'; }).join("") + "</div></div><figcaption>" + esc(f.credit) + "</figcaption></div></div>";
  }
  function wirePlate(p) {
    var pl = p.querySelector(".plate"); if (!pl) return;
    var t = pl.querySelector(".plate-tog");
    t.onclick = function () { var on = t.getAttribute("aria-pressed") !== "true"; t.setAttribute("aria-pressed", String(on)); pl.classList.toggle("hiding", on); t.textContent = on ? "Show labels" : "Hide labels"; pl.querySelectorAll(".ptile").forEach(function (x) { x.classList.remove("peek"); }); };
    pl.querySelectorAll(".ptile").forEach(function (x) { x.addEventListener("click", function (e) { if (!pl.classList.contains("hiding")) return; e.stopPropagation(); x.classList.toggle("peek"); }); });
  }

  function visualPanel(p, lec) {
    var v = lec.visual, layer = "walls";
    var hints = { walls: "Tap a wall to see which bones form it.", margins: "Tap a green edge to see which bones form that part of the rim.", openings: "Tap a dark opening to see what passes through it.", landmarks: "Tap a dashed outline to see what it is." };
    if (!v.regions) {
      var h2 = v.model3d ? "<h2 style='margin-top:0'>3D model</h2>" + viewer3dHTML(v.models || v.model3d) : "";
      var gal = galleryHTML(v);
      if (gal) h2 = gal + h2;
      var mmh = mindmap2HTML(v.mindmap);
      if (mmh) h2 = mmh + (h2 ? h2.replace("<h2 style='margin-top:0'>", "<h2>").replace('<h2 style="margin-top:0">', "<h2>") : "");
      var plate = plateFor(lec.id), hd = function (t) { return "<h2" + (h2 ? "" : " style='margin-top:0'") + ">" + t + "</h2>"; };
      if (plate) h2 += hd("Labelled picture") + plateHTML(plate);
      else if (v.figure && photoFor(lec.id)) h2 += hd("Labelled picture") + photoLabelled(lec.id, v.figure);
      if (v.figure && lec.flow) h2 += hd("Pathway") + "<p>" + esc(v.figure.caption || lec.flow.title || "") + "</p>" + metroHTML(lec.flow);
      else if (v.figure && !plate) h2 += hd(photoFor(lec.id) ? "Schematic" : "Labelled schematic") + "<p>" + esc(v.figure.caption || "Schematic drawn for this site, not to scale.") + '</p><div class="diagram-box">' + figureSVG(v.figure, { uid: "vis" }) + "</div>";
      var mx = M3D_FOR[lec.id];
      if (mx && S.m3d) h2 = "<h2" + (h2 ? "" : " style='margin-top:0'") + ">Interactive 3D model</h2><p>Turn the model and tap any structure to see its name.</p>" +
        (mx.length > 1 ? '<div class="model-switch" role="group" aria-label="Choose a model">' + mx.map(function (m, n) { return '<button type="button" data-x3="' + m + '" aria-pressed="' + (n === 0) + '">' + esc(M3D_TITLE[m]) + "</button>"; }).join("") + "</div>" : "") +
        '<div class="m3d m3d-x"><button class="btn primary m3d-go" type="button">Load the 3D model</button></div><p class="m3d-credit">3D model: <a href="https://github.com/Z-Anatomy/Models-of-human-anatomy" target="_blank" rel="noopener">Z-Anatomy</a> (from BodyParts3D), CC BY-SA 4.0</p>' + h2;
      p.innerHTML = h2 || "<p>No visual for this lecture yet.</p>";
      if (mx && S.m3d) wireExplorer(p, mx);
      wireMedia(p); wireGallery(p); wireMindmap2(p, v.mindmap); wirePlate(p); if (lec.flow) wireMetro(p, lec.flow);
      return;
    }
    var gal0 = galleryHTML(v);
    var m3 = gal0 + (v.model3d ? "<h2" + (gal0 ? "" : " style='margin-top:0'") + ">3D model</h2>" + viewer3dHTML(v.models || v.model3d) : "") + ((gal0 || v.model3d) ? "<h2>Labelled schematic</h2>" : "");
    p.innerHTML = m3 + "<p>" + esc(v.intro) + '</p><div class="layer-switch" role="group" aria-label="Diagram layer">' + ["walls", "margins", "openings", "landmarks"].map(function (l) { return '<button data-layer="' + l + '" aria-pressed="' + (l === layer) + '">' + l.charAt(0).toUpperCase() + l.slice(1) + "</button>"; }).join("") +
      '</div><div class="diagram-box" id="dia"></div><div class="info" id="info" aria-live="polite"></div>';
    wireGallery(p);
    var dia = document.getElementById("dia"), info = document.getElementById("info");
    function drawDia() { dia.innerHTML = orbitSVG({ mode: "explore", layer: layer, uid: "vis" }); info.innerHTML = "<p>" + hints[layer] + "</p>"; wire(); }
    function select(id) {
      var r = v.regions[id]; if (!r || r.layer !== layer) return;
      dia.querySelectorAll(".sel").forEach(function (e) { e.classList.remove("sel"); });
      var el = dia.querySelector('[data-id="' + id + '"]'); if (el) { el.classList.add("sel"); el.querySelectorAll && el.querySelectorAll(".shape, line:not(.hit)").forEach(function (e) { e.classList.add("sel"); }); }
      info.innerHTML = "<h3>" + esc(r.title) + "</h3>" + r.body;
    }
    function wire() {
      dia.querySelectorAll("[data-id]").forEach(function (el) {
        var r = v.regions[el.dataset.id];
        if (r && r.layer === layer) { el.setAttribute("tabindex", "0"); el.setAttribute("role", "button"); el.setAttribute("aria-label", r.title); }
        el.addEventListener("click", function () { select(el.dataset.id); });
        el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(el.dataset.id); } });
      });
    }
    p.querySelectorAll(".layer-switch button").forEach(function (b) {
      b.addEventListener("click", function () {
        layer = b.dataset.layer;
        p.querySelectorAll(".layer-switch button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        drawDia();
      });
    });
    drawDia();
    wireMedia(p);
  }

  /* Lecture slide(s) that prove an answer: collapsed until opened, then click to see full size. */
  function qKey(q) { var t = (q.q || "") + "|" + (q.options || []).join("|"), h = 5381; for (var i = 0; i < t.length; i++) h = ((h * 33) ^ t.charCodeAt(i)) >>> 0; var k = h.toString(36); return (S.qAlias && S.qAlias[k]) || k; }
  /* retries: shuffle the options so answers are read, not remembered by position */
  function shuffleQ(q) {
    if (q.options.some(function (o) { return /\b(all|none|both) of the (above|options)\b/i.test(o); })) return q;
    var n = q.options.length, perm = [], k;
    for (k = 0; k < n; k++) perm.push(k);
    for (var t = 0; t < 4; t++) { perm = shuffle(perm); if (perm.some(function (v, j) { return v !== j; })) break; }
    var c = {}; for (k in q) c[k] = q[k];
    var ans = q.answers || [q.answer];
    c.options = perm.map(function (j) { return q.options[j]; });
    if (q.notes) c.notes = perm.map(function (j) { return q.notes[j]; });
    var na = ans.map(function (a) { return perm.indexOf(a); }).sort(function (a, b) { return a - b; });
    if (q.answers) c.answers = na; else c.answer = na[0];
    c._k = q._k || qKey(q);
    return c;
  }
  function slideHL(q, s) { var m = q && S.hl && S.hl[q._k || qKey(q)]; return (m && m[s.src]) || []; }
  function slideImg(s, unit, q) {
    var hl = slideHL(q, s);
    return '<span class="slide-img">' + snakeLoader() + '<img loading="lazy" src="' + esc(s.src) + '" alt="' + esc(s.lec) + ", " + (unit || "slide") + " " + s.n + '">' +
      hl.map(function (r) { return '<i class="hl" style="left:' + r[0] + "%;top:" + r[1] + "%;width:" + r[2] + "%;height:" + r[3] + '%"></i>'; }).join("") + "</span>";
  }
  /* full-size slide viewer with a close button (phones get stuck on a bare image tab) */
  var svOpen = null;
  function closeViewer(fromPop) {
    if (!svOpen) return;
    var v = svOpen; svOpen = null; v.remove(); document.body.classList.remove("noscroll");
    if (!fromPop && history.state && history.state.sv) history.back();
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a.slide-open");
    if (!a) return;
    e.preventDefault();
    var v = document.createElement("div");
    v.className = "sviewer"; v.setAttribute("role", "dialog"); v.setAttribute("aria-modal", "true"); v.setAttribute("aria-label", a.dataset.cap || "Slide");
    v.innerHTML = '<div class="sv-bar"><span>' + esc(a.dataset.cap || "") + '</span><button type="button" class="sv-x" aria-label="Close">&times;</button></div><div class="sv-scroll">' + a.innerHTML + '</div><p class="sv-tip">Tap the slide to zoom.</p>';
    document.body.appendChild(v); document.body.classList.add("noscroll"); svOpen = v;
    history.pushState({ sv: 1 }, "", location.href);
    v.querySelector(".sv-x").addEventListener("click", function () { closeViewer(false); });
    v.querySelector(".sv-x").focus();
    v.addEventListener("click", function (ev) { if (ev.target === v || ev.target.classList.contains("sv-scroll")) closeViewer(false); });
    v.querySelector(".slide-img").addEventListener("click", function () { v.classList.toggle("zoomed"); });
  });
  window.addEventListener("popstate", function () { if (svOpen) closeViewer(true); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && svOpen) closeViewer(false); });

  function slidesHTML(q) {
    if (!q.slides || !q.slides.length) return "";
    var groups = [];
    q.slides.forEach(function (s) { var g = groups.filter(function (x) { return x.lec === s.lec; })[0]; if (g) g.n.push(s.n); else groups.push({ lec: s.lec, n: [s.n] }); });
    var unit = q.slides[0].unit || "slide";
    var lbl = groups.map(function (g) { return g.lec + ", " + unit + (g.n.length > 1 ? "s " : " ") + g.n.join(" and "); }).join("; ");
    return '<details class="slide-ref"><summary>See the ' + unit + (q.slides.length > 1 ? "s" : "") + " that explain" + (q.slides.length > 1 ? "" : "s") + " this <span>(" + esc(lbl) + ")</span></summary>" +
      q.slides.map(function (s) {
        return '<figure><a class="slide-open" href="' + esc(s.src) + '" data-cap="' + esc(s.lec + ", " + unit + " " + s.n) + '" title="Open full size">' + slideImg(s, unit, q) + '</a><figcaption>' + esc(s.lec) + ", " + unit + " " + s.n + "." + (slideHL(q, s).length ? " The part in green answers the question." : "") + " Tap to open full size.</figcaption></figure>";
      }).join("") + "</details>";
  }

  /* ---------- weak spots: after a quiz, point to the part of the lecture (and the slides) behind each missed question ---------- */
  var STOP = {}; "about above after again also among and another any are because been before being between both but can cause caused causes could does doing down during each from have having here into its itself less more most much must only other over same should some such than that the their them then there these they this those through under until very what when where which while who whom why will with within without would your yours lecture slide slides following true false correct wrong statement statements regarding concerning".split(" ").forEach(function (w) { STOP[w] = 1; });
  function wTok(t) { return (String(t || "").replace(/<[^>]+>/g, " ").toLowerCase().match(/[a-z0-9à-ÿ]{3,}/g) || []).filter(function (w) { return !STOP[w]; }).map(function (w) { return w.length > 5 ? w.slice(0, 7) : w; }); }
  var SECIDX = {};
  function secIndex(lid) {
    if (SECIDX[lid]) return SECIDX[lid];
    var L = S.lectures[lid], secs = (L && L.summary) || [], df = {};
    var docs = secs.map(function (x, k) { var b = {}, ti = {}; wTok(x.html).forEach(function (w) { b[w] = (b[w] || 0) + 1; }); wTok(x.title).forEach(function (w) { ti[w] = 1; b[w] = (b[w] || 0) + 1; }); Object.keys(b).forEach(function (w) { df[w] = (df[w] || 0) + 1; }); return { k: k, title: x.title, b: b, ti: ti }; });
    return (SECIDX[lid] = { docs: docs, df: df, n: docs.length });
  }
  function bestSection(q, lids) {
    var ans = q.answers || [q.answer], words = wTok(q.q + " " + ans.map(function (n) { return q.options[n]; }).join(" ") + " " + (q.why || "") + " " + ans.map(function (n) { return (q.notes || [])[n] || ""; }).join(" "));
    var best = null;
    lids.forEach(function (lid) {
      var ix = secIndex(lid); if (!ix.n) return;
      ix.docs.forEach(function (d) {
        if (/^(key points|the big picture|summary|in short|introduction)$/i.test(d.title)) return;
        var sc = 0; words.forEach(function (w) { if (d.b[w]) sc += (1 + (d.ti[w] ? 1.5 : 0)) * Math.log(1 + ix.n / ix.df[w]); });
        if (!best || sc > best.sc) best = { lid: lid, k: d.k, title: d.title, sc: sc };
      });
    });
    return best && best.sc > 1 ? best : null;
  }
  function weakHTML(missed) {
    if (!missed.length) return "";
    var byL = {}, order = [];
    missed.forEach(function (m) {
      var q = m.q, lid = q._lid || m.lid, lids = S.lectures[lid] ? [lid] : subLectures(subjectById(srcSubject(lid)) || { groups: [] }).map(function (x) { return x.id; }).filter(function (id) { return S.lectures[id]; });
      var sec = bestSection(q, lids), home = sec ? sec.lid : (S.lectures[lid] ? lid : null);
      if (!home) return;
      if (!byL[home]) { byL[home] = { secs: {}, slides: [], n: 0 }; order.push(home); }
      var e = byL[home]; e.n++;
      if (sec) { var t = e.secs[sec.k] || (e.secs[sec.k] = { k: sec.k, title: sec.title, n: 0 }); t.n++; }
      (q.slides || []).forEach(function (sl) { if (!e.slides.some(function (x) { return x.src === sl.src; })) e.slides.push({ s: sl, q: q }); });
    });
    if (!order.length) return "";
    order.sort(function (a, b) { return byL[b].n - byL[a].n; });
    return '<section class="weakbox"><h2 class="rev-h">Study next</h2><p class="meta">Where your missed questions come from. Start at the top.</p>' + order.map(function (lid) {
      var e = byL[lid], secs = Object.keys(e.secs).map(function (k) { return e.secs[k]; }).sort(function (a, b) { return b.n - a.n || a.k - b.k; });
      return '<div class="weak-l"><p class="weak-t"><a href="#/lecture/' + lid + '">' + esc(lectureTitle(lid) || S.lectures[lid].title) + '</a><span class="qn">' + e.n + " missed</span></p>" +
        (secs.length ? '<ul class="weak-s">' + secs.map(function (x) { return '<li><a href="#/lecture/' + lid + "/summary/" + x.k + '">' + esc(x.title) + "</a>" + (x.n > 1 ? ' <span class="weak-n">×' + x.n + "</span>" : "") + "</li>"; }).join("") + "</ul>" : "") +
        "</div>";
    }).join("") + "</section>";
  }

  function questionsPanel(p, lec, resume) {
    var drafts = {};
    var all = lec.mcqs, qs = all, fullRun = true, i = 0, score = 0, wrong = [], done = [], marked = {}, key = "sina:best:" + lec.id, LET = "abcdefgh", streak = 0;
    if (resume) { qs = resume.qs; all = resume.full ? resume.qs : all; fullRun = !!resume.full; done = resume.done || []; i = 0; while (i < qs.length && done[i]) i++; if (i >= qs.length) i = qs.length - 1; }
    /* resume: the unfinished quiz is saved after every answer (one at a time, the most recent) */
    function saveResume() {
      if (!done.some(Boolean) || i >= qs.length) return;
      var lite = qs.map(function (q) { var c = {}; for (var k in q) if (k !== "_fig") c[k] = q[k]; return c; });
      store.set("sina:resume", { id: lec.id, title: lec._title || resumeTitle(lec.id), back: location.hash, qs: lite, i: i, done: done, full: fullRun, t: Date.now() });
    }
    function clearResume() { var r = store.get("sina:resume", null); if (r && r.id === lec.id) store.del("sina:resume"); }
    function keyText(q) {
      var ans = q.answers || [q.answer];
      return ans.map(function (n) { return LET[n] + ". " + q.options[n]; }).join(" and ");
    }
    function feedback(q, ok, skipped, pts) {
      var head = skipped ? "Skipped." : ok ? "Correct." : pts > 0 ? "Partly right: " + fmtPts(pts) + " of 1 point." : "Not quite: 0 points.";
      var body = q.why ? " " + esc(q.why) : "";
      return '<div class="why"><strong>' + head + "</strong> Correct answer: " + esc(keyText(q)) + "." + body + "</div>" + slidesHTML(q) + '<p class="rep-line"><button type="button" class="linkbtn" id="rep">Report a mistake in this question</button></p>';
    }
    function render() {
      if (i >= qs.length) {
        clearResume();
        score = 0; wrong = [];
        qs.forEach(function (q, n) { var d = done[n] || { chosen: [], ok: false, pts: 0 }; score += d.ok ? 1 : (d.pts || 0); if (!d.ok) wrong.push({ q: q, n: n + 1, chosen: d.chosen }); });
        score = Math.round(score * 100) / 100;
        var full = fullRun, best = store.get(key, 0);
        if (full && score > best) { best = score; store.set(key, best); }
        var missed = wrong.slice();
        p.innerHTML = scoreRevealHTML(score, qs.length) +
          (full ? "<p>Best score on this device: " + fmtPts(best) + " / " + all.length + ".</p>" : "<p>Retry of the questions you missed.</p>") +
          '<div class="row">' + (markedList(marked).length ? '<button class="btn primary" id="gomk">Go back to marked questions (' + markedList(marked).length + ')</button>' : "") + (missed.length ? '<button class="btn primary" id="rev">Show only my wrong answers (' + missed.length + ')</button><button class="btn" id="retry">Retry only these</button>' : '<p class="src">No wrong answers. Well done.</p>') +
          '<button class="btn" id="again">' + (full ? "Try again" : "Back to the full quiz") + '</button></div>' + weakHTML(missed.map(function (w) { return { q: w.q, lid: lec.id }; })) + '<div id="review"></div>';
        scoreReveal(p, score, qs.length); streak = 0;
        var gm = p.querySelector("#gomk"); if (gm) gm.onclick = function () { i = markedList(marked)[0]; render(); window.scrollTo(0, p.getBoundingClientRect().top + window.scrollY - 120); };
        p.querySelector("#again").onclick = function () { qs = all.map(shuffleQ); fullRun = true; i = 0; score = 0; wrong = []; done = []; marked = {}; render(); };
        if (missed.length) {
          p.querySelector("#retry").onclick = function () { qs = missed.map(function (w) { return shuffleQ(w.q); }); fullRun = false; i = 0; score = 0; wrong = []; done = []; marked = {}; render(); };
          p.querySelector("#rev").onclick = function () {
            var box = p.querySelector("#review");
            if (box.innerHTML) { box.innerHTML = ""; this.textContent = "Show only my wrong answers (" + missed.length + ")"; return; }
            this.textContent = "Hide my wrong answers";
            box.innerHTML = '<h2 class="rev-h">Your wrong answers</h2>' + missed.map(function (w) {
              var q = w.q, ans = q.answers || [q.answer];
              return '<div class="rev-item"><p class="qhead">Question ' + w.n + '</p><p class="qtext">' + esc(figQText(q, q._fig || (lec.visual && lec.visual.figure))) + "</p>" + (q.flow ? flowHTML(q, true) : q.occ ? occHTML(q, true) : "") +
                q.options.map(function (o, n) {
                  var om = optMark(ans, w.chosen || [], n), cls = om.cls, tag = om.tag;
                  return '<div class="opt static' + cls + '"><span class="letter">' + LET[n].toUpperCase() + "</span><span>" + esc(o) + "</span>" + tag + "</div>";
                }).join("") + (q.why ? '<div class="why">' + esc(q.why) + "</div>" : "") + slidesHTML(q) + "</div>";
            }).join("");
            box.scrollIntoView({ behavior: "smooth", block: "start" });
          };
        }
        return;
      }
      var q = qs[i], multi = true;
      var qfig = q._fig || (lec.visual && lec.visual.figure);
      var qph = q.m3d ? m3dHTML(q) : q.flow ? flowHTML(q, !!done[i]) : q.occ ? occHTML(q, !!done[i]) : q.target ? photoQ(q._lid || lec.id, q.target) : "";
      var pic = qph ? qph : (q.target && qfig)
        ? '<div class="diagram-box qfig">' + figureSVG(qfig, { mode: "quiz", target: q.target, uid: "q" + i }) + "</div>"
        : "";
      p.innerHTML = qbarHTML(i, qs.length, marked, i + 1 < qs.length ? "Next" : "Finish", false, false) + '<p class="qhead">' + (q.src ? '<span class="qsrc">' + esc(q.src) + "</span>" : "") + (q._from ? '<span class="qfrom">' + esc(q._from) + "</span>" : "") + (q._off ? '<span class="qoff">Not on the midterm</span>' : "") + flameHTML(streak, false) + '</p>' + ecgProgress(done.filter(Boolean).length / qs.length) + '<p class="qtext">' + esc(figQText(q, qfig)) + "</p>" + pic +
        q.options.map(function (o, n) { return '<button class="opt" data-n="' + n + '" aria-pressed="false"><span class="letter">' + LET[n].toUpperCase() + "</span><span>" + esc(o) + "</span></button>"; }).join("") + (multi ? '<button class="btn primary" id="chk" type="button">Check my answer</button>' : "") + '<div id="fb"></div>';
      centerTarget(p); m3dMount(p, q);
      var opts = p.querySelectorAll(".opt");
      function finish(chosen, skipped) {
        var ans = q.answers || [q.answer];
        var ok = chosen.length === ans.length && chosen.every(function (n) { return ans.indexOf(n) > -1; }), pts = qPoints(q, chosen);
        var fresh = !done[i];
        if (fresh) {
          done[i] = { chosen: chosen, ok: ok, pts: pts, skipped: !!skipped }; trackAnswer(q, lec.id, ok);
          var was = streak; streak = ok ? streak + 1 : 0;
          var fl = p.querySelector(".streak"); if (fl) fl.outerHTML = flameHTML(streak, streak === 5 || (was >= 5 && !ok), was);
          else if (streak >= 5) p.querySelector(".qhead").insertAdjacentHTML("beforeend", flameHTML(streak, streak === 5));
        }
        opts.forEach(function (x) {
          var n = +x.dataset.n; x.disabled = true; x.classList.remove("picked");
          if (ans.indexOf(n) > -1) x.classList.add("correct"); else if (chosen.indexOf(n) > -1) x.classList.add("wrong");
          if (q.notes && q.notes[n]) x.insertAdjacentHTML("beforeend", '<span class="onote">' + (/^(correct|wrong)\b/i.test(q.notes[n]) ? "" : ans.indexOf(n) > -1 ? "Correct. " : "Wrong. ") + esc(q.notes[n]) + "</span>");
        });
        var c = p.querySelector("#chk"); if (c) c.remove();
        if (fresh && !skipped) answerFx(opts, ans, chosen, ok);
        var ot = p.querySelector(".otile.q"); if (ot) { ot.classList.add("show"); ot.textContent = ""; }
        if (q.flow) { var fq = p.querySelector(".flowq"); if (fq) fq.outerHTML = flowHTML(q, true); }
        document.getElementById("fb").innerHTML = feedback(q, ok, skipped, (done[i] || {}).pts);
        p.querySelector("#rep").onclick = function () { reportMistake(q, lec.id); };
        saveResume();
        var qe = p.querySelector(".qecg"); if (qe) qe.outerHTML = ecgProgress(done.filter(Boolean).length / qs.length);
        var fw = p.querySelector("#fwd"); fw.classList.add("primary"); fw.innerHTML = (i + 1 < qs.length ? "Next" : "See score") + " &rarr;";
        if (!skipped) fw.focus({ preventScroll: true });
      }
      if (multi) {
        opts.forEach(function (b) { b.addEventListener("click", function () { var on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", String(on)); b.classList.toggle("picked", on); }); });
        p.querySelector("#chk").addEventListener("click", function () {
          var chosen = []; opts.forEach(function (b) { if (b.getAttribute("aria-pressed") === "true") chosen.push(+b.dataset.n); });
          finish(chosen);
        });
      } else {
        opts.forEach(function (b) { b.addEventListener("click", function () { finish([+b.dataset.n]); }); });
      }
      function toTop() { window.scrollTo(0, p.getBoundingClientRect().top + window.scrollY - 120); }
      qbarWire(p, { i: i, n: qs.length, marked: marked, state: function (k) { var x = done[k]; return x ? (x.ok ? "ok" : "bad") : ""; }, go: function (k) { i = k; render(); toTop(); } });
      p.querySelector("#prev").onclick = function () { if (i > 0) { i--; render(); toTop(); } };
      p.querySelector("#fwd").onclick = function () {
        if (done[i]) { i++; render(); toTop(); return; }
        /* moving on without answering: keep any ticked options and come back to it later */
        var picked = []; opts.forEach(function (b) { if (b.getAttribute("aria-pressed") === "true") picked.push(+b.dataset.n); });
        if (picked.length) drafts[i] = picked; else delete drafts[i];
        if (i + 1 < qs.length) { i++; render(); toTop(); return; }
        /* last question: point to the unanswered ones, or show the score */
        var left = []; qs.forEach(function (x, k) { if (!done[k]) left.push(k); });
        var other = left.filter(function (k) { return k !== i; });
        document.getElementById("fb").innerHTML = '<div class="why"><strong>' + left.length + " question" + (left.length > 1 ? "s" : "") + " not answered yet.</strong> Unanswered questions count as 0 in the score." +
          '<div class="row" style="margin-top:.6rem">' + (other.length ? '<button class="btn primary" id="goleft" type="button">Go to question ' + (other[0] + 1) + "</button>" : "") + '<button class="btn" id="finnow" type="button">See score anyway</button></div></div>';
        var gl = document.getElementById("goleft"); if (gl) gl.onclick = function () { i = other[0]; render(); toTop(); };
        document.getElementById("finnow").onclick = function () { i = qs.length; render(); toTop(); };
        document.getElementById("fb").scrollIntoView({ behavior: "smooth", block: "nearest" });
      };
      if (!done[i] && drafts[i] && multi) opts.forEach(function (b) { if (drafts[i].indexOf(+b.dataset.n) > -1) { b.setAttribute("aria-pressed", "true"); b.classList.add("picked"); } });
      /* coming back to an answered question: show it as answered */
      if (done[i]) finish(done[i].chosen, done[i].skipped);
    }
    render();
  }

  /* lecture flashcards, scheduled like Anki (sina:fcsrs, key "lectureId|cardId") */
  function cardsPanel(p, lec) {
    var filter = "all", cram = false, queue = [], shown = false, done = 0, LK = lec.id + "|";
    var kinds = lec.cards.some(function (x) { return x.type === "image"; }) ? [["all", "All"], ["text", "Text"], ["image", "Pictures"]] : [];
    function pool() { return lec.cards.filter(function (c) { return filter === "all" || c.type === filter; }); }
    function build() {
      var sr = store.get("sina:fcsrs", {}), d = dayNo(), L = pool();
      queue = cram ? shuffle(L.slice()) : shuffle(L.filter(function (c) { var e = sr[LK + c.id]; return e && e[0] <= d; })).concat(L.filter(function (c) { return !sr[LK + c.id]; }));
    }
    function reset() { var sr = store.get("sina:fcsrs", {}); Object.keys(sr).forEach(function (k) { if (k.indexOf(LK) === 0) delete sr[k]; }); store.set("sina:fcsrs", sr); cram = false; done = 0; shown = false; build(); render(); }
    function render() {
      var sr = store.get("sina:fcsrs", {}), d = dayNo(), L = pool(), nN = 0, nL = 0, nR = 0;
      queue.forEach(function (c) { var e = sr[LK + c.id]; if (!e) nN++; else if (!e[1]) nL++; else nR++; });
      var learned = L.filter(function (c) { var e = sr[LK + c.id]; return e && e[1] > 0; }).length;
      var tools = '<div class="deck-tools"><div class="chips" role="group" aria-label="Card type">' + kinds.map(function (f) { return '<button data-f="' + f[0] + '" aria-pressed="' + (f[0] === filter) + '">' + f[1] + "</button>"; }).join("") +
        '</div><span class="progress-line">' + (queue.length ? nN + " new · " + nL + " learning · " + nR + " to review" : learned + " of " + L.length + " cards learned") + "</span></div>";
      function wireChips() { p.querySelectorAll(".chips button").forEach(function (b) { b.onclick = function () { filter = b.dataset.f; shown = false; build(); render(); }; }); }
      if (!queue.length) {
        var nd = null; L.forEach(function (c) { var e = sr[LK + c.id]; if (e && (nd === null || e[0] < nd)) nd = e[0]; });
        var dd = nd === null ? null : nd - d;
        p.innerHTML = tools + '<div class="fc-donebox"><p><strong>' + (done ? "Done for now." : "All caught up on this lecture.") + "</strong> " +
          (dd === null ? "" : "The next card comes back " + (dd <= 0 ? "today" : dd === 1 ? "tomorrow" : "in " + dd + " days") + ".") + "</p>" +
          '<p class="meta">Cards come back just before you would forget them: rate a card Again, Hard, Good or Easy and the next time is set from that.</p>' +
          '<div class="row"><button class="btn primary" id="cram">Go through all ' + L.length + ' cards anyway</button><button class="btn" id="rst">Reset progress</button></div></div>';
        wireChips(); remindSoon();
        p.querySelector("#cram").onclick = function () { cram = true; shown = false; build(); render(); };
        p.querySelector("#rst").onclick = reset;
        return;
      }
      var c = queue[0], e = sr[LK + c.id], pic = "";
      if (c.type === "image" && photoQ(lec.id, c.target)) pic = photoQ(lec.id, c.target);
      else if (c.type === "image") {
        pic = lec.visual && lec.visual.figure
          ? '<div class="diagram-box">' + figureSVG(lec.visual.figure, { mode: "quiz", target: c.target, uid: "fc" }) + "</div>"
          : '<div class="diagram-box">' + orbitSVG({ mode: "quiz", target: c.target, uid: "fc" }) + "</div>";
      }
      var front = '<div class="kind">' + (c.type === "image" ? "Picture card" : "Text card") + (e ? "" : ' <span class="ak-newtag">New</span>') + '</div><div class="front">' + esc(c.type === "image" && lec.visual && lec.visual.figure ? figQText({ q: c.front, target: c.target }, lec.visual.figure) : c.front) + "</div>" + pic;
      p.innerHTML = tools +
        '<div class="fc-stage"><div class="fcard flip3d' + (shown ? " flipped" : "") + '" aria-live="polite"><div class="fc-face fc-front">' + front + '<p class="fc-tap">Tap to flip</p></div>' +
        '<div class="fc-face fc-back"><div class="kind">Answer</div><div class="front small">' + esc(c.front) + '</div><div class="back"><p>' + esc(c.back) + "</p></div></div></div></div>" +
        '<div class="fc-actions" id="fcact"></div><p class="fc-swipe">Tap the card to flip it. Then swipe right for Good, left for Again.</p>' +
        '<div class="row" style="margin-top:1rem"><button class="btn" id="shuf">Shuffle</button><button class="btn" id="rst">Reset progress</button></div>';
      centerTarget(p); wireChips();
      var card = p.querySelector(".fcard"), act = p.querySelector("#fcact");
      function acts() {
        act.innerHTML = shown ? rateHTML(e) : '<button class="btn primary fc-show" id="fcshow" type="button">Show answer</button>';
        act.querySelectorAll("[data-g]").forEach(function (b) { b.onclick = function () { rate(+b.dataset.g); }; });
        var sb = act.querySelector("#fcshow"); if (sb) sb.onclick = flip;
      }
      function flip() { shown = !shown; card.classList.toggle("flipped", shown); acts(); if (shown) { var g = act.querySelector(".r3"); if (g) g.focus({ preventScroll: true }); } }
      function rate(g) {
        var s2 = store.get("sina:fcsrs", {}), nx = srsNext(e, g); s2[LK + c.id] = nx; store.set("sina:fcsrs", s2); fcLog();
        queue.shift(); if (!nx[1]) queue.splice(Math.min(3, queue.length), 0, c); else done++;
        fcOut(card, g === 1 ? -1 : 1, function () { shown = false; render(); });
      }
      acts();
      fcWire(card, function () { return shown; }, flip, function (dir) { rate(dir > 0 ? 3 : 1); });
      fcKeys(card, function () { return shown; }, flip, rate);
      p.querySelector("#shuf").onclick = function () { queue = shuffle(queue); shown = false; render(); };
      p.querySelector("#rst").onclick = reset;
    }
    build(); render();
  }

  function deeperPanel(p, lec) {
    if (!lec.deeper || !lec.deeper.length) { p.innerHTML = '<div class="note">Extra reading for this lecture is coming with the full version. Meanwhile, the Summary, Questions and Flashcards tabs cover the lecture.</div>'; return; }
    p.innerHTML = '<div class="note">Everything here goes beyond your lecture. It is optional, sourced, and meant to help you understand the topic more deeply.</div>' +
      lec.deeper.map(function (d, n) { return "<details" + (n === 0 ? " open" : "") + "><summary>" + esc(d.title) + "</summary>" + d.html + "</details>"; }).join("");
  }

  function hostOf(u) { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } }
  function previewSrc(r) {
    if (r.img) return r.img;
    var m = /youtube\.com\/watch\?v=([\w-]{11})/.exec(r.url) || /youtu\.be\/([\w-]{11})/.exec(r.url);
    if (m) return "https://img.youtube.com/vi/" + m[1] + "/hqdefault.jpg";
    return "https://s.wordpress.com/mshots/v1/" + encodeURIComponent(r.url) + "?w=640&h=400";
  }
  function resourcesPanel(p, lec) {
    var noRes = !lec.resources || !lec.resources.length;
    p.innerHTML = noRes ? '<div class="note">Videos and websites for this lecture are coming with the full version.</div>' : ( '<p>Each card shows a preview of the page, video or model you will open. Links open other websites and need an internet connection. Items marked "reviewed by title and description only" were not watched in full.</p><ul class="rgrid">' +
      lec.resources.map(function (r) {
        return '<li class="rcard"><a class="rlink" href="' + esc(r.url) + '" target="_blank" rel="noopener"><span class="rthumb" data-host="' + esc(hostOf(r.url)) + '"><img loading="lazy" alt="" src="' + esc(previewSrc(r)) + '"><span class="rkind">' + esc(r.kind) + '</span></span>' +
          '<span class="rbody"><span class="t">' + esc(r.title) + '</span><span class="w">' + esc(r.why) + '</span><span class="dom">' + esc(hostOf(r.url)) + "</span>" + (r.note ? '<span class="n">' + esc(r.note) + "</span>" : "") + "</span></a></li>";
      }).join("") + "</ul>");
    var sub = subjectById(lec.subject), extra = "";
    var chans = (S.channels && (S.channels[lec.id] || S.channels[lec.subject])) || [];
    if (chans.length) extra += "<h2>Channels worth following</h2><ul class=\"rgrid\">" + chans.map(function (r) {
      return '<li class="rcard"><a class="rlink" href="' + esc(r.url) + '" target="_blank" rel="noopener"><span class="rthumb" data-host="' + esc(hostOf(r.url)) + '"><img loading="lazy" alt="" src="' + esc(previewSrc(r)) + '"><span class="rkind">Channel</span></span><span class="rbody"><span class="t">' + esc(r.title) + '</span><span class="w">' + esc(r.why) + '</span><span class="dom">' + esc(hostOf(r.url)) + "</span></span></a></li>";
    }).join("") + "</ul>";
    if (S.apps && S.apps.length) extra += "<h2>Apps and practice sites</h2><ul class=\"rgrid\">" + S.apps.map(function (r) {
      return '<li class="rcard"><a class="rlink" href="' + esc(r.url) + '" target="_blank" rel="noopener"><span class="rthumb" data-host="' + esc(hostOf(r.url)) + '"><img loading="lazy" alt="" src="' + esc(previewSrc(r)) + '"><span class="rkind">' + esc(r.kind) + '</span></span><span class="rbody"><span class="t">' + esc(r.title) + '</span><span class="w">' + esc(r.why) + '</span><span class="dom">' + esc(hostOf(r.url)) + "</span>" + (r.note ? '<span class="n">' + esc(r.note) + "</span>" : "") + "</span></a></li>";
    }).join("") + "</ul>";
    if (extra) p.insertAdjacentHTML("beforeend", extra);
    p.querySelectorAll(".rthumb img").forEach(function (img) {
      img.addEventListener("error", function () {
        var box = img.parentNode; img.remove();
        box.classList.add("nofoto");
        var f = document.createElement("span"); f.className = "rfallback"; f.textContent = box.dataset.host; box.insertBefore(f, box.firstChild);
      });
    });
  }

  /* ---------- past papers ---------- */
  /* ---------- Practice: questions by lecture and past papers as quizzes, per subject ---------- */
  function practiceCount(sb) {
    var lec = 0;
    (sb.groups || []).forEach(function (g) { g.items.forEach(function (it) { var L = S.lectures[it.id]; if (L) lec += (L.mcqs || []).length; }); });
    var papers = (S.papers || []).filter(function (x) { return x.subject === sb.id && x.questions && x.questions.length; }).length;
    return { lec: lec, papers: papers };
  }
  function practiceHome() {
    var html = '<div class="wrap"><p class="crumbs"><a href="#/">Home</a> / Practice questions</p><h1>Practice questions</h1><p class="meta">Pick a subject, then practise by lecture or do a past paper as a quiz.</p><div class="row" style="margin:0 0 1rem"><a class="btn" href="#/progress">My progress</a>' + (S.api ? '<a class="btn" href="#/leaderboard">Leaderboard</a>' : "") + '<a class="btn" href="#/mistakes">Redo my mistakes (' + mistakeList().length + ')</a></div>';
    progSemesters().forEach(function (k) {
      var subs = progSubjects().filter(function (sb) { return sb.semester === k && (practiceCount(sb).lec || practiceCount(sb).papers); });
      if (!subs.length) return;
      html += '<h3 class="sem-title">' + esc(T("home.semester", { n: k.replace(/^S/, "") })) + '</h3><ul class="subject-list">' + subs.map(function (sb) {
        var c = practiceCount(sb), mid = subjectMid(sb);
        return '<li><a href="#/practice/' + sb.id + '"><span><span class="name">' + esc(sb.name) + "</span>" + (mid ? '<span class="desc"><span class="pill mid">Midterm</span></span>' : "") + '</span><span class="tag live">' + c.lec + " questions" + (c.papers ? " &middot; " + c.papers + " paper" + (c.papers > 1 ? "s" : "") : "") + "</span></a></li>";
      }).join("") + "</ul>";
    });
    setView(html + "</div>", "Practice questions");
  }
  function practiceView(id, sec, arg) {
    var s = subjectById(id);
    if (!s || !s.groups) return practiceHome();
    var c = practiceCount(s), papers = (S.papers || []).filter(function (x) { return x.subject === s.id; });
    var secs = [["lectures", "By lecture"]]; if (papers.length) secs.push(["papers", "Past papers"]);
    if (!secs.some(function (x) { return x[0] === sec; })) sec = "lectures";
    var html = '<div class="wrap"><p class="crumbs"><a href="#/">Home</a> / <a href="#/practice">Practice questions</a> / ' + esc(s.name) + "</p><h1>" + esc(s.name) + '</h1><p class="meta">' + c.lec + " lecture questions" + (c.papers ? " and " + c.papers + " past paper" + (c.papers > 1 ? "s" : "") + " as quizzes" : "") + '. <a href="#/subject/' + s.id + '">Open the ' + esc(s.name) + " page</a></p>" +
      '<nav class="tabs sticky" aria-label="Practice sections">' + secs.map(function (t) {
        return '<a class="tab" href="#/practice/' + s.id + "/" + t[0] + '" aria-selected="' + (t[0] === sec) + '"' + (t[0] === sec ? ' aria-current="page"' : "") + ">" + t[1] + "</a>";
      }).join("") + '</nav><div id="panel"></div></div>';
    setView(html, "Practice: " + s.name);
    wireTabs(app);
    var p = document.getElementById("panel");
    if (sec === "papers") {
      var quiz = papers.filter(function (x) { return x.questions && x.questions.length; }), pdf = papers.filter(function (x) { return !(x.questions && x.questions.length); }), parts = paperParts(papers);
      var qrow = function (x) { return '<li class="paper-row"><a href="#/paper/' + esc(x.id) + '"><span>' + esc(x.title) + (x.year ? " (" + esc(x.year) + ")" : "") + '</span></a><span class="paper-btns"><a class="btn small primary" href="#/paper/' + esc(x.id) + '">Start quiz (' + x.questions.length + ")</a></span></li>"; };
      if (parts) { p.innerHTML = parts.map(function (g) { return '<h2 class="group-title">' + esc(g[0]) + '</h2><ul class="lec-list">' + g[1].map(function (x) { return x.questions && x.questions.length ? qrow(x) : paperRow(x); }).join("") + "</ul>"; }).join(""); return; }
      p.innerHTML = (quiz.length ? '<h2 class="group-title">Past papers as quizzes</h2><ul class="lec-list">' + quiz.map(function (x) {
          return '<li class="paper-row"><a href="#/paper/' + esc(x.id) + '"><span>' + esc(x.title) + (x.year ? " (" + esc(x.year) + ")" : "") + '</span></a><span class="paper-btns"><a class="btn small primary" href="#/paper/' + esc(x.id) + '">Start quiz (' + x.questions.length + ")</a></span></li>";
        }).join("") + "</ul>" : "") +
        (pdf.length ? '<h2 class="group-title">PDF only for now</h2><ul class="lec-list">' + pdf.map(paperRow).join("") + "</ul>" : "");
    } else subQuestionsPanel(p, s, arg);
  }

  /* past papers: which questions are on lectures outside the next midterm of that subject */
  function nextMid(subId) {
    var t = today();
    return progMidterms().filter(function (m) { return midSubs(m).indexOf(subId) > -1 && (!m.date || m.date >= t); }).sort(function (a, b) { return (a.date || "9") < (b.date || "9") ? -1 : 1; })[0] || null;
  }
  function paperOff(x) {
    var m = x.questions && nextMid(x.subject), map = S.paperLec || {};
    if (!m) return null;
    var items = [].concat.apply([], m.groups.map(function (g) { return g.items; })), off = [];
    x.questions.forEach(function (q, i) { var l = map[qKey(q)]; if (l && items.indexOf(l) < 0) off.push(i); });
    return off.length ? { m: m, off: off } : null;
  }
  function midDate(m) { if (!m.date) return ""; var d = new Date(m.date + "T12:00:00"); return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }); }
  function paperRow(x) {
    var quick = (x.links || []).filter(function (l) { return l.short; });
    if (quick.length) {
      var po1 = paperOff(x);
      return '<li class="paper-row"><a href="#/paper/' + esc(x.id) + '"><span>' + esc(x.title) + (x.year ? " (" + esc(x.year) + ")" : "") + (po1 ? '<span class="paper-off">' + (po1.off.length === x.questions.length ? "None of it is on the midterm" : po1.off.length + " of " + x.questions.length + " questions not on the midterm") + "</span>" : "") + "</span></a>" +
        '<span class="paper-btns">' + (x.questions ? '<a class="btn small primary" href="#/paper/' + esc(x.id) + '">Online quiz</a>' : "") +
        quick.map(function (l) { return '<a class="btn small" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.short) + "</a>"; }).join("") + "</span></li>";
    }
    var tags = [x.questions ? "Quiz" : "", (x.pdf || x.links) ? "PDF" : ""].filter(Boolean).join(" and "), po = paperOff(x);
    if (po) return '<li><a href="#/paper/' + esc(x.id) + '"><span>' + esc(x.title) + (x.year ? " (" + esc(x.year) + ")" : "") + '<span class="paper-off">' + (po.off.length === x.questions.length ? "None of it is on the midterm" : po.off.length + " of " + x.questions.length + " questions not on the midterm") + '</span></span><span class="pill">' + esc(tags || "Open") + "</span></a></li>";
    return '<li><a href="#/paper/' + esc(x.id) + '"><span>' + esc(x.title) + (x.year ? " (" + esc(x.year) + ")" : "") + '</span><span class="pill">' + esc(tags || "Open") + "</span></a></li>";
  }
  function papersView(subjectId) {
    var sb0 = subjectId && subjectById(subjectId);
    if (sb0 && sb0.groups) { location.replace("#/subject/" + subjectId + "/papers"); return; }
    var all = S.papers || [];
    var html = '<div class="wrap"><p class="crumbs"><a href="#/">Home</a> / Past papers</p><h1>Past papers</h1>';
    var any = false;
    progSubjects().forEach(function (sb) {
      var list = all.filter(function (x) { return x.subject === sb.id; });
      if (!list.length) return;
      any = true;
      html += "<h2>" + (sb.groups ? '<a class="h-link" href="#/subject/' + sb.id + '/papers">' + esc(sb.name) + "</a>" : esc(sb.name)) + '</h2><ul class="lec-list">' + list.map(paperRow).join("") + "</ul>";
    });
    var others = all.filter(function (x) { return x.program === PROG && !subjectById(x.subject); });
    var groups = [];
    others.forEach(function (x) { if (groups.indexOf(x.subject) < 0) groups.push(x.subject); });
    groups.forEach(function (g) {
      any = true;
      html += "<h2>" + esc((S.otherPaperGroups || {})[g] || "Other") + '</h2><ul class="lec-list">' + others.filter(function (x) { return x.subject === g; }).map(paperRow).join("") + "</ul>";
    });
    var folder = (S.papersFolders || {})[PROG] || (PROG === S.DEFAULT_PROGRAM ? S.papersFolder : "");
    if (!any) html += "<p>Past papers will be added here soon.</p>" + (folder ? '<p class="src">Meanwhile, see <a href="' + esc(folder) + '" target="_blank" rel="noopener">the Google Drive folder</a>.</p>' : "");
    else if (folder) html += '<p class="src" style="margin-top:1.6rem">All the past papers are also in <a href="' + esc(folder) + '" target="_blank" rel="noopener">this Google Drive folder</a>.</p>';
    setView(html + "</div>", "Past papers");
  }
  function paperView(id) {
    var x = (S.papers || []).filter(function (q) { return q.id === id; })[0];
    if (!x) return notFound();
    var sb = subjectById(x.subject);
    var html = '<div class="wrap"><p class="crumbs"><a href="#/">Home</a> / <a href="' + (sb && sb.groups ? "#/subject/" + x.subject + "/papers" : "#/papers") + '">Past papers</a></p><h1>' + esc(x.title) + '</h1><p class="meta">' + esc(sb ? sb.name : ((S.otherPaperGroups || {})[x.subject] || "")) + (x.year ? ", " + esc(x.year) : "") + (x.session ? ", " + esc(x.session) : "") + "</p>";
    var links = x.links || (x.pdf ? [{ label: "Open the paper (PDF)", url: x.pdf }] : []);
    var hasQ = x.questions && x.questions.length;
    if (links.length && hasQ) html += '<p class="pdf-links">' + links.map(function (l) { return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.short || l.label) + "</a>"; }).join(" &middot; ") + "</p>";
    else if (links.length) html += '<div class="row" style="margin:0 0 1.4rem">' + links.map(function (l, n) { return '<a class="btn' + (n === 0 ? " primary" : "") + '" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>"; }).join("") + "</div>";
    if (x.note) html += '<p class="src">' + esc(x.note) + "</p>";
    if (hasQ && x.keyBy === "sina") html += '<p class="src key-note">This paper came without an answer key. The answers here were written by Sina from the lectures; if one looks wrong, use Report a mistake under the question.</p>';
    else if (hasQ && x.keyBy === "part") html += '<p class="src key-note">Part of this paper came without an answer key. Sina wrote those answers from the lectures; if one looks wrong, use Report a mistake under the question.</p>';
    var po = hasQ && paperOff(x), onlyMid = false;
    if (po) html += '<div class="mid-off"><p><strong>' + (po.off.length === x.questions.length ? "None of these questions are" : po.off.length + " of " + x.questions.length + " questions are not") + " on the " + esc(po.m.title) + "</strong>" + (po.m.date ? " (" + esc(midDate(po.m)) + ")" : "") + ". They cover lectures outside the midterm and are tagged <span class=\"qoff\">Not on the midterm</span>.</p>" + (po.off.length < x.questions.length ? '<button class="btn small-btn" id="mid-only" type="button" aria-pressed="false">Only midterm questions (' + (x.questions.length - po.off.length) + ")</button>" : "") + "</div>";
    if (hasQ) html += resumeBanner(function (r) { return r.id === x.id; });
    if (hasQ) html += '<div class="row exam-row"><button class="btn" id="exam-btn" type="button">Exam mode (timed)</button></div>';
    html += '<div id="paperq"></div></div>';
    setView(html, x.title);
    function tagged(list) { return list.map(function (q, i) { var c = {}; for (var k in q) c[k] = q[k]; if (po && po.off.indexOf(i) > -1) c._off = 1; return c; }); }
    function qlist() { return tagged(x.questions).filter(function (q) { return !onlyMid || !q._off; }); }
    if (hasQ) {
      questionsPanel(document.getElementById("paperq"), { id: x.id, mcqs: qlist() });
      var mo = document.getElementById("mid-only");
      if (mo) mo.onclick = function () { onlyMid = !onlyMid; mo.setAttribute("aria-pressed", String(onlyMid)); mo.classList.toggle("primary", onlyMid); mo.textContent = onlyMid ? "Show all questions (" + x.questions.length + ")" : "Only midterm questions (" + (x.questions.length - po.off.length) + ")"; questionsPanel(document.getElementById("paperq"), { id: x.id + (onlyMid ? ":mid" : ""), mcqs: qlist() }); };
      document.getElementById("exam-btn").onclick = function () {
        this.parentNode.hidden = true;
        examIntro(document.getElementById("paperq"), { id: x.id + (onlyMid ? ":mid" : ""), paper: !onlyMid, mcqs: qlist().map(function (c) { c._lid = x.id; return c; }) }, function () { paperView(id); });
      };
    }
  }

  function notFound() {
    setView('<div class="wrap"><h1>Not built yet</h1><p>This lecture is on the list, but its page is not ready. <a href="#/">Back to the home page</a>.</p></div>', "Not ready");
  }

  /* ---------- what's new ---------- */
  function updateNewsDot() { var d = document.querySelector("#news-btn .ndot"); if (d) d.hidden = !newBadge(); }
  /* home: quick access (continue, mistakes, progress, leaderboard) */
  function quickTiles() {
    var last = store.get("sina:last", null), mk = mistakeList().length, st = store.get("sina:stats", {}), seen = 0, ok = 0;
    Object.keys(st).forEach(function (lid) { if (!inProgram(lid)) return; seen += st[lid][0]; ok += st[lid][1]; });
    var ico = {
      go: '<path d="M8 5l11 7-11 7z" fill="currentColor"/>',
      redo: '<path d="M4 12a8 8 0 1 0 2.4-5.7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M4 3v5h5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
      prog: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2.2" opacity=".3"/><path d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M7 12.5h2.5l1.5-3 2 6 1.5-3H17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
      weak: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>',
      lb: '<path d="M7 4h10v4a5 5 0 0 1-10 0z" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>'
    };
    var t = function (href, k, title, sub, cls) { return '<a class="qtile' + (cls ? " " + cls : "") + '" href="' + href + '"><span class="qt-ico"><svg viewBox="0 0 24 24" aria-hidden="true">' + ico[k] + '</svg></span><span class="qt-t">' + title + '</span><span class="qt-s">' + sub + "</span></a>"; };
    var h = '<nav class="quick" aria-label="Quick access">';
    var rs = resumeInfo();
    if (rs) h += t("#/resume", "go", "Resume quiz", esc(rs.title) + " · " + rs.n + "/" + rs.qs.length, "qt-go");
    else if (last && last.h) h += t(last.h, "go", "Continue", esc(last.t), "qt-go");
    h += t("#/mistakes", "redo", "Redo my mistakes", mk ? mk + " question" + (mk > 1 ? "s" : "") + " to redo" : "No mistakes yet", mk ? "qt-hot" : "");
    var due = allDue();
    if (due) h += t("#/review", "redo", "Review due", due + " review" + (due > 1 ? "s" : "") + " for today", "qt-hot");
    h += t("#/weak", "weak", "Weak spots", seen >= 6 ? "Quiz your 5 weakest lectures" : "Shows up as you answer", "");
    h += t("#/progress", "prog", "My progress", seen ? Math.round(ok / seen * 100) + "% accuracy · " + seen + " answered" : "Start a quiz to track it");
    if (S.api) h += t("#/leaderboard", "lb", "Leaderboard", "Best past paper scores");
    return h + "</nav>";
  }
  function newBadge() {
    var latest = (S.updates && S.updates[0] && S.updates[0].date) || null;
    return latest ? store.get("sina:seenUpdate", null) !== latest : false;
  }
  function updatesView() {
    var list = S.updates || [];
    var html = '<div class="wrap"><p class="crumbs"><a href="#/">Home</a> / What\'s new</p><h1>What\'s new</h1>' +
      (S.updated ? '<p class="meta">Last updated ' + esc(S.updated) + ".</p>" : "");
    if (!list.length) html += "<p>No updates recorded yet.</p>";
    list.forEach(function (u, i) {
      html += '<div class="upd' + (i === 0 ? " latest" : "") + '"><h2>' + esc(u.date) + "</h2><ul>" +
        u.items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
    });
    html += '<p class="src">If the site looks out of date on your device, close the tab and open it again.</p>';
    setView(html + "</div>", "What's new");
    if (list[0]) store.set("sina:seenUpdate", list[0].date);
  }

  /* ---------- welcome screen ---------- */
  function showWelcome() {
    var w = document.getElementById("welcome");
    if (!w) return;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var box = w.querySelector(".wbox"), h1 = box.querySelector("h1");
    box.insertAdjacentHTML("afterbegin", '<div class="w-art">' + caduceusHTML().replace('id="cad"', 'id="cad-welcome"') + "</div>");
    h1.outerHTML = '<p class="w-brand" aria-label="Sina">' + "Sina".split("").map(function (ch, i) { return '<span style="--i:' + i + '">' + ch + "</span>"; }).join("") + '<span class="dot" style="--i:4">.</span></p><svg class="w-ecg" viewBox="0 0 200 24" aria-hidden="true"><polyline pathLength="100" points="0,12 70,12 78,12 84,6 90,12 96,12 101,1 107,23 113,8 118,12 130,12 200,12"/></svg><h1 class="w-title">Your study buddy.</h1>';
    var eb = box.querySelector(".weyebrow"), tt = box.querySelector(".w-title"); if (eb && tt) tt.after(eb);
    w.hidden = false; w.classList.add("intro");
    document.body.classList.add("noscroll");
    var anim = { grow: 2.8, delay: 0.5 };
    startCaduceus(w.querySelector("canvas"), anim);
    w.insertAdjacentHTML("beforeend", '<button type="button" class="w-skip">Skip intro &rsaquo;</button>');
    var readyT = setTimeout(function () { w.classList.add("ready"); }, 4900);
    var skip = function () {
      if (w.classList.contains("skip")) return; w.classList.add("skip"); anim.grow = 0.001; anim.delay = 0;
      clearTimeout(readyT); setTimeout(function () { w.classList.add("ready"); }, 300);
      var f = w.querySelector(".w-year.on") || w.querySelector(".w-year") || w.querySelector("#enter"); if (f) f.focus({ preventScroll: true });
    };
    if (reduce) skip();
    w.addEventListener("click", function (e) { if (!w.classList.contains("ready")) { e.preventDefault(); e.stopPropagation(); skip(); } }, true);
    document.addEventListener("keydown", function k(e) { if (!document.body.contains(w)) { document.removeEventListener("keydown", k); return; } if (!w.classList.contains("ready") && (e.key === "Escape" || e.key === "Enter" || e.key === " ")) { e.preventDefault(); skip(); } });
    var btn = w.querySelector("#enter");
    function leave() {
      store.set("sina:welcomed", true); store.set("sina:yearAsked", "1");
      w.classList.add("leaving");
      document.body.classList.remove("noscroll");
      setTimeout(function () { w.remove(); }, 260);
    }
    /* after the animation: pick the year (the current one is marked) to enter */
    if (PROGS.length > 1) {
      var last = store.get("sina:program", null);
      btn.outerHTML = '<p class="w-pick">Choose your year</p><div class="w-years">' + PROGS.map(function (p) {
        var n = S.subjects.filter(function (x) { return (x.program || S.DEFAULT_PROGRAM) === p.id && x.groups; }).length;
        return '<button type="button" class="w-year' + (p.id === last ? " on" : "") + '" data-year="' + p.id + '"><span class="yc-name">' + esc(progName(p.id)) + '</span><span class="yc-meta">' + (p.id === last ? "Last used · " : "") + esc(n ? T("welcome.ready", { n: n }) : T("settings.soon")) + "</span></button>";
      }).join("") + "</div>";
      w.querySelectorAll("[data-year]").forEach(function (b) {
        b.addEventListener("click", function (e) { e.stopPropagation(); leave(); setProgram(b.dataset.year, true); });
      });
      var cur = w.querySelector(".w-year.on") || w.querySelector(".w-year"); if (cur) cur.focus({ preventScroll: true });
    } else {
      btn.focus({ preventScroll: true });
      btn.addEventListener("click", leave);
    }
  }
  showWelcome();

  applyLayout();

  /* sticky tabs sit right under the header, whatever its height */
  var hdrEl = document.querySelector(".site-header");
  function setHdr() { if (hdrEl) document.documentElement.style.setProperty("--hdr", hdrEl.offsetHeight + "px"); }
  setHdr(); window.addEventListener("resize", setHdr);

  /* ---------- back to top (long pages) ---------- */
  var toTop = document.createElement("button");
  toTop.className = "to-top"; toTop.type = "button"; toTop.setAttribute("aria-label", "Back to top"); toTop.hidden = true;
  toTop.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 19V5m0 0-6 6m6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(toTop);
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  window.addEventListener("scroll", function () { toTop.hidden = window.scrollY < 900; }, { passive: true });

  /* ---------- router ---------- */
  requestAnimationFrame(function () { requestAnimationFrame(function () { document.body.classList.remove("no-anim"); }); });

  /* ---------- visitor statistics (GoatCounter) ---------- */
  var gcLast = "", gcQueue = [];
  function gcSend(item) {
    if (window.goatcounter && typeof window.goatcounter.count === "function") { try { window.goatcounter.count(item); } catch (e) {} return true; }
    return false;
  }
  function gcFlush(tries) {
    while (gcQueue.length && gcSend(gcQueue[0])) gcQueue.shift();
    if (gcQueue.length && tries < 40) setTimeout(function () { gcFlush(tries + 1); }, 250);
  }
  function track(path, title, isEvent) {
    var item = { path: path, title: title || path, event: !!isEvent };
    gcQueue.push(item); gcFlush(0);
  }
  /* ---------- usage events: which actions people use (one count per action, no personal data) ---------- */
  var evSeen = {};
  window.addEventListener("hashchange", function () { evSeen = {}; });
  function ev(name, extra, once) {
    var parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean), where = parts[0] === "subject" && parts[3] ? parts[3] : parts[0] === "lecture" || parts[0] === "subject" || parts[0] === "paper" || parts[0] === "practice" ? parts.slice(0, 2).join("-") : (parts[0] || "home");
    var path = "/event/" + name + (extra ? "/" + extra : ""), key = path + "@" + where;
    if (once && evSeen[key]) return; evSeen[key] = 1;
    track(path, name.replace(/-/g, " ") + (extra ? ": " + extra : "") + " · " + where + " | " + progName(), true);
  }
  document.addEventListener("click", function (e) {
    var el = e.target.closest && e.target.closest("a, button, summary"); if (!el) return;
    var id = el.id, m;
    try {
      if (id === "qstart") ev("quiz-start");
      else if (id === "xgo") ev("exam-start");
      else if (id === "xsub") ev("exam-submit");
      else if (id === "wk-go") ev("weak-quiz");
      else if (id === "mk-all" || el.classList.contains("mk-row")) ev("redo-mistakes");
      else if (id === "rv-go") ev("review-start");
      else if (id === "fcshow" || el.closest(".fcard")) ev("flashcards", "", true);
      else if (id === "rep") ev("report-open");
      else if (id === "rd-send") ev("report-sent");
      else if (el.hasAttribute("data-pdf")) ev("pdf-download");
      else if (el.tagName === "SUMMARY" && el.parentNode.classList.contains("slide-ref")) ev("slide-explain", "", true);
      else if (el.dataset && el.dataset.mode) ev("anking-mode", el.dataset.mode === "c" ? "flashcards" : "questions");
      else if (el.dataset && el.dataset.themeChoice) ev("theme", el.dataset.themeChoice);
      else if (el.classList.contains("qtile")) ev("home-tile", (el.getAttribute("href") || "").replace(/^#\/?/, "").split("/")[0] || "continue");
      else if (el.closest("#search-results")) ev("search-open");
      else if (el.tagName === "A" && /^https?:/.test(el.getAttribute("href") || "") && (m = el.hostname) && m !== location.hostname) ev("out", m.replace(/^www\./, ""));
    } catch (err) {}
  }, true);
  function trackView() {
    var path = "/" + location.hash.replace(/^#\/?/, "");
    if (path === gcLast) return;
    gcLast = path;
    var parts = path.split("/").filter(Boolean), title = "Home";
    if (parts[0] === "lecture" && S.lectures[parts[1]]) title = S.lectures[parts[1]].title + (parts[2] ? " (" + parts[2] + ")" : "");
    else if (parts[0] === "subject") { var sb = subjectById(parts[1]); title = sb ? sb.name : path; }
    else if (parts.length) title = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    track(path, title + " | " + progName(), false);
  }


  /* ---------- study tracking: per-lecture accuracy, mistakes to redo, active days (all on this device) ---------- */
  function toast(msg, ms) {
    var t = document.getElementById("toast") || document.body.appendChild(Object.assign(document.createElement("div"), { id: "toast", className: "toast", role: "status" }));
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, ms || 2800);
  }
  function today() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function trackAnswer(q, src, ok) {
    var k = q._k || qKey(q), lid = q._lid || src;
    var asked = store.get("sina:asked", {}); asked[k] = dayNo(); store.set("sina:asked", asked);
    if (!lid || /^mix:|^mistakes/.test(lid)) return;
    var st = store.get("sina:stats", {}), e = st[lid] || (st[lid] = [0, 0]); e[0]++; if (ok) e[1]++; store.set("sina:stats", st);
    var mk = store.get("sina:mistakes", {}); if (ok) delete mk[k]; else mk[k] = { l: lid, t: Date.now() }; store.set("sina:mistakes", mk);
    /* spaced repetition: a missed question comes back tomorrow, then after 3, 7, 16 and 35 days each time it is answered right */
    var sr = store.get("sina:srs", {}), INT = [1, 3, 7, 16, 35];
    if (!ok) sr[k] = [0, dayNo() + 1, lid];
    else if (sr[k]) { var bx = sr[k][0] + 1; if (bx >= INT.length) delete sr[k]; else sr[k] = [bx, dayNo() + INT[bx], lid]; }
    store.set("sina:srs", sr);
    if (ok) { var rt = store.get("sina:right", {}); if (!rt[k]) { rt[k] = lid; store.set("sina:right", rt); } }
    var days = store.get("sina:days", []), d = today(); if (days[days.length - 1] !== d) { days.push(d); store.set("sina:days", days.slice(-120)); }
  }
  var QIDX = null;
  function qIndex() {
    if (QIDX) return QIDX;
    QIDX = {};
    Object.keys(S.lectures).forEach(function (lid) { var L = S.lectures[lid], fig = L.visual && L.visual.figure; (L.mcqs || []).forEach(function (q) { if (q.target && !fig && !photoFor(lid, q.target)) return; QIDX[qKey(q)] = { q: q, lid: lid, fig: fig }; }); });
    (S.papers || []).forEach(function (p) { (p.questions || []).forEach(function (q) { QIDX[qKey(q)] = { q: q, lid: p.id }; }); });
    return QIDX;
  }
  function srcTitle(lid) { if (S.lectures[lid]) return lectureTitle(lid) || S.lectures[lid].title || lid; var p = (S.papers || []).filter(function (x) { return x.id === lid; })[0]; return p ? p.title + (p.year ? " (" + p.year + ")" : "") : lid; }
  function srcSubject(lid) { if (S.lectures[lid]) return S.lectures[lid].subject; var p = (S.papers || []).filter(function (x) { return x.id === lid; })[0]; return p ? p.subject : ""; }
  function inProgram(lid) { var sb = subjectById(srcSubject(lid)); return sb && (sb.program || S.DEFAULT_PROGRAM) === PROG; }
  function mistakeList() {
    var mk = store.get("sina:mistakes", {}), idx = qIndex(), out = [];
    Object.keys(mk).forEach(function (k) { var e = idx[k]; if (e && inProgram(e.lid)) out.push({ k: k, e: e }); });
    return out;
  }
  /* ---------- add Sina to the home screen ---------- */
  var installEvt = null;
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); installEvt = e; var b = document.getElementById("inst-now"); if (b) b.hidden = false; });
  function installView() {
    var ua = navigator.userAgent, ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1), droid = /Android/.test(ua);
    var standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone;
    var share = '<svg class="inst-ico" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="Share"><path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';
    var dots = '<svg class="inst-ico" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-label="Menu"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>';
    var iosSteps = '<ol class="inst-steps">' +
      '<li>Open <b>sina-med.github.io</b> in <b>Safari</b>.</li>' +
      '<li>Tap the <b>Share</b> button ' + share + ' (bottom of the screen on iPhone, top right on iPad, next to the address).</li>' +
      '<li>Scroll down and tap <b>Add to Home Screen</b>. If you don’t see it, tap <b>Edit Actions</b> at the bottom and add it.</li>' +
      '<li>Keep the name <b>Sina</b> and tap <b>Add</b>.</li>' +
      '<li>Open Sina from the new icon. It opens full screen, like an app.</li></ol>' +
      '<p class="meta">On iPhone and iPad the icon keeps its own saved progress, separate from Safari. Add it once and keep using the icon.</p>';
    var droidSteps = '<ol class="inst-steps">' +
      '<li>Open <b>sina-med.github.io</b> in <b>Chrome</b>.</li>' +
      '<li>Tap the menu ' + dots + ' at the top right.</li>' +
      '<li>Tap <b>Add to Home screen</b> (on some phones it says <b>Install app</b>).</li>' +
      '<li>Tap <b>Install</b> or <b>Add</b>, then confirm.</li>' +
      '<li>Open Sina from the new icon on your home screen.</li></ol>' +
      '<p class="meta">Samsung Internet: tap the menu ≡ at the bottom, then <b>Add page to</b> → <b>Home screen</b>.</p>';
    var html = '<div class="wrap inst"><p class="crumbs"><a href="#/">Home</a> / Add to home screen</p><h1>Add Sina to your home screen</h1>' +
      '<p class="meta">Sina then opens like an app, full screen, and works offline once loaded.</p>' +
      (standalone ? '<p class="inst-ok">You’re already using Sina from your home screen.</p>' : "") +
      '<button class="btn primary" id="inst-now"' + (installEvt ? "" : " hidden") + '>Install Sina</button>' +
      '<div class="inst-tabs" role="tablist"><button role="tab" data-os="ios">iPhone &amp; iPad</button><button role="tab" data-os="android">Android</button></div>' +
      '<section class="inst-pane" data-os="ios">' + iosSteps + '</section><section class="inst-pane" data-os="android">' + droidSteps + '</section>' + '</div>';
    setView(html, "Add to home screen");
    function pick(os) {
      document.querySelectorAll(".inst-tabs button").forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.os === os)); });
      document.querySelectorAll(".inst-pane").forEach(function (p) { p.hidden = p.dataset.os !== os; });
    }
    document.querySelectorAll(".inst-tabs button").forEach(function (b) { b.addEventListener("click", function () { pick(b.dataset.os); }); });
    pick(droid ? "android" : "ios");
    var ib = document.getElementById("inst-now");
    ib.addEventListener("click", function () { if (!installEvt) return; installEvt.prompt(); installEvt.userChoice.then(function () { installEvt = null; ib.hidden = true; }); });
  }

  /* ---------- spaced repetition: reviews due today ---------- */
  function dueList(day) {
    var sr = store.get("sina:srs", {}), idx = qIndex(), d = day == null ? dayNo() : day, out = [];
    Object.keys(sr).forEach(function (k) { var e = idx[k]; if (e && sr[k][1] <= d && inProgram(e.lid)) out.push({ k: k, e: e, box: sr[k][0] }); });
    return out;
  }
  function fcDueHTML() {
    var a = akDue(), sr = store.get("sina:fcsrs", {}), d = dayNo(), by = {};
    for (var k in sr) if (sr[k][0] <= d) { var lid = k.split("|")[0]; if (inProgram(lid)) by[lid] = (by[lid] || 0) + 1; }
    var ls = Object.keys(by);
    if (!a && !ls.length) return "";
    return '<h2 class="rev-h">Flashcards due</h2><ul class="lec-list fc-due-list">' + (a ? '<li><a href="#/anking/review"><span>AnKing Step 1</span><span class="qn">' + a + "</span></a></li>" : "") +
      ls.map(function (lid) { return '<li><a href="#/lecture/' + lid + '/cards"><span>' + esc(lectureTitle(lid) || (S.lectures[lid] && S.lectures[lid].title) || lid) + '</span><span class="qn">' + by[lid] + "</span></a></li>"; }).join("") + "</ul>";
  }
  function reviewView() {
    var list = dueList(), sr = store.get("sina:srs", {}), later = Object.keys(sr).length - list.length, fch = fcDueHTML();
    var html = '<div class="wrap"><p class="crumbs"><a href="#/">Home</a> / Review</p><h1>Review due today</h1>' +
      '<p class="meta">Questions you missed come back after 1 day, then 3, 7, 16 and 35 days each time you get them right. Miss one again and it starts over.</p>';
    if (!list.length) { setView(html + fch + (fch ? '<h2 class="rev-h">Questions due</h2>' : "") + '<p class="empty-note">' + (fch ? "No questions due today." : "Nothing due today.") + (later > 0 ? " " + later + " question" + (later > 1 ? "s are" : " is") + " scheduled for later days." : " Questions you miss will be scheduled here.") + '</p><p><a class="btn" href="#/reminders">Set a daily reminder</a></p></div>', "Review"); return; }
    html += fch + (fch ? '<h2 class="rev-h">Questions due</h2>' : "") + '<div class="row" style="margin:.4rem 0 1rem"><button class="btn primary" id="rv-go">Review ' + list.length + " question" + (list.length > 1 ? "s" : "") + '</button><a class="btn" href="#/reminders">Reminders</a></div><div id="rvq"></div></div>';
    setView(html, "Review");
    document.getElementById("rv-go").onclick = function () {
      var pool = shuffle(list).map(function (m) { var c = shuffleQ(m.e.q), d = {}; for (var k in c) d[k] = c[k]; d._k = m.k; d._lid = m.e.lid; d._fig = m.e.fig; d._from = srcTitle(m.e.lid); return d; });
      this.parentNode.hidden = true;
      questionsPanel(document.getElementById("rvq"), { id: "mistakes-review", mcqs: pool });
    };
  }

  /* ---------- study reminders (Web Push) ---------- */
  function b64u(s) { s = s.replace(/-/g, "+").replace(/_/g, "/"); var r = atob(s + "===".slice((s.length + 3) % 4)), a = new Uint8Array(r.length); for (var i = 0; i < r.length; i++) a[i] = r.charCodeAt(i); return a; }
  function pushOK() { return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window; }
  function isIOS() { return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); }
  function standalone() { return (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone; }
  function remindPost(r, sub) {
    return fetch(S.api, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ type: "sub", sub: sub, h: r.h, m: r.m, tz: new Date().getTimezoneOffset(), daily: r.daily, review: r.review, due: remindDue(r) }) });
  }
  /* what will be due at the next reminder: today's if it has not gone off yet, otherwise tomorrow's */
  function remindDue(r) { var n = new Date(), past = n.getHours() * 60 + n.getMinutes() >= (r.h || 0) * 60 + (r.m || 0); return allDue(dayNo() + (past ? 1 : 0)); }
  function remindSync() {
    var r = store.get("sina:remind", null);
    if (!r || !r.on || !S.api || !pushOK() || Notification.permission !== "granted") return;
    var due = remindDue(r); if (r.synced === today() && r.sdue === due) return;
    navigator.serviceWorker.ready.then(function (reg) { return reg.pushManager.getSubscription(); }).then(function (sub) {
      if (!sub) return;
      remindPost(r, sub.toJSON()).then(function () { r.synced = today(); r.sdue = due; store.set("sina:remind", r); });
    }).catch(function () {});
  }
  function remindersView() {
    var r = store.get("sina:remind", null) || { on: false, h: 19, m: 0, daily: true, review: true };
    var html = '<div class="wrap rem"><p class="crumbs"><a href="#/">Home</a> / Reminders</p><h1>Study reminders</h1>' +
      '<p class="meta">One notification a day at the time you choose: your reviews when some are due, otherwise a nudge for daily practice. Only this device gets them.</p>';
    var block = "";
    if (!S.api || !S.vapid) block = "Reminders are not available yet.";
    else if (isIOS() && !standalone()) block = 'On iPhone and iPad, notifications only work when Sina is opened from the home screen. <a href="#/install">Add Sina to your home screen</a>, open it from the icon, then come back here.';
    else if (!pushOK()) block = "This browser cannot show notifications. Try Chrome, or Safari from the home screen.";
    else if (Notification.permission === "denied") block = "Notifications are blocked for Sina. Allow them in your browser or phone settings, then reload this page.";
    var t = ("0" + r.h).slice(-2) + ":" + ("0" + r.m).slice(-2);
    html += (block ? '<p class="rem-block">' + block + "</p>" : "") +
      '<div class="rem-card"' + (block ? ' aria-disabled="true"' : "") + '><label class="rem-row"><span>Remind me at</span><input type="time" id="rm-t" value="' + t + '"' + (block ? " disabled" : "") + "></label>" +
      '<label class="rem-row"><input type="checkbox" id="rm-rv"' + (r.review ? " checked" : "") + (block ? " disabled" : "") + '><span>Reviews due: questions and flashcards (spaced repetition)</span></label>' +
      '<label class="rem-row"><input type="checkbox" id="rm-dl"' + (r.daily ? " checked" : "") + (block ? " disabled" : "") + '><span>Daily practice, on days with nothing to review</span></label>' +
      '<div class="row"><button class="btn primary" id="rm-on"' + (block ? " disabled" : "") + ">" + (r.on ? "Save" : "Turn on reminders") + "</button>" + (r.on ? '<button class="btn" id="rm-test">Send a test</button><button class="btn" id="rm-off">Turn off</button>' : "") + "</div>" +
      '<p class="meta" id="rm-msg">' + (r.on ? "Reminders are on at " + t + "." : "") + "</p></div>" +
      '<p class="meta">Due today: ' + allDue() + ' (questions and flashcards). <a href="#/review">Open the review</a>.</p></div>';
    setView(html, "Reminders");
    var msg = document.getElementById("rm-msg");
    function read() { var v = (document.getElementById("rm-t").value || "19:00").split(":"); r.h = +v[0] || 0; r.m = +v[1] || 0; r.review = document.getElementById("rm-rv").checked; r.daily = document.getElementById("rm-dl").checked; }
    var on = document.getElementById("rm-on");
    if (on) on.onclick = function () {
      read(); msg.textContent = "Turning on…";
      Notification.requestPermission().then(function (p) {
        if (p !== "granted") throw new Error("Notifications were not allowed.");
        return navigator.serviceWorker.ready;
      }).then(function (reg) {
        return reg.pushManager.getSubscription().then(function (s) { return s || reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64u(S.vapid) }); });
      }).then(function (sub) { return remindPost(r, sub.toJSON()); }).then(function () {
        r.on = true; r.synced = today(); r.sdue = remindDue(r); store.set("sina:remind", r); remindersView();
        toast("Reminders on. You'll get one a day at " + ("0" + r.h).slice(-2) + ":" + ("0" + r.m).slice(-2) + ".");
      }).catch(function (e) { msg.textContent = (e && e.message) || "Could not turn reminders on."; });
    };
    var tb = document.getElementById("rm-test");
    if (tb) tb.onclick = function () { navigator.serviceWorker.ready.then(function (reg) { reg.showNotification("Sina: test reminder", { body: "This is how your reminder will look.", icon: "icons/icon-192.png", badge: "icons/icon-192.png", data: { url: "#/review" } }); }); };
    var off = document.getElementById("rm-off");
    if (off) off.onclick = function () {
      navigator.serviceWorker.ready.then(function (reg) { return reg.pushManager.getSubscription(); }).then(function (sub) {
        if (sub) { fetch(S.api, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ type: "unsub", endpoint: sub.endpoint }) }); return sub.unsubscribe(); }
      }).catch(function () {}).then(function () { r.on = false; store.set("sina:remind", r); remindersView(); toast("Reminders off."); });
    };
  }

  function mistakesView() {
    var list = mistakeList(), by = {};
    list.forEach(function (m) { (by[m.e.lid] = by[m.e.lid] || []).push(m); });
    var html = '<div class="wrap"><p class="crumbs"><a href="#/">Home</a> / <a href="#/progress">My progress</a> / Redo my mistakes</p><h1>Redo my mistakes</h1>' +
      '<p class="meta">Every question you got wrong, from any quiz. Answer it right and it leaves the list.</p>';
    if (!list.length) { setView(html + '<p class="empty-note">No mistakes to redo. Do some quizzes and the ones you miss will show up here.</p></div>', "Redo my mistakes"); return; }
    html += '<div class="row" style="margin:0.4rem 0 1rem"><button class="btn primary" id="mk-all">Redo all ' + list.length + '</button><button class="btn" id="mk-clear">Clear the list</button></div><ul class="mk-list">' +
      Object.keys(by).sort(function (a, b) { return by[b].length - by[a].length; }).map(function (lid) {
        return '<li><button class="mk-row" data-l="' + esc(lid) + '"><span>' + esc(srcTitle(lid)) + '</span><span class="qn">' + by[lid].length + "</span></button></li>";
      }).join("") + '</ul><div id="mkq"></div></div>';
    setView(html, "Redo my mistakes");
    function start(items) {
      var pool = shuffle(items).map(function (m) { var c = shuffleQ(m.e.q); var d = {}; for (var k in c) d[k] = c[k]; d._k = m.k; d._lid = m.e.lid; d._fig = m.e.fig; d._from = srcTitle(m.e.lid); return d; });
      var box = document.getElementById("mkq"); app.querySelectorAll(".mk-list, .row").forEach(function (el) { el.hidden = true; });
      questionsPanel(box, { id: "mistakes", mcqs: pool }); box.scrollIntoView({ block: "start" });
    }
    document.getElementById("mk-all").onclick = function () { start(list); };
    document.getElementById("mk-clear").onclick = function () { if (confirm("Clear all saved mistakes?")) { store.set("sina:mistakes", {}); mistakesView(); } };
    app.querySelectorAll(".mk-row").forEach(function (b) { b.onclick = function () { start(by[b.dataset.l]); }; });
  }

  /* ---------- weak spots: the lectures you get wrong most, then a quiz built from them ---------- */
  function weakData(onlyMid) {
    var st = store.get("sina:stats", {}), mk = store.get("sina:mistakes", {}), rt = store.get("sina:right", {}), idx = qIndex(), mid = progMidterms()[0], scope = null;
    if (onlyMid && mid) { scope = {}; mid.groups.forEach(function (g) { g.items.forEach(function (id) { scope[id] = 1; }); }); }
    var byL = {};
    Object.keys(idx).forEach(function (k) { var e = idx[k]; if (!S.lectures[e.lid] || !inProgram(e.lid) || (scope && (!scope[e.lid] || qOffMid(e.lid, e.q)))) return; (byL[e.lid] = byL[e.lid] || []).push(k); });
    var rows = Object.keys(byL).filter(function (lid) { return st[lid] && st[lid][0] >= 3; }).map(function (lid) {
      var a = st[lid][0], r = st[lid][1], miss = byL[lid].filter(function (k) { return mk[k]; }).length;
      return { lid: lid, a: a, r: r, pct: Math.round(r / a * 100), score: (r + 1) / (a + 2), miss: miss, keys: byL[lid] };
    }).sort(function (x, y) { return x.score - y.score || y.miss - x.miss; });
    var untried = Object.keys(byL).filter(function (lid) { return !st[lid] || st[lid][0] < 3; });
    return { rows: rows, weak: rows.filter(function (x) { return x.pct < 90; }).slice(0, 5), untried: untried, mid: mid, scope: !!scope, mk: mk, rt: rt, idx: idx };
  }
  function weakView(arg) {
    var mid = progMidterms()[0], only = arg === "midterm" || (arg !== "all" && !!mid && store.get("sina:weakMid", true));
    var W = weakData(only), N = 20;
    var html = '<div class="wrap"><p class="crumbs"><a href="#/">Home</a> / <a href="#/progress">My progress</a> / Weak spots</p><h1>Weak spots</h1>' +
      '<p class="lede-s">Your 5 lectures with the lowest score so far, and a quiz built from them: your past mistakes first, then questions you have not got right yet.</p>';
    if (mid) html += '<div class="chips quick wk-scope" role="group" aria-label="Which lectures"><button type="button" data-w="midterm" aria-pressed="' + only + '"' + (only ? ' class="on"' : "") + ">" + esc(mid.title) + ' lectures</button><button type="button" data-w="all" aria-pressed="' + !only + '"' + (!only ? ' class="on"' : "") + ">All lectures</button></div>";
    if (!W.weak.length) {
      html += '<p class="empty-note">' + (W.rows.length ? "No weak spots: you score 90% or more in every lecture you have practised" + (W.scope ? " for this midterm" : "") + ". Well done." : "Not enough answers yet. Answer at least 3 questions in a few lectures" + (W.scope ? " from this midterm" : "") + " and your weak spots will show here.") + "</p>";
      if (W.untried.length) html += '<p class="meta">Not practised yet: ' + W.untried.slice(0, 8).map(function (lid) { return '<a href="#/subject/' + S.lectures[lid].subject + "/questions/" + lid + '">' + esc(lectureTitle(lid) || S.lectures[lid].title) + "</a>"; }).join(", ") + (W.untried.length > 8 ? "…" : "") + ".</p>";
      setView(html + "</div>", "Weak spots"); wkWire(); return;
    }
    html += '<ol class="wk-list">' + W.weak.map(function (x) {
      var tone = x.pct < 50 ? "low" : x.pct < 75 ? "mid" : "good";
      return '<li><a href="#/subject/' + S.lectures[x.lid].subject + "/questions/" + x.lid + '"><span class="wk-name">' + esc(lectureTitle(x.lid) || S.lectures[x.lid].title) + '</span><span class="wk-num">' + x.pct + "% right · " + x.r + "/" + x.a + (x.miss ? " · " + x.miss + " to redo" : "") + '</span><span class="pb-track"><span class="pb-fill ' + tone + '" style="--w:' + Math.max(2, x.pct) + '%"></span></span></a><label class="wk-pick"><input type="checkbox" class="wk-chk" value="' + x.lid + '" checked><span>Quiz</span></label></li>';
    }).join("") + "</ol>" +
      '<p class="meta wk-hint">Tick the lectures to include in the quiz, or tap a lecture to practise it on its own.</p><div class="row"><button class="btn primary" id="wk-go" type="button">Start the weak-spot quiz (' + N + " questions)</button></div>" +
      (W.untried.length ? '<p class="meta">Not practised yet' + (W.scope ? " for this midterm" : "") + ": " + W.untried.slice(0, 6).map(function (lid) { return '<a href="#/subject/' + S.lectures[lid].subject + "/questions/" + lid + '">' + esc(lectureTitle(lid) || S.lectures[lid].title) + "</a>"; }).join(", ") + (W.untried.length > 6 ? "…" : "") + ".</p>" : "") +
      '<div id="wkq"></div></div>';
    setView(html, "Weak spots"); wkWire(); animateRings();
    var goB = document.getElementById("wk-go");
    function chosen() { var on = {}; app.querySelectorAll(".wk-chk").forEach(function (c) { if (c.checked) on[c.value] = 1; }); return W.weak.filter(function (x) { return on[x.lid]; }); }
    function wkLabel() { var c = chosen(), n = Math.min(N, c.reduce(function (a, x) { return a + x.keys.length; }, 0)); goB.disabled = !c.length; goB.textContent = c.length ? "Start the weak-spot quiz (" + n + " questions" + (c.length < W.weak.length ? ", " + c.length + " lecture" + (c.length > 1 ? "s" : "") : "") + ")" : "Tick at least one lecture"; }
    app.querySelectorAll(".wk-chk").forEach(function (c) { c.onchange = wkLabel; }); wkLabel();
    goB.onclick = function () {
      /* weakest lectures get more questions: weights 5,4,3,2,1 */
      var picked = chosen(), tot = 0, ws = picked.map(function (x, i) { var w = picked.length - i; tot += w; return w; }), pool = [], used = {};
      picked.forEach(function (x, i) {
        var want = Math.max(1, Math.round(N * ws[i] / tot));
        var miss = shuffle(x.keys.filter(function (k) { return W.mk[k]; })), notyet = shuffle(x.keys.filter(function (k) { return !W.mk[k] && !W.rt[k]; })), rest = shuffle(x.keys.filter(function (k) { return !W.mk[k] && W.rt[k]; }));
        miss.concat(notyet, rest).slice(0, want).forEach(function (k) { if (!used[k]) { used[k] = 1; pool.push(k); } });
      });
      pool = shuffle(pool).slice(0, N).map(function (k) { var e = W.idx[k], c = shuffleQ(e.q), d = {}; for (var j in c) d[j] = c[j]; d._k = k; d._lid = e.lid; d._fig = e.fig; d._from = lectureTitle(e.lid) || S.lectures[e.lid].title; return d; });
      var box = document.getElementById("wkq"); app.querySelectorAll(".wk-list, .row, .wk-scope, .lede-s, .wrap > .meta, .wk-hint").forEach(function (el) { el.hidden = true; });
      questionsPanel(box, { id: "weak", _title: "Weak-spot quiz", mcqs: pool }); box.scrollIntoView({ block: "start" });
    };
  }
  function wkWire() { app.querySelectorAll("[data-w]").forEach(function (b) { b.onclick = function () { store.set("sina:weakMid", b.dataset.w === "midterm"); weakView(b.dataset.w); }; }); }

  /* ---------- My progress ---------- */
  function streakDays() {
    var days = store.get("sina:days", []), n = 0, d = new Date();
    if (days[days.length - 1] !== today()) d.setDate(d.getDate() - 1);
    for (;;) { var s = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); if (days.indexOf(s) < 0) break; n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function ringSVG(pct, label) {
    var C = 2 * Math.PI * 42;
    return '<svg class="pring" viewBox="0 0 100 100" aria-label="' + esc(label) + '"><circle class="bg" cx="50" cy="50" r="42"/><circle class="fg" cx="50" cy="50" r="42" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '" data-to="' + (C * (1 - pct / 100)) + '"/><text x="50" y="57">' + pct + "%</text></svg>";
  }
  function progressView() {
    var st = store.get("sina:stats", {}), seen = 0, ok = 0, rows = [];
    Object.keys(st).forEach(function (lid) { if (!inProgram(lid)) return; seen += st[lid][0]; ok += st[lid][1]; rows.push({ lid: lid, n: st[lid][0], ok: st[lid][1], pct: Math.round(st[lid][1] / st[lid][0] * 100) }); });
    var acc = seen ? Math.round(ok / seen * 100) : 0, mk = mistakeList().length, streak = streakDays();
    var html = '<div class="wrap"><p class="crumbs"><a href="#/">Home</a> / My progress</p><h1>My progress</h1><p class="meta">Saved on this device only.</p>' +
      '<div class="prog-top"><div class="prog-card">' + ringSVG(acc, "Overall accuracy") + '<span>Overall accuracy</span></div>' +
      '<div class="prog-card"><b class="big">' + seen + '</b><span>questions answered</span></div>' +
      '<div class="prog-card"><b class="big">' + streak + '</b><span>day' + (streak === 1 ? "" : "s") + " in a row</span></div>" +
      '<div class="prog-card"><b class="big">' + mk + '</b><span>mistakes to redo</span>' + (mk ? '<a class="btn small primary" href="#/mistakes">Redo them</a>' : "") + "</div></div>" +
      '<h2>Flashcard heatmap</h2><p class="meta">Lecture flashcards you rated each day. ' + (fcDue() ? '<a href="#/review">' + fcDue() + " due today</a>." : "") + "</p>" + heatHTML(store.get("sina:fclog", {}), "flashcards");
    if (!rows.length) { setView(html + '<p class="empty-note">Nothing yet. Answer some questions and your scores per lecture will appear here.</p></div>', "My progress"); animateRings(); heatWire(app); return; }
    var weak = rows.filter(function (r) { return r.n >= 5; }).sort(function (a, b) { return a.pct - b.pct; }).slice(0, 5);
    if (weak.length) html += '<h2>Weakest lectures</h2><p class="meta">Lowest accuracy, at least 5 questions answered.</p>' + barList(weak);
    var subs = {};
    rows.forEach(function (r) { var s = srcSubject(r.lid); (subs[s] = subs[s] || []).push(r); });
    Object.keys(subs).forEach(function (sid) {
      var sb = subjectById(sid); html += "<h2>" + esc(sb ? sb.name : sid) + "</h2>" + barList(subs[sid].sort(function (a, b) { return a.pct - b.pct; }));
    });
    setView(html + '<p class="row" style="margin-top:1.2rem"><a class="btn" href="#/weak">Weak spots: quiz my 5 weakest lectures</a></p><p class="src" style="margin-top:1.5rem"><button class="btn small" id="prog-reset">Reset my progress</button></p></div>', "My progress");
    animateRings(); heatWire(app);
    document.getElementById("prog-reset").onclick = function () { if (confirm("Reset all progress saved on this device?")) { ["sina:stats", "sina:mistakes", "sina:days"].forEach(function (k) { store.set(k, k === "sina:days" ? [] : {}); }); progressView(); } };
    function barList(list) {
      return '<ul class="pbars">' + list.map(function (r) {
        var href = S.lectures[r.lid] ? "#/practice/" + srcSubject(r.lid) + "/lectures/" + r.lid : "#/paper/" + r.lid;
        var tone = r.pct >= 80 ? "good" : r.pct >= 60 ? "mid" : "low";
        return '<li><a href="' + href + '"><span class="pb-name">' + esc(srcTitle(r.lid)) + '</span><span class="pb-num">' + r.pct + "% · " + r.ok + "/" + r.n + '</span><span class="pb-track"><span class="pb-fill ' + tone + '" style="--w:' + r.pct + '%"></span></span></a></li>';
      }).join("") + "</ul>";
    }
  }
  function animateRings() {
    requestAnimationFrame(function () { app.querySelectorAll(".pring .fg").forEach(function (c) { c.style.strokeDashoffset = c.getAttribute("data-to"); }); app.querySelectorAll(".pb-fill").forEach(function (f) { f.classList.add("go"); }); });
  }

  /* ---------- report a mistake ---------- */
  /* report dialog: a note and, optionally, a picture (screenshot or photo of the slide) */
  function shrinkImage(file, cb) {
    var fr = new FileReader();
    fr.onload = function () {
      var img = new Image();
      img.onload = function () {
        var k = Math.min(1, 1400 / Math.max(img.width, img.height)), c = document.createElement("canvas");
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        cb(c.toDataURL("image/jpeg", 0.72));
      };
      img.onerror = function () { cb(null); };
      img.src = fr.result;
    };
    fr.onerror = function () { cb(null); };
    fr.readAsDataURL(file);
  }
  function reportDialog(q, src, ans) {
    var pic = null, v = document.createElement("div");
    v.className = "rdlg"; v.setAttribute("role", "dialog"); v.setAttribute("aria-modal", "true"); v.setAttribute("aria-label", "Report a mistake");
    v.innerHTML = '<div class="rdlg-box"><h2>Report a mistake</h2><p class="meta">' + esc(q.q) + '</p>' +
      '<label class="rdlg-l" for="rd-note">What is wrong?</label><textarea id="rd-note" rows="4" placeholder="For example: answer B is also correct, see slide 12."></textarea>' +
      '<div class="rdlg-pic"><label class="btn small-btn" for="rd-file">Add a picture (optional)</label><input id="rd-file" type="file" accept="image/*" hidden><span id="rd-pn" class="meta"></span></div><img id="rd-prev" alt="" hidden>' +
      '<div class="row"><button class="btn primary" id="rd-send" type="button">Send report</button><button class="btn" id="rd-x" type="button">Cancel</button></div></div>';
    document.body.appendChild(v); document.body.classList.add("noscroll");
    var close = function () { v.remove(); document.body.classList.remove("noscroll"); };
    v.querySelector("#rd-x").onclick = close;
    v.addEventListener("click", function (e) { if (e.target === v) close(); });
    v.querySelector("#rd-note").focus();
    v.querySelector("#rd-file").onchange = function () {
      var f = this.files && this.files[0]; if (!f) return;
      v.querySelector("#rd-pn").textContent = "Preparing the picture…";
      shrinkImage(f, function (d) {
        pic = d; var pv = v.querySelector("#rd-prev");
        if (d) { pv.src = d; pv.hidden = false; v.querySelector("#rd-pn").textContent = f.name; } else v.querySelector("#rd-pn").textContent = "This picture could not be read.";
      });
    };
    v.querySelector("#rd-send").onclick = function () {
      var b = this; b.disabled = true; b.textContent = "Sending…";
      fetch(S.api, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ type: "report", src: q._lid || src, k: q._k || qKey(q), q: q.q, options: q.options, answer: ans, note: v.querySelector("#rd-note").value, img: pic || "" }) })
        .then(function () { close(); toast("Thanks, the report was sent."); }, function () { b.disabled = false; b.textContent = "Send report"; toast("Could not send. Check your connection."); });
    };
  }
  function reportMistake(q, src) {
    var ans = q.answers || [q.answer], LT = "ABCDEFGH";
    var txt = "[Sina report] " + srcTitle(q._lid || src) + "\nQ: " + q.q + "\n" + q.options.map(function (o, n) { return LT[n] + ". " + o; }).join("\n") + "\nSite answer: " + ans.map(function (n) { return LT[n]; }).join(", ") + "\nWhat is wrong: ";
    var form = (document.getElementById("suggest-btn") || {}).href;
    if (S.api) { reportDialog(q, src, ans); return; }
    var done = function () { toast("Question copied. Paste it in the form and say what's wrong.", 4200); if (form && /^https?:/.test(form)) window.open(form, "_blank", "noopener"); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, done); else done();
  }

  /* ---------- exam mode: timer, no feedback until the end ---------- */
  function examPanel(p, set, back) {
    var qs = set.mcqs, n = qs.length, sel = qs.map(function () { return []; }), i = 0, LET = "abcdefgh";
    var secs = n * 60, end = Date.now() + secs * 1000, timer = null, over = false;
    function fmt(s) { s = Math.max(0, Math.round(s)); var m = Math.floor(s / 60); return m + ":" + ("0" + (s % 60)).slice(-2); }
    function multi() { return true; }
    function render() {
      var q = qs[i], qfig = q._fig, qph = q.m3d ? m3dHTML(q) : q.flow ? flowHTML(q, false) : q.occ ? occHTML(q, false) : q.target ? photoQ(q._lid || set.id, q.target) : "";
      var pic = qph || (q.target && qfig ? '<div class="diagram-box qfig">' + figureSVG(qfig, { mode: "quiz", target: q.target, uid: "x" + i }) + "</div>" : "");
      p.innerHTML = '<div class="exam-bar"><span class="exam-time" id="xt">' + fmt((end - Date.now()) / 1000) + '</span><span class="meta"></span><button class="btn small primary" id="xsub">Submit</button></div>' +
        '<div class="exam-grid">' + qs.map(function (_, k) { return '<button class="xg' + (k === i ? " cur" : "") + (sel[k].length ? " done" : "") + '" data-k="' + k + '">' + (k + 1) + "</button>"; }).join("") + "</div>" +
        (q._off ? '<p class="qhead"><span class="qoff">Not on the midterm</span></p>' : "") + '<p class="qtext">' + esc(figQText(q, qfig)) + "</p>" + pic +
        q.options.map(function (o, k) { var on = sel[i].indexOf(k) > -1; return '<button class="opt' + (on ? " picked" : "") + '" data-n="' + k + '" aria-pressed="' + on + '"><span class="letter">' + LET[k].toUpperCase() + "</span><span>" + esc(o) + "</span></button>"; }).join("") +
        '<div class="qnav"><button class="btn" id="xp"' + (i ? "" : " disabled") + '>&larr; Previous</button><button class="btn" id="xn">' + (i + 1 < n ? "Next &rarr;" : "Review and submit") + "</button></div>";
      centerTarget(p); m3dMount(p, q);
      p.querySelectorAll(".opt").forEach(function (b) { b.onclick = function () {
        var k = +b.dataset.n, s = sel[i];
        if (multi(qs[i])) { var at = s.indexOf(k); if (at > -1) s.splice(at, 1); else s.push(k); } else sel[i] = s[0] === k ? [] : [k];
        render(); }; });
      p.querySelectorAll(".xg").forEach(function (b) { b.onclick = function () { i = +b.dataset.k; render(); }; });
      p.querySelector("#xp").onclick = function () { i--; render(); };
      p.querySelector("#xn").onclick = function () { if (i + 1 < n) { i++; render(); } else submit(false); };
      p.querySelector("#xsub").onclick = function () { submit(false); };
    }
    function tick() { var left = (end - Date.now()) / 1000, el = document.getElementById("xt"); if (!el) { clearInterval(timer); return; } el.textContent = fmt(left); el.classList.toggle("low", left < 120); if (left <= 0 && !over) submit(true); }
    function submit(auto) {
      if (!auto) { var blank = sel.filter(function (s) { return !s.length; }).length; if (!confirm(blank ? blank + " question" + (blank > 1 ? "s are" : " is") + " unanswered. Submit anyway?" : "Submit the exam?")) return; }
      over = true; clearInterval(timer);
      var score = 0, used = secs - Math.max(0, (end - Date.now()) / 1000);
      var res = qs.map(function (q, k) { var ans = q.answers || [q.answer], s = sel[k], ok = s.length === ans.length && s.every(function (x) { return ans.indexOf(x) > -1; }); score += qPoints(q, s); trackAnswer(q, set.id, ok); return ok; });
      score = Math.round(score * 100) / 100;
      var pct = Math.round(score / n * 100);
      p.innerHTML = '<div class="exam-result"><p class="meta">' + (auto ? "Time is up." : "Exam submitted.") + " Time used: " + fmt(used) + '</p>' + scoreRevealHTML(score, n) +
        '<div class="row"><button class="btn primary" id="xr-wrong">Show wrong answers (' + res.filter(function (x) { return !x; }).length + ')</button><button class="btn" id="xr-all">Show all answers</button>' + (back ? '<button class="btn" id="xr-back">Back</button>' : "") + '</div>' + (S.api && set.paper ? lbPostHTML() : "") + weakHTML(qs.filter(function (q, k) { return !res[k]; }).map(function (q) { return { q: q, lid: set.id }; })) + '</div><div id="xrev"></div>';
      if (S.api && set.paper) lbPostWire(p, set.id, score, n, Math.round(used));
      scoreReveal(p, score, n);
      function review(onlyWrong) {
        p.querySelector("#xrev").innerHTML = qs.map(function (q, k) {
          if (onlyWrong && res[k]) return "";
          var ans = q.answers || [q.answer], s = sel[k];
          return '<div class="rev-item"><p class="qhead">Question ' + (k + 1) + (s.length ? "" : " · not answered") + '</p><p class="qtext">' + esc(figQText(q, q._fig)) + "</p>" + (q.flow ? flowHTML(q, true) : q.occ ? occHTML(q, true) : "") +
            q.options.map(function (o, m) { var om = optMark(ans, s, m), cls = om.cls, tag = om.tag;
              return '<div class="opt static' + cls + '"><span class="letter">' + LET[m].toUpperCase() + "</span><span>" + esc(o) + "</span>" + tag + (q.notes && q.notes[m] ? '<span class="onote">' + esc(q.notes[m]) + "</span>" : "") + "</div>"; }).join("") +
            (q.why ? '<div class="why">' + esc(q.why) + "</div>" : "") + slidesHTML(q) + "</div>";
        }).join("") || '<p class="src">No wrong answers. Well done.</p>';
      }
      p.querySelector("#xr-wrong").onclick = function () { review(true); };
      p.querySelector("#xr-all").onclick = function () { review(false); };
      if (back) p.querySelector("#xr-back").onclick = back;
      window.scrollTo(0, p.getBoundingClientRect().top + window.scrollY - 90);
    }
    render(); timer = setInterval(tick, 1000);
  }
  function examIntro(p, set, back) {
    var n = set.mcqs.length;
    p.innerHTML = '<div class="exam-intro"><h2>Exam mode</h2><p>' + n + " questions · " + n + " minute" + (n > 1 ? "s" : "") + ' (1 per question). No answers are shown until you submit. You can move freely between questions and change your answers.</p><div class="row"><button class="btn primary" id="xgo">Start the exam</button>' + (back ? '<button class="btn" id="xback">Cancel</button>' : "") + "</div></div>";
    p.querySelector("#xgo").onclick = function () { examPanel(p, set, back); };
    if (back) p.querySelector("#xback").onclick = back;
  }




  /* ---------- search result: one question or one flashcard ---------- */
  function findView(kind, lid, ref) {
    var L = S.lectures[lid]; if (!L) return notFound();
    var sub = subjectById(L.subject);
    var head = '<div class="wrap"><p class="crumbs"><a href="#/">Home</a> / <a href="#/subject/' + sub.id + '">' + esc(sub.name) + '</a> / <a href="#/lecture/' + lid + '">' + esc(L.title) + "</a></p>";
    if (kind === "q") {
      var q = (L.mcqs || [])[+ref]; if (!q) return notFound();
      setView(head + '<h1>Question from ' + esc(L.title) + '</h1><div class="panel-q" id="fq"></div><div class="row" style="margin-top:1.2rem"><a class="btn primary" href="#/subject/' + sub.id + "/questions/" + lid + '">All questions on this lecture</a><a class="btn" href="#/lecture/' + lid + '">Open the lecture</a></div></div>', "Question");
      var c = {}; for (var k in q) c[k] = q[k]; c._lid = lid;
      questionsPanel(document.getElementById("fq"), { id: lid, mcqs: [c], visual: L.visual });
      return;
    }
    var card = (L.cards || []).filter(function (x) { return x.id === ref; })[0]; if (!card) return notFound();
    setView(head + '<h1>Flashcard from ' + esc(L.title) + '</h1><div id="fc"></div><div class="row" style="margin-top:1.2rem"><a class="btn primary" href="#/lecture/' + lid + '/cards">All flashcards on this lecture</a><a class="btn" href="#/lecture/' + lid + '">Open the lecture</a></div></div>', "Flashcard");
    cardsPanel(document.getElementById("fc"), { id: lid, cards: [card], visual: L.visual });
  }
  /* ---------- lecture: heartbeat reading line that fills as the summary is read ---------- */
  function readingLine(panel) {
    var tabs = app.querySelector(".tabs.sticky"); if (!tabs || !panel) return;
    var pts = [], x = 0;
    for (var b = 0; b < 8; b++) { pts.push(x + ",6", (x + 30) + ",6", (x + 33) + ",3", (x + 36) + ",6", (x + 39) + ",6", (x + 41) + ",0.5", (x + 44) + ",11.5", (x + 47) + ",4", (x + 49) + ",6"); x += 62; }
    pts.push("496,6");
    tabs.classList.add("has-ecg");
    var cid = "rc" + Date.now();
    tabs.insertAdjacentHTML("beforeend", '<svg class="read-ecg" viewBox="0 0 496 12" preserveAspectRatio="none" aria-hidden="true"><defs><clipPath id="' + cid + '"><rect x="0" y="-2" width="0" height="16"/></clipPath></defs><polyline class="re-bg" points="' + pts.join(" ") + '"/><polyline class="re-fg" clip-path="url(#' + cid + ')" points="' + pts.join(" ") + '"/></svg>');
    var fg = tabs.querySelector("#" + cid + " rect"), ticking = false;
    function upd() {
      ticking = false;
      if (!panel.isConnected) { window.removeEventListener("scroll", onScroll); return; }
      var r = panel.getBoundingClientRect(), vh = window.innerHeight, total = r.height - vh * 0.6;
      var p = total > 0 ? Math.min(1, Math.max(0, (-r.top + vh * 0.25) / total)) : 1;
      fg.setAttribute("width", (p * 496).toFixed(1));
      tabs.classList.toggle("read-done", p >= 0.995);
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }
    window.addEventListener("scroll", onScroll, { passive: true }); upd();
  }
  /* ---------- partial credit: any wrong pick scores 0; otherwise right picks / number of right answers ---------- */
  function qPoints(q, chosen) {
    var ans = q.answers || [q.answer];
    var r = 0, w = 0; chosen.forEach(function (c) { if (ans.indexOf(c) > -1) r++; else w++; });
    return w ? 0 : r / ans.length;
  }
  /* option state in reviews: correct answers, and the student's wrong picks */
  function optMark(ans, chosen, n) {
    var a = ans.indexOf(n) > -1, c = chosen.indexOf(n) > -1;
    return { cls: a ? " correct" : c ? " wrong" : "",
      tag: a ? '<span class="rev-tag">Correct answer</span>' : c ? '<span class="rev-tag">Your answer</span>' : "" };
  }
  function fmtPts(x) { var r = Math.round(x * 100) / 100; return String(r); }

  /* ---------- "Mark as revised" ---------- */
  function revisedOn(id) { return !!store.get("sina:revised", {})[id]; }
  function revisedHTML(id, big) {
    var on = revisedOn(id);
    return '<button type="button" class="rev-btn' + (big ? " big" : "") + (on ? " on" : "") + '" data-rev="' + id + '" aria-pressed="' + on + '"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path class="rv-chk" d="M7 12.5l3.2 3.2L17 9" pathLength="1"/></svg><span>' + (on ? "Revised" : "Mark as revised") + "</span></button>";
  }
  function wireRevised(root, id) {
    if (!root) return;
    root.querySelectorAll(".rev-btn").forEach(function (b) {
      b.onclick = function () {
        var m = store.get("sina:revised", {}), on = !m[id];
        if (on) m[id] = today(); else delete m[id];
        store.set("sina:revised", m);
        app.querySelectorAll('.rev-btn[data-rev="' + id + '"]').forEach(function (x) { x.classList.toggle("on", on); x.setAttribute("aria-pressed", String(on)); x.querySelector("span").textContent = on ? "Revised" : "Mark as revised"; if (on) { x.classList.remove("pop"); void x.offsetWidth; x.classList.add("pop"); } });
        if (on) toast("Marked as revised.");
      };
    });
  }
  /* ---------- summary in French: translated in the reader's browser, cached on the device ---------- */
  function wireFrench(p, lec) {
    var body = p.querySelector("#sum-body"), msg = p.querySelector(".lang-msg"), btns = p.querySelectorAll(".lang-tog button"), orig = null;
    function setBtn(l) { btns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === l)); }); store.set("sina:sumLang", l); }
    function nodes() { var w = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { return /[A-Za-z]{2}/.test(n.nodeValue) && !n.parentNode.closest("button, .buildnote svg") ? 1 : 3; } }), out = []; while (w.nextNode()) out.push(w.currentNode); return out; }
    function tr(text) {
      return fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=" + encodeURIComponent(text)).then(function (r) { if (!r.ok) throw 0; return r.json(); })
        .then(function (d) { return (d[0] || []).map(function (x) { return x[0]; }).join(""); });
    }
    function toFrench() {
      var key = "sina:fr:" + lec.id + ":" + (lec.verified || ""), cache = store.get(key, null), ns = nodes();
      orig = orig || ns.map(function (n) { return n.nodeValue; });
      if (cache && cache.length === ns.length) { ns.forEach(function (n, i) { n.nodeValue = cache[i]; }); body.lang = "fr"; msg.textContent = "Machine translation. Medical terms may be imperfect: check with the English."; return; }
      msg.textContent = "Translating…";
      var texts = ns.map(function (n) { return n.nodeValue; }), out = new Array(texts.length), chunks = [], cur = [], len = 0;
      texts.forEach(function (t, i) { if (len + t.length > 1500 && cur.length) { chunks.push(cur); cur = []; len = 0; } cur.push(i); len += t.length + 3; });
      if (cur.length) chunks.push(cur);
      var SEP = "\n⁂\n";
      Promise.all(chunks.map(function (c) {
        return tr(c.map(function (i) { return texts[i].replace(/\n/g, " "); }).join(SEP)).then(function (res) {
          var parts = res.split(/\s*⁂\s*/);
          if (parts.length === c.length) { c.forEach(function (i, k) { out[i] = (/^\s/.test(texts[i]) ? " " : "") + parts[k].trim() + (/\s$/.test(texts[i]) ? " " : ""); }); return; }
          return Promise.all(c.map(function (i) { return tr(texts[i]).then(function (t) { out[i] = (/^\s/.test(texts[i]) ? " " : "") + t.trim() + (/\s$/.test(texts[i]) ? " " : ""); }); }));
        });
      })).then(function () {
        if (!body.isConnected) return;
        ns.forEach(function (n, i) { if (out[i] != null) n.nodeValue = out[i]; });
        store.set(key, out); body.lang = "fr";
        msg.textContent = "Machine translation. Medical terms may be imperfect: check with the English.";
      }, function () { setBtn("en"); msg.textContent = "Translation is not available right now (needs an internet connection)."; });
    }
    function toEnglish() { if (orig) nodes().forEach(function (n, i) { if (orig[i] != null) n.nodeValue = orig[i]; }); body.lang = "en"; msg.textContent = ""; }
    btns.forEach(function (b) { b.onclick = function () { if (b.getAttribute("aria-pressed") === "true") return; setBtn(b.dataset.lang); if (b.dataset.lang === "fr") toFrench(); else toEnglish(); }; });
    if (store.get("sina:sumLang", "en") === "fr") { setBtn("fr"); toFrench(); }
  }

  /* ---------- resume an unfinished quiz ---------- */
  function resumeTitle(id) {
    if (/^mix:/.test(id)) { var ids = id.slice(4).split(":")[0].split("+"); return ids.length === 1 ? lectureTitle(ids[0]) : ids.length + " lectures mixed"; }
    if (id === "mistakes") return "Redo my mistakes";
    var x = (S.papers || []).filter(function (y) { return y.id === id; })[0]; if (x) return x.title;
    return lectureTitle(id) || id;
  }
  function resumeInfo() {
    var r = store.get("sina:resume", null);
    if (!r || !r.qs || !r.qs.length || Date.now() - r.t > 14 * 864e5) return null;
    var n = (r.done || []).filter(Boolean).length; r.n = n; return n ? r : null;
  }
  function resumeBanner(filter) {
    var r = resumeInfo(); if (!r || (filter && !filter(r))) return "";
    return '<a class="resume-bar" href="#/resume"><span class="rb-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg></span><span><strong>Resume your quiz</strong><span class="rb-s">' + esc(r.title) + " · " + r.n + " of " + r.qs.length + " answered</span></span></a>";
  }
  function resumeView() {
    var r = resumeInfo(); if (!r) { location.replace("#/"); return; }
    /* the saved copy may predate a site update: take slides and explanations from the current questions */
    var idx = {};
    Object.keys(S.lectures).forEach(function (k) { (S.lectures[k].mcqs || []).forEach(function (q) { idx[qKey(q)] = q; }); });
    (S.papers || []).forEach(function (pp) { (pp.questions || []).forEach(function (q) { if (q.options) idx[qKey(q)] = q; }); });
    r.qs = r.qs.map(function (q) {
      var f = idx[q._k || qKey(q)]; if (!f) return q;
      var c = {}; for (var k in q) c[k] = q[k];
      if (f.slides) c.slides = f.slides; else delete c.slides;
      if (f.why != null) c.why = f.why;
      if (f.notes && f.notes.some(function (n) { return n; })) c.notes = c.options.map(function (o) { var j = f.options.indexOf(o); return j > -1 ? f.notes[j] : ""; }); else delete c.notes;
      return c;
    });
    setView('<div class="wrap"><p class="crumbs"><a href="#/">Home</a> / Resume</p><h1>' + esc(r.title) + '</h1><p class="meta">Picking up where you stopped. <a href="' + esc(r.back || "#/") + '">Back to where it started</a></p><div id="rq"></div></div>', "Resume quiz");
    questionsPanel(document.getElementById("rq"), { id: r.id, mcqs: r.qs, _title: r.title }, r);
  }
  /* ---------- lecture summary: remember where the reader stopped ---------- */
  function readPos(lid, panel) {
    var key = "sina:pos", pos = store.get(key, {}), saved = pos[lid], t = null;
    if (saved && saved > 700) {
      var b = document.createElement("button"); b.type = "button"; b.className = "jump-back"; b.innerHTML = "&darr; Jump back to where you stopped";
      b.onclick = function () { window.scrollTo({ top: saved, behavior: "smooth" }); b.remove(); };
      document.body.appendChild(b); setTimeout(function () { b.classList.add("show"); }, 50);
      setTimeout(function () { if (b.isConnected) { b.classList.remove("show"); setTimeout(function () { b.remove(); }, 400); } }, 9000);
    }
    function onScroll() {
      if (!panel.isConnected) { window.removeEventListener("scroll", onScroll); var jb = document.querySelector(".jump-back"); if (jb) jb.remove(); return; }
      clearTimeout(t); t = setTimeout(function () { var p2 = store.get(key, {}); p2[lid] = Math.round(window.scrollY); store.set(key, p2); }, 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
  }


  /* ---------- flowchart (model D) ---------- */
  function flowHTML(q, shown) {
    var L = S.lectures[q.flow], f = L && L.flow; if (!f) return "";
    return '<div class="flowq">' + (f.title ? '<p class="flow-title">' + esc(f.title) + "</p>" : "") + f.steps.map(function (st, n) {
      var me = st.k === q.target;
      return (n ? '<div class="flow-arrow" aria-hidden="true">&darr;</div>' : "") + '<div class="flow-step' + (me ? (shown ? " filled" : " blank") : "") + '"><span class="fs-n">' + (n + 1) + '</span><div><b>' + (me && !shown ? "?" : esc(st.name)) + "</b>" + (st.desc && !(me && !shown) ? "<span>" + esc(st.desc) + "</span>" : "") + "</div></div>";
    }).join("") + "</div>";
  }

  /* ---------- quiz progress as a heartbeat trace; the beat speeds up near the end ---------- */
  function ecgPts(beats, W) { var pts = [], x = 0, step = W / beats; for (var b = 0; b < beats; b++) { var o = x + step * 0.48; pts.push(x + ",6", o + ",6", (o + 3) + ",3", (o + 6) + ",6", (o + 9) + ",6", (o + 11) + ",0.5", (o + 14) + ",11.5", (o + 17) + ",4", (o + 19) + ",6"); x += step; } pts.push(W + ",6"); return pts.join(" "); }
  function ecgProgress(frac) {
    var W = 496, id = "qp" + Math.random().toString(36).slice(2, 7), pts = ecgPts(10, W), x = Math.max(0, Math.min(1, frac)) * W;
    var dur = (1.8 - 1.4 * frac).toFixed(2) + "s";
    var sw = (0.9 + 1.6 * (1 - frac)).toFixed(2), lead = Math.max(30, x * 0.35);
    return '<div class="qecg' + (frac >= 0.8 ? " near" : "") + '" style="--beat:' + dur + '"><svg viewBox="0 0 ' + W + ' 12" preserveAspectRatio="none" aria-hidden="true"><defs><clipPath id="' + id + '"><rect x="0" y="-2" width="' + x.toFixed(1) + '" height="16"/></clipPath>' +
      '<clipPath id="' + id + 's"><rect y="-2" height="16" width="' + lead.toFixed(1) + '" x="0">' + (x > 4 && !REDUCE ? '<animate attributeName="x" from="' + (-lead).toFixed(1) + '" to="' + x.toFixed(1) + '" dur="' + sw + 's" repeatCount="indefinite"/>' : "") + '</rect></clipPath>' +
      '<linearGradient id="' + id + 'g" x1="0" x2="1"><stop offset="0" stop-color="currentColor" stop-opacity="0"/><stop offset="1" stop-color="currentColor" stop-opacity="1"/></linearGradient></defs>' +
      '<polyline class="qe-bg" points="' + pts + '"/><g clip-path="url(#' + id + ')"><polyline class="qe-fg" points="' + pts + '"/><polyline class="qe-sweep" clip-path="url(#' + id + 's)" points="' + pts + '"/></g></svg>' +
      '<span class="qe-dot" style="left:' + (frac * 100).toFixed(2) + '%"></span></div>';
  }
  /* ---------- covered-label picture (model A) ---------- */
  /* 3D explorer on the Visual tab: which models go with which lecture */
  var M3D_FOR = { "anat3-cerebrum": ["cerebrum", "deep"], "anat3-diencephalon": ["deep", "brainstem"], "anat3-brainstem": ["brainstem"], "anat3-cerebellum": ["brainstem"],
    "anat3-ventricles": ["deep"], "anat3-spinal-cord": ["cord"], "anat3-ear-1": ["ear"], "anat3-ear-2": ["ear"], "anat3-larynx": ["larynx"], "anat3-thyroid": ["larynx"] };
  var M3D_TITLE = { cerebrum: "Cerebral hemisphere", deep: "Deep structures and ventricles", brainstem: "Brainstem, cerebellum and cranial nerves", cord: "Spinal cord section", ear: "Middle and inner ear", larynx: "Larynx and thyroid" };
  function wireExplorer(p, list) {
    var box = p.querySelector(".m3d-x"), cur = list[0], view = null;
    function go() {
      if (view) { view.destroy(); view = null; }
      box.innerHTML = "";
      var names = (S.m3d[cur] || {}).names || {};
      import(new URL("js/m3d.js", document.baseURI).href).then(function (M) {
        return M.mount(box, { model: cur, view: cur === "cerebrum" ? [1, 0.15, 0.25] : cur === "cord" ? [0, 1, 0.45] : cur === "ear" ? [1, 0.2, 0.5] : [0.4, 0.2, 1],
          pick: function (k, show) { if (view) view.setHighlight([k]); show(names[k] || ""); } });
      }).then(function (v) { view = v; }).catch(function () { box.innerHTML = '<div class="m3d-load">3D view not supported on this browser.</div>'; });
    }
    box.querySelector(".m3d-go").onclick = go;
    p.querySelectorAll("[data-x3]").forEach(function (b) { b.onclick = function () { cur = b.dataset.x3; p.querySelectorAll("[data-x3]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); go(); }; });
  }
  /* 3D questions: the model loads on demand (js/m3d.js, three.js) */
  function m3dHTML(q) {
    return '<div class="m3d" role="img" aria-label="3D model with one structure highlighted in orange. Drag to turn it."></div><p class="m3d-credit">3D model: <a href="https://github.com/Z-Anatomy/Models-of-human-anatomy" target="_blank" rel="noopener">Z-Anatomy</a> (from BodyParts3D), CC BY-SA 4.0</p>';
  }
  function m3dMount(p, q) {
    var el = p.querySelector(".m3d"); if (!el || !q.m3d) return;
    import(new URL("js/m3d.js", document.baseURI).href).then(function (M) {
      if (!el.isConnected) return;
      M.mount(el, { model: q.m3d.m, highlight: q.m3d.hl, view: q.m3d.view, ghost: q.m3d.ghost, hide: q.m3d.hide, focus: q.m3d.focus });
    }).catch(function () { el.innerHTML = '<div class="m3d-load">3D view not supported on this browser.</div>'; });
  }
  function occHTML(q, shown) {
    var f = S.occl && S.occl[q.occ.f]; if (!f) return "";
    return '<figure class="occ"><div class="occ-scroll"><div class="occ-wrap" style="aspect-ratio:' + f.w + "/" + f.h + '"><img src="' + esc(f.src) + '" alt="Anatomy picture with its labels covered" width="' + f.w + '" height="' + f.h + '" loading="lazy">' +
      f.labels.map(function (b, i) { var me = i === q.occ.i; return '<span class="otile' + (me ? " q" : "") + (me && shown ? " show" : "") + '" style="left:' + b[0] + "%;top:" + b[1] + "%;width:" + b[2] + "%;height:" + b[3] + '%">' + (me ? (shown ? "" : "?") : "") + "</span>"; }).join("") +
      '</div></div><figcaption>' + esc(f.credit) + " Tap the picture to zoom.</figcaption></figure>";
  }
  document.addEventListener("click", function (e) { var w = e.target.closest && e.target.closest(".occ-wrap"); if (w && !w.closest(".spot")) w.classList.toggle("zoom"); });
  /* ---------- spotter (model C): tap the structure ---------- */
  function spotTasks(lids) {
    var out = [];
    Object.keys(S.occl || {}).forEach(function (fk) {
      var f = S.occl[fk]; if (!f.lecs.some(function (l) { return lids.indexOf(l) > -1; })) return;
      var names = {};
      f.lecs.forEach(function (lid) { var L = S.lectures[lid]; (L && L.picMcqs || []).forEach(function (q) { var a = q.answers ? q.answers[0] : q.answer; names[q.target] = q.options[a]; }); });
      Object.keys(f.pts).forEach(function (k) { if (names[k]) out.push({ f: fk, k: k, name: names[k], pt: f.pts[k] }); });
    });
    return shuffle(out);
  }
  /* a tap on a whole area (a lobe, the cerebellum…) counts anywhere inside that area's tint, not only next to the label line */
  function isArea(name) { return /\b(lobe|lobes|cerebellum|brainstem|hemisphere|region|cortex)\b/i.test(name); }
  var pixCache = {};
  function pixels(img) {
    var k = img.src; if (pixCache[k]) return pixCache[k];
    var W = Math.min(480, img.naturalWidth), H = Math.round(W * img.naturalHeight / img.naturalWidth);
    var c = document.createElement("canvas"); c.width = W; c.height = H;
    var g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(img, 0, 0, W, H);
    return (pixCache[k] = { W: W, H: H, d: g.getImageData(0, 0, W, H).data });
  }
  function tint(P, pt, r0, r1) {   /* median colour near a point, ignoring dark outlines and leader lines */
    var cx = pt[0] / 100 * (P.W - 1), cy = pt[1] / 100 * (P.H - 1), R = [], G = [], B = [];
    for (var y = Math.floor(cy - r1); y <= cy + r1; y++) for (var x = Math.floor(cx - r1); x <= cx + r1; x++) {
      var dd = Math.hypot(x - cx, y - cy); if (dd < r0 || dd > r1 || x < 0 || y < 0 || x >= P.W || y >= P.H) continue;
      var o = (y * P.W + x) * 4; if (P.d[o] + P.d[o + 1] + P.d[o + 2] < 330) continue;
      R.push(P.d[o]); G.push(P.d[o + 1]); B.push(P.d[o + 2]);
    }
    if (R.length < 6) return null;
    var med = function (a) { a.sort(function (u, v) { return u - v; }); return a[a.length >> 1]; };
    return [med(R), med(G), med(B)];
  }
  function cdist(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]); }
  function inArea(img, t, others, tap) {
    try {
      if (!isArea(t.name) || !img || !img.complete || !img.naturalWidth) return false;
      var P = pixels(img), me = tint(P, t.pt, 3, 10), at = tint(P, tap, 0, 5);
      if (!me || !at || me[0] + me[1] + me[2] > 735) return false;            /* white background is not an area */
      var dm = cdist(at, me); if (dm > 24) return false;
      return others.every(function (o) { var c = tint(P, o.pt, 3, 10); return !c || cdist(at, c) > dm; });
    } catch (e) { return false; }
  }
  function spotterPanel(p, lids, back) {
    var tasks = spotTasks(lids).slice(0, 20), i = 0, score = 0;
    if (!tasks.length) { p.innerHTML = '<p class="src">No spotter pictures for these lectures yet.</p>'; return; }
    function render() {
      if (i >= tasks.length) {
        p.innerHTML = scoreRevealHTML(score, tasks.length) + '<div class="row"><button class="btn primary" id="sp-again">Try again</button>' + (back ? '<button class="btn" id="sp-back">Back</button>' : "") + "</div>";
        scoreReveal(p, score, tasks.length);
        p.querySelector("#sp-again").onclick = function () { spotterPanel(p, lids, back); };
        if (back) p.querySelector("#sp-back").onclick = back;
        return;
      }
      var t = tasks[i], f = S.occl[t.f], done = false;
      p.innerHTML = '<p class="qhead">Spotter ' + (i + 1) + " of " + tasks.length + '</p><div class="bar-track"><div class="bar-fill" style="width:' + (i / tasks.length * 100) + '%"></div></div><p class="qtext">Tap the ' + esc(t.name.charAt(0).toLowerCase() + t.name.slice(1)) + ".</p>" +
        '<figure class="occ spot"><div class="occ-wrap" style="aspect-ratio:' + f.w + "/" + f.h + '"><img src="' + esc(f.src) + '" alt="Anatomy picture, labels covered" width="' + f.w + '" height="' + f.h + '">' +
        f.labels.map(function (b) { return '<span class="otile" style="left:' + b[0] + "%;top:" + b[1] + "%;width:" + b[2] + "%;height:" + b[3] + '%"></span>'; }).join("") + "</div><figcaption>" + esc(f.credit) + "</figcaption></figure>" +
        '<div id="fb"></div><div class="qnav"><span></span><button class="btn" id="sp-next" type="button">Skip &rarr;</button></div>';
      var wrap = p.querySelector(".occ-wrap"), nx = p.querySelector("#sp-next");
      function mark(cls, x, y) { var m = document.createElement("span"); m.className = cls; m.style.left = x + "%"; m.style.top = y + "%"; wrap.appendChild(m); }
      function finishSpot(x, y) {
        if (done) return; done = true;
        var ok = false;
        if (x != null) { var dx = (x - t.pt[0]) * f.w / 100, dy = (y - t.pt[1]) * f.h / 100; ok = Math.sqrt(dx * dx + dy * dy) < Math.max(f.w, f.h) * 0.07 || inArea(p.querySelector(".occ-wrap img"), t, spotTasks(lids).filter(function (o) { return o.f === t.f && o.k !== t.k && isArea(o.name); }), [x, y]); mark("spot-hit " + (ok ? "ok" : "bad"), x, y); }
        if (!ok) mark("spot-ring", t.pt[0], t.pt[1]);
        if (ok) score++;
        p.querySelector("#fb").innerHTML = '<div class="why"><strong>' + (ok ? "Correct." : x == null ? "Skipped." : "Not quite.") + "</strong> " + (ok ? "" : "The dashed circle shows the " + esc(t.name.charAt(0).toLowerCase() + t.name.slice(1)) + ".") + "</div>";
        nx.classList.add("primary"); nx.innerHTML = (i + 1 < tasks.length ? "Next" : "See score") + " &rarr;";
      }
      wrap.addEventListener("click", function (e) { var r = wrap.getBoundingClientRect(); finishSpot((e.clientX - r.left) / r.width * 100, (e.clientY - r.top) / r.height * 100); });
      nx.onclick = function () { if (!done) { finishSpot(null, null); return; } i++; render(); };
    }
    render();
  }
  /* ---------- animation helpers ---------- */
  var REDUCE = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function snakeLoader() {
    return '<span class="snake-load" aria-hidden="true"><svg viewBox="0 0 40 60"><line class="sl-rod" x1="20" y1="4" x2="20" y2="56"/><path class="sl-snake" pathLength="100" d="M20 54 C34 50 34 44 20 40 C6 36 6 30 20 26 C34 22 34 16 20 12"/><circle class="sl-head" r="3.2" cx="20" cy="12"/></svg></span>';
  }
  document.addEventListener("load", function (e) { var t = e.target; if (t.tagName === "IMG" && t.parentNode && t.parentNode.classList && t.parentNode.classList.contains("slide-img")) t.parentNode.classList.add("loaded"); }, true);
  function flameHTML(n, animate, was) {
    if (n < 5 && !(animate && was >= 5)) return '<span class="streak" hidden></span>';
    var out = n < 5;
    return '<span class="streak' + (out ? " out" : animate ? " grow" : "") + '" title="' + (out ? "Streak lost" : n + " correct in a row") + '"><svg viewBox="0 0 24 32" aria-hidden="true"><path class="fl-o" d="M12 1C14 8 21 11 21 20a9 9 0 0 1-18 0c0-5 3-7 4-11 1 3 2 4 3 4C10 9 11 5 12 1z"/><path class="fl-i" d="M12 13c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-6 1 1 2 2 3 2 0-2 0-4 0-6z"/></svg><b>' + (out ? was : n) + "</b></span>";
  }
  function answerFx(opts, ans, chosen, ok) {
    if (REDUCE) return;
    opts.forEach(function (x) {
      var n = +x.dataset.n;
      if (ok && ans.indexOf(n) > -1) { x.classList.add("fx-ok"); x.insertAdjacentHTML("beforeend", '<svg class="blip" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true"><polyline pathLength="100" points="0,10 38,10 42,10 46,5 50,10 54,10 57,1 61,19 65,6 68,10 100,10"/></svg>'); }
      else if (!ok && chosen.indexOf(n) > -1) x.classList.add("fx-shake");
      else if (!ok && ans.indexOf(n) > -1) x.classList.add("fx-glow");
    });
  }
  function scoreRevealHTML(score, n) {
    var pct = n ? Math.round(score / n * 100) : 0, C = 2 * Math.PI * 42;
    return '<div class="score-reveal"><svg class="pring big" viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="42"/><circle class="fg" cx="50" cy="50" r="42" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '" data-to="' + (C * (1 - pct / 100)) + '"/><text x="50" y="57" class="sr-pct">' + (REDUCE ? pct : 0) + '%</text></svg><div class="score"><span class="sr-n">' + (REDUCE ? fmtPts(score) : 0) + "</span> / " + n + "</div></div>" ;
  }
  function scoreReveal(p, score, n) {
    try { ev("quiz-finished"); } catch (e) {}
    var ring = p.querySelector(".score-reveal .fg"), num = p.querySelector(".sr-n"), pc = p.querySelector(".sr-pct"), pct = n ? Math.round(score / n * 100) : 0;
    requestAnimationFrame(function () { if (ring) ring.style.strokeDashoffset = ring.getAttribute("data-to"); });
    if (REDUCE) return;
    var t0 = performance.now(), dur = 1300;
    (function step(now) {
      var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      if (num) num.textContent = k < 1 ? (score % 1 ? (score * e).toFixed(2) : Math.round(score * e)) : fmtPts(score); if (pc) pc.textContent = Math.round(pct * e) + "%";
      if (k < 1) requestAnimationFrame(step); else if (n && score === n) feathers();
    })(t0);
  }
  function feathers() {
    if (REDUCE) return;
    var box = document.createElement("div"); box.className = "feathers"; box.setAttribute("aria-hidden", "true");
    var h = "";
    for (var k = 0; k < 34; k++) {
      var ang = Math.random() * Math.PI * 2, dist = 120 + Math.random() * 260;
      h += '<i style="--x:' + Math.round(Math.cos(ang) * dist) + "px;--y:" + Math.round(Math.sin(ang) * dist - 80) + "px;--r:" + Math.round(Math.random() * 720 - 360) + "deg;--d:" + (Math.random() * 0.25).toFixed(2) + "s;--s:" + (0.6 + Math.random() * 0.8).toFixed(2) + '"><svg viewBox="0 0 10 40"><path d="M5 0C9 10 9 28 5 40C1 28 1 10 5 0Z"/><line x1="5" y1="2" x2="5" y2="40"/></svg></i>';
    }
    box.innerHTML = h; document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 2600);
  }
  function revealOnScroll(els) {
    if (REDUCE || !els.length) return;
    /* items fade in as they come near the screen; anything already above the screen (a fast flick or a jump)
       is shown at once, so a list can never stay half invisible */
    var pending = [].slice.call(els), ticking = false;
    pending.forEach(function (el) { el.classList.add("reveal"); });
    function check() {
      ticking = false;
      var lim = window.innerHeight * 1.25, k = 0;
      pending = pending.filter(function (el) {
        if (!document.body.contains(el)) return false;
        var r = el.getBoundingClientRect();
        if (r.top < lim) { el.style.setProperty("--rd", (r.bottom > 0 ? Math.min(k++ * 0.04, 0.12) : 0) + "s"); el.classList.add("in"); return false; }
        return true;
      });
      if (!pending.length) { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(check); } }
    window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll);
    requestAnimationFrame(check);
    setTimeout(function () { pending.forEach(function (el) { el.classList.add("in"); }); pending = []; }, 4000);
  }


  /* ---------- accounts: synced progress across devices (Apps Script + one private Drive file per user) ---------- */
  var SinaSync = window.SinaSync = (function () {
    function acc() { return store.get("sina:acct", null); }
    function on() { return !!(S.api && acc() && acc().token); }
    function call(op, body) {
      return fetch(S.api, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(Object.assign({ type: "acct", op: op }, body || {})) })
        .then(function (r) { return r.json(); });
    }
    function snapshot() {
      var v = {}, mt = store.get("sina:mt", {});
      for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (syncable(k)) v[k] = localStorage.getItem(k); }
      Object.keys(mt).forEach(function (k) { if (!(k in v) && syncable(k)) v[k] = null; });   /* deleted keys travel as null */
      return { v: v, mt: mt, at: Date.now() };
    }
    function isObj(x) { return x && typeof x === "object" && !Array.isArray(x); }
    /* both devices changed the same key since the last sync: combine instead of picking one */
    function union(a, b, bNewer) {
      if (isObj(a) && isObj(b)) { var o = {}; Object.keys(a).forEach(function (k) { o[k] = a[k]; }); Object.keys(b).forEach(function (k) { o[k] = k in a ? union(a[k], b[k], bNewer) : b[k]; }); return o; }
      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length === b.length && a.concat(b).every(function (x) { return typeof x === "number"; })) return a.map(function (x, i) { return Math.max(x, b[i]); });
        var seen = {}, out = []; a.concat(b).forEach(function (x) { var k = JSON.stringify(x); if (!seen[k]) { seen[k] = 1; out.push(x); } });
        return out.every(function (x) { return typeof x === "string"; }) ? out.sort() : out;
      }
      if (typeof a === "number" && typeof b === "number") return Math.max(a, b);
      return bNewer ? b : a;
    }
    var LWW = /^sina:(mistakes|resume|program|theme|qcount|midOnly|m3dq|nick|akmode|akmix|akcount|mmView|cramOpen|last|pos|weakMid|yearAsked)$/;
    function merge(remote) {
      var a = acc(), since = (a && a.syncedAt) || 0, mt = store.get("sina:mt", {}), changed = 0;
      Object.keys(remote.v || {}).forEach(function (k) {
        if (!syncable(k)) return;
        var rt = (remote.mt || {})[k] || 0, lt = mt[k] || 0, lv = localStorage.getItem(k), rv = remote.v[k];
        if (rv === lv) return;
        var take;
        if (lv === null && !(k in mt)) take = rv;                 /* this device never had it */
        else if (rt <= since && lt > since) return;              /* only this device changed it */
        else if (lt <= since) take = rv;                         /* only the other device changed it */
        else if (LWW.test(k.split(":").slice(0, 2).join(":")) || rv === null || lv === null) take = rt > lt ? rv : lv;
        else { try { take = JSON.stringify(union(JSON.parse(lv), JSON.parse(rv), rt > lt)); } catch (e) { take = rt > lt ? rv : lv; } }
        if (take === lv) return;
        try { if (take === null) localStorage.removeItem(k); else localStorage.setItem(k, take); } catch (e) {}
        mt[k] = Math.max(rt, lt); changed++;
      });
      try { localStorage.setItem("sina:mt", JSON.stringify(mt)); } catch (e) {}
      return changed;
    }
    var busy = null;
    function run(first) {
      if (!on()) return Promise.resolve({ ok: false });
      if (busy) return busy;
      var a = acc();
      if (!a.syncedAt) {   /* first sync on this device: everything already here counts as new, so it is combined with the account */
        var mt0 = store.get("sina:mt", {}), now0 = Date.now();
        for (var i = 0; i < localStorage.length; i++) { var k0 = localStorage.key(i); if (syncable(k0) && !mt0[k0]) mt0[k0] = now0; }
        try { localStorage.setItem("sina:mt", JSON.stringify(mt0)); } catch (e) {}
      }
      busy = call("pull", { user: a.user, token: a.token }).then(function (r) {
        if (!r.ok) { if (r.error === "token" || r.error === "nouser") { store.del("sina:acct"); acctLabel(); } throw new Error(r.error || "pull"); }
        var remote = {}; try { remote = JSON.parse(r.data || "{}"); } catch (e) {}
        var changed = merge(remote);
        return call("push", { user: a.user, token: a.token, data: JSON.stringify(snapshot()) }).then(function (p) {
          if (!p.ok) throw new Error(p.error || "push");
          var a2 = acc(); if (a2) { a2.syncedAt = Date.now(); a2.ver = p.ver; store.set("sina:acct", a2); }
          if (changed && first) route();
          return { ok: true, changed: changed };
        });
      }).then(function (x) { busy = null; return x; }, function (e) { busy = null; return { ok: false, error: String(e && e.message || e) }; });
      return busy;
    }
    return { on: on, run: run, call: call, acc: acc };
  })();
  function acctLabel() { var l = document.getElementById("acct-label"), a = SinaSync.acc(); if (l) l.textContent = a ? "Account: " + a.user : "Account and sync"; }
  acctLabel();
  if (SinaSync.on()) setTimeout(function () { SinaSync.run(true); }, 1500);
  document.addEventListener("visibilitychange", function () {
    var a = SinaSync.acc();
    if (document.visibilityState === "visible" && SinaSync.on() && Date.now() - ((a && a.syncedAt) || 0) > 60000) SinaSync.run(true);
  });
  var ACCT_ERR = { name: "Usernames are 3 to 24 characters: letters, numbers, dots, dashes or underscores.", taken: "That username is taken. Try another.", pass: "Passwords need at least 6 characters.",
    nouser: "No account with that username.", wrong: "Wrong password.", locked: "Too many wrong tries. Wait 15 minutes and try again.", big: "Your progress is too large to sync.", token: "Your session ended. Log in again." };
  function accountView() {
    var a = SinaSync.acc();
    var h = '<div class="wrap narrow"><p class="crumbs"><a href="#/">Home</a> / Account</p><h1>Account and sync</h1>';
    if (!S.api) { setView(h + "<p>Accounts are not available yet.</p></div>", "Account"); return; }
    if (a) {
      h += '<p class="lede-s">Logged in as <strong>' + esc(a.user) + '</strong>. Your progress syncs on its own: when you open Sina and a few seconds after you answer.</p>' +
        '<p class="meta" id="acct-status">' + (a.syncedAt ? "Last synced " + new Date(a.syncedAt).toLocaleString() : "Not synced yet.") + '</p>' +
        '<div class="row"><button class="btn primary" id="acct-sync" type="button">Sync now</button><button class="btn" id="acct-out" type="button">Log out on this device</button></div>' +
        '<details class="acct-more" id="acct-pw"' + (a.reset ? " open" : "") + '><summary>Change password</summary>' + (a.reset ? '<p class="meta">Your password was reset. Choose a new one now.</p>' : "") +
        '<label class="fld">Current password<input type="password" id="acct-old" autocomplete="current-password"></label><label class="fld">New password<input type="password" id="acct-new" autocomplete="new-password" minlength="6"></label>' +
        '<label class="fld">Repeat new password<input type="password" id="acct-new2" autocomplete="new-password"></label><button class="btn" id="acct-chg" type="button">Change password</button><p class="meta" id="acct-cmsg" aria-live="polite"></p></details>' +
        '<details class="acct-more"><summary>Delete my account</summary><p class="meta">This deletes your account and the copy of your progress saved online. Progress on this device stays.</p>' +
        '<label class="fld">Password<input type="password" id="acct-dpass" autocomplete="current-password"></label><button class="btn danger" id="acct-del" type="button">Delete account</button><p class="meta" id="acct-dmsg" aria-live="polite"></p></details>';
      setView(h + "</div>", "Account");
      var st = document.getElementById("acct-status");
      document.getElementById("acct-sync").onclick = function () {
        st.textContent = "Syncing…";
        SinaSync.run(true).then(function (r) { st.textContent = r.ok ? "Synced " + new Date().toLocaleString() + (r.changed ? " · " + r.changed + " item" + (r.changed > 1 ? "s" : "") + " updated from your other devices" : "") : "Could not sync. " + (ACCT_ERR[r.error] || "Check your connection."); });
      };
      document.getElementById("acct-chg").onclick = function () {
        var m = document.getElementById("acct-cmsg"), np = document.getElementById("acct-new").value;
        if (np.length < 6) { m.textContent = ACCT_ERR.pass; return; }
        if (np !== document.getElementById("acct-new2").value) { m.textContent = "The two new passwords are different."; return; }
        m.textContent = "Changing…";
        SinaSync.call("passwd", { user: a.user, pass: document.getElementById("acct-old").value, newpass: np }).then(function (r) {
          if (!r.ok) { m.textContent = ACCT_ERR[r.error] || "Could not change it."; return; }
          var a2 = SinaSync.acc(); if (a2) { delete a2.reset; store.set("sina:acct", a2); }
          m.textContent = "Password changed."; ["acct-old", "acct-new", "acct-new2"].forEach(function (id) { document.getElementById(id).value = ""; });
        }, function () { m.textContent = "Could not reach Sina. Check your connection."; });
      };
      document.getElementById("acct-out").onclick = function () { store.del("sina:acct"); acctLabel(); accountView(); };
      document.getElementById("acct-del").onclick = function () {
        var m = document.getElementById("acct-dmsg"); m.textContent = "Deleting…";
        SinaSync.call("delete", { user: a.user, pass: document.getElementById("acct-dpass").value }).then(function (r) {
          if (!r.ok) { m.textContent = ACCT_ERR[r.error] || "Could not delete."; return; }
          store.del("sina:acct"); acctLabel(); accountView();
        }, function () { m.textContent = "Could not reach Sina. Check your connection."; });
      };
      return;
    }
    h += '<p class="lede-s">Create an account to keep your progress on all your devices.</p>' +
      '<div class="tabs acct-tabs" role="tablist"><button role="tab" type="button" data-m="login" aria-selected="true">Log in</button><button role="tab" type="button" data-m="signup" aria-selected="false">Create account</button></div>' +
      '<form id="acct-form" class="acct-form"><label class="fld">Username<input id="acct-user" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="24" required></label>' +
      '<label class="fld">Password<input id="acct-pass" type="password" autocomplete="current-password" minlength="6" required></label>' +
      '<label class="fld" id="acct-p2w" hidden>Repeat password<input id="acct-pass2" type="password" autocomplete="new-password"></label>' +
      '<button class="btn primary" type="submit" id="acct-go">Log in</button><p class="meta" id="acct-msg" aria-live="polite"></p></form>' +
      '<p class="meta">No email needed. Pick a username others won\'t guess if you want privacy.</p><p class="meta">Forgot your password? Ask the person who runs Sina to reset it.</p>' +
      '<p class="meta">If this device already has progress, it is combined with your account\'s progress when you log in.</p>';
    setView(h + "</div>", "Account");
    var mode = "login", form = document.getElementById("acct-form"), msg = document.getElementById("acct-msg");
    document.querySelectorAll(".acct-tabs [data-m]").forEach(function (b) {
      b.onclick = function () {
        mode = b.dataset.m; document.querySelectorAll(".acct-tabs [data-m]").forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); });
        document.getElementById("acct-p2w").hidden = mode !== "signup"; document.getElementById("acct-go").textContent = mode === "signup" ? "Create account" : "Log in";
        document.getElementById("acct-pass").setAttribute("autocomplete", mode === "signup" ? "new-password" : "current-password"); msg.textContent = "";
      };
    });
    form.onsubmit = function (e) {
      e.preventDefault();
      var user = document.getElementById("acct-user").value.trim().toLowerCase(), pass = document.getElementById("acct-pass").value;
      if (!/^[a-z0-9._-]{3,24}$/.test(user)) { msg.textContent = ACCT_ERR.name; return; }
      if (pass.length < 6) { msg.textContent = ACCT_ERR.pass; return; }
      if (mode === "signup" && pass !== document.getElementById("acct-pass2").value) { msg.textContent = "The two passwords are different."; return; }
      var go = document.getElementById("acct-go"); go.disabled = true; msg.textContent = mode === "signup" ? "Creating your account…" : "Logging in…";
      SinaSync.call(mode, { user: user, pass: pass }).then(function (r) {
        if (!r.ok) { go.disabled = false; msg.textContent = ACCT_ERR[r.error] || "Something went wrong. Try again."; return; }
        store.set("sina:acct", { user: r.user, token: r.token, syncedAt: 0, reset: r.reset ? 1 : undefined }); acctLabel();
        msg.textContent = "Syncing your progress…";
        SinaSync.run(false).then(function () { accountView(); });
      }, function () { go.disabled = false; msg.textContent = "Could not reach Sina. Check your connection."; });
    };
  }

  /* ---------- leaderboard (best exam-mode score per nickname and past paper) ---------- */
  function lbDevice() { var d = store.get("sina:dev", ""); if (!d) { d = Math.random().toString(36).slice(2, 12); store.set("sina:dev", d); } return d; }
  function lbPostHTML() {
    return '<div class="lb-post"><p><strong>Leaderboard</strong> · post this score under a nickname (no real names needed).</p><div class="row"><input id="lb-nick" maxlength="20" placeholder="Nickname" value="' + esc(store.get("sina:nick", "")) + '"><button class="btn primary" id="lb-send">Post my score</button></div><p class="src" id="lb-msg"></p></div>';
  }
  function lbPostWire(p, paper, score, total, secs) {
    var b = p.querySelector("#lb-send"), inp = p.querySelector("#lb-nick"), msg = p.querySelector("#lb-msg");
    b.onclick = function () {
      var nick = inp.value.replace(/[^\p{L}\p{N} ._-]/gu, "").trim().slice(0, 20);
      if (!nick) { msg.textContent = "Pick a nickname first."; inp.focus(); return; }
      if (secs < total * 3) { msg.textContent = "Finished too fast to count (under 3 seconds per question)."; return; }
      store.set("sina:nick", nick); b.disabled = true; msg.textContent = "Sending…";
      fetch(S.api, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ type: "score", nick: nick, device: lbDevice(), paper: paper, score: Math.round(score * 100) / 100, total: total, secs: secs }) })
        .then(function () { msg.innerHTML = 'Posted. <a href="#/leaderboard/' + paper + '">See the leaderboard</a>'; sessionStorage.removeItem("sina:lb"); store.set("sina:lbPending", { nick: nick, paper: paper, score: Math.round(score * 100) / 100, total: total, secs: secs, t: Date.now() }); }, function () { b.disabled = false; msg.textContent = "Could not send. Check your connection."; });
    };
  }
  function lbFetch(cb, fresh) {
    try { var c = JSON.parse(sessionStorage.getItem("sina:lb") || "null"); if (!fresh && c && Date.now() - c.t < 1e4) return cb(c.d); } catch (e) {}
    var save = function (d) { if (d && d.ok) { try { sessionStorage.setItem("sina:lb", JSON.stringify({ t: Date.now(), d: d })); } catch (e) {} } cb(d); };
    /* plain fetch first (Apps Script answers with open CORS); JSONP only as a fallback */
    fetch(S.api, { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (d) { if (d && d.ok) save(d); else jsonp(); }, jsonp);
    function jsonp() {
    var name = "sinaLb" + Date.now(), sc = document.createElement("script"), done = false;
    var fin = function (d) { if (done) return; done = true; try { delete window[name]; } catch (e) { window[name] = undefined; } sc.remove(); save(d); };
    window[name] = fin;
    sc.src = S.api + (S.api.indexOf("?") > -1 ? "&" : "?") + "callback=" + name;
    sc.onerror = function () { fin(null); };
    setTimeout(function () { fin(null); }, 15000);
    document.head.appendChild(sc);
    }
  }
  function leaderboardView(sel) {
    if (!S.api) return notFound();
    setView('<div class="wrap"><p class="crumbs"><a href="#/">Home</a> / Leaderboard</p><h1>Leaderboard</h1><p class="meta">Best exam-mode score per nickname on each past paper this week. Ties go to the faster time. Resets every Tuesday at 23:00.</p><div id="lb"><div class="loading-row">' + snakeLoader() + '<span>Loading the leaderboard…</span></div></div></div>', "Leaderboard");
    var cur = null, last = 0, timer = null;
    function load(fresh) { lbFetch(show, fresh); }
    timer = setInterval(function () { if (!document.getElementById("lb")) { clearInterval(timer); return; } if (!document.hidden) load(true); }, 15000);
    function show(d) {
      var box = document.getElementById("lb"); if (!box) return;
      var quiet = !!last; last = Date.now();
      if ((!d || !d.ok) && quiet) return;
      if (!d || !d.ok) { box.innerHTML = '<p class="src">Could not load the leaderboard. Try again later.' + (d && d.error ? " (" + esc(d.error) + ")" : "") + "</p>"; return; }
      var papers = JSON.parse(JSON.stringify(d.papers || {})), pend = store.get("sina:lbPending", null);
      /* your own score shows straight away, before the Sheet answers */
      if (pend && Date.now() - pend.t < 5 * 6e4) {
        var lst = papers[pend.paper] = papers[pend.paper] || [], mine = lst.filter(function (r) { return String(r.nick).toLowerCase() === pend.nick.toLowerCase(); })[0];
        if (!mine || mine.score / mine.total < pend.score / pend.total) { if (mine) lst.splice(lst.indexOf(mine), 1); lst.push({ nick: pend.nick, paper: pend.paper, score: pend.score, total: pend.total, secs: pend.secs }); lst.sort(function (a, b) { return b.score / b.total - a.score / a.total || a.secs - b.secs; }); }
        else if (mine && Math.abs(mine.score - pend.score) < 0.01) store.del("sina:lbPending");
      }
      var ids = Object.keys(papers).filter(function (id) { return (S.papers || []).some(function (x) { return x.id === id; }); });
      var me = (store.get("sina:nick", "") || "").toLowerCase(), title = function (id) { var x = (S.papers || []).filter(function (y) { return y.id === id; })[0]; return x ? x.title : id; };
      var overall = {};
      ids.forEach(function (id) { papers[id].forEach(function (r) { var k = String(r.nick).toLowerCase(), o = overall[k] = overall[k] || { nick: r.nick, score: 0, total: 0, n: 0, secs: 0 }; o.score += +r.score; o.total += +r.total; o.n++; o.secs += +r.secs; }); });
      if (cur === null || (cur !== "all" && !papers[cur])) cur = sel && papers[sel] ? sel : "all";
      function rows() {
        var list = cur === "all" ? Object.keys(overall).map(function (k) { return overall[k]; }).sort(function (a, b) { return b.score - a.score || a.secs - b.secs; }) : papers[cur];
        if (!list || !list.length) return '<p class="src">No scores yet. Do a past paper in Exam mode and post your score.</p>';
        var top = Math.max.apply(null, list.map(function (r) { return cur === "all" ? r.score : r.score / r.total; })) || 1;
        return '<ol class="lb-list">' + list.slice(0, 100).map(function (r, i) {
          var val = cur === "all" ? r.score : r.score / r.total, medal = ["🥇", "🥈", "🥉"][i] || (i + 1);
          var right = cur === "all" ? fmtPts(r.score) + " pts · " + r.n + " paper" + (r.n > 1 ? "s" : "") : fmtPts(r.score) + " / " + r.total + " · " + Math.floor(r.secs / 60) + ":" + ("0" + (r.secs % 60)).slice(-2);
          return '<li class="' + (String(r.nick).toLowerCase() === me ? "me" : "") + '" style="--d:' + (i * 0.04) + 's"><span class="lb-rank">' + medal + '</span><span class="lb-nick">' + esc(r.nick) + '</span><span class="lb-val">' + right + '</span><span class="lb-bar"><i style="--w:' + Math.round(val / top * 100) + '%"></i></span></li>';
        }).join("") + "</ol>";
      }
      function draw() {
        box.innerHTML = '<div class="lb-tabs"><button class="chip' + (cur === "all" ? " on" : "") + '" data-p="all">Overall</button>' + ids.map(function (id) { return '<button class="chip' + (cur === id ? " on" : "") + '" data-p="' + id + '">' + esc(title(id)) + "</button>"; }).join("") + "</div>" +
          '<p class="lb-live"><i></i>Live · refreshes every 15 seconds</p>' + (cur === "all" ? '<p class="src">Overall = sum of best scores across papers.</p>' : '<p class="src"><a href="#/paper/' + cur + '">Do this paper</a></p>') + rows();
        box.classList.toggle("quiet", quiet);
        box.querySelectorAll(".chip").forEach(function (c) { c.onclick = function () { cur = c.getAttribute("data-p"); draw(); }; });
        requestAnimationFrame(function () { box.querySelectorAll(".lb-bar i").forEach(function (i) { i.classList.add("go"); }); });
      }
      draw();
    }
    load(false);
  }

  /* ---------- home: caduceus (two snakes winding around a winged rod) ---------- */
  function caduceusHTML() {
    var f = function (side) {
      var o = "", sx = side === "l" ? -1 : 1;
      for (var k = 0; k < 7; k++) {
        var L = 150 - k * 11, w = 13 - k * 0.7, rot = (-14 + k * 11) * (side === "l" ? 1 : -1);
        o += '<path d="M0 0 C' + sx * L * 0.3 + " " + -w + " " + sx * L * 0.8 + " " + -w * 0.9 + " " + sx * L + " 0 C" + sx * L * 0.8 + " " + w * 0.6 + " " + sx * L * 0.3 + " " + w * 0.8 + ' 0 0 Z" transform="rotate(' + rot + ')" opacity="' + (1 - k * 0.07).toFixed(2) + '"/>';
      }
      return o;
    };
    return '<div class="hero-art" aria-hidden="true"><svg class="cad-wings" viewBox="0 0 340 150"><g transform="translate(170 52)"><g class="cw l">' + f("l") + '</g><g class="cw r">' + f("r") + '</g></g></svg><canvas id="cad" width="440" height="720"></canvas></div>';
  }
  function startCaduceus(cv, opt) {
    if (!cv) return; opt = opt || {};
    /* wings: each feather is redrawn every frame. The wing rotates up and down around the shoulder
       (fast downstroke, slower upstroke), feathers fan out on the way down and fold on the way up,
       and the tips lag behind the shoulder, so it reads as a flap rather than a bounce. */
    var wsvg = cv.parentNode && cv.parentNode.querySelector(".cad-wings"), feathers = wsvg ? [].slice.call(wsvg.querySelectorAll(".cw path")) : [];
    function drawWings(ph) {
      if (!feathers.length) return;
      var T = 2.4, p = ((ph / T) % 1 + 1) % 1, f, lag;
      f = p < 0.38 ? Math.cos(Math.PI * p / 0.38) : -Math.cos(Math.PI * (p - 0.38) / 0.62);   /* 1 = top, -1 = bottom */
      var q = ((ph / T - 0.05) % 1 + 1) % 1; lag = q < 0.38 ? Math.cos(Math.PI * q / 0.38) : -Math.cos(Math.PI * (q - 0.38) / 0.62);
      if (reduce) { f = 0.2; lag = 0.2; }
      var spread = 0.98 - 0.22 * f;
      feathers.forEach(function (el, idx) {
        var side = idx < 7 ? -1 : 1, k = idx % 7;
        var base = (-16 + k * 10.5) * spread, flap = 30 * f * (0.55 + 0.45 * k / 6) + 10 * lag * (k / 6);
        var a = (base + flap) * Math.PI / 180, L = (150 - k * 11) * (0.9 + 0.1 * Math.abs(Math.cos(a))), w = 13 - k * 0.7;
        var ux = Math.cos(a) * side, uy = -Math.sin(a), nx = -uy, ny = ux, bend = -6 * lag * (k / 6) * side;
        function P(x, y) { return (ux * x + nx * y).toFixed(1) + " " + (uy * x + ny * y).toFixed(1); }
        el.setAttribute("d", "M0 0 C" + P(L * 0.3, -w * side) + " " + P(L * 0.8, -w * 0.9 * side + bend) + " " + P(L, bend * 1.4) + " C" + P(L * 0.8, w * 0.6 * side + bend) + " " + P(L * 0.3, w * 0.8 * side) + " 0 0 Z");
        el.removeAttribute("transform");
      });
    }
    var c = cv.getContext("2d"), W = cv.width, H = cv.height, t0 = performance.now(), ph0 = 0, lastT = 0, spd = 1;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var cs = getComputedStyle(document.documentElement), v = function (n) { return cs.getPropertyValue(n).trim(); };
    function frame(now) {
      if (!cv.isConnected) return;
      cs = getComputedStyle(document.documentElement);
      var t = (now - t0) / 1000, g = opt.grow ? Math.max(0, Math.min(1, (t - (opt.delay || 0)) / opt.grow)) : 1, cx = W / 2, top = H * 0.1, bot = H * 0.96, amp = W * 0.2, turns = 3.1, segs = 160;
      spd += ((cv.dataset.fast ? 3 : 1) - spd) * 0.06; ph0 += (t - lastT) * spd; lastT = t;
      drawWings(ph0);
      var rod = v("--muted"), col = [v("--accent"), v("--snake2") || v("--sage")];
      c.clearRect(0, 0, W, H);
      var bodies = [];
      for (var s = 0; s < 2; s++) {
        var pts = [], ph = (reduce ? 0 : ph0 * 1.6) + s * Math.PI;
        var gs = Math.max(6, Math.round(segs * (opt.grow > 1.5 ? g * (2 - g) * 0.35 + g * 0.65 : 1 - Math.pow(1 - g, 3))));
        for (var i = 0; i <= gs; i++) {
          var u = i / segs, y = bot - u * (bot - top) * 0.92, a = u * turns * 2 * Math.PI - ph * 0.35;
          var taper = u < 0.12 ? u / 0.12 : 1, tail = 1 - Math.pow(1 - u, 3);
          pts.push({ x: cx + Math.sin(a) * amp * (0.55 + 0.45 * tail), y: y, z: Math.cos(a), w: W * 0.05 * (0.35 + 0.65 * taper) * (u > 0.94 ? 1.15 : 1) });
        }
        bodies.push({ pts: pts, col: col[s] });
      }
      var seg = function (p, q, colr, back) { c.strokeStyle = colr; c.globalAlpha = back ? 0.5 : 1; c.lineWidth = (p.w + q.w) / 2; c.lineCap = "round"; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(q.x, q.y); c.stroke(); c.globalAlpha = 1; };
      if (g === 0) bodies = [];
      bodies.forEach(function (b) { for (var i = 1; i < b.pts.length; i++) if (b.pts[i].z < 0) seg(b.pts[i - 1], b.pts[i], b.col, true); });
      c.strokeStyle = rod; c.lineWidth = W * 0.032; c.lineCap = "round"; var rg = opt.grow ? Math.min(1, t / ((opt.delay || 0) + 0.2) ) : 1; c.beginPath(); c.moveTo(cx, H * 0.99); c.lineTo(cx, H * 0.99 - (H * 0.93) * (1 - Math.pow(1 - rg, 2))); c.stroke();
      if (rg >= 1) { c.fillStyle = rod; c.beginPath(); c.arc(cx, H * 0.05, W * 0.035, 0, 7); c.fill(); }
      bodies.forEach(function (b) {
        for (var i = 1; i < b.pts.length; i++) if (b.pts[i].z >= 0) seg(b.pts[i - 1], b.pts[i], b.col, false);
        c.fillStyle = "rgba(255,255,255,.35)";
        for (var k = 8; k < b.pts.length; k += 7) { var p = b.pts[k]; if (p.z > 0.2) { c.beginPath(); c.arc(p.x, p.y, p.w * 0.16, 0, 7); c.fill(); } }
        var h = b.pts[b.pts.length - 1], g = b.pts[b.pts.length - 4];
        c.save(); c.translate(h.x, h.y); c.rotate(Math.atan2(h.y - g.y, h.x - g.x));
        if ((t % 3.2) < 0.45 && !reduce) { var L = W * 0.07 * Math.sin(((t % 3.2) / 0.45) * Math.PI); c.strokeStyle = "#d3243b"; c.lineWidth = W * 0.008; c.beginPath(); c.moveTo(h.w * 0.6, 0); c.lineTo(h.w * 0.6 + L, 0); c.lineTo(h.w * 0.6 + L + 6, -5); c.moveTo(h.w * 0.6 + L, 0); c.lineTo(h.w * 0.6 + L + 6, 5); c.stroke(); }
        c.fillStyle = b.col; c.beginPath(); c.ellipse(0, 0, h.w * 0.95, h.w * 0.62, 0, 0, 7); c.fill();
        c.fillStyle = "#fff"; c.beginPath(); c.arc(h.w * 0.25, -h.w * 0.25, h.w * 0.16, 0, 7); c.fill();
        c.fillStyle = "#111"; c.beginPath(); c.arc(h.w * 0.29, -h.w * 0.25, h.w * 0.08, 0, 7); c.fill();
        c.restore();
      });
      if (!reduce) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* progress ring with a heartbeat trace; the trace pulses once when the ring has filled */
  function heartRing(pct, done) {
    var C = 2 * Math.PI * 42;
    return '<svg class="pring hring' + (done ? " alive" : "") + '" viewBox="0 0 100 100" aria-label="' + pct + '% of midterm questions answered right"><circle class="bg" cx="50" cy="50" r="42"/><circle class="fg" cx="50" cy="50" r="42" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '" data-to="' + (C * (1 - pct / 100)) + '"/>' +
      '<text x="50" y="47">' + pct + '%</text><polyline class="ecg" pathLength="100" points="24,64 38,64 42,58 46,64 50,64 53,50 57,76 61,60 64,64 76,64"/></svg>';
  }
  /* ---------- opening animation ---------- */
  function splash() {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var o = document.createElement("div"); o.className = "splash"; o.setAttribute("aria-hidden", "true");
    o.innerHTML = '<div class="splash-glow"></div><div class="splash-art">' + caduceusHTML().replace('id="cad"', 'id="cad-splash"') + '</div><p class="splash-brand">' + "Sina".split("").map(function (ch, i) { return '<span style="--i:' + i + '">' + ch + "</span>"; }).join("") + '<span class="dot">.</span></p><svg class="splash-ecg" viewBox="0 0 200 30"><polyline pathLength="100" points="0,15 70,15 78,15 84,8 90,15 96,15 101,2 107,28 113,10 118,15 130,15 200,15"/></svg>';
    document.body.appendChild(o); document.documentElement.classList.add("splashing");
    startCaduceus(o.querySelector("canvas"), { grow: 1.3, delay: 0.25 });
    var done = false, end = function () { if (done) return; done = true; o.classList.add("out"); document.documentElement.classList.remove("splashing"); setTimeout(function () { o.remove(); }, 650); };
    o.addEventListener("click", end); setTimeout(end, 2900);
  }

  /* ---------- midterm-week mode: in the last 7 days the midterm card becomes a cram plan ---------- */
  function midDaysLeft(m) {
    if (!m.date) return null;
    var p = m.date.split("-"), d = new Date(+p[0], +p[1] - 1, +p[2]), t = new Date(); t.setHours(0, 0, 0, 0);
    return Math.round((d - t) / 864e5);
  }
  function cramPlan(m, dl) {
    var rt = store.get("sina:right", {}), st = store.get("sina:stats", {}), byL = {}, rows = [], left = 0;
    Object.keys(rt).forEach(function (k) { byL[k] = rt[k]; });
    m.groups.forEach(function (g) { g.items.forEach(function (id) {
      var L = S.lectures[id]; if (!L) return;
      var fig = L.visual && L.visual.figure, total = 0, right = 0;
      (L.mcqs || []).forEach(function (q) { if (q.target && !fig) return; total++; if (rt[qKey(q)]) right++; });
      var s2 = st[id] || [0, 0], acc = s2[0] ? Math.round(s2[1] / s2[0] * 100) : null;
      left += total - right;
      rows.push({ id: id, title: lectureTitle(id) || L.title, total: total, right: right, cov: total ? right / total : 1, acc: acc });
    }); });
    rows.sort(function (a, b) { return a.cov - b.cov || (a.acc === null ? -1 : a.acc) - (b.acc === null ? -1 : b.acc); });
    var perDay = Math.ceil(left / Math.max(dl, 1));
    var tip = dl === 0 ? "Exam day: skim the summaries and high-yield tabs; no new material." :
      dl === 1 ? "Last day: redo your mistakes and do one past paper in Exam mode." :
      left ? "Do about <strong>" + perDay + " questions a day</strong> to cover every midterm question at least once." : "Every midterm question answered right at least once. Keep going with past papers in Exam mode.";
    var openPlan = store.get("sina:cramOpen", false), weak = rows.filter(function (r) { return r.cov < 1; }).slice(0, 2);
    var lead = dl <= 1 ? (dl === 0 ? "Exam day" : "Last day") : left ? "~" + perDay + " questions a day" : "All covered";
    var startWith = weak.length ? "Start with " + weak.map(function (r) { return r.title; }).join(" and ") : "Every lecture covered";
    var mk = mistakeList().length;
    return '<div class="cram-plan' + (openPlan ? " open" : "") + '"><button type="button" class="cram-bar" aria-expanded="' + openPlan + '"><span class="cb-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h3M4 12h3M4 18h3M10 6h10M10 12h7M10 18h9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></span>' +
      '<span class="cb-txt"><span class="cb-t">Cram plan <em>' + lead + '</em></span><span class="cb-s">' + esc(startWith) + '</span></span><svg class="cb-chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<div class="cram-body"><div class="cram-inner"><p class="cram-tip">' + tip + '</p><ol class="cram-list">' + rows.map(function (r) {
        var isWeak = weak.indexOf(r) > -1;
        return '<li' + (isWeak ? ' class="weak"' : "") + '><a href="#/subject/' + (S.lectures[r.id].subject || m.subject) + "/questions/" + r.id + '" title="' + (r.acc !== null ? r.acc + "% accuracy" : "Not started") + '"><span class="cl-t">' + esc(r.title) + '</span><span class="cl-bar"><i style="width:' + Math.round(r.cov * 100) + '%"></i></span><span class="cl-m">' + r.right + "/" + r.total + "</span></a></li>";
      }).join("") + "</ol>" + (mk ? '<a class="cram-redo" href="#/mistakes">Redo my mistakes (' + mk + ") &rarr;</a>" : "") + "</div></div></div>";
  }
  /* ---------- home: midterm countdown (flip) and progress ring ---------- */
  function midStats(m) {
    var ids = [].concat.apply([], m.groups.map(function (g) { return g.items; })), total = 0, rt = store.get("sina:right", {}), done = 0, keys = {};
    ids.forEach(function (id) { var L = S.lectures[id]; if (!L) return; var fig = L.visual && L.visual.figure; (L.mcqs || []).forEach(function (q) { if (q.target && !fig) return; var k = qKey(q); if (!keys[k]) { total++; keys[k] = 1; } }); });
    (S.papers || []).forEach(function (x) { if (midSubs(m).indexOf(x.subject) < 0 || !x.questions) return; x.questions.forEach(function (q) { var k = qKey(q); if (!keys[k]) { total++; keys[k] = 1; } }); });
    Object.keys(rt).forEach(function (k) { if (keys[k]) done++; });
    return { total: total, done: done, pct: !total ? 0 : done && done < total ? Math.min(99, Math.max(1, Math.round(done / total * 100))) : Math.round(done / total * 100) };
  }
  function midWidgets(m) {
    var st = midStats(m), days = null;
    if (m.date) { var p = m.date.split("-"), d = new Date(+p[0], +p[1] - 1, +p[2]), t = new Date(); t.setHours(0, 0, 0, 0); days = Math.round((d - t) / 864e5); }
    return '<div class="mid-side">' + (days !== null && days >= 0 ? '<div class="mid-count-big' + (days === 0 ? " exam-day" : "") + '"><span class="flipnum" data-to="' + days + '">' + Math.min(days + 3, 99) + '</span><span>' + (days === 0 ? "exam today" : days === 1 ? "day left" : "days left") + "</span></div>" : "") +
      '<div class="mid-ring">' + heartRing(st.pct, st.done) + '<span>' + st.done + " of " + st.total + " midterm questions right</span></div></div>";
  }
  function flipCountdowns() {
    app.querySelectorAll(".flipnum").forEach(function (el) {
      var to = +el.getAttribute("data-to"), cur = +el.textContent;
      (function step() { if (cur <= to) { el.textContent = to; return; } cur--; el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); setTimeout(function () { el.textContent = cur; step2(); }, 180); })();
      function step2() { if (cur > to) setTimeout(function () { cur--; el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); setTimeout(function () { el.textContent = cur; step2(); }, 180); }, 260); }
    });
  }

  function rememberPlace() {
    var h = location.hash;
    if (!/^#\/(lecture\/|subject\/[^/]+\/questions\/|paper\/)/.test(h)) return;
    var t = (document.title || "").replace(/\s*\|\s*Sina$/, "");
    if (/^#\/subject\/[^/]+\/questions\/([^/]+)/.test(h)) { var lid = RegExp.$1; t = (S.lectures[lid] ? S.lectures[lid].title : t) + " · questions"; }
    if (t) store.set("sina:last", { h: h, t: t });
  }
  function route() {
    /* never leave the page locked after an overlay (menu, slide viewer, report box, welcome) has gone */
    if (!isOpen() && !svOpen && !document.querySelector(".rdlg") && !document.querySelector("#welcome:not([hidden]):not(.leaving)")) document.body.classList.remove("noscroll");
    setTimeout(function () { rememberPlace(); updateNewsDot(); }, 0);
    var parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    if (parts[0] !== "year") setTimeout(trackView, 0);
    if (isOpen()) closeDrawer();
    closePhoneSearch();
    if (!parts.length) return homeView();
    if (parts[0] === "updates") return updatesView();
    if (parts[0] === "apps") return appsView();
    if (parts[0] === "usmle") return usmleView();
    if (parts[0] === "anking") return ankingView(parts[1]);
    if (parts[0] === "year" && progValid(parts[1])) { setProgram(parts[1], true); location.replace("#/"); return; }
    if (parts[0] === "midterm") return midtermView();
    if (parts[0] === "progress") return progressView();
    if (parts[0] === "account") return accountView();
    if (parts[0] === "mistakes") return mistakesView();
    if (parts[0] === "weak") return weakView(parts[1]);
    if (parts[0] === "review") return reviewView();
    if (parts[0] === "reminders") return remindersView();
    if (parts[0] === "leaderboard") return leaderboardView(parts[1]);
    if (parts[0] === "resume") return resumeView();
    if (parts[0] === "install") return installView();
    if (parts[0] === "find") return findView(parts[1], parts[2], decodeURIComponent(parts[3] || ""));
    if (parts[0] === "practice") return parts[1] ? practiceView(parts[1], parts[2], parts[3]) : practiceHome();
    if (parts[0] === "papers") return papersView(parts[1]);
    if (parts[0] === "paper") return paperView(parts[1]);
    if (parts[0] === "subject") return subjectView(parts[1], parts[2], parts[3]);
    if (parts[0] === "lecture") return lectureView(parts[1], parts[2], parts[3]);
    notFound();
  }

  /* ---------- midterms from the Google Sheet ----------
     The "Midterms" tab of the Sina midterm Sheet decides which exams and lectures are on the midterm.
     Columns: Year | Subject | Exam name | Date | Lecture 1..10 (names as on the "Lectures" tab).
     If the Sheet can't be read, the last copy saved on this device is used, then the list built into the site. */
  var MID_SHEET = "https://docs.google.com/spreadsheets/d/1SOCdnq7AngYmjaqnzrTnwaxqqGTWuttRyAo-uopzIOA/gviz/tq?tqx=out:csv&sheet=Midterms";
  function csvRows(t) {
    var rows = [], row = [], f = "", q = false;
    for (var i = 0; i < t.length; i++) {
      var c = t[i];
      if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
      else if (c === '"') q = true;
      else if (c === ",") { row.push(f); f = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && t[i + 1] === "\n") i++; row.push(f); rows.push(row); row = []; f = ""; }
      else f += c;
    }
    if (f || row.length) { row.push(f); rows.push(row); }
    return rows;
  }
  function norm(x) { return String(x || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
  /* Subject cell can name several subjects ("Physics / Biophysics"). A lecture cell can also be a chapter name
     ("Digestive"), meaning all its lectures. A row with no lecture cells covers the whole subject(s) and is shown
     only while it is the next midterm of its year. Both cases are marked as not announced yet (tbc). */
  function midsFromCsv(text) {
    var rows = csvRows(text), out = [];
    var progOf = { "2nd year anglo": "y2-anglo", "1st year anglo": "y1-anglo" };
    var p2 = function (x) { return ("0" + x).slice(-2); };
    rows.slice(1).forEach(function (r) {
      var prog = progOf[norm(r[0])]; if (!prog) return;
      var sbs = String(r[1] || "").split(/[\/+&,]| and /i).map(norm).filter(Boolean).map(function (nm) {
        return S.subjects.filter(function (x) { return x.program === prog && x.groups && norm(x.name) === nm; })[0];
      }).filter(Boolean);
      if (!sbs.length) return;
      /* a lecture cell can carry the part that is on the exam: "Pituitary semiology: acromegaly, prolactinoma" */
      var want = [], wnote = {}, notes = {}, groups = [];
      r.slice(4).forEach(function (c) { c = String(c || "").trim(); if (!c) return; var k = c.indexOf(":"), t = norm(k > 0 ? c.slice(0, k) : c); want.push(t, norm(c)); /* full title too, for titles that contain a colon */ if (k > 0 && c.slice(k + 1).trim()) wnote[t] = c.slice(k + 1).trim(); });
      sbs.forEach(function (sb) { sb.groups.forEach(function (g) {
        var whole = !want.length || want.indexOf(norm(g.name)) > -1;
        var items = g.items.filter(function (it) { return whole || want.indexOf(norm(it.title)) > -1; }).map(function (it) { if (wnote[norm(it.title)]) notes[it.id] = wnote[norm(it.title)]; return it.id; });
        if (items.length) groups.push({ name: sbs.length > 1 ? sb.name + ": " + g.name : g.name, items: items, tbc: whole });
      }); });
      if (!groups.length) return;
      var raw = (r[3] || "").trim(), dm = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(raw), ym = /^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/.exec(raw);
      var d = ym ? ym[1] + "-" + p2(ym[2]) + "-" + p2(ym[3]) : dm ? dm[3] + "-" + p2(dm[2]) + "-" + p2(dm[1]) : "";
      out.push({ id: sbs.map(function (x) { return x.id; }).join("-") + "-midterm", program: prog, subject: sbs[0].id, subjects: sbs.map(function (x) { return x.id; }),
        title: (r[2] || "").trim() || sbs.map(function (x) { return x.name; }).join(" and ") + " midterm", date: d, groups: groups, notes: notes,
        tbc: groups.every(function (g) { return g.tbc; }), part: groups.some(function (g) { return g.tbc; }) && !groups.every(function (g) { return g.tbc; }), auto: !want.length });
    });
    /* rows without any lecture listed: keep only the next upcoming one of each year */
    var t = today();
    return out.filter(function (m) {
      if (!m.auto) return true;
      var next = out.filter(function (x) { return x.program === m.program && (!x.date || x.date >= t); })
        .sort(function (a, b) { return (a.date || "9") < (b.date || "9") ? -1 : 1; })[0];
      return next === m;
    });
  }
  (function () {
    var cached = store.get("sina:midsheet", null);
    if (cached) S.midterms = cached;
    if (!window.fetch || !/^https?:/.test(location.protocol)) return;
    var ctl = window.AbortController ? new AbortController() : null;
    if (ctl) setTimeout(function () { ctl.abort(); }, 8000);
    fetch(MID_SHEET, { cache: "no-store", signal: ctl ? ctl.signal : undefined }).then(function (r) { return r.ok ? r.text() : ""; }).then(function (t) {
      if (!t || /^\s*</.test(t)) return;  /* not shared publicly: Google returns a sign-in page */
      var m = midsFromCsv(t);
      if (JSON.stringify(m) === JSON.stringify(cached)) return;
      store.set("sina:midsheet", m); S.midterms = m;
      if (typeof renderDrawer === "function") renderDrawer();
      route();
    }).catch(function () {});
  })();
  function midCountdown(m) {
    if (!m.date) return "";
    var p = m.date.split("-"), d = new Date(+p[0], +p[1] - 1, +p[2]), t = new Date(); t.setHours(0, 0, 0, 0);
    var n = Math.round((d - t) / 864e5);
    if (n < 0) return "";
    var when = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
    return '<p class="mid-count"><strong>' + (n === 0 ? "Today" : n === 1 ? "Tomorrow" : "In " + n + " days") + "</strong> &middot; " + esc(when) + "</p>";
  }
  window.addEventListener("hashchange", route);
  route();

  if ("serviceWorker" in navigator && /^https?:/.test(location.protocol)) {
    window.addEventListener("load", function () {
      var hadSW = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.register("sw.js").then(function (reg) {
        setTimeout(remindSync, 3000);
        /* look for a new version when the page comes back to the front, and every 20 minutes */
        document.addEventListener("visibilitychange", function () { if (!document.hidden) reg.update().catch(function () {}); });
        setInterval(function () { reg.update().catch(function () {}); }, 20 * 60 * 1000);
      }).catch(function () {});
      /* a new version took over: offer a refresh (never forced, so a quiz in progress is not lost) */
      navigator.serviceWorker.addEventListener("controllerchange", function () {
        if (!hadSW) { hadSW = true; return; }
        if (document.getElementById("upd-bar")) return;
        var b = document.createElement("div"); b.id = "upd-bar"; b.className = "upd-bar"; b.setAttribute("role", "status");
        b.innerHTML = '<span>Sina was updated.</span><button type="button" class="btn small primary">Refresh</button><button type="button" class="upd-x" aria-label="Later">&times;</button>';
        b.querySelector(".btn").onclick = function () { location.reload(); };
        b.querySelector(".upd-x").onclick = function () { b.remove(); };
        document.body.appendChild(b);
      });
    });
  }
})();
