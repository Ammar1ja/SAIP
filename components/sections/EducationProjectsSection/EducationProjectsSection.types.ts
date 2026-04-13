export interface EducationProject {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  detailsUrl: string;
  [key: string]: unknown;
}

export interface EducationProjectsSectionProps {
  projects?: EducationProject[];
  title?: string;
  description?: string;
  categoryOptions?: Array<{ label: string; value: string }>;
}
