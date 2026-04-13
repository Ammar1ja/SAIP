import { ReactNode } from 'react';

export interface TooltipProps {
  text: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
