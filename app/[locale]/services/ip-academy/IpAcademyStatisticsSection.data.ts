import { StatisticsCardType } from '@/components/organisms/StatisticsSection/StatisticsSection.types';

export const IP_ACADEMY_STATISTICS: StatisticsCardType[] = [
  {
    label: 'Number of courses SAIP has delivered',
    value: 200,
    chartType: 'line',
    chartData: [{ value: 100 }, { value: 120 }, { value: 150 }, { value: 200 }],
    trend: { value: '100%', direction: 'up', description: 'vs last month' },
  },
  {
    label: 'Number of learners SAIP has taught',
    value: 8000,
    chartType: 'line',
    chartData: [{ value: 4000 }, { value: 5000 }, { value: 7000 }, { value: 8000 }],
    trend: { value: '100%', direction: 'up', description: 'vs last month' },
  },
  {
    label: 'Number of dedicated courses SAIP has created for companies',
    value: 40,
    chartType: 'line',
    chartData: [{ value: 10 }, { value: 20 }, { value: 30 }, { value: 40 }],
    trend: { value: '100%', direction: 'up', description: 'vs last month' },
  },
  {
    label: 'Number of institutions SAIP partner with',
    value: 100,
    chartType: 'line',
    chartData: [{ value: 20 }, { value: 40 }, { value: 70 }, { value: 100 }],
    trend: { value: '100%', direction: 'up', description: 'vs last month' },
  },
];
