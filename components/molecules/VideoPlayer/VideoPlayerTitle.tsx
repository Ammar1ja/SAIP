import React from 'react';

export const VideoPlayerTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h1 className="tracking-display-tight max-w-[945px] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-tight text-white ltr:text-left rtl:text-right">
      {children}
    </h1>
  );
};
