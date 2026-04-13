import { ReactNode } from 'react';

export interface InfoItemProps {
  title: string;
  alt: string;
  icon: string | ReactNode;
  className?: string;
  children?: ReactNode;
  variant?: 'default';
}
