'use client';

import { useState } from 'react';
import OurValues from '@/components/organisms/OurValues';
import CeoSpeech from '@/components/organisms/CeoSpeech';

interface AboutValuesAndCeoSectionProps {
  values: {
    heading?: string;
    items?: Array<{
      title: string;
      icon: string;
      description: string;
    }>;
  };
  ceoSpeech: {
    title: string;
    quote: string;
    image: {
      src: string;
      alt: string;
    };
    caption: string;
    captionHighlight?: string;
    description: string[];
  };
}

export default function AboutValuesAndCeoSection({
  values,
  ceoSpeech,
}: AboutValuesAndCeoSectionProps) {
  const [isCeoExpanded, setIsCeoExpanded] = useState(false);

  return (
    <>
      <section id="values">
        <OurValues
          heading={values?.heading}
          mobileLayout={isCeoExpanded ? 'compact' : 'expanded'}
          values={values?.items?.map((value) => ({
            title: value.title,
            icon: value.icon,
            alt: value.title,
            description: value.description,
          }))}
        />
      </section>

      <section id="ceo">
        <CeoSpeech
          title={ceoSpeech.title}
          quote={ceoSpeech.quote}
          image={ceoSpeech.image}
          caption={ceoSpeech.caption}
          captionHighlight={ceoSpeech.captionHighlight}
          description={ceoSpeech.description}
          isExpanded={isCeoExpanded}
          onExpandedChange={setIsCeoExpanded}
        />
      </section>
    </>
  );
}
