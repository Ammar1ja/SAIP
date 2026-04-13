'use client';

import React from 'react';
import { ToggleSwitchProps } from './ToggleSwitch.types';
import { slider } from './ToggleSwitch.styles';
import { twMerge } from 'tailwind-merge';

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  className,
  ariaLabel,
  ariaDescribedby,
}) => {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <div className="relative inline-block w-12 h-6">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby}
        />
        <span className={twMerge(slider(), className)} />
      </div>
      {label && (
        <span className="text-base font-medium leading-6 tracking-normal text-text-natural">
          {label}
        </span>
      )}
    </label>
  );
};
