import { PatentDocIcon } from '@/components/icons/services';
import { FilesIcon, FileTextIcon, InfoIcon } from 'lucide-react';
import React from 'react';
import { StatisticsCardType } from '@/components/organisms/StatisticsSection/StatisticsSection.types';
import { BookIcon } from '@/components/icons';

// ===== MAIN NAVIGATION & COMMON DATA =====
export const GENERAL_SECRETARIAT_TABS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <PatentDocIcon className="w-5 h-5" aria-hidden="true" />,
  },
  {
    id: 'how-to-join',
    label: 'How to join',
    icon: <InfoIcon className="w-5 h-5" aria-hidden="true" />,
  },
  {
    id: 'centers',
    label: 'Centers',
    icon: <FilesIcon className="w-5 h-5" aria-hidden="true" />,
  },
  {
    id: 'documents-decisions',
    label: 'Documents & decisions',
    icon: <FileTextIcon className="w-5 h-5" aria-hidden="true" />,
  },
];

export const BREADCRUMBS_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Services' },
  { label: 'IP Enforcement & dispute' },
  { label: 'General secretariat of IP dispute resolution committees' },
];

// ===== OVERVIEW TAB DATA =====
export interface CommitteeTabData {
  id: string;
  title: string;
  description: React.ReactNode;
  image: {
    src: string;
    alt: string;
  };
  buttonLabel?: string;
  buttonHref?: string;
  buttonAriaLabel?: string;
}

export const committeeVerticalTabs = [
  { id: 'trademark-committee', label: 'Trademark committee' },
  {
    id: 'patent-design-ic-plant',
    label: 'Patents, Designs, Layout designs of IC, Plant Varieties committee',
  },
  { id: 'copyright-committee', label: 'Copyright committee' },
];

export const committeeVerticalTabsData: CommitteeTabData[] = [
  {
    id: 'trademark-committee',
    title: 'Trademark committee',
    description: (
      <>
        <p>
          The first Trademark Appeals Committee was formed after the jurisdiction was transferred to
          SAIP under Ministerial Decision No. (108) dated 08/04/1441 AH.
        </p>
        <p>
          The committee members have full independence from SAIP and possess extensive legal and
          technical expertise to review appeals effectively.
        </p>
      </>
    ),
    image: { src: '/images/photo-container.png', alt: 'Trademark committee' },
  },
  {
    id: 'patent-design-ic-plant',
    title: 'Patents, Designs, Layout designs of IC, Plant Varieties committee',
    description: (
      <>
        <p>
          The General Secretariat of IP Dispute Resolution Committees commenced its operations with
          the formation of the first Copyright Violations Committee, established by the decision of
          the Board of Directors of SAIP No. (01/T/2019) dated 09/08/1440 AH.
        </p>
        <p>
          This initiative aims to achieve the highest level of efficiency and quality in services
          related to IP cases handled by the committees specified in relevant laws and regulations,
          ensuring transparency, justice, and swift execution.
        </p>
      </>
    ),
    image: { src: '/images/photo-container.png', alt: 'Patent and Design committees' },
  },
  {
    id: 'copyright-committee',
    title: 'Copyright committee',
    description: (
      <>
        <p>
          The Copyright Committee specializes in resolving disputes related to literary, artistic,
          and creative works.
        </p>
        <p>
          This includes books, music, films, software, and other intellectual creations protected
          under copyright law.
        </p>
      </>
    ),
    image: { src: '/images/photo-container.png', alt: 'Copyright committee' },
  },
];

// ===== CENTERS TAB DATA =====
export interface GeneralSecretariatService {
  id: string;
  title: string;
  description: string;
  labels: string[];
  href: string;
  [key: string]: unknown; // Add index signature for FilterableItem compatibility
}

export const GENERAL_SECRETARIAT_SERVICES: GeneralSecretariatService[] = [
  {
    id: '1',
    title: 'Trademark Appeals Committee',
    description: 'Review and resolve trademark-related disputes and appeals.',
    labels: ['Trademark', 'Appeals', 'Disputes'],
    href: '/services/trademark-committee',
  },
  {
    id: '2',
    title: 'Patent Claims Review Committee',
    description: 'Handle patent-related disputes and infringement cases.',
    labels: ['Patent', 'Claims', 'Review'],
    href: '/services/patent-committee',
  },
  {
    id: '3',
    title: 'Copyright Protection Committee',
    description: 'Resolve copyright violations and protection matters.',
    labels: ['Copyright', 'Protection', 'Violations'],
    href: '/services/copyright-committee',
  },
  {
    id: '4',
    title: 'Design Rights Committee',
    description: 'Handle industrial design disputes and protection.',
    labels: ['Design', 'Rights', 'Industrial'],
    href: '/services/design-committee',
  },
];

