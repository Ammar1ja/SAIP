'use client';

import React from 'react';
import { ConsultationDetailData } from '@/lib/drupal/services/public-consultations.service';

interface ConsultationDetailContentProps {
  data: ConsultationDetailData;
}

// Convert double line breaks to paragraph tags
function formatContent(content: string): string {
  if (content.includes('<p>') || content.includes('<div>')) {
    return content;
  }

  return content
    .split(/\n\s*\n/)
    .filter((para) => para.trim())
    .map((para) => `<p>${para.trim().replace(/\n/g, '<br>')}</p>`)
    .join('');
}

export function ConsultationDetailContent({ data }: ConsultationDetailContentProps) {
  const formattedContent = formatContent(data.content);

  return (
    <div className="max-w-screen-lg mx-auto px-4 md:px-8 py-16">
      <div className="flex justify-start">
        <div className="w-full max-w-full md:max-w-[60%]">
          <h2 className="mb-4 text-lg font-medium text-text-default md:text-xl lg:text-2xl rtl:text-right">
            {data.title}
          </h2>

          {/* Content with preserved paragraph breaks */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-gray-900 prose-headings:font-semibold
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
              prose-ul:text-gray-700 prose-ol:text-gray-700
              prose-li:my-2
              [&>p]:mb-4 [&>p]:mt-0
              rtl:text-right"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        </div>
      </div>
    </div>
  );
}
