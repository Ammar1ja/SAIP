import { GenerateMetadata } from '@/app/[locale]/types';
import { getMessages } from 'next-intl/server';
import { Navigation } from '../../../../../components/molecules/Navigation/Navigation';
import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import { OpenDataContent } from './OpenDataContent';
import { getOpenDataPageData } from '@/lib/drupal/services/open-data.service';
import { ROUTES } from '@/lib/routes';

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const data = await getOpenDataPageData(locale);

  return {
    title: messages.openData?.pageTitle || data.hero.title,
    description: messages.openData?.pageDescription || data.hero.description,
    openGraph: {
      title: messages.openData?.pageTitle || data.hero.title,
      description: messages.openData?.pageDescription || data.hero.description,
      images: [
        {
          url: data.hero.backgroundImage || '/images/open-data/hero.jpg',
          width: 1200,
          height: 630,
          alt: 'Open Data - SAIP',
        },
      ],
    },
  };
};

export default async function OpenDataPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await getOpenDataPageData(locale);
  const messages = (await getMessages({ locale })) as any;

  const breadcrumbs = [
    { label: messages.breadcrumbs.home, href: ROUTES.HOME },
    { label: messages.breadcrumbs.resources, href: ROUTES.RESOURCES.ROOT },
    {
      label: messages.breadcrumbs.toolsAndResearch,
    },
    { label: messages.breadcrumbs.openData },
  ];

  const navigationItems = [
    { label: messages.openData?.nav?.policy || 'SAIP Open Data Policy', href: '#saip-policy' },
    {
      label: messages.openData?.nav?.platform || 'National Open Data Platform',
      href: '#national-platform',
    },
    { label: messages.openData?.nav?.request || 'Request for Open Data', href: '#request-data' },
  ];

  return (
    <>
      <HeroStatic
        title={data.hero.title}
        description={data.hero.description}
        backgroundImage={data.hero.backgroundImage}
        breadcrumbs={breadcrumbs}
        overlay={true}
        textColor="white"
        className="!h-[520px] !max-h-[520px]"
      />

      <Navigation
        items={navigationItems}
        className="hidden lg:block"
        forceCompact
        showActiveMarker={false}
      />

      <OpenDataContent data={data} />
    </>
  );
}
