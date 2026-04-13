import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import ServiceCard from '@/components/molecules/ServiceCard';
import Section from '@/components/atoms/Section';

interface IPGuideSectionProps {
  title: string;
  cards: any[];
  ctaLabel?: string;
  ctaHref?: string;
  maxCards?: number;
  mobileVariant?: 'carousel' | 'single';
  mobileMaxCards?: number;
}

const IPGuideSection = ({
  title,
  cards,
  ctaLabel,
  ctaHref,
  maxCards = 3,
  mobileVariant = 'carousel',
  mobileMaxCards,
}: IPGuideSectionProps) => {
  const visibleCards = maxCards > 0 ? cards.slice(0, maxCards) : cards;
  const mobileCards = mobileMaxCards ? cards.slice(0, mobileMaxCards) : visibleCards;

  return (
    <Section className="max-w-[1344px]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <Heading
          size="h2"
          as="h2"
          className="text-2xl leading-[32px] md:text-[36px] md:leading-[44px] md:tracking-[-0.72px] md:font-medium"
        >
          {title}
        </Heading>
        {ctaLabel && ctaHref && (
          <Button
            intent="secondary"
            outline
            href={ctaHref}
            ariaLabel={ctaLabel}
            className="hidden md:inline-flex"
          >
            {ctaLabel}
          </Button>
        )}
      </div>
      {mobileVariant === 'carousel' ? (
        <div className="md:hidden -mx-4 px-4 overflow-x-auto">
          <div className="flex gap-4 pb-2">
            {mobileCards.map((item, idx) => (
              <div key={idx} className="w-[302px] shrink-0">
                <ServiceCard {...item} className="h-full" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="md:hidden flex flex-col gap-4">
          {mobileCards.map((item, idx) => (
            <div key={idx} className="w-full">
              <ServiceCard
                {...item}
                variant="report"
                className="h-full md:!h-[394px] md:!min-h-[394px] md:!max-h-[394px]"
              />
            </div>
          ))}
        </div>
      )}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-4 md:mb-0">
        {visibleCards.map((item, idx) => (
          <div key={idx} className="w-full">
            <ServiceCard
              {...item}
              variant="report"
              className="h-full md:!h-[394px] md:!min-h-[394px] md:!max-h-[394px]"
            />
          </div>
        ))}
      </div>
      {ctaLabel && ctaHref && (
        <div
          className={
            mobileVariant === 'single'
              ? 'w-full md:hidden mt-4'
              : 'w-full px-4 md:px-6 lg:px-8 md:hidden mt-4'
          }
        >
          <Button intent="secondary" outline href={ctaHref} ariaLabel={ctaLabel} fullWidth>
            {ctaLabel}
          </Button>
        </div>
      )}
    </Section>
  );
};

export default IPGuideSection;
