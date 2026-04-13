import { ReactNode } from 'react';

export interface SectionProps {
  background?:
    | 'primary-25'
    | 'primary-50'
    | 'neutral'
    | 'neutral-25'
    | 'white'
    | 'primary'
    | 'accent'
    | 'transparent';
  columns?: 'two' | 'asymNarrowWide';
  align?: 'left' | 'center' | 'right';
  itemsAlign?: 'start' | 'center' | 'end' | 'stretch';
  fullWidth?: boolean;
  rtlAwareAlign?: 'left' | 'right';
  responsiveAlignDirection?: 'left' | 'right';
  constrain?: boolean;
  overlap?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large' | 'default';
  scrollableContent?: boolean; // New prop for scrollable content that needs to extend to edge
  children?: ReactNode;
  /** Merged onto the outer section/div wrapper (not the inner grid container). */
  outerClassName?: string;
  className?: string;
  as?: 'section' | 'div' | 'main' | 'article' | 'aside';
  role?: string;
  ariaLabel?: string;
  id?: string;
}
