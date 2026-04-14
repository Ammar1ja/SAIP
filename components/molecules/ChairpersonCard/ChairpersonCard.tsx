'use client';

import Image from '@/components/atoms/Image';
import Button from '@/components/atoms/Button';
import { twMerge } from 'tailwind-merge';
import { useLocale, useTranslations } from 'next-intl';
import { ChairpersonCardProps } from './ChairpersonCard.types';
import { ROUTES } from '@/lib/routes';
import NextImage from 'next/image';

export const ChairpersonCard = ({
  image,
  name,
  title,
  description,
  className,
}: ChairpersonCardProps) => {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const t = useTranslations('buttons');

  return (
    <section>
      <div
        data-testid="chairperson-card"
        className={twMerge(
          'flex flex-col md:flex-row items-center gap-12 self-stretch bg-primary-50 rounded-3xl p-0 md:p-12 h-[480px]',
          className,
        )}
      >
        <div className="w-full md:w-[568px] h-[480px]">
          <div className=" relative rounded-lg overflow-hidden md:w-[568px] h-[480px]">
            {image ? (
              <NextImage
                src={image}
                alt={name}
                width={568}
                height={480}
                className="w-full md:w-[568px] md:h-[480px] object-cover"
                quality={100}
              />
            ) : (
              // <Image
              //   src={image}
              //   alt={name}
              //   aspectRatio="square"
              //   objectFit="cover"
              //   quality={100}
              //   sizes="(min-width: 1024px) 500px, (min-width: 768px) 50vw, 100vw"
              //   className="w-full !md:w-[568px] !md:h-[480px]"
              // />
              //    <img
              //   src={image}
              //   alt={name}
              //   className="w-full md: w-[568px] md:h-[480px] object-cover"
              // />
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                No image available
              </div>
            )}
          </div>
        </div>
        <div className={twMerge('flex-1 text-left', isRTL && 'text-right')}>
          <div className="text-[18px] text-[#161616] mb-2">{t('herExcellency')}</div>
          <h2 className="text-[36px] font-medium text-[#161616] mb-2">{name}</h2>
          <p className="text-gray-600 mb-6">{title}</p>
          {description && <p className="text-[18px] text-gray-700 mb-6 max-w-2xl">{description}</p>}
          <div className="mt-6 md:mt-8 lg:mt-10 flex md:justify-start justify-center w-full">
            <Button
              className="w-full md:w-auto"
              href={ROUTES.MEDIA_CENTER.ABOUT_CHAIRWOMAN.ROOT}
              intent="primary"
              ariaLabel={t('readMore')}
            >
              {t('readMore')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
