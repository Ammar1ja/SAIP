import AdvisoryBoardCarousel from '@/components/organisms/AdvisoryBoardCarousel';
import { PersonCardProps } from '@/components/molecules/PersonCard/PersonCard.types';

const people: PersonCardProps[] = [
  {
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'Dr Nunu Carvalho',
    title: 'Role',
  },
  {
    image: 'https://randomuser.me/api/portraits/men/33.jpg',
    name: 'Mr. Grant Philpott',
    title: 'Managing Director of the Safe Technology Network (TTN)',
  },
  {
    image: 'https://randomuser.me/api/portraits/men/34.jpg',
    name: 'Dr Heinz Goder',
    title: 'Patent and European trademark attorney, partner at Boehmert & Boehmert (Munich)',
  },
  {
    image: 'https://randomuser.me/api/portraits/men/35.jpg',
    name: 'Dr Sara Al-Sayed',
    title: 'Professor, SABIC Chair for Polymer Catalysis, King Saud University',
  },
  {
    image: 'https://randomuser.me/api/portraits/men/36.jpg',
    name: 'Mr. John Doe',
    title: 'Innovation Consultant',
  },
  {
    image: 'https://randomuser.me/api/portraits/men/37.jpg',
    name: 'Ms. Jane Smith',
    title: 'IP Strategy Advisor',
  },
];

export default {
  title: 'Organisms/AdvisoryBoardCarousel',
  component: AdvisoryBoardCarousel,
};

export const Default = () => (
  <AdvisoryBoardCarousel
    heading="Advisory board"
    description="The Advisory Board for SAIP for Intellectual Property was established by a decision from the Executive President. The Board aims to participate in developing the strategic objectives and priorities of SAIP, in line with its vision and mission."
    description2="It also evaluates outcomes and performance indicators. Furthermore, the Board provides advice on major issues and problems requested by the Executive President to be studied, encourages the discovery of new knowledge projects and programs, and reviews developmental policies to improve the services provided by SAIP."
    people={people}
  />
);
