import React from 'react';
import { SpinnerProps } from './Spinner.types';
import { twMerge } from 'tailwind-merge';

const Spinner: React.FC<SpinnerProps> = ({
  size = 32,
  colorClass = 'text-primary-600',
  className,
  ariaLabel = 'Loading...',
  role = 'status',
  ariaLive = 'polite',
  ariaHidden = false,
}) => {
  return (
    <div
      className={twMerge('inline-block animate-spin', className)}
      style={{ width: size, height: size }}
      role={role}
      aria-label={!ariaHidden ? ariaLabel : undefined}
      aria-live={!ariaHidden ? ariaLive : undefined}
      aria-hidden={ariaHidden}
    >
      <svg
        className={twMerge('w-full h-full', colorClass)}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export default Spinner;
