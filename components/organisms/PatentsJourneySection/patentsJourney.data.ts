export const SECTION_IDS = [
  'guidance',
  'patent-checklist',
  'ip-clinics',
  'ip-search-engine',
  'not-patentable',
  'protection',
  'management',
  'enforcement',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

interface JourneySection {
  title: string;
  description: string;
  buttonLabel?: string;
  buttonHref?: string;
}

export const JOURNEY_SECTIONS: Record<SectionId, JourneySection> = {
  guidance: {
    title: 'Guidance',
    description:
      'Turning ideas into opportunities, The journey begins with understanding your idea and its potential. We help you evaluate its patentability, conduct prior art searches, and navigate the requirements of the patent system. With expert advice, we ensure you are well-informed and confident in taking the first steps.',
  },
  'patent-checklist': {
    title: 'Patent checklist',
    description:
      'Evaluate whether your idea or invention meets the necessary criteria to qualify for patent protection. It also helps inventors, businesses, and professionals systematically assess the strengths and weaknesses of an invention before committing to the patent application process.',
    buttonLabel: 'Go to patent checklist',
    buttonHref: '/resources/ip-information/digital-guide/ip-category/patents/checklist',
  },
  'ip-clinics': {
    title: 'IP Clinics',
    description:
      'Apply for one of the IP Clinics services that provide beneficiaries with guidance and assistance in technical and legal inquiries related to registering and protecting intellectual property rights, issuing prior art search reports that enable beneficiaries to identify the novelty of the innovative opportunity or develop it, and the Intellectual Property Accelerator Program.',
    buttonLabel: 'Go to IP Clinics',
    buttonHref: '/services/ip-clinics',
  },
  'ip-search-engine': {
    title: 'IP search engine',
    description:
      'Search for patent records in the SAIP intellectual property (IP) engine essential for innovators, businesses, researchers, and IP professionals to assess novelty, avoid infringement, and gain competitive insights.',
    buttonLabel: 'Go to IP search engine',
    buttonHref: '/resources/tools-and-research/ip-search-engine',
  },
  'not-patentable': {
    title: 'Not patentable categories',
    description:
      'There are excluded categories of inventions or ideas that are not patentable in Saudi Arabia. Make sure your idea does not fall into these categories before applying.',
  },
  protection: {
    title: 'Protection',
    description: 'Protection section content...',
  },
  management: {
    title: 'Management',
    description: 'Management section content...',
  },
  enforcement: {
    title: 'Enforcement',
    description: 'Enforcement section content...',
  },
} as const;
