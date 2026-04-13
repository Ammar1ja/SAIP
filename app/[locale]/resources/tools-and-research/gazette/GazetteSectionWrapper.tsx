'use client';

import GazetteSection from '@/components/organisms/GazetteSection/GazetteSection';
import { ReactNode } from 'react';

interface GazetteSectionWrapperProps {
  id: string;
  heading: string;
  text: string;
  buttonText: string;
  buttonHref: string;
  buttonIcon: ReactNode;
  imageSrc: string;
  imageAlt: string;
  isReversed?: boolean;
  mobileFullWidth?: boolean;
}

export default function GazetteSectionWrapper({
  id,
  heading,
  text,
  buttonText,
  buttonHref,
  buttonIcon,
  imageSrc,
  imageAlt,
  isReversed = false,
  mobileFullWidth = false,
}: GazetteSectionWrapperProps) {
  return (
    <GazetteSection
      id={id}
      heading={heading}
      text={text}
      buttonText={buttonText}
      buttonHref={buttonHref}
      buttonIcon={buttonIcon}
      imageSrc={imageSrc}
      imageAlt={imageAlt}
      isReversed={isReversed}
      mobileFullWidth={mobileFullWidth}
    />
  );
}
