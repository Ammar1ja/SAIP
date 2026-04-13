'use client';

import Card from '@/components/molecules/Card';
import Image from '@/components/atoms/Image';
import Button from '@/components/atoms/Button';
import { ExternalLink } from 'lucide-react';
import { PartnerCardProps } from './PartnerCard.types';
import { partnerCard } from './PartnerCard.styles';
import { useIsMobile } from '@/hooks/useIsMobile';

const PartnerCard = ({
  logo,
  name,
  website,
  websiteLabel = 'Go to website',
  className,
}: PartnerCardProps) => {
  const isMobile = useIsMobile();
  const isClickable = Boolean(website) && isMobile;

  const cardContent = (
    <Card
      className={partnerCard({
        className:
          `${className || ''} ${isClickable ? 'cursor-pointer hover:shadow-md' : ''}`.trim(),
      })}
      border
    >
      <Image
        src={logo?.url || ''}
        alt={logo?.alt || name}
        className="mx-auto mb-2 h-16 w-full max-w-[280px] sm:h-20"
        objectFit="contain"
      />
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="mb-2 text-base font-medium leading-6 text-text-default sm:text-lg sm:leading-7">
          {name}
        </div>
      </div>
      {!isMobile && website && (
        <Button
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          intent="primary"
          size="md"
          className="flex items-center justify-center gap-2 min-w-[160px]"
          ariaLabel={websiteLabel}
        >
          <ExternalLink size={18} className="mr-2" />
          {websiteLabel}
        </Button>
      )}
    </Card>
  );

  if (isClickable && website) {
    return (
      <a href={website} target="_blank" rel="noopener noreferrer" aria-label={websiteLabel}>
        {cardContent}
      </a>
    );
  }

  return cardContent;
};

export default PartnerCard;
