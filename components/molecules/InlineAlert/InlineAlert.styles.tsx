import type { InlineAlertVariant } from './InlineAlert.types';
import { CircleCheck, InfoIcon, MessageCircleQuestion, TriangleAlert } from 'lucide-react';
import { cva } from 'class-variance-authority';

export const alertIconComponents: Record<InlineAlertVariant, React.ComponentType> = {
  default: MessageCircleQuestion,
  info: InfoIcon,
  error: TriangleAlert,
  warning: MessageCircleQuestion,
  success: CircleCheck,
};

const baseTitleStyles = ['text-text-natural', 'font-semibold'];

const baseContainerStyles = [
  'w-full',
  'bg-white',
  'overflow-hidden',
  'relative',
  'z-40',
  'p-4',
  'md:px-6',
];
const baseDecoratorStyles = [
  'absolute',
  'top-0',
  'left-0',
  'w-full',
  'h-2',
  'md:w-2',
  'md:h-full',
  'ltr:md:left-0',
  'ltr:md:right-auto',
  'rtl:md:right-0',
  'rtl:md:left-auto',
];

const baseIconStyles = ['p-2.5', 'rounded-full'];

export const alertTitle = cva(baseTitleStyles, {
  variants: {
    variant: {
      default: '',
      info: '',
      error: '',
      warning: '',
      success: '',
    },
    emphasized: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    { variant: 'default', emphasized: true, className: 'text-gray-800' },
    { variant: 'info', emphasized: true, className: 'text-info-700' },
    { variant: 'error', emphasized: true, className: 'text-error-700' },
    { variant: 'warning', emphasized: true, className: 'text-warning-700' },
    { variant: 'success', emphasized: true, className: 'text-success-700' },
  ],
  defaultVariants: {
    variant: 'default',
    emphasized: false,
  },
});

export const alertContainer = cva(baseContainerStyles, {
  variants: {
    variant: {
      default: '',
      info: '',
      error: '',
      warning: '',
      success: '',
    },
    emphasized: {
      true: '',
      false: '',
    },
    bordered: {
      true: 'border border-gray-300',
      false: 'border-none',
    },
    shadow: {
      true: 'shadow-xl',
      false: 'shadow-none',
    },
    radius: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
    },
  },
  compoundVariants: [
    { variant: 'default', emphasized: true, className: 'bg-gray-25' },
    { variant: 'info', emphasized: true, className: 'bg-info-25' },
    { variant: 'error', emphasized: true, className: 'bg-error-25' },
    { variant: 'warning', emphasized: true, className: 'bg-warning-25' },
    { variant: 'success', emphasized: true, className: 'bg-success-25' },

    { variant: 'default', emphasized: true, bordered: true, className: 'border-gray-300' },
    { variant: 'info', emphasized: true, bordered: true, className: 'border-info-200' },
    { variant: 'error', emphasized: true, bordered: true, className: 'border-error-200' },
    { variant: 'warning', emphasized: true, bordered: true, className: 'border-warning-200' },
    { variant: 'success', emphasized: true, bordered: true, className: 'border-success-200' },
  ],

  defaultVariants: {
    variant: 'default',
    emphasized: false,
    bordered: true,
    shadow: false,
    radius: 'md',
  },
});

export const alertDecorator = cva(baseDecoratorStyles, {
  variants: {
    variant: {
      default: 'bg-gray-200',
      info: 'bg-info-600',
      error: 'bg-error-600',
      warning: 'bg-warning-600',
      success: 'bg-success-600',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const alertIcon = cva(baseIconStyles, {
  variants: {
    variant: {
      default: 'text-icon-default-500 bg-gray-50',
      info: 'text-info-700 bg-info-50',
      error: 'text-error-600 bg-error-50',
      warning: 'text-warning-700 bg-warning-50',
      success: 'text-success-700 bg-success-50',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
