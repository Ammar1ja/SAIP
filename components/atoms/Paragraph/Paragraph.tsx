import { FC } from 'react';
import { ParagraphProps } from './Paragraph.types';
import { paragraphStyles } from './Paragraph.styles';
import { twMerge } from 'tailwind-merge';

const Paragraph: FC<ParagraphProps> = ({ children, variant, size, weight, className, ...rest }) => (
  <p className={twMerge(paragraphStyles({ variant, size, weight }), className)} {...rest}>
    {children}
  </p>
);

export default Paragraph;
