import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import Section from '@/components/atoms/Section';
import RelatedServicesSection from '@/components/organisms/RelatedServicesSection';
import CommentsAndSuggestionsSection from '@/components/organisms/CommentsAndSuggestionsSection';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import { ROUTES } from '@/lib/routes';
import { getServiceDetailBySlug } from '@/lib/drupal/services/service-detail-universal.service';
import ServiceDetailClient from './ServiceDetailClient';
import LeadingIcon from '@/assets/images/leading_icon.png';

export default async function UniversalServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string; category: string }>;
}) {
  const { slug, locale, category } = await params;

  console.log(`🔍 [SERVICE PAGE] Fetching: ${slug}, locale: ${locale}, category: ${category}`);

  // Fetch service data from Drupal using universal service
  const serviceData = await getServiceDetailBySlug(slug, locale);

  if (!serviceData) {
    console.log(`❌ [SERVICE PAGE] Not found: ${slug}`);
    notFound();
  }

  console.log(`✅ [SERVICE PAGE] Loaded: ${serviceData.title}`);

  // Get translations
  const tBreadcrumbs = await getTranslations({ locale, namespace: 'breadcrumbs' });
  const t = await getTranslations({ locale, namespace: 'serviceDetail' });
  const tCommons = await getTranslations({ locale, namespace: 'common' });

  const translateServiceValue = (value: string): string => {
    if (!value) return value;
    const valueLower = value.toLowerCase().trim();

    const valueMap: Record<string, string> = {
      free: 'commonValues.free',
      مجاني: 'commonValues.free',
      continuous: 'commonValues.continuous',
      مستمرة: 'commonValues.continuous',
      online: 'commonValues.online',
      digital: 'commonValues.digital',
      رقمي: 'commonValues.digital',
      'on-site': 'commonValues.onSite',
      'في الموقع': 'commonValues.onSite',
      'on-site / digital': 'commonValues.onSiteDigital',
      'في الموقع / رقمي': 'commonValues.onSiteDigital',
      'individuals, smes, startups': 'commonValues.individualsSmesStartups',
      'الأفراد، الشركات الناشئة، المنشآت الصغيرة والمتوسطة': 'commonValues.individualsSmesStartups',
    };

    const i18nKey = valueMap[valueLower];
    if (i18nKey) {
      try {
        return t(i18nKey) || value;
      } catch {
        return value;
      }
    }

    if (valueLower.includes('free') || valueLower.includes('مجاني')) {
      try {
        return t('commonValues.free') || value;
      } catch {
        return value;
      }
    }
    if (valueLower.includes('continuous') || valueLower.includes('مستمرة')) {
      try {
        return t('commonValues.continuous') || value;
      } catch {
        return value;
      }
    }
    if (
      (valueLower.includes('on-site') || valueLower.includes('في الموقع')) &&
      (valueLower.includes('digital') || valueLower.includes('رقمي'))
    ) {
      try {
        return t('commonValues.onSiteDigital') || value;
      } catch {
        return value;
      }
    }
    if (
      valueLower.includes('individuals') &&
      valueLower.includes('smes') &&
      valueLower.includes('startups')
    ) {
      try {
        return t('commonValues.individualsSmesStartups') || value;
      } catch {
        return value;
      }
    }

    return value;
  };

  // Adapt data structures for components
  // ServiceDetail.steps has { number, title, description }
  // But TimelineSteps needs { number, title, details: string[] }
  const adaptedSteps = serviceData.steps.map((step) => ({
    number: step.number,
    title: step.title,
    icon: undefined,
    details: step.description ? [step.description] : [],
  }));

  // ServiceDetail.requirements has Array<{ title, items: string[] }>
  // But RequirementsList needs string[]
  const adaptedRequirements = serviceData.requirements.flatMap((req) => req.items);

  // Prepare sidebar data (raw values, client component will handle translations)
  const sidebarData = {
    executionTime: translateServiceValue(serviceData.executionTime),
    serviceFee: translateServiceValue(serviceData.serviceFee),
    targetGroup: translateServiceValue(serviceData.targetGroup),
    serviceChannel: translateServiceValue(serviceData.serviceChannel),
  };

  const serviceDirectoryLabel = tBreadcrumbs('serviceDirectory') || 'SAIP service directory';

  const displayLabels =
    serviceData.labels && serviceData.labels.length > 0
      ? serviceData.labels
      : [serviceData.category];

  const isRtl = locale === 'ar' ? true : false;
  return (
    <main className="min-h-screen pb-20">
      {/* Hero Section */}
      <Section background="primary-50" padding="medium">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: tBreadcrumbs('home') || 'Home', href: ROUTES.HOME },
            { label: serviceDirectoryLabel, href: ROUTES.SERVICES.SERVICE_DIRECTORY },
            { label: serviceData.title },
          ]}
        />
        <Link
          href={ROUTES.SERVICES.SERVICE_DIRECTORY}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 border border-[#D2D6DB] rounded-[4px] h-[32px] text-sm hover:bg-neutral-100 transition bg-[#F7FDF9]"
        >
          <img
            src={LeadingIcon.src}
            alt=""
            className={`w-4 h-4 object-contain ${isRtl ? 'rotate-180 ml-2' : 'rotate-0 mr-2'}`}
          />{' '}
          {t('goBackToServices')}
        </Link>
        <div className="mb-6" />
        <h1 className="text-7xl font-medium mb-5">{serviceData.title}</h1>
        {displayLabels.length > 0 && (
          <div className="flex gap-2 mb-5">
            {displayLabels.map((label) => (
              <span
                key={label}
                className="inline-block bg-neutral-50 outline outline-gray-200 rounded-full px-3 py-1 text-xs font-semibold"
              >
                {label}
              </span>
            ))}
          </div>
        )}
        {serviceData.description && (
          <p className="text-lg text-neutral-700 mb-4 max-w-2xl">{serviceData.description}</p>
        )}
      </Section>

      {/* Client Content (Tabs + Sidebar) */}
      <ServiceDetailClient
        steps={adaptedSteps}
        requirements={adaptedRequirements}
        sidebarData={sidebarData}
        faqHref={serviceData.faqHref}
        platformHref={serviceData.platformHref}
        secondaryButtonLabel={serviceData.secondaryButtonLabel}
        secondaryButtonHref={serviceData.secondaryButtonHref}
      />

      {/* Related Services */}
      {serviceData.relatedServices.length > 0 && (
        <Section background="neutral" padding="large">
          <RelatedServicesSection services={serviceData.relatedServices} cardWidth={410} />
        </Section>
      )}

      {/* Comments & Suggestions */}
      <Section background="white" padding="large">
        <div className="max-w-7xl mx-auto">
          <CommentsAndSuggestionsSection buttonHref={ROUTES.CONTACT.CONTACT_AND_SUPPORT.ROOT} />
        </div>
      </Section>

      {/* Feedback Section */}
      <FeedbackSection pageTitle={serviceData.title} />
    </main>
  );
}
