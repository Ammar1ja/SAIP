import { infoItemVariants } from './InfoItem.styles';
import { InfoItemProps } from './InfoItem.types';
import { twMerge } from 'tailwind-merge';
import { FC } from 'react';

export const InfoItem: FC<InfoItemProps> = ({
  title,
  alt,
  icon,
  className,
  children,
  variant = 'default',
}) => {
  return (
    <div className={twMerge(infoItemVariants({ variant }), className)}>
      <div className="grid grid-cols-[auto_1fr] gap-x-3 space-y-3">
        <div className="flex items-start">
          <div className="flex items-center justify-center w-8 h-8 bg-success-600 rounded-sm text-white">
            {typeof icon === 'string' ? (
              icon.startsWith('http') || icon.startsWith('/') ? (
                <img src={icon} alt={alt || 'icon'} className="w-4 h-4" />
              ) : (
                <span className="text-sm">{icon}</span>
              )
            ) : (
              <span className="w-4 h-4">{icon}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <span className="text-xl font-medium text-text-default">{title}</span>
          {children && (
            <div className="flex flex-col text-text-primary-paragraph space-y-3">{children}</div>
          )}
        </div>
      </div>
    </div>
  );
};
