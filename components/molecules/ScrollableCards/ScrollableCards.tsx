'use client';

import { useRef, useState, useEffect, Fragment } from 'react';
import ContentBlock from '@/components/molecules/ContentBlock';
import ArrowScroll from '@/components/molecules/ArrowScroll';
import Card from '@/components/molecules/Card';
import Section from '@/components/atoms/Section';
import Button from '@/components/atoms/Button';
import { ScrollableCardsProps } from './ScrollableCards.types';
import { cn } from '@/lib/utils/cn';
import { card } from '@/components/molecules/Card/Card.styles';
import { useDirection } from '@/context/DirectionContext';
import {
  cardTextContainer,
  cardWrapper,
  iconElement,
  iconWrapper,
  scrollableCardsContainer,
} from '@/components/molecules/ScrollableCards/ScrollableCards.styles';

export const ScrollableCards = ({
  heading,
  text,
  items = [],
  variant,
  background = 'white',
  children,
  cardWidth = 302,
  headingClassName,
}: ScrollableCardsProps) => {
  const CARD_WIDTH = cardWidth;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const dir = useDirection() || 'ltr';
  const isRtl = dir === 'rtl';

  const updateScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    const absoluteScrollLeft = Math.ceil(Math.abs(scrollLeft));
    const maxScrollableDistance = scrollWidth - clientWidth;

    setCanScrollLeft(absoluteScrollLeft > 0);
    setCanScrollRight(absoluteScrollLeft < maxScrollableDistance);
  };

  const scroll = (scrollDirection: 'left' | 'right') => {
    if (!scrollRef.current) return;
    let distance = CARD_WIDTH;

    if ((scrollDirection === 'left' && !isRtl) || (scrollDirection === 'right' && isRtl)) {
      distance = -distance;
    }

    scrollRef.current.scrollBy({ left: distance, behavior: 'smooth' });
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (!ref) return;
    updateScroll();
    ref.addEventListener('scroll', updateScroll);
    return () => ref.removeEventListener('scroll', updateScroll);
  }, []);

  const hasDescriptions = items.some((item) => item.description);

  const resolvedPadding = isRtl ? 'pl-0 md:pl-0' : 'pr-0 md:pr-0';

  return (
    <Section
      columns="asymNarrowWide"
      background={background}
      fullWidth
      rtlAwareAlign={isRtl ? 'left' : 'right'}
      responsiveAlignDirection={isRtl ? 'left' : 'right'}
      className={cn('max-w-aligned-container', resolvedPadding)}
    >
      <div className="flex flex-col justify-between gap-4">
        <ContentBlock
          className="line-clamp-10 sm:line-clamp-5 lg:line-clamp-8"
          heading={heading}
          text={text}
          headingClassName={headingClassName}
        />
        <ArrowScroll
          onScrollLeft={() => scroll('left')}
          onScrollRight={() => scroll('right')}
          disabledLeft={!canScrollLeft}
          disabledRight={!canScrollRight}
          className="hidden lg:flex"
        />
      </div>

      <div ref={scrollRef} className={cn(scrollableCardsContainer())}>
        {children
          ? children
          : items.map(({ id, icon, title, description, number, buttonLabel, buttonHref }) => (
              <Fragment key={id}>
                <Card
                  border={variant === 'pillar' ? false : undefined}
                  className={cn(
                    cardWrapper({
                      height:
                        variant === 'pillar' ? 'default' : hasDescriptions ? 'default' : 'compact',
                    }),
                    variant === 'highlight' ? card({ border: true }) : '',
                    variant === 'pillar' ? 'overflow-hidden p-6!' : '',
                  )}
                >
                  {variant === 'highlight' && (
                    <>
                      <div className={cardTextContainer()}>
                        <div className="flex">
                          <div className={iconWrapper({ variant })}>{icon}</div>
                        </div>
                        <div className={cardTextContainer({ spacing: '2' })}>
                          <h3 className="text-lg font-medium">{title}</h3>
                          {description && (
                            <div
                              className="text-sm mt-2 overflow-hidden"
                              style={
                                {
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical' as any,
                                  lineHeight: '1.4',
                                  maxHeight: '4.2em', // 3 lines * 1.4 line height
                                } as React.CSSProperties
                              }
                              dangerouslySetInnerHTML={{ __html: description }}
                            />
                          )}
                        </div>
                      </div>
                      {buttonLabel && buttonHref && (
                        <div className="mt-6 flex justify-start">
                          <Button
                            intent="primary"
                            href={buttonHref}
                            ariaLabel={buttonLabel}
                            className="w-full lg:w-auto"
                          >
                            {buttonLabel}
                          </Button>
                        </div>
                      )}
                    </>
                  )}

                  {variant === 'pillar' && (
                    <>
                      <div
                        className="absolute -top-[360px] -left-[260px] h-[560px] w-[560px] rounded-full bg-success-50 md:hidden"
                        aria-hidden
                      />
                      <div className={cn(iconWrapper({ variant }), 'left-0 right-0')} aria-hidden>
                        <svg
                          viewBox="0 0 302 320"
                          preserveAspectRatio="none"
                          className={cn(
                            iconElement(),
                            'opacity-70 hidden md:block',
                            isRtl && 'scale-x-[-1]',
                          )}
                          aria-hidden
                        >
                          <path
                            d="M118 0 L302 228"
                            stroke="#1B8354"
                            strokeWidth="1.5"
                            fill="none"
                          />
                          <path
                            d="M286 0 C302 119 282 229 196 320"
                            stroke="#1B8354"
                            strokeWidth="1.5"
                            fill="none"
                          />
                        </svg>
                      </div>
                      <div className={cardTextContainer({ variant, spacing: '2' })}>
                        <div className="text-success-700 text-[48px] leading-[60px] tracking-[-0.96px] font-medium">
                          {number}
                        </div>
                        <h3 className="text-[20px] leading-[30px] font-medium text-text-default">
                          {title}
                        </h3>
                      </div>
                    </>
                  )}
                </Card>
              </Fragment>
            ))}
      </div>
    </Section>
  );
};
