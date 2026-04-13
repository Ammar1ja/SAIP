import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import NationalStrategyObjectives from '@/components/organisms/NationalStrategyObjectives';
import NationalPillars from '@/components/organisms/NationalPillars';
import { NationalIpDocument } from '@/components/organisms/NationalIpStrategy/NationalIpDocument';
import { Navigation } from '@/components/molecules/Navigation/Navigation';
import { ROUTES } from '@/lib/routes';
import { getMessages } from 'next-intl/server';
import AboutNipstSection from '@/components/sections/AboutNipstSection';

// import { allArticles } from '@/lib/dummyCms/allArticles';
import { LatestNews } from '@/components/organisms/LatestNews/LatestNews';
import { getNationalIPStrategyPageData } from '@/lib/drupal/national-ip-strategy.integration';
import FeedbackSection from '@/components/organisms/FeedbackSection';

export const revalidate = 300;

export default async function NationalIPStrategyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [messages, strategyData] = await Promise.all([
    getMessages({ locale }),
    getNationalIPStrategyPageData(locale),
  ]);

  const nav = messages.nationalIPStrategy?.nav as any;
  const anchorItems = [
    { label: nav?.aboutNIPST || 'About NIPST', href: '#about-nipst' },
    {
      label:
        strategyData.objectives.heading ||
        nav?.strategyObjectives ||
        'National strategy objectives',
      href: '#objectives',
    },
    { label: nav?.nationalPillars || 'National Pillars', href: '#pillars' },
    { label: nav?.strategyDocument || 'Strategy Document', href: '#document' },
    { label: nav?.latestNews || 'Latest news', href: '#latest-news' },
  ];

  // Override button labels with i18n translations
  const documentMessages = (messages.nationalIPStrategy as any)?.document;
  const localizedButtons = [
    {
      ...strategyData.document.buttons[0],
      label: documentMessages?.showFile || 'Show file',
      ariaLabel: documentMessages?.viewDocument || 'View National IP Strategy document',
    },
    {
      ...strategyData.document.buttons[1],
      label: documentMessages?.downloadFile || 'Download file',
      ariaLabel: documentMessages?.downloadDocument || 'Download National IP Strategy document',
    },
  ];

  const breadcrumbItems = [
    { label: (messages.breadcrumbs as any)?.home || 'Home', href: ROUTES.HOME },
    { label: (messages.breadcrumbs as any)?.saip || 'SAIP' },
    { label: (messages.breadcrumbs as any)?.nationalIPStrategy || 'National IP Strategy' },
  ];
  return (
    <main>
      <HeroStatic
        title={strategyData.hero.heading}
        description={strategyData.hero.subheading}
        backgroundImage={strategyData.hero.backgroundImage}
        breadcrumbs={breadcrumbItems}
      />

      <Navigation items={anchorItems} className="hidden lg:block" />
      <section id="about-nipst">
        <AboutNipstSection
          heading={nav?.aboutNIPST || 'About NIPST'}
          description={strategyData.about.description}
          image={strategyData.about.image}
        />
      </section>

      <section id="objectives">
        <NationalStrategyObjectives
          heading={nav?.strategyObjectives || strategyData.objectives.heading}
          text={strategyData.objectives.text}
          items={strategyData.objectives.items}
        />
      </section>

      <section id="pillars">
        <NationalPillars
          heading={nav?.nationalPillars || strategyData.pillars.heading}
          text={strategyData.pillars.text}
          items={strategyData.pillars.items}
        />
      </section>

      <section id="document">
        <NationalIpDocument
          heading={nav?.strategyDocument || strategyData.document.heading}
          description={strategyData.document.description}
          image={strategyData.document.image}
          buttons={localizedButtons}
        />
      </section>
      <section id="latest-news">
        <LatestNews
          title={nav?.latestNews || 'Latest news'}
          text={strategyData.news.text}
          articles={strategyData.news.articles}
        />
      </section>
      <FeedbackSection />
    </main>
  );
}
