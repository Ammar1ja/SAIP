'use client';

import React from 'react';
import { CommentsAndSuggestionsSectionProps } from './CommentsAndSuggestionsSection.types';
import { Button } from '@/components/atoms/Button';
import { Headphones } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export const CommentsAndSuggestionsSection: React.FC<CommentsAndSuggestionsSectionProps> = ({
  title,
  description,
  buttonLabel,
  buttonHref,
}) => {
  const router = useRouter();
  const t = useTranslations('common');

  // Use props if provided, otherwise use translations
  const displayTitle = title || t('commentsAndSuggestions');
  const displayDescription = description || t('commentsAndSuggestionsDesc');
  const displayButtonLabel = buttonLabel || t('contactUs');
  const displayButtonHref = buttonHref || '/contact-us/contact-and-support';

  return (
    <div className="bg-white border border-[#D2D6DB] rounded-2xl !p-[24px] md:p-10 flex flex-col gap-6 h-auto md:h-[244px]">
      <div className="h-[48px] w-[48px] rounded-[8px] bg-[#079455] flex items-center justify-center">
        <Headphones className="h-7 w-7 text-white" aria-hidden="true" />
      </div>
      <div className="space-y-1 text-text-display">
        <h2 className="text-[18px] leading-[28px] font-medium">{displayTitle}</h2>
        <p className="text-[16px] leading-[24px] text-text-primary-paragraph">
          {displayDescription}
        </p>
      </div>
      <div>
        <Button
          intent="primary"
          size="md"
          onClick={() => router.push(displayButtonHref)}
          ariaLabel={displayButtonLabel}
          className="mt-2 w-full md:w-auto md:min-w-[111px]"
        >
          {displayButtonLabel}
        </Button>
      </div>
    </div>
  );
};

export default CommentsAndSuggestionsSection;
