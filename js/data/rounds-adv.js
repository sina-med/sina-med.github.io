/* Wardle: Advanced cases (format 3), played in js/rounds-engine.js. Each case replaces the daily case at its slot.
   A case is a list of scenes. A scene opens with an optional event, then either a free workup (Ask, Examine, Order, then
   "I know what this is" and Treat) or a fixed flow of questions and results.
   Questions (q): options[0] is right (the site mixes the order); every option is meant to be defensible to a student with
   partial knowledge. notes explain each option and are shown only in the debrief. type: knowledge | priority (what a
   mistake on it means). src: a lecture + a phrase from it (checked by build/check_rounds.js). beyond: enrichment, not taught on Sina.
   branch: { optionIndex: branchId }; a branch plays its items, then the case moves to the next scene. */
window.SINA = window.SINA || { subjects: [], lectures: {} };
SINA.roundsAdv = [
{ slot: 2, v: 3, level: "Advanced", title: "Off his food and breathing fast",
  dx: "Severe pneumococcal pneumonia of the right lower lobe, complicated by an empyema",
  outcome: "Discharged home on day 12",
  short: "Treated with IV ceftriaxone; the empyema was drained on day 3. Follow-up chest imaging booked.",
  summary: "A 74-year-old smoker arrived confused rather than coughing. His chest signs, gas and X-ray showed a right lower lobe pneumonia with a small effusion; a delayed sample made his potassium look dangerous, and a BNP raised by age tempted a heart-failure label. On day 3 a fever that would not settle on the right antibiotic turned out to be an empyema.",
  patient: { who: "Bed 4 · Man, 74", line: "Confused for two days, not eating, breathing fast. Smoker (45 pack-years), type 2 diabetes, hypertension on metformin and ramipril." },
  vitals: { hr: 112, bp: "104/62", rr: 28, spo2: 90, t: "37.8", o2: "air" },
  scenes: [
  { id: "ed", workup: {
      ask: [
        { id: "sputum", q: "Is he coughing anything up?", a: "Since yesterday, thick yellow-green sputum, once streaked with blood.", chart: "Purulent sputum since yesterday, once blood-streaked.", v: "key" },
        { id: "pain", q: "Any pain when he breathes or coughs?", a: "He holds his right side when he coughs.", chart: "Right-sided pain on coughing.", v: "key" },
        { id: "ortho", q: "Is he breathless lying flat?", a: "No, one pillow as always.", chart: "No orthopnoea.", v: "useful" },
        { id: "weight", q: "Has he lost weight?", a: "About 3 kg in two months. Poor appetite since his wife died.", chart: "Lost 3 kg in 2 months.", v: "useful" },
        { id: "legs", q: "Any swelling of the legs?", a: "His ankles have been puffy for months.", chart: "Ankle swelling for months.", v: "low" },
        { id: "travel", q: "Any long journey or surgery lately?", a: "No, but he has stayed in bed for two days.", chart: "In bed for 2 days; no travel or surgery.", v: "low" },
        { id: "meds", q: "Any change in his medicines?", a: "No.", chart: "No medication changes.", v: "low" }
      ],
      exam: [
        { id: "resp", name: "Chest", chart: "R lower zone dull. Fremitus ↑ with bronchial breathing and coarse crackles above; fremitus and breath sounds abolished at the base. Trachea central.", v: "key", asks: "q1" },
        { id: "cvs", name: "Heart and neck veins", chart: "Regular, 112/min. JVP 2 cm above the sternal angle. Normal heart sounds.", v: "useful" },
        { id: "neuro", name: "Neurological", chart: "Drowsy, disoriented in time. No focal deficit, no neck stiffness.", v: "useful" },
        { id: "legsx", name: "Legs", chart: "Pitting oedema grade 1 at both ankles, symmetric. Calves soft.", v: "low" }
      ],
      tests: [
        { id: "cxr", name: "Chest X-ray", min: 15, v: "key", report: { title: "Chest radiograph, PA", lines: ["Alveolar opacity in the right lower lobe with an air bronchogram.", "Blunting of the right costophrenic angle with a meniscus.", "No volume loss. Mediastinum central.", "Conclusion: right lower lobe consolidation with a small effusion."] }, chart: "CXR: RLL consolidation, air bronchogram, small effusion.",
          explain: "Alveolar opacity with an air bronchogram is consolidation; the meniscus at the angle is fluid. No volume loss argues against a blocked bronchus." },
        { id: "abg", name: "Arterial blood gas", min: 10, v: "key", asks: "q2", slip: { title: "BLOOD GAS · ARTERIAL", sample: "Arterial, on room air", rows: [["pH", 7.47, "", 7.37, 7.43], ["PaCO₂", 31, "mmHg", 37, 43], ["HCO₃⁻", 23, "mmol/L", 22, 26], ["PaO₂", 57, "mmHg", 75, 100]] }, chart: "Gas: pH 7.47, PaCO₂ 31, HCO₃⁻ 23, PaO₂ 57.",
          explain: "High pH with low PaCO₂ and normal bicarbonate: an acute respiratory alkalosis. He hyperventilates because he is hypoxaemic." },
        { id: "ue", name: "Urea, creatinine, electrolytes", min: 30, v: "key", asks: "q3", slip: { title: "CLINICAL BIOCHEMISTRY", sample: "Serum", collected: "09:40", received: "12:41", late: true, rows: [["Urea", 13, "mmol/L", 2.5, 7.5], ["Creatinine", 168, "µmol/L", 60, 110], ["Sodium", 132, "mmol/L", 135, 145], ["Potassium", 6.2, "mmol/L", 3.5, 5.0]], comment: "Sample received more than 2 h after collection.", prev: "Creatinine 6 months ago: 88 µmol/L" }, chart: "U&E: urea 13, creat 168 (was 88), Na 132, K 6.2 (late sample).",
          explain: "Kidney injury (creatinine nearly doubled, urea up). The potassium arrived 3 hours late, which falsely raises it; the fresh repeat was 5.1 mmol/L." },
        { id: "cbc", name: "Blood count and CRP", min: 30, v: "useful", slip: { title: "HAEMATOLOGY · CRP", sample: "EDTA blood, serum", rows: [["White cells", 17200, "/mm³", 4000, 10000], ["Neutrophils", 86, "%", 40, 75], ["CRP", 230, "mg/L", 0, 5]] }, chart: "WBC 17,200 (86% neutrophils), CRP 230.",
          explain: "Neutrophilia with a high CRP supports a bacterial infection." },
        { id: "cult", name: "Blood cultures", min: 5, v: "useful", report: { title: "Blood cultures × 2", lines: ["Taken before antibiotics.", "Result expected in 24 to 48 hours."] }, chart: "Blood cultures sent.",
          explain: "Taken before the first dose, they named the germ and its susceptibility on day 3." },
        { id: "gram", name: "Sputum Gram stain", min: 30, v: "useful", report: { title: "Sputum, Gram stain", lines: ["Many neutrophils.", "Gram-positive, lancet-shaped diplococci."] }, chart: "Sputum: Gram+ lancet-shaped diplococci.",
          explain: "Gram-positive lancet-shaped diplococci point to Streptococcus pneumoniae." },
        { id: "bnp", name: "BNP", min: 30, v: "trap", asks: "q4", slip: { title: "CARDIAC MARKERS", sample: "Serum", rows: [["BNP", 168, "pg/mL", 0, 100]] }, chart: "BNP 168 (mildly raised).",
          explain: "Mildly raised, as BNP often is at 74. With no orthopnoea, normal neck veins and one-sided signs, it did not make heart failure the diagnosis." },
        { id: "trop", name: "Troponin", min: 30, v: "low", slip: { title: "CARDIAC MARKERS", sample: "Serum", rows: [["Troponin I", 0.01, "ng/mL", 0, 0.04]] }, chart: "Troponin normal.",
          explain: "Nothing in his story pointed to heart muscle injury." },
        { id: "ctpa", name: "CT pulmonary angiogram", min: 60, v: "low", report: { title: "CT pulmonary angiogram", lines: ["No pulmonary embolism.", "Right lower lobe consolidation with a small effusion."] }, chart: "CTPA: no embolism; RLL consolidation.",
          explain: "An hour spent, and contrast is on the list of kidney toxins while his creatinine was rising. The X-ray and examination had already explained the picture." }
      ],
      dx: [
        { name: "Pneumonia", need: true },
        { name: "Pulmonary embolism" },
        { name: "Acute left heart failure" },
        { name: "Lung cancer" },
        { name: "Pleural effusion" },
        { name: "Acute coronary syndrome", out: true }
      ],
      treat: ["q5"] } },
  { id: "d3", event: { at: "Day 3", clock: "Day 3", text: "On IV ceftriaxone he is less confused but still spikes 39 °C. Right base: dull up to the mid-zone, silent, trachea pushed slightly to the left. CRP 250 mg/L.",
      ifOrdered: { cult: "Blood cultures: Streptococcus pneumoniae, susceptible to penicillin.", none: "No blood cultures were taken before the first dose." },
      vitals: { hr: 104, bp: "118/70", rr: 24, spo2: 93, t: "39.0", o2: "2 L" } },
    flow: ["q6", "@fluid", "q7"],
    tests: [{ id: "fluid", name: "Pleural fluid", v: "key", slip: { title: "PLEURAL FLUID", sample: "Pleural tap, right", rows: [["Appearance", "Cloudy", "", "", ""], ["Albumin", 36, "g/L", "", ""], ["White cells", 18500, "/mm³", "", ""], ["Neutrophils", 92, "%", "", ""]], comment: "Gram stain: Gram-positive lancet-shaped diplococci." }, chart: "Pleural tap: cloudy, albumin 36 g/L, neutrophils, Gram+ diplococci.",
      explain: "Albumin above 30 g/L makes it an exudate; cloudy, full of neutrophils and with the germ in it, it is an empyema." }] },
  { id: "dc", event: { at: "Day 11", clock: "Day 11", text: "Afebrile for four days, eating again, walking the corridor. You are writing his discharge plan.", vitals: { hr: 82, bp: "126/74", rr: 16, spo2: 96, t: "36.9", o2: "air" } },
    flow: ["q8"] }
  ],
  q: {
    q1: { type: "knowledge", q: "Put the chest findings together. What is at the right base?",
      options: ["Consolidation with a small effusion below it", "Consolidation of the lower lobe alone", "An effusion with compressed lung above it", "Lower lobe collapse from a blocked bronchus"],
      notes: ["", "Consolidation explains the zone above, but not the base where fremitus and breath sounds are abolished: that part is fluid.", "Lung squashed above an effusion can sound bronchial, but it doesn't give coarse crackles and increased fremitus, and an effusion big enough to compress lung would start to push the trachea; his is central.", "A blocked bronchus lowers fremitus and pulls the trachea toward the collapsed lobe; here fremitus is increased above and the trachea is central."],
      why: "Read the signs as one set: dull throughout; above, increased fremitus with bronchial breathing and crackles (solid lung); at the base, everything abolished (fluid).",
      src: [{ lec: "semio-resp-syndromes", q: "increased fremitus, dullness, bronchial breathing, crackles" }, { lec: "semio-resp-syndromes", q: "A large effusion pushes the trachea away" }, { lec: "semio-resp-exam", q: "decreased or abolished in pleurisy, pneumothorax, atelectasis" }, { lec: "semio-resp-syndromes", q: "Retracted: bronchial obstruction or destruction, structures pulled toward it" }] },
    q2: { type: "knowledge", q: "How do you read this gas?",
      options: ["Acute respiratory alkalosis with hypoxaemia", "Respiratory alkalosis with renal compensation", "Metabolic acidosis with respiratory compensation", "Mixed respiratory and metabolic alkalosis"],
      notes: ["", "The kidneys compensate over days by lowering bicarbonate; his bicarbonate is still normal, so this is acute.", "A low PaCO₂ is what compensation looks like, but then the pH would be low; his is high. Expecting lactate in an infection is reasonable, the gas just doesn't show it.", "A metabolic alkalosis needs a raised bicarbonate; his is 23."],
      why: "pH above 7.43 with PaCO₂ below 37 and a normal bicarbonate: a primary, acute respiratory alkalosis. PaO₂ 57 is well under 75: he hyperventilates because he is hypoxaemic.",
      src: [{ lec: "biochem-acid-base", q: "PaCO₂ 37 to 43 mmHg" }, { lec: "biochem-acid-base", q: "PaO₂ 75 to 100 mmHg" }, { lec: "biochem-acid-base", q: "respiratory alkalosis (pH > 7.42" }, { lec: "biochem-acid-base", q: "Kidneys : slower but more powerful and lasting" }] },
    q3: { type: "priority", q: "Potassium 6.2, sample received 3 hours late, ECG unchanged. What now?",
      options: ["Repeat at once on a fresh sample, hold ramipril, monitor", "Insulin and glucose now, then repeat the potassium", "Hold ramipril and recheck with tomorrow's bloods", "No action: a normal ECG means it isn't dangerous"],
      notes: ["", "Treating a value with a known reason to be false gives insulin and risks hypoglycaemia for nothing; a sample analysed at once answers the question quickly, and he is monitored meanwhile.", "Holding ramipril is right, but a day is far too long if the rise is real: his kidneys are failing.", "A normal ECG does not make a high potassium safe: dangerous hyperkalaemia can occur with a normal ECG."],
      why: "Two things are true at once: delay falsely raises potassium, and his failing kidneys plus an ACE inhibitor could make a real rise. Confirm quickly, remove what could raise it, monitor the rhythm. The fresh sample: 5.1 mmol/L.",
      beyond: "A normal ECG does not exclude dangerous hyperkalaemia: ECG changes are an unreliable guide to how high the potassium is.",
      src: [{ lec: "biochem-preanalytical", q: "analyse within 2 hours (glucose falls; potassium and transaminases rise)" }, { lec: "physio-neurons", q: "dangerous potassium levels can disturb the heart's rhythm" }, { lec: "fa-renal", q: "ACE inhibitors, NSAIDs, contrast" }] },
    q4: { type: "knowledge", q: "BNP 168 pg/mL. How does it change your thinking?",
      options: ["Little: no congestion on examination, and BNP rises with age", "It confirms heart failure alongside the pneumonia", "Get an echocardiogram before starting antibiotics", "Disregard it: kidney injury makes BNP meaningless"],
      notes: ["", "A mildly raised marker without orthopnoea, raised neck veins or bilateral signs cannot make the diagnosis on its own.", "An echo may be useful later if congestion appears, but it must never delay antibiotics in severe pneumonia.", "Kidney failure distorts NT-proBNP in particular; and a marker is weighed against the patient, not thrown away by rule."],
      why: "BNP supports a diagnosis of heart failure; it doesn't make it. At 74 it is often raised, and his bedside signs argue against congestion.",
      src: [{ lec: "biochem-cardiac", q: "rise with age and in women" }, { lec: "biochem-cardiac", q: "NT-proBNP is distorted in renal failure" }, { lec: "semio-cv-lhf", q: "dyspnoea, orthopnoea, crackles" }, { lec: "semio-cv-intro", q: "Over 4 cm sustained is positive" }] },
    q5: { type: "priority", q: "How do you treat him?",
      options: ["Admit: oxygen, fluids, cultures, IV ceftriaxone", "Admit: oxygen, fluids, oral amoxicillin", "Oral amoxicillin at home, review in 48 hours", "Admit: oxygen, IV ceftriaxone plus vancomycin"],
      notes: ["", "Amoxicillin is the right molecule for mild pneumonia, but he is severe and confused: the parenteral route is used for serious infections.", "The right drug for mild pneumonia, but he is confused, hypoxaemic and his kidneys are failing: at home he gets no oxygen, no fluids and no monitoring.", "Vancomycin is added for pneumococcal meningitis until susceptibility is known; he has no neck stiffness."],
      branch: { 2: "home" },
      why: "Confusion, tachypnoea, tachycardia and a rising creatinine mean his organs are already poorly perfused: severe pneumonia. Hospital, oxygen, fluids, cultures, then IV ceftriaxone (or IV ampicillin or penicillin G).",
      src: [{ lec: "bacterio1-pneumoniae", q: "Severe pneumonia or bacteraemia: IV penicillin G or ampicillin if susceptible, otherwise ceftriaxone or cefotaxime" }, { lec: "bacterio1-pneumoniae", q: "Supportive care: oxygen, fluids, monitoring for sepsis" }, { lec: "infect-atb-principles", q: "serious infections" }, { lec: "fa-cardiovascular", q: "altered consciousness (confusion, agitation, coma), oliguria, tachypnoea, tachycardia" }, { lec: "bacterio1-pneumoniae", q: "high-dose IV ceftriaxone or cefotaxime + vancomycin until susceptibility is known" }] },
    q6: { type: "priority", q: "Still febrile on day 3. What next?",
      options: ["Diagnostic tap in the zone of dullness", "Switch ceftriaxone to a broader antibiotic", "Add a macrolide for atypical organisms", "CT pulmonary angiogram for an embolism"],
      notes: ["", "The germ is susceptible (or likely so): the drug isn't failing, a collection is.", "Atypical cover is a common reflex, but a growing, silent, dull zone pushing the trachea away is fluid, not a missed germ.", "He has been in bed, but the signs describe fluid, not a clot."],
      why: "A fever that persists on the right antibiotic, with a growing dull, silent zone pushing the trachea away, is a collecting effusion: sample it, sitting up, in the zone of dullness, just above the lower rib.",
      src: [{ lec: "semio-resp-syndromes", q: "Thoracentesis is done sitting, in the zone of dullness, above the lower rib" }, { lec: "semio-resp-syndromes", q: "A large effusion pushes the trachea away" }] },
    q7: { type: "knowledge", q: "What is this fluid?",
      options: ["An infected exudate: empyema", "A sterile exudate from the nearby pneumonia", "A transudate from heart failure", "A malignant effusion from a hidden tumour"],
      notes: ["", "Inflammation next to a pneumonia can give a sterile exudate, but germs on the Gram stain mean the fluid itself is infected.", "A transudate has albumin under 30 g/L, few cells and clear fluid.", "A cancer gives an exudate too and must still be excluded later, but neutrophils and diplococci point to infection."],
      why: "Albumin over 30 g/L, cloudy and full of cells: an exudate. With the germ in it, an empyema.",
      beyond: "An infected pleural collection (empyema) usually needs drainage as well as antibiotics.",
      src: [{ lec: "semio-resp-syndromes", q: "Exudate: albumin over 30 g/L (inflammatory). Transudate: under 30 g/L (mechanical)" }, { lec: "pathanat-vascular", q: "Cloudy, thick" }] },
    q8: { type: "priority", q: "What belongs in his discharge plan?",
      options: ["Repeat chest imaging to confirm the opacity clears", "Bronchoscopy before he leaves hospital", "A month of low-dose antibiotics against relapse", "Pneumococcal vaccine, and no further imaging"],
      notes: ["", "Reasonable if the opacity persists; the first step is to show whether it clears once the infection is treated.", "Courses are kept short to limit resistance; antibiotics don't prevent a relapse.", "The vaccine is worth offering, but it ignores the warning signs: a heavy smoker who lost weight and coughed blood."],
      why: "Cancer is a cause of hemoptysis, and a tumour blocking a bronchus can hide behind a pneumonia. In a smoker with weight loss, imaging must show the opacity has cleared.",
      src: [{ lec: "semio-resp-symptoms", q: "Causes: cancer, tuberculosis, bronchiectasis" }, { lec: "infect-atb-principles", q: "trend toward shorter courses" }, { lec: "bacterio1-pneumoniae", q: "conjugate vaccine" }] },
    h1: { type: "knowledge", q: "What kind of shock is this?",
      options: ["Septic shock, a distributive shock", "Hypovolaemic shock from poor intake", "Cardiogenic shock from a missed infarct", "Obstructive shock from a pulmonary embolism"],
      notes: ["", "Poor intake adds to it, but infection with vasodilation and capillary leak is the main mechanism.", "He is diabetic and elderly, but nothing points to the heart: normal neck veins, no cardiac story.", "Bed rest is a risk factor, but fever, purulent sputum and consolidation explain the picture."],
      why: "Infection, hypotension, mottling, slow capillary refill and a high lactate: the circulation fails from vasodilation and leak, and tissues switch to anaerobic metabolism.",
      src: [{ lec: "fa-cardiovascular", q: "Distributive : septic, anaphylactic" }, { lec: "fa-cardiovascular", q: "capillary refill over 3 seconds" }, { lec: "fa-cardiovascular", q: "lactate accumulates, causing metabolic acidosis" }] },
    h2: { type: "priority", q: "What does he need first?",
      options: ["Oxygen, fluids, IV antibiotics; noradrenaline if still low", "Noradrenaline first, fluids once the pressure is up", "Oxygen and fluids; antibiotics after the cultures return", "Oxygen and fluids; oral amoxicillin at a higher dose"],
      notes: ["", "Shock is first treated by filling the circulation; a vasopressor comes when pressure stays low despite fluids.", "Cultures are taken first if it costs no time, but antibiotics are not delayed for their result in septic shock.", "In shock the gut is poorly perfused; he needs a parenteral antibiotic."],
      why: "Restore oxygen delivery (oxygen, fluid filling, then a catecholamine if needed) and treat the cause (IV antibiotics).",
      src: [{ lec: "fa-cardiovascular", q: "catecholamines: adrenaline, noradrenaline, dobutamine" }, { lec: "fa-cardiovascular", q: "fluid filling" }] }
  },
  branches: {
    home: [{ event: { at: "The next morning", clock: "+18 h", text: "His daughter brings him back. He is drowsier, his knees are mottled and his hands cold. Capillary refill 4 seconds. Lactate 4.8 mmol/L. He passed little urine overnight.",
        note: "Daughter: \"He didn't drink anything, he just slept.\"",
        why: "A recognised course for severe pneumonia treated as mild: he already had signs of poor organ perfusion, and at home he got no oxygen, fluids or monitoring. It does not happen to every patient sent home, but the risk was foreseeable.",
        vitals: { hr: 128, bp: "82/48", rr: 32, spo2: 86, t: "38.9", o2: "air" } } }, "h1", "h2"]
  },
  debrief: {
    timeline: [
      { t: "Arrival", text: "Confused and breathing fast, not coughing on arrival. In the elderly, confusion is often the presenting sign of infection.", ddx: "Pneumonia · embolism · heart failure" },
      { t: "History", text: "Purulent sputum and right-sided pain on coughing turned it into a chest infection; no orthopnoea argued against heart failure.", ddx: "Pneumonia ↑" },
      { t: "Chest", text: "Solid lung above, fluid below, trachea central: consolidation with a small effusion.", ddx: "Pneumonia, with effusion" },
      { t: "Results", text: "Hypoxaemia with a respiratory alkalosis; kidney injury; a potassium raised by a late sample; a BNP raised by age.", ddx: "Embolism and heart failure ↓" },
      { t: "Day 3", text: "Fever on a susceptible antibiotic and a growing silent zone: a collection, confirmed as an empyema.", ddx: "Empyema" }
    ],
    takeaways: [
      ["Trap", "A late or haemolysed sample raises potassium: confirm fast, never dismiss."],
      ["Trap", "BNP is raised by age; weigh it against the bedside signs."],
      ["Distinction", "Consolidation: fremitus up. Effusion: fremitus down. Same dullness."],
      ["Link", "Fever that persists on the right antibiotic → look for a collection."]
    ],
    check: [
      ["pH 7.30, PaCO₂ 30 mmHg, HCO₃⁻ 14 mmol/L. Primary disorder?", "Metabolic acidosis, with respiratory compensation (low PaCO₂)."],
      ["Dull base, fremitus decreased, trachea pushed away. What is it?", "A large pleural effusion."]
    ] }
},
{ slot: 3, v: 3, level: "Advanced", title: "Indigestion after lunch",
  dx: "Inferior ST-elevation myocardial infarction (right coronary artery)",
  outcome: "Discharged home on day 5",
  short: "Right coronary artery stented. Early pericarditis on day 3, settled.",
  summary: "A 71-year-old diabetic woman called it indigestion. Her ECG showed an inferior infarct with a slow pulse; the right coronary artery was blocked and stented. A troponin drawn at 90 minutes was normal, as expected that early. On day 3, new pain eased by sitting forward was pericarditis.",
  patient: { who: "Bay 2 · Woman, 71", line: "Burning upper-abdominal pain for 90 minutes, since lunch. Nausea, vomited once, sweaty. Diabetic for 15 years, hypertensive." },
  vitals: { hr: 52, bp: "96/58", rr: 20, spo2: 95, t: "36.8", o2: "air" },
  scenes: [
  { id: "ed", workup: {
      ask: [
        { id: "before", q: "Have you had this before?", a: "For two weeks, a burning when I climb the stairs to my flat. It goes after a few minutes of rest. Today it came after lunch and hasn't gone.", chart: "2 wk exertional burning, eased by rest; today at rest, persistent.", v: "key" },
        { id: "back", q: "Does it go through to your back?", a: "No.", chart: "No pain to the back.", v: "key" },
        { id: "lean", q: "Does leaning forward or breathing change it?", a: "No.", chart: "Not positional, not pleuritic.", v: "useful" },
        { id: "jaw", q: "Does it spread anywhere?", a: "Not to the shoulder. My jaw feels a bit tight.", chart: "Jaw tightness; no shoulder radiation.", v: "useful" },
        { id: "meal", q: "Was it a fatty meal? Any alcohol?", a: "A normal lunch. I don't drink.", chart: "Normal meal; no alcohol.", v: "low" },
        { id: "stomach", q: "Do you take anything for your stomach?", a: "Omeprazole now and then.", chart: "Occasional omeprazole.", v: "low" }
      ],
      exam: [
        { id: "cvs", name: "Heart and neck veins", chart: "Regular, 52/min. JVP not raised. Normal heart sounds, no murmur.", v: "key" },
        { id: "chest", name: "Chest", chart: "Clear lung fields. No crackles.", v: "useful" },
        { id: "abdo", name: "Abdomen", chart: "Soft, mildly tender in the epigastrium. Murphy's sign negative.", v: "useful" },
        { id: "pulses", name: "Peripheral pulses", chart: "Radial pulses equal. BP similar in both arms.", v: "low" }
      ],
      tests: [
        { id: "ecg", name: "12-lead ECG", min: 5, v: "key", first: true, asks: ["q1", "q2", "q3"],
          ecg: { rate: 52, leads: [["DII", 8, 26, "ST ↑ 2 mm"], ["DIII", 12, 24, "ST ↑ 3 mm"], ["aVF", 10, 24, "ST ↑ 2.5 mm"], ["DI", -3, 16, "ST ↓ 1 mm"], ["aVL", -4, 14, "ST ↓ 1 mm"], ["V2", 0, 22, "Normal"]], line: "Sinus rhythm 52/min · PR 0.18 s · narrow QRS · no Q waves · V1 to V6 without ST elevation" },
          chart: "ECG: sinus 52, ST ↑ DII/DIII/aVF (DIII largest), ST ↓ DI/aVL, no Q waves.",
          explain: "ST elevation in the three inferior leads, largest in DIII, with depression in DI and aVL, no Q waves yet: an evolving inferior infarct, most often from the right coronary artery." },
        { id: "trop", name: "Troponin (conventional)", min: 30, v: "key", asks: "q4", slip: { title: "CARDIAC MARKERS", sample: "Serum", collected: "13:32", received: "13:40", rows: [["Troponin I", 0.02, "ng/mL", 0, 0.04]], comment: "Drawn 90 minutes after pain onset." }, chart: "Troponin at 90 min: normal.",
          explain: "Normal at 90 minutes, as expected: a conventional troponin rises about 4 hours after onset. Later samples confirmed the infarct." },
        { id: "ue", name: "Urea, creatinine, electrolytes", min: 30, v: "useful", slip: { title: "CLINICAL BIOCHEMISTRY", sample: "Serum", rows: [["Urea", 6.8, "mmol/L", 2.5, 7.5], ["Creatinine", 92, "µmol/L", 45, 90], ["Sodium", 138, "mmol/L", 135, 145], ["Potassium", 4.2, "mmol/L", 3.5, 5.0]] }, chart: "U&E: normal apart from creatinine 92.",
          explain: "A baseline before contrast and drugs; normal potassium." },
        { id: "glu", name: "Capillary glucose", min: 2, v: "useful", slip: { title: "POINT OF CARE", sample: "Capillary", rows: [["Glucose", 2.1, "g/L", 0.7, 1.1]] }, chart: "Glucose 2.1 g/L.",
          explain: "Raised in a stressed diabetic; worth knowing, not the diagnosis." },
        { id: "lip", name: "Serum lipase", min: 30, v: "low", slip: { title: "CLINICAL BIOCHEMISTRY", sample: "Serum", rows: [["Lipase", 42, "U/L", 0, 60]] }, chart: "Lipase normal.",
          explain: "Normal; it didn't change what to do with ST elevation." },
        { id: "us", name: "Abdominal ultrasound", min: 40, v: "low", report: { title: "Abdominal ultrasound", lines: ["Gallbladder normal, no stones.", "No biliary dilatation. Pancreas partly seen, normal."] }, chart: "Ultrasound: normal gallbladder.",
          explain: "Forty minutes spent with an artery still blocked." }
      ],
      dx: [
        { name: "Acute coronary syndrome", need: true },
        { name: "Biliary colic" },
        { name: "Acute pancreatitis" },
        { name: "Aortic dissection" },
        { name: "Pericarditis" },
        { name: "Gastritis or reflux", out: true }
      ],
      treat: ["q5"] } },
  { id: "cath", event: { at: "Cath lab", clock: "+2 h", text: "The right coronary artery is blocked and opened with a stent. Her pain settles.", vitals: { hr: 64, bp: "112/68", rr: 16, spo2: 97, t: "36.8", o2: "2 L" } }, flow: ["q6"] },
  { id: "d3", event: { at: "Day 3", clock: "Day 3", text: "New sharp chest pain, worse lying flat and on deep breaths, eased by sitting forward. Troponin still raised.", vitals: { hr: 84, bp: "118/72", rr: 18, spo2: 97, t: "37.9", o2: "air" } }, flow: ["q7"] }
  ],
  q: {
    q1: { type: "knowledge", q: "Which wall is involved?",
      options: ["Inferior", "Inferolateral", "Lateral", "Diffuse subendocardial"],
      notes: ["", "Inferolateral would also raise the ST in the lateral leads (DI, aVL, V5, V6); here DI and aVL are depressed.", "DI and aVL are lateral leads, but their ST is depressed, not raised.", "Diffuse subendocardial ischaemia gives widespread ST depression, not localised elevation."],
      why: "ST elevation in DII, DIII and aVF: the inferior wall.",
      src: [{ lec: "physio1-ecg", q: "DII, DIII, aVF inferior" }, { lec: "physio1-ecg", q: "DI, aVL, V5, V6 lateral" }, { lec: "semio-cv-angina", q: "Ischaemia Subendocardial Subendocardial Transmural ECG ST depression ST depression ST elevation" }] },
    q2: { type: "knowledge", q: "Which artery is most likely blocked?",
      options: ["Right coronary artery", "Circumflex artery", "Left anterior descending", "Right coronary, in spasm"],
      notes: ["", "Only in a left-dominant heart does the circumflex supply the inferior wall, and its occlusion often raises the ST in the lateral leads; here DI and aVL are depressed.", "It supplies the anterior wall, apex and septum; V1 to V6 show no elevation.", "Spasm (Prinzmetal) also raises the ST, but comes in short attacks, often at night. Two weeks of exertional pain now persisting at rest is the story of a clot on a plaque."],
      why: "The inferior wall is supplied by the posterior descending artery, from the right coronary in most people (right dominance). The right coronary also supplies the AV node in most people, which fits her slow pulse.",
      beyond: "ST elevation larger in DIII than in DII, with ST depression in DI and aVL, favours the right coronary over the circumflex.",
      src: [{ lec: "anat1-heart", q: "usually the posterior descending artery (right dominance)" }, { lec: "anat1-heart", q: "RCA occlusion → inferior MI, often with bradycardia or heart block (nodal arteries)" }, { lec: "anat1-heart", q: "LAD (anterior LV, apex, anterior septum)" }, { lec: "semio-cv-angina", q: "Any time, often night" }] },
    q3: { type: "knowledge", q: "What do ST elevation without Q waves tell you?",
      options: ["Transmural ischaemia, necrosis not yet complete", "Subendocardial ischaemia of the inferior wall", "An infarct completed hours to days ago", "Pericarditis rather than ischaemia"],
      notes: ["", "Subendocardial ischaemia gives ST depression, as in stable and unstable angina.", "A completed infarct leaves necrotic Q waves, wider and deeper than normal; there are none yet.", "Pericarditis can raise the ST, but its pain changes with posture and breathing; hers doesn't, and the elevation sits in one territory with depression opposite."],
      why: "ST elevation goes with transmural ischaemia. No necrotic Q waves yet: opening the artery now can still save muscle.",
      src: [{ lec: "semio-cv-angina", q: "Ischaemia Subendocardial Subendocardial Transmural ECG ST depression ST depression ST elevation" }, { lec: "physio1-ecg", q: "a wider, deeper Q in several leads is a necrotic Q wave (old infarct)" }, { lec: "semio-resp-symptoms", q: "Pericarditis Relieved sitting forward" }] },
    q4: { type: "priority", q: "Troponin normal at 90 minutes. What does it change?",
      options: ["Nothing: too early to exclude infarction; reperfuse now", "Repeat it at 3 hours, then decide on reperfusion", "Send a high-sensitivity troponin to settle it", "Pain is likely gastric; the ECG may be her baseline"],
      notes: ["", "Waiting for a later troponin keeps an artery the ECG already shows is blocked closed while muscle dies.", "Even a high-sensitivity assay rises only about 2 hours after onset, and with ST elevation the troponin does not decide.", "There is no old ECG to compare, no Q waves, and her story is exertional pain turning to rest pain: you don't explain away ST elevation."],
      branch: { 1: "wait" },
      why: "A normal early troponin never excludes an acute infarction: a conventional assay rises about 4 hours after onset. With ST elevation the decision rests on the ECG and the story; serial troponins come later.",
      src: [{ lec: "biochem-cardiac", q: "Rise (conventional) 4 hours" }, { lec: "biochem-cardiac", q: "Rise (high-sensitivity) 2 hours" }] },
    q5: { type: "priority", q: "What do you do now?",
      options: ["Aspirin and immediate transfer for angioplasty", "Aspirin and nitrates, admit to the coronary unit", "Aspirin and nitrates, then reassess the pain", "Aspirin and an urgent echo before deciding"],
      notes: ["", "Monitoring without opening the artery lets the infarct complete.", "Nitrates ease anginal pain but don't open a clotted artery; relief of pain doesn't rule out infarction.", "An echo can show the damaged wall, but the ECG has already decided; it delays reperfusion."],
      branch: { 1: "wait" },
      why: "ST elevation with this story means a blocked artery: aspirin and immediate reperfusion by angioplasty.",
      beyond: "With a blood pressure of 96/58, nitrates (vasodilators) can drop the pressure further: use them with caution in a hypotensive patient.",
      src: [{ lec: "semio-cv-angina", q: "sublingual nitroglycerin" }, { lec: "semio-cv-angina", q: "angioplasty or bypass" }] },
    q6: { type: "knowledge", q: "Which rhythm problem does her artery make most likely?",
      options: ["Bradycardia and AV block", "Atrial fibrillation", "Atrial flutter", "Ventricular tachycardia from scar"],
      notes: ["", "Atrial fibrillation can follow any infarct, but her artery and slow pulse point to the conduction system.", "Flutter isn't linked to the artery involved here.", "Ventricular arrhythmias can follow any infarct; the question is what her particular artery adds."],
      why: "The right coronary supplies the AV node in most people: its occlusion often brings bradycardia or heart block.",
      src: [{ lec: "anat1-heart", q: "RCA occlusion → inferior MI, often with bradycardia or heart block (nodal arteries)" }] },
    q7: { type: "knowledge", q: "What is the most likely cause of the new pain?",
      options: ["Early pericarditis", "Reinfarction from stent thrombosis", "Pulmonary embolism after bed rest", "Reflux irritated by her aspirin"],
      notes: ["", "Always worth excluding with an ECG, but pain eased by sitting forward points elsewhere, and a raised troponin is expected at day 3 anyway.", "Embolic pain isn't eased by sitting forward.", "Reflux doesn't worsen on deep breaths or ease on sitting forward."],
      why: "Pain eased by sitting forward is the clue to pericarditis. Troponin stays raised for days after an infarct (troponin T over 10 days), and pericarditis raises it too, so it cannot separate them.",
      src: [{ lec: "semio-resp-symptoms", q: "Pericarditis Relieved sitting forward" }, { lec: "biochem-cardiac", q: "Also raised in myocarditis, toxicity, pericarditis" }, { lec: "biochem-cardiac", q: "cTnT stays up Over 10 days" }] },
    w1: { type: "knowledge", q: "What is happening?",
      options: ["Complete heart block, cardiogenic shock", "Sinus bradycardia with hypovolaemia", "Pump failure with a normal rhythm", "Septic shock from aspiration"],
      notes: ["", "In sinus bradycardia every P wave is followed by a QRS; here they are unrelated. One vomit doesn't explain this.", "The rhythm is not normal: atria and ventricles beat independently.", "No fever, no chest signs of aspiration."],
      why: "Atria at their own rate, ventricles following a slow escape rhythm: complete AV block. Too slow a heart can't keep up the output: a rhythm cause of cardiogenic shock. New Q waves mark necrosis.",
      src: [{ lec: "physio1-heart", q: "In complete AV block, the atria beat at 70/min while the ventricles follow a slow escape rhythm" }, { lec: "fa-cardiovascular", q: "rhythm disorders (high-degree AV block, SVT)" }, { lec: "physio1-ecg", q: "a wider, deeper Q in several leads is a necrotic Q wave (old infarct)" }] },
    w2: { type: "priority", q: "What does she need now?",
      options: ["Emergency reperfusion, supporting rate and pressure", "Support rate and pressure; reperfuse once stable", "A fluid bolus and a repeat troponin", "Drugs to speed the heart, observe on the ward"],
      notes: ["", "Stabilising first while the artery stays closed delays the treatment of the cause; support goes on during transfer.", "The diagnosis is already on the ECG; fluids don't treat a block.", "Speeding the heart helps the pressure but leaves the artery closed."],
      why: "Treat the cause (open the artery) while supporting the circulation.",
      src: [{ lec: "fa-cardiovascular", q: "plus etiological treatment of the cause" }, { lec: "semio-cv-angina", q: "angioplasty or bypass" }] }
  },
  branches: {
    wait: [{ event: { at: "Four hours later, on the ward", clock: "+4 h", text: "She is confused, cold and mottled. 12-lead: inferior ST elevation persists, new Q waves in DIII and aVF.",
        note: "Ward nurse: \"She's confused and cold, and her pressure keeps dropping.\"",
        rhythm: "chb",
        why: "Complete heart block is a recognised complication of an inferior infarct while the artery stays closed. It can happen even with prompt treatment, but every hour of delay lets more muscle die; the new Q waves show necrosis setting in.",
        vitals: { hr: 36, bp: "78/45", rr: 24, spo2: 93, t: "36.6", o2: "2 L" } } }, "w1", "w2"]
  },
  debrief: {
    timeline: [
      { t: "Arrival", text: "Epigastric burning after lunch, sweaty, pulse 52. In older people and in women, angina can look like this; the slow pulse already hinted at the heart.", ddx: "Reflux · biliary · ACS" },
      { t: "History", text: "Two weeks of burning on the stairs, eased by rest, now persistent at rest: stable angina becoming unstable. No back pain, not positional.", ddx: "ACS ↑ · dissection ↓" },
      { t: "ECG", text: "ST elevation DII, DIII, aVF; depression DI, aVL; no Q waves: inferior, transmural, still salvageable.", ddx: "Diagnosis made" },
      { t: "Troponin", text: "Normal at 90 minutes: expected that early. It should not change the plan.", ddx: "" },
      { t: "Day 3", text: "Pain eased by sitting forward with a raised troponin: pericarditis, which troponin can't separate from reinfarction.", ddx: "Pericarditis" }
    ],
    takeaways: [
      ["Trap", "A normal troponin in the first hours rules nothing out."],
      ["Distinction", "ST elevation: transmural. ST depression: subendocardial."],
      ["Link", "Inferior infarct + slow pulse → right coronary and AV block."],
      ["Trap", "In older diabetic women, \"indigestion\" gets an ECG first."]
    ],
    check: [
      ["ST elevation in V1 to V4. Which artery?", "Left anterior descending: anterior wall and septum."],
      ["Day 3: pain eased sitting forward, troponin still high. New infarct?", "Think pericarditis: troponin stays raised after an infarct and rises in pericarditis too."]
    ] }
}
];
