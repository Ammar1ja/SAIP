'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { VerificationInfoItemProps } from './VerificationInfoItem.types';

export const VerificationInfoItem = ({
  icon,
  title,
  description,
  highlightText,
  className,
  titleClassName,
  descriptionClassName,
}: VerificationInfoItemProps) => {
  const renderTextWithHighlight = (text: string | React.ReactNode, highlight?: string) => {
    if (typeof text !== 'string') return text;
    if (!highlight) return text;

    const parts = text.split(highlight);
    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && (
              <span className="text-green-700 font-semibold">{highlight}</span>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  // If no title but has description, center align items
  const shouldCenter = !title && description;

  return (
    <div
      className={`flex gap-4 ${shouldCenter ? 'items-center' : 'items-start'} ${className || ''}`}
    >
      <div className={`flex-shrink-0 ${shouldCenter ? '' : 'mt-1'}`}>{icon}</div>
      <div className="flex-1">
        {title && (
          <h3
            className={twMerge(
              'mb-1.5 font-body text-base font-medium leading-6 text-text-default',
              titleClassName,
            )}
          >
            {highlightText ? renderTextWithHighlight(title, highlightText) : title}
          </h3>
        )}
        {description && (
          <p
            className={twMerge(
              'font-body text-sm font-normal leading-6 text-text-primary-paragraph',
              descriptionClassName,
            )}
          >
            {highlightText ? renderTextWithHighlight(description, highlightText) : description}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerificationInfoItem;
