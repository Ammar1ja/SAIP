import Section from '@/components/atoms/Section';
import ServicesDiscover from '@/components/organisms/ServicesDiscover';
import ServicesInformation from '@/components/organisms/ServicesInformation';
import DocumentSection from '@/components/organisms/DocumentSection';

const ServicesDiscoverSection = ({
  discoverHeading,
  servicesData,
  infoHeading,
  infoDescription,
  verticalTabs,
  verticalTabsData,
  activeVerticalTab,
  setActiveVerticalTab,
  serviceDirectorySection,
}: {
  discoverHeading: string;
  servicesData: any[];
  infoHeading: string;
  infoDescription: string;
  verticalTabs: any[];
  verticalTabsData: any[];
  activeVerticalTab: string;
  setActiveVerticalTab: (id: string) => void;
  serviceDirectorySection: {
    heading: string;
    description: string;
    image?: { src: string; alt: string };
    buttonLabel: string;
    buttonHref: string;
  };
}) => (
  <>
    <Section background="white" id="discover-services">
      <ServicesDiscover
        heading={discoverHeading}
        items={servicesData.map((item) => ({
          ...item,
          background: 'green',
          borderColor: 'black',
        }))}
      />
    </Section>
    <Section id="info-you-need">
      <ServicesInformation
        title={infoHeading}
        description={infoDescription}
        tabs={verticalTabs}
        data={verticalTabsData}
        activeTab={activeVerticalTab}
        onTabChange={setActiveVerticalTab}
      />
    </Section>
    <section id="service-directory">
      <DocumentSection
        heading={serviceDirectorySection.heading}
        headingClassName="text-[48px] leading-[60px] tracking-[-0.96px] font-medium text-text-default md:text-[56px] md:leading-[70px] md:tracking-[-1.12px] lg:text-[72px] lg:leading-[90px] lg:tracking-[-1.44px]"
        descriptionClassName="text-[20px] leading-[30px] font-normal text-text-primary-paragraph lg:max-w-[628px] text-start"
        description={
          <div dangerouslySetInnerHTML={{ __html: serviceDirectorySection.description }} />
        }
        textRhythm="display-intro"
        image={{
          src: serviceDirectorySection.image?.src || '/images/services/service-directory.jpg',
          alt: serviceDirectorySection.image?.alt || serviceDirectorySection.heading,
        }}
        buttons={[
          {
            label: serviceDirectorySection.buttonLabel,
            href: serviceDirectorySection.buttonHref,
            intent: 'primary',
          },
        ]}
        alignEnabled
        alignDirection="auto"
        background="primary-50"
      />
    </section>
  </>
);

export default ServicesDiscoverSection;
