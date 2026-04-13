import { ReactNode } from 'react';

export type StatisticsCardType = {
  icon?: ReactNode;
  label: string;
  value?: string | number | undefined;
  chartType?: 'line' | 'pie' | 'bar';
  chartData?: any;
  chartProps?: any;
  trend?: { value: string; direction: 'up' | 'down' | 'neutral'; description?: string };
  breakdown?: Array<{ label: string; value: number; displayValue?: string; color: string }>;
};

export interface StatisticsSectionProps {
  title: string;
  ctaLabel?: string;
  ctaHref?: string;
  stats: StatisticsCardType[];
  className?: string;
  columns?: number;
}
