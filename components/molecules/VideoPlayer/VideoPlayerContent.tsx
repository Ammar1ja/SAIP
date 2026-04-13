import React from 'react';
import LayoutWrapper from '@/components/atoms/LayoutWrapper';

export const VideoPlayerContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <LayoutWrapper className="relative z-10 h-full flex items-end sm:items-center pb-25 sm:pb-0 px-4">
      <div className="flex flex-col gap-2 text-white text-left w-full">{children}</div>
    </LayoutWrapper>
  );
};
