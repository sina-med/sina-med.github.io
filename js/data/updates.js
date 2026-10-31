/* What's new. Newest entry first. One block per day: add new lines to today's block if it already exists.
   Style: short changelog lines, developer voice (Added / Fixed / Changed), no "you". */
window.SINA = window.SINA || { subjects: [], lectures: {} };
SINA.updates = [
  { date: "31 October 2026", items: [
    "Added 88 questions to the Clinical Biochemistry midterm lectures (40 per lecture).",
    "Fixed: the question count setting now matches the questions served.",
    "Added full-screen slide viewer with close button and zoom.",
    "Added green highlight on the slide text that answers each question.",
    "Fixed: flowchart picture questions now show the diagram labels, with the missing box marked \"?\".",
    "Fixed: questions that relied on a previous question now stand alone.",
    "Changed: rounded lecture picker; midterm countdown on the home page.",
    "Added real anatomy pictures (OpenStax) to anatomy picture questions, flashcards and Visual tabs, replacing the drawn shapes.",
    "Added Previous/Next navigation in quizzes; skipping a question reveals its answer."
  ]},
  { date: "30 October 2026", items: [
    "Upcoming midterm: Clinical Biochemistry (pre-analytical phase, thyroid, adrenal medulla, insulin, steroids).",
    "Added lecture: Thyroid hormones.",
    "New question format: A to D, 1 or 2 correct answers, explanation per option, source slide.",
    "Added Steroid hormones questions; rebuilt the other midterm lecture questions from past papers and tutorials.",
    "Added Practice section: questions by lecture or by past paper, per subject.",
    "Clinical Biochemistry past papers available as quizzes (2026 mock, 2023-2024 final, midterm recall)."
  ]},
  { date: "26 October 2026", items: [
    "Upcoming midterm: History of Medicine. Added the 2026-2027 booklet.",
    "Changed: lecture pages reduced to Summary, Flashcards and Go deeper, with a ⋯ menu for downloads and extras.",
    "Changed: each subject has Lectures, Questions, Visual, High yield, Resources and Past papers sections.",
    "Added mixed quizzes across several lectures.",
    "Added Previous/Next lecture, On this page, back-to-top and mobile search.",
    "Fixed lecture checkbox alignment."
  ]},
  { date: "25 October 2026", items: [
    "Added lecture: Ventricles and CSF (Anatomy 3).",
    "Changed: single Download lecture button per lecture.",
    "Fixed Electrical communication lecture link."
  ]},
  { date: "17 October 2026", items: [
    "Upcoming midterm: Neurophysiology.",
    "Added lectures: Synapses and chemical communication; Muscle physiology part I.",
    "Added two Neurophysiology practice midterms (quiz + PDF), Prof. Covasa's extra questions and the muscle workshop.",
    "Added: review and retry wrong answers after a quiz.",
    "Added source slides in quiz explanations."
  ]},
  { date: "8 October 2026", items: [
    "Added 15 past papers (Anatomy, Physiology, Semiology, Clinical Biochemistry).",
    "Added three Anatomy 3 mock midterms (quiz + PDF).",
    "Changed Anatomy 3 midterm list."
  ]},
  { date: "7 October 2026", items: [
    "Added USMLE prep page: official materials, free resources, question banks, Anki decks and a shared PDF folder."
  ]},
  { date: "4 October 2026", items: [
    "Added 390 Anatomy 3 midterm practice MCQs (quizzes + PDFs)."
  ]},
  { date: "27 September 2026", items: [
    "Added High yield tab to all anatomy lectures.",
    "Added YPT to Useful apps; updated Gizmo link.",
    "Added AnatomyZone videos to the eye lectures."
  ]},
  { date: "26 September 2026", items: [
    "1st Year: completed Virology, Physiology, Bacteriology, Histology, Embryology and Hematology.",
    "Added past papers: clinical virology review, Embryology/Histology and Hematology/Immunology mocks."
  ]},
  { date: "25 September 2026", items: [
    "1st Year: completed Anatomy 1, Anatomy 2, Biochemistry, Physics, Biophysics, Chemistry, Cell Biology, Genetics, Medical Terminology, Public Health and Immunology.",
    "Added 1st Year past papers (46 entries).",
    "Added year selection on first visit.",
    "Added View and Download buttons on lecture sources.",
    "Added Upcoming midterm lectures section.",
    "Changed menu layout: Upcoming midterm, Subjects, Past papers, Useful apps."
  ]},
  { date: "24 September 2026", items: [
    "Added year selector (1st and 2nd Year Anglo).",
    "Added Parasitology and Mycology (18 lectures) and Infectious Diseases (12 lectures).",
    "Added mind maps to the Visual tab.",
    "Added Language section to Settings."
  ]},
  { date: "23 September 2026", items: [
    "Added Toxicology (4 lectures), Pharmacology (6 lectures) and the first Infectious Diseases lecture.",
    "Expanded First Aid, Clinical Biochemistry and GI Semiology lectures to full versions.",
    "Changed: menu opens as an overlay.",
    "Fixed outdated source links."
  ]},
  { date: "22 September 2026", items: [
    "Added Pathological Anatomy (9 lectures) and History and Art of Medicine (7 lectures). Semester 3 complete.",
    "Added 3D models, reference picture galleries and the Orbital anatomy practice quiz.",
    "Added Settings (light/dark mode), Suggestion button and Useful apps.",
    "Fixed content errors in Ocular muscles and Nasal cavity; balanced option lengths."
  ]},
  { date: "20 September 2026", items: [
    "Completed Anatomy 3, Physiology, Semiology, First Aid and Clinical Biochemistry.",
    "Added picture questions and picture flashcards to every lecture.",
    "Added multi-answer questions, search, past papers from Drive and this page."
  ]},
  { date: "19 September 2026", items: [
    "Added Past papers section.",
    "Changed: resource cards with previews; rebuilt menu."
  ]},
  { date: "First version", items: [
    "Site launched with the first lectures, questions, flashcards, 3D models and Go deeper reading."
  ]}
];
/* "Last updated" always follows the newest entry above. */
SINA.updated = SINA.updates.length ? SINA.updates[0].date : "";
