export const REGISTRATION_STEPS = [
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
    title: 'Go to IP Agents tab',
    icon: 'user-plus',
    details: ['Go to IP Licensing', 'Select IP Agent License Application'],
  },
  {
    number: 3,
    title: 'Start IP Agent License Application',
    icon: 'clipboard-plus',
    details: [
      'Agree to terms & Conditions',
      'Provide information about your professional experience.',
      'Provide personal information and contact details.',
      'Attach a copy of your Entity registration record.',
      'Select which categories you want your license to cover. You have to select at least one but you can also check all the options.',
    ],
  },
  {
    number: 4,
    title: 'Review all submitted information',
    icon: 'key-round',
    details: ['Review all submitted information before submitting.'],
  },
  {
    number: 5,
    title: 'Submit the application & pay',
    icon: 'send',
    details: [
      'Service cost is 3000 SAR. To finalize the registration process, ensure payment is completed within 30 days of submitting the application.',
    ],
  },
];

export const REGISTRATION_REQUIREMENTS = [
  'You have to be a Saudi national.',
  'You have to be a KSA resident.',
  'You cannot be an employee of a government agency.',
  'You have never been sentenced to a punishment or penalty for a crime against honor or breach of trust, unless rehabilitated.',
  "You have to have bachelor's degree in law and regulations, science, engineering, or any other major accepted by the Authority from a Saudi university or equivalent, in accordance with the regulations and rules in force in the Kingdom that organize university degrees.",
  'You have professional verification certificate issued by the authority.',
  'Commercial and legal institution information if the applicant is an owner or worker in it.',
];

export const REGISTRATION_SIDEBAR = {
  executionTime: 'Immediately after payment',
  serviceFee: '3000 SAR',
  targetGroup: 'Individuals, Enterprises',
  serviceChannel: 'Digital',
  faqHref: '/faqs',
  platformHref: 'https://saip.gov.sa',
};
