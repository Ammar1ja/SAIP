'use client';

import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import { BreadcrumbItem } from '@/components/molecules/Breadcrumbs/Breadcrumbs.types';
import { ConsultationDetail } from '../consultationData';
import { useTranslations } from 'next-intl';
import { useIsMobile } from '@/hooks/useIsMobile';

interface ConsultationHeroProps {
  consultation: ConsultationDetail;
  breadcrumbs: BreadcrumbItem[];
}

export function ConsultationHero({ consultation, breadcrumbs }: ConsultationHeroProps) {
  const t = useTranslations('publicConsultations');
  const isMobile = useIsMobile();

  const handleShareClick = () => {
    console.log('Share your opinion clicked');
  };

  return (
    <HeroStatic
      title={consultation.title}
      description={consultation.description}
      backgroundColor="bg-primary-50"
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      backHref="/resources/tools-and-research/public-consultations"
      backLabel={t('goBackTo')}
      overlay={false}
      textColor="dark"
      showShareButton={!isMobile}
      onShareClick={handleShareClick}
      titleSize="small"
    />
  );
}
