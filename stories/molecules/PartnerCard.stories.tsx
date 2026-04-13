import PartnerCard from '@/components/molecules/PartnerCard';

export default {
  title: 'Molecules/PartnerCard',
  component: PartnerCard,
};

export const Default = () => (
  <PartnerCard
    logo={{
      url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/CST_Logo.png',
      alt: 'Communications, Space and Technology Commission logo',
    }}
    name="Communications, Space and Technology Commission"
    website="https://www.cst.gov.sa/"
    websiteLabel="Go to website"
  />
);

export const LongLabel = () => (
  <PartnerCard
    logo={{
      url: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Saudi_Digital_Library_logo.png',
      alt: 'Saudi Digital Library logo',
    }}
    name="Saudi Digital Library"
    website="https://sdl.edu.sa/"
    websiteLabel="Visit the official website of the Saudi Digital Library"
  />
);

export const NoLabel = () => (
  <PartnerCard
    logo={{
      url: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Saudi_Press_Agency_Logo.png',
      alt: 'Saudi Press Agency logo',
    }}
    name="Saudi Press Agency (SPA)"
    website="https://www.spa.gov.sa/"
  />
);

export const NoLogo = () => (
  <PartnerCard
    name="Partner without logo"
    website="https://example.com/"
    websiteLabel="Go to website"
  />
);

export const WideLogo = () => (
  <PartnerCard
    logo={{
      url: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Saudi_Mining_Polytechnic_logo.png',
      alt: 'Saudi Mining Polytechnic logo',
    }}
    name="Saudi Mining Polytechnic"
    website="https://www.smp.edu.sa/"
    websiteLabel="Go to website"
  />
);
