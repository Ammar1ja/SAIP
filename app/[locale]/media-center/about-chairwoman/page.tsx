import { PageProps, GenerateMetadata } from '@/app/[locale]/types';
import Section from '@/components/atoms/Section';
import { getMessages, getTranslations } from 'next-intl/server';
import { ROUTES } from '@/lib/routes';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import Image from '@/components/atoms/Image';
import Button from '@/components/atoms/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getAboutChairwomanPageData } from '@/lib/drupal/services/about-chairwoman.service';

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const { locale } = await params;
  const aboutChairwoman = await getAboutChairwomanPageData(locale);

  return {
    title: aboutChairwoman.title,
    description: aboutChairwoman.positions.join(' - '),
    openGraph: {
      title: aboutChairwoman.title,
      description: aboutChairwoman.positions.join(' - '),
    },
  };
};

export default async function AboutChairwoman({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const t = await getTranslations({ locale, namespace: 'aboutChairwoman' });
  const aboutChairwoman = await getAboutChairwomanPageData(locale);

  const isRTL = locale === 'ar';

  const breadcrumbItems = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    { label: messages.breadcrumbs?.saip || 'SAIP' },
    {
      label: messages.breadcrumbs?.orgStructure || 'Organisational structure',
      href: ROUTES.SAIP.ORGANISATIONAL_STRUCTURE,
    },
    { label: messages.breadcrumbs?.aboutChairwoman || 'About chairwoman' },
  ];

  return (
    <>
      <Section
        padding={'large'}
        background={'primary-50'}
        className={'flex flex-col h-[calc(100vh-72px)] max-h-[400px] justify-between'}
      >
        <div>
          <Breadcrumbs items={breadcrumbItems} />
          <div className="mt-6 md:mt-8 lg:mt-10 flex md:justify-start justify-center w-full">
            <Button
              href={ROUTES.SAIP.ORGANISATIONAL_STRUCTURE}
              intent="secondary"
              ariaLabel={t('goBack')}
            >
              {isRTL ? <ArrowRight strokeWidth={1} /> : <ArrowLeft strokeWidth={1} />}
              {t('goBack')}
            </Button>
          </div>
        </div>
        <div>
          <h1 className="max-w-[945px] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-text-natural ltr:text-left rtl:text-right py-4">
            {aboutChairwoman.title}
          </h1>
          {aboutChairwoman.positions.map((position, index) => (
            <p
              key={index}
              className="mt-1 sm:text-sm md:text-md lg:text-lg text-gray-600 ltr:text-left rtl:text-right"
            >
              {position}
            </p>
          ))}
        </div>
      </Section>
      <Section className="flex flex-col items-center pt-8">
        <figure className="flex flex-col items-center w-full">
          <div className="relative rounded-xl overflow-hidden">
            <Image
              src={aboutChairwoman.image_src}
              alt={aboutChairwoman.title}
              aspectRatio="landscape"
              quality={100}
              className="w-full max-w-[845px] h-auto"
            />
          </div>
          <figcaption className="mt-8 ltr:text-left rtl:text-right text-gray-600 text-md max-w-[600px] w-full space-y-4">
            {aboutChairwoman.paragraphs.map(({ id, text }) => (
              <p key={id}>{text}</p>
            ))}
            <br />
            <div className="bg-primary-50 rounded-md p-4">
              <p>
                {t('source')}: <span className="font-bold">{t('sourceName')}</span>
              </p>
            </div>
          </figcaption>
        </figure>
      </Section>
    </>
  );
}
