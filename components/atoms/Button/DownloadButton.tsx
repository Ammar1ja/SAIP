import { Button } from './Button';
import { ButtonProps } from './Button.types';
import DownloadFigmaIcon from '@/components/icons/actions/DownloadFigmaIcon';

const DownloadButton = (props: ButtonProps) => (
  <Button
    intent="primary"
    size="md"
    className={`flex items-center gap-2 font-normal ${props.className || ''}`}
    {...props}
  >
    <DownloadFigmaIcon className="w-4 h-4 mr-2 text-current" aria-hidden />
    {props.children}
  </Button>
);

export default DownloadButton;
