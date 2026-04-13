import ValueItem from '@/components/molecules/ValueItem';
import Heading from '@/components/atoms/Heading';
import { IconBackground } from '@/components/atoms/Icon/Icon.types';

export type ServiceItem = {
  icon: any;
  alt: string;
  title: string;
  description: string;
  background?: IconBackground;
  borderColor?: 'white' | 'black';
  href?: string;
};

interface ServicesDiscoverProps {
  items: ServiceItem[];
  heading?: string;
}

const ServicesDiscover = ({ items, heading = 'Discover services' }: ServicesDiscoverProps) => {
  return (
    <>
      <Heading
        as="h2"
        size="custom"
        weight="medium"
        color="default"
        className="pb-6 text-[24px] leading-[32px] sm:text-[30px] sm:leading-[38px] md:text-[36px] md:leading-[44px] lg:text-[48px] lg:leading-[60px] tracking-[-0.02em]"
      >
        {heading}
      </Heading>
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-3 md:gap-10 text-black">
        {items.map((value) => (
          <ValueItem
            key={value.title}
            icon={value.icon}
            alt={value.alt}
            title={value.title}
            description={value.description}
            background={value.background}
            borderColor={value.borderColor}
            href={value.href}
            className="min-w-[240px] max-w-[280px] snap-start md:min-w-0 md:max-w-none"
          />
        ))}
      </div>
    </>
  );
};

export default ServicesDiscover;
