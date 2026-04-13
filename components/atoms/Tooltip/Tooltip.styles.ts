import { cva } from 'class-variance-authority';

export const tooltipStyle = cva(
  'absolute z-50 inline-block rounded-md bg-gray-800 text-white shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 whitespace-nowrap max-w-none',
  {
    variants: {
      position: {
        top: 'bottom-full left-1/2 -translate-x-1/2 -translate-y-1 mb-2 group-hover:translate-y-[-4px]',
        bottom:
          'top-full left-1/2 -translate-x-1/2 translate-y-1 mt-2 group-hover:translate-y-[4px]',
        left: 'right-full top-1/2 -translate-y-1/2 -translate-x-1 mr-2 group-hover:translate-x-[-4px]',
        right:
          'left-full top-1/2 -translate-y-1/2 translate-x-1 ml-2 group-hover:translate-x-[4px]',
      },
      size: {
        sm: 'text-xs px-2 py-2',
        md: 'text-sm px-3 py-2.5',
        lg: 'text-md px-4 py-3',
      },
    },
    defaultVariants: {
      position: 'top',
      size: 'md',
    },
  },
);

export const tooltipArrowStyle = cva('absolute w-0 h-0 border-4 border-transparent', {
  variants: {
    position: {
      top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-800',
      bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800',
      left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-800',
      right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-800',
    },
  },
  defaultVariants: {
    position: 'top',
  },
});
