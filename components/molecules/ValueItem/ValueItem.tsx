import Icon from '@/components/atoms/Icon';
import { IconBackground } from '@/components/atoms/Icon/Icon.types';
import Link from 'next/link';
import { ComponentType } from 'react';
import { useDirection } from '@/context/DirectionContext';
import { twMerge } from 'tailwind-merge';

type ValueItemProps = {
  icon?: string | ComponentType<any>;
  alt?: string;
  title?: string;
  description: string;
  background?: IconBackground;
  borderColor?: 'white' | 'black';
  variant?: 'default' | 'text-only';
  href?: string;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export const ValueItem = ({
  icon,
  alt,
  title,
  description,
  background = 'white',
  borderColor = 'white',
  variant = 'default',
  href,
  className,
  iconClassName,
  titleClassName,
  descriptionClassName,
}: ValueItemProps) => {
  const dir = useDirection() || 'ltr';
  const isRtl = dir === 'rtl';

  // RTL-aware border and padding classes
  const borderClass = isRtl
    ? borderColor === 'white'
      ? 'border-r-white border-r'
      : 'border-r-black border-r'
    : borderColor === 'white'
      ? 'border-l-white border-l'
      : 'border-l-black border-l';
  const paddingClass = isRtl ? 'pr-4' : 'pl-4';

  if (variant === 'text-only') {
    return (
      <div className={twMerge(`${borderClass} ${paddingClass} py-4`, className)}>
        <p
          className={twMerge('text-sm leading-relaxed', descriptionClassName)}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    );
  }

  return (
    <div className={twMerge(`${borderClass} ${paddingClass} py-6 text-start`, className)}>
      <Icon
        src={typeof icon === 'string' ? icon : undefined}
        component={typeof icon === 'string' ? undefined : icon}
        alt={alt}
        background={background}
        className={twMerge('rounded-sm', iconClassName)}
        size="large"
      />
      {href ? (
        <h3
          className={twMerge(
            'mt-4 mb-2 text-[20px] leading-[30px] font-medium tracking-normal text-text-default',
            titleClassName,
          )}
        >
          <Link
            href={href}
            className="text-inherit hover:underline hover:text-primary-700 transition-colors"
          >
            {title}
          </Link>
        </h3>
      ) : (
        <h3
          className={twMerge(
            'mt-4 mb-2 text-[20px] leading-[30px] font-medium tracking-normal text-text-default',
            titleClassName,
          )}
        >
          {title}
        </h3>
      )}
      <p
        className={twMerge(
          'text-[16px] leading-[24px] font-normal text-text-primary-paragraph',
          descriptionClassName,
        )}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};
