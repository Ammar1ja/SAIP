import React from 'react';

export interface Pillar {
  id: string;
  title: string;
  description: string;
  number: number;
}

export interface OurPillarsProps {
  heading: string;
  text: string;
  pillars: Pillar[];
}
