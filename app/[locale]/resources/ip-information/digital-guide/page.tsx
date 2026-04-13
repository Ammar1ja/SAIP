import Heading from '@/components/atoms/Heading';
import LayoutWrapper from '@/components/atoms/LayoutWrapper';
import { getDigitalGuidePageData } from '@/lib/drupal/services/digital-guide.service';
import DigitalGuideCards from './DigitalGuideCards';
import { getMessages } from 'next-intl/server';

export default async function DigitalGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getDigitalGuidePageData(locale);
  const messages = (await getMessages({ locale })) as any;

  return (
    <>
      <Heading
        as="h2"
        size="h2"
        className="xl:text-center xl:max-w-[39.25rem] xl:text-[36px] xl:leading-[44px] xl:tracking-[-0.72px] xl:font-medium"
      >
        {data.heroHeading}
      </Heading>
      {data.heroSubheading && (
        <p className="text-base md:text-lg text-neutral-600 xl:text-center xl:max-w-[39.25rem] xl:text-[20px] xl:leading-[30px]">
          {data.heroSubheading}
        </p>
      )}
      <LayoutWrapper className="grid grid-cols-1 gap-4 px-0 xl:grid-cols-3 xl:gap-4">
        <DigitalGuideCards cards={data.cards} goToLabel={messages.digitalGuide.goTo} />
      </LayoutWrapper>
    </>
  );
}
