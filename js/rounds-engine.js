/* Rounds case engine (format 2): history, examination, tests, differential, decisions, branches and a debrief.
   Used by app.js for Advanced daily cases, and by the private preview page. No dependencies.
   SinaRounds.play(el, case, opts)
     opts.seed   string for the option order
     opts.load() saved state or null;  opts.save(state)
     opts.lec(id) -> { title, href } or null
     opts.done(result)  called once when the case ends: { score, total: 5, squares: ["g"|"y"|"r" x5], phases }
     opts.end(el, result)  renders extras under the debrief (share, leaderboard)  */
(function () {
  "use strict";
  var PHASES = [["history", "History"], ["exam", "Examination"], ["investigations", "Investigations"], ["diagnosis", "Diagnosis"], ["management", "Management"]];
  var VAL = { key: 1, useful: 0.5, low: 0, trap: 0 }, VLABEL = { key: "Key", useful: "Useful", low: "Low yield", trap: "Trap" };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function seeded(str) { var h = 1779033703 ^ str.length; for (var i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; } return function () { h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; }; }
  function fmt(x) { return String(Math.round(x * 100) / 100); }
  function num(x) { return typeof x === "number" ? x.toLocaleString("en-GB") : x; }

  function play(el, c, o) {
    var st = o.load() || null;
    if (!st || !st.path) st = { path: [[null, 0]], data: {}, ret: {}, seen: {} };
    function save() { o.save(st); }
    function stepAt(p) { return p[0] ? c.branches[p[0]][p[1]] : c.steps[p[1]]; }
    function cur() { return st.path[st.path.length - 1]; }
    function D(id) { return st.data[id] || (st.data[id] = {}); }
    function idxOf(id) { for (var i = 0; i < c.steps.length; i++) if (c.steps[i].id === id) return i; return -1; }
    function advance(branch) {
      var p = cur(), next;
      if (branch) { st.seen[branch] = 1; next = [branch, 0]; }
      else if (p[0]) next = p[1] + 1 < c.branches[p[0]].length ? [p[0], p[1] + 1] : [null, idxOf((c.rejoin || {})[p[0]])];
      else next = [null, p[1] + 1];
      if (!next[0] && (next[1] < 0 || next[1] >= c.steps.length)) { st.finished = true; }
      else st.path.push(next);
      save();
    }
    function order(id, n) { var r = seeded((o.seed || "") + "|" + id), a = []; for (var i = 0; i < n; i++) a.push(i); for (i = n - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function ordered() { var m = {}; st.path.forEach(function (p) { var s = stepAt(p); if (s.type === "order" && D(s.id).done) (D(s.id).picked || []).forEach(function (k) { m[s.items[k].id] = 1; }); }); return m; }

    /* ---- clock, vitals, tracker ---- */
    function minutes() {
      var m = 0; st.path.forEach(function (p) { var s = stepAt(p), d = D(s.id);
        if ((s.type === "ask" || s.type === "examine") && d.picked) m += d.picked.length * (s.cost || 0);
        if (s.type === "order" && d.done) d.picked.forEach(function (k) { m += s.items[k].min || 0; }); });
      return m;
    }
    function vitals() { var v = {}, k; for (k in c.vitals) v[k] = c.vitals[k]; st.path.forEach(function (p) { var s = stepAt(p); if (s.type === "event" && s.vitals) for (k in s.vitals) v[k] = s.vitals[k]; }); return v; }
    function vbad(k, x) {
      if (k === "hr") return x > 100 || x < 60; if (k === "rr") return x > 20 || x < 12; if (k === "spo2") return x < 95;
      if (k === "bp") return +String(x).split("/")[0] < 90; if (k === "t") { var t = parseFloat(x); return t >= 38 || t < 36; } return false;
    }
    function tracker() { var names = null; st.path.forEach(function (p) { var s = stepAt(p); if (s.type === "ddx" && D(s.id).done) names = D(s.id).picked.map(function (k) { return s.items[k].name; }); }); return names; }
    function barHTML() {
      var v = vitals(), L = [["hr", "HR", "/min"], ["bp", "BP", ""], ["rr", "RR", "/min"], ["spo2", "SpO₂", "%"], ["t", "T", ""]];
      var tr = tracker();
      return '<div class="rv-bar" role="status" aria-label="Patient status"><div class="rv-vitals">' + L.map(function (x) { return '<span class="rv-v' + (vbad(x[0], v[x[0]]) ? " bad" : "") + '"><b>' + x[1] + "</b> " + esc(v[x[0]]) + x[2] + "</span>"; }).join("") +
        '<span class="rv-v rv-clock"><b>Time</b> ' + minutes() + " min</span></div>" + (tr ? '<div class="rv-ddx"><b>Your top 3</b> ' + tr.map(function (n, i) { return '<span class="rv-chip">' + (i + 1) + ". " + esc(n) + "</span>"; }).join("") + "</div>" : "") + "</div>";
    }

    /* ---- scoring ---- */
    function partScore(s) {
      var d = D(s.id);
      if (s.type === "ask" || s.type === "examine") {
        var vals = s.items.map(function (it) { return VAL[it.v]; }).sort(function (a, b) { return b - a; }), best = 0;
        for (var i = 0; i < s.pick; i++) best += vals[i] || 0;
        var got = (d.picked || []).reduce(function (a, k) { return a + VAL[s.items[k].v]; }, 0);
        return best ? Math.min(1, got / best) : 1;
      }
      if (s.type === "order") {
        var keys = s.items.filter(function (it) { return it.v === "key"; }).length, hit = 0, low = 0;
        (d.picked || []).forEach(function (k) { if (s.items[k].v === "key") hit++; if (s.items[k].v === "low") low++; });
        return Math.max(0, Math.min(1, (keys ? hit / keys : 1) - 0.25 * low));
      }
      if (s.type === "ddx") {
        var names = (d.picked || []).map(function (k) { return s.items[k]; }), needOk = s.items.every(function (it) { return !it.need || names.indexOf(it) > -1; });
        return !needOk ? 0 : names.some(function (it) { return it.out; }) ? 0.5 : 1;
      }
      if (s.type === "mcq") { if (d.branched) return 0; var w = (d.wrong || []).length; return w === 0 ? 1 : w === 1 ? 0.5 : 0; }
      return null;
    }
    function result() {
      var acc = {}, harm = {}; PHASES.forEach(function (p) { acc[p[0]] = []; });
      st.path.forEach(function (p) { var s = stepAt(p); if (s.phase && acc[s.phase]) { var v = partScore(s); if (v !== null) acc[s.phase].push(v); if (D(s.id).branched) harm[s.phase] = 1; } });
      var phases = {}, squares = [], total = 0;
      PHASES.forEach(function (p) { var a = acc[p[0]], v = a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : 1; if (harm[p[0]]) v = Math.min(v, 0.35);   /* a decision that harmed the patient keeps that phase red */ phases[p[0]] = v; total += v; squares.push(v >= 0.75 ? "g" : v >= 0.4 ? "y" : "r"); });
      return { score: Math.round(total * 2) / 2, total: 5, squares: squares, phases: phases };
    }

    /* ---- pieces ---- */
    function srcHTML(s) {
      var seen = {}, links = (s.src || []).map(function (r) { return r.lec; }).filter(function (l) { if (seen[l]) return false; seen[l] = 1; return true; }).map(function (l) { var x = o.lec(l); return x ? (x.href ? '<a href="' + esc(x.href) + '"' + (x.ext ? ' target="_blank" rel="noopener"' : "") + ">" + esc(x.title) + "</a>" : esc(x.title)) : ""; }).filter(Boolean);
      return (links.length ? '<p class="rv-src"><span>From the lectures:</span> ' + links.join(" · ") + "</p>" : "") + (s.beyond ? '<p class="rv-beyond"><span class="rv-tag">Beyond the course</span> ' + esc(s.beyond) + "</p>" : "");
    }
    function tag(v) { return '<span class="rv-val ' + v + '">' + VLABEL[v] + "</span>"; }
    function labsHTML(rows) {
      return '<div class="rv-labs"><table><thead><tr><th>Test</th><th>Result</th><th>Normal</th></tr></thead><tbody>' + rows.map(function (r) {
        var flag = r[1] > r[4] ? "H" : r[1] < r[3] ? "L" : "";
        return "<tr" + (flag ? ' class="ab"' : "") + "><td>" + esc(r[0]) + '</td><td class="num">' + esc(num(r[1])) + " " + esc(r[2]) + (flag ? ' <b class="rv-flag">' + flag + "</b>" : "") + '</td><td class="num">' + esc(num(r[3])) + " to " + esc(num(r[4])) + "</td></tr>";
      }).join("") + "</tbody></table></div>";
    }

    /* ---- steps ---- */
    function stepHTML(p, live) {
      var s = stepAt(p), d = D(s.id), h = '<section class="rv-step" data-sid="' + esc(s.id) + '"><p class="rv-at">' + esc(s.at) + (p[0] ? ' <span class="rv-branch">Your earlier decision</span>' : "") + "</p>";
      if (s.text) h += '<p class="rv-text">' + esc(s.text) + "</p>";
      if (s.type === "event") {
        if (s.ifOrdered) { var od = ordered(), k = Object.keys(s.ifOrdered).filter(function (x) { return x !== "none"; })[0]; h += '<p class="rv-text">' + esc(od[k] ? s.ifOrdered[k] : s.ifOrdered.none) + "</p>"; }
        if (s.vitals) h += '<p class="rv-meta">New vitals are shown in the bar above.</p>';
        if (s.why) h += '<p class="rv-why rv-warn">' + esc(s.why) + "</p>";
        if (live) h += '<button class="btn primary rv-go" type="button" data-act="next">Continue</button>';
      }
      else if (s.type === "ask" || s.type === "examine") {
        var picked = d.picked || [], full = picked.length >= s.pick;
        h += '<p class="rv-meta">' + (s.type === "ask" ? "Up to " + s.pick + " questions" : "Up to " + s.pick + " examinations") + (s.cost ? " · " + s.cost + " min each" : "") + " · " + (s.pick - picked.length) + " left</p>";
        s.items.forEach(function (it, k) {
          var on = picked.indexOf(k) > -1;
          if (on) h += '<div class="rv-qa"><p class="rv-q">' + esc(it.q || it.name) + (d.done ? " " + tag(it.v) : "") + '</p><p class="rv-a">' + esc(it.a || it.finding) + "</p>" + (d.done && it.why ? '<p class="rv-note">' + esc(it.why) + "</p>" : "") + "</div>";
          else if (!d.done) h += '<button class="rv-pick" type="button" data-act="pick" data-k="' + k + '"' + (full ? " disabled" : "") + ">" + esc(it.q || it.name) + "</button>";
        });
        if (!d.done) h += '<button class="btn primary rv-go" type="button" data-act="done"' + (picked.length ? "" : " disabled") + ">" + (full ? "Continue" : "Done, continue") + "</button>";
      }
      else if (s.type === "order") {
        if (!d.done) {
          var sel = d.sel || [], mins = sel.reduce(function (a, k) { return a + s.items[k].min; }, 0);
          h += '<p class="rv-meta">Up to ' + s.pick + " tests · " + (s.pick - sel.length) + " left</p>";
          s.items.forEach(function (it, k) { var on = sel.indexOf(k) > -1; h += '<label class="rv-check' + (on ? " on" : "") + '"><input type="checkbox" data-act="sel" data-k="' + k + '"' + (on ? " checked" : "") + (!on && sel.length >= s.pick ? " disabled" : "") + "><span>" + esc(it.name) + '</span><span class="rv-min">' + it.min + " min</span></label>"; });
          h += '<button class="btn primary rv-go" type="button" data-act="order"' + (sel.length ? "" : " disabled") + ">" + (sel.length ? "Order " + sel.length + " test" + (sel.length > 1 ? "s" : "") + " (" + mins + " min)" : "Choose at least one test") + "</button>";
        } else {
          d.picked.forEach(function (k) { var it = s.items[k]; h += '<div class="rv-result"><p class="rv-q">' + esc(it.name) + " " + tag(it.v) + "</p>" + (it.labs ? labsHTML(it.labs) : '<p class="rv-a">' + esc(it.result) + "</p>") + (it.note ? '<p class="rv-a rv-labnote">' + esc(it.note) + "</p>" : "") + '<p class="rv-note">' + esc(it.why) + "</p></div>"; });
        }
      }
      else if (s.type === "ddx") {
        var pk = d.done ? d.picked : (d.sel || []);
        h += '<div class="rv-chips">' + s.items.map(function (it, k) {
          var on = pk.indexOf(k) > -1, cls = "rv-dx" + (on ? " on" : "") + (d.done ? (it.need ? " need" : it.out && on ? " out" : "") : "");
          return d.done ? '<span class="' + cls + '">' + (on ? (pk.indexOf(k) + 1) + ". " : "") + esc(it.name) + "</span>" : '<button type="button" class="' + cls + '" data-act="dx" data-k="' + k + '" aria-pressed="' + on + '"' + (!on && pk.length >= s.pick ? " disabled" : "") + ">" + (on ? (pk.indexOf(k) + 1) + ". " : "") + esc(it.name) + "</button>";
        }).join("") + "</div>";
        if (!d.done) h += '<button class="btn primary rv-go" type="button" data-act="dxok"' + (pk.length === s.pick ? "" : " disabled") + ">" + (pk.length === s.pick ? "Confirm my top " + s.pick : "Pick " + (s.pick - pk.length) + " more") + "</button>";
        else h += '<ul class="rv-dxwhy">' + s.items.filter(function (it, k) { return pk.indexOf(k) > -1 || it.need; }).map(function (it) { return "<li><b>" + esc(it.name) + (it.need && pk.indexOf(s.items.indexOf(it)) < 0 ? " (missed)" : "") + ":</b> " + esc(it.why) + "</li>"; }).join("") + "</ul>";
      }
      else if (s.type === "mcq") {
        h += '<p class="rv-qtext">' + esc(s.q) + "</p>";
        var wrong = d.wrong || [];
        order(s.id, s.options.length).forEach(function (j, k) {
          var cls = d.done && j === 0 ? " correct" : wrong.indexOf(j) > -1 ? " wrong" : "", show = j > 0 && (d.done || wrong.indexOf(j) > -1);
          h += '<button class="opt' + cls + '" data-act="opt" data-j="' + j + '"' + (d.done || wrong.indexOf(j) > -1 ? " disabled" : "") + '><span class="letter">' + "ABCD".charAt(k) + '</span><span class="rv-ob">' + esc(s.options[j]) + (show ? '<span class="onote">' + esc(s.notes[j]) + "</span>" : "") + "</span></button>";
        });
        if (d.done) h += '<p class="rv-why">' + (d.branched ? "<b>The better choice was:</b> " + esc(s.options[0]) + ". " : "") + esc(s.why) + "</p>" + srcHTML(s);
      }
      return h + "</section>";
    }
    function debriefHTML(r) {
      var db = c.debrief || {}, h = '<section class="rv-end"><p class="rv-at">Final diagnosis</p><h2>' + esc(c.dx) + "</h2>";
      h += '<p class="rv-score">' + fmt(r.score) + " / 5</p><div class=\"rv-phases\">" + PHASES.map(function (p, i) { return '<div class="rv-ph"><i class="rd-sq ' + r.squares[i] + '"></i><span>' + p[1] + "</span></div>"; }).join("") + "</div>";
      if (db.reasoning) h += "<h3>How the diagnosis was reached</h3><ol>" + db.reasoning.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol>";
      if (db.table) h += '<h3>Differential diagnosis</h3><div class="rv-labs"><table><thead><tr><th>Diagnosis</th><th>For</th><th>Against</th></tr></thead><tbody>' + db.table.map(function (t) { return "<tr><td><b>" + esc(t[0]) + "</b></td><td>" + esc(t[1]) + "</td><td>" + esc(t[2]) + "</td></tr>"; }).join("") + "</tbody></table></div>";
      var miss = [];
      st.path.forEach(function (p) { var s = stepAt(p), d = D(s.id);
        if (s.type === "ask" || s.type === "examine") s.items.forEach(function (it, k) { if ((d.picked || []).indexOf(k) < 0 && (it.v === "key" || it.v === "useful")) miss.push((s.type === "ask" ? "Not asked: " : "Not examined: ") + (it.q || it.name) + " → " + (it.a || it.finding)); });
        if (s.type === "order") s.items.forEach(function (it, k) { var on = (d.picked || []).indexOf(k) > -1; if (!on && it.v === "key") miss.push("Not ordered: " + it.name + " (" + it.why + ")"); if (on && it.v === "low") miss.push("Low yield: " + it.name + ". " + it.why); }); });
      if (miss.length) h += "<h3>What you missed</h3><ul>" + miss.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
      var beyond = [], lecs = {}, lorder = [];
      st.path.forEach(function (p) { var s = stepAt(p); (s.src || []).forEach(function (x) { if (!lecs[x.lec]) { lecs[x.lec] = 1; lorder.push(x.lec); } }); });
      c.steps.concat.apply(c.steps, Object.keys(c.branches || {}).map(function (b) { return c.branches[b]; })).forEach(function (s) { if (s.beyond && beyond.indexOf(s.beyond) < 0) beyond.push(s.beyond); });   /* every beyond-the-course point in the case, even on a path not taken */
      if (lorder.length) h += "<h3>Lectures behind this case</h3><ul>" + lorder.map(function (l) { var x = o.lec(l); return x ? "<li>" + (x.href ? '<a href="' + esc(x.href) + '"' + (x.ext ? ' target="_blank" rel="noopener"' : "") + ">" + esc(x.title) + "</a>" : esc(x.title)) + "</li>" : ""; }).join("") + "</ul>";
      if (beyond.length) h += '<h3>Beyond the course</h3><p class="rv-meta">Not taught on Sina yet; checked against standard references.</p><ul>' + beyond.map(function (x) { return '<li><span class="rv-tag">Beyond the course</span> ' + esc(x) + "</li>"; }).join("") + "</ul>";
      if (db.takeaways) h += "<h3>Exam takeaways</h3><ul>" + db.takeaways.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
      return h + '<div id="rv-extra"></div></section>';
    }

    /* ---- draw and act ---- */
    function draw(focus) {
      var h = barHTML() + '<p class="rv-level">' + esc(c.level) + '</p><section class="rv-step rv-intro"><p class="rv-at">Arrival</p><p class="rv-text">' + esc(c.intro) + "</p></section>";
      st.path.forEach(function (p, i) { h += stepHTML(p, !st.finished && i === st.path.length - 1); });
      var r = null;
      if (st.finished) { r = result(); h += debriefHTML(r); }
      el.innerHTML = h;
      if (r) { if (!st.reported) { st.reported = 1; save(); if (o.done) o.done(r); } if (o.end) o.end(el.querySelector("#rv-extra"), r); }
      if (focus) { var t = st.finished ? el.querySelector(".rv-end") : el.querySelectorAll(".rv-step")[el.querySelectorAll(".rv-step").length - 1]; if (t && t.scrollIntoView) t.scrollIntoView({ behavior: "smooth", block: "start" }); }
    }
    el.addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]"); if (!b || b.disabled || st.finished) return;
      var s = stepAt(cur()), d = D(s.id), act = b.getAttribute("data-act"), k = +b.getAttribute("data-k");
      if (!b.closest('[data-sid="' + s.id + '"]')) return;
      if (act === "next") { d.done = 1; advance(); return draw(true); }
      if (act === "pick") { d.picked = d.picked || []; if (d.picked.indexOf(k) < 0 && d.picked.length < s.pick) d.picked.push(k); save(); return draw(); }
      if (act === "done") { d.done = 1; advance(); return draw(true); }
      if (act === "order") { d.picked = (d.sel || []).slice().sort(function (a, b) { return a - b; }); d.done = 1; advance(); return draw(true); }
      if (act === "dx") { d.sel = d.sel || []; var i = d.sel.indexOf(k); if (i > -1) d.sel.splice(i, 1); else if (d.sel.length < s.pick) d.sel.push(k); save(); return draw(); }
      if (act === "dxok") { d.picked = d.sel.slice(); d.done = 1; advance(); return draw(true); }
      if (act === "opt") {
        var j = +b.getAttribute("data-j"), br = s.branch && s.branch[j];
        if (j === 0) { d.done = 1; advance(); return draw(true); }
        d.wrong = d.wrong || []; d.wrong.push(j);
        if (br && !st.seen[br]) { d.done = 1; d.branched = 1; advance(br); return draw(true); }
        save(); return draw();
      }
    });
    el.addEventListener("change", function (e) {
      var b = e.target; if (b.getAttribute("data-act") !== "sel" || st.finished) return;
      var s = stepAt(cur()), d = D(s.id), k = +b.getAttribute("data-k"); d.sel = d.sel || [];
      var i = d.sel.indexOf(k); if (b.checked && i < 0 && d.sel.length < s.pick) d.sel.push(k); if (!b.checked && i > -1) d.sel.splice(i, 1);
      save(); draw();
    });
    draw();
    return { result: result, state: function () { return st; } };
  }
  window.SinaRounds = { play: play, phases: PHASES };
})();
