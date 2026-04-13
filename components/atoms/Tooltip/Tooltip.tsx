import React, { useState } from 'react';
import { TooltipProps } from '@/components/atoms/Tooltip/Tooltip.types';
import { tooltipArrowStyle, tooltipStyle } from '@/components/atoms/Tooltip/Tooltip.styles';
import { twMerge } from 'tailwind-merge';

export const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  position = 'top',
  size = 'md',
  className,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex items-center group"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      {visible && (
        <div className={twMerge(tooltipStyle({ position, size }), className)}>
          {text}
          <div className={tooltipArrowStyle({ position })} />
        </div>
      )}
    </div>
  );
};
