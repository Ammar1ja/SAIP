import React from 'react';

/**
 * LocationPinIcon — location marker icon for use in service details.
 */
export const LocationPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M12 2C7.58 2 4 5.58 4 10c0 4.42 4.13 8.36 7.12 11.04a1.5 1.5 0 0 0 1.76 0C15.87 18.36 20 14.42 20 10c0-4.42-3.58-8-8-8zm0 17.3C9.11 16.03 6 12.61 6 10c0-3.31 2.69-6 6-6s6 2.69 6 6c0 2.61-3.11 6.03-6 9.3z"
      fill="currentColor"
    />
    <circle cx="12" cy="10" r="2" fill="currentColor" />
  </svg>
);
