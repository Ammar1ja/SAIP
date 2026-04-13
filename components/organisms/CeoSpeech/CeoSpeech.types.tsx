export interface CeoSpeechProps {
  title?: string;
  quote: string;
  image: {
    src: string;
    alt: string;
  };
  caption: string;
  captionHighlight?: string;
  description: string[];
  isExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}
