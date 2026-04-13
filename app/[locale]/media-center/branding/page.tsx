import { HeroStatic } from '@/components/organisms/Hero/HeroStatic';
import { PageProps, GenerateMetadata } from '@/app/[locale]/types';
import Section from '@/components/atoms/Section';
import { getMessages, getTranslations } from 'next-intl/server';
import { ROUTES } from '@/lib/routes';
import { Navigation } from '@/components/molecules/Navigation/Navigation';
import DocumentSection from '@/components/organisms/DocumentSection';
import { Button } from '@/components/atoms/Button';
import DownloadFigmaIcon from '@/components/icons/actions/DownloadFigmaIcon';
import ImageExportCard from '@/components/molecules/ImageExportCard';
import { getBrandingPageData } from '@/lib/drupal/services/branding.service';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import { getProxyUrl } from '@/lib/drupal/utils';

type ColorGridProps = {
  color: string;
  r: number;
  g: number;
  b: number;
  className?: string;
};

function ColorGrid({ color, r, g, b, className = '' }: ColorGridProps) {
  return (
    <div
      style={{ backgroundColor: color }}
      className={`text-white px-4 py-6 w-full h-full ${className}`}
    >
      <div className="grid grid-cols-[max-content_max-content] grid-rows-3 gap-x-4 justify-items-start">
        <p className="text-xs col-start-1 row-start-1"> {color} </p>
        <p className="text-xs flex items-center justify-center col-start-2 row-start-1">R: {r}</p>
        <p className="text-xs col-start-2 row-start-2 flex items-center justify-center">G: {g}</p>
        <p className="text-xs col-start-2 row-start-3 flex items-center justify-center">B: {b}</p>
      </div>
    </div>
  );
}

type GradientBlockProps = {
  gradient: string;
  className?: string;
};

function GradientBlock({ gradient, className = '' }: GradientBlockProps) {
  return <div style={{ background: gradient }} className={`w-full h-full ${className}`} />;
}

const swapRoundedCornersForRtl = (className = '', isRtl: boolean) => {
  if (!isRtl || !className) return className;
  return className
    .replace(/rounded-tl-xl/g, 'rounded-tl-xl-temp')
    .replace(/rounded-tr-xl/g, 'rounded-tl-xl')
    .replace(/rounded-tl-xl-temp/g, 'rounded-tr-xl')
    .replace(/rounded-bl-xl/g, 'rounded-bl-xl-temp')
    .replace(/rounded-br-xl/g, 'rounded-bl-xl')
    .replace(/rounded-bl-xl-temp/g, 'rounded-br-xl');
};

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const { locale } = await params;
  const data = await getBrandingPageData(locale);

  return {
    title: data.hero.title,
    description: data.hero.description,
    openGraph: {
      title: data.hero.title,
      description: data.hero.description,
      images: [
        {
          url: data.hero.backgroundImage || '/images/branding/hero.jpg',
          width: 1200,
          height: 630,
          alt: 'Branding',
        },
      ],
    },
  };
};

