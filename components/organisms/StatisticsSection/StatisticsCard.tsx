'use client';
import React, { useId } from 'react';
import { StatisticsCardType } from './StatisticsSection.types';
import {
  LineChart,
  ComposedChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Bar,
  BarChart,
  YAxis,
  Area,
} from 'recharts';
import { ArrowDown, ArrowUp, Minus, Sprout, Microchip } from 'lucide-react';
import { PatentServicesIcon } from '@/components/icons/services/PatentServicesIcon';
import { DesignServicesIcon } from '@/components/icons/services/DesignServicesIcon';
import { useLocale, useTranslations } from 'next-intl';
import { useIsMobile } from '@/hooks/useIsMobile';

const COLORS = ['#1B8354', '#14573A'];

const translateTimePeriod = (text: string, locale: string): string => {
  if (locale !== 'ar') return text;

  let translated = text;

  translated = translated.replace(/(-?\d+)\s*(month|months)/gi, (match, num, unit) => {
    const number = parseInt(num, 10);
    const absNumber = Math.abs(number);
    const isNegative = number < 0;
    const sign = isNegative ? '-' : '';
    return `${sign}${absNumber} شهر`;
  });

  translated = translated.replace(/(month|months)\s*(-?\d+)/gi, (match, unit, num) => {
    const number = parseInt(num, 10);
    const absNumber = Math.abs(number);
    const isNegative = number < 0;
    const sign = isNegative ? '-' : '';
    return `${sign}${absNumber} شهر`;
  });

  const dayPattern = /(-?\d+)\s*(day|days)/gi;
  translated = translated.replace(dayPattern, (match, num, unit) => {
    const number = parseInt(num, 10);
    const absNumber = Math.abs(number);
    const isNegative = number < 0;
    const sign = isNegative ? '-' : '';

    if (absNumber === 1) {
      return `${sign}${absNumber} يوم`;
    } else if (absNumber === 2) {
      return `${sign}${absNumber} يوم`;
    } else {
      return `${sign}${absNumber} يوم`;
    }
  });

  const weekPattern = /(-?\d+)\s*(week|weeks)/gi;
  translated = translated.replace(weekPattern, (match, num, unit) => {
    const number = parseInt(num, 10);
    const absNumber = Math.abs(number);
    const isNegative = number < 0;
    const sign = isNegative ? '-' : '';

    if (absNumber === 1) {
      return `${sign}${absNumber} أسبوع`;
    } else if (absNumber === 2) {
      return `${sign}${absNumber} أسبوع`;
    } else {
      return `${sign}${absNumber} أسبوع`;
    }
  });

  const yearPattern = /(-?\d+)\s*(year|years)/gi;
  translated = translated.replace(yearPattern, (match, num, unit) => {
    const number = parseInt(num, 10);
    const absNumber = Math.abs(number);
    const isNegative = number < 0;
    const sign = isNegative ? '-' : '';

    if (absNumber === 1) {
      return `${sign}${absNumber} سنة`;
    } else if (absNumber === 2) {
      return `${sign}${absNumber} سنة`;
    } else {
      return `${sign}${absNumber} سنة`;
    }
  });

  translated = translated.replace(/\s+ago/gi, ' مضى');

  return translated;
};

