import Section from '@/components/atoms/Section';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import ServiceDirectoryContent from './ServiceDirectoryContent';
import { ROUTES } from '@/lib/routes';
import { getServiceDirectoryPageData } from '@/lib/drupal/services/service-directory.service';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import { getMessages } from 'next-intl/server';

export const revalidate = 300;

export default async function ServiceDirectoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [messages, data] = await Promise.all([
    getMessages({ locale }),
    getServiceDirectoryPageData(locale),
  ]);

  return (
    <>
      <Section
        background="primary-50"
        overlap
        padding="none"
        className="pt-10 pb-16 after:h-[135%]"
      >
        <Breadcrumbs
          className="mb-20"
          items={[
            { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
            {
              label: messages.breadcrumbs?.services || 'Services',
              href: ROUTES.SERVICES.SERVICES_OVERVIEW,
            },
            { label: messages.breadcrumbs?.serviceDirectory || 'SAIP service directory' },
          ]}
        />
        <h1 className="mb-3 text-[48px] leading-[60px] lg:text-[72px] lg:leading-[90px] tracking-[-1.44px] font-medium">
          {data.heroHeading}
        </h1>
        <p className="text-[20px] leading-[30px] text-text-primary-paragraph max-w-[628px]">
          {data.heroSubheading}
        </p>
      </Section>
      <Section background="white" padding="none">
        <ServiceDirectoryContent data={data} />
      </Section>
      <FeedbackSection />
    </>
  );
}
