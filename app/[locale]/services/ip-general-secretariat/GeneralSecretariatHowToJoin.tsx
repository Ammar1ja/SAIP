'use client';

import { Navigation } from '@/components/molecules/Navigation/Navigation';
import HeroStatic from '@/components/organisms/Hero/HeroStatic';
import { GeneralSecretariatCommitteeSection } from '@/components/sections/GeneralSecretariatCommitteeSection';
import { CommitteeDetailData } from '@/lib/drupal/services/ip-general-secretariat.service';
import { useTranslations } from 'next-intl';

interface GeneralSecretariatHowToJoinProps {
  committeesList: CommitteeDetailData[];
  heroImage?: string;
}

export const GeneralSecretariatHowToJoin = ({
  committeesList,
  heroImage,
}: GeneralSecretariatHowToJoinProps) => {
  const t = useTranslations('ipGeneralSecretariat.howToJoin');

  const howToJoinAnchorItems = committeesList.map((committee) => ({
    label: committee.title,
    href: `#${committee.id}`,
  }));

  return (
    <>
      <HeroStatic
        title={t('title')}
        description={t('description')}
        backgroundImage={heroImage || '/images/designs/hero.jpg'}
      />

      <Navigation items={howToJoinAnchorItems} className="hidden lg:block" />

      {committeesList.map((committee) => (
        <section key={committee.id} id={committee.id}>
          <GeneralSecretariatCommitteeSection {...committee} />
        </section>
      ))}
    </>
  );
};
