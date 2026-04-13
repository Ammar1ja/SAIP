import NextImage from 'next/image';
import { twMerge } from 'tailwind-merge';
import { ImageProps } from './Image.types';
import { imageWrapper, image } from './Image.styles';

/**
 * Optimized Image component using next/image
 * Automatically handles responsive images, lazy loading, and image optimization
 */
export function CustomImage({
  src,
  alt,
  className,
  objectFit = 'cover',
  aspectRatio = 'auto',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  loading = priority ? 'eager' : 'lazy',
  ...props
}: ImageProps) {
  return (
    <div className={twMerge(imageWrapper({ aspectRatio }), className)}>
      <NextImage
        src={src}
        alt={alt}
        fill
        className={image({ objectFit })}
        priority={priority}
        fetchPriority={priority ? 'high' : undefined}
        sizes={sizes}
        quality={quality}
        loading={loading}
        {...props}
      />
    </div>
  );
}

// For backward compatibility
export { CustomImage as Image };
