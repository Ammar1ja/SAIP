import { StatisticsCardType } from '@/components/organisms/StatisticsSection/StatisticsSection.types';

export const IP_SUPPORT_CENTERS_STATISTICS: StatisticsCardType[] = [
  {
    label: 'Number of IP Support Centers',
    value: 41,
    chartType: 'line',
    chartData: [
      { value: 20 },
      { value: 25 },
      { value: 30 },
      { value: 35 },
      { value: 38 },
      { value: 40 },
      { value: 41 },
    ],
    trend: { value: '100%', direction: 'up', description: 'vs last month' },
  },
  {
    label: 'Number of regions, network range',
    value: 10,
    chartType: 'line',
    chartData: [
      { value: 5 },
      { value: 6 },
      { value: 7 },
      { value: 8 },
      { value: 9 },
      { value: 9 },
      { value: 10 },
    ],
    trend: { value: '100%', direction: 'up', description: 'vs last month' },
  },
  {
    label: 'Number of Services',
    value: 86,
    chartType: 'line',
    chartData: [
      { value: 40 },
      { value: 50 },
      { value: 60 },
      { value: 70 },
      { value: 75 },
      { value: 80 },
      { value: 86 },
    ],
    trend: { value: '100%', direction: 'up', description: 'vs last month' },
  },
  {
    label: 'Number of Beneficiaries',
    value: 587,
    chartType: 'line',
    chartData: [
      { value: 200 },
      { value: 300 },
      { value: 400 },
      { value: 450 },
      { value: 500 },
      { value: 550 },
      { value: 587 },
    ],
    trend: { value: '100%', direction: 'up', description: 'vs last month' },
  },
];
