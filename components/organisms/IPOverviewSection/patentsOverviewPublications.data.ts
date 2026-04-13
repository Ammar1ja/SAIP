import { ServiceCardProps } from '@/components/molecules/ServiceCard/ServiceCard';

export const PATENTS_OVERVIEW_PUBLICATIONS = {
  publicationsTitle: 'Publications',
  publicationsDescription:
    'The patent publications provide important updates and information on patent procedures, changes in regulations, and relevant industry developments in Saudi Arabia.',
  publications: [
    {
      title: 'Patent Law Update',
      description: 'Latest changes in patent law for 2024.',
      labels: [],
    },
    {
      title: 'Innovation Trends',
      description: 'Emerging trends in patent filings.',
      labels: [],
    },
  ] as ServiceCardProps[],
  publicationsCtaLabel: 'View more publication',
  publicationsCtaHref: '/resources/publications',
};
