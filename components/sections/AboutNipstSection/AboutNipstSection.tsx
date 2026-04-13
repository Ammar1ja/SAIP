import DocumentSection from '@/components/organisms/DocumentSection';

interface AboutNipstSectionProps {
  heading?: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
  };
}

const AboutNipstSection = ({
  heading = 'About NIPST',
  description = 'In line with Vision 2030 directions, the entity seeks to adopt an integrated system for measuring beneficiary experience, enabling the identification of challenges and the improvement of service quality in a manner that enhances trust and efficiency.',
  image = {
    src: '/images/national-ip-strategy/about-nipst.jpg',
    alt: 'About NIPST',
  },
}: AboutNipstSectionProps) => {
  return (
    <DocumentSection
      heading={heading}
      description={description}
      background="white"
      alignEnabled
      alignDirection="auto"
      imagePosition="right"
      image={image}
    />
  );
};

export default AboutNipstSection;