export const CENTERS_FILTER_FIELDS = [
  {
    id: 'search',
    label: 'Search',
    type: 'search' as const,
    placeholder: 'Search',
  },
];

// ===== DOCUMENTS TAB DATA =====
export interface Document {
  id: string;
  name: string;
  committeeType: string;
  date: string;
  hijriDate: string;
  fileUrl: string;
}

export const DOCUMENTS_DATA: Document[] = [
  {
    id: '1',
    name: 'Requirements for filing a lawsuit',
    committeeType: 'Trademark Grievances Review Committee',
    date: '25.09.2024',
    hijriDate: '22.03.1446',
    fileUrl: '#',
  },
  {
    id: '2',
    name: 'Request form for consideration of filing a lawsuit',
    committeeType: 'Committee for the Review of Violations of the Copyright Protection System',
    date: '25.09.2024',
    hijriDate: '22.03.1446',
    fileUrl: '#',
  },
  {
    id: '3',
    name: 'Decisions of the Committee for the Review of Violations of the Copyright Protection System for the year 1440 AH',
    committeeType: 'Committee for the Review of Violations of the Copyright Protection System',
    date: '25.09.2024',
    hijriDate: '22.03.1446',
    fileUrl: '#',
  },
  {
    id: '4',
    name: 'Decisions of the Committee for the Review of Violations of the Copyright Protection System for the year 1441 AH',
    committeeType: 'Committee for the Review of Violations of the Copyright Protection System',
    date: '25.09.2024',
    hijriDate: '22.03.1446',
    fileUrl: '#',
  },
  {
    id: '5',
    name: 'Decisions of the Committee for the Review of Violations of the Copyright Protection System for the year 1442 AH',
    committeeType: 'Committee for the Review of Violations of the Copyright Protection System',
    date: '25.09.2024',
    hijriDate: '22.03.1446',
    fileUrl: '#',
  },
  {
    id: '6',
    name: 'Decisions of the Committee for the Review of Violations of the Copyright Protection System for the year 1443 AH',
    committeeType: 'Committee for the Review of Violations of the Copyright Protection System',
    date: '25.09.2024',
    hijriDate: '22.03.1446',
    fileUrl: '#',
  },
  {
    id: '7',
    name: 'Decisions of the Patent Claims Review Committee (1) for the year 1441 AH',
    committeeType: 'Patent Claims Review Committee',
    date: '25.09.2024',
    hijriDate: '22.03.1446',
    fileUrl: '#',
  },
];

export const DOCUMENTS_FILTER_FIELDS = [
  {
    id: 'search',
    label: 'Search',
    type: 'search' as const,
    placeholder: 'Search',
  },
  {
    id: 'serviceType',
    label: 'Service type',
    type: 'select' as const,
    options: [
      { label: 'Select', value: '' },
      { label: 'Trademark', value: 'trademark' },
      { label: 'Copyright', value: 'copyright' },
      { label: 'Patent', value: 'patent' },
    ],
    multiselect: false,
  },
  {
    id: 'targetGroup',
    label: 'Target group',
    type: 'select' as const,
    options: [
      { label: 'Select', value: '' },
      { label: 'Individuals', value: 'individuals' },
      { label: 'Businesses', value: 'businesses' },
      { label: 'Legal Representatives', value: 'legal' },
    ],
    multiselect: false,
  },
];

// ===== STATISTICS DATA =====
export const GENERAL_SECRETARIAT_STATISTICS: StatisticsCardType[] = [
  {
    icon: <BookIcon />,
    label: 'Number of cases',
    value: 200,
    chartType: 'line',
    chartData: [{ value: 100 }, { value: 150 }, { value: 200 }],
    trend: { value: '100%', direction: 'up', description: 'vs last month' },
  },
  {
    icon: <BookIcon />,
    label: 'Number of decisions',
    value: 8000,
    chartType: 'line',
    chartData: [{ value: 6000 }, { value: 7000 }, { value: 8000 }],
    trend: { value: '100%', direction: 'up', description: 'vs last month' },
  },
  {
    icon: <BookIcon />,
    label: 'Number of sessions',
    value: 40,
    chartType: 'line',
    chartData: [{ value: 20 }, { value: 30 }, { value: 40 }],
    trend: { value: '100%', direction: 'up', description: 'vs last month' },
  },
];

