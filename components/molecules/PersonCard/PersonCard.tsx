'use client';

import Image from '@/components/atoms/Image';
import { PersonCardProps } from './PersonCard.types';
import { twMerge } from 'tailwind-merge';

export const PersonCard = ({
  image,
  name,
  title,
  className,
  variant = 'grid',
}: PersonCardProps) => {
  return (
    <div
      className={twMerge(
        'bg-white',
        variant === 'grid' ? 'box-border flex w-full flex-col' : '',
        className,
      )}
    >
      <div
        className={twMerge(
          'relative rounded-lg overflow-hidden',
          variant === 'grid' ? 'h-[420px] w-full shrink-0' : 'aspect-square',
        )}
      >
        <Image
          src={image}
          alt={name}
          aspectRatio="square"
          objectFit="cover"
          loading="lazy"
          className="w-full h-full"
        />
      </div>
      <div className="p-4 text-start">
        <h3 className="text-base font-semibold text-gray-700 mb-1">{name}</h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
};
