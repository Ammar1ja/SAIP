export interface ProQualificationItem {
  id: string;
  title: string;
  description: string;
  link?: string;
}

export interface ProQualificationSectionProps {
  items?: ProQualificationItem[];
  heroTitle?: string;
  heroDescription?: string;
}
