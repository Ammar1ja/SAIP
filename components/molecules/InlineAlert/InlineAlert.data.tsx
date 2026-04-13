export const mockInlineAlertContent = {
  title: 'Test title',
  description: 'Test desription',
  actions: {
    primary: {
      children: 'Test primary button',
      ariaLabel: 'Test primary button aria label',
    },
    secondary: {
      children: 'Test secondary button ',
      ariaLabel: 'Test secondary button aria label',
    },
  },
  additionalActions: <div data-testid="test-additional-action"></div>,
};
