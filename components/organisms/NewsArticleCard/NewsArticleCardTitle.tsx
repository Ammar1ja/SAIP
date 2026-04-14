import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const newsArticleCardTitle = cva(
  [
    'text-text-default',
    'overflow-hidden',
    'line-clamp-2',
    'text-[18px]',
    'leading-6',
    'font-medium',
  ],
  {
    variants: {},
    defaultVariants: {},
  },
);

export interface NewsArticleCardTitleProps extends VariantProps<typeof newsArticleCardTitle> {
  className?: string;
  children: string;
}

export const NewsArticleCardTitle = ({ children, className }: NewsArticleCardTitleProps) => {
  return <div className={twMerge(newsArticleCardTitle({ className }))}>{children}</div>;
};
