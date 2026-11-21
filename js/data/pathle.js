/* Clinidle slide game: guess the pathology from a real photomicrograph. Images are small WebP copies of Wikimedia Commons files (author, licence and
   file page stored per slide, shown in the debrief). start: first daily date; case n is the n-th day, repeating once the list ends.
   Ladder: slide, stain and power, history, a second slide, what to look at. */
window.SINA = window.SINA || { subjects: [], lectures: {} };
SINA.pathle = {
 "key": "sina:pathle",
 "start": "2026-11-20",
 "list": [
  [
   "Hashimoto thyroiditis",
   [
    "Hashimoto",
    "chronic lymphocytic thyroiditis"
   ],
   "Thyroid"
  ],
  [
   "Graves disease",
   [
    "Graves"
   ],
   "Thyroid"
  ],
  [
   "De Quervain thyroiditis",
   [
    "subacute thyroiditis"
   ],
   "Thyroid"
  ],
  [
   "Papillary thyroid carcinoma",
   [
    "papillary carcinoma"
   ],
   "Thyroid"
  ],
  [
   "Cirrhosis",
   [
    "liver cirrhosis"
   ],
   "Liver"
  ],
  [
   "Hepatocellular carcinoma",
   [
    "HCC"
   ],
   "Liver"
  ],
  [
   "Fatty liver",
   [
    "steatosis"
   ],
   "Liver"
  ],
  [
   "Viral hepatitis",
   [
    "hepatitis"
   ],
   "Liver"
  ],
  [
   "Invasive ductal carcinoma",
   [
    "IDC",
    "ductal carcinoma",
    "breast carcinoma"
   ],
   "Breast"
  ],
  [
   "Fibroadenoma",
   [],
   "Breast"
  ],
  [
   "Invasive lobular carcinoma",
   [
    "lobular carcinoma"
   ],
   "Breast"
  ],
  [
   "Crohn's disease",
   [
    "Crohn",
    "Crohn disease"
   ],
   "Colon"
  ],
  [
   "Ulcerative colitis",
   [
    "UC"
   ],
   "Colon"
  ],
  [
   "Colorectal adenocarcinoma",
   [
    "colon cancer",
    "colorectal cancer",
    "colon adenocarcinoma"
   ],
   "Colon"
  ],
  [
   "Tubular adenoma",
   [
    "adenomatous polyp",
    "colon polyp"
   ],
   "Colon"
  ],
  [
   "Squamous cell carcinoma",
   [
    "SCC",
    "squamous carcinoma"
   ],
   "Skin, cervix, oesophagus"
  ],
  [
   "Basal cell carcinoma",
   [
    "BCC"
   ],
   "Skin"
  ],
  [
   "Melanoma",
   [],
   "Skin"
  ],
  [
   "Myocardial infarction",
   [
    "MI",
    "heart attack",
    "infarct"
   ],
   "Heart"
  ],
  [
   "Myocarditis",
   [],
   "Heart"
  ],
  [
   "Amyloidosis",
   [],
   "Any organ"
  ],
  [
   "Leiomyoma",
   [
    "fibroid",
    "uterine fibroid"
   ],
   "Uterus"
  ],
  [
   "Leiomyosarcoma",
   [],
   "Uterus, soft tissue"
  ],
  [
   "Endometrial adenocarcinoma",
   [
    "endometrial carcinoma"
   ],
   "Uterus"
  ],
  [
   "Helicobacter pylori gastritis",
   [
    "H pylori",
    "helicobacter",
    "chronic gastritis",
    "gastritis"
   ],
   "Stomach"
  ],
  [
   "Gastric adenocarcinoma",
   [
    "stomach cancer"
   ],
   "Stomach"
  ],
  [
   "Celiac disease",
   [
    "coeliac",
    "celiac"
   ],
   "Small intestine"
  ],
  [
   "Tuberculosis",
   [
    "TB",
    "caseating granuloma"
   ],
   "Lung, any organ"
  ],
  [
   "Sarcoidosis",
   [],
   "Lung, nodes"
  ],
  [
   "Lobar pneumonia",
   [
    "pneumonia"
   ],
   "Lung"
  ],
  [
   "Glioblastoma",
   [
    "GBM"
   ],
   "Brain"
  ]
 ],
 "cases": [
  {
   "id": "hashimoto",
   "answer": "Hashimoto thyroiditis",
   "organ": "Thyroid",
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
   ],
   "hist": "A 42-year-old woman has fatigue, weight gain and cold intolerance. The thyroid is diffusely enlarged, firm and painless. TSH is high.",
   "look": "Dense lymphoid infiltrate with germinal centres, and follicles lined by large pink Hürthle (oncocytic) cells.",
   "why": "Hashimoto thyroiditis is autoimmune destruction of the thyroid: a lymphoplasmacytic infiltrate with germinal centres, atrophic follicles and Hürthle cells. Graves has hyperplastic follicles with scalloped colloid; de Quervain has granulomas and giant cells."
  },
  {
   "id": "cirrhosis",
   "answer": "Cirrhosis",
   "organ": "Liver",
   "stain": "Masson trichrome",
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
   ],
   "hist": "A 55-year-old man with 20 years of heavy alcohol use has ascites, spider angiomata and a shrunken nodular liver.",
   "look": "Fibrous bands (blue) surrounding rounded nodules of hepatocytes: the normal lobular architecture is lost.",
   "why": "Cirrhosis is diffuse fibrosis with regenerative nodules. The trichrome stain shows collagen in blue around parenchymal nodules. It is irreversible and raises the risk of hepatocellular carcinoma."
  },
  {
   "id": "idc",
   "answer": "Invasive ductal carcinoma",
   "organ": "Breast",
   "stain": "H&E",
   "images": [
    {
     "src": "files/histo/idc-2.webp",
     "mag": "High power",
     "by": "Mikael Häggström, M.D.",
     "lic": "CC0",
     "page": "https://commons.wikimedia.org/wiki/File:Histopathology_of_invasive_ductal_carcinoma,_high_magnification.jpg"
    }
   ],
   "hist": "A 61-year-old woman has a hard, irregular, painless lump in the upper outer quadrant of the breast with skin dimpling.",
   "look": "Nests of pleomorphic epithelial cells with prominent nucleoli infiltrating fat.",
   "why": "Invasive ductal carcinoma (no special type) is the commonest breast cancer: cords and nests of atypical ductal cells infiltrating fat and stroma. Grade with Nottingham (Elston-Ellis): tubules, nuclear grade and mitoses."
  },
  {
   "id": "crohn",
   "answer": "Crohn's disease",
   "organ": "Colon",
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
   ],
   "hist": "A 24-year-old with months of diarrhoea, right lower quadrant pain and weight loss. Colonoscopy shows skip lesions with deep linear ulcers.",
   "look": "A small non-caseating granuloma in the mucosa with chronic inflammation and distorted crypts.",
   "why": "Crohn's disease is patchy, transmural inflammation with non-caseating granulomas, lymphoid aggregates and fissuring ulcers. Ulcerative colitis is continuous and limited to mucosa and submucosa, with crypt abscesses and no granulomas."
  },
  {
   "id": "crc",
   "answer": "Colorectal adenocarcinoma",
   "organ": "Colon",
   "stain": "H&E",
   "images": [
    {
     "src": "files/histo/crc-1.webp",
     "mag": "Low power",
     "by": "Nephron",
     "lic": "CC BY-SA 3.0",
     "page": "https://commons.wikimedia.org/wiki/File:Colorectal_adenocarcinoma_--_low_mag.jpg"
    }
   ],
   "hist": "A 68-year-old man has iron-deficiency anaemia, change in bowel habit and blood mixed in the stool. Colonoscopy shows an exophytic mass in the sigmoid.",
   "look": "Normal crypts on the left abut crowded, irregular, back-to-back malignant glands on the right.",
   "why": "Colorectal adenocarcinoma arises from an adenoma through the APC, KRAS, p53 sequence. Histology shows tall, crowded, irregular glands with hyperchromatic nuclei and often necrotic debris in the lumen."
  },
  {
   "id": "scc",
   "answer": "Squamous cell carcinoma",
   "organ": "Skin",
   "stain": "H&E",
   "images": [
    {
     "src": "files/histo/scc-2.webp",
     "mag": "High power",
     "by": "Valerie R. Yanofsky, Stephen E. Mercer, et al.",
     "lic": "CC BY 4.0",
     "page": "https://commons.wikimedia.org/wiki/File:Micrograph_of_invasive_squamous_cell_carcinoma_-_200x.jpg"
    },
    {
     "src": "files/histo/scc-1.webp",
     "mag": "Low power",
     "by": "Valerie R. Yanofsky, Stephen E. Mercer, et al.",
     "lic": "CC BY 4.0",
     "page": "https://commons.wikimedia.org/wiki/File:Micrograph_of_invasive_squamous_cell_carcinoma_-_150x.jpg"
    }
   ],
   "hist": "A 72-year-old farmer has a scaly, crusted, ulcerated nodule on the dorsum of the hand, in sun-exposed skin.",
   "look": "Irregular nests of atypical squamous cells with abundant pink cytoplasm and keratin pearls.",
   "why": "Squamous cell carcinoma shows atypical keratinocytes with intercellular bridges and keratin pearls, invading the dermis. Sun exposure and actinic keratosis are the classic precursor; basal cell carcinoma shows palisading nests instead."
  },
  {
   "id": "mi",
   "answer": "Myocardial infarction",
   "organ": "Heart",
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
   ],
   "hist": "A 63-year-old man died three days after crushing chest pain radiating to the left arm. Troponin was markedly raised.",
   "look": "Pale, dead myocytes without nuclei, with neutrophils and nuclear debris between them.",
   "why": "Day 1 to 3 of an infarct shows coagulative necrosis with a neutrophil infiltrate; days 3 to 7 macrophages, then granulation tissue and finally scar. The timing of these changes dates the infarct."
  },
  {
   "id": "leio",
   "answer": "Leiomyoma",
   "organ": "Uterus",
   "stain": "H&E",
   "images": [
    {
     "src": "files/histo/leio-2.webp",
     "mag": "High power",
     "by": "Mikael Häggström, M.D.",
     "lic": "CC0",
     "page": "https://commons.wikimedia.org/wiki/File:Histopathology_of_leiomyoma_with_nuclear_pleomorphism.jpg"
    }
   ],
   "hist": "A 38-year-old woman has heavy menstrual bleeding and a firm, enlarged, irregular uterus. Ultrasound shows a well-circumscribed mass.",
   "look": "Interlacing fascicles of spindle cells with cigar-shaped nuclei and no necrosis.",
   "why": "Leiomyoma is a benign smooth-muscle tumour: well-circumscribed, fascicles of bland spindle cells with cigar-shaped nuclei. Leiomyosarcoma shows atypia, necrosis and mitoses."
  },
  {
   "id": "hp",
   "answer": "Helicobacter pylori gastritis",
   "organ": "Stomach",
   "stain": "H&E",
   "images": [
    {
     "src": "files/histo/hp-1.webp",
     "mag": "Intermediate power",
     "by": "Nephron",
     "lic": "CC BY-SA 3.0",
     "page": "https://commons.wikimedia.org/wiki/File:Gastritis_helicobacter_-_intermed_mag.jpg"
    },
    {
     "src": "files/histo/hp-2.webp",
     "mag": "Very high power",
     "by": "Nephron",
     "lic": "CC BY-SA 3.0",
     "page": "https://commons.wikimedia.org/wiki/File:Helicobacter_gastritis_--_very_high_mag.jpg"
    }
   ],
   "hist": "A 47-year-old has burning epigastric pain that improves with meals, and nausea. A biopsy of the gastric antrum is taken at endoscopy.",
   "look": "Lymphocytes and plasma cells in the lamina propria, and small curved rods in the surface mucus.",
   "why": "H. pylori causes chronic active gastritis, mostly in the antrum: plasma cells, lymphoid follicles and neutrophils in the epithelium, with curved bacteria in the mucus. It predisposes to peptic ulcer, adenocarcinoma and MALT lymphoma."
  }
 ]
};
