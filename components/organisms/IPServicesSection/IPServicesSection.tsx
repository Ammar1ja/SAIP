'use client';

import { useState } from 'react';
import Section from '@/components/atoms/Section';
import { Filters } from '@/components/molecules/Filters';
import ServiceCard from '@/components/molecules/ServiceCard';
import { IPServicesSectionProps } from './IPServicesSection.types';
import { useTranslations } from 'next-intl';
import { MobileFilters } from '@/components/molecules/MobileFilters';
import { useIsMobile } from '@/hooks/useIsMobile';
import { normalizeServiceTypeKey } from '@/lib/drupal/utils';

const KNOWN_SERVICE_SLUGS: Record<string, string> = {
  'consultancy-clinic': '/services/ip-clinics/consultancy-services',
  'ip-consultancy': '/services/ip-clinics/consultancy-services',
  'services-of-the-ip-consultancy-clinics': '/services/ip-clinics/consultancy-services',
  'ip-consultancy-clinics': '/services/ip-clinics/consultancy-services',
  'consultancy-services': '/services/ip-clinics/consultancy-services',
};

function textToSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/^-|-$/g, '');
}

function isIPClinicsConsultancyService(title: string, href?: string): boolean {
  const titleSlug = textToSlug(title);
  const consultancySlugs = ['consultancy', 'استشارية', 'عيادات', 'عيادة'];

  for (const slug of consultancySlugs) {
    if (titleSlug.includes(slug.toLowerCase())) {
      return true;
    }
  }

  if (href && href.includes('ip-clinics') && href.includes('consultancy')) {
    return true;
  }

  return false;
}

function getKnownRoute(title: string): string | null {
  const titleSlug = textToSlug(title);

  if (KNOWN_SERVICE_SLUGS[titleSlug]) {
    return KNOWN_SERVICE_SLUGS[titleSlug];
  }

  for (const [knownSlug, route] of Object.entries(KNOWN_SERVICE_SLUGS)) {
    if (titleSlug.includes(knownSlug) || knownSlug.includes(titleSlug)) {
      return route;
    }
  }

  const titleLower = title.toLowerCase();
  const englishPatterns: Record<string, string> = {
    'consultancy clinic': '/services/ip-clinics/consultancy-services',
    'ip consultancy': '/services/ip-clinics/consultancy-services',
    'services of the ip consultancy clinics': '/services/ip-clinics/consultancy-services',
    'ip consultancy clinics': '/services/ip-clinics/consultancy-services',
  };

  for (const [pattern, route] of Object.entries(englishPatterns)) {
    if (titleLower.includes(pattern)) {
      return route;
    }
  }

  return null;
}

function isInvalidHref(href: string): boolean {
  if (!href || href === '#') return false;

  const normalized = href.trim().toLowerCase();

  return (
    normalized === '/services/services' ||
    normalized === '/services/services/' ||
    normalized === '/services' ||
    normalized === '/services/' ||
    normalized.startsWith('/services/services')
  );
}

