/* chem1: 7 lectures, merged for upload. Edit the source files, not this one. */
window.SINA = window.SINA || {subjects:[], lectures:{}};
SINA.lectures["chem1-matter"] = {
 "id": "chem1-matter",
 "subject": "chem1",
 "group": "General chemistry",
 "title": "Structure of matter: the atom and its nucleus",
 "sourceFile": "Lecture 1 - General Chemistry (2025-2026) (General Chemistry, Prof. Tarik Ouchbani)",
 "sourceUrl": "https://drive.google.com/file/d/1uiDfl1VijY9p9PtyhQOZhK4u73lUt_sd/view?usp=drivesdk",
 "buildNote": "<strong>Built from the lecture slides.</strong> Slides that only show pictures are covered in outline. If your professor says something different, trust your professor.",
 "summary": [
  {
   "id": "s0",
   "title": "The big picture",
   "html": "<p>The General Chemistry course covers: I. structure of matter, II. model of the atom, III. chemical bonds, IV. chemistry in solutions, V. redox reactions. Matter exists in three <strong>phases</strong> (solid, liquid, gas); a substance like water can be in any of them depending on temperature and pressure, even all three at once. Matter is made of atoms combining into molecules and crystals. Key ideas: atoms are made of <strong>electrons and nuclei</strong>; atom size is set by the <strong>electron distribution</strong>; nuclei are tiny but hold almost all the <strong>mass</strong>; bonding arises from electrical forces between electrons and nuclei and the <strong>sharing of electrons</strong>.</p>"
  },
  {
   "id": "s1",
   "title": "The particles",
   "html": "<p><strong>Electron</strong>: stable, negative; charge <strong>q = −1.602 × 10⁻¹⁹ C</strong>, mass <strong>mₑ = 9.109 × 10⁻³¹ kg</strong>. The <strong>nucleus</strong> is made of <strong>nucleons</strong>: the <strong>proton</strong> (charge +1.602 × 10⁻¹⁹ C; mass 1.673 × 10⁻²⁷ kg = <strong>1836 mₑ</strong> ≈ 1.0073 u) and the <strong>neutron</strong> (neutral; mass 1.675 × 10⁻²⁷ kg = <strong>1839 mₑ</strong> ≈ 1.0087 u).</p><p>An element is written <sup>A</sup><sub>Z</sub>X. <strong>Z</strong> (atomic or charge number) = number of <strong>protons</strong> (and electrons in the neutral atom); it identifies the element. <strong>A</strong> (mass number) = number of <strong>nucleons</strong> = protons + neutrons, so neutrons N = A − Z. <strong>Isotopes</strong> are atoms of the same element (same Z) with different A (different numbers of neutrons), each with a natural relative abundance.</p>"
  },
  {
   "id": "s2",
   "title": "Atomic mass and the mole",
   "html": "<p>The atomic mass of an element is the mass of <strong>one mole</strong> of its atoms (gram-atom, atomic molar mass), i.e. the mass of <strong>Avogadro's number</strong> of atoms, <strong>Nₐ ≈ 6.02 × 10²³ mol⁻¹</strong> (the slides use 6.023 × 10²³). Two scales: <strong>atomic mass units</strong> (u, a.m.u.) and <strong>grams per mole</strong>, both referenced to <strong>carbon-12</strong>. By definition <strong>1 u = 1/12 of the mass of a ¹²C atom</strong> (6 protons, 6 neutrons); one mole of carbon weighs <strong>12 g</strong>, so <strong>1 u = 1/Nₐ g ≈ 1.66 × 10⁻²⁴ g</strong>. The mass of one atom = molar mass / Nₐ.</p>"
  },
  {
   "id": "s3",
   "title": "Mass defect and binding energy",
   "html": "<p>The measured mass of a nucleus is always <strong>smaller</strong> than the sum of its free protons and neutrons. This <strong>mass defect Δm</strong> has been converted into energy by <strong>Einstein's relation ΔE = Δm · c²</strong> (c = 3 × 10⁸ m/s). ΔE is the <strong>binding (cohesion) energy</strong> of the nucleus: the energy needed to break it into separate nucleons.</p>"
  }
 ],
 "exam": [
  "Three phases: solid, liquid, gas; one substance can exist in all three.",
  "Atoms = electrons + nucleus; nucleus holds almost all the mass.",
  "Electron: −1.602×10⁻¹⁹ C, 9.109×10⁻³¹ kg.",
  "Proton: +1.602×10⁻¹⁹ C, 1836 mₑ; neutron: 0, 1839 mₑ.",
  "Z = protons (defines the element); A = protons + neutrons; N = A − Z.",
  "Isotopes: same Z, different A.",
  "Mole: Nₐ ≈ 6.02×10²³; atomic mass = mass of one mole.",
  "1 u = 1/12 of ¹²C = 1/Nₐ g ≈ 1.66×10⁻²⁴ g.",
  "Mass of one atom = M / Nₐ.",
  "Mass defect Δm → binding energy ΔE = Δm·c²."
 ],
 "visual": {
  "kind": "model",
  "intro": "",
  "figure": {
   "viewBox": "0 0 760 420",
   "alt": "Inside the atom",
   "caption": "Particles, numbers and the mass defect. Schematic drawn for this site.",
   "base": "<defs><marker id=\"ah\" markerWidth=\"10\" markerHeight=\"8\" refX=\"9\" refY=\"4\" orient=\"auto\"><path d=\"M0,0 L10,4 L0,8 Z\" fill=\"#8a8a8a\"/></marker></defs><line stroke=\"#8a8a8a\" stroke-width=\"2\" marker-end=\"url(#ah)\" x1=\"480\" y1=\"70\" x2=\"40\" y2=\"200\"/><line stroke=\"#8a8a8a\" stroke-width=\"2\" marker-end=\"url(#ah)\" x1=\"380\" y1=\"100\" x2=\"380\" y2=\"170\"/><line stroke=\"#8a8a8a\" stroke-width=\"2\" marker-end=\"url(#ah)\" x1=\"720\" y1=\"70\" x2=\"280\" y2=\"200\"/><line stroke=\"#8a8a8a\" stroke-width=\"2\" marker-end=\"url(#ah)\" x1=\"480\" y1=\"200\" x2=\"520\" y2=\"200\"/>",
   "parts": {
    "e": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#f2d7cf\" x=\"40\" y=\"40\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "Electron: −1.602×10⁻¹⁹ C,",
      "9.109×10⁻³¹ kg"
     ],
     "lx": 140.0,
     "ly": 68.0
    },
    "p": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#cfe3f2\" x=\"280\" y=\"40\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "Proton: +1.602×10⁻¹⁹ C,",
      "1836 mₑ"
     ],
     "lx": 380.0,
     "ly": 68.0
    },
    "n": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#d7edd2\" x=\"520\" y=\"40\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "Neutron: 0 C,",
      "1839 mₑ"
     ],
     "lx": 620.0,
     "ly": 68.0
    },
    "z": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#f2e2a8\" x=\"40\" y=\"170\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "Z = protons",
      "(atomic number)"
     ],
     "lx": 140.0,
     "ly": 198.0
    },
    "a": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#e3d5f0\" x=\"280\" y=\"170\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "A = protons + neutrons",
      "(mass number)"
     ],
     "lx": 380.0,
     "ly": 198.0
    },
    "def": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#f7d9b8\" x=\"520\" y=\"170\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "Mass defect Δm →",
      "binding energy ΔE = Δm·c²"
     ],
     "lx": 620.0,
     "ly": 198.0
    }
   },
   "arrows": {
    "e": [
     {
      "t": [
       40.0,
       48.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "p": [
     {
      "t": [
       280.0,
       48.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "n": [
     {
      "t": [
       520.0,
       48.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "z": [
     {
      "t": [
       40.0,
       178.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "a": [
     {
      "t": [
       280.0,
       178.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "def": [
     {
      "t": [
       520.0,
       178.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ]
   }
  }
 },
 "mcqs": [
  {
   "q": "What sets the size of an atom?",
   "options": [
    "The nucleus",
    "The number of neutrons",
    "The mass number",
    "The distribution of its electrons"
   ],
   "answer": 3,
   "why": "The nucleus is tiny.",
   "slides": [
    {
     "src": "files/slides/chem1-matter/04.jpg",
     "lec": "Structure of matter: the atom and its",
     "n": 4
    }
   ]
  },
  {
   "q": "Where is almost all the mass of an atom?",
   "options": [
    "Between atoms",
    "Evenly spread",
    "Nucleus",
    "Electron cloud"
   ],
   "answer": 2,
   "why": "Protons and neutrons are ~1,800 times heavier than electrons.",
   "slides": [
    {
     "src": "files/slides/chem1-matter/05.jpg",
     "lec": "Structure of matter: the atom and its",
     "n": 5
    },
    {
     "src": "files/slides/chem1-matter/06.jpg",
     "lec": "Structure of matter: the atom and its",
     "n": 6
    }
   ]
  },
  {
   "q": "The charge of an electron is:",
   "options": [
    "+1.602×10⁻¹⁹ C",
    "0 C",
    "−9.109×10⁻³¹ C",
    "−1.602×10⁻¹⁹ C"
   ],
   "answer": 3,
   "why": "9.109×10⁻³¹ kg is its mass.",
   "slides": [
    {
     "src": "files/slides/chem1-matter/07.jpg",
     "lec": "Structure of matter: the atom and its",
     "n": 7
    }
   ]
  },
  {
   "q": "The proton mass is about how many electron masses?",
   "options": [
    "183,600",
    "1",
    "1836",
    "18"
   ],
   "answer": 2,
   "why": "The neutron is 1839.",
   "slides": [
    {
     "src": "files/slides/chem1-matter/08.jpg",
     "lec": "Structure of matter: the atom and its",
     "n": 8
    },
    {
     "src": "files/slides/chem1-matter/17.jpg",
     "lec": "Structure of matter: the atom and its",
     "n": 17
    }
   ]
  },
  {
   "q": "Z represents:",
   "options": [
    "Number of protons",
    "Atomic mass",
    "Number of nucleons",
    "Number of neutrons"
   ],
   "answer": 0,
   "why": "It defines the element.",
   "slides": [
    {
     "src": "files/slides/chem1-matter/09.jpg",
     "lec": "Structure of matter: the atom and its",
     "n": 9
    },
    {
     "src": "files/slides/chem1-matter/11.jpg",
     "lec": "Structure of matter: the atom and its",
     "n": 11
    }
   ]
  },
  {
   "q": "For ²³Na (Z = 11), the number of neutrons is:",
   "options": [
    "23",
    "12",
    "11",
    "34"
   ],
   "answer": 1,
   "why": "N = A − Z = 23 − 11.",
   "slides": [
    {
     "src": "files/slides/chem1-matter/14.jpg",
     "lec": "Structure of matter: the atom and its",
     "n": 14
    }
   ]
  },
  {
   "q": "Isotopes of an element have:",
   "options": [
    "Same A, different Z",
    "Same Z, different A",
    "Different electrons only",
    "Different Z"
   ],
   "answer": 1,
   "why": "Different numbers of neutrons.",
   "slides": [
    {
     "src": "files/slides/chem1-matter/11.jpg",
     "lec": "Structure of matter: the atom and its",
     "n": 11
    }
   ]
  },
  {
   "q": "Avogadro's number is about:",
   "options": [
    "9.1×10⁻³¹",
    "1.66×10⁻²⁴",
    "3×10⁸",
    "6.02×10²³"
   ],
   "answer": 3,
   "why": "Atoms in one mole.",
   "slides": [
    {
     "src": "files/slides/chem1-matter/12.jpg",
     "lec": "Structure of matter: the atom and its",
     "n": 12
    },
    {
     "src": "files/slides/chem1-matter/14.jpg",
     "lec": "Structure of matter: the atom and its",
     "n": 14
    }
   ]
  },
  {
   "q": "By definition, 1 atomic mass unit equals:",
   "options": [
    "The mass of a proton",
    "1/12 of the mass of a carbon-12 atom",
    "The mass of an electron",
    "1 gram"
   ],
   "answer": 1,
   "why": "≈ 1.66×10⁻²⁴ g.",
   "slides": [
    {
     "src": "files/slides/chem1-matter/13.jpg",
     "lec": "Structure of matter: the atom and its",
     "n": 13
    },
    {
     "src": "files/slides/chem1-matter/14.jpg",
     "lec": "Structure of matter: the atom and its",
     "n": 14
    }
   ]
  },
  {
   "q": "One mole of carbon-12 weighs:",
   "options": [
    "12 g",
    "6.02×10²³ g",
    "6 g",
    "1 g"
   ],
   "answer": 0,
   "why": "So 1 u = 1/Nₐ g.",
   "slides": [
    {
     "src": "files/slides/chem1-matter/14.jpg",
     "lec": "Structure of matter: the atom and its",
     "n": 14
    }
   ]
  },
  {
   "q": "To find the mass of one atom:",
   "options": [
    "Divide molar mass by Nₐ",
    "Add A and Z",
    "Divide Nₐ by Z",
    "Multiply molar mass by Nₐ"
   ],
   "answer": 0,
   "why": "m = M / Nₐ.",
   "slides": [
    {
     "src": "files/slides/chem1-matter/14.jpg",
     "lec": "Structure of matter: the atom and its",
     "n": 14
    }
   ]
  },
  {
   "q": "The mass defect of a nucleus is:",
   "options": [
    "Mass of electrons",
    "Mass gained when nucleons join",
    "Zero",
    "Missing nucleon mass"
   ],
   "answer": 3,
   "why": "The real nucleus is lighter.",
   "slides": [
    {
     "src": "files/slides/chem1-matter/08.jpg",
     "lec": "Structure of matter: the atom and its",
     "n": 8
    }
   ]
  },
  {
   "q": "The binding energy is calculated by:",
   "options": [
    "E = hν",
    "E = ½mv²",
    "E = mgh",
    "ΔE = Δm·c²"
   ],
   "answer": 3,
   "why": "Einstein's relation.",
   "slides": [
    {
     "src": "files/slides/chem1-matter/17.jpg",
     "lec": "Structure of matter: the atom and its",
     "n": 17
    }
   ]
  },
  {
   "q": "The neutron is:",
   "options": [
    "Electrically neutral",
    "A lepton",
    "Positive",
    "Negative"
   ],
   "answer": 0,
   "why": "Slightly heavier than the proton.",
   "slides": [
    {
     "src": "files/slides/chem1-matter/06.jpg",
     "lec": "Structure of matter: the atom and its",
     "n": 6
    },
    {
     "src": "files/slides/chem1-matter/08.jpg",
     "lec": "Structure of matter: the atom and its",
     "n": 8
    }
   ]
  },
  {
   "q": "Which element is at the arrow?",
   "target": "e",
   "options": [
    "Atomic number Z",
    "Electron",
    "Neutron",
    "Proton"
   ],
   "answer": 1,
   "why": "The arrow points to: Electron. Stable, negatively charged; sets the size of the atom through its distribution."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "p",
   "options": [
    "Atomic number Z",
    "Electron",
    "Proton",
    "Mass number A"
   ],
   "answer": 2,
   "why": "The arrow points to: Proton. Positively charged nucleon, 1.673×10⁻²⁷ kg ≈ 1.0073 u."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "n",
   "options": [
    "Atomic number Z",
    "Mass number A",
    "Neutron",
    "Proton"
   ],
   "answer": 2,
   "why": "The arrow points to: Neutron. Neutral nucleon, 1.675×10⁻²⁷ kg ≈ 1.0087 u."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "z",
   "options": [
    "Proton",
    "Atomic number Z",
    "Neutron",
    "Mass number A"
   ],
   "answer": 1,
   "why": "The arrow points to: Atomic number Z. Number of protons (= electrons in the neutral atom); defines the element."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "a",
   "options": [
    "Mass number A",
    "Atomic number Z",
    "Neutron",
    "Mass defect"
   ],
   "answer": 0,
   "why": "The arrow points to: Mass number A. Number of nucleons: protons + neutrons; N = A − Z neutrons."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "def",
   "options": [
    "Electron",
    "Atomic number Z",
    "Mass defect",
    "Neutron"
   ],
   "answer": 2,
   "why": "The arrow points to: Mass defect. The real nucleus is lighter than its separate nucleons; the missing mass is the binding energy."
  },
  {
   "q": "How many neutrons are in the nucleus of ¹H (Z = 1)?",
   "options": [
    "0",
    "2",
    "1",
    "3"
   ],
   "answer": 0,
   "why": "N = A − Z = 1 − 1 = 0.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ²H (Z = 1)?",
   "options": [
    "0",
    "3",
    "2",
    "1"
   ],
   "answer": 3,
   "why": "N = A − Z = 2 − 1 = 1.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ³H (Z = 1)?",
   "options": [
    "3",
    "4",
    "1",
    "2"
   ],
   "answer": 3,
   "why": "N = A − Z = 3 − 1 = 2.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ⁴He (Z = 2)?",
   "options": [
    "4",
    "6",
    "3",
    "2"
   ],
   "answer": 3,
   "why": "N = A − Z = 4 − 2 = 2.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ⁷Li (Z = 3)?",
   "options": [
    "3",
    "4",
    "10",
    "7"
   ],
   "answer": 1,
   "why": "N = A − Z = 7 − 3 = 4.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ⁹Be (Z = 4)?",
   "options": [
    "5",
    "9",
    "13",
    "4"
   ],
   "answer": 0,
   "why": "N = A − Z = 9 − 4 = 5.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ¹¹B (Z = 5)?",
   "options": [
    "6",
    "16",
    "5",
    "11"
   ],
   "answer": 0,
   "why": "N = A − Z = 11 − 5 = 6.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ¹²C (Z = 6)?",
   "options": [
    "12",
    "6",
    "18",
    "7"
   ],
   "answer": 1,
   "why": "N = A − Z = 12 − 6 = 6.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ¹³C (Z = 6)?",
   "options": [
    "7",
    "13",
    "6",
    "19"
   ],
   "answer": 0,
   "why": "N = A − Z = 13 − 6 = 7.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ¹⁴C (Z = 6)?",
   "options": [
    "14",
    "8",
    "20",
    "6"
   ],
   "answer": 1,
   "why": "N = A − Z = 14 − 6 = 8.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ¹⁴N (Z = 7)?",
   "options": [
    "14",
    "21",
    "7",
    "8"
   ],
   "answer": 2,
   "why": "N = A − Z = 14 − 7 = 7.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ¹⁵N (Z = 7)?",
   "options": [
    "7",
    "15",
    "8",
    "22"
   ],
   "answer": 2,
   "why": "N = A − Z = 15 − 7 = 8.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ¹⁶O (Z = 8)?",
   "options": [
    "9",
    "16",
    "24",
    "8"
   ],
   "answer": 3,
   "why": "N = A − Z = 16 − 8 = 8.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ¹⁸O (Z = 8)?",
   "options": [
    "26",
    "8",
    "10",
    "18"
   ],
   "answer": 2,
   "why": "N = A − Z = 18 − 8 = 10.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ¹⁹F (Z = 9)?",
   "options": [
    "19",
    "28",
    "10",
    "9"
   ],
   "answer": 2,
   "why": "N = A − Z = 19 − 9 = 10.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ²³Na (Z = 11)?",
   "options": [
    "12",
    "23",
    "11",
    "34"
   ],
   "answer": 0,
   "why": "N = A − Z = 23 − 11 = 12.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ²⁴Mg (Z = 12)?",
   "options": [
    "36",
    "24",
    "13",
    "12"
   ],
   "answer": 3,
   "why": "N = A − Z = 24 − 12 = 12.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ²⁷Al (Z = 13)?",
   "options": [
    "27",
    "40",
    "14",
    "13"
   ],
   "answer": 2,
   "why": "N = A − Z = 27 − 13 = 14.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ³¹P (Z = 15)?",
   "options": [
    "46",
    "15",
    "31",
    "16"
   ],
   "answer": 3,
   "why": "N = A − Z = 31 − 15 = 16.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ³²S (Z = 16)?",
   "options": [
    "32",
    "48",
    "17",
    "16"
   ],
   "answer": 3,
   "why": "N = A − Z = 32 − 16 = 16.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ³⁵Cl (Z = 17)?",
   "options": [
    "17",
    "18",
    "35",
    "52"
   ],
   "answer": 1,
   "why": "N = A − Z = 35 − 17 = 18.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ³⁷Cl (Z = 17)?",
   "options": [
    "17",
    "20",
    "37",
    "54"
   ],
   "answer": 1,
   "why": "N = A − Z = 37 − 17 = 20.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ³⁹K (Z = 19)?",
   "options": [
    "39",
    "58",
    "19",
    "20"
   ],
   "answer": 3,
   "why": "N = A − Z = 39 − 19 = 20.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ⁴⁰Ca (Z = 20)?",
   "options": [
    "40",
    "60",
    "20",
    "21"
   ],
   "answer": 2,
   "why": "N = A − Z = 40 − 20 = 20.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ⁵⁶Fe (Z = 26)?",
   "options": [
    "30",
    "26",
    "56",
    "82"
   ],
   "answer": 0,
   "why": "N = A − Z = 56 − 26 = 30.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ⁶³Cu (Z = 29)?",
   "options": [
    "29",
    "34",
    "92",
    "63"
   ],
   "answer": 1,
   "why": "N = A − Z = 63 − 29 = 34.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ⁶⁵Zn (Z = 30)?",
   "options": [
    "95",
    "65",
    "30",
    "35"
   ],
   "answer": 3,
   "why": "N = A − Z = 65 − 30 = 35.",
   "x": 1
  },
  {
   "q": "How many neutrons are in the nucleus of ⁸⁰Br (Z = 35)?",
   "options": [
    "80",
    "45",
    "115",
    "35"
   ],
   "answer": 1,
   "why": "N = A − Z = 80 − 35 = 45.",
   "x": 1
  },
  {
   "q": "How many nucleons does ¹²C contain?",
   "options": [
    "18",
    "13",
    "6",
    "12"
   ],
   "answer": 3,
   "why": "The mass number A is the number of nucleons (protons + neutrons).",
   "x": 1
  },
  {
   "q": "How many nucleons does ¹⁶O contain?",
   "options": [
    "8",
    "16",
    "24",
    "17"
   ],
   "answer": 1,
   "why": "The mass number A is the number of nucleons (protons + neutrons).",
   "x": 1
  },
  {
   "q": "How many nucleons does ³⁵Cl contain?",
   "options": [
    "18",
    "17",
    "52",
    "35"
   ],
   "answer": 3,
   "why": "The mass number A is the number of nucleons (protons + neutrons).",
   "x": 1
  },
  {
   "q": "How many nucleons does ⁵⁶Fe contain?",
   "options": [
    "30",
    "26",
    "56",
    "82"
   ],
   "answer": 2,
   "why": "The mass number A is the number of nucleons (protons + neutrons).",
   "x": 1
  },
  {
   "q": "How many nucleons does ⁴⁰Ca contain?",
   "options": [
    "60",
    "20",
    "41",
    "40"
   ],
   "answer": 3,
   "why": "The mass number A is the number of nucleons (protons + neutrons).",
   "x": 1
  },
  {
   "q": "How many nucleons does ²³Na contain?",
   "options": [
    "34",
    "11",
    "23",
    "12"
   ],
   "answer": 2,
   "why": "The mass number A is the number of nucleons (protons + neutrons).",
   "x": 1
  },
  {
   "q": "How many nucleons does ⁶³Cu contain?",
   "options": [
    "29",
    "92",
    "63",
    "34"
   ],
   "answer": 2,
   "why": "The mass number A is the number of nucleons (protons + neutrons).",
   "x": 1
  },
  {
   "q": "How many nucleons does ³²S contain?",
   "options": [
    "33",
    "32",
    "16",
    "48"
   ],
   "answer": 1,
   "why": "The mass number A is the number of nucleons (protons + neutrons).",
   "x": 1
  },
  {
   "q": "How many electrons does the ion Na⁺ (Z = 11) have?",
   "options": [
    "8",
    "11",
    "12",
    "10"
   ],
   "answer": 3,
   "why": "A cation loses electrons, an anion gains them: 11 − 1 = 10.",
   "x": 1
  },
  {
   "q": "How many electrons does the ion Mg²⁺ (Z = 12) have?",
   "options": [
    "14",
    "10",
    "12",
    "11"
   ],
   "answer": 1,
   "why": "A cation loses electrons, an anion gains them: 12 − 2 = 10.",
   "x": 1
  },
  {
   "q": "How many electrons does the ion Al³⁺ (Z = 13) have?",
   "options": [
    "10",
    "11",
    "13",
    "16"
   ],
   "answer": 0,
   "why": "A cation loses electrons, an anion gains them: 13 − 3 = 10.",
   "x": 1
  },
  {
   "q": "How many electrons does the ion O²⁻ (Z = 8) have?",
   "options": [
    "6",
    "8",
    "10",
    "11"
   ],
   "answer": 2,
   "why": "A cation loses electrons, an anion gains them: 8 + 2 = 10.",
   "x": 1
  },
  {
   "q": "How many electrons does the ion F⁻ (Z = 9) have?",
   "options": [
    "10",
    "9",
    "11",
    "8"
   ],
   "answer": 0,
   "why": "A cation loses electrons, an anion gains them: 9 + 1 = 10.",
   "x": 1
  },
  {
   "q": "How many electrons does the ion Cl⁻ (Z = 17) have?",
   "options": [
    "19",
    "18",
    "17",
    "16"
   ],
   "answer": 1,
   "why": "A cation loses electrons, an anion gains them: 17 + 1 = 18.",
   "x": 1
  },
  {
   "q": "How many electrons does the ion S²⁻ (Z = 16) have?",
   "options": [
    "18",
    "14",
    "16",
    "19"
   ],
   "answer": 0,
   "why": "A cation loses electrons, an anion gains them: 16 + 2 = 18.",
   "x": 1
  },
  {
   "q": "How many electrons does the ion Ca²⁺ (Z = 20) have?",
   "options": [
    "19",
    "18",
    "20",
    "22"
   ],
   "answer": 1,
   "why": "A cation loses electrons, an anion gains them: 20 − 2 = 18.",
   "x": 1
  },
  {
   "q": "How many electrons does the ion K⁺ (Z = 19) have?",
   "options": [
    "19",
    "16",
    "20",
    "18"
   ],
   "answer": 3,
   "why": "A cation loses electrons, an anion gains them: 19 − 1 = 18.",
   "x": 1
  },
  {
   "q": "How many electrons does the ion Fe²⁺ (Z = 26) have?",
   "options": [
    "26",
    "24",
    "28",
    "25"
   ],
   "answer": 1,
   "why": "A cation loses electrons, an anion gains them: 26 − 2 = 24.",
   "x": 1
  },
  {
   "q": "How many electrons does the ion Fe³⁺ (Z = 26) have?",
   "options": [
    "26",
    "29",
    "24",
    "23"
   ],
   "answer": 3,
   "why": "A cation loses electrons, an anion gains them: 26 − 3 = 23.",
   "x": 1
  },
  {
   "q": "How many electrons does the ion N³⁻ (Z = 7) have?",
   "options": [
    "11",
    "4",
    "7",
    "10"
   ],
   "answer": 3,
   "why": "A cation loses electrons, an anion gains them: 7 + 3 = 10.",
   "x": 1
  },
  {
   "q": "How many moles are in 24 g of carbon (M ≈ 12.01 g/mol)?",
   "options": [
    "20 mol",
    "2 mol",
    "0.5 mol",
    "288 mol"
   ],
   "answer": 1,
   "why": "n = m / M = 24 / 12.01 = 2 mol.",
   "x": 1
  },
  {
   "q": "How many moles are in 5 g of oxygen (M ≈ 16 g/mol)?",
   "options": [
    "0.312 mol",
    "80 mol",
    "3.12 mol",
    "3.2 mol"
   ],
   "answer": 0,
   "why": "n = m / M = 5 / 16 = 0.312 mol.",
   "x": 1
  },
  {
   "q": "How many moles are in 40 g of sodium (M ≈ 22.99 g/mol)?",
   "options": [
    "1.74 mol",
    "0.575 mol",
    "17.4 mol",
    "920 mol"
   ],
   "answer": 0,
   "why": "n = m / M = 40 / 22.99 = 1.74 mol.",
   "x": 1
  },
  {
   "q": "How many moles are in 2 g of magnesium (M ≈ 24.31 g/mol)?",
   "options": [
    "0.0823 mol",
    "12.2 mol",
    "0.823 mol",
    "48.6 mol"
   ],
   "answer": 0,
   "why": "n = m / M = 2 / 24.31 = 0.0823 mol.",
   "x": 1
  },
  {
   "q": "How many moles are in 4 g of chlorine (M ≈ 35.45 g/mol)?",
   "options": [
    "1.13 mol",
    "142 mol",
    "0.113 mol",
    "8.86 mol"
   ],
   "answer": 2,
   "why": "n = m / M = 4 / 35.45 = 0.113 mol.",
   "x": 1
  },
  {
   "q": "How many moles are in 4 g of calcium (M ≈ 40.08 g/mol)?",
   "options": [
    "160 mol",
    "0.998 mol",
    "0.0998 mol",
    "10 mol"
   ],
   "answer": 2,
   "why": "n = m / M = 4 / 40.08 = 0.0998 mol.",
   "x": 1
  },
  {
   "q": "How many moles are in 24 g of iron (M ≈ 55.85 g/mol)?",
   "options": [
    "4.3 mol",
    "2.33 mol",
    "1.34e+03 mol",
    "0.43 mol"
   ],
   "answer": 3,
   "why": "n = m / M = 24 / 55.85 = 0.43 mol.",
   "x": 1
  },
  {
   "q": "How many moles are in 2 g of copper (M ≈ 63.55 g/mol)?",
   "options": [
    "0.0315 mol",
    "0.315 mol",
    "31.8 mol",
    "127 mol"
   ],
   "answer": 0,
   "why": "n = m / M = 2 / 63.55 = 0.0315 mol.",
   "x": 1
  },
  {
   "q": "The mass of one atom of hydrogen (M ≈ 1.008 g/mol) is about:",
   "options": [
    "1.008 g",
    "1.67×10^−24 g",
    "5.97×10^23 g",
    "6.07×10^23 g"
   ],
   "answer": 1,
   "why": "Mass of one atom = molar mass / Avogadro's number.",
   "x": 1
  },
  {
   "q": "The mass of one atom of carbon (M ≈ 12.01 g/mol) is about:",
   "options": [
    "5.01×10^22 g",
    "2×10^−23 g",
    "12.01 g",
    "7.23×10^24 g"
   ],
   "answer": 1,
   "why": "Mass of one atom = molar mass / Avogadro's number.",
   "x": 1
  },
  {
   "q": "The mass of one atom of oxygen (M ≈ 16 g/mol) is about:",
   "options": [
    "3.76×10^22 g",
    "9.63×10^24 g",
    "16 g",
    "2.66×10^−23 g"
   ],
   "answer": 3,
   "why": "Mass of one atom = molar mass / Avogadro's number.",
   "x": 1
  },
  {
   "q": "The mass of one atom of magnesium (M ≈ 24.31 g/mol) is about:",
   "options": [
    "1.46×10^25 g",
    "24.31 g",
    "4.04×10^−23 g",
    "2.48×10^22 g"
   ],
   "answer": 2,
   "why": "Mass of one atom = molar mass / Avogadro's number.",
   "x": 1
  },
  {
   "q": "The mass of one atom of iron (M ≈ 55.85 g/mol) is about:",
   "options": [
    "3.36×10^25 g",
    "1.08×10^22 g",
    "9.28×10^−23 g",
    "55.85 g"
   ],
   "answer": 2,
   "why": "Mass of one atom = molar mass / Avogadro's number.",
   "x": 1
  },
  {
   "q": "How many atoms are in 0.5 mol of an element?",
   "options": [
    "6.02×10^23",
    "8.31×10^−25",
    "5×10^22",
    "3.01×10^23"
   ],
   "answer": 3,
   "why": "N = n × Nₐ.",
   "x": 1
  },
  {
   "q": "How many atoms are in 2 mol of an element?",
   "options": [
    "6.02×10^23",
    "2×10^23",
    "3.32×10^−24",
    "1.2×10^24"
   ],
   "answer": 3,
   "why": "N = n × Nₐ.",
   "x": 1
  },
  {
   "q": "How many atoms are in 0.1 mol of an element?",
   "options": [
    "6.02×10^23",
    "1×10^22",
    "1.66×10^−25",
    "6.02×10^22"
   ],
   "answer": 3,
   "why": "N = n × Nₐ.",
   "x": 1
  },
  {
   "q": "How many atoms are in 3 mol of an element?",
   "options": [
    "6.02×10^23",
    "3×10^23",
    "1.81×10^24",
    "4.98×10^−24"
   ],
   "answer": 2,
   "why": "N = n × Nₐ.",
   "x": 1
  },
  {
   "q": "Which particle has a negative charge?",
   "options": [
    "The nucleus",
    "The electron",
    "The proton",
    "The neutron"
   ],
   "answer": 1,
   "why": "q = −1.602 × 10⁻¹⁹ C.",
   "x": 1
  },
  {
   "q": "The electron mass is about:",
   "options": [
    "1.675 × 10⁻²⁷ kg",
    "9.109 × 10⁻³¹ kg",
    "1.602 × 10⁻¹⁹ kg",
    "1.673 × 10⁻²⁷ kg"
   ],
   "answer": 1,
   "why": "The proton and neutron are about 1836 and 1839 times heavier.",
   "x": 1
  },
  {
   "q": "Nucleons are:",
   "options": [
    "Only protons",
    "Electrons and neutrons",
    "Protons and electrons",
    "Protons and neutrons"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "The element is identified by:",
   "options": [
    "Its atomic number Z",
    "Its molar mass",
    "Its number of neutrons",
    "Its mass number A"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "In a neutral atom, the number of electrons equals:",
   "options": [
    "The number of protons",
    "A − Z",
    "The mass number",
    "The number of neutrons"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "The size of an atom is set by:",
   "options": [
    "Its nucleus",
    "Its mass number",
    "Its electron distribution",
    "Its neutrons"
   ],
   "answer": 2,
   "why": "Nuclei are tiny but hold almost all the mass.",
   "x": 1
  },
  {
   "q": "The mass defect of a nucleus corresponds to:",
   "options": [
    "Isotopic abundance",
    "The energy released when it forms from its nucleons",
    "Missing protons",
    "Extra electrons"
   ],
   "answer": 1,
   "why": "ΔE = Δm·c².",
   "x": 1
  },
  {
   "q": "The neutron mass is about:",
   "options": [
    "9.109 × 10⁻³¹ kg",
    "1.675 × 10⁻²⁷ kg (1839 mₑ)",
    "1.602 × 10⁻¹⁹ kg",
    "1 g"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "Matter exists in how many usual phases?",
   "options": [
    "Two",
    "One",
    "Four",
    "Three: solid, liquid, gas"
   ],
   "answer": 3,
   "why": "Water can be in all three at once.",
   "x": 1
  },
  {
   "q": "Chemical bonding arises from:",
   "options": [
    "Nuclear forces only",
    "Electrical forces between electrons and nuclei and sharing of electrons",
    "Gravity",
    "Magnetism only"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "The atomic mass of an element is the mass of:",
   "options": [
    "One atom",
    "One mole of its atoms",
    "One gram",
    "One proton"
   ],
   "answer": 1,
   "why": "A gram-atom.",
   "x": 1
  },
  {
   "q": "The reference for the atomic mass scale is:",
   "options": [
    "Carbon-12",
    "Hydrogen-1",
    "Iron-56",
    "Oxygen-16"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "Isotopes of an element differ in:",
   "options": [
    "Their atomic number",
    "Their number of protons",
    "Their number of neutrons",
    "Their chemical properties"
   ],
   "answer": 2,
   "why": "",
   "x": 1
  },
  {
   "q": "1 u expressed in grams is about:",
   "options": [
    "1 g",
    "6.02 × 10²³ g",
    "12 g",
    "1.66 × 10⁻²⁴ g"
   ],
   "answer": 3,
   "why": "1/12 of the mass of a ¹²C atom.",
   "x": 1
  },
  {
   "q": "How many neutrons are in ⁶Li (Z = 3)?",
   "options": [
    "9",
    "3",
    "6",
    "5"
   ],
   "answer": 1,
   "why": "N = A − Z = 3.",
   "x": 1
  },
  {
   "q": "How many neutrons are in ²⁰Ne (Z = 10)?",
   "options": [
    "12",
    "20",
    "30",
    "10"
   ],
   "answer": 3,
   "why": "N = A − Z = 10.",
   "x": 1
  },
  {
   "q": "How many neutrons are in ²²Ne (Z = 10)?",
   "options": [
    "12",
    "32",
    "22",
    "10"
   ],
   "answer": 0,
   "why": "N = A − Z = 12.",
   "x": 1
  },
  {
   "q": "How many neutrons are in ²⁶Mg (Z = 12)?",
   "options": [
    "14",
    "12",
    "26",
    "38"
   ],
   "answer": 0,
   "why": "N = A − Z = 14.",
   "x": 1
  },
  {
   "q": "How many neutrons are in ²⁸Si (Z = 14)?",
   "options": [
    "14",
    "42",
    "28",
    "16"
   ],
   "answer": 0,
   "why": "N = A − Z = 14.",
   "x": 1
  },
  {
   "q": "How many neutrons are in ⁴⁰Ar (Z = 18)?",
   "options": [
    "40",
    "22",
    "58",
    "18"
   ],
   "answer": 1,
   "why": "N = A − Z = 22.",
   "x": 1
  },
  {
   "q": "How many neutrons are in ⁴⁴Ca (Z = 20)?",
   "options": [
    "64",
    "44",
    "20",
    "24"
   ],
   "answer": 3,
   "why": "N = A − Z = 24.",
   "x": 1
  },
  {
   "q": "How many neutrons are in ⁵²Cr (Z = 24)?",
   "options": [
    "52",
    "24",
    "76",
    "28"
   ],
   "answer": 3,
   "why": "N = A − Z = 28.",
   "x": 1
  },
  {
   "q": "How many neutrons are in ⁵⁹Co (Z = 27)?",
   "options": [
    "86",
    "59",
    "32",
    "27"
   ],
   "answer": 2,
   "why": "N = A − Z = 32.",
   "x": 1
  },
  {
   "q": "How many neutrons are in ⁵⁸Ni (Z = 28)?",
   "options": [
    "30",
    "58",
    "28",
    "86"
   ],
   "answer": 0,
   "why": "N = A − Z = 30.",
   "x": 1
  },
  {
   "q": "How many neutrons are in ⁸⁴Kr (Z = 36)?",
   "options": [
    "48",
    "84",
    "120",
    "36"
   ],
   "answer": 0,
   "why": "N = A − Z = 48.",
   "x": 1
  },
  {
   "q": "How many neutrons are in ³²P (Z = 15)?",
   "options": [
    "17",
    "32",
    "15",
    "47"
   ],
   "answer": 0,
   "why": "N = A − Z = 17.",
   "x": 1
  }
 ],
 "cards": [
  {
   "id": "x0",
   "type": "text",
   "front": "Three states (phases) of matter?",
   "back": "Solid, liquid, gas; one substance (e.g. water) can exist in all three depending on temperature and pressure."
  },
  {
   "id": "x1",
   "type": "text",
   "front": "Charge and mass of the electron?",
   "back": "−1.602×10⁻¹⁹ C; 9.109×10⁻³¹ kg."
  },
  {
   "id": "x2",
   "type": "text",
   "front": "Proton vs neutron?",
   "back": "Proton: +1.602×10⁻¹⁹ C, 1.673×10⁻²⁷ kg (1836 mₑ). Neutron: 0 C, 1.675×10⁻²⁷ kg (1839 mₑ)."
  },
  {
   "id": "x3",
   "type": "text",
   "front": "Z, A and N?",
   "back": "Z: protons (atomic number). A: nucleons (mass number). N = A − Z: neutrons."
  },
  {
   "id": "x4",
   "type": "text",
   "front": "What are isotopes?",
   "back": "Atoms of the same element (same Z) with different mass numbers (different neutron counts)."
  },
  {
   "id": "x5",
   "type": "text",
   "front": "Define the atomic mass unit.",
   "back": "1 u = 1/12 of the mass of a ¹²C atom = 1/Nₐ g ≈ 1.66×10⁻²⁴ g."
  },
  {
   "id": "x6",
   "type": "text",
   "front": "Atomic (molar) mass?",
   "back": "Mass of one mole (Nₐ ≈ 6.02×10²³) of atoms, in g/mol; one atom = M / Nₐ."
  },
  {
   "id": "x7",
   "type": "text",
   "front": "Mass defect and binding energy?",
   "back": "Real nucleus mass < sum of nucleons; Δm converts to binding energy ΔE = Δm·c²."
  },
  {
   "id": "img-e",
   "type": "image",
   "target": "e",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Electron. Stable, negatively charged; sets the size of the atom through its distribution."
  },
  {
   "id": "img-p",
   "type": "image",
   "target": "p",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Proton. Positively charged nucleon, 1.673×10⁻²⁷ kg ≈ 1.0073 u."
  },
  {
   "id": "img-n",
   "type": "image",
   "target": "n",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Neutron. Neutral nucleon, 1.675×10⁻²⁷ kg ≈ 1.0087 u."
  },
  {
   "id": "img-z",
   "type": "image",
   "target": "z",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Atomic number Z. Number of protons (= electrons in the neutral atom); defines the element."
  },
  {
   "id": "img-a",
   "type": "image",
   "target": "a",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Mass number A. Number of nucleons: protons + neutrons; N = A − Z neutrons."
  },
  {
   "id": "img-def",
   "type": "image",
   "target": "def",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Mass defect. The real nucleus is lighter than its separate nucleons; the missing mass is the binding energy."
  }
 ],
 "deeper": [
  {
   "title": "Why the nucleus is lighter than its parts",
   "html": "<p>When protons and neutrons bind, energy is released, and by E = mc² that energy carries away mass. To pull the nucleus apart you must put the same energy back, which is why it is called the binding energy. The effect is tiny for each nucleus but enormous per mole, and it powers nuclear reactions.</p><p class='src'>Source: the lecture's atomic mass defect slides.</p>"
  },
  {
   "title": "Why carbon-12 anchors the mass scale",
   "html": "<p>Defining the atomic mass unit as one twelfth of a carbon-12 atom makes the mass of one mole of carbon-12 exactly 12 g, so atomic masses in u and molar masses in g/mol are the same numbers. That is why you can read an element's molar mass straight off the periodic table.</p><p class='src'>Source: the lecture's atomic mass slides.</p>"
  }
 ],
 "resources": [
  {
   "title": "Atomic structure (Khan Academy)",
   "url": "https://www.khanacademy.org/science/chemistry/atomic-structure-and-properties",
   "kind": "Website",
   "why": "Particles, isotopes and atomic mass.",
   "note": ""
  },
  {
   "title": "CODATA fundamental constants (NIST)",
   "url": "https://physics.nist.gov/cuu/Constants/",
   "kind": "Website",
   "why": "Current values of the electron charge, masses and Avogadro's number.",
   "note": ""
  }
 ],
 "checks": [],
 "sources": [
  {
   "name": "Atomic structure (Khan Academy)",
   "url": "https://www.khanacademy.org/science/chemistry/atomic-structure-and-properties"
  },
  {
   "name": "CODATA fundamental constants (NIST)",
   "url": "https://physics.nist.gov/cuu/Constants/"
  }
 ],
 "verified": "22 Sep 2026"
};
window.SINA = window.SINA || {subjects:[], lectures:{}};
SINA.lectures["chem1-bohr"] = {
 "id": "chem1-bohr",
 "subject": "chem1",
 "group": "General chemistry",
 "title": "Models of the atom: Rutherford, quantum theory and Bohr",
 "sourceFile": "Lecture 2 - General Chemistry (2025-2026) (General Chemistry, Prof. Tarik Ouchbani)",
 "sourceUrl": "https://drive.google.com/file/d/1-ZtpTPUeErS-ePaVOUkrPInYJHck9NEP/view?usp=drivesdk",
 "buildNote": "<strong>Built from the lecture slides.</strong> Slides that only show pictures are covered in outline. If your professor says something different, trust your professor.",
 "summary": [
  {
   "id": "s0",
   "title": "The big picture",
   "html": "<p>Chapter II builds the model of the atom step by step: Rutherford's nuclear model, the hydrogen emission spectrum that it could not explain, Planck-Einstein quantum theory, and Bohr's quantised model applied to hydrogen and hydrogen-like ions. (Quantum mechanics, quantum numbers, orbitals, electron configuration and periodic trends follow in the next lectures.)</p>"
  },
  {
   "id": "s1",
   "title": "Rutherford's model and its failure",
   "html": "<p><strong>Rutherford</strong>: the positive charge and almost all the mass are concentrated in a tiny <strong>nucleus</strong>; negative electrons <strong>orbit</strong> it at high speed in circular paths, held by <strong>electrostatic attraction</strong>, balanced by the centrifugal effect. Total energy = kinetic energy (½mv²) + potential energy. <strong>Hydrogen emission spectrum</strong>: an electric discharge through low-pressure hydrogen emits light which a prism splits into <strong>discrete lines</strong>; four visible lines form the <strong>Balmer series</strong>. <strong>Failure</strong>: by classical physics an orbiting (accelerating) electron should radiate energy continuously and spiral into the nucleus, giving a <strong>continuous</strong> spectrum; but hydrogen's spectrum is <strong>discontinuous</strong> and atoms are stable.</p>"
  },
  {
   "id": "s2",
   "title": "Quantum theory",
   "html": "<p><strong>Planck and Einstein</strong>: energy is exchanged between radiation and matter only in finite packets, <strong>quanta</strong>: <strong>ΔE = hν</strong> (h = Planck's constant ≈ 6.626 × 10⁻³⁴ J·s; ν = frequency). <strong>Absorption</strong> (excitation): Ef = Ei + hν (ΔE > 0). <strong>Emission</strong>: Ef = Ei − hν (ΔE < 0).</p>"
  },
  {
   "id": "s3",
   "title": "Bohr's model (1913)",
   "html": "<p>The first application of quantum theory to the atom, with three postulates. (1) <strong>Mechanical</strong>: the electron moves only on <strong>stationary circular orbits</strong> of fixed radius and <strong>quantised energy</strong>. (2) <strong>Optical</strong>: jumping between orbits absorbs or emits exactly <strong>|ΔE| = |En′ − En| = hν</strong>; <strong>n = 1</strong> is the <strong>ground state</strong> (minimum energy); absorbing a photon gives an <strong>excited</strong> atom; falling back emits a photon. (3) <strong>Angular momentum</strong> is quantised: <strong>mvr = n·h/2π</strong>, where n is the <strong>principal quantum number</strong>.</p><p><strong>Hydrogen</strong>: energy levels <strong>Eₙ = −13.6/n² eV</strong> (ground state −13.6 eV; ionisation at n = ∞, E = 0) and radii rₙ = 0.53 n² Å. Line series follow the <strong>Ritz formula</strong> 1/λ = R<sub>H</sub> (1/n₁² − 1/n₂²) (R<sub>H</sub> = Rydberg constant): <strong>Lyman</strong> (to n = 1, UV), <strong>Balmer</strong> (to n = 2, visible), then Paschen, Brackett, Pfund (infrared). <strong>Hydrogen-like ions</strong> (one electron, Z > 1: He⁺, Li²⁺, Be³⁺, B⁴⁺): Eₙ = −13.6 Z²/n² eV and <strong>R = Z² R<sub>H</sub></strong>.</p>"
  }
 ],
 "exam": [
  "Rutherford: tiny dense positive nucleus; electrons orbit it.",
  "Hydrogen spectrum is discontinuous (lines); Balmer = 4 visible lines.",
  "Classical physics: orbiting electron should spiral in → Rutherford model fails.",
  "Quantum theory: ΔE = hν (Planck, Einstein).",
  "Bohr 1913: stationary orbits, quantised energy.",
  "Transitions: |ΔE| = hν; n = 1 ground state.",
  "Angular momentum mvr = n·h/2π; n = principal quantum number.",
  "H: Eₙ = −13.6/n² eV; ionisation 13.6 eV.",
  "Ritz: 1/λ = R_H (1/n₁² − 1/n₂²); Lyman (n₁ = 1), Balmer (n₁ = 2).",
  "Hydrogen-like ions: R = Z² R_H."
 ],
 "visual": {
  "kind": "model",
  "intro": "",
  "figure": {
   "viewBox": "0 0 760 420",
   "alt": "Bohr energy levels of hydrogen",
   "caption": "Transitions produce the spectral series. Schematic drawn for this site.",
   "base": "<defs><marker id=\"ah\" markerWidth=\"10\" markerHeight=\"8\" refX=\"9\" refY=\"4\" orient=\"auto\"><path d=\"M0,0 L10,4 L0,8 Z\" fill=\"#8a8a8a\"/></marker></defs><line stroke=\"#8a8a8a\" stroke-width=\"2\" marker-end=\"url(#ah)\" x1=\"380\" y1=\"85\" x2=\"380\" y2=\"140\"/><line stroke=\"#8a8a8a\" stroke-width=\"2\" marker-end=\"url(#ah)\" x1=\"380\" y1=\"190\" x2=\"380\" y2=\"210\"/><line stroke=\"#8a8a8a\" stroke-width=\"2\" marker-end=\"url(#ah)\" x1=\"380\" y1=\"260\" x2=\"380\" y2=\"300\"/>",
   "parts": {
    "n1": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#f2d7cf\" x=\"280\" y=\"300\" width=\"200\" height=\"55\" rx=\"10\"/>",
     "label": [
      "n = 1: ground state",
      "E₁ = −13.6 eV"
     ],
     "lx": 380.0,
     "ly": 325.5
    },
    "n2": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#cfe3f2\" x=\"280\" y=\"210\" width=\"200\" height=\"50\" rx=\"10\"/>",
     "label": [
      "n = 2: −3.4 eV"
     ],
     "lx": 380.0,
     "ly": 241.0
    },
    "n3": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#d7edd2\" x=\"280\" y=\"140\" width=\"200\" height=\"50\" rx=\"10\"/>",
     "label": [
      "n = 3: −1.51 eV"
     ],
     "lx": 380.0,
     "ly": 171.0
    },
    "ninf": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#f2e2a8\" x=\"280\" y=\"30\" width=\"200\" height=\"55\" rx=\"10\"/>",
     "label": [
      "n = ∞: 0 eV",
      "(ionisation)"
     ],
     "lx": 380.0,
     "ly": 55.5
    },
    "lyman": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#e3d5f0\" x=\"40\" y=\"230\" width=\"180\" height=\"55\" rx=\"10\"/>",
     "label": [
      "Lyman: → n = 1",
      "(ultraviolet)"
     ],
     "lx": 130.0,
     "ly": 255.5
    },
    "balmer": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#f7d9b8\" x=\"540\" y=\"150\" width=\"180\" height=\"55\" rx=\"10\"/>",
     "label": [
      "Balmer: → n = 2",
      "(visible, 4 lines)"
     ],
     "lx": 630.0,
     "ly": 175.5
    }
   },
   "arrows": {
    "n1": [
     {
      "t": [
       280.0,
       308.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "n2": [
     {
      "t": [
       280.0,
       218.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "n3": [
     {
      "t": [
       280.0,
       148.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "ninf": [
     {
      "t": [
       280.0,
       38.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "lyman": [
     {
      "t": [
       40.0,
       238.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "balmer": [
     {
      "t": [
       540.0,
       158.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ]
   }
  }
 },
 "mcqs": [
  {
   "q": "In Rutherford's model, most of the atom's mass is:",
   "options": [
    "In the electrons",
    "Evenly spread",
    "In the orbits",
    "In a tiny positive nucleus"
   ],
   "answer": 3,
   "why": "Electrons orbit around it.",
   "slides": [
    {
     "src": "files/slides/chem1-bohr/06.jpg",
     "lec": "Models of the atom: Rutherford,",
     "n": 6
    }
   ]
  },
  {
   "q": "What holds electrons around the nucleus in Rutherford's model?",
   "options": [
    "Gravity",
    "Magnetism",
    "Electrostatic attraction",
    "Nuclear force"
   ],
   "answer": 2,
   "why": "Balanced by the centrifugal effect.",
   "slides": [
    {
     "src": "files/slides/chem1-bohr/06.jpg",
     "lec": "Models of the atom: Rutherford,",
     "n": 6
    },
    {
     "src": "files/slides/chem1-bohr/07.jpg",
     "lec": "Models of the atom: Rutherford,",
     "n": 7
    }
   ]
  },
  {
   "q": "The hydrogen emission spectrum is:",
   "options": [
    "Made of discrete lines",
    "Continuous",
    "Absent",
    "Only infrared"
   ],
   "answer": 0,
   "why": "Evidence of quantised energy.",
   "slides": [
    {
     "src": "files/slides/chem1-bohr/09.jpg",
     "lec": "Models of the atom: Rutherford,",
     "n": 9
    },
    {
     "src": "files/slides/chem1-bohr/11.jpg",
     "lec": "Models of the atom: Rutherford,",
     "n": 11
    }
   ]
  },
  {
   "q": "The four visible lines of hydrogen form the:",
   "options": [
    "Paschen series",
    "Pfund series",
    "Balmer series",
    "Lyman series"
   ],
   "answer": 2,
   "why": "Ending on n = 2.",
   "slides": [
    {
     "src": "files/slides/chem1-bohr/09.jpg",
     "lec": "Models of the atom: Rutherford,",
     "n": 9
    }
   ]
  },
  {
   "q": "Why did Rutherford's model fail?",
   "options": [
    "Electrons would spiral in",
    "It had no nucleus",
    "It predicted discrete lines",
    "It ignored protons"
   ],
   "answer": 0,
   "why": "And give a continuous spectrum.",
   "slides": [
    {
     "src": "files/slides/chem1-bohr/10.jpg",
     "lec": "Models of the atom: Rutherford,",
     "n": 10
    }
   ]
  },
  {
   "q": "The energy of a quantum is:",
   "options": [
    "ΔE = qV",
    "ΔE = hν",
    "ΔE = ½mv²",
    "ΔE = mc²"
   ],
   "answer": 1,
   "why": "Planck-Einstein.",
   "slides": [
    {
     "src": "files/slides/chem1-bohr/11.jpg",
     "lec": "Models of the atom: Rutherford,",
     "n": 11
    }
   ]
  },
  {
   "q": "When an atom absorbs a photon of frequency ν:",
   "options": [
    "Ef = Ei",
    "Ef = Ei − hν",
    "Ef = Ei + hν",
    "E = 0"
   ],
   "answer": 2,
   "why": "It becomes excited.",
   "slides": [
    {
     "src": "files/slides/chem1-bohr/13.jpg",
     "lec": "Models of the atom: Rutherford,",
     "n": 13
    }
   ]
  },
  {
   "q": "Bohr's first postulate states that electrons move on:",
   "options": [
    "The nucleus",
    "Elliptical orbits only",
    "Random paths",
    "Quantised stationary orbits"
   ],
   "answer": 3,
   "why": "Mechanical postulate.",
   "slides": [
    {
     "src": "files/slides/chem1-bohr/13.jpg",
     "lec": "Models of the atom: Rutherford,",
     "n": 13
    }
   ]
  },
  {
   "q": "The ground state of hydrogen corresponds to:",
   "options": [
    "n = ∞",
    "n = 1",
    "n = 0",
    "n = 2"
   ],
   "answer": 1,
   "why": "Minimum energy."
  },
  {
   "q": "Bohr's quantisation condition for angular momentum is:",
   "options": [
    "mvr = n·h/2π",
    "E = n·h",
    "r = n·h",
    "mvr = h·ν"
   ],
   "answer": 0,
   "why": "n is the principal quantum number.",
   "slides": [
    {
     "src": "files/slides/chem1-bohr/14.jpg",
     "lec": "Models of the atom: Rutherford,",
     "n": 14
    }
   ]
  },
  {
   "q": "The energy of hydrogen's level n is:",
   "options": [
    "−13.6/n² eV",
    "−13.6·n² eV",
    "+13.6/n eV",
    "−13.6·n eV"
   ],
   "answer": 0,
   "why": "Ground state −13.6 eV.",
   "slides": [
    {
     "src": "files/slides/chem1-bohr/13.jpg",
     "lec": "Models of the atom: Rutherford,",
     "n": 13
    }
   ]
  },
  {
   "q": "The ionisation energy of hydrogen is:",
   "options": [
    "3.4 eV",
    "1.51 eV",
    "0 eV",
    "13.6 eV"
   ],
   "answer": 3,
   "why": "From n = 1 to n = ∞."
  },
  {
   "q": "The Lyman series corresponds to transitions ending on:",
   "options": [
    "n = ∞",
    "n = 2",
    "n = 3",
    "n = 1"
   ],
   "answer": 3,
   "why": "In the ultraviolet."
  },
  {
   "q": "For hydrogen-like ions, the Rydberg constant becomes:",
   "options": [
    "Z² R_H",
    "Z R_H",
    "R_H / Z",
    "R_H"
   ],
   "answer": 0,
   "why": "Energies scale with Z²."
  },
  {
   "q": "Which is a hydrogen-like ion?",
   "options": [
    "He",
    "He⁺",
    "H⁺",
    "Li"
   ],
   "answer": 1,
   "why": "One electron, Z = 2."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "n1",
   "options": [
    "Higher levels",
    "Ionisation limit",
    "First excited state",
    "Ground state"
   ],
   "answer": 3,
   "why": "The arrow points to: Ground state. n = 1, lowest energy (−13.6 eV for hydrogen); the most stable state."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "n2",
   "options": [
    "Ionisation limit",
    "Lyman series",
    "First excited state",
    "Ground state"
   ],
   "answer": 2,
   "why": "The arrow points to: First excited state. n = 2; Eₙ = −13.6/n² eV."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "n3",
   "options": [
    "Ionisation limit",
    "Higher levels",
    "Lyman series",
    "First excited state"
   ],
   "answer": 1,
   "why": "The arrow points to: Higher levels. Levels crowd together as n increases."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "ninf",
   "options": [
    "Lyman series",
    "Ionisation limit",
    "Higher levels",
    "First excited state"
   ],
   "answer": 1,
   "why": "The arrow points to: Ionisation limit. At n = ∞ the electron is free (E = 0); ionisation energy of H = 13.6 eV."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "lyman",
   "options": [
    "Lyman series",
    "Ionisation limit",
    "Higher levels",
    "Balmer series"
   ],
   "answer": 0,
   "why": "The arrow points to: Lyman series. Emission lines ending on n = 1, in the ultraviolet."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "balmer",
   "options": [
    "Ionisation limit",
    "Higher levels",
    "Balmer series",
    "Ground state"
   ],
   "answer": 2,
   "why": "The arrow points to: Balmer series. Lines ending on n = 2; the four visible lines seen in the discharge tube."
  },
  {
   "q": "The energy of hydrogen's level n = 1 is:",
   "options": [
    "−12.6 eV",
    "−13.6 eV",
    "13.6 eV",
    "0 eV"
   ],
   "answer": 1,
   "why": "Eₙ = −13.6 / n² eV.",
   "x": 1
  },
  {
   "q": "The energy of hydrogen's level n = 2 is:",
   "options": [
    "−6.8 eV",
    "−54.4 eV",
    "3.4 eV",
    "−3.4 eV"
   ],
   "answer": 3,
   "why": "Eₙ = −13.6 / n² eV.",
   "x": 1
  },
  {
   "q": "The energy of hydrogen's level n = 3 is:",
   "options": [
    "1.51 eV",
    "−1.51 eV",
    "−122 eV",
    "−4.53 eV"
   ],
   "answer": 1,
   "why": "Eₙ = −13.6 / n² eV.",
   "x": 1
  },
  {
   "q": "The energy of hydrogen's level n = 4 is:",
   "options": [
    "0.85 eV",
    "−218 eV",
    "−3.4 eV",
    "−0.85 eV"
   ],
   "answer": 3,
   "why": "Eₙ = −13.6 / n² eV.",
   "x": 1
  },
  {
   "q": "The energy of hydrogen's level n = 5 is:",
   "options": [
    "−340 eV",
    "−2.72 eV",
    "−0.544 eV",
    "0.544 eV"
   ],
   "answer": 2,
   "why": "Eₙ = −13.6 / n² eV.",
   "x": 1
  },
  {
   "q": "The energy of hydrogen's level n = 6 is:",
   "options": [
    "−2.27 eV",
    "−490 eV",
    "−0.378 eV",
    "0.378 eV"
   ],
   "answer": 2,
   "why": "Eₙ = −13.6 / n² eV.",
   "x": 1
  },
  {
   "q": "In hydrogen, an electron falls from n = 2 to n = 1. The energy of the emitted photon is:",
   "options": [
    "3.4 eV",
    "17 eV",
    "10.2 eV",
    "6.8 eV"
   ],
   "answer": 2,
   "why": "ΔE = 13.6 (1/1² − 1/2²) = 10.2 eV.",
   "x": 1
  },
  {
   "q": "In hydrogen, an electron falls from n = 3 to n = 1. The energy of the emitted photon is:",
   "options": [
    "1.51 eV",
    "12.1 eV",
    "9.07 eV",
    "15.1 eV"
   ],
   "answer": 1,
   "why": "ΔE = 13.6 (1/1² − 1/3²) = 12.1 eV.",
   "x": 1
  },
  {
   "q": "In hydrogen, an electron falls from n = 4 to n = 1. The energy of the emitted photon is:",
   "options": [
    "10.2 eV",
    "14.4 eV",
    "0.85 eV",
    "12.8 eV"
   ],
   "answer": 3,
   "why": "ΔE = 13.6 (1/1² − 1/4²) = 12.8 eV.",
   "x": 1
  },
  {
   "q": "In hydrogen, an electron falls from n = 3 to n = 2. The energy of the emitted photon is:",
   "options": [
    "4.91 eV",
    "1.51 eV",
    "2.27 eV",
    "1.89 eV"
   ],
   "answer": 3,
   "why": "ΔE = 13.6 (1/2² − 1/3²) = 1.89 eV.",
   "x": 1
  },
  {
   "q": "In hydrogen, an electron falls from n = 4 to n = 2. The energy of the emitted photon is:",
   "options": [
    "0.85 eV",
    "3.4 eV",
    "4.25 eV",
    "2.55 eV"
   ],
   "answer": 3,
   "why": "ΔE = 13.6 (1/2² − 1/4²) = 2.55 eV.",
   "x": 1
  },
  {
   "q": "In hydrogen, an electron falls from n = 5 to n = 2. The energy of the emitted photon is:",
   "options": [
    "3.94 eV",
    "4.08 eV",
    "0.544 eV",
    "2.86 eV"
   ],
   "answer": 3,
   "why": "ΔE = 13.6 (1/2² − 1/5²) = 2.86 eV.",
   "x": 1
  },
  {
   "q": "In hydrogen, an electron falls from n = 6 to n = 2. The energy of the emitted photon is:",
   "options": [
    "0.378 eV",
    "4.53 eV",
    "3.78 eV",
    "3.02 eV"
   ],
   "answer": 3,
   "why": "ΔE = 13.6 (1/2² − 1/6²) = 3.02 eV.",
   "x": 1
  },
  {
   "q": "In hydrogen, an electron falls from n = 4 to n = 3. The energy of the emitted photon is:",
   "options": [
    "0.85 eV",
    "0.661 eV",
    "1.13 eV",
    "2.36 eV"
   ],
   "answer": 1,
   "why": "ΔE = 13.6 (1/3² − 1/4²) = 0.661 eV.",
   "x": 1
  },
  {
   "q": "In hydrogen, an electron falls from n = 5 to n = 3. The energy of the emitted photon is:",
   "options": [
    "1.81 eV",
    "0.967 eV",
    "2.06 eV",
    "0.544 eV"
   ],
   "answer": 1,
   "why": "ΔE = 13.6 (1/3² − 1/5²) = 0.967 eV.",
   "x": 1
  },
  {
   "q": "In hydrogen, an electron falls from n = 5 to n = 4. The energy of the emitted photon is:",
   "options": [
    "0.544 eV",
    "1.39 eV",
    "0.68 eV",
    "0.306 eV"
   ],
   "answer": 3,
   "why": "ΔE = 13.6 (1/4² − 1/5²) = 0.306 eV.",
   "x": 1
  },
  {
   "q": "In hydrogen, an electron falls from n = 6 to n = 1. The energy of the emitted photon is:",
   "options": [
    "11.3 eV",
    "0.378 eV",
    "14 eV",
    "13.2 eV"
   ],
   "answer": 3,
   "why": "ΔE = 13.6 (1/1² − 1/6²) = 13.2 eV.",
   "x": 1
  },
  {
   "q": "In hydrogen, an electron falls from n = 6 to n = 3. The energy of the emitted photon is:",
   "options": [
    "2.27 eV",
    "1.13 eV",
    "1.89 eV",
    "0.378 eV"
   ],
   "answer": 1,
   "why": "ΔE = 13.6 (1/3² − 1/6²) = 1.13 eV.",
   "x": 1
  },
  {
   "q": "The hydrogen transition n = 2 → n = 1 belongs to the:",
   "options": [
    "Lyman series",
    "Brackett series",
    "Balmer series",
    "Paschen series"
   ],
   "answer": 0,
   "why": "The series is named after the lower level (n = 1).",
   "x": 1
  },
  {
   "q": "The hydrogen transition n = 5 → n = 1 belongs to the:",
   "options": [
    "Paschen series",
    "Balmer series",
    "Lyman series",
    "Brackett series"
   ],
   "answer": 2,
   "why": "The series is named after the lower level (n = 1).",
   "x": 1
  },
  {
   "q": "The hydrogen transition n = 3 → n = 2 belongs to the:",
   "options": [
    "Brackett series",
    "Balmer series",
    "Paschen series",
    "Lyman series"
   ],
   "answer": 1,
   "why": "The series is named after the lower level (n = 2).",
   "x": 1
  },
  {
   "q": "The hydrogen transition n = 6 → n = 2 belongs to the:",
   "options": [
    "Brackett series",
    "Balmer series",
    "Paschen series",
    "Lyman series"
   ],
   "answer": 1,
   "why": "The series is named after the lower level (n = 2).",
   "x": 1
  },
  {
   "q": "The hydrogen transition n = 4 → n = 3 belongs to the:",
   "options": [
    "Balmer series",
    "Brackett series",
    "Lyman series",
    "Paschen series"
   ],
   "answer": 3,
   "why": "The series is named after the lower level (n = 3).",
   "x": 1
  },
  {
   "q": "The hydrogen transition n = 7 → n = 3 belongs to the:",
   "options": [
    "Paschen series",
    "Brackett series",
    "Balmer series",
    "Lyman series"
   ],
   "answer": 0,
   "why": "The series is named after the lower level (n = 3).",
   "x": 1
  },
  {
   "q": "The hydrogen transition n = 5 → n = 4 belongs to the:",
   "options": [
    "Brackett series",
    "Lyman series",
    "Paschen series",
    "Balmer series"
   ],
   "answer": 0,
   "why": "The series is named after the lower level (n = 4).",
   "x": 1
  },
  {
   "q": "The hydrogen transition n = 6 → n = 5 belongs to the:",
   "options": [
    "Pfund series",
    "Balmer series",
    "Lyman series",
    "Paschen series"
   ],
   "answer": 0,
   "why": "The series is named after the lower level (n = 5).",
   "x": 1
  },
  {
   "q": "The hydrogen transition n = 4 → n = 2 belongs to the:",
   "options": [
    "Brackett series",
    "Paschen series",
    "Balmer series",
    "Lyman series"
   ],
   "answer": 2,
   "why": "The series is named after the lower level (n = 2).",
   "x": 1
  },
  {
   "q": "The hydrogen transition n = 3 → n = 1 belongs to the:",
   "options": [
    "Brackett series",
    "Paschen series",
    "Balmer series",
    "Lyman series"
   ],
   "answer": 3,
   "why": "The series is named after the lower level (n = 1).",
   "x": 1
  },
  {
   "q": "The energy of the level n = 1 of the hydrogen-like ion He⁺ (Z = 2) is:",
   "options": [
    "54.4 eV",
    "−27.2 eV",
    "−54.4 eV",
    "−13.6 eV"
   ],
   "answer": 2,
   "why": "Eₙ = −13.6 Z² / n² eV.",
   "x": 1
  },
  {
   "q": "The energy of the level n = 2 of the hydrogen-like ion He⁺ (Z = 2) is:",
   "options": [
    "−13.6 eV",
    "13.6 eV",
    "−6.8 eV",
    "−3.4 eV"
   ],
   "answer": 0,
   "why": "Eₙ = −13.6 Z² / n² eV.",
   "x": 1
  },
  {
   "q": "The ionisation energy of He⁺ from its ground state is:",
   "options": [
    "13.6 eV",
    "54.4 eV",
    "3.4 eV",
    "27.2 eV"
   ],
   "answer": 1,
   "why": "Eᵢ = 13.6 Z² eV.",
   "x": 1
  },
  {
   "q": "The energy of the level n = 1 of the hydrogen-like ion Li²⁺ (Z = 3) is:",
   "options": [
    "122 eV",
    "−13.6 eV",
    "−40.8 eV",
    "−122 eV"
   ],
   "answer": 3,
   "why": "Eₙ = −13.6 Z² / n² eV.",
   "x": 1
  },
  {
   "q": "The energy of the level n = 2 of the hydrogen-like ion Li²⁺ (Z = 3) is:",
   "options": [
    "−30.6 eV",
    "−3.4 eV",
    "30.6 eV",
    "−10.2 eV"
   ],
   "answer": 0,
   "why": "Eₙ = −13.6 Z² / n² eV.",
   "x": 1
  },
  {
   "q": "The ionisation energy of Li²⁺ from its ground state is:",
   "options": [
    "13.6 eV",
    "122 eV",
    "40.8 eV",
    "1.51 eV"
   ],
   "answer": 1,
   "why": "Eᵢ = 13.6 Z² eV.",
   "x": 1
  },
  {
   "q": "The energy of the level n = 1 of the hydrogen-like ion Be³⁺ (Z = 4) is:",
   "options": [
    "−13.6 eV",
    "218 eV",
    "−218 eV",
    "−54.4 eV"
   ],
   "answer": 2,
   "why": "Eₙ = −13.6 Z² / n² eV.",
   "x": 1
  },
  {
   "q": "The energy of the level n = 2 of the hydrogen-like ion Be³⁺ (Z = 4) is:",
   "options": [
    "−3.4 eV",
    "−13.6 eV",
    "54.4 eV",
    "−54.4 eV"
   ],
   "answer": 3,
   "why": "Eₙ = −13.6 Z² / n² eV.",
   "x": 1
  },
  {
   "q": "The ionisation energy of Be³⁺ from its ground state is:",
   "options": [
    "54.4 eV",
    "13.6 eV",
    "218 eV",
    "0.85 eV"
   ],
   "answer": 2,
   "why": "Eᵢ = 13.6 Z² eV.",
   "x": 1
  },
  {
   "q": "The Bohr radius of orbit n = 1 for H (Z = 1) is about:",
   "options": [
    "5.3 Å",
    "0.53 Å",
    "1.06 Å",
    "1.53 Å"
   ],
   "answer": 1,
   "why": "rₙ = 0.53 n² / Z Å.",
   "x": 1
  },
  {
   "q": "The Bohr radius of orbit n = 2 for H (Z = 1) is about:",
   "options": [
    "2.12 Å",
    "1.06 Å",
    "21.2 Å",
    "0.133 Å"
   ],
   "answer": 0,
   "why": "rₙ = 0.53 n² / Z Å.",
   "x": 1
  },
  {
   "q": "The Bohr radius of orbit n = 3 for H (Z = 1) is about:",
   "options": [
    "4.77 Å",
    "1.59 Å",
    "0.0589 Å",
    "47.7 Å"
   ],
   "answer": 0,
   "why": "rₙ = 0.53 n² / Z Å.",
   "x": 1
  },
  {
   "q": "The Bohr radius of orbit n = 1 for He⁺ (Z = 2) is about:",
   "options": [
    "2.65 Å",
    "1.06 Å",
    "0.53 Å",
    "0.265 Å"
   ],
   "answer": 3,
   "why": "rₙ = 0.53 n² / Z Å.",
   "x": 1
  },
  {
   "q": "The Bohr radius of orbit n = 2 for He⁺ (Z = 2) is about:",
   "options": [
    "0.53 Å",
    "0.265 Å",
    "4.24 Å",
    "1.06 Å"
   ],
   "answer": 3,
   "why": "rₙ = 0.53 n² / Z Å.",
   "x": 1
  },
  {
   "q": "The Bohr radius of orbit n = 3 for He⁺ (Z = 2) is about:",
   "options": [
    "0.795 Å",
    "2.39 Å",
    "0.118 Å",
    "9.54 Å"
   ],
   "answer": 1,
   "why": "rₙ = 0.53 n² / Z Å.",
   "x": 1
  },
  {
   "q": "The Bohr radius of orbit n = 1 for Li²⁺ (Z = 3) is about:",
   "options": [
    "0.353 Å",
    "1.59 Å",
    "1.77 Å",
    "0.177 Å"
   ],
   "answer": 3,
   "why": "rₙ = 0.53 n² / Z Å.",
   "x": 1
  },
  {
   "q": "The Bohr radius of orbit n = 2 for Li²⁺ (Z = 3) is about:",
   "options": [
    "6.36 Å",
    "0.707 Å",
    "0.398 Å",
    "0.353 Å"
   ],
   "answer": 1,
   "why": "rₙ = 0.53 n² / Z Å.",
   "x": 1
  },
  {
   "q": "The Bohr radius of orbit n = 3 for Li²⁺ (Z = 3) is about:",
   "options": [
    "14.3 Å",
    "0.53 Å",
    "1.59 Å",
    "0.177 Å"
   ],
   "answer": 2,
   "why": "rₙ = 0.53 n² / Z Å.",
   "x": 1
  },
  {
   "q": "When an electron moves from n = 2 to n = 4, the atom:",
   "options": [
    "Emits a photon",
    "Is ionised",
    "Absorbs a photon",
    "Loses mass"
   ],
   "answer": 2,
   "why": "Raising n is absorption.",
   "x": 1
  },
  {
   "q": "When an electron moves from n = 5 to n = 2, the atom:",
   "options": [
    "Gains an electron",
    "Emits a photon",
    "Is ionised",
    "Absorbs a photon"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "Planck's constant h is about:",
   "options": [
    "6.02 × 10²³ J·s",
    "6.626 × 10⁻³⁴ J·s",
    "1.602 × 10⁻¹⁹ J·s",
    "3 × 10⁸ J·s"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "The ionisation limit of hydrogen corresponds to:",
   "options": [
    "n = 0",
    "n = 2",
    "n = 1, E = −13.6 eV",
    "n = ∞, E = 0"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "Bohr's quantisation condition is:",
   "options": [
    "λ = h/mv",
    "E = mc²",
    "mvr = n·h/2π",
    "Δx·Δp ≥ h/2π"
   ],
   "answer": 2,
   "why": "",
   "x": 1
  },
  {
   "q": "In Rutherford's model, electrons are held by:",
   "options": [
    "Gravity",
    "Electrostatic attraction to the nucleus",
    "Nuclear force",
    "Magnetism"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "The hydrogen spectrum is obtained by:",
   "options": [
    "Burning hydrogen in air",
    "Heating iron",
    "X-ray diffraction",
    "An electric discharge through low-pressure hydrogen, split by a prism"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "According to classical physics, an orbiting electron should:",
   "options": [
    "Leave the atom",
    "Radiate continuously and spiral into the nucleus",
    "Gain energy",
    "Stay still"
   ],
   "answer": 1,
   "why": "Hence the failure of Rutherford's model.",
   "x": 1
  },
  {
   "q": "A hydrogen-like ion has:",
   "options": [
    "Two electrons",
    "Only one electron with Z > 1",
    "Z = 1 only",
    "No electrons"
   ],
   "answer": 1,
   "why": "He⁺, Li²⁺, Be³⁺.",
   "x": 1
  },
  {
   "q": "The ground state of hydrogen is the level:",
   "options": [
    "n = 0",
    "n = 2",
    "n = ∞",
    "n = 1"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "The energy exchanged in a transition is:",
   "options": [
    "ΔE = h/ν",
    "|ΔE| = hν",
    "ΔE = 0",
    "ΔE = mc"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "Using λ(nm) = 1240 / ΔE(eV), the wavelength emitted by hydrogen for n = 2 → 1 is about:",
   "options": [
    "60.8 nm",
    "1.26e+04 nm",
    "243 nm",
    "122 nm"
   ],
   "answer": 3,
   "why": "ΔE = 10.2 eV.",
   "x": 1
  },
  {
   "q": "Using λ(nm) = 1240 / ΔE(eV), the wavelength emitted by hydrogen for n = 3 → 1 is about:",
   "options": [
    "1.5e+04 nm",
    "51.3 nm",
    "205 nm",
    "103 nm"
   ],
   "answer": 3,
   "why": "ΔE = 12.1 eV.",
   "x": 1
  },
  {
   "q": "Using λ(nm) = 1240 / ΔE(eV), the wavelength emitted by hydrogen for n = 3 → 2 is about:",
   "options": [
    "656 nm",
    "328 nm",
    "2.34e+03 nm",
    "1.31e+03 nm"
   ],
   "answer": 0,
   "why": "ΔE = 1.89 eV.",
   "x": 1
  },
  {
   "q": "Using λ(nm) = 1240 / ΔE(eV), the wavelength emitted by hydrogen for n = 4 → 2 is about:",
   "options": [
    "486 nm",
    "243 nm",
    "973 nm",
    "3.16e+03 nm"
   ],
   "answer": 0,
   "why": "ΔE = 2.55 eV.",
   "x": 1
  },
  {
   "q": "Using λ(nm) = 1240 / ΔE(eV), the wavelength emitted by hydrogen for n = 5 → 2 is about:",
   "options": [
    "217 nm",
    "868 nm",
    "434 nm",
    "3.54e+03 nm"
   ],
   "answer": 2,
   "why": "ΔE = 2.86 eV.",
   "x": 1
  },
  {
   "q": "Using λ(nm) = 1240 / ΔE(eV), the wavelength emitted by hydrogen for n = 4 → 3 is about:",
   "options": [
    "820 nm",
    "938 nm",
    "3.75e+03 nm",
    "1.88e+03 nm"
   ],
   "answer": 3,
   "why": "ΔE = 0.661 eV.",
   "x": 1
  },
  {
   "q": "Using λ(nm) = 1240 / ΔE(eV), the wavelength emitted by hydrogen for n = 6 → 2 is about:",
   "options": [
    "410 nm",
    "205 nm",
    "3.75e+03 nm",
    "821 nm"
   ],
   "answer": 0,
   "why": "ΔE = 3.02 eV.",
   "x": 1
  },
  {
   "q": "Using λ(nm) = 1240 / ΔE(eV), the wavelength emitted by hydrogen for n = 5 → 1 is about:",
   "options": [
    "47.5 nm",
    "95 nm",
    "1.62e+04 nm",
    "190 nm"
   ],
   "answer": 1,
   "why": "ΔE = 13.1 eV.",
   "x": 1
  },
  {
   "q": "Is the n = 3 → 2 hydrogen line in the visible range?",
   "options": [
    "No, it is infrared (Paschen)",
    "No, it is ultraviolet (Lyman)",
    "Only for He⁺",
    "Yes, it is a Balmer line"
   ],
   "answer": 3,
   "why": "The four visible lines end on n = 2.",
   "x": 1
  },
  {
   "q": "Is the n = 4 → 2 hydrogen line in the visible range?",
   "options": [
    "Yes, it is a Balmer line",
    "No, it is infrared (Paschen)",
    "No, it is ultraviolet (Lyman)",
    "Only for He⁺"
   ],
   "answer": 0,
   "why": "The four visible lines end on n = 2.",
   "x": 1
  },
  {
   "q": "Is the n = 5 → 2 hydrogen line in the visible range?",
   "options": [
    "Only for He⁺",
    "No, it is infrared (Paschen)",
    "Yes, it is a Balmer line",
    "No, it is ultraviolet (Lyman)"
   ],
   "answer": 2,
   "why": "The four visible lines end on n = 2.",
   "x": 1
  },
  {
   "q": "Is the n = 6 → 2 hydrogen line in the visible range?",
   "options": [
    "No, it is infrared (Paschen)",
    "Only for He⁺",
    "Yes, it is a Balmer line",
    "No, it is ultraviolet (Lyman)"
   ],
   "answer": 2,
   "why": "The four visible lines end on n = 2.",
   "x": 1
  },
  {
   "q": "Lines ending on n = 1 in hydrogen are found in the:",
   "options": [
    "Ultraviolet",
    "Microwave",
    "Visible (mostly)",
    "Infrared"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "Lines ending on n = 3 in hydrogen are found in the:",
   "options": [
    "Ultraviolet",
    "Microwave",
    "Visible (mostly)",
    "Infrared"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "Lines ending on n = 2 in hydrogen are found in the:",
   "options": [
    "Visible (mostly)",
    "Microwave",
    "Infrared",
    "Ultraviolet"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "The energy needed to ionise a hydrogen atom whose electron is already in n = 2 is:",
   "options": [
    "13.6 eV",
    "3.4 eV",
    "54.4 eV",
    "6.8 eV"
   ],
   "answer": 1,
   "why": "Eᵢ = 13.6 / n² eV from level n.",
   "x": 1
  },
  {
   "q": "The energy needed to ionise a hydrogen atom whose electron is already in n = 3 is:",
   "options": [
    "1.51 eV",
    "122 eV",
    "4.53 eV",
    "13.6 eV"
   ],
   "answer": 0,
   "why": "Eᵢ = 13.6 / n² eV from level n.",
   "x": 1
  },
  {
   "q": "The energy needed to ionise a hydrogen atom whose electron is already in n = 4 is:",
   "options": [
    "218 eV",
    "13.6 eV",
    "3.4 eV",
    "0.85 eV"
   ],
   "answer": 3,
   "why": "Eᵢ = 13.6 / n² eV from level n.",
   "x": 1
  },
  {
   "q": "For He⁺ (Z = 2), the photon emitted for n = 2 → 1 has an energy of:",
   "options": [
    "20.4 eV",
    "40.8 eV",
    "10.2 eV",
    "81.6 eV"
   ],
   "answer": 1,
   "why": "ΔE = 13.6 Z² (1/n₁² − 1/n₂²).",
   "x": 1
  },
  {
   "q": "For He⁺ (Z = 2), the photon emitted for n = 3 → 1 has an energy of:",
   "options": [
    "96.7 eV",
    "48.4 eV",
    "12.1 eV",
    "24.2 eV"
   ],
   "answer": 1,
   "why": "ΔE = 13.6 Z² (1/n₁² − 1/n₂²).",
   "x": 1
  },
  {
   "q": "For He⁺ (Z = 2), the photon emitted for n = 3 → 2 has an energy of:",
   "options": [
    "3.78 eV",
    "1.89 eV",
    "7.56 eV",
    "15.1 eV"
   ],
   "answer": 2,
   "why": "ΔE = 13.6 Z² (1/n₁² − 1/n₂²).",
   "x": 1
  },
  {
   "q": "For He⁺ (Z = 2), the photon emitted for n = 4 → 2 has an energy of:",
   "options": [
    "20.4 eV",
    "10.2 eV",
    "5.1 eV",
    "2.55 eV"
   ],
   "answer": 1,
   "why": "ΔE = 13.6 Z² (1/n₁² − 1/n₂²).",
   "x": 1
  },
  {
   "q": "For He⁺ (Z = 2), the photon emitted for n = 4 → 3 has an energy of:",
   "options": [
    "5.29 eV",
    "0.661 eV",
    "1.32 eV",
    "2.64 eV"
   ],
   "answer": 3,
   "why": "ΔE = 13.6 Z² (1/n₁² − 1/n₂²).",
   "x": 1
  },
  {
   "q": "For He⁺ (Z = 2), the photon emitted for n = 6 → 4 has an energy of:",
   "options": [
    "0.944 eV",
    "3.78 eV",
    "0.472 eV",
    "1.89 eV"
   ],
   "answer": 3,
   "why": "ΔE = 13.6 Z² (1/n₁² − 1/n₂²).",
   "x": 1
  },
  {
   "q": "Which hydrogen transition emits the more energetic photon: 2→1 or 3→2?",
   "options": [
    "2→1",
    "Both are equal",
    "3→2",
    "Neither emits"
   ],
   "answer": 0,
   "why": "Compare ΔE = 13.6 (1/n₁² − 1/n₂²); transitions ending on n = 1 are the most energetic.",
   "x": 1
  },
  {
   "q": "Which hydrogen transition emits the more energetic photon: 4→3 or 2→1?",
   "options": [
    "4→3",
    "Neither emits",
    "2→1",
    "Both are equal"
   ],
   "answer": 2,
   "why": "Compare ΔE = 13.6 (1/n₁² − 1/n₂²); transitions ending on n = 1 are the most energetic.",
   "x": 1
  },
  {
   "q": "Which hydrogen transition emits the more energetic photon: 3→1 or 4→2?",
   "options": [
    "3→1",
    "4→2",
    "Both are equal",
    "Neither emits"
   ],
   "answer": 0,
   "why": "Compare ΔE = 13.6 (1/n₁² − 1/n₂²); transitions ending on n = 1 are the most energetic.",
   "x": 1
  },
  {
   "q": "Which hydrogen transition emits the more energetic photon: 5→2 or 2→1?",
   "options": [
    "Neither emits",
    "Both are equal",
    "2→1",
    "5→2"
   ],
   "answer": 2,
   "why": "Compare ΔE = 13.6 (1/n₁² − 1/n₂²); transitions ending on n = 1 are the most energetic.",
   "x": 1
  },
  {
   "q": "The Rydberg constant for a hydrogen-like ion becomes:",
   "options": [
    "R_H / Z²",
    "Z² R_H",
    "R_H",
    "Z R_H"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "Bohr's model is valid for:",
   "options": [
    "One-electron systems",
    "All atoms",
    "Molecules",
    "Metals"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  }
 ],
 "cards": [
  {
   "id": "x0",
   "type": "text",
   "front": "Rutherford's model?",
   "back": "Tiny, dense, positive nucleus containing almost all the mass; electrons orbit it held by electrostatic attraction."
  },
  {
   "id": "x1",
   "type": "text",
   "front": "Why did Rutherford's model fail?",
   "back": "Accelerating (orbiting) electrons should radiate, spiral into the nucleus and give a continuous spectrum; hydrogen's spectrum is discrete and atoms are stable."
  },
  {
   "id": "x2",
   "type": "text",
   "front": "Planck-Einstein quantum relation?",
   "back": "ΔE = hν; absorption Ef = Ei + hν; emission Ef = Ei − hν."
  },
  {
   "id": "x3",
   "type": "text",
   "front": "Bohr's three postulates?",
   "back": "1) Stationary orbits with quantised energy. 2) Transitions absorb/emit |ΔE| = hν. 3) Angular momentum mvr = n·h/2π."
  },
  {
   "id": "x4",
   "type": "text",
   "front": "Energy levels of hydrogen?",
   "back": "Eₙ = −13.6/n² eV; n = 1 ground state; ionisation energy 13.6 eV."
  },
  {
   "id": "x5",
   "type": "text",
   "front": "Ritz formula and series?",
   "back": "1/λ = R_H (1/n₁² − 1/n₂²); Lyman n₁ = 1 (UV), Balmer n₁ = 2 (visible), Paschen, Brackett, Pfund (IR)."
  },
  {
   "id": "x6",
   "type": "text",
   "front": "Hydrogen-like ions?",
   "back": "One electron, Z > 1 (He⁺, Li²⁺, Be³⁺, B⁴⁺); Eₙ = −13.6 Z²/n² eV; R = Z² R_H."
  },
  {
   "id": "img-n1",
   "type": "image",
   "target": "n1",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Ground state. n = 1, lowest energy (−13.6 eV for hydrogen); the most stable state."
  },
  {
   "id": "img-n2",
   "type": "image",
   "target": "n2",
   "front": "What is at the arrow, and why does it matter?",
   "back": "First excited state. n = 2; Eₙ = −13.6/n² eV."
  },
  {
   "id": "img-n3",
   "type": "image",
   "target": "n3",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Higher levels. Levels crowd together as n increases."
  },
  {
   "id": "img-ninf",
   "type": "image",
   "target": "ninf",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Ionisation limit. At n = ∞ the electron is free (E = 0); ionisation energy of H = 13.6 eV."
  },
  {
   "id": "img-lyman",
   "type": "image",
   "target": "lyman",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Lyman series. Emission lines ending on n = 1, in the ultraviolet."
  },
  {
   "id": "img-balmer",
   "type": "image",
   "target": "balmer",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Balmer series. Lines ending on n = 2; the four visible lines seen in the discharge tube."
  }
 ],
 "deeper": [
  {
   "title": "Why line spectra prove quantised energy",
   "html": "<p>If an electron could have any energy, excited atoms would emit light of every wavelength, a continuous rainbow. Hydrogen emits only a few sharp colours, which means only certain energy differences are possible, so the electron's energy levels themselves are fixed. Bohr's model turned this observation into a theory.</p><p class='src'>Source: the lecture's emission spectrum and Bohr slides.</p>"
  },
  {
   "title": "Why energies are negative",
   "html": "<p>The zero of energy is chosen as the free electron at infinite distance (n = ∞). A bound electron has less energy than a free one, so its energy is negative; the deeper it sits (n = 1), the more negative. The ionisation energy, 13.6 eV for hydrogen, is the energy needed to bring it from −13.6 eV to 0.</p><p class='src'>Source: the lecture's hydrogen energy diagram.</p>"
  }
 ],
 "resources": [
  {
   "title": "The Bohr model (Khan Academy)",
   "url": "https://www.khanacademy.org/science/chemistry/electronic-structure-of-atoms/bohr-model-hydrogen/a/bohrs-model-of-hydrogen",
   "kind": "Article",
   "why": "Bohr's postulates and hydrogen energy levels.",
   "note": ""
  },
  {
   "title": "Hydrogen spectrum (Chemistry LibreTexts)",
   "url": "https://chem.libretexts.org/",
   "kind": "Website",
   "why": "Balmer, Lyman and Rydberg formula explained.",
   "note": ""
  }
 ],
 "checks": [],
 "sources": [
  {
   "name": "The Bohr model (Khan Academy)",
   "url": "https://www.khanacademy.org/science/chemistry/electronic-structure-of-atoms/bohr-model-hydrogen/a/bohrs-model-of-hydrogen"
  },
  {
   "name": "Hydrogen spectrum (Chemistry LibreTexts)",
   "url": "https://chem.libretexts.org/"
  }
 ],
 "verified": "22 Sep 2026"
};
window.SINA = window.SINA || {subjects:[], lectures:{}};
SINA.lectures["chem1-quantum"] = {
 "id": "chem1-quantum",
 "subject": "chem1",
 "group": "General chemistry",
 "title": "Quantum mechanics, quantum numbers and atomic orbitals",
 "sourceFile": "Lecture 3 - General Chemistry (2025-2026) (General Chemistry, Prof. Tarik Ouchbani)",
 "sourceUrl": "https://drive.google.com/file/d/1d_Qkg4r6EHEv_P0V2L9qrpEHGnnQWLyQ/view?usp=drivesdk",
 "buildNote": "<strong>Built from the lecture slides.</strong> Slides that only show pictures are covered in outline. If your professor says something different, trust your professor.",
 "summary": [
  {
   "id": "s0",
   "title": "The big picture",
   "html": "<p>Bohr's model works only for one-electron systems. <strong>Quantum mechanics</strong> replaces the idea of a trajectory with the <strong>probability of presence</strong> of the electron, described by a <strong>wave function ψ</strong> and four <strong>quantum numbers</strong>.</p>"
  },
  {
   "id": "s1",
   "title": "Wave-particle duality and uncertainty",
   "html": "<p><strong>De Broglie</strong>: matter such as an electron has both wave and particle character: <strong>λ = h / (m·v)</strong> (λ wavelength, h Planck's constant, m·v momentum). <strong>Heisenberg's uncertainty principle</strong>: position and speed cannot both be known precisely: <strong>Δx · Δp ≥ h/2π</strong> (Δp = m·Δv). So the electron's trajectory cannot be predicted: we speak of its <strong>probability of presence</strong> in a region around the nucleus.</p><p><strong>Schrödinger (1926)</strong> described electrons by a <strong>wave function ψ(x, y, z)</strong>; <strong>ψ²</strong> is proportional to the probability of finding the electron in a volume. The region where this probability is essentially certain is the <strong>atomic orbital</strong>.</p>"
  },
  {
   "id": "s2",
   "title": "Quantum numbers",
   "html": "<p><strong>n (principal)</strong>: integer ≥ 1; the <strong>shell</strong>; larger n = farther from the nucleus, larger atom, higher energy; n = 1 is the innermost shell (ground state); absorption raises n, emission lowers it. <strong>l (azimuthal, orbital angular momentum)</strong>: from <strong>0 to n − 1</strong>; gives the <strong>subshell shape</strong> and number of angular nodes: <strong>l = 0 → s, 1 → p, 2 → d, 3 → f</strong>. n = 2 gives 2s and 2p only (<strong>no 2d</strong>); n = 3 gives 3s, 3p, 3d. <strong>mₗ (magnetic)</strong>: from <strong>−l to +l</strong>; gives the <strong>orientation</strong> and the number of orbitals, <strong>2l + 1</strong> (s 1, p 3, d 5, f 7). <strong>mₛ (spin)</strong>: <strong>+½</strong> (↑, spin up) or <strong>−½</strong> (↓); independent of the others; determines magnetic behaviour.</p><p>Each orbital holds <strong>2 electrons</strong> of opposite spin, so a subshell holds 2(2l + 1): s 2, p 6, d 10, f 14. No two electrons of an atom can share all four quantum numbers: this is the <strong>Pauli exclusion principle</strong>. Worked example: n = 4 gives 4s (1 orbital, 2 e⁻), 4p (3, 6), 4d (5, 10), 4f (7, 14); l = 4 gives 9 orbitals with mₗ = −4 … +4.</p>"
  }
 ],
 "exam": [
  "De Broglie: λ = h / (m·v); matter has wave and particle character.",
  "Heisenberg: position and momentum cannot both be known exactly.",
  "Trajectory replaced by probability of presence.",
  "Schrödinger 1926: wave function ψ; ψ² ∝ probability; orbital.",
  "n: shell (≥ 1), size and energy.",
  "l: 0 to n−1; s, p, d, f; no 2d.",
  "mₗ: −l to +l; 2l + 1 orbitals.",
  "mₛ: +½ or −½.",
  "2 electrons per orbital: s 2, p 6, d 10, f 14.",
  "Pauli: no two electrons share all four numbers."
 ],
 "visual": {
  "kind": "model",
  "intro": "",
  "figure": {
   "viewBox": "0 0 760 420",
   "alt": "The four quantum numbers",
   "caption": "From shell to spin. Schematic drawn for this site.",
   "base": "<defs><marker id=\"ah\" markerWidth=\"10\" markerHeight=\"8\" refX=\"9\" refY=\"4\" orient=\"auto\"><path d=\"M0,0 L10,4 L0,8 Z\" fill=\"#8a8a8a\"/></marker></defs><line stroke=\"#8a8a8a\" stroke-width=\"2\" marker-end=\"url(#ah)\" x1=\"240\" y1=\"70\" x2=\"280\" y2=\"70\"/><line stroke=\"#8a8a8a\" stroke-width=\"2\" marker-end=\"url(#ah)\" x1=\"480\" y1=\"70\" x2=\"520\" y2=\"70\"/><line stroke=\"#8a8a8a\" stroke-width=\"2\" marker-end=\"url(#ah)\" x1=\"620\" y1=\"100\" x2=\"620\" y2=\"170\"/>",
   "parts": {
    "n": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#f2d7cf\" x=\"40\" y=\"40\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "n: shell (size, energy)",
      "n = 1, 2, 3…"
     ],
     "lx": 140.0,
     "ly": 68.0
    },
    "l": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#cfe3f2\" x=\"280\" y=\"40\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "l: subshell shape",
      "0 to n−1 (s, p, d, f)"
     ],
     "lx": 380.0,
     "ly": 68.0
    },
    "ml": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#d7edd2\" x=\"520\" y=\"40\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "mₗ: orientation",
      "−l to +l (2l+1 orbitals)"
     ],
     "lx": 620.0,
     "ly": 68.0
    },
    "ms": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#f2e2a8\" x=\"520\" y=\"170\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "mₛ: spin",
      "+½ (↑) or −½ (↓)"
     ],
     "lx": 620.0,
     "ly": 198.0
    },
    "orb": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#e3d5f0\" x=\"280\" y=\"170\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "Orbital: region where",
      "ψ² gives the electron"
     ],
     "lx": 380.0,
     "ly": 198.0
    },
    "pauli": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#f7d9b8\" x=\"40\" y=\"170\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "No two electrons share",
      "all four numbers"
     ],
     "lx": 140.0,
     "ly": 198.0
    }
   },
   "arrows": {
    "n": [
     {
      "t": [
       40.0,
       48.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "l": [
     {
      "t": [
       280.0,
       48.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "ml": [
     {
      "t": [
       520.0,
       48.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "ms": [
     {
      "t": [
       520.0,
       178.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "orb": [
     {
      "t": [
       280.0,
       178.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "pauli": [
     {
      "t": [
       40.0,
       178.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ]
   }
  },
  "mindmap": {
   "root": "Quantum model",
   "branches": [
    [
     "Foundations",
     [
      "De Broglie λ = h/mv",
      "Heisenberg uncertainty",
      "Schrödinger ψ, ψ²"
     ]
    ],
    [
     "Quantum numbers",
     [
      "n: shell",
      "l: 0 to n−1 (s p d f)",
      "mₗ: −l to +l",
      "mₛ: ±½"
     ]
    ],
    [
     "Capacity",
     [
      "2l + 1 orbitals",
      "2 e⁻ per orbital",
      "s 2, p 6, d 10, f 14"
     ]
    ],
    [
     "Rules",
     [
      "No 2d orbital",
      "Pauli exclusion"
     ]
    ]
   ]
  }
 },
 "mcqs": [
  {
   "q": "De Broglie's relation is:",
   "options": [
    "E = hν",
    "ΔE = Δm·c²",
    "E = −13.6/n²",
    "λ = h / (m·v)"
   ],
   "answer": 3,
   "why": "Matter waves.",
   "slides": [
    {
     "src": "files/slides/chem1-quantum/02.jpg",
     "lec": "Quantum mechanics, quantum numbers",
     "n": 2
    }
   ]
  },
  {
   "q": "Heisenberg's principle states that we cannot know precisely both:",
   "options": [
    "Mass and charge",
    "Z and A",
    "Position and speed (momentum)",
    "Energy and time only"
   ],
   "answer": 2,
   "why": "Δx·Δp ≥ h/2π.",
   "slides": [
    {
     "src": "files/slides/chem1-quantum/02.jpg",
     "lec": "Quantum mechanics, quantum numbers",
     "n": 2
    },
    {
     "src": "files/slides/chem1-quantum/03.jpg",
     "lec": "Quantum mechanics, quantum numbers",
     "n": 3
    }
   ]
  },
  {
   "q": "In quantum mechanics, the electron's trajectory is replaced by:",
   "options": [
    "A fixed orbit",
    "A straight line",
    "The nucleus",
    "A probability of presence"
   ],
   "answer": 3,
   "why": "Described by ψ.",
   "slides": [
    {
     "src": "files/slides/chem1-quantum/03.jpg",
     "lec": "Quantum mechanics, quantum numbers",
     "n": 3
    }
   ]
  },
  {
   "q": "ψ² is proportional to:",
   "options": [
    "The electron's mass",
    "The energy",
    "Presence probability",
    "The nuclear charge"
   ],
   "answer": 2,
   "why": "It defines the orbital.",
   "slides": [
    {
     "src": "files/slides/chem1-quantum/04.jpg",
     "lec": "Quantum mechanics, quantum numbers",
     "n": 4
    }
   ]
  },
  {
   "q": "The principal quantum number n can be:",
   "options": [
    "Any integer ≥ 1",
    "0",
    "Negative",
    "Half-integer"
   ],
   "answer": 0,
   "why": "n = 1 is the innermost shell.",
   "slides": [
    {
     "src": "files/slides/chem1-quantum/06.jpg",
     "lec": "Quantum mechanics, quantum numbers",
     "n": 6
    }
   ]
  },
  {
   "q": "For n = 3, the possible l values are:",
   "options": [
    "0 to 3",
    "0, 1, 2",
    "Only 0",
    "1, 2, 3"
   ],
   "answer": 1,
   "why": "3s, 3p, 3d.",
   "slides": [
    {
     "src": "files/slides/chem1-quantum/09.jpg",
     "lec": "Quantum mechanics, quantum numbers",
     "n": 9
    },
    {
     "src": "files/slides/chem1-quantum/13.jpg",
     "lec": "Quantum mechanics, quantum numbers",
     "n": 13
    }
   ]
  },
  {
   "q": "Which subshell does not exist?",
   "options": [
    "3d",
    "2d",
    "2p",
    "4f"
   ],
   "answer": 1,
   "why": "l must be less than n."
  },
  {
   "q": "l = 2 corresponds to which subshell?",
   "options": [
    "s",
    "f",
    "p",
    "d"
   ],
   "answer": 3,
   "why": "l = 0 s, 1 p, 3 f."
  },
  {
   "q": "For l = 3, mₗ can take:",
   "options": [
    "±½",
    "−3 to +3 (7 values)",
    "0 to 3",
    "1 to 7"
   ],
   "answer": 1,
   "why": "2l + 1 = 7 orbitals.",
   "slides": [
    {
     "src": "files/slides/chem1-quantum/17.jpg",
     "lec": "Quantum mechanics, quantum numbers",
     "n": 17
    }
   ]
  },
  {
   "q": "How many orbitals are in a d subshell?",
   "options": [
    "5",
    "3",
    "1",
    "7"
   ],
   "answer": 0,
   "why": "2l + 1 with l = 2.",
   "slides": [
    {
     "src": "files/slides/chem1-quantum/17.jpg",
     "lec": "Quantum mechanics, quantum numbers",
     "n": 17
    }
   ]
  },
  {
   "q": "How many electrons can the 4f subshell hold?",
   "options": [
    "14",
    "7",
    "10",
    "18"
   ],
   "answer": 0,
   "why": "7 orbitals × 2.",
   "slides": [
    {
     "src": "files/slides/chem1-quantum/17.jpg",
     "lec": "Quantum mechanics, quantum numbers",
     "n": 17
    }
   ]
  },
  {
   "q": "The spin quantum number can be:",
   "options": [
    "0 or 1",
    "−l to +l",
    "Any integer",
    "+½ or −½"
   ],
   "answer": 3,
   "why": "Spin up or down.",
   "slides": [
    {
     "src": "files/slides/chem1-quantum/15.jpg",
     "lec": "Quantum mechanics, quantum numbers",
     "n": 15
    }
   ]
  },
  {
   "q": "How many orbitals are there for l = 4?",
   "options": [
    "16",
    "4",
    "8",
    "9"
   ],
   "answer": 3,
   "why": "(2×4) + 1.",
   "slides": [
    {
     "src": "files/slides/chem1-quantum/17.jpg",
     "lec": "Quantum mechanics, quantum numbers",
     "n": 17
    }
   ]
  },
  {
   "q": "The rule that no two electrons in an atom share all four quantum numbers is:",
   "options": [
    "The Pauli exclusion principle",
    "Hund's rule",
    "De Broglie's relation",
    "Heisenberg's principle"
   ],
   "answer": 0,
   "why": "Hence max 2 electrons of opposite spin per orbital.",
   "slides": [
    {
     "src": "files/slides/chem1-quantum/05.jpg",
     "lec": "Quantum mechanics, quantum numbers",
     "n": 5
    }
   ]
  },
  {
   "q": "Which element is at the arrow?",
   "target": "n",
   "options": [
    "Spin number mₛ",
    "Principal quantum number n",
    "Magnetic number mₗ",
    "Azimuthal number l"
   ],
   "answer": 1,
   "why": "The arrow points to: Principal quantum number n. Positive integer ≥ 1; larger n = farther from nucleus, bigger atom, higher energy; n = 1 is the innermost shell."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "l",
   "options": [
    "Orbital",
    "Spin number mₛ",
    "Azimuthal number l",
    "Principal quantum number n"
   ],
   "answer": 2,
   "why": "The arrow points to: Azimuthal number l. 0 to n−1: l = 0 s, 1 p, 2 d, 3 f; sets orbital shape and number of angular nodes."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "ml",
   "options": [
    "Spin number mₛ",
    "Azimuthal number l",
    "Magnetic number mₗ",
    "Orbital"
   ],
   "answer": 2,
   "why": "The arrow points to: Magnetic number mₗ. From −l to +l: gives orbital orientation and number of orbitals (2l + 1) in a subshell."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "ms",
   "options": [
    "Azimuthal number l",
    "Spin number mₛ",
    "Magnetic number mₗ",
    "Orbital"
   ],
   "answer": 1,
   "why": "The arrow points to: Spin number mₛ. +½ (spin up) or −½ (spin down); independent of n, l, mₗ."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "orb",
   "options": [
    "Orbital",
    "Magnetic number mₗ",
    "Spin number mₛ",
    "Exclusion"
   ],
   "answer": 0,
   "why": "The arrow points to: Orbital. ψ² is proportional to the probability of finding the electron; the orbital is the volume where it is found."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "pauli",
   "options": [
    "Magnetic number mₗ",
    "Spin number mₛ",
    "Exclusion",
    "Principal quantum number n"
   ],
   "answer": 2,
   "why": "The arrow points to: Exclusion. Each orbital holds at most 2 electrons of opposite spin (Pauli exclusion principle)."
  },
  {
   "q": "For n = 1, the possible values of l are:",
   "options": [
    "0",
    "1",
    "0, 1, 2, 3",
    "0, 1"
   ],
   "answer": 0,
   "why": "l goes from 0 to n − 1.",
   "x": 1
  },
  {
   "q": "For n = 2, the possible values of l are:",
   "options": [
    "0, 1, 2",
    "1, 2",
    "0, 1",
    "0, 1, 2, 3"
   ],
   "answer": 2,
   "why": "l goes from 0 to n − 1.",
   "x": 1
  },
  {
   "q": "For n = 3, the possible values of l are:",
   "options": [
    "1, 2, 3",
    "0, 1",
    "0, 1, 2, 3",
    "0, 1, 2"
   ],
   "answer": 3,
   "why": "l goes from 0 to n − 1.",
   "x": 1
  },
  {
   "q": "For n = 4, the possible values of l are:",
   "options": [
    "0, 1, 2, 3, 4",
    "1, 2, 3, 4",
    "0, 1, 2, 3",
    "0, 1, 2"
   ],
   "answer": 2,
   "why": "l goes from 0 to n − 1.",
   "x": 1
  },
  {
   "q": "For n = 5, the possible values of l are:",
   "options": [
    "0, 1, 2, 3, 4, 5",
    "1, 2, 3, 4, 5",
    "0, 1, 2, 3",
    "0, 1, 2, 3, 4"
   ],
   "answer": 3,
   "why": "l goes from 0 to n − 1.",
   "x": 1
  },
  {
   "q": "For l = 0 (s subshell), the possible values of mₗ are:",
   "options": [
    "1",
    "−1, 0, 1",
    "3",
    "0"
   ],
   "answer": 3,
   "why": "mₗ goes from −l to +l.",
   "x": 1
  },
  {
   "q": "For l = 1 (p subshell), the possible values of mₗ are:",
   "options": [
    "0, 1",
    "1, 2, 3",
    "−2, −1, 0, 1, 2",
    "−1, 0, 1"
   ],
   "answer": 3,
   "why": "mₗ goes from −l to +l.",
   "x": 1
  },
  {
   "q": "For l = 2 (d subshell), the possible values of mₗ are:",
   "options": [
    "0, 1, 2",
    "−3, −2, −1, 0, 1, 2, 3",
    "−2, −1, 0, 1, 2",
    "1, 2, 3, 4, 5"
   ],
   "answer": 2,
   "why": "mₗ goes from −l to +l.",
   "x": 1
  },
  {
   "q": "For l = 3 (f subshell), the possible values of mₗ are:",
   "options": [
    "0, 1, 2, 3",
    "1, 2, 3, 4, 5, 6, 7",
    "−4, −3, −2, −1, 0, 1, 2, 3, 4",
    "−3, −2, −1, 0, 1, 2, 3"
   ],
   "answer": 3,
   "why": "mₗ goes from −l to +l.",
   "x": 1
  },
  {
   "q": "How many orbitals does the shell n = 1 contain?",
   "options": [
    "2",
    "1",
    "4",
    "0"
   ],
   "answer": 1,
   "why": "n² orbitals.",
   "x": 1
  },
  {
   "q": "What is the maximum number of electrons in the shell n = 1?",
   "options": [
    "1",
    "8",
    "3",
    "2"
   ],
   "answer": 3,
   "why": "2n² electrons.",
   "x": 1
  },
  {
   "q": "How many orbitals does the shell n = 2 contain?",
   "options": [
    "3",
    "2",
    "8",
    "4"
   ],
   "answer": 3,
   "why": "n² orbitals.",
   "x": 1
  },
  {
   "q": "What is the maximum number of electrons in the shell n = 2?",
   "options": [
    "4",
    "6",
    "9",
    "8"
   ],
   "answer": 3,
   "why": "2n² electrons.",
   "x": 1
  },
  {
   "q": "How many orbitals does the shell n = 3 contain?",
   "options": [
    "18",
    "5",
    "9",
    "3"
   ],
   "answer": 2,
   "why": "n² orbitals.",
   "x": 1
  },
  {
   "q": "What is the maximum number of electrons in the shell n = 3?",
   "options": [
    "18",
    "8",
    "6",
    "9"
   ],
   "answer": 0,
   "why": "2n² electrons.",
   "x": 1
  },
  {
   "q": "How many orbitals does the shell n = 4 contain?",
   "options": [
    "7",
    "4",
    "32",
    "16"
   ],
   "answer": 3,
   "why": "n² orbitals.",
   "x": 1
  },
  {
   "q": "What is the maximum number of electrons in the shell n = 4?",
   "options": [
    "33",
    "8",
    "32",
    "16"
   ],
   "answer": 2,
   "why": "2n² electrons.",
   "x": 1
  },
  {
   "q": "How many orbitals does the shell n = 5 contain?",
   "options": [
    "5",
    "50",
    "25",
    "9"
   ],
   "answer": 2,
   "why": "n² orbitals.",
   "x": 1
  },
  {
   "q": "What is the maximum number of electrons in the shell n = 5?",
   "options": [
    "25",
    "10",
    "8",
    "50"
   ],
   "answer": 3,
   "why": "2n² electrons.",
   "x": 1
  },
  {
   "q": "The subshell with n = 1 and l = 0 is:",
   "options": [
    "1s",
    "1p",
    "2s",
    "Cannot be determined"
   ],
   "answer": 0,
   "why": "l = 0 is s.",
   "x": 1
  },
  {
   "q": "The subshell with n = 2 and l = 0 is:",
   "options": [
    "3s",
    "1s",
    "2p",
    "2s"
   ],
   "answer": 3,
   "why": "l = 0 is s.",
   "x": 1
  },
  {
   "q": "The subshell with n = 2 and l = 1 is:",
   "options": [
    "2d",
    "1p",
    "1d",
    "2p"
   ],
   "answer": 3,
   "why": "l = 1 is p.",
   "x": 1
  },
  {
   "q": "The subshell with n = 3 and l = 0 is:",
   "options": [
    "3p",
    "3s",
    "2s",
    "4s"
   ],
   "answer": 1,
   "why": "l = 0 is s.",
   "x": 1
  },
  {
   "q": "The subshell with n = 3 and l = 1 is:",
   "options": [
    "2p",
    "1f",
    "3d",
    "3p"
   ],
   "answer": 3,
   "why": "l = 1 is p.",
   "x": 1
  },
  {
   "q": "The subshell with n = 3 and l = 2 is:",
   "options": [
    "2f",
    "3f",
    "2d",
    "3d"
   ],
   "answer": 3,
   "why": "l = 2 is d.",
   "x": 1
  },
  {
   "q": "The subshell with n = 4 and l = 0 is:",
   "options": [
    "3s",
    "4s",
    "5s",
    "4p"
   ],
   "answer": 1,
   "why": "l = 0 is s.",
   "x": 1
  },
  {
   "q": "The subshell with n = 4 and l = 1 is:",
   "options": [
    "1s",
    "4d",
    "3p",
    "4p"
   ],
   "answer": 3,
   "why": "l = 1 is p.",
   "x": 1
  },
  {
   "q": "The subshell with n = 4 and l = 2 is:",
   "options": [
    "2s",
    "4d",
    "4f",
    "3d"
   ],
   "answer": 1,
   "why": "l = 2 is d.",
   "x": 1
  },
  {
   "q": "The subshell with n = 4 and l = 3 is:",
   "options": [
    "4s",
    "3f",
    "4f",
    "3s"
   ],
   "answer": 2,
   "why": "l = 3 is f.",
   "x": 1
  },
  {
   "q": "The subshell with n = 5 and l = 2 is:",
   "options": [
    "2p",
    "5d",
    "5f",
    "4d"
   ],
   "answer": 1,
   "why": "l = 2 is d.",
   "x": 1
  },
  {
   "q": "The subshell with n = 5 and l = 3 is:",
   "options": [
    "3p",
    "4f",
    "5f",
    "5s"
   ],
   "answer": 2,
   "why": "l = 3 is f.",
   "x": 1
  },
  {
   "q": "Is the set (n = 2, l = 1, mₗ = 0, mₛ = +½) allowed?",
   "options": [
    "No",
    "Yes",
    "Only in an excited state",
    "Only for hydrogen"
   ],
   "answer": 1,
   "why": "Allowed: 0 ≤ l ≤ n − 1 and −l ≤ mₗ ≤ +l.",
   "x": 1
  },
  {
   "q": "Is the set (n = 1, l = 0, mₗ = 0, mₛ = −½) allowed?",
   "options": [
    "No",
    "Only in an excited state",
    "Only for hydrogen",
    "Yes"
   ],
   "answer": 3,
   "why": "Allowed: 0 ≤ l ≤ n − 1 and −l ≤ mₗ ≤ +l.",
   "x": 1
  },
  {
   "q": "Is the set (n = 3, l = 2, mₗ = −2, mₛ = +½) allowed?",
   "options": [
    "No",
    "Yes",
    "Only for hydrogen",
    "Only in an excited state"
   ],
   "answer": 1,
   "why": "Allowed: 0 ≤ l ≤ n − 1 and −l ≤ mₗ ≤ +l.",
   "x": 1
  },
  {
   "q": "Is the set (n = 4, l = 3, mₗ = 3, mₛ = −½) allowed?",
   "options": [
    "No",
    "Only for hydrogen",
    "Yes",
    "Only in an excited state"
   ],
   "answer": 2,
   "why": "Allowed: 0 ≤ l ≤ n − 1 and −l ≤ mₗ ≤ +l.",
   "x": 1
  },
  {
   "q": "Is the set (n = 3, l = 1, mₗ = −1, mₛ = +½) allowed?",
   "options": [
    "Only in an excited state",
    "No",
    "Yes",
    "Only for hydrogen"
   ],
   "answer": 2,
   "why": "Allowed: 0 ≤ l ≤ n − 1 and −l ≤ mₗ ≤ +l.",
   "x": 1
  },
  {
   "q": "Is the set (n = 2, l = 0, mₗ = 0, mₛ = +½) allowed?",
   "options": [
    "Only in an excited state",
    "Yes",
    "Only for hydrogen",
    "No"
   ],
   "answer": 1,
   "why": "Allowed: 0 ≤ l ≤ n − 1 and −l ≤ mₗ ≤ +l.",
   "x": 1
  },
  {
   "q": "Is the set (n = 2, l = 2, mₗ = 0, mₛ = +½) allowed?",
   "options": [
    "No",
    "Only for hydrogen",
    "Only in an excited state",
    "Yes"
   ],
   "answer": 0,
   "why": "Not allowed: l must be ≤ n − 1.",
   "x": 1
  },
  {
   "q": "Is the set (n = 1, l = 1, mₗ = 0, mₛ = +½) allowed?",
   "options": [
    "No",
    "Yes",
    "Only in an excited state",
    "Only for hydrogen"
   ],
   "answer": 0,
   "why": "Not allowed: l must be ≤ n − 1.",
   "x": 1
  },
  {
   "q": "Is the set (n = 3, l = 1, mₗ = 2, mₛ = −½) allowed?",
   "options": [
    "Only in an excited state",
    "No",
    "Only for hydrogen",
    "Yes"
   ],
   "answer": 1,
   "why": "Not allowed: mₗ must lie between −l and +l.",
   "x": 1
  },
  {
   "q": "Is the set (n = 2, l = 1, mₗ = −2, mₛ = +½) allowed?",
   "options": [
    "Only in an excited state",
    "Yes",
    "No",
    "Only for hydrogen"
   ],
   "answer": 2,
   "why": "Not allowed: mₗ must lie between −l and +l.",
   "x": 1
  },
  {
   "q": "Is the set (n = 3, l = 3, mₗ = 0, mₛ = +½) allowed?",
   "options": [
    "No",
    "Only in an excited state",
    "Yes",
    "Only for hydrogen"
   ],
   "answer": 0,
   "why": "Not allowed: l must be ≤ n − 1.",
   "x": 1
  },
  {
   "q": "Is the set (n = 4, l = 2, mₗ = 3, mₛ = −½) allowed?",
   "options": [
    "Yes",
    "No",
    "Only for hydrogen",
    "Only in an excited state"
   ],
   "answer": 1,
   "why": "Not allowed: mₗ must lie between −l and +l.",
   "x": 1
  },
  {
   "q": "Is the set (n = 0, l = 0, mₗ = 0, mₛ = +½) allowed?",
   "options": [
    "Only for hydrogen",
    "Yes",
    "No",
    "Only in an excited state"
   ],
   "answer": 2,
   "why": "n must be at least 1.",
   "x": 1
  },
  {
   "q": "Is the set (n = 3, l = 0, mₗ = 1, mₛ = +½) allowed?",
   "options": [
    "Only for hydrogen",
    "Only in an excited state",
    "No",
    "Yes"
   ],
   "answer": 2,
   "why": "Not allowed: mₗ must lie between −l and +l.",
   "x": 1
  },
  {
   "q": "How many electrons can a s subshell hold at most?",
   "options": [
    "2",
    "1",
    "4",
    "6"
   ],
   "answer": 0,
   "why": "2(2l + 1).",
   "x": 1
  },
  {
   "q": "How many electrons can a p subshell hold at most?",
   "options": [
    "6",
    "10",
    "8",
    "3"
   ],
   "answer": 0,
   "why": "2(2l + 1).",
   "x": 1
  },
  {
   "q": "How many electrons can a d subshell hold at most?",
   "options": [
    "10",
    "14",
    "5",
    "12"
   ],
   "answer": 0,
   "why": "2(2l + 1).",
   "x": 1
  },
  {
   "q": "How many electrons can a f subshell hold at most?",
   "options": [
    "14",
    "18",
    "7",
    "16"
   ],
   "answer": 0,
   "why": "2(2l + 1).",
   "x": 1
  },
  {
   "q": "De Broglie associates with a moving particle a wavelength:",
   "options": [
    "λ = m·v / h",
    "λ = c / h",
    "λ = h·ν",
    "λ = h / (m·v)"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "The square of the wave function ψ² is proportional to:",
   "options": [
    "The probability of finding the electron",
    "The energy",
    "The electron's charge",
    "The orbit radius"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "The region where finding the electron is almost certain is called:",
   "options": [
    "A shell",
    "An atomic orbital",
    "A nucleus",
    "An orbit"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "The principal quantum number n describes:",
   "options": [
    "The shape only",
    "The orientation",
    "The spin",
    "The shell (size and energy)"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "The azimuthal quantum number l describes:",
   "options": [
    "The subshell shape",
    "The shell",
    "The orientation",
    "The spin"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "The magnetic quantum number mₗ gives:",
   "options": [
    "The energy level",
    "The spin",
    "The shape",
    "The orientation and number of orbitals"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "The spin quantum number mₛ can be:",
   "options": [
    "Any integer",
    "0 or 1",
    "−1, 0 or +1",
    "+½ or −½"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "Schrödinger described electrons by:",
   "options": [
    "A wave function ψ(x, y, z)",
    "Planck's constant only",
    "Fixed orbits",
    "The Rydberg formula"
   ],
   "answer": 0,
   "why": "1926.",
   "x": 1
  },
  {
   "q": "Heisenberg's uncertainty principle is written:",
   "options": [
    "Δx · Δp ≥ h/2π",
    "λ = h/mv",
    "E = hν",
    "mvr = nh/2π"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "Why is there no 2d subshell?",
   "options": [
    "Because n must be odd",
    "Because l can only go up to n − 1 = 1",
    "Because d needs 10 electrons",
    "Because 2d is too high in energy"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "How many orbitals does a s subshell contain?",
   "options": [
    "1",
    "3",
    "0",
    "2"
   ],
   "answer": 0,
   "why": "2l + 1 orbitals.",
   "x": 1
  },
  {
   "q": "How many orbitals does a p subshell contain?",
   "options": [
    "6",
    "2",
    "5",
    "3"
   ],
   "answer": 3,
   "why": "2l + 1 orbitals.",
   "x": 1
  },
  {
   "q": "How many orbitals does a d subshell contain?",
   "options": [
    "10",
    "3",
    "5",
    "7"
   ],
   "answer": 2,
   "why": "2l + 1 orbitals.",
   "x": 1
  },
  {
   "q": "How many orbitals does a f subshell contain?",
   "options": [
    "14",
    "9",
    "7",
    "4"
   ],
   "answer": 2,
   "why": "2l + 1 orbitals.",
   "x": 1
  },
  {
   "q": "What is the maximum number of electrons with n = 2 and l = 1?",
   "options": [
    "3",
    "6",
    "8",
    "7"
   ],
   "answer": 1,
   "why": "2(2l + 1).",
   "x": 1
  },
  {
   "q": "What is the maximum number of electrons with n = 3 and l = 2?",
   "options": [
    "18",
    "11",
    "10",
    "5"
   ],
   "answer": 2,
   "why": "2(2l + 1).",
   "x": 1
  },
  {
   "q": "What is the maximum number of electrons with n = 4 and l = 3?",
   "options": [
    "15",
    "14",
    "7",
    "32"
   ],
   "answer": 1,
   "why": "2(2l + 1).",
   "x": 1
  },
  {
   "q": "What is the maximum number of electrons with n = 3 and l = 1?",
   "options": [
    "6",
    "3",
    "18",
    "4"
   ],
   "answer": 0,
   "why": "2(2l + 1).",
   "x": 1
  },
  {
   "q": "What is the maximum number of electrons with n = 4 and l = 0?",
   "options": [
    "32",
    "2",
    "1",
    "4"
   ],
   "answer": 1,
   "why": "2(2l + 1).",
   "x": 1
  },
  {
   "q": "What is the maximum number of electrons with n = 5 and l = 1?",
   "options": [
    "7",
    "50",
    "3",
    "6"
   ],
   "answer": 3,
   "why": "2(2l + 1).",
   "x": 1
  },
  {
   "q": "How many electrons can have n = 2 and mₛ = +½?",
   "options": [
    "2",
    "8",
    "5",
    "4"
   ],
   "answer": 3,
   "why": "One per orbital: n² orbitals.",
   "x": 1
  },
  {
   "q": "How many electrons can have n = 3 and mₛ = +½?",
   "options": [
    "18",
    "10",
    "3",
    "9"
   ],
   "answer": 3,
   "why": "One per orbital: n² orbitals.",
   "x": 1
  },
  {
   "q": "How many electrons can have n = 4 and mₛ = +½?",
   "options": [
    "17",
    "4",
    "32",
    "16"
   ],
   "answer": 3,
   "why": "One per orbital: n² orbitals.",
   "x": 1
  },
  {
   "q": "Is the set (n = 5, l = 4, mₗ = −4, mₛ = +½) allowed?",
   "options": [
    "Only for hydrogen",
    "Only in an excited state",
    "No",
    "Yes"
   ],
   "answer": 3,
   "why": "Allowed.",
   "x": 1
  },
  {
   "q": "Is the set (n = 2, l = 1, mₗ = 1, mₛ = −½) allowed?",
   "options": [
    "No",
    "Yes",
    "Only for hydrogen",
    "Only in an excited state"
   ],
   "answer": 1,
   "why": "Allowed.",
   "x": 1
  },
  {
   "q": "Is the set (n = 4, l = 1, mₗ = 0, mₛ = +½) allowed?",
   "options": [
    "Only in an excited state",
    "Only for hydrogen",
    "Yes",
    "No"
   ],
   "answer": 2,
   "why": "Allowed.",
   "x": 1
  },
  {
   "q": "Is the set (n = 3, l = 2, mₗ = 3, mₛ = +½) allowed?",
   "options": [
    "Yes",
    "Only in an excited state",
    "No",
    "Only for hydrogen"
   ],
   "answer": 2,
   "why": "mₗ must be between −l and +l.",
   "x": 1
  },
  {
   "q": "Is the set (n = 5, l = 5, mₗ = 0, mₛ = −½) allowed?",
   "options": [
    "Only for hydrogen",
    "Yes",
    "Only in an excited state",
    "No"
   ],
   "answer": 3,
   "why": "l must be ≤ n − 1.",
   "x": 1
  },
  {
   "q": "Is the set (n = 2, l = 1, mₗ = 0, mₛ = +1) allowed?",
   "options": [
    "Only for hydrogen",
    "No",
    "Only in an excited state",
    "Yes"
   ],
   "answer": 1,
   "why": "mₛ can only be ±½.",
   "x": 1
  },
  {
   "q": "How many angular nodes does an orbital with l = 0 have?",
   "options": [
    "0",
    "5",
    "3",
    "1"
   ],
   "answer": 0,
   "why": "The number of angular nodes equals l.",
   "x": 1
  },
  {
   "q": "How many angular nodes does an orbital with l = 1 have?",
   "options": [
    "1",
    "2",
    "0",
    "3"
   ],
   "answer": 0,
   "why": "The number of angular nodes equals l.",
   "x": 1
  },
  {
   "q": "How many angular nodes does an orbital with l = 2 have?",
   "options": [
    "1",
    "3",
    "5",
    "2"
   ],
   "answer": 3,
   "why": "The number of angular nodes equals l.",
   "x": 1
  },
  {
   "q": "How many angular nodes does an orbital with l = 3 have?",
   "options": [
    "2",
    "7",
    "3",
    "4"
   ],
   "answer": 2,
   "why": "The number of angular nodes equals l.",
   "x": 1
  },
  {
   "q": "Two electrons in the same orbital must differ in:",
   "options": [
    "n",
    "mₗ",
    "l",
    "mₛ (spin)"
   ],
   "answer": 3,
   "why": "Pauli exclusion principle.",
   "x": 1
  },
  {
   "q": "The number of subshells in shell n is:",
   "options": [
    "2n²",
    "n − 1",
    "n²",
    "n"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "As n increases, the electron is:",
   "options": [
    "Farther from the nucleus with higher energy",
    "Closer to the nucleus",
    "Unchanged",
    "Lower in energy"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "Absorption of energy by an electron raises:",
   "options": [
    "n",
    "A",
    "mₛ",
    "Z"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "The number of orbitals in a subshell is:",
   "options": [
    "2l + 1",
    "l + 1",
    "n²",
    "2l"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "Quantum mechanics replaced the idea of a trajectory with:",
   "options": [
    "Fixed circular orbits",
    "The probability of presence of the electron",
    "Electron clouds of fixed shape and path",
    "Elliptical orbits"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "Which quantum number determines the magnetic behaviour of an electron?",
   "options": [
    "n",
    "l",
    "mₛ (spin)",
    "mₗ only"
   ],
   "answer": 2,
   "why": "",
   "x": 1
  }
 ],
 "cards": [
  {
   "id": "x0",
   "type": "text",
   "front": "De Broglie relation?",
   "back": "λ = h / (m·v): matter (e.g. an electron) has an associated wavelength."
  },
  {
   "id": "x1",
   "type": "text",
   "front": "Heisenberg uncertainty principle?",
   "back": "Position and momentum cannot both be known exactly: Δx·Δp ≥ h/2π; hence probability of presence, not trajectory."
  },
  {
   "id": "x2",
   "type": "text",
   "front": "Wave function and orbital?",
   "back": "Schrödinger (1926): ψ(x, y, z) describes the electron; ψ² ∝ probability of presence; the orbital is where the electron is found."
  },
  {
   "id": "x3",
   "type": "text",
   "front": "Principal quantum number n?",
   "back": "Integer ≥ 1; shell; larger n = farther from nucleus, larger size, higher energy."
  },
  {
   "id": "x4",
   "type": "text",
   "front": "Azimuthal quantum number l?",
   "back": "0 to n − 1; subshell shape: 0 s, 1 p, 2 d, 3 f."
  },
  {
   "id": "x5",
   "type": "text",
   "front": "Magnetic quantum number mₗ?",
   "back": "−l to +l; orbital orientation; 2l + 1 orbitals per subshell."
  },
  {
   "id": "x6",
   "type": "text",
   "front": "Spin quantum number mₛ?",
   "back": "+½ (↑) or −½ (↓), independent of n, l, mₗ."
  },
  {
   "id": "x7",
   "type": "text",
   "front": "Capacity of subshells?",
   "back": "2 electrons per orbital: s 2, p 6, d 10, f 14; n = 4 has 4s, 4p, 4d, 4f."
  },
  {
   "id": "img-n",
   "type": "image",
   "target": "n",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Principal quantum number n. Positive integer ≥ 1; larger n = farther from nucleus, bigger atom, higher energy; n = 1 is the innermost shell."
  },
  {
   "id": "img-l",
   "type": "image",
   "target": "l",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Azimuthal number l. 0 to n−1: l = 0 s, 1 p, 2 d, 3 f; sets orbital shape and number of angular nodes."
  },
  {
   "id": "img-ml",
   "type": "image",
   "target": "ml",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Magnetic number mₗ. From −l to +l: gives orbital orientation and number of orbitals (2l + 1) in a subshell."
  },
  {
   "id": "img-ms",
   "type": "image",
   "target": "ms",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Spin number mₛ. +½ (spin up) or −½ (spin down); independent of n, l, mₗ."
  },
  {
   "id": "img-orb",
   "type": "image",
   "target": "orb",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Orbital. ψ² is proportional to the probability of finding the electron; the orbital is the volume where it is found."
  },
  {
   "id": "img-pauli",
   "type": "image",
   "target": "pauli",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Exclusion. Each orbital holds at most 2 electrons of opposite spin (Pauli exclusion principle)."
  }
 ],
 "deeper": [
  {
   "title": "Why an electron has no path",
   "html": "<p>To trace a path you need position and speed at every instant. Heisenberg showed that for a particle as light as an electron, measuring one precisely disturbs the other, so both can never be known together. Chemists therefore describe where an electron is likely to be, the orbital, rather than where it goes.</p><p class='src'>Source: the lecture's uncertainty principle and probability slides.</p>"
  },
  {
   "title": "Why there is no 2d orbital",
   "html": "<p>The azimuthal number l can only go up to n − 1. For the second shell (n = 2), l can be 0 or 1, so only 2s and 2p exist. d orbitals (l = 2) first appear in the third shell. This rule explains the shape of the periodic table: its blocks follow the subshells available at each n.</p><p class='src'>Source: the lecture's azimuthal quantum number slides.</p>"
  }
 ],
 "resources": [
  {
   "title": "Quantum numbers (Chemistry LibreTexts)",
   "url": "https://chem.libretexts.org/",
   "kind": "Website",
   "why": "Search 'quantum numbers' for worked examples.",
   "note": ""
  },
  {
   "title": "Electron configurations and orbitals (Khan Academy)",
   "url": "https://www.khanacademy.org/science/chemistry/electronic-structure-of-atoms",
   "kind": "Website",
   "why": "Orbitals, quantum numbers, configurations.",
   "note": ""
  }
 ],
 "checks": [],
 "sources": [
  {
   "name": "Quantum numbers (Chemistry LibreTexts)",
   "url": "https://chem.libretexts.org/"
  },
  {
   "name": "Electron configurations and orbitals (Khan Academy)",
   "url": "https://www.khanacademy.org/science/chemistry/electronic-structure-of-atoms"
  }
 ],
 "verified": "22 Sep 2026"
};
window.SINA = window.SINA || {subjects:[], lectures:{}};
SINA.lectures["chem1-configuration"] = {
 "id": "chem1-configuration",
 "subject": "chem1",
 "group": "General chemistry",
 "title": "Atomic orbitals and electron configuration",
 "sourceFile": "Lecture 4 - General Chemistry (2025-2026) (General Chemistry, Prof. Tarik Ouchbani)",
 "sourceUrl": "https://drive.google.com/file/d/1XpdQB7tRgircTkdh-0DB09lDUtbzhEv1/view?usp=drivesdk",
 "buildNote": "<strong>Built from the lecture slides.</strong> Slides that only show pictures are covered in outline. If your professor says something different, trust your professor.",
 "summary": [
  {
   "id": "s0",
   "title": "The big picture",
   "html": "<p>This lecture turns quantum numbers into pictures and rules: the shapes of <strong>s, p, d, f orbitals</strong>, and how electrons fill them to give each element's <strong>electron configuration</strong>, which determines valency, family properties and atomic spectra.</p>"
  },
  {
   "id": "s1",
   "title": "Orbital shapes",
   "html": "<p><strong>s orbitals</strong> are <strong>spherical</strong> around the nucleus; 1s is closest, 2s, 3s, 4s are progressively farther out (s electrons penetrate close to the nucleus, which slightly lowers their energy). <strong>p orbitals</strong> appear from n = 2: three equivalent orbitals at right angles, <strong>pₓ, p<sub>y</sub>, p<sub>z</sub></strong> (a p orbital is the region with a 95% chance of finding the electron). From n = 3 there are five <strong>d</strong> orbitals (complex shapes), and from n = 4 seven <strong>f</strong> orbitals. Orbitals per level: n = 1: 1; n = 2: 4; n = 3: 9; n = 4: 16 (n²).</p>"
  },
  {
   "id": "s2",
   "title": "Writing configurations",
   "html": "<p>Notation: shell number + subshell letter + electrons as a superscript, e.g. <strong>1s²</strong> ('one s two'). Maximum per <strong>shell = 2n²</strong> (2, 8, 18, 32); per <strong>subshell = 2(2l + 1)</strong>: s 2, p 6, d 10, f 14. Examples: <strong>Na (Z = 11): 1s² 2s² 2p⁶ 3s¹</strong>; <strong>Mg (Z = 12): 1s² 2s² 2p⁶ 3s²</strong>. 'Electrons in boxes' show each orbital as a box with arrows (↑↓) for spins. Configurations help determine <strong>valency</strong>, predict <strong>group properties</strong> (similar configurations → similar properties) and interpret <strong>spectra</strong>.</p>"
  },
  {
   "id": "s3",
   "title": "Filling rules",
   "html": "<p><strong>Aufbau principle</strong> ('build up'): electrons occupy lower-energy orbitals first; energy follows <strong>n + l</strong> (at equal n + l, lower n first): <strong>1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, 5p, 6s, 4f, 5d, 6p, 7s, 5f, 6d, 7p</strong>. Exceptions such as <strong>chromium and copper</strong> are explained by the extra stability of half-filled or completely filled subshells (Cr: …3d⁵ 4s¹; Cu: …3d¹⁰ 4s¹). <strong>Pauli exclusion principle</strong>: at most <strong>two electrons per orbital, with opposite spins</strong>; no two electrons share all four quantum numbers. <strong>Hund's rule</strong> (maximum multiplicity): in a subshell, every orbital is <strong>singly occupied first</strong>, with <strong>parallel spins</strong>, before any pairing. Examples: <strong>N (Z = 7): 1s² 2s² 2p³</strong> with three unpaired 2p electrons; <strong>O (Z = 8): 1s² 2s² 2p⁴</strong> with one paired and two unpaired 2p electrons.</p>"
  }
 ],
 "exam": [
  "s spherical; p: three orbitals px, py, pz at right angles; d five; f seven.",
  "Orbitals per shell = n²; electrons per shell = 2n².",
  "Subshell capacity 2(2l + 1): s 2, p 6, d 10, f 14.",
  "Notation 1s² = 'one s two'.",
  "Na: 1s² 2s² 2p⁶ 3s¹; Mg: 1s² 2s² 2p⁶ 3s².",
  "Aufbau: fill by increasing n + l; 4s before 3d.",
  "Exceptions: Cr 3d⁵4s¹, Cu 3d¹⁰4s¹.",
  "Pauli: max 2 electrons of opposite spin per orbital.",
  "Hund: singly fill each orbital with parallel spins before pairing.",
  "N: 2p³ (3 unpaired); O: 2p⁴ (2 unpaired)."
 ],
 "visual": {
  "kind": "model",
  "intro": "",
  "figure": {
   "viewBox": "0 0 760 420",
   "alt": "Filling order of subshells (Aufbau, n + l rule)",
   "caption": "Lowest energy first. Schematic drawn for this site.",
   "base": "<defs><marker id=\"ah\" markerWidth=\"10\" markerHeight=\"8\" refX=\"9\" refY=\"4\" orient=\"auto\"><path d=\"M0,0 L10,4 L0,8 Z\" fill=\"#8a8a8a\"/></marker></defs><line stroke=\"#8a8a8a\" stroke-width=\"2\" marker-end=\"url(#ah)\" x1=\"240\" y1=\"70\" x2=\"280\" y2=\"70\"/><line stroke=\"#8a8a8a\" stroke-width=\"2\" marker-end=\"url(#ah)\" x1=\"480\" y1=\"70\" x2=\"520\" y2=\"70\"/>",
   "parts": {
    "a": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#f2d7cf\" x=\"40\" y=\"40\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "1s → 2s → 2p",
      "→ 3s → 3p"
     ],
     "lx": 140.0,
     "ly": 68.0
    },
    "b": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#cfe3f2\" x=\"280\" y=\"40\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "→ 4s → 3d",
      "(4s before 3d)"
     ],
     "lx": 380.0,
     "ly": 68.0
    },
    "c": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#d7edd2\" x=\"520\" y=\"40\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "→ 4p → 5s → 4d",
      "→ 5p → 6s → 4f…"
     ],
     "lx": 620.0,
     "ly": 68.0
    },
    "pauli": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#f2e2a8\" x=\"40\" y=\"170\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "Pauli: ≤ 2 electrons,",
      "opposite spins"
     ],
     "lx": 140.0,
     "ly": 198.0
    },
    "hund": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#e3d5f0\" x=\"280\" y=\"170\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "Hund: fill each orbital",
      "singly first, same spin"
     ],
     "lx": 380.0,
     "ly": 198.0
    },
    "exc": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#f7d9b8\" x=\"520\" y=\"170\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "Exceptions: Cr, Cu",
      "(half/full d subshell)"
     ],
     "lx": 620.0,
     "ly": 198.0
    }
   },
   "arrows": {
    "a": [
     {
      "t": [
       40.0,
       48.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "b": [
     {
      "t": [
       280.0,
       48.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "c": [
     {
      "t": [
       520.0,
       48.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "pauli": [
     {
      "t": [
       40.0,
       178.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "hund": [
     {
      "t": [
       280.0,
       178.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "exc": [
     {
      "t": [
       520.0,
       178.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ]
   }
  },
  "mindmap": {
   "root": "Electron configuration",
   "branches": [
    [
     "Orbitals",
     [
      "s: sphere",
      "p: px, py, pz",
      "d: 5",
      "f: 7"
     ]
    ],
    [
     "Capacity",
     [
      "Shell 2n²",
      "Subshell 2(2l+1)"
     ]
    ],
    [
     "Rules",
     [
      "Aufbau (n + l)",
      "Pauli",
      "Hund"
     ]
    ],
    [
     "Examples",
     [
      "Na 3s¹",
      "Mg 3s²",
      "N 2p³",
      "O 2p⁴",
      "Cr, Cu exceptions"
     ]
    ]
   ]
  }
 },
 "mcqs": [
  {
   "q": "What is the shape of an s orbital?",
   "options": [
    "Cloverleaf",
    "Dumbbell",
    "Ring",
    "Spherical"
   ],
   "answer": 3,
   "why": "Around the nucleus."
  },
  {
   "q": "How many p orbitals exist in a given shell (n ≥ 2)?",
   "options": [
    "5",
    "7",
    "3",
    "1"
   ],
   "answer": 2,
   "why": "px, py, pz."
  },
  {
   "q": "The d orbitals first appear at:",
   "options": [
    "n = 4",
    "n = 2",
    "n = 1",
    "n = 3"
   ],
   "answer": 3,
   "why": "Five d orbitals.",
   "slides": [
    {
     "src": "files/slides/chem1-configuration/08.jpg",
     "lec": "Atomic orbitals and electron",
     "n": 8
    }
   ]
  },
  {
   "q": "How many orbitals are in the n = 3 level?",
   "options": [
    "3",
    "18",
    "9",
    "4"
   ],
   "answer": 2,
   "why": "n² = 9: one 3s, three 3p, five 3d.",
   "slides": [
    {
     "src": "files/slides/chem1-configuration/05.jpg",
     "lec": "Atomic orbitals and electron",
     "n": 5
    },
    {
     "src": "files/slides/chem1-configuration/08.jpg",
     "lec": "Atomic orbitals and electron",
     "n": 8
    }
   ]
  },
  {
   "q": "The maximum number of electrons in shell n is:",
   "options": [
    "2n²",
    "2(2l + 1)",
    "n²",
    "2l + 1"
   ],
   "answer": 0,
   "why": "2, 8, 18, 32."
  },
  {
   "q": "The electron configuration of sodium (Z = 11) is:",
   "options": [
    "1s² 2s² 2p⁶ 3p¹",
    "1s² 2s² 2p⁶ 3s¹",
    "1s² 2s² 2p⁷",
    "1s² 2s⁸ 3s¹"
   ],
   "answer": 1,
   "why": "One valence electron.",
   "slides": [
    {
     "src": "files/slides/chem1-configuration/10.jpg",
     "lec": "Atomic orbitals and electron",
     "n": 10
    }
   ]
  },
  {
   "q": "'1s²' is read as:",
   "options": [
    "One s squared",
    "One s two",
    "Two s one",
    "One squared s"
   ],
   "answer": 1,
   "why": "The superscript counts electrons.",
   "slides": [
    {
     "src": "files/slides/chem1-configuration/07.jpg",
     "lec": "Atomic orbitals and electron",
     "n": 7
    },
    {
     "src": "files/slides/chem1-configuration/14.jpg",
     "lec": "Atomic orbitals and electron",
     "n": 14
    }
   ]
  },
  {
   "q": "According to the Aufbau principle, which fills first?",
   "options": [
    "Both 3d and 4p",
    "3d",
    "4p",
    "4s"
   ],
   "answer": 3,
   "why": "4s has lower n + l (4) than 3d (5).",
   "slides": [
    {
     "src": "files/slides/chem1-configuration/15.jpg",
     "lec": "Atomic orbitals and electron",
     "n": 15
    }
   ]
  },
  {
   "q": "Orbital energy order in the Aufbau rule follows:",
   "options": [
    "n only",
    "n + l",
    "mₗ",
    "l only"
   ],
   "answer": 1,
   "why": "Lower n first when n + l is equal.",
   "slides": [
    {
     "src": "files/slides/chem1-configuration/15.jpg",
     "lec": "Atomic orbitals and electron",
     "n": 15
    }
   ]
  },
  {
   "q": "Which elements are classic exceptions to the Aufbau order?",
   "options": [
    "Cr and Cu",
    "He and Ne",
    "N and O",
    "Na and Mg"
   ],
   "answer": 0,
   "why": "Half-filled or full d subshells.",
   "slides": [
    {
     "src": "files/slides/chem1-configuration/17.jpg",
     "lec": "Atomic orbitals and electron",
     "n": 17
    }
   ]
  },
  {
   "q": "The Pauli exclusion principle limits each orbital to:",
   "options": [
    "2 electrons of opposite spin",
    "2 electrons of the same spin",
    "6 electrons",
    "1 electron"
   ],
   "answer": 0,
   "why": "No two share all four numbers.",
   "slides": [
    {
     "src": "files/slides/chem1-configuration/18.jpg",
     "lec": "Atomic orbitals and electron",
     "n": 18
    }
   ]
  },
  {
   "q": "Hund's rule states that in a subshell electrons:",
   "options": [
    "Have random spins",
    "Fill the highest energy first",
    "Pair up first",
    "Fill singly, parallel spins"
   ],
   "answer": 3,
   "why": "Maximum multiplicity.",
   "slides": [
    {
     "src": "files/slides/chem1-configuration/18.jpg",
     "lec": "Atomic orbitals and electron",
     "n": 18
    }
   ]
  },
  {
   "q": "How many unpaired electrons does nitrogen (1s² 2s² 2p³) have?",
   "options": [
    "1",
    "5",
    "0",
    "3"
   ],
   "answer": 3,
   "why": "One in each 2p orbital."
  },
  {
   "q": "Magnesium (Z = 12) has the configuration:",
   "options": [
    "1s² 2s² 2p⁶ 3s²",
    "1s² 2s² 2p⁶ 3p²",
    "1s² 2s² 2p⁸",
    "1s² 2s² 2p⁶ 3s¹ 3p¹"
   ],
   "answer": 0,
   "why": "Two valence electrons.",
   "slides": [
    {
     "src": "files/slides/chem1-configuration/10.jpg",
     "lec": "Atomic orbitals and electron",
     "n": 10
    }
   ]
  },
  {
   "q": "Which element is at the arrow?",
   "target": "a",
   "options": [
    "4s before 3d",
    "First subshells",
    "Continuing order",
    "Pauli exclusion"
   ],
   "answer": 1,
   "why": "The arrow points to: First subshells. Order by increasing n + l; at equal n + l, lower n first."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "b",
   "options": [
    "Hund's rule",
    "First subshells",
    "4s before 3d",
    "Pauli exclusion"
   ],
   "answer": 2,
   "why": "The arrow points to: 4s before 3d. 4s (n + l = 4) fills before 3d (n + l = 5)."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "c",
   "options": [
    "Pauli exclusion",
    "Hund's rule",
    "Continuing order",
    "4s before 3d"
   ],
   "answer": 2,
   "why": "The arrow points to: Continuing order. … 4p, 5s, 4d, 5p, 6s, 4f, 5d, 6p, 7s, 5f, 6d, 7p."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "pauli",
   "options": [
    "4s before 3d",
    "Pauli exclusion",
    "Hund's rule",
    "Continuing order"
   ],
   "answer": 1,
   "why": "The arrow points to: Pauli exclusion. Two electrons in one orbital must have opposite spins; no two share all four quantum numbers."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "hund",
   "options": [
    "Hund's rule",
    "Pauli exclusion",
    "Exceptions",
    "Continuing order"
   ],
   "answer": 0,
   "why": "The arrow points to: Hund's rule. Within a subshell, each orbital gets one electron (parallel spins) before any pairing."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "exc",
   "options": [
    "First subshells",
    "Continuing order",
    "Exceptions",
    "Pauli exclusion"
   ],
   "answer": 2,
   "why": "The arrow points to: Exceptions. Chromium and copper adopt half-filled or filled 3d configurations for extra stability."
  },
  {
   "q": "The ground-state electron configuration of hydrogen (H, Z = 1) is:",
   "options": [
    "1s²",
    "1s² 2s³",
    "1s¹",
    "1s¹ 2s¹"
   ],
   "answer": 2,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of helium (He, Z = 2) is:",
   "options": [
    "1s¹",
    "1s²",
    "1s² 2s¹",
    "1s¹ 2s¹"
   ],
   "answer": 1,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of lithium (Li, Z = 3) is:",
   "options": [
    "1s²",
    "1s¹ 2s¹",
    "1s² 2s¹",
    "1s² 2s²"
   ],
   "answer": 2,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of beryllium (Be, Z = 4) is:",
   "options": [
    "1s¹ 2s²",
    "1s² 2s²",
    "1s² 2s² 2p¹",
    "1s² 2s¹"
   ],
   "answer": 1,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of boron (B, Z = 5) is:",
   "options": [
    "1s¹ 2s² 2p¹",
    "1s² 2s² 2p²",
    "1s² 2s²",
    "1s² 2s² 2p¹"
   ],
   "answer": 3,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of carbon (C, Z = 6) is:",
   "options": [
    "1s² 2s² 2p³",
    "1s² 2s² 2p²",
    "1s¹ 2s² 2p²",
    "1s² 2s² 2p¹"
   ],
   "answer": 1,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of nitrogen (N, Z = 7) is:",
   "options": [
    "1s² 2s² 2p²",
    "1s¹ 2s² 2p³",
    "1s² 2s² 2p⁴",
    "1s² 2s² 2p³"
   ],
   "answer": 3,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of oxygen (O, Z = 8) is:",
   "options": [
    "1s² 2s² 2p⁴",
    "1s¹ 2s² 2p⁴",
    "1s² 2s² 2p³",
    "1s² 2s² 2p⁵"
   ],
   "answer": 0,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of fluorine (F, Z = 9) is:",
   "options": [
    "1s² 2s² 2p⁶",
    "1s² 2s² 2p⁵",
    "1s¹ 2s² 2p⁵",
    "1s² 2s² 2p⁴"
   ],
   "answer": 1,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of neon (Ne, Z = 10) is:",
   "options": [
    "1s² 2s² 2p⁶",
    "1s¹ 2s² 2p⁶",
    "1s² 2s² 2p⁵",
    "1s² 2s² 2p⁶ 3s¹"
   ],
   "answer": 0,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of sodium (Na, Z = 11) is:",
   "options": [
    "1s¹ 2s² 2p⁶ 3s¹",
    "1s² 2s² 2p⁶ 3s²",
    "1s² 2s² 2p⁶ 3s¹",
    "1s² 2s² 2p⁶"
   ],
   "answer": 2,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of magnesium (Mg, Z = 12) is:",
   "options": [
    "1s¹ 2s² 2p⁶ 3s²",
    "1s² 2s² 2p⁶ 3s² 3p¹",
    "1s² 2s² 2p⁶ 3s¹",
    "1s² 2s² 2p⁶ 3s²"
   ],
   "answer": 3,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of aluminium (Al, Z = 13) is:",
   "options": [
    "1s² 2s² 2p⁶ 3s² 3p¹",
    "1s² 2s² 2p⁶ 3s² 3p²",
    "1s¹ 2s² 2p⁶ 3s² 3p¹",
    "1s² 2s² 2p⁶ 3s²"
   ],
   "answer": 0,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of silicon (Si, Z = 14) is:",
   "options": [
    "1s¹ 2s² 2p⁶ 3s² 3p²",
    "1s² 2s² 2p⁶ 3s² 3p³",
    "1s² 2s² 2p⁶ 3s² 3p¹",
    "1s² 2s² 2p⁶ 3s² 3p²"
   ],
   "answer": 3,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of phosphorus (P, Z = 15) is:",
   "options": [
    "1s¹ 2s² 2p⁶ 3s² 3p³",
    "1s² 2s² 2p⁶ 3s² 3p²",
    "1s² 2s² 2p⁶ 3s² 3p³",
    "1s² 2s² 2p⁶ 3s² 3p⁴"
   ],
   "answer": 2,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of sulphur (S, Z = 16) is:",
   "options": [
    "1s¹ 2s² 2p⁶ 3s² 3p⁴",
    "1s² 2s² 2p⁶ 3s² 3p⁴",
    "1s² 2s² 2p⁶ 3s² 3p⁵",
    "1s² 2s² 2p⁶ 3s² 3p³"
   ],
   "answer": 1,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of chlorine (Cl, Z = 17) is:",
   "options": [
    "1s² 2s² 2p⁶ 3s² 3p⁶",
    "1s² 2s² 2p⁶ 3s² 3p⁴",
    "1s¹ 2s² 2p⁶ 3s² 3p⁵",
    "1s² 2s² 2p⁶ 3s² 3p⁵"
   ],
   "answer": 3,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of argon (Ar, Z = 18) is:",
   "options": [
    "1s² 2s² 2p⁶ 3s² 3p⁵",
    "1s² 2s² 2p⁶ 3s² 3p⁶",
    "1s¹ 2s² 2p⁶ 3s² 3p⁶",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹"
   ],
   "answer": 1,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of potassium (K, Z = 19) is:",
   "options": [
    "1s² 2s² 2p⁶ 3s² 3p⁶",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 4s²",
    "1s¹ 2s² 2p⁶ 3s² 3p⁶ 4s¹"
   ],
   "answer": 1,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of calcium (Ca, Z = 20) is:",
   "options": [
    "1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹ 4s²",
    "1s¹ 2s² 2p⁶ 3s² 3p⁶ 4s²"
   ],
   "answer": 1,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of scandium (Sc, Z = 21) is:",
   "options": [
    "1s¹ 2s² 2p⁶ 3s² 3p⁶ 3d¹ 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d² 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹ 4s²"
   ],
   "answer": 3,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of titanium (Ti, Z = 22) is:",
   "options": [
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹ 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d³ 4s²",
    "1s¹ 2s² 2p⁶ 3s² 3p⁶ 3d² 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d² 4s²"
   ],
   "answer": 3,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of vanadium (V, Z = 23) is:",
   "options": [
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s¹",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d² 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d³ 4s²",
    "1s¹ 2s² 2p⁶ 3s² 3p⁶ 3d³ 4s²"
   ],
   "answer": 2,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of chromium (Cr, Z = 24) is:",
   "options": [
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁴ 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d³ 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s¹"
   ],
   "answer": 3,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p with the half-filled/filled d exception.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of manganese (Mn, Z = 25) is:",
   "options": [
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²",
    "1s¹ 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s¹"
   ],
   "answer": 0,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of iron (Fe, Z = 26) is:",
   "options": [
    "1s¹ 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁷ 4s²"
   ],
   "answer": 2,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of cobalt (Co, Z = 27) is:",
   "options": [
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁷ 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²",
    "1s¹ 2s² 2p⁶ 3s² 3p⁶ 3d⁷ 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁸ 4s²"
   ],
   "answer": 0,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of nickel (Ni, Z = 28) is:",
   "options": [
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁸ 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁷ 4s²",
    "1s¹ 2s² 2p⁶ 3s² 3p⁶ 3d⁸ 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s¹"
   ],
   "answer": 0,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of copper (Cu, Z = 29) is:",
   "options": [
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s¹",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁸ 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁹ 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s²"
   ],
   "answer": 0,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p with the half-filled/filled d exception.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of zinc (Zn, Z = 30) is:",
   "options": [
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s²",
    "1s¹ 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s¹",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p¹"
   ],
   "answer": 0,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of gallium (Ga, Z = 31) is:",
   "options": [
    "1s¹ 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p¹",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p¹"
   ],
   "answer": 3,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of germanium (Ge, Z = 32) is:",
   "options": [
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p³",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p¹",
    "1s¹ 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p²"
   ],
   "answer": 3,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of arsenic (As, Z = 33) is:",
   "options": [
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p³",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p²",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁴",
    "1s¹ 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p³"
   ],
   "answer": 0,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of selenium (Se, Z = 34) is:",
   "options": [
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p³",
    "1s¹ 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁴",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁵",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁴"
   ],
   "answer": 3,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of bromine (Br, Z = 35) is:",
   "options": [
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶",
    "1s¹ 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁵",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁴",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁵"
   ],
   "answer": 3,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "The ground-state electron configuration of krypton (Kr, Z = 36) is:",
   "options": [
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁵",
    "1s¹ 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁴",
    "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶"
   ],
   "answer": 3,
   "why": "Aufbau order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p.",
   "x": 1
  },
  {
   "q": "How many unpaired electrons does hydrogen (Z = 1) have in its ground state?",
   "options": [
    "1",
    "3",
    "0",
    "2"
   ],
   "answer": 0,
   "why": "Hund's rule: fill orbitals singly with parallel spins before pairing.",
   "x": 1
  },
  {
   "q": "How many unpaired electrons does boron (Z = 5) have in its ground state?",
   "options": [
    "0",
    "1",
    "2",
    "3"
   ],
   "answer": 1,
   "why": "Hund's rule: fill orbitals singly with parallel spins before pairing.",
   "x": 1
  },
  {
   "q": "How many unpaired electrons does carbon (Z = 6) have in its ground state?",
   "options": [
    "2",
    "1",
    "4",
    "3"
   ],
   "answer": 0,
   "why": "Hund's rule: fill orbitals singly with parallel spins before pairing.",
   "x": 1
  },
  {
   "q": "How many unpaired electrons does nitrogen (Z = 7) have in its ground state?",
   "options": [
    "5",
    "2",
    "3",
    "4"
   ],
   "answer": 2,
   "why": "Hund's rule: fill orbitals singly with parallel spins before pairing.",
   "x": 1
  },
  {
   "q": "How many unpaired electrons does oxygen (Z = 8) have in its ground state?",
   "options": [
    "4",
    "2",
    "3",
    "1"
   ],
   "answer": 1,
   "why": "Hund's rule: fill orbitals singly with parallel spins before pairing.",
   "x": 1
  },
  {
   "q": "How many unpaired electrons does fluorine (Z = 9) have in its ground state?",
   "options": [
    "2",
    "3",
    "0",
    "1"
   ],
   "answer": 3,
   "why": "Hund's rule: fill orbitals singly with parallel spins before pairing.",
   "x": 1
  },
  {
   "q": "How many unpaired electrons does phosphorus (Z = 15) have in its ground state?",
   "options": [
    "4",
    "2",
    "3",
    "5"
   ],
   "answer": 2,
   "why": "Hund's rule: fill orbitals singly with parallel spins before pairing.",
   "x": 1
  },
  {
   "q": "How many unpaired electrons does sulphur (Z = 16) have in its ground state?",
   "options": [
    "3",
    "2",
    "1",
    "4"
   ],
   "answer": 1,
   "why": "Hund's rule: fill orbitals singly with parallel spins before pairing.",
   "x": 1
  },
  {
   "q": "How many unpaired electrons does chlorine (Z = 17) have in its ground state?",
   "options": [
    "2",
    "3",
    "1",
    "0"
   ],
   "answer": 2,
   "why": "Hund's rule: fill orbitals singly with parallel spins before pairing.",
   "x": 1
  },
  {
   "q": "How many unpaired electrons does chromium (Z = 24) have in its ground state?",
   "options": [
    "6",
    "5",
    "8",
    "7"
   ],
   "answer": 0,
   "why": "Hund's rule: fill orbitals singly with parallel spins before pairing.",
   "x": 1
  },
  {
   "q": "How many unpaired electrons does manganese (Z = 25) have in its ground state?",
   "options": [
    "5",
    "6",
    "4",
    "7"
   ],
   "answer": 0,
   "why": "Hund's rule: fill orbitals singly with parallel spins before pairing.",
   "x": 1
  },
  {
   "q": "How many unpaired electrons does iron (Z = 26) have in its ground state?",
   "options": [
    "5",
    "4",
    "3",
    "6"
   ],
   "answer": 1,
   "why": "Hund's rule: fill orbitals singly with parallel spins before pairing.",
   "x": 1
  },
  {
   "q": "How many unpaired electrons does copper (Z = 29) have in its ground state?",
   "options": [
    "0",
    "2",
    "3",
    "1"
   ],
   "answer": 3,
   "why": "Hund's rule: fill orbitals singly with parallel spins before pairing.",
   "x": 1
  },
  {
   "q": "How many unpaired electrons does zinc (Z = 30) have in its ground state?",
   "options": [
    "1",
    "0",
    "2",
    "3"
   ],
   "answer": 1,
   "why": "Hund's rule: fill orbitals singly with parallel spins before pairing.",
   "x": 1
  },
  {
   "q": "How many unpaired electrons does neon (Z = 10) have in its ground state?",
   "options": [
    "3",
    "1",
    "2",
    "0"
   ],
   "answer": 3,
   "why": "Hund's rule: fill orbitals singly with parallel spins before pairing.",
   "x": 1
  },
  {
   "q": "How many unpaired electrons does magnesium (Z = 12) have in its ground state?",
   "options": [
    "1",
    "0",
    "2",
    "3"
   ],
   "answer": 1,
   "why": "Hund's rule: fill orbitals singly with parallel spins before pairing.",
   "x": 1
  },
  {
   "q": "How many electrons does lithium (Li) have in its outer shell?",
   "options": [
    "1",
    "3",
    "7",
    "2"
   ],
   "answer": 0,
   "why": "Count the electrons of the highest n.",
   "x": 1
  },
  {
   "q": "How many electrons does beryllium (Be) have in its outer shell?",
   "options": [
    "1",
    "6",
    "2",
    "3"
   ],
   "answer": 2,
   "why": "Count the electrons of the highest n.",
   "x": 1
  },
  {
   "q": "How many electrons does boron (B) have in its outer shell?",
   "options": [
    "5",
    "2",
    "4",
    "3"
   ],
   "answer": 3,
   "why": "Count the electrons of the highest n.",
   "x": 1
  },
  {
   "q": "How many electrons does carbon (C) have in its outer shell?",
   "options": [
    "4",
    "5",
    "7",
    "3"
   ],
   "answer": 0,
   "why": "Count the electrons of the highest n.",
   "x": 1
  },
  {
   "q": "How many electrons does nitrogen (N) have in its outer shell?",
   "options": [
    "3",
    "5",
    "6",
    "4"
   ],
   "answer": 1,
   "why": "Count the electrons of the highest n.",
   "x": 1
  },
  {
   "q": "How many electrons does oxygen (O) have in its outer shell?",
   "options": [
    "5",
    "2",
    "7",
    "6"
   ],
   "answer": 3,
   "why": "Count the electrons of the highest n.",
   "x": 1
  },
  {
   "q": "How many electrons does fluorine (F) have in its outer shell?",
   "options": [
    "6",
    "8",
    "7",
    "1"
   ],
   "answer": 2,
   "why": "Count the electrons of the highest n.",
   "x": 1
  },
  {
   "q": "How many electrons does sodium (Na) have in its outer shell?",
   "options": [
    "1",
    "7",
    "3",
    "2"
   ],
   "answer": 0,
   "why": "Count the electrons of the highest n.",
   "x": 1
  },
  {
   "q": "How many electrons does magnesium (Mg) have in its outer shell?",
   "options": [
    "6",
    "3",
    "1",
    "2"
   ],
   "answer": 3,
   "why": "Count the electrons of the highest n.",
   "x": 1
  },
  {
   "q": "How many electrons does aluminium (Al) have in its outer shell?",
   "options": [
    "2",
    "4",
    "5",
    "3"
   ],
   "answer": 3,
   "why": "Count the electrons of the highest n.",
   "x": 1
  },
  {
   "q": "How many electrons does silicon (Si) have in its outer shell?",
   "options": [
    "4",
    "3",
    "5",
    "7"
   ],
   "answer": 0,
   "why": "Count the electrons of the highest n.",
   "x": 1
  },
  {
   "q": "How many electrons does phosphorus (P) have in its outer shell?",
   "options": [
    "4",
    "3",
    "6",
    "5"
   ],
   "answer": 3,
   "why": "Count the electrons of the highest n.",
   "x": 1
  },
  {
   "q": "How many electrons does sulphur (S) have in its outer shell?",
   "options": [
    "5",
    "7",
    "6",
    "2"
   ],
   "answer": 2,
   "why": "Count the electrons of the highest n.",
   "x": 1
  },
  {
   "q": "How many electrons does chlorine (Cl) have in its outer shell?",
   "options": [
    "8",
    "6",
    "7",
    "1"
   ],
   "answer": 2,
   "why": "Count the electrons of the highest n.",
   "x": 1
  },
  {
   "q": "How many electrons does potassium (K) have in its outer shell?",
   "options": [
    "7",
    "1",
    "2",
    "3"
   ],
   "answer": 1,
   "why": "Count the electrons of the highest n.",
   "x": 1
  },
  {
   "q": "How many electrons does calcium (Ca) have in its outer shell?",
   "options": [
    "1",
    "2",
    "3",
    "6"
   ],
   "answer": 1,
   "why": "Count the electrons of the highest n.",
   "x": 1
  },
  {
   "q": "How many electrons does bromine (Br) have in its outer shell?",
   "options": [
    "8",
    "6",
    "1",
    "7"
   ],
   "answer": 3,
   "why": "Count the electrons of the highest n.",
   "x": 1
  },
  {
   "q": "Which subshell fills first: 4s or 3d?",
   "options": [
    "It depends on the element only",
    "3d",
    "They fill at the same time",
    "4s"
   ],
   "answer": 3,
   "why": "Lower n + l first; at equal n + l, lower n first.",
   "x": 1
  },
  {
   "q": "Which subshell fills first: 3d or 4p?",
   "options": [
    "It depends on the element only",
    "3d",
    "4p",
    "They fill at the same time"
   ],
   "answer": 1,
   "why": "Lower n + l first; at equal n + l, lower n first.",
   "x": 1
  },
  {
   "q": "Which subshell fills first: 2p or 3s?",
   "options": [
    "3s",
    "They fill at the same time",
    "2p",
    "It depends on the element only"
   ],
   "answer": 2,
   "why": "Lower n + l first; at equal n + l, lower n first.",
   "x": 1
  },
  {
   "q": "Which subshell fills first: 3p or 4s?",
   "options": [
    "4s",
    "It depends on the element only",
    "3p",
    "They fill at the same time"
   ],
   "answer": 2,
   "why": "Lower n + l first; at equal n + l, lower n first.",
   "x": 1
  },
  {
   "q": "Which subshell fills first: 4p or 5s?",
   "options": [
    "5s",
    "It depends on the element only",
    "They fill at the same time",
    "4p"
   ],
   "answer": 3,
   "why": "Lower n + l first; at equal n + l, lower n first.",
   "x": 1
  },
  {
   "q": "Which subshell fills first: 5s or 4d?",
   "options": [
    "It depends on the element only",
    "They fill at the same time",
    "4d",
    "5s"
   ],
   "answer": 3,
   "why": "Lower n + l first; at equal n + l, lower n first.",
   "x": 1
  },
  {
   "q": "Which subshell fills first: 4f or 5d?",
   "options": [
    "5d",
    "4f",
    "It depends on the element only",
    "They fill at the same time"
   ],
   "answer": 1,
   "why": "Lower n + l first; at equal n + l, lower n first.",
   "x": 1
  },
  {
   "q": "Which subshell fills first: 6s or 4f?",
   "options": [
    "They fill at the same time",
    "6s",
    "It depends on the element only",
    "4f"
   ],
   "answer": 1,
   "why": "Lower n + l first; at equal n + l, lower n first.",
   "x": 1
  },
  {
   "q": "The Aufbau principle states that electrons:",
   "options": [
    "Pair before filling empty orbitals",
    "Cannot share four quantum numbers",
    "Have parallel spins only",
    "Occupy lower-energy orbitals first"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "Orbitals with equal n + l are filled:",
   "options": [
    "Higher n first",
    "At random",
    "Lower n first",
    "Only after d"
   ],
   "answer": 2,
   "why": "Klechkowski's rule.",
   "x": 1
  },
  {
   "q": "In 'electrons in boxes', each box represents:",
   "options": [
    "A nucleus",
    "An electron",
    "A shell",
    "An orbital, holding up to 2 electrons with opposite spins"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "p orbitals appear from which shell?",
   "options": [
    "n = 4",
    "n = 3",
    "n = 1",
    "n = 2"
   ],
   "answer": 3,
   "why": "Three equivalent orbitals pₓ, p_y, p_z at right angles.",
   "x": 1
  },
  {
   "q": "The shape of an s orbital is:",
   "options": [
    "Linear",
    "Clover",
    "Spherical",
    "Dumbbell"
   ],
   "answer": 2,
   "why": "",
   "x": 1
  },
  {
   "q": "Electron configurations help to determine:",
   "options": [
    "Valency, family properties and spectra",
    "Density",
    "Number of neutrons",
    "Atomic mass only"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "The shortened (noble-gas core) configuration of sodium (Na) is:",
   "options": [
    "[Ne]",
    "[Ne] 3s²",
    "[Ne] 3s¹",
    "[He] 3s¹"
   ],
   "answer": 2,
   "why": "Write the previous noble gas in brackets, then the remaining electrons.",
   "x": 1
  },
  {
   "q": "The shortened (noble-gas core) configuration of phosphorus (P) is:",
   "options": [
    "[Ne] 3s² 3p⁴",
    "[Ne] 3s² 3p³",
    "[He] 3s² 3p³",
    "[Ne] 3s²"
   ],
   "answer": 1,
   "why": "Write the previous noble gas in brackets, then the remaining electrons.",
   "x": 1
  },
  {
   "q": "The shortened (noble-gas core) configuration of chlorine (Cl) is:",
   "options": [
    "[Ne] 3s² 3p⁶",
    "[Ne] 3s²",
    "[Ne] 3s² 3p⁵",
    "[He] 3s² 3p⁵"
   ],
   "answer": 2,
   "why": "Write the previous noble gas in brackets, then the remaining electrons.",
   "x": 1
  },
  {
   "q": "The shortened (noble-gas core) configuration of potassium (K) is:",
   "options": [
    "[Ar]",
    "[Ar] 4s¹",
    "[Ne] 4s¹",
    "[Ar] 4s²"
   ],
   "answer": 1,
   "why": "Write the previous noble gas in brackets, then the remaining electrons.",
   "x": 1
  },
  {
   "q": "The shortened (noble-gas core) configuration of calcium (Ca) is:",
   "options": [
    "[Ar] 4s²",
    "[Ar] 4s³",
    "[Ar]",
    "[Ne] 4s²"
   ],
   "answer": 0,
   "why": "Write the previous noble gas in brackets, then the remaining electrons.",
   "x": 1
  },
  {
   "q": "The shortened (noble-gas core) configuration of iron (Fe) is:",
   "options": [
    "[Ar] 3d⁶ 4s³",
    "[Ar] 3d⁶ 4s²",
    "[Ar] 3d⁶",
    "[Ne] 3d⁶ 4s²"
   ],
   "answer": 1,
   "why": "Write the previous noble gas in brackets, then the remaining electrons.",
   "x": 1
  },
  {
   "q": "The shortened (noble-gas core) configuration of zinc (Zn) is:",
   "options": [
    "[Ar] 3d¹⁰ 4s²",
    "[Ne] 3d¹⁰ 4s²",
    "[Ar] 3d¹⁰ 4s³",
    "[Ar] 3d¹⁰"
   ],
   "answer": 0,
   "why": "Write the previous noble gas in brackets, then the remaining electrons.",
   "x": 1
  },
  {
   "q": "The shortened (noble-gas core) configuration of bromine (Br) is:",
   "options": [
    "[Ne] 3d¹⁰ 4s² 4p⁵",
    "[Ar] 3d¹⁰ 4s²",
    "[Ar] 3d¹⁰ 4s² 4p⁶",
    "[Ar] 3d¹⁰ 4s² 4p⁵"
   ],
   "answer": 3,
   "why": "Write the previous noble gas in brackets, then the remaining electrons.",
   "x": 1
  }
 ],
 "cards": [
  {
   "id": "x0",
   "type": "text",
   "front": "Orbital shapes?",
   "back": "s spherical; p three dumbbell orbitals px, py, pz at right angles (from n = 2); d five (from n = 3); f seven (from n = 4)."
  },
  {
   "id": "x1",
   "type": "text",
   "front": "Orbitals and electrons per shell?",
   "back": "n² orbitals; 2n² electrons (2, 8, 18, 32)."
  },
  {
   "id": "x2",
   "type": "text",
   "front": "Subshell capacities?",
   "back": "2(2l + 1): s 2, p 6, d 10, f 14."
  },
  {
   "id": "x3",
   "type": "text",
   "front": "Aufbau filling order?",
   "back": "1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, 5p, 6s, 4f, 5d, 6p, 7s…, by increasing n + l."
  },
  {
   "id": "x4",
   "type": "text",
   "front": "Pauli exclusion principle?",
   "back": "Max two electrons per orbital, with opposite spins; no two electrons share all four quantum numbers."
  },
  {
   "id": "x5",
   "type": "text",
   "front": "Hund's rule?",
   "back": "Fill each orbital of a subshell singly with parallel spins before pairing (maximum multiplicity)."
  },
  {
   "id": "x6",
   "type": "text",
   "front": "Exceptions to Aufbau?",
   "back": "Cr (…3d⁵ 4s¹) and Cu (…3d¹⁰ 4s¹): half-filled or filled d subshells are extra stable."
  },
  {
   "id": "x7",
   "type": "text",
   "front": "Uses of electron configuration?",
   "back": "Determine valency, predict group properties, interpret atomic spectra."
  },
  {
   "id": "img-a",
   "type": "image",
   "target": "a",
   "front": "What is at the arrow, and why does it matter?",
   "back": "First subshells. Order by increasing n + l; at equal n + l, lower n first."
  },
  {
   "id": "img-b",
   "type": "image",
   "target": "b",
   "front": "What is at the arrow, and why does it matter?",
   "back": "4s before 3d. 4s (n + l = 4) fills before 3d (n + l = 5)."
  },
  {
   "id": "img-c",
   "type": "image",
   "target": "c",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Continuing order. … 4p, 5s, 4d, 5p, 6s, 4f, 5d, 6p, 7s, 5f, 6d, 7p."
  },
  {
   "id": "img-pauli",
   "type": "image",
   "target": "pauli",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Pauli exclusion. Two electrons in one orbital must have opposite spins; no two share all four quantum numbers."
  },
  {
   "id": "img-hund",
   "type": "image",
   "target": "hund",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Hund's rule. Within a subshell, each orbital gets one electron (parallel spins) before any pairing."
  },
  {
   "id": "img-exc",
   "type": "image",
   "target": "exc",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Exceptions. Chromium and copper adopt half-filled or filled 3d configurations for extra stability."
  }
 ],
 "deeper": [
  {
   "title": "Why 4s fills before 3d",
   "html": "<p>The 4s orbital has a higher principal number than 3d, but its electrons penetrate close to the nucleus, feel more of its charge and end up slightly lower in energy. The n + l rule captures this: 4s (4 + 0 = 4) comes before 3d (3 + 2 = 5). This is why potassium and calcium start the fourth period before the transition metals.</p><p class='src'>Source: the lecture's s-orbital and Aufbau slides.</p>"
  },
  {
   "title": "Why Hund's rule makes sense",
   "html": "<p>Electrons repel each other. Placing them in separate orbitals of the same subshell keeps them apart, and parallel spins lower the energy further. Only when every orbital has one electron is pairing unavoidable. This is why nitrogen has three unpaired electrons and forms three bonds.</p><p class='src'>Source: the lecture's Hund's rule slide and nitrogen example.</p>"
  }
 ],
 "resources": [
  {
   "title": "Electron configurations (Khan Academy)",
   "url": "https://www.khanacademy.org/science/chemistry/electronic-structure-of-atoms/electron-configurations-jay-sal/a/electron-configurations",
   "kind": "Article",
   "why": "Aufbau, Pauli and Hund with examples.",
   "note": ""
  },
  {
   "title": "Ptable: interactive periodic table",
   "url": "https://ptable.com/",
   "kind": "Website",
   "why": "Shows electron configurations for every element.",
   "note": ""
  }
 ],
 "checks": [],
 "sources": [
  {
   "name": "Electron configurations (Khan Academy)",
   "url": "https://www.khanacademy.org/science/chemistry/electronic-structure-of-atoms/electron-configurations-jay-sal/a/electron-configurations"
  },
  {
   "name": "Ptable: interactive periodic table",
   "url": "https://ptable.com/"
  }
 ],
 "verified": "22 Sep 2026"
};
window.SINA = window.SINA || {subjects:[], lectures:{}};
SINA.lectures["chem1-periodic"] = {
 "id": "chem1-periodic",
 "subject": "chem1",
 "group": "General chemistry",
 "title": "The periodic table",
 "sourceFile": "Lecture 5 - General Chemistry: periodic classification (2025-2026) (General Chemistry, Prof. Tarik Ouchbani)",
 "sourceUrl": "https://drive.google.com/file/d/1bnWUqxnAaCZNh4hnG0HgdRbBfkiIcrJ4/view?usp=drivesdk",
 "buildNote": "<strong>Built from the lecture slides.</strong> Slides that only show pictures are covered in outline. If your professor says something different, trust your professor.",
 "summary": [
  {
   "id": "s0",
   "title": "The big picture",
   "html": "<p>In 1800 only 31 elements were known; by 1865 about 63 more had been found, creating the need to classify them. Today <strong>118 elements</strong> are known, some man-made. The periodic table arranges them so that properties repeat at regular intervals, letting chemists predict an element's behaviour from its neighbours.</p>"
  },
  {
   "id": "s1",
   "title": "Metals, non-metals, metalloids",
   "html": "<p><strong>Metals</strong>: solid at normal T and P (except <strong>mercury</strong>), shiny, <strong>malleable</strong> (can be rolled) and <strong>ductile</strong> (can be stretched), <strong>electron donors</strong>, good conductors of heat and electricity; they form <strong>cations</strong>, their oxides are <strong>basic</strong>, they react with acids. <strong>Non-metals</strong>: often gases or liquids, dull, neither malleable nor ductile, poor conductors. <strong>Metalloids</strong>: on the stepped line between the two; semiconductors whose electrical resistance <strong>decreases with temperature</strong>; brittle.</p>"
  },
  {
   "id": "s2",
   "title": "Structure of the modern table",
   "html": "<p>Elements are ordered by <strong>atomic number Z</strong> (no longer atomic mass), following <strong>Klechkowski's</strong> (Aufbau) rule, so an element's position reflects its electron configuration; the <strong>valence layer</strong> fixes chemical properties. <strong>7 rows (periods)</strong>, each filling a new shell (ns, (n−2)f, (n−1)d, np), and <strong>18 columns</strong>: elements with the same outer-layer configuration are in the same column (family) with similar properties: hence 'periodic'. <strong>Blocks</strong>: <strong>s</strong> (IA, IIA: ns¹⁻²; e.g. Na 3s¹), <strong>p</strong> (IIIA-VIIIA: ns² np¹⁻⁶; e.g. B 2p¹), <strong>d</strong> (IIIB-VIIIB, IB, IIB: ns² (n−1)d¹⁻¹⁰; e.g. Sc 4s² 3d¹), <strong>f</strong> (the 'balconies').</p>"
  },
  {
   "id": "s3",
   "title": "Main families",
   "html": "<p><strong>Alkali metals</strong> (IA, ns¹: Li, Na, K, Rb, Cs, Fr): monovalent, electropositive, form M⁺, very reactive, oxides (Na₂O) give strong bases (NaOH). <strong>Alkaline earths</strong> (IIA, ns²: Be, Mg, Ca, Sr, Ba, Ra): bivalent, form M²⁺, oxides (MgO, CaO) give strong bases. <strong>Boron family</strong> (ns² np¹), <strong>carbon family</strong> (ns² np²; excited state gives more unpaired electrons), <strong>nitrogen family</strong> (ns² np³; N and P essential to life). <strong>Chalcogens</strong> (ns² np⁴: O, S, Se, Te; Po radioactive): gain 2 electrons (O²⁻), usual oxidation state −2 (also +2, +4, +6). <strong>Halogens</strong> (ns² np⁵: F, Cl, Br, I, At): gain one electron, oxidation state −1, occur as ions or diatomic molecules (Cl₂, Br₂, I₂), form ionic bonds and strong acids with hydrogen (HF, HCl). <strong>Noble gases</strong> (ns² np⁶). <strong>Transition metals</strong> (ns² (n−1)dˣ): three series of 10 in periods 4-6, all metals, many oxidation states.</p>"
  }
 ],
 "exam": [
  "118 known elements.",
  "Metals: shiny, malleable, ductile, conductors, cations, basic oxides (Hg liquid).",
  "Metalloids: semiconductors, resistance falls with temperature.",
  "Order by Z (not mass), following Klechkowski's rule.",
  "7 periods (shells) × 18 columns (families).",
  "Same outer configuration → same column → similar properties.",
  "Blocks: s (ns¹⁻²), p (ns² np¹⁻⁶), d (ns² (n−1)d¹⁻¹⁰), f.",
  "Alkali ns¹ → M⁺, strong bases; alkaline earths ns² → M²⁺.",
  "Chalcogens ns² np⁴ → −2; halogens ns² np⁵ → −1, strong acids HX.",
  "Transition metals: many oxidation states."
 ],
 "visual": {
  "kind": "model",
  "intro": "",
  "figure": {
   "viewBox": "0 0 760 420",
   "alt": "Blocks of the periodic table",
   "caption": "Where the outer electrons go. Schematic drawn for this site.",
   "base": "<defs><marker id=\"ah\" markerWidth=\"10\" markerHeight=\"8\" refX=\"9\" refY=\"4\" orient=\"auto\"><path d=\"M0,0 L10,4 L0,8 Z\" fill=\"#8a8a8a\"/></marker></defs>",
   "parts": {
    "s": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#f2d7cf\" x=\"40\" y=\"40\" width=\"160\" height=\"60\" rx=\"10\"/>",
     "label": [
      "s block: IA, IIA",
      "ns¹, ns²"
     ],
     "lx": 120.0,
     "ly": 68.0
    },
    "d": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#cfe3f2\" x=\"215\" y=\"40\" width=\"160\" height=\"60\" rx=\"10\"/>",
     "label": [
      "d block: transition",
      "ns² (n−1)dˣ"
     ],
     "lx": 295.0,
     "ly": 68.0
    },
    "p": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#d7edd2\" x=\"390\" y=\"40\" width=\"160\" height=\"60\" rx=\"10\"/>",
     "label": [
      "p block: IIIA-VIIIA",
      "ns² npˣ"
     ],
     "lx": 470.0,
     "ly": 68.0
    },
    "f": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#f2e2a8\" x=\"565\" y=\"40\" width=\"160\" height=\"60\" rx=\"10\"/>",
     "label": [
      "f block:",
      "lanthanides, actinides"
     ],
     "lx": 645.0,
     "ly": 68.0
    },
    "per": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#e3d5f0\" x=\"120\" y=\"170\" width=\"220\" height=\"60\" rx=\"10\"/>",
     "label": [
      "7 periods (rows):",
      "one value of n"
     ],
     "lx": 230.0,
     "ly": 198.0
    },
    "grp": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#f7d9b8\" x=\"420\" y=\"170\" width=\"220\" height=\"60\" rx=\"10\"/>",
     "label": [
      "18 columns: same",
      "outer layer = same family"
     ],
     "lx": 530.0,
     "ly": 198.0
    }
   },
   "arrows": {
    "s": [
     {
      "t": [
       40.0,
       48.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "d": [
     {
      "t": [
       215.0,
       48.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "p": [
     {
      "t": [
       390.0,
       48.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "f": [
     {
      "t": [
       565.0,
       48.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "per": [
     {
      "t": [
       120.0,
       178.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "grp": [
     {
      "t": [
       420.0,
       178.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ]
   }
  }
 },
 "mcqs": [
  {
   "q": "How many elements are known today?",
   "options": [
    "103",
    "92",
    "150",
    "118"
   ],
   "answer": 3,
   "why": "Some are man-made.",
   "slides": [
    {
     "src": "files/slides/chem1-periodic/04.jpg",
     "lec": "The periodic table",
     "n": 4
    }
   ]
  },
  {
   "q": "Which metal is liquid at normal temperature?",
   "options": [
    "Copper",
    "Iron",
    "Mercury",
    "Sodium"
   ],
   "answer": 2,
   "why": "All other metals are solid.",
   "slides": [
    {
     "src": "files/slides/chem1-periodic/06.jpg",
     "lec": "The periodic table",
     "n": 6
    }
   ]
  },
  {
   "q": "'Ductile' means a metal can be:",
   "options": [
    "Rolled into sheets",
    "Magnetised",
    "Melted easily",
    "Stretched without breaking"
   ],
   "answer": 3,
   "why": "Malleable = can be rolled or crushed.",
   "slides": [
    {
     "src": "files/slides/chem1-periodic/08.jpg",
     "lec": "The periodic table",
     "n": 8
    }
   ]
  },
  {
   "q": "Metals form:",
   "options": [
    "Only covalent bonds",
    "Anions and acidic oxides",
    "Cations and basic oxides",
    "Diatomic gases"
   ],
   "answer": 2,
   "why": "They are electron donors.",
   "slides": [
    {
     "src": "files/slides/chem1-periodic/08.jpg",
     "lec": "The periodic table",
     "n": 8
    }
   ]
  },
  {
   "q": "Metalloids are characterised by:",
   "options": [
    "Being semiconductors",
    "Being malleable",
    "Being gases",
    "Resistance rising with temperature"
   ],
   "answer": 0,
   "why": "Resistance falls with temperature.",
   "slides": [
    {
     "src": "files/slides/chem1-periodic/10.jpg",
     "lec": "The periodic table",
     "n": 10
    }
   ]
  },
  {
   "q": "The modern periodic table orders elements by:",
   "options": [
    "Discovery date",
    "Atomic number Z",
    "Atomic mass",
    "Density"
   ],
   "answer": 1,
   "why": "Following Klechkowski's rule.",
   "slides": [
    {
     "src": "files/slides/chem1-periodic/12.jpg",
     "lec": "The periodic table",
     "n": 12
    }
   ]
  },
  {
   "q": "How many periods and columns does the periodic table have?",
   "options": [
    "6 and 20",
    "7 and 18",
    "18 and 7",
    "8 and 16"
   ],
   "answer": 1,
   "why": "Periods = shells.",
   "slides": [
    {
     "src": "files/slides/chem1-periodic/13.jpg",
     "lec": "The periodic table",
     "n": 13
    }
   ]
  },
  {
   "q": "Elements in the same column share:",
   "options": [
    "The same mass",
    "The same Z",
    "The same period",
    "Outer configuration"
   ],
   "answer": 3,
   "why": "Hence similar properties.",
   "slides": [
    {
     "src": "files/slides/chem1-periodic/12.jpg",
     "lec": "The periodic table",
     "n": 12
    },
    {
     "src": "files/slides/chem1-periodic/13.jpg",
     "lec": "The periodic table",
     "n": 13
    }
   ]
  },
  {
   "q": "Scandium (1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹) belongs to the:",
   "options": [
    "f block",
    "d block",
    "s block",
    "p block"
   ],
   "answer": 1,
   "why": "Outer ns² (n−1)d¹.",
   "slides": [
    {
     "src": "files/slides/chem1-periodic/17.jpg",
     "lec": "The periodic table",
     "n": 17
    }
   ]
  },
  {
   "q": "Alkali metals have outer configuration:",
   "options": [
    "ns¹",
    "ns² np⁵",
    "ns²",
    "ns² np⁶"
   ],
   "answer": 0,
   "why": "Li, Na, K…",
   "slides": [
    {
     "src": "files/slides/chem1-periodic/20.jpg",
     "lec": "The periodic table",
     "n": 20
    }
   ]
  },
  {
   "q": "Alkali metal oxides react with water to give:",
   "options": [
    "Strong bases",
    "Neutral salts",
    "Noble gases",
    "Strong acids"
   ],
   "answer": 0,
   "why": "E.g. NaOH.",
   "slides": [
    {
     "src": "files/slides/chem1-periodic/20.jpg",
     "lec": "The periodic table",
     "n": 20
    }
   ]
  },
  {
   "q": "Halogens usually have oxidation state:",
   "options": [
    "−2",
    "+1",
    "0",
    "−1"
   ],
   "answer": 3,
   "why": "They gain one electron.",
   "slides": [
    {
     "src": "files/slides/chem1-periodic/25.jpg",
     "lec": "The periodic table",
     "n": 25
    }
   ]
  },
  {
   "q": "Chalcogens (O, S, Se) tend to:",
   "options": [
    "Lose 2 electrons",
    "Share 5 electrons",
    "Gain 1 electron",
    "Gain 2 electrons"
   ],
   "answer": 3,
   "why": "Oxidation state −2.",
   "slides": [
    {
     "src": "files/slides/chem1-periodic/24.jpg",
     "lec": "The periodic table",
     "n": 24
    },
    {
     "src": "files/slides/chem1-periodic/25.jpg",
     "lec": "The periodic table",
     "n": 25
    }
   ]
  },
  {
   "q": "Transition metals are known for:",
   "options": [
    "Many oxidation states",
    "A single oxidation state",
    "Being non-metals",
    "ns¹ configuration only"
   ],
   "answer": 0,
   "why": "Three series of 10.",
   "slides": [
    {
     "src": "files/slides/chem1-periodic/32.jpg",
     "lec": "The periodic table",
     "n": 32
    }
   ]
  },
  {
   "q": "Which element is at the arrow?",
   "target": "s",
   "options": [
    "f block",
    "s block",
    "d block",
    "p block"
   ],
   "answer": 1,
   "why": "The arrow points to: s block. Alkali metals (ns¹: Li, Na, K…; monovalent, strong bases) and alkaline earths (ns²: Be, Mg, Ca…; bivalent)."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "d",
   "options": [
    "Periods",
    "s block",
    "d block",
    "f block"
   ],
   "answer": 2,
   "why": "The arrow points to: d block. Transition metals: three series of 10 elements in periods 4-6; many oxidation states."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "p",
   "options": [
    "Periods",
    "d block",
    "p block",
    "f block"
   ],
   "answer": 2,
   "why": "The arrow points to: p block. ns² npˣ: boron, carbon, nitrogen families, chalcogens (ns² np⁴), halogens (ns² np⁵), noble gases (ns² np⁶)."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "f",
   "options": [
    "p block",
    "f block",
    "Periods",
    "d block"
   ],
   "answer": 1,
   "why": "The arrow points to: f block. The 'balconies' filling f subshells."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "per",
   "options": [
    "Periods",
    "Groups",
    "p block",
    "f block"
   ],
   "answer": 0,
   "why": "The arrow points to: Periods. Each row fills a new shell: ns, (n−2)f, (n−1)d, np."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "grp",
   "options": [
    "s block",
    "f block",
    "Groups",
    "p block"
   ],
   "answer": 2,
   "why": "The arrow points to: Groups. Elements with the same outer-layer configuration share chemical properties."
  },
  {
   "q": "In which period is hydrogen (H, Z = 1)?",
   "options": [
    "0",
    "1",
    "2",
    "3"
   ],
   "answer": 1,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does hydrogen (H, Z = 1) belong?",
   "options": [
    "s block",
    "f block",
    "p block",
    "d block"
   ],
   "answer": 0,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is lithium (Li, Z = 3)?",
   "options": [
    "2",
    "1",
    "3",
    "4"
   ],
   "answer": 0,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does lithium (Li, Z = 3) belong?",
   "options": [
    "d block",
    "f block",
    "p block",
    "s block"
   ],
   "answer": 3,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is beryllium (Be, Z = 4)?",
   "options": [
    "4",
    "3",
    "2",
    "1"
   ],
   "answer": 2,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does beryllium (Be, Z = 4) belong?",
   "options": [
    "f block",
    "d block",
    "s block",
    "p block"
   ],
   "answer": 2,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is boron (B, Z = 5)?",
   "options": [
    "4",
    "3",
    "2",
    "1"
   ],
   "answer": 2,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does boron (B, Z = 5) belong?",
   "options": [
    "f block",
    "p block",
    "d block",
    "s block"
   ],
   "answer": 1,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is carbon (C, Z = 6)?",
   "options": [
    "3",
    "2",
    "4",
    "1"
   ],
   "answer": 1,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does carbon (C, Z = 6) belong?",
   "options": [
    "d block",
    "f block",
    "p block",
    "s block"
   ],
   "answer": 2,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is nitrogen (N, Z = 7)?",
   "options": [
    "3",
    "2",
    "1",
    "4"
   ],
   "answer": 1,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does nitrogen (N, Z = 7) belong?",
   "options": [
    "d block",
    "f block",
    "p block",
    "s block"
   ],
   "answer": 2,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is oxygen (O, Z = 8)?",
   "options": [
    "4",
    "2",
    "3",
    "1"
   ],
   "answer": 1,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does oxygen (O, Z = 8) belong?",
   "options": [
    "d block",
    "s block",
    "f block",
    "p block"
   ],
   "answer": 3,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is fluorine (F, Z = 9)?",
   "options": [
    "3",
    "2",
    "4",
    "1"
   ],
   "answer": 1,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does fluorine (F, Z = 9) belong?",
   "options": [
    "s block",
    "d block",
    "f block",
    "p block"
   ],
   "answer": 3,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is neon (Ne, Z = 10)?",
   "options": [
    "4",
    "3",
    "2",
    "1"
   ],
   "answer": 2,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does neon (Ne, Z = 10) belong?",
   "options": [
    "d block",
    "s block",
    "f block",
    "p block"
   ],
   "answer": 3,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is sodium (Na, Z = 11)?",
   "options": [
    "4",
    "5",
    "2",
    "3"
   ],
   "answer": 3,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does sodium (Na, Z = 11) belong?",
   "options": [
    "f block",
    "p block",
    "d block",
    "s block"
   ],
   "answer": 3,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is magnesium (Mg, Z = 12)?",
   "options": [
    "3",
    "4",
    "2",
    "5"
   ],
   "answer": 0,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does magnesium (Mg, Z = 12) belong?",
   "options": [
    "s block",
    "d block",
    "f block",
    "p block"
   ],
   "answer": 0,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is aluminium (Al, Z = 13)?",
   "options": [
    "2",
    "5",
    "3",
    "4"
   ],
   "answer": 2,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does aluminium (Al, Z = 13) belong?",
   "options": [
    "d block",
    "p block",
    "s block",
    "f block"
   ],
   "answer": 1,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is silicon (Si, Z = 14)?",
   "options": [
    "5",
    "3",
    "4",
    "2"
   ],
   "answer": 1,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does silicon (Si, Z = 14) belong?",
   "options": [
    "f block",
    "d block",
    "s block",
    "p block"
   ],
   "answer": 3,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is phosphorus (P, Z = 15)?",
   "options": [
    "2",
    "5",
    "3",
    "4"
   ],
   "answer": 2,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does phosphorus (P, Z = 15) belong?",
   "options": [
    "p block",
    "f block",
    "d block",
    "s block"
   ],
   "answer": 0,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is sulphur (S, Z = 16)?",
   "options": [
    "3",
    "4",
    "2",
    "5"
   ],
   "answer": 0,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does sulphur (S, Z = 16) belong?",
   "options": [
    "f block",
    "p block",
    "s block",
    "d block"
   ],
   "answer": 1,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is chlorine (Cl, Z = 17)?",
   "options": [
    "3",
    "4",
    "5",
    "2"
   ],
   "answer": 0,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does chlorine (Cl, Z = 17) belong?",
   "options": [
    "p block",
    "s block",
    "f block",
    "d block"
   ],
   "answer": 0,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is argon (Ar, Z = 18)?",
   "options": [
    "2",
    "3",
    "4",
    "5"
   ],
   "answer": 1,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does argon (Ar, Z = 18) belong?",
   "options": [
    "s block",
    "p block",
    "f block",
    "d block"
   ],
   "answer": 1,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is potassium (K, Z = 19)?",
   "options": [
    "4",
    "3",
    "5",
    "6"
   ],
   "answer": 0,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does potassium (K, Z = 19) belong?",
   "options": [
    "p block",
    "d block",
    "f block",
    "s block"
   ],
   "answer": 3,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is calcium (Ca, Z = 20)?",
   "options": [
    "5",
    "6",
    "3",
    "4"
   ],
   "answer": 3,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does calcium (Ca, Z = 20) belong?",
   "options": [
    "s block",
    "p block",
    "d block",
    "f block"
   ],
   "answer": 0,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is scandium (Sc, Z = 21)?",
   "options": [
    "3",
    "6",
    "5",
    "4"
   ],
   "answer": 3,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does scandium (Sc, Z = 21) belong?",
   "options": [
    "p block",
    "f block",
    "s block",
    "d block"
   ],
   "answer": 3,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is chromium (Cr, Z = 24)?",
   "options": [
    "3",
    "6",
    "4",
    "5"
   ],
   "answer": 2,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does chromium (Cr, Z = 24) belong?",
   "options": [
    "s block",
    "f block",
    "p block",
    "d block"
   ],
   "answer": 3,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is iron (Fe, Z = 26)?",
   "options": [
    "3",
    "5",
    "6",
    "4"
   ],
   "answer": 3,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does iron (Fe, Z = 26) belong?",
   "options": [
    "p block",
    "s block",
    "d block",
    "f block"
   ],
   "answer": 2,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is copper (Cu, Z = 29)?",
   "options": [
    "6",
    "5",
    "3",
    "4"
   ],
   "answer": 3,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does copper (Cu, Z = 29) belong?",
   "options": [
    "f block",
    "p block",
    "d block",
    "s block"
   ],
   "answer": 2,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is zinc (Zn, Z = 30)?",
   "options": [
    "5",
    "6",
    "4",
    "3"
   ],
   "answer": 2,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does zinc (Zn, Z = 30) belong?",
   "options": [
    "p block",
    "d block",
    "s block",
    "f block"
   ],
   "answer": 1,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is gallium (Ga, Z = 31)?",
   "options": [
    "5",
    "4",
    "6",
    "3"
   ],
   "answer": 1,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does gallium (Ga, Z = 31) belong?",
   "options": [
    "d block",
    "s block",
    "p block",
    "f block"
   ],
   "answer": 2,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is bromine (Br, Z = 35)?",
   "options": [
    "3",
    "5",
    "4",
    "6"
   ],
   "answer": 2,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does bromine (Br, Z = 35) belong?",
   "options": [
    "s block",
    "p block",
    "d block",
    "f block"
   ],
   "answer": 1,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "In which period is krypton (Kr, Z = 36)?",
   "options": [
    "5",
    "4",
    "6",
    "3"
   ],
   "answer": 1,
   "why": "The period is the highest shell n being filled.",
   "x": 1
  },
  {
   "q": "To which block does krypton (Kr, Z = 36) belong?",
   "options": [
    "s block",
    "f block",
    "p block",
    "d block"
   ],
   "answer": 2,
   "why": "The block is the subshell receiving the last electron.",
   "x": 1
  },
  {
   "q": "Li belongs to the family of:",
   "options": [
    "Noble gases",
    "Alkali metals",
    "Alkaline earth metals",
    "Halogens"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "Na belongs to the family of:",
   "options": [
    "Halogens",
    "Alkali metals",
    "Noble gases",
    "Alkaline earth metals"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "K belongs to the family of:",
   "options": [
    "Alkaline earth metals",
    "Alkali metals",
    "Halogens",
    "Noble gases"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "Be belongs to the family of:",
   "options": [
    "Halogens",
    "Alkaline earth metals",
    "Noble gases",
    "Alkali metals"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "Mg belongs to the family of:",
   "options": [
    "Alkaline earth metals",
    "Alkali metals",
    "Noble gases",
    "Halogens"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "Ca belongs to the family of:",
   "options": [
    "Alkali metals",
    "Noble gases",
    "Halogens",
    "Alkaline earth metals"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "F belongs to the family of:",
   "options": [
    "Alkali metals",
    "Noble gases",
    "Halogens",
    "Alkaline earth metals"
   ],
   "answer": 2,
   "why": "",
   "x": 1
  },
  {
   "q": "Cl belongs to the family of:",
   "options": [
    "Noble gases",
    "Halogens",
    "Alkaline earth metals",
    "Alkali metals"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "Br belongs to the family of:",
   "options": [
    "Alkaline earth metals",
    "Alkali metals",
    "Noble gases",
    "Halogens"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "Ne belongs to the family of:",
   "options": [
    "Alkaline earth metals",
    "Alkali metals",
    "Halogens",
    "Noble gases"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "Ar belongs to the family of:",
   "options": [
    "Alkaline earth metals",
    "Alkali metals",
    "Halogens",
    "Noble gases"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "Kr belongs to the family of:",
   "options": [
    "Alkaline earth metals",
    "Alkali metals",
    "Halogens",
    "Noble gases"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "How many elements are known today?",
   "options": [
    "31",
    "63",
    "118",
    "92"
   ],
   "answer": 2,
   "why": "Some are man-made.",
   "x": 1
  },
  {
   "q": "The modern periodic table has:",
   "options": [
    "18 periods and 7 columns",
    "7 periods and 18 columns",
    "10 periods and 10 columns",
    "8 periods and 7 columns"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "Which metal is liquid at normal temperature and pressure?",
   "options": [
    "Sodium",
    "Iron",
    "Copper",
    "Mercury"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "Metals typically:",
   "options": [
    "Have acidic oxides",
    "Are poor conductors",
    "Form anions",
    "Form cations and have basic oxides"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "Metalloids are:",
   "options": [
    "Semiconductors whose resistance decreases with temperature",
    "Gases",
    "Perfect conductors",
    "Always liquid"
   ],
   "answer": 0,
   "why": "On the stepped line between metals and non-metals.",
   "x": 1
  },
  {
   "q": "Malleable means a metal can be:",
   "options": [
    "Melted easily",
    "Dissolved in water",
    "Rolled into sheets",
    "Stretched into wires"
   ],
   "answer": 2,
   "why": "Ductile = stretched into wires.",
   "x": 1
  },
  {
   "q": "Elements of the same column have:",
   "options": [
    "The same Z",
    "The same number of shells",
    "The same outer-shell configuration",
    "The same mass"
   ],
   "answer": 2,
   "why": "",
   "x": 1
  },
  {
   "q": "Alkali metal oxides such as Na₂O give:",
   "options": [
    "Noble gases",
    "Strong bases (NaOH)",
    "Strong acids",
    "Neutral salts only"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "Alkaline earth metals are:",
   "options": [
    "Non-metals",
    "Bivalent and form M²⁺",
    "Halogens",
    "Monovalent"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "Halogens tend to:",
   "options": [
    "Be inert",
    "Lose two electrons",
    "Gain an electron to form X⁻",
    "Form M²⁺"
   ],
   "answer": 2,
   "why": "",
   "x": 1
  },
  {
   "q": "Noble gases have the outer configuration:",
   "options": [
    "ns¹",
    "ns²",
    "ns² np⁶ (He: 1s²)",
    "ns² np⁵"
   ],
   "answer": 2,
   "why": "",
   "x": 1
  },
  {
   "q": "Elements are ordered in the modern table by:",
   "options": [
    "Density",
    "Atomic mass",
    "Discovery date",
    "Atomic number Z"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "The d block elements are also called:",
   "options": [
    "Halogens",
    "Transition metals",
    "Alkali metals",
    "Noble gases"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "The f block elements are placed:",
   "options": [
    "In two rows below the table (the 'balconies')",
    "In column 1",
    "Above the table",
    "In column 18"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "In which group (column 1-18) is lithium (Li)?",
   "options": [
    "2",
    "1",
    "17",
    "11"
   ],
   "answer": 1,
   "why": "Main groups: 1, 2 and 13 to 18.",
   "x": 1
  },
  {
   "q": "In which group (column 1-18) is magnesium (Mg)?",
   "options": [
    "16",
    "1",
    "3",
    "2"
   ],
   "answer": 3,
   "why": "Main groups: 1, 2 and 13 to 18.",
   "x": 1
  },
  {
   "q": "In which group (column 1-18) is aluminium (Al)?",
   "options": [
    "5",
    "13",
    "12",
    "14"
   ],
   "answer": 1,
   "why": "Main groups: 1, 2 and 13 to 18.",
   "x": 1
  },
  {
   "q": "In which group (column 1-18) is carbon (C)?",
   "options": [
    "14",
    "4",
    "13",
    "15"
   ],
   "answer": 0,
   "why": "Main groups: 1, 2 and 13 to 18.",
   "x": 1
  },
  {
   "q": "In which group (column 1-18) is phosphorus (P)?",
   "options": [
    "3",
    "15",
    "14",
    "16"
   ],
   "answer": 1,
   "why": "Main groups: 1, 2 and 13 to 18.",
   "x": 1
  },
  {
   "q": "In which group (column 1-18) is sulphur (S)?",
   "options": [
    "15",
    "2",
    "16",
    "17"
   ],
   "answer": 2,
   "why": "Main groups: 1, 2 and 13 to 18.",
   "x": 1
  },
  {
   "q": "In which group (column 1-18) is fluorine (F)?",
   "options": [
    "16",
    "18",
    "1",
    "17"
   ],
   "answer": 3,
   "why": "Main groups: 1, 2 and 13 to 18.",
   "x": 1
  },
  {
   "q": "In which group (column 1-18) is bromine (Br)?",
   "options": [
    "16",
    "18",
    "1",
    "17"
   ],
   "answer": 3,
   "why": "Main groups: 1, 2 and 13 to 18.",
   "x": 1
  },
  {
   "q": "In which group (column 1-18) is argon (Ar)?",
   "options": [
    "18",
    "17",
    "19",
    "8"
   ],
   "answer": 0,
   "why": "Main groups: 1, 2 and 13 to 18.",
   "x": 1
  },
  {
   "q": "In which group (column 1-18) is potassium (K)?",
   "options": [
    "11",
    "1",
    "17",
    "2"
   ],
   "answer": 1,
   "why": "Main groups: 1, 2 and 13 to 18.",
   "x": 1
  },
  {
   "q": "In which group (column 1-18) is beryllium (Be)?",
   "options": [
    "3",
    "2",
    "1",
    "16"
   ],
   "answer": 1,
   "why": "Main groups: 1, 2 and 13 to 18.",
   "x": 1
  },
  {
   "q": "In which group (column 1-18) is nitrogen (N)?",
   "options": [
    "3",
    "15",
    "14",
    "16"
   ],
   "answer": 1,
   "why": "Main groups: 1, 2 and 13 to 18.",
   "x": 1
  },
  {
   "q": "In which group (column 1-18) is arsenic (As)?",
   "options": [
    "3",
    "14",
    "15",
    "16"
   ],
   "answer": 2,
   "why": "Main groups: 1, 2 and 13 to 18.",
   "x": 1
  },
  {
   "q": "In which group (column 1-18) is silicon (Si)?",
   "options": [
    "14",
    "13",
    "4",
    "15"
   ],
   "answer": 0,
   "why": "Main groups: 1, 2 and 13 to 18.",
   "x": 1
  }
 ],
 "cards": [
  {
   "id": "x0",
   "type": "text",
   "front": "Why classify elements?",
   "back": "Properties repeat periodically; the table predicts an element's behaviour in reactions and gathers its key data."
  },
  {
   "id": "x1",
   "type": "text",
   "front": "Metals vs non-metals vs metalloids?",
   "back": "Metals: shiny, malleable, ductile, conductors, cations, basic oxides. Non-metals: dull, brittle, poor conductors. Metalloids: semiconductors, resistance falls with temperature."
  },
  {
   "id": "x2",
   "type": "text",
   "front": "Organising principle of the modern table?",
   "back": "Increasing Z, following Klechkowski's rule; 7 periods (shells), 18 columns (families with the same outer configuration)."
  },
  {
   "id": "x3",
   "type": "text",
   "front": "The four blocks?",
   "back": "s: ns¹⁻² (IA, IIA). p: ns² np¹⁻⁶ (IIIA-VIIIA). d: ns² (n−1)d¹⁻¹⁰ (transition metals). f: lanthanides, actinides."
  },
  {
   "id": "x4",
   "type": "text",
   "front": "Alkali vs alkaline earth metals?",
   "back": "Alkali: ns¹, monovalent, M⁺, strong bases. Alkaline earths: ns², bivalent, M²⁺, strong bases."
  },
  {
   "id": "x5",
   "type": "text",
   "front": "Chalcogens and halogens?",
   "back": "Chalcogens: ns² np⁴, gain 2 e⁻, −2 (also +2, +4, +6). Halogens: ns² np⁵, gain 1 e⁻, −1, diatomic, strong acids HX."
  },
  {
   "id": "img-s",
   "type": "image",
   "target": "s",
   "front": "What is at the arrow, and why does it matter?",
   "back": "s block. Alkali metals (ns¹: Li, Na, K…; monovalent, strong bases) and alkaline earths (ns²: Be, Mg, Ca…; bivalent)."
  },
  {
   "id": "img-d",
   "type": "image",
   "target": "d",
   "front": "What is at the arrow, and why does it matter?",
   "back": "d block. Transition metals: three series of 10 elements in periods 4-6; many oxidation states."
  },
  {
   "id": "img-p",
   "type": "image",
   "target": "p",
   "front": "What is at the arrow, and why does it matter?",
   "back": "p block. ns² npˣ: boron, carbon, nitrogen families, chalcogens (ns² np⁴), halogens (ns² np⁵), noble gases (ns² np⁶)."
  },
  {
   "id": "img-f",
   "type": "image",
   "target": "f",
   "front": "What is at the arrow, and why does it matter?",
   "back": "f block. The 'balconies' filling f subshells."
  },
  {
   "id": "img-per",
   "type": "image",
   "target": "per",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Periods. Each row fills a new shell: ns, (n−2)f, (n−1)d, np."
  },
  {
   "id": "img-grp",
   "type": "image",
   "target": "grp",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Groups. Elements with the same outer-layer configuration share chemical properties."
  }
 ],
 "deeper": [
  {
   "title": "Why columns share chemistry",
   "html": "<p>Chemical reactions involve only the outer (valence) electrons. Elements in the same column have the same outer arrangement, for example ns¹ for all alkali metals, so they react in the same way: each gives up one electron to form a +1 ion. The inner shells only change the size and how easily that electron is lost.</p><p class='src'>Source: the lecture's construction principle slide.</p>"
  },
  {
   "title": "Why ordering by Z, not mass, fixed the table",
   "html": "<p>Early tables sorted elements by atomic mass, which put a few pairs in the wrong order. Sorting by atomic number, the number of protons and therefore electrons, lines every element up with its electron configuration, so properties repeat exactly where the configuration repeats.</p><p class='src'>Source: the lecture's modern classification slide.</p>"
  }
 ],
 "resources": [
  {
   "title": "Ptable: interactive periodic table",
   "url": "https://ptable.com/",
   "kind": "Website",
   "why": "Blocks, families and configurations for every element.",
   "note": ""
  },
  {
   "title": "Periodic table (Royal Society of Chemistry)",
   "url": "https://www.rsc.org/periodic-table",
   "kind": "Website",
   "why": "Element data and history.",
   "note": ""
  }
 ],
 "checks": [],
 "sources": [
  {
   "name": "Ptable: interactive periodic table",
   "url": "https://ptable.com/"
  },
  {
   "name": "Periodic table (Royal Society of Chemistry)",
   "url": "https://www.rsc.org/periodic-table"
  }
 ],
 "verified": "22 Sep 2026"
};
window.SINA = window.SINA || {subjects:[], lectures:{}};
SINA.lectures["chem1-bonds"] = {
 "id": "chem1-bonds",
 "subject": "chem1",
 "group": "General chemistry",
 "title": "Chemical bonds",
 "sourceFile": "Lecture 6 - General Chemistry: chemical bonds (2025-2026) (General Chemistry, Prof. Tarik Ouchbani)",
 "sourceUrl": "https://drive.google.com/file/d/1bnWUqxnAaCZNh4hnG0HgdRbBfkiIcrJ4/view?usp=drivesdk",
 "buildNote": "<strong>Built from the lecture slides.</strong> Slides that only show pictures are covered in outline. If your professor says something different, trust your professor.",
 "summary": [
  {
   "id": "s0",
   "title": "The big picture",
   "html": "<p>A <strong>chemical bond</strong> is the attractive force holding atoms or ions together, stabilising them by an overall <strong>loss of energy</strong>. Attractive forces lower energy; repulsive forces raise it. The stronger the bonds, the more stable the compound; weakly bonded compounds react to form stronger bonds.</p>"
  },
  {
   "id": "s1",
   "title": "Lewis and Kossel theories",
   "html": "<p><strong>Lewis</strong>: an atom is a positive <strong>kernel</strong> (nucleus + inner electrons) plus an outer shell holding at most <strong>eight</strong> electrons; the <strong>octet</strong> is a stable configuration. Atoms reach it by <strong>gaining or losing</strong> electrons (NaCl, MgCl₂) or by <strong>sharing</strong> (F₂); only <strong>valence electrons</strong> take part. <strong>Lewis symbols</strong> show valence electrons as dots (Li 1, O 6, Ne 8); valency = number of dots or 8 minus it. <strong>Kossel</strong>: noble gases separate the very electronegative halogens from the very electropositive alkali metals; ions with a noble-gas configuration (ns² np⁶) attract electrostatically: an <strong>electrovalent</strong> bond (e.g. MgCl₂). <strong>Duet rule</strong> for H (Z ≤ 4, structure of He); <strong>octet rule</strong> for periods 2 and 3. A shared electron pair (binding doublet) is drawn as a dash (H–H).</p>"
  },
  {
   "id": "s2",
   "title": "Types of bonds",
   "html": "<p><strong>Covalent</strong>: electrons <strong>shared</strong> between atoms (typical of organic, carbon compounds). <strong>Polar covalent</strong>: unequal sharing because the more <strong>electronegative</strong> atom pulls the pair; partial charges appear (water). <strong>Hydrogen bond</strong>: weaker than ionic or covalent bonds; a hydrogen bonded to an electronegative atom such as oxygen carries a partial positive charge and is attracted to the negative charges of a neighbouring atom; responsible for many properties of water. <strong>Ionic (electrovalent)</strong>: strong electrostatic attraction between cations and anions arranged in a <strong>crystal lattice</strong> stabilised by the <strong>lattice enthalpy</strong>; favoured by low <strong>ionisation energy</strong> of the cation-forming atom, high <strong>electron gain enthalpy</strong> of the anion-forming atom and high lattice enthalpy; typically <strong>metal + non-metal</strong>.</p>"
  },
  {
   "id": "s3",
   "title": "Lewis structures, valence, MO theory",
   "html": "<p><strong>Writing Lewis structures</strong>: (1) add the valence electrons (CH₄: 4 + 4 = 8); (2) add one electron per negative charge, subtract one per positive charge; (3) draw the skeleton and place bonding pairs; (4) the <strong>least electronegative atom is central</strong>, H and F terminal; (5) use remaining pairs for multiple bonds or lone pairs so each atom gets an octet. Example <strong>CO</strong>: 4 + 6 = 10 electrons → <strong>triple bond</strong> with a lone pair on each atom. <strong>Valence</strong> = number of covalent bonds an atom can make.</p><p><strong>Molecular orbital theory (LCAO)</strong>: only atomic orbitals of comparable symmetry and close energy combine; <strong>as many MOs form as AOs combined</strong>, each with a defined energy: <strong>bonding</strong> and <strong>antibonding</strong> (σ from axial overlap, π from side overlap). For A₂ molecules with Z ≤ 7, <strong>s-p interaction</strong> places π below σz. <strong>H₂</strong>: two 1s AOs give σ1s and σ*1s; configuration <strong>σ1s²</strong>. From the 8 valence AOs (2s, 2p) of second-period diatomics come 4 bonding and 4 antibonding MOs.</p>"
  }
 ],
 "exam": [
  "Bond = attraction lowering energy; stronger bonds = more stable compound.",
  "Lewis: kernel + up to 8 outer electrons; octet by gain, loss or sharing.",
  "Kossel: ions with noble-gas configuration → electrovalent bond.",
  "Duet rule for H; octet for periods 2-3.",
  "Covalent: shared pair. Polar covalent: unequal sharing (water).",
  "Hydrogen bond: weak, δ+ H attracted to electronegative neighbours.",
  "Ionic: cations + anions in a lattice; metal + non-metal.",
  "Lewis structure: count valence e⁻, central least electronegative atom, complete octets; CO has a triple bond.",
  "MO (LCAO): n AOs → n MOs, bonding and antibonding; σ axial, π lateral.",
  "H₂: σ1s²."
 ],
 "visual": {
  "kind": "model",
  "intro": "",
  "figure": {
   "viewBox": "0 0 760 420",
   "alt": "Types of chemical bonds",
   "caption": "From sharing to transfer. Schematic drawn for this site.",
   "base": "<defs><marker id=\"ah\" markerWidth=\"10\" markerHeight=\"8\" refX=\"9\" refY=\"4\" orient=\"auto\"><path d=\"M0,0 L10,4 L0,8 Z\" fill=\"#8a8a8a\"/></marker></defs><line stroke=\"#8a8a8a\" stroke-width=\"2\" marker-end=\"url(#ah)\" x1=\"240\" y1=\"70\" x2=\"280\" y2=\"70\"/><line stroke=\"#8a8a8a\" stroke-width=\"2\" marker-end=\"url(#ah)\" x1=\"480\" y1=\"70\" x2=\"520\" y2=\"70\"/>",
   "parts": {
    "cov": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#f2d7cf\" x=\"40\" y=\"40\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "Covalent: shared",
      "electron pair (H₂, F₂)"
     ],
     "lx": 140.0,
     "ly": 68.0
    },
    "pol": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#cfe3f2\" x=\"280\" y=\"40\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "Polar covalent: unequal",
      "sharing (H₂O)"
     ],
     "lx": 380.0,
     "ly": 68.0
    },
    "ion": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#d7edd2\" x=\"520\" y=\"40\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "Ionic: electron transfer,",
      "electrostatic (NaCl, MgCl₂)"
     ],
     "lx": 620.0,
     "ly": 68.0
    },
    "hb": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#f2e2a8\" x=\"40\" y=\"170\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "Hydrogen bond: weak,",
      "H near O, N, F"
     ],
     "lx": 140.0,
     "ly": 198.0
    },
    "oct": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#e3d5f0\" x=\"280\" y=\"170\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "Octet (duet for H):",
      "noble gas structure"
     ],
     "lx": 380.0,
     "ly": 198.0
    },
    "mo": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#f7d9b8\" x=\"520\" y=\"170\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "MO theory (LCAO):",
      "bonding + antibonding"
     ],
     "lx": 620.0,
     "ly": 198.0
    }
   },
   "arrows": {
    "cov": [
     {
      "t": [
       40.0,
       48.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "pol": [
     {
      "t": [
       280.0,
       48.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "ion": [
     {
      "t": [
       520.0,
       48.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "hb": [
     {
      "t": [
       40.0,
       178.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "oct": [
     {
      "t": [
       280.0,
       178.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "mo": [
     {
      "t": [
       520.0,
       178.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ]
   }
  },
  "mindmap": {
   "root": "Chemical bonds",
   "branches": [
    [
     "Theories",
     [
      "Lewis: octet, dots",
      "Kossel: ions",
      "Duet (H)"
     ]
    ],
    [
     "Bond types",
     [
      "Covalent",
      "Polar covalent",
      "Hydrogen bond",
      "Ionic"
     ]
    ],
    [
     "Lewis structures",
     [
      "Count valence e⁻",
      "Central: least electronegative",
      "Complete octets",
      "CO: triple bond"
     ]
    ],
    [
     "MO theory",
     [
      "LCAO",
      "Bonding / antibonding",
      "σ axial, π lateral",
      "H₂: σ1s²"
     ]
    ]
   ]
  }
 },
 "mcqs": [
  {
   "q": "Forming a chemical bond:",
   "options": [
    "Increases energy",
    "Has no energy change",
    "Destroys atoms",
    "Lowers the overall energy"
   ],
   "answer": 3,
   "why": "Stability comes from energy loss.",
   "slides": [
    {
     "src": "files/slides/chem1-bonds/36.jpg",
     "lec": "Chemical bonds",
     "n": 36
    }
   ]
  },
  {
   "q": "In Lewis theory, the kernel is:",
   "options": [
    "Only the nucleus",
    "A lone pair",
    "Nucleus + inner electrons",
    "The valence shell"
   ],
   "answer": 2,
   "why": "The outer shell holds up to 8 electrons.",
   "slides": [
    {
     "src": "files/slides/chem1-bonds/37.jpg",
     "lec": "Chemical bonds",
     "n": 37
    }
   ]
  },
  {
   "q": "Which electrons form chemical bonds?",
   "options": [
    "Valence electrons",
    "Inner electrons",
    "All electrons",
    "Nuclear particles"
   ],
   "answer": 0,
   "why": "Shown as dots in Lewis symbols.",
   "slides": [
    {
     "src": "files/slides/chem1-bonds/37.jpg",
     "lec": "Chemical bonds",
     "n": 37
    },
    {
     "src": "files/slides/chem1-bonds/47.jpg",
     "lec": "Chemical bonds",
     "n": 47
    }
   ]
  },
  {
   "q": "How many dots does oxygen's Lewis symbol have?",
   "options": [
    "4",
    "2",
    "6",
    "8"
   ],
   "answer": 2,
   "why": "Six valence electrons.",
   "slides": [
    {
     "src": "files/slides/chem1-bonds/38.jpg",
     "lec": "Chemical bonds",
     "n": 38
    }
   ]
  },
  {
   "q": "The duet rule applies to:",
   "options": [
    "Hydrogen",
    "Chlorine",
    "Sodium",
    "Carbon"
   ],
   "answer": 0,
   "why": "It reaches the He structure.",
   "slides": [
    {
     "src": "files/slides/chem1-bonds/50.jpg",
     "lec": "Chemical bonds",
     "n": 50
    }
   ]
  },
  {
   "q": "A covalent bond is formed by:",
   "options": [
    "Hydrogen only",
    "Sharing of an electron pair",
    "Transfer of electrons",
    "Attraction between ions"
   ],
   "answer": 1,
   "why": "Typical of carbon compounds.",
   "slides": [
    {
     "src": "files/slides/chem1-bonds/41.jpg",
     "lec": "Chemical bonds",
     "n": 41
    }
   ]
  },
  {
   "q": "In a polar covalent bond:",
   "options": [
    "No electrons are shared",
    "Electrons are shared equally",
    "Electronegative atom pulls pair",
    "Ions are formed"
   ],
   "answer": 2,
   "why": "Water is an example.",
   "slides": [
    {
     "src": "files/slides/chem1-bonds/42.jpg",
     "lec": "Chemical bonds",
     "n": 42
    }
   ]
  },
  {
   "q": "Compared with ionic and covalent bonds, hydrogen bonds are:",
   "options": [
    "Stronger",
    "Identical",
    "Nuclear",
    "Weaker"
   ],
   "answer": 3,
   "why": "They shape water's properties.",
   "slides": [
    {
     "src": "files/slides/chem1-bonds/43.jpg",
     "lec": "Chemical bonds",
     "n": 43
    }
   ]
  },
  {
   "q": "An ionic bond typically forms between:",
   "options": [
    "Two non-metals",
    "A metal and a non-metal",
    "Two identical atoms",
    "Two noble gases"
   ],
   "answer": 1,
   "why": "E.g. NaCl, MgCl₂.",
   "slides": [
    {
     "src": "files/slides/chem1-bonds/45.jpg",
     "lec": "Chemical bonds",
     "n": 45
    }
   ]
  },
  {
   "q": "Which favours ionic bond formation?",
   "options": [
    "Low ionisation energy of the cation-forming atom",
    "Low lattice enthalpy",
    "Equal electronegativities",
    "High ionisation energy of the metal"
   ],
   "answer": 0,
   "why": "Plus high electron gain enthalpy of the anion-forming atom.",
   "slides": [
    {
     "src": "files/slides/chem1-bonds/45.jpg",
     "lec": "Chemical bonds",
     "n": 45
    }
   ]
  },
  {
   "q": "In a Lewis structure, the central atom is usually the:",
   "options": [
    "Least electronegative",
    "Fluorine",
    "Hydrogen",
    "Most electronegative"
   ],
   "answer": 0,
   "why": "H and F are terminal.",
   "slides": [
    {
     "src": "files/slides/chem1-bonds/48.jpg",
     "lec": "Chemical bonds",
     "n": 48
    }
   ]
  },
  {
   "q": "How many valence electrons does CO have in total?",
   "options": [
    "14",
    "12",
    "8",
    "10"
   ],
   "answer": 3,
   "why": "4 (C) + 6 (O); triple bond.",
   "slides": [
    {
     "src": "files/slides/chem1-bonds/49.jpg",
     "lec": "Chemical bonds",
     "n": 49
    }
   ]
  },
  {
   "q": "In LCAO theory, combining 2 atomic orbitals gives:",
   "options": [
    "1 MO",
    "4 MOs",
    "No MOs",
    "2 MOs"
   ],
   "answer": 3,
   "why": "Number of MOs = number of AOs.",
   "slides": [
    {
     "src": "files/slides/chem1-bonds/53.jpg",
     "lec": "Chemical bonds",
     "n": 53
    }
   ]
  },
  {
   "q": "A π molecular orbital comes from:",
   "options": [
    "Side (lateral) overlap",
    "s orbitals only",
    "Axial overlap",
    "Nuclear fusion"
   ],
   "answer": 0,
   "why": "σ comes from axial overlap.",
   "slides": [
    {
     "src": "files/slides/chem1-bonds/55.jpg",
     "lec": "Chemical bonds",
     "n": 55
    },
    {
     "src": "files/slides/chem1-bonds/56.jpg",
     "lec": "Chemical bonds",
     "n": 56
    }
   ]
  },
  {
   "q": "The electron configuration of H₂ is:",
   "options": [
    "σ1s² σ*1s²",
    "σ1s²",
    "σ1s¹",
    "σ*1s²"
   ],
   "answer": 1,
   "why": "Both electrons in the bonding MO.",
   "slides": [
    {
     "src": "files/slides/chem1-bonds/37.jpg",
     "lec": "Chemical bonds",
     "n": 37
    },
    {
     "src": "files/slides/chem1-bonds/39.jpg",
     "lec": "Chemical bonds",
     "n": 39
    }
   ]
  },
  {
   "q": "Which element is at the arrow?",
   "target": "cov",
   "options": [
    "Ionic bond",
    "Hydrogen bond",
    "Polar covalent",
    "Covalent bond"
   ],
   "answer": 3,
   "why": "The arrow points to: Covalent bond. Two atoms share a pair of electrons (a binding doublet), common in carbon compounds."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "pol",
   "options": [
    "Covalent bond",
    "Hydrogen bond",
    "Polar covalent",
    "Octet and duet rules"
   ],
   "answer": 2,
   "why": "The arrow points to: Polar covalent. The more electronegative atom pulls the shared pair, creating partial charges δ+ and δ−."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "ion",
   "options": [
    "Polar covalent",
    "Ionic bond",
    "Hydrogen bond",
    "Octet and duet rules"
   ],
   "answer": 1,
   "why": "The arrow points to: Ionic bond. Electrostatic attraction between cations and anions in a crystal lattice; favoured by low ionisation energy and high lattice enthalpy."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "hb",
   "options": [
    "Polar covalent",
    "Hydrogen bond",
    "Octet and duet rules",
    "Ionic bond"
   ],
   "answer": 1,
   "why": "The arrow points to: Hydrogen bond. Weaker attraction between a δ+ hydrogen and a lone pair on a neighbouring electronegative atom; explains many properties of water."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "oct",
   "options": [
    "Octet and duet rules",
    "Hydrogen bond",
    "Ionic bond",
    "Molecular orbitals"
   ],
   "answer": 0,
   "why": "The arrow points to: Octet and duet rules. Atoms gain, lose or share electrons to reach 8 outer electrons (2 for H)."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "mo",
   "options": [
    "Covalent bond",
    "Ionic bond",
    "Molecular orbitals",
    "Hydrogen bond"
   ],
   "answer": 2,
   "why": "The arrow points to: Molecular orbitals. Atomic orbitals of similar energy and symmetry combine: as many MOs as AOs, bonding and antibonding."
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of H₂O?",
   "options": [
    "6",
    "9",
    "8",
    "10"
   ],
   "answer": 2,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of NH₃?",
   "options": [
    "9",
    "6",
    "8",
    "10"
   ],
   "answer": 2,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of CH₄?",
   "options": [
    "6",
    "8",
    "10",
    "9"
   ],
   "answer": 1,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of CO₂?",
   "options": [
    "18",
    "17",
    "16",
    "14"
   ],
   "answer": 2,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of N₂?",
   "options": [
    "10",
    "8",
    "11",
    "12"
   ],
   "answer": 0,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of O₂?",
   "options": [
    "14",
    "12",
    "13",
    "10"
   ],
   "answer": 1,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of HCN?",
   "options": [
    "10",
    "8",
    "11",
    "12"
   ],
   "answer": 0,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of NH₄⁺?",
   "options": [
    "10",
    "6",
    "8",
    "9"
   ],
   "answer": 2,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of OH⁻?",
   "options": [
    "9",
    "10",
    "8",
    "6"
   ],
   "answer": 2,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of H₃O⁺?",
   "options": [
    "10",
    "6",
    "9",
    "8"
   ],
   "answer": 3,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of NO₃⁻?",
   "options": [
    "24",
    "22",
    "25",
    "26"
   ],
   "answer": 0,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of SO₄²⁻?",
   "options": [
    "33",
    "34",
    "32",
    "30"
   ],
   "answer": 2,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of CO₃²⁻?",
   "options": [
    "24",
    "26",
    "25",
    "22"
   ],
   "answer": 0,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of Cl₂?",
   "options": [
    "12",
    "15",
    "14",
    "16"
   ],
   "answer": 2,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of HCl?",
   "options": [
    "10",
    "6",
    "8",
    "9"
   ],
   "answer": 2,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of C₂H₆?",
   "options": [
    "15",
    "12",
    "16",
    "14"
   ],
   "answer": 3,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of C₂H₄?",
   "options": [
    "10",
    "13",
    "12",
    "14"
   ],
   "answer": 2,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of C₂H₂?",
   "options": [
    "10",
    "12",
    "8",
    "11"
   ],
   "answer": 0,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of PCl₃?",
   "options": [
    "27",
    "28",
    "24",
    "26"
   ],
   "answer": 3,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of H₂S?",
   "options": [
    "8",
    "10",
    "6",
    "9"
   ],
   "answer": 0,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of CCl₄?",
   "options": [
    "32",
    "34",
    "33",
    "30"
   ],
   "answer": 0,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "How many valence electrons are used to draw the Lewis structure of F₂?",
   "options": [
    "16",
    "14",
    "15",
    "12"
   ],
   "answer": 1,
   "why": "Add the valence electrons; add one per negative charge, subtract one per positive charge.",
   "x": 1
  },
  {
   "q": "The bond between Na and Cl is mainly:",
   "options": [
    "Polar covalent",
    "Pure (non-polar) covalent",
    "Metallic",
    "Ionic"
   ],
   "answer": 3,
   "why": "Metal + non-metal: ionic; identical atoms: pure covalent; different non-metals: polar covalent.",
   "x": 1
  },
  {
   "q": "The bond between Mg and O is mainly:",
   "options": [
    "Ionic",
    "Pure (non-polar) covalent",
    "Metallic",
    "Polar covalent"
   ],
   "answer": 0,
   "why": "Metal + non-metal: ionic; identical atoms: pure covalent; different non-metals: polar covalent.",
   "x": 1
  },
  {
   "q": "The bond between K and Br is mainly:",
   "options": [
    "Ionic",
    "Pure (non-polar) covalent",
    "Polar covalent",
    "Metallic"
   ],
   "answer": 0,
   "why": "Metal + non-metal: ionic; identical atoms: pure covalent; different non-metals: polar covalent.",
   "x": 1
  },
  {
   "q": "The bond between Ca and F is mainly:",
   "options": [
    "Ionic",
    "Pure (non-polar) covalent",
    "Polar covalent",
    "Metallic"
   ],
   "answer": 0,
   "why": "Metal + non-metal: ionic; identical atoms: pure covalent; different non-metals: polar covalent.",
   "x": 1
  },
  {
   "q": "The bond between H and H is mainly:",
   "options": [
    "Metallic",
    "Pure (non-polar) covalent",
    "Polar covalent",
    "Ionic"
   ],
   "answer": 1,
   "why": "Metal + non-metal: ionic; identical atoms: pure covalent; different non-metals: polar covalent.",
   "x": 1
  },
  {
   "q": "The bond between Cl and Cl is mainly:",
   "options": [
    "Ionic",
    "Pure (non-polar) covalent",
    "Metallic",
    "Polar covalent"
   ],
   "answer": 1,
   "why": "Metal + non-metal: ionic; identical atoms: pure covalent; different non-metals: polar covalent.",
   "x": 1
  },
  {
   "q": "The bond between O and O is mainly:",
   "options": [
    "Metallic",
    "Ionic",
    "Polar covalent",
    "Pure (non-polar) covalent"
   ],
   "answer": 3,
   "why": "Metal + non-metal: ionic; identical atoms: pure covalent; different non-metals: polar covalent.",
   "x": 1
  },
  {
   "q": "The bond between H and Cl is mainly:",
   "options": [
    "Pure (non-polar) covalent",
    "Polar covalent",
    "Metallic",
    "Ionic"
   ],
   "answer": 1,
   "why": "Metal + non-metal: ionic; identical atoms: pure covalent; different non-metals: polar covalent.",
   "x": 1
  },
  {
   "q": "The bond between H and O is mainly:",
   "options": [
    "Pure (non-polar) covalent",
    "Ionic",
    "Polar covalent",
    "Metallic"
   ],
   "answer": 2,
   "why": "Metal + non-metal: ionic; identical atoms: pure covalent; different non-metals: polar covalent.",
   "x": 1
  },
  {
   "q": "The bond between N and H is mainly:",
   "options": [
    "Polar covalent",
    "Pure (non-polar) covalent",
    "Metallic",
    "Ionic"
   ],
   "answer": 0,
   "why": "Metal + non-metal: ionic; identical atoms: pure covalent; different non-metals: polar covalent.",
   "x": 1
  },
  {
   "q": "The bond between C and O is mainly:",
   "options": [
    "Pure (non-polar) covalent",
    "Metallic",
    "Polar covalent",
    "Ionic"
   ],
   "answer": 2,
   "why": "Metal + non-metal: ionic; identical atoms: pure covalent; different non-metals: polar covalent.",
   "x": 1
  },
  {
   "q": "The bond between Li and F is mainly:",
   "options": [
    "Ionic",
    "Polar covalent",
    "Pure (non-polar) covalent",
    "Metallic"
   ],
   "answer": 0,
   "why": "Metal + non-metal: ionic; identical atoms: pure covalent; different non-metals: polar covalent.",
   "x": 1
  },
  {
   "q": "How many covalent bonds does H usually form (its valence)?",
   "options": [
    "3",
    "5",
    "1",
    "2"
   ],
   "answer": 2,
   "why": "Valence = number of single electrons available, or 8 minus the number of valence electrons.",
   "x": 1
  },
  {
   "q": "How many covalent bonds does O usually form (its valence)?",
   "options": [
    "4",
    "2",
    "1",
    "3"
   ],
   "answer": 1,
   "why": "Valence = number of single electrons available, or 8 minus the number of valence electrons.",
   "x": 1
  },
  {
   "q": "How many covalent bonds does N usually form (its valence)?",
   "options": [
    "5",
    "3",
    "4",
    "2"
   ],
   "answer": 1,
   "why": "Valence = number of single electrons available, or 8 minus the number of valence electrons.",
   "x": 1
  },
  {
   "q": "How many covalent bonds does C usually form (its valence)?",
   "options": [
    "5",
    "3",
    "4",
    "6"
   ],
   "answer": 2,
   "why": "Valence = number of single electrons available, or 8 minus the number of valence electrons.",
   "x": 1
  },
  {
   "q": "How many covalent bonds does F usually form (its valence)?",
   "options": [
    "1",
    "5",
    "3",
    "2"
   ],
   "answer": 0,
   "why": "Valence = number of single electrons available, or 8 minus the number of valence electrons.",
   "x": 1
  },
  {
   "q": "How many covalent bonds does Cl usually form (its valence)?",
   "options": [
    "5",
    "2",
    "3",
    "1"
   ],
   "answer": 3,
   "why": "Valence = number of single electrons available, or 8 minus the number of valence electrons.",
   "x": 1
  },
  {
   "q": "How many covalent bonds does S usually form (its valence)?",
   "options": [
    "3",
    "1",
    "2",
    "4"
   ],
   "answer": 2,
   "why": "Valence = number of single electrons available, or 8 minus the number of valence electrons.",
   "x": 1
  },
  {
   "q": "How many lone pairs are on the central atom of H₂O?",
   "options": [
    "4",
    "2",
    "1",
    "3"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "How many lone pairs are on the central atom of NH₃?",
   "options": [
    "3",
    "2",
    "0",
    "1"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "How many lone pairs are on the central atom of CH₄?",
   "options": [
    "1",
    "0",
    "3",
    "2"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "How many lone pairs are on the central atom of H₂S?",
   "options": [
    "2",
    "1",
    "3",
    "4"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "How many lone pairs are on the central atom of HCl (on Cl)?",
   "options": [
    "5",
    "2",
    "4",
    "3"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "Combining 2 atomic orbitals gives how many molecular orbitals?",
   "options": [
    "2",
    "1",
    "3",
    "4"
   ],
   "answer": 0,
   "why": "As many MOs as AOs combined (half bonding, half antibonding).",
   "x": 1
  },
  {
   "q": "Combining 4 atomic orbitals gives how many molecular orbitals?",
   "options": [
    "2",
    "8",
    "4",
    "5"
   ],
   "answer": 2,
   "why": "As many MOs as AOs combined (half bonding, half antibonding).",
   "x": 1
  },
  {
   "q": "Combining 6 atomic orbitals gives how many molecular orbitals?",
   "options": [
    "7",
    "12",
    "6",
    "3"
   ],
   "answer": 2,
   "why": "As many MOs as AOs combined (half bonding, half antibonding).",
   "x": 1
  },
  {
   "q": "Combining 8 atomic orbitals gives how many molecular orbitals?",
   "options": [
    "4",
    "9",
    "16",
    "8"
   ],
   "answer": 3,
   "why": "As many MOs as AOs combined (half bonding, half antibonding).",
   "x": 1
  },
  {
   "q": "A dash (H–H) in a Lewis structure represents:",
   "options": [
    "A single electron",
    "A shared electron pair (binding doublet)",
    "An ionic charge",
    "A lone pair"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "Which is NOT a step in writing a Lewis structure?",
   "options": [
    "Completing octets with lone pairs or multiple bonds",
    "Placing H as the central atom",
    "Adding electrons for negative charges",
    "Counting valence electrons"
   ],
   "answer": 1,
   "why": "H and F are terminal.",
   "x": 1
  },
  {
   "q": "The CO molecule contains:",
   "options": [
    "A single bond",
    "A triple bond and one lone pair on each atom",
    "An ionic bond",
    "A double bond and no lone pairs"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "Hydrogen bonds are responsible for many properties of:",
   "options": [
    "Sodium metal",
    "Noble gases",
    "Methane",
    "Water"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "Ionic compounds form:",
   "options": [
    "Gases at room temperature",
    "A crystal lattice stabilised by lattice enthalpy",
    "Discrete molecules only",
    "Metallic bonds"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "Kossel's theory explains:",
   "options": [
    "The electrovalent (ionic) bond",
    "Molecular orbitals",
    "Hydrogen bonds",
    "The covalent bond"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "The octet rule applies to atoms of:",
   "options": [
    "Transition metals only",
    "Periods 2 and 3",
    "Period 1 only",
    "Noble gases only"
   ],
   "answer": 1,
   "why": "H follows the duet rule.",
   "x": 1
  },
  {
   "q": "A σ molecular orbital comes from:",
   "options": [
    "Axial (head-on) overlap",
    "Ionic attraction",
    "Side overlap",
    "No overlap"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "For A₂ molecules with Z ≤ 7, s-p interaction places:",
   "options": [
    "All MOs at the same energy",
    "σ*2s below σ2s",
    "π below σz",
    "σz below π"
   ],
   "answer": 2,
   "why": "",
   "x": 1
  },
  {
   "q": "From the 8 valence AOs (2s, 2p) of a second-period diatomic, we get:",
   "options": [
    "8 bonding MOs",
    "2 bonding and 6 antibonding",
    "4 bonding and 4 antibonding MOs",
    "4 MOs in total"
   ],
   "answer": 2,
   "why": "",
   "x": 1
  },
  {
   "q": "Covalent bonds are typical of:",
   "options": [
    "Organic (carbon) compounds",
    "Noble gases",
    "Metal salts",
    "Alloys"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "Weakly bonded compounds tend to:",
   "options": [
    "Have high bond energy",
    "Be the most stable",
    "Never react",
    "React to form stronger bonds"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "How many valence electrons does SO₂ have in total for its Lewis structure?",
   "options": [
    "19",
    "18",
    "16",
    "20"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "How many valence electrons does O₃ have in total for its Lewis structure?",
   "options": [
    "18",
    "16",
    "19",
    "20"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "How many valence electrons does NO₂⁻ have in total for its Lewis structure?",
   "options": [
    "16",
    "20",
    "19",
    "18"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "How many valence electrons does CH₃OH have in total for its Lewis structure?",
   "options": [
    "14",
    "12",
    "15",
    "16"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "How many valence electrons does H₂O₂ have in total for its Lewis structure?",
   "options": [
    "12",
    "15",
    "16",
    "14"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "How many valence electrons does BF₃ have in total for its Lewis structure?",
   "options": [
    "24",
    "26",
    "22",
    "25"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "How many valence electrons does SiH₄ have in total for its Lewis structure?",
   "options": [
    "10",
    "6",
    "8",
    "9"
   ],
   "answer": 2,
   "why": "",
   "x": 1
  },
  {
   "q": "How many valence electrons does PH₃ have in total for its Lewis structure?",
   "options": [
    "8",
    "6",
    "9",
    "10"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "How many valence electrons does CN⁻ have in total for its Lewis structure?",
   "options": [
    "10",
    "12",
    "11",
    "8"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "How many valence electrons does NO⁺ have in total for its Lewis structure?",
   "options": [
    "10",
    "8",
    "12",
    "11"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "The bond between K and Cl is mainly:",
   "options": [
    "Pure (non-polar) covalent",
    "Ionic",
    "Metallic",
    "Polar covalent"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "The bond between N and N is mainly:",
   "options": [
    "Pure (non-polar) covalent",
    "Ionic",
    "Polar covalent",
    "Metallic"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "The bond between C and H is mainly:",
   "options": [
    "Metallic",
    "Pure (non-polar) covalent",
    "Polar covalent",
    "Ionic"
   ],
   "answer": 2,
   "why": "",
   "x": 1
  },
  {
   "q": "The bond between Na and O is mainly:",
   "options": [
    "Metallic",
    "Pure (non-polar) covalent",
    "Ionic",
    "Polar covalent"
   ],
   "answer": 2,
   "why": "",
   "x": 1
  },
  {
   "q": "The bond between F and F is mainly:",
   "options": [
    "Ionic",
    "Pure (non-polar) covalent",
    "Polar covalent",
    "Metallic"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "The bond between S and O is mainly:",
   "options": [
    "Polar covalent",
    "Metallic",
    "Pure (non-polar) covalent",
    "Ionic"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "The bond between Mg and Cl is mainly:",
   "options": [
    "Pure (non-polar) covalent",
    "Metallic",
    "Ionic",
    "Polar covalent"
   ],
   "answer": 2,
   "why": "",
   "x": 1
  },
  {
   "q": "The bond between H and F is mainly:",
   "options": [
    "Pure (non-polar) covalent",
    "Polar covalent",
    "Ionic",
    "Metallic"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "In MgCl₂, magnesium:",
   "options": [
    "Shares 4 electrons",
    "Keeps its electrons",
    "Gains 2 electrons",
    "Loses 2 electrons to reach a noble-gas configuration"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "In F₂, the octet is reached by:",
   "options": [
    "Electron transfer",
    "Sharing one electron pair",
    "A triple bond",
    "Losing 7 electrons"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "The Lewis symbol of lithium has:",
   "options": [
    "2 dots",
    "3 dots",
    "1 dot",
    "7 dots"
   ],
   "answer": 2,
   "why": "One valence electron.",
   "x": 1
  },
  {
   "q": "The Lewis symbol of neon has:",
   "options": [
    "2 dots",
    "8 dots",
    "0 dots",
    "10 dots"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "A polar covalent bond carries:",
   "options": [
    "No charge separation",
    "Partial charges δ+ and δ−",
    "Full ionic charges",
    "Only positive charges"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "The configuration of H₂ in MO theory is σ1s². Its antibonding orbital σ*1s is:",
   "options": [
    "Absent",
    "Empty",
    "Full",
    "Half-filled"
   ],
   "answer": 1,
   "why": "",
   "x": 1
  },
  {
   "q": "In the Lewis structure of N₂, the nitrogen atoms are joined by:",
   "options": [
    "A single bond",
    "A double bond",
    "An ionic bond",
    "A triple bond"
   ],
   "answer": 3,
   "why": "10 valence electrons: N≡N with one lone pair each.",
   "x": 1
  },
  {
   "q": "In CO₂, each oxygen is joined to carbon by:",
   "options": [
    "A triple bond",
    "A double bond",
    "A hydrogen bond",
    "A single bond"
   ],
   "answer": 1,
   "why": "O=C=O, 16 valence electrons.",
   "x": 1
  }
 ],
 "cards": [
  {
   "id": "x0",
   "type": "text",
   "front": "Define a chemical bond.",
   "back": "The attractive force holding atoms/ions together, stabilising them by an overall loss of energy."
  },
  {
   "id": "x1",
   "type": "text",
   "front": "Lewis theory of bonding?",
   "back": "Atom = kernel + outer shell (max 8); octet reached by gaining, losing or sharing valence electrons; Lewis symbols show valence electrons as dots."
  },
  {
   "id": "x2",
   "type": "text",
   "front": "Kossel theory?",
   "back": "Halogens gain and alkali metals lose electrons to reach noble-gas configuration; the ions attract electrostatically (electrovalent bond)."
  },
  {
   "id": "x3",
   "type": "text",
   "front": "Octet and duet rules?",
   "back": "Atoms reach a noble-gas structure: 2 electrons for H (duet), 8 for periods 2-3 (octet)."
  },
  {
   "id": "x4",
   "type": "text",
   "front": "Four main bond types?",
   "back": "Covalent (shared pair), polar covalent (unequal sharing), hydrogen bond (weak δ+ H attraction), ionic (electrostatic between ions)."
  },
  {
   "id": "x5",
   "type": "text",
   "front": "Conditions for ionic bonding?",
   "back": "Low ionisation energy (cation), high electron gain enthalpy (anion), high lattice enthalpy; usually metal + non-metal."
  },
  {
   "id": "x6",
   "type": "text",
   "front": "Steps to write a Lewis structure?",
   "back": "Count valence e⁻ (adjust for charge), draw skeleton with least electronegative atom central, place bonding pairs, complete octets with lone pairs or multiple bonds."
  },
  {
   "id": "x7",
   "type": "text",
   "front": "Principles of MO (LCAO) theory?",
   "back": "AOs of similar symmetry and energy combine; n AOs → n MOs (bonding and antibonding); σ axial, π lateral overlap; H₂ = σ1s²."
  },
  {
   "id": "img-cov",
   "type": "image",
   "target": "cov",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Covalent bond. Two atoms share a pair of electrons (a binding doublet), common in carbon compounds."
  },
  {
   "id": "img-pol",
   "type": "image",
   "target": "pol",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Polar covalent. The more electronegative atom pulls the shared pair, creating partial charges δ+ and δ−."
  },
  {
   "id": "img-ion",
   "type": "image",
   "target": "ion",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Ionic bond. Electrostatic attraction between cations and anions in a crystal lattice; favoured by low ionisation energy and high lattice enthalpy."
  },
  {
   "id": "img-hb",
   "type": "image",
   "target": "hb",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Hydrogen bond. Weaker attraction between a δ+ hydrogen and a lone pair on a neighbouring electronegative atom; explains many properties of water."
  },
  {
   "id": "img-oct",
   "type": "image",
   "target": "oct",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Octet and duet rules. Atoms gain, lose or share electrons to reach 8 outer electrons (2 for H)."
  },
  {
   "id": "img-mo",
   "type": "image",
   "target": "mo",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Molecular orbitals. Atomic orbitals of similar energy and symmetry combine: as many MOs as AOs, bonding and antibonding."
  }
 ],
 "deeper": [
  {
   "title": "Why CO needs a triple bond",
   "html": "<p>Carbon brings 4 valence electrons and oxygen 6, 10 in all. A single bond plus lone pairs completes oxygen's octet but leaves carbon with only 4 electrons around it. Moving lone pairs into shared pairs until both atoms have 8 gives a triple bond, which also explains why carbon monoxide is so stable and binds haemoglobin so tightly.</p><p class='src'>Source: the lecture's Lewis structure example.</p>"
  },
  {
   "title": "Why antibonding orbitals exist",
   "html": "<p>When two atomic orbitals combine, their waves can add in phase, building electron density between the nuclei (bonding, lower energy), or out of phase, leaving a node between them (antibonding, higher energy). Both always form together, which is why the number of molecular orbitals equals the number of atomic orbitals combined.</p><p class='src'>Source: the lecture's molecular orbital slides.</p>"
  }
 ],
 "resources": [
  {
   "title": "Chemical bonds (Khan Academy)",
   "url": "https://www.khanacademy.org/science/chemistry/chemical-bonds",
   "kind": "Website",
   "why": "Ionic, covalent and polar bonds, Lewis structures.",
   "note": ""
  },
  {
   "title": "Molecular orbital theory (Chemistry LibreTexts)",
   "url": "https://chem.libretexts.org/",
   "kind": "Website",
   "why": "Search 'molecular orbital theory' for diagrams.",
   "note": ""
  }
 ],
 "checks": [],
 "sources": [
  {
   "name": "Chemical bonds (Khan Academy)",
   "url": "https://www.khanacademy.org/science/chemistry/chemical-bonds"
  },
  {
   "name": "Molecular orbital theory (Chemistry LibreTexts)",
   "url": "https://chem.libretexts.org/"
  }
 ],
 "verified": "22 Sep 2026"
};
window.SINA = window.SINA || {subjects:[], lectures:{}};
SINA.lectures["chem1-solutions"] = {
 "id": "chem1-solutions",
 "subject": "chem1",
 "group": "General chemistry",
 "title": "Chemistry in solutions",
 "sourceFile": "General chemistry 6+7: Chapter IV Chemistry in solutions (2022-2023) (General Chemistry, Prof. Tarik Ouchbani)",
 "sourceUrl": "https://drive.google.com/file/d/1RxHn5W7gkw1peYCCL72PvYf8gSYcPbO_/view?usp=drivesdk",
 "buildNote": "<strong>Built from the lecture slides.</strong> Slides that only show pictures are covered in outline. If your professor says something different, trust your professor.",
 "summary": [
  {
   "id": "s0",
   "title": "The big picture",
   "html": "<p>A <strong>solution</strong> is a <strong>homogeneous mixture</strong> of two or more components with particles <strong>smaller than 1 nm</strong>, forming a single phase (sugar or salt in water, soda water). The <strong>solvent</strong> dissolves the <strong>solute</strong> and is usually in greater amount; either can be solid, liquid or gas, giving <strong>nine types</strong> of solutions (air: gas in gas; alloys: solid solutions; tincture of iodine: iodine in alcohol). Properties: homogeneous, particles invisible, <strong>no light scattering</strong>, stable (no sedimentation), <strong>not separable by filtration</strong>.</p>"
  },
  {
   "id": "s1",
   "title": "Concentration",
   "html": "<p>'Dilute' and 'concentrated' are qualitative. Quantitative units: <strong>mass concentration</strong> (amount of solute per litre); <strong>ppm, ppb, ppt</strong> (for dilute aqueous solutions, 1 kg ≈ 1 L, so <strong>1 ppm = 1 mg/L</strong>, 1 ppb = 1 µg/L, 1 ppt = 1 ng/L); <strong>mass %</strong> (w/w); <strong>volume %</strong> (v/v); <strong>mass/volume %</strong> (w/v: grams per 100 mL, used in pharmacy); <strong>molarity</strong> (M = moles of solute per <strong>litre of solution</strong>; 0.25 M ethanol = 0.25 mol per litre; n = m/M_solute = C·V); <strong>molality</strong> (m = moles per <strong>kg of solvent</strong>); <strong>normality</strong> (gram equivalents per litre; <strong>N = molarity × valency</strong>, i.e. × number of H⁺ or OH⁻); <strong>mole fraction</strong> x_A = n_A/(n_A + n_B). Molarity depends on <strong>temperature</strong>; molality and mole fraction do not.</p>"
  },
  {
   "id": "s2",
   "title": "Dilution and safety",
   "html": "<p><strong>Dilution</strong> adds solvent to lower concentration; <strong>concentration</strong> removes solvent. Moles of solute stay constant, so <strong>M₁V₁ = M₂V₂</strong>. Safety: <strong>always add acid to water</strong>, never water to concentrated acid: mixing releases heat, and water poured into acid can boil and spatter concentrated acid; acid added to water warms a large volume of water only slightly.</p>"
  },
  {
   "id": "s3",
   "title": "Aqueous solutions, saturation, acids and bases",
   "html": "<p>An <strong>aqueous solution</strong> has water as solvent. The body is ~65% water (22% of bone, up to 76% of brain; ~45 L in a 70 kg person). Water is an <strong>ionising solvent</strong> transporting nutrients, wastes and gases; it dissolves <strong>hydrophilic</strong> substances (acids, bases, many salts), not hydrophobic ones (fats, oils). <strong>Electrolytes</strong> (NaCl, KCl) give conducting ions; <strong>non-electrolytes</strong> (sugar) dissolve as intact molecules and do not conduct. <strong>Solubility</strong> = maximum concentration at equilibrium under given conditions: <strong>saturated</strong> (= solubility), <strong>unsaturated</strong> (below), <strong>supersaturated</strong> (above; non-equilibrium, e.g. an unopened fizzy drink losing CO₂).</p><p>Water is <strong>amphoteric</strong> (proton donor and acceptor); about one molecule in half a billion dissociates: 2 H₂O ⇌ H₃O⁺ + OH⁻. <strong>Kw = [H₃O⁺][OH⁻] = 1.0 × 10⁻¹⁴</strong> at 25 °C. <strong>Neutral</strong>: both 10⁻⁷ M; <strong>acidic</strong>: [H₃O⁺] > 10⁻⁷; <strong>basic</strong>: [H₃O⁺] < 10⁻⁷. <strong>pH = −log[H₃O⁺]</strong> ('potential of hydrogen'): measures acidity; pH 7 neutral at 25 °C, below 7 acidic, above 7 basic.</p>"
  }
 ],
 "exam": [
  "Solution: homogeneous, particles < 1 nm, single phase, no light scattering, not filterable.",
  "Solvent dissolves solute; nine types by physical state.",
  "1 ppm = 1 mg/L (dilute aqueous).",
  "Molarity = mol/L solution (T-dependent); molality = mol/kg solvent (T-independent).",
  "Normality = molarity × valency (H⁺/OH⁻).",
  "n = m/M = C·V; dilution M₁V₁ = M₂V₂.",
  "Always add acid to water.",
  "Body ~65% water; electrolytes conduct, sugar does not.",
  "Saturated, unsaturated, supersaturated.",
  "Kw = 10⁻¹⁴ at 25 °C; neutral [H₃O⁺] = 10⁻⁷; pH = −log[H₃O⁺]."
 ],
 "visual": {
  "kind": "model",
  "intro": "",
  "figure": {
   "viewBox": "0 0 760 420",
   "alt": "Ways to express concentration",
   "caption": "Pick the unit for the job. Schematic drawn for this site.",
   "base": "<defs><marker id=\"ah\" markerWidth=\"10\" markerHeight=\"8\" refX=\"9\" refY=\"4\" orient=\"auto\"><path d=\"M0,0 L10,4 L0,8 Z\" fill=\"#8a8a8a\"/></marker></defs>",
   "parts": {
    "mol": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#f2d7cf\" x=\"40\" y=\"40\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "Molarity M = n / V(L)",
      "(depends on T)"
     ],
     "lx": 140.0,
     "ly": 68.0
    },
    "molal": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#cfe3f2\" x=\"280\" y=\"40\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "Molality m = n / kg",
      "solvent (T-independent)"
     ],
     "lx": 380.0,
     "ly": 68.0
    },
    "norm": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#d7edd2\" x=\"520\" y=\"40\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "Normality N = M ×",
      "valency (H⁺ or OH⁻)"
     ],
     "lx": 620.0,
     "ly": 68.0
    },
    "pct": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#f2e2a8\" x=\"40\" y=\"170\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "% w/w, % v/v,",
      "% w/v (per 100 mL)"
     ],
     "lx": 140.0,
     "ly": 198.0
    },
    "ppm": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#e3d5f0\" x=\"280\" y=\"170\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "ppm = mg/L; ppb = µg/L;",
      "ppt = ng/L"
     ],
     "lx": 380.0,
     "ly": 198.0
    },
    "dil": {
     "shape": "<rect class=\"sh\" stroke=\"#8a8a8a\" fill=\"#f7d9b8\" x=\"520\" y=\"170\" width=\"200\" height=\"60\" rx=\"10\"/>",
     "label": [
      "Dilution:",
      "M₁V₁ = M₂V₂"
     ],
     "lx": 620.0,
     "ly": 198.0
    }
   },
   "arrows": {
    "mol": [
     {
      "t": [
       40.0,
       48.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "molal": [
     {
      "t": [
       280.0,
       48.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "norm": [
     {
      "t": [
       520.0,
       48.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "pct": [
     {
      "t": [
       40.0,
       178.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "ppm": [
     {
      "t": [
       280.0,
       178.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ],
    "dil": [
     {
      "t": [
       520.0,
       178.0
      ],
      "d": [
       -70,
       -60
      ],
      "gap": 6
     }
    ]
   }
  },
  "mindmap": {
   "root": "Chemistry in solutions",
   "branches": [
    [
     "Solutions",
     [
      "Homogeneous, < 1 nm",
      "Solvent + solute",
      "9 types"
     ]
    ],
    [
     "Concentration",
     [
      "ppm = mg/L",
      "% w/w, v/v, w/v",
      "Molarity, molality",
      "Normality, mole fraction"
     ]
    ],
    [
     "Dilution",
     [
      "M₁V₁ = M₂V₂",
      "Acid into water"
     ]
    ],
    [
     "Water",
     [
      "Body ~65%",
      "Electrolytes",
      "Saturation"
     ]
    ],
    [
     "Acids & bases",
     [
      "Kw = 10⁻¹⁴",
      "Neutral 10⁻⁷",
      "pH = −log[H₃O⁺]"
     ]
    ]
   ]
  }
 },
 "mcqs": [
  {
   "q": "A solution is a:",
   "options": [
    "Heterogeneous mixture",
    "Suspension",
    "Colloid that scatters light",
    "Homogeneous mixture with particles < 1 nm"
   ],
   "answer": 3,
   "why": "Single phase.",
   "slides": [
    {
     "src": "files/slides/chem1-solutions/04.jpg",
     "lec": "Chemistry in solutions",
     "n": 4
    }
   ]
  },
  {
   "q": "In tincture of iodine, the solvent is:",
   "options": [
    "Iodine",
    "Air",
    "Alcohol",
    "Water"
   ],
   "answer": 2,
   "why": "Iodine is the solute.",
   "slides": [
    {
     "src": "files/slides/chem1-solutions/06.jpg",
     "lec": "Chemistry in solutions",
     "n": 6
    }
   ]
  },
  {
   "q": "How many types of solutions exist by physical state?",
   "options": [
    "6",
    "9",
    "3",
    "12"
   ],
   "answer": 1,
   "why": "Any state as solute or solvent.",
   "slides": [
    {
     "src": "files/slides/chem1-solutions/07.jpg",
     "lec": "Chemistry in solutions",
     "n": 7
    }
   ]
  },
  {
   "q": "Which property belongs to a true solution?",
   "options": [
    "It can be separated by filtration",
    "It scatters light",
    "Its particles do not sediment",
    "Particles are visible"
   ],
   "answer": 2,
   "why": "It is stable.",
   "slides": [
    {
     "src": "files/slides/chem1-solutions/09.jpg",
     "lec": "Chemistry in solutions",
     "n": 9
    }
   ]
  },
  {
   "q": "For dilute aqueous solutions, 1 ppm equals:",
   "options": [
    "1 mg/L",
    "1 µg/L",
    "1 ng/L",
    "1 g/L"
   ],
   "answer": 0,
   "why": "Assuming 1 kg ≈ 1 L."
  },
  {
   "q": "Molarity is defined as:",
   "options": [
    "Equivalents per litre",
    "Moles of solute per litre of solution",
    "Moles per kg of solvent",
    "Grams per 100 mL"
   ],
   "answer": 1,
   "why": "M = n/V.",
   "slides": [
    {
     "src": "files/slides/chem1-solutions/14.jpg",
     "lec": "Chemistry in solutions",
     "n": 14
    },
    {
     "src": "files/slides/chem1-solutions/15.jpg",
     "lec": "Chemistry in solutions",
     "n": 15
    }
   ]
  },
  {
   "q": "Which unit is independent of temperature?",
   "options": [
    "Normality",
    "Mass concentration per litre",
    "Molality",
    "Molarity"
   ],
   "answer": 2,
   "why": "Also mole fraction.",
   "slides": [
    {
     "src": "files/slides/chem1-solutions/17.jpg",
     "lec": "Chemistry in solutions",
     "n": 17
    }
   ]
  },
  {
   "q": "The normality of 1 M H₂SO₄ is:",
   "options": [
    "4 N",
    "1 N",
    "0.5 N",
    "2 N"
   ],
   "answer": 3,
   "why": "Two H⁺ per molecule.",
   "slides": [
    {
     "src": "files/slides/chem1-solutions/15.jpg",
     "lec": "Chemistry in solutions",
     "n": 15
    }
   ]
  },
  {
   "q": "How much 2 M stock is needed to make 100 mL of 0.5 M solution?",
   "options": [
    "200 mL",
    "25 mL",
    "10 mL",
    "50 mL"
   ],
   "answer": 1,
   "why": "M₁V₁ = M₂V₂: 2 × V = 0.5 × 100.",
   "slides": [
    {
     "src": "files/slides/chem1-solutions/13.jpg",
     "lec": "Chemistry in solutions",
     "n": 13
    },
    {
     "src": "files/slides/chem1-solutions/14.jpg",
     "lec": "Chemistry in solutions",
     "n": 14
    }
   ]
  },
  {
   "q": "When diluting a strong acid you should:",
   "options": [
    "Add the acid to the water",
    "Add water to the acid",
    "Use boiling water",
    "Mix quickly with heat"
   ],
   "answer": 0,
   "why": "The heat is absorbed by the water.",
   "slides": [
    {
     "src": "files/slides/chem1-solutions/20.jpg",
     "lec": "Chemistry in solutions",
     "n": 20
    }
   ]
  },
  {
   "q": "About what percentage of the human body is water?",
   "options": [
    "65%",
    "45%",
    "90%",
    "25%"
   ],
   "answer": 0,
   "why": "About 45 L in a 70 kg person.",
   "slides": [
    {
     "src": "files/slides/chem1-solutions/21.jpg",
     "lec": "Chemistry in solutions",
     "n": 21
    }
   ]
  },
  {
   "q": "Which solute makes water conduct electricity?",
   "options": [
    "Oil",
    "Sugar",
    "Ethanol",
    "NaCl"
   ],
   "answer": 3,
   "why": "It is an electrolyte.",
   "slides": [
    {
     "src": "files/slides/chem1-solutions/22.jpg",
     "lec": "Chemistry in solutions",
     "n": 22
    }
   ]
  },
  {
   "q": "A supersaturated solution:",
   "options": [
    "Is at equilibrium",
    "Is always solid",
    "Contains no solute",
    "Exceeds its solubility"
   ],
   "answer": 3,
   "why": "E.g. a fizzy drink before going flat.",
   "slides": [
    {
     "src": "files/slides/chem1-solutions/24.jpg",
     "lec": "Chemistry in solutions",
     "n": 24
    }
   ]
  },
  {
   "q": "At 25 °C, Kw equals:",
   "options": [
    "10⁻¹⁴",
    "7",
    "10⁻¹",
    "10⁻⁷"
   ],
   "answer": 0,
   "why": "[H₃O⁺][OH⁻].",
   "slides": [
    {
     "src": "files/slides/chem1-solutions/28.jpg",
     "lec": "Chemistry in solutions",
     "n": 28
    }
   ]
  },
  {
   "q": "A solution with [H₃O⁺] = 10⁻⁴ M is:",
   "options": [
    "Neutral",
    "Acidic",
    "Saturated",
    "Basic"
   ],
   "answer": 1,
   "why": "pH 4.",
   "slides": [
    {
     "src": "files/slides/chem1-solutions/50.jpg",
     "lec": "Chemistry in solutions",
     "n": 50
    },
    {
     "src": "files/slides/chem1-solutions/51.jpg",
     "lec": "Chemistry in solutions",
     "n": 51
    }
   ]
  },
  {
   "q": "pH is defined as:",
   "options": [
    "[H₃O⁺] × 10⁷",
    "Kw / [H₃O⁺]",
    "log[OH⁻]",
    "−log[H₃O⁺]"
   ],
   "answer": 3,
   "why": "Potential of hydrogen.",
   "slides": [
    {
     "src": "files/slides/chem1-solutions/32.jpg",
     "lec": "Chemistry in solutions",
     "n": 32
    }
   ]
  },
  {
   "q": "Which element is at the arrow?",
   "target": "mol",
   "options": [
    "Molality",
    "Percentages",
    "Molarity",
    "Normality"
   ],
   "answer": 2,
   "why": "The arrow points to: Molarity. Moles of solute per litre of solution; n = C·V; varies with temperature."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "molal",
   "options": [
    "Percentages",
    "Molality",
    "Molarity",
    "Trace units"
   ],
   "answer": 1,
   "why": "The arrow points to: Molality. Moles of solute per kg of solvent; independent of temperature, like mole fraction."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "norm",
   "options": [
    "Trace units",
    "Normality",
    "Molality",
    "Percentages"
   ],
   "answer": 1,
   "why": "The arrow points to: Normality. Gram equivalents per litre: N = M × number of H⁺ or OH⁻ exchanged."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "pct",
   "options": [
    "Percentages",
    "Molality",
    "Trace units",
    "Normality"
   ],
   "answer": 0,
   "why": "The arrow points to: Percentages. Mass %, volume %, and mass/volume % (pharmacy: grams per 100 mL)."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "ppm",
   "options": [
    "Trace units",
    "Normality",
    "Percentages",
    "Dilution"
   ],
   "answer": 0,
   "why": "The arrow points to: Trace units. For dilute aqueous solutions, 1 kg ≈ 1 L: 1 ppm = 1 mg/L."
  },
  {
   "q": "Which element is at the arrow?",
   "target": "dil",
   "options": [
    "Normality",
    "Molarity",
    "Dilution",
    "Percentages"
   ],
   "answer": 2,
   "why": "The arrow points to: Dilution. Moles of solute are constant, so M₁V₁ = M₂V₂. Always add acid to water."
  },
  {
   "q": "5.85 g of NaCl (M = 58.5 g/mol) are dissolved to make 500 mL of solution. The molarity is:",
   "options": [
    "11.7 M",
    "0.2 M",
    "0.02 M",
    "0.1 M"
   ],
   "answer": 1,
   "why": "n = 5.85/58.5 = 0.1 mol; C = n/V = 0.2 M.",
   "x": 1
  },
  {
   "q": "4.0 g of NaOH (M = 40 g/mol) are dissolved to make 250 mL of solution. The molarity is:",
   "options": [
    "16 M",
    "0.04 M",
    "0.4 M",
    "0.1 M"
   ],
   "answer": 2,
   "why": "n = 4.0/40 = 0.1 mol; C = n/V = 0.4 M.",
   "x": 1
  },
  {
   "q": "9.0 g of glucose (M = 180 g/mol) are dissolved to make 1000 mL of solution. The molarity is:",
   "options": [
    "0.5 M",
    "0.005 M",
    "9 M",
    "0.05 M"
   ],
   "answer": 3,
   "why": "n = 9.0/180 = 0.05 mol; C = n/V = 0.05 M.",
   "x": 1
  },
  {
   "q": "7.45 g of KCl (M = 74.5 g/mol) are dissolved to make 500 mL of solution. The molarity is:",
   "options": [
    "0.2 M",
    "0.02 M",
    "14.9 M",
    "0.1 M"
   ],
   "answer": 0,
   "why": "n = 7.45/74.5 = 0.1 mol; C = n/V = 0.2 M.",
   "x": 1
  },
  {
   "q": "11.7 g of NaCl (M = 58.5 g/mol) are dissolved to make 2000 mL of solution. The molarity is:",
   "options": [
    "5.85 M",
    "0.1 M",
    "0.2 M",
    "0.01 M"
   ],
   "answer": 1,
   "why": "n = 11.7/58.5 = 0.2 mol; C = n/V = 0.1 M.",
   "x": 1
  },
  {
   "q": "2.0 g of NaOH (M = 40 g/mol) are dissolved to make 100 mL of solution. The molarity is:",
   "options": [
    "1.5 M",
    "0.05 M",
    "0.5 M",
    "20 M"
   ],
   "answer": 2,
   "why": "n = 2.0/40 = 0.05 mol; C = n/V = 0.5 M.",
   "x": 1
  },
  {
   "q": "18 g of glucose (M = 180 g/mol) are dissolved to make 500 mL of solution. The molarity is:",
   "options": [
    "0.2 M",
    "36 M",
    "0.1 M",
    "0.02 M"
   ],
   "answer": 0,
   "why": "n = 18/180 = 0.1 mol; C = n/V = 0.2 M.",
   "x": 1
  },
  {
   "q": "1.17 g of NaCl (M = 58.5 g/mol) are dissolved to make 200 mL of solution. The molarity is:",
   "options": [
    "0.01 M",
    "5.85 M",
    "0.02 M",
    "0.1 M"
   ],
   "answer": 3,
   "why": "n = 1.17/58.5 = 0.02 mol; C = n/V = 0.1 M.",
   "x": 1
  },
  {
   "q": "3.42 g of sucrose (M = 342 g/mol) are dissolved to make 100 mL of solution. The molarity is:",
   "options": [
    "0.1 M",
    "34.2 M",
    "1.1 M",
    "0.01 M"
   ],
   "answer": 0,
   "why": "n = 3.42/342 = 0.01 mol; C = n/V = 0.1 M.",
   "x": 1
  },
  {
   "q": "10 g of NaOH (M = 40 g/mol) are dissolved to make 1000 mL of solution. The molarity is:",
   "options": [
    "0.025 M",
    "2.5 M",
    "10 M",
    "0.25 M"
   ],
   "answer": 3,
   "why": "n = 10/40 = 0.25 mol; C = n/V = 0.25 M.",
   "x": 1
  },
  {
   "q": "What volume of 2 M stock is needed to prepare 100 mL of 0.5 M solution?",
   "options": [
    "25 mL",
    "400 mL",
    "75 mL",
    "1 mL"
   ],
   "answer": 0,
   "why": "M₁V₁ = M₂V₂.",
   "x": 1
  },
  {
   "q": "What volume of 1 M stock is needed to prepare 250 mL of 0.1 M solution?",
   "options": [
    "0.1 mL",
    "2.5e+03 mL",
    "25 mL",
    "225 mL"
   ],
   "answer": 2,
   "why": "M₁V₁ = M₂V₂.",
   "x": 1
  },
  {
   "q": "What volume of 6 M stock is needed to prepare 500 mL of 1.5 M solution?",
   "options": [
    "125 mL",
    "2e+03 mL",
    "375 mL",
    "9 mL"
   ],
   "answer": 0,
   "why": "M₁V₁ = M₂V₂.",
   "x": 1
  },
  {
   "q": "What volume of 12 M stock is needed to prepare 1000 mL of 0.6 M solution?",
   "options": [
    "2e+04 mL",
    "7.2 mL",
    "950 mL",
    "50 mL"
   ],
   "answer": 3,
   "why": "M₁V₁ = M₂V₂.",
   "x": 1
  },
  {
   "q": "What volume of 5 M stock is needed to prepare 200 mL of 1 M solution?",
   "options": [
    "160 mL",
    "5 mL",
    "1e+03 mL",
    "40 mL"
   ],
   "answer": 3,
   "why": "M₁V₁ = M₂V₂.",
   "x": 1
  },
  {
   "q": "What volume of 10 M stock is needed to prepare 50 mL of 2 M solution?",
   "options": [
    "20 mL",
    "250 mL",
    "10 mL",
    "40 mL"
   ],
   "answer": 2,
   "why": "M₁V₁ = M₂V₂.",
   "x": 1
  },
  {
   "q": "What volume of 0.5 M stock is needed to prepare 100 mL of 0.1 M solution?",
   "options": [
    "0.05 mL",
    "20 mL",
    "500 mL",
    "80 mL"
   ],
   "answer": 1,
   "why": "M₁V₁ = M₂V₂.",
   "x": 1
  },
  {
   "q": "What volume of 3 M stock is needed to prepare 300 mL of 0.5 M solution?",
   "options": [
    "1.5 mL",
    "250 mL",
    "50 mL",
    "1.8e+03 mL"
   ],
   "answer": 2,
   "why": "M₁V₁ = M₂V₂.",
   "x": 1
  },
  {
   "q": "What volume of 4 M stock is needed to prepare 1000 mL of 0.2 M solution?",
   "options": [
    "0.8 mL",
    "50 mL",
    "2e+04 mL",
    "950 mL"
   ],
   "answer": 1,
   "why": "M₁V₁ = M₂V₂.",
   "x": 1
  },
  {
   "q": "What volume of 2 M stock is needed to prepare 500 mL of 0.4 M solution?",
   "options": [
    "0.8 mL",
    "400 mL",
    "100 mL",
    "2.5e+03 mL"
   ],
   "answer": 2,
   "why": "M₁V₁ = M₂V₂.",
   "x": 1
  },
  {
   "q": "The normality of a 1 M H₂SO₄ solution is:",
   "options": [
    "3 N",
    "2 N",
    "1 N",
    "0.5 N"
   ],
   "answer": 1,
   "why": "N = M × number of H⁺ or OH⁻ = 1 × 2.",
   "x": 1
  },
  {
   "q": "The normality of a 0.5 M HCl solution is:",
   "options": [
    "0 N",
    "1 N",
    "1.5 N",
    "0.5 N"
   ],
   "answer": 3,
   "why": "N = M × number of H⁺ or OH⁻ = 0.5 × 1.",
   "x": 1
  },
  {
   "q": "The normality of a 1 M H₃PO₄ solution is:",
   "options": [
    "0.333333 N",
    "3 N",
    "1 N",
    "4 N"
   ],
   "answer": 1,
   "why": "N = M × number of H⁺ or OH⁻ = 1 × 3.",
   "x": 1
  },
  {
   "q": "The normality of a 2 M NaOH solution is:",
   "options": [
    "3 N",
    "2 N",
    "4 N",
    "0 N"
   ],
   "answer": 1,
   "why": "N = M × number of H⁺ or OH⁻ = 2 × 1.",
   "x": 1
  },
  {
   "q": "The normality of a 0.5 M Ca(OH)₂ solution is:",
   "options": [
    "1 N",
    "0.5 N",
    "2 N",
    "0.25 N"
   ],
   "answer": 0,
   "why": "N = M × number of H⁺ or OH⁻ = 0.5 × 2.",
   "x": 1
  },
  {
   "q": "The normality of a 0.25 M H₂SO₄ solution is:",
   "options": [
    "1.5 N",
    "0.25 N",
    "0.5 N",
    "0.125 N"
   ],
   "answer": 2,
   "why": "N = M × number of H⁺ or OH⁻ = 0.25 × 2.",
   "x": 1
  },
  {
   "q": "A solution has [H₃O⁺] = 10⁻¹ M at 25 °C. Its pH is:",
   "options": [
    "13 (basic)",
    "2 (acidic)",
    "−1 (acidic)",
    "1 (acidic)"
   ],
   "answer": 3,
   "why": "pH = −log[H₃O⁺]; below 7 acidic, above 7 basic.",
   "x": 1
  },
  {
   "q": "A solution has [H₃O⁺] = 10⁻² M at 25 °C. Its pH is:",
   "options": [
    "2 (acidic)",
    "12 (basic)",
    "3 (acidic)",
    "−2 (acidic)"
   ],
   "answer": 0,
   "why": "pH = −log[H₃O⁺]; below 7 acidic, above 7 basic.",
   "x": 1
  },
  {
   "q": "A solution has [H₃O⁺] = 10⁻³ M at 25 °C. Its pH is:",
   "options": [
    "3 (acidic)",
    "−3 (acidic)",
    "4 (acidic)",
    "11 (basic)"
   ],
   "answer": 0,
   "why": "pH = −log[H₃O⁺]; below 7 acidic, above 7 basic.",
   "x": 1
  },
  {
   "q": "A solution has [H₃O⁺] = 10⁻⁴ M at 25 °C. Its pH is:",
   "options": [
    "10 (basic)",
    "4 (acidic)",
    "5 (acidic)",
    "−4 (acidic)"
   ],
   "answer": 1,
   "why": "pH = −log[H₃O⁺]; below 7 acidic, above 7 basic.",
   "x": 1
  },
  {
   "q": "A solution has [H₃O⁺] = 10⁻⁵ M at 25 °C. Its pH is:",
   "options": [
    "5 (acidic)",
    "6 (acidic)",
    "9 (basic)",
    "−5 (acidic)"
   ],
   "answer": 0,
   "why": "pH = −log[H₃O⁺]; below 7 acidic, above 7 basic.",
   "x": 1
  },
  {
   "q": "A solution has [H₃O⁺] = 10⁻⁷ M at 25 °C. Its pH is:",
   "options": [
    "8 (neutral)",
    "0 (acidic)",
    "7 (neutral)",
    "−7 (neutral)"
   ],
   "answer": 2,
   "why": "pH = −log[H₃O⁺]; below 7 acidic, above 7 basic.",
   "x": 1
  },
  {
   "q": "A solution has [H₃O⁺] = 10⁻⁹ M at 25 °C. Its pH is:",
   "options": [
    "9 (basic)",
    "10 (basic)",
    "5 (acidic)",
    "−9 (basic)"
   ],
   "answer": 0,
   "why": "pH = −log[H₃O⁺]; below 7 acidic, above 7 basic.",
   "x": 1
  },
  {
   "q": "A solution has [H₃O⁺] = 10⁻¹¹ M at 25 °C. Its pH is:",
   "options": [
    "−11 (basic)",
    "11 (basic)",
    "3 (acidic)",
    "12 (basic)"
   ],
   "answer": 1,
   "why": "pH = −log[H₃O⁺]; below 7 acidic, above 7 basic.",
   "x": 1
  },
  {
   "q": "A solution has [H₃O⁺] = 10⁻¹² M at 25 °C. Its pH is:",
   "options": [
    "13 (basic)",
    "2 (acidic)",
    "12 (basic)",
    "−12 (basic)"
   ],
   "answer": 2,
   "why": "pH = −log[H₃O⁺]; below 7 acidic, above 7 basic.",
   "x": 1
  },
  {
   "q": "At 25 °C, [OH⁻] = 10⁻² M. [H₃O⁺] is:",
   "options": [
    "10⁻¹² M",
    "10¹² M",
    "10⁻² M",
    "10⁻⁷ M"
   ],
   "answer": 0,
   "why": "Kw = [H₃O⁺][OH⁻] = 10⁻¹⁴.",
   "x": 1
  },
  {
   "q": "At 25 °C, [OH⁻] = 10⁻⁴ M. [H₃O⁺] is:",
   "options": [
    "10¹⁰ M",
    "10⁻⁷ M",
    "10⁻¹⁰ M",
    "10⁻⁴ M"
   ],
   "answer": 2,
   "why": "Kw = [H₃O⁺][OH⁻] = 10⁻¹⁴.",
   "x": 1
  },
  {
   "q": "At 25 °C, [OH⁻] = 10⁻⁶ M. [H₃O⁺] is:",
   "options": [
    "10⁻⁶ M",
    "10⁻⁸ M",
    "10⁸ M",
    "10⁻⁷ M"
   ],
   "answer": 1,
   "why": "Kw = [H₃O⁺][OH⁻] = 10⁻¹⁴.",
   "x": 1
  },
  {
   "q": "At 25 °C, [OH⁻] = 10⁻³ M. [H₃O⁺] is:",
   "options": [
    "10⁻¹¹ M",
    "10⁻³ M",
    "10¹¹ M",
    "10⁻⁷ M"
   ],
   "answer": 0,
   "why": "Kw = [H₃O⁺][OH⁻] = 10⁻¹⁴.",
   "x": 1
  },
  {
   "q": "At 25 °C, [OH⁻] = 10⁻⁵ M. [H₃O⁺] is:",
   "options": [
    "10⁻⁷ M",
    "10⁻⁹ M",
    "10⁻⁵ M",
    "10⁹ M"
   ],
   "answer": 1,
   "why": "Kw = [H₃O⁺][OH⁻] = 10⁻¹⁴.",
   "x": 1
  },
  {
   "q": "A dilute aqueous solution contains 1 ppm of a solute. This equals:",
   "options": [
    "1000 mg/L",
    "1 µg/L",
    "1 mg/L",
    "1 g/L"
   ],
   "answer": 2,
   "why": "For dilute aqueous solutions 1 ppm = 1 mg/L, 1 ppb = 1 µg/L.",
   "x": 1
  },
  {
   "q": "A dilute aqueous solution contains 5 ppm of a solute. This equals:",
   "options": [
    "5000 mg/L",
    "5 g/L",
    "5 mg/L",
    "5 µg/L"
   ],
   "answer": 2,
   "why": "For dilute aqueous solutions 1 ppm = 1 mg/L, 1 ppb = 1 µg/L.",
   "x": 1
  },
  {
   "q": "A dilute aqueous solution contains 20 ppm of a solute. This equals:",
   "options": [
    "20000 mg/L",
    "20 mg/L",
    "20 µg/L",
    "20 g/L"
   ],
   "answer": 1,
   "why": "For dilute aqueous solutions 1 ppm = 1 mg/L, 1 ppb = 1 µg/L.",
   "x": 1
  },
  {
   "q": "A dilute aqueous solution contains 0.5 ppm of a solute. This equals:",
   "options": [
    "0.5 µg/L",
    "0.5 g/L",
    "0.5 mg/L",
    "500 mg/L"
   ],
   "answer": 2,
   "why": "For dilute aqueous solutions 1 ppm = 1 mg/L, 1 ppb = 1 µg/L.",
   "x": 1
  },
  {
   "q": "5 g of solute in 100 mL of solution is a w/v percentage of:",
   "options": [
    "5%",
    "0.5%",
    "Cannot be determined",
    "50%"
   ],
   "answer": 0,
   "why": "% w/v = grams per 100 mL.",
   "x": 1
  },
  {
   "q": "0.9 g of solute in 100 mL of solution is a w/v percentage of:",
   "options": [
    "9%",
    "0.09%",
    "Cannot be determined",
    "0.9%"
   ],
   "answer": 3,
   "why": "% w/v = grams per 100 mL.",
   "x": 1
  },
  {
   "q": "10 g of solute in 250 mL of solution is a w/v percentage of:",
   "options": [
    "4%",
    "0.4%",
    "10%",
    "40%"
   ],
   "answer": 0,
   "why": "% w/v = grams per 100 mL.",
   "x": 1
  },
  {
   "q": "A mixture contains 1 mol of A and 9 mol of B. The mole fraction of A is:",
   "options": [
    "0.9",
    "0.11",
    "1",
    "0.1"
   ],
   "answer": 3,
   "why": "x_A = n_A / (n_A + n_B).",
   "x": 1
  },
  {
   "q": "A mixture contains 2 mol of A and 8 mol of B. The mole fraction of A is:",
   "options": [
    "0.2",
    "0.25",
    "0.8",
    "2"
   ],
   "answer": 0,
   "why": "x_A = n_A / (n_A + n_B).",
   "x": 1
  },
  {
   "q": "A mixture contains 0.5 mol of A and 4.5 mol of B. The mole fraction of A is:",
   "options": [
    "0.9",
    "0.11",
    "0.1",
    "0.5"
   ],
   "answer": 2,
   "why": "x_A = n_A / (n_A + n_B).",
   "x": 1
  },
  {
   "q": "A mixture contains 3 mol of A and 7 mol of B. The mole fraction of A is:",
   "options": [
    "0.43",
    "0.7",
    "0.3",
    "3"
   ],
   "answer": 2,
   "why": "x_A = n_A / (n_A + n_B).",
   "x": 1
  },
  {
   "q": "Which concentration unit depends on temperature?",
   "options": [
    "Molarity",
    "Mass of solute per kg of solvent",
    "Mole fraction",
    "Molality"
   ],
   "answer": 0,
   "why": "Volume changes with temperature.",
   "x": 1
  },
  {
   "q": "Which solute dissolves as intact molecules and does not conduct electricity?",
   "options": [
    "HCl",
    "NaCl",
    "Sugar",
    "KCl"
   ],
   "answer": 2,
   "why": "A non-electrolyte.",
   "x": 1
  },
  {
   "q": "Air is a solution of:",
   "options": [
    "Solid in gas",
    "Gas in gas",
    "Solid in solid",
    "Liquid in liquid"
   ],
   "answer": 1,
   "why": "Alloys are solid solutions.",
   "x": 1
  },
  {
   "q": "A true solution:",
   "options": [
    "Does not scatter light and cannot be separated by filtration",
    "Scatters light",
    "Sediments on standing",
    "Contains particles larger than 1 µm"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "An unsaturated solution contains:",
   "options": [
    "More than its solubility",
    "No solute",
    "Exactly its solubility",
    "Less solute than its solubility"
   ],
   "answer": 3,
   "why": "",
   "x": 1
  },
  {
   "q": "Water is amphoteric because it:",
   "options": [
    "Has no ions",
    "Is neutral",
    "Can donate and accept protons",
    "Conducts electricity strongly"
   ],
   "answer": 2,
   "why": "",
   "x": 1
  },
  {
   "q": "When preparing a dilute acid, you should:",
   "options": [
    "Heat the acid first",
    "Add water to the concentrated acid",
    "Mix them quickly in any order",
    "Add the acid slowly to the water"
   ],
   "answer": 3,
   "why": "Water poured into acid can boil and spatter.",
   "x": 1
  },
  {
   "q": "About how much water is in a 70 kg person?",
   "options": [
    "About 70 L",
    "About 100 L",
    "About 45 L",
    "About 5 L"
   ],
   "answer": 2,
   "why": "",
   "x": 1
  },
  {
   "q": "Water dissolves well:",
   "options": [
    "Hydrophilic substances such as acids, bases and many salts",
    "Fats and oils",
    "Hydrophobic substances",
    "Waxes"
   ],
   "answer": 0,
   "why": "",
   "x": 1
  },
  {
   "q": "What mass of NaCl (M = 58.5 g/mol) is needed for 1000 mL of a 0.1 M solution?",
   "options": [
    "5.85 g",
    "0.1 g",
    "6.85 g",
    "58.5 g"
   ],
   "answer": 0,
   "why": "m = C × V × M = 0.1 × 1 × 58.5 = 5.85 g.",
   "x": 1
  },
  {
   "q": "What mass of NaOH (M = 40 g/mol) is needed for 250 mL of a 0.5 M solution?",
   "options": [
    "5 g",
    "80 g",
    "0.125 g",
    "20 g"
   ],
   "answer": 0,
   "why": "m = C × V × M = 0.5 × 0.25 × 40 = 5 g.",
   "x": 1
  },
  {
   "q": "What mass of glucose (M = 180 g/mol) is needed for 500 mL of a 0.2 M solution?",
   "options": [
    "18 g",
    "36 g",
    "72 g",
    "0.1 g"
   ],
   "answer": 0,
   "why": "m = C × V × M = 0.2 × 0.5 × 180 = 18 g.",
   "x": 1
  },
  {
   "q": "What mass of KCl (M = 74.5 g/mol) is needed for 100 mL of a 1 M solution?",
   "options": [
    "0.1 g",
    "745 g",
    "74.5 g",
    "7.45 g"
   ],
   "answer": 3,
   "why": "m = C × V × M = 1 × 0.1 × 74.5 = 7.45 g.",
   "x": 1
  },
  {
   "q": "What mass of NaCl (M = 58.5 g/mol) is needed for 2000 mL of a 0.15 M solution?",
   "options": [
    "8.78 g",
    "17.6 g",
    "4.39 g",
    "0.3 g"
   ],
   "answer": 1,
   "why": "m = C × V × M = 0.15 × 2 × 58.5 = 17.6 g.",
   "x": 1
  },
  {
   "q": "What mass of H₂SO₄ (M = 98 g/mol) is needed for 200 mL of a 0.5 M solution?",
   "options": [
    "9.8 g",
    "0.1 g",
    "245 g",
    "49 g"
   ],
   "answer": 0,
   "why": "m = C × V × M = 0.5 × 0.2 × 98 = 9.8 g.",
   "x": 1
  },
  {
   "q": "What mass of HCl (M = 36.5 g/mol) is needed for 500 mL of a 1 M solution?",
   "options": [
    "73 g",
    "36.5 g",
    "0.5 g",
    "18.2 g"
   ],
   "answer": 3,
   "why": "m = C × V × M = 1 × 0.5 × 36.5 = 18.2 g.",
   "x": 1
  },
  {
   "q": "What mass of sucrose (M = 342 g/mol) is needed for 250 mL of a 0.1 M solution?",
   "options": [
    "137 g",
    "8.55 g",
    "34.2 g",
    "0.025 g"
   ],
   "answer": 1,
   "why": "m = C × V × M = 0.1 × 0.25 × 342 = 8.55 g.",
   "x": 1
  },
  {
   "q": "What mass of NaOH (M = 40 g/mol) is needed for 100 mL of a 2 M solution?",
   "options": [
    "0.2 g",
    "800 g",
    "8 g",
    "80 g"
   ],
   "answer": 2,
   "why": "m = C × V × M = 2 × 0.1 × 40 = 8 g.",
   "x": 1
  },
  {
   "q": "What mass of glucose (M = 180 g/mol) is needed for 50 mL of a 1 M solution?",
   "options": [
    "9 g",
    "180 g",
    "3.6e+03 g",
    "0.05 g"
   ],
   "answer": 0,
   "why": "m = C × V × M = 1 × 0.05 × 180 = 9 g.",
   "x": 1
  },
  {
   "q": "0.5 mol of solute in 1 kg of water gives a molality of:",
   "options": [
    "1.5 mol/kg",
    "0.5 mol/kg",
    "2 mol/kg",
    "500 mol/kg"
   ],
   "answer": 1,
   "why": "Molality = moles of solute per kg of solvent.",
   "x": 1
  },
  {
   "q": "1 mol of solute in 2 kg of water gives a molality of:",
   "options": [
    "1.5 mol/kg",
    "2 mol/kg",
    "500 mol/kg",
    "0.5 mol/kg"
   ],
   "answer": 3,
   "why": "Molality = moles of solute per kg of solvent.",
   "x": 1
  },
  {
   "q": "0.2 mol of solute in 0.5 kg of water gives a molality of:",
   "options": [
    "400 mol/kg",
    "0.4 mol/kg",
    "0.1 mol/kg",
    "2.5 mol/kg"
   ],
   "answer": 1,
   "why": "Molality = moles of solute per kg of solvent.",
   "x": 1
  },
  {
   "q": "3 mol of solute in 1.5 kg of water gives a molality of:",
   "options": [
    "4.5 mol/kg",
    "2e+03 mol/kg",
    "0.5 mol/kg",
    "2 mol/kg"
   ],
   "answer": 3,
   "why": "Molality = moles of solute per kg of solvent.",
   "x": 1
  },
  {
   "q": "A solution is diluted 2 times. Its concentration becomes:",
   "options": [
    "2 times the initial value",
    "Unchanged",
    "1/4 of the initial value",
    "1/2 of the initial value"
   ],
   "answer": 3,
   "why": "Moles stay constant; volume is multiplied.",
   "x": 1
  },
  {
   "q": "A solution is diluted 5 times. Its concentration becomes:",
   "options": [
    "5 times the initial value",
    "1/25 of the initial value",
    "Unchanged",
    "1/5 of the initial value"
   ],
   "answer": 3,
   "why": "Moles stay constant; volume is multiplied.",
   "x": 1
  },
  {
   "q": "A solution is diluted 10 times. Its concentration becomes:",
   "options": [
    "Unchanged",
    "1/100 of the initial value",
    "10 times the initial value",
    "1/10 of the initial value"
   ],
   "answer": 3,
   "why": "Moles stay constant; volume is multiplied.",
   "x": 1
  },
  {
   "q": "A solution is diluted 20 times. Its concentration becomes:",
   "options": [
    "1/20 of the initial value",
    "20 times the initial value",
    "Unchanged",
    "1/400 of the initial value"
   ],
   "answer": 0,
   "why": "Moles stay constant; volume is multiplied.",
   "x": 1
  },
  {
   "q": "A 0.1 M HCl solution (fully dissociated) has a pH of:",
   "options": [
    "1",
    "2",
    "13",
    "0.1"
   ],
   "answer": 0,
   "why": "[H₃O⁺] = C for a strong monoacid; pH = −log C.",
   "x": 1
  },
  {
   "q": "A 0.01 M HCl solution (fully dissociated) has a pH of:",
   "options": [
    "0.01",
    "3",
    "12",
    "2"
   ],
   "answer": 3,
   "why": "[H₃O⁺] = C for a strong monoacid; pH = −log C.",
   "x": 1
  },
  {
   "q": "A 0.001 M HCl solution (fully dissociated) has a pH of:",
   "options": [
    "4",
    "0.001",
    "3",
    "11"
   ],
   "answer": 2,
   "why": "[H₃O⁺] = C for a strong monoacid; pH = −log C.",
   "x": 1
  },
  {
   "q": "A 0.0001 M HCl solution (fully dissociated) has a pH of:",
   "options": [
    "5",
    "10",
    "0.0001",
    "4"
   ],
   "answer": 3,
   "why": "[H₃O⁺] = C for a strong monoacid; pH = −log C.",
   "x": 1
  },
  {
   "q": "A solution with pH 3 has [H₃O⁺] equal to:",
   "options": [
    "3 M",
    "10³ M",
    "10⁻³ M",
    "10⁻¹¹ M"
   ],
   "answer": 2,
   "why": "[H₃O⁺] = 10^−pH.",
   "x": 1
  },
  {
   "q": "A solution with pH 5 has [H₃O⁺] equal to:",
   "options": [
    "10⁻⁹ M",
    "10⁵ M",
    "5 M",
    "10⁻⁵ M"
   ],
   "answer": 3,
   "why": "[H₃O⁺] = 10^−pH.",
   "x": 1
  },
  {
   "q": "A solution with pH 8 has [H₃O⁺] equal to:",
   "options": [
    "10⁻⁸ M",
    "10⁸ M",
    "8 M",
    "10⁻⁶ M"
   ],
   "answer": 0,
   "why": "[H₃O⁺] = 10^−pH.",
   "x": 1
  },
  {
   "q": "A solution with pH 10 has [H₃O⁺] equal to:",
   "options": [
    "10⁻¹⁰ M",
    "10 M",
    "10⁻⁴ M",
    "10¹⁰ M"
   ],
   "answer": 0,
   "why": "[H₃O⁺] = 10^−pH.",
   "x": 1
  },
  {
   "q": "A solution with pH 2 has [H₃O⁺] equal to:",
   "options": [
    "10⁻¹² M",
    "10⁻² M",
    "2 M",
    "10² M"
   ],
   "answer": 1,
   "why": "[H₃O⁺] = 10^−pH.",
   "x": 1
  },
  {
   "q": "A solution with pH 13 has [H₃O⁺] equal to:",
   "options": [
    "10⁻¹ M",
    "10⁻¹³ M",
    "13 M",
    "10¹³ M"
   ],
   "answer": 1,
   "why": "[H₃O⁺] = 10^−pH.",
   "x": 1
  }
 ],
 "cards": [
  {
   "id": "x0",
   "type": "text",
   "front": "Define a solution and its properties.",
   "back": "Homogeneous mixture, particles < 1 nm, one phase; no light scattering, stable, not separable by filtration."
  },
  {
   "id": "x1",
   "type": "text",
   "front": "Solvent vs solute?",
   "back": "Solvent dissolves (usually major component); solute is dissolved; any state for either (9 types)."
  },
  {
   "id": "x2",
   "type": "text",
   "front": "ppm, ppb, ppt?",
   "back": "Parts per million/billion/trillion; for dilute aqueous: 1 ppm = 1 mg/L, 1 ppb = 1 µg/L, 1 ppt = 1 ng/L."
  },
  {
   "id": "x3",
   "type": "text",
   "front": "Molarity vs molality?",
   "back": "Molarity: mol solute per L solution (T-dependent). Molality: mol solute per kg solvent (T-independent)."
  },
  {
   "id": "x4",
   "type": "text",
   "front": "Normality?",
   "back": "Gram equivalents per litre; N = M × valency (number of H⁺ or OH⁻)."
  },
  {
   "id": "x5",
   "type": "text",
   "front": "Dilution formula and safety?",
   "back": "M₁V₁ = M₂V₂ (moles constant); always add acid to water."
  },
  {
   "id": "x6",
   "type": "text",
   "front": "Electrolytes vs non-electrolytes?",
   "back": "Electrolytes (NaCl, KCl) dissociate into ions and conduct; non-electrolytes (sugar) stay intact, no conduction."
  },
  {
   "id": "x7",
   "type": "text",
   "front": "Saturated, unsaturated, supersaturated?",
   "back": "At solubility; below it; above it (non-equilibrium)."
  },
  {
   "id": "x8",
   "type": "text",
   "front": "Water ionisation and pH?",
   "back": "2 H₂O ⇌ H₃O⁺ + OH⁻; Kw = 10⁻¹⁴ at 25 °C; neutral 10⁻⁷ M; pH = −log[H₃O⁺]."
  },
  {
   "id": "img-mol",
   "type": "image",
   "target": "mol",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Molarity. Moles of solute per litre of solution; n = C·V; varies with temperature."
  },
  {
   "id": "img-molal",
   "type": "image",
   "target": "molal",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Molality. Moles of solute per kg of solvent; independent of temperature, like mole fraction."
  },
  {
   "id": "img-norm",
   "type": "image",
   "target": "norm",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Normality. Gram equivalents per litre: N = M × number of H⁺ or OH⁻ exchanged."
  },
  {
   "id": "img-pct",
   "type": "image",
   "target": "pct",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Percentages. Mass %, volume %, and mass/volume % (pharmacy: grams per 100 mL)."
  },
  {
   "id": "img-ppm",
   "type": "image",
   "target": "ppm",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Trace units. For dilute aqueous solutions, 1 kg ≈ 1 L: 1 ppm = 1 mg/L."
  },
  {
   "id": "img-dil",
   "type": "image",
   "target": "dil",
   "front": "What is at the arrow, and why does it matter?",
   "back": "Dilution. Moles of solute are constant, so M₁V₁ = M₂V₂. Always add acid to water."
  }
 ],
 "deeper": [
  {
   "title": "Why add acid to water",
   "html": "<p>Dissolving a strong acid releases a lot of heat. If a little water is poured onto concentrated acid, that small amount of water can boil instantly and throw droplets of hot concentrated acid out of the container. Adding acid slowly to a large volume of water spreads the heat through the water, which only warms a little.</p><p class='src'>Source: the lecture's dilution safety slide.</p>"
  },
  {
   "title": "Why molality is used for precise work",
   "html": "<p>A litre of solution expands or contracts with temperature, so molarity changes slightly as the lab warms or cools. Molality uses the mass of solvent, which does not change with temperature, so it stays constant. That is why properties such as freezing-point depression are expressed with molality.</p><p class='src'>Source: the lecture's comparison of concentration units.</p>"
  }
 ],
 "resources": [
  {
   "title": "Solutions and concentration (Khan Academy)",
   "url": "https://www.khanacademy.org/science/chemistry/states-of-matter-and-intermolecular-forces/mixtures-and-solutions",
   "kind": "Website",
   "why": "Molarity, dilution and solubility.",
   "note": ""
  },
  {
   "title": "Acids, bases and pH (Khan Academy)",
   "url": "https://www.khanacademy.org/science/chemistry/acids-and-bases-topic",
   "kind": "Website",
   "why": "Kw, pH and acid-base basics.",
   "note": ""
  }
 ],
 "checks": [],
 "sources": [
  {
   "name": "Solutions and concentration (Khan Academy)",
   "url": "https://www.khanacademy.org/science/chemistry/states-of-matter-and-intermolecular-forces/mixtures-and-solutions"
  },
  {
   "name": "Acids, bases and pH (Khan Academy)",
   "url": "https://www.khanacademy.org/science/chemistry/acids-and-bases-topic"
  }
 ],
 "verified": "22 Sep 2026"
};
