#!/usr/bin/env python3
"""Duplicate check for Sina MCQs. It never edits or deletes existing questions.

  node scripts/dump-bank.js bank.json                      # export the current bank
  python3 scripts/qdedupe.py check bank.json new.json out/ # screen new questions before adding
  python3 scripts/qdedupe.py audit bank.json report.csv    # list repeats already in the bank

A question is {"q": stem, "o": [options], "a": [answer indexes], "img": [image or slide ids]} (img optional).
check writes out/accepted.json, out/review.json (possible repeats, a person decides) and out/blocked.json (repeats).
Score = 0.5 stem + 0.35 answer set + 0.15 named things (numbers, formulas, abbreviations).
Two questions that point at different pictures are never repeats, whatever their words.
"""
import csv, json, os, re, sys, unicodedata
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors

BLOCK, REVIEW = 0.85, 0.62
STOP = set("the a an of in on to is are was were and or for with by at as from that this which what following most likely best true false statement statements correct incorrect all none above not".split())

def norm(t):
    t = unicodedata.normalize("NFKD", t or "").lower()
    t = re.sub(r"[^a-z0-9 ]", " ", t)
    return " ".join(w for w in t.split() if w not in STOP)

def entities(t):
    """numbers, formulas and abbreviations in the original text (N2 vs C2H2, 40 vs 60 mmHg, ECG vs EEG)"""
    t = unicodedata.normalize("NFKD", t or "")
    return {m.lower() for m in re.findall(r"[A-Za-z]*\d+(?:\.\d+)?[A-Za-z0-9]*|\b[A-Z]{2,}[a-z0-9]*\b|\b(?:[A-Z][a-z]?\d*){2,}\b", t)}

def jac(a, b):
    return len(a & b) / len(a | b) if (a | b) else 1.0

def opt_set(q):
    return {norm(o) for o in (q.get("o") or []) if norm(o)}

def doc(q):
    return norm(q["q"]) + " || " + " | ".join(sorted(opt_set(q)))

def score(a, b, cos):
    ea, eb = entities(a["q"]), entities(b["q"])
    ent = jac(ea, eb) if (ea or eb) else 1.0
    ia, ib = set(a.get("img") or []), set(b.get("img") or [])
    if ia and ib and not (ia & ib):
        return 0.0, "different picture"
    s = 0.5 * cos + 0.35 * jac(opt_set(a), opt_set(b)) + 0.15 * ent
    if re.search(r"\b(arrow|shown|figure|image|picture|diagram|slide|photo)\b", a["q"].lower()) and not (ia and ib):
        s = min(s, BLOCK - 0.01)           # the question depends on a picture we cannot compare: a person decides
    if cos > 0.9 and ent < 1.0:
        s -= 0.12 * (1 - ent) * 3          # same words but a different number, formula or abbreviation
    return round(max(s, 0.0), 3), ""

def neighbours(texts, k=5):
    X = TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True).fit_transform(texts)
    nn = NearestNeighbors(n_neighbors=min(k, X.shape[0]), metric="cosine").fit(X)
    return nn.kneighbors(X)

def audit(bank, out):
    d, ix = neighbours([doc(q) for q in bank])
    seen, rows = set(), []
    for i in range(len(bank)):
        for dist, j in zip(d[i][1:], ix[i][1:]):
            key = (min(i, j), max(i, j))
            if i == j or key in seen: continue
            seen.add(key)
            s, why = score(bank[i], bank[j], 1 - dist)
            if s >= REVIEW: rows.append(("BLOCK" if s >= BLOCK else "REVIEW", s, bank[i]["src"], bank[i]["q"], bank[j]["src"], bank[j]["q"]))
    rows.sort(key=lambda r: -r[1])
    with open(out, "w", newline="") as f:
        w = csv.writer(f); w.writerow(["verdict", "score", "a_source", "a_stem", "b_source", "b_stem"]); w.writerows(rows)
    print(len(bank), "questions;", sum(r[0] == "BLOCK" for r in rows), "repeats,", sum(r[0] == "REVIEW" for r in rows), "to review ->", out)

def check(bank, new, outdir):
    os.makedirs(outdir, exist_ok=True)
    allq = bank + new
    d, ix = neighbours([doc(q) for q in allq], k=6)
    nb = len(bank)
    acc, rev, blk = [], [], []
    for n, q in enumerate(new):
        i = nb + n; best = (0.0, None, "")
        for dist, j in zip(d[i][1:], ix[i][1:]):
            if j >= i: continue          # compare with the bank and with earlier new questions only
            s, why = score(q, allq[j], 1 - dist)
            if s > best[0]: best = (s, allq[j], why)
        rec = dict(q, match=dict(score=best[0], src=best[1]["src"], q=best[1]["q"]) if best[1] else None)
        (blk if best[0] >= BLOCK else rev if best[0] >= REVIEW else acc).append(rec if best[1] and best[0] >= REVIEW else q)
    for name, lst in (("accepted", acc), ("review", rev), ("blocked", blk)):
        json.dump(lst, open(os.path.join(outdir, name + ".json"), "w"), ensure_ascii=False, indent=1)
    print("new", len(new), "-> accepted", len(acc), "| review", len(rev), "| blocked", len(blk), "|", outdir)

if __name__ == "__main__":
    a = sys.argv[1:]
    if len(a) == 3 and a[0] == "audit": audit(json.load(open(a[1])), a[2])
    elif len(a) == 4 and a[0] == "check": check(json.load(open(a[1])), json.load(open(a[2])), a[3])
    else: print(__doc__); sys.exit(1)
