export const servicesTitle = 'Design Services';

export const services = [
  {
    id: 'design-search',
    title: 'Design Search',
    description:
      'Comprehensive search services to check design availability and identify potential conflicts.',
    icon: 'search',
    href: '/services/designs/design-search',
    category: 'search',
    targetGroup: 'all',
  },
  {
    id: 'design-registration',
    title: 'Design Registration',
    description:
      'Complete design registration services including application preparation and filing.',
    icon: 'document',
    href: '/services/designs/design-registration',
    category: 'registration',
    targetGroup: 'all',
  },
  {
    id: 'design-examination',
    title: 'Design Examination',
    description:
      'Professional examination services to assess design novelty and individual character.',
    icon: 'check',
    href: '/services/designs/design-examination',
    category: 'examination',
    targetGroup: 'all',
  },
  {
    id: 'design-renewal',
    title: 'Design Renewal',
    description: 'Timely renewal services to maintain design protection and extend rights.',
    icon: 'refresh',
    href: '/services/designs/design-renewal',
    category: 'maintenance',
    targetGroup: 'all',
  },
  {
    id: 'design-opposition',
    title: 'Design Opposition',
    description: 'Representation in opposition proceedings to protect your design rights.',
    icon: 'shield',
    href: '/services/designs/design-opposition',
    category: 'enforcement',
    targetGroup: 'all',
  },
  {
    id: 'design-consultation',
    title: 'Design Consultation',
    description: 'Expert consultation on design strategy, protection, and commercialization.',
    icon: 'consultation',
    href: '/services/designs/design-consultation',
    category: 'consultation',
    targetGroup: 'all',
  },
];

export const serviceTypeOptions = [
  { value: 'all', label: 'All Services' },
  { value: 'search', label: 'Search Services' },
  { value: 'registration', label: 'Registration Services' },
  { value: 'examination', label: 'Examination Services' },
  { value: 'maintenance', label: 'Maintenance Services' },
  { value: 'enforcement', label: 'Enforcement Services' },
  { value: 'consultation', label: 'Consultation Services' },
];

export const targetGroupOptions = [
  { value: 'all', label: 'All Users' },
  { value: 'individuals', label: 'Individuals' },
  { value: 'companies', label: 'Companies' },
  { value: 'lawyers', label: 'Lawyers' },
  { value: 'agents', label: 'IP Agents' },
];
