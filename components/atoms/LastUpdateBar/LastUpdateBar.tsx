import { twMerge } from 'tailwind-merge';
import { LastUpdateBarProps } from './LastUpdateBar.types';

export const LastUpdateBar = ({
  date,
  label = 'Last data update:',
  className,
  textClassName,
}: LastUpdateBarProps) => {
  return (
    <div className={twMerge('bg-neutral-100 rounded-lg py-3 px-6 text-center', className)}>
      <p className={twMerge('text-sm text-neutral-600 mb-0', textClassName)}>
        {label} <span className="font-medium">{date}</span>
      </p>
    </div>
  );
};

export default LastUpdateBar;
