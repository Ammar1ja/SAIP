import { PageProps, GenerateMetadata } from '../../../types';
import { getMessages } from 'next-intl/server';
import { getFaqPageData } from '@/lib/drupal/services';
import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import { ROUTES } from '@/lib/routes';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import { FaqContent } from './FaqContent';

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return {
    title: messages.faq?.pageTitle || 'FAQ',
    description: messages.faq?.pageDescription || 'Find answers to frequently asked questions',
    openGraph: {
      title: messages.faq?.pageTitle || 'FAQ',
      description: messages.faq?.pageDescription || 'Find answers to frequently asked questions',
      images: [
        {
          url: '/images/faq/hero.jpg',
          width: 1200,
          height: 630,
          alt: 'FAQ',
        },
      ],
    },
  };
};

export default async function FaqPage({ params }: PageProps) {
  const { locale } = await params;
  const data = await getFaqPageData(locale);
  const messages = await getMessages({ locale });

  const breadcrumbItems = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    { label: messages.breadcrumbs?.resources || 'Resources', href: ROUTES.RESOURCES.ROOT },
    { label: messages.breadcrumbs?.ipInformation || 'IP information' },
    { label: messages.breadcrumbs?.faq || 'FAQ' },
  ];

  return (
    <main>
      <HeroStatic
        title={data.heroHeading}
        description=""
        backgroundImage={undefined}
        breadcrumbs={breadcrumbItems}
        backgroundColor="bg-primary-25"
        textColor="dark"
        stackBreadcrumbsWithTitle
        layoutWrapperClassName="px-0"
        titleClassName="w-full max-w-[1280px] !font-medium lg:text-[72px] lg:leading-[90px] lg:tracking-[-0.02em] lg:!text-text-default"
        className="h-auto max-h-none min-h-0 py-0 pt-12 pb-16 px-4 md:px-16 lg:min-h-[392px]"
      />
      <FaqContent categories={data.categories} />
      <FeedbackSection />
    </main>
  );
}
