'use client';

import { useTranslations } from 'next-intl';
import { FilterToggleProps } from './FilterToggle.types';
import Button from '@/components/atoms/Button';
import { Filter } from 'lucide-react';

export const FilterToggle: React.FC<FilterToggleProps> = ({
  fields,
  values,
  onChange,
  onClear,
  onToggle,
  isOpen,
}) => {
  const t = useTranslations('common.filters');

  return (
    <div className="relative">
      <Button
        intent={isOpen ? 'outline' : 'neutral'}
        ariaLabel={t('filter') || 'Filter Toggle'}
        onClick={onToggle}
      >
        <Filter className="w-4 h-4" />
        {t('filter') || 'Filter'}
      </Button>
    </div>
  );
};
