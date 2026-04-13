import { ReactNode } from 'react';

export interface InfoBlockProps {
  title: string | ReactNode;
  children: ReactNode;
  className?: string;
}
