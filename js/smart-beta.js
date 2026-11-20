/* Sina Smart MCQ beta (off by default).
   - Turn on for this device: open #/smart/enable/ventricles-beta   Turn off: #/smart/disable
   - Local only: answers are kept on this device in "sinabeta:" keys, which the account sync never reads
     (it only syncs keys starting with "sina:"). Nothing here is sent anywhere.
   - Each logged-in account (and "not logged in") has its own history; switching account switches history.
   - Uses only published questions plus questions approved by a human reviewer (js/data/smart/<lecture>.js).
   - Answers given in Smart practice do NOT change the existing per-lecture stats, mistakes or review queue. */
(function () {
  "use strict";
  /* Works for any lecture listed in js/data/smart/index.js (built by tools/smart/build.py). Lectures without
     Smart data keep the ordinary quiz. "ventricles-beta" is still accepted as an enable code. */
  var FLAG = "sinabeta:smart:on", CODES = ["sina-smart-beta", "ventricles-beta"], CAP = 3000, WARN = 2400;
  var INDEX = null, indexState = null, indexWaiting = [];
  function inIndex(lid) { return !!(INDEX && INDEX.some(function (x) { return x.id === lid; })); }
  function loadIndex(cb) {
    if (indexState === "ok" || indexState === "err") return cb(indexState === "ok");
    indexWaiting.push(cb);
    if (indexState === "loading") return;
    indexState = "loading";
    var s = document.createElement("script");
    s.src = "js/data/smart/index.js";
    function done(ok) { indexState = ok ? "ok" : "err"; INDEX = ok ? (window.SINA_SMART_INDEX.lectures || []) : []; var w = indexWaiting; indexWaiting = []; w.forEach(function (f) { f(ok); }); }
    s.onload = function () { done(!!(window.SINA_SMART_INDEX && window.SINA_SMART_INDEX.lectures)); };
    s.onerror = function () { done(false); };
    document.head.appendChild(s);
  }
  /* run fn once the lecture's Smart data is loaded (answers can arrive before it is) */
  function withLecture(lid, fn) {
    if (!lid) return;
    if (dataState[lid] === "ok") return fn();
    loadIndex(function () { if (inIndex(lid)) loadData(lid, function (ok) { if (ok) fn(); }); });
  }
  var PREFIX = "sinabeta:smart:ev:", SESSION_N = 10, RECENT_MS = 20 * 3600 * 1000;
  var writer = Date.now().toString(36) + Math.random().toString(36).slice(2, 8); /* new writer per page load */
  var seq = 0, unsaved = [], lastWriteError = null, dataState = {}, waiting = {};

  function on() { try { return localStorage.getItem(FLAG) === "1"; } catch (e) { return false; } }
  function H() { return window.SinaBeta; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function djb2(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h.toString(36); }

  /* ---------- owner: one history per account on this device ---------- */
  function owner() {
    try { var a = JSON.parse(localStorage.getItem("sina:acct") || "null"); if (a && a.user) return "u" + djb2("sina-user:" + String(a.user).toLowerCase()); } catch (e) {}
    return "guest";
  }
  function ownerLabel() {
    try { var a = JSON.parse(localStorage.getItem("sina:acct") || "null"); if (a && a.user) return "account " + a.user; } catch (e) {}
    return "this device (not logged in)";
  }

  /* ---------- storage: one key per page load (no two tabs ever write the same key) ---------- */
  function myKey() { return PREFIX + owner() + ":" + writer; }
  function readAll() {
    var pre = PREFIX + owner() + ":", out = [], seen = {};
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i); if (!k || k.indexOf(pre) !== 0) continue;
        var v; try { v = JSON.parse(localStorage.getItem(k)); } catch (e) { continue; }
        (v && v.recs || []).forEach(function (r) { var id = r[0]; if (!seen[id]) { seen[id] = 1; out.push(r); } });
      }
    } catch (e) {}
    unsaved.forEach(function (r) { if (r.o === owner() && !seen[r.rec[0]]) out.push(r.rec); });
    return out.sort(function (a, b) { return a[1] - b[1]; });
  }
  /* record: [id, t, key, lecture, los[], chosen[], ok, mode, source] */
  function record(rec) {
    var all = readAll();
    if (all.length >= CAP) { banner("Smart practice history is full on this device (" + CAP + " answers). New answers are not being recorded. Reset the beta history to continue."); return; }
    var k = myKey(), cur;
    try { cur = JSON.parse(localStorage.getItem(k) || "null") || { recs: [] }; } catch (e) { cur = { recs: [] }; }
    cur.recs.push(rec); cur.hb = Date.now();
    try { localStorage.setItem(k, JSON.stringify(cur)); lastWriteError = null; }
    catch (e) {
      lastWriteError = (e && e.name) || "error";
      unsaved.push({ o: owner(), rec: rec });
      banner("Could not save your last answer on this device (" + lastWriteError + "). It counts for this visit only and will be lost when you close Sina.");
    }
    if (all.length + 1 >= WARN && all.length < WARN) H() && H().toast("Smart practice history is " + Math.round(100 * (all.length + 1) / CAP) + "% full on this device.", 4000);
  }
  function banner(msg) {
    var b = document.getElementById("smb-banner");
    if (!b) { b = document.createElement("div"); b.id = "smb-banner"; b.className = "smb-banner"; b.setAttribute("role", "alert"); document.body.appendChild(b); }
    b.innerHTML = '<span>' + esc(msg) + '</span><button type="button" aria-label="Dismiss">&times;</button>';
    b.querySelector("button").onclick = function () { b.remove(); };
  }

  /* ---------- data: lecture map, tags of published questions, approved new questions ---------- */
  function loadData(lid, cb) {
    var st = dataState[lid];
    if (st === "ok") return cb(true);
    if (st === "err") return cb(false);
    (waiting[lid] = waiting[lid] || []).push(cb);
    if (st === "loading") return;
    dataState[lid] = "loading";
    var s = document.createElement("script");
    s.src = "js/data/smart/" + lid + ".js";
    s.onload = function () { dataState[lid] = window.SINA_SMART && window.SINA_SMART[lid] ? "ok" : "err"; flush(lid); };
    s.onerror = function () { dataState[lid] = "err"; flush(lid); };
    document.head.appendChild(s);
  }
  function flush(lid) { var w = waiting[lid] || []; waiting[lid] = []; w.forEach(function (f) { f(dataState[lid] === "ok"); }); }
  function D(lid) { return window.SINA_SMART && window.SINA_SMART[lid]; }
  function loMap(lid) { var m = {}; (D(lid).los || []).forEach(function (lo) { m[lo.id] = lo; }); return m; }

  /* ---------- question health, experimental opt-in, this student's reports ---------- */
  var EXP = "sinabeta:smart:exp";
  function expOn() { try { return localStorage.getItem(EXP) === "1"; } catch (e) { return false; } }
  function repKey() { return "sinabeta:smart:rep:" + owner(); }
  function myReports() { try { return JSON.parse(localStorage.getItem(repKey()) || "{}") || {}; } catch (e) { return {}; } }
  function notServed(d, ids) { var st = d.status || {}; return ids.some(function (x) { var s = x && st[x]; return s === "flagged" || s === "suspended" || s === "retired"; }); }

  /* question pool: EVERY published quiz question + human-approved new questions (+ experimental ones if opted in).
     Flagged, suspended and retired questions, and questions this student reported, are left out.
     Mapping level per question (p.mv): "v" human-verified objective link, "a" automatic guess, "x" ambiguous or missing.
     p.los holds objectives ONLY for "v"; automatic guesses are never used for revision advice, scheduling or explanations. */
  function vmapOf(d, k) { return d.vmap && d.vmap[k]; }
  function pool(lid, opts) {
    var d = D(lid), L = window.SINA && SINA.lectures[lid], out = [], rep = myReports(), all = opts && opts.all;
    if (!d || !L) return out;
    function add(p) { if (all || (!notServed(d, [p.key, p.id]) && !rep[p.key])) out.push(p); }
    function level(k, q) {
      if (vmapOf(d, k)) return "v";
      if ((d.mlevel || {})[k] === "a" || (d.mrules || []).some(function (s) { return String(q.q).indexOf(s) === 0; })) return "a";
      return "x";
    }
    (L.mcqs || []).forEach(function (q) {
      var k = H().qKey(q), v = vmapOf(d, k), m = d.meta && d.meta[k];
      add({ key: k, q: q, los: v ? v.los : [], mv: level(k, q), type: m ? m.a : "recall", source: "published" });
    });
    function newItem(it, source) { var k = H().qKey(it.q), v = vmapOf(d, k); return { key: k, q: it.q, los: v ? v.los : [], mv: v ? "v" : "a", type: it.type, source: source, id: it.id }; }
    (d.items || []).forEach(function (it) { add(newItem(it, "reviewed-new")); });
    if (all || expOn()) (d.experimental || []).forEach(function (it) { add(newItem(it, "experimental")); });
    return out;
  }
  function level(lid, key) { var d = D(lid); return (d && d.difficulty && d.difficulty[key]) || null; }
  function keyIndex(lid) { var m = {}; pool(lid, { all: true }).forEach(function (p) { m[p.key] = p; }); return m; }

  /* ---------- teaching engine: evidence, schedule, angles (pure functions of the answer records) ----------
     Evidence is FRESH only: the first answer to a variant group (questions testing the same objective, angle and
     wording count as one), or a re-test of that group 21+ days later. Repeats never advance the schedule. */
  var DAY = 86400, STEPS = [3, 7, 16, 35], FRESH_AFTER = 21 * DAY;
  var ANG = { recall: "recall", "recall-image": "recall", unknown: "recall", relationship: "relationship", integration: "relationship", application: "application", "clinical-reasoning": "application" };
  /* teaching metadata. Variant groups and contrast links apply ONLY to questions with a human-verified mapping;
     an unverified question is its own group and has no contrast links. */
  function metaOf(lid, p, key) {
    var d = D(lid), k = key || (p && p.key), m = d && d.meta && d.meta[k], v = d && vmapOf(d, k);
    return { a: (m && m.a) || (p && ANG[p.type]) || "recall", vg: v ? ((m && m.vg) || (p && p.id) || k) : "q:" + k, oo: (v && v.oo) || {} };
  }
  var QRECENT = 20 * 3600;
  function stats(lid, recs) {
    var los = loMap(lid), st = {}, items = {}, vgSeen = {}, idx = keyIndex(lid);
    Object.keys(los).forEach(function (id) {
      st[id] = { n: 0, ok: 0, last: null, lastT: 0, recent: [], angles: {}, dist: {}, lastFresh: null, sched: { idx: -1, due: 0 } };
    });
    (recs || readAll()).forEach(function (r) {
      if (r[3] !== lid) return;
      /* question-level repetition (every question, whatever its mapping): wrong -> 1 day, right but unsure -> 2 days,
         right -> 3/7/16/35 days. A repeat within 20 hours can bring the review forward, never push it back. */
      var it = items[r[2]] || (items[r[2]] = { n: 0, lastT: 0, lastOk: null, sched: { idx: -1, due: 0 } });
      var qfresh = !it.lastT || r[1] - it.lastT >= QRECENT, qok = !!r[6];
      if (!qok) { it.sched.idx = -1; it.sched.due = qfresh ? r[1] + DAY : Math.min(it.sched.due || Infinity, r[1] + DAY); }
      else if (qfresh) {
        if (r[10] === 0) it.sched.due = r[1] + 2 * DAY;
        else { it.sched.idx = Math.min(it.sched.idx + 1, STEPS.length - 1); it.sched.due = r[1] + STEPS[it.sched.idx] * DAY; }
      }
      it.n++; it.lastT = r[1]; it.lastOk = qok;
      var p = idx[r[2]], m = metaOf(lid, p, r[2]), seen = vgSeen[m.vg], fresh = !seen || r[1] - seen >= FRESH_AFTER;
      vgSeen[m.vg] = r[1];
      if (r[8] === "experimental") return;   /* not medically verified: never evidence */
      /* objective evidence only through the CURRENT human-verified mapping (stored objectives in old records are ignored) */
      (p && p.mv === "v" ? p.los : []).forEach(function (lo) {
        var s = st[lo]; if (!s) return;
        var ok = !!r[6], conf = r[10];
        if (fresh) {
          s.n++; if (ok) s.ok++; s.recent.push(ok); if (s.recent.length > 3) s.recent.shift();
          var g = s.angles[m.a] || (s.angles[m.a] = { n: 0, ok: 0 }); g.n++; if (ok) g.ok++;
          s.lastFresh = { ok: ok, a: m.a, conf: conf };
          if (!ok) { s.sched.idx = -1; s.sched.due = r[1] + DAY; }
          else if (conf === 0) { s.sched.due = r[1] + 2 * DAY; }
          else { s.sched.idx = Math.min(s.sched.idx + 1, STEPS.length - 1); s.sched.due = r[1] + STEPS[s.sched.idx] * DAY; }
        } else if (!ok) {
          s.sched.due = Math.min(s.sched.due || Infinity, r[1] + DAY);   /* a repeat can bring a review forward, never push it back */
        }
        if (!ok && Array.isArray(r[9])) r[9].forEach(function (c) { var other = m.oo[String(c)]; if (other && other !== lo) s.dist[other] = (s.dist[other] || 0) + 1; });
        s.last = ok; s.lastT = r[1];
      });
    });
    return { lo: st, items: items, vgSeen: vgSeen };
  }
  function isDue(s, nowS) { return !!(s && s.sched && s.sched.due && s.sched.due <= nowS); }
  /* which angle to test next for an objective */
  function wantAngle(s) {
    var A = s.angles;
    if (A.recall && A.recall.ok > 0 && A.application && A.application.ok < A.application.n) return "application";   /* knows facts, missed application */
    if (s.lastFresh && !s.lastFresh.ok) return s.lastFresh.a;                                                          /* re-test the same angle with a new variant */
    var strong = Object.keys(A).filter(function (a) { return A[a].ok >= 1 && A[a].ok === A[a].n; });
    if (strong.length >= 2 && s.recent.length >= 2 && s.recent.every(Boolean)) return "advance";                       /* strong across angles: go harder */
    return null;
  }
  /* which explanation to suggest after an answer (the student can open any level anyway) */
  function recommend(ctx) {
    if (!ctx.ok && ctx.contrastLo && ctx.contrastCount >= 2) return "contrast";
    if (!ctx.ok && ctx.angle !== "recall" && ctx.recallOk > 0) return "deeper";
    if (!ctx.ok) return "understand";
    if (ctx.conf === 0) return "quick";
    return null;
  }
  function status(s) {
    if (!s || !s.lastT) return { code: "untested", label: "Not tested yet" };
    if (s.last === false) return { code: "missed", label: "Missed last time" };
    if (s.n < 3) return { code: "few", label: s.ok + " of " + s.n + " question" + (s.n === 1 ? "" : "s") + " right first time, too few to judge" };
    if (s.recent.length === 3 && s.recent.every(Boolean)) return { code: "good", label: "Last 3 new questions right (" + s.ok + "/" + s.n + ")" };
    return { code: "mixed", label: s.ok + " of " + s.n + " questions right first time" };
  }

  /* ---------- selection ----------
     1. objective-level buckets, ONLY for objectives that have questions with a human-verified mapping
        (due, missed, untested, few answers, harder angle, least recently practised);
     2. question-level repetition for all other questions: wrong before and due, due, new, oldest. */
  function choose(lid, n, recs, nowMs) {
    var P = pool(lid), S = stats(lid, recs), los = loMap(lid), now = nowMs || Date.now(), nowS = Math.round(now / 1000), byLo = {}, picked = [], used = {}, usedVg = {}, perLo = {};
    P.forEach(function (p) { if (p.mv === "v") p.los.forEach(function (lo) { (byLo[lo] = byLo[lo] || []).push(p); }); });   /* objective buckets: human-verified links only */
    function imp(lo) { return (los[lo] && los[lo].importance) === "core" ? 0 : 1; }
    /* 0 = variant group never seen (fresh evidence), 1 = seen long ago (allowed, not counted fresh unless 21+ days), 2 = seen in the last 20 hours (never) */
    function itemRank(p) {
      var vg = metaOf(lid, p).vg, t = S.vgSeen[vg], it = S.items[p.key];
      if (it && now - it.lastT * 1000 <= RECENT_MS) return 2;
      if (t === undefined) return 0;
      return now - t * 1000 > RECENT_MS ? 1 : 2;
    }
    /* difficulty (from cross-student data, when available): after a miss start easier; for untested prefer medium; when advancing prefer hard */
    var PREF = { missed: { easy: 0, medium: 0, hard: 2 }, due: { easy: 0, medium: 0, hard: 1 }, untested: { medium: 0, easy: 1, hard: 1 }, advance: { hard: 0, medium: 1, easy: 2 } };
    function diffRank(p, mode) { var lv = level(lid, p.key), t = PREF[mode]; return t && lv ? t[lv] : 1; }
    function angleRank(p, want) {
      if (!want) return 0;
      var a = metaOf(lid, p).a;
      if (want === "advance") return a === "application" ? 0 : a === "relationship" ? 1 : 2;
      return a === want ? 0 : 1;
    }
    function take(lo, reason, mode) {
      if ((perLo[lo] || 0) >= 2) return false;
      var want = wantAngle(S.lo[lo]);
      var cand = (byLo[lo] || []).filter(function (p) { return !used[p.key] && !usedVg[metaOf(lid, p).vg]; });
      cand = H().shuffle(cand).sort(function (a, b) { return itemRank(a) - itemRank(b) || angleRank(a, want) - angleRank(b, want) || diffRank(a, mode) - diffRank(b, mode); });
      if (!cand.length || itemRank(cand[0]) === 2) return false; /* never repeat something answered in the last 20 hours */
      var p = cand[0]; used[p.key] = 1; usedVg[metaOf(lid, p).vg] = 1; p.los.forEach(function (l) { perLo[l] = (perLo[l] || 0) + 1; });
      var why = reason + (want && want !== "advance" && metaOf(lid, p).a === want ? "; " + want + " question" : want === "advance" ? "; harder angle" : "") + (itemRank(p) === 0 ? "" : "; repeat (does not count as new evidence)");
      picked.push({ p: p, lo: lo, reason: why }); return true;
    }
    var ids = Object.keys(los).filter(function (lo) { return byLo[lo]; });
    function bucket(test, reason, max, mode) {
      var c = 0, list = H().shuffle(ids.filter(test)).sort(function (a, b) { return imp(a) - imp(b) || (S.lo[a].sched.due || 0) - (S.lo[b].sched.due || 0); });
      for (var pass = 0; pass < 2; pass++) list.forEach(function (lo) { if (picked.length < n && c < max && take(lo, reason, mode)) c++; });
    }
    bucket(function (lo) { return isDue(S.lo[lo], nowS); }, "Due for review", Math.ceil(n * 0.5), "due");
    bucket(function (lo) { return status(S.lo[lo]).code === "missed"; }, "You missed this objective last time", Math.ceil(n * 0.4), "missed");
    bucket(function (lo) { return status(S.lo[lo]).code === "untested"; }, "Not tested yet", Math.ceil(n * 0.4), "untested");
    bucket(function (lo) { return status(S.lo[lo]).code === "few"; }, "Only a few answers so far", n, "few");
    bucket(function (lo) { return wantAngle(S.lo[lo]) === "advance"; }, "Going well: a harder angle", Math.ceil(n * 0.3), "advance");
    var rest = ids.slice().sort(function (a, b) { return (S.lo[a].lastT || 0) - (S.lo[b].lastT || 0); });
    rest.forEach(function (lo) { if (picked.length < n) take(lo, "Keeping it fresh"); });
    /* question-level repetition for everything else (and every question without a human-verified mapping):
       reasons talk about the QUESTION only, never about a concept the student has or has not mastered */
    function qtake(test, reason, sortKey, sameGroupOk) {
      H().shuffle(P.filter(function (p) { return !used[p.key] && itemRank(p) < 2 && test(p, S.items[p.key]); }))
        .sort(function (a, b) { return sortKey ? sortKey(a) - sortKey(b) : 0; })
        .forEach(function (p) {
          if (picked.length >= n || used[p.key] || (!sameGroupOk && usedVg[metaOf(lid, p).vg])) return;
          used[p.key] = 1; usedVg[metaOf(lid, p).vg] = 1;
          picked.push({ p: p, lo: p.mv === "v" ? p.los[0] : "q:" + p.key, reason: reason });
        });
    }
    function qdue(it) { return it && it.sched.due && it.sched.due <= nowS; }
    qtake(function (p, it) { return qdue(it) && it.lastOk === false; }, "You got this question wrong before", function (p) { return S.items[p.key].sched.due; });
    qtake(function (p, it) { return qdue(it); }, "Due for another look at this question", function (p) { return S.items[p.key].sched.due; });
    qtake(function (p, it) { return !it; }, "New question");
    qtake(function () { return true; }, "Not seen for a while", function (p) { return (S.items[p.key] || {}).lastT || 0; });
    qtake(function () { return true; }, "Similar to another question in this session (does not count as new evidence)", null, true);   /* small lectures */
    /* spread objectives so the same one never comes twice in a row */
    var out = [], left = picked.slice();
    while (left.length) { var j = 0; while (j < left.length - 1 && out.length && left[j].lo === out[out.length - 1].lo) j++; out.push(left.splice(j, 1)[0]); }
    return out;
  }

  /* ---------- answer tracking (any quiz on a beta lecture, plus Smart practice) ---------- */
  document.addEventListener("sina:answer", function (e) {
    if (!on()) return;
    var d = e.detail || {}, q = d.q || {}, lid = q._smartLec || q._lid || lecOf(d.lec), t = Math.round(Date.now() / 1000);
    if (!lid || !H()) return;
    withLecture(lid, function () {
      var k = q._k || H().qKey(q), p = keyIndex(lid)[k];
      if (!p) return;
      lastAnswered = { q: q, p: p, lid: lid, ok: !!d.ok, chosen: (d.chosen || []).slice(), conf: conf };
      /* options are shuffled for display: store the ORIGINAL option indices so answers can be compared across students */
      var orig = (d.chosen || []).map(function (i) { return p.q.options.indexOf(q.options[i]); });
      seq++;
      /* [10] confidence: 1 sure, 0 unsure, null not given (Smart practice only) */
      lastAnswered.orig = orig;
      record([writer + "." + seq, t, k, lid, p.los, d.chosen || [], d.ok ? 1 : 0, /^mix:.*:smart$/.test(d.lec) ? "smart" : "quiz", p.source, orig, conf]);
      conf = null;
      setTimeout(function () { explainPanel(); quickFlags(); }, 0);   /* the quiz fills #fb right after this event; add ours afterwards */
    });
  });

  /* ---------- confidence (optional, Smart practice only): "Sure" / "Not sure" before checking ---------- */
  var conf = null;
  new MutationObserver(function () {
    if (!on()) return;
    var chk = document.querySelector("#smbq #chk");
    if (!chk || document.getElementById("smb-conf")) return;
    conf = null;
    var w = document.createElement("div"); w.id = "smb-conf"; w.className = "smb-conf"; w.setAttribute("role", "group"); w.setAttribute("aria-label", "How sure are you?");
    w.innerHTML = '<span class="meta">How sure? (optional)</span><button type="button" data-c="1" aria-pressed="false">Sure</button><button type="button" data-c="0" aria-pressed="false">Not sure</button>';
    chk.parentNode.insertBefore(w, chk);
    w.querySelectorAll("button").forEach(function (b) {
      b.onclick = function () {
        conf = +b.dataset.c;
        w.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      };
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
  /* quiz id -> lecture: a plain lecture id, or a single-lecture practice set 'mix:<lecture>:<n>' / 'mix:<lecture>:smart'.
     Multi-lecture sets ('a+b'), mistakes, weak spots and papers have no single lecture: their questions carry _lid. */
  function lecOf(id) {
    id = String(id || "");
    var m = /^mix:([^:+]+):/.exec(id);
    if (m) return m[1];
    return /^(mix:|mistakes|weak|paper)/.test(id) ? null : id || null;
  }

  /* ---------- student reports (beta): a reason, a note, sent through Sina's existing report channel ---------- */
  var lastAnswered = null;
  var REASONS = [["wrong-key", "Wrong answer key", "The marked answer is wrong"], ["ambiguous", "Ambiguous", "More than one answer could be right"],
    ["contradicts-lecture", "Contradicts lecture", "Contradicts the lecture or slides"], ["explanation", "Explanation unclear", "The explanation is unclear or not enough"],
    ["repetitive", "Repetitive", "Repetitive or low value"], ["typo", "Typo", "Typo or formatting"], ["other", "Other", "Something else"]];
  /* one report per question per reason per account (local de-duplication; the server-side design de-duplicates too) */
  function qrev(q) { return H().qKey({ q: q.q + "|" + (q.why || ""), options: q.options }); }
  function sendReport(a, reason, extra, after) {
    var reps = myReports(), cur = reps[a.p.key] || { reasons: {} };
    if (!cur.reasons) cur = { reasons: cur.reason ? (function (o) { o[cur.reason] = cur.t; return o; })({}) : {} };
    if (cur.reasons[reason]) { H().toast("Already reported for this reason. Thank you.", 2500); if (after) after(true); return; }
    cur.reasons[reason] = Math.round(Date.now() / 1000);
    reps[a.p.key] = cur;
    var saved = true; try { localStorage.setItem(repKey(), JSON.stringify(reps)); } catch (err) { saved = false; }
    var S = window.SINA || {}, q = a.p.q, ans = q.answers || [q.answer];
    extra = extra || {};
    /* report record, minimal: question key + revision, lecture, reason, optional slide/suggestion/note. No name, no account. */
    var body = { type: "report", src: a.lid, k: a.p.key, q: q.q, options: q.options, answer: ans, img: "",
      note: "[" + reason + "]" + (extra.slide ? " [slide " + extra.slide + "]" : "") + (extra.suggestion ? " [suggest: " + extra.suggestion + "]" : "") + (extra.note ? " " + extra.note : ""),
      beta: "smart", v: 2, reason: reason, rev: qrev(q), item: a.p.id || "", slide: extra.slide || "", suggestion: extra.suggestion || "", source: a.p.source };
    function done(ok) {
      H().toast(ok ? "Thanks, flagged for review. The question is hidden from your Smart practice." : "Could not send" + (saved ? "; kept on this device and hidden from your Smart practice." : "."), 3500);
      if (after) after(ok);
    }
    if (S.api) fetch(S.api, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(body) }).then(function () { done(true); }, function () { done(false); });
    else done(false);
  }
  /* ---------- explanation panel: Quick / Understand / Go deeper / Contrast, one suggested, all available ---------- */
  var LAYER = { quick: "Quick correction", understand: "Understand", deeper: "Go deeper", contrast: "Contrast" };
  /* Targeted layers (Understand, Go deeper, Contrast) need a HUMAN-VERIFIED question -> objective link; Contrast also needs
     the wrong option's link to another objective to be human-confirmed. Otherwise only the question's own explanation. */
  function contextFor(a) {
    var d = D(a.lid), verified = a.p.mv === "v" && a.p.los.length > 0, lo = verified ? a.p.los[0] : null;
    var S = stats(a.lid), s = (lo && S.lo[lo]) || { angles: {}, dist: {} }, m = metaOf(a.lid, a.p), cLo = null;
    if (verified) (a.orig || []).some(function (c) { var o = m.oo[String(c)]; if (o && d.expl && d.expl[o]) { cLo = o; return true; } return false; });
    var rec = recommend({ ok: a.ok, conf: a.conf, angle: m.a, recallOk: (s.angles.recall && s.angles.recall.ok) || 0, contrastLo: cLo, contrastCount: cLo ? (s.dist[cLo] || 0) : 0 });
    if (!verified && rec) rec = "quick";
    return { verified: verified, lo: lo, m: m, cLo: cLo, rec: rec };
  }
  function quickHTML(a) {
    var q = a.q, ci = a.chosen && a.chosen.length ? a.chosen[0] : null;
    return (q.why ? "<p>" + esc(q.why) + "</p>" : "") + (!a.ok && ci != null && q.notes && q.notes[ci] ? '<p><strong>Your choice:</strong> ' + esc(q.notes[ci]) + "</p>" : "") || '<p class="meta">No short explanation for this question.</p>';
  }
  function explainPanel() {
    var a = lastAnswered, fb = document.getElementById("fb");
    if (!a || !fb || fb.querySelector(".smb-ex")) return;
    var d = D(a.lid), ctx = contextFor(a), ex = ctx.verified && d && d.expl && d.expl[ctx.lo], los = loMap(a.lid);
    var body = { quick: quickHTML(a) }, tabs = ["quick"], note = "";
    if (!ex) {
      note = '<p class="meta smb-unv">' + (a.p.mv === "a" ? "This question is linked to a lecture objective only automatically, not yet by a tutor" : "This question is not linked to a lecture objective yet") +
        ', so Smart practice does not suggest what to revise from it. It will come back on its own review schedule. <a href="#/lecture/' + esc(a.lid) + '">Open the lecture</a></p>';
    } else {
      tabs.push("understand", "deeper");
      body.understand = '<p class="meta">' + esc(los[ctx.lo] ? los[ctx.lo].text : "") + '</p><ul>' + ex.u.map(function (t) { return "<li>" + esc(t.charAt(0).toUpperCase() + t.slice(1)) + "</li>"; }).join("") + "</ul>" +
        '<p><a href="#/lecture/' + esc(a.lid) + "/summary/" + esc(ex.s) + '">Open this part of the lecture</a></p>';
      body.deeper = ex.dp.length ? ex.dp.map(function (x) { return "<p><strong>" + esc(x.h) + ".</strong> " + esc(x.t) + "</p>"; }).join("") :
        '<p class="meta">No deeper note is linked to this objective yet. <a href="#/lecture/' + esc(a.lid) + '/deeper">See the lecture\'s Go deeper tab</a>.</p>';
    }
    var cex = ex && ctx.cLo && d.expl[ctx.cLo];
    if (cex) {
      tabs.push("contrast");
      body.contrast = '<p class="meta">A tutor confirmed that the option you chose belongs to another objective of this lecture. Compare the two:</p><div class="smb-cmp">' +
        [ctx.lo, ctx.cLo].map(function (o) { return "<div><h4>" + esc(los[o] ? los[o].text : o) + "</h4><ul>" + d.expl[o].u.slice(0, 3).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div>"; }).join("") + "</div>";
    }
    var w = document.createElement("div"); w.className = "smb-ex";
    w.innerHTML = '<div class="smb-tabs" role="tablist">' + tabs.map(function (t) {
      return '<button type="button" role="tab" data-t="' + t + '" aria-selected="' + (t === ctx.rec) + '">' + LAYER[t] + (t === ctx.rec ? ' <span class="smb-sugg">suggested</span>' : "") + "</button>";
    }).join("") + '</div><div class="smb-tabp" role="tabpanel"' + (ctx.rec ? "" : " hidden") + ">" + (ctx.rec ? body[ctx.rec] : "") + "</div>" + note;
    fb.appendChild(w);
    w.querySelectorAll("[data-t]").forEach(function (b) {
      b.onclick = function () {
        var open = b.getAttribute("aria-selected") === "true", pnl = w.querySelector(".smb-tabp");
        w.querySelectorAll("[data-t]").forEach(function (x) { x.setAttribute("aria-selected", "false"); });
        if (open) { pnl.hidden = true; return; }
        b.setAttribute("aria-selected", "true"); pnl.innerHTML = body[b.dataset.t]; pnl.hidden = false;
      };
    });
  }

  /* inline one-tap flags under the explanation: no dialog, no typing, studying continues */
  function quickFlags() {
    var a = lastAnswered, fb = document.getElementById("fb");
    if (!a || !fb || fb.querySelector(".smb-flags")) return;
    var w = document.createElement("div"); w.className = "smb-flags";
    w.innerHTML = '<span class="meta">Something wrong with this question?</span>' + REASONS.slice(0, 5).map(function (r) {
      return '<button type="button" class="smb-flag" data-r="' + r[0] + '">' + esc(r[1]) + "</button>";
    }).join("") + '<button type="button" class="smb-flag" data-more="1">More…</button>';
    fb.appendChild(w);
    w.querySelectorAll("button").forEach(function (b) {
      b.onclick = function () {
        if (b.dataset.more) return reportDialog(a);
        b.disabled = true; sendReport(a, b.dataset.r, null, function () { b.textContent = "✓ " + b.textContent; });
      };
    });
  }
  document.addEventListener("click", function (e) {
    var b = e.target && e.target.closest && e.target.closest("#rep");
    if (!b || !on() || !lastAnswered || !document.body.contains(b)) return;
    e.preventDefault(); e.stopPropagation();   /* replaces the normal report dialog only while the beta is on */
    reportDialog(lastAnswered);
  }, true);
  function reportDialog(a) {
    var v = document.createElement("div");
    v.className = "rdlg"; v.setAttribute("role", "dialog"); v.setAttribute("aria-modal", "true"); v.setAttribute("aria-label", "Report this question");
    v.innerHTML = '<div class="rdlg-box"><h2>Report this question</h2><p class="meta">' + esc(a.p.q.q) + "</p>" +
      '<fieldset class="smb-reasons"><legend class="rdlg-l">What is wrong?</legend>' + REASONS.map(function (r) {
        return '<label><input type="radio" name="smb-r" value="' + r[0] + '"> ' + esc(r[2]) + "</label>";
      }).join("") + "</fieldset>" +
      '<label class="rdlg-l" for="smb-slide">Slide or page (optional)</label><input id="smb-slide" maxlength="20" placeholder="e.g. 26">' +
      '<label class="rdlg-l" for="smb-sugg">Suggested correction (optional)</label><input id="smb-sugg" maxlength="300" placeholder="e.g. The answer should be B">' +
      '<label class="rdlg-l" for="smb-note">Details (optional; please do not include your name)</label><textarea id="smb-note" rows="2"></textarea>' +
      '<p class="meta">A person checks every report. The question is hidden from your Smart practice meanwhile. Reports never change an answer automatically.</p>' +
      '<div class="row"><button class="btn primary" id="smb-send" type="button" disabled>Send report</button><button class="btn" id="smb-x" type="button">Cancel</button></div></div>';
    document.body.appendChild(v); document.body.classList.add("noscroll");
    function close() { v.remove(); document.body.classList.remove("noscroll"); }
    v.querySelector("#smb-x").onclick = close;
    v.addEventListener("click", function (e) { if (e.target === v) close(); });
    v.querySelectorAll("input[name=smb-r]").forEach(function (r) { r.onchange = function () { v.querySelector("#smb-send").disabled = false; }; });
    v.querySelector("#smb-send").onclick = function () {
      var reason = (v.querySelector("input[name=smb-r]:checked") || {}).value || "other";
      var extra = { slide: v.querySelector("#smb-slide").value.trim().slice(0, 20), suggestion: v.querySelector("#smb-sugg").value.trim().slice(0, 300), note: v.querySelector("#smb-note").value.trim().slice(0, 500) };
      close();
      sendReport(a, reason, extra);
    };
  }
  document.addEventListener("sina:quizend", function (e) {
    if (!on()) return;
    var d = e.detail || {}, lid = lecOf(d.lec);
    if (!lid || dataState[lid] !== "ok" || !d.panel) return;   /* lectures without Smart data: ordinary end screen only */
    var idx = keyIndex(lid), los = loMap(lid), miss = {}, answered = 0, wrongUnverified = 0;
    (d.qs || []).forEach(function (q, i) {
      var p = idx[q._k || H().qKey(q)], r = d.done && d.done[i]; if (!p || !r) return;
      answered++;
      if (r.ok) return;
      if (p.mv === "v") p.los.forEach(function (lo) { miss[lo] = (miss[lo] || 0) + 1; });   /* only human-verified links name a topic */
      else wrongUnverified++;
    });
    var box = document.createElement("div"); box.className = "smb-sum";
    box.innerHTML = summaryHTML(lid, miss, answered, los, wrongUnverified);
    d.panel.appendChild(box);
  });
  function summaryHTML(lid, miss, answered, los, wrongUnverified) {
    var ids = Object.keys(miss).sort(function (a, b) { return miss[b] - miss[a] || ((los[a].importance === "core" ? 0 : 1) - (los[b].importance === "core" ? 0 : 1)); });
    var secs = {}, order = [], L = window.SINA && SINA.lectures[lid];
    function secTitle(sec, fallback) { var s = L && L.summary && L.summary[sec]; return (s && s.title) || fallback; }
    ids.forEach(function (lo) { var s = los[lo]; if (!secs[s.sec]) { secs[s.sec] = { topic: secTitle(s.sec, s.topic), los: [] }; order.push(s.sec); } secs[s.sec].los.push(s); });
    var h = '<h2 class="rev-h">After this session (Smart MCQ beta)</h2>';
    if (!answered) return h + '<p class="meta">No Smart practice questions were answered in this session.</p>';
    if (ids.length) h += '<p class="meta">Topics a tutor has linked to the questions you missed. One missed question is a reason to look again, not proof of a weakness.</p><ol class="smb-rev">' + order.map(function (sec) {
      var g = secs[sec];
      return '<li><a href="#/lecture/' + esc(lid) + "/summary/" + esc(sec) + '"><strong>Revise: ' + esc(g.topic) + "</strong></a><ul>" + g.los.map(function (lo) { return "<li>" + esc(lo.text) + "</li>"; }).join("") + "</ul></li>";
    }).join("") + "</ol>";
    if (wrongUnverified) h += "<p>" + wrongUnverified + " question" + (wrongUnverified > 1 ? "s" : "") + " you got wrong will come back tomorrow, then at growing intervals once you get " + (wrongUnverified > 1 ? "them" : "it") + " right.</p>" +
      '<p class="meta">Smart practice does not yet name topics for ' + (wrongUnverified > 1 ? "these questions" : "this question") + ": no tutor has confirmed which part of the lecture " + (wrongUnverified > 1 ? "they test" : "it tests") + '. Their own explanations are shown above. <a href="#/lecture/' + esc(lid) + '">Open the lecture</a></p>';
    if (!ids.length && !wrongUnverified) h += "<p>No wrong answers in this session. These questions come back later at growing intervals.</p>";
    h += '<p class="row"><a class="btn primary" href="#/smart/practice/' + esc(lid) + '">Next Smart practice</a><a class="btn" href="#/smart/' + esc(lid) + '">Lecture overview</a></p>';
    h += '<p class="meta smb-local">Saved on this device only, for ' + esc(ownerLabel()) + ". Not synced.</p>";   /* objectives a tutor has not linked are never called weak or untested here */
    return h;
  }

  /* ---------- views ---------- */
  function css() {
    if (document.getElementById("smb-css")) return;
    var s = document.createElement("style"); s.id = "smb-css";
    s.textContent = ".smb-tag{display:inline-block;font-size:.75rem;padding:.05rem .5rem;border-radius:99px;border:1px solid currentColor;opacity:.8;margin-left:.4rem;vertical-align:middle}" +
      ".smb-lo{display:flex;justify-content:space-between;gap:.8rem;padding:.45rem 0;border-bottom:1px solid rgba(127,127,127,.25)}.smb-lo span:first-child{flex:1}" +
      ".smb-st{font-size:.85rem;white-space:nowrap}.smb-st.missed{color:#b3261e}.smb-st.good{color:#1d7a3a}.smb-st.untested,.smb-st.few{opacity:.7}" +
      "@media (prefers-color-scheme:dark){.smb-st.missed{color:#ff8a80}.smb-st.good{color:#5fcf80}}" +
      ".smb-banner{position:fixed;left:12px;right:12px;bottom:12px;z-index:60;background:#b3261e;color:#fff;padding:.7rem 1rem;border-radius:10px;display:flex;gap:.8rem;align-items:center;justify-content:space-between}" +
      ".smb-banner button{background:none;border:0;color:#fff;font-size:1.4rem;cursor:pointer}.smb-rev li{margin:.35rem 0}.smb-why{font-size:.85rem;opacity:.75}" +
      ".smb-exp{border:1px solid rgba(127,127,127,.35);border-radius:10px;padding:.6rem .8rem;margin:.8rem 0}.smb-exp label{font-weight:600}" +
      ".smb-reasons{border:0;padding:0;margin:.4rem 0}.smb-reasons label{display:block;margin:.25rem 0}" +
      ".rdlg-box input{width:100%;box-sizing:border-box;margin:.2rem 0 .5rem;padding:.4rem;font:inherit}" +
      ".smb-ex{margin:.8rem 0;border:1px solid rgba(127,127,127,.35);border-radius:10px;padding:.5rem .7rem}.smb-tabs{display:flex;flex-wrap:wrap;gap:.35rem}" +
      ".smb-tabs button{font:inherit;font-size:.85rem;padding:.25rem .7rem;border-radius:99px;border:1px solid rgba(127,127,127,.5);background:none;color:inherit;cursor:pointer}" +
      ".smb-tabs button[aria-selected=true]{border-color:currentColor;font-weight:700}.smb-sugg{font-size:.7rem;opacity:.75;font-weight:400}.smb-tabp{margin-top:.5rem}" +
      ".smb-tabp ul{margin:.3rem 0 .3rem 1.1rem;padding:0}.smb-cmp{display:grid;grid-template-columns:1fr 1fr;gap:.8rem}.smb-cmp h4{margin:.2rem 0;font-size:.9rem}" +
      "@media (max-width:520px){.smb-cmp{grid-template-columns:1fr}}.smb-due{font-size:.8rem;opacity:.75;display:block}.smb-duebox{padding:.5rem .7rem;border-left:3px solid currentColor;margin:.6rem 0}" +
      ".smb-flags,.smb-conf{display:flex;flex-wrap:wrap;gap:.35rem;align-items:center;margin:.6rem 0}" +
      ".smb-flag,.smb-conf button{font:inherit;font-size:.8rem;padding:.2rem .6rem;border-radius:99px;border:1px solid rgba(127,127,127,.5);background:none;color:inherit;cursor:pointer}" +
      ".smb-conf button[aria-pressed=true]{border-color:currentColor;font-weight:700}.smb-flag:disabled{opacity:.6;cursor:default}" +
      "@media (max-width:520px){.smb-lo{flex-direction:column;gap:.1rem}.smb-st{white-space:normal}}";
    document.head.appendChild(s);
  }
  function whenReady(fn) { if (H()) return fn(); setTimeout(function () { whenReady(fn); }, 20); }
  function head(title) {
    return '<div class="wrap"><p class="crumbs"><a href="#/">Home</a> / <a href="#/smart">Smart MCQ beta</a></p><h1>' + esc(title) + '<span class="smb-tag">Beta</span></h1>';
  }
  function storageLine() {
    var u = unsaved.filter(function (r) { return r.o === owner(); }).length, n = readAll().length - u;
    return '<p class="meta smb-local">History for ' + esc(ownerLabel()) + ": " + n + " answer" + (n === 1 ? "" : "s") + " saved on this device only (not synced to your account)" +
      (u ? '. <strong>' + u + " answer" + (u > 1 ? "s" : "") + " could not be saved (storage " + esc(lastWriteError || "error") + ") and will be lost when you close Sina.</strong>" : "") +
      (n >= WARN ? " <strong>History is " + Math.round(100 * n / CAP) + "% full.</strong>" : "") + "</p>";
  }
  function home() {
    var by = {}, order = [];
    (INDEX || []).forEach(function (x) { if (!by[x.subject]) { by[x.subject] = []; order.push(x.subject); } by[x.subject].push(x); });
    var subjName = function (id) { var s = (window.SINA && SINA.subjects || []).filter(function (z) { return z.id === id; })[0]; return s ? s.name : id; };
    var h = head("Smart practice") + '<p class="lede-s">Lectures with Smart Practice data. Every other lecture keeps its ordinary quiz.</p>' +
      (order.length ? order.sort().map(function (sid) {
        return "<h2>" + esc(subjName(sid)) + '</h2><ul class="lec-list">' + by[sid].map(function (x) {
          return '<li><a href="#/smart/' + esc(x.id) + '"><span>' + esc(x.title) + '</span><span class="qn">' + (x.verified ? x.verified + " tutor-checked topic links" : "question-by-question review") + "</span></a></li>";
        }).join("") + "</ul>";
      }).join("") : '<p class="empty-note">No lecture has Smart Practice data yet.</p>') +
      '<p class="row"><a class="btn" href="#/smart/disable">Turn the beta off on this device</a></p></div>';
    H().setView(h, "Smart practice (beta)");
  }
  function overview(lid) {
    var d = D(lid), S = stats(lid), los = loMap(lid), P = pool(lid);
    var h = head("Smart practice: " + d.title);
    h += '<p class="lede-s">Picks questions for you from <a href="#/lecture/' + lid + '">' + esc(d.title) + "</a>" + (d.items.length ? " (plus " + d.items.length + " new reviewed question" + (d.items.length > 1 ? "s" : "") + ")" : "") +
      ": questions you got wrong come back the next day, then after 3, 7, 16 and 35 days once you get them right; new questions fill the rest.</p>";
    h += '<p class="row"><a class="btn primary" href="#/smart/practice/' + lid + '">Start Smart practice (' + Math.min(SESSION_N, P.length) + ' questions)</a></p>' + storageLine();
    var nExp = (d.experimental || []).length, nRep = Object.keys(myReports()).length;
    h += '<div class="smb-exp"><label><input type="checkbox" id="smb-exp"' + (expOn() ? " checked" : "") + "> Include experimental questions" + (nExp ? " (" + nExp + ")" : " (none available yet)") + "</label>" +
      '<p class="meta">Experimental questions were written by AI from the lecture slides and passed automated checks, but <strong>no doctor or tutor has reviewed them yet</strong>. They are labelled in the quiz and never count towards any topic below. Please report anything that looks wrong.</p></div>' +
      (nRep ? '<p class="meta">You reported ' + nRep + " question" + (nRep > 1 ? "s" : "") + "; " + (nRep > 1 ? "they are" : "it is") + " hidden from your Smart practice until reviewed.</p>" : "");
    /* question-level progress (no claims about topics) */
    var nowS = Math.round(Date.now() / 1000), qAns = 0, qDue = 0, qWrong = 0;
    P.forEach(function (p) { var it = S.items[p.key]; if (!it) return; qAns++; if (it.sched.due && it.sched.due <= nowS) qDue++; if (it.lastOk === false) qWrong++; });
    h += '<h2>Your questions</h2><p>' + qAns + " of " + P.length + " questions answered · " + qWrong + " wrong last time · " + qDue + " due for another look now.</p>" +
      (qDue ? '<p class="smb-duebox"><strong>' + qDue + " question" + (qDue > 1 ? "s" : "") + " due today.</strong> Smart practice puts them first.</p>" : "");
    /* mapping transparency */
    var mc = d.mapCounts || {};
    h += '<h2>Topics</h2><p class="meta">Which part of the lecture each question tests: ' + (mc.verified || 0) + " checked by a tutor · " + (mc.auto || 0) + " matched automatically · " + ((mc.ambiguous || 0) + (mc.missing || 0)) + " not matched. " +
      "Only tutor-checked links are used to suggest what to revise, to schedule topics or to show topic explanations; automatic matches are never used for that, because they can be wrong.</p>";
    var vlo = {};
    P.forEach(function (p) { if (p.mv === "v") p.los.forEach(function (lo) { vlo[lo] = (vlo[lo] || 0) + 1; }); });
    var groups = {}, order = [];
    d.los.forEach(function (lo) { if (!vlo[lo.id]) return; if (!groups[lo.topic]) { groups[lo.topic] = []; order.push(lo.topic); } groups[lo.topic].push(lo); });
    var nDue = 0;
    Object.keys(vlo).forEach(function (id) { if (isDue(S.lo[id], nowS)) nDue++; });
    if (!order.length) h += "<p>No question in this lecture has a tutor-checked topic yet, so Smart practice works question by question and does not tell you which topics you have mastered or need to revise.</p>";
    else h += (nDue ? '<p class="smb-duebox"><strong>' + nDue + " tutor-checked topic" + (nDue > 1 ? "s" : "") + " due for review today.</strong></p>" : "") +
      '<p class="meta">Tutor-checked topics only. Only new questions count (a repeat within 3 weeks does not); a topic without answers is never treated as weak.</p>';
    function dueText(s) {
      if (!s || !s.sched || !s.sched.due) return "";
      var days = Math.ceil((s.sched.due - nowS) / 86400);
      return days <= 0 ? "Review due now" : "Next review in " + days + " day" + (days > 1 ? "s" : "");
    }
    order.forEach(function (t) {
      var sec = groups[t][0].sec;
      h += '<h3><a href="#/lecture/' + lid + "/summary/" + sec + '">' + esc(t) + "</a></h3>" + groups[t].map(function (lo) {
        var s = status(S.lo[lo.id]), qn = vlo[lo.id], dt = dueText(S.lo[lo.id]);
        return '<div class="smb-lo"><span>' + esc(lo.text) + ' <span class="smb-why">(' + qn + " question" + (qn === 1 ? "" : "s") + ')</span></span><span class="smb-st ' + s.code + '">' + esc(s.label) + (dt ? '<span class="smb-due">' + dt + "</span>" : "") + "</span></div>";
      }).join("");
    });
    h += '<h2>About this beta</h2><p class="meta">Topic links are switched on question by question as tutors check them. New AI-drafted questions appear only in the experimental option above, or after human medical review. ' +
      'Answers in Smart practice do not change your normal progress, mistakes or review queue.</p>' +
      '<h2>Help improve the questions (optional)</h2><p class="meta">Download an anonymous copy of your Smart practice answers and send it to the Sina team. It contains only question codes, the options you chose, whether they were right, and day numbers counted from your first answer: no name, account, device or dates. Pooled answers show which questions are confusing or too hard; they are never used to change an answer key.</p>' +
      '<p class="row"><button class="btn" id="smb-anon" type="button">Download anonymous answers</button></p>' +
      '<p class="row"><button class="btn" id="smb-reset" type="button">Reset beta history for ' + esc(ownerLabel()) + '</button><a class="btn" href="#/smart/disable">Turn the beta off on this device</a></p></div>';
    H().setView(h, "Smart practice (beta)");
    document.getElementById("smb-exp").onchange = function () {
      try { if (this.checked) localStorage.setItem(EXP, "1"); else localStorage.removeItem(EXP); } catch (e) {}
      overview(lid);
    };
    document.getElementById("smb-anon").onclick = function () {
      var blob = new Blob([JSON.stringify(anonExport(lid))], { type: "application/json" }), a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "sina-smart-answers-" + lid + ".json"; document.body.appendChild(a); a.click(); a.remove();
    };
    document.getElementById("smb-reset").onclick = function () {
      if (!confirm("Delete the Smart practice history for " + ownerLabel() + " on this device? Your normal Sina progress is not affected.")) return;
      var pre = PREFIX + owner() + ":", ks = [];
      for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf(pre) === 0) ks.push(k); }
      ks.forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} });
      unsaved = unsaved.filter(function (r) { return r.o !== owner(); });
      overview(lid);
    };
  }
  /* anonymous export: question codes, original option indices, correctness, relative day numbers. No owner, writer ids,
     timestamps, notes or account. Answers recorded before option un-shuffling (no field 9) export without choices. */
  function anonExport(lid) {
    var recs = readAll().filter(function (r) { return r[3] === lid; }), t0 = recs.length ? recs[0][1] : 0;
    var reps = myReports();
    return { format: "sina-smart-anon", version: 1, lecture: lid,
      answers: recs.map(function (r) { return { k: r[2], day: Math.floor((r[1] - t0) / 86400), chosen: Array.isArray(r[9]) ? r[9] : null, ok: !!r[6], mode: r[7], source: r[8], sure: r[10] === 1 ? true : r[10] === 0 ? false : null }; }),
      reports: [].concat.apply([], Object.keys(reps).map(function (k) {
        var rs = reps[k].reasons || (reps[k].reason ? (function (o) { o[reps[k].reason] = 1; return o; })({}) : {});
        return Object.keys(rs).map(function (r) { return { k: k, reason: r }; });
      })) };
  }
  function practice(lid) {
    var d = D(lid), L = SINA.lectures[lid], picks = choose(lid, SESSION_N), los = loMap(lid);
    var h = head("Smart practice: " + d.title);
    if (!picks.length) { H().setView(h + '<p class="empty-note">Nothing to pick right now: every question was answered in the last 20 hours. Come back later.</p>' + storageLine() + "</div>", "Smart practice (beta)"); return; }
    h += '<details class="smb-plan"><summary>Why these ' + picks.length + " questions</summary><ul>" + picks.map(function (x) {
      var label = los[x.lo] ? "Topic (tutor-checked): " + los[x.lo].text : "Question: " + String(x.p.q.q).replace(/<[^>]+>/g, "").slice(0, 90);
      return "<li>" + esc(label) + ' <span class="smb-why">(' + esc(x.reason) + (x.p.source === "experimental" ? "; experimental question" : "") + ")</span></li>"; }).join("") + "</ul></details>" +
      storageLine() + '<div id="smbq"></div></div>';
    H().setView(h, "Smart practice (beta)");
    var qs = picks.map(function (x) {
      var c = H().shuffleQ(x.p.q), o = {}; for (var k in c) o[k] = c[k];
      o._k = x.p.key; o._smartLec = lid; o._fig = L.visual && L.visual.figure; o._from = los[x.lo] ? los[x.lo].topic : d.title; return o;
    });
    H().questionsPanel(document.getElementById("smbq"), { id: "mix:" + lid + ":smart", _title: "Smart practice", mcqs: qs });
  }
  function route(parts) {
    if (parts[0] === "enable") {
      if (CODES.indexOf(parts[1]) < 0) return false;
      try { localStorage.setItem(FLAG, "1"); } catch (e) {}
      location.replace("#/smart"); return true;
    }
    if (parts[0] === "disable") {
      try { localStorage.removeItem(FLAG); } catch (e) {}
      location.replace("#/"); return true;
    }
    if (!on()) return false;
    css();
    whenReady(function () {
      loadIndex(function () {
        var lid = parts[0] === "practice" ? parts[1] : parts[0];
        if (!lid) return home();
        if (!inIndex(lid)) {
          /* no Smart data for this lecture: fall back to the ordinary quiz */
          var lec = window.SINA && SINA.lectures[lid];
          location.replace(lec ? "#/subject/" + lec.subject + "/questions/" + lid : "#/smart");
          return;
        }
        loadData(lid, function (ok) {
          if (!ok) { H().setView(head("Smart practice") + '<p class="empty-note">The beta data could not be loaded. Check your connection and reload.</p></div>', "Smart practice (beta)"); return; }
          if (parts[0] === "practice") practice(lid); else overview(lid);
        });
      });
    });
    return true;
  }
  window.SinaSmart = { route: route, enabled: on, _debug: { stats: stats, choose: choose, recommend: recommend, wantAngle: wantAngle, isDue: isDue, metaOf: metaOf, status: status, contextFor: contextFor, readAll: readAll, owner: owner, pool: pool, anonExport: anonExport, index: function () { return INDEX; } } };
  if (on()) { css(); loadIndex(function () {}); }
})();
