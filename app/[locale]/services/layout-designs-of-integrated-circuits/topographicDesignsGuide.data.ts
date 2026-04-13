import { ServiceCardProps } from '@/components/molecules/ServiceCard/ServiceCard';

export const TOPOGRAPHIC_DESIGNS_GUIDE_CARDS: ServiceCardProps[] = [
  {
    title: 'Layout Design Registration Guide',
    description: 'Complete guide for registering layout designs of integrated circuits',
    labels: ['Layout Designs'],
    publicationDate: '04.08.2024',
    primaryButtonLabel: 'Download file',
    primaryButtonHref: '/files/layout-design-registration.pdf',
    secondaryButtonLabel: 'View file',
    secondaryButtonHref: '/files/layout-design-registration.pdf',
    titleBg: 'green' as const,
  },
  {
    title: 'Originality Requirements Guide',
    description: 'Understanding originality and novelty requirements for IC layouts',
    labels: ['Layout Designs'],
    publicationDate: '04.08.2024',
    primaryButtonLabel: 'Download file',
    primaryButtonHref: '/files/originality-requirements.pdf',
    secondaryButtonLabel: 'View file',
    secondaryButtonHref: '/files/originality-requirements.pdf',
    titleBg: 'green' as const,
  },
  {
    title: 'Commercial Exploitation Guide',
    description: 'Guidelines for commercial use and restrictions of layout designs',
    labels: ['Layout Designs'],
    publicationDate: '04.08.2024',
    primaryButtonLabel: 'Download file',
    primaryButtonHref: '/files/commercial-exploitation.pdf',
    secondaryButtonLabel: 'View file',
    secondaryButtonHref: '/files/commercial-exploitation.pdf',
    titleBg: 'green' as const,
  },
];
