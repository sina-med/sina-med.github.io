#!/usr/bin/env python3
"""Question quality audit for Sina MCQs (read-only: it never edits the bank).

  node scripts/dump-midterms.js mt.json
  python3 scripts/qaudit.py profile mt.json profile.json       # exam style learned from the past papers
  python3 scripts/qaudit.py audit   mt.json out/ [midterm-id]  # lint + source pin + blind retrieval check
  python3 scripts/qaudit.py gate    mt.json new.json out/      # same checks for NEW questions before they are added
  python3 scripts/qaudit.py blind-export mt.json out/ [midterm-id]   # key-less batches for an independent reader
  python3 scripts/qaudit.py blind-score  mt.json answers.json        # compare the reader's answers with the keys

A new question is {"lec": lecture id, "q": stem, "options": [...], "answers": [indexes], "why": text}.
Every check is a flag for a person to look at, not a verdict.
"""
import csv, json, os, re, sys, statistics as st
from collections import Counter, defaultdict
from sklearn.feature_extraction.text import TfidfVectorizer

PIN_MIN = 0.12          # below this the correct answer has no clear support in the lecture text
CUE_RATIO = 1.3         # correct option this much longer than the median of the others = a length cue

def words(t): return len(re.findall(r"\S+", t or ""))
def clean(t): return re.sub(r"[→↑↓≈×·]", " ", re.sub(r"[₀-₉⁰-⁹]", lambda m: m.group(0), t or ""))

# ---------- 1. exam style learned from the past papers ----------
def profile(mt):
    by = defaultdict(list)
    for q in mt["paper"]: by[q["subject"] or "all"].append(q); by["ALL"].append(q)
    out = {}
    for k, qs in by.items():
        if len(qs) < 40 and k != "ALL": continue
        one = [q for q in qs if len(q["answers"]) == 1 and len(q["options"]) > 1]
        cue = sum(1 for q in one if is_cue(q)) / max(1, len(one))
        out[k] = dict(n=len(qs), multi=round(sum(len(q["answers"]) > 1 for q in qs) / len(qs), 2),
                      opt5=round(sum(len(q["options"]) == 5 for q in qs) / len(qs), 2),
                      stem_words=st.median(words(q["q"]) for q in qs), opt_words=st.median(words(o) for q in qs for o in q["options"]),
                      long_cue=round(cue, 2), neg=round(sum(bool(re.search(r"\b(NOT|EXCEPT|FALSE|INCORRECT)\b", q["q"])) for q in qs) / len(qs), 2),
                      aota=round(sum(any(re.search(r"(all|none) of the above", o, re.I) for o in q["options"]) for q in qs) / len(qs), 3))
    return out

def is_cue(q):
    if len(q["answers"]) != 1: return False
    a = q["answers"][0]
    if a >= len(q["options"]): return False
    L = [len(o) for o in q["options"]]; others = [l for i, l in enumerate(L) if i != a]
    return L[a] == max(L) and L[a] >= CUE_RATIO * max(1, st.median(others))

# ---------- 2. source units of a lecture ----------
def units(lec):
    U = []
    for s in lec["sections"]:
        for sent in re.split(r"(?<=[.;:])\s+(?=[A-Z0-9(])|\s+\.\s+", s["text"]):
            sent = sent.strip()
            if words(sent) >= 4: U.append(dict(sec=s["title"], text=sent))
    for k in lec.get("keys", []):
        if words(k) >= 3: U.append(dict(sec="Key points", text=k))
    return U

class Index:
    def __init__(self, lec):
        self.U = units(lec)
        self.v = TfidfVectorizer(sublinear_tf=True, ngram_range=(1, 2), stop_words="english", token_pattern=r"(?u)\b[\w₀-₉²³⁴]{2,}\b")
        corpus = [clean(u["text"]) for u in self.U] or ["empty"]
        self.X = self.v.fit_transform(corpus)
    def best(self, text):
        if not self.U: return 0.0, None
        s = (self.X @ self.v.transform([clean(text)]).T).toarray().ravel()
        i = int(s.argmax()); return float(s[i]), self.U[i]

# ---------- 3. checks on one question ----------
def check(q, idx, fig=False):
    fl = []; opts = q["options"]; ans = q["answers"]
    if len(opts) < 2: fl.append("too_few_options")
    if len(set(o.strip().lower() for o in opts)) < len(opts): fl.append("duplicate_options")
    if any(a >= len(opts) or a < 0 for a in ans): fl.append("answer_out_of_range"); return fl, None, None
    if len(ans) == len(opts): fl.append("every_option_correct")
    if any(re.search(r"(all|none) of the above", o, re.I) for o in opts): fl.append("all_none_of_above")
    if not (q.get("why") or "").strip(): fl.append("no_explanation")
    if is_cue(q): fl.append("length_cue")
    pin = None; blind = None
    if not fig and len(opts) > 1:
        key = " ".join(opts[a] for a in ans)
        sc, u = idx.best(q["q"] + " " + key)
        pin = dict(score=round(sc, 3), sec=u["sec"] if u else "", text=(u["text"][:160] if u else ""))
        if sc < PIN_MIN: fl.append("unsupported_by_lecture")
        # blind retrieval: pick the option the lecture text supports best, without looking at the key
        if len(ans) == 1:
            S = [idx.best(q["q"] + " " + o)[0] for o in opts]
            top = max(range(len(S)), key=S.__getitem__)
            if top != ans[0] and S[top] >= 1.25 * max(S[ans[0]], 0.02) and S[top] >= 0.15:
                blind = dict(picked=top, picked_score=round(S[top], 3), key_score=round(S[ans[0]], 3)); fl.append("blind_disagrees")
    return fl, pin, blind

