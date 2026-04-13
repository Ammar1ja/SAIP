'use client';

import { useState, useEffect, useRef } from 'react';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import Section from '@/components/atoms/Section';
import TableOfContent from '@/components/organisms/TableOfContent';
import { TOC_ITEMS } from '@/components/organisms/TableOfContent/TableOfContent.data';
import { SECTION_IDS, type SectionId, JOURNEY_SECTIONS } from './patentsJourney.data';

const PatentsJourneySection = () => {
  const [activeTocId, setActiveTocId] = useState<SectionId>('guidance');

  const sectionRefs = SECTION_IDS.reduce(
    (acc, id) => ({
      ...acc,
      [id]: useRef<HTMLDivElement | null>(null),
    }),
    {} as Record<SectionId, React.RefObject<HTMLDivElement | null>>,
  );

  useEffect(() => {
    const handleScroll = () => {
      let current: SectionId = 'guidance';
      for (const id of SECTION_IDS) {
        const ref = sectionRefs[id];
        if (ref && ref.current) {
          const { top } = ref.current.getBoundingClientRect();
          if (top < 120) current = id;
        }
      }
      setActiveTocId(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTocClick = (id: string) => {
    const ref = sectionRefs[id as SectionId];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveTocId(id as SectionId);
    }
  };

  return (
    <Section background="neutral-25" className="flex flex-row gap-8 items-start">
      <div className="sticky top-24 self-start z-10">
        <TableOfContent
          items={TOC_ITEMS}
          activeId={activeTocId}
          onItemClick={handleTocClick}
          ariaLabel="Patents journey navigation"
        />
      </div>
      <div className="flex-1 min-w-0">
        {SECTION_IDS.map((id) => {
          const section = JOURNEY_SECTIONS[id];
          return (
            <div key={id} ref={sectionRefs[id]} id={id} className="mb-10">
              <Heading
                size="custom"
                as="h2"
                weight="medium"
                color="primary"
                className="mb-6 text-4xl leading-11 md:text-display-lg"
              >
                {section.title}
              </Heading>
              {section.buttonLabel ? (
                <div className="rounded-xl border border-neutral-200 p-6 flex flex-row items-center justify-between gap-4 bg-white">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-row items-center justify-between gap-4">
                      <h3 className="text-xl font-semibold mb-0">{section.title}</h3>
                      <Button
                        intent="primary"
                        href={section.buttonHref}
                        ariaLabel={`Go to ${section.title}`}
                      >
                        {section.buttonLabel}
                      </Button>
                    </div>
                    <p className="text-neutral-700 mt-2 text-base max-w-2xl">
                      {section.description}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mb-8">{section.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
};

export default PatentsJourneySection;
