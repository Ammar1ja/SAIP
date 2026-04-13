import Section from '@/components/atoms/Section';
import Heading from '@/components/atoms/Heading';
import VideoInfoCard from '@/components/molecules/VideoInfoCard';
import PublicationsSection from '@/components/organisms/PublicationsSection/PublicationsSection';
import StatisticsSection from '@/components/organisms/StatisticsSection';
import RelatedPagesSection from '@/components/organisms/RelatedPagesSection';
import IPGuideSection from '@/components/organisms/IPGuideSection';
import GazetteSection from '@/components/organisms/GazetteSection/GazetteSection';
import { IPOverviewSectionProps } from './IPOverviewSection.types';

const IPOverviewSection = ({
  header,
  guide,
  publications,
  statistics,
  gazette,
  relatedPages,
}: IPOverviewSectionProps) => {
  return (
    <>
      <div id="information-library">
        <Section>
          <Heading
            as="h2"
            size="custom"
            weight="medium"
            color="default"
            className="mb-6 text-4xl leading-11 md:text-display-lg"
          >
            {header.title}
          </Heading>
          <VideoInfoCard
            videoSrc={header.videoSrc}
            poster={header.videoPoster}
            title={header.description}
          />
        </Section>
      </div>
      <div id="guide">
        <IPGuideSection
          title={guide.guideTitle}
          cards={guide.guideCards}
          ctaLabel={guide.ctaLabel}
          ctaHref={guide.ctaHref}
          mobileVariant="single"
          mobileMaxCards={1}
        />
      </div>

      {publications && publications.publications && publications.publications.length > 0 && (
        <div id="publications">
          <PublicationsSection
            title={publications.publicationsTitle}
            description={publications.publicationsDescription}
            cards={publications.publications}
            ctaLabel={publications.publicationsCtaLabel}
            ctaHref={publications.publicationsCtaHref}
          />
        </div>
      )}

      {gazette && (
        <GazetteSection
          heading={gazette.heading}
          text={gazette.text}
          buttonText={gazette.buttonText}
          buttonHref={gazette.buttonHref}
          buttonIcon={gazette.buttonIcon}
          id={gazette.id || 'ip-gazette'}
          imageSrc={gazette.imageSrc}
          imageAlt={gazette.imageAlt}
          isReversed={gazette.isReversed}
        />
      )}

      <div id="statistics">
        <StatisticsSection
          title={statistics.statisticsTitle}
          ctaLabel={statistics.statisticsCtaLabel}
          ctaHref={statistics.statisticsCtaHref}
          stats={statistics.statistics}
        />
      </div>

      <div id="related-pages">
        <RelatedPagesSection title={relatedPages?.title} pages={relatedPages?.pages} />
      </div>
    </>
  );
};

export default IPOverviewSection;
