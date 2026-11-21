/* Clinidle cases with a pathology slide stage: a stage with "slide" shows real photomicrographs (Wikimedia Commons, credited per image).
   Images are revealed as the player makes wrong guesses. Added after the main set; case 18 is the first of these. */
SINA.wardle.tracks.y2.cases = SINA.wardle.tracks.y2.cases.concat([
 {
  "title": "Tired and cold",
  "who": "Woman, 41",
  "tag": "Clinic",
  "vit": [
   [
    "HR",
    "54"
   ],
   [
    "BP",
    "128/82"
   ],
   [
    "RR",
    "14"
   ],
   [
    "SpO₂",
    "99%"
   ],
   [
    "T",
    "36.2"
   ]
  ],
  "line": "Tired for eight months, gained 6 kg, constipated, always cold. Her mother has a thyroid disease.",
  "dx": "Primary hypothyroidism from Hashimoto's thyroiditis",
  "outcome": "Anti-TPO antibodies were strongly positive. Levothyroxine was started and TSH was normal at three months.",
  "takeaways": [
   "High TSH with low free T4 is primary hypothyroidism.",
   "In iodine-sufficient countries, Hashimoto's is the commonest cause.",
   "Histology: lymphoid follicles with germinal centres and Hürthle cells."
  ],
  "stages": [
   {
    "id": "a",
    "label": "Thyroid tests",
    "list": "thy",
    "q": "Which thyroid pattern?",
    "ev": "Her blood tests are back: TSH 18 mU/L (0.4 to 4.0), free T4 6 pmol/L (10 to 22).",
    "hints": [
     "TSH is above the range.",
     "Free T4 is below the range.",
     "The two move in opposite directions.",
     "The fault is in the gland, not in the pituitary.",
     "High TSH, low free T4."
    ],
    "answer": "Primary hypothyroidism",
    "key": 4,
    "why": "A failing gland makes too little T4, so the pituitary pushes out more TSH. In central hypothyroidism TSH is low or normal.",
    "contenders": [
     [
      "Primary hypothyroidism",
      "TSH high, FT4 low."
     ],
     [
      "Central hypothyroidism",
      "TSH low or normal with low FT4."
     ],
     [
      "Subclinical hypothyroidism",
      "TSH high but FT4 normal."
     ],
     [
      "Primary hyperthyroidism",
      "TSH low, FT4 high."
     ]
    ],
    "src": [
     [
      "pathanat",
      "Pathological anatomy",
      2
     ]
    ]
   },
   {
    "id": "b",
    "label": "Imaging",
    "list": "test",
    "q": "Which test shows the size and texture of the gland?",
    "ev": "The thyroid feels firm, smooth and diffusely enlarged, and it does not hurt.",
    "hints": [
     "It uses sound waves, with no radiation.",
     "It is non-invasive and quick.",
     "It looks at the whole gland, not one nodule.",
     "The gland is enlarged with a patchy, dark texture.",
     "It is the first imaging for thyroid disease."
    ],
    "answer": "Thyroid ultrasound",
    "key": 3,
    "why": "Ultrasound shows a diffusely enlarged, heterogeneous, hypoechoic gland. Scintigraphy maps uptake in hyperthyroidism, and fine-needle aspiration is for a nodule.",
    "contenders": [
     [
      "Thyroid ultrasound",
      "Size, texture and nodules."
     ],
     [
      "Thyroid scintigraphy",
      "Uptake map, for hyperthyroidism."
     ],
     [
      "Fine-needle aspiration",
      "For a suspicious nodule."
     ],
     [
      "ECG",
      "Heart, not thyroid."
     ]
    ],
    "src": [
     [
      "pathanat",
      "Pathological anatomy",
      2
     ]
    ]
   },
   {
    "id": "c",
    "label": "Biopsy",
    "list": "dx",
    "q": "What does the biopsy show?",
    "ev": "A needle biopsy of the gland, seen under the microscope (H&E). Drag to move, zoom to look closer.",
    "hints": [
     "The tissue is thyroid: round follicles filled with pink colloid.",
     "Lymphocytes crowd between the follicles.",
     "The lymphocytes form follicles with germinal centres.",
     "Some follicular cells are large, pink and granular (Hürthle cells).",
     "An autoimmune disease with anti-TPO antibodies."
    ],
    "answer": "Hashimoto's thyroiditis",
    "key": 3,
    "why": "Hashimoto's thyroiditis is autoimmune destruction of the gland: a dense lymphoplasmacytic infiltrate with germinal centres, atrophic follicles and Hürthle cells. Subacute (de Quervain) thyroiditis shows granulomas and giant cells.",
    "contenders": [
     [
      "Hashimoto's thyroiditis",
      "Lymphoid follicles and Hürthle cells."
     ],
     [
      "Thyroiditis",
      "Subacute forms show granulomas and giant cells."
     ],
     [
      "Thyroid cancer",
      "Atypical cells, not a diffuse infiltrate."
     ],
     [
      "Hodgkin lymphoma",
      "A lymph node disease."
     ]
    ],
    "src": [
     [
      "pathanat",
      "Pathological anatomy",
      2
     ]
    ],
    "slide": {
     "stain": "H&E",
     "images": [
      {
       "src": "files/histo/hashimoto-1.webp",
       "mag": "Very low power",
       "by": "Librepath",
       "lic": "CC BY-SA 3.0",
       "page": "https://commons.wikimedia.org/wiki/File:Hashimoto_thyroiditis_--_very_low_mag.jpg"
      },
      {
       "src": "files/histo/hashimoto-2.webp",
       "mag": "Intermediate power",
       "by": "Librepath",
       "lic": "CC BY-SA 3.0",
       "page": "https://commons.wikimedia.org/wiki/File:Hashimoto_thyroiditis_--_intermed_mag.jpg"
      },
      {
       "src": "files/histo/hashimoto-3.webp",
       "mag": "High power",
       "by": "Librepath",
       "lic": "CC BY-SA 3.0",
       "page": "https://commons.wikimedia.org/wiki/File:Hashimoto_thyroiditis_--_high_mag.jpg"
      }
     ]
    }
   }
  ],
  "n": 18
 },
 {
  "title": "Swollen belly",
  "who": "Man, 56",
  "tag": "Ward",
  "vit": [
   [
    "HR",
    "92"
   ],
   [
    "BP",
    "108/66"
   ],
   [
    "RR",
    "16"
   ],
   [
    "SpO₂",
    "97%"
   ],
   [
    "T",
    "36.9"
   ]
  ],
  "line": "Belly swelling for three months. About a litre of wine a day for 25 years. Spider naevi on the chest.",
  "dx": "Alcoholic cirrhosis, with a risk of hepatocellular carcinoma",
  "outcome": "Diuretics and alcohol cessation. He joined six-monthly ultrasound surveillance for liver cancer.",
  "takeaways": [
   "Cirrhosis is diffuse fibrosis with regenerative nodules.",
   "Trichrome stains collagen blue.",
   "Cirrhosis of any cause is the main risk for hepatocellular carcinoma."
  ],
  "stages": [
   {
    "id": "a",
    "label": "Imaging",
    "list": "test",
    "q": "Which test first for the liver and the fluid?",
    "ev": "His abdomen is distended with shifting dullness.",
    "hints": [
     "It uses sound waves, with no radiation.",
     "It shows free fluid in the abdomen.",
     "The liver surface is irregular and nodular.",
     "The spleen is enlarged.",
     "It is the first imaging in liver disease."
    ],
    "answer": "Abdominal ultrasound",
    "key": 2,
    "why": "Ultrasound shows ascites, a nodular liver surface, splenomegaly and a dilated portal vein. CT is second line.",
    "contenders": [
     [
      "Abdominal ultrasound",
      "Quick, no radiation."
     ],
     [
      "Abdominal CT",
      "Second line, with radiation."
     ],
     [
      "Liver tests",
      "Blood, not images."
     ],
     [
      "Upper GI endoscopy",
      "Looks for varices."
     ]
    ],
    "src": [
     [
      "pathanat",
      "Pathological anatomy",
      2
     ]
    ]
   },
   {
    "id": "b",
    "label": "Biopsy",
    "list": "dx",
    "q": "What does the biopsy show?",
    "ev": "A liver biopsy stained with Masson trichrome. Collagen is blue. Drag to move, zoom to look closer.",
    "hints": [
     "Red hepatocytes arranged in round nodules.",
     "Blue bands of collagen wrap each nodule.",
     "The normal lobule, with its central vein and portal tracts, is lost.",
     "The change is diffuse, not one focus.",
     "Regenerative nodules surrounded by fibrosis."
    ],
    "answer": "Cirrhosis",
    "key": 2,
    "why": "Cirrhosis is diffuse fibrosis that splits the liver into regenerative nodules. Steatosis keeps the architecture, and alcoholic hepatitis shows ballooned cells and neutrophils.",
    "contenders": [
     [
      "Cirrhosis",
      "Nodules wrapped in fibrosis."
     ],
     [
      "Alcoholic hepatitis",
      "Ballooning, Mallory bodies, neutrophils."
     ],
     [
      "Hepatic steatosis",
      "Fat droplets, normal architecture."
     ],
     [
      "Hepatocellular carcinoma",
      "A mass of atypical hepatocytes."
     ]
    ],
    "src": [
     [
      "pathanat",
      "Pathological anatomy",
      2
     ]
    ],
    "slide": {
     "stain": "Masson trichrome, then H&E",
     "images": [
      {
       "src": "files/histo/cirrhosis-1.webp",
       "mag": "Low power",
       "by": "Mikael Häggström, M.D.",
       "lic": "CC0",
       "page": "https://commons.wikimedia.org/wiki/File:Trichrome_stain_of_chronic_alcoholic_cirrhosis.jpg"
      },
      {
       "src": "files/histo/cirrhosis-2.webp",
       "mag": "High power, H&E",
       "by": "Mikael Häggström, M.D.",
       "lic": "CC0",
       "page": "https://commons.wikimedia.org/wiki/File:Histopathology_of_chronic_alcoholic_cirrhosis.jpg"
      }
     ]
    }
   },
   {
    "id": "c",
    "label": "Complication",
    "list": "dx",
    "q": "Which cancer is he most at risk of?",
    "ev": "On surveillance, a new 4 cm liver mass appears.",
    "hints": [
     "It arises in a liver that is already damaged.",
     "Alpha-fetoprotein is raised.",
     "On CT it enhances early and washes out.",
     "Cirrhosis of any cause is the main risk.",
     "The commonest primary liver cancer."
    ],
    "answer": "Hepatocellular carcinoma",
    "key": 3,
    "why": "Most hepatocellular carcinomas arise in cirrhosis. Metastases are usually multiple, and cholangiocarcinoma starts in the bile ducts.",
    "contenders": [
     [
      "Hepatocellular carcinoma",
      "Arises in cirrhosis."
     ],
     [
      "Liver metastases",
      "Usually multiple, with a known primary."
     ],
     [
      "Cholangiocarcinoma",
      "Bile duct origin."
     ],
     [
      "Hepatic encephalopathy",
      "A complication, not a mass."
     ]
    ],
    "src": [
     [
      "pathanat",
      "Pathological anatomy",
      2
     ]
    ]
   }
  ],
  "n": 19
 },
 {
  "title": "Cramps and diarrhoea",
  "who": "Man, 24",
  "tag": "Clinic",
  "vit": [
   [
    "HR",
    "88"
   ],
   [
    "BP",
    "118/74"
   ],
   [
    "RR",
    "16"
   ],
   [
    "SpO₂",
    "99%"
   ],
   [
    "T",
    "37.6"
   ]
  ],
  "line": "Eight months of diarrhoea, cramping pain in the right lower abdomen and 7 kg weight loss. An anal fissure last year.",
  "dx": "Crohn's disease",
  "outcome": "Ileocolonic Crohn's disease. He started induction therapy and stopped smoking.",
  "takeaways": [
   "Crohn's is patchy and transmural, from mouth to anus.",
   "Non-caseating granulomas are the classic finding.",
   "Ulcerative colitis is continuous, and it is limited to the mucosa."
  ],
  "stages": [
   {
    "id": "a",
    "label": "Endoscopy",
    "list": "test",
    "q": "Which test lets you see the lining and take biopsies?",
    "ev": "The pain, weight loss and anal fissure point to an inflammatory bowel disease.",
    "hints": [
     "It allows biopsies.",
     "It can reach the terminal ileum.",
     "Deep, linear ulcers are separated by normal mucosa.",
     "The disease comes in patches: skip lesions.",
     "A flexible camera is passed through the anus."
    ],
    "answer": "Colonoscopy",
    "key": 3,
    "why": "Colonoscopy with ileal intubation shows skip lesions and deep linear ulcers, and biopsies give the diagnosis. CT shows the wall but cannot sample it.",
    "contenders": [
     [
      "Colonoscopy",
      "Direct view and biopsies."
     ],
     [
      "Abdominal CT",
      "Wall thickening, no biopsy."
     ],
     [
      "Stool microscopy",
      "Parasites, not structure."
     ],
     [
      "Faecal occult blood test",
      "Only detects blood."
     ]
    ],
    "src": [
     [
      "pathanat",
      "Pathological anatomy",
      2
     ]
    ]
   },
   {
    "id": "b",
    "label": "Biopsy",
    "list": "dx",
    "q": "What does the colon biopsy show?",
    "ev": "A colonic biopsy under the microscope (H&E). Drag to move, zoom to look closer.",
    "hints": [
     "Colonic crypts with chronic inflammation around them.",
     "The crypts are distorted, not straight.",
     "A rounded cluster of pale epithelioid cells sits in the mucosa.",
     "The cluster has no caseating necrosis: a non-caseating granuloma.",
     "Patchy, transmural disease that can affect any part of the gut."
    ],
    "answer": "Inflammatory bowel disease",
    "key": 3,
    "why": "A non-caseating granuloma with chronic inflammation and distorted crypts is typical of Crohn's disease. Ulcerative colitis has crypt abscesses and no granulomas.",
    "contenders": [
     [
      "Inflammatory bowel disease",
      "Granuloma, distorted crypts."
     ],
     [
      "Gastroenteritis",
      "Short illness, no granulomas."
     ],
     [
      "Colorectal cancer",
      "Malignant glands."
     ],
     [
      "Clostridioides difficile colitis",
      "Pseudomembranes."
     ]
    ],
    "src": [
     [
      "pathanat",
      "Pathological anatomy",
      2
     ]
    ],
    "show": "Inflammatory bowel disease (Crohn's disease)",
    "slide": {
     "stain": "H&E",
     "images": [
      {
       "src": "files/histo/crohn-1.webp",
       "mag": "Low power",
       "by": "Nephron",
       "lic": "CC BY-SA 3.0",
       "page": "https://commons.wikimedia.org/wiki/File:Crohn's_disease_-_colon_-_intermed_mag.jpg"
      },
      {
       "src": "files/histo/crohn-2.webp",
       "mag": "Intermediate power",
       "by": "Nephron",
       "lic": "CC BY-SA 3.0",
       "page": "https://commons.wikimedia.org/wiki/File:Crohn's_disease_-_colon_-_high_mag.jpg"
      }
     ]
    }
   }
  ],
  "n": 20
 },
 {
  "title": "Blood in the stool",
  "who": "Man, 67",
  "tag": "Clinic",
  "vit": [
   [
    "HR",
    "86"
   ],
   [
    "BP",
    "132/80"
   ],
   [
    "RR",
    "16"
   ],
   [
    "SpO₂",
    "98%"
   ],
   [
    "T",
    "36.8"
   ]
  ],
  "line": "Four months of a change in bowel habit with blood mixed into the stool. He is tired and his haemoglobin is 9 g/dL.",
  "dx": "Colorectal adenocarcinoma",
  "outcome": "A sigmoid tumour was resected, and the staging scan showed no metastases.",
  "takeaways": [
   "Iron-deficiency anaemia in an older man needs a colonoscopy.",
   "Most colorectal cancers arise from adenomas.",
   "Histology: crowded, irregular malignant glands."
  ],
  "stages": [
   {
    "id": "a",
    "label": "Endoscopy",
    "list": "test",
    "q": "Which test examines the whole colon and allows a biopsy?",
    "ev": "He has anaemia, a change in bowel habit and visible blood.",
    "hints": [
     "It looks directly at the lining.",
     "A biopsy can be taken during it.",
     "The whole colon should be examined.",
     "It shows a mass in the sigmoid colon.",
     "A flexible camera is passed through the anus."
    ],
    "answer": "Colonoscopy",
    "key": 3,
    "why": "Colonoscopy sees the tumour, finds synchronous polyps and gives tissue. Faecal occult blood only screens.",
    "contenders": [
     [
      "Colonoscopy",
      "Direct view and biopsy."
     ],
     [
      "Faecal occult blood test",
      "A screening test only."
     ],
     [
      "Abdominal ultrasound",
      "Poor for the colon."
     ],
     [
      "Barium swallow",
      "Examines the oesophagus."
     ]
    ],
    "src": [
     [
      "pathanat",
      "Pathological anatomy",
      2
     ]
    ]
   },
   {
    "id": "b",
    "label": "Biopsy",
    "list": "dx",
    "q": "What does the biopsy show?",
    "ev": "A biopsy from the sigmoid mass (H&E). Normal crypts are on the left. Drag to move, zoom to look closer.",
    "hints": [
     "The tissue is colonic mucosa.",
     "On the right the glands are crowded and irregular.",
     "The glands stack back to back with little stroma between them.",
     "The nuclei are dark and enlarged.",
     "Malignant glands: an adenocarcinoma."
    ],
    "answer": "Colorectal cancer",
    "key": 2,
    "why": "Colorectal adenocarcinoma shows crowded, back-to-back glands with enlarged, hyperchromatic nuclei invading the wall. Colitis shows inflammation without glandular crowding.",
    "contenders": [
     [
      "Colorectal cancer",
      "Crowded, irregular malignant glands."
     ],
     [
      "Inflammatory bowel disease",
      "Inflammation, not crowding."
     ],
     [
      "Irritable bowel syndrome",
      "Normal histology."
     ],
     [
      "Ischaemic colitis",
      "Ghost crypts, no tumour."
     ]
    ],
    "src": [
     [
      "pathanat",
      "Pathological anatomy",
      2
     ]
    ],
    "slide": {
     "stain": "H&E",
     "images": [
      {
       "src": "files/histo/crc-1.webp",
       "mag": "Low power",
       "by": "Nephron",
       "lic": "CC BY-SA 3.0",
       "page": "https://commons.wikimedia.org/wiki/File:Colorectal_adenocarcinoma_--_low_mag.jpg"
      }
     ]
    }
   }
  ],
  "n": 21
 },
 {
  "title": "Crushing chest pain",
  "who": "Man, 63",
  "tag": "Emergency",
  "vit": [
   [
    "HR",
    "104"
   ],
   [
    "BP",
    "100/62"
   ],
   [
    "RR",
    "20"
   ],
   [
    "SpO₂",
    "95%"
   ],
   [
    "T",
    "37.0"
   ]
  ],
  "line": "Crushing central chest pain for 40 minutes, with sweating and nausea. He smokes 30 a day.",
  "dx": "Acute myocardial infarction",
  "outcome": "He died on day 3 from a ventricular rupture. The autopsy confirmed a three-day-old infarct.",
  "takeaways": [
   "Troponin rises 3 to 6 hours after the infarct.",
   "Histology dates the infarct: neutrophils at day 1 to 3.",
   "Rupture is most likely around day 3 to 7."
  ],
  "stages": [
   {
    "id": "a",
    "label": "Blood test",
    "list": "test",
    "q": "Which test confirms myocardial injury?",
    "ev": "The ECG shows ST elevation in the anterior leads.",
    "hints": [
     "It is a blood test.",
     "It is released from damaged heart muscle.",
     "It rises three to six hours after the pain starts.",
     "It stays high for several days.",
     "A cardiac-specific protein."
    ],
    "answer": "Troponin",
    "key": 2,
    "why": "Troponin is the preferred marker of myocardial necrosis. The ECG shows the pattern, and the troponin confirms the necrosis.",
    "contenders": [
     [
      "Troponin",
      "Specific for heart muscle."
     ],
     [
      "ECG",
      "Shows the pattern, not necrosis."
     ],
     [
      "Echocardiography",
      "Shows wall motion."
     ],
     [
      "Chest X-ray",
      "Shows the lungs and heart size."
     ]
    ],
    "src": [
     [
      "pathanat",
      "Pathological anatomy",
      2
     ]
    ]
   },
   {
    "id": "b",
    "label": "Autopsy",
    "list": "dx",
    "q": "What does the heart muscle show?",
    "ev": "At autopsy, the infarcted wall under the microscope (H&E). Drag to move, zoom to look closer.",
    "hints": [
     "Pink, striated heart muscle fibres.",
     "Many fibres have lost their nuclei.",
     "The dead fibres have dense pink cytoplasm: coagulative necrosis.",
     "Neutrophils and nuclear debris lie between the fibres.",
     "The change is about three days old."
    ],
    "answer": "Acute coronary syndrome",
    "key": 3,
    "why": "Coagulative necrosis with a neutrophil infiltrate dates an infarct to day 1 to 3. Macrophages follow, then granulation tissue and then a scar.",
    "contenders": [
     [
      "Acute coronary syndrome",
      "Necrosis and neutrophils."
     ],
     [
      "Acute pericarditis",
      "Inflammation of the pericardium."
     ],
     [
      "Infective endocarditis",
      "A disease of the valves."
     ],
     [
      "Aortic stenosis",
      "Hypertrophy, not necrosis."
     ]
    ],
    "src": [
     [
      "pathanat",
      "Pathological anatomy",
      2
     ]
    ],
    "show": "Acute coronary syndrome (myocardial infarction)",
    "slide": {
     "stain": "H&E",
     "images": [
      {
       "src": "files/histo/mi-2.webp",
       "mag": "Intermediate power",
       "by": "Mikael Häggström, M.D.",
       "lic": "CC0",
       "page": "https://commons.wikimedia.org/wiki/File:Histopathology_of_myocardial_infarction_with_karyorrhexis_and_few_lymphocytes.jpg"
      },
      {
       "src": "files/histo/mi-1.webp",
       "mag": "High power",
       "by": "Mikael Häggström, M.D.",
       "lic": "CC0",
       "page": "https://commons.wikimedia.org/wiki/File:Histopathology_of_neutrophil_infiltration_in_myocardial_infarction.jpg"
      }
     ]
    }
   }
  ],
  "n": 22
 }
]);
