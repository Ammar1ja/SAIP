'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { format as formatDate, formatDistanceToNow, parseISO } from 'date-fns';
import { DateProps } from './Date.types';
import { date } from './Date.styles';

/**
 * Date component
 */
const Date = React.forwardRef<HTMLTimeElement, DateProps>(
  ({ date: value, format = 'short', variant, size, className }, ref) => {
    const dateObj = typeof value === 'string' ? parseISO(value) : value;

    const formattedDate = (() => {
      switch (format) {
        case 'short':
          return formatDate(dateObj, 'MMM d, yyyy');
        case 'long':
          return formatDate(dateObj, 'EEEE, MMMM d, yyyy');
        case 'relative':
          return formatDistanceToNow(dateObj, { addSuffix: true });
        default:
          return formatDate(dateObj, 'MMM d, yyyy');
      }
    })();

    return (
      <time
        ref={ref}
        dateTime={dateObj.toISOString()}
        className={twMerge(date({ variant, size }), className)}
      >
        {formattedDate}
      </time>
    );
  },
);

Date.displayName = 'Date';

export default Date;
