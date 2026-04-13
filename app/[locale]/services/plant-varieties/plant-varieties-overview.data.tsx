export const overviewHeader = {
  title: 'Information library',
  description: 'Watch the video and learn the key steps involved in plant varieties.',
  videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4',
  videoPoster: '/images/plant-varieties/overview.jpg',
};

export const overviewGuide = {
  guideTitle: 'Plant varieties guides',
  guideCards: [
    {
      title: 'Saudi Design Classification',
      description: 'Locarno Classification Guide (14th Edition)',
      labels: ['Plant Varieties'],
      publicationDate: '04.08.2024',
      primaryButtonLabel: 'Download file',
      primaryButtonHref: '/files/saudi-design-classification.pdf',
      secondaryButtonLabel: 'View file',
      secondaryButtonHref: '/files/saudi-design-classification.pdf',
      titleBg: 'green' as const,
    },
    {
      title: 'Software Copyright Protection Guide',
      description: 'Guidelines for Protecting Copyright in Software',
      labels: ['Copyrights'],
      publicationDate: '04.08.2024',
      primaryButtonLabel: 'Download file',
      primaryButtonHref: '/files/software-copyright-guide.pdf',
      secondaryButtonLabel: 'View file',
      secondaryButtonHref: '/files/software-copyright-guide.pdf',
      titleBg: 'green' as const,
    },
    {
      title: 'Guide to patent application content',
      description: 'The content of the patent application necessary for filing',
      labels: ['Copyrights'],
      publicationDate: '04.08.2024',
      primaryButtonLabel: 'Download file',
      primaryButtonHref: '/files/guide-to-patent-application-content.pdf',
      secondaryButtonLabel: 'View file',
      secondaryButtonHref: '/files/guide-to-patent-application-content.pdf',
      titleBg: 'green' as const,
    },
  ],
};

export const overviewStatistics = {
  statistics: [
    {
      label: 'Number of plant varieties applications in 2023',
      value: 4076,
      chartType: 'line' as const,
      chartData: [
        { value: 1000 },
        { value: 1500 },
        { value: 2000 },
        { value: 2500 },
        { value: 3000 },
        { value: 3500 },
        { value: 4076 },
      ],
      trend: { value: '100%', direction: 'up' as const, description: 'vs last month' },
    },
    {
      label: 'Number of registered plant varieties in 2023',
      value: 4011,
      chartType: 'line' as const,
      chartData: [
        { value: 900 },
        { value: 1200 },
        { value: 1800 },
        { value: 2200 },
        { value: 2700 },
        { value: 3200 },
        { value: 4011 },
      ],
      trend: { value: '100%', direction: 'up' as const, description: 'vs last month' },
    },
    {
      label: `Applicant's type`,
      chartType: 'pie' as const,
      breakdown: [
        { label: 'Entities', value: 20.97, displayValue: '20,97%', color: '#388A5A' },
        { label: 'Individuals', value: 79.03, displayValue: '79,03%', color: '#1C6846' },
      ],
    },
  ],
  statisticsTitle: 'Statistics',
  statisticsCtaLabel: 'View more statistics',
  statisticsCtaHref: '/resources/statistics',
};