export default async function Branding({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const t = await getTranslations({ locale, namespace: 'branding' });
  const data = await getBrandingPageData(locale);
  const isRtl = locale === 'ar';

  const breadcrumbItems = [
    { label: messages.breadcrumbs?.home || 'Home', href: ROUTES.HOME },
    { label: messages.breadcrumbs?.mediaCenter || 'Media Center' },
    { label: messages.breadcrumbs?.branding || 'Branding' },
  ];
  const anchorItems = [
    { label: t('anchors.logo'), href: '#logo' },
    { label: t('anchors.colors'), href: '#colors' },
    { label: t('anchors.font'), href: '#font' },
    { label: t('anchors.brandGuide'), href: '#brand-guide' },
  ];

  // Split fullDescription into paragraphs
  const logoParagraphs = data.logo.fullDescription
    ? data.logo.fullDescription.split('\n\n').filter((p) => p.trim())
    : [];

  return (
    <>
      <HeroStatic
        title={data.hero.title}
        description={data.hero.description}
        backgroundImage={data.hero.backgroundImage}
        breadcrumbs={breadcrumbItems}
        hideBreadcrumbsOnMobile={true}
      />
      <Navigation items={anchorItems} className="hidden lg:block" />
      <section id="logo">
        <DocumentSection
          heading={data.logo.heading}
          headingClassName="text-[30px] leading-[38px] md:text-4xl md:leading-[48px]"
          descriptionClassName="text-[18px] leading-[28px] text-text-primary-paragraph"
          description={
            <div className="text-text-primary-paragraph font-normal space-y-2">
              {logoParagraphs.map((text, idx) => (
                <p key={idx}>{text}</p>
              ))}
            </div>
          }
          image={{
            src: data.logo.image,
            alt: data.logo.heading,
            className: 'object-contain object-center p-16 rounded-l-2xl',
          }}
          background="white"
        />

        <Section padding="none">
          <div>
            {data.logoVariants.map((variant, idx) => (
              <ImageExportCard
                key={idx}
                title={variant.title}
                description={variant.description}
                downloads={variant.downloads}
                image={variant.image}
              />
            ))}
          </div>
        </Section>
      </section>
      <section id="colors">
        <Section>
          <h2 className="text-[30px] leading-[38px] md:text-4xl md:leading-[48px] lg:text-5xl lg:leading-[60px] font-medium text-text-default">
            {data.colors.heading}
          </h2>
          <div className="pt-12">
            <div className="text-[24px] leading-[32px] md:text-3xl md:leading-[38px] lg:text-4xl lg:leading-[48px] font-medium text-text-primary-paragraph">
              {t('colors.mainColors')}
            </div>
            <div className="py-4">
              {/* Desktop version */}
              <div className="hidden lg:block space-y-0">
                {data.colors.mainColors.map((mainColor, index) => (
                  <div key={index} className="grid grid-cols-2 gap-8 items-center">
                    <ColorGrid {...mainColor} />
                    <div className="flex flex-col justify-center items-start text-start">
                      <h3 className="text-lg font-bold" style={{ color: mainColor.color }}>
                        {mainColor.title}
                      </h3>
                      <p className="text-gray-800">{mainColor.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Mobile version */}
              <div className="lg:hidden ">
                <div className="rounded-2xl overflow-hidden">
                  {data.colors.mainColors.map((mainColor, index) => (
                    <ColorGrid key={index} {...mainColor} />
                  ))}
                </div>

                <div className="mt-6 space-y-6">
                  {data.colors.mainColors.map((mainColor, index) => (
                    <div
                      key={index}
                      className="flex flex-col justify-center items-start text-start"
                    >
                      <h3 className="text-lg font-bold" style={{ color: mainColor.color }}>
                        {mainColor.title}
                      </h3>
                      <p className="text-gray-800">{mainColor.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <div className="text-[24px] leading-[32px] md:text-3xl md:leading-[38px] lg:text-4xl lg:leading-[48px] font-medium text-text-primary-paragraph">
                {t('colors.secondaryColors')}
              </div>
              <div className="py-4">
                {/* Desktop version */}
                <div className="hidden lg:grid lg:grid-cols-7 lg:grid-rows-2 lg:gap-0">
                  {data.colors.secondaryColors.map((secondaryColor, idx) => (
                    <ColorGrid
                      key={idx}
                      {...secondaryColor}
                      className={swapRoundedCornersForRtl(secondaryColor.className, isRtl)}
                    />
                  ))}

                  {data.colors.secondaryGradientColors.map((gradientColor, idx) => (
                    <GradientBlock
                      key={idx}
                      {...gradientColor}
                      className={swapRoundedCornersForRtl(gradientColor.className, isRtl)}
                    />
                  ))}
                </div>
                {/* Mobile version */}
                <div className="lg:hidden space-y-0">
                  {data.colors.secondaryColors.map((secondaryColor, idx) => {
                    const gradientColor = data.colors.secondaryGradientColors[idx];
                    const isFirst = idx === 0;
                    const isLast = idx === data.colors.secondaryGradientColors.length - 1;

                    const colorGridClassName = isFirst
                      ? isRtl
                        ? 'rounded-tr-xl overflow-hidden'
                        : 'rounded-tl-xl overflow-hidden'
                      : isLast
                        ? isRtl
                          ? 'rounded-br-xl overflow-hidden'
                          : 'rounded-bl-xl overflow-hidden'
                        : '';

                    const gradientBlockClassName = isFirst
                      ? isRtl
                        ? 'rounded-tl-xl overflow-hidden'
                        : 'rounded-tr-xl overflow-hidden'
                      : isLast
                        ? isRtl
                          ? 'rounded-bl-xl overflow-hidden'
                          : 'rounded-br-xl overflow-hidden'
                        : '';

                    // Function to rotate gradient by specified degrees (for mobile devices)
                    // Example: rotateGradient(gradient, 90) - rotates gradient by 90 degrees
                    const rotateGradient = (gradient: string, degrees: number): string => {
                      const match = gradient.match(/linear-gradient\((\d+)deg/);
                      if (match) {
                        const currentAngle = parseInt(match[1], 10);
                        const newAngle = (currentAngle + degrees) % 360;
                        return gradient.replace(
                          /linear-gradient\(\d+deg/,
                          `linear-gradient(${newAngle}deg`,
                        );
                      }
                      return gradient;
                    };

                    // Use mobileRotation from gradientColor if provided, otherwise no rotation
                    const rotationDegrees = gradientColor.mobileRotation ?? 0;
                    const mobileGradient = rotateGradient(gradientColor.gradient, rotationDegrees);

                    return (
                      <div key={idx} className="flex items-stretch">
                        <div className="flex-1">
                          <ColorGrid {...secondaryColor} className={colorGridClassName} />
                        </div>
                        <div className="flex-1">
                          <GradientBlock
                            gradient={mobileGradient}
                            className={gradientBlockClassName}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Section>
      </section>
      <section id="font">
        <div className="mx-auto py-4 md:py-8 lg:py-12">
          <div className="bg-neutral-50">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-4 md:py-8 lg:py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="flex flex-col justify-center gap-8">
                  <h2 className="text-[30px] leading-[38px] md:text-4xl md:leading-[48px] lg:text-5xl lg:leading-[60px] font-medium text-text-default">
                    {data.font.heading}
                  </h2>
                  <div className="text-text-primary-paragraph font-normal space-y-2">
                    <p>{data.font.description}</p>
                    <p className="text-2xl font-bold">{data.font.fontName}</p>
                  </div>
                  <Button
                    href={data.font.downloadUrl}
                    intent="primary"
                    size="md"
                    ariaLabel={`Download ${data.font.fontName}`}
                    className="mt-4 w-full lg:w-auto lg:max-w-fit"
                    fullWidth={false}
                  >
                    <DownloadFigmaIcon className="w-5 h-5" /> Download {data.font.fontName}
                  </Button>
                </div>
                <div className="bg-white rounded-xl overflow-hidden h-full">
                  <div className="h-full flex flex-col justify-center items-center gap-8 p-8">
                    <div className="text-text-primary-paragraph space-y-4">
                      <div>
                        <p>{`${data.font.fontName} ${t('font.regular')}`}</p>
                        <p className="text-xl">{t('font.exampleQuote')}</p>
                      </div>
                      <div>
                        <p>{`${data.font.fontName} ${t('font.bold')}`}</p>
                        <p className="text-xl font-bold">{t('font.exampleQuote')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="brand-guide">
        <DocumentSection
          heading={data.brandGuide.heading}
          headingClassName="text-[30px] leading-[38px] md:text-4xl md:leading-[48px]"
          descriptionClassName="text-[18px] leading-[28px] text-text-primary-paragraph"
          description={
            <>
              <p>{data.brandGuide.description}</p>
            </>
          }
          image={{
            src: data.brandGuide.image,
            alt: data.brandGuide.heading,
            className: 'object-contain object-center rounded-2xl',
          }}
          imagePosition="left"
          buttons={[
            {
              label: t('downloadBrandGuide'),
              href:
                data.brandGuide.downloadUrl ||
                getProxyUrl('/downloads/saip-brand-guide.pdf', 'download'), // ✅ Use CMS URL or fallback
              intent: 'primary',
              icon: <DownloadFigmaIcon className="w-5 h-5" />,
            },
          ]}
          background="white"
        />
      </section>
      <FeedbackSection />
    </>
  );
}
