/* What's new. Newest entry first. One block per day: add new lines to today's block if it already exists.
   Style: short changelog lines, developer voice (Added / Fixed / Changed), no "you". */
window.SINA = window.SINA || { subjects: [], lectures: {} };
SINA.updates = [
  { date: "12 November 2026", items: [
    "Added: Sina mock exams for Anatomy 3: 4 ENT mocks in Prof. Hajij's style and 5 neuroanatomy mocks in Prof. Fliyou's style, 25 questions each, playable with notes and slide highlights, plus PDFs.",
    "Changed: Anatomy 3 past paper group \"Normal anatomy\" renamed to \"Anatomy\".",
    "Added: accounts (Settings → Account and sync): log in on your phone and computer to keep the same progress on both.",
    "Added: Include 3D model questions on/off switch on the Anatomy 3 question picker.",
    "Fixed: picture questions repeating in ear lecture quizzes.",
    "Added: Fliyou neuroanatomy practice tests 1 to 3 as playable quizzes (114 questions with explanations); Hajij ENT midterm Q&A playable too (10 questions).",
    "Added: 48 ENT questions (ear parts 1 and 2, larynx, thyroid), with slide highlights.",
    "Changed: Anatomy 3 past papers grouped into Neuroanatomy, ENT and Normal anatomy.",
    "Changed: tapping a brain lobe on picture questions counts anywhere inside the lobe.",
    "Fixed: missing green slide highlights on about 3,000 questions.",
    "Added: change password on the account page."
  ] },
  { date: "11 November 2026", items: [
    "Added: 3D questions for Anatomy 3 (98 questions): a rotatable 3D model with one structure highlighted. Brain lobes and gyri, functional areas, deep nuclei and ventricles, brainstem and cranial nerves, cerebellum, spinal cord tracts, ear and larynx.",
    "Added: interactive 3D models on the Visual tab of the ENT and neuroanatomy lectures: tap a structure to see its name.",
    "Added: Introduction and embryological development of the CNS (Anatomy 3, Neuroanatomy), with summary, flashcards, visual, high-yield notes and 29 questions; on the ENT/Neuroanat midterm.",
    "Added: 46 Public Health questions (1st year), with slide highlights.",
    "Added: right/wrong notes for every option in all Public Health lectures."
  ] },
  { date: "10 November 2026", items: [
    "Added: Anatomy of the cerebellum (Anatomy 3, Neuroanatomy), with summary, flashcards, visual, high-yield notes and 35 questions.",
    "Added: ENT/Neuroanat midterm (17 November) on the Upcoming midterm page.",
    "Added: Midterm topics only for Anatomy 3 neuroanatomy: broad core questions for the midterm; Whole lecture adds the detailed ones. 72 new neuroanatomy questions.",
    "Added: right/wrong notes for every option in the ENT/Neuroanat midterm lectures and in all Semiology lectures."
  ] },
  { date: "9 November 2026", items: [
    "Added: question count menu at the top of each quiz (10 to All). With Midterm topics only, the count only uses midterm-topic questions.",
    "Added: 66 medium-level Semiology midterm questions (digestive exam, jaundice, constipation, GERD, GI bleeding, thyroid, and the midterm topics of pituitary, adrenal and diabetes), with option notes and slide highlights.",
    "Removed: 45 repeated questions in the Semiology midterm lectures (mostly GERD and GI bleeding).",
    "Fixed: 55 questions across 2nd-year subjects where a wrong option could also be defended (clearer stems or replaced options).",
    "Fixed: 1 reported question, Semiology, Jaundice.",
  ] },
  { date: "9 November 2026", items: [
    "Fixed: 1 reported question, Semiology, Gastro-oesophageal reflux disease.",
    "Fixed: 2 reported questions, Semiology, Digestive physical examination.",
  ] },
  { date: "8 November 2026", items: [
    "Changed: Midterm topics only now starts the midterm quiz straight away (ticked midterm lectures, or all of them).",
    "Added: a short note under every answer option explaining why it is right or wrong, for all questions of the 10 Semiology midterm lectures (endocrine and digestive).",
    "Changed: Semiology midterm lectures: removed brackets in answer options that hinted at the correct answer, and the \"(choose all)\" hint in question stems.",
    "Added: Weak spots: tick which of the weak lectures go into the weak-spot quiz.",
    "Added: Midterm topics only / Whole lecture choice before Semiology questions. Pituitary, adrenal and diabetes keep only the announced midterm topics; questions outside them are tagged Not on the midterm in whole-lecture mode.",
    "Fixed: 1 reported question, Semiology, Digestive physical examination.",
  ] },
  { date: "7 November 2026", items: [
    "Added: note on the Midterm page and the question picker: questions cover whole lectures, not only the announced midterm scope.",
    "Fixed: 1 reported question, Semiology, Adrenal semiology.",
    "Fixed: 1 reported question, Semiology, Nausea and vomiting.",
    "Added: 5 Semiology past papers (128 MCQs): gastro-endocrine 2nd session 2023, final 2025, mock test with correction, GI and endocrine past paper, endocrine MCQs (Pr Hristov).",
  ] },
  { date: "6 November 2026", items: [
    "Fixed: 3 reported Adrenal semiology questions that relied on a figure (phaeochromocytoma CT, paraganglioma locations, Cushing aetiologies) reworded to be answerable from the lecture text; note added to the Graves' triad question (lecture vs textbook triad).",
    "Added: Nausea and vomiting lecture (Semiology digestive): summary, 16 flashcards, 78 MCQs with slide highlights, lecture PDF download.",
    "Added: 81 medium-level Semiology endocrine MCQs on the midterm scope (thyroid 25, pituitary 15, adrenal 24, diabetes 17), with slide highlights.",
    "Changed: a single-lecture quiz now has an Add more lectures button to mix several lectures in one quiz.",
    "Added: Weak spots: your 5 lowest-scoring lectures and a 20-question quiz built from them (on the home page, the midterm card and My progress).",
    "Fixed: options merged or repeated in 5 past-paper questions (Anatomy 2 abdomen mock, Molecular biology Jan 2023, Histology exam)."
  ] },
  { date: "5 November 2026", items: [
    "Changed: reformulated how scores are calculated for MCQs and papers to make it as realistic as possible.",
    "Added: more Semiology MCQs (endocrine).",
    "Added: new MCQs for Semiology (digestive and endocrine).",
    "Removed: Neurology, musculoskeletal and obstetrics/urinary Semiology past papers.",
    "Changed: Semiology midterm, Digestive part set: physical examination, jaundice, GERD, GI bleeding, constipation, nausea and vomiting (coming)."
  ] },
  { date: "4 November 2026", items: [
    "Added: green highlights on the answering slide lines for all Semiology questions (respiratory, cardiovascular, digestive, endocrine).",
    "Added: green highlights on the slide lines that answer each Pituitary and Diabetes semiology question.",
    "Changed: leaderboard is now weekly and resets every Tuesday at 23:00.",
    "Fixed: Download lecture (PDF) on iPhone and iPad now opens the share sheet to save the file; on computers it downloads.",
    "Fixed: lectures in the cram plan open that lecture's questions instead of the whole subject.",
    "Added: Pituitary semiology and Diabetes semiology lectures (summary, 19 questions each with slides, flashcards).",
    "Added: past papers GI semiology midterm 2023 and Semiology I midterm 2022 as quizzes.",
    "Changed: Semiology midterm, Endocrine part set (thyroid; pituitary, adrenal and diabetes in part). Digestive part not announced yet.",
    "Added: Anki-style review heatmaps, for AnKing on its page and for lecture flashcards on My progress.",
    "Fixed: chapter picker in Mix several chapters overflowing the screen on phones; now a checklist.",
    "Added: pick parts of a chapter (Pathology, Physiology, Pharmacology...) in Mix several chapters.",
    "Added: AnKing progress tracker (cards learned, questions seen, accuracy, day streak, cards due over the next 7 days, progress by chapter).",
    "Added: mix several AnKing chapters in one quiz or flashcard session.",
    "Removed: flashcard flip and swipe animations.",
    "Added: AnKing flashcard mode, scheduled like Anki (Again / Hard / Good / Easy), with a daily count of due cards and a Review now button.",
    "Changed: lecture flashcards use the same Anki-style scheduling; due cards come first.",
    "Added: due flashcards on the Review page and in the daily reminder.",
    "Added: Mark button in quizzes to come back to a question, and a question map to jump to any question.",
    "Changed: Previous and Next buttons moved above the question.",
    "Changed: Sketchy, Pixorize and Physeo pictures in a swipeable slider; tap a picture to enlarge it.",
    "Added: Sketchy, Pixorize and Physeo pictures under AnKing questions (30,584 pictures, shown after answering, tap to open).",
    "Added: AnKing Step 1 as multiple-choice questions (29,048 questions with their pictures), on the USMLE prep page, by First Aid chapter, section and topic. Private: locked with a password.",
    "Changed: Endocrine semiology slides converted from PowerPoint to PDF; Download lecture on Thyroid and Adrenal semiology now gives the PDF.",
    "Changed: source links for the 2026-2027 Digestive semiology slides (examination, jaundice, hepatomegaly, diarrhoea, dysphagia, GERD, GI bleeding) and Endocrine semiology slides (thyroid, adrenal).",
    "Added: 5 more Endocrine semiology lectures listed as coming (pituitary, parathyroid, gonads, diabetes, dyslipidaemia and hyperuricaemia).",
    "Added: upcoming midterms on 10 November for 1st year (Physics and Biophysics) and 2nd year (Semiology, Digestive and Endocrine). Exact lectures not announced yet, so each covers the whole chapters for now.",
    "Changed: a midterm can now cover several subjects, and past midterms no longer show on the home page."
  ] },
  { date: "3 November 2026", items: [
    "Changed: Sina mock options rewritten so the right answer is no longer usually the longest one (341 questions; it is now the longest in about 1 in 4, as by chance).",
    "Fixed: resumed quizzes now show the current slides and explanations instead of an old saved copy.",
    "Added: explanations on about 710 Clinical Biochemistry questions that had none, quoting the slide that answers them.",
    "Added: the new Clinical Biochemistry questions now show the lecture slide behind the answer, with the part that answers it in green (1,041 questions)."
  ] },
  { date: "2 November 2026", items: [
    "Added: every Clinical Biochemistry and Chemistry lecture now has 100 to 120 questions, so 50 and 100-question quizzes on a single lecture never repeat.",
    "Added: Sina mock questions now show the lecture slide behind the answer, with the part that answers it in green (506 of 552 questions).",
    "Fixed: green highlights on the Insulin and Steroid hormones slides now line up with the 2026-2027 versions.",
    "Added: 25-question Sina mock exams on the first 5 lectures of 12 more semester 1 and 3 subjects (Medical Terminology, Public Health, Genetics, Cell Biology, Physics, Biophysics, Chemistry; Physiology, Semiology, Clinical Biochemistry, First Aid, History of Medicine).",
    "Fixed: Start here lectures in the cram plan drawn as separate boxes.",
    "Added: Sina mock exams for 9 first-year subjects (Anatomy 1 and 2, Physiology, Biochemistry, Immunology, Hematology, Embryology, Histology, Bacteriology).",
    "Added: covered-label picture questions for Anatomy 1 and 2 (28 labelled plates: upper limb, thorax, heart, lungs, abdomen, pelvis).",
    "Added: slide links (See the slide that explains this) on the questions of every lecture with slides, 1st and 2nd year.",
    "Added: 47 past papers turned into online quizzes and timed exams, 1st and 2nd year.",
    "Fixed: lists that stayed half invisible after a fast scroll (fade-in on scroll), mostly on the 1st year home page.",
    "Fixed: the Start bar of the Questions tab floating over the lecture list on iPad.",
    "Fixed: sideways scrolling on phones for lecture tables, previous/next links and past paper lists.",
    "Changed: Insulin and Steroid hormones slides replaced with the 2026-2027 versions (same content).",
    "Added: spaced repetition: missed questions come back after 1, 3, 7, 16 and 35 days, in Review due on the home page.",
    "Added: study reminders (Settings > Reminders): one notification a day for reviews due or daily practice.",
    "Added: reports can include a picture.",
    "Added: Study next box after every quiz and exam, linking to the lectures and sections behind the missed questions.",
    "Added: more question counts (25, 50, 70, 100) and a custom number.",
    "Changed: quizzes now pick questions not asked before first, spread over every chosen lecture; once all are seen, the oldest come back first.",
    "Added: past papers flag questions on lectures outside the next midterm, with an Only midterm questions button.",
    "Fixed: wording of the alkaline phosphatase and Graves' disease questions in Clinical Biochemistry.",
  ]},
  { date: "1 November 2026", items: [
    "Added: Add to home screen guide for iPhone, iPad and Android (Settings menu).",
    "Changed: leaderboard refreshes live every 15 seconds; a posted score appears at once.",
    "Changed: Clinical Biochemistry past-paper questions with three correct answers rewritten to have one or two.",
    "Changed: mind maps redrawn with a Map view (radial) and a Cards view, each with Test me.",
    "Changed: pathway schematics shown as a step-by-step line; anatomy Visual tabs show the real labelled picture with Hide labels.",
    "Added covered-label picture questions: real labelled atlas plates (OpenStax) with the labels hidden, one yellow tile asked.",
    "Added Spotter mode for anatomy: tap the named structure on the picture.",
    "Changed: diagram questions rewritten as plain questions.",
    "Added Resume quiz: an unfinished quiz reopens at the next unanswered question (home tile and banner).",
    "Added Jump back to where you stopped on lecture summaries.",
    "Added source slides with green highlights to the Renal physiology and Bioenergetics questions.",
    "Added Français button on lecture summaries (machine translation, saved on the device).",
    "Added Mark as revised on every lecture, with ticks and a revised count on subject pages.",
    "Changed: every question allows several picks, with no hint on how many answers are correct.",
    "Added Renal physiology lectures 1, 2, 4, 5 and 6 (introduction, nephron, regulation of GFR, tubular reabsorption, acid-base balance).",
    "Added Bioenergetics (6 lectures): introduction, energy metabolism, lipids, ATP, energy balance, revision.",
    "Changed: Physiology sections are Neurophysiology, Muscle, Special senses, Renal physiology and Bioenergetics.",
    "Added partial points on multi-answer questions: (right picks − wrong picks) ÷ number of correct answers.",
    "Added section arrows on the home page for Anatomy, Physiology and Semiology; section filter on subject pages.",
    "Fixed: \"Correct answer\" label overlapping the option notes in answer reviews."
  ]},
  { date: "31 October 2026", items: [
    "Changed: Anatomy 3 lectures grouped as Faciomaxillary, ENT and Neuroanatomy.",
    "Fixed: home page was wider than the screen on phones during midterm week.",
    "Added search inside questions and flashcards (e.g. \"T3\", \"cortisol\"): results open the exact question or card.",
    "Added heartbeat reading line under the lecture tabs that fills as the page is read.",
    "Changed: cram plan folds into one bar; tap it for the full plan.",
    "Fixed: What's new button showed two labels.",
    "Changed: Clinical Biochemistry midterm date is Tuesday 3 November.",
    "Changed: cram plan shows the two weakest lectures, with a bar to show the full plan; wider midterm card; What's new glows orange on hover.",
    "Changed: home page quick access (Continue where you left off, Redo my mistakes, My progress, Leaderboard) replaces the link bar; What's new moved to the top bar.",
    "Fixed: midterm countdown now shows even when the midterm sheet cannot be read.",
    "Added animations: answer feedback (pulse and heartbeat on correct, shake on wrong), streak flame after 5 correct in a row, animated score with gold feathers on a perfect score.",
    "Added 3D flashcard flip; swipe right (knew it) or left (still learning) on phones.",
    "Added page transitions, home subjects rising in on scroll, snake loader for slides and the leaderboard, faster-flapping wings on tap, pulsing countdown on exam day.",
    "Added midterm-week mode: in the last 7 days the midterm card shows a cram plan (weakest lectures first, questions per day); red the day before.",
    "Changed: the welcome screen opens on every visit, with the caduceus animation (snakes rise up the rod, wings open, Sina appears), then the year choice. Skip intro button, or tap anywhere / press Enter to skip.",
    "Added Leaderboard: post exam-mode past paper scores under a nickname; ranking per paper and overall.",
    "Changed: Report a mistake now sends the report directly.",
    "Added animated caduceus to the home page.",
    "Added midterm card progress ring with heartbeat trace, and day countdown.",
    "Fixed: midterm progress ring now counts past paper questions and no longer rounds a small start down to 0%.",
    "Added My progress: accuracy per lecture, weakest lectures, streak.",
    "Added Redo my mistakes: every missed question in one quiz.",
    "Added Exam mode (timed, answers at the end) for past papers and lecture sets.",
    "Added Report a mistake on every answered question.",
    "Added 88 questions to the Clinical Biochemistry midterm lectures (40 per lecture).",
    "Fixed: the question count setting now matches the questions served.",
    "Added full-screen slide viewer with close button and zoom.",
    "Added green highlight on the slide text that answers each question.",
    "Fixed: flowchart picture questions now show the diagram labels, with the missing box marked \"?\".",
    "Fixed: questions that relied on a previous question now stand alone.",
    "Changed: rounded lecture picker; midterm countdown on the home page.",
    "Added real anatomy pictures (OpenStax) to anatomy picture questions, flashcards and Visual tabs, replacing the drawn shapes.",
    "Added Previous/Next navigation in quizzes; skipping a question reveals its answer.",
    "Changed: answer options are shuffled on retries and repeat attempts."
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
