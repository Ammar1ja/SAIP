import { StatisticsCardType } from '@/components/organisms/StatisticsSection/StatisticsSection.types';

export const PATENTS_OVERVIEW_STATISTICS = {
  statisticsTitle: 'Statistics',
  statisticsCtaLabel: 'View more statistics',
  statisticsCtaHref: '/resources/statistics',
  statistics: [
    {
      label: 'Number of patent applications in 2023',
      value: 4076,
      chartType: 'line',
      chartData: [
        { value: 1000 },
        { value: 1500 },
        { value: 2000 },
        { value: 2500 },
        { value: 3000 },
        { value: 3500 },
        { value: 4076 },
      ],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
    {
      label: 'Number of registered patents in 2023',
      value: 4011,
      chartType: 'line',
      chartData: [
        { value: 900 },
        { value: 1200 },
        { value: 1800 },
        { value: 2200 },
        { value: 2700 },
        { value: 3200 },
        { value: 4011 },
      ],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
    {
      label: `Applicant's type`,
      chartType: 'pie',
      breakdown: [
        { label: 'Entities', value: 20.97, displayValue: '20,97%', color: '#388A5A' },
        { label: 'Individuals', value: 79.03, displayValue: '79,03%', color: '#1C6846' },
      ],
    },
  ] as StatisticsCardType[],
};
