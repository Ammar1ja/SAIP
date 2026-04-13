import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import { ReportsSection } from '@/components/sections/ReportsSection/ReportsSection';
import { ROUTES } from '@/lib/routes';
import { getMessages } from 'next-intl/server';
import { getReportsPageData } from '@/lib/drupal/services';
import FeedbackSection from '@/components/organisms/FeedbackSection';

// Force dynamic rendering to ensure fresh data from Drupal
export const dynamic = 'force-dynamic';

export default async function Reports({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const data = await getReportsPageData(locale);

  const breadcrumbItems = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    { label: messages.breadcrumbs?.resources || 'Resources', href: ROUTES.RESOURCES.ROOT },
    {
      label: messages.breadcrumbs?.ipInformation || 'IP Information',
    },
    { label: messages.breadcrumbs?.reports || 'Reports' },
  ];

  return (
    <main>
      <HeroStatic
        title={data.heroHeading}
        description={data.heroSubheading}
        backgroundImage={data.heroImage?.src || '/images/reports/hero.jpg'}
        breadcrumbs={breadcrumbItems}
      />

      <ReportsSection
        reports={data.reports}
        categoryOptions={data.categoryOptions}
        reportTypeOptions={data.reportTypeOptions}
      />
      <FeedbackSection />
    </main>
  );
}
