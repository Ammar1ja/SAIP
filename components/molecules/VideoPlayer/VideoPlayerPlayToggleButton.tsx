import React from 'react';

export const VideoPlayerPlayToggleButton = ({
  ariaLabel,
  onClick,
  children,
}: {
  ariaLabel: string;
  onClick?: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex h-[32px] w-[32px] items-center justify-center rounded bg-button-background-natural-default hover:bg-button-background-natural-hover"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
