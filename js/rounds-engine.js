/* Wardle case engine (format 3). Gameplay is one bedside screen: monitor, chart, four actions. Results arrive as printouts,
   questions only when a result or a decision calls for one, and every explanation waits for the debrief.
   SinaRounds.play(el, case, opts)
     opts.title   heading, e.g. "Wardle #2"
     opts.seed    string for the option order
     opts.load() saved state or null;  opts.save(state)
     opts.lec(id) -> { title, href, ext } or null
     opts.done(result)   once, when the case ends: { score, total: 5, squares, phases }
     opts.end(el, result) renders share, streak and leaderboard on the handover screen */
(function () {
  "use strict";
  var PH = [["history", "History"], ["exam", "Exam"], ["investigations", "Tests"], ["diagnosis", "Diagnosis"], ["management", "Treatment"]];
  var Y1 = /^(anat1|physio1|bacterio1|biochem1|histo1|embryo1|genetics1|immuno1|physics1|term1|cell1|chem1)-/;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function seeded(str) { var h = 1779033703 ^ str.length; for (var i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; } return function () { h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; }; }
  function num(x) { return typeof x === "number" ? x.toLocaleString("en-GB") : x; }
  function fmt(x) { return String(Math.round(x * 100) / 100); }
  function g(x, c, w, a) { return a * Math.exp(-((x - c) * (x - c)) / (2 * w * w)); }
  /* ECG drawing: an illustration built from a simple waveform model (real recordings come with the media phase) */
  function leadPath(st, r, w, h, beats) {
    var d = "", base = h * 0.6, step = w / beats;
    for (var x = 0; x <= w; x += 1) {
      var y = 0;
      for (var k = 0; k < beats; k++) {
        var c = step * (k + 0.45), s = step / 82;
        y += g(x, c - 16 * s, 3 * s, 4) + g(x, c - 2 * s, 1.6 * s, -3) + g(x, c, 2 * s, r) + g(x, c + 3 * s, 1.8 * s, -5);
        if (x > c + 5 * s && x < c + 18 * s) y += st;
        y += g(x, c + 24 * s, 5 * s, 6 + Math.max(st, 0) * 0.6);
      }
      d += (x ? "L" : "M") + x + " " + (base - y).toFixed(1);
    }
    return d;
  }
  function chbPath(w, h) {
    var d = "", base = h * 0.62, pxs = 70;
    for (var x = 0; x <= w; x += 1) {
      var s = x / pxs, y = 0, t;
      for (t = 0.15; t < 6; t += 0.8) y += g(s, t, 0.022, 7);
      for (t = 0.55; t < 6; t += 1.66) { y += g(s, t - 0.03, 0.018, -6) + g(s, t, 0.03, 38) + g(s, t + 0.05, 0.025, -12); if (s > t + 0.07 && s < t + 0.26) y += 7; y += g(s, t + 0.36, 0.07, 11); }
      d += (x ? "L" : "M") + x + " " + (base - y).toFixed(1);
    }
    return d;
  }

  function play(el, c, o) {
    var st = o.load();
    var ui = { sheet: null, sel: [], dxsel: [], open: {} };
    function save() { o.save(st); }
    function q(id) { return c.q[id]; }
    function Q(id) { return st.q[id] || (st.q[id] = { wrong: [] }); }
    function scene() { return c.scenes[st.sc]; }
    function W() { return (scene() || {}).workup; }
    function allTests() { var a = []; c.scenes.forEach(function (s) { if (s.workup) a = a.concat(s.workup.tests); if (s.tests) a = a.concat(s.tests); }); return a; }
    function test(id) { return allTests().filter(function (t) { return t.id === id; })[0]; }
    function order(id, n) { var r = seeded((o.seed || "") + "|" + id), a = []; for (var i = 0; i < n; i++) a.push(i); for (i = n - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

    /* ---- flow ---- */
    function enter(i) {
      st.sc = i; var s = c.scenes[i];
      if (!s) { st.view = "handover"; return; }
      if (s.event) st.queue.push({ k: "event", ev: s.event });
      if (!s.workup) {
        var last = null;   /* a question that follows a result keeps that result on screen */
        (s.flow || []).forEach(function (f) { if (f.charAt(0) === "@") { last = f.slice(1); st.queue.push({ k: "result", test: last }); } else { st.queue.push(last ? { k: "q", id: f, from: last } : { k: "q", id: f }); last = null; } });
        st.queue.push({ k: "next" });
      }
    }
    function pump() {   /* run silent queue items until something needs the player */
      while (st.queue.length && st.queue[0].k === "next") { st.queue.shift(); enter(st.sc + 1); }
      if (!st.queue.length && !W() && st.view === "game") enter(st.sc + 1);
      var h0 = st.queue[0];   /* the patient changes the moment the event happens, not after it is read */
      if (h0 && h0.k === "event" && !h0.applied) { h0.applied = 1; if (h0.ev.vitals) for (var k in h0.ev.vitals) st.vit[k] = h0.ev.vitals[k]; if (h0.ev.clock) st.clockLabel = h0.ev.clock; }
    }
    if (!st || !st.queue) {
      st = { t: 0, sc: 0, asked: [], exd: [], ord: [], batches: [], q: {}, dx: null, chart: [], queue: [], vit: {}, view: "game" };
      for (var k in c.vitals) st.vit[k] = c.vitals[k];
      enter(0);
    }

    /* ---- scoring ---- */
    function mscore(id) { var s = st.q[id]; if (!s || !s.done) return null; if (s.branched) return 0; var w = s.wrong.length; return w === 0 ? 1 : w === 1 ? 0.5 : 0; }
    function pickScore(items, picked) {
      var keys = items.filter(function (i) { return i.v === "key"; }), hit = keys.filter(function (i) { return picked.indexOf(i.id) > -1; }).length;
      var low = items.filter(function (i) { return i.v === "low" && picked.indexOf(i.id) > -1; }).length;
      return Math.max(0, Math.min(1, (keys.length ? hit / keys.length : 1) - 0.12 * low));
    }
    function firstOk() {
      var w = c.scenes[0].workup, f = w.tests.filter(function (t) { return t.first; })[0];
      if (!f) return true; var b = st.batches[0]; return !!(b && b.ids.indexOf(f.id) > -1 && b.t <= 15);
    }
    function result() {
      var w = c.scenes[0].workup, acc = { history: [], exam: [], investigations: [], diagnosis: [], management: [] }, harm = false;
      acc.history.push(pickScore(w.ask, st.asked));
      acc.exam.push(pickScore(w.exam, st.exd));
      acc.investigations.push(pickScore(w.tests, st.ord) * (firstOk() ? 1 : 0.5));
      if (st.dx) { var need = w.dx.filter(function (d) { return d.need; })[0].name, pos = st.dx.indexOf(need), out = w.dx.some(function (d) { return d.out && st.dx.indexOf(d.name) > -1; }); acc.diagnosis.push(Math.max(0, (pos === 0 ? 1 : pos > 0 ? 0.6 : 0) - (out ? 0.25 : 0))); }
      Object.keys(c.q).forEach(function (id) { var v = mscore(id); if (v === null) return; acc[q(id).type === "priority" ? "management" : "diagnosis"].push(v); if (st.q[id].branched) harm = true; });
      var phases = {}, squares = [], total = 0;
      PH.forEach(function (p) { var a = acc[p[0]], v = a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : 1; if (p[0] === "management" && harm) v = Math.min(v, 0.35); phases[p[0]] = v; total += v; squares.push(v >= 0.75 ? "g" : v >= 0.4 ? "y" : "r"); });
      return { score: Math.round(total * 2) / 2, total: 5, squares: squares, phases: phases };
    }

    /* ---- pieces of the screen ---- */
    function clock() { return st.clockLabel || ("T+" + st.t + " min"); }
    function bad(k, x) { if (k === "hr") return x > 100 || x < 60; if (k === "rr") return x > 20 || x < 12; if (k === "spo2") return x < 95; if (k === "bp") return +String(x).split("/")[0] < 90; if (k === "t") return parseFloat(x) >= 38 || parseFloat(x) < 36; return false; }
    function monitor(compact) {
      var v = st.vit, big = [["hr", "HR", ""], ["spo2", "SpO₂ %", ""], ["rr", "RR", ""]], small = [["bp", "BP mmHg"], ["t", "TEMP °C"], ["o2", "O₂"]];
      if (compact) return '<div class="wd-mon wd-mon-c">' + big.concat(small).map(function (x) { return '<span><i>' + x[1].split(" ")[0] + "</i> <b class=\"" + (bad(x[0], v[x[0]]) ? "hi" : "") + '">' + esc(v[x[0]]) + "</b></span>"; }).join("") + "</div>";
      return '<div class="wd-mon">' + big.map(function (x) { return '<div><i>' + x[1] + '</i><b class="big' + (bad(x[0], v[x[0]]) ? " hi" : "") + '">' + esc(v[x[0]]) + "</b></div>"; }).join("") +
        small.map(function (x) { return '<div><i>' + x[1] + '</i><b class="' + (bad(x[0], v[x[0]]) ? "hi" : "") + '">' + esc(v[x[0]]) + "</b></div>"; }).join("") + "</div>";
    }
    function top() { return '<div class="wd-top"><span class="wd-name">' + esc(o.title || "Wardle") + '</span><span class="wd-clock' + (st.clockLabel ? " alert" : "") + '">' + esc(clock()) + "</span></div>"; }
    function slip(s) {
      var h = '<div class="wd-slip"><div class="wd-slip-h"><b>' + esc(s.title) + '</b><span>' + esc(s.sample || "") + "</span></div>";
      if (s.collected) h += '<div class="wd-slip-meta"><span>Collected</span><span>' + esc(s.collected) + '</span><span>Received</span><span class="' + (s.late ? "late" : "") + '">' + esc(s.received) + "</span></div>";
      h += '<table><thead><tr><th>Test</th><th class="r">Result</th><th></th><th class="r">Reference</th></tr></thead><tbody>' + s.rows.map(function (r) {
        var n = typeof r[1] === "number" && r[3] !== "", f = n ? (r[1] > r[4] ? "H" : r[1] < r[3] ? "L" : "") : "";
        return "<tr" + (f ? ' class="ab"' : "") + "><td>" + esc(r[0]) + '</td><td class="r">' + esc(num(r[1])) + '</td><td class="f">' + f + '</td><td class="r ref">' + (r[3] !== "" ? esc(num(r[3])) + "–" + esc(num(r[4])) + " " : "") + esc(r[2]) + "</td></tr>";
      }).join("") + "</tbody></table>";
      if (s.comment) h += '<p class="wd-slip-c">' + esc(s.comment) + "</p>";
      if (s.prev) h += '<p class="wd-slip-p">' + esc(s.prev) + "</p>";
      return h + "</div>";
    }
    function report(r) { return '<div class="wd-slip wd-report"><div class="wd-slip-h"><b>' + esc(r.title) + '</b><span>Report</span></div>' + r.lines.map(function (l) { return "<p>" + esc(l) + "</p>"; }).join("") + "</div>"; }
    function ecg(e, notes) {
      return '<div class="wd-ecg"><div class="wd-ecg-grid">' + e.leads.map(function (l) { return '<figure><div class="wd-paper"><svg viewBox="0 0 167 70" preserveAspectRatio="none" aria-hidden="true"><path d="' + leadPath(l[1], l[2], 167, 70, 2) + '"/></svg><span>' + esc(l[0]) + "</span></div>" + (notes ? '<figcaption class="' + (l[1] > 0 ? "up" : l[1] < 0 ? "down" : "") + '">' + esc(l[3]) + "</figcaption>" : "") + "</figure>"; }).join("") +
        '</div><p class="wd-ecg-line">' + esc(e.line) + '</p><p class="wd-illus">Illustrative trace</p></div>';
    }
    function rhythm() { return '<figure class="wd-strip"><div class="wd-paper"><svg viewBox="0 0 354 100" preserveAspectRatio="none" role="img" aria-label="Rhythm strip: regular P waves, slow QRS complexes unrelated to them"><path d="' + chbPath(354, 100) + '"/></svg></div><figcaption>Lead II · 25 mm/s</figcaption></figure>'; }
    function resultHTML(t, notes) { return t.slip ? slip(t.slip) : t.ecg ? ecg(t.ecg, notes) : t.report ? report(t.report) : ""; }

    /* ---- screens ---- */
    function bedside() {
      var w = W(), h = '<div class="wd-pt"><b>' + esc(c.patient.who) + "</b><span>" + esc(c.patient.line) + "</span></div>";
      h += '<div class="wd-chart"><p class="wd-lab">Chart</p>' + (st.chart.length ? '<div class="wd-rows">' + st.chart.map(function (r, i) {
        return '<span class="wd-k">' + r.k + "</span>" + (r.test ? '<button type="button" class="wd-line link' + (i === st.chart.length - 1 ? " new" : "") + '" data-act="view" data-id="' + esc(r.test) + '">' + esc(r.txt) + "</button>" : '<span class="wd-line' + (i === st.chart.length - 1 ? " new" : "") + '">' + esc(r.txt) + "</span>");
      }).join("") + "</div>" : '<p class="wd-empty">Nothing yet. Start where you would at the bedside.</p>') + "</div>";
      if (st.dx) h += '<div class="wd-ddx"><p class="wd-lab">Your differential</p><p>' + st.dx.map(function (d, i) { return "<span><b>" + (i + 1) + "</b> " + esc(d) + "</span>"; }).join("") + "</p></div>";
      if (ui.sheet) h += sheet(w);
      else h += '<div class="wd-dock"><p class="wd-ask">What next?</p><div class="wd-acts">' +
        '<button type="button" data-act="sheet" data-id="ask"><span>Ask</span><i>2 min</i></button>' +
        '<button type="button" data-act="sheet" data-id="exam"><span>Examine</span><i>3 min</i></button>' +
        '<button type="button" data-act="sheet" data-id="order"><span>Order</span><i>tests</i></button>' +
        '<button type="button" data-act="treat"' + (st.dx ? "" : ' class="dim"') + "><span>Treat</span><i>decide</i></button></div>" +
        '<button type="button" class="wd-know" data-act="sheet" data-id="dx">' + (st.dx ? "Change my differential" : "I know what this is") + "</button></div>";
      return h;
    }
    function sheet(w) {
      var h = '<div class="wd-sheet" role="dialog" aria-label="Choose"><div class="wd-sheet-h"><b>' + { ask: "Ask", exam: "Examine", order: "Order tests", dx: "Your top 3" }[ui.sheet] + '</b><button type="button" data-act="close" aria-label="Close">Close</button></div>';
      if (ui.sheet === "ask") { var left = w.ask.filter(function (a) { return st.asked.indexOf(a.id) < 0; }); h += left.length ? left.map(function (a) { return '<button type="button" class="wd-opt" data-act="ask" data-id="' + a.id + '">' + esc(a.q) + "</button>"; }).join("") : '<p class="wd-empty">Nothing more to ask.</p>'; }
      if (ui.sheet === "exam") { var lx = w.exam.filter(function (a) { return st.exd.indexOf(a.id) < 0; }); h += lx.length ? lx.map(function (a) { return '<button type="button" class="wd-opt" data-act="exam" data-id="' + a.id + '">' + esc(a.name) + "</button>"; }).join("") : '<p class="wd-empty">Nothing more to examine.</p>'; }
      if (ui.sheet === "order") {
        var lt = w.tests.filter(function (t) { return st.ord.indexOf(t.id) < 0; }), mins = ui.sel.reduce(function (a, id) { return a + test(id).min; }, 0);
        h += lt.map(function (t) { var on = ui.sel.indexOf(t.id) > -1; return '<label class="wd-check' + (on ? " on" : "") + '"><input type="checkbox" data-act="sel" data-id="' + t.id + '"' + (on ? " checked" : "") + "><span>" + esc(t.name) + "</span><i>" + t.min + " min</i></label>"; }).join("") || '<p class="wd-empty">Everything has been ordered.</p>';
        h += '<button type="button" class="wd-go" data-act="send"' + (ui.sel.length ? "" : " disabled") + ">" + (ui.sel.length ? "Send " + ui.sel.length + " (" + mins + " min)" : "Tick the tests you want") + "</button>";
      }
      if (ui.sheet === "dx") {
        h += '<p class="wd-hint">Tap in order of likelihood.</p><div class="wd-dxs">' + w.dx.map(function (d) { var i = ui.dxsel.indexOf(d.name); return '<button type="button" class="wd-dx' + (i > -1 ? " on" : "") + '" aria-pressed="' + (i > -1) + '" data-act="dxp" data-id="' + esc(d.name) + '">' + (i > -1 ? "<b>" + (i + 1) + "</b> " : "") + esc(d.name) + "</button>"; }).join("") + "</div>";
        h += '<button type="button" class="wd-go" data-act="dxok"' + (ui.dxsel.length === 3 ? "" : " disabled") + ">" + (ui.dxsel.length === 3 ? "Confirm" : "Pick " + (3 - ui.dxsel.length) + " more") + "</button>";
      }
      return h + "</div>";
    }
    function eventHTML(ev) {
      var h = '<div class="wd-event"><p class="wd-lab">' + esc(ev.at) + "</p>";
      if (ev.note) h += '<p class="wd-note">' + esc(ev.note) + "</p>";
      h += "<p>" + esc(ev.text) + "</p>";
      if (ev.ifOrdered) { var k = Object.keys(ev.ifOrdered).filter(function (x) { return x !== "none"; })[0]; h += "<p>" + esc(st.ord.indexOf(k) > -1 ? ev.ifOrdered[k] : ev.ifOrdered.none) + "</p>"; }
      if (ev.rhythm) h += rhythm();
      return h + '<button type="button" class="wd-go" data-act="next">Continue</button></div>';
    }
    function questionHTML(id, withTest) {
      var s = q(id), d = Q(id), h = "";
      if (withTest) h += '<div class="wd-res">' + resultHTML(test(withTest)) + "</div>";
      h += '<div class="wd-q"><p class="wd-qt">' + esc(s.q) + "</p>";
      order(id, s.options.length).forEach(function (j) { var off = d.wrong.indexOf(j) > -1; h += '<button type="button" class="wd-opt' + (off ? " off" : "") + '" data-act="opt" data-j="' + j + '"' + (off ? " disabled" : "") + "><span>" + esc(s.options[j]) + "</span>" + (off ? "<i>Not this</i>" : "") + "</button>"; });
      return h + "</div>";
    }
    function gameScreen() {
      var it = st.queue[0], h = top() + monitor(!!it && it.k !== "q");
      if (!it) return h + bedside();
      if (it.k === "event") return h + eventHTML(it.ev);
      if (it.k === "result") { var t = test(it.test), nx = st.queue[1]; if (nx && nx.k === "q" && nx.from === t.id) return h + questionHTML(nx.id, t.id); return h + '<div class="wd-res">' + resultHTML(t) + '</div><div class="wd-q"><button type="button" class="wd-go" data-act="next">Back to the bedside</button></div>'; }
      if (it.k === "q") return h + questionHTML(it.id, it.from || null);
      return h;
    }
    function handover(r) {
      var harmed = Object.keys(st.q).some(function (id) { return st.q[id].branched; });
      st.clockLabel = "Discharged";
      return top() + monitor(true) + '<div class="wd-hand"><p class="wd-lab">' + esc(c.outcome) + "</p><h2>" + esc(c.dx) + "</h2><p>" + esc(c.short) + "</p>" +
        '<div class="wd-score"><div class="wd-score-h"><b>Your round</b><span>' + fmt(r.score) + "<small>/5</small></span></div>" + squaresHTML(r) +
        (harmed ? '<p>One decision changed the course. The debrief shows which.</p>' : "") + '</div><button type="button" class="wd-go primary" data-act="debrief">Open the debrief</button><div id="wd-extra"></div></div>';
    }
    function squaresHTML(r) { return '<div class="wd-sq5">' + PH.map(function (p, i) { return '<div><i class="sq ' + r.squares[i] + '"></i><span>' + p[1] + "</span></div>"; }).join("") + "</div>"; }

    /* ---- debrief ---- */
    function fold(id, title, body, openDefault) {
      var open = ui.open[id] !== undefined ? ui.open[id] : !!openDefault;
      return '<section class="wd-fold" id="wd-' + id + '"><button type="button" class="wd-fold-h" data-act="fold" data-id="' + id + '" aria-expanded="' + open + '"><span>' + title + "</span><i>" + (open ? "−" : "+") + "</i></button>" + (open ? '<div class="wd-fold-b">' + body + "</div>" : "") + "</section>";
    }
    function lecLink(id) { var x = o.lec(id); return x ? (x.href ? '<a href="' + esc(x.href) + '"' + (x.ext ? ' target="_blank" rel="noopener"' : "") + ">" + esc(x.title) + "</a>" : esc(x.title)) : ""; }
    function debrief(r) {
      var w = c.scenes[0].workup, db = c.debrief, h = '<div class="wd-top"><span class="wd-name">' + esc(o.title || "Wardle") + ' · Debrief</span><span class="wd-clock">' + fmt(r.score) + "/5</span></div>";
      h += '<nav class="wd-nav" aria-label="Debrief sections">' + [["sum", "Summary"], ["why", "Reasoning"], ["tests", "Results"], ["you", "Your decisions"], ["lec", "Lectures"], ["exam", "For the exam"]].map(function (x) { return '<button type="button" data-act="jump" data-id="' + x[0] + '">' + x[1] + "</button>"; }).join("") + "</nav>";
      h += '<section class="wd-sum" id="wd-sum"><p class="wd-lab">' + esc(c.outcome) + "</p><h2>" + esc(c.dx) + "</h2><p>" + esc(c.summary) + "</p>" + squaresHTML(r) + "</section>";
      /* B */
      var b = '<ol class="wd-tl">' + db.timeline.map(function (x) { return '<li><span class="wd-t">' + esc(x.t) + "</span><div>" + esc(x.text) + (x.ddx ? '<span class="wd-shift">' + esc(x.ddx) + "</span>" : "") + "</div></li>"; }).join("") + "</ol>";
      if (st.dx) { var need = w.dx.filter(function (d) { return d.need; })[0].name; b += '<p class="wd-mine"><b>Your differential:</b> ' + st.dx.map(function (d, i) { return (i + 1) + ". " + esc(d); }).join(" · ") + (st.dx[0] === need ? "" : ' <span class="miss">The working diagnosis should have been ' + esc(need) + ".</span>") + "</p>"; }
      h += fold("why", "How the diagnosis was reached", b, false);
      /* C */
      var tests = allTests().filter(function (t) { return t.v !== "low" || st.ord.indexOf(t.id) > -1; }), cbody = "";
      tests.forEach(function (t) {
        var got = st.ord.indexOf(t.id) > -1 || !(W() || c.scenes[0].workup).tests.some(function (x) { return x.id === t.id; }), key = "t-" + t.id, open = !!ui.open[key];
        cbody += '<div class="wd-item"><button type="button" class="wd-item-h" data-act="fold" data-id="' + key + '" aria-expanded="' + open + '"><span>' + esc(t.name) + (got ? "" : ' <em>not ordered</em>') + "</span><i>" + (open ? "−" : "+") + "</i></button>" + (open ? '<div class="wd-item-b">' + resultHTML(t, true) + "<p>" + esc(t.explain) + "</p></div>" : "") + "</div>";
      });
      h += fold("tests", "Results, explained", cbody, false);
      /* D */
      var ids = Object.keys(c.q).filter(function (id) { return st.q[id] && st.q[id].done; }), wrongs = ids.filter(function (id) { return st.q[id].wrong.length; }), d = "";
      d += '<p class="wd-meta">' + ids.length + " decisions · " + (ids.length - wrongs.length) + " right first time" + (wrongs.length ? " · " + wrongs.length + " not" : "") + "</p>";
      wrongs.forEach(function (id) {
        var s = q(id), S = st.q[id], first = S.wrong[0];
        d += '<div class="wd-mis' + (S.branched ? " harm" : "") + '"><p class="wd-mis-h">' + esc(s.q) + (S.branched ? " · changed the course" : S.wrong.length > 1 ? " · " + (S.wrong.length + 1) + " tries" : " · second try") + "</p>" +
          '<p><span>You chose</span><b>' + esc(s.options[first]) + "</b></p><p><span>Better</span><b>" + esc(s.options[0]) + "</b></p><p>" + esc(s.notes[first]) + " " + esc(s.why) + '</p><p class="wd-type"><b>' + (s.type === "priority" ? "Prioritisation:" : "Knowledge gap:") + "</b> " + (s.type === "priority" ? "the facts were there; the order of what to do was the issue." : "a concept to revise; see its lecture below.") + "</p></div>";
      });
      var miss = [];
      w.ask.forEach(function (a) { if (a.v === "key" && st.asked.indexOf(a.id) < 0) miss.push("Not asked: “" + a.q + "” → " + a.a); });
      w.exam.forEach(function (a) { if (a.v === "key" && st.exd.indexOf(a.id) < 0) miss.push("Not examined: " + a.name + " → " + a.chart); });
      w.tests.forEach(function (t) { if (t.v === "key" && st.ord.indexOf(t.id) < 0) miss.push("Not ordered: " + t.name + "."); if (t.v === "low" && st.ord.indexOf(t.id) > -1) miss.push("Low yield: " + t.name + ". " + t.explain); });
      if (!firstOk()) miss.push("The ECG should come first: it takes minutes and decides this case.");
      if (miss.length) d += '<p class="wd-lab">Missed clues and extra tests</p><ul class="wd-list">' + miss.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
      var all = ids.filter(function (id) { return !st.q[id].wrong.length; });
      if (all.length) d += '<div class="wd-item"><button type="button" class="wd-item-h" data-act="fold" data-id="allq" aria-expanded="' + !!ui.open.allq + '"><span>Every other decision, every option explained</span><i>' + (ui.open.allq ? "−" : "+") + "</i></button>" + (ui.open.allq ? '<div class="wd-item-b">' + all.map(function (id) { var s = q(id); return '<p class="wd-qq">' + esc(s.q) + "</p><ul class=\"wd-list\">" + s.options.map(function (op, j) { return "<li" + (j ? "" : ' class="ok"') + "><b>" + esc(op) + ".</b> " + esc(j ? s.notes[j] : s.why) + "</li>"; }).join("") + "</ul>"; }).join("") + "</div>" : "") + "</div>";
      h += fold("you", "Your decisions", d, true);
      /* E */
      var map = {}, seen = [];
      Object.keys(c.q).forEach(function (id) { (q(id).src || []).forEach(function (r) { if (!map[r.lec]) { map[r.lec] = []; seen.push(r.lec); } if (map[r.lec].indexOf(q(id).q) < 0) map[r.lec].push(q(id).q); }); });
      function group(name, list) { return list.length ? '<div class="wd-yr"><p class="wd-lab">' + name + "</p>" + list.map(function (l) { return '<div class="wd-lec">' + lecLink(l) + "<span>" + map[l].map(esc).join(" · ") + "</span></div>"; }).join("") + "</div>" : ""; }
      var beyond = Object.keys(c.q).map(function (id) { return q(id).beyond; }).filter(Boolean);
      var e = group("Year 1", seen.filter(function (l) { return Y1.test(l); })) + group("Year 2", seen.filter(function (l) { return !Y1.test(l); }));
      if (beyond.length) e += '<div class="wd-yr"><p class="wd-lab enr">Enrichment · beyond the course</p>' + beyond.map(function (x) { return '<div class="wd-lec"><span>' + esc(x) + "</span></div>"; }).join("") + "</div>";
      h += fold("lec", "Where it's taught", e, false);
      /* F */
      var f = '<ul class="wd-take">' + db.takeaways.map(function (t) { return "<li><b>" + esc(t[0]) + ".</b> " + esc(t[1]) + "</li>"; }).join("") + '</ul><div class="wd-check"><p class="wd-lab">Check yourself</p>' +
        db.check.map(function (x, i) { var shown = ui.open["c" + i]; return '<p class="wd-qq">' + esc(x[0]) + "</p>" + (shown ? '<p class="wd-ans">' + esc(x[1]) + "</p>" : '<button type="button" class="wd-reveal" data-act="fold" data-id="c' + i + '">Show answer</button>'); }).join("") + "</div>";
      h += fold("exam", "For the exam", f, false);
      return h + '<p class="wd-back"><button type="button" class="wd-know" data-act="hand">Back to the result</button></p>';
    }

    /* ---- draw ---- */
    function draw(scrollTop) {
      pump();
      var r = null, h;
      if (st.view !== "game") { r = result(); if (!st.reported) { st.reported = 1; save(); if (o.done) o.done(r); } }
      h = st.view === "game" ? gameScreen() : st.view === "handover" ? handover(r) : debrief(r);
      el.innerHTML = '<div class="wd">' + h + "</div>";
      if (st.view === "handover" && o.end) o.end(el.querySelector("#wd-extra"), r);
      if (scrollTop) { var top0 = el.getBoundingClientRect().top + window.pageYOffset - (parseInt(getComputedStyle(el).getPropertyValue("--rv-top")) || 0); if (window.pageYOffset > top0) window.scrollTo(0, Math.max(0, top0)); }
    }
    function chartPush(k, txt, testId) { st.chart.push({ k: k, txt: txt, test: testId || null }); }
    el.addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]"); if (!b || b.disabled) return;
      var act = b.getAttribute("data-act"), id = b.getAttribute("data-id"), w = W(), it = st.queue[0];
      if (act === "jump") { if (id !== "sum") ui.open[id] = true; draw(); var t0 = el.querySelector("#wd-" + id); if (t0) t0.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
      if (act === "fold") { ui.open[id] = !(ui.open[id] !== undefined ? ui.open[id] : id === "you"); return draw(); }
      if (act === "debrief") { st.view = "debrief"; save(); return draw(true); }
      if (act === "hand") { st.view = "handover"; save(); return draw(true); }
      if (st.view !== "game") return;
      if (act === "sheet") { ui.sheet = id; ui.sel = []; ui.dxsel = id === "dx" && st.dx ? st.dx.slice() : []; return draw(); }
      if (act === "close") { ui.sheet = null; return draw(); }
      if (act === "ask") { var a = w.ask.filter(function (x) { return x.id === id; })[0]; st.asked.push(id); st.t += 2; chartPush("Hx", a.chart); ui.sheet = null; save(); return draw(); }
      if (act === "exam") { var x = w.exam.filter(function (y) { return y.id === id; })[0]; st.exd.push(id); st.t += 3; chartPush("Ex", x.chart); if (x.asks) st.queue.push({ k: "q", id: x.asks }); ui.sheet = null; save(); return draw(true); }
      if (act === "send") {
        var mins = 0; st.batches.push({ t: st.t, ids: ui.sel.slice() });
        ui.sel.forEach(function (tid) { var t = test(tid); st.ord.push(tid); mins += t.min; chartPush(t.ecg ? "ECG" : t.report ? "Img" : "Lab", t.chart, tid); st.queue.push({ k: "result", test: tid }); [].concat(t.asks || []).forEach(function (qid) { st.queue.push({ k: "q", id: qid, from: tid }); }); });
        st.t += mins; ui.sheet = null; ui.sel = []; save(); return draw(true);
      }
      if (act === "dxp") { var i = ui.dxsel.indexOf(id); if (i > -1) ui.dxsel.splice(i, 1); else if (ui.dxsel.length < 3) ui.dxsel.push(id); return draw(); }
      if (act === "dxok") { st.dx = ui.dxsel.slice(); ui.sheet = null; save(); return draw(); }
      if (act === "treat") { if (!st.dx) { ui.sheet = "dx"; ui.dxsel = []; return draw(); } w.treat.forEach(function (qid) { st.queue.push({ k: "q", id: qid }); }); st.queue.push({ k: "next" }); save(); return draw(true); }
      if (act === "view") { st.queue.unshift({ k: "result", test: id, view: 1 }); return draw(true); }
      if (act === "next") {
        st.queue.shift(); save(); return draw(true);
      }
      if (act === "opt") {
        var qi = st.queue[0].k === "q" ? 0 : 1, item = st.queue[qi], s = q(item.id), d = Q(item.id), j = +b.getAttribute("data-j");
        if (j === 0) { d.done = 1; st.queue.splice(0, qi + 1); save(); return draw(true); }
        d.wrong.push(j);
        var br = s.branch && s.branch[j];
        if (br && !st.seenBranch) {
          st.seenBranch = br; d.done = 1; d.branched = 1;
          /* the branch replaces the rest of this scene; its results stay readable from the chart */
          st.queue = c.branches[br].map(function (x) { return typeof x === "string" ? { k: "q", id: x } : { k: "event", ev: x.event }; }).concat([{ k: "next" }]);
          save(); return draw(true);
        }
        save(); return draw();
      }
    });
    el.addEventListener("change", function (e) {
      var b = e.target; if (b.getAttribute("data-act") !== "sel") return;
      var id = b.getAttribute("data-id"), i = ui.sel.indexOf(id);
      if (b.checked && i < 0) ui.sel.push(id); if (!b.checked && i > -1) ui.sel.splice(i, 1);
      draw();
    });
    draw();
    return { result: result, state: function () { return st; } };
  }
  window.SinaRounds = { play: play, phases: PH };
})();
