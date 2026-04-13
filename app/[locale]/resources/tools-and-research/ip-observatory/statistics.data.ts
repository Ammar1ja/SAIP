import { StatisticsCardType } from '@/components/organisms/StatisticsSection/StatisticsSection.types';

export const IP_SERVICES = {
  applicationData: [
    {
      label: 'Patent application',
      value: 132,
      chartType: 'line',
      chartData: [{ value: 100 }, { value: 110 }, { value: 120 }, { value: 132 }],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
    {
      label: 'Trademark application',
      value: 80,
      chartType: 'line',
      chartData: [{ value: 70 }, { value: 72 }, { value: 75 }, { value: 80 }],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
    {
      label: 'Copyrights work application',
      value: 98,
      chartType: 'line',
      chartData: [{ value: 90 }, { value: 92 }, { value: 95 }, { value: 98 }],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
    {
      label: 'Design application',
      value: 105,
      chartType: 'line',
      chartData: [{ value: 95 }, { value: 97 }, { value: 100 }, { value: 105 }],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
    {
      label: 'Layout design of IC application',
      value: 111,
      chartType: 'line',
      chartData: [{ value: 100 }, { value: 103 }, { value: 107 }, { value: 111 }],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
    {
      label: 'Plant variety application',
      value: 165,
      chartType: 'line',
      chartData: [{ value: 150 }, { value: 152 }, { value: 160 }, { value: 165 }],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
  ] as StatisticsCardType[],
  certificatesData: [
    {
      label: 'Patent grant certificate',
      value: 132,
      chartType: 'line',
      chartData: [{ value: 100 }, { value: 110 }, { value: 120 }, { value: 132 }],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
    {
      label: 'Trademark registration certificate',
      value: 80,
      chartType: 'line',
      chartData: [{ value: 70 }, { value: 72 }, { value: 75 }, { value: 80 }],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
    {
      label: 'Copyrights registration certificate',
      value: 98,
      chartType: 'line',
      chartData: [{ value: 90 }, { value: 92 }, { value: 95 }, { value: 98 }],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
    {
      label: 'Design registration certificate',
      value: 105,
      chartType: 'line',
      chartData: [{ value: 95 }, { value: 97 }, { value: 100 }, { value: 105 }],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
    {
      label: 'Layout design of IC registration certificate',
      value: 111,
      chartType: 'line',
      chartData: [{ value: 100 }, { value: 103 }, { value: 107 }, { value: 111 }],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
    {
      label: 'Plant variety grant certificate',
      value: 165,
      chartType: 'line',
      chartData: [{ value: 150 }, { value: 152 }, { value: 160 }, { value: 165 }],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
  ] as StatisticsCardType[],
};

export const IP_ENABLEMENT = {
  applicationData: [
    {
      label: 'IP Clinics',
      value: 1193,
      chartType: 'line',
      chartData: [{ value: 900 }, { value: 950 }, { value: 1100 }, { value: 1193 }],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
    {
      label: 'Number of guidance sessions',
      value: 758,
      chartType: 'line',
      chartData: [{ value: 600 }, { value: 650 }, { value: 700 }, { value: 758 }],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
  ] as StatisticsCardType[],
  certificatesData: [
    {
      label: 'IP Clinics certificates',
      value: 1193,
      chartType: 'line',
      chartData: [{ value: 900 }, { value: 950 }, { value: 1100 }, { value: 1193 }],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
    {
      label: 'Number of guidance sessions certificates',
      value: 758,
      chartType: 'line',
      chartData: [{ value: 600 }, { value: 650 }, { value: 700 }, { value: 758 }],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
  ] as StatisticsCardType[],
};

export const IP_ENFORCEMENT = {
  applicationData: [
    {
      label: 'Number of copyright cases',
      value: 1193,
      chartType: 'line',
      chartData: [{ value: 900 }, { value: 950 }, { value: 1100 }, { value: 1193 }],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
    {
      label: 'Number of trademark cases',
      value: 758,
      chartType: 'line',
      chartData: [{ value: 600 }, { value: 650 }, { value: 700 }, { value: 758 }],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
  ] as StatisticsCardType[],
  certificatesData: [
    {
      label: 'Number of copyright cases certificate',
      value: 1193,
      chartType: 'line',
      chartData: [{ value: 900 }, { value: 950 }, { value: 1100 }, { value: 1193 }],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
    {
      label: 'Number of trademark cases certificate',
      value: 758,
      chartType: 'line',
      chartData: [{ value: 600 }, { value: 650 }, { value: 700 }, { value: 758 }],
      trend: { value: '100%', direction: 'up', description: 'vs last month' },
    },
  ] as StatisticsCardType[],
};
