import { VariantProps } from 'class-variance-authority';
import { contentBlock } from './ContentBlock.styles';

export interface ContentBlockProps extends VariantProps<typeof contentBlock> {
  heading: string;
  text?: string | React.ReactNode;
  className?: string;
  /** Merged onto description `TextContent` (e.g. `mt-6` for 24px gap after heading). */
  textClassName?: string;
  lineHeight?: 'normal' | 'none';
  headingSize?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  headingClassName?: string;
}
