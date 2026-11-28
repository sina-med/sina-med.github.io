/* Sina anonymous answer statistics.
   - Counts quiz answers per question so bad questions can be found and fixed: answered, answered correctly, which option.
   - Sends no name, account, email, device id or time. Answers are not linked to each other.
   - Shown to the student once as a notice at the top of their first quiz; can be turned off in Settings at any time.
   - Nothing is sent before the notice has been shown, and nothing is ever sent after "Turn off".
   - Keys used on this device start with "sinastats:"; the account sync only reads keys starting with "sina:", so they never sync.
   - Remove the <script src="js/stats.js"> line from index.html to switch the whole feature off. */
(function () {
  "use strict";
  var COLLECT = "https://script.google.com/macros/s/AKfycbw0doYk8YLCITfSVKlMJz5bHaHiRkxQCkJvK8ysFUNPcWa72EcZQDmo30vY4Z40ypzIxw/exec";
  var PREF = "sinastats:pref", SEEN = "sinastats:seen", OUT = "sinastats:out", MAX_OUT = 500;

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  /* pref: null = notice not shown yet (nothing collected), "shown" = notice shown but not answered (collecting),
     "on" = OK tapped, "off" = turned off (never collect) */
  function pref() { return get(PREF); }
  function collecting() { var p = pref(); return !!COLLECT && (p === "shown" || p === "on"); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---------- answers -> anonymous counts ---------- */
  var index = {};
  function lectureIndex(lid) {
    if (index[lid]) return index[lid];
    var L = window.SINA && SINA.lectures && SINA.lectures[lid], H = window.SinaBeta, m = {};
    if (!L || !H || !H.qKey) return null;
    (L.mcqs || []).forEach(function (q) { m[H.qKey(q)] = q; });
    return (index[lid] = m);
  }
  function lecOf(id) {
    id = String(id || "");
    var m = /^mix:([^:+]+):/.exec(id);
    if (m) return m[1];
    return /^(mix:|mistakes|weak|paper)/.test(id) ? null : id || null;
  }
  function readOut() { try { return JSON.parse(get(OUT) || "[]") || []; } catch (e) { return []; } }
  function writeOut(list) { if (list.length) set(OUT, JSON.stringify(list.slice(-MAX_OUT))); else { try { localStorage.removeItem(OUT); } catch (e) {} } }
  function seenSet() { try { return JSON.parse(get(SEEN) || "{}") || {}; } catch (e) { return {}; } }

  document.addEventListener("sina:answer", function (e) {
    if (!collecting()) return;
    var d = e.detail || {}, q = d.q || {};
    if (d.skipped || !q.options) return;
    var lid = q._smartLec || q._lid || lecOf(d.lec), H = window.SinaBeta;
    if (!lid || !/^[a-z0-9-]{3,60}$/.test(lid) || !H) return;
    var idx = lectureIndex(lid), k = q._k || H.qKey(q), orig = idx && idx[k];
    if (!orig || !/^[0-9a-z]{1,10}$/.test(k)) return;   /* only questions of the lecture bank */
    var chosen = (d.chosen || []).map(function (i) { return orig.options.indexOf(q.options[i]); }).filter(function (i) { return i >= 0; });
    if (!chosen.length) return;
    /* first attempt on this device: counts that approximate "how many different students" (kept only on this device) */
    var seen = seenSet(), sk = lid + "|" + k, first = seen[sk] ? 0 : 1;
    if (first) { seen[sk] = 1; set(SEEN, JSON.stringify(seen)); }
    var list = readOut();
    list.push({ l: lid, k: k, f: first, ok: d.ok ? 1 : 0, c: chosen.slice(0, 8), n: orig.options.length });
    writeOut(list);
    if (list.length >= 30) send(false);
  });

  /* items leave the queue BEFORE sending, so a page-hide beacon and a normal send can never send the same answer twice */
  var sending = false;
  function send(beacon) {
    if (!collecting() || sending) return;
    var list = readOut(); if (!list.length) return;
    var batch = list.slice(0, 100), rest = list.slice(100), body = JSON.stringify({ v: 2, items: batch });
    writeOut(rest);
    if (beacon && navigator.sendBeacon) {
      var ok = false; try { ok = navigator.sendBeacon(COLLECT, new Blob([body], { type: "text/plain" })); } catch (err) {}
      if (!ok) writeOut(batch.concat(readOut()));
      return;
    }
    if (!window.fetch) { writeOut(batch.concat(readOut())); return; }
    sending = true;
    fetch(COLLECT, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: body })
      .then(function () { sending = false; if (readOut().length) setTimeout(function () { send(false); }, 1500); },
            function () { sending = false; writeOut(batch.concat(readOut())); });
  }
  document.addEventListener("sina:quizend", function () { send(false); });
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") send(true); });
  setTimeout(function () { send(false); }, 5000);

  /* ---------- one-time notice at the top of the first quiz ---------- */
  function css() {
    if (document.getElementById("sst-css")) return;
    var s = document.createElement("style"); s.id = "sst-css";
    s.textContent = ".sst-note{box-sizing:border-box;border:1px solid var(--line-strong,rgba(127,127,127,.4));border-radius:12px;padding:.8rem 1rem;margin:0 0 1rem;background:var(--surface,transparent)}" +
      ".sst-note p{margin:.35rem 0}.sst-note .row{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.6rem}" +
      ".settings-menu button.sst-item{align-items:flex-start;flex-wrap:nowrap}.sst-item .sst-main{flex:1;display:block;width:13rem}" +
      ".sst-item .sst-lbl{display:block}.sst-item .sst-desc{display:block;margin-top:.15rem;font-size:.78rem;font-weight:400;opacity:.75;line-height:1.3}" +
      ".sst-item .sst-state{font-size:.8rem;font-weight:700;white-space:nowrap;margin-left:.4rem}";
    document.head.appendChild(s);
  }
  function showNotice() {
    if (!COLLECT) return;
    var p = pref();
    if (p === "on" || p === "off") return;
    var bar = document.querySelector("#app .qbar");
    if (!bar || document.getElementById("sst-note")) return;
    var panel = bar.parentNode;
    if (!panel || !panel.parentNode) return;
    css();
    var box = document.createElement("div"); box.id = "sst-note"; box.className = "sst-note"; box.setAttribute("role", "note");
    box.innerHTML = "<p><strong>Helping us fix questions</strong></p>" +
      "<p>Sina now keeps anonymous statistics on quiz answers: how often each question is answered, how often it is answered correctly, and which options are chosen. This helps us find questions that are wrong, unclear or too hard, and fix them.</p>" +
      "<p>We do not record your name, account, email or any personal details, and your own progress is not affected.</p>" +
      '<p class="meta">You can turn this off at any time in Settings.</p>' +
      '<div class="row"><button class="btn primary" type="button" data-sst="on">OK</button><button class="btn" type="button" data-sst="off">Turn off</button></div>';
    panel.parentNode.insertBefore(box, panel);
    if (p === null) set(PREF, "shown");
    box.querySelectorAll("[data-sst]").forEach(function (b) {
      b.onclick = function () { setPref(b.dataset.sst); box.remove(); };
    });
  }
  function setPref(v) {
    set(PREF, v);
    if (v === "off") { try { localStorage.removeItem(OUT); } catch (e) {} }
    renderSetting();
  }

  /* ---------- Settings switch ---------- */
  function renderSetting() {
    var menu = document.getElementById("settings-menu");
    if (!menu || !COLLECT) return;
    var b = document.getElementById("sst-setting");
    if (!b) {
      css();
      b = document.createElement("button"); b.type = "button"; b.id = "sst-setting"; b.className = "sst-item"; b.setAttribute("role", "menuitemcheckbox");
      var lang = menu.querySelector('[data-i18n="settings.language"]');
      menu.insertBefore(b, lang || null);
      b.addEventListener("click", function (e) { e.stopPropagation(); setPref(collecting() ? "off" : "on"); var n = document.getElementById("sst-note"); if (n) n.remove(); });
    }
    var onNow = collecting();
    b.setAttribute("aria-checked", String(onNow));
    b.innerHTML = '<span class="sm-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 20h16"/><path d="M7 16v-5"/><path d="M12 16V6"/><path d="M17 16v-8"/></svg></span><span class="sst-main"><span class="sst-lbl">Anonymous answer statistics</span>' +
      '<span class="sst-desc">' + esc("Helps improve Sina's questions by sharing anonymous answer counts. No name, account or email.") + "</span></span>" +
      '<span class="sst-state">' + (onNow ? "On" : "Off") + "</span>";
  }

  new MutationObserver(function () { showNotice(); }).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderSetting); else renderSetting();

  window.SinaStats = { _debug: { pref: pref, collecting: collecting, readOut: readOut, send: send, setPref: setPref, config: function () { return COLLECT; }, setCollect: function (u) { COLLECT = u; } } };
})();
