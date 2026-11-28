/* Optional "explain your reasoning" box under each answered question.
   The student writes a sentence or two; it is checked by key words only.
   Key words come from the question's explanation ("why"), minus the words already in the question and its options,
   ranked so terms common to every explanation ("because", "increase") count less than specific ones.
   Tutors can replace the automatic list for any question in js/data/reason-keys.js.
   This never changes the score, stats, mistakes or spaced repetition. */
(function () {
  "use strict";
  var S = window.SINA; if (!S) return;

  var STOP = {};
  ("a about above after again against all also although always among an and another any are aren around as at be because been before being below " +
   "between both but by can cannot could did do does doing done down during each either else enough etc even ever every few for from further " +
   "had has have having he her here hers him his how however i if in into is isn it its itself just least less like likely made main mainly " +
   "make makes many may me might more most mostly much must my near neither never no nor not now of off often on once one only or other others " +
   "otherwise our out over own part per rather same she should since so some such than that the their them then there therefore these they " +
   "this those though through thus to too toward towards under unless until up upon us usually very via was we were what when where whereas " +
   "whether which while who whom whose why will with within without would yet you your " +
   /* words every exam explanation uses: they say nothing about the reasoning */
   "answer answers correct correctly wrong option options question questions true false statement statements choice choices right " +
   "called known seen found given used using use uses refer refers referred means meaning example called term terms type types " +
   "first second third two three four five six seven eight nine ten lecture slide slides note notes key point points important especially " +
   "case cases patient patients level levels effect effects result results cause causes caused leads lead due both different same").split(" ").forEach(function (w) { STOP[w] = 1; });

  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9+]+/g, " ").trim(); }
  /* light stemmer: enough for "reabsorbs / reabsorbed", "vessels / vessel", "inhibition / inhibitions" */
  function stem(w) {
    if (w.length <= 4) return w;
    return w.replace(/(ational|ations)$/, "ation").replace(/(ities|ity)$/, "")
      .replace(/(ings|ing)$/, "").replace(/(ied|ies)$/, "y").replace(/(ed|es)$/, "").replace(/([^su])s$/, "$1");
  }
  function words(s) { return norm(s).split(" ").filter(Boolean); }
  /* acronyms written in capitals keep their meaning even when short (ADH, GFR, K+, T3) */
  function acronyms(s) { return (String(s || "").match(/\b[A-Z][A-Z0-9]{1,5}\+?/g) || []).filter(function (x) { return x.length >= 3 || /\d/.test(x); }).map(function (x) { return x.toLowerCase(); }); }
  /* figure questions start their explanation with the label itself: that part is the answer, not the reasoning */
  function whyText(q) { return String(q.why || "").replace(/^The arrow points to:[^.]*\.\s*/i, ""); }
  function isTerm(w) { return !STOP[w] && !/^\d+$/.test(w) && w.length >= 4; }

  /* how rare each stem is across all explanations (computed once, on first use) */
  var DF = null, NDOC = 0;
  function df() {
    if (DF) return DF;
    DF = {};
    Object.keys(S.lectures || {}).forEach(function (lid) {
      (S.lectures[lid].mcqs || []).forEach(function (q) {
        if (!q.why) return; NDOC++;
        var seen = {}; words(q.why).forEach(function (w) { var s = stem(w); if (!seen[s]) { seen[s] = 1; DF[s] = (DF[s] || 0) + 1; } });
      });
    });
    return DF;
  }
  function idf(s) { var d = df(); return Math.log((NDOC + 1) / ((d[s] || 0) + 1)); }
  /* how often a stem comes up in the lecture's own questions: topic terms (excitation, reabsorption) beat rare everyday words (aware, wild) */
  var LTF = {};
  function ltf(lid) {
    if (LTF[lid]) return LTF[lid];
    var m = LTF[lid] = {}, L = S.lectures[lid];
    (L && L.mcqs || []).forEach(function (q) { words([q.q, (q.options || []).join(" "), q.why].join(" ")).forEach(function (w) { var s = stem(w); m[s] = (m[s] || 0) + 1; }); });
    return m;
  }

  /* one-character slips are forgiven on longer words (glomerulus / glomerolus) */
  function near(a, b) {
    if (a === b) return true;
    var la = a.length, lb = b.length, lim = Math.min(la, lb) >= 9 ? 2 : Math.min(la, lb) >= 6 ? 1 : 0;
    if (!lim || Math.abs(la - lb) > lim) return false;
    var prev = [], cur, i, j;
    for (j = 0; j <= lb; j++) prev[j] = j;
    for (i = 1; i <= la; i++) {
      cur = [i];
      for (j = 1; j <= lb; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[lb] <= lim;
  }

  /* a key idea is a list of alternatives; each alternative is one or more words, all of which must appear */
  function ideaFound(idea, have) {
    return idea.alts.some(function (alt) {
      return alt.every(function (s) { return have.some(function (h) { return near(s, h); }); });
    });
  }
  function toIdea(entry) {
    var alts = Array.isArray(entry) ? entry : [entry];
    return { label: String(alts[0]), alts: alts.map(function (a) { return words(a).filter(function (w) { return !STOP[w]; }).map(stem); }).filter(function (a) { return a.length; }) };
  }

  function keyIdeas(q, key, lid) {
    var over = S.reasonKeys && S.reasonKeys[key];
    if (over === null || (Array.isArray(over) && !over.length)) return [];          /* switched off for this question */
    if (over) return over.map(toIdea).filter(function (x) { return x.alts.length; });
    var why = whyText(q);
    if (why.length < 40) return [];
    var given = {}, acr = acronyms(why), tf = lid ? ltf(lid) : {};
    [q.q].concat(q.options || []).concat(q.case ? [q.case] : []).forEach(function (t) { words(t).forEach(function (w) { given[stem(w)] = 1; }); });
    var cand = {}, order = [];
    words(why).concat(acr).forEach(function (w) {
      var s = stem(w);
      if (given[s] || cand[s]) return;
      if (!isTerm(w) && acr.indexOf(w) < 0) return;
      var r = idf(s);
      cand[s] = { label: w, s: s, rare: r, score: r * r * Math.log(2 + (tf[s] || 0)) * Math.min(1, w.length / 7) }; order.push(s);
    });
    var list = order.map(function (s) { return cand[s]; }).filter(function (c) { return c.rare > 1.2; });  /* drop words found in most explanations */
    list.sort(function (a, b) { return b.score - a.score; });
    var n = Math.max(2, Math.min(5, Math.round(list.length / 3)));
    var pick = list.slice(0, n);
    pick.sort(function (a, b) { return order.indexOf(a.s) - order.indexOf(b.s); });   /* back in the explanation's order */
    return pick.length >= 2 ? pick.map(function (c) { return { label: c.label, alts: [[c.s]] }; }) : [];
  }

  function grade(ideas, text) {
    var have = words(text).filter(function (w) { return !STOP[w]; }).map(stem);
    var found = ideas.map(function (i) { return ideaFound(i, have); }), hits = found.filter(Boolean).length;
    var need = ideas.length <= 2 ? ideas.length : Math.ceil(ideas.length * 0.6);
    return { found: found, hits: hits, need: need, verdict: hits >= need ? "ok" : hits ? "part" : "no" };
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var uid = 0;
  document.addEventListener("sina:feedback", function (e) {
    var d = e.detail || {}, box = d.el, q = d.q;
    if (!box || !q || d.skipped) return;
    var ideas = keyIdeas(q, d.key, q._lid || d.lec);
    if (ideas.length < 2) return;
    var id = "rsn" + (++uid);
    var html = '<div class="rsn"><button type="button" class="linkbtn rsn-open" aria-expanded="false" aria-controls="' + id + '">Explain the reasoning (optional)</button>' +
      '<div class="rsn-body" id="' + id + '" hidden><label class="rsn-lbl" for="' + id + 't">In a sentence or two, explain <em>why</em>: the mechanism, not just the answer.</label>' +
      '<textarea id="' + id + 't" class="rsn-txt" rows="3" maxlength="800" placeholder="e.g. Because … which leads to …"></textarea>' +
      '<div class="row"><button type="button" class="btn small primary rsn-go">Check my reasoning</button></div><div class="rsn-out" aria-live="polite"></div></div></div>';
    var rep = box.querySelector(".rep-line");
    if (rep) rep.insertAdjacentHTML("beforebegin", html); else box.insertAdjacentHTML("beforeend", html);
    var root = box.querySelector(".rsn"), open = root.querySelector(".rsn-open"), body = root.querySelector(".rsn-body"), ta = root.querySelector("textarea"), out = root.querySelector(".rsn-out");
    open.onclick = function () { var o = body.hidden; body.hidden = !o; open.setAttribute("aria-expanded", String(o)); if (o) ta.focus({ preventScroll: true }); };
    root.querySelector(".rsn-go").onclick = function () {
      var t = ta.value.trim();
      if (t.split(/\s+/).length < 3) { out.innerHTML = '<p class="rsn-msg">Write a little more: a full sentence about the mechanism.</p>'; return; }
      var g = grade(ideas, t), head = { ok: "Good reasoning", part: "Partly there", no: "Key ideas missing" }[g.verdict];
      out.innerHTML = '<p class="rsn-v rsn-' + g.verdict + '"><strong>' + head + "</strong> · " + g.hits + " of " + ideas.length + " key ideas</p>" +
        '<ul class="rsn-keys">' + ideas.map(function (i, n) { return '<li class="' + (g.found[n] ? "hit" : "miss") + '"><span aria-hidden="true">' + (g.found[n] ? "&#10003;" : "&#8211;") + "</span> " + esc(i.label) + '<span class="sr-only">' + (g.found[n] ? " (mentioned)" : " (missing)") + "</span></li>"; }).join("") + "</ul>" +
        (q.why ? '<p class="rsn-why"><strong>Explanation:</strong> ' + esc(q.why) + "</p>" : "") +
        '<p class="rsn-note">Checked automatically by key words, so a correct answer written differently can be missed. It doesn\'t change your score.</p>';
      try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: "/event/reasoning/" + g.verdict, event: true }); } catch (x) {}
    };
  });

  /* for tests and for tutors checking a list: SinaReason.ideas(q), SinaReason.grade(q, text) */
  window.SinaReason = {
    ideas: function (q, key, lid) { return keyIdeas(q, key, lid).map(function (i) { return i.label; }); },
    grade: function (q, text, key, lid) { var i = keyIdeas(q, key, lid); return i.length ? grade(i, text) : null; }
  };
})();
