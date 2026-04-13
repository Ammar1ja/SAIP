import React from 'react';
import { twMerge } from 'tailwind-merge';

export const VideoPlayerSubtitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={twMerge(
        'max-w-[720px] mt-4 text-[16px] leading-[24px] md:text-[20px] md:leading-[30px] text-white/90 text-left rtl:text-right',
        className,
      )}
    >
      {children}
    </p>
  );
};
