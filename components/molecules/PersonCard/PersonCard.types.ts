export interface PersonCardProps {
  /** Image source URL */
  image: string;
  /** Person's name */
  name: string;
  /** Person's title/position */
  title: string;
  /** Optional className for styling */
  className?: string;
  /** Render style variant depending on placement */
  variant?: 'grid' | 'carousel';
}
