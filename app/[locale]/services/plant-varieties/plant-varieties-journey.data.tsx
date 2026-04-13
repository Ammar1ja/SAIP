export const sectionIds = [
  'guidance',
  'plant-variety-checklist',
  'ip-clinics',
  'ip-search-engine',
  'not-patentable',
  'discoveries-and-phenomena',
  'schemes-and-rules',
  'biological-and-natural-processes',
  'plant-varieties-contrary-to-public-order-or-morality',
  'medical-and-surgical-methods',
  'protection',
  'management',
  'enforcement',
];

export const tocItems = [
  {
    id: 'guidance',
    label: 'Guidance',
    subItems: [
      { id: 'plant-variety-checklist', label: 'Plant variety checklist' },
      { id: 'ip-clinics', label: 'IP Clinics' },
      { id: 'ip-search-engine', label: 'IP Search Engine' },
      {
        id: 'not-patentable',
        label: 'Non-protectable categories for plant varieties',
        subItems: [
          { id: 'discoveries-and-phenomena', label: 'Discoveries and natural phenomena' },
          { id: 'schemes-and-rules', label: 'Schemes, rules, and non-technical methods' },
          {
            id: 'biological-and-natural-processes',
            label: 'Biological and natural processes',
          },
          {
            id: 'plant-varieties-contrary-to-public-order-or-morality',
            label: 'Plant varieties contrary to public order or morality',
          },
          {
            id: 'medical-and-surgical-methods',
            label: 'Medical and surgical methods (related to plants)',
          },
        ],
      },
    ],
  },
  { id: 'protection', label: 'Protection' },
  { id: 'management', label: 'Management' },
  { id: 'enforcement', label: 'Enforcement' },
];

export const sections = {
  guidance: {
    title: 'Guidance',
    description:
      'Turning plan into assest: the journey begins with understanding your plant variety and its potential. We help you evaluate its suitability for protection, conduct prior searches for novelty, and navigate the requirements of the plant variety protection system. With expert advice, we ensure you are well-informed and confident in taking the first steps.',
  },
  'plant-variety-checklist': {
    title: 'Plant variety checklist',
    description:
      'Evaluate whether your plant variety meets the necessary criteria to qualify for protection under the Saudi system. This includes distinctiveness, uniformity, and stability, as outlined in Saudi regulations​. The checklist helps breeders, agricultural enterprises, and professionals systematically assess the strengths and weaknesses of a variety before committing to the application process.',
    buttonLabel: 'Go to plant variety checklist',
    buttonHref: '/resources/ip-information/digital-guide/ip-category/plant-varieties/checklist',
  },
  'ip-clinics': {
    title: 'IP Clinics',
    description:
      'Apply for one of the IP Clinics services that provide beneficiaries with guidance and assistance in technical and legal inquiries related to registering and protecting plant variety rights. The services also include issuing prior art search reports to identify the novelty of a plant variety or develop it further, ensuring a robust application process​​.',
    buttonLabel: 'Go to IP Clinics',
    buttonHref: '/services/ip-clinics',
  },
  'ip-search-engine': {
    title: 'IP Search Engine',
    description:
      'Search for plant variety records in the Saudi IP engine. This is essential for breeders, agricultural researchers, and professionals to assess the novelty of a variety, avoid conflicts, and gain competitive insights.',
    buttonLabel: 'Go to IP search engine',
    buttonHref: '/resources/tools-and-research/ip-search-engine',
  },
  'not-patentable': {
    title: 'Non-protectable categories for plant varieties',
    description:
      'Certain categories of plant varieties or related methods are excluded from protection under Saudi regulations, reflecting international norms and local legal and cultural considerations.',
  },
  'discoveries-and-phenomena': {
    title: 'Discoveries and natural phenomena',
    items: [
      {
        title: 'Existing plant varieties: ',
        description:
          'Naturally occurring plant varieties, species, or groups that have not been subject to human intervention or improvement.',
      },
      {
        title: 'Scientific discoveries: ',
        description:
          'Identification of plant-related natural laws or genetic properties without specific application.',
      },
      {
        title: 'Theoretical methods: ',
        description:
          'Abstract methodologies for understanding plant growth or characteristics that lack practical implementation.',
      },
    ],
  },
  'schemes-and-rules': {
    title: 'Schemes, rules, and non-technical methods',
    items: [
      {
        title: 'Cultivation schemes: ',
        description:
          'General guidelines or rules for plant cultivation, irrigation, or farming techniques not tied to specific innovation.',
      },
      {
        title: 'Mental acts: ',
        description:
          'Intellectual or observational techniques, such as identifying or classifying plants without technological enhancement.',
      },
      {
        title: 'Aesthetic arrangements: ',
        description: 'Non-functional decorative patterns or arrangements of plants or flowers.',
      },
    ],
  },
  'biological-and-natural-processes': {
    title: 'Biological and natural processes',
    items: [
      {
        title: 'Traditional breeding: ',
        description:
          'Natural processes such as cross-pollination, selective breeding, or natural selection without technical intervention.',
      },
      {
        title: 'Naturally occurring substances: ',
        description:
          'Materials like unmodified plants, seeds, or genetic material as found in nature.',
      },
    ],
  },
  'plant-varieties-contrary-to-public-order-or-morality': {
    title: 'Plant varieties contrary to public order or morality',
    items: [
      {
        title: 'Prohibited practices: ',
        description:
          'Varieties that are harmful to public health, the environment, or public order, or are in violation of Islamic principles.',
      },
      {
        title: 'Examples: ',
        description:
          'Genetically modified organisms (GMOs) intended for harmful or unethical use, or plants producing illegal substances.',
      },
    ],
  },
  'medical-and-surgical-methods': {
    title: 'Medical and surgical methods (related to plants)',
    items: [
      {
        title: 'Exclusion: ',
        description:
          'Purely biological processes or treatments using plants for medical purposes unless they involve significant technical input.',
      },
      {
        title: 'Note: ',
        description:
          'Products derived from plants (e.g., pharmaceuticals) may be protectable if they meet technical innovation requirements.',
      },
    ],
  },
  protection: {
    title: 'Protection',
    description:
      "Securing your creative rights: protecting your work ensures exclusive rights to its use, reproduction, and commercialization. Filing an application for copyright protection in Saudi Arabia requires adherence to the country's laws and guidelines.",
    subDescription:
      'This guide provides an overview of the key requirements, essential documents, and examples to help you meet legal standards and secure your work effectively.',
  },
  management: {
    title: 'Management',
    description:
      'Once your copyright is registered, there are several steps you can take to maintain and maximize its value.',
  },
  enforcement: {
    title: 'Enforcement',
    description:
      'SAIP is committed to safeguarding the rights of copyright holders and providing effective mechanisms for copyright enforcement in Saudi Arabia.',
  },
};

export const tocAriaLabel = 'Copyrights journey navigation';
