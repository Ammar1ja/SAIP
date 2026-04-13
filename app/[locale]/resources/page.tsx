import Button from '@/components/atoms/Button';
import Section from '@/components/atoms/Section';
import Card from '@/components/molecules/Card';
import ContentBlock from '@/components/molecules/ContentBlock';
import HeroStatic from '@/components/organisms/Hero/HeroStatic';
import ArrowWide from '@/public/icons/arrows/ArrowWide';
import { getResourcesOverviewPageData } from '@/lib/drupal/services/resources-overview.service';
import { getMessages } from 'next-intl/server';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import { ROUTES } from '@/lib/routes';
import { Navigation } from '@/components/molecules/Navigation/Navigation';
import { Link } from '@/i18n/navigation';

interface SectionData {
  id: string;
  title: string;
  description: string;
  cards: Array<{ title: string; href: string }>;
}

const ResourcesOverview = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const data = await getResourcesOverviewPageData(locale);
  const messages = (await getMessages({ locale })) as Record<string, Record<string, unknown>>;
  const t = messages.resourcesOverview?.items as Record<string, string>;

  const breadcrumbItems = [
    { label: (messages.breadcrumbs?.home as string) || 'Home', href: ROUTES.HOME },
    {
      label: (messages.breadcrumbs?.resources as string) || 'Resources',
      href: ROUTES.RESOURCES.ROOT,
    },
    { label: 'Resources Overview' },
  ];

  // Build sections with data from Drupal CMS
  const sectionsData: SectionData[] = [
    {
      id: 'ip-information',
      title: data.sections.ipInfo.title,
      description: data.sections.ipInfo.description,
      cards:
        data.sections.ipInfo.items.length > 0
          ? data.sections.ipInfo.items
          : [
              { title: t?.faq || 'FAQ', href: '/resources/ip-information/faq' },
              {
                title: t?.guidelines || 'Guidelines',
                href: '/resources/ip-information/guidelines',
              },
              {
                title: t?.ipGlossary || 'IP Glossary',
                href: '/resources/ip-information/ip-glossary',
              },
              { title: t?.reports || 'Reports', href: '/resources/ip-information/reports' },
              {
                title: t?.digitalGuide || 'Digital Guide',
                href: '/resources/ip-information/digital-guide',
              },
            ],
    },
    {
      id: 'tools-and-research',
      title: data.sections.tools.title,
      description: data.sections.tools.description,
      cards:
        data.sections.tools.items.length > 0
          ? data.sections.tools.items
          : [
              {
                title: t?.publications || 'Publications',
                href: '/resources/tools-and-research/publications',
              },
              {
                title: t?.publicConsultations || 'Public Consultations',
                href: '/resources/tools-and-research/public-consultations',
              },
              { title: t?.gazette || 'Gazette', href: '/resources/tools-and-research/gazette' },
              {
                title: t?.ipObservatory || 'IP Observatory',
                href: '/resources/tools-and-research/ip-observatory',
              },
              {
                title: t?.ipSearchEngine || 'IP Search Engine',
                href: '/resources/tools-and-research/ip-search-engine',
              },
              {
                title: t?.openData || 'Open Data',
                href: '/resources/tools-and-research/open-data',
              },
            ],
    },
    {
      id: 'ip-licensing',
      title: data.sections.licensing.title,
      description: data.sections.licensing.description,
      cards:
        data.sections.licensing.items.length > 0
          ? data.sections.licensing.items
          : [
              { title: t?.ipAgents || 'IP Agents', href: '/resources/ip-licensing/ip-agents' },
              {
                title: t?.supervisoryUnit || 'Supervisory Unit',
                href: '/resources/ip-licensing/supervisory-unit',
              },
            ],
    },
    {
      id: 'laws-and-regulations',
      title: data.sections.laws.title,
      description: data.sections.laws.description,
      cards:
        data.sections.laws.items.length > 0
          ? data.sections.laws.items
          : [
              {
                title: t?.internationalTreaties || 'International Treaties',
                href: '/resources/lows-and-regulations/international-treaties',
              },
              {
                title: t?.systemsAndRegulations || 'Systems and Regulations',
                href: '/resources/lows-and-regulations/systems-and-regulations',
              },
              {
                title: t?.litigationPaths || 'Litigation Paths',
                href: '/resources/lows-and-regulations/litigation-paths',
              },
            ],
    },
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

      <Navigation
        items={sectionsData.map((item) => ({
          label: item.title,
          href: `#${item.id}`,
        }))}
        className="hidden lg:block"
      />

      {sectionsData.map((item, index) => (
        <Section
          key={item.id}
          background={index % 2 === 0 ? 'white' : 'neutral'}
          columns="two"
          itemsAlign="start"
          id={item.id}
          className="max-w-screen-xl w-full px-4 md:px-8 lg:px-8 py-2 md:py-4 lg:py-8 lg:grid-cols-[560px_1fr]"
        >
          <div className="flex flex-col justify-center">
            <ContentBlock
              heading={item.title}
              text={item.description}
              className="mb-2 md:mb-4 lg:mb-8 !space-y-0"
              textClassName="mt-6"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 w-full sm:hidden">
            {item.cards.map((card) => (
              <Link
                key={`${card.title}-mobile`}
                href={card.href}
                className="w-full min-h-[60px] border border-[#d2d6db] rounded-sm px-4 py-3 flex items-center justify-center text-center text-sm font-medium text-[#161616]"
              >
                {card.title}
              </Link>
            ))}
          </div>

          <div className="hidden sm:grid sm:grid-cols-2 sm:gap-4 md:gap-6 w-full">
            {item.cards.map((card) => (
              <Card
                key={card.title}
                shadow={true}
                className="w-full min-w-0 h-auto min-h-[120px] sm:min-h-[128px] lg:min-h-[140px] !max-w-none !rounded-lg !p-3 !px-3 !py-3 sm:!p-4 xl:!max-w-[296px] xl:justify-self-start"
              >
                <div className="flex min-h-0 w-full flex-1 flex-col">
                  <span className="text-base leading-6 font-medium tracking-normal text-text-natural sm:text-[17px] sm:leading-[26px] lg:text-[18px] lg:leading-[28px]">
                    {card.title}
                  </span>
                  <div className="mt-auto flex justify-end pt-2 sm:pt-3">
                    <Button
                      intent="secondary"
                      href={card.href}
                      ariaLabel={card.title}
                      className="ml-auto !h-10 !min-h-[40px] !p-0 !px-0 w-full max-w-[80px]"
                    >
                      <ArrowWide
                        direction="right"
                        size="medium"
                        background="natural"
                        shape="square"
                      />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      ))}
      <FeedbackSection />
    </main>
  );
};

export default ResourcesOverview;
