'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import FilterButton from '@/components/atoms/FilterButton/FilterButton';

interface FilterButtonGroupProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
  buttonClassName?: string;
}

export const FilterButtonGroup: React.FC<FilterButtonGroupProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
  buttonClassName,
}) => {
  return (
    <div className={twMerge('flex overflow-x-auto pb-1', className)}>
      {tabs.map((tab, index) => (
        <FilterButton
          key={tab}
          label={tab}
          active={tab === activeTab}
          onClick={() => onTabChange(tab)}
          rounded={
            tabs.length === 1
              ? 'full'
              : index === 0
                ? 'start'
                : index === tabs.length - 1
                  ? 'end'
                  : 'full'
          }
          className={twMerge('flex-shrink-0', buttonClassName)}
        />
      ))}
    </div>
  );
};

export default FilterButtonGroup;