function normalizeHref(href: string, category?: string): string | null {
  if (!href || href === '#') return null;

  if (isInvalidHref(href)) {
    return null;
  }

  let normalized = href.trim();

  normalized = normalized.replace(/\/services\/services\//g, '/services/');
  normalized = normalized.replace(/\/services\/services$/g, '/services');

  if (normalized.match(/^\/services\/services-/)) {
    const slug = normalized.replace(/^\/services\/services-/, '');
    const categoryPath = category || 'services';
    normalized = `/services/${categoryPath}/${slug}`;
  }

  if (isInvalidHref(normalized)) {
    return null;
  }

  return normalized;
}

function normalizeLocaleAgnosticPath(href: string): string {
  if (!href || href === '#') return href;
  if (href.startsWith('http://') || href.startsWith('https://')) return href;

  const withLeadingSlash = href.startsWith('/') ? href : `/${href}`;
  return withLeadingSlash.replace(/^\/(ar|en)(?=\/|$)/, '') || '/';
}

function generateServiceHref(title: string, category?: string): string {
  const knownRoute = getKnownRoute(title);
  if (knownRoute) {
    return knownRoute;
  }

  const slug = textToSlug(title);

  const categoryPath = category || 'services';
  const path = `/services/${categoryPath}/${slug}`;
  return path;
}

const IPServicesSection = ({
  title,
  services,
  serviceTypeOptions,
  targetGroupOptions,
  category,
}: IPServicesSectionProps) => {
  const t = useTranslations('common');
  const tServiceTypes = useTranslations('common.filters.serviceTypeOptions');
  const tTargetGroups = useTranslations('common.filters.targetGroupOptions');
  const [servicesFilter, setServicesFilter] = useState<{
    search: string;
    serviceType: string[];
    targetGroup: string[];
  }>({
    search: '',
    serviceType: [],
    targetGroup: [],
  });
  const isMobile = useIsMobile();

  // Translate service type options
  const translatedServiceTypeOptions = serviceTypeOptions.map((opt) => {
    const normalizedValue = normalizeServiceTypeKey(opt.value || opt.label) || opt.value;
    const normalizedLabel = normalizeServiceTypeKey(opt.label) || opt.label;
    return {
      value: normalizedValue,
      label: tServiceTypes(normalizedValue as any, { defaultValue: normalizedLabel }),
    };
  });

  // Translate target group options
  const translatedTargetGroupOptions = targetGroupOptions.map((opt) => ({
    value: opt.value,
    label: tTargetGroups(opt.value as any, { defaultValue: opt.label }),
  }));

  const handleServicesFilterChange = (fieldId: string, value: string | string[]) => {
    setServicesFilter((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleServicesClear = () => {
    setServicesFilter({ search: '', serviceType: [], targetGroup: [] });
  };

  const filteredServices = services.filter((service) => {
    const searchMatch =
      !servicesFilter.search ||
      service.title.toLowerCase().includes(servicesFilter.search.toLowerCase());

    const normalizedServiceTypes = servicesFilter.serviceType.map((value) =>
      (normalizeServiceTypeKey(value) || value).toLowerCase().trim(),
    );
    const normalizedLabels =
      service.labels?.map((label) =>
        (normalizeServiceTypeKey(label) || label).toLowerCase().trim(),
      ) || [];
    const allServiceTypesSelected =
      serviceTypeOptions.length > 0 &&
      normalizedServiceTypes.length === serviceTypeOptions.length &&
      serviceTypeOptions.every((opt) => normalizedServiceTypes.includes(opt.value.toLowerCase()));

    const typeMatch =
      normalizedServiceTypes.length === 0 ||
      allServiceTypesSelected ||
      normalizedServiceTypes.includes('all') ||
      normalizedLabels.some((label) => normalizedServiceTypes.includes(label));

    const normalizedTargetGroups = service.targetGroups?.map((group) => group.toLowerCase()) || [];
    const normalizedTargetGroupFilters = servicesFilter.targetGroup.map((value) =>
      value.toLowerCase().trim(),
    );
    const allTargetGroupsSelected =
      targetGroupOptions.length > 0 &&
      normalizedTargetGroupFilters.length === targetGroupOptions.length &&
      targetGroupOptions.every((opt) =>
        normalizedTargetGroupFilters.includes(opt.value.toLowerCase()),
      );

    const groupMatch =
      normalizedTargetGroupFilters.length === 0 ||
      allTargetGroupsSelected ||
      normalizedTargetGroupFilters.includes('all') ||
      (normalizedTargetGroups.length > 0 &&
        normalizedTargetGroupFilters.some((group) => normalizedTargetGroups.includes(group)));
    return searchMatch && typeMatch && groupMatch;
  });

  const filterFields = [
    {
      id: 'search',
      label: t('filters.search'),
      type: 'search' as const,
      placeholder: t('filters.search'),
    },
    {
      id: 'serviceType',
      label: t('filters.serviceType'),
      type: 'select' as const,
      options: translatedServiceTypeOptions,
      multiselect: true,
    },
    {
      id: 'targetGroup',
      label: t('filters.targetGroup'),
      type: 'select' as const,
      options: translatedTargetGroupOptions,
      multiselect: true,
    },
  ];

  return (
    <>
      <Section background="primary-50" padding="none">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 pt-10 pb-16 md:pb-24">
          <h1 className="text-4xl md:text-5xl lg:text-[72px] lg:leading-[90px] tracking-[-0.02em] font-medium text-[#161616]">
            {title}
          </h1>
          <div className="mt-10 w-full relative z-10 md:-mb-26 lg:-mb-42">
            {isMobile ? (
              <div className="max-w-[1062px] mx-auto">
                <MobileFilters
                  fields={filterFields}
                  values={servicesFilter}
                  onChange={handleServicesFilterChange}
                  onClear={handleServicesClear}
                  searchFieldId="search"
                />
              </div>
            ) : (
              <Filters
                fields={filterFields}
                values={servicesFilter}
                onChange={handleServicesFilterChange}
                onClear={handleServicesClear}
                showHideFilters={false}
                variant="services"
                className="max-w-[1062px] mx-auto border-[#d2d6db] shadow-sm"
                actionsClassName="mt-4"
                clearButtonClassName="text-[#9da4ae] text-sm font-medium hover:text-[#6c737f]"
              />
            )}
          </div>
        </div>
      </Section>
      <Section background="white" padding="none">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-20">
          <h2 className="mt-8 md:mt-10 text-3xl md:text-4xl lg:text-[48px] leading-[60px] tracking-[-0.02em] font-medium mb-12 text-[#161616]">
            {t('filters.totalNumber')}: {filteredServices.length}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, idx) => {
              let serviceHref: string;
              const isClinicsCategory = category === 'ip-clinics';

              if (isClinicsCategory && isIPClinicsConsultancyService(service.title, service.href)) {
                serviceHref = '/services/ip-clinics/consultancy-services';

                if (process.env.NODE_ENV === 'development') {
                  console.log(
                    `[IP SERVICES] IP Clinics consultancy detected for "${service.title}": ${serviceHref}`,
                  );
                }
              } else {
                const knownRoute = isClinicsCategory ? getKnownRoute(service.title) : null;

                if (knownRoute) {
                  serviceHref = knownRoute;

                  if (process.env.NODE_ENV === 'development') {
                    console.log(
                      `[IP SERVICES] Known route matched for "${service.title}": ${serviceHref}`,
                    );
                  }
                } else {
                  const drupalHref = service.href?.trim();

                  if (!drupalHref || drupalHref === '#' || drupalHref.length === 0) {
                    serviceHref = generateServiceHref(service.title, category);
                    if (process.env.NODE_ENV === 'development') {
                      console.log(
                        `[IP SERVICES] Generated href for "${service.title}": ${serviceHref}`,
                      );
                    }
                  } else {
                    const normalizedHref = normalizeHref(drupalHref, category);

                    if (normalizedHref) {
                      serviceHref = normalizeLocaleAgnosticPath(normalizedHref);

                      if (process.env.NODE_ENV === 'development') {
                        console.log(
                          `[IP SERVICES] Using normalized Drupal href for "${service.title}": ${serviceHref} (original: ${drupalHref})`,
                        );
                      }
                    } else {
                      serviceHref = generateServiceHref(service.title, category);
                    }
                  }
                }
              }

              return (
                <ServiceCard
                  key={service.title + idx}
                  title={service.title}
                  labels={service.labels}
                  description={service.description}
                  href={serviceHref}
                  variant="services"
                  primaryButtonLabel={service.primaryButtonLabel || t('buttons.viewDetails')}
                  primaryButtonHref={serviceHref}
                />
              );
            })}
          </div>
        </div>
      </Section>
    </>
  );
};

export default IPServicesSection;
