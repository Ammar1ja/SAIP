import { IconProps, IconBackground } from '@/components/atoms/Icon/Icon.types';
import { Search, Scale, Landmark, Briefcase, BarChart2 } from 'lucide-react';

export const ipSearchAudienceData = [
  {
    title: 'For Innovators and Researchers',
    description:
      'To verify the uniqueness of inventions and identify existing technologies before filing patents.',
    icon: {
      component: Search,
      alt: 'Search icon',
      size: 'large' as IconProps['size'],
      background: 'green' as IconBackground,
    },
  },
  {
    title: 'For IP Enforcement and Litigation',
    description: 'To detect IP infringement and support legal disputes with validity assessments.',
    icon: {
      component: Scale,
      alt: 'Scales icon',
      size: 'large' as IconProps['size'],
      background: 'green' as IconBackground,
    },
  },
  {
    title: 'For Government and Policymakers',
    description:
      'To leverage IP data for policy-making, national strategies, and collaborative opportunities.',
    icon: {
      component: Landmark,
      alt: 'Government icon',
      size: 'large' as IconProps['size'],
      background: 'green' as IconBackground,
    },
  },
  {
    title: 'For Businesses',
    description: 'To ensure products, trademarks, and designs do not infringe on existing rights.',
    icon: {
      component: Briefcase,
      alt: 'Business icon',
      size: 'large' as IconProps['size'],
      background: 'green' as IconBackground,
    },
  },
  {
    title: 'For Strategic Market Insights',
    description:
      'To analyze competitors’ filings and explore innovation trends for R&D and strategy.',
    icon: {
      component: BarChart2,
      alt: 'Chart icon',
      size: 'large' as IconProps['size'],
      background: 'green' as IconBackground,
    },
  },
];
