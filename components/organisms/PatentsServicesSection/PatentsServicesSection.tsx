'use client';

import { useState } from 'react';
import { Filters } from '@/components/molecules/Filters';
import ServiceCard from '@/components/molecules/ServiceCard';
import Section from '@/components/atoms/Section';
import { SERVICES_DATA, SERVICE_TYPE_OPTIONS, TARGET_GROUP_OPTIONS } from './patentsServices.data';

const PatentsServicesSection = () => {
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

  const filteredServices = SERVICES_DATA.filter((item) => {
    const searchMatch =
      !servicesFilter.search ||
      item.title.toLowerCase().includes(servicesFilter.search.toLowerCase());

    // Check if all service type options are selected (via "All" checkbox)
    const allServiceTypesSelected =
      SERVICE_TYPE_OPTIONS.length > 0 &&
      servicesFilter.serviceType.length === SERVICE_TYPE_OPTIONS.length &&
      SERVICE_TYPE_OPTIONS.every((opt) => servicesFilter.serviceType.includes(opt.value));

    const typeMatch =
      !servicesFilter.serviceType.length ||
      allServiceTypesSelected ||
      servicesFilter.serviceType.includes('all') ||
      item.labels.some((l) => servicesFilter.serviceType.includes(l.toLowerCase()));

    // Check if all target group options are selected (via "All" checkbox)
    const allTargetGroupsSelected =
      TARGET_GROUP_OPTIONS.length > 0 &&
      servicesFilter.targetGroup.length === TARGET_GROUP_OPTIONS.length &&
      TARGET_GROUP_OPTIONS.every((opt) => servicesFilter.targetGroup.includes(opt.value));

    const groupMatch =
      !servicesFilter.targetGroup.length ||
      allTargetGroupsSelected ||
      servicesFilter.targetGroup.includes('all');
    return searchMatch && typeMatch && groupMatch;
  });

  return (
    <>
      <Section background="primary-50" overlap>
        <h1 className="text-6xl font-medium mb-2">SAIP service directory</h1>
      </Section>
      <Section background="neutral">
        <div className="max-w-5xl mx-auto">
          <Filters
            fields={[
              { id: 'search', label: 'Search', type: 'search', placeholder: 'Search' },
              {
                id: 'serviceType',
                label: 'Service type',
                type: 'select',
                options: SERVICE_TYPE_OPTIONS,
                multiselect: true,
              },
              {
                id: 'targetGroup',
                label: 'Target group',
                type: 'select',
                options: TARGET_GROUP_OPTIONS,
                multiselect: true,
              },
            ]}
            values={servicesFilter}
            onChange={handleServicesFilterChange}
            onClear={handleServicesClear}
            showHideFilters={false}
          />
        </div>
        <div className="max-w-7xl mx-auto mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, idx) => (
              <ServiceCard
                key={service.title + idx}
                title={service.title}
                labels={service.labels}
                description={service.description}
                href={service.href}
                primaryButtonLabel="View details"
                primaryButtonHref={service.href}
              />
            ))}
          </div>
        </div>
      </Section>
    </>
  );
};

export default PatentsServicesSection;
