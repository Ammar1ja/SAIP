import { FC } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/atoms/Button';
import { DetailSidebarProps } from './DetailSidebar.types';
import { twMerge } from 'tailwind-merge';

const DetailSidebar: FC<DetailSidebarProps> = ({
  items,
  faqHref,
  faqLabel,
  primaryButtonLabel,
  primaryButtonHref,
  primaryButtonAriaLabel,
  primaryButtonHelperText,
  secondaryButtonLabel,
  secondaryButtonHref,
  secondaryButtonAriaLabel,
  className,
}) => {
  const t = useTranslations('serviceDetail.sidebar');

  const defaultFaqLabel = faqLabel || t('faqLabel');
  const faqTitle = t('faqTitle') || 'Frequently Asked Questions';

  return (
    <aside
      className={twMerge(
        'bg-white rounded-2xl shadow p-6 border border-neutral-200 mb-6 w-full max-w-full',
        className,
      )}
    >
      <ul className="mb-6 space-y-5 text-base">
        {items.map((item) => (
          <li key={item.label} className="flex items-start gap-3">
            <span className="w-6 h-6 text-primary-700 mt-1 flex-shrink-0">{item.icon}</span>
            <div>
              <div className="font-semibold">{item.label}</div>
              <div>{item.value}</div>
            </div>
          </li>
        ))}
      </ul>
      {faqHref && (
        <>
          <hr className="my-6" />
          <div className="mb-4">
            <div className="font-semibold mb-1">{faqTitle}</div>
            <a href={faqHref} className="text-primary-700 underline text-sm block">
              {defaultFaqLabel}
            </a>
          </div>
        </>
      )}
      {primaryButtonLabel && primaryButtonHref && (
        <div className="mt-2 w-full">
          <Button
            href={primaryButtonHref}
            intent="primary"
            size="lg"
            className="w-full"
            ariaLabel={primaryButtonAriaLabel || primaryButtonLabel}
          >
            {primaryButtonLabel}
          </Button>
          {primaryButtonHelperText && (
            <p className="mt-4 text-[16px] leading-[24px] text-[#384250]">
              {primaryButtonHelperText}
            </p>
          )}
        </div>
      )}
      {secondaryButtonLabel && secondaryButtonHref && (
        <Button
          href={secondaryButtonHref}
          intent="secondary"
          outline
          size="lg"
          className="w-full mt-3"
          ariaLabel={secondaryButtonAriaLabel || secondaryButtonLabel}
        >
          {secondaryButtonLabel}
        </Button>
      )}
    </aside>
  );
};

export default DetailSidebar;
