/* First-visit guided tour: dims the page, lights up the real button for each step with an arrow,
   and opens the settings menu or the year menu when a step is about something inside them.
   Shown once per device, after the welcome screen. Replay: Settings → "How Sina works" (#/tour).
   A step whose element is missing (other page, small screen, chat off) falls back to a centred card. */
(function () {
  "use strict";
  var KEY = "sina:tourDone";
  var installEvt = null;
  window.addEventListener("beforeinstallprompt", function (e) { installEvt = e; });   /* app.js keeps its own copy for #/install */

  function done() { try { return !!JSON.parse(localStorage.getItem(KEY) || "false"); } catch (e) { return false; } }
  function markDone() { try { localStorage.setItem(KEY, "true"); } catch (e) {} }
  function isIOS() { return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); }
  function standalone() { return (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone; }
  function $(s) { return document.querySelector(s); }

  /* ---------- opening and closing the site's own menus ---------- */
  function settings(open) { var m = $("#settings-menu"), b = $("#settings-btn"); if (m && b && m.hidden === open) b.click(); }
  function yearMenu(open) { var m = $("#prog-menu"), b = $("#prog-btn"); if (m && b && m.hidden === open) b.click(); }
  function closeMenus() { settings(false); yearMenu(false); }
  function headerIn() { var h = $(".site-header"); if (h) h.classList.remove("hdr-hide"); document.documentElement.classList.remove("hdr-off"); }
  function top() { window.scrollTo(0, 0); headerIn(); }
  function home() { if (location.hash && location.hash !== "#/" && location.hash !== "#") location.hash = "#/"; }

  function steps() {
    var chatOn = !!(window.SinaChat && SinaChat.configured()), inst;
    if (standalone()) inst = '<p class="tr-ok">You\'re already using Sina from your home screen.</p>';
    else if (isIOS()) inst = "<ol><li>Open Sina in <b>Safari</b>, tap <b>Share</b> (square with an arrow), then <b>Add to Home Screen</b>.</li><li>From then on, open Sina from the icon: it keeps its own progress.</li></ol>";
    else inst = "<ol><li>In <b>Chrome</b>, tap the menu <b>⋮</b>, then <b>Add to Home screen</b> or <b>Install app</b>.</li><li>Open Sina from the new icon.</li></ol>";
    return [
      { t: "Welcome to Sina", b: "<p>Every lecture has a <b>summary</b>, <b>questions</b> and <b>flashcards</b>.</p><p>Let's take a quick look around: it takes under a minute.</p>", go: function () { home(); top(); } },
      { el: "#prog-btn", t: "Your year", b: "<p>Switch year here any time. Subjects and lectures follow the year you pick.</p>", go: top },
      { el: "#home-search", t: "Search", b: "<p>Find any lecture, subject or past paper by typing a few letters.</p>" },
      { el: "#subjects", t: "Your subjects", b: "<p>Open a subject, then a lecture. A good routine: read the summary, then test yourself on the questions straight away.</p>" },
      { el: ".quick", t: "Shortcuts", b: "<p>Pick up where you left off, do the reviews due today, redo your mistakes and follow your progress.</p>" },
      { el: 'a.qtile[href="#/mistakes"]', t: "How scores work", b: "<ul><li>Tick <b>every</b> correct option, then <b>Check my answer</b>. Some questions have more than one.</li>" +
          "<li>All right = 1 point. Some right, none wrong = part of a point. Any wrong pick = 0.</li>" +
          "<li>Missed questions land <b>here</b>, and come back for review after 1, 3, 7, 16 and 35 days.</li></ul>" },
      { t: "Explain your reasoning", b: "<p>After many questions, a link <b>Explain the reasoning (optional)</b> appears under the answer. Write <i>why</i> the answer is right; Sina checks it for the key ideas and shows which ones you mentioned.</p><p>Practice only: it never changes your score.</p>", go: top },
      { el: '#settings-menu a[href="#/install"]', menu: "settings", t: "Add Sina to your home screen", b: "<p>It then opens full screen like an app and works offline.</p>" + inst,
        a: [installEvt && !standalone() ? { id: "inst", label: "Install Sina" } : null] },
      { el: '#settings-menu a[href="#/reminders"]', menu: "settings", t: "Daily reminders", b: "<p>One notification a day at your time: reviews when some are due, otherwise a nudge to practise.</p>" +
          (isIOS() && !standalone() ? "<p><b>iPhone and iPad:</b> add Sina to your home screen first; notifications only work from the icon.</p>" : "") },
      { el: '#settings-menu a[href="#/account"]', menu: "settings", t: "Your account", b: "<p>A free account syncs your progress across your phone, laptop and the home-screen app." + (chatOn ? " It also opens your year's chat room." : "") + "</p>" },
      { el: "#prog-menu .pm-usmle", menu: "year", t: "AnKing Step 1", b: "<p>Under <b>USMLE prep</b>: the AnKing deck as questions or flashcards, with its own spaced repetition. It needs the password you were given.</p>" },
      chatOn ? { el: "#online-btn", t: "Chat", b: "<p>How many students are online right now. Tap it to open the chat: <b>Global</b> for everyone, plus your year's room when you're logged in.</p>", go: top } : null,
      { el: '#settings-menu a[href="#/tour"]', menu: "settings", t: "That's it!", b: "<p>You can replay this tour any time from <b>Settings → How Sina works</b>. Good luck with your studies!</p>" }
    ].filter(Boolean);
  }

  /* ---------- the overlay ---------- */
  var root = null, last = null, cur = null, raf = 0;
  function visible(el) { if (!el) return false; var r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden"; }

  function place() {
    if (!root) return;
    var card = root.querySelector(".tr-card"), hole = root.querySelector(".tr-hole"), arrow = root.querySelector(".tr-arrow");
    var el = cur && cur.el && $(cur.el);
    var vw = window.innerWidth, vh = window.innerHeight, cw = card.offsetWidth, ch = card.offsetHeight, gap = 14;
    if (!visible(el)) {   /* centred card, the whole page dimmed */
      root.classList.add("tr-center"); hole.style.cssText = ""; arrow.hidden = true;
      card.style.left = Math.max(8, (vw - cw) / 2) + "px"; card.style.top = Math.max(8, (vh - ch) / 2) + "px";
      return;
    }
    root.classList.remove("tr-center");
    var r = el.getBoundingClientRect(), pad = 6;
    var hx = r.left - pad, hy = r.top - pad, hw = r.width + pad * 2, hh = Math.min(r.height + pad * 2, vh * 0.6);
    hole.style.cssText = "left:" + hx + "px;top:" + hy + "px;width:" + hw + "px;height:" + hh + "px";
    var below = hy + hh + gap + ch <= vh - 8 || hy < vh / 2;
    var top = below ? hy + hh + gap : hy - gap - ch;
    top = Math.max(8, Math.min(top, vh - ch - 8));
    var cx = r.left + r.width / 2, left = Math.max(8, Math.min(cx - cw / 2, vw - cw - 8));
    card.style.left = left + "px"; card.style.top = top + "px";
    arrow.hidden = false; arrow.className = "tr-arrow " + (below ? "up" : "down");
    arrow.style.left = Math.max(left + 16, Math.min(cx, left + cw - 16)) - 9 + "px";
    arrow.style.top = (below ? top - 9 : top + ch - 9) + "px";
  }
  function replace() { cancelAnimationFrame(raf); raf = requestAnimationFrame(place); }

  function close() {
    if (!root) return;
    markDone(); closeMenus();
    root.classList.add("leaving"); var r = root; root = null; cur = null;
    setTimeout(function () { r.remove(); }, 200);
    document.removeEventListener("keydown", onKey, true);
    window.removeEventListener("resize", replace); window.removeEventListener("scroll", replace, true);
    if (last && last.focus && document.body.contains(last)) last.focus({ preventScroll: true });
  }
  function onKey(e) {
    if (!root) return;
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); e.stopPropagation(); root.querySelector(".tr-next").click(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); e.stopPropagation(); var p = root.querySelector(".tr-back"); if (!p.disabled) p.click(); }
    else if (e.key === "Tab") {   /* keep focus inside the card */
      var f = root.querySelectorAll(".tr-card button:not([disabled]), .tr-card a[href]"); if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      else if (!root.contains(document.activeElement)) { e.preventDefault(); f[0].focus(); }
    }
  }

  function open() {
    if (root) return;
    last = document.activeElement;
    var list = steps(), k = 0;
    root = document.createElement("div");
    root.className = "tr-root tr-center";
    root.innerHTML = '<div class="tr-block"></div><div class="tr-hole"></div><i class="tr-arrow" hidden></i><div class="tr-card" role="dialog" aria-modal="true" aria-labelledby="tr-title" aria-live="polite"></div>';
    document.body.appendChild(root);
    /* the site closes its menus on any click outside them: keep the tour's clicks to itself */
    root.addEventListener("click", function (e) { e.stopPropagation(); });
    document.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", replace); window.addEventListener("scroll", replace, true);

    function show() {
      var s = cur = list[k], end = k === list.length - 1, card = root.querySelector(".tr-card");
      /* open the menu this step lives in, close the others */
      if (s.menu === "settings") { yearMenu(false); top(); settings(true); }
      else if (s.menu === "year") { settings(false); top(); yearMenu(true); }
      else closeMenus();
      if (s.go) s.go();
      var acts = (s.a || []).filter(Boolean).map(function (a) { return '<button type="button" class="btn small primary" data-act="' + a.id + '">' + a.label + "</button>"; }).join("");
      card.innerHTML = '<button type="button" class="tr-x" aria-label="Close the tour">&times;</button>' +
        '<p class="tr-step">' + (k + 1) + " of " + list.length + '</p><h2 id="tr-title">' + s.t + '</h2><div class="tr-body">' + s.b + "</div>" +
        (acts ? '<div class="tr-acts">' + acts + "</div>" : "") +
        '<div class="tr-nav"><button type="button" class="btn tr-back"' + (k ? "" : " disabled") + '>Back</button>' +
        (end ? "" : '<button type="button" class="linkbtn tr-skip">Skip</button>') +
        '<button type="button" class="btn primary tr-next">' + (end ? "Start studying" : k ? "Next" : "Show me") + "</button></div>";
      card.querySelector(".tr-x").onclick = close;
      card.querySelector(".tr-back").onclick = function () { if (k) { k--; show(); } };
      card.querySelector(".tr-next").onclick = function () { if (end) close(); else { k++; show(); } };
      var sk = card.querySelector(".tr-skip"); if (sk) sk.onclick = close;
      var ib = card.querySelector('[data-act="inst"]');
      if (ib) ib.onclick = function () { if (!installEvt) return; installEvt.prompt(); installEvt.userChoice.then(function () { installEvt = null; ib.remove(); place(); }); };
      /* bring the element into view (the header ones are always at the top), then draw */
      setTimeout(function () {
        if (!root || cur !== s) return;
        var el = s.el && $(s.el);
        if (el && !s.menu && !el.closest(".site-header") && visible(el)) {
          var r = el.getBoundingClientRect();
          if (r.top < 70 || r.bottom > window.innerHeight * 0.55) window.scrollTo(0, Math.max(0, window.scrollY + r.top - 90));
          headerIn();
        }
        place(); setTimeout(place, 120);
        var nx = root.querySelector(".tr-next"); if (nx) nx.focus({ preventScroll: true });
      }, s.menu ? 120 : 60);
      place();
    }
    show();
  }

  function maybeOpen() {
    if (done() || root) return;
    if (document.querySelector("#welcome:not([hidden]), .yc-backdrop, .rdlg")) return;   /* never on top of the intro, the year picker or a dialog */
    if (location.hash && location.hash !== "#/" && location.hash !== "#") return;          /* only from the home page, where the things it points at are */
    open();
  }
  document.addEventListener("sina:entered", function () { setTimeout(maybeOpen, 400); });
  /* visitors whose welcome screen was skipped: try once things have settled */
  window.addEventListener("load", function () { setTimeout(function () { if (!document.getElementById("welcome")) maybeOpen(); }, 1500); });

  window.SinaTour = { open: function () { home(); setTimeout(open, 150); }, reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} } };
})();
