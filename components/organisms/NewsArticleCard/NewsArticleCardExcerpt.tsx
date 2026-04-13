import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const newsArticleCardExcerpt = cva(
  [
    'font-body',
    'text-text-primary-paragraph',
    'text-base',
    'font-normal',
    'leading-6',
    'tracking-normal',
    'line-clamp-3',
  ],
  {
    variants: {},
    defaultVariants: {},
  },
);

export interface NewsArticleCardExcerptProps extends VariantProps<typeof newsArticleCardExcerpt> {
  className?: string;
  children: string;
}

export const NewsArticleCardExcerpt = ({ children, className }: NewsArticleCardExcerptProps) => {
  // Check if children contains HTML tags
  const isHtml = typeof children === 'string' && /<[^>]*>/.test(children);

  if (isHtml) {
    return (
      <div
        className={twMerge(newsArticleCardExcerpt({ className }))}
        dangerouslySetInnerHTML={{ __html: children }}
      />
    );
  }

  return <div className={twMerge(newsArticleCardExcerpt({ className }))}>{children}</div>;
};
