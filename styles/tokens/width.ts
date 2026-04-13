export const maxWidth = {
  'container-desktop': '80rem',
  'aligned-container': 'calc(100vw - (100vw - 1280px) / 2)',
  paragraph: '45rem',
  /** 628px — narrow intro / publications copy rail */
  'copy-narrow': '39.25rem',
};

export const width = {
  xxs: '20rem',
  xs: '34rem',
  sm: '30rem',
  md: '35rem',
  lg: '40rem',
  xl: '48rem',
  '2xl': '64rem',
  '3xl': '80rem',
  '4xl': '90rem',
  '5xl': '100rem',
  '6xl': '120rem',
};

export type MaxWidth = typeof maxWidth;
export type Width = typeof width;
