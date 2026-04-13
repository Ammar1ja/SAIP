import { Metadata } from 'next';
import { PageProps, GenerateMetadata } from '../../types';
import { getMessages } from 'next-intl/server';
import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import MissionAndVision from '@/components/organisms/MissionAndVision';
import OurRoles from '@/components/organisms/OurRoles';
import OurPillars from '@/components/organisms/OurPillars';
import { ROUTES } from '@/lib/routes';
import { Navigation } from '@/components/molecules/Navigation/Navigation';
import { getAboutPageData } from '@/lib/drupal/about.integration';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import AboutValuesAndCeoSection from './AboutValuesAndCeoSection';

export const revalidate = 300;

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const messages = await getMessages();
  const { locale } = await params;

  return {
    title: messages.about?.pageTitle || 'About SAIP',
    description:
      messages.about?.pageDescription ||
      'Learn more about Saudi Authority for Intellectual Property',
    openGraph: {
      title: messages.about?.pageTitle || 'About SAIP',
      description:
        messages.about?.pageDescription ||
        'Learn more about Saudi Authority for Intellectual Property',
      images: [
        {
          url: '/images/about/hero.jpg',
          width: 1200,
          height: 630,
          alt: 'About SAIP',
        },
      ],
    },
  };
};

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const [messages, aboutData] = await Promise.all([
    getMessages({ locale }),
    getAboutPageData(locale),
  ]);

  const breadcrumbItems = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    { label: messages.breadcrumbs?.saip || 'SAIP' },
    { label: messages.breadcrumbs?.aboutSaip || 'About SAIP' },
  ];

  const aboutNav = messages.about?.nav as any;
  const anchorItems = [
    { label: aboutNav?.missionVision || 'SAIP mission & vision', href: '#mission' },
    { label: aboutNav?.values || 'Our values', href: '#values' },
    { label: aboutNav?.ceoSpeech || 'CEO speech', href: '#ceo' },
    { label: aboutNav?.roles || 'Our roles', href: '#roles' },
    { label: aboutNav?.pillars || 'Our pillars', href: '#pillars' },
  ];

  return (
    <main>
      <HeroStatic
        overlay
        title={aboutData.hero.title}
        description={aboutData.hero.description}
        backgroundImage={aboutData.hero.backgroundImage}
        breadcrumbs={breadcrumbItems}
      />
      <Navigation items={anchorItems} className="hidden lg:block" />
      <section className="z-0 pt-20">
        <section id="mission">
          <MissionAndVision
            mission={aboutData.mission?.text}
            vision={aboutData.vision?.text}
            missionTitle={aboutData.mission?.title}
            visionTitle={aboutData.vision?.title}
          />
        </section>
      </section>
      <AboutValuesAndCeoSection values={aboutData.values} ceoSpeech={aboutData.ceoSpeech} />
      <section id="roles">
        <OurRoles
          heading={aboutData.roles?.heading}
          text={aboutData.roles?.text}
          drupalRoles={aboutData.roles?.items}
        />
      </section>
      <section id="pillars">
        <OurPillars
          pillars={aboutData.pillars.pillars}
          heading={aboutData.pillars.heading}
          text={aboutData.pillars.text}
        />
      </section>
      <FeedbackSection />
    </main>
  );
}
