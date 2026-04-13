'use client';

import { useState } from 'react';
import { Filters } from '@/components/molecules/Filters';
import ServiceCard from '@/components/molecules/ServiceCard';
import Section from '@/components/atoms/Section';
import { ServiceItemData } from '@/lib/drupal/services/ip-clinics.service';
import { useTranslations, useLocale } from 'next-intl';

interface IpClinicsServicesSectionProps {
  services: ServiceItemData[];
}

// Generate href from service title (fallback when Drupal field_href is '#' or empty)
function textToSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/^-|-$/g, '');
}

function addLocalePrefix(href: string, locale?: string): string {
  if (!href || href === '#') return href;
  if (!locale) return href;

  const withoutLeadingSlash = href.replace(/^\/+/, '');
  const hasLocalePrefix = withoutLeadingSlash.match(/^(ar|en)\//);

  if (hasLocalePrefix) {
    return `/${withoutLeadingSlash}`;
  }

  const localePrefix = locale !== 'en' ? `/${locale}` : '';
  return localePrefix ? `${localePrefix}/${withoutLeadingSlash}` : `/${withoutLeadingSlash}`;
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

function generateServiceHref(title: string, locale?: string): string {
  const slug = textToSlug(title);
  const path = `/services/ip-clinics/${slug}`;
  return addLocalePrefix(path, locale);
}

const IpClinicsServicesSection = ({ services }: IpClinicsServicesSectionProps) => {
  const t = useTranslations('common.filters');
  const tButtons = useTranslations('common.buttons');
  const tIpClinics = useTranslations('ipClinics');
  const locale = useLocale();

  const [servicesFilter, setServicesFilter] = useState<{
    search: string;
    serviceType: string[];
    targetGroup: string[];
  }>({
    search: '',
    serviceType: [],
    targetGroup: [],
  });

  const handleServicesFilterChange = (fieldId: string, value: string | string[]) => {
    setServicesFilter((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleServicesClear = () => {
    setServicesFilter({ search: '', serviceType: [], targetGroup: [] });
  };

  const filteredServices = services.filter((item) => {
    const searchMatch =
      !servicesFilter.search ||
      item.title.toLowerCase().includes(servicesFilter.search.toLowerCase());
    const typeMatch =
      !servicesFilter.serviceType.length ||
      servicesFilter.serviceType.includes('all') ||
      item.labels.some((l) => servicesFilter.serviceType.includes(l.toLowerCase()));
    const groupMatch =
      !servicesFilter.targetGroup.length || servicesFilter.targetGroup.includes('all');
    return searchMatch && typeMatch && groupMatch;
  });

  return (
    <>
      <Section background="primary-50" overlap>
        <h1 className="text-6xl font-medium mb-2">{tIpClinics('servicesTitle')}</h1>
      </Section>
      <Section background="neutral">
        <div className="max-w-5xl mx-auto">
          <Filters
            fields={[
              { id: 'search', label: t('search'), type: 'search', placeholder: t('search') },
            ]}
            values={servicesFilter}
            onChange={handleServicesFilterChange}
            onClear={handleServicesClear}
            showHideFilters={false}
          />
        </div>
        <div className="max-w-7xl mx-auto mt-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium mb-8 leading-[60px] tracking-[-0.96px]">
            {t('totalNumber')}: {filteredServices.length}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, idx) => {
              // Use href from Drupal, or generate from title if href is '#' or empty
              let serviceHref = service.href?.trim();

              if (isIPClinicsConsultancyService(service.title, serviceHref)) {
                serviceHref = addLocalePrefix('/services/ip-clinics/consultancy-services', locale);
              } else if (!serviceHref || serviceHref === '#' || serviceHref.length === 0) {
                serviceHref = generateServiceHref(service.title, locale);
              } else if (!serviceHref.startsWith('http')) {
                serviceHref = addLocalePrefix(serviceHref, locale);
              }

              return (
                <ServiceCard
                  key={service.title + idx}
                  title={service.title}
                  labels={service.labels}
                  description={service.description}
                  href={serviceHref}
                  primaryButtonLabel={tButtons('viewDetails')}
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

export default IpClinicsServicesSection;
