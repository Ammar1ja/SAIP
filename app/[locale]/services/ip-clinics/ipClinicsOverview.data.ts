import { StatisticsCardType } from '@/components/organisms/StatisticsSection/StatisticsSection.types';

export const IP_CLINICS_OVERVIEW_TITLE = 'IP Clinics overview';
export const IP_CLINICS_OVERVIEW_DESCRIPTION =
  'Consulting clinics provide guidance and advice to companies, ' +
  'small and medium enterprises, entrepreneurs and individuals desiring to establish innovation-based ' +
  'projects with the aim to contribute to the IP rights registration, use and utilization.';

export const IP_CLINICS_VIDEO_CARD = {
  title: 'Information library',
  description: 'Watch the video and learn more about IP Clinics.',
  videoSrc: '',
  videoPoster: '',
};

export const IP_CLINICS_SERVICES_TITLE = 'Services of the IP Clinics';
export const IP_CLINICS_SERVICES_DESCRIPTION =
  'Intellectual Property Clinics (IP Clinics) are part of IP enablement programs, providing specialized services across three main tracks:';
export const IP_CLINICS_TABS = [
  {
    id: 'guidance',
    label: 'Guidance and Advisory Track',
  },
  {
    id: 'technical',
    label: 'Technical Services Track',
  },
  {
    id: 'ip-support-course',
    label: 'The course of the support program for IP-based enterprises',
  },
];

export const IP_CLINICS_TABS_DATA = [
  {
    id: 'guidance',
    title: 'Guidance and Advisory Track',
    description:
      'Experts provide essential guidance on how to protect ideas and innovations through the correct registration of IP rights and offer advice on IP strategies.',
    image: {
      src: '/images/services/ip-clinics/guidance.jpg',
      alt: 'Guidance and Advisory Track',
    },
    buttonLabel: 'Download file',
    buttonHref: '/ip-clinics/download-guidance',
    buttonLabel2: 'View file',
    buttonHref2: '/ip-clinics/view-guidance',
  },
  {
    id: 'technical',
    title: 'Technical Services Track',
    description:
      'This track includes specialized technical services such as analyzing and evaluating ideas, which helps in determining how to transform these ideas into marketable products.',
    image: {
      src: '/images/services/ip-clinics/technical.jpg',
      alt: 'Technical Services Track',
    },
    buttonLabel: 'Download file',
    buttonHref: '/ip-clinics/download-technical',
    buttonLabel2: 'View file',
    buttonHref2: '/ip-clinics/view-technical',
  },
  {
    id: 'ip-support-course',
    title: 'The course of the support program for IP-based enterprises',
    description:
      'This track supports businesses that rely on intellectual property for growth and development by offering technical, financial, and advisory support to accelerate the innovation process and achieve commercial success.',
    image: {
      src: '/images/services/ip-clinics/ip-support-course.jpg',
      alt: 'The course of the support program for IP-based enterprises',
    },
    buttonLabel: 'Download file',
    buttonHref: '/ip-clinics/download-ip-support-course',
    buttonLabel2: 'View file',
    buttonHref2: '/ip-clinics/view-ip-support-course',
  },
];

export const IP_CLINICS_STATISTICS: StatisticsCardType[] = [
  {
    label: 'Number of Beneficiaries',
    value: 1193,
    chartType: 'line' as const,
    chartData: [
      { value: 100 },
      { value: 250 },
      { value: 400 },
      { value: 550 },
      { value: 700 },
      { value: 850 },
      { value: 1193 },
    ],
    trend: { value: '100%', direction: 'up' as const, description: 'vs last month' },
  },
  {
    label: 'Number of counseling sessions',
    value: 758,
    chartType: 'line' as const,
    chartData: [
      { value: 75 },
      { value: 150 },
      { value: 225 },
      { value: 325 },
      { value: 450 },
      { value: 575 },
      { value: 758 },
    ],
    trend: { value: '100%', direction: 'up' as const, description: 'vs last month' },
  },
];
