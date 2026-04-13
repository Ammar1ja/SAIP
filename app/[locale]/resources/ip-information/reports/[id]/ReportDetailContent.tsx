'use client';

import React from 'react';
import Section from '@/components/atoms/Section';
import { Label } from '@/components/atoms/Label';
import ServiceCard from '@/components/molecules/ServiceCard';
import type { ReportDetailData, ReportItemData } from '@/lib/drupal/services/reports.service';
import { useTranslations } from 'next-intl';

interface ReportDetailContentProps {
  report: ReportDetailData;
}

function formatContent(content?: string): string {
  if (!content) return '';
  if (content.includes('<p>') || content.includes('<div>')) {
    return content;
  }

  return content
    .split(/\n\s*\n/)
    .filter((para) => para.trim())
    .map((para) => `<p>${para.trim().replace(/\n/g, '<br>')}</p>`)
    .join('');
}

const renderRelated = (item: ReportItemData, index: number) => {
  return <ServiceCard key={`${item.id}-${index}`} {...item} />;
};

export function ReportDetailContent({ report }: ReportDetailContentProps) {
  const t = useTranslations('reports.detail');

  const overviewHtml = formatContent(report.overview);
  const methodologyHtml = formatContent(report.methodology);
  const findingsHtml = formatContent(report.keyFindings);

  return (
    <>
      <Section padding="large" className="space-y-10">
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-medium text-neutral-900">{report.title}</h2>
          <div className="flex flex-wrap gap-2 text-sm text-neutral-500">
            {report.publicationDate && (
              <div>
                {t('publicationDate')}: {report.publicationDate}
              </div>
            )}
            {report.reportType && (
              <div>
                {t('reportType')}: {report.reportType}
              </div>
            )}
          </div>
          {report.labels?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {report.labels.map((label, idx) => (
                <Label key={`${label}-${idx}`} className="text-xs px-2 py-0.5">
                  {label}
                </Label>
              ))}
            </div>
          )}
        </div>

        {overviewHtml && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-neutral-900">{t('overview')}</h3>
            <div
              className="prose prose-lg max-w-none text-neutral-700 [&>p]:mb-4 [&>p]:mt-0 rtl:text-right"
              dangerouslySetInnerHTML={{ __html: overviewHtml }}
            />
          </div>
        )}

        {methodologyHtml && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-neutral-900">{t('methodology')}</h3>
            <div
              className="prose prose-lg max-w-none text-neutral-700 [&>p]:mb-4 [&>p]:mt-0 rtl:text-right"
              dangerouslySetInnerHTML={{ __html: methodologyHtml }}
            />
          </div>
        )}

        {findingsHtml && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-neutral-900">{t('keyFindings')}</h3>
            <div
              className="prose prose-lg max-w-none text-neutral-700 [&>p]:mb-4 [&>p]:mt-0 rtl:text-right"
              dangerouslySetInnerHTML={{ __html: findingsHtml }}
            />
          </div>
        )}
      </Section>

      {report.relatedReports?.length > 0 && (
        <Section padding="large">
          <div className="space-y-6">
            <h3 className="text-2xl font-medium text-neutral-900">{t('relatedReports')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {report.relatedReports.map(renderRelated)}
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
