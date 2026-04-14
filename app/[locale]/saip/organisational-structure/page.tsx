import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import { PageProps, GenerateMetadata } from '@/app/[locale]/types';
import Section from '@/components/atoms/Section';
import ChairpersonCard from '@/components/molecules/ChairpersonCard';
import { getMessages } from 'next-intl/server';
import { PeopleGrid } from '@/components/organisms/PeopleGrid';
import AdvisoryBoardCarouselClient from './AdvisoryBoardCarouselClient';
import OrgChartClient from './OrgChartClient';
import { ROUTES } from '@/lib/routes';
import { Navigation } from '@/components/molecules/Navigation/Navigation';
import { getOrganisationalStructurePageData } from '@/lib/drupal/services/organisational-structure.service';
import FeedbackSection from '@/components/organisms/FeedbackSection';

export const revalidate = 300;

// Hardcoded data removed - now using Drupal data

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const messages = await getMessages();
  const { locale } = await params;

  return {
    title: messages.organisationalStructure?.pageTitle || 'Organisational structure',
    description:
      messages.organisationalStructure?.pageDescription ||
      'Our organisational structure defines roles and responsibilities to ensure effective communication, collaboration, and decision-making within our teams.',
    openGraph: {
      title: messages.organisationalStructure?.pageTitle || 'Organisational structure',
      description:
        messages.organisationalStructure?.pageDescription ||
        'Our organisational structure defines roles and responsibilities to ensure effective communication, collaboration, and decision-making within our teams.',
      images: [
        {
          url: '/images/about/hero.jpg',
          width: 1200,
          height: 630,
          alt: 'Organisational structure',
        },
      ],
    },
  };
};

export default async function OrganisationalStructure({ params }: PageProps) {
  const { locale } = await params;
  const [messages, data] = await Promise.all([
    getMessages({ locale }),
    getOrganisationalStructurePageData(locale),
  ]);

  const breadcrumbItems = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    { label: messages.breadcrumbs?.saip || 'SAIP' },
    { label: messages.breadcrumbs?.orgStructure || 'Organisational structure' },
  ];

  const nav = messages.organisationalStructure?.nav as any;
  const anchorItems = [
    { label: nav?.boardOfDirectors || 'Board of Directors', href: '#board' },
    { label: nav?.advisoryBoard || 'Advisory Board', href: '#advisory' },
    { label: nav?.organisationalChart || 'Organisational Chart', href: '#org-chart' },
  ];

  return (
    <>
      <HeroStatic
        title={data.title}
        description={data.description}
        backgroundImage={data.heroImage?.url || '/images/about/hero.jpg'}
        breadcrumbs={breadcrumbItems}
        descriptionWrapperClassName="max-w-[628px]"
        descriptionClassName="text-[20px] leading-[30px] font-normal tracking-normal text-white"
      />
      <Navigation items={anchorItems} className="hidden lg:block" />
      <section id="board">
        <Section fullWidth constrain={false} className="!px-0">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-4 md:px-8 xl:px-0">
            <h2 className="text-4xl md:text-5xl font-medium text-center">{data.boardHeading}</h2>
            <ChairpersonCard
              image={data.chairperson.image}
              name={data.chairperson.name}
              title={data.chairperson.title}
              description={data.chairperson.description}
            />
            <PeopleGrid people={data.boardMembers} />
          </div>
        </Section>
      </section>

      <section id="advisory">
        <AdvisoryBoardCarouselClient
          heading={data.advisoryHeading}
          description={data.advisoryDescription}
          description2={data.advisoryDescription2}
          people={data.advisoryMembers}
        />
      </section>

      <section id="org-chart">
        <OrgChartClient heading={data.orgChartHeading} description={data.orgChartDescription} />
      </section>
      <FeedbackSection />
    </>
  );
}
