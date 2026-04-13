'use client';

import Link from 'next/link';
import ArrowWide from '@/public/icons/arrows/ArrowWide';
import { RegulationDetail } from '@/lib/drupal/services/systems-and-regulations-detail.service';
import { useTranslations } from 'next-intl';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface RegulationHeroProps {
  regulation: RegulationDetail;
  breadcrumbs: BreadcrumbItem[];
}

export function RegulationHero({ regulation, breadcrumbs }: RegulationHeroProps) {
  const t = useTranslations('common');
  const backHref = '/resources/lows-and-regulations/systems-and-regulations';
  const backLabel = t('goBack') || 'Go back';

  return (
    <div className="bg-white">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6">
        <div className="flex flex-col">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbs} className="mb-4" variant="subpage" />

          {/* Go back button */}
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 cursor-pointer mb-14 px-4 border rounded-sm text-sm hover:bg-neutral-100 transition w-fit"
          >
            <ArrowWide direction="left" size="small" shape="square" background="transparent" />
            {backLabel} to Systems & regulations
          </Link>

          {/* Title and Publication Date */}
          <div className="flex flex-col mt-[216px] mb-[112px]">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
              {regulation.title}
            </h1>

            {/* Publication Date */}
            {regulation.durationDate && (
              <p className="text-gray-600 text-sm">Publication date: {regulation.durationDate}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
