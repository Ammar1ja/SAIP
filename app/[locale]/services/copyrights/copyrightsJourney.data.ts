export const sectionIds = [
  'guidance',
  'copyright-checklist',
  'ip-clinics',
  'ip-search-engine',
  'not-patentable',
  'discoveries-and-concepts',
  'functional-and-procedural-elements',
  'public-domain-and-natural-processes',
  'works-contrary-to-public-order-or-morality',
  'excluded-functional-works',
  'protection',
  'management',
  'enforcement',
];

export const tocItems = [
  {
    id: 'guidance',
    label: 'Guidance',
    subItems: [
      { id: 'copyright-checklist', label: 'Copyright checklist' },
      { id: 'ip-clinics', label: 'IP Clinics' },
      { id: 'ip-search-engine', label: 'IP Search Engine' },
      {
        id: 'not-patentable',
        label: 'Non-patentable categories',
        subItems: [
          { id: 'discoveries-and-concepts', label: 'Discoveries and concepts' },
          { id: 'functional-and-procedural-elements', label: 'Functional and procedural elements' },

          {
            id: 'public-domain-and-natural-processes',
            label: 'Public domain and natural processes',
          },
          {
            id: 'works-contrary-to-public-order-or-morality',
            label: 'Works contrary to public order or morality',
          },
          { id: 'excluded-functional-works', label: 'Excluded functional works' },
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
      'Turn your creations into registered work. Begin your journey by understanding your creative work and its potential for copyright protection',
    subDescription:
      'We assist in evaluating the originality of your work, verifying its eligibility for protection, and navigating the requirements of the Saudi copyright system. With expert advice, we ensure you are well-prepared and confident in taking the first steps.',
  },
  'copyright-checklist': {
    title: 'Copyright checklist',
    description:
      'Evaluate whether your design meets the necessary criteria to qualify for registration. This checklist helps businesses and professionals systematically assess the originality, compliance, and registrability of a design before committing to the application process.',
    buttonLabel: 'Go to copyright checklist',
    buttonHref: '/resources/ip-information/digital-guide/ip-category/copyrights/checklist',
  },
  'ip-clinics': {
    title: 'IP Clinics',
    description:
      'Apply for one of the IP Clinics services to receive guidance and support for registering and protecting your creative works. These services include assistance with legal inquiries, compliance checks, and practical advice to strengthen your copyright application process.',
    buttonLabel: 'Go to IP Clinics',
    buttonHref: '/services/ip-clinics',
  },
  'ip-search-engine': {
    title: 'IP Search Engine',
    description:
      'SUse the SAIP Search Engine to search for existing works registered in Saudi Arabia. This is a step for authors, artists, and creators to confirm the originality of their work, avoid potential conflicts, and gain valuable insights into the competitive landscape.',
    buttonLabel: 'Go to IP search engine',
    buttonHref: '/resources/tools-and-research/ip-search-engine',
  },
  'not-patentable': {
    title: 'Not patentable categories',
    description:
      'Certain types of content and works are excluded from copyright protection under Saudi regulations. These exclusions align with international norms and local legal and cultural considerations.',
  },
  'discoveries-and-concepts': {
    title: 'Discoveries and concepts',
    items: [
      {
        title: 'Ideas and abstract concepts: ',
        description:
          'Ideas, theories, and abstract principles that are not expressed in a tangible form are not protectable under copyright law.',
      },
      {
        title: 'Scientific discoveries:',
        description:
          'Identification of natural laws or scientific phenomena without a specific creative expression or application.',
      },
      {
        title: 'Theoretical methods: ',
        description:
          'Abstract methodologies or frameworks for understanding phenomena without creative implementation or tangible expression.',
      },
    ],
  },
  'functional-and-procedural-elements': {
    title: 'Functional and procedural elements',
    items: [
      {
        title: 'Functional elements:',
        description:
          'General guidelines and rules: Procedural or instructional content, such as rules, policies, and technical manuals, not expressed in a creative form.',
      },
      {
        title: 'Mental acts: ',
        description:
          'Intellectual or observational techniques that lack creative articulation, such as classifications or non-creative compilations.',
      },
      {
        title: 'Aesthetic arrangements: ',
        description:
          'Functional or purely decorative patterns without creative originality or a fixed medium of expression.',
      },
    ],
  },
  'public-domain-and-natural-processes': {
    title: 'Public domain and natural processes',
    items: [
      {
        title: 'Traditional knowledge and folklore:',
        description:
          'Unless fixed and attributed according to cultural heritage laws, traditional expressions may not be eligible for exclusive copyright protection.',
      },
      {
        title: 'Naturally occurring phenomena:',
        description:
          'Works or elements found in nature, such as naturally occurring patterns or genetic sequences, unless presented as part of a creative expression.',
      },
    ],
  },
  'works-contrary-to-public-order-or-morality': {
    title: 'Works contrary to public order or morality',
    items: [
      {
        title: 'Prohibited content:',
        description:
          ' Works that contravene public health, safety, or Islamic principles, including those promoting harmful, unethical, or illegal activities.',
      },
      {
        title: 'Examples:',
        description:
          'Content inciting violence, promoting illegal substances, or violating public decency laws is excluded from protection.',
      },
    ],
  },
  'excluded-functional-works': {
    title: 'Excluded functional works',
    items: [
      {
        title: 'Practical applications:',
        description:
          'Processes or systems designed purely for functional purposes without creative expression are not protectable.',
      },
      {
        title: 'Medical or therapeutic techniques:',
        description:
          'These are excluded unless they involve a significant creative or technical component beyond mere utility.',
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
