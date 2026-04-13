import { GenerateMetadata } from '@/app/[locale]/types';
import { getMessages, getTranslations } from 'next-intl/server';
import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import { ROUTES } from '@/lib/routes';
import { SupervisoryUnitContent } from './SupervisoryUnitContent';
import { getSupervisoryUnitPageData } from '@/lib/drupal/services/supervisory-unit.service';
import { Navigation } from '@/components/molecules/Navigation/Navigation';

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const { locale } = await params;
  const data = await getSupervisoryUnitPageData(locale);

  return {
    title: data.hero.title,
    description: data.hero.description,
    openGraph: {
      title: data.hero.title,
      description: data.hero.description,
      images: [
        {
          url: data.hero.backgroundImage || '/images/supervisory-unit/hero.png',
          width: 1200,
          height: 630,
          alt: 'Supervisory unit for non-profit sector organizations - SAIP',
        },
      ],
    },
  };
};

export default async function SupervisoryUnitPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getSupervisoryUnitPageData(locale);
  const messages = (await getMessages({ locale })) as any;
  const tAnchors = await getTranslations({ locale, namespace: 'supervisoryUnit.anchors' });

  const breadcrumbs = [
    { label: messages.breadcrumbs.home, href: ROUTES.HOME },
    { label: messages.breadcrumbs.resources, href: ROUTES.RESOURCES.ROOT },
    { label: messages.breadcrumbs.ipLicensing },
    { label: messages.breadcrumbs.supervisoryUnit },
  ];

  const anchorItems = [
    { label: tAnchors('overview'), href: '#overview' },
    { label: tAnchors('targetAreas'), href: '#target-areas' },
    { label: tAnchors('objectives'), href: '#objectives' },
    { label: tAnchors('civilAssociations'), href: '#civil-associations' },
    { label: tAnchors('contact'), href: '#contact' },
  ];

  return (
    <>
      <HeroStatic
        title={data.hero.title}
        description={data.hero.description}
        backgroundImage={data.hero.backgroundImage}
        breadcrumbs={breadcrumbs}
        hideBreadcrumbsOnMobile
        overlay={true}
        textColor="white"
      />

      <Navigation items={anchorItems} />

      <SupervisoryUnitContent data={data} />
    </>
  );
}
