export const PCT_STEPS = [
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
    title: 'Select PCT application',
    icon: 'user-plus',
    details: [
      'Navigate to Patent Cooperation Treaty (PCT) section.',
      'Select the type of PCT application you want to file.',
    ],
  },
  {
    number: 3,
    title: 'Prepare application documents',
    icon: 'clipboard-plus',
    details: [
      'Download PCT application templates.',
      'Prepare the request form, description, claims, abstract, and drawings.',
      'Ensure all documents meet PCT requirements.',
    ],
  },
  {
    number: 4,
    title: 'Submit application',
    icon: 'key-round',
    details: [
      'Fill in all required information.',
      'Upload all necessary documents.',
      'Review your application before submission.',
    ],
  },
  {
    number: 5,
    title: 'Pay fees and receive confirmation',
    icon: 'send',
    details: [
      'Pay the required PCT filing fees.',
      'Receive your international application number and filing date.',
    ],
  },
];

export const PCT_REQUIREMENTS = [
  'Valid patent application or priority claim',
  'Completed PCT request form',
  'Description of the invention in Arabic or English',
  'Claims defining the scope of protection',
  'Abstract (not exceeding 150 words)',
  'Drawings (if necessary for understanding the invention)',
  'Payment of international filing fee',
  'Power of attorney (if using an agent)',
];

export const PCT_SIDEBAR = {
  executionTime: 'Within 30 months from priority date',
  serviceFee: 'Variable (depends on application type)',
  targetGroup: 'Individuals, Enterprises',
  serviceChannel: 'Digital',
  faqHref: '/resources/ip-information/faq',
  platformHref: 'https://saip.gov.sa',
};
