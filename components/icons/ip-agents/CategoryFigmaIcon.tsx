import * as React from 'react';

type CategoryFigmaIconProps = React.SVGProps<SVGSVGElement>;

export default function CategoryFigmaIcon({ className, ...props }: CategoryFigmaIconProps) {
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
        d="M14 3H8C6.89543 3 6 3.89543 6 5V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V7L14 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 3V7H18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 12H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 16H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
