'use client';

import { FC, useMemo } from 'react';
import FilterableCardsSection from '@/components/organisms/FilterableCardsSection';
import ServiceCard from '@/components/molecules/ServiceCard';
import { IpAgentsSectionProps, IpAgent } from './IpAgentsSection.types';
import FeedbackSection from '@/components/organisms/FeedbackSection';
import CategoryFigmaIcon from '@/components/icons/ip-agents/CategoryFigmaIcon';
import LocationFigmaIcon from '@/components/icons/ip-agents/LocationFigmaIcon';
import EmailFigmaIcon from '@/components/icons/ip-agents/EmailFigmaIcon';
import PhoneFigmaIcon from '@/components/icons/ip-agents/PhoneFigmaIcon';

const IpAgentsSection: FC<IpAgentsSectionProps> = ({ agents, translations }) => {
  // Build dynamic category options from agents data
  const categoryOptions = useMemo(() => {
    const allCategories = new Set<string>();
    agents.forEach((agent) => {
      agent.categories.forEach((cat) => allCategories.add(cat));
    });
    return Array.from(allCategories)
      .sort()
      .map((cat) => ({ value: cat, label: cat }));
  }, [agents]);

  // Build dynamic location options from agents data
  const locationOptions = useMemo(() => {
    const allLocations = new Set<string>();
    agents.forEach((agent) => {
      if (agent.location) {
        allLocations.add(agent.location);
      }
    });
    return Array.from(allLocations)
      .sort()
      .map((loc) => ({ value: loc, label: loc }));
  }, [agents]);

  const filterFields = [
    {
      id: 'search',
      label: translations.search,
      type: 'search' as const,
      placeholder: translations.search,
    },
    {
      id: 'category',
      label: translations.category,
      type: 'select' as const,
      placeholder: translations.select,
      options: categoryOptions,
    },
    {
      id: 'location',
      label: translations.location,
      type: 'select' as const,
      placeholder: translations.select,
      options: locationOptions,
    },
  ];

  const filterAgents = (items: IpAgent[], values: Record<string, string | string[]>) => {
    const search = typeof values.search === 'string' ? values.search.toLowerCase() : '';

    const category = typeof values.category === 'string' && values.category ? values.category : '';

    const location = typeof values.location === 'string' ? values.location : '';

    return items.filter((a) => {
      const matchSearch = !search || a.name.toLowerCase().includes(search);
      const matchCategory = !category || a.categories.includes(category);
      const matchLocation = !location || a.location === location;
      return matchSearch && matchCategory && matchLocation;
    });
  };

  const cardRenderer = (agent: IpAgent) => (
    <div key={agent.id} className="h-[326px] min-h-[196px] w-full min-w-0 shrink-0">
      <ServiceCard
        title={agent.name}
        variant="detailed"
        className="h-full min-h-0"
        details={[
          {
            icon: <LocationFigmaIcon className="w-4 h-4" />,
            label: translations.locationLabel,
            value: agent.location,
          },
          {
            icon: <EmailFigmaIcon className="w-4 h-4" />,
            label: translations.emailLabel,
            value: agent.email,
            href: agent.email ? `mailto:${agent.email}` : undefined,
          },
          {
            icon: <PhoneFigmaIcon className="w-4 h-4" />,
            label: translations.phoneLabel,
            value: agent.phone,
            href: agent.phone ? `tel:${agent.phone}` : undefined,
          },
          {
            icon: <CategoryFigmaIcon className="w-4 h-4" />,
            label: translations.categoryLabel,
            value: agent.categories,
          },
        ]}
        primaryButtonLabel={null}
        secondaryButtonLabel={null}
      />
    </div>
  );

  return (
    <div className="py-8">
      <FilterableCardsSection<IpAgent>
        items={agents}
        filterFields={filterFields}
        filterColumns={3}
        gridColumns={{ base: 1, md: 2 }}
        gridGap="gap-x-6 gap-y-6"
        cardRenderer={cardRenderer}
        filterFunction={filterAgents}
        showTotalCount={true}
        totalCountLabel={translations.totalNumber}
        totalCountClassName="mb-8 mt-8 text-[36px] font-medium leading-[44px] tracking-[-0.02em] text-text-default"
        cardsBackground="white"
        pagination={{ enabled: true, pageSize: 6 }}
        filtersVariant="ipAgents"
        containerClassName="max-w-[1280px] mx-auto"
      />
      <FeedbackSection />
    </div>
  );
};

export default IpAgentsSection;
