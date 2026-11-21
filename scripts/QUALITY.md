# Question quality workflow

1. `node scripts/dump-midterms.js mt.json`: export midterm lectures (summary, key points, MCQs) and all past-paper questions.
2. `python3 scripts/qaudit.py profile mt.json profile.json`: how the real exams are written (share of "choose all", options per question, stem length, length cue), per subject.
3. Write new questions in the style of that subject's papers. Each is `{lec, q, options, answers, why}`.
4. `python3 scripts/qaudit.py gate mt.json new.json out/`: lint, source pin (best matching lecture sentence), blind retrieval check, and batch composition (answers per question, position of the correct options).
5. `python3 scripts/qdedupe.py check bank.json new.json out/`: repeats against the whole bank (`node scripts/dump-bank.js bank.json` first).
6. `python3 scripts/qaudit.py blind-export mt.json out/` writes key-less batches for an independent reader; `blind-score` compares that reader's answers with the keys.
7. `python3 scripts/qaudit.py audit mt.json out/` audits the questions already in the bank.

Flags are triage for a person, not verdicts. The blind retrieval check is a word-overlap baseline: it is noisy by design (it trips on wrong options that quote the lecture), so every hit gets read before anything is changed.
