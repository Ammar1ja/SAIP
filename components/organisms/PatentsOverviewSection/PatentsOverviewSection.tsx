'use client';

import Section from '@/components/atoms/Section';
import Heading from '@/components/atoms/Heading';
import VideoInfoCard from '@/components/molecules/VideoInfoCard';
import PatentsGuideSection from '@/components/organisms/PatentsGuideSection';
import PublicationsSection from '@/components/organisms/PublicationsSection/PublicationsSection';
import StatisticsSection from '@/components/organisms/StatisticsSection';
import RelatedPagesSection from '@/components/organisms/RelatedPagesSection';
import { PUBLICATIONS_CARDS } from '@/app/[locale]/services/patents/publications.data';
import { STATISTICS_CARDS } from '@/app/[locale]/services/patents/statistics.data';

const PatentsOverviewSection = () => {
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
          Information library
        </Heading>
        <VideoInfoCard
          videoSrc="https://www.w3schools.com/html/mov_bbb.mp4"
          poster="/images/patents/overview.jpg"
          title="Watch the video and learn the key steps involved in patents."
        />
      </Section>
      <PatentsGuideSection />
      <Section background="neutral">
        <PublicationsSection
          title="Publications"
          description="The patent publications provides important updates and information on patent procedures, changes in regulations, and relevant industry developments in Saudi Arabia."
          cards={PUBLICATIONS_CARDS}
          ctaLabel="View more publication"
          ctaHref="/resources/publications"
        />
      </Section>
      <StatisticsSection
        title="Statistics"
        ctaLabel="View more statistics"
        ctaHref="/resources/statistics"
        stats={STATISTICS_CARDS}
      />
      <RelatedPagesSection background="white" />
    </>
  );
};

export default PatentsOverviewSection;
