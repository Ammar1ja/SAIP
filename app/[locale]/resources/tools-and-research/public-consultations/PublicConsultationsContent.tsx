'use client';

import React, { useState } from 'react';
import ServiceCard from '@/components/molecules/ServiceCard';
import Pagination from '@/components/atoms/Pagination';
import { ConsultationCardData } from '@/lib/drupal/services/public-consultations.service';

const ITEMS_PER_PAGE = 9;

interface PublicConsultationsContentProps {
  sectionHeading: string;
  consultations: ConsultationCardData[];
}

export function PublicConsultationsContent({
  sectionHeading,
  consultations,
}: PublicConsultationsContentProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(consultations.length / ITEMS_PER_PAGE);
  const paginatedCards = consultations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 pt-20 pb-16">
      <h2 className="mb-8 max-w-[720px] text-[36px] font-medium leading-[44px] tracking-[-0.02em] text-text-default">
        {sectionHeading}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedCards.map((card, index) => (
          <ServiceCard
            key={(currentPage - 1) * ITEMS_PER_PAGE + index}
            title={card.title}
            durationDate={card.durationDate}
            primaryButtonLabel={card.primaryButtonLabel}
            primaryButtonHref={card.primaryButtonHref}
            variant="consultation"
            titleBg="default"
          />
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          showFirstLast={true}
        />
      </div>
    </div>
  );
}
