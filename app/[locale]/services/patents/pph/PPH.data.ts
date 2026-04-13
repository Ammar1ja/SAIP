export const PPH_STEPS = [
  {
    number: 1,
    title: 'Log in',
    icon: 'user',
    details: [
      'Login to the SAIP platform, select Services, and click on Patent Service.',
      { label: 'Go to SAIP platform', href: 'https://saip.gov.sa', external: true },
    ],
  },
  {
    number: 2,
    title: 'Verify eligibility',
    icon: 'user-plus',
    details: [
      'Ensure you have received a positive decision from a participating patent office.',
      'Check that your application is eligible for PPH.',
      'Verify that the claims in your SAIP application correspond to those allowed in the Office of Earlier Examination (OEE).',
    ],
  },
  {
    number: 3,
    title: 'Prepare PPH request',
    icon: 'clipboard-plus',
    details: [
      'Complete the PPH request form.',
      'Prepare copies of all office actions from the OEE.',
      'Provide translations of documents if required.',
      'Include a claims correspondence table.',
    ],
  },
  {
    number: 4,
    title: 'Submit PPH request',
    icon: 'key-round',
    details: [
      'Submit your PPH request through the SAIP platform.',
      'Ensure all required documents are attached.',
      'Verify that your application is pending examination.',
    ],
  },
  {
    number: 5,
    title: 'Fast-track examination',
    icon: 'send',
    details: [
      'Your application will be prioritized for examination.',
      'Receive examination results faster than standard applications.',
      'Respond to any office actions as required.',
    ],
  },
];

export const PPH_REQUIREMENTS = [
  'Pending patent application at SAIP',
  'Positive decision from a participating patent office (Office of Earlier Examination)',
  'Completed PPH request form',
  'Copies of all office actions from the OEE',
  'Claims correspondence table showing how SAIP claims correspond to allowed OEE claims',
  'Translations of documents (if not in Arabic or English)',
  'Application must not have been examined yet at SAIP',
  'Claims in SAIP application must sufficiently correspond to allowed claims in OEE',
];

export const PPH_SIDEBAR = {
  executionTime: 'Accelerated examination process',
  serviceFee: 'No additional fee',
  targetGroup: 'Individuals, Enterprises',
  serviceChannel: 'Digital',
  faqHref: '/resources/ip-information/faq',
  platformHref: 'https://saip.gov.sa',
};
