'use client';

import Arrow from '@/components/atoms/Arrow';
import { ArrowScrollProps } from './ArrowScroll.types';
import { cn } from '@/lib/utils/cn';

export const ArrowScroll = ({
  intent = 'primary',
  onScrollLeft,
  onScrollRight,
  disabledLeft = false,
  disabledRight = false,
  className,
}: ArrowScrollProps) => {
  return (
    <div
      className={cn('flex items-center gap-4', className)}
      role="group"
      aria-label="Scroll controls"
    >
      <button
        type="button"
        onClick={onScrollLeft}
        disabled={disabledLeft}
        aria-label="Scroll left"
        className="disabled:cursor-not-allowed"
      >
        <Arrow
          direction="left"
          background={disabledLeft ? 'disabled' : intent === 'primary' ? 'primary' : 'natural'}
        />
      </button>

      <button
        type="button"
        onClick={onScrollRight}
        disabled={disabledRight}
        aria-label="Scroll right"
        className="disabled:cursor-not-allowed"
      >
        <Arrow
          direction="right"
          background={disabledRight ? 'disabled' : intent === 'primary' ? 'primary' : 'natural'}
        />
      </button>
    </div>
  );
};
