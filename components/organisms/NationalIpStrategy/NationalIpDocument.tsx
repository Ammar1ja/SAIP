'use client';

import DocumentSection from '@/components/organisms/DocumentSection';
import DownloadFigmaIcon from '@/components/icons/actions/DownloadFigmaIcon';
import ViewFigmaIcon from '@/components/icons/actions/ViewFigmaIcon';
// import { Eye, Download } from 'lucide-react';

export interface NationalIpDocumentProps {
  heading: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
  };
  buttons?: Array<{
    label: string;
    href: string;
    ariaLabel: string;
    icon: React.ReactNode;
    intent: 'primary' | 'secondary';
  }>;
}

export const NationalIpDocument = ({
  heading,
  description,
  image = {
    src: '/images/national-ip-strategy/ip-document.jpg',
    alt: 'National IP Strategy document',
  },
  buttons = [],
}: NationalIpDocumentProps) => {
  // Always use inline SVG icons for proper color inheritance, regardless of what Drupal sends
  const processedButtons = buttons.map((btn, idx) => {
    if (idx === 0) {
      // First button - "Show file" (secondary outline) with DS eye icon
      return {
        ...btn,
        icon: <ViewFigmaIcon className="h-5 w-5" />,
        intent: 'secondary' as const,
        outline: true,
        className: 'rounded-sm h-10 min-h-10 px-3 gap-1.5',
      };
    } else if (idx === 1) {
      // Second button - "Download file" (primary) with DS download icon
      return {
        ...btn,
        icon: <DownloadFigmaIcon className="h-5 w-5 text-white" />,
        intent: 'primary' as const,
        outline: false,
        className: 'rounded-sm h-10 min-h-10 px-3 gap-1.5',
      };
    }
    return btn;
  });

  const imageWithFigmaSize = image
    ? {
        ...image,
        aspect: 'w-full h-[320px] md:h-[400px] xl:h-[474px]',
      }
    : image;

  return (
    <DocumentSection
      heading={heading}
      buttons={processedButtons}
      alignEnabled
      alignDirection="auto"
      background="primary-50"
      className="lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_708px]"
      image={imageWithFigmaSize}
    />
  );
};
