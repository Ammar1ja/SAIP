'use client';

import React from 'react';
import { InternationalTreatyDetail } from '@/lib/drupal/services/international-treaties-detail.service';
import { ActionIcons } from '@/components/molecules/ActionIcons';

interface TreatyDetailContentProps {
  treaty: InternationalTreatyDetail;
}

export function TreatyDetailContent({ treaty }: TreatyDetailContentProps) {
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.share?.({ title: treaty.title, url: window.location.href });
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownload = () => {
    console.log('Download clicked');
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-medium text-gray-900 max-w-[700px]">
          {treaty.title}
        </h2>
        <ActionIcons
          onShare={handleShare}
          onPrint={handlePrint}
          onDownload={handleDownload}
          size="md"
        />
      </div>

      <div className="prose prose-lg max-w-[700px]">
        {treaty.description && (
          <p className="text-gray-700 leading-relaxed mb-6">{treaty.description}</p>
        )}
        {treaty.content &&
          treaty.content !== treaty.description &&
          treaty.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-gray-700 leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
      </div>
    </div>
  );
}
