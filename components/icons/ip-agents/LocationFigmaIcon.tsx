import * as React from 'react';

type LocationFigmaIconProps = React.SVGProps<SVGSVGElement>;

export default function LocationFigmaIcon({ className, ...props }: LocationFigmaIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 21C15.5 17.5 18 14.5 18 11C18 7.68629 15.3137 5 12 5C8.68629 5 6 7.68629 6 11C6 14.5 8.5 17.5 12 21Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
