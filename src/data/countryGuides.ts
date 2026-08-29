/**
 * Country study-abroad guides data.
 *
 * Each guide is a structured "blog post" that helps prospective students
 * evaluate a destination country for their higher-education journey. Content is
 * organized into consistent sections so students can compare countries easily.
 *
 * This is static content for now. When a CMS/backend is added, this module can
 * be swapped for a data-fetching layer with the same shape.
 */

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface QuickFact {
  label: string;
  value: string;
}

export interface CountryGuide {
  slug: string;
  country: string;
  flag: string;
  /** Short marketing tagline shown on cards */
  tagline: string;
  /** One-paragraph summary for the listing page + meta description */
  summary: string;
  /** Estimated read time in minutes */
  readTime: number;
  /** Publication / last-updated date (ISO) */
  updated: string;
  /** Key at-a-glance facts shown in the article sidebar */
  quickFacts: QuickFact[];
  /** Highlighted selling points */
  highlights: string[];
  /** Full article body */
  sections: GuideSection[];
}

export const countryGuides: CountryGuide[] = [
  {
    slug: "study-in-canada",
    country: "Canada",
    flag: "🇨🇦",
    tagline: "Affordable quality education with clear PR pathways",
    summary:
      "Canada combines world-class universities, comparatively affordable tuition, generous post-study work rights, and some of the clearest permanent-residency pathways for international graduates — making it a top choice for students planning a long-term future abroad.",
    readTime: 8,
    updated: "2026-08-28",
    quickFacts: [
      { label: "Intakes", value: "Sep (Fall), Jan (Winter), May (Summer)" },
      { label: "Avg. Tuition", value: "CAD 15,000 – 35,000 / year" },
      { label: "Post-Study Work", value: "Up to 3 years (PGWP)" },
      { label: "Tests", value: "IELTS / TOEFL / PTE" },
      { label: "Popular Cities", value: "Toronto, Vancouver, Montreal" },
    ],
    highlights: [
      "Post-Graduation Work Permit (PGWP) up to 3 years",
      "Multiple Express Entry & provincial PR pathways",
      "Lower tuition than the US, UK, or Australia",
      "Safe, multicultural, welcoming society",
    ],
    sections: [
      {
        heading: "Why Study in Canada?",
        paragraphs: [
          "Canada has become one of the most sought-after destinations for international students, and for good reason. It offers a rare combination of academic excellence, affordability, and a genuine pathway to permanent residency for those who wish to settle after graduation.",
          "Canadian degrees are recognised globally, and the country consistently ranks among the best in the world for quality of life, safety, and inclusiveness. For students weighing long-term career and immigration goals, Canada is hard to beat.",
        ],
      },
      {
        heading: "Top Universities",
        paragraphs: [
          "Canada is home to several globally ranked institutions across a wide range of disciplines.",
        ],
        bullets: [
          "University of Toronto",
          "University of British Columbia (UBC)",
          "McGill University",
          "University of Waterloo (strong for tech & co-op)",
          "University of Alberta",
        ],
      },
      {
        heading: "Admission Process",
        paragraphs: [
          "The Canadian admission process is straightforward but rewards early preparation. Most universities admit for the Fall (September) intake, with many also offering Winter (January) and some Summer (May) starts.",
        ],
        bullets: [
          "Shortlist programs and check specific entry requirements",
          "Prepare academic transcripts and English test scores (IELTS/TOEFL/PTE)",
          "Write a strong Statement of Purpose (SOP) and secure Letters of Recommendation",
          "Apply directly or via the institution's application portal",
          "Receive your Letter of Acceptance (LOA), then apply for a study permit",
        ],
      },
      {
        heading: "Cost of Studying & Living",
        paragraphs: [
          "Tuition varies by program and institution, generally ranging from CAD 15,000 to 35,000 per year for international students. Living costs depend heavily on the city — Toronto and Vancouver are the most expensive, while cities in the Prairies or Atlantic Canada are more affordable.",
          "Students should budget roughly CAD 12,000–18,000 per year for living expenses, and are required to show proof of funds when applying for a study permit.",
        ],
      },
      {
        heading: "Work Rights & Permanent Residency",
        paragraphs: [
          "International students can work up to 24 hours per week off-campus during academic sessions and full-time during scheduled breaks. After graduation, the Post-Graduation Work Permit (PGWP) allows you to work in Canada for up to three years.",
          "Canadian work experience gained through the PGWP significantly strengthens your profile for permanent residency through Express Entry or Provincial Nominee Programs (PNPs) — one of Canada's biggest draws.",
        ],
      },
      {
        heading: "Is Canada Right for You?",
        paragraphs: [
          "Choose Canada if you value affordability, safety, and a clear route from study to work to permanent residency. It's an especially strong choice for students in STEM, business, healthcare, and skilled trades who want to build a long-term future abroad.",
        ],
      },
    ],
  },
  {
    slug: "study-in-usa",
    country: "United States",
    flag: "🇺🇸",
    tagline: "Home to the world's top-ranked universities",
    summary:
      "The United States hosts more top-ranked universities than any other country, offering unmatched academic breadth, cutting-edge research, and strong career outcomes — particularly for STEM graduates who benefit from extended work authorization.",
    readTime: 9,
    updated: "2026-08-28",
    quickFacts: [
      { label: "Intakes", value: "Fall (Aug/Sep), Spring (Jan)" },
      { label: "Avg. Tuition", value: "USD 25,000 – 55,000 / year" },
      { label: "Post-Study Work", value: "OPT 1 yr (+2 yrs STEM)" },
      { label: "Tests", value: "IELTS/TOEFL + GRE/GMAT/SAT" },
      { label: "Popular Cities", value: "New York, Boston, San Francisco" },
    ],
    highlights: [
      "World's highest concentration of top-ranked universities",
      "Optional Practical Training (OPT), extended for STEM fields",
      "Vast range of programs and research funding",
      "Strong alumni networks and career outcomes",
    ],
    sections: [
      {
        heading: "Why Study in the USA?",
        paragraphs: [
          "The United States is the global leader in higher education, home to institutions that dominate international rankings. For students seeking academic prestige, research opportunities, and access to the world's largest job market, the US remains the benchmark.",
          "Beyond the Ivy League, the US offers thousands of universities and colleges catering to every academic interest, budget, and career ambition, with an emphasis on flexibility and interdisciplinary study.",
        ],
      },
      {
        heading: "Top Universities",
        paragraphs: [
          "The US boasts an unrivalled roster of elite institutions.",
        ],
        bullets: [
          "Massachusetts Institute of Technology (MIT)",
          "Stanford University",
          "Harvard University",
          "California Institute of Technology (Caltech)",
          "Carnegie Mellon University (strong for tech)",
        ],
      },
      {
        heading: "Admission Process",
        paragraphs: [
          "US admissions are holistic — universities look beyond grades to essays, recommendations, extracurriculars, and standardized test scores. The main intake is Fall, with applications typically due 6–12 months in advance.",
        ],
        bullets: [
          "Research programs and note application deadlines early",
          "Take required tests: IELTS/TOEFL, plus GRE/GMAT (grad) or SAT/ACT (undergrad)",
          "Prepare essays / Statement of Purpose and recommendation letters",
          "Submit applications (often via Common App for undergrad)",
          "On acceptance, receive Form I-20 and apply for an F-1 student visa",
        ],
      },
      {
        heading: "Cost of Studying & Living",
        paragraphs: [
          "The US is among the more expensive destinations, with tuition ranging from USD 25,000 to 55,000+ per year depending on whether the institution is public or private. Living costs vary widely by location.",
          "However, many universities offer scholarships, assistantships, and financial aid — particularly at the graduate level — which can substantially offset costs.",
        ],
      },
      {
        heading: "Work Rights & Post-Study Options",
        paragraphs: [
          "F-1 students can work on-campus and, after the first year, off-campus under Curricular Practical Training (CPT). After graduation, Optional Practical Training (OPT) grants 12 months of work authorization — extended by an additional 24 months for STEM graduates, for a total of 3 years.",
          "OPT is a valuable bridge to longer-term work visas such as the H-1B, making STEM fields especially attractive for students planning to build a career in the US.",
        ],
      },
      {
        heading: "Is the USA Right for You?",
        paragraphs: [
          "Choose the US if academic prestige, research depth, and career potential are your priorities — and if you're prepared to invest in a higher-cost but high-return education. STEM students in particular benefit from the extended OPT window.",
        ],
      },
    ],
  },
  {
    slug: "study-in-uk",
    country: "United Kingdom",
    flag: "🇬🇧",
    tagline: "Prestigious degrees in as little as one year",
    summary:
      "The United Kingdom offers historic, globally respected universities and notably shorter degree durations — one-year master's and three-year bachelor's — helping students save time and money while earning a world-class qualification.",
    readTime: 7,
    updated: "2026-08-28",
    quickFacts: [
      { label: "Intakes", value: "Sep/Oct (main), Jan (secondary)" },
      { label: "Avg. Tuition", value: "GBP 12,000 – 30,000 / year" },
      { label: "Post-Study Work", value: "Graduate Route: 2 years" },
      { label: "Tests", value: "IELTS / PTE / TOEFL" },
      { label: "Popular Cities", value: "London, Manchester, Edinburgh" },
    ],
    highlights: [
      "One-year master's degrees save time and money",
      "Graduate Route visa: stay 2 years after study",
      "Globally recognised, centuries-old institutions",
      "Gateway to Europe and a diverse, English-speaking culture",
    ],
    sections: [
      {
        heading: "Why Study in the UK?",
        paragraphs: [
          "The UK is home to some of the oldest and most prestigious universities in the world, with qualifications respected by employers everywhere. Its biggest practical advantage is degree length: master's programs typically take just one year and bachelor's three, meaning lower total costs and faster entry into the workforce.",
          "With a rich academic tradition, vibrant student cities, and a multicultural society, the UK offers a compelling blend of heritage and opportunity.",
        ],
      },
      {
        heading: "Top Universities",
        paragraphs: ["The UK's leading institutions are globally elite."],
        bullets: [
          "University of Oxford",
          "University of Cambridge",
          "Imperial College London",
          "University College London (UCL)",
          "London School of Economics (LSE)",
        ],
      },
      {
        heading: "Admission Process",
        paragraphs: [
          "Undergraduate applications go through UCAS, while postgraduate applications are usually made directly to universities. The main intake is September/October, with some courses offering a January start.",
        ],
        bullets: [
          "Choose your course and check entry requirements",
          "Undergraduates apply via UCAS; postgraduates apply directly",
          "Submit a personal statement, references, and English test scores",
          "Receive a conditional/unconditional offer",
          "Get your CAS (Confirmation of Acceptance for Studies) and apply for a Student visa",
        ],
      },
      {
        heading: "Cost of Studying & Living",
        paragraphs: [
          "International tuition typically ranges from GBP 12,000 to 30,000 per year. London is significantly more expensive to live in than other UK cities. Because degrees are shorter, the overall cost can be lower than comparable programs in the US or Australia.",
          "Students must show they can cover tuition plus living costs (roughly GBP 1,023–1,334 per month depending on location) as part of the visa process.",
        ],
      },
      {
        heading: "Work Rights & Post-Study Options",
        paragraphs: [
          "Most international students can work up to 20 hours per week during term time and full-time during holidays. After graduating, the Graduate Route visa allows you to stay and work (or look for work) for two years — three years for PhD graduates.",
          "This post-study window gives graduates time to gain UK work experience and potentially transition to a Skilled Worker visa.",
        ],
      },
      {
        heading: "Is the UK Right for You?",
        paragraphs: [
          "Choose the UK if you want a prestigious, globally recognised degree in less time, value a rich cultural experience, and want a solid two-year post-study work window. It's ideal for students who prefer focused, fast-paced programs.",
        ],
      },
    ],
  },
  {
    slug: "study-in-australia",
    country: "Australia",
    flag: "🇦🇺",
    tagline: "High quality of life and strong post-study work rights",
    summary:
      "Australia pairs top-tier universities with an outstanding quality of life, generous post-study work visas, and clear skilled-migration pathways — an excellent choice for students who want to work and potentially settle after graduation.",
    readTime: 8,
    updated: "2026-08-28",
    quickFacts: [
      { label: "Intakes", value: "Feb (Sem 1), Jul (Sem 2)" },
      { label: "Avg. Tuition", value: "AUD 20,000 – 45,000 / year" },
      { label: "Post-Study Work", value: "2 – 4 years (Subclass 485)" },
      { label: "Tests", value: "IELTS / PTE / TOEFL" },
      { label: "Popular Cities", value: "Sydney, Melbourne, Brisbane" },
    ],
    highlights: [
      "Temporary Graduate visa (2–4 years of work rights)",
      "8 universities in the global top 100 (Group of Eight)",
      "Excellent quality of life and student support",
      "Clear skilled-migration pathways",
    ],
    sections: [
      {
        heading: "Why Study in Australia?",
        paragraphs: [
          "Australia has firmly established itself as a leading study destination, offering high-quality education, a relaxed and safe lifestyle, and some of the most generous post-study work rights in the world.",
          "Its universities are research-intensive and globally ranked, while the country's strong economy and skilled-migration framework make it attractive for students planning to work and settle after graduation.",
        ],
      },
      {
        heading: "Top Universities",
        paragraphs: [
          "Australia's prestigious 'Group of Eight' universities lead the way.",
        ],
        bullets: [
          "University of Melbourne",
          "Australian National University (ANU)",
          "University of Sydney",
          "University of New South Wales (UNSW)",
          "University of Queensland (UQ)",
        ],
      },
      {
        heading: "Admission Process",
        paragraphs: [
          "Australia has two main intakes: Semester 1 (February) and Semester 2 (July). The process is efficient and well-suited to international applicants.",
        ],
        bullets: [
          "Select your course and confirm entry requirements",
          "Prepare transcripts and English test scores (IELTS/PTE/TOEFL)",
          "Apply to the university and receive a Letter of Offer",
          "Accept the offer and receive your Confirmation of Enrolment (CoE)",
          "Apply for a Student visa (Subclass 500)",
        ],
      },
      {
        heading: "Cost of Studying & Living",
        paragraphs: [
          "Tuition generally ranges from AUD 20,000 to 45,000 per year depending on the program and institution. Sydney and Melbourne have higher living costs than cities like Adelaide or Brisbane.",
          "Students must demonstrate sufficient funds for tuition and living expenses as part of the visa application.",
        ],
      },
      {
        heading: "Work Rights & Post-Study Options",
        paragraphs: [
          "International students can work up to 48 hours per fortnight during study periods and unlimited hours during breaks. After graduating, the Temporary Graduate visa (Subclass 485) provides 2 to 4 years of full work rights, depending on your qualification level and field.",
          "Australia's points-based skilled-migration system offers pathways to permanent residency for graduates in in-demand occupations.",
        ],
      },
      {
        heading: "Is Australia Right for You?",
        paragraphs: [
          "Choose Australia if you want a top-quality education, an excellent lifestyle, and strong post-study work and migration prospects. It's a great fit for students seeking a balance of academics, career opportunity, and quality of life.",
        ],
      },
    ],
  },
  {
    slug: "study-in-new-zealand",
    country: "New Zealand",
    flag: "🇳🇿",
    tagline: "Safe, welcoming, and globally respected education",
    summary:
      "New Zealand offers globally recognised qualifications, a safe and welcoming environment, and post-study work rights in a country celebrated for its balanced lifestyle and stunning natural beauty — ideal for students seeking quality without the crowds.",
    readTime: 7,
    updated: "2026-08-28",
    quickFacts: [
      { label: "Intakes", value: "Feb (main), Jul (secondary)" },
      { label: "Avg. Tuition", value: "NZD 22,000 – 40,000 / year" },
      { label: "Post-Study Work", value: "Up to 3 years" },
      { label: "Tests", value: "IELTS / PTE / TOEFL" },
      { label: "Popular Cities", value: "Auckland, Wellington, Christchurch" },
    ],
    highlights: [
      "Post-study work visa up to 3 years",
      "All 8 universities ranked in the global top 500",
      "Safe, welcoming, and English-speaking",
      "Outstanding work-life balance and natural beauty",
    ],
    sections: [
      {
        heading: "Why Study in New Zealand?",
        paragraphs: [
          "New Zealand is an increasingly popular destination for students who want a high-quality, globally recognised education in a safe and friendly environment. All eight of its universities rank in the world's top 500, and its qualifications are respected internationally.",
          "The country is renowned for its practical, research-informed teaching, small class sizes, and a lifestyle that balances study with the outdoors — making it ideal for students who value wellbeing alongside academics.",
        ],
      },
      {
        heading: "Top Universities",
        paragraphs: ["New Zealand's universities punch well above their weight."],
        bullets: [
          "University of Auckland",
          "University of Otago",
          "Victoria University of Wellington",
          "University of Canterbury",
          "Massey University",
        ],
      },
      {
        heading: "Admission Process",
        paragraphs: [
          "New Zealand's main intake is February, with a secondary intake in July. The admission process is friendly and efficient for international students.",
        ],
        bullets: [
          "Choose your program and check entry requirements",
          "Prepare academic transcripts and English test scores",
          "Apply to the institution and receive an Offer of Place",
          "Pay fees and receive confirmation of enrolment",
          "Apply for a student visa through Immigration New Zealand",
        ],
      },
      {
        heading: "Cost of Studying & Living",
        paragraphs: [
          "Tuition for international students typically ranges from NZD 22,000 to 40,000 per year. Auckland is the most expensive city for living costs, while other centres are more affordable.",
          "Applicants must show evidence of funds to cover living expenses (around NZD 20,000 per year) in addition to tuition.",
        ],
      },
      {
        heading: "Work Rights & Post-Study Options",
        paragraphs: [
          "Most international students can work up to 20 hours per week during term and full-time during scheduled breaks. After graduation, eligible students can apply for a Post-Study Work Visa valid for up to three years, depending on the level and location of study.",
          "This work experience can support pathways toward residence for graduates in skilled occupations.",
        ],
      },
      {
        heading: "Is New Zealand Right for You?",
        paragraphs: [
          "Choose New Zealand if you want a respected qualification, a safe and welcoming environment, and an exceptional quality of life. It's perfect for students who prefer a calmer, nature-rich setting without compromising on academic standards.",
        ],
      },
    ],
  },
  {
    slug: "study-in-germany",
    country: "Germany",
    flag: "🇩🇪",
    tagline: "World-class engineering with little to no tuition",
    summary:
      "Germany offers tuition-free or very low-cost education at public universities, exceptional strength in engineering and sciences, and an 18-month post-study job-search visa — outstanding value in the heart of Europe.",
    readTime: 8,
    updated: "2026-08-28",
    quickFacts: [
      { label: "Intakes", value: "Winter (Oct), Summer (Apr)" },
      { label: "Avg. Tuition", value: "€0 – 20,000 / year (public often free)" },
      { label: "Post-Study Work", value: "18-month job-search visa" },
      { label: "Tests", value: "IELTS/TOEFL (+ German for some)" },
      { label: "Popular Cities", value: "Munich, Berlin, Aachen" },
    ],
    highlights: [
      "Tuition-free public universities in most states",
      "Global leader in engineering & applied sciences",
      "18-month post-study job-search visa",
      "Strong economy with high graduate demand",
    ],
    sections: [
      {
        heading: "Why Study in Germany?",
        paragraphs: [
          "Germany is one of the best-value study destinations in the world. Most public universities charge little to no tuition — even for international students — while delivering world-class education, particularly in engineering, technology, and the natural sciences.",
          "With Europe's largest economy and a strong demand for skilled graduates, Germany combines affordability with excellent career prospects.",
        ],
      },
      {
        heading: "Top Universities",
        paragraphs: ["Germany's technical and research universities are globally renowned."],
        bullets: [
          "Technical University of Munich (TUM)",
          "Ludwig Maximilian University of Munich (LMU)",
          "Heidelberg University",
          "RWTH Aachen University",
          "Technical University of Berlin",
        ],
      },
      {
        heading: "Admission Process",
        paragraphs: [
          "German universities admit primarily for the Winter (October) intake, with some Summer (April) options. Many master's programs are taught in English, though some require German proficiency.",
        ],
        bullets: [
          "Choose a program (check the language of instruction)",
          "Prepare transcripts, English (and sometimes German) test scores",
          "Apply via uni-assist or directly to the university",
          "Receive admission and open a blocked account for proof of funds",
          "Apply for a German student visa",
        ],
      },
      {
        heading: "Cost of Studying & Living",
        paragraphs: [
          "Public universities typically charge only a small semester fee (a few hundred euros), though some states and private institutions charge tuition. Living costs run around €900–1,200 per month.",
          "Students must show proof of funds (a blocked account of roughly €11,000+) for the visa.",
        ],
      },
      {
        heading: "Work Rights & Post-Study Options",
        paragraphs: [
          "Students can work up to 140 full days or 280 half days per year. After graduating, you can apply for an 18-month residence permit to seek employment related to your degree, with pathways to an EU Blue Card and settlement.",
        ],
      },
      {
        heading: "Is Germany Right for You?",
        paragraphs: [
          "Choose Germany if you want a high-quality, low-cost education — especially in engineering or sciences — and a strong route into the European job market.",
        ],
      },
    ],
  },
  {
    slug: "study-in-ireland",
    country: "Ireland",
    flag: "🇮🇪",
    tagline: "English-speaking EU hub for tech and pharma",
    summary:
      "Ireland is an English-speaking EU country hosting the European headquarters of global tech and pharma giants, with strong graduate employability and a two-year post-study stay-back option.",
    readTime: 7,
    updated: "2026-08-28",
    quickFacts: [
      { label: "Intakes", value: "Sep (main), Jan (some courses)" },
      { label: "Avg. Tuition", value: "€10,000 – 25,000 / year" },
      { label: "Post-Study Work", value: "Up to 2 years (Third Level Graduate)" },
      { label: "Tests", value: "IELTS / TOEFL / PTE" },
      { label: "Popular Cities", value: "Dublin, Cork, Galway" },
    ],
    highlights: [
      "English-speaking member of the EU",
      "European HQ of Google, Apple, Pfizer & more",
      "2-year post-study work visa",
      "Strong in tech, pharma, and business",
    ],
    sections: [
      {
        heading: "Why Study in Ireland?",
        paragraphs: [
          "Ireland offers the rare combination of an English-speaking environment inside the European Union, plus a booming economy anchored by the European headquarters of many of the world's largest technology and pharmaceutical companies.",
          "This creates outstanding internship and graduate-job opportunities, particularly in tech, pharma, finance, and business.",
        ],
      },
      {
        heading: "Top Universities",
        paragraphs: ["Ireland's universities are well regarded internationally."],
        bullets: [
          "Trinity College Dublin",
          "University College Dublin (UCD)",
          "University College Cork (UCC)",
          "University of Galway",
          "Dublin City University (DCU)",
        ],
      },
      {
        heading: "Admission Process",
        paragraphs: [
          "The main intake is September, with some programs offering a January start. Applications are made directly to universities or, for undergraduates, via the CAO.",
        ],
        bullets: [
          "Select your program and check requirements",
          "Prepare transcripts and English test scores",
          "Apply directly (postgraduate) or via CAO (undergraduate)",
          "Accept your offer and pay the deposit",
          "Apply for your Irish study visa",
        ],
      },
      {
        heading: "Cost of Studying & Living",
        paragraphs: [
          "Tuition typically ranges from €10,000 to €25,000 per year. Dublin is the most expensive city; budget around €10,000–14,000 per year for living costs.",
        ],
      },
      {
        heading: "Work Rights & Post-Study Options",
        paragraphs: [
          "Students can work up to 20 hours per week during term and 40 during holidays. The Third Level Graduate Programme lets eligible graduates stay up to two years to seek employment.",
        ],
      },
      {
        heading: "Is Ireland Right for You?",
        paragraphs: [
          "Choose Ireland if you want an English-taught EU education with direct access to global tech and pharma employers, plus a solid two-year post-study window.",
        ],
      },
    ],
  },
  {
    slug: "study-in-france",
    country: "France",
    flag: "🇫🇷",
    tagline: "Elite business & arts education in Europe",
    summary:
      "France blends prestigious business schools and universities with affordable public tuition, a rich cultural experience, and a two-year post-study work option in the heart of the EU.",
    readTime: 7,
    updated: "2026-08-28",
    quickFacts: [
      { label: "Intakes", value: "Sep (main), Jan (some)" },
      { label: "Avg. Tuition", value: "€3,000 – 20,000 / year" },
      { label: "Post-Study Work", value: "Up to 2 years (APS)" },
      { label: "Tests", value: "IELTS/TOEFL (+ French for some)" },
      { label: "Popular Cities", value: "Paris, Lyon, Toulouse" },
    ],
    highlights: [
      "World-leading business schools (Grandes Écoles)",
      "Affordable public-university tuition",
      "2-year post-study work permit (APS)",
      "Rich culture at the centre of Europe",
    ],
    sections: [
      {
        heading: "Why Study in France?",
        paragraphs: [
          "France is a global leader in business, management, and the arts, home to some of the world's most prestigious business schools. Public universities offer remarkably affordable tuition, and a growing number of programs are taught in English.",
          "Beyond academics, France offers an unmatched cultural experience and a strategic location within the EU.",
        ],
      },
      {
        heading: "Top Universities",
        paragraphs: ["France's institutions span elite Grandes Écoles and research universities."],
        bullets: [
          "Université PSL (Paris Sciences & Lettres)",
          "HEC Paris (business)",
          "Sorbonne University",
          "École Polytechnique",
          "INSEAD (business)",
        ],
      },
      {
        heading: "Admission Process",
        paragraphs: [
          "The main intake is September. Applications go through Campus France for many international students, or directly to institutions.",
        ],
        bullets: [
          "Choose a program (English or French taught)",
          "Prepare transcripts and language test scores",
          "Apply via Campus France or directly",
          "Receive admission and confirm enrolment",
          "Apply for a French student visa",
        ],
      },
      {
        heading: "Cost of Studying & Living",
        paragraphs: [
          "Public universities charge modest tuition (often €3,000–4,000/year for non-EU students), while private schools and business programs cost more. Living costs run around €10,000–15,000 per year, higher in Paris.",
        ],
      },
      {
        heading: "Work Rights & Post-Study Options",
        paragraphs: [
          "Students can work up to around 964 hours per year. Master's graduates can apply for a two-year post-study residence permit (APS) to work or seek employment.",
        ],
      },
      {
        heading: "Is France Right for You?",
        paragraphs: [
          "Choose France if you're drawn to business, management, or the arts, want affordable public tuition, and value a rich European cultural experience.",
        ],
      },
    ],
  },
  {
    slug: "study-in-netherlands",
    country: "Netherlands",
    flag: "🇳🇱",
    tagline: "English-taught degrees & innovative teaching",
    summary:
      "The Netherlands offers one of the largest ranges of English-taught programs in Europe, an innovative problem-based learning style, and a one-year orientation visa to find work after graduation.",
    readTime: 7,
    updated: "2026-08-28",
    quickFacts: [
      { label: "Intakes", value: "Sep (main), Feb (some)" },
      { label: "Avg. Tuition", value: "€8,000 – 20,000 / year" },
      { label: "Post-Study Work", value: "1-year orientation (zoekjaar)" },
      { label: "Tests", value: "IELTS / TOEFL" },
      { label: "Popular Cities", value: "Amsterdam, Delft, Eindhoven" },
    ],
    highlights: [
      "Huge choice of English-taught programs",
      "Innovative, problem-based learning",
      "1-year post-study orientation visa",
      "Highly international, English-friendly society",
    ],
    sections: [
      {
        heading: "Why Study in the Netherlands?",
        paragraphs: [
          "The Netherlands is a pioneer in English-taught higher education in continental Europe, with thousands of programs available. Its teaching style emphasises problem-based learning, teamwork, and practical application.",
          "As one of the most international and English-proficient societies in Europe, it's an easy and welcoming place for international students.",
        ],
      },
      {
        heading: "Top Universities",
        paragraphs: ["Dutch universities are research-strong and globally ranked."],
        bullets: [
          "Delft University of Technology (TU Delft)",
          "University of Amsterdam",
          "Eindhoven University of Technology",
          "Wageningen University (agriculture & environment)",
          "Erasmus University Rotterdam (business)",
        ],
      },
      {
        heading: "Admission Process",
        paragraphs: [
          "The main intake is September, with some February starts. Applications are usually made via Studielink and the institution.",
        ],
        bullets: [
          "Choose an English-taught program",
          "Prepare transcripts and English test scores",
          "Apply via Studielink / the university",
          "Receive admission and arrange funding proof",
          "Apply for your entry & residence permit",
        ],
      },
      {
        heading: "Cost of Studying & Living",
        paragraphs: [
          "Tuition for non-EU students typically ranges from €8,000 to €20,000 per year. Living costs are around €11,000–14,000 per year, with Amsterdam being the priciest.",
        ],
      },
      {
        heading: "Work Rights & Post-Study Options",
        paragraphs: [
          "Students can work part-time subject to permit rules. After graduating, the one-year 'orientation year' (zoekjaar) lets you live and work in the Netherlands while searching for a skilled job.",
        ],
      },
      {
        heading: "Is the Netherlands Right for You?",
        paragraphs: [
          "Choose the Netherlands if you want a wide choice of English-taught, innovative programs in a highly international, English-friendly country.",
        ],
      },
    ],
  },
  {
    slug: "study-in-italy",
    country: "Italy",
    flag: "🇮🇹",
    tagline: "Affordable, historic universities & rich culture",
    summary:
      "Italy offers some of Europe's oldest and most respected universities, affordable tuition with generous scholarships, and strength in design, architecture, engineering, and the arts.",
    readTime: 6,
    updated: "2026-08-28",
    quickFacts: [
      { label: "Intakes", value: "Sep/Oct (main), Feb (some)" },
      { label: "Avg. Tuition", value: "€1,000 – 12,000 / year" },
      { label: "Post-Study Work", value: "Up to 12 months job-search" },
      { label: "Tests", value: "IELTS/TOEFL (+ Italian for some)" },
      { label: "Popular Cities", value: "Milan, Rome, Bologna" },
    ],
    highlights: [
      "Very affordable public tuition + scholarships",
      "World-leading in design, fashion & architecture",
      "Home to Europe's oldest university (Bologna)",
      "12-month post-study job-search permit",
    ],
    sections: [
      {
        heading: "Why Study in Italy?",
        paragraphs: [
          "Italy combines centuries of academic tradition with affordable tuition and generous regional scholarships. It's especially strong in design, fashion, architecture, engineering, and the arts, and offers a growing number of English-taught programs.",
          "The cultural and lifestyle experience is second to none, at a fraction of the cost of many other European destinations.",
        ],
      },
      {
        heading: "Top Universities",
        paragraphs: ["Italy's universities blend history with modern excellence."],
        bullets: [
          "Politecnico di Milano (design & engineering)",
          "University of Bologna",
          "Sapienza University of Rome",
          "University of Padua",
          "Bocconi University (business)",
        ],
      },
      {
        heading: "Admission Process",
        paragraphs: [
          "The main intake is September/October. Applications are made through Universitaly and the institution, often with a pre-enrolment step at an Italian consulate.",
        ],
        bullets: [
          "Choose a program and check the language",
          "Prepare transcripts and test scores",
          "Apply via the university / Universitaly",
          "Complete pre-enrolment and receive admission",
          "Apply for an Italian student visa",
        ],
      },
      {
        heading: "Cost of Studying & Living",
        paragraphs: [
          "Public-university tuition is income-linked and often very low (€1,000–4,000/year), with many scholarships available. Living costs run around €8,000–12,000 per year.",
        ],
      },
      {
        heading: "Work Rights & Post-Study Options",
        paragraphs: [
          "Students can work up to 20 hours per week. Graduates can convert to a 12-month permit to seek work or start a business.",
        ],
      },
      {
        heading: "Is Italy Right for You?",
        paragraphs: [
          "Choose Italy for affordable, historic education — particularly in design, architecture, or the arts — paired with an incomparable cultural lifestyle.",
        ],
      },
    ],
  },
  {
    slug: "study-in-spain",
    country: "Spain",
    flag: "🇪🇸",
    tagline: "Vibrant lifestyle & growing English programs",
    summary:
      "Spain offers affordable, quality education, a warm and vibrant lifestyle, and a fast-growing range of English-taught programs — with strong business schools and a welcoming international community.",
    readTime: 6,
    updated: "2026-08-28",
    quickFacts: [
      { label: "Intakes", value: "Sep/Oct (main), Jan/Feb (some)" },
      { label: "Avg. Tuition", value: "€1,500 – 18,000 / year" },
      { label: "Post-Study Work", value: "Job-search permit available" },
      { label: "Tests", value: "IELTS/TOEFL (+ Spanish for some)" },
      { label: "Popular Cities", value: "Madrid, Barcelona, Valencia" },
    ],
    highlights: [
      "Affordable tuition and living costs",
      "Top-ranked business schools (IE, ESADE, IESE)",
      "Vibrant lifestyle and pleasant climate",
      "Growing selection of English-taught degrees",
    ],
    sections: [
      {
        heading: "Why Study in Spain?",
        paragraphs: [
          "Spain is an increasingly popular destination, offering quality education at affordable prices in one of Europe's most enjoyable lifestyles. Its business schools rank among the best in the world, and English-taught programs are expanding rapidly.",
          "A warm climate, rich culture, and welcoming international community make Spain a favourite for students seeking balance.",
        ],
      },
      {
        heading: "Top Universities",
        paragraphs: ["Spain excels in business and research."],
        bullets: [
          "IE University (business)",
          "ESADE Business School",
          "IESE Business School",
          "University of Barcelona",
          "Autonomous University of Madrid",
        ],
      },
      {
        heading: "Admission Process",
        paragraphs: [
          "The main intake is September/October. Applications are made directly to institutions, with some programs starting in January/February.",
        ],
        bullets: [
          "Select a program and check the language",
          "Prepare transcripts and test scores",
          "Apply directly to the university",
          "Accept your offer and pay the deposit",
          "Apply for a Spanish student visa",
        ],
      },
      {
        heading: "Cost of Studying & Living",
        paragraphs: [
          "Public tuition is affordable (€1,500–3,500/year), while private and business programs cost more. Living costs are moderate at around €9,000–13,000 per year.",
        ],
      },
      {
        heading: "Work Rights & Post-Study Options",
        paragraphs: [
          "Students can work part-time with a permit. Graduates can apply to convert their student permit to a job-search or work permit.",
        ],
      },
      {
        heading: "Is Spain Right for You?",
        paragraphs: [
          "Choose Spain if you want affordable, quality education — especially in business — with a vibrant lifestyle and a welcoming international community.",
        ],
      },
    ],
  },
  {
    slug: "study-in-sweden",
    country: "Sweden",
    flag: "🇸🇪",
    tagline: "Innovation-driven education & sustainability focus",
    summary:
      "Sweden is a global innovation leader offering cutting-edge, English-taught programs, a strong focus on sustainability and research, and an 18-month post-study residence permit to find work.",
    readTime: 7,
    updated: "2026-08-28",
    quickFacts: [
      { label: "Intakes", value: "Aug/Sep (main), Jan (some)" },
      { label: "Avg. Tuition", value: "SEK 80,000 – 200,000 / year" },
      { label: "Post-Study Work", value: "Up to 18 months to find work" },
      { label: "Tests", value: "IELTS / TOEFL" },
      { label: "Popular Cities", value: "Stockholm, Lund, Gothenburg" },
    ],
    highlights: [
      "Global leader in innovation & research",
      "Extensive English-taught master's programs",
      "Strong focus on sustainability & tech",
      "18-month post-study residence permit",
    ],
    sections: [
      {
        heading: "Why Study in Sweden?",
        paragraphs: [
          "Sweden consistently ranks among the world's most innovative nations, and its universities reflect that with research-driven, collaborative teaching. English-taught master's programs are plentiful, especially in technology, sustainability, and design.",
          "Students enjoy a progressive society, strong student support, and close ties between universities and leading global companies.",
        ],
      },
      {
        heading: "Top Universities",
        paragraphs: ["Sweden's universities are research-intensive and globally ranked."],
        bullets: [
          "KTH Royal Institute of Technology",
          "Lund University",
          "Uppsala University",
          "Chalmers University of Technology",
          "Stockholm University",
        ],
      },
      {
        heading: "Admission Process",
        paragraphs: [
          "The main intake is August/September, with applications made centrally through University Admissions Sweden (universityadmissions.se).",
        ],
        bullets: [
          "Choose English-taught programs",
          "Prepare transcripts and English test scores",
          "Apply via universityadmissions.se",
          "Receive admission and pay any tuition deposit",
          "Apply for a Swedish residence permit for studies",
        ],
      },
      {
        heading: "Cost of Studying & Living",
        paragraphs: [
          "Non-EU tuition typically ranges from SEK 80,000 to 200,000 per year, with many scholarships available. Living costs are around SEK 100,000–130,000 per year.",
        ],
      },
      {
        heading: "Work Rights & Post-Study Options",
        paragraphs: [
          "There's no fixed limit on student working hours, though studies must come first. After graduating, you can apply for a residence permit of up to 18 months to look for work or start a business.",
        ],
      },
      {
        heading: "Is Sweden Right for You?",
        paragraphs: [
          "Choose Sweden if you're drawn to innovation, technology, and sustainability, and want a progressive, research-led education with a solid post-study window.",
        ],
      },
    ],
  },
  {
    slug: "study-in-switzerland",
    country: "Switzerland",
    flag: "🇨🇭",
    tagline: "Elite research & world-leading hospitality schools",
    summary:
      "Switzerland is home to some of the world's top-ranked universities and the global leaders in hospitality management, offering exceptional research, high living standards, and strong career outcomes.",
    readTime: 7,
    updated: "2026-08-28",
    quickFacts: [
      { label: "Intakes", value: "Sep (main), Feb (some)" },
      { label: "Avg. Tuition", value: "CHF 1,500 – 40,000 / year" },
      { label: "Post-Study Work", value: "6 months to find work" },
      { label: "Tests", value: "IELTS/TOEFL (+ German/French for some)" },
      { label: "Popular Cities", value: "Zurich, Lausanne, Geneva" },
    ],
    highlights: [
      "Top-ranked universities (ETH Zurich, EPFL)",
      "World's #1 hospitality management schools",
      "Exceptional research & high living standards",
      "Multilingual, central European location",
    ],
    sections: [
      {
        heading: "Why Study in Switzerland?",
        paragraphs: [
          "Switzerland punches far above its weight academically, home to ETH Zurich and EPFL — among the world's finest science and engineering institutions — as well as the globally dominant hospitality management schools.",
          "It offers world-class research, superb quality of life, and strong graduate outcomes, particularly in STEM and hospitality.",
        ],
      },
      {
        heading: "Top Universities",
        paragraphs: ["Switzerland's institutions are globally elite."],
        bullets: [
          "ETH Zurich",
          "EPFL (École Polytechnique Fédérale de Lausanne)",
          "University of Zurich",
          "University of Geneva",
          "EHL Hospitality Business School",
        ],
      },
      {
        heading: "Admission Process",
        paragraphs: [
          "The main intake is September, with some February starts. Applications are made directly to each institution and can be competitive.",
        ],
        bullets: [
          "Choose a program and check the language",
          "Prepare strong transcripts and test scores",
          "Apply directly to the university",
          "Receive admission and prove sufficient funds",
          "Apply for a Swiss student visa/permit",
        ],
      },
      {
        heading: "Cost of Studying & Living",
        paragraphs: [
          "Public-university tuition is surprisingly low (CHF 1,500–4,000/year), while private hospitality schools charge much more. Living costs are high — budget CHF 22,000–28,000 per year.",
        ],
      },
      {
        heading: "Work Rights & Post-Study Options",
        paragraphs: [
          "Students can work up to 15 hours per week during term after an initial period. Non-EU graduates may stay up to six months to find work related to their studies.",
        ],
      },
      {
        heading: "Is Switzerland Right for You?",
        paragraphs: [
          "Choose Switzerland for elite STEM research or world-leading hospitality management, if you can manage the higher cost of living for an exceptional education and lifestyle.",
        ],
      },
    ],
  },
  {
    slug: "study-in-singapore",
    country: "Singapore",
    flag: "🇸🇬",
    tagline: "Asia's education & business powerhouse",
    summary:
      "Singapore is a safe, English-speaking global hub in the heart of Asia, home to world top-ranked universities and a thriving business and tech economy — an excellent gateway to careers across Asia-Pacific.",
    readTime: 6,
    updated: "2026-08-28",
    quickFacts: [
      { label: "Intakes", value: "Aug (main), Jan (some)" },
      { label: "Avg. Tuition", value: "SGD 20,000 – 45,000 / year" },
      { label: "Post-Study Work", value: "Employment pass on job offer" },
      { label: "Tests", value: "IELTS / TOEFL" },
      { label: "Popular Cities", value: "Singapore" },
    ],
    highlights: [
      "Home to NUS & NTU (Asia's top universities)",
      "Safe, English-speaking, and highly connected",
      "Thriving finance, tech & business hub",
      "Gateway to the fast-growing Asia-Pacific market",
    ],
    sections: [
      {
        heading: "Why Study in Singapore?",
        paragraphs: [
          "Singapore is Asia's premier education and business hub, combining world top-ranked universities with a safe, ultra-modern, English-speaking environment. Its strategic location makes it a gateway to careers across the Asia-Pacific region.",
          "For students seeking global-standard education closer to Asia — with strong links to finance, tech, and multinational employers — Singapore is unmatched.",
        ],
      },
      {
        heading: "Top Universities",
        paragraphs: ["Singapore's universities rank among the world's best."],
        bullets: [
          "National University of Singapore (NUS)",
          "Nanyang Technological University (NTU)",
          "Singapore Management University (SMU)",
          "Singapore University of Technology and Design (SUTD)",
        ],
      },
      {
        heading: "Admission Process",
        paragraphs: [
          "The main intake is August, with some January starts. Applications are made directly to universities and can be highly competitive.",
        ],
        bullets: [
          "Choose your program and check requirements",
          "Prepare strong transcripts and English test scores",
          "Apply directly to the university",
          "Receive admission and accept your offer",
          "Apply for a Student's Pass via Singapore's ICA",
        ],
      },
      {
        heading: "Cost of Studying & Living",
        paragraphs: [
          "Tuition typically ranges from SGD 20,000 to 45,000 per year (government subsidies with service obligations may be available). Living costs run around SGD 12,000–18,000 per year.",
        ],
      },
      {
        heading: "Work Rights & Post-Study Options",
        paragraphs: [
          "Students at approved institutions may work up to 16 hours per week during term. After graduating, securing a job offer lets you apply for an Employment Pass to work in Singapore.",
        ],
      },
      {
        heading: "Is Singapore Right for You?",
        paragraphs: [
          "Choose Singapore if you want a top-ranked, English-taught education in a safe, dynamic Asian hub with strong ties to global finance, tech, and business.",
        ],
      },
    ],
  },
];

export function getGuideBySlug(slug: string): CountryGuide | undefined {
  return countryGuides.find((g) => g.slug === slug);
}

export function getAllGuideSlugs(): string[] {
  return countryGuides.map((g) => g.slug);
}
