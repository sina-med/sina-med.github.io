/* Sina remodel: motion layer.
   - Lenis: smooth mouse-wheel scrolling on desktop (touch keeps native scrolling).
   - GSAP: one authored moment, the home hero entrance with an ECG trace drawn under the headline.
   Needs js/vendor/gsap.min.js and js/vendor/lenis.min.js loaded first. Everything here is optional:
   if a library is missing or the visitor prefers reduced motion, the site works exactly as before. */
(function () {
  "use strict";
  var app = document.getElementById("app");
  if (!app) return;
  var REDUCE = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINE = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
  var gsap = window.gsap;

  /* ---------- smooth scrolling ---------- */
  var lenis = null;
  if (!REDUCE && FINE && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.14, wheelMultiplier: 1, smoothWheel: true, syncTouch: false, allowNestedScroll: true, autoRaf: !gsap });
    if (gsap) {
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    window.sinaLenis = lenis;

    /* panels that scroll on their own keep their own wheel */
    var PREVENT = ["#drawer", ".search-results", ".home-results", ".settings-menu", ".prog-menu", "[role=dialog]", ".modal", ".ak-zoom"];
    function markPrevent(root) {
      PREVENT.forEach(function (s) { (root || document).querySelectorAll(s).forEach(function (el) { el.setAttribute("data-lenis-prevent", ""); }); });
    }
    markPrevent();
    new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) for (var j = 0; j < ms[i].addedNodes.length; j++) {
        var n = ms[i].addedNodes[j];
        if (n.nodeType === 1) { if (PREVENT.some(function (s) { return n.matches(s); })) n.setAttribute("data-lenis-prevent", ""); markPrevent(n); }
      }
    }).observe(document.body, { childList: true, subtree: true });

    /* the site locks the page for menus and overlays with body.noscroll or overflow:hidden */
    function syncLock() {
      var locked = document.body.classList.contains("noscroll") || document.body.style.overflow === "hidden";
      if (locked && !lenis.isStopped) lenis.stop(); else if (!locked && lenis.isStopped) lenis.start();
    }
    new MutationObserver(syncLock).observe(document.body, { attributes: true, attributeFilter: ["class", "style"] });
  }

  /* ---------- hero ---------- */
  /* two beats, spaced evenly (peaks at x=87 and x=295, 208 apart, and 208 again across the loop) */
  /* each QRS (+5 −24 +30 −11) returns to the baseline, so the trace ends level with the dot */
  var ECG = "M0 20 H54 l6 -3 l5 3 H76 l4 5 l7 -24 l7 30 l5 -11 H120 q8 -9 16 0 H262 l6 -3 l5 3 H284 l4 5 l7 -24 l7 30 l5 -11 H328 q8 -9 16 0 H416";
  var PEAKS_X = [87, 295];
  var SWEEP = 2.2; /* seconds for one pass: a beat every 1.1 s, about 55 a minute */
  var seenHero = false;
  try { seenHero = sessionStorage.getItem("sina:heroSeen") === "1"; } catch (e) {}

  /* ---------- live monitor: a blip runs along the trace and each spike beats ---------- */
  function startPulse(ecg) {
    if (REDUCE || !gsap || !ecg || ecg._pulse) return;
    var blip = ecg.querySelector(".ecg-blip"), dot = ecg.querySelector(".ecg-dot");
    var len = blip.getTotalLength(), seg = 48;
    /* where along the path each spike peaks */
    var peaks = PEAKS_X.map(function (x) {
      for (var l = 0; l <= len; l += 1) if (blip.getPointAtLength(l).x >= x) return l;
      return len;
    });
    blip.style.strokeDasharray = seg + " " + (len + seg);
    var prev = -Infinity;
    ecg._pulse = gsap.fromTo(blip, { strokeDashoffset: seg }, {
      strokeDashoffset: -len,
      duration: SWEEP,
      ease: "none",
      repeat: -1,
      onRepeat: function () { prev = -Infinity; },
      onUpdate: function () {
        if (!blip.isConnected) { this.kill(); return; }
        var head = -Number(gsap.getProperty(blip, "strokeDashoffset")) + seg;
        for (var i = 0; i < peaks.length; i++) if (prev < peaks[i] && head >= peaks[i]) beat();
        prev = head;
      }
    });
    function beat() {
      gsap.fromTo(dot, { scale: 1 }, { scale: 2, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out", transformOrigin: "50% 50%" });
    }
  }

  /* ---------- blood smear: real cell types drifting behind the home hero ----------
     Drawn like a Wright-Giemsa stained smear: mostly erythrocytes and platelets, a few
     leukocytes (neutrophil, eosinophil, basophil, lymphocyte, monocyte) and one myeloblast.
     Each cell is drawn once to an offscreen sprite, then moved; the loop pauses when the
     hero is off screen or the tab is hidden, runs slower on phones, and draws one still
     frame when the visitor prefers reduced motion. */
  var STAIN = {
    rbc: "#dc8f8c", rbcEdge: "#c96f6d", pallor: "#f4d3d0",
    nuc: "#5b3d8c", nucLight: "#7a5aa8", chrom: "#9a82c4", nucleolus: "#c9b9e6",
    neuCyto: "#ecdbe6", neuGran: "#c7a3c3",
    eoGran: "#e2795f", baGran: "#3d2a6e",
    lymCyto: "#a6c8ec", monoCyto: "#c7cfe0", blastCyto: "#8fb1e2", plt: "#8a67b5"
  };
  var rnd = (function (s) { return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })(20261125);
  function blob(x, cx, cy, r, col) { x.fillStyle = col; x.beginPath(); x.arc(cx, cy, r, 0, 6.2832); x.fill(); }
  function granules(x, n, R, rr, col) { x.fillStyle = col; for (var i = 0; i < n; i++) { var a = rnd() * 6.2832, d = Math.sqrt(rnd()) * R; x.beginPath(); x.arc(Math.cos(a) * d, Math.sin(a) * d, rr, 0, 6.2832); x.fill(); } }
  function lobes(x, pts, r) {
    x.strokeStyle = STAIN.nuc; x.lineWidth = r * 0.32; x.lineCap = "round"; x.beginPath();
    pts.forEach(function (p, i) { i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]); }); x.stroke();
    pts.forEach(function (p) { blob(x, p[0], p[1], r, STAIN.nuc); });
  }
  function drawCell(x, type, r) {
    switch (type) {
      case "rbc": {
        var g = x.createRadialGradient(0, 0, r * 0.15, 0, 0, r);
        g.addColorStop(0, STAIN.pallor); g.addColorStop(0.42, STAIN.pallor); g.addColorStop(0.75, STAIN.rbc); g.addColorStop(1, STAIN.rbcEdge);
        x.fillStyle = g; x.beginPath(); x.arc(0, 0, r, 0, 6.2832); x.fill(); break;
      }
      case "plt": {
        x.fillStyle = STAIN.plt; x.beginPath();
        for (var k = 0; k < 7; k++) { var a = k / 7 * 6.2832, d = r * (0.7 + rnd() * 0.4); k ? x.lineTo(Math.cos(a) * d, Math.sin(a) * d) : x.moveTo(Math.cos(a) * d, Math.sin(a) * d); }
        x.closePath(); x.fill(); granules(x, 3, r * 0.45, r * 0.18, STAIN.nuc); break;
      }
      case "neu": {
        blob(x, 0, 0, r, STAIN.neuCyto); granules(x, 60, r * 0.9, r * 0.035, STAIN.neuGran);
        lobes(x, [[-r * 0.48, -r * 0.12], [-r * 0.14, r * 0.28], [r * 0.24, r * 0.12], [r * 0.42, -r * 0.3]], r * 0.24); break;
      }
      case "eo": {
        blob(x, 0, 0, r, "#f1ddd6"); granules(x, 120, r * 0.92, r * 0.06, STAIN.eoGran);
        lobes(x, [[-r * 0.33, r * 0.02], [r * 0.33, -r * 0.04]], r * 0.3); break;
      }
      case "ba": {
        blob(x, 0, 0, r, "#e3d6ea"); lobes(x, [[-r * 0.25, 0], [r * 0.25, 0.05 * r]], r * 0.3);
        granules(x, 55, r * 0.85, r * 0.08, STAIN.baGran); break;
      }
      case "lym": {
        blob(x, 0, 0, r, STAIN.lymCyto); blob(x, r * 0.06, -r * 0.04, r * 0.8, STAIN.nuc);
        x.save(); x.beginPath(); x.arc(r * 0.06, -r * 0.04, r * 0.8, 0, 6.2832); x.clip(); granules(x, 26, r * 0.78, r * 0.07, STAIN.nucLight); x.restore(); break;
      }
      case "mono": {
        blob(x, 0, 0, r, STAIN.monoCyto); granules(x, 40, r * 0.9, r * 0.025, "#b9a7c9");
        x.fillStyle = STAIN.nucLight; x.beginPath(); x.ellipse(0, r * 0.08, r * 0.6, r * 0.42, 0, 0, 6.2832); x.fill();
        blob(x, 0, -r * 0.36, r * 0.27, STAIN.monoCyto); /* the kidney notch */
        [[-r * 0.55, -r * 0.45], [r * 0.6, -r * 0.35], [r * 0.5, r * 0.55], [-r * 0.6, r * 0.5]].forEach(function (p) { blob(x, p[0], p[1], r * 0.08, "rgba(255,255,255,.75)"); });
        break;
      }
      case "blast": {
        blob(x, 0, 0, r, STAIN.blastCyto); blob(x, -r * 0.04, 0, r * 0.82, STAIN.nucLight);
        x.save(); x.beginPath(); x.arc(-r * 0.04, 0, r * 0.82, 0, 6.2832); x.clip(); granules(x, 140, r * 0.8, r * 0.035, STAIN.chrom); x.restore();
        blob(x, -r * 0.25, -r * 0.2, r * 0.11, STAIN.nucleolus); blob(x, r * 0.22, r * 0.12, r * 0.09, STAIN.nucleolus); break;
      }
    }
  }
  function startCells(hero) {
    var cv = document.createElement("canvas");
    cv.className = "hero-cells"; cv.setAttribute("aria-hidden", "true");
    hero.insertBefore(cv, hero.firstChild);
    hero.classList.add("has-cells");
    var ctx = cv.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0;
    var small = window.innerWidth < 600;
    var base = small ? 14 : 20; /* erythrocyte radius in CSS px */
    var plan = small
      ? [["rbc", 14, 1], ["plt", 8, 0.3], ["neu", 1, 1.4], ["lym", 1, 1.05], ["mono", 1, 1.85], ["eo", 1, 1.4], ["blast", 1, 1.75]]
      : [["rbc", 26, 1], ["plt", 14, 0.3], ["neu", 2, 1.4], ["lym", 2, 1.05], ["mono", 1, 1.9], ["eo", 1, 1.4], ["ba", 1, 1.3], ["blast", 1, 1.8]];
    var sprites = {}, cells = [];
    plan.forEach(function (p) {
      var r = base * p[2], size = Math.ceil(r * 2.4 * dpr), oc = document.createElement("canvas");
      oc.width = oc.height = size; var ox = oc.getContext("2d"); ox.translate(size / 2, size / 2); ox.scale(dpr, dpr); drawCell(ox, p[0], r);
      sprites[p[0]] = { c: oc, s: size / dpr };
      for (var i = 0; i < p[1]; i++) cells.push({ t: p[0], x: rnd(), y: rnd() * 0.62, z: 0.6 + rnd() * 0.55, v: 0.1 + rnd() * 0.22, a: rnd() * 6.28, spin: (rnd() - 0.5) * 0.004, bob: rnd() * 6.28, tumble: rnd() * 6.28 });
    });
    cells.sort(function (p, q) { return p.z - q.z; });
    function size() { W = cv.clientWidth; H = cv.clientHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size();
    var ro = window.ResizeObserver ? new ResizeObserver(size) : null; if (ro) ro.observe(cv);
    function frame(step) {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < cells.length; i++) {
        var c = cells[i], sp = sprites[c.t], s = sp.s * c.z;
        c.x += c.v * c.z * step / Math.max(W, 1); if (c.x > 1.08) { c.x = -0.08; c.y = rnd() * 0.62; } /* the upper part of the hero: lower down, the cards cover them */
        c.a += c.spin * step; c.bob += 0.008 * step; c.tumble += 0.006 * step;
        var px = c.x * W, py = c.y * H + Math.sin(c.bob) * 6;
        ctx.save(); ctx.translate(px, py); ctx.rotate(c.a);
        if (c.t === "rbc") ctx.scale(0.8 + 0.2 * Math.cos(c.tumble), 1); /* red cells tumble as they drift */
        ctx.globalAlpha = 0.55 + 0.45 * (c.z - 0.6) / 0.55;
        ctx.drawImage(sp.c, -s / 2, -s / 2, s, s); ctx.restore();
      }
    }
    if (REDUCE) { frame(0); return; }
    var visible = true, last = 0, skip = small ? 2 : 1, n = 0, raf = 0;
    var io = window.IntersectionObserver ? new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible && !raf) raf = requestAnimationFrame(loop); }) : null;
    if (io) io.observe(cv);
    document.addEventListener("visibilitychange", function () { if (!document.hidden && visible && !raf) raf = requestAnimationFrame(loop); });
    function loop(ts) {
      raf = 0;
      if (!cv.isConnected) { if (io) io.disconnect(); if (ro) ro.disconnect(); return; }
      if (!visible || document.hidden) return;
      var dt = last ? Math.min((ts - last) / 16.7, 4) : 1;
      if (++n % skip === 0) { frame(dt * skip); last = ts; } else if (!last) last = ts;
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
  }

  function enhanceHome() {
    var hero = app.querySelector(".hero.slim");
    if (!hero || hero.dataset.enhanced) return;
    hero.dataset.enhanced = "1";
    var h1 = hero.querySelector("h1");
    if (!h1) return;
    try { startCells(hero); } catch (e) { /* the molecule lattice stays as the fallback */ }

    /* the trace under the headline (decorative) */
    var live = !REDUCE && !!gsap;
    var row = '<div class="ecg-row"><svg class="hero-ecg" viewBox="0 0 416 34" preserveAspectRatio="xMinYMid meet" aria-hidden="true" focusable="false"><path class="ecg-base" d="' + ECG + '"/><path class="ecg-blip" d="' + ECG + '"/><circle class="ecg-dot" r="3.2" cx="416" cy="20"/></svg></div>';
    h1.insertAdjacentHTML("afterend", row);
    var ecg = hero.querySelector(".hero-ecg");

    if (!live) return;
    var path = ecg.querySelector(".ecg-base"), dot = ecg.querySelector(".ecg-dot");
    var len = path.getTotalLength();

    if (seenHero) {
      /* coming back home in the same visit: no show, just the trace settling in, then the monitor runs */
      gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.9, ease: "power3.out", onComplete: function () { startPulse(ecg); } });
      return;
    }
    try { sessionStorage.setItem("sina:heroSeen", "1"); } catch (e) {}

    /* split the headline into words, keeping any <em> */
    var words = [];
    (function split(node) {
      [].slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
            var o = document.createElement("span"); o.className = "hw"; o.style.cssText = "display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em;margin-bottom:-.08em";
            var i = document.createElement("span"); i.style.display = "inline-block"; i.textContent = w;
            o.appendChild(i); frag.appendChild(o); words.push(i);
          });
          c.parentNode.replaceChild(frag, c);
        } else if (c.nodeType === 1) split(c);
      });
    })(h1);
    h1.setAttribute("aria-label", h1.textContent.replace(/\s+/g, " ").trim());

    var rest = [].slice.call(hero.querySelectorAll(".home-search, nav.quick, .cl-ban, .mid-card"));
    var art = hero.querySelector(".hero-art");

    var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(words, { yPercent: 105, duration: 1.1, stagger: { each: 0.045, ease: "power1.in" } }, 0.05)
      .fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, 0.35)
      .from(dot, { scale: 0, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(3)" }, 1.6)
      .from(rest, { y: 14, opacity: 0, duration: 0.8, stagger: 0.07, clearProps: "transform,opacity" }, 0.45)
      .call(function () { startPulse(ecg); }, null, 1.9);
    if (art) tl.from(art, { opacity: 0, scale: 0.96, duration: 1.2, clearProps: "transform,opacity" }, 0.2);
  }

  /* the dot on the trace beats once when a quick tile is pressed */
  app.addEventListener("pointerdown", function (e) {
    if (REDUCE || !gsap) return;
    var t = e.target.closest && e.target.closest(".qtile");
    var dot = t && app.querySelector(".hero-ecg .ecg-dot");
    if (dot) gsap.fromTo(dot, { scale: 1 }, { scale: 1.9, duration: 0.14, yoyo: true, repeat: 1, ease: "power2.out", transformOrigin: "50% 50%" });
  });

  /* ---------- each new view ---------- */
  function onView() {
    if (lenis) lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    enhanceHome();
  }
  new MutationObserver(onView).observe(app, { childList: true });
  onView();
})();
