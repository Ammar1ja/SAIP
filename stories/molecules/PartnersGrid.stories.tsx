import PartnersGrid from '@/components/molecules/PartnersGrid';
import PartnerCard from '@/components/molecules/PartnerCard';

const partners = [
  {
    logo: {
      url: '/images/partners/cstc.png',
      alt: 'Communications, Space and Technology Commission logo',
    },
    name: 'Communications, Space and Technology Commission',
    website: 'https://www.cst.gov.sa/',
  },
  {
    logo: {
      url: '/images/partners/sdl.png',
      alt: 'Saudi Digital Library logo',
    },
    name: 'Saudi Digital Library',
    website: 'https://sdl.edu.sa/',
  },
  {
    logo: {
      url: '/images/partners/spa.png',
      alt: 'Saudi Press Agency logo',
    },
    name: 'Saudi Press Agency (SPA)',
    website: 'https://www.spa.gov.sa/',
  },
  {
    logo: {
      url: '/images/partners/kfmc.png',
      alt: 'King Fahad Medical City logo',
    },
    name: 'King Fahad Medical City',
    website: 'https://www.kfmc.med.sa/',
  },
  {
    logo: {
      url: '/images/partners/smp.png',
      alt: 'Saudi Mining Polytechnic logo',
    },
    name: 'Saudi Mining Polytechnic',
    website: 'https://www.smp.edu.sa/',
  },
  {
    logo: {
      url: '/images/partners/kafra.png',
      alt: 'King Abdulaziz Foundation for Research and Archives logo',
    },
    name: 'King Abdulaziz Foundation for Research and Archives',
    website: 'https://www.darah.org.sa/',
  },
  {
    logo: {
      url: '/images/partners/pp.png',
      alt: 'Public Prosecution logo',
    },
    name: 'Public Prosecution',
    website: 'https://www.pp.gov.sa/',
  },
  {
    logo: {
      url: '/images/partners/gdcd.png',
      alt: 'General Directorate of Civil Defense logo',
    },
    name: 'General Directorate of Civil Defense',
    website: 'https://www.998.gov.sa/',
  },
  {
    logo: {
      url: '/images/partners/gdbg.png',
      alt: 'General Directorate of Border Guards logo',
    },
    name: 'General Directorate of Border Guards - Kingdom of Saudi Arabia',
    website: 'https://www.fg.gov.sa/',
  },
];

const partnersLongLabels = partners.map((p) => ({
  ...p,
  websiteLabel: 'Visit the official website of ' + p.name,
}));
const partnersNoLogos = partners.map((p) => ({ ...p, logo: undefined }));
const partnersMixed = [
  partners[0],
  { ...partners[1], websiteLabel: 'Very long label for testing the button' },
  { ...partners[2], logo: undefined },
  partners[3],
  { ...partners[4], websiteLabel: 'Go to website' },
];

export default {
  title: 'Molecules/PartnersGrid',
  component: PartnersGrid,
};

export const Default = () => (
  <PartnersGrid>
    {partners.map((p) => (
      <PartnerCard key={p.name} {...p} />
    ))}
  </PartnersGrid>
);

export const LongLabels = () => (
  <PartnersGrid>
    {partnersLongLabels.map((p) => (
      <PartnerCard key={p.name} {...p} />
    ))}
  </PartnersGrid>
);

export const NoLogos = () => (
  <PartnersGrid>
    {partnersNoLogos.map((p) => (
      <PartnerCard key={p.name} {...p} />
    ))}
  </PartnersGrid>
);

export const Mixed = () => (
  <PartnersGrid>
    {partnersMixed.map((p) => (
      <PartnerCard key={p.name} {...p} />
    ))}
  </PartnersGrid>
);
