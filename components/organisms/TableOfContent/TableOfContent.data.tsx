import { TocItem } from './TableOfContent.types';

export const TOC_ITEMS: TocItem[] = [
  {
    id: 'guidance',
    label: 'Guidance',
    subItems: [
      { id: 'patent-checklist', label: 'Patent checklist' },
      { id: 'ip-clinics', label: 'IP Clinics' },
      { id: 'ip-search-engine', label: 'IP Search Engine' },
      { id: 'not-patentable', label: 'Not patentable categories' },
    ],
  },
  { id: 'protection', label: 'Protection' },
  { id: 'management', label: 'Management' },
  { id: 'enforcement', label: 'Enforcement' },
];
