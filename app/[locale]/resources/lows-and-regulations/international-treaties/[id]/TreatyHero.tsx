'use client';

import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import { BreadcrumbItem } from '@/components/molecules/Breadcrumbs/Breadcrumbs.types';
import { InternationalTreatyDetail } from '@/lib/drupal/services/international-treaties-detail.service';
import { useTranslations } from 'next-intl';

interface TreatyHeroProps {
  treaty: InternationalTreatyDetail;
  breadcrumbs: BreadcrumbItem[];
}

export function TreatyHero({ treaty, breadcrumbs }: TreatyHeroProps) {
  const t = useTranslations('internationalTreaties');

  const handleShareClick = () => {
    if (typeof window !== 'undefined') {
      navigator.share?.({ title: treaty.title, url: window.location.href });
    }
  };

  return (
    <HeroStatic
      title={treaty.title}
      description={
        treaty.shortName ? `${treaty.shortName} - ${treaty.organization}` : treaty.organization
      }
      backgroundColor="bg-primary-50"
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      backHref="/resources/lows-and-regulations/international-treaties"
      backLabel={t('backToList')}
      overlay={false}
      textColor="dark"
      showShareButton={true}
      onShareClick={handleShareClick}
      titleSize="small"
    />
  );
}
