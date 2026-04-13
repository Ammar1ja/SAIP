export const fontSize = {
  'display-2xl': [
    '4.5rem',
    {
      lineHeight: '5.625rem',
      letterSpacing: '-0.02em',
      fontWeight: '400',
    },
  ],
  'display-xl': [
    '3.75rem',
    {
      lineHeight: '4.5rem',
      letterSpacing: '-0.02em',
      fontWeight: '400',
    },
  ],
  'display-lg': [
    '3rem',
    {
      lineHeight: '3.75rem',
      letterSpacing: '-0.02em',
      fontWeight: '400',
    },
  ],
  'display-md': [
    '1.875rem',
    {
      lineHeight: '2.375rem',
      letterSpacing: '-0.02em',
      fontWeight: '400',
    },
  ],
  'display-sm': [
    '1.5rem',
    {
      lineHeight: '2rem',
      letterSpacing: '-0.02em',
      fontWeight: '400',
    },
  ],
  'display-xs': [
    '1.25rem',
    {
      lineHeight: '1.875rem',
      letterSpacing: '-0.02em',
      fontWeight: '400',
    },
  ],
  'text-xl': [
    '1.25rem',
    {
      lineHeight: '1.875rem',
      fontWeight: '400',
    },
  ],
  'text-lg': [
    '1.125rem',
    {
      lineHeight: '1.75rem',
      fontWeight: '400',
    },
  ],
  'text-md': [
    '1rem',
    {
      lineHeight: '1.5rem',
      fontWeight: '400',
    },
  ],
  'text-sm': [
    '0.875rem',
    {
      lineHeight: '1.25rem',
      fontWeight: '400',
    },
  ],
  'text-xs': [
    '0.75rem',
    {
      lineHeight: '1.125rem',
      fontWeight: '400',
    },
  ],
};

export type FontSize = keyof typeof fontSize;
