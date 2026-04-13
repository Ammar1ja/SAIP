import Section from '@/components/atoms/Section';
import Heading from '@/components/atoms/Heading';
import VideoInfoCard from '@/components/molecules/VideoInfoCard';
import IPGuideSection from '@/components/organisms/IPGuideSection';
import { InformationLibrarySectionProps } from './InformationLibrarySection.types';

const InformationLibrarySection = ({
  title = 'Information library',
  video,
  guide,
  guideMaxCards,
  guideMobileVariant,
  guideMobileMaxCards,
}: InformationLibrarySectionProps) => {
  return (
    <>
      <Section>
        <Heading
          as="h2"
          size="custom"
          weight="medium"
          color="default"
          className="mb-6 text-4xl leading-11 md:text-display-lg"
        >
          {title}
        </Heading>
        <VideoInfoCard
          videoSrc={video.videoSrc}
          poster={video.videoPoster}
          title={video.description}
        />
      </Section>
      <div id="guide">
        <IPGuideSection
          title={guide.guideTitle}
          cards={guide.guideCards}
          ctaLabel={guide.ctaLabel}
          ctaHref={guide.ctaHref}
          maxCards={guideMaxCards}
          mobileVariant={guideMobileVariant}
          mobileMaxCards={guideMobileMaxCards}
        />
      </div>
    </>
  );
};

export default InformationLibrarySection;
