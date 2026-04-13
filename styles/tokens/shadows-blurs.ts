export const boxShadow = {
  'shadow-xs': '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
  'shadow-sm': '0px 1px 3px 0px rgba(16, 24, 40, 0.10)',
  'shadow-sm-alt': '0px 1px 2px 0px rgba(16, 24, 40, 0.06)',
  'shadow-md': '0px 4px 8px -2px rgba(16, 24, 40, 0.10)',
  'shadow-md-alt': '0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
  'shadow-lg': '0px 12px 16px -6px rgba(16, 24, 40, 0.08)',
  'shadow-lg-alt': '0px 4px 6px -2px rgba(16, 24, 40, 0.03)',
  'shadow-xl': '0px 20px 24px -4px rgba(16, 24, 40, 0.08)',
  'shadow-xl-alt': '0px 8px 8px -4px rgba(16, 24, 40, 0.03)',
  'shadow-2xl': '0px 240px 48px -12px rgba(16, 24, 40, 0.18)',
  'shadow-3xl': '0px 32px 64px -12px rgba(16, 24, 40, 0.14)',
};

export const backdropBlur = {
  'blur-sm': '8px',
  'blur-md': '16px',
  'blur-lg': '24px',
  'blur-xl': '40px',
};

export type BoxShadow = keyof typeof boxShadow;
export type BackdropBlur = keyof typeof backdropBlur;