def audit(mt, outdir, only=None):
    os.makedirs(outdir, exist_ok=True); allrows = []; summ = []
    for m in mt["midterms"]:
        if only and m["id"] != only: continue
        rows = []
        for lec in m["lectures"]:
            idx = Index(lec)
            for q in lec["mcqs"]:
                fl, pin, blind = check(q, idx, q.get("figure") or re.search(r"arrow|pictured|shown|figure|image", q["q"], re.I) is not None and len(q["q"]) < 45)
                rows.append(dict(midterm=m["id"], lecture=lec["id"], i=q["i"], q=q["q"], key="; ".join(q["options"][a] for a in q["answers"] if a < len(q["options"])),
                                 flags=" ".join(fl), pin_score=pin["score"] if pin else "", pin_section=pin["sec"] if pin else "", pin_text=pin["text"] if pin else "",
                                 blind_pick=q["options"][blind["picked"]] if blind else ""))
        with open(os.path.join(outdir, m["id"] + ".csv"), "w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
        c = Counter(fl for r in rows for fl in r["flags"].split())
        one = [r for r in rows if r["flags"] is not None]
        summ.append((m["id"], len(rows), c)); allrows += rows
    for mid, n, c in summ:
        print(f"{mid}: {n} questions | " + ", ".join(f"{k} {v}" for k, v in c.most_common()))
    return allrows

def blind_export(mt, outdir, only=None):
    """Key-less batches for an INDEPENDENT reader (a person, or a model that has not seen the keys): it answers from the lecture text only."""
    os.makedirs(outdir, exist_ok=True); n = 0
    for m in mt["midterms"]:
        if only and m["id"] != only: continue
        for lec in m["lectures"]:
            qs = [dict(id=f"{lec['id']}#{q['i']}", q=q["q"], options=q["options"]) for q in lec["mcqs"] if not q.get("figure")]
            json.dump(dict(lecture=lec["id"], source=[dict(section=s["title"], text=s["text"]) for s in lec["sections"]], questions=qs), open(os.path.join(outdir, lec["id"] + ".json"), "w"), indent=1, ensure_ascii=False); n += len(qs)
    print(n, "key-less questions written to", outdir)

def blind_score(mt, answers_file):
    """answers_file: {"<lecture>#<i>": [chosen indexes]}. Lists every question where the independent reader disagrees with the key."""
    ans = json.load(open(answers_file)); bad = tot = 0
    for m in mt["midterms"]:
        for lec in m["lectures"]:
            for q in lec["mcqs"]:
                k = f"{lec['id']}#{q['i']}"
                if k not in ans: continue
                tot += 1
                if sorted(ans[k]) != sorted(q["answers"]): bad += 1; print("DISAGREE", k, "|", q["q"][:80], "| key", q["answers"], "| reader", ans[k])
    print(tot, "answered,", bad, "disagree")

def gate(mt, new, outdir):
    os.makedirs(outdir, exist_ok=True)
    L = {l["id"]: l for m in mt["midterms"] for l in m["lectures"]}; I = {}
    ok, bad = [], []
    for q in new:
        if q["lec"] not in I: I[q["lec"]] = Index(L[q["lec"]])
        fl, pin, blind = check(q, I[q["lec"]])
        rec = dict(q, flags=fl, pin=pin, blind=blind); (bad if fl else ok).append(rec)
    comp = Counter(len(q["answers"]) for q in new); pos = Counter(a for q in new for a in q["answers"])
    print("answers per question:", dict(sorted(comp.items())), "| position of correct options:", dict(sorted(pos.items())), "| options per question:", dict(Counter(len(q["options"]) for q in new)))
    if pos and max(pos.values()) > 0.4 * sum(pos.values()): print("WARNING: correct options pile up in one position; shuffle before adding (the quiz shows options in stored order)")
    if comp and max(comp.values()) > 0.6 * len(new): print("WARNING: most questions have the same number of correct answers, which is itself a guessing cue")
    json.dump(ok, open(os.path.join(outdir, "passed.json"), "w"), indent=1, ensure_ascii=False)
    json.dump(bad, open(os.path.join(outdir, "flagged.json"), "w"), indent=1, ensure_ascii=False)
    print(len(new), "new ->", len(ok), "passed,", len(bad), "flagged ->", outdir)

if __name__ == "__main__":
    a = sys.argv[1:]
    if not a: print(__doc__); sys.exit()
    mt = json.load(open(a[1]))
    if a[0] == "profile": json.dump(profile(mt), open(a[2], "w"), indent=1); print(json.dumps(profile(mt)["ALL"]))
    elif a[0] == "audit": audit(mt, a[2], a[3] if len(a) > 3 else None)
    elif a[0] == "blind-export": blind_export(mt, a[2], a[3] if len(a) > 3 else None)
    elif a[0] == "blind-score": blind_score(mt, a[2])
    elif a[0] == "gate": gate(mt, json.load(open(a[2])), a[3])
