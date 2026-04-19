import React from 'react';
import { FileText } from 'lucide-react';
import { RelatedService } from '@/components/sections/IPLicensingRelatedServicesSection';
import Button from '@/components/atoms/Button';

const IPLicensingServiceCard = ({
  question,
  title,
  description,
  price,
  ctaLabel,
  ctaHref,
}: RelatedService) => {
  return (
    <div className="flex flex-col gap-8 py-6 lg:flex-row lg:items-center lg:gap-12">
      <div className="w-full lg:min-w-0 lg:flex-1">
        <h2 className="font-body text-[35px] leading-[44px] tracking-[-0.02em] font-medium text-text-default">
          {question}
        </h2>
      </div>

      <div className="w-full lg:w-[713px] lg:shrink-0">
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-lg border border-border-natural-primary bg-white shadow-none h-fit sm:grid-cols-2">
          <div className="flex h-full min-h-0 flex-col items-center justify-center gap-4 bg-primary-25 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-700">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h4 className="m-0 text-center font-body text-[18px] font-medium leading-[28px] tracking-[0] text-text-default">
              {title}
            </h4>
          </div>

          <div className="flex h-full min-h-0 flex-col gap-6 bg-white p-6">
            <div className="flex flex-1 flex-col gap-4">
              <p className="m-0 font-body text-[16px] font-normal leading-[24px] tracking-[0] text-text-primary-paragraph">
                {description}
              </p>
              <div className="font-body text-[16px] font-medium leading-[24px] tracking-[0] text-text-primary-paragraph">
                {price}
              </div>
            </div>
            <div className="mt-auto">
              <div className="inline-flex w-full sm:w-auto">
                <Button
                  href={ctaHref}
                  intent="primary"
                  size="md"
                  fullWidth={false}
                  className="h-10 w-full px-4 sm:w-auto sm:flex-none sm:self-start"
                  ariaLabel={ctaLabel}
                >
                  {ctaLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPLicensingServiceCard;
