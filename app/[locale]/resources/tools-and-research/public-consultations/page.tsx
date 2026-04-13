import { GenerateMetadata } from '@/app/[locale]/types';
import { getMessages } from 'next-intl/server';
import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import { PublicConsultationsContent } from './PublicConsultationsContent';
import { getPublicConsultationsPageData } from '@/lib/drupal/services';
import { ROUTES } from '@/lib/routes';
import FeedbackSection from '@/components/organisms/FeedbackSection';

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const { locale } = await params;
  const data = await getPublicConsultationsPageData(locale);

  return {
    title: data.heroHeading,
    description: data.heroSubheading,
    openGraph: {
      title: data.heroHeading,
      description: data.heroSubheading,
      images: [
        {
          url: '/images/public-consultations/hero.jpg',
          width: 1200,
          height: 630,
          alt: 'Public Consultations - SAIP',
        },
      ],
    },
  };
};

export default async function PublicConsultationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getPublicConsultationsPageData(locale);
  const messages = (await getMessages({ locale })) as any;

  const breadcrumbs = [
    { label: messages.breadcrumbs.home, href: ROUTES.HOME },
    { label: messages.breadcrumbs.resources, href: ROUTES.RESOURCES.ROOT },
    {
      label: messages.breadcrumbs.toolsAndResearch,
    },
    { label: messages.breadcrumbs.publicConsultations },
  ];

  return (
    <>
      <HeroStatic
        title={data.heroHeading}
        description={data.heroSubheading}
        backgroundImage="/images/public-consultations/hero.jpg"
        breadcrumbs={breadcrumbs}
        overlay={true}
        textColor="white"
      />

      <PublicConsultationsContent
        sectionHeading={data.sectionHeading}
        consultations={data.consultations}
      />
      <FeedbackSection />
    </>
  );
}
