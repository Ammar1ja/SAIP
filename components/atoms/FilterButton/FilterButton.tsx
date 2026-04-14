import React from 'react';
import clsx from 'clsx';

import { twMerge } from 'tailwind-merge';
import Button from '../Button';

export interface FilterButtonProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  rounded?: 'start' | 'end' | 'full';
  className?: string;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  active = false,
  onClick,
  rounded = 'full',
  className,
}) => {
  const intent = active ? 'neutral' : 'secondary';
  const outline = !active;
  const size = 'md';

  // Use CSS logical properties for RTL support:
  // rounded-e-none = removes end rounding (right in LTR, left in RTL)
  // rounded-s-none = removes start rounding (left in LTR, right in RTL)
  const roundedClasses = clsx(
    rounded === 'full' ? 'rounded-full' : 'rounded-lg',
    rounded === 'start' && 'rounded-e-none',
    rounded === 'end' && 'rounded-s-none',
    rounded === 'full' && 'rounded-md',
  );

  const finalClassName = twMerge(roundedClasses, className, '!rounded-[8px] !h-[40px]');

  return (
    <Button
      onClick={onClick}
      intent={intent}
      outline={outline}
      size={size}
      className={finalClassName}
      ariaLabel="Filter button"
    >
      {label}
    </Button>
  );
};

export default FilterButton;
