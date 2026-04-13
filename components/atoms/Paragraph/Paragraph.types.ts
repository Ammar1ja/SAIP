import { ReactNode, HTMLAttributes } from 'react';

type ParagraphVariant = 'default' | 'compact';
type ParagraphSize = 'sm' | 'md' | 'lg';
type ParagraphWeight = 'normal' | 'medium' | 'semibold' | 'bold';

export interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  variant?: ParagraphVariant;
  size?: ParagraphSize;
  weight?: ParagraphWeight;
  className?: string;
}
