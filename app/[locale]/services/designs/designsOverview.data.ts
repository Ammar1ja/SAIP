export const overviewHeader = {
  title: 'Information library',
  description: 'Watch the video and learn the key steps involved in designs.',
  videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4',
  videoPoster: '/images/designs/overview.jpg',
};

export const overviewGuide = {
  guideTitle: 'Design guides',
  guideCards: [
    {
      title: 'Saudi Design Classification',
      description: 'Locarno Classification Guide (14th Edition)',
      labels: ['Designs'],
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
      labels: ['Designs'],
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
      labels: ['Designs'],
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
      label: 'Number of design applications in 2023',
      value: 2156,
      chartType: 'line' as const,
      chartData: [
        { value: 500 },
        { value: 800 },
        { value: 1200 },
        { value: 1500 },
        { value: 1800 },
        { value: 2000 },
        { value: 2156 },
      ],
      trend: { value: '100%', direction: 'up' as const, description: 'vs last month' },
    },
    {
      label: 'Number of registered designs in 2023',
      value: 1987,
      chartType: 'line' as const,
      chartData: [
        { value: 400 },
        { value: 600 },
        { value: 900 },
        { value: 1200 },
        { value: 1500 },
        { value: 1800 },
        { value: 1987 },
      ],
      trend: { value: '100%', direction: 'up' as const, description: 'vs last month' },
    },
    {
      label: `Applicant's type`,
      chartType: 'pie' as const,
      breakdown: [
        { label: 'Entities', value: 35.2, displayValue: '35.2%', color: '#388A5A' },
        { label: 'Individuals', value: 64.8, displayValue: '64.8%', color: '#1C6846' },
      ],
    },
  ],
  statisticsTitle: 'Statistics',
  statisticsCtaLabel: 'View more statistics',
  statisticsCtaHref: '/resources/statistics',
};
