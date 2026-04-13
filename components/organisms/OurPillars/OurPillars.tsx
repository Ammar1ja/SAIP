import ScrollableCards from '@/components/molecules/ScrollableCards';
import { OurPillarsProps } from './OurPillars.types';

export const OurPillars = ({ pillars, heading, text }: OurPillarsProps) => {
  const items = pillars.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    number: p.number,
  }));

  return (
    <ScrollableCards
      heading={heading}
      text={text}
      items={items}
      variant="pillar"
      headingClassName="font-medium text-5xl leading-[60px] tracking-[-0.96px]"
    />
  );
};
