import { GenerateMetadata } from '@/app/[locale]/types';
import { getMessages } from 'next-intl/server';
import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import { ROUTES } from '@/lib/routes';
import SystemsAndRegulationsSection from './SystemsAndRegulationsSection';
import { getSystemsAndRegulationsPageData } from '@/lib/drupal/services/systems-and-regulations.service';
import FeedbackSection from '@/components/organisms/FeedbackSection';

export const revalidate = 300;

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const data = await getSystemsAndRegulationsPageData(locale);

  return {
    title: messages.systemsAndRegulations?.pageTitle || data.hero.title,
    description: messages.systemsAndRegulations?.pageDescription || data.hero.description,
    openGraph: {
      title: messages.systemsAndRegulations?.pageTitle || data.hero.title,
      description: messages.systemsAndRegulations?.pageDescription || data.hero.description,
      images: [
        {
          url: data.hero.backgroundImage || '/images/systems-and-regulations/hero.jpg',
          width: 1200,
          height: 630,
          alt: 'Systems & Regulations - SAIP',
        },
      ],
    },
  };
};

export default async function SystemsAndRegulationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [data, messages] = await Promise.all([
    getSystemsAndRegulationsPageData(locale),
    getMessages({ locale }),
  ]);

  const breadcrumbs = [
    { label: messages.breadcrumbs.home, href: ROUTES.HOME },
    { label: messages.breadcrumbs.resources, href: ROUTES.RESOURCES.ROOT },
    {
      label: messages.breadcrumbs.lawsAndRegulations,
    },
    { label: messages.breadcrumbs.systemsAndRegulations },
  ];

  return (
    <>
      <HeroStatic
        title={data.hero.title}
        description={data.hero.description}
        backgroundImage={data.hero.backgroundImage}
        breadcrumbs={breadcrumbs}
        overlay={true}
        textColor="white"
        titleWeight="medium"
        titleClassName="max-w-[954px] lg:text-[72px] lg:leading-[90px] lg:tracking-[-0.02em] font-medium"
        descriptionWrapperClassName="w-[628px] max-w-full"
        descriptionClassName="font-body text-[20px] leading-[30px] font-normal tracking-normal text-white [&_p]:text-[20px] [&_p]:leading-[30px] [&_p]:font-normal"
      />

      <SystemsAndRegulationsSection data={data} />
      <FeedbackSection />
    </>
  );
}
