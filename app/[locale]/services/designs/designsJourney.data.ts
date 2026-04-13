export const journeyTitle = 'Design journey';
export const journeyDescription =
  'We are dedicated to empowering design holders by providing a seamless and transparent experience throughout the design protection process. From fostering innovation to protecting, managing, and enforcing your design rights, we ensure your creations are safeguarded and transformed into valuable assets that enhance market presence and drive economic growth. Learn more about the design journey.';
export const sectionIds = [
  'guidance',
  'design-checklist',
  'ip-clinics',
  'ip-search-engine',
  'not-registrable',
  'protection',
  'management',
  'enforcement',
];

export const sections = {
  guidance: {
    title: 'Guidance',
    description:
      'Turning creativity into assets: the journey begins with understanding your design and its potential. We assist you in evaluating its originality, conducting design searches, and navigating the requirements of the design registration system. With expert advice, we ensure you are well-informed and confident in taking the first steps.',
  },
  'design-checklist': {
    title: 'Design checklist',
    description:
      'Evaluate whether your design meets the necessary criteria to qualify for registration. This checklist helps businesses and professionals systematically assess the originality, compliance, and registrability of a design before committing to the application process.',
    buttonLabel: 'Go to design checklist',
    buttonHref: '/resources/ip-information/digital-guide/ip-category/designs/checklist',
  },
  'ip-clinics': {
    title: 'IP Clinics',
    description:
      "Apply for one of the IP Clinics services that provide beneficiaries with guidance and assistance in technical and legal inquiries related to registering and protecting designs. Services include issuing design search reports to ensure originality and uniqueness, offering insights on how to strengthen the design's protection, and supporting participation in the Intellectual Property Accelerator Program.",
    buttonLabel: 'Go to IP Clinics',
    buttonHref: '/services/ip-clinics',
  },
  'ip-search-engine': {
    title: 'IP Search Engine',
    description:
      'Search for registered designs through the SAIP intellectual property (IP) engine. This tool is essential for businesses, designers, researchers, and IP professionals to assess originality, avoid conflicts with existing designs, and gain competitive insights.',
    buttonLabel: 'Go to IP Search Engine',
    buttonHref: '/resources/tools-and-research/ip-search-engine',
  },
  'not-registrable': {
    title: 'Non-registrable designs',
    description: 'Certain types of designs cannot be registered. See the categories below.',
  },
  'functional-technical': {
    title: 'Functional or technical designs',
    description:
      'Designs that are purely functional or technical in nature cannot be registered as they lack the required aesthetic or ornamental character.',
  },
  'public-symbols': {
    title: 'Public symbols and emblems',
    description: 'Designs that use public symbols, emblems, or flags are not registrable.',
  },
  'misleading-designs': {
    title: 'Misleading or deceptive designs',
    description: 'Designs that mislead or deceive the public are not registrable.',
  },
  'immoral-designs': {
    title: 'Immoral or offensive designs',
    description: 'Designs that are immoral or offensive are not registrable.',
  },
  similarity: {
    title: 'Similarity to existing or well-known designs',
    description: 'Designs that are similar to existing or well-known designs are not registrable.',
  },
  protection: {
    title: 'Protection',
    description: 'How to protect your design.',
  },
  management: {
    title: 'Management',
    description: 'Design management and renewals.',
  },
  enforcement: {
    title: 'Enforcement',
    description: 'How to enforce your design rights.',
  },
};

export const tocItems = [
  {
    id: 'guidance',
    label: 'Guidance',
    subItems: [
      { id: 'design-checklist', label: 'Design checklist' },
      { id: 'ip-clinics', label: 'IP Clinics' },
      { id: 'ip-search-engine', label: 'IP Search Engine' },
      {
        id: 'not-registrable',
        label: 'Non-registrable designs',
        subItems: [
          { id: 'functional-technical', label: 'Functional or technical designs' },
          { id: 'public-symbols', label: 'Public symbols and emblems' },
          { id: 'misleading-designs', label: 'Misleading or deceptive designs' },
          { id: 'immoral-designs', label: 'Immoral or offensive designs' },
          { id: 'similarity', label: 'Similarity to existing or well-known designs' },
        ],
      },
    ],
  },
  { id: 'protection', label: 'Protection' },
  { id: 'management', label: 'Management' },
  { id: 'enforcement', label: 'Enforcement' },
];

export const tocAriaLabel = 'Designs journey navigation';
