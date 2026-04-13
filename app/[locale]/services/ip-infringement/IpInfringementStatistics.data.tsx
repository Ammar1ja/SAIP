import React from 'react';
import { StatisticsCardType } from '@/components/organisms/StatisticsSection/StatisticsSection.types';
import { BookIcon } from '@/components/icons';

export const IP_INFRINGEMENT_STATISTICS: StatisticsCardType[] = [
  {
    icon: <BookIcon />,
    label: 'Number of IP infringement cases in 2023',
    value: 4076,
    chartType: 'line',
    chartData: [
      { value: 800 },
      { value: 1200 },
      { value: 1800 },
      { value: 2400 },
      { value: 3000 },
      { value: 3600 },
      { value: 4076 },
    ],
    trend: { value: '100%', direction: 'up', description: 'vs last month' },
  },
  {
    icon: <BookIcon />,
    label: 'Number of resolved cases in 2023',
    value: 4011,
    chartType: 'line',
    chartData: [
      { value: 750 },
      { value: 1100 },
      { value: 1650 },
      { value: 2200 },
      { value: 2800 },
      { value: 3400 },
      { value: 4011 },
    ],
    trend: { value: '100%', direction: 'up', description: 'vs last month' },
  },
  {
    icon: <BookIcon />,
    label: `Applicant's type`,
    chartType: 'pie',
    breakdown: [
      { label: 'Entities', value: 20.97, displayValue: '20,97%', color: '#388A5A' },
      { label: 'Individuals', value: 79.03, displayValue: '79,03%', color: '#1C6846' },
    ],
  },
];
