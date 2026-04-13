export interface TimelineStep {
  number: number;
  title: string;
  icon?: string; // Optional icon
  details: (
    | string
    | {
        label: string;
        href: string;
        external?: boolean;
        variant?: 'link' | 'button';
      }
  )[];
}

export interface TimelineStepsProps {
  steps: TimelineStep[];
}
