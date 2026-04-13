import { PUBLICATIONS_CARDS } from '@/app/[locale]/services/patents/publications.data';
import { STATISTICS_CARDS } from '@/app/[locale]/services/patents/statistics.data';
import { PATENTS_GUIDE_CARDS } from '@/app/[locale]/services/patents/patentsGuide.data';

export const PATENTS_OVERVIEW_DATA = {
  title: 'Information library',
  description: 'Watch the video and learn the key steps involved in patents.',
  videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4',
  videoPoster: '/images/patents/overview.jpg',
  guideTitle: 'Patent Guide',
  guideCards: PATENTS_GUIDE_CARDS,
  publications: PUBLICATIONS_CARDS,
  publicationsTitle: 'Publications',
  publicationsDescription:
    'The patent publications provides important updates and information on patent procedures, changes in regulations, and relevant industry developments in Saudi Arabia.',
  publicationsCtaLabel: 'View more publication',
  publicationsCtaHref: '/resources/publications',
  statistics: STATISTICS_CARDS,
  statisticsTitle: 'Statistics',
  statisticsCtaLabel: 'View more statistics',
  statisticsCtaHref: '/resources/statistics',
};
