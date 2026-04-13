export const PATENT_APPLICATION_STEPS = [
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
    title: 'Create an account',
    icon: 'user-plus',
    details: [
      'Select an account for Individuals, Organizations or Agents.',
      'If the applicant is an individual - a new user - the registration is made via the National Access or through creating a new account at the registration portal at the SAIP Services.',
      'If the applicant is an agent/certificate - a new user - the registration is made through creating a new account at the registration portal at the SAIP Services.',
    ],
  },
  {
    number: 3,
    title: 'Log in to the Service Platform',
    icon: 'clipboard-plus',
    details: [
      'Login through the One National Access or mail.',
      'If the applicant (individual/company) has an existing account, login is made via the National Access or mail.',
      'If the applicant agent/company has an existing account, login is made via mail.',
    ],
  },
  {
    number: 4,
    title: 'Start new application',
    icon: 'key-round',
    details: [
      'Download patent application templates (there are templates for summary, full description, intellectual elements, drawings if any).',
      'Select the type of application (select patent).',
      'Fill in the application data.',
      'Attach the templates in their designated places.',
    ],
  },
  {
    number: 5,
    title: 'Submit your application',
    icon: 'send',
    details: [
      'An application invoice is issued. If paid, the application number and date of filing are issued.',
    ],
  },
];

export const PATENT_APPLICATION_REQUIREMENTS = [
  'The content of the patent application necessary for filing',
  'Applicant information (name, nationality, address)',
  'Invention title and description',
  'Claims defining the scope of protection',
  'Abstract summarizing the invention',
  'Drawings (if applicable)',
  'Priority documents (if claiming priority)',
  'Power of attorney (if using an agent)',
];

export const PATENT_APPLICATION_SIDEBAR = {
  executionTime: 'Immediately after payment',
  serviceFee: '1000 SAR',
  targetGroup: 'Individuals, Enterprises',
  serviceChannel: 'Digital',
  faqHref: '/resources/ip-information/faq',
  platformHref: 'https://saip.gov.sa',
};
