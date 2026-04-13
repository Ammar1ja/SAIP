import { RelatedService } from './IPLicensingRelatedServicesSection.types';

export const IP_LICENSING_RELATED_SERVICES: RelatedService[] = [
  {
    question: 'Do you meet all the conditions?',
    title: 'IP agent license registration',
    description:
      'Become a certified IP Agent and represent clients in IP matters. Join a network of professionals dedicated to protecting IP in Saudi Arabia.',
    price: '3000 SAR',
    ctaLabel: 'Go to SAIP Platform',
    ctaHref: '/saip-platform/ip-agent-registration',
  },
  {
    question: "Are you ready but haven't passed the exam yet?",
    title: 'IP agents exam',
    description:
      'The professional test for Agents is required to obtain a license for providing IP services. It aims to build specialized national professionals and includes knowledge, skills, practices, and real-life examples.',
    price: '1000 SAR',
    ctaLabel: 'Go to SAIP Platform',
    ctaHref: '/saip-platform/ip-agent-exam',
  },
];
