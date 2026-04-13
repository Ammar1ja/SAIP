import * as React from 'react';

type PhoneFigmaIconProps = React.SVGProps<SVGSVGElement>;

export default function PhoneFigmaIcon({ className, ...props }: PhoneFigmaIconProps) {
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
        d="M8.2 5.5C8.6 5.1 9.2 4.95 9.75 5.1L11.9 5.7C12.45 5.85 12.85 6.3 12.95 6.87L13.3 8.73C13.39 9.22 13.25 9.72 12.93 10.1L11.9 11.35C12.52 12.58 13.42 13.48 14.65 14.1L15.9 13.07C16.28 12.75 16.78 12.61 17.27 12.7L19.13 13.05C19.7 13.15 20.15 13.55 20.3 14.1L20.9 16.25C21.05 16.8 20.9 17.4 20.5 17.8L19.5 18.8C18.8 19.5 17.76 19.8 16.78 19.5C14.25 18.72 11.58 17.1 9.66 15.18C7.74 13.26 6.12 10.59 5.34 8.06C5.04 7.08 5.34 6.04 6.04 5.34L8.2 5.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
