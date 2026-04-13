import React from 'react';

/**
 * Figma: helper hint — 13.33×13.33px frame, 1.5px stroke, Icon/icon-neutral #384250.
 */
export const CircleInfoOutlineIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 10.75V7.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="5.125" r="0.875" fill="currentColor" />
  </svg>
);
