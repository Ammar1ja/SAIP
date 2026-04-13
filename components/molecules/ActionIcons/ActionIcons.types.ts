export interface ActionIconsProps {
  /** Callback fired when share button is clicked */
  onShare?: () => void;
  /** Callback fired when print button is clicked */
  onPrint?: () => void;
  /** Callback fired when download button is clicked */
  onDownload?: () => void;
  /** Additional class names */
  className?: string;
  /** Size variant of the component */
  size?: 'sm' | 'md' | 'lg' | 'panel';
}
