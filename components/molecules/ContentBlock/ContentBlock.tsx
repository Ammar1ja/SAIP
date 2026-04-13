import React from 'react';
import { twMerge } from 'tailwind-merge';
import Heading from '@/components/atoms/Heading';
import TextContent from '@/components/atoms/TextConent';
import { ContentBlockProps } from './ContentBlock.types';
import { contentBlock } from './ContentBlock.styles';

export const ContentBlock = ({
  heading,
  text,
  className,
  textClassName,
  textAlign = 'left',
  lineHeight = 'normal',
  headingSize = 'h2',
  headingClassName,
}: ContentBlockProps) => {
  return (
    <div className={twMerge(contentBlock({ lineHeight, textAlign }), className)}>
      <Heading
        as={headingSize}
        size={headingSize}
        weight="medium"
        className={twMerge(
          `!text-3xl md:!text-3xl lg:!text-5xl leading-normal !tracking-tide ${textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right rtl:text-left' : 'text-left rtl:text-right'}`,
          headingClassName,
        )}
      >
        {heading}
      </Heading>
      <TextContent
        className={twMerge(
          textClassName ?? 'mt-4 md:mt-6 lg:mt-12',
          lineHeight === 'none' && 'leading-none',
        )}
        allowHtml={typeof text === 'string'}
      >
        {text}
      </TextContent>
    </div>
  );
};
