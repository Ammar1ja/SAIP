export interface Advantage {
  title: string;
  description: string;
  icon: () => React.ReactNode;
}

export interface AdvantagesSectionProps {
  advantages?: Advantage[];
}
