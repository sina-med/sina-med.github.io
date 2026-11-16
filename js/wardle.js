/* Wardle: one patient a day, guessed stage by stage. Each stage asks for one answer typed from a fixed list (autocomplete,
   synonyms accepted). Each wrong guess reveals the next clue and shows how close it was on three properties.
   Points per stage: 1, 0.75, 0.5, 0.25, then 0 after the fifth wrong guess. Answers stay hidden until the case ends.
   SinaWardle.play(box, case, opts). opts: title, lists, attr, slips, load() -> saved state, save(state), lec(id) -> {title, href},
   done({score, squares}), end(element) to add sharing and the leaderboard under the result. */
(function () {
  var PTS = [1, 0.75, 0.5, 0.25, 0];
  var HOLD = { dx: "Type a diagnosis", wall: "Type a wall of the heart", artery: "Type an artery", tx: "Type a test or treatment", syn: "Type a thoracic syndrome", gas: "Type an acid-base disorder", abx: "Type a drug", test: "Type a test", rhythm: "Type a rhythm", thy: "Type a thyroid pattern", field: "Type a visual field defect", jaund: "Type a type of jaundice", bleed: "Type a bleeding site", act: "Type an action", gdrug: "Type a drug", dys: "Type a type of dysphagia", dmech: "Type a mechanism", csf: "Type a CSF pattern", germ: "Type a germ", bone: "Type a bone or part of one", nerve: "Type a nerve", move: "Type a movement", muscle: "Type a muscle", space: "Type a space, groove or canal", uartery: "Type an artery", gdx: "Type a disease", mut: "Type a mutation type", inh: "Type a mode of inheritance", risk: "Type a risk", gtest: "Type a test", chrom: "Type a chromosomal anomaly", ig: "Type an antibody class", shock: "Type a type of shock", edrug: "Type a drug or treatment", plasmo: "Type a Plasmodium species", ce: "Type a WHO stage", htx: "Type a treatment", host: "Type an animal", zone: "Type an adrenal layer", buffer: "Type a buffer", organ: "Type an organ", gconcept: "Type a genetics concept", axwall: "Type a wall of the axilla" };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim(); }
  function ans(s) { return [].concat(s.answer); }
  function showAns(s) { return s.show || ans(s)[0]; }
  function fmt(x) { return String(Math.round(x * 100) / 100); }

  /* ECG: an illustration from a simple waveform model */
  function gs(x, c, w, a) { return a * Math.exp(-((x - c) * (x - c)) / (2 * w * w)); }
  function lead(st, r) {
    var d = "", W = 120, H = 56, base = H * 0.6;
    for (var x = 0; x <= W; x++) {
      var y = 0;
      for (var k = 0; k < 2; k++) { var c = 60 * (k + 0.45), s = 60 / 82; y += gs(x, c - 16 * s, 3 * s, 4) + gs(x, c - 2 * s, 1.6 * s, -3) + gs(x, c, 2 * s, r) + gs(x, c + 3 * s, 1.8 * s, -5); if (x > c + 5 * s && x < c + 18 * s) y += st; y += gs(x, c + 24 * s, 5 * s, 6 + Math.max(st, 0) * 0.6); }
      d += (x ? "L" : "M") + x + " " + (base - y).toFixed(1);
    }
    return d;
  }

  function play(box, C, o) {
    var L = o.lists, A = o.attr, N = C.stages.length;
    function fresh() { return { stage: 0, tries: C.stages.map(function () { return []; }), solved: C.stages.map(function () { return null; }), view: "menu" }; }
    var S = o.load && o.load(); if (!S || !S.tries || S.tries.length !== N) S = fresh();
    var ui = { q: "", pick: null, active: 0, open: {}, msg: "", fresh: false, enter: true, how: false };
    function save() { if (o.save) o.save(S); }

    function pts(i) { var s = S.solved[i]; return s === null || s === -1 ? 0 : PTS[s]; }
    function tone(i) { var s = S.solved[i]; return s === null ? "" : s === -1 ? "s0" : s === 0 ? "s1" : s <= 2 ? "s2" : "s3"; }
    function total() { var t = 0; for (var i = 0; i < N; i++) t += pts(i); return t; }
    function squares() { return C.stages.map(function (s, i) { return { s1: "g", s2: "y", s3: "r", s0: "k" }[tone(i)] || "k"; }); }

    function compare(list, g, a) {
      var X = A[list], gv = X.v[g], av = X.v[a], near = X.near || [];
      return X.cols.map(function (col, k) {
        var x = gv[k], y = av[k];
        if (Array.isArray(x)) { var ov = x.filter(function (l) { return y.indexOf(l) > -1; }).length, same = ov === y.length && x.length === y.length; return { t: same ? "Same" : ov ? "Some" : "None", c: same ? "y" : ov ? "p" : "n" }; }
        if (x === y) return { t: x, c: "y" };
        return { t: x, c: near.some(function (p) { return (p[0] === x && p[1] === y) || (p[1] === x && p[0] === y); }) ? "p" : "n" };
      });
    }
    function closeWords(list, g, a) {
      var r = compare(list, g, a), cols = A[list].cols, same = [], diff = [];
      r.forEach(function (x, k) { (x.c === "y" ? same : diff).push(cols[k].toLowerCase()); });
      return (same.length ? "Right " + same.join(" and ") : "Nothing in common") + (diff.length && same.length ? "; wrong " + diff.join(" and ") : "") + ".";
    }
    function matches(list, q) {
      var n = norm(q); if (!n) return [];
      var out = [];
      L[list].forEach(function (e) {
        var best = -1, via = "";
        [e[0]].concat(e[1]).forEach(function (nm, i) {
          var m = norm(nm), sc = m.indexOf(n) === 0 ? 4 : (" " + m).indexOf(" " + n) > -1 ? 3 : m.indexOf(n) > -1 ? 2 : n.split(" ").every(function (w) { return (" " + m).indexOf(" " + w) > -1; }) ? 1 : -1;
          if (sc > best) { best = sc; via = i ? nm : ""; }
        });
        if (best > -1) out.push({ e: e, sc: best, via: via });
      });
      return out.sort(function (a, b) { return b.sc - a.sc || a.e[0].localeCompare(b.e[0]); }).slice(0, 8);
    }

    function ecgHTML(annot) {
      var E = C.ecg;
      return '<figure class="wl-ecg"><div class="wl-ecg-grid">' + E.leads.map(function (l) { var n = E.notes[l[0]]; return '<div><div class="wl-paper"><svg viewBox="0 0 120 56" preserveAspectRatio="none" aria-hidden="true"><path d="' + lead(l[1], l[2]) + '"/></svg><span>' + l[0] + "</span></div>" + (annot ? '<p class="wl-cap wl-' + (n[1] || "flat") + '">' + n[0] + "</p>" : "") + "</div>"; }).join("") +
        '</div><figcaption class="wl-cap">' + esc(E.caption) + "</figcaption></figure>";
    }
    function slipHTML(k) {
      var x = o.slips[k];
      return '<div class="wl-slip"><div class="wl-slip-h"><b>' + esc(x[0]) + "</b><span>" + esc(x[1]) + "</span></div>" +
        (typeof x[2][0] === "string" ? x[2].map(function (l) { return "<p><b>" + esc(l) + "</b></p>"; }).join("") :
          '<table><tr><th>Test</th><th class="r">Result</th><th class="r">Reference</th></tr>' + x[2].map(function (r) { return "<tr><td>" + esc(r[0]) + '</td><td class="r"><b>' + esc(r[1]) + '</b></td><td class="r">' + esc(r[2]) + "</td></tr>"; }).join("") + "</table>") +
        '<p class="wl-slip-f">' + esc(x[3]) + "</p></div>";
    }
    function srcHTML(list) {
      return list.map(function (x) { var l = o.lec && o.lec(x[0]); return l ? '<a href="' + l.href + '">' + esc(l.title) + "</a> · Year " + x[2] : esc(x[1]) + " · Year " + x[2]; }).join("<br>");
    }

    /* "learn more": a video search on one channel and a free reference, per option (never a guessed URL to a specific page) */
    var ANAT = { bone: 1, nerve: 1, move: 1, muscle: 1, space: 1, uartery: 1 }, NOLINK = { risk: 1, act: 1 };
    function q(x) { return encodeURIComponent(x); }
    function learnHTML(list, name) {
      if (NOLINK[list]) return "";
      var w = ANAT[list] ? ["Kenhub", "https://www.youtube.com/results?search_query=" + q("Kenhub " + name)] : ["Osmosis", "https://www.youtube.com/results?search_query=" + q("Osmosis " + name)],
        r = ANAT[list] ? ["TeachMeAnatomy", "https://teachmeanatomy.info/?s=" + q(name)] : ["StatPearls", "https://www.ncbi.nlm.nih.gov/books/?term=" + q(name + " StatPearls")];
      var L = o.inLecture && o.inLecture(list, name);
      return '<span class="wl-lm">' + (L ? '<a href="' + L.href + '">In Sina: ' + esc(L.title) + "</a>" : "") + '<a href="' + w[1] + '" target="_blank" rel="noopener">▶ ' + w[0] + '</a><a href="' + r[1] + '" target="_blank" rel="noopener">' + r[0] + "</a></span>";
    }
    function beyond(list, name) { return !!(o.beyond && o.beyond(list, name)); }
    function steps() {
      return '<ol class="wl-steps" aria-label="Stage ' + Math.min(S.stage + 1, N) + " of " + N + '">' + C.stages.map(function (s, i) {
        var cls = tone(i) || (i === S.stage && S.view === "play" ? "cur" : "");
        return '<li class="' + cls + '"><i></i><span>' + esc(s.label) + "</span></li>";
      }).join("") + "</ol>";
    }
    function head() { return '<div class="wl-top"><h1 class="wl-name">' + esc(o.title || "Clinidle") + '</h1><span class="wl-pts">' + fmt(total()) + " pts</span></div>" + steps(); }
    function patient() {
      return '<section class="wl-pt" aria-label="Patient"><div class="wl-pt-h"><b>' + esc(C.who) + '</b><span class="wl-tag">' + esc(C.tag) + '</span></div><div class="wl-vit">' +
        C.vit.map(function (v) { return "<div><small>" + esc(v[0]) + "</small><b>" + esc(v[1]) + "</b></div>"; }).join("") + '</div><p class="wl-line">' + esc(C.line) + "</p></section>";
    }
    function listHTML() {
      var s = C.stages[S.stage], tries = S.tries[S.stage], list = matches(s.list, ui.q);
      if (!ui.q || ui.pick) return "";
      return list.length ? list.map(function (m, k) { var used = tries.indexOf(m.e[0]) > -1; return '<li role="option" id="wl-o' + k + '" data-v="' + esc(m.e[0]) + '" aria-selected="' + (k === ui.active) + '"' + (used ? ' class="used" aria-disabled="true"' : "") + ">" + esc(m.e[0]) + "<small>" + esc(m.via ? "“" + m.via + "”" : beyond(s.list, m.e[0]) ? "Beyond the course" : m.e[2]) + "</small></li>"; }).join("") : '<li class="none">Not in the list. Try another term.</li>';
    }
    function playHTML() {
      var i = S.stage, s = C.stages[i], tries = S.tries[i], solved = S.solved[i] !== null && S.solved[i] !== -1, out = !solved && tries.length >= s.hints.length;
      var shown = Math.min(tries.length + 1, s.hints.length);
      var h = head() + patient() + '<section class="wl-stage' + (ui.enter ? " wl-enter" : "") + '"><p class="wl-lab">Stage ' + (i + 1) + " of " + N + " · " + esc(s.label) + '</p><p class="wl-ev">' + esc(s.ev) + "</p>";
      if (s.ecg) h += ecgHTML(false);
      if (s.slip) h += slipHTML(s.slip);
      h += '<h2 class="wl-q">' + esc(s.q) + '</h2><p class="wl-lab">Clues</p><ol class="wl-hints">' + s.hints.slice(0, shown).map(function (t, k) { return "<li" + (ui.fresh && k === shown - 1 && k ? ' class="new"' : "") + "><b>" + (k + 1) + "</b><span>" + esc(t) + "</span></li>"; }).join("") + "</ol>";
      if (tries.length) h += '<div class="wl-tries" aria-label="Wrong guesses and how close they were"><div class="wl-tr wl-tr-h"><span>Your guesses</span>' + A[s.list].cols.map(function (c) { return "<span>" + esc(c) + "</span>"; }).join("") + "</div>" +
        tries.map(function (t) { return '<div class="wl-tr"><span>' + esc(t) + "</span>" + compare(s.list, t, ans(s)[0]).map(function (x) { return '<span class="wl-tg ' + x.c + '">' + esc(x.t) + "</span>"; }).join("") + "</div>"; }).join("") + "</div>";
      if (solved) {
        h += '<div class="wl-fb" role="status"><b>Correct · +' + fmt(pts(i)) + " pt" + (pts(i) === 1 ? "" : "s") + "</b><span>" + esc(S.tries[i].length ? "Found after " + S.tries[i].length + " wrong guess" + (S.tries[i].length > 1 ? "es" : "") + "." : "First try.") + "</span></div>" +
          '<button type="button" class="wl-btn primary" data-a="next">' + (i === N - 1 ? "See the result" : "Next: " + esc(C.stages[i + 1].label)) + "</button>";
      } else if (!out) {
        h += '<label class="wl-lab" for="wl-g">Your answer</label><div class="wl-combo"><form class="wl-field" autocomplete="off"><input id="wl-g" role="combobox" aria-expanded="false" aria-controls="wl-lb" aria-autocomplete="list" placeholder="' + esc(HOLD[s.list] || "Type an answer") + '" value="' + esc(ui.pick || ui.q) + '"><button type="submit"' + (ui.pick ? "" : " disabled") + ">Guess</button></form>" +
          '<ul class="wl-list" id="wl-lb" role="listbox" hidden></ul></div><p class="wl-note" role="status">' + esc(ui.msg) + '</p><p class="wl-meta">This guess: ' + fmt(PTS[Math.min(tries.length, 4)]) + " pt" + (tries.length ? "s" : "") + "</p>";
      } else h += '<p class="wl-note">No more clues. The answer stays hidden until the debrief.</p><button type="button" class="wl-btn" data-a="skip">Move on</button>';
      return h + "</section>";
    }
    function menuHTML() {
      var h = '<div class="wl-menu"><p class="wl-lab">' + esc(o.kicker || "Today's patient") + '</p><h1 class="wl-name">' + esc(o.title || "Clinidle") + "</h1>" +
        '<p class="wl-intro">A patient arrives. Work out what is going on, one stage at a time: the diagnosis, the exam, the results, the treatment, what happens next.</p>' +
        '<div class="wl-menu-b"><button type="button" class="wl-btn primary" data-a="start">Play</button><button type="button" class="wl-btn" data-a="how" aria-expanded="' + ui.how + '">How to play</button></div>';
      if (ui.how) h += '<ol class="wl-how"><li>Each stage asks one question. Type your answer and pick it from the list.</li><li>A wrong guess shows how close it was: green matches, yellow is close, grey is wrong. It also reveals a new clue.</li><li>Points per stage: 1, 0.75, 0.5, 0.25, then 0 after five wrong guesses.</li><li>Answers stay hidden until the end. The debrief explains every one, with the lecture it comes from.</li><li>One new patient a day. Your score counts on the day only.</li></ol>';
      return h + "</div>";
    }
    function endHTML() {
      var t = total();
      return head() + '<div class="wl-done"><div class="wl-reveal"><p class="wl-lab">The diagnosis</p><h2>' + esc(C.dx) + "</h2><p>" + esc(C.outcome) + "</p></div>" +
        '<ol class="wl-ans">' + C.stages.map(function (s, i) { return '<li><i class="' + tone(i) + '"></i><small>' + esc(s.label) + "</small><b>" + esc(showAns(s)) + "</b></li>"; }).join("") + "</ol>" +
        '<div class="wl-score"><span>Your round</span><span><b>' + fmt(t) + "</b><small> / " + N + "</small></span></div>" +
        '<div class="wl-sq">' + C.stages.map(function (s, i) { var n = S.tries[i].length + 1; return '<div><i class="' + tone(i) + '"></i><span>' + esc(s.label) + "<br>" + (S.solved[i] === -1 ? "unsolved" : n + (n === 1 ? " try" : " tries")) + "</span></div>"; }).join("") + "</div>" +
        '<button type="button" class="wl-btn primary" data-a="debrief">Open the debrief</button><div id="wl-extra"></div></div>';
    }
    function debriefHTML() {
      var all = C.stages.every(function (x, i) { return ui.open[i]; });
      var h = '<div class="wl-top"><h1 class="wl-name">' + esc(o.title || "Clinidle") + ' · Debrief</h1><span class="wl-pts">' + fmt(total()) + "/" + N + "</span></div>";
      h += '<div class="wl-reveal"><p class="wl-lab">' + esc(C.outcome) + "</p><h2>" + esc(C.dx) + "</h2></div>";
      h += '<div class="wl-bar"><span>Tap a stage to see why.</span><button type="button" data-a="all">' + (all ? "Collapse all" : "Expand all") + "</button></div>";
      C.stages.forEach(function (s, i) {
        var open = !!ui.open[i], tr = S.tries[i];
        h += '<section class="wl-st"><button type="button" class="wl-st-h" data-st="' + i + '" aria-expanded="' + open + '"><i class="' + tone(i) + '"></i><span><small>' + (i + 1) + " · " + esc(s.label) + "</small><b>" + esc(showAns(s)) + "</b></span><em>" + fmt(pts(i)) + " pt</em></button>";
        if (open) {
          h += '<div class="wl-st-b">';
          if (s.ecg) h += ecgHTML(true);
          if (s.slip) h += slipHTML(s.slip);
          h += '<p class="wl-why">' + esc(s.why) + '</p><div class="wl-cmp">' + s.contenders.map(function (c) {
            var ok = ans(s).indexOf(c[0]) > -1, yours = tr.indexOf(c[0]) > -1;
            return '<div class="wl-cr ' + (ok ? "ok" : "no") + '"><span class="mk" aria-label="' + (ok ? "right" : "wrong") + '">' + (ok ? "✓" : "✗") + '</span><span class="cn">' + esc(c[0]) + (yours ? " <em>your guess</em>" : "") + (beyond(s.list, c[0]) ? ' <em class="by">beyond the course</em>' : "") + '</span><span class="cw">' + esc(c[1]) + learnHTML(s.list, c[0]) + "</span></div>";
          }).join("") + tr.filter(function (t) { return !s.contenders.some(function (c) { return c[0] === t; }); }).map(function (t) {
            return '<div class="wl-cr no"><span class="mk" aria-label="wrong">✗</span><span class="cn">' + esc(t) + ' <em>your guess</em>' + (beyond(s.list, t) ? ' <em class="by">beyond the course</em>' : "") + '</span><span class="cw">' + esc(closeWords(s.list, t, ans(s)[0])) + learnHTML(s.list, t) + "</span></div>";
          }).join("") + "</div>";
          h += '<p class="wl-kc"><b>Key clue</b> ' + esc(s.hints[s.key]) + "</p>";
          h += '<details class="wl-clues"><summary>All ' + s.hints.length + " clues · you saw " + Math.min(tr.length + 1, s.hints.length) + "</summary><ol>" + s.hints.map(function (x, k) { return "<li" + (k <= tr.length ? "" : ' class="unseen"') + ">" + esc(x) + "</li>"; }).join("") + "</ol></details>";
          if (s.enrich) h += '<p class="wl-enr"><b>Beyond the course</b> ' + esc(s.enrich) + "</p>";
          h += '<p class="wl-src">' + srcHTML(s.src) + "</p></div>";
        }
        h += "</section>";
      });
      h += '<div class="wl-sec"><h2>For the exam</h2><ul>' + C.takeaways.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div>";
      var seen = {}, srcs = [];
      C.stages.forEach(function (s) { s.src.forEach(function (x) { if (!seen[x[0]]) { seen[x[0]] = 1; srcs.push(x); } }); });
      srcs.sort(function (a, b) { return a[2] - b[2]; });
      h += '<div class="wl-sec"><h2>Where it\'s taught</h2><p class="wl-src">' + srcHTML(srcs) + "</p></div>";
      h += '<div class="wl-sec"><h2>Go further</h2><p class="wl-src" style="margin:0 0 8px">Free resources for anything above, including topics your course hasn\'t covered yet.</p><ul class="wl-go">' +
        [["Osmosis", "https://www.youtube.com/@osmosis", "Short animated videos, one per disease."], ["Ninja Nerd", "https://www.youtube.com/@NinjaNerdOfficial", "Long whiteboard lectures, physiology to treatment."], ["Kenhub", "https://www.youtube.com/@kenhub", "Anatomy videos."],
         ["StatPearls", "https://www.ncbi.nlm.nih.gov/books/NBK430685/", "Free, peer-reviewed reference articles."], ["MSD Manual Professional", "https://www.msdmanuals.com/professional", "Concise clinical reference."], ["TeachMeAnatomy", "https://teachmeanatomy.info/", "Illustrated anatomy, with clinical notes."], ["Radiopaedia", "https://radiopaedia.org/", "Imaging cases for every condition."]]
          .map(function (x) { return '<li><a href="' + x[1] + '" target="_blank" rel="noopener">' + x[0] + "</a><span>" + x[2] + "</span></li>"; }).join("") + "</ul></div>";
      return h + '<p class="wl-back"><button type="button" data-a="back">Back to the result</button></p>';
    }

    function render(focus) {
      box.innerHTML = '<div class="wl">' + (S.view === "menu" ? menuHTML() : S.view === "play" ? playHTML() : S.view === "end" ? endHTML() : debriefHTML()) + "</div>";
      ui.fresh = false; ui.enter = false;
      if (S.view === "end" && o.end) o.end(box.querySelector("#wl-extra"));
      var g = box.querySelector("#wl-g");
      if (g) { drawList(); if (focus) { g.focus({ preventScroll: true }); var v = g.value; g.setSelectionRange(v.length, v.length); } }
    }
    /* typing only redraws the suggestion list, so the page never jumps */
    function drawList() {
      var lb = box.querySelector("#wl-lb"), g = box.querySelector("#wl-g"), b = box.querySelector(".wl-field button");
      if (!lb) return;
      var html = listHTML();
      lb.innerHTML = html; lb.hidden = !html;
      g.setAttribute("aria-expanded", String(!!html));
      var cur = lb.querySelector('[aria-selected="true"]'); if (cur) g.setAttribute("aria-activedescendant", cur.id); else g.removeAttribute("aria-activedescendant");
      b.disabled = !ui.pick;
    }
    function top() { var r = box.getBoundingClientRect(); if (r.top < 0) window.scrollTo({ top: window.scrollY + r.top - 80, behavior: "smooth" }); }
    function next() {
      ui.q = ""; ui.pick = null; ui.msg = ""; ui.active = 0; ui.enter = true;
      if (S.stage < N - 1) S.stage++;
      else { S.view = "end"; if (o.done) o.done({ score: total(), squares: squares() }); }
      save(); render(); top();
    }
    function guess(v) {
      var i = S.stage, s = C.stages[i];
      if (!v || S.tries[i].indexOf(v) > -1 || S.solved[i] !== null) return;
      if (ans(s).indexOf(v) > -1) { S.solved[i] = S.tries[i].length; ui.msg = ""; save(); render(); var bt = box.querySelector('[data-a="next"]'); if (bt) bt.focus({ preventScroll: true }); return; }
      S.tries[i].push(v); ui.q = ""; ui.pick = null; ui.active = 0; ui.msg = "Not " + v + ". A new clue is above."; ui.fresh = true; save(); render(true);
    }

    box.oninput = function (e) { if (e.target.id !== "wl-g") return; ui.q = e.target.value; ui.pick = null; ui.active = 0; var n = box.querySelector(".wl-note"); if (n) n.textContent = ""; ui.msg = ""; drawList(); };
    box.onkeydown = function (e) {
      if (e.target.id !== "wl-g") return;
      var all = box.querySelectorAll(".wl-list li[data-v]");
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && all.length) { e.preventDefault(); ui.active = (ui.active + (e.key === "ArrowDown" ? 1 : all.length - 1)) % all.length; drawList(); }
      if (e.key === "Enter" && !ui.pick) { e.preventDefault(); var cur = all[ui.active]; if (cur && !cur.classList.contains("used")) choose(cur.getAttribute("data-v")); }
      if (e.key === "Escape") { ui.q = ""; e.target.value = ""; drawList(); }
    };
    function choose(v) { ui.pick = v; var g = box.querySelector("#wl-g"); g.value = v; drawList(); g.focus({ preventScroll: true }); }
    box.onsubmit = function (e) { e.preventDefault(); if (ui.pick) guess(ui.pick); };
    box.onclick = function (e) {
      var li = e.target.closest(".wl-list li[data-v]");
      if (li) { if (!li.classList.contains("used")) choose(li.getAttribute("data-v")); return; }
      var t = e.target.closest("button"); if (!t || !box.contains(t)) return;
      var a = t.getAttribute("data-a");
      if (a === "start") { S.view = "play"; ui.enter = true; save(); render(); top(); }
      else if (a === "how") { ui.how = !ui.how; render(); }
      else if (a === "next") next();
      else if (a === "skip") { S.solved[S.stage] = -1; next(); }
      else if (a === "debrief") { S.view = "debrief"; save(); render(); top(); }
      else if (a === "back") { S.view = "end"; save(); render(); top(); }
      else if (a === "all") { var open = C.stages.every(function (x, i) { return ui.open[i]; }); C.stages.forEach(function (x, i) { ui.open[i] = !open; }); render(); }
      else if (t.hasAttribute("data-st")) { var k = +t.getAttribute("data-st"); ui.open[k] = !ui.open[k]; render(); }
    };
    render();
    return { state: function () { return S; } };
  }
  window.SinaWardle = { play: play };
})();
