import Section from '@/components/atoms/Section';
import { ROUTES } from '@/lib/routes';
import HeroStatic from '@/components/organisms/Hero/HeroStatic';
import MovablesPlatformContent from '@/app/[locale]/media-center/movables-platform/MovablesPlatformContent';
import { getMessages } from 'next-intl/server';
import { PageProps } from '@/app/[locale]/types';
import { getMovablesPlatformPageData } from '@/lib/drupal/services/movables-platform.service';
import FeedbackSection from '@/components/organisms/FeedbackSection';

export default async function MovablesPlatformPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const data = await getMovablesPlatformPageData(locale);

  const breadcrumbItems = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    { label: messages.breadcrumbs?.mediaCenter || 'Media Center' },
    { label: messages.breadcrumbs?.movablesPlatform || 'Movables platform' },
  ];

  return (
    <>
      <HeroStatic
        title={data.hero.title}
        description={data.hero.description}
        backgroundImage={data.hero.backgroundImage}
        breadcrumbs={breadcrumbItems}
      />
      <Section background="white">
        <MovablesPlatformContent data={data.tableData} />
      </Section>
      <FeedbackSection />
    </>
  );
}
