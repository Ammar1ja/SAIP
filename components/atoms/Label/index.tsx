import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const label = cva(
  [
    'inline-flex',
    'items-center',
    'text-text-natural',
    'text-sm',
    'font-medium',
    'rounded-full',
    'px-2',
    'py-1',
    'bg-neutral-light',
    'border',
    'border-neutral-secondary',
    'leading-[18px]',
    'whitespace-nowrap',
  ],
  {
    variants: {},
    defaultVariants: {},
  },
);

export interface LabelProps extends VariantProps<typeof label> {
  children: string;
  className?: string;
}

export const Label = ({ children, className }: LabelProps) => {
  return <span className={twMerge(label({ className }))}>{children}</span>;
};
