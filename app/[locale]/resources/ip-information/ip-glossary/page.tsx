import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import { IPGlossarySection } from '@/components/sections/IPGlossarySection/IPGlossarySection';
import { ROUTES } from '@/lib/routes';
import { getMessages } from 'next-intl/server';
import { getIPGlossaryPageData } from '@/lib/drupal/services';
import FeedbackSection from '@/components/organisms/FeedbackSection';

export default async function IpGlossaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const data = await getIPGlossaryPageData(locale);

  const breadcrumbItems = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    { label: messages.breadcrumbs?.resources || 'Resources', href: ROUTES.RESOURCES.ROOT },
    {
      label: messages.breadcrumbs?.ipInformation || 'IP Information',
    },
    { label: messages.breadcrumbs?.ipGlossary || 'IP Glossary' },
  ];

  return (
    <main>
      <HeroStatic
        title={data.heroHeading}
        description={data.heroSubheading}
        backgroundImage="/images/ip-glossary/hero.png"
        breadcrumbs={breadcrumbItems}
      />

      <IPGlossarySection glossaryTerms={data.glossaryTerms} acronyms={data.acronyms} />
      <FeedbackSection />
    </main>
  );
}
