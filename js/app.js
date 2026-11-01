(function () {
  "use strict";
  var S = window.SINA;
  var app = document.getElementById("app");

  /* ---------- helpers ---------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
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
        out.push({ kind: "Question", deep: 1, title: q.q, sub: it.title, href: "#/find/q/" + it.id + "/" + n, hay: q.q + " " + q.options.join(" ") + " " + (q.why || "") + " " + (q.notes || []).join(" ") });
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
  function figQText(q, fig) { return q.target && fig && isBoxFig(fig) && /at the arrow\?$/.test(q.q) ? "Which element belongs in the box marked \u201c?\u201d?" : q.q; }
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
      return s.groups ? '<li><a href="#/subject/' + s.id + '">' + inner + "</a></li>" : '<li><span class="static planned">' + inner + "</span></li>";
    }
    var mids = progMidterms(), midHTML = "";
    mids.forEach(function (m) {
      var n = 0; m.groups.forEach(function (g) { n += g.items.length; });
      var dl = midDaysLeft(m), cram = dl !== null && dl >= 0 && dl <= 7;
      midHTML += '<div class="mid-card' + (cram ? " cram" + (dl <= 1 ? " cram-red" : "") : "") + '"><div class="mid-main"><p class="mid-eyebrow">' + (cram ? (dl === 0 ? "Midterm today" : dl === 1 ? "Midterm tomorrow" : "Midterm week") : "Upcoming") + '</p><h2>' + esc(m.title) + '</h2>' + midCountdown(m) + '<p class="meta">' + (n === 1 ? "1 lecture" : n + " lectures") + ' on this exam.</p><div class="row">' +
        (n === 1 ? '<a class="btn primary" href="#/lecture/' + m.groups[0].items[0] + '">Revise the lecture</a>' : '<a class="btn primary" href="#/midterm">Revise the lectures</a>') + '<a class="btn" href="#/practice/' + m.subject + '/lectures/midterm">Practice questions</a>' +
        ((S.papers || []).some(function (x) { return x.subject === m.subject; }) ? '<a class="btn" href="#/practice/' + m.subject + '/papers">Past papers as quizzes</a>' : "") + "</div></div>" + midWidgets(m) + (cram ? cramPlan(m, dl) : "") + "</div>";
    });
    var html = '<div class="wrap wide"><section class="hero slim"><div class="hero-grid"><div class="hero-text"><p class="hero-brand">Sina<span>.</span></p><h1>Study each lecture, then test yourself on it.</h1>' +
      '<div class="home-search"><input id="home-search" type="search" placeholder="Search a lecture, subject or past paper" aria-label="Search lectures, subjects and past papers" autocomplete="off"><div class="home-results" id="home-results" hidden></div></div></div>' + caduceusHTML() + "</div>" +
      quickTiles() + midHTML + "</section>" +
      '<h2 id="subjects">' + esc(T("home.subjects")) + ' <span class="prog-tag">' + esc(progName()) + '</span></h2>' +
      (semList.length ? semList.map(function (k) { return '<h3 class="sem-title">' + esc(T("home.semester", { n: k.replace(/^S/, "") })) + '</h3><ul class="subject-list">' + sems[k].map(row).join("") + "</ul>"; }).join("")
        : '<div class="empty-prog"><h3>' + esc(T("home.empty.title", { name: progName() })) + '</h3><p>' + esc(T("home.empty.body")) + '</p></div>') +
      "</div>";
    setView(html, "");
    startCaduceus(document.getElementById("cad")); animateRings(); flipCountdowns();
    revealOnScroll(app.querySelectorAll(".subject-list > li, .sem-title"));
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
  function progMidterms() { return (S.midterms || []).filter(function (m) { return (m.program || S.DEFAULT_PROGRAM) === PROG; }); }
  function onMidterm(id) { return (S.midterms || []).some(function (m) { return m.groups.some(function (g) { return g.items.indexOf(id) >= 0; }); }); }
  function lectureTitle(id) {
    var t = "";
    S.subjects.forEach(function (s) { (s.groups || []).forEach(function (g) { g.items.forEach(function (it) { if (it.id === id) t = it.title; }); }); });
    return t || (S.lectures[id] ? S.lectures[id].title : id);
  }
  function midtermView() {
    var ms = progMidterms();
    var html = '<div class="wrap"><p class="crumbs"><a href="#/">Home</a> / Upcoming midterm lectures</p><h1>Upcoming midterm lectures</h1>';
    if (!ms.length) html += "<p>No midterm is listed for this year yet.</p>";
    ms.forEach(function (m) {
      var sb = subjectById(m.subject), n = 0;
      m.groups.forEach(function (g) { n += g.items.length; });
      html += '<section class="midterm"><h2 class="group-title">' + esc(m.title) + '</h2><p class="meta">' + (n === 1 ? "1 lecture" : n + " lectures") + (sb ? ' from <a href="#/subject/' + sb.id + '">' + esc(sb.name) + "</a>" : "") + (n === 1 ? ". Only this lecture is on this midterm.</p>" : ". Only these lectures are on this midterm.</p>") + (m.practice ? '<p><a class="btn primary" href="' + esc(m.practice.url) + '">' + esc(m.practice.label) + "</a></p>" : "");
      m.groups.forEach(function (g) {
        html += '<h3 class="mid-group">' + esc(g.name) + '</h3><ul class="lec-list">' + g.items.map(function (id) {
          return S.lectures[id]
            ? '<li><a href="#/lecture/' + id + '"><span>' + esc(lectureTitle(id)) + '</span><span class="pill mid">On the midterm</span></a></li>'
            : '<li><span class="soon"><span>' + esc(lectureTitle(id)) + '</span><span class="pill muted">Coming</span></span></li>';
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
  function subjectMid(s) { return progMidterms().filter(function (m) { return m.subject === s.id; })[0]; }
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
  function subLecturesPanel(p, s) {
    var mid = subjectMid(s), h = mid ? '<p class="mid-note"><span class="pill mid">Midterm</span> marks the lectures on the ' + esc(mid.title) + '. <a href="#/subject/' + s.id + '/questions/midterm">Practise just those</a>.</p>' : "";
    s.groups.forEach(function (g) {
      h += '<h2 class="group-title">' + esc(g.name) + '</h2><ul class="lec-list">' + g.items.map(function (it) {
        return S.lectures[it.id]
          ? '<li><a href="#/lecture/' + it.id + '"><span>' + esc(it.title) + "</span>" + (onMidterm(it.id) ? '<span class="pill mid">Midterm</span>' : "") + "</a></li>"
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
  function subQuestionsPanel(p, s, arg) {
    var mid = subjectMid(s), lecs = subLectures(s), key = "sina:pick:" + s.id;
    var picked = arg === "midterm" && mid ? [].concat.apply([], mid.groups.map(function (g) { return g.items; }))
      : (arg && S.lectures[arg] ? [arg] : store.get(key, []));
    picked = picked.filter(function (id) { return S.lectures[id] && S.lectures[id].subject === s.id; });
    var count = store.get("sina:qcount", "20");
    function nQ(ids) { return ids.reduce(function (a, id) { return a + (S.lectures[id].mcqs || []).length; }, 0); }
    function picker() {
      var h = '<p class="lede-s">Choose one or more lectures, then start. Questions from all the chosen lectures are mixed into one quiz.</p>' +
        '<div class="chips quick" role="group" aria-label="Quick choices"><button type="button" data-q="all">All lectures</button>' + (mid ? '<button type="button" data-q="mid">Midterm lectures</button>' : "") + '<button type="button" data-q="none">Clear</button></div>';
      s.groups.forEach(function (g, gi) {
        var its = g.items.filter(function (it) { return S.lectures[it.id]; });
        if (!its.length) return;
        h += '<div class="pick-group" role="group" aria-label="' + esc(g.name) + '"><label class="pick-row pick-head"><input type="checkbox" class="gchk" data-g="' + gi + '"><span>' + esc(g.name) + '</span><span class="qn">' + its.length + " lecture" + (its.length > 1 ? "s" : "") + "</span></label>" + its.map(function (it) {
          return '<label class="pick-row"><input type="checkbox" class="lchk" data-g="' + gi + '" value="' + it.id + '"' + (picked.indexOf(it.id) > -1 ? " checked" : "") + "><span>" + esc(it.title) + '</span><span class="qn">' + (S.lectures[it.id].mcqs || []).length + "</span></label>";
        }).join("") + "</div>";
      });
      h += '<div class="start-bar"><label class="pick"><span>Questions</span><select id="qcount">' + ["10", "20", "40", "all"].map(function (v) { return '<option value="' + v + '"' + (v === count ? " selected" : "") + ">" + (v === "all" ? "All" : v) + "</option>"; }).join("") + "</select></label>" +
        '<button class="btn primary" id="qstart" type="button">Start</button><button class="btn" id="qexam" type="button">Exam mode</button><span class="qsel" id="qsel"></span></div>';
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
        var sel = p.querySelector("#qcount"), opts = ["10", "20", "40"].filter(function (v) { return +v < n; }).concat(["all"]);
        var shown = opts.indexOf(count) > -1 ? count : "all";
        sel.innerHTML = opts.map(function (v) { return '<option value="' + v + '"' + (v === shown ? " selected" : "") + ">" + (v === "all" ? "All (" + n + ")" : v) + "</option>"; }).join("");
        p.querySelector("#qstart").disabled = !picked.length; p.querySelector("#qexam").disabled = !picked.length;
      }
      boxes.forEach(function (b) { b.addEventListener("change", sync); });
      p.querySelectorAll(".gchk").forEach(function (g) { g.addEventListener("change", function () { boxes.forEach(function (b) { if (b.dataset.g === g.dataset.g) b.checked = g.checked; }); sync(); }); });
      p.querySelectorAll(".quick button").forEach(function (b) {
        b.addEventListener("click", function () {
          var ids = b.dataset.q === "all" ? lecs.map(function (x) { return x.id; }) : b.dataset.q === "mid" ? [].concat.apply([], mid.groups.map(function (g) { return g.items; })) : [];
          boxes.forEach(function (x) { x.checked = ids.indexOf(x.value) > -1; }); sync();
        });
      });
      p.querySelector("#qcount").addEventListener("change", function () { count = this.value; store.set("sina:qcount", count); });
      p.querySelector("#qstart").addEventListener("click", function () { start(false); });
      p.querySelector("#qexam").addEventListener("click", function () { start(true); });
      sync();
    }
    function start(exam) {
      store.set(key, picked);
      var pool = [];
      picked.forEach(function (id) {
        var L = S.lectures[id], fig = L.visual && L.visual.figure;
        (L.mcqs || []).forEach(function (q) {
          if (q.target && !fig) return;
          var c = {}; for (var k in q) c[k] = q[k];
          c._fig = fig; c._lid = id; c._from = picked.length > 1 ? lectureTitle(id) : ""; pool.push(c);
        });
      });
      pool = shuffle(pool);
      if (count !== "all") pool = pool.slice(0, +count);
      var seenKey = "sina:seen:" + picked.slice().sort().join("+");
      if (store.get(seenKey, false)) pool = pool.map(shuffleQ); else store.set(seenKey, true);
      p.innerHTML = '<div class="quiz-top"><button class="btn small-btn" id="qback" type="button">&larr; Change lectures</button><span class="meta">' + esc(picked.length === 1 ? lectureTitle(picked[0]) : picked.length + " lectures mixed") + '</span></div><div id="quiz"></div>';
      p.querySelector("#qback").addEventListener("click", picker);
      var set = { id: "mix:" + picked.slice().sort().join("+") + ":" + count, mcqs: pool };
      if (exam) examIntro(p.querySelector("#quiz"), set, picker); else questionsPanel(p.querySelector("#quiz"), set);
      window.scrollTo(0, 0);
    }
    picker();
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
  function subPapersPanel(p, s) {
    var list = (S.papers || []).filter(function (x) { return x.subject === s.id; });
    p.innerHTML = '<ul class="lec-list">' + list.map(paperRow).join("") + "</ul>";
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

  function lectureView(id, tab) {
    var lec = S.lectures[id];
    if (!lec) return notFound();
    var sub = subjectById(lec.subject);
    if (MOVED[tab]) { location.replace("#/subject/" + sub.id + "/" + MOVED[tab] + "/" + id); return; }
    tab = tab || "summary";
    if (!TABS.some(function (t) { return t[0] === tab; })) tab = "summary";
    var secs = subSections(sub).map(function (x) { return x[0]; });
    var did = driveId(lec.sourceUrl), ppt = /\.pptx?\b/i.test(lec.sourceFile || ""), who = lecturer(lec);
    var more = [];
    if (did) more.push('<a role="menuitem" href="https://drive.google.com/uc?export=download&amp;id=' + esc(did) + '" target="_blank" rel="noopener">' + ICON.dl + "Download lecture" + (ppt ? " (PowerPoint)" : "") + "</a>");
    more.push('<a role="menuitem" href="#/subject/' + sub.id + "/questions/" + id + '">' + ICON.q + "Practice questions</a>");
    if (secs.indexOf("visual") > -1 && lec.visual) more.push('<a role="menuitem" href="#/subject/' + sub.id + "/visual/" + id + '">' + ICON.v + "Visual</a>");
    if (lec.highYield && lec.highYield.length) more.push('<a role="menuitem" href="#/subject/' + sub.id + "/highyield/" + id + '">' + ICON.hy + "High yield notes</a>");
    if (lec.resources && lec.resources.length) more.push('<a role="menuitem" href="#/subject/' + sub.id + "/resources/" + id + '">' + ICON.r + "Videos and websites</a>");
    var html = '<div class="wrap"><p class="crumbs"><a href="#/">Home</a> / <a href="#/subject/' + sub.id + '">' + esc(sub.name) + "</a></p>" +
      '<div class="lec-head"><h1>' + esc(lec.title) + '</h1><div class="more"><button class="more-btn" id="more-btn" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Lecture options">' + ICON.dots + '</button><div class="more-menu" id="more-menu" role="menu" hidden>' + more.join("") + "</div></div></div>" +
      '<p class="meta lec-meta">' + [who ? esc(who) : "", onMidterm(id) ? '<span class="pill mid">Midterm</span>' : ""].filter(Boolean).join(" &middot; ") + "</p>" +
      '<div class="tabs sticky" role="tablist" aria-label="Lecture sections">' + TABS.map(function (t) {
        return '<button class="tab" role="tab" id="tab-' + t[0] + '" aria-selected="' + (t[0] === tab) + '" data-tab="' + t[0] + '">' + t[1] + "</button>";
      }).join("") + '</div><div id="panel" role="tabpanel" aria-labelledby="tab-' + tab + '"></div>' + prevNextHTML(sub, id) + psaHTML() + "</div>";
    setView(html, lec.title);
    wireTabs(app);
    var panel = document.getElementById("panel");
    ({ summary: summaryPanel, cards: cardsPanel, deeper: deeperPanel })[tab](panel, lec);
    if (tab !== "cards") readingLine(panel);
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
    var h = '<p class="buildnote">' + ICON.info + "Built from the lecture slides. If your professor says otherwise, trust your professor.</p>";
    if (lec.summary.length > 3) h += '<details class="toc"><summary>On this page</summary><ol>' + lec.summary.map(function (s, i) { return '<li><button type="button" data-to="sec-' + i + '">' + esc(s.title) + "</button></li>"; }).join("") + '<li><button type="button" data-to="sec-key">Key points</button></li></ol></details>';
    lec.summary.forEach(function (s, i) { h += '<h2 id="sec-' + i + '">' + esc(s.title) + "</h2>" + s.html; });
    h += "<h2 id='sec-key'>Key points</h2><ul class='exam-list'>" + lec.exam.map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul>";
    h += (lec.sources && lec.sources.length)
      ? '<div class="foot"><p>Facts on this page were checked against these references (last check ' + esc(lec.verified) + "). Student flashcard sets were used only as a secondary consistency check.</p><ul class='sources'>" + lec.sources.map(function (s) { return '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.name) + "</a></li>"; }).join("") + "</ul></div>"
      : '<div class="foot"><p>Built from the lecture slides (last check ' + esc(lec.verified) + "). Outside references will be added with the full version.</p></div>";
    p.innerHTML = h;
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
    if (!id) return who ? '<p class="meta">' + esc(who) + "</p>" : "";
    return '<p class="srcline"><a class="dlbtn" href="https://drive.google.com/uc?export=download&amp;id=' + esc(id) + '" target="_blank" rel="noopener" title="' + esc(lec.sourceFile || "") + '">' +
      '<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/></svg>' +
      "Download lecture" + (ppt ? " (PowerPoint)" : "") + "</a>" + (who ? '<span class="srcwho">' + esc(who) + "</span>" : "") + "</p>";
  }
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

  function visualPanel(p, lec) {
    var v = lec.visual, layer = "walls";
    var hints = { walls: "Tap a wall to see which bones form it.", margins: "Tap a green edge to see which bones form that part of the rim.", openings: "Tap a dark opening to see what passes through it.", landmarks: "Tap a dashed outline to see what it is." };
    if (!v.regions) {
      var h2 = v.model3d ? "<h2 style='margin-top:0'>3D model</h2>" + viewer3dHTML(v.models || v.model3d) : "";
      var gal = galleryHTML(v);
      if (gal) h2 = gal + h2;
      var mmh = mindmapHTML(v.mindmap);
      if (mmh) h2 = mmh + (h2 ? h2.replace("<h2 style='margin-top:0'>", "<h2>").replace('<h2 style="margin-top:0">', "<h2>") : "");
      if (v.figure && photoFor(lec.id)) h2 += "<h2" + (h2 ? "" : " style='margin-top:0'") + ">Labelled picture</h2>" + photoLabelled(lec.id, v.figure);
      if (v.figure) h2 += "<h2" + (h2 ? "" : " style='margin-top:0'") + ">" + (photoFor(lec.id) ? "Schematic" : "Labelled schematic") + "</h2><p>" + esc(v.figure.caption || "Schematic drawn for this site, not to scale.") + '</p><div class="diagram-box">' + figureSVG(v.figure, { uid: "vis" }) + "</div>";
      p.innerHTML = h2 || "<p>No visual for this lecture yet.</p>";
      wireMedia(p); wireGallery(p); wireMindmap(p);
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
  function qKey(q) { var t = (q.q || "") + "|" + (q.options || []).join("|"), h = 5381; for (var i = 0; i < t.length; i++) h = ((h * 33) ^ t.charCodeAt(i)) >>> 0; return h.toString(36); }
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

  function questionsPanel(p, lec) {
    var all = lec.mcqs, qs = all, fullRun = true, i = 0, score = 0, wrong = [], done = [], key = "sina:best:" + lec.id, LET = "abcdefgh", streak = 0;
    function keyText(q) {
      var ans = q.answers || [q.answer];
      return ans.map(function (n) { return LET[n] + ". " + q.options[n]; }).join(" and ");
    }
    function feedback(q, ok, skipped) {
      var head = skipped ? "Skipped." : ok ? "Correct." : "Not quite.";
      var body = q.why ? " " + esc(q.why) : "";
      return '<div class="why"><strong>' + head + "</strong> Correct answer: " + esc(keyText(q)) + "." + body + "</div>" + slidesHTML(q) + '<p class="rep-line"><button type="button" class="linkbtn" id="rep">Report a mistake in this question</button></p>';
    }
    function render() {
      if (i >= qs.length) {
        score = 0; wrong = [];
        qs.forEach(function (q, n) { var d = done[n] || { chosen: [], ok: false }; if (d.ok) score++; else wrong.push({ q: q, n: n + 1, chosen: d.chosen }); });
        var full = fullRun, best = store.get(key, 0);
        if (full && score > best) { best = score; store.set(key, best); }
        var missed = wrong.slice();
        p.innerHTML = scoreRevealHTML(score, qs.length) +
          (full ? "<p>Best score on this device: " + best + " / " + all.length + ".</p>" : "<p>Retry of the questions you missed.</p>") +
          '<div class="row">' + (missed.length ? '<button class="btn primary" id="rev">Show only my wrong answers (' + missed.length + ')</button><button class="btn" id="retry">Retry only these</button>' : '<p class="src">No wrong answers. Well done.</p>') +
          '<button class="btn" id="again">' + (full ? "Try again" : "Back to the full quiz") + '</button></div><div id="review"></div>';
        scoreReveal(p, score, qs.length); streak = 0;
        p.querySelector("#again").onclick = function () { qs = all.map(shuffleQ); fullRun = true; i = 0; score = 0; wrong = []; done = []; render(); };
        if (missed.length) {
          p.querySelector("#retry").onclick = function () { qs = missed.map(function (w) { return shuffleQ(w.q); }); fullRun = false; i = 0; score = 0; wrong = []; done = []; render(); };
          p.querySelector("#rev").onclick = function () {
            var box = p.querySelector("#review");
            if (box.innerHTML) { box.innerHTML = ""; this.textContent = "Show only my wrong answers (" + missed.length + ")"; return; }
            this.textContent = "Hide my wrong answers";
            box.innerHTML = '<h2 class="rev-h">Your wrong answers</h2>' + missed.map(function (w) {
              var q = w.q, ans = q.answers || [q.answer];
              return '<div class="rev-item"><p class="qhead">Question ' + w.n + '</p><p class="qtext">' + esc(figQText(q, q._fig || (lec.visual && lec.visual.figure))) + "</p>" +
                q.options.map(function (o, n) {
                  var cls = ans.indexOf(n) > -1 ? " correct" : (w.chosen.indexOf(n) > -1 ? " wrong" : "");
                  var tag = ans.indexOf(n) > -1 ? '<span class="rev-tag">Correct answer</span>' : (w.chosen.indexOf(n) > -1 ? '<span class="rev-tag">Your answer</span>' : "");
                  return '<div class="opt static' + cls + '"><span class="letter">' + LET[n].toUpperCase() + "</span><span>" + esc(o) + "</span>" + tag + "</div>";
                }).join("") + (q.why ? '<div class="why">' + esc(q.why) + "</div>" : "") + slidesHTML(q) + "</div>";
            }).join("");
            box.scrollIntoView({ behavior: "smooth", block: "start" });
          };
        }
        return;
      }
      var q = qs[i], multi = !!(q.multi || (q.answers && q.answers.length > 1));
      var qfig = q._fig || (lec.visual && lec.visual.figure);
      var qph = q.target ? photoQ(q._lid || lec.id, q.target) : "";
      var pic = qph ? qph : (q.target && qfig)
        ? '<div class="diagram-box qfig">' + figureSVG(qfig, { mode: "quiz", target: q.target, uid: "q" + i }) + "</div>"
        : "";
      p.innerHTML = '<p class="qhead">Question ' + (i + 1) + " of " + qs.length + (multi ? ", " + esc(q.hint || "choose all correct answers") : "") + (q.src ? '<span class="qsrc">' + esc(q.src) + "</span>" : "") + (q._from ? '<span class="qfrom">' + esc(q._from) + "</span>" : "") + flameHTML(streak, false) + '</p><div class="bar-track"><div class="bar-fill" style="width:' + (i / qs.length * 100) + '%"></div></div><p class="qtext">' + esc(figQText(q, qfig)) + "</p>" + pic +
        q.options.map(function (o, n) { return '<button class="opt" data-n="' + n + '" aria-pressed="false"><span class="letter">' + LET[n].toUpperCase() + "</span><span>" + esc(o) + "</span></button>"; }).join("") + (multi ? '<button class="btn primary" id="chk" type="button">Check my answer</button>' : "") + '<div id="fb"></div>' +
        '<div class="qnav"><button class="btn" id="prev" type="button"' + (i ? "" : " disabled") + '>&larr; Previous</button><button class="btn" id="fwd" type="button">' + (i + 1 < qs.length ? "Next" : "Finish") + ' &rarr;</button></div>';
      centerTarget(p);
      var opts = p.querySelectorAll(".opt");
      function finish(chosen, skipped) {
        var ans = q.answers || [q.answer];
        var ok = chosen.length === ans.length && chosen.every(function (n) { return ans.indexOf(n) > -1; });
        var fresh = !done[i];
        if (fresh) {
          done[i] = { chosen: chosen, ok: ok, skipped: !!skipped }; trackAnswer(q, lec.id, ok);
          var was = streak; streak = ok ? streak + 1 : 0;
          var fl = p.querySelector(".streak"); if (fl) fl.outerHTML = flameHTML(streak, streak === 5 || (was >= 5 && !ok), was);
          else if (streak >= 5) p.querySelector(".qhead").insertAdjacentHTML("beforeend", flameHTML(streak, streak === 5));
        }
        opts.forEach(function (x) {
          var n = +x.dataset.n; x.disabled = true; x.classList.remove("picked");
          if (ans.indexOf(n) > -1) x.classList.add("correct"); else if (chosen.indexOf(n) > -1) x.classList.add("wrong");
          if (q.notes && q.notes[n]) x.insertAdjacentHTML("beforeend", '<span class="onote">' + (ans.indexOf(n) > -1 ? "Correct. " : "Wrong. ") + esc(q.notes[n]) + "</span>");
        });
        var c = p.querySelector("#chk"); if (c) c.remove();
        if (fresh && !skipped) answerFx(opts, ans, chosen, ok);
        document.getElementById("fb").innerHTML = feedback(q, ok, skipped);
        p.querySelector("#rep").onclick = function () { reportMistake(q, lec.id); };
        var fw = p.querySelector("#fwd"); fw.classList.add("primary"); fw.innerHTML = (i + 1 < qs.length ? "Next question" : "See score") + " &rarr;";
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
      p.querySelector("#prev").onclick = function () { if (i > 0) { i--; render(); window.scrollTo(0, p.getBoundingClientRect().top + window.scrollY - 120); } };
      p.querySelector("#fwd").onclick = function () {
        if (done[i]) { i++; render(); return; }
        /* moving on without answering: show the answer first (counts as wrong) */
        var picked = []; opts.forEach(function (b) { if (b.getAttribute("aria-pressed") === "true") picked.push(+b.dataset.n); });
        finish(picked, !picked.length);
        document.getElementById("fb").scrollIntoView({ behavior: "smooth", block: "nearest" });
      };
      /* coming back to an answered question: show it as answered */
      if (done[i]) finish(done[i].chosen, done[i].skipped);
    }
    render();
  }

  function cardsPanel(p, lec) {
    var key = "sina:known:" + lec.id, known = store.get(key, []), filter = "all", order = lec.cards.map(function (c) { return c.id; }), pos = 0, shown = false;
    var byId = {}; lec.cards.forEach(function (c) { byId[c.id] = c; });
    function list() { return order.filter(function (id) { return filter === "all" || byId[id].type === filter; }); }
    function render() {
      var L = list();
      if (pos >= L.length) pos = 0;
      var c = byId[L[pos]], nk = L.filter(function (id) { return known.indexOf(id) > -1; }).length;
      var pic = "";
      if (c.type === "image" && photoQ(lec.id, c.target)) pic = photoQ(lec.id, c.target);
      else if (c.type === "image") {
        pic = lec.visual && lec.visual.figure
          ? '<div class="diagram-box">' + figureSVG(lec.visual.figure, { mode: "quiz", target: c.target, uid: "fc" }) + "</div>"
          : '<div class="diagram-box">' + orbitSVG({ mode: "quiz", target: c.target, uid: "fc" }) + "</div>";
      }
      var front = '<div class="kind">' + (c.type === "image" ? "Picture card" : "Text card") + '</div><div class="front">' + esc(c.type === "image" && lec.visual && lec.visual.figure ? figQText({ q: c.front, target: c.target }, lec.visual.figure) : c.front) + "</div>" + pic;
      var kinds = lec.cards.some(function (x) { return x.type === "image"; }) ? [["all", "All"], ["text", "Text"], ["image", "Pictures"]] : [];
      p.innerHTML = '<div class="deck-tools"><div class="chips" role="group" aria-label="Card type">' + kinds.map(function (f) { return '<button data-f="' + f[0] + '" aria-pressed="' + (f[0] === filter) + '">' + f[1] + "</button>"; }).join("") +
        '</div><span class="progress-line">Card ' + (pos + 1) + " of " + L.length + ", " + nk + ' known</span></div>' +
        '<div class="fc-stage"><div class="fcard flip3d' + (shown ? " flipped" : "") + '" aria-live="polite"><div class="fc-face fc-front">' + front + '<p class="fc-tap">Tap to flip</p></div>' +
        '<div class="fc-face fc-back"><div class="kind">Answer</div><div class="front small">' + esc(c.front) + '</div><div class="back"><p>' + esc(c.back) + "</p></div></div></div></div>" +
        '<p class="fc-swipe">Swipe right if you knew it, left if still learning.</p>' +
        '<div class="row" style="margin-top:1rem"><span class="fc-acts"></span><button class="btn" id="shuf">Shuffle</button><button class="btn" id="rst">Reset progress</button></div>';
      centerTarget(p);
      p.querySelectorAll(".chips button").forEach(function (b) { b.onclick = function () { filter = b.dataset.f; pos = 0; shown = false; render(); }; });
      var $ = function (s) { return p.querySelector(s); }, card = $(".fcard"), acts = $(".fc-acts");
      function next(dir, knew) {
        if (knew && known.indexOf(c.id) < 0) { known.push(c.id); store.set(key, known); }
        if (REDUCE) { pos++; shown = false; render(); return; }
        card.style.transition = "transform .32s ease-in, opacity .32s ease-in";
        card.style.transform = "translateX(" + (dir * 120) + "%) rotate(" + (dir * 14) + "deg)" + (shown ? " rotateY(180deg)" : ""); card.style.opacity = "0";
        setTimeout(function () { pos++; shown = false; render(); var nc = p.querySelector(".fcard"); if (nc) nc.classList.add("fc-enter"); }, 300);
      }
      function setActs() {
        acts.innerHTML = shown ? '<button class="btn primary" id="got">I knew it</button><button class="btn" id="again">Still learning</button>' : '<button class="btn primary" id="rev">Show answer</button>';
        if ($("#rev")) $("#rev").onclick = flip;
        if ($("#got")) $("#got").onclick = function () { next(1, true); };
        if ($("#again")) $("#again").onclick = function () { next(-1, false); };
      }
      function flip() { shown = !shown; card.classList.toggle("flipped", shown); setActs(); if (shown) { var g = $("#got"); if (g) g.focus({ preventScroll: true }); } }
      setActs();
      /* tap to flip; swipe right = knew it, left = still learning */
      var sx = 0, sy = 0, dx = 0, drag = false, moved = false;
      card.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; dx = 0; drag = true; moved = false; card.style.transition = "none"; }, { passive: true });
      card.addEventListener("touchmove", function (e) {
        if (!drag) return; dx = e.touches[0].clientX - sx; var dy = e.touches[0].clientY - sy;
        if (!moved && Math.abs(dy) > Math.abs(dx)) { drag = false; card.style.transform = ""; return; }
        if (Math.abs(dx) > 8) moved = true;
        card.style.transform = "translateX(" + dx + "px) rotate(" + (dx / 25) + "deg)" + (shown ? " rotateY(180deg)" : "");
        card.classList.toggle("lean-r", dx > 60); card.classList.toggle("lean-l", dx < -60);
      }, { passive: true });
      card.addEventListener("touchend", function () {
        if (!drag) return; drag = false; card.classList.remove("lean-r", "lean-l");
        if (Math.abs(dx) > 90) { next(dx > 0 ? 1 : -1, dx > 0); return; }
        card.style.transition = ""; card.style.transform = "";
      });
      card.addEventListener("click", function (e) { if (moved) { moved = false; return; } if (e.target.closest("a, button")) return; flip(); });
      $("#shuf").onclick = function () { order = shuffle(order); pos = 0; shown = false; render(); };
      $("#rst").onclick = function () { known = []; store.set(key, known); pos = 0; shown = false; render(); };
    }
    render();
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
      var quiz = papers.filter(function (x) { return x.questions && x.questions.length; }), pdf = papers.filter(function (x) { return !(x.questions && x.questions.length); });
      p.innerHTML = (quiz.length ? '<h2 class="group-title">Past papers as quizzes</h2><ul class="lec-list">' + quiz.map(function (x) {
          return '<li class="paper-row"><a href="#/paper/' + esc(x.id) + '"><span>' + esc(x.title) + (x.year ? " (" + esc(x.year) + ")" : "") + '</span></a><span class="paper-btns"><a class="btn small primary" href="#/paper/' + esc(x.id) + '">Start quiz (' + x.questions.length + ")</a></span></li>";
        }).join("") + "</ul>" : "") +
        (pdf.length ? '<h2 class="group-title">PDF only for now</h2><ul class="lec-list">' + pdf.map(paperRow).join("") + "</ul>" : "");
    } else subQuestionsPanel(p, s, arg);
  }

  function paperRow(x) {
    var quick = (x.links || []).filter(function (l) { return l.short; });
    if (quick.length) {
      return '<li class="paper-row"><a href="#/paper/' + esc(x.id) + '"><span>' + esc(x.title) + (x.year ? " (" + esc(x.year) + ")" : "") + "</span></a>" +
        '<span class="paper-btns">' + (x.questions ? '<a class="btn small primary" href="#/paper/' + esc(x.id) + '">Online quiz</a>' : "") +
        quick.map(function (l) { return '<a class="btn small" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.short) + "</a>"; }).join("") + "</span></li>";
    }
    var tags = [x.questions ? "Quiz" : "", (x.pdf || x.links) ? "PDF" : ""].filter(Boolean).join(" and ");
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
    if (hasQ) html += '<div class="row exam-row"><button class="btn" id="exam-btn" type="button">Exam mode (timed)</button></div>';
    html += '<div id="paperq"></div></div>';
    setView(html, x.title);
    if (hasQ) {
      questionsPanel(document.getElementById("paperq"), { id: x.id, mcqs: x.questions });
      document.getElementById("exam-btn").onclick = function () {
        this.parentNode.hidden = true;
        examIntro(document.getElementById("paperq"), { id: x.id, paper: true, mcqs: x.questions.map(function (q) { var c = {}; for (var k in q) c[k] = q[k]; c._lid = x.id; return c; }) }, function () { paperView(id); });
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
      lb: '<path d="M7 4h10v4a5 5 0 0 1-10 0z" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>'
    };
    var t = function (href, k, title, sub, cls) { return '<a class="qtile' + (cls ? " " + cls : "") + '" href="' + href + '"><span class="qt-ico"><svg viewBox="0 0 24 24" aria-hidden="true">' + ico[k] + '</svg></span><span class="qt-t">' + title + '</span><span class="qt-s">' + sub + "</span></a>"; };
    var h = '<nav class="quick" aria-label="Quick access">';
    if (last && last.h) h += t(last.h, "go", "Continue", esc(last.t), "qt-go");
    h += t("#/mistakes", "redo", "Redo my mistakes", mk ? mk + " question" + (mk > 1 ? "s" : "") + " to redo" : "No mistakes yet", mk ? "qt-hot" : "");
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
    if (!lid || /^mix:|^mistakes/.test(lid)) return;
    var st = store.get("sina:stats", {}), e = st[lid] || (st[lid] = [0, 0]); e[0]++; if (ok) e[1]++; store.set("sina:stats", st);
    var mk = store.get("sina:mistakes", {}); if (ok) delete mk[k]; else mk[k] = { l: lid, t: Date.now() }; store.set("sina:mistakes", mk);
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
      '<div class="prog-card"><b class="big">' + mk + '</b><span>mistakes to redo</span>' + (mk ? '<a class="btn small primary" href="#/mistakes">Redo them</a>' : "") + "</div></div>";
    if (!rows.length) { setView(html + '<p class="empty-note">Nothing yet. Answer some questions and your scores per lecture will appear here.</p></div>', "My progress"); animateRings(); return; }
    var weak = rows.filter(function (r) { return r.n >= 5; }).sort(function (a, b) { return a.pct - b.pct; }).slice(0, 5);
    if (weak.length) html += '<h2>Weakest lectures</h2><p class="meta">Lowest accuracy, at least 5 questions answered.</p>' + barList(weak);
    var subs = {};
    rows.forEach(function (r) { var s = srcSubject(r.lid); (subs[s] = subs[s] || []).push(r); });
    Object.keys(subs).forEach(function (sid) {
      var sb = subjectById(sid); html += "<h2>" + esc(sb ? sb.name : sid) + "</h2>" + barList(subs[sid].sort(function (a, b) { return a.pct - b.pct; }));
    });
    setView(html + '<p class="src" style="margin-top:1.5rem"><button class="btn small" id="prog-reset">Reset my progress</button></p></div>', "My progress");
    animateRings();
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
  function reportMistake(q, src) {
    var ans = q.answers || [q.answer], LT = "ABCDEFGH";
    var txt = "[Sina report] " + srcTitle(q._lid || src) + "\nQ: " + q.q + "\n" + q.options.map(function (o, n) { return LT[n] + ". " + o; }).join("\n") + "\nSite answer: " + ans.map(function (n) { return LT[n]; }).join(", ") + "\nWhat is wrong: ";
    var form = (document.getElementById("suggest-btn") || {}).href;
    if (S.api) {
      var why = prompt("What is wrong with this question? (optional)", "");
      if (why === null) return;
      fetch(S.api, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ type: "report", src: q._lid || src, q: q.q, options: q.options, answer: ans, note: why }) }).then(function () { toast("Thanks, the report was sent."); }, function () { toast("Could not send. Check your connection."); });
      return;
    }
    var done = function () { toast("Question copied. Paste it in the form and say what's wrong.", 4200); if (form && /^https?:/.test(form)) window.open(form, "_blank", "noopener"); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, done); else done();
  }

  /* ---------- exam mode: timer, no feedback until the end ---------- */
  function examPanel(p, set, back) {
    var qs = set.mcqs, n = qs.length, sel = qs.map(function () { return []; }), i = 0, LET = "abcdefgh";
    var secs = n * 60, end = Date.now() + secs * 1000, timer = null, over = false;
    function fmt(s) { s = Math.max(0, Math.round(s)); var m = Math.floor(s / 60); return m + ":" + ("0" + (s % 60)).slice(-2); }
    function multi(q) { return !!(q.multi || (q.answers && q.answers.length > 1)); }
    function render() {
      var q = qs[i], qfig = q._fig, qph = q.target ? photoQ(q._lid || set.id, q.target) : "";
      var pic = qph || (q.target && qfig ? '<div class="diagram-box qfig">' + figureSVG(qfig, { mode: "quiz", target: q.target, uid: "x" + i }) + "</div>" : "");
      p.innerHTML = '<div class="exam-bar"><span class="exam-time" id="xt">' + fmt((end - Date.now()) / 1000) + '</span><span class="meta">Question ' + (i + 1) + " of " + n + (multi(q) ? ", " + esc(q.hint || "choose all correct answers") : "") + '</span><button class="btn small primary" id="xsub">Submit</button></div>' +
        '<div class="exam-grid">' + qs.map(function (_, k) { return '<button class="xg' + (k === i ? " cur" : "") + (sel[k].length ? " done" : "") + '" data-k="' + k + '">' + (k + 1) + "</button>"; }).join("") + "</div>" +
        '<p class="qtext">' + esc(figQText(q, qfig)) + "</p>" + pic +
        q.options.map(function (o, k) { var on = sel[i].indexOf(k) > -1; return '<button class="opt' + (on ? " picked" : "") + '" data-n="' + k + '" aria-pressed="' + on + '"><span class="letter">' + LET[k].toUpperCase() + "</span><span>" + esc(o) + "</span></button>"; }).join("") +
        '<div class="qnav"><button class="btn" id="xp"' + (i ? "" : " disabled") + '>&larr; Previous</button><button class="btn" id="xn">' + (i + 1 < n ? "Next &rarr;" : "Review and submit") + "</button></div>";
      centerTarget(p);
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
      var res = qs.map(function (q, k) { var ans = q.answers || [q.answer], s = sel[k], ok = s.length === ans.length && s.every(function (x) { return ans.indexOf(x) > -1; }); if (ok) score++; trackAnswer(q, set.id, ok); return ok; });
      var pct = Math.round(score / n * 100);
      p.innerHTML = '<div class="exam-result"><p class="meta">' + (auto ? "Time is up." : "Exam submitted.") + " Time used: " + fmt(used) + '</p>' + scoreRevealHTML(score, n) +
        '<div class="row"><button class="btn primary" id="xr-wrong">Show wrong answers (' + (n - score) + ')</button><button class="btn" id="xr-all">Show all answers</button>' + (back ? '<button class="btn" id="xr-back">Back</button>' : "") + '</div>' + (S.api && set.paper ? lbPostHTML() : "") + '</div><div id="xrev"></div>';
      if (S.api && set.paper) lbPostWire(p, set.id, score, n, Math.round(used));
      scoreReveal(p, score, n);
      function review(onlyWrong) {
        p.querySelector("#xrev").innerHTML = qs.map(function (q, k) {
          if (onlyWrong && res[k]) return "";
          var ans = q.answers || [q.answer], s = sel[k];
          return '<div class="rev-item"><p class="qhead">Question ' + (k + 1) + (s.length ? "" : " · not answered") + '</p><p class="qtext">' + esc(figQText(q, q._fig)) + "</p>" +
            q.options.map(function (o, m) { var cls = ans.indexOf(m) > -1 ? " correct" : (s.indexOf(m) > -1 ? " wrong" : ""), tag = ans.indexOf(m) > -1 ? '<span class="rev-tag">Correct answer</span>' : (s.indexOf(m) > -1 ? '<span class="rev-tag">Your answer</span>' : "");
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
    tabs.insertAdjacentHTML("beforeend", '<svg class="read-ecg" viewBox="0 0 496 12" preserveAspectRatio="none" aria-hidden="true"><polyline class="re-bg" points="' + pts.join(" ") + '"/><polyline class="re-fg" pathLength="100" points="' + pts.join(" ") + '"/></svg>');
    var fg = tabs.querySelector(".re-fg"), ticking = false;
    function upd() {
      ticking = false;
      if (!panel.isConnected) { window.removeEventListener("scroll", onScroll); return; }
      var r = panel.getBoundingClientRect(), vh = window.innerHeight, total = r.height - vh * 0.6;
      var p = total > 0 ? Math.min(1, Math.max(0, (-r.top + vh * 0.25) / total)) : 1;
      fg.style.strokeDashoffset = (100 - p * 100).toFixed(1);
      tabs.classList.toggle("read-done", p >= 0.995);
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }
    window.addEventListener("scroll", onScroll, { passive: true }); upd();
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
    return '<div class="score-reveal"><svg class="pring big" viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="42"/><circle class="fg" cx="50" cy="50" r="42" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '" data-to="' + (C * (1 - pct / 100)) + '"/><text x="50" y="57" class="sr-pct">' + (REDUCE ? pct : 0) + '%</text></svg><div class="score"><span class="sr-n">' + (REDUCE ? score : 0) + "</span> / " + n + "</div></div>";
  }
  function scoreReveal(p, score, n) {
    var ring = p.querySelector(".score-reveal .fg"), num = p.querySelector(".sr-n"), pc = p.querySelector(".sr-pct"), pct = n ? Math.round(score / n * 100) : 0;
    requestAnimationFrame(function () { if (ring) ring.style.strokeDashoffset = ring.getAttribute("data-to"); });
    if (REDUCE) return;
    var t0 = performance.now(), dur = 1300;
    (function step(now) {
      var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      if (num) num.textContent = Math.round(score * e); if (pc) pc.textContent = Math.round(pct * e) + "%";
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
    if (REDUCE || !("IntersectionObserver" in window) || !els.length) return;
    var io = new IntersectionObserver(function (entries) {
      var k = 0;
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.style.setProperty("--rd", (k++ * 0.06) + "s"); en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
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
      fetch(S.api, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ type: "score", nick: nick, device: lbDevice(), paper: paper, score: score, total: total, secs: secs }) })
        .then(function () { msg.innerHTML = 'Posted. <a href="#/leaderboard/' + paper + '">See the leaderboard</a>'; sessionStorage.removeItem("sina:lb"); }, function () { b.disabled = false; msg.textContent = "Could not send. Check your connection."; });
    };
  }
  function lbFetch(cb) {
    try { var c = JSON.parse(sessionStorage.getItem("sina:lb") || "null"); if (c && Date.now() - c.t < 6e4) return cb(c.d); } catch (e) {}
    var save = function (d) { if (d && d.ok) { try { sessionStorage.setItem("sina:lb", JSON.stringify({ t: Date.now(), d: d })); } catch (e) {} } cb(d); };
    /* JSONP: works with Apps Script whatever its CORS behaviour */
    var name = "sinaLb" + Date.now(), sc = document.createElement("script"), done = false;
    var fin = function (d) { if (done) return; done = true; try { delete window[name]; } catch (e) { window[name] = undefined; } sc.remove(); save(d); };
    window[name] = fin;
    sc.src = S.api + (S.api.indexOf("?") > -1 ? "&" : "?") + "callback=" + name;
    sc.onerror = function () { fin(null); };
    setTimeout(function () { fin(null); }, 15000);
    document.head.appendChild(sc);
  }
  function leaderboardView(sel) {
    if (!S.api) return notFound();
    setView('<div class="wrap"><p class="crumbs"><a href="#/">Home</a> / Leaderboard</p><h1>Leaderboard</h1><p class="meta">Best exam-mode score per nickname on each past paper. Ties go to the faster time.</p><div id="lb"><div class="loading-row">' + snakeLoader() + '<span>Loading the leaderboard…</span></div></div></div>', "Leaderboard");
    lbFetch(function (d) {
      var box = document.getElementById("lb"); if (!box) return;
      if (!d || !d.ok) { box.innerHTML = '<p class="src">Could not load the leaderboard. Try again later.' + (d && d.error ? " (" + esc(d.error) + ")" : "") + "</p>"; return; }
      var papers = d.papers || {}, ids = Object.keys(papers).filter(function (id) { return (S.papers || []).some(function (x) { return x.id === id; }); });
      var me = (store.get("sina:nick", "") || "").toLowerCase(), title = function (id) { var x = (S.papers || []).filter(function (y) { return y.id === id; })[0]; return x ? x.title : id; };
      var overall = {};
      ids.forEach(function (id) { papers[id].forEach(function (r) { var k = String(r.nick).toLowerCase(), o = overall[k] = overall[k] || { nick: r.nick, score: 0, total: 0, n: 0, secs: 0 }; o.score += +r.score; o.total += +r.total; o.n++; o.secs += +r.secs; }); });
      var cur = sel && papers[sel] ? sel : "all";
      function rows() {
        var list = cur === "all" ? Object.keys(overall).map(function (k) { return overall[k]; }).sort(function (a, b) { return b.score - a.score || a.secs - b.secs; }) : papers[cur];
        if (!list || !list.length) return '<p class="src">No scores yet. Do a past paper in Exam mode and post your score.</p>';
        var top = Math.max.apply(null, list.map(function (r) { return cur === "all" ? r.score : r.score / r.total; })) || 1;
        return '<ol class="lb-list">' + list.slice(0, 100).map(function (r, i) {
          var val = cur === "all" ? r.score : r.score / r.total, medal = ["🥇", "🥈", "🥉"][i] || (i + 1);
          var right = cur === "all" ? r.score + " pts · " + r.n + " paper" + (r.n > 1 ? "s" : "") : r.score + " / " + r.total + " · " + Math.floor(r.secs / 60) + ":" + ("0" + (r.secs % 60)).slice(-2);
          return '<li class="' + (String(r.nick).toLowerCase() === me ? "me" : "") + '" style="--d:' + (i * 0.04) + 's"><span class="lb-rank">' + medal + '</span><span class="lb-nick">' + esc(r.nick) + '</span><span class="lb-val">' + right + '</span><span class="lb-bar"><i style="--w:' + Math.round(val / top * 100) + '%"></i></span></li>';
        }).join("") + "</ol>";
      }
      function draw() {
        box.innerHTML = '<div class="lb-tabs"><button class="chip' + (cur === "all" ? " on" : "") + '" data-p="all">Overall</button>' + ids.map(function (id) { return '<button class="chip' + (cur === id ? " on" : "") + '" data-p="' + id + '">' + esc(title(id)) + "</button>"; }).join("") + "</div>" +
          (cur === "all" ? '<p class="src">Overall = sum of best scores across papers.</p>' : '<p class="src"><a href="#/paper/' + cur + '">Do this paper</a></p>') + rows();
        box.querySelectorAll(".chip").forEach(function (c) { c.onclick = function () { cur = c.getAttribute("data-p"); draw(); }; });
        requestAnimationFrame(function () { box.querySelectorAll(".lb-bar i").forEach(function (i) { i.classList.add("go"); }); });
      }
      draw();
    });
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
    var c = cv.getContext("2d"), W = cv.width, H = cv.height, t0 = performance.now(), ph0 = 0, lastT = 0, spd = 1;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var cs = getComputedStyle(document.documentElement), v = function (n) { return cs.getPropertyValue(n).trim(); };
    function frame(now) {
      if (!cv.isConnected) return;
      cs = getComputedStyle(document.documentElement);
      var t = (now - t0) / 1000, g = opt.grow ? Math.max(0, Math.min(1, (t - (opt.delay || 0)) / opt.grow)) : 1, cx = W / 2, top = H * 0.1, bot = H * 0.96, amp = W * 0.2, turns = 3.1, segs = 160;
      spd += ((cv.dataset.fast ? 2.6 : 1) - spd) * 0.06; ph0 += (t - lastT) * spd; lastT = t;
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
        return '<li' + (isWeak ? ' class="weak"' : "") + '><a href="#/subject/' + m.subject + "/questions/" + r.id + '" title="' + (r.acc !== null ? r.acc + "% accuracy" : "Not started") + '"><span class="cl-t">' + esc(r.title) + '</span><span class="cl-bar"><i style="width:' + Math.round(r.cov * 100) + '%"></i></span><span class="cl-m">' + r.right + "/" + r.total + "</span></a></li>";
      }).join("") + "</ol>" + (mk ? '<a class="cram-redo" href="#/mistakes">Redo my mistakes (' + mk + ") &rarr;</a>" : "") + "</div></div></div>";
  }
  /* ---------- home: midterm countdown (flip) and progress ring ---------- */
  function midStats(m) {
    var ids = [].concat.apply([], m.groups.map(function (g) { return g.items; })), total = 0, rt = store.get("sina:right", {}), done = 0, keys = {};
    ids.forEach(function (id) { var L = S.lectures[id]; if (!L) return; var fig = L.visual && L.visual.figure; (L.mcqs || []).forEach(function (q) { if (q.target && !fig) return; var k = qKey(q); if (!keys[k]) { total++; keys[k] = 1; } }); });
    (S.papers || []).forEach(function (x) { if (x.subject !== m.subject || !x.questions) return; x.questions.forEach(function (q) { var k = qKey(q); if (!keys[k]) { total++; keys[k] = 1; } }); });
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
    setTimeout(function () { rememberPlace(); updateNewsDot(); }, 0);
    var parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    if (parts[0] !== "year") setTimeout(trackView, 0);
    if (isOpen()) closeDrawer();
    closePhoneSearch();
    if (!parts.length) return homeView();
    if (parts[0] === "updates") return updatesView();
    if (parts[0] === "apps") return appsView();
    if (parts[0] === "usmle") return usmleView();
    if (parts[0] === "year" && progValid(parts[1])) { setProgram(parts[1], true); location.replace("#/"); return; }
    if (parts[0] === "midterm") return midtermView();
    if (parts[0] === "progress") return progressView();
    if (parts[0] === "mistakes") return mistakesView();
    if (parts[0] === "leaderboard") return leaderboardView(parts[1]);
    if (parts[0] === "find") return findView(parts[1], parts[2], decodeURIComponent(parts[3] || ""));
    if (parts[0] === "practice") return parts[1] ? practiceView(parts[1], parts[2], parts[3]) : practiceHome();
    if (parts[0] === "papers") return papersView(parts[1]);
    if (parts[0] === "paper") return paperView(parts[1]);
    if (parts[0] === "subject") return subjectView(parts[1], parts[2], parts[3]);
    if (parts[0] === "lecture") return lectureView(parts[1], parts[2]);
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
  function midsFromCsv(text) {
    var rows = csvRows(text), out = [];
    var progOf = { "2nd year anglo": "y2-anglo", "1st year anglo": "y1-anglo" };
    rows.slice(1).forEach(function (r) {
      var prog = progOf[norm(r[0])], sb = S.subjects.filter(function (x) { return x.program === prog && norm(x.name) === norm(r[1]); })[0];
      if (!prog || !sb || !sb.groups) return;
      var want = r.slice(4).map(norm).filter(Boolean), groups = [];
      sb.groups.forEach(function (g) {
        var items = g.items.filter(function (it) { return want.indexOf(norm(it.title)) > -1; }).map(function (it) { return it.id; });
        if (items.length) groups.push({ name: g.name, items: items });
      });
      if (!groups.length) return;
      var raw = (r[3] || "").trim(), dm = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(raw), ym = /^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/.exec(raw);
      var p2 = function (x) { return ("0" + x).slice(-2); };
      var d = ym ? ym[1] + "-" + p2(ym[2]) + "-" + p2(ym[3]) : dm ? dm[3] + "-" + p2(dm[2]) + "-" + p2(dm[1]) : "";
      out.push({ id: sb.id + "-midterm", program: prog, subject: sb.id, title: (r[2] || "").trim() || sb.name + " midterm", date: d, groups: groups });
    });
    return out;
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
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
})();
