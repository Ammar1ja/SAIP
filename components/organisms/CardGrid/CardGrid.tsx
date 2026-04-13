'use client';

import React, { useState, useEffect } from 'react';
import Section from '@/components/atoms/Section';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';
import CardContent from '@/components/atoms/CardContent';
import Icon from '@/components/atoms/Icon';
import { IconProps } from '@/components/atoms/Icon/Icon.types';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';
import { SectionProps } from '@/components/atoms/Section/Section.types';

export interface CardGridItem {
  title?: string;
  description?: string;
  icon: {
    component?: IconProps['component'];
    src?: string; // URL for icon image (from Drupal)
    alt?: string;
    size?: IconProps['size'];
    svgSize?: IconProps['svgSize'];
    background?: IconProps['background'];
    className?: string;
  };
}

interface CardGridProps {
  items: CardGridItem[];
  heading?: string;
  text?: string;
  showViewAll?: boolean;
  className?: string;
  containerClassName?: string;
  headingClassName?: string;
  headingWrapperClassName?: string;
  gridClassName?: string;
  cardClassName?: string;
  cardContentClassName?: string;
  cardIconClassName?: string;
  titleClassName?: string;
  cardDescriptionClassName?: string;
  textClassName?: string;
  background?: SectionProps['background'];
  padding?: SectionProps['padding'];
  fullWidth?: SectionProps['fullWidth'];
}

export const CardGrid = ({
  items,
  heading,
  text,
  showViewAll = false,
  className = '',
  containerClassName,
  headingClassName,
  headingWrapperClassName,
  gridClassName,
  cardClassName,
  cardContentClassName,
  cardIconClassName,
  titleClassName,
  cardDescriptionClassName,
  textClassName,
  background = 'neutral',
  padding = 'default',
  fullWidth = false,
}: CardGridProps) => {
  const t = useTranslations('buttons');
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = React.useRef<HTMLDivElement>(null);

  const INITIAL_ITEMS_COUNT = isMobile ? 3 : 6;

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleToggle = () => {
    const newShowAll = !showAll;
    setShowAll(newShowAll);

    // Scroll to section top when collapsing
    if (!newShowAll && sectionRef.current) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Show 6 items initially (Tilek's improvement), then all when "View all" is clicked
  const displayedItems = showAll
    ? items
    : items.slice(0, Math.min(INITIAL_ITEMS_COUNT, items.length));

  const sectionClassName = twMerge('px-4 md:px-8', className);
  const headerClassName = twMerge(
    'flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10',
    headingWrapperClassName,
  );
  const gridClass = twMerge('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6', gridClassName);
  const cardClass = twMerge(
    'p-6 rounded-2xl bg-white border border-[#D2D6DB] flex flex-col items-start flex-1',
    cardClassName,
  );
  const cardTitleClass = twMerge(
    'text-sm md:text-base font-normal text-gray-800 line-clamp-3 break-words overflow-hidden',
    titleClassName,
  );

  return (
    <Section
      background={background}
      className={twMerge(sectionClassName, containerClassName)}
      padding={padding}
      fullWidth={fullWidth}
    >
      <div ref={sectionRef}>
        {(heading || text) && (
          <div className={headerClassName}>
            <div className="flex flex-col gap-4">
              {heading && (
                <h2
                  className={
                    headingClassName || 'text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900'
                  }
                >
                  {heading}
                </h2>
              )}
              {text && <p className={twMerge('text-gray-600', textClassName)}>{text}</p>}
            </div>
            {showViewAll && items.length > INITIAL_ITEMS_COUNT && (
              <div className="hidden md:block">
                <Button
                  intent="secondary"
                  outline
                  size="md"
                  onClick={handleToggle}
                  ariaLabel={showAll ? t('viewLess') : t('viewAll')}
                >
                  {showAll ? t('viewLess') : t('viewAll')}
                </Button>
              </div>
            )}
          </div>
        )}

        <div className={gridClass}>
          {displayedItems.map((item, index) => (
            <Card key={index} className={cardClass} shadow={false} border={true}>
              <CardContent
                title={item.title}
                titleClassName={cardTitleClass}
                description={item.description}
                descriptionClassName={cardDescriptionClassName}
                className={twMerge(
                  'flex flex-col items-start gap-6 flex-1 w-full !space-y-0',
                  cardContentClassName,
                )}
                iconClassName={twMerge('mb-0', cardIconClassName)}
                icon={
                  <Icon
                    component={item.icon.component}
                    src={item.icon.src}
                    alt={item.icon.alt}
                    size={item.icon.size || 'medium'}
                    svgSize={item.icon.svgSize}
                    background={item.icon.background}
                    className={item.icon.className}
                  />
                }
              />
            </Card>
          ))}
        </div>

        {showViewAll && items.length > INITIAL_ITEMS_COUNT && isMobile && (
          <div className="mt-8 md:hidden">
            <Button
              intent="secondary"
              outline
              size="md"
              onClick={handleToggle}
              ariaLabel={showAll ? t('showLess') : t('viewAll')}
              fullWidth
            >
              {showAll ? t('showLess') : t('viewAll')}
            </Button>
          </div>
        )}
      </div>
    </Section>
  );
};
