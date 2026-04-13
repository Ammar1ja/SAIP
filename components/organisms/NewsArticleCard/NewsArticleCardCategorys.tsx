import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const newsArticleCardCategorys = cva(
  ['flex', 'flex-wrap', 'items-center', 'gap-2', 'w-full', 'overflow-hidden'],
  {
    variants: {},
    defaultVariants: {},
  },
);

export interface NewsArticleCardCategorysProps
  extends VariantProps<typeof newsArticleCardCategorys> {
  className?: string;
  categories: {
    id: string;
    name: string;
  }[];
}

export const NewsArticleCardCategorys = ({
  categories,
  className,
}: NewsArticleCardCategorysProps) => {
  return (
    <div className={twMerge(newsArticleCardCategorys({ className }))}>
      {categories?.map((category, index) => (
        <span
          key={`${category.id}-${category.name}-${index}`}
          className="inline-flex h-6 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-2 py-0 text-[12px] leading-[18px] font-medium text-[#1F2A37]"
        >
          {category.name}
        </span>
      ))}
    </div>
  );
};
