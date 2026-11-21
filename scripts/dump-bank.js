/* Writes the whole question bank (lecture MCQs + past-paper questions) to one JSON file for scripts/qdedupe.py.
   Usage: node scripts/dump-bank.js [out.json]   Reads js/data/*.js and changes nothing. */
const fs = require("fs"), vm = require("vm"), path = require("path");
const root = path.join(__dirname, "..", "js", "data");
const ctx = vm.createContext({ console, localStorage: {} }); ctx.window = ctx;
for (const f of fs.readdirSync(root).filter(x => x.endsWith(".js"))) { try { vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx); } catch (e) {} }
const S = ctx.SINA, out = [];
const imgs = q => [].concat((q.slides || []).map(s => s.src), q.img ? [q.img] : [], q.m3d ? ["m3d:" + JSON.stringify(q.m3d)] : [], q.target ? ["target:" + q.target] : []);
for (const id in S.lectures) (S.lectures[id].mcqs || []).forEach((q, i) => out.push({ src: "lec:" + id + "#" + i, q: q.q, o: q.options, a: q.answers || [q.answer], img: imgs(q) }));
for (const p of S.papers) (p.questions || []).forEach((q, i) => out.push({ src: "paper:" + p.id + "#" + i, q: q.q, o: q.options, a: q.answers || [q.answer], img: imgs(q) }));
fs.writeFileSync(process.argv[2] || "bank.json", JSON.stringify(out)); console.log(out.length + " questions");
