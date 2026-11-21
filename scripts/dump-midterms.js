/* Dumps what the question audit needs, as JSON:  node scripts/dump-midterms.js out.json
   - every midterm lecture (summary sections, key points, MCQs) for years 1 and 2
   - every past-paper question (the real exam style) */
const fs = require("fs"), vm = require("vm"), path = require("path");
const dir = path.join(__dirname, "..", "js", "data");
global.window = {}; global.SINA = { subjects: [], lectures: {}, programs: [] }; global.window.SINA = SINA;
for (const f of fs.readdirSync(dir).filter(f => /^(index|lectures-.*|paperqs|papers|paperlec)\.js$/.test(f))) vm.runInThisContext(fs.readFileSync(path.join(dir, f), "utf8"), { filename: f });
const text = h => String(h || "").replace(/<br\s*\/?>|<\/p>|<\/li>|<\/h\d>/gi, ". ").replace(/<[^>]+>/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const out = { midterms: [], paper: [] };
for (const m of SINA.midterms || []) {
  const ids = (m.groups || []).flatMap(g => g.items), lecs = [];
  for (const id of ids) {
    const l = SINA.lectures[id]; if (!l) continue;
    lecs.push({
      id, title: l.title, subject: l.subject,
      sections: (l.summary || []).map(s => ({ id: s.id, title: s.title, text: text(s.html) })),
      keys: (l.exam || []).map(text),
      mcqs: (l.mcqs || []).map((q, i) => ({ i, q: text(q.q), options: (q.options || []).map(text), answers: q.multi || q.answers ? (q.answers || []) : [q.answer], multi: !!(q.multi || q.answers && q.answers.length > 1), why: text(q.why), figure: !!(q.figure || q.img || q.image) }))
    });
  }
  out.midterms.push({ id: m.id, program: m.program, subject: m.subject, title: m.title, date: m.date || "", lectures: lecs });
}
const psub = {}; (SINA.papers || []).forEach(p => { psub[p.id] = p.subject; });
for (const [pid, qs] of Object.entries(SINA.paperQs || {})) for (const q of qs) out.paper.push({ paper: pid, subject: psub[pid] || "", program: (SINA.subjects.find(x => x.id === psub[pid]) || {}).program || "", q: text(q.q), options: (q.options || []).map(text), answers: q.answers || [q.answer], multi: !!q.multi, why: text(q.why) });
fs.writeFileSync(process.argv[2] || "midterms.json", JSON.stringify(out));
console.log(out.midterms.map(m => m.id + ":" + m.lectures.reduce((a, l) => a + l.mcqs.length, 0)).join(" "), "| paper qs", out.paper.length);
