'use client';

import Icon from '@/components/atoms/Icon';
import Button from '@/components/atoms/Button';
import TextContent from '@/components/atoms/TextConent';
import Paragraph from '@/components/atoms/Paragraph';
import type { InlineAlertProps } from './InlineAlert.types';
import { XIcon } from 'lucide-react';
import {
  alertContainer,
  alertDecorator,
  alertIcon,
  alertIconComponents,
  alertTitle,
} from './InlineAlert.styles';
import { twMerge } from 'tailwind-merge';
import { useIsMobile } from '@/hooks/useIsMobile';
import { forwardRef, useState } from 'react';

export const InlineAlert = forwardRef<HTMLDivElement, InlineAlertProps>(
  (
    {
      alertContent,
      role = 'status',
      ariaLabelledby = 'alert-title',
      ariaDescribedby = 'alert-description',
      defaultOpen = true,
      isOpen: isOpenProp,
      onClose,
      variant = 'default',
      emphasized,
      shadow,
      bordered,
      radius,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const isMobile = useIsMobile();
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = isOpenProp !== undefined;
    const isOpen = isControlled ? isOpenProp : internalOpen;

    // Guard clause: early return to prevent rendering when alert is closed
    if (!isOpen) return null;

    // Guard clause: early return to prevent rendering when alert is empty
    if (!children && !alertContent) return null;

    const { title, description, actions, additionalActions } = alertContent ?? {};

    const handleCloseAlert = () => {
      if (!isControlled) {
        setInternalOpen(false);
      }
      onClose?.();
    };

    // Helper function for rendering provided actions
    const renderActions = () => {
      return (
        <div className="space-y-2">
          <div className="flex flex-col gap-2 md:gap-8 md:flex-row md:flex-wrap md:items-baseline">
            {actions?.primary && (
              <Button
                intent={isMobile ? 'secondary' : 'transparent'}
                size="md"
                className="px-0"
                underline={!isMobile}
                ariaLabel={actions.primary.ariaLabel}
                href={actions.primary.action === 'back' ? undefined : actions.primary.href}
                target={actions.primary.target}
                rel={actions.primary.rel}
                disabled={actions.primary.disabled}
                download={actions.primary.download}
                type={actions.primary.type}
                role={actions.primary.role}
                ariaExpanded={actions.primary.ariaExpanded}
                ariaControls={actions.primary.ariaControls}
                ariaPressed={actions.primary.ariaPressed}
                ariaDescribedby={actions.primary.ariaDescribedby}
                loading={actions.primary.loading}
                fullWidth={actions.primary.fullWidth}
                onClick={
                  actions.primary.action === 'back' ? () => window.history.back() : undefined
                }
              >
                {actions.primary.children}
              </Button>
            )}

            {actions?.secondary && (
              <Button
                intent="transparent"
                size="sm"
                className="px-0"
                underline
                ariaLabel={actions.secondary.ariaLabel}
                href={actions.secondary.action === 'back' ? undefined : actions.secondary.href}
                target={actions.secondary.target}
                rel={actions.secondary.rel}
                disabled={actions.secondary.disabled}
                download={actions.secondary.download}
                type={actions.secondary.type}
                role={actions.secondary.role}
                ariaExpanded={actions.secondary.ariaExpanded}
                ariaControls={actions.secondary.ariaControls}
                ariaPressed={actions.secondary.ariaPressed}
                ariaDescribedby={actions.secondary.ariaDescribedby}
                loading={actions.secondary.loading}
                fullWidth={actions.secondary.fullWidth}
                onClick={
                  actions.secondary.action === 'back' ? () => window.history.back() : undefined
                }
              >
                {actions.secondary.children}
              </Button>
            )}
          </div>

          {additionalActions}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        role={role}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        className={twMerge(
          alertContainer({ variant, emphasized, shadow, bordered, radius }),
          className,
        )}
        {...rest}
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-[min-content_1fr_min-content]">
          {/* Grid item contains decorative icon */}
          <div className="col-start-1 row-start-1 justify-self-start">
            <Icon
              component={alertIconComponents[variant]}
              className={twMerge(alertIcon({ variant }))}
              size="large"
            />
          </div>

          {/* Grid item contains close button */}
          <div className="col-start-2 row-start-1 md:col-start-3 justify-self-end">
            <Button
              ariaLabel="Close alert"
              onClick={handleCloseAlert}
              intent="transparent"
              size="sm"
              className="px-0 rounded-full"
            >
              <Icon component={XIcon} size="medium" />
            </Button>
          </div>

          {/* Grid item contains alert title and description */}
          <div className="col-start-1 col-end-3 row-start-2 md:col-start-2 md:row-start-1 md:space-y-2">
            <TextContent className="space-y-1 md:space-y-2">
              <Paragraph
                id={ariaLabelledby}
                variant="compact"
                weight="semibold"
                className={twMerge(alertTitle({ variant, emphasized }))}
              >
                {title}
              </Paragraph>

              {description && (
                <TextContent
                  id={ariaDescribedby}
                  size="sm"
                  className="space-y-1 text-text-primary-paragraph"
                >
                  {description}
                </TextContent>
              )}
            </TextContent>
          </div>

          {/* Grid item contains action elements */}
          {(actions || additionalActions) && (
            <div className="col-start-1 col-end-3 row-start-3 md:col-start-2 md:row-start-2">
              {renderActions()}
            </div>
          )}
        </div>

        {children}

        {/*  Colorful decorative stripe */}
        <span className={alertDecorator({ variant })}></span>
      </div>
    );
  },
);

InlineAlert.displayName = 'InlineAlert';

export default InlineAlert;
