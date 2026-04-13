import React from 'react';
import { StatisticsCardType } from '@/components/organisms/StatisticsSection/StatisticsSection.types';
import { BookIcon } from '@/components/icons';

export const STATISTICS_CARDS: StatisticsCardType[] = [
  {
    icon: <BookIcon />,
    label: 'Number of patent applications in 2023',
    value: 4076,
    chartType: 'line',
    chartData: [
      { date: 'as of 15 Mar 2025 / 15 Ramadan 1446', value: 1000 },
      { date: 'as of 15 Apr 2025 / 16 Shawwal 1446', value: 1500 },
      { date: 'as of 15 May 2025 / 17 Dhu al-Qi`dah 1446', value: 2000 },
      { date: 'as of 15 Jun 2025 / 18 Dhu al-Hijjah 1446', value: 2500 },
      { date: 'as of 15 Jul 2025 / 20 Muharram 1447', value: 3000 },
      { date: 'as of 15 Aug 2025 / 21 Safar 1447', value: 3500 },
      { date: 'as of 30 Sep 2025 / 7 Rabi` al-Thani 1447', value: 4076 },
    ],
    trend: { value: '100%', direction: 'up', description: 'vs last month' },
  },
  {
    icon: <BookIcon />,
    label: 'Number of registered patents in 2023',
    value: 4011,
    chartType: 'line',
    chartData: [
      { date: 'as of 15 Mar 2025 / 15 Ramadan 1446', value: 900 },
      { date: 'as of 15 Apr 2025 / 16 Shawwal 1446', value: 1200 },
      { date: 'as of 15 May 2025 / 17 Dhu al-Qi`dah 1446', value: 1800 },
      { date: 'as of 15 Jun 2025 / 18 Dhu al-Hijjah 1446', value: 2200 },
      { date: 'as of 15 Jul 2025 / 20 Muharram 1447', value: 2700 },
      { date: 'as of 15 Aug 2025 / 21 Safar 1447', value: 3200 },
      { date: 'as of 30 Sep 2025 / 7 Rabi` al-Thani 1447', value: 4011 },
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
