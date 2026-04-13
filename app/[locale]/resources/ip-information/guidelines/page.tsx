import HeroStatic from '@/components/organisms/Hero/HeroStatic';
import GuidelinesContent from './GuidelinesContent';
import { ROUTES } from '@/lib/routes';
import { getGuidelinesPageData } from '@/lib/drupal/services';
import { getMessages } from 'next-intl/server';
import FeedbackSection from '@/components/organisms/FeedbackSection';

export default async function GuidelinesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await getGuidelinesPageData(locale);
  const messages = (await getMessages({ locale })) as any;

  const breadcrumbs = [
    { label: messages.breadcrumbs.home, href: ROUTES.HOME },
    { label: messages.breadcrumbs.resources, href: ROUTES.RESOURCES.ROOT },
    { label: messages.breadcrumbs.ipInformation },
    { label: messages.breadcrumbs.guidelines },
  ];

  return (
    <main>
      <HeroStatic
        title={data.heroHeading}
        description={data.heroSubheading}
        descriptionClassName="!text-[20px] !leading-[30px] !font-normal !font-body tracking-normal !text-white [&_p]:!text-[20px] [&_p]:!leading-[30px] [&_p]:!font-normal [&_p]:!font-body"
        backgroundImage={data.heroImage?.src || '/images/about/hero.jpg'}
        breadcrumbs={breadcrumbs}
      />
      <GuidelinesContent guidelines={data.guidelines} categoryOptions={data.categoryOptions} />
      <FeedbackSection />
    </main>
  );
}
