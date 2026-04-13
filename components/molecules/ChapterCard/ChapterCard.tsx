import React from 'react';
import Card from '@/components/molecules/Card';
import { ChapterCardProps } from './ChapterCard.types';

/**
 * ChapterCard displays a static chapter block with chapter number and subtitle.
 */
export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, title, className }) => (
  <Card
    className={`flex flex-col items-start gap-1 bg-white rounded-2xl px-8 py-6 shadow-md ${className || ''}`}
    shadow
    border={false}
    ariaLabel={`Chapter ${chapter}: ${title}`}
  >
    <span className="text-sm text-neutral-500 font-medium mb-1">Chapter {chapter}</span>
    <span className="text-lg font-medium text-neutral-900">{title}</span>
  </Card>
);
