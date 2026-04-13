import Heading from '@/components/atoms/Heading';
import Section from '@/components/atoms/Section';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import { AlertProvider } from '@/context/AlertContext';
import { ROUTES } from '@/lib/routes';
import { getMessages } from 'next-intl/server';
import FeedbackSection from '@/components/organisms/FeedbackSection';

const GradientDecoration = () => {
  return (
    <span className="absolute bottom-0 right-0 rtl:left-0 rtl:right-auto rtl:-scale-x-100 w-[42rem] h-[26rem] bg-gradient-to-t from-[#6d428f1a] to-[#6d428f00] [clip-path:polygon(0%_0%,85%_0%,100%_25%,100%_100%,60%_100%)] pointer-events-none -z-10 hidden xl:block"></span>
  );
};

async function DigitalGuideLayout({
  children,
  params,
}: React.PropsWithChildren<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  const messages = (await getMessages({ locale })) as any;

  const breadcrumbs = [
    { label: messages.breadcrumbs.home, href: ROUTES.HOME },
    { label: messages.breadcrumbs.resources, href: ROUTES.RESOURCES.ROOT },
    { label: messages.breadcrumbs.ipInformation },
    { label: messages.digitalGuide?.pageTitle || 'Digital guide' },
  ];

  return (
    <AlertProvider>
      <main className="min-h-screen">
        <Section
          background="primary-50"
          padding="medium"
          className="flex flex-col gap-6 sm:gap-8 min-h-72 sm:min-h-72"
        >
          <Breadcrumbs items={breadcrumbs} variant="subpage" />
          <Heading
            as="h1"
            size="custom"
            weight="medium"
            color="default"
            align="left"
            className="mt-auto sm:mt-0 text-[48px] leading-[60px] tracking-[-0.02em] md:text-[56px] md:leading-[70px] lg:text-[72px] lg:leading-[90px]"
          >
            {messages.digitalGuide?.pageTitle || 'Digital guide'}
          </Heading>
        </Section>
        <Section
          background="white"
          padding="medium"
          className="relative gap-8 flex flex-col xl:items-center xl:justify-center xl:border xl:rounded-[24px] xl:border-border-natural-primary xl:bg-gray-25 xl:p-8 xl:h-[42.5rem] xl:-translate-y-32 overflow-hidden"
        >
          <GradientDecoration />
          {children}
        </Section>
        <FeedbackSection pageTitle={messages.digitalGuide?.pageTitle || 'Digital guide'} />
      </main>
    </AlertProvider>
  );
}

export default DigitalGuideLayout;