// ===== RESPONSIBILITIES DATA =====
export interface CommitteeResponsibility {
  id: string;
  description: string;
}

export const COMMITTEE_RESPONSIBILITIES: CommitteeResponsibility[] = [
  {
    id: 'supervising',
    description:
      'Supervising the procedure of cases, exchanging their memoranda, and preparing them.',
  },
  {
    id: 'analyzing',
    description:
      'Studying and analyzing cases from legal and technical perspectives and preparing reports to present to the committees.',
  },
  {
    id: 'support',
    description: 'Providing legal, technical, and administrative support to the committees.',
  },
  {
    id: 'opinions',
    description:
      'Offering opinions and participating in studies related to the relevant laws and regulations.',
  },
  {
    id: 'research',
    description: 'Conducting research, studies, and providing technical and legal consultations.',
  },
  {
    id: 'principles',
    description: 'Extracting judicial principles from the decisions of IP committees.',
  },
];

// ===== COMMITTEE DETAILED DATA =====
export interface CommitteeData {
  id: string;
  title: string;
  description: string;
  responsibilities: CommitteeResponsibility[];
  ctaTitle: string;
  ctaButtonLabel: string;
  ctaButtonHref: string;
}

export const TRADEMARK_COMMITTEE_DATA: CommitteeData = {
  id: 'trademark',
  title: 'Trademark committee',
  description:
    'The first Trademark Appeals Committee was formed after the jurisdiction was transferred to SAIP under Ministerial Decision No. (108) dated 08/04/1441 AH. The committee members have full independence from SAIP and possess extensive legal and technical expertise to review appeals effectively.',
  responsibilities: [
    {
      id: 'appeals-refusal',
      description:
        'Reviewing appeals against decisions to refuse the registration of a trademark or to make it conditional.',
    },
    {
      id: 'appeals-modifications',
      description:
        'Reviewing appeals against decisions to refuse additions or modifications to a registered trademark.',
    },
  ],
  ctaTitle: 'Litigation path for trademark committee',
  ctaButtonLabel: 'Go to litigation path',
  ctaButtonHref: '/resources/lows-and-regulations/litigation-paths',
};

export const PATENT_COMMITTEE_DATA: CommitteeData = {
  id: 'patent',
  title: 'Patent, Design, Layout designs of IC and Plant varieties committees',
  description:
    'These specialized committees handle disputes related to patents, industrial designs, integrated circuit layout designs, and plant varieties. Each committee consists of experts in their respective fields to ensure proper evaluation and resolution of complex technical matters.',
  responsibilities: [
    {
      id: 'patent-disputes',
      description:
        'Resolving disputes related to patent validity, infringement, and licensing agreements.',
    },
    {
      id: 'design-disputes',
      description: 'Handling industrial design disputes and protection matters.',
    },
    {
      id: 'ic-layout',
      description: 'Managing integrated circuit layout design disputes and protection.',
    },
    {
      id: 'plant-varieties',
      description: 'Resolving plant variety protection and rights disputes.',
    },
  ],
  ctaTitle: 'Litigation path for patent committees',
  ctaButtonLabel: 'Go to litigation path',
  ctaButtonHref: '/resources/lows-and-regulations/litigation-paths',
};

export const COPYRIGHT_COMMITTEE_DATA: CommitteeData = {
  id: 'copyright',
  title: 'Copyright committee',
  description:
    'The Copyright Committee specializes in resolving disputes related to literary, artistic, and creative works. This includes books, music, films, software, and other intellectual creations protected under copyright law.',
  responsibilities: [
    {
      id: 'literary-works',
      description: 'Resolving disputes related to literary works, books, and written content.',
    },
    {
      id: 'artistic-works',
      description: 'Handling disputes involving artistic works, music, and visual arts.',
    },
    {
      id: 'digital-content',
      description: 'Managing software, digital content, and multimedia copyright disputes.',
    },
  ],
  ctaTitle: 'Litigation path for copyright committee',
  ctaButtonLabel: 'Go to litigation path',
  ctaButtonHref: '/resources/lows-and-regulations/litigation-paths',
};
