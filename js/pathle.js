/* Clinidle slide game: one real photomicrograph a day, guess the pathology. Same rules as the patient game: a fixed list with autocomplete,
   a new clue after each wrong guess, 1 / 0.75 / 0.5 / 0.25 points, nothing after the fifth.
   SinaPathle.play(box, case, opts). opts: title, list [[name, synonyms, organ]], load() -> state, save(state), done({score, tries}), end(element). */
(function () {
  var PTS = [1, 0.75, 0.5, 0.25, 0];
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim(); }
  function fmt(x) { return String(Math.round(x * 100) / 100); }

  function clues(C) {
    var a = [], im = C.images;
    a.push({ img: im[0], t: "" });
    a.push({ t: "Stain: " + C.stain + ". " + im[0].mag + "." });
    a.push({ t: C.hist });
    if (im[1]) a.push({ img: im[1], t: "Second field, " + im[1].mag.toLowerCase() + "." }, { t: "Look at: " + C.look + " Organ: " + C.organ + "." });
    else a.push({ t: "Look at: " + C.look }, { t: "Organ: " + C.organ + "." });
    return a;
  }

  function play(box, C, o) {
    var L = o.list, K = clues(C), S = o.load && o.load();
    if (!S || !S.tries) S = { tries: [], solved: false, out: false };
    var ui = { q: "", pick: null, active: 0, msg: "", fresh: false };
    function save() { if (o.save) o.save(S); }
    function pts() { return S.solved ? PTS[Math.min(S.tries.length - 1, 4)] : 0; }
    function finished() { return S.solved || S.out; }

    function matches(q) {
      var n = norm(q); if (!n) return [];
      var out = [];
      L.forEach(function (e) {
        var best = -1, via = "";
        [e[0]].concat(e[1]).forEach(function (nm, i) {
          var m = norm(nm), sc = m.indexOf(n) === 0 ? 4 : (" " + m).indexOf(" " + n) > -1 ? 3 : m.indexOf(n) > -1 ? 2 : -1;
          if (sc > best) { best = sc; via = i ? nm : ""; }
        });
        if (best > -1) out.push({ e: e, sc: best, via: via });
      });
      return out.sort(function (a, b) { return b.sc - a.sc || a.e[0].localeCompare(b.e[0]); }).slice(0, 8);
    }

    function slideHTML(im, big) {
      return '<figure class="pl-fig"><div class="pl-field" data-big="' + (big ? 1 : 0) + '" tabindex="0" aria-label="Microscope slide. Drag to move, scroll or use the buttons to zoom."><img src="' + esc(im.src) + '" alt="Photomicrograph" draggable="false"></div>' +
        '<div class="pl-zoom"><button type="button" data-z="-1" aria-label="Zoom out">−</button><button type="button" data-z="0" aria-label="Reset">Reset</button><button type="button" data-z="1" aria-label="Zoom in">+</button></div></figure>';
    }
    function bindField(root) {
      root.querySelectorAll(".pl-fig").forEach(function (fig) {
        var f = fig.querySelector(".pl-field"), img = f.querySelector("img"), s = 1, x = 0, y = 0, d = null;
        function lim() { var w = f.clientWidth, h = f.clientHeight, mx = Math.max(0, (img.offsetWidth * s - w) / 2), my = Math.max(0, (img.offsetHeight * s - h) / 2); x = Math.max(-mx, Math.min(mx, x)); y = Math.max(-my, Math.min(my, y)); }
        function ap() { lim(); img.style.transform = "translate(" + x + "px," + y + "px) scale(" + s + ")"; }
        function zoom(k) { s = k === 0 ? 1 : Math.max(1, Math.min(5, s * (k > 0 ? 1.35 : 1 / 1.35))); if (s === 1) { x = 0; y = 0; } ap(); }
        f.addEventListener("pointerdown", function (e) { d = { px: e.clientX, py: e.clientY, x: x, y: y }; f.setPointerCapture(e.pointerId); f.classList.add("drag"); });
        f.addEventListener("pointermove", function (e) { if (d) { x = d.x + e.clientX - d.px; y = d.y + e.clientY - d.py; ap(); } });
        function up() { d = null; f.classList.remove("drag"); }
        f.addEventListener("pointerup", up); f.addEventListener("pointercancel", up);
        f.addEventListener("wheel", function (e) { e.preventDefault(); zoom(e.deltaY < 0 ? 1 : -1); }, { passive: false });
        f.addEventListener("keydown", function (e) { var st = 24; if (e.key === "+" || e.key === "=") zoom(1); else if (e.key === "-") zoom(-1); else if (e.key === "ArrowLeft") x += st; else if (e.key === "ArrowRight") x -= st; else if (e.key === "ArrowUp") y += st; else if (e.key === "ArrowDown") y -= st; else return; e.preventDefault(); ap(); });
        fig.querySelectorAll("[data-z]").forEach(function (b) { b.onclick = function () { zoom(+b.dataset.z); }; });
      });
    }

    function head() { return '<div class="wl-top"><h1 class="wl-name">' + esc(o.title || "Clinidle slide") + '</h1><span class="wl-pts">' + fmt(pts()) + " pts</span></div>"; }
    function listHTML() {
      var m = matches(ui.q);
      return m.length ? m.map(function (r, k) { var used = S.tries.indexOf(r.e[0]) > -1; return '<li role="option" data-v="' + esc(r.e[0]) + '" aria-selected="' + (k === ui.active) + '"' + (used ? ' class="used" aria-disabled="true"' : "") + ">" + esc(r.e[0]) + "<small>" + esc(r.via ? "“" + r.via + "”" : r.e[2]) + "</small></li>"; }).join("") : '<li class="none">Not in the list. Try another term.</li>';
    }
    function playHTML() {
      var shown = Math.min(S.tries.length + 1, K.length), h = head();
      h += '<section class="wl-stage"><p class="wl-lab">Clue ' + shown + " of " + K.length + "</p>";
      h += slideHTML(K[0].img, true);
      h += '<ol class="wl-hints">' + K.slice(1, shown).map(function (c, k) { return "<li" + (ui.fresh && k === shown - 2 ? ' class="new"' : "") + "><b>" + (k + 2) + "</b><span>" + (c.img ? esc(c.t) + slideHTML(c.img) : esc(c.t)) + "</span></li>"; }).join("") + "</ol>";
      h += '<h2 class="wl-q">What is the diagnosis?</h2>';
      if (S.tries.length) h += '<div class="wl-tries"><div class="wl-tr wl-tr-h"><span>Your guesses</span></div>' + S.tries.map(function (t) { return '<div class="wl-tr"><span>' + esc(t) + "</span></div>"; }).join("") + "</div>";
      if (!S.out) h += '<label class="wl-lab" for="pl-g">Your answer</label><div class="wl-combo"><form class="wl-field" autocomplete="off"><input id="pl-g" role="combobox" aria-expanded="false" aria-controls="pl-lb" aria-autocomplete="list" placeholder="Type a diagnosis" value="' + esc(ui.pick || ui.q) + '"><button type="submit"' + (ui.pick ? "" : " disabled") + ">Guess</button></form><ul class=\"wl-list\" id=\"pl-lb\" role=\"listbox\" hidden></ul></div><p class=\"wl-note\" role=\"status\">" + esc(ui.msg) + '</p><p class="wl-meta">This guess: ' + fmt(PTS[Math.min(S.tries.length, 4)]) + " pt" + (S.tries.length ? "s" : "") + "</p>";
      return h + "</section>";
    }
    function endHTML() {
      var im = C.images, h = head();
      h += '<section class="wl-stage"><p class="wl-lab">' + (S.solved ? "Correct · " + fmt(pts()) + " pt" + (pts() === 1 ? "" : "s") : "Out of clues") + '</p><h2 class="wl-q">' + esc(C.answer) + "</h2>";
      h += '<p class="wl-why">' + esc(C.why) + "</p>" + im.map(function (m) { return slideHTML(m); }).join("");
      h += '<p class="wl-lab">Slide credits</p><ul class="pl-cred">' + im.map(function (m) { return "<li>" + esc(m.mag) + ": " + esc(m.by) + ', <a href="' + esc(m.page) + '" target="_blank" rel="noopener">' + esc(m.lic) + " on Wikimedia Commons</a></li>"; }).join("") + "</ul>";
      return h + '<div id="pl-end"></div></section>';
    }

    function render() {
      box.innerHTML = finished() ? endHTML() : playHTML();
      bindField(box);
      if (finished()) { if (o.end) o.end(box.querySelector("#pl-end"), { score: pts(), tries: S.tries.length, solved: S.solved }); return; }
      var inp = box.querySelector("#pl-g"), lb = box.querySelector("#pl-lb"), form = box.querySelector("form.wl-field"), btn = form.querySelector("button");
      function open() { lb.innerHTML = listHTML(); lb.hidden = !ui.q || !!ui.pick; inp.setAttribute("aria-expanded", String(!lb.hidden)); }
      function choose(v) { ui.pick = v; ui.q = v; inp.value = v; btn.disabled = false; lb.hidden = true; ui.msg = ""; box.querySelector(".wl-note").textContent = ""; }
      inp.oninput = function () { ui.q = inp.value; ui.pick = null; ui.active = 0; btn.disabled = true; open(); };
      inp.onkeydown = function (e) { var n = lb.querySelectorAll("li[data-v]:not(.used)").length; if (e.key === "ArrowDown") { ui.active = Math.min(ui.active + 1, n - 1); open(); e.preventDefault(); } else if (e.key === "ArrowUp") { ui.active = Math.max(ui.active - 1, 0); open(); e.preventDefault(); } else if (e.key === "Enter" && !ui.pick) { var li = lb.querySelectorAll("li[data-v]:not(.used)")[ui.active]; if (li) { choose(li.dataset.v); e.preventDefault(); } } };
      lb.onmousedown = function (e) { var li = e.target.closest("li[data-v]"); if (li && !li.classList.contains("used")) { e.preventDefault(); choose(li.dataset.v); inp.focus(); } };
      form.onsubmit = function (e) {
        e.preventDefault(); if (!ui.pick) return;
        var g = ui.pick; if (S.tries.indexOf(g) > -1) { ui.msg = "Already tried."; render(); return; }
        S.tries.push(g); ui.q = ""; ui.pick = null; ui.msg = ""; ui.fresh = true;
        if (g === C.answer) S.solved = true; else if (S.tries.length >= K.length) S.out = true;
        save(); if (finished() && o.done) o.done({ score: pts(), tries: S.tries.length, solved: S.solved });
        render(); if (!finished()) { var n = box.querySelector("#pl-g"); if (n) n.focus(); }
      };
    }
    render();
  }
  window.SinaPathle = { play: play };
})();
