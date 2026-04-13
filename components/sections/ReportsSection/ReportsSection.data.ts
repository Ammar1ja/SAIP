export const categoryOptions = [
  { label: 'Trademarks', value: 'trademarks' },
  { label: 'Patents', value: 'patents' },
  { label: 'Copyrights', value: 'copyrights' },
  { label: 'Designs', value: 'designs' },
  { label: 'Topographic designs of integrated circuits', value: 'topo_designs' },
  { label: 'Plants varieties', value: 'plants' },
  { label: 'IP academy', value: 'ip_academy' },
  { label: 'IP clinics', value: 'ip_clinics' },
  { label: 'IP licensing', value: 'ip_licensing' },
  { label: 'IP infringement', value: 'ip_infringement' },
  { label: 'IP dispute resolution committees', value: 'ip_disputes' },
  { label: 'National network of IP support centers', value: 'ip_support_centers' },
];

export const reportTypeOptions = [
  { label: 'Statistical reports', value: 'statistical' },
  { label: 'Periodic reports', value: 'periodic' },
  { label: 'Knowledge reports', value: 'knowledge' },
];

export const reportsMock = Array.from({ length: 6 }, (_, i) => ({
  title: `Report Title ${i + 1}`,
  variant: 'report' as const,
  publicationDate: '06.08.2025',
  reportType: 'Text',
  labels: ['Statistical', 'Category'],
  href: '#',
  primaryButtonLabel: 'Download',
  primaryButtonHref: '#',
  secondaryButtonLabel: 'View',
  secondaryButtonHref: '#download',
}));
