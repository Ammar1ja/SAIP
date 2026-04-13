export const TOPOGRAPHIC_DESIGNS_JOURNEY_SECTION_IDS = [
  'guidance',
  'layout-designs-ic-checklist',
  'ip-clinics',
  'ip-search-engine',
  'non-registrable-layout-designs',
  'protection',
  'application-process',
  'management',
  'enforcement',
] as const;

export type TopographicDesignsJourneySectionId =
  (typeof TOPOGRAPHIC_DESIGNS_JOURNEY_SECTION_IDS)[number];

export const TOPOGRAPHIC_DESIGNS_JOURNEY_SECTIONS = {
  guidance: {
    title: 'Guidance',
    description:
      'Living out of integrated circuits. The journey begins with understanding your layout designs of integrated circuits and their potential. We guide you in evaluating their registrability, conducting prior art searches, and navigating the requirements of the integrated circuit protection system. With expert advice, we ensure you are well-informed and confident in taking the first steps.',
  },
  'layout-designs-ic-checklist': {
    title: 'Layout designs of IC checklist',
    description:
      'Evaluate whether your layout designs of integrated circuits meet the necessary criteria to qualify for registration. This checklist helps designers and professionals systematically assess the originality and commercial viability of a layout design before committing to the registration process.',
    buttonLabel: 'Go to Checklist',
    buttonHref: '/services/layout-designs-and-integrated-circuits/checklist',
  },
  'ip-clinics': {
    title: 'IP Clinics',
    description:
      'Apply for one of the IP Clinics services that provide beneficiaries with guidance and assistance in technical and legal inquiries related to registering and protecting layout designs of integrated circuits. Services include issuing prior art search reports and the Intellectual Property Accelerator Program.',
    buttonLabel: 'Go to IP Clinics',
    buttonHref: '/services/ip-clinics',
  },
  'ip-search-engine': {
    title: 'IP Search Engine',
    description:
      'Search for registered layout designs of integrated circuits through the SAIP intellectual property (IP) search engine. This tool is essential for businesses, researchers, and IP professionals to assess originality, avoid infringement, and gain competitive insights in the integrated circuit industry.',
    buttonLabel: 'Go to IP Search Engine',
    buttonHref: '/resources/ip-search-engine',
  },
  'non-registrable-layout-designs': {
    title: 'Non-registrable layout designs of IC',
    description:
      'There are categories of layout designs of integrated circuits that cannot be registered in Saudi Arabia. Make sure your design does not fall into these excluded categories before applying for protection.',
    details: [
      'Layout designs that are not original or distinctive',
      'Designs that are commonplace among creators and manufacturers of integrated circuits',
      'Designs consisting of elements that are staple, commonplace or familiar in the trade',
    ],
  },
  protection: {
    title: 'Protection',
    description:
      'Protecting your Layout designs of IC empowers exclusive rights to their unique features. Filing an application for Layout designs of Integrated Circuits requires adherence to the Saudi Patent Law and SAIP guidelines. This overview of key requirements, essential documents, and examples will help you meet the legal standards and secure your rights.',
    subsections: {
      'application-process': {
        title: 'Application process for Layout designs of IC',
        description:
          'Welcome SAIP guide to layout designs of integrated circuits applications. Learn how your layout design can progress from application to registration through a clear and structured process.',
        steps: [
          {
            title: '1. Submit your application',
            description:
              'Start your registration journey by submitting a complete application via the SAIP portal.',
            details: [
              'A clear graphical representation of the layout designs of integrated circuits',
              'e.g. high-quality images or schematics',
              'A detailed description emphasizing the unique layout and features of the design',
              'Classification or category under relevant technical and legal frameworks',
              'Payment of applicable filing fees',
            ],
          },
          {
            title: '2. Examination',
            description:
              'Once your application for Layout designs of Integrated Circuits is submitted, SAIP conducts an examination to ensure compliance with legal and technical requirements.',
            details: [
              'The examination process includes reviewing:',
              'Whether the design is original or if it represents a unique arrangement of circuit elements rather than being dictated solely by functional requirements',
              'If the design serves as a unique arrangement of circuit elements rather than being dictated solely by functional requirements',
              'Avoidance of prohibited content, such as:',
              '• Designs containing public emblems, flags, or religious symbols',
              '• Designs that mislead the public regarding their purpose or function',
              'If any issues are identified, SAIP will notify the applicant and provide an opportunity to amend the application before a final decision is made.',
            ],
          },
          {
            title: '3. Publication in the SAIP Official Gazette',
            description:
              'Once the layout designs of integrated circuits passes substantive examination, it is published in the SAIP Official Gazette. This step provides public visibility and formal recognition of your registration.',
          },
          {
            title: '4. Registration or rejection',
            description: 'You can respond to objections or feedback by:',
            details: [
              'Registration: If your design meets all criteria, it will be registered. You will receive a certificate of registration, granting exclusive rights to the layout designs of integrated circuits for up to 10 years.',
              'Rejection: If your application does not meet the requirements, it may be rejected. You may appeal this decision through SAIP grievance process.',
            ],
          },
        ],
        timeline: {
          title: 'How long does it take?',
          description:
            'The layout designs of integrated circuits registration process in Saudi Arabia typically takes 3-6 months, depending on the complexity of the application and the examination process.',
          details: [
            'Simple layout designs of integrated circuits: Start your registration today.',
            'Layout designs of integrated circuits protection period: A registered layout designs of integrated circuits in Saudi Arabia is protected for 10 years from the filing date or from the date on which its commercial use is commenced anywhere in the world. The protection period shall not exceed 15 years.',
            'Conditions for maintaining protection:',
            '• Payment of annual fees',
            '• Annual fees for the layout designs of integrated circuits application or protection certificate must be paid at the beginning of each year starting from the year following the filing date.',
            'Payment grace period:',
            '• If the annual fees are not paid within three months of the due date, a double fee is due.',
            '• Failure to pay within an additional three months, even after receiving a warning, will result in the cancellation of the application or protection certificate.',
            'End of protection:',
            '• If annual fees are not paid as required, the layout design application or protection certificate will be considered lapsed.',
            "• Once protection ends, the layout design enters the public domain, meaning anyone can use it without the design holder's permission.",
          ],
        },
      },
    },
  },
  management: {
    title: 'Management',
    description:
      'Once your layout designs of integrated circuits are registered, several steps must be taken to maintain and maximize their value.',
    subsections: {
      'managing-registered-designs': {
        title: 'Managing your registered Layout designs of integrated circuits',
        items: [
          {
            title: 'Renew your registration',
            description:
              'Registrations in Saudi Arabia are valid for 10 years and must be renewed before expiration to remain active.',
            details: [
              'SAIP provides schedules and reminders for renewal deadlines.',
              'Failure to renew within the grace period of 6 months results in the lapse of your rights.',
            ],
          },
          {
            title: 'Avoid vulnerability to cancellation',
            description:
              'Ensure your layout designs of integrated circuits remain in use or incorporated into products. Prolonged non-use may expose the design to cancellation challenges.',
          },
          {
            title: 'Commercialize your design',
            description:
              'Explore licensing opportunities. Licensing allows others to use your layout designs of integrated circuits in exchange for royalties or lump-sum payments, expanding its reach without direct investment.',
          },
          {
            title: 'Self-commercialization',
            description:
              'Incorporate your layout designs of integrated circuits into products or services to enhance their functionality, establishing a competitive advantage in the market.',
          },
          {
            title: 'Transfer ownership',
            description:
              'If necessary, assign your rights to another entity or person. Ensure ownership transfers are officially recorded with SAIP to avoid disputes or legal complications.',
          },
          {
            title: 'Collaborate for growth',
            description:
              'Partner with manufacturers, distributors, or other collaborators to scale your business and maximize the reach of your layout designs of integrated circuits.',
          },
        ],
      },
      'update-records': {
        title: 'Update records for Layout designs of integrated circuits',
        items: [
          {
            title: 'Notify of ownership changes',
            description:
              'Any changes in ownership or licensing agreements must be officially recorded with SAIP to maintain accurate records and avoid conflicts.',
          },
          {
            title: 'Amend design details',
            description:
              'If there are errors in your records or changes required (e.g., updated representations), submit a request to amend the layout designs of integrated circuits details.',
          },
        ],
      },
      'expand-internationally': {
        title: 'Expand internationally',
        items: [
          {
            title: 'Leverage priority rights',
            description:
              'Use the priority date of your SAIP registration to file for protection in other jurisdictions under international agreements such as the Paris Convention.',
          },
          {
            title: 'Protect in key markets',
            description:
              'Identify key international markets for your products and register your layout designs of integrated circuits in those regions to safeguard your business interests.',
          },
        ],
      },
      'maximize-value': {
        title: "Maximize your Layout designs of integrated circuits' value",
        items: [
          {
            title: 'Regularly assess design relevance',
            description:
              'Evaluate whether your layout designs of integrated circuits continue to align with your business strategy and market needs. If they no longer serve their purpose, consider abandoning or reassigning them.',
          },
          {
            title: 'Portfolio management',
            description:
              'Manage multiple designs as a portfolio to maximize their collective value and strategic benefits.',
          },
          {
            title: 'Utilize design valuation',
            description:
              'Determine the financial value of your layout designs of integrated circuits for use in licensing negotiations, mergers, acquisitions, or investment opportunities.',
          },
        ],
      },
    },
  },
  enforcement: {
    title: 'Enforcement',
    description:
      'SAIP is committed to safeguarding the rights of layout designs of integrated circuit holders and providing effective mechanisms for enforcing these rights in Saudi Arabia.',
    subsections: {
      'enforcement-process': {
        title: 'Enforcement process',
        description:
          'Below is an overview of the enforcement process, enabling existing layout designs of integrated circuit owners to protect their registered designs and address any infringement.',
      },
      'understand-rights': {
        title: 'Understand your layout design of integrated circuit',
        description: 'As a registered IC layout design holder, you have the exclusive rights to:',
        rights: [
          'Use, sell, or license your IC layout design',
          'Prevent unauthorized parties from manufacturing, using, selling, or distributing products incorporating your layout design',
          'Take legal action against any party that infringes your IC layout design rights',
        ],
      },
      'enforcement-steps': {
        title: 'Steps to enforce your layout design of integrated circuit',
        steps: [
          {
            title: '1. Monitor and detect infringement',
            description:
              'Regularly monitor the market and industry activities to identify unauthorized use of your registered layout design of integrated circuit.',
            details: [
              'Conduct market surveillance through online platforms, trade shows, and industry advertisements, or sales records',
            ],
          },
          {
            title: '2. Notify the infringer',
            description:
              'Inform the infringer of their unauthorized use of your layout design of integrated circuit and request that they cease infringing activities.',
            details: [
              'Provide evidence of your registered layout design of integrated circuit and explain how their activities constitute infringement',
            ],
          },
          {
            title: '3. File a lawsuit with the competent authority',
            description:
              'If infringement of your layout designs of integrated circuits persists after attempts to resolve the issue directly, the design owner can file a lawsuit with the commercial circuits and courts for legal action.',
            remedies: [
              'Compensation for damages',
              'Unauthorized manufacturing, distribution, or sale of products incorporating the topographic design',
              'Commercial-scale infringement causing financial harm or concerns over public interest',
            ],
          },
          {
            title: '4. Judicial appeal',
            description:
              "If either party is dissatisfied with the court's decision, they may escalate the matter to the competent Saudi courts.",
            details: [
              'Key filing deadline: Appeals must be submitted within 60 days of the initial court decision.',
              'Judicial remedies may include:',
              '• Penalties: Enforced fines or imprisonment for severe or repeated violations',
              '• Compensation: Financial damages, including those for lost profits or harm to business reputation, including a requirement',
              '• Preventive orders: Orders to prevent future infringement, such as halting the production or distribution of infringing products',
            ],
          },
        ],
      },
      'saip-support': {
        title: 'SAIP support for layout design of integrated circuit',
        description:
          'While SAIP does not directly enforce rights for layout designs of Integrated Circuits, it provides resources and services to assist intellectual property holders:',
        services: [
          {
            title: 'Mediation services',
            description: 'Mediation and arbitration for quick dispute resolution.',
            details:
              'Facilitated by IP experts accredited by SAIP and the Taawun Center at the Ministry of Justice.',
          },
          {
            title: 'Expert guidance',
            description:
              "Access legal procedures and enforcement options to strengthen the design holder's position.",
          },
          {
            title: 'Awareness Programs',
            description:
              'Educational resources to help design holders understand their rights and enforcement mechanisms.',
          },
        ],
      },
      'protecting-designs': {
        title: 'Protecting your layout designs of integrated circuits',
        description: 'To ensure effective enforcement:',
        tips: [
          'Keep your patent active: Renew your registration with required timeframes to maintain legal protection.',
          'Monitor the market regularly: Track the use of your registered design across various platforms to detect potential infringements.',
          'Collaborate with legal experts: Engage qualified legal professionals to address violations effectively and pursue legal remedies.',
        ],
      },
    },
  },
} as const;

export const TOPOGRAPHIC_DESIGNS_JOURNEY_TOC_ITEMS = [
  {
    id: 'guidance',
    label: 'Guidance',
    subItems: [
      { id: 'layout-designs-ic-checklist', label: 'Layout designs of IC checklist' },
      { id: 'ip-clinics', label: 'IP Clinics' },
      { id: 'ip-search-engine', label: 'IP Search Engine' },
      { id: 'non-registrable-layout-designs', label: 'Non-registrable layout designs of IC' },
    ],
  },
  {
    id: 'protection',
    label: 'Protection',
    subItems: [
      { id: 'application-process', label: 'Application process for Layout designs of IC' },
    ],
  },
  { id: 'management', label: 'Management' },
  { id: 'enforcement', label: 'Enforcement' },
];

// Journey-specific hero content
export const journeyTitle = 'Topographic designs of integrated circuits journey';
export const journeyDescription = 'Learn more about the topographic designs protection journey.';

export const tocAriaLabel = 'Layout designs of integrated circuits journey navigation';
