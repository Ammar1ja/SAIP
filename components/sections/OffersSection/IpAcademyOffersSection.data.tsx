import { Tab, Offer } from './IpAcademyOffersSection.types';

// NOTE: Tab labels are now provided by OffersSection component using translations
// This array only provides the tab IDs - labels come from messages/{locale}.json
export const TABS: Tab[] = [
  { id: 'training', label: '' }, // Label from ipAcademy.tabs.trainingPrograms
  { id: 'qualifications', label: '' }, // Label from ipAcademy.tabs.proQualifications
  { id: 'projects', label: '' }, // Label from ipAcademy.tabs.educationProjects
];

export const OFFERS: Offer[] = [
  {
    id: 'training',
    title: 'Training programs',
    image: {
      src: '/images/services/ip-academy/training-programs.jpg',
      alt: 'Training programs at IP Academy',
    },
    description: `Our training programs are meticulously designed to provide you with the expertise needed to excel in the field of IP.<br/><br/>Whether you're looking to deepen your knowledge or enhance your professional skills, our programs offer a comprehensive and practical approach to IP education.`,
    buttonLabel: 'Learn more',
    buttonHref: '/services/ip-academy?tab=training',
  },
  {
    id: 'qualifications',
    title: 'Professional qualifications',
    image: {
      src: '/images/services/ip-academy/professional-qualifications.jpg',
      alt: 'Professional qualifications at IP Academy',
    },
    description: `Professional qualifications aim to support the professional development of specialists and practitioners in the domains of IP by enhancing the quality of their performance in line with established professional standards.<br/><br/>Furthermore, they strive to build a qualified and specialized Saudi workforce equipped with the knowledge and skills necessary for excellence, enabling them to perform their duties professionally and effectively across various IP activities and domains.`,
    buttonLabel: 'Learn more',
    buttonHref: '/services/ip-academy?tab=qualifications',
  },
  {
    id: 'projects',
    title: 'Education projects',
    image: {
      src: '/images/services/ip-academy/education-projects.jpg',
      alt: 'Education projects at IP Academy',
    },
    description: `Education projects designed to foster learning, skill development, and knowledge sharing, our initiatives support individuals and communities in achieving their full potential.`,
    buttonLabel: 'Learn more',
    buttonHref: '/services/ip-academy?tab=projects',
  },
];

export default OFFERS;
