import { getMessages } from 'next-intl/server';
import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import { ROUTES } from '@/lib/routes';
import { GenerateMetadata, PageProps } from '@/app/[locale]/types';
import { TreatiesCards } from './TreatiesCards';
import { getInternationalTreatiesPageData } from '@/lib/drupal/services/international-treaties.service';
import FeedbackSection from '@/components/organisms/FeedbackSection';

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const { locale } = await params;
  const data = await getInternationalTreatiesPageData(locale);

  return {
    title: data.hero.title,
    description: data.hero.description,
    openGraph: {
      title: data.hero.title,
      description: data.hero.description,
      images: [
        {
          url: data.hero.backgroundImage || '/images/international-treaties/hero.jpg',
          width: 1200,
          height: 630,
          alt: 'International treaties & agreements',
        },
      ],
    },
  };
};

export default async function InternationalTreatiesPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const data = await getInternationalTreatiesPageData(locale);

  const breadcrumbItems = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    { label: messages.breadcrumbs?.resources || 'Resources', href: ROUTES.RESOURCES.ROOT },
    {
      label: messages.breadcrumbs?.lawsAndRegulations || 'Laws & regulations',
    },
    { label: messages.breadcrumbs?.internationalTreaties || 'International treaties & agreements' },
  ];

  return (
    <main>
      <HeroStatic
        title={data.hero.title}
        description={data.hero.description}
        backgroundImage={data.hero.backgroundImage}
        breadcrumbs={breadcrumbItems}
        overlay={true}
        textColor="white"
        titleWeight="medium"
        titleClassName="max-w-[954px] lg:text-[72px] lg:leading-[90px] lg:tracking-[-0.02em] font-medium"
        descriptionClassName="font-body text-[20px] leading-[30px] font-normal tracking-normal text-white [&_p]:text-[20px] [&_p]:leading-[30px] [&_p]:font-normal"
      />

      <TreatiesCards treaties={data.treaties} />
      <FeedbackSection />
    </main>
  );
}
