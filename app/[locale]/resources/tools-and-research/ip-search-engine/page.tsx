import { getMessages } from 'next-intl/server';
import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import { ROUTES } from '@/lib/routes';
import { Navigation } from '@/components/molecules/Navigation/Navigation';
import { GenerateMetadata, PageProps } from '@/app/[locale]/types';
import { IpSearchEngineSection } from '@/components/sections/IpSearchEngineSection/IpSearchEngineSection';
import { IpSearchAudienceSection } from '@/components/organisms/IpSearchAudience/IpSearchAudience';
import { getIPSearchEnginePageData } from '@/lib/drupal/services/ip-search-engine.service';
import FeedbackSection from '@/components/organisms/FeedbackSection';

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const data = await getIPSearchEnginePageData(locale);

  return {
    title: (messages.ipSearchEngine as Record<string, string>)?.pageTitle || data.hero.title,
    description:
      (messages.ipSearchEngine as Record<string, string>)?.pageDescription || data.hero.description,
    openGraph: {
      title: (messages.ipSearchEngine as Record<string, string>)?.pageTitle || data.hero.title,
      description:
        (messages.ipSearchEngine as Record<string, string>)?.pageDescription ||
        data.hero.description,
      images: [
        {
          url: data.hero.backgroundImage || '/images/ip-search-engine/hero.png',
          width: 1200,
          height: 630,
          alt: 'IP Search Engine',
        },
      ],
    },
  };
};

export default async function IpSearchEnginePage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const data = await getIPSearchEnginePageData(locale);

  const t = (key: string) => {
    const keys = key.split('.');
    let value: unknown = messages;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return (value as string) || key;
  };

  const breadcrumbItems = [
    { label: t('breadcrumbs.home'), href: ROUTES.HOME },
    { label: t('breadcrumbs.resources'), href: ROUTES.RESOURCES.ROOT },
    {
      label: t('breadcrumbs.toolsAndResearch'),
    },
    { label: t('breadcrumbs.ipSearchEngine') },
  ];

  const anchorItems = [
    {
      label: t('ipSearchEngine.nav.search'),
      href: '#ip-search',
    },
    {
      label: data.audienceSection.heading || t('ipSearchEngine.nav.whoCanUse'),
      href: '#who-can-use',
    },
  ];

  return (
    <main className="min-w-0 overflow-x-clip">
      <HeroStatic
        overlay
        title={data.hero.title}
        description={data.hero.description}
        backgroundImage={data.hero.backgroundImage}
        breadcrumbs={breadcrumbItems}
        className="!h-[520px] !max-h-[520px]"
      />

      <Navigation items={anchorItems} className="hidden lg:block" />

      <IpSearchEngineSection
        title={data.searchSection.title}
        buttonLabel={data.searchSection.buttonLabel}
        link={data.searchSection.toolUrl}
        imageSrc={data.searchSection.toolImage}
        imageAlt="Person using IP search engine"
      />

      <div id="who-can-use">
        <IpSearchAudienceSection
          heading={data.audienceSection.heading}
          items={data.audienceSection.items}
        />
      </div>
      <FeedbackSection />
    </main>
  );
}
