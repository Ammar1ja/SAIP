import React from 'react';

export interface Highlight {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonLabel?: string;
  buttonHref?: string;
}

export interface HighlightsProps {
  heading: string;
  text: string;
  highlights: Highlight[];
}
