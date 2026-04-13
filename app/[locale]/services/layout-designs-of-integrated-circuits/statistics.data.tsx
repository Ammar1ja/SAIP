import { StatisticsCardType } from '@/components/organisms/StatisticsSection/StatisticsSection.types';

export const TOPOGRAPHIC_DESIGNS_STATISTICS_CARDS: StatisticsCardType[] = [
  {
    icon: 'integrated_circuit',
    label: 'Number of layout designs of IC applications in 2023',
    value: 4076,
    chartType: 'line',
    chartData: [
      { value: 3200 },
      { value: 3400 },
      { value: 3300 },
      { value: 3600 },
      { value: 3800 },
      { value: 3700 },
      { value: 3900 },
      { value: 4076 },
    ],
    trend: { value: '100%', direction: 'up', description: 'vs last month' },
  },
  {
    icon: 'integrated_circuit',
    label: 'Number of registered layout designs of IC in 2023',
    value: 4011,
    chartType: 'line',
    chartData: [
      { value: 3100 },
      { value: 3300 },
      { value: 3250 },
      { value: 3450 },
      { value: 3600 },
      { value: 3550 },
      { value: 3720 },
      { value: 4011 },
    ],
    trend: { value: '100%', direction: 'up', description: 'vs last month' },
  },
  {
    icon: 'integrated_circuit',
    label: `Applicant's type`,
    chartType: 'pie',
    breakdown: [
      { label: 'Entities', value: 20.97, displayValue: '20,97%', color: '#1B8354' },
      { label: 'Individuals', value: 79.03, displayValue: '79,03%', color: '#14573A' },
    ],
  },
];
