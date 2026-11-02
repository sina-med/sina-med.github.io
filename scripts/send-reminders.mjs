/* Sends Sina study reminders (Web Push). Run every 30 minutes by .github/workflows/reminders.yml.
   Subscriptions live in the "Push" tab of the Sina Sheet, read through the Apps Script web app. */
import webpush from "web-push";

const API = "https://script.google.com/macros/s/AKfycbxek7OqdfLJCTbgM3qpqrzZt5kYJBaVh2Ryw-pLVJ0Zt-sQDqfsOag6KMI0uYmdKZZdLg/exec";
const PUBLIC = "BDVJdAFNPUErbVHrCi9mN6ciOLVDYXXpKJCe_cUyVBqR3MdKjHLwacGv9nmSQ5E8KjGQMTN5GMG0xp7iifR93DE";
const { VAPID_PRIVATE_KEY: PRIV, SINA_KEY: KEY } = process.env;
if (!PRIV || !KEY) { console.log("Reminders are not set up yet (missing repository secrets). Nothing sent."); process.exit(0); }
webpush.setVapidDetails("https://sina-med.github.io", PUBLIC, PRIV);

const WINDOW = 90; // minutes after the chosen time during which a reminder can still go out (scheduled runs can be late)
const res = await fetch(API + "?action=subs&key=" + encodeURIComponent(KEY));
const data = await res.json().catch(() => ({}));
if (!data.ok) { console.log("Could not read subscriptions:", data.error || res.status); process.exit(0); }

const now = Date.now(), sent = [], gone = [];
for (const s of data.subs || []) {
  const local = new Date(now - (Number(s.tz) || 0) * 60000);        // tz = getTimezoneOffset() of the device
  const day = local.toISOString().slice(0, 10), mins = local.getUTCHours() * 60 + local.getUTCMinutes();
  const target = (Number(s.h) || 0) * 60 + (Number(s.m) || 0);
  if (s.last === day || mins < target || mins >= target + WINDOW) continue;
  const due = Number(s.due) || 0, review = s.review && due > 0, daily = s.daily;
  if (!review && !daily) continue;
  const payload = review
    ? { title: "Sina: " + due + " question" + (due > 1 ? "s" : "") + " to review", body: "Questions you missed are due again today. A few minutes now keeps them fresh.", url: "#/review" }
    : { title: "Sina: daily practice", body: "Ten questions take about ten minutes. Pick up where you left off.", url: "#/" };
  try {
    await webpush.sendNotification(JSON.parse(s.sub), JSON.stringify(payload), { TTL: 6 * 3600 });
    sent.push({ e: JSON.parse(s.sub).endpoint, day });
  } catch (e) {
    if (e.statusCode === 404 || e.statusCode === 410) gone.push(JSON.parse(s.sub).endpoint);
    else console.log("Send failed", e.statusCode || e.message);
  }
}
if (sent.length || gone.length) {
  await fetch(API, { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ type: "sent", key: KEY, sent, gone }) }).catch(() => {});
}
console.log(`Checked ${(data.subs || []).length}, sent ${sent.length}, removed ${gone.length}.`);
