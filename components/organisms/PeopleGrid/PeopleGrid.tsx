'use client';

import { PersonCard } from '@/components/molecules/PersonCard';
import { Button } from '@/components/atoms/Button';
import { PeopleGridProps } from './PeopleGrid.types';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

export const PeopleGrid = ({ people, heading, description, className }: PeopleGridProps) => {
  const [isAllShown, setIsAllShown] = useState(false);
  const isMobile = useIsMobile();

  return (
    <section className={className}>
      {(heading || description) && (
        <div className="text-center mb-10">
          {heading && <h2 className="text-3xl font-medium mb-4">{heading}</h2>}
          {description && <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>}
        </div>
      )}
      <div
        className={twMerge(
          'grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          'items-start justify-center',
        )}
      >
        {(!isAllShown && isMobile ? people.slice(0, 4) : people).map((person) => (
          <PersonCard key={person.name} {...person} variant="grid" />
        ))}
      </div>
      <Button
        className="w-full md:hidden"
        onClick={() => setIsAllShown(!isAllShown)}
        intent="secondary"
        outline
        ariaLabel={isAllShown ? 'View less people' : 'View all people'}
      >
        {isAllShown ? 'Show less' : 'View all'}
      </Button>
    </section>
  );
};
