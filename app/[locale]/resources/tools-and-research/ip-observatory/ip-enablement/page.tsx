import { getMessages } from 'next-intl/server';
import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import { ROUTES } from '@/lib/routes';
import { PageProps } from '@/app/[locale]/types';
import IpEnablementContentPage from './IpEnablementContent';
import { getIPObservatoryEnablementPageData } from '@/lib/drupal/services';
import FeedbackSection from '@/components/organisms/FeedbackSection';

export default async function IpEnablementPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const data = await getIPObservatoryEnablementPageData(locale);

  const breadcrumbItems = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    { label: messages.breadcrumbs?.resources || 'Resources', href: ROUTES.RESOURCES.ROOT },
    {
      label: messages.breadcrumbs?.toolsAndResearch || 'Tools & research',
    },
    {
      label: messages.breadcrumbs?.ipObservatory || 'IP observatory',
      href: ROUTES.RESOURCES.TOOLS_AND_RESEARCH.IP_OBSERVATORY.ROOT,
    },
    {
      label: messages.breadcrumbs?.ipEnablement || 'IP enablement',
    },
  ];

  return (
    <main>
      <HeroStatic
        breadcrumbs={breadcrumbItems}
        backgroundColor="bg-primary-50"
        overlay={false}
        title={data.hero.title}
        description={data.hero.description}
        showBackButton
        backHref={ROUTES.RESOURCES.TOOLS_AND_RESEARCH.IP_OBSERVATORY.ROOT}
        backLabel={messages.ipObservatory?.goBack || 'Go back to IP observatory'}
        textColor="dark"
      />
      <IpEnablementContentPage data={data} />
      <FeedbackSection />
    </main>
  );
}
