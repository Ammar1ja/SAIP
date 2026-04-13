import { GenerateMetadata } from '@/app/[locale]/types';
import { getMessages } from 'next-intl/server';
import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import { ROUTES } from '@/lib/routes';
import LitigationPathsSection from './LitigationPathsSection';
import { getLitigationPathsPageData } from '@/lib/drupal/services/litigation-paths.service';
import FeedbackSection from '@/components/organisms/FeedbackSection';

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const { locale } = await params;
  const data = await getLitigationPathsPageData(locale);

  return {
    title: data.hero.title,
    description: data.hero.description,
    openGraph: {
      title: data.hero.title,
      description: data.hero.description,
      images: [
        {
          url: data.hero.backgroundImage || '/images/litigation-paths/hero.png',
          width: 1200,
          height: 630,
          alt: 'Litigation Paths - SAIP',
        },
      ],
    },
  };
};

export default async function LitigationPathsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getLitigationPathsPageData(locale);
  const messages = (await getMessages({ locale })) as any;

  const breadcrumbs = [
    { label: messages.breadcrumbs.home, href: ROUTES.HOME },
    { label: messages.breadcrumbs.resources, href: ROUTES.RESOURCES.ROOT },
    {
      label: messages.breadcrumbs.lawsAndRegulations,
    },
    { label: messages.breadcrumbs.litigationPaths },
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
        titleClassName="lg:text-[72px] lg:leading-[90px] font-medium"
        descriptionClassName="font-body text-[20px] leading-[30px] font-normal tracking-normal text-white [&_p]:text-[20px] [&_p]:leading-[30px] [&_p]:font-normal"
      />

      <LitigationPathsSection
        sectionHeading={data.section.heading}
        sectionDescription={data.section.description}
        pathways={data.pathways}
      />
      <FeedbackSection />
    </>
  );
}
