import { cva } from 'class-variance-authority';
import { ImageAspectRatio, ImageObjectFit } from './Image.types';

export const imageWrapper = cva(['relative', 'w-full', 'overflow-hidden'], {
  variants: {
    aspectRatio: {
      auto: '',
      square: 'aspect-square',
      video: 'aspect-video',
      portrait: 'aspect-[3/4]',
      landscape: 'aspect-[4/3]',
    },
  },
  defaultVariants: {
    aspectRatio: 'auto',
  },
});

export const image = cva(['transition-opacity', 'duration-300'], {
  variants: {
    objectFit: {
      contain: 'object-contain',
      cover: 'object-cover',
      fill: 'object-fill',
      none: 'object-none',
      'scale-down': 'object-scale-down',
    },
  },
  defaultVariants: {
    objectFit: 'cover',
  },
});
