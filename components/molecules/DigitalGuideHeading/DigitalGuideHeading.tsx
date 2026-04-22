import type { DigitalGuideHeadingProps } from './DigitalGuideHeading.types';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Icon from '@/components/atoms/Icon';
import Label from '@/components/atoms/Label/Label';
import { HomeIcon } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

function DigitalGuideHeading({ title, icon, label, description }: DigitalGuideHeadingProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid xl:items-center xl:grid-cols-[0.5fr_1fr_0.5fr] gap-2">
        <div className="flex gap-4 items-center order-1 xl:order-none">
          <Button
            ariaLabel="Go back to Digital Guides"
            href={ROUTES.RESOURCES.IP_INFORMATION.DIGITAL_GUIDE.ROOT}
            intent="secondary"
            className="hidden px-0 xl:grid w-fit aspect-square"
          >
            <HomeIcon />
          </Button>
          {label && (
            <Label className="pointer-events-none" size="sm">
              {icon && <Icon component={icon} size="small" />}
              {label}
            </Label>
          )}
        </div>
        <Heading as="h2" size="h2" className="xl:text-center">
          {title}
        </Heading>
      </div>
      {description && (
        <div
          className="text-base md:text-lg text-neutral-600 xl:text-center xl:max-w-[52rem] xl:mx-auto"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
}

export default DigitalGuideHeading;
