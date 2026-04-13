'use client';

import DownloadFigmaIcon from '@/components/icons/actions/DownloadFigmaIcon';
import ShareFigmaIcon from '@/components/icons/actions/ShareFigmaIcon';
import PrintFigmaIcon from '@/components/icons/actions/PrintFigmaIcon';
import { twMerge } from 'tailwind-merge';
import { ActionIconsProps } from './ActionIcons.types';
import { actionIconsContainer, actionIcon } from './ActionIcons.styles';

export const ActionIcons = ({
  onShare,
  onPrint,
  onDownload,
  className,
  size = 'md',
}: ActionIconsProps) => {
  const iconClass = size === 'panel' ? 'w-6 h-6 text-current' : 'w-5 h-5 text-current';

  return (
    <div className={twMerge(actionIconsContainer({ size }), className)}>
      <button type="button" onClick={onShare} className={actionIcon({ size })} aria-label="Share">
        <ShareFigmaIcon className={iconClass} />
      </button>

      <button type="button" onClick={onPrint} className={actionIcon({ size })} aria-label="Print">
        <PrintFigmaIcon className={iconClass} />
      </button>

      <button
        type="button"
        onClick={onDownload}
        className={actionIcon({ size })}
        aria-label="Download"
      >
        <DownloadFigmaIcon className={iconClass} />
      </button>
    </div>
  );
};
