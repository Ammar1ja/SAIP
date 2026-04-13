import { getMessages } from 'next-intl/server';
import { ROUTES } from '@/lib/routes';
import { GenerateMetadata } from '@/app/[locale]/types';
import { getRegulationDetail } from '@/lib/drupal/services/systems-and-regulations-detail.service';
import { getSystemsAndRegulationsPageData } from '@/lib/drupal/services/systems-and-regulations.service';
import { RegulationDetailContent } from './RegulationDetailContent';
import { RegulationHero } from './RegulationHero';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import { notFound } from 'next/navigation';

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const { id, locale } = (await params) as { locale: string; id: string };
  const regulation = await getRegulationDetail(id, locale);

  if (!regulation) {
    return {
      title: 'Regulation Not Found',
    };
  }

  return {
    title: regulation.title,
    description: regulation.description,
    openGraph: {
      title: regulation.title,
      description: regulation.description,
      images: [
        {
          url: '/images/laws/regulations.jpg',
          width: 1200,
          height: 630,
          alt: regulation.title,
        },
      ],
    },
  };
};

interface PageParams {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function RegulationDetailPage({ params }: PageParams) {
  const messages = await getMessages();
  const { locale, id } = await params;

  const regulation = await getRegulationDetail(id, locale);

  if (!regulation) {
    notFound();
  }

  // Get related regulations (other systems & regulations)
  const systemsData = await getSystemsAndRegulationsPageData(locale);
  const relatedRegulations = systemsData.regulations
    .filter((reg) => reg.publicationNumber !== regulation.publicationNumber)
    .slice(0, 4)
    .map((reg) => {
      const slug = reg.publicationNumber || reg.title.toLowerCase().replace(/\s+/g, '-');
      return {
        title: reg.title,
        href: `/resources/lows-and-regulations/systems-and-regulations/${slug}`,
      };
    });

  const breadcrumbItems = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    { label: messages.breadcrumbs?.resources || 'Resources', href: ROUTES.RESOURCES.ROOT },
    {
      label: messages.breadcrumbs?.lawsAndRegulations || 'Laws & regulations',
    },
    {
      label: messages.breadcrumbs?.systemsAndRegulations || 'Systems and Regulations',
      href: '/resources/lows-and-regulations/systems-and-regulations',
    },
    { label: regulation.title },
  ];

  return (
    <main>
      <RegulationHero regulation={regulation} breadcrumbs={breadcrumbItems} />
      <RegulationDetailContent regulation={regulation} relatedRegulations={relatedRegulations} />
      <FeedbackSection />
    </main>
  );
}
