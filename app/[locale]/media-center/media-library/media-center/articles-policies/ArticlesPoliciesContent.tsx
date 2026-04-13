'use client';

import { ArticlesPoliciesData } from './articles-policies.data';
import { ROUTES } from '@/lib/routes';
import LayoutWrapper from '@/components/atoms/LayoutWrapper';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import { Button } from '@/components/atoms/Button';
import { ChevronIcon } from '@/components/icons';
import { useDirection } from '@/context/DirectionContext';
import { useTranslations } from 'next-intl';

interface ArticlesPoliciesContentProps {
  data: ArticlesPoliciesData;
}

export function ArticlesPoliciesContent({ data }: ArticlesPoliciesContentProps) {
  const t = useTranslations('articlesPolicies');
  const tBreadcrumbs = useTranslations('breadcrumbs');
  const dir = useDirection();
  const isRtl = dir === 'rtl';

  const breadcrumbItems = [
    { label: tBreadcrumbs('home'), href: ROUTES.HOME },
    { label: tBreadcrumbs('mediaCenter'), href: ROUTES.MEDIA_CENTER.ROOT },
    {
      label: tBreadcrumbs('mediaLibrary'),
      href: ROUTES.MEDIA_CENTER.MEDIA_LIBRARY.MEDIA_CENTER.ROOT,
    },
    { label: t('title') },
  ];

  const publishingGuidelines = (t.raw('publishingGuidelines') as string[]) || [];
  const submissionInstructions = (t.raw('submissionInstructions') as string[]) || [];
  const contactEmail = data?.content?.contactEmail || 'rs.policies@saip.gov.sa';

  return (
    <div className="min-h-screen bg-white" dir={isRtl ? 'rtl' : 'ltr'}>
      <section className="bg-primary-50">
        <LayoutWrapper className="py-10">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-6">
              <Breadcrumbs items={breadcrumbItems} variant="subpage" />
              <h1 className="text-3xl md:text-4xl font-medium text-neutral-900">{t('title')}</h1>
            </div>

            <Button
              intent="neutral"
              outline
              className="flex h-8 items-center gap-2 px-3"
              href={ROUTES.MEDIA_CENTER.MEDIA_LIBRARY.MEDIA_CENTER.ROOT}
              ariaLabel={t('backLabel')}
            >
              <ChevronIcon className={`h-4 w-4 ${isRtl ? 'rotate-270' : 'rotate-90'}`} />
              <span>{t('backLabel')}</span>
            </Button>
          </div>
        </LayoutWrapper>
      </section>

      <section className="bg-white">
        <LayoutWrapper className="py-16">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-medium text-neutral-900">{t('blogTitle')}</h2>
              <p className="text-base text-neutral-700 leading-7">{t('blogDescription')}</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-medium text-neutral-900">{t('publishingTitle')}</h3>
              <ol className="list-decimal ms-6 space-y-3 text-base text-neutral-700 leading-7">
                {publishingGuidelines.map((guideline, index) => (
                  <li key={`${guideline}-${index}`}>{guideline}</li>
                ))}
              </ol>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-medium text-neutral-900">{t('submissionTitle')}</h3>
              <ol className="list-decimal ms-6 space-y-3 text-base text-neutral-700 leading-7">
                {submissionInstructions.map((instruction, index) => (
                  <li key={`${instruction}-${index}`}>
                    {instruction.includes(contactEmail) ? (
                      <>
                        {instruction.split(contactEmail)[0]}
                        <span className="font-medium text-primary-600">{contactEmail}</span>
                        {instruction.split(contactEmail)[1]}
                      </>
                    ) : (
                      instruction
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </LayoutWrapper>
      </section>
    </div>
  );
}
