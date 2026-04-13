import { PersonCardProps } from '@/components/molecules/PersonCard';

export interface PeopleGridProps {
  /** Array of people to display */
  people: PersonCardProps[];
  /** Optional heading for the section */
  heading?: string;
  /** Optional description text */
  description?: string;
  /** Optional className for styling */
  className?: string;
}
