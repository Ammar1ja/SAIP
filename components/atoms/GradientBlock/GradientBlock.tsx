'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

interface GradientBlockProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
  containerClassName?: string;
  cardClassName?: string;
}

const GradientDecoration = () => {
  return (
    <div className="absolute bottom-0 right-0 rtl:left-0 rtl:right-auto rtl:-scale-x-100 w-[42rem] h-[26rem] bg-gradient-to-t from-[#6d428f1a] to-[#6d428f00] [clip-path:polygon(0%_0%,85%_0%,100%_25%,100%_100%,60%_100%)] pointer-events-none xl:block z-0"></div>
  );
};

export const GradientBlock: React.FC<GradientBlockProps> = ({
  children,
  className,
  maxWidth = 'max-w-[80%]',
  containerClassName,
  cardClassName,
}) => {
  return (
    <div
      className={twMerge(
        'bg-gray-50 border-gray-200 px-4 md:px-12 lg:px-20 w-full py-4 md:py-12 lg:py-20 mx-auto rounded-lg relative overflow-hidden',
        className,
        containerClassName,
      )}
    >
      <GradientDecoration />
      <div
        className={twMerge(
          'bg-white mx-auto rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm relative z-10',
          maxWidth,
          cardClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default GradientBlock;
