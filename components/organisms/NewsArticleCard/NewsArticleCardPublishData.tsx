import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const newsArticleCardPublishData = cva(
  ['text-text-secondary-paragraph', 'text-[12px]', 'leading-[18px]', 'font-normal'],
  {
    variants: {},
    defaultVariants: {},
  },
);

export interface NewsArticleCardPublishDataProps
  extends VariantProps<typeof newsArticleCardPublishData> {
  className?: string;
  children: string;
}

export const NewsArticleCardPublishData = ({
  children,
  className,
}: NewsArticleCardPublishDataProps) => {
  return <div className={twMerge(newsArticleCardPublishData({ className }))}>{children}</div>;
};
