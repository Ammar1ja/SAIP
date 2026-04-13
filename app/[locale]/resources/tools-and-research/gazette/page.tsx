import { GenerateMetadata, PageProps } from '@/app/[locale]/types';
import { ROUTES } from '@/lib/routes';
import { getMessages } from 'next-intl/server';
import HeroStatic from '../../../../../components/organisms/Hero/HeroStatic';
import { Navigation } from '@/components/molecules/Navigation/Navigation';
import GazetteSectionWrapper from './GazetteSectionWrapper';
import { GazetteShareNavIcon } from '@/components/organisms/GazetteSection/GazetteShareNavIcon';
import { getGazettePageData } from '@/lib/drupal/services';
import FeedbackSection from '@/components/organisms/FeedbackSection';

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return {
    title: messages.gazette?.pageTitle || 'Gazette',
    description:
      messages.gazette?.pageDescription ||
      'The trusted source for the latest updates on intellectual property in Saudi Arabia.',
    openGraph: {
      title: messages.gazette?.pageTitle || 'Gazette',
      description:
        messages.gazette?.pageDescription ||
        'The trusted source for the latest updates on intellectual property in Saudi Arabia.',
      images: [
        {
          url: '/images/gazette/hero.jpg',
          width: 1200,
          height: 630,
          alt: 'Gazette',
        },
      ],
    },
  };
};

export default async function Gazette({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const data = await getGazettePageData(locale);

  const breadcrumbItems = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    { label: messages.breadcrumbs?.resources || 'Resources', href: ROUTES.RESOURCES.ROOT },
    {
      label: messages.breadcrumbs?.toolsAndResearch || 'Tools & research',
    },
    { label: messages.breadcrumbs?.gazette || 'Gazette' },
  ];

  const anchorItems = [
    { label: messages.gazette?.nav?.ipGazette || 'IP Gazette', href: '#ip-gazette' },
    { label: messages.gazette?.nav?.ipNewspaper || 'IP Newspaper', href: '#ip-newspaper' },
  ];

  return (
    <main>
      <HeroStatic
        overlay
        title={data.heroHeading}
        description={data.heroSubheading}
        backgroundImage={data.heroImage?.src || '/images/gazette/hero.jpg'}
        breadcrumbs={breadcrumbItems}
        className="!h-[520px] !max-h-[520px]"
      />
      <Navigation
        items={anchorItems}
        bold
        className="hidden lg:block"
        forceCompact
        showActiveMarker={false}
      />
      <GazetteSectionWrapper
        id="ip-gazette"
        heading={data.ipGazette.heading}
        text={data.ipGazette.text}
        buttonText={data.ipGazette.buttonText}
        buttonHref={data.ipGazette.buttonHref}
        buttonIcon={<GazetteShareNavIcon />}
        imageSrc={data.ipGazette.imageSrc}
        imageAlt={data.ipGazette.imageAlt}
        isReversed={false}
        mobileFullWidth={true}
      />
      {/* Navigation CTA — share.svg per design (not Lucide). */}
      <GazetteSectionWrapper
        id="ip-newspaper"
        heading={data.ipNewspaper.heading}
        text={data.ipNewspaper.text}
        buttonText={data.ipNewspaper.buttonText}
        buttonHref={data.ipNewspaper.buttonHref}
        buttonIcon={<GazetteShareNavIcon />}
        imageSrc={data.ipNewspaper.imageSrc}
        imageAlt={data.ipNewspaper.imageAlt}
        isReversed={true}
      />
      <FeedbackSection />
    </main>
  );
}
