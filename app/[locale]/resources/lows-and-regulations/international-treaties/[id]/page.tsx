import { getMessages } from 'next-intl/server';
import { ROUTES } from '@/lib/routes';
import { GenerateMetadata } from '@/app/[locale]/types';
import { getInternationalTreatyDetail } from '@/lib/drupal/services/international-treaties-detail.service';
import { TreatyDetailContent } from './TreatyDetailContent';
import { TreatyHero } from './TreatyHero';
import { notFound } from 'next/navigation';

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const { id, locale } = (await params) as { locale: string; id: string };
  const treaty = await getInternationalTreatyDetail(id, locale);

  if (!treaty) {
    return {
      title: 'Treaty Not Found',
    };
  }

  return {
    title: treaty.title,
    description: treaty.description,
    openGraph: {
      title: treaty.title,
      description: treaty.description,
      images: [
        {
          url: treaty.image || '/images/international-treaties/hero.jpg',
          width: 1200,
          height: 630,
          alt: treaty.title,
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

export default async function TreatyDetailPage({ params }: PageParams) {
  const messages = await getMessages();
  const { locale, id } = await params;

  const treaty = await getInternationalTreatyDetail(id, locale);

  if (!treaty) {
    notFound();
  }

  const breadcrumbItems = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    { label: messages.breadcrumbs?.resources || 'Resources', href: ROUTES.RESOURCES.ROOT },
    {
      label: messages.breadcrumbs?.lawsAndRegulations || 'Laws & regulations',
    },
    {
      label: messages.breadcrumbs?.internationalTreaties || 'International treaties & agreements',
      href: '/resources/lows-and-regulations/international-treaties',
    },
    { label: treaty.title },
  ];

  return (
    <main>
      <TreatyHero treaty={treaty} breadcrumbs={breadcrumbItems} />
      <TreatyDetailContent treaty={treaty} />
    </main>
  );
}
