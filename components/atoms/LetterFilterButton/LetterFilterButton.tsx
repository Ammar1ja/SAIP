'use client';

import React from 'react';
import { LetterFilterButtonProps } from './LetterFilterButton.types';
import { letterButton } from './LetterFilterButton.styles';
import { twMerge } from 'tailwind-merge';

export const LetterFilterButton: React.FC<LetterFilterButtonProps> = ({
  label,
  selected = false,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={twMerge(letterButton({ selected }), className)}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
};
