export interface NationalPillar {
  id: string;
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
}

export interface NationalPillarsProps {
  className?: string;
  heading?: string;
  text?: string;
  items?: NationalPillar[];
}
