export const CONSULTANCY_SERVICES_DESC = {
  title: 'Services of the IP consultancy Clinics',
  description:
    'IP advisory clinics are one of the services offered by SAIP. ' +
    'It aims to provide guidance services in IP fields through advice provided by experts in this field ' +
    'to both individuals and institutions.',
  backLabel: 'Go back to Services',
  categories: ['IP Clinics', 'Guidance'],
};

export const CONSULTANCY_STEPS = [
  {
    number: 1,
    title: 'Log in',
    icon: 'user',
    details: [
      'Login to the SAIP platform',
      { label: 'Go to SAIP platform', href: 'https://saip.gov.sa', external: true },
    ],
  },
  {
    number: 2,
    title: 'Go to IP Consulting Clinics service',
    icon: 'user-plus',
    details: ['Go to IP Clinics', 'Select Services of the IP consultancy clinics'],
  },
  {
    number: 3,
    title: 'Submit a request for advice',
    icon: 'key-round',
    details: [
      'The accordion component delivers large amounts of content in a small space through ' +
        'progressive disclosure. The user gets key details about the underlying content and ' +
        'can choose to expand that content within the constrains of the accordion',
    ],
  },
  {
    number: 4,
    title: 'Process the request',
    icon: 'send',
    details: [
      'Determine the method of providing the service (digital response/invitation to attend an orientation session)',
    ],
  },
];

export const CONSULTANCY_REQUIREMENTS = [
  'Application Filling.',
  'Provide any relevant files related to the requested guidance (If available).',
];

export const CONSULTANCY_SIDEBAR = {
  executionTime: 'Immediately',
  serviceFee: 'Free',
  targetGroup: 'Individuals, Enterprises',
  serviceChannel: 'Digital',
  faqHref: '/faqs',
  platformHref: 'https://saip.gov.sa',
};
