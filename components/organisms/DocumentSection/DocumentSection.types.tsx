import { ReactNode } from 'react';
import type { SectionProps } from '@/components/atoms/Section/Section.types';

/** Vertical rhythm presets for the heading + body + actions stack (`with-image` only). */
export type DocumentSectionTextRhythm = 'even' | 'display-intro';

export interface DocumentSectionButton {
  label: string;
  href: string;
  ariaLabel?: string;
  icon?: string | ReactNode; // Support both string (URL) and ReactNode (icon component)
  intent?: 'primary' | 'secondary';
  className?: string;
  outline?: boolean;
  download?: boolean | string; // For download links
  target?: string; // For opening in new tab (e.g., '_blank')
  size?: 'sm' | 'md' | 'lg' | 'mdWide';
}

export interface DocumentSectionProps {
  heading: string;
  description?: ReactNode;
  headingClassName?: string;
  descriptionClassName?: string;
  buttons?: DocumentSectionButton[];
  variant?: 'with-image' | 'buttons-only';
  background?: 'white' | 'primary-50' | 'neutral';
  imagePosition?: 'left' | 'right';
  mobileImageFirst?: boolean;
  alignEnabled?: boolean;
  alignDirection?: 'left' | 'right' | 'auto';
  image?: {
    src: string;
    alt: string;
    aspect?: string;
    className?: string;
    priority?: boolean;
    wrapperClassName?: string;
  };
  className?: string;
  /** Passed to the underlying `Section` (outer wrapper). */
  sectionPadding?: SectionProps['padding'];
  sectionOuterClassName?: string;
  itemsAlign?: SectionProps['itemsAlign'];
  textRhythm?: DocumentSectionTextRhythm;
  id?: string;
}
