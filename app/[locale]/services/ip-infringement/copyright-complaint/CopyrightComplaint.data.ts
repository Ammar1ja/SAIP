export const COPYRIGHT_COMPLAINT_STEPS = [
  {
    number: 1,
    title: 'Log in',
    icon: 'user',
    details: [
      'Login to the SAIP platform, select Services, and select Open Ticket icon',
      { label: 'Go to SAIP platform', href: 'https://saip.gov.sa', external: true },
    ],
  },
  {
    number: 2,
    title: 'Fill in the required data',
    icon: 'clipboard',
    details: ['Fill in the required data'],
  },
  {
    number: 3,
    title: 'Start Copyright Infringement Application',
    icon: 'clipboard-plus',
    details: [
      'Click on Key Service and start application',
      'Fill out the necessary infringement requirements and comply with the necessary requirements.',
    ],
  },
  {
    number: 4,
    title: 'Attach the necessary requirements and documents',
    icon: 'paperclip',
    details: ['Attach the necessary requirements and documents'],
  },
  {
    number: 5,
    title: 'Submit the application',
    icon: 'send',
    details: ['Submit the application'],
  },
];

export const COPYRIGHT_COMPLAINT_REQUIREMENTS = [
  'Application Filing',
  'Provide any relevant files related to the requested guidance (if available)',
];

export const COPYRIGHT_COMPLAINT_SIDEBAR = {
  executionTime: 'Immediately after payment',
  serviceFee: '1000 SAR',
  targetGroup: 'Individuals, Enterprises',
  serviceChannel: 'Digital',
  faqHref: '/resources/ip-information/faq',
  platformHref: 'https://saip.gov.sa',
};
