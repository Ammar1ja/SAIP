import { GuideData, RequirementItem } from './IPLicensingOverviewSection.types';

export const IP_LICENSING_GUIDE_DATA: GuideData = {
  title: 'IP licensing guide',
  description:
    'Experts provide essential guidance on how to protect ideas and innovations through the correct registration of intellectual property rights and offer advice on intellectual property strategies.',
  image: {
    src: '/images/placeholder-document.png',
    alt: 'Document placeholder',
  },
  viewFileLabel: 'View file',
  viewFileHref: '#',
  downloadFileLabel: 'Download file',
  downloadFileHref: '#',
};

export const IP_LICENSING_REQUIREMENTS: RequirementItem[] = [
  {
    number: 1,
    text: 'You are a Saudi national.',
  },
  {
    number: 2,
    text: 'You have full legal capacity.',
  },
  {
    number: 3,
    text: 'You are Saudi Arabia resident.',
  },
  {
    number: 4,
    text: 'You are not an employee of any government agency.',
  },
  {
    number: 5,
    text: 'You have no convictions for crimes involving honor or breach of trust, unless rehabilitated.',
  },
  {
    number: 6,
    text: "You have at least a bachelor's degree in law, science, engineering, or another approved major from a recognized Saudi University or equivalent under Saudi Arabia regulations.",
  },
  {
    number: 7,
    text: 'You possess a professional verification certificate issued by SAIP.',
  },
  {
    number: 8,
    text: 'You have paid the prescribed licensing fee.',
  },
];

export const IP_LICENSING_EXEMPTIONS = [
  'You are a licensed lawyer with at least two years of professional experience in intellectual property since obtaining your law practice license.',
  'You are an evaluator of protection applications with at least two years of relevant work experience.',
  'You hold a postgraduate degree in intellectual property with at least one year of experience in the field.',
];
