import { PageProps } from '@/app/[locale]/types';
import { getMessages, getTranslations } from 'next-intl/server';
import { ROUTES } from '@/lib/routes';
import { getCareersPageData } from '@/lib/drupal/services/careers.service';
import { Navigation } from '@/components/molecules/Navigation/Navigation';
import HeroStatic from '@/components/organisms/Hero/HeroStatic';
import DocumentSection from '@/components/organisms/DocumentSection';
import { ExternalLink } from 'lucide-react';
import FeedbackSection from '@/components/organisms/FeedbackSection';

export default async function Careers({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const t = await getTranslations({ locale, namespace: 'careers' });
  const data = await getCareersPageData(locale);

  const breadcrumbItems = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    { label: messages.breadcrumbs?.contactUs || 'Contact us' },
    { label: messages.breadcrumbs?.careers || 'Careers' },
  ];
  const anchorItems = [
    { label: t('anchors.saipCareers'), href: '#saip-careers' },
    { label: t('anchors.wipoCareers'), href: '#wipo-careers' },
  ];

  return (
    <>
      <HeroStatic
        title={data.hero.title}
        description={data.hero.description}
        backgroundImage={data.hero.backgroundImage}
        breadcrumbs={breadcrumbItems}
      />
      <Navigation items={anchorItems} className="hidden lg:block" />
      <section id="saip-careers">
        <DocumentSection
          heading={data.saipCareers.heading}
          description={data.saipCareers.description}
          image={{
            ...data.saipCareers.image,
            wrapperClassName: 'lg:w-[708px] lg:h-[474px] lg:aspect-auto',
          }}
          className="lg:grid-cols-[minmax(0,1fr)_708px]"
          buttons={[
            {
              label: t('buttons.goToEmploymentPortal'),
              href: data.saipCareers.buttonHref,
              intent: 'primary',
              icon: <ExternalLink className="w-5 h-5" />,
            },
          ]}
          background="white"
          alignEnabled
          alignDirection="auto"
        />
      </section>
      <section id="wipo-careers">
        <DocumentSection
          heading={data.wipoCareers.heading}
          description={data.wipoCareers.description}
          image={{
            ...data.wipoCareers.image,
            wrapperClassName: 'lg:w-[708px] lg:h-[474px] lg:aspect-auto',
            className: 'lg:rounded-l-xl lg:rounded-r-none',
          }}
          className="lg:grid-cols-[708px_minmax(0,1fr)]"
          imagePosition="left"
          buttons={[
            {
              label: t('buttons.goToWipoPortal'),
              href: data.wipoCareers.buttonHref,
              intent: 'primary',
              icon: <ExternalLink className="w-5 h-5" />,
            },
          ]}
          background="primary-50"
        />
      </section>
      <FeedbackSection />
    </>
  );
}
