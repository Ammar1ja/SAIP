export const sectionIds = [
  'guidance',
  'trademark-checklist',
  'ip-clinics',
  'ip-search-engine',
  'not-registrable',
  'protection',
  'management',
  'enforcement',
  'generic-terms',
  'public-symbols',
  'misleading-marks',
  'immoral-marks',
  'personal-identifiers',
  'similarity',
  'contrary-policy',
];

export const sections = {
  guidance: {
    title: 'Guidance',
    description:
      'Turning Brands into Assets: The journey begins with understanding your trademark and its potential. We help you evaluate its distinctiveness, conduct trademark searches, and navigate the requirements of the trademark system. With expert advice, we ensure you are well-informed and confident in taking the first steps.',
  },
  'trademark-checklist': {
    title: 'Trademark checklist',
    description:
      'Evaluate whether your brand or mark meets the necessary criteria to qualify for trademark registration. This checklist helps businesses and professionals systematically assess the distinctiveness, compliance, and registrability of a trademark before committing to the application process.',
    buttonLabel: 'Go to trademark checklist',
    buttonHref: '/resources/ip-information/digital-guide/ip-category/trademarks/checklist',
  },
  'ip-clinics': {
    title: 'IP Clinics',
    description:
      'Apply for one of the IP Clinics services that provide beneficiaries with guidance and assistance in technical and legal inquiries related to registering and protecting trademarks. Services include issuing trademark search reports to ensure the distinctiveness and uniqueness of the brand, offering insights on how to strengthen the trademark, and supporting participation in the Intellectual Property Accelerator Program.',
    buttonLabel: 'Go to IP Clinics',
    buttonHref: '/services/ip-clinics',
  },
  'ip-search-engine': {
    title: 'IP Search Engine',
    description: 'Search for registered trademarks.',
    buttonLabel: 'Go to search engine',
    buttonHref: '/resources/tools-and-research/ip-search-engine',
  },
  'not-registrable': {
    title: 'Non-registrable trademarks',
    description: 'Certain types of trademarks cannot be registered. See the categories below.',
  },
  'generic-terms': {
    title: 'Generic or descriptive terms',
    description: 'Marks that are generic or merely descriptive cannot be registered as trademarks.',
    items: [
      {
        title: 'Generic names:',
        description:
          'Common names or terms that refer to the goods/services themselves and lack distinctiveness.',
      },
      {
        title: 'Descriptive terms:',
        description:
          'Marks that directly describe the quality, kind, purpose, or origin of the goods/services, unless they acquire a secondary meaning through extensive use.',
      },
    ],
  },
  'public-symbols': {
    title: 'Public symbols and emblems',
    description: 'Marks that use public symbols, emblems, or flags are not registrable.',
  },
  'misleading-marks': {
    title: 'Misleading or deceptive marks',
    description: 'Marks that mislead or deceive the public are not registrable.',
  },
  'immoral-marks': {
    title: 'Immoral or offensive marks',
    description: 'Marks that are immoral or offensive are not registrable.',
  },
  'personal-identifiers': {
    title: 'Personal and geographic identifiers',
    description: 'Marks that use personal names or geographic locations are not registrable.',
  },
  similarity: {
    title: 'Similarity to existing or well-known trademarks',
    description: 'Marks that are similar to existing or well-known trademarks are not registrable.',
  },
  'contrary-policy': {
    title: 'Trademarks contrary to public policy',
    description: 'Marks that are contrary to public policy are not registrable.',
  },
  protection: {
    title: 'Protection',
    description: 'How to protect your trademark.',
  },
  management: {
    title: 'Management',
    description: 'Trademark management and renewals.',
  },
  enforcement: {
    title: 'Enforcement',
    description: 'How to enforce your trademark rights.',
  },
};

export const tocItems = [
  {
    id: 'guidance',
    label: 'Guidance',
    subItems: [
      { id: 'trademark-checklist', label: 'Trademark checklist' },
      { id: 'ip-clinics', label: 'IP Clinics' },
      { id: 'ip-search-engine', label: 'IP Search Engine' },
      {
        id: 'not-registrable',
        label: 'Non-registrable trademarks',
        subItems: [
          { id: 'generic-terms', label: 'Generic or descriptive terms' },
          { id: 'public-symbols', label: 'Public symbols and emblems' },
          { id: 'misleading-marks', label: 'Misleading or deceptive marks' },
          { id: 'immoral-marks', label: 'Immoral or offensive marks' },
          { id: 'personal-identifiers', label: 'Personal and geographic identifiers' },
          { id: 'similarity', label: 'Similarity to existing or well-known trademarks' },
          { id: 'contrary-policy', label: 'Trademarks contrary to public policy' },
        ],
      },
    ],
  },
  { id: 'protection', label: 'Protection' },
  { id: 'management', label: 'Management' },
  { id: 'enforcement', label: 'Enforcement' },
];

export const tocAriaLabel = 'Trademarks journey navigation';
