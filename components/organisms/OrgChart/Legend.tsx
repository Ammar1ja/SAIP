'use client';
import { useLocale } from 'next-intl';

const LEGEND_COLORS = {
  ceo: '#1B8354', // background-primary
  sector: '#14573A', // nav-header
  executiveDirectorate: '#54C08A', // primary-400
  section: '#9DA4AE', // neutral-400
};

const Legend = () => {
  const locale = useLocale();

  const legendItems =
    locale === 'ar'
      ? [
          { label: 'الرئيس التنفيذي', color: LEGEND_COLORS.ceo },
          { label: 'القطاع', color: LEGEND_COLORS.sector },
          { label: 'الإدارة التنفيذية', color: LEGEND_COLORS.executiveDirectorate },
          { label: 'القسم', color: LEGEND_COLORS.section },
        ]
      : [
          { label: 'CEO', color: LEGEND_COLORS.ceo },
          { label: 'Sector', color: LEGEND_COLORS.sector },
          { label: 'Executive Directorate', color: LEGEND_COLORS.executiveDirectorate },
          { label: 'Section', color: LEGEND_COLORS.section },
        ];

  return (
    <div className="flex flex-wrap gap-4 p-2 justify-end">
      {legendItems.map(({ label, color }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: color }} aria-hidden />
          <span className="text-sm text-gray-700">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
