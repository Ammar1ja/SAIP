import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { ChevronUp, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Button from '@/components/atoms/Button';

interface StepCardProps {
  number: number;
  title: string;
  details: (
    | string
    | {
        label: string;
        href: string;
        external?: boolean;
        variant?: 'link' | 'button';
      }
  )[];
}

const StepCard = ({ number, title, details }: StepCardProps) => {
  const [open, setOpen] = useState(true);
  const t = useTranslations('serviceDetail');
  const stepLabel = t('stepLabel', { number });
  const toggleLabel = open ? t('toggle.hide') : t('toggle.show');
  return (
    <div
      className={twMerge(
        'bg-white rounded-xl border border-neutral-200 mb-8 overflow-hidden shadow-sm',
      )}
      aria-expanded={open}
    >
      <div
        className="flex items-center justify-between px-8 py-5 cursor-pointer bg-neutral-50 border-b border-neutral-200 rounded-t-xl"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="rtl:text-right">
          <span className="text-sm text-neutral-500 mr-2 rtl:mr-0 rtl:ml-2">{stepLabel}</span>
          <span className="font-bold text-lg text-neutral-900">{title}</span>
        </div>
        <button
          aria-label={toggleLabel}
          className="text-primary-700 font-medium flex items-center gap-1 bg-transparent border-0 p-0 focus:outline-none"
          tabIndex={-1}
        >
          <span className="sr-only">{toggleLabel}</span>
          <ChevronUp
            className={twMerge('w-5 h-5 transition-transform', open ? 'rotate-180' : '')}
            aria-hidden="true"
          />
        </button>
      </div>
      {open && (
        <div className="px-8 pb-6 pt-4 bg-white">
          <ul className="list-disc pl-6 rtl:pl-0 rtl:pr-6 rtl:text-right text-base text-neutral-800 space-y-2">
            {details.map((item, idx) => {
              if (typeof item === 'string') {
                return <li key={idx}>{item}</li>;
              }

              if (item.variant === 'button') {
                return (
                  <li key={idx} className="list-none">
                    <Button
                      intent="secondary"
                      outline
                      size="sm"
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      ariaLabel={item.label}
                      className="inline-flex items-center gap-2 mt-1"
                    >
                      {item.label}
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
                    </Button>
                  </li>
                );
              }

              return (
                <li key={idx}>
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-1 underline text-primary-700 hover:text-primary-900"
                  >
                    {item.label}
                    {item.external && <span aria-hidden>↗</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StepCard;
