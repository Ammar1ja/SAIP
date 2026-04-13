export interface TrainingProgram {
  id: string;
  title: string;
  date: string;
  time?: string;
  category: string;
  duration: string;
  location: string;
  host: string;
  fees: string;
  registerHref?: string;
  [key: string]: unknown;
}

export interface TrainingProgramsSectionProps {
  programs?: TrainingProgram[];
  heroTitle?: string;
  heroDescription?: string;
}
