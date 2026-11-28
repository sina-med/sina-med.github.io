/* Live "online now" counter and student chat (Firebase Realtime Database).
   Inert until FIREBASE below is filled in: see community/SETUP.md.
   Rooms: "global" (everyone reads and writes) and one per year (only students logged in to a Sina account, in that year).
   Nothing from the student's progress is sent; a chat message carries a nickname, the text and the time. */
(function () {
  "use strict";
  var FIREBASE = {
    apiKey: "AIzaSyC08U1POHGatY5m8e3m-haAMGVeo-PR6Ig",
    authDomain: "sina-chat-f7c98.firebaseapp.com",
    databaseURL: "https://sina-chat-f7c98-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "sina-chat-f7c98",
    appId: "1:712570938461:web:9cb7b43f75962ea24c59b4"
  };
  /* Paste the config from the Firebase console here, for example:
  var FIREBASE = {
    apiKey: "…", authDomain: "….firebaseapp.com", databaseURL: "https://…-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "…", appId: "…"
  }; */
  var SDK = "https://www.gstatic.com/firebasejs/10.14.1/";
  var ROOMS = { global: "Global", y1: "1st year", y2: "2nd year" };
  var MAX = 500, KEEP = 80;

  function get(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
  /* saved keys travel with the student's account: record the change, or the next sync brings back the old value */
  function put(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
    try { if (window.SinaSync && SinaSync.touch) SinaSync.touch(k); } catch (e) {}
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function acct() { try { return window.SinaSync && SinaSync.acc && SinaSync.acc(); } catch (e) { return null; } }
  function year() { var p = String(get("sina:program", "") || ""), y = p.split("-")[0]; return ROOMS[y] ? y : null; }
  /* which rooms this visitor may open */
  function myRooms() { var a = acct(), y = year(), r = ["global"]; if (a && a.user && y) r.push(y); return r; }
  /* the name shown in the chat: always one the student chose, never their account username */
  var NICK = "sina:chatNick";
  function myName() { return String(get(NICK, "") || "").slice(0, 24); }
  function checkName(n) {
    n = String(n || "").replace(/\s+/g, " ").trim();
    if (n.length < 2) return { err: "At least 2 characters." };
    if (n.length > 24) return { err: "24 characters at most." };
    if (!/^[\p{L}\p{N} _.\-]+$/u.test(n)) return { err: "Letters, numbers, spaces, _ . - only." };
    return { name: n };
  }

  /* ---------- Firebase, loaded only when configured ---------- */
  var fb = null, db = null, uid = null, readyP = null;
  function script(src) { return new Promise(function (ok, no) { var s = document.createElement("script"); s.src = src; s.async = true; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
  function ready() {
    if (!FIREBASE) return Promise.reject(new Error("off"));
    if (readyP) return readyP;
    readyP = script(SDK + "firebase-app-compat.js")
      .then(function () { return Promise.all([script(SDK + "firebase-auth-compat.js"), script(SDK + "firebase-database-compat.js")]); })
      .then(function () {
        fb = window.firebase; fb.initializeApp(FIREBASE); db = fb.database();
        /* keep a moderator who signed in earlier on this device; everyone else gets an invisible anonymous ID */
        return new Promise(function (ok) { var stop = fb.auth().onAuthStateChanged(function (u) { stop(); ok(u); }); });
      })
      .then(function (u) { return u ? { user: u } : fb.auth().signInAnonymously(); })
      .then(function (c) { uid = c.user.uid; return db; });
    readyP.catch(function () { readyP = null; });
    return readyP;
  }

  /* ---------- presence: one entry per open device, removed by the server when it disconnects ---------- */
  var counts = { all: 0 }, countCbs = [];
  var me = null;   /* this device's presence entry; moves when the moderator signs in or out */
  function joinPresence() {
    me = db.ref("presence/" + uid);
    var ref = me;
    ref.onDisconnect().remove().then(function () { if (me === ref) ref.set({ y: year() || "other", t: fb.database.ServerValue.TIMESTAMP }); });
  }
  function leavePresence() {
    if (!me) return Promise.resolve();
    var ref = me; me = null;
    return ref.onDisconnect().cancel().then(function () { return ref.remove(); }).catch(function () {});
  }
  function startPresence() {
    ready().then(function () {
      db.ref(".info/connected").on("value", function (s) { if (s.val() === true) joinPresence(); });
      document.addEventListener("sina:program", function () { if (me) me.update({ y: year() || "other", t: fb.database.ServerValue.TIMESTAMP }); });
      db.ref("presence").on("value", function (s) {
        var c = { all: 0 }; s.forEach(function (ch) { var y = (ch.val() || {}).y || "other"; c.all++; c[y] = (c[y] || 0) + 1; });
        counts = c; badge(); countCbs.forEach(function (f) { f(c); });
      });
    }).catch(function () {});
  }
  /* "● 12 online" in the header, next to What's new; it opens the chat */
  function badge() {
    var b = document.getElementById("online-btn");
    if (!b) {
      var anchor = document.getElementById("news-btn"); if (!anchor) return;
      anchor.insertAdjacentHTML("afterend", '<a class="news-btn online-btn" id="online-btn" href="#/chat" aria-live="polite"><i class="on-dot" aria-hidden="true"></i><span class="on-n"></span><span class="on-l"> online</span></a>');
      b = document.getElementById("online-btn");
    }
    var n = counts.all || 1;
    b.querySelector(".on-n").textContent = n;
    b.setAttribute("aria-label", n + " student" + (n > 1 ? "s" : "") + " online. Open the chat");
  }

  /* ---------- chat page (#/chat, #/chat/y1 …) ---------- */
  var live = null;   /* the room listener, detached when leaving the page */
  var renaming = false;   /* "change" next to the name: show the name picker again */
  function detach() { if (live) { live.ref.off("child_added", live.fn); live.ref.off("child_removed", live.gone); live = null; } countCbs = []; }
  window.addEventListener("hashchange", function () { if (!/^#\/chat\b/.test(location.hash)) detach(); });

  /* ---------- moderator: the Firebase user IDs allowed to delete messages (the database rules check the same list) ---------- */
  var MODS = ["qrz7YcpRVqQ4izBxCn5upDCg4mg1"];
  function isMod() { return !!uid && MODS.indexOf(uid) > -1; }
  function modEmail() { var u = fb && fb.auth().currentUser; return u && !u.isAnonymous ? u.email : ""; }
  function modSignIn(email, pass) {
    return ready().then(leavePresence).then(function () { return fb.auth().signInWithEmailAndPassword(email, pass); })
      .then(function (c) { uid = c.user.uid; joinPresence(); });
  }
  function modSignOut() {
    return ready().then(leavePresence).then(function () { return fb.auth().signOut(); })
      .then(function () { return fb.auth().signInAnonymously(); }).then(function (c) { uid = c.user.uid; joinPresence(); });
  }

  function fmtTime(t) { var d = new Date(t), now = new Date(); var hm = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); return d.toDateString() === now.toDateString() ? hm : d.getDate() + "/" + (d.getMonth() + 1) + " " + hm; }
  function msgHTML(m, mine, key) {
    return '<li class="cm' + (mine ? " mine" : "") + '" data-k="' + esc(key) + '"><p class="cm-h"><span class="cm-n">' + esc(m.n || "?") + "</span>" + (m.a ? '<span class="cm-acc" title="Sina account">✓</span>' : "") + '<time>' + (m.t ? fmtTime(m.t) : "") + "</time>" +
      (isMod() ? '<button type="button" class="cm-del" aria-label="Delete this message" title="Delete">&times;</button>' : "") + '</p><p class="cm-x">' + esc(m.x || "") + "</p></li>";
  }

  /* #/chat/mod: sign in with the moderator email and password created in the Firebase console */
  function modView(setView) {
    var head = '<div class="wrap narrow chat"><p class="crumbs"><a href="#/">Home</a> / <a href="#/chat">Chat</a> / Moderator</p><h1>Moderator</h1>';
    if (!FIREBASE) { setView(head + "<p>The chat is not set up.</p></div>", "Moderator"); return; }
    setView(head + '<p class="meta">Loading…</p></div>', "Moderator");
    ready().then(function () {
      if (isMod()) {
        setView(head + '<p class="lede-s">Signed in as moderator: <strong>' + esc(modEmail()) + '</strong>. A &times; next to each message deletes it for everyone.</p>' +
          '<div class="row"><a class="btn primary" href="#/chat">Open the chat</a><button type="button" class="btn" id="mod-out">Sign out</button></div><p class="ch-err" id="mod-err" role="alert"></p></div>', "Moderator");
        document.getElementById("mod-out").onclick = function () { modSignOut().then(function () { modView(setView); }, function () { document.getElementById("mod-err").textContent = "Could not sign out. Try again."; }); };
        return;
      }
      var other = modEmail();
      setView(head + (other ? '<p class="ch-note">Signed in as ' + esc(other) + ", which is not on the moderator list.</p>" : "") +
        '<form class="ch-pick" id="mod-form"><h2>Moderator sign-in</h2><p class="meta">Only for the account set up in the Firebase console.</p>' +
        '<label class="sr-only" for="mod-email">Email</label><input id="mod-email" type="email" autocomplete="username" placeholder="Email" required>' +
        '<label class="sr-only" for="mod-pass">Password</label><input id="mod-pass" type="password" autocomplete="current-password" placeholder="Password" required>' +
        '<button class="btn primary" type="submit">Sign in</button><p class="ch-err" id="mod-err" role="alert"></p></form></div>', "Moderator");
      var f = document.getElementById("mod-form");
      f.onsubmit = function (e) {
        e.preventDefault();
        var b = f.querySelector("button"), err = document.getElementById("mod-err"); b.disabled = true; err.textContent = "";
        modSignIn(document.getElementById("mod-email").value.trim(), document.getElementById("mod-pass").value).then(function () {
          modView(setView);
        }, function () { err.textContent = "Wrong email or password."; b.disabled = false; });
      };
    }, function () { setView(head + "<p>Could not connect. Check your connection and reload.</p></div>", "Moderator"); });
  }

  function view(setView, want) {
    detach();
    if (want === "mod") return modView(setView);
    var rooms = myRooms(), y = year(), a = acct();
    var room = want && rooms.indexOf(want) > -1 ? want : "global";
    var tabs = Object.keys(ROOMS).map(function (r) {
      var ok = rooms.indexOf(r) > -1;
      return ok ? '<a role="tab" class="ch-tab" href="#/chat' + (r === "global" ? "" : "/" + r) + '" aria-selected="' + (r === room) + '">' + ROOMS[r] + '<span class="ch-c" data-c="' + r + '"></span></a>' : "";
    }).join("");
    var lockNote = "";
    if (!a) lockNote = '<p class="ch-note">Students with a Sina account can also talk in their year\'s room. <a href="#/account">Log in or create an account</a>.</p>';
    else if (!y) lockNote = '<p class="ch-note">Year rooms are open for 1st and 2nd year. Choose your year with the selector at the top left.</p>';
    var head = '<div class="wrap narrow chat"><p class="crumbs"><a href="#/">Home</a> / Chat</p><h1>Chat</h1>';
    if (!FIREBASE) { setView(head + '<p class="lede-s">The chat is not open yet. Check back soon.</p></div>', "Chat"); return; }
    if (want && want !== room) { location.replace("#/chat"); return; }
    /* first visit (or "change"): choose a chat name before entering */
    if (!myName() || renaming) {
      var was = myName(); renaming = false;
      setView(head + '<form class="ch-pick" id="ch-pick"><h2>Choose your chat name</h2>' +
        '<p class="meta">Others only see this name. To stay anonymous, don\'t use your real name or your account username.</p>' +
        '<label class="sr-only" for="ch-nick">Chat name</label><div class="ch-row"><input id="ch-nick" maxlength="24" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="e.g. NightOwl" value="' + esc(was) + '">' +
        '<button class="btn primary" type="submit">' + (was ? "Save" : "Enter the chat") + "</button></div>" +
        '<p class="ch-err" id="ch-perr" role="alert"></p>' + (was ? '<p><a href="#/chat' + (room === "global" ? "" : "/" + room) + '" id="ch-cancel">Cancel</a></p>' : "") + "</form></div>", "Chat");
      var pf = document.getElementById("ch-pick"), ni = document.getElementById("ch-nick");
      ni.focus();
      var cancel = document.getElementById("ch-cancel"); if (cancel) cancel.onclick = function (e) { e.preventDefault(); view(setView, want); };
      pf.onsubmit = function (e) {
        e.preventDefault();
        var c = checkName(ni.value);
        if (c.err) { document.getElementById("ch-perr").textContent = c.err; return; }
        put(NICK, c.name); view(setView, want);
      };
      return;
    }
    setView(head + '<p class="meta ch-online"><i class="on-dot" aria-hidden="true"></i> <span id="ch-online">Connecting…</span></p>' +
      '<div class="ch-tabs" role="tablist">' + tabs + "</div>" + lockNote +
      '<ul class="ch-list" id="ch-list" aria-live="polite" aria-label="Messages in ' + ROOMS[room] + '"><li class="ch-empty">Loading messages…</li></ul>' +
      '<form class="ch-form" id="ch-form"><div class="ch-me">Posting as <b id="ch-name">' + esc(myName()) + '</b> <button type="button" class="linkbtn" id="ch-rename">change</button></div>' +
      '<div class="ch-row"><textarea id="ch-text" rows="1" maxlength="' + MAX + '" placeholder="Message ' + ROOMS[room] + '" aria-label="Message"></textarea><button class="btn primary" type="submit" id="ch-send">Send</button></div>' +
      '<p class="ch-rules">Please keep it respectful and kind!</p><p class="ch-err" id="ch-err" role="alert"></p></form></div>', "Chat");

    var list = document.getElementById("ch-list"), form = document.getElementById("ch-form"), ta = document.getElementById("ch-text"), err = document.getElementById("ch-err");
    function showCounts(c) {
      var el = document.getElementById("ch-online"); if (!el) return;
      el.textContent = (c.all || 1) + " online now" + (room !== "global" ? " · " + (c[room] || 0) + " in " + ROOMS[room] : "");
      Object.keys(ROOMS).forEach(function (r) { var s = document.querySelector('.ch-c[data-c="' + r + '"]'); if (s) s.textContent = r === "global" ? "" : " " + (c[r] || 0); });
    }
    countCbs.push(showCounts); showCounts(counts);
    var rn = document.getElementById("ch-rename");
    if (rn) rn.onclick = function () { renaming = true; view(setView, want); };
    ta.addEventListener("input", function () { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 140) + "px"; });
    ta.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event("submit")); } });

    ready().then(function () {
      if (!document.body.contains(list)) return;
      var ref = db.ref("rooms/" + room + "/msgs").orderByChild("t").limitToLast(KEEP), first = true;
      list.innerHTML = "";
      var fn = function (s) {
        var m = s.val() || {}, near = list.scrollHeight - list.scrollTop - list.clientHeight < 80;
        var empty = list.querySelector(".ch-empty"); if (empty) empty.remove();
        /* in time order: after a deletion, the next-older message comes back into the last 80 and belongs at the top */
        var t = m.t || 0, after = null;
        for (var c = list.lastElementChild; c; c = c.previousElementSibling) { if (+c.dataset.t <= t) break; after = c; }
        var tmp = document.createElement("ul"); tmp.innerHTML = msgHTML(m, m.u === uid, s.key); var li = tmp.firstChild; li.dataset.t = t;
        list.insertBefore(li, after);   /* no trimming here: a message leaving the last KEEP arrives as child_removed */
        if (!after && (near || first || m.u === uid)) list.scrollTop = list.scrollHeight;
      };
      /* deleted (by the moderator, or in the Firebase console): gone from every open chat at once */
      var gone = function (s) {
        var li = list.querySelector('li[data-k="' + (window.CSS && CSS.escape ? CSS.escape(s.key) : s.key) + '"]'); if (li) li.remove();
        if (!list.children.length) list.innerHTML = '<li class="ch-empty">No messages yet. Say hello!</li>';
      };
      ref.on("child_added", fn); ref.on("child_removed", gone); live = { ref: ref, fn: fn, gone: gone };
      list.addEventListener("click", function (e) {
        var x = e.target.closest && e.target.closest(".cm-del"); if (!x || !isMod()) return;
        var li = x.closest(".cm"); if (!li || !confirm("Delete this message for everyone?")) return;
        db.ref("rooms/" + room + "/msgs/" + li.dataset.k).remove().catch(function () { alert("Could not delete: this account is not allowed to."); });
      });
      ref.once("value").then(function (s) { first = false; if (!s.numChildren() && !list.children.length) list.innerHTML = '<li class="ch-empty">No messages yet. Say hello!</li>'; list.scrollTop = list.scrollHeight; });
    }).catch(function () { list.innerHTML = '<li class="ch-empty">Could not connect to the chat. Check your connection and reload.</li>'; });

    var lastSend = 0;
    form.onsubmit = function (e) {
      e.preventDefault(); err.textContent = "";
      var x = ta.value.replace(/\s+$/g, "").replace(/^\s+/g, "");
      if (!x) return;
      if (Date.now() - lastSend < 3000) { err.textContent = "Wait a few seconds between messages."; return; }
      if (myRooms().indexOf(room) < 0) { err.textContent = "Log in to your Sina account to write here."; return; }
      var btn = document.getElementById("ch-send"); btn.disabled = true;
      ready().then(function () {
        var now = fb.database.ServerValue.TIMESTAMP, key = db.ref("rooms/" + room + "/msgs").push().key, up = {};
        up["rooms/" + room + "/msgs/" + key] = { u: uid, n: myName(), x: x.slice(0, MAX), t: now, a: !!(acct() && acct().user) };
        up["lastPost/" + uid] = now;   /* the database rules use this to refuse floods */
        return db.ref().update(up);
      }).then(function () { lastSend = Date.now(); ta.value = ""; ta.style.height = "auto"; ta.focus(); var nm = document.getElementById("ch-name"); if (nm) nm.textContent = myName(); },
        function () { err.textContent = "Not sent. Wait a few seconds and try again."; })
        .then(function () { btn.disabled = false; });
    };
  }

  window.SinaChat = { view: view, configured: function () { return !!FIREBASE; }, counts: function () { return counts; } };
  /* start the counter once the page has settled, so it never slows the first load */
  if (FIREBASE) window.addEventListener("load", function () { setTimeout(startPresence, 1200); });
})();
