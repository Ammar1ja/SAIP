'use client';

import { useMemo } from 'react';
import FilterableCardsSection from '@/components/organisms/FilterableCardsSection';
import ServiceCard from '@/components/molecules/ServiceCard';
import { ServiceDirectoryData } from '@/lib/drupal/services/service-directory.service';
import { useTranslations } from 'next-intl';

interface ServiceDirectoryContentProps {
  data: ServiceDirectoryData;
}

export default function ServiceDirectoryContent({ data }: ServiceDirectoryContentProps) {
  const t = useTranslations('common.buttons');
  const tFilters = useTranslations('common.filters');
  const tService = useTranslations('serviceDirectory');
  const getCategoryIds = (service: ServiceDirectoryData['services'][0]) => [
    ...(service.ipCategoryIds || []),
    ...(service.serviceCategoryIds || []),
  ];

  const getServiceTypeIds = (service: ServiceDirectoryData['services'][0]) =>
    service.serviceTypeIds || [];

  const getTargetGroupIds = (service: ServiceDirectoryData['services'][0]) =>
    service.targetGroupIds || [];

  const categoryCounts = useMemo(() => {
    const counts = Object.fromEntries(data.categoryOptions.map((def) => [def.value, 0]));
    data.services.forEach((service) => {
      const ids = getCategoryIds(service);
      ids.forEach((id) => {
        if (id in counts) counts[id] += 1;
      });
    });
    return counts;
  }, [data.services, data.categoryOptions]);

  const serviceTypeCounts = useMemo(() => {
    const counts = Object.fromEntries(data.serviceTypeOptions.map((def) => [def.value, 0]));
    data.services.forEach((service) => {
      const ids = getServiceTypeIds(service);
      ids.forEach((id) => {
        if (id in counts) counts[id] += 1;
      });
    });
    return counts;
  }, [data.services, data.serviceTypeOptions]);

  const targetGroupCounts = useMemo(() => {
    const counts = Object.fromEntries(data.targetGroupOptions.map((def) => [def.value, 0]));
    data.services.forEach((service) => {
      const ids = getTargetGroupIds(service);
      ids.forEach((id) => {
        if (id in counts) counts[id] += 1;
      });
    });
    return counts;
  }, [data.services, data.targetGroupOptions]);

  const categoryOptions = useMemo(
    () =>
      data.categoryOptions.map((def) => ({
        value: def.value,
        label: def.label,
        count: categoryCounts[def.value],
        disabled: categoryCounts[def.value] === 0,
      })),
    [categoryCounts, data.categoryOptions],
  );

  const serviceTypeOptions = useMemo(
    () =>
      data.serviceTypeOptions.map((def) => ({
        value: def.value,
        label: def.label,
        count: serviceTypeCounts[def.value],
        disabled: serviceTypeCounts[def.value] === 0,
      })),
    [serviceTypeCounts, data.serviceTypeOptions],
  );

  const targetGroupOptions = useMemo(
    () =>
      data.targetGroupOptions.map((def) => ({
        value: def.value,
        label: def.label,
        count: targetGroupCounts[def.value],
        disabled: targetGroupCounts[def.value] === 0,
      })),
    [targetGroupCounts, data.targetGroupOptions],
  );

  const serviceDirectoryFilterFunction = (
    items: ServiceDirectoryData['services'],
    filterValues: Record<string, string | string[]>,
  ) => {
    return items.filter((item) => {
      const search =
        typeof filterValues.search === 'string' ? filterValues.search.toLowerCase().trim() : '';
      const matchesSearch =
        !search ||
        (item.title && item.title.toLowerCase().includes(search)) ||
        (item.description && item.description.toLowerCase().includes(search));

      const categoryFilter = filterValues.category;
      const categoryValues = Array.isArray(categoryFilter)
        ? categoryFilter
        : categoryFilter
          ? [categoryFilter]
          : [];
      const itemCategoryKeys = getCategoryIds(item);
      const matchesCategory =
        categoryValues.length === 0 ||
        categoryValues.some((value) => itemCategoryKeys.includes(value));

      const serviceTypeFilter = filterValues.serviceType;
      const serviceTypeValues = Array.isArray(serviceTypeFilter)
        ? serviceTypeFilter
        : serviceTypeFilter
          ? [serviceTypeFilter]
          : [];
      const itemServiceTypeKeys = getServiceTypeIds(item);
      const matchesServiceType =
        serviceTypeValues.length === 0 ||
        serviceTypeValues.some((value) => itemServiceTypeKeys.includes(value));

      const targetGroupFilter = filterValues.targetGroup;
      const targetGroupValues = Array.isArray(targetGroupFilter)
        ? targetGroupFilter
        : targetGroupFilter
          ? [targetGroupFilter]
          : [];
      const itemTargetGroupKeys = getTargetGroupIds(item);
      const matchesTargetGroup =
        targetGroupValues.length === 0 ||
        targetGroupValues.some((value) => itemTargetGroupKeys.includes(value));

      return matchesSearch && matchesCategory && matchesServiceType && matchesTargetGroup;
    });
  };

  const filterFields = [
    {
      id: 'search',
      label: tFilters('search'),
      type: 'search' as const,
      placeholder: tFilters('search'),
    },
    {
      id: 'category',
      label: tFilters('category'),
      type: 'select' as const,
      options: categoryOptions,
      multiselect: true,
    },
    {
      id: 'serviceType',
      label: tFilters('serviceType'),
      type: 'select' as const,
      options: serviceTypeOptions,
      multiselect: true,
    },
    {
      id: 'targetGroup',
      label: tFilters('targetGroup'),
      type: 'select' as const,
      options: targetGroupOptions,
      multiselect: true,
    },
  ];

  const cardRenderer = (service: ServiceDirectoryData['services'][0]) => {
    const ignoreLabels = new Set(['service', 'general', 'خدمة', 'عام']);
    const displayLabels = [service.category, service.serviceType]
      .filter((label): label is string => Boolean(label))
      .filter((label) => !ignoreLabels.has(label.toLowerCase().trim()));

    return (
      <ServiceCard
        key={service.id}
        title={service.title}
        labels={displayLabels}
        description={service.description}
        href={service.href}
        variant="services"
        className="h-[358px]"
        primaryButtonLabel={t('viewDetails')}
        primaryButtonHref={service.href}
      />
    );
  };

  return (
    <FilterableCardsSection
      items={data.services}
      filterFields={filterFields}
      filterFunction={serviceDirectoryFilterFunction}
      cardRenderer={cardRenderer}
      filtersInSeparateSection
      filterColumns={4}
      gridColumns={{
        base: 1,
        sm: 2,
        lg: 3,
      }}
      gridGap="gap-6"
      showTotalCount={true}
      totalCountLabel={tService('totalNumberOfServices')}
      cardsBackground="white"
      filtersVariant="services"
      filtersStyles="max-w-[1062px] mx-auto border-[#D2D6DB] shadow-none rounded-[24px]"
      filtersComponentStyles="max-w-[1280px] gap-8 flex flex-col xl:items-center xl:justify-center xl:p-0 xl:-translate-y-[64px]"
      filtersContainerClassName="max-w-[1280px] mx-auto px-4 md:px-8 xl:px-0"
      containerClassName="max-w-[1280px] mx-auto px-4 md:px-8 xl:px-0 xl:-translate-y-[64px]"
      pagination={{ enabled: true, pageSize: 12 }}
    />
  );
}
