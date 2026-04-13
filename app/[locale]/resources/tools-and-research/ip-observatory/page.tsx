import { getMessages } from 'next-intl/server';
import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import { ROUTES } from '@/lib/routes';
import { GenerateMetadata, PageProps } from '@/app/[locale]/types';
import IpObservatoryContent from './IpObservatoryContent';
import { getIPObservatoryPageData } from '@/lib/drupal/services/ip-observatory.service';

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const data = await getIPObservatoryPageData(locale);

  return {
    title: messages.ipObservatory?.pageTitle || data.hero.title,
    description: messages.ipObservatory?.pageDescription || data.hero.description,
    openGraph: {
      title: messages.ipObservatory?.pageTitle || data.hero.title,
      description: messages.ipObservatory?.pageDescription || data.hero.description,
      images: [
        {
          url: data.hero.backgroundImage || '/images/ip-observatory/hero.png',
          width: 1200,
          height: 630,
          alt: 'IP Observatory',
        },
      ],
    },
  };
};

export default async function IpObservatoryPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const data = await getIPObservatoryPageData(locale);

  const breadcrumbItems = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    { label: messages.breadcrumbs?.resources || 'Resources', href: ROUTES.RESOURCES.ROOT },
    {
      label: messages.breadcrumbs?.toolsAndResearch || 'Tools & research',
    },
    { label: messages.breadcrumbs?.ipObservatory || 'IP observatory' },
  ];

  return (
    <main>
      <HeroStatic
        overlay
        title={data.hero.title}
        description={data.hero.description}
        backgroundImage={data.hero.backgroundImage}
        breadcrumbs={breadcrumbItems}
      />

      <IpObservatoryContent data={data} />
    </main>
  );
}
