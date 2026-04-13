import * as React from 'react';

type EmailFigmaIconProps = React.SVGProps<SVGSVGElement> & {
  /**
   * `contactTile` — crop to envelope artwork so at ~14×12px it matches Figma (mail-01 in 32px tile).
   * Default 24×24 viewBox leaves lots of padding; devtools then measures inner `<rect>` ~7.5×5.5.
   */
  variant?: 'default' | 'contactTile';
};

export default function EmailFigmaIcon({
  className,
  variant = 'default',
  ...props
}: EmailFigmaIconProps) {
  const viewBox = variant === 'contactTile' ? '3.5 5.5 17 13' : '0 0 24 24';

  return (
    <svg
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="4.5" y="6.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5.5 8L12 12.5L18.5 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
