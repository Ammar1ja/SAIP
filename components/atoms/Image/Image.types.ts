/**
 * Image object fit types
 */
export type ImageObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

/**
 * Image aspect ratio types
 */
export type ImageAspectRatio = 'auto' | 'square' | 'video' | 'portrait' | 'landscape';

/**
 * Image component props
 */
export interface ImageProps {
  /** Source URL of the image */
  src: string;
  /** Alternative text for the image */
  alt: string;
  /** Additional class names */
  className?: string;
  /** Object-fit property for the image */
  objectFit?: ImageObjectFit;
  /** Aspect ratio of the image container */
  aspectRatio?: ImageAspectRatio;
  /** Whether to prioritize loading this image */
  priority?: boolean;
  /** Sizes attribute for responsive images */
  sizes?: string;
  /** Quality of the optimized image (1-100) */
  quality?: number;
  /** Loading behavior */
  loading?: 'lazy' | 'eager';
  /** Blur hash or base64 placeholder */
  placeholder?: 'blur' | 'empty';
  /** Base64 encoded image or blur hash for placeholder */
  blurDataURL?: string;
}