const StatisticsCard: React.FC<StatisticsCardType> = ({
  icon,
  label,
  value,
  chartType,
  chartData,
  chartProps,
  trend,
  breakdown,
}) => {
  const locale = useLocale();
  const tLabels = useTranslations('common.labels');
  const isMobile = useIsMobile();
  const gradientId = useId();
  const gradientIdSafe = `stats-gradient-${gradientId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const translatedDescription = trend?.description
    ? translateTimePeriod(trend.description, locale)
    : trend?.description;

  const translatedTrendValue = trend?.value
    ? translateTimePeriod(trend.value, locale)
    : trend?.value;

  const resolveIcon = () => {
    if (icon) {
      if (React.isValidElement(icon)) return icon;
      if (typeof icon === 'string') {
        const key = icon.trim().toLowerCase();
        if (key === 'patent' || key === 'patents') {
          return <PatentServicesIcon className="h-4 w-4" />;
        }
        if (key === 'plant' || key === 'plant-varieties' || key === 'plant varieties') {
          return <Sprout className="h-4 w-4" />;
        }
        if (
          key === 'integrated_circuit' ||
          key === 'integrated-circuit' ||
          key === 'integrated circuit'
        ) {
          return <Microchip className="h-4 w-4" />;
        }
        if (key === 'design' || key === 'designs') {
          return <DesignServicesIcon className="h-4 w-4" />;
        }
      }
    }

    return <PatentServicesIcon className="h-4 w-4" />;
  };

  const iconNode = resolveIcon();

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0];
    const chartDate = data?.payload?.date;
    const valueLabel = tLabels('value');

    return (
      <div className="bg-white border border-gray-200 rounded shadow-lg px-3 py-2">
        {chartDate && <p className="text-xs text-gray-600">{chartDate}</p>}
        <p className="text-sm font-semibold text-green-700">
          {valueLabel}: {data.value}
        </p>
      </div>
    );
  };

  {
    /* Mobile version */
  }
  if (isMobile && chartType === 'line' && value !== undefined) {
    return (
      <div className="flex flex-col h-[240px] rounded-2xl border border-neutral-200 overflow-hidden bg-white">
        <div className="flex flex-[5] items-center justify-center">
          <div className="text-[60px] leading-[72px] font-medium tracking-[-0.03em] text-success-600">
            {value}
          </div>
        </div>
        <div className="flex flex-[3] items-center justify-center bg-neutral-50 rounded-t-3xl px-6 py-4">
          <span className="text-center text-text-lg font-medium text-text-default">{label}</span>
        </div>
      </div>
    );
  }

  if (isMobile && chartType === 'pie' && breakdown) {
    return (
      <div className="flex flex-col h-[440px] rounded-2xl border border-neutral-200 overflow-hidden bg-white">
        <div className="flex flex-col flex-[5]">
          <div className="flex items-center justify-center pt-6 pb-4">
            <div className="w-[200px] h-[200px] bg-neutral-50 rounded-full border border-neutral-200 flex items-center justify-center">
              <ResponsiveContainer className="w-full h-full">
                <PieChart>
                  <Pie
                    data={breakdown}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={100}
                    paddingAngle={1}
                    startAngle={90}
                    endAngle={450}
                    isAnimationActive={false}
                  >
                    {breakdown.map((entry, idx) => {
                      const color = entry.color || COLORS[idx % COLORS.length];
                      return (
                        <Cell key={`cell-${idx}`} fill={color} stroke="#ffffff" strokeWidth={2} />
                      );
                    })}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex flex-col bg-white flex-1">
            {breakdown.map((item, idx) => (
              <React.Fragment key={item.label}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <span
                    className="inline-block w-5 h-5 rounded bg-primary-700"
                    style={{ background: item.color || COLORS[idx % COLORS.length] }}
                  />
                  <span className="text-neutral-700 text-sm flex-1">{item.label}</span>
                  <span className="text-neutral-700 text-sm text-right">
                    {item.displayValue ?? item.value}
                  </span>
                </div>
                {idx < breakdown.length - 1 && <div className="mx-4 h-px bg-neutral-300" />}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="flex flex-[3] items-center justify-center bg-neutral-50 rounded-t-3xl px-6 py-4">
          <span className="text-center text-text-lg font-medium text-text-default">{label}</span>
        </div>
      </div>
    );
  }

  {
    /* Desktop version */
  }
  return (
    <div className="box-border bg-white rounded-2xl shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.1),0px_2px_4px_-2px_rgba(16,24,40,0.06)] flex flex-col h-full w-full min-h-[248px] !p-6 min-w-0 gap-6 overflow-hidden">
      <div className="flex w-full min-w-0 items-center gap-2">
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3FCF6] text-success-600">
          {iconNode}
        </div>
        <span className="min-w-0 text-sm font-medium text-text-primary-paragraph">{label}</span>
      </div>
      {(chartType !== 'pie' || trend) && (
        <div
          className={
            chartType !== 'pie' &&
            value !== undefined &&
            value !== null &&
            value !== '' &&
            value !== 0
              ? 'flex w-full min-w-0 flex-wrap items-start justify-between gap-x-4 gap-y-2'
              : 'flex w-full min-w-0 flex-col items-end gap-3'
          }
        >
          {chartType !== 'pie' &&
            value !== undefined &&
            value !== null &&
            value !== '' &&
            value !== 0 && (
              <div className="min-w-0 max-w-full text-[36px] font-bold leading-[44px] tracking-[-0.02em] text-[#1F2A37]">
                {value}
              </div>
            )}
          {trend && (
            <div className="flex w-full min-w-0 max-w-full flex-wrap items-baseline justify-end gap-x-2 gap-y-1 pt-0.5 sm:w-auto sm:max-w-none sm:shrink-0 sm:flex-nowrap">
              <div className="flex items-baseline gap-1 text-success-600">
                {trend.direction === 'up' && (
                  <ArrowUp className="h-4 w-4 shrink-0 translate-y-[2px]" aria-hidden />
                )}
                {trend.direction === 'down' && (
                  <ArrowDown className="h-4 w-4 shrink-0 translate-y-[2px]" aria-hidden />
                )}
                {trend.direction === 'neutral' && (
                  <Minus className="h-4 w-4 shrink-0 translate-y-[2px]" aria-hidden />
                )}
                <span className="text-[14px] leading-[20px] font-medium whitespace-nowrap">
                  {translatedTrendValue}
                </span>
              </div>
              {translatedDescription && (
                <span className="text-[14px] leading-[20px] text-[#6C737F] whitespace-nowrap">
                  {translatedDescription}
                </span>
              )}
            </div>
          )}
        </div>
      )}
      {chartType === 'line' && chartData && (
        <div className="relative z-0 mt-auto flex h-16 w-full items-end overflow-visible pb-1">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              {...chartProps}
              margin={{
                top: 10,
                left: 0,
                bottom: 4,
                ...(chartProps?.margin && typeof chartProps.margin === 'object'
                  ? chartProps.margin
                  : {}),
                right: 0,
              }}
            >
              <defs>
                <linearGradient id={gradientIdSafe} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1B8354" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#1B8354" stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis domain={['auto', 'auto']} hide />
              <Area
                type="linear"
                dataKey="value"
                stroke="none"
                fill={`url(#${gradientIdSafe})`}
                isAnimationActive={false}
              />
              <Line
                type="linear"
                dataKey="value"
                stroke="#1B8354"
                strokeWidth={2}
                dot={false}
                activeDot={(props: any) => {
                  const { cx, cy } = props || {};
                  if (cx === undefined || cy === undefined) return <g />;
                  return (
                    <g>
                      <circle cx={cx} cy={cy} r={8} fill="#FFFFFF" opacity={0.2} />
                      <circle
                        cx={cx}
                        cy={cy}
                        r={5}
                        fill="#FFFFFF"
                        stroke="#1B8354"
                        strokeWidth={2}
                      />
                    </g>
                  );
                }}
              />
              <Tooltip content={CustomTooltip} cursor={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
      {chartType === 'pie' && breakdown && (
        <div className="flex flex-col items-center gap-4 xl:flex-row xl:items-center xl:gap-6">
          <div className="h-40 w-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdown}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={1}
                  startAngle={90}
                  endAngle={450}
                  isAnimationActive={false}
                >
                  {breakdown.map((entry, idx) => {
                    const color = entry.color || COLORS[idx % COLORS.length];
                    return (
                      <Cell key={`cell-${idx}`} fill={color} stroke="#ffffff" strokeWidth={2} />
                    );
                  })}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-4 w-full xl:flex-1">
            {breakdown.map((item, idx) => (
              <React.Fragment key={item.label}>
                <div className="flex items-center gap-3">
                  <span
                    className="inline-block w-5 h-5 rounded bg-primary-700"
                    style={{ background: item.color || COLORS[idx % COLORS.length] }}
                  />
                  <span className="text-[14px] leading-[20px] text-[#384250] flex-1">
                    {item.label}
                  </span>
                  <span className="text-[14px] leading-[20px] text-[#384250] text-right">
                    {item.displayValue ?? item.value}
                  </span>
                </div>
                {idx < breakdown.length - 1 && <div className="h-px w-full bg-neutral-300" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
      {chartType === 'bar' && chartData && (
        <div className="h-48 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} {...chartProps}>
              <Bar dataKey="value" fill="#388A5A" />
              <Tooltip content={CustomTooltip} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default StatisticsCard;
