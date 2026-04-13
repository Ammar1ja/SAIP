import React from 'react';
import { ReactNode } from 'react';

export const DirectionDecorator = (Story: () => ReactNode, context: any) => {
  const dir = context.parameters?.direction || 'ltr';

  return (
    <div dir={dir} className="storybook-direction-wrapper">
      <Story />
    </div>
  );
};
