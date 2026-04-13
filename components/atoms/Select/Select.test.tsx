import { Select } from './Select';
import { mockSelectOptions, MockSelectType, mockSelectWithDisabledOptions } from './Select.data';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const Wrapper = (props?: MockSelectType) => {
  const [value, setValue] = useState<string | string[] | undefined>(props?.value);

  const handleOnChange = (value: string | string[]) => {
    setValue(value);
    props?.onChange?.(value);
  };

  return (
    <Select {...props} options={props?.options ?? []} value={value} onChange={handleOnChange} />
  );
};

const mockFunctions = {
  onChange: vi.fn(),
  onOpenChange: vi.fn(),
};

const renderComponent = (props?: MockSelectType) => {
  render(<Wrapper {...props} />);

  return {
    trigger: screen.getByRole('button'),
    asterisk: screen.queryByText('*'),
    user: userEvent.setup(),
    getLabel: (labelText: string) => screen.queryByText(labelText.trim(), { selector: 'label' }),
    getListbox: () => screen.queryByRole('listbox'),
    getMultiOptions: () => screen.findAllByRole('checkbox'),
    getSingleOptions: () => screen.findAllByRole('option'),
    defaultProps: {
      placeholder: 'Select',
      id: 'select-input',
    },
  };
};

describe('Select', () => {
  describe('label', () => {
    it('does not render label when label prop is missing', () => {
      const labelText = 'Select label';
      const { getLabel } = renderComponent();

      const label = getLabel(labelText);

      expect(label).not.toBeInTheDocument();
    });

    it('renders label when label prop is provided', () => {
      const labelText = 'Select label';
      const { getLabel } = renderComponent({ label: labelText });

      const label = getLabel(labelText);

      expect(label).toBeInTheDocument();
    });

    it('indicates label with asterisk when required prop is provided', () => {
      const labelText = 'Select label';
      const { getLabel, asterisk } = renderComponent({ label: labelText, required: true });

      const label = getLabel(labelText);

      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent(labelText + '*');
      expect(asterisk).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('trigger button', () => {
    it('toggle listbox on click and set aria-expanded attribute', async () => {
      const { trigger, user, getListbox } = renderComponent();

      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      let listbox = getListbox();
      expect(listbox).not.toBeInTheDocument();

      await user.click(trigger);

      listbox = getListbox();
      expect(listbox).toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      await user.click(trigger);

      listbox = getListbox();
      expect(listbox).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('handles disabled state', () => {
      const { trigger } = renderComponent({ disabled: true });

      expect(trigger).toBeDisabled();
    });

    describe('label', () => {
      it('renders default label when no placeholder is provided', () => {
        const {
          trigger,
          defaultProps: { placeholder: defaultLabel },
        } = renderComponent();

        expect(trigger).toHaveTextContent(defaultLabel);
      });

      it('renders label with provided placeholder value', () => {
        const customPlaceholder = 'Custom Placeholder';
        const { trigger } = renderComponent({ placeholder: 'Custom Placeholder' });

        expect(trigger).toHaveTextContent(customPlaceholder);
      });

      describe('singleselect', () => {
        it("renders selected option's label when selected", async () => {
          const { label } = mockSelectOptions[0];
          const { trigger, user, getSingleOptions } = renderComponent({
            options: mockSelectOptions,
          });

          await user.click(trigger);
          const options = await getSingleOptions();

          await user.click(options[0]);

          expect(trigger).toHaveTextContent(label);
        });

        it('renders provided placeholder when selected label is falsy', async () => {
          const { trigger, user, getSingleOptions } = renderComponent({
            options: [{ label: '', value: 'option' }],
            placeholder: 'Custom Placeholder',
          });

          await user.click(trigger);
          const options = await getSingleOptions();

          await user.click(options[0]);

          expect(trigger).toHaveTextContent('Custom Placeholder');
        });

        it('renders default label when label is falsy and placeholder is not provided', async () => {
          const {
            trigger,
            user,
            getSingleOptions,
            defaultProps: { placeholder: defaultLabel },
          } = renderComponent({
            options: [{ label: '', value: 'option' }],
          });

          await user.click(trigger);
          const options = await getSingleOptions();

          await user.click(options[0]);

          expect(trigger).toHaveTextContent(defaultLabel);
        });
      });
    });

    describe('multiselect', () => {
      it("renders selected option's label when only one option is selected", async () => {
        const { label } = mockSelectOptions[0];
        const { trigger, user, getMultiOptions } = renderComponent({
          options: mockSelectOptions,
          multiselect: true,
        });

        await user.click(trigger);
        const options = await getMultiOptions();

        await user.click(options[1]);

        expect(trigger).toHaveTextContent(label);
      });

      it('renders provided placeholder when selected label is falsy', async () => {
        const { trigger, user, getMultiOptions } = renderComponent({
          options: [{ label: '', value: 'option-0' }],
          placeholder: 'Custom Placeholder',
          multiselect: true,
        });

        await user.click(trigger);
        const options = await getMultiOptions();

        await user.click(options[1]);

        expect(trigger).toHaveTextContent('Custom Placeholder');
      });

      it('renders default label when label is falsy and placeholder is not provided', async () => {
        const {
          trigger,
          user,
          getMultiOptions,
          defaultProps: { placeholder: defaultLabel },
        } = renderComponent({
          options: [{ label: '', value: 'option-0' }],
          multiselect: true,
        });

        await user.click(trigger);
        const options = await getMultiOptions();

        await user.click(options[1]);

        expect(trigger).toHaveTextContent(defaultLabel);
      });

      it('renders "All" when each option is selected', async () => {
        const { trigger, user, getMultiOptions } = renderComponent({
          options: mockSelectOptions,
          multiselect: true,
        });

        await user.click(trigger);
        const options = await getMultiOptions();

        await user.click(options[0]);

        expect(trigger).toHaveTextContent('All');
      });

      it('renders number of selected options when multiple selected', async () => {
        const { trigger, user, getMultiOptions } = renderComponent({
          options: mockSelectOptions,
          multiselect: true,
        });

        await user.click(trigger);
        const options = await getMultiOptions();

        await user.click(options[1]);
        await user.click(options[2]);

        expect(trigger).toHaveTextContent('2 selected');
      });
    });
  });

  describe('listbox', () => {
    it('applies default id with -dropdown suffix when no id is provided', async () => {
      const {
        trigger,
        user,
        getListbox,
        defaultProps: { id },
      } = renderComponent({ options: mockSelectOptions });

      await user.click(trigger);
      const listbox = getListbox();

      expect(listbox).toHaveAttribute('id', id + '-dropdown');
    });

    it('applies provided id with -dropdown suffix', async () => {
      const customId = 'custom-id';
      const { trigger, user, getListbox } = renderComponent({ id: customId });

      await user.click(trigger);
      const listbox = getListbox();

      expect(listbox).toHaveAttribute('id', customId + '-dropdown');
    });
  });

  describe('options', () => {
    describe('singleselect', () => {
      it('renders correct options', async () => {
        const { getSingleOptions, user, trigger } = renderComponent({
          options: mockSelectOptions,
        });

        await user.click(trigger);

        const options = await getSingleOptions();
        expect(options).toHaveLength(3);

        const labels = options.map((option) => option.textContent);
        expect(labels).toEqual(['Option 1', 'Option 2', 'Option 3']);
      });

      it('handles provided default checked option when provided', async () => {
        const { trigger, getSingleOptions, user } = renderComponent({
          options: mockSelectOptions,
          value: mockSelectOptions[0].value,
        });

        await user.click(trigger);
        const options = await getSingleOptions();

        expect(options[0]).toHaveAttribute('aria-selected', 'true');
      });

      it('handles disabled option', async () => {
        const { getSingleOptions, user, trigger } = renderComponent({
          options: mockSelectWithDisabledOptions,
        });

        await user.click(trigger);

        const options = await getSingleOptions();
        expect(options[0]).toBeDisabled();
      });
    });

    describe('multiselect', () => {
      it('renders correct options', async () => {
        const { getMultiOptions, user, trigger } = renderComponent({
          options: mockSelectOptions,
          multiselect: true,
        });

        await user.click(trigger);

        const options = await getMultiOptions();
        expect(options).toHaveLength(1 + 3);

        const labels = options.map((option) => option.parentElement?.textContent);
        expect(labels).toEqual(['All', 'Option 1', 'Option 2', 'Option 3']);
      });

      it('handles provided default checked options when multiple are provided', async () => {
        const defaultSelectedOptions = mockSelectOptions.map((option) => option.value).slice(0, 2);
        const { trigger, getMultiOptions, user } = renderComponent({
          options: mockSelectOptions,
          multiselect: true,
          value: defaultSelectedOptions,
        });

        await user.click(trigger);
        const options = await getMultiOptions();

        // Only provided values checked
        expect(options[0]).not.toBeChecked();
        expect(options[1]).toBeChecked();
        expect(options[2]).toBeChecked();
        expect(options[3]).not.toBeChecked();
      });

      it('handles provided default checked option when a single is provided', async () => {
        const { trigger, getMultiOptions, user } = renderComponent({
          options: mockSelectOptions,
          multiselect: true,
          value: mockSelectOptions[0].value,
        });

        await user.click(trigger);
        const options = await getMultiOptions();

        expect(options[1]).toBeChecked();
      });

      it('handles disabled option', async () => {
        const { getMultiOptions, user, trigger } = renderComponent({
          options: mockSelectWithDisabledOptions,
          multiselect: true,
        });

        await user.click(trigger);

        const options = await getMultiOptions();
        expect(options[1]).toBeDisabled();
      });
    });
  });

  describe('selecting option', () => {
    describe('singleselect', () => {
      it('selects single option, closes listbox, and calls callback', async () => {
        const { onChange, onOpenChange } = mockFunctions;

        const { trigger, user, getListbox, getSingleOptions } = renderComponent({
          options: mockSelectOptions,
          onChange,
          onOpenChange,
        });

        await user.click(trigger);
        const listbox = getListbox();

        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        expect(listbox).toBeInTheDocument();

        const options = await getSingleOptions();
        await user.click(options[0]);

        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(listbox).not.toBeInTheDocument();

        const optionValue = mockSelectOptions[0].value;
        expect(onChange).toHaveBeenCalledWith(optionValue);
        expect(onOpenChange).toHaveBeenLastCalledWith(false);
      });
    });

    describe('mutipleselect', () => {
      it('selects multiple options and calls callback functions', async () => {
        const { onChange } = mockFunctions;
        const { user, trigger, getMultiOptions } = renderComponent({
          options: mockSelectOptions,
          multiselect: true,
          onChange,
        });

        await user.click(trigger);

        const options = await getMultiOptions();

        // Simulate user selection
        await user.click(options[1]);
        await user.click(options[2]);

        expect(options[1]).toBeChecked();
        expect(options[2]).toBeChecked();

        await user.click(options[1]);
        expect(options[1]).not.toBeChecked();

        expect(onChange).toHaveBeenCalledWith([mockSelectOptions[2 - 1].value]);
      });

      it('selects and unselects all options using the "All" option', async () => {
        const { onChange } = mockFunctions;
        const { user, trigger, getMultiOptions } = renderComponent({
          options: mockSelectOptions,
          multiselect: true,
          onChange,
        });

        await user.click(trigger);
        const options = await getMultiOptions();

        // Simulate 'All' option selection
        await user.click(options[0]);
        options.forEach((option) => expect(option).toBeChecked());
        expect(onChange).toHaveBeenCalledWith(mockSelectOptions.map((option) => option.value));

        // Simulate 'All' option unselection
        await user.click(options[0]);
        options.forEach((option) => expect(option).not.toBeChecked());
        expect(onChange).toHaveBeenCalledWith([]);
      });
    });
  });

  describe('event handling', () => {
    it('closes listbox on outside click', async () => {
      const { onOpenChange } = mockFunctions;
      const { trigger, getListbox, user } = renderComponent({});

      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      await user.click(trigger);
      const listbox = getListbox();

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(listbox).toBeInTheDocument();

      await user.click(document.body);

      expect(listbox).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });

    describe('keyboard navigation', () => {
      it('closes listbox on Escape key press', async () => {
        const { trigger, getListbox, user } = renderComponent();

        expect(trigger).toHaveAttribute('aria-expanded', 'false');

        await user.click(trigger);
        const listbox = getListbox();

        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        expect(listbox).toBeInTheDocument();

        await user.keyboard('{Escape}');

        expect(listbox).not.toBeInTheDocument();
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
      });

      describe('singleselect', () => {
        it('traps focus using arrow keys', async () => {
          const { trigger, getSingleOptions, user } = renderComponent({
            options: mockSelectOptions,
          });

          await user.click(trigger);
          const options = await getSingleOptions();
          expect(options).toHaveLength(3);

          await user.keyboard('{ArrowDown}');
          expect(options[0]).toHaveFocus();

          await user.keyboard('{ArrowUp}');
          expect(trigger).toHaveFocus();

          await user.keyboard('{ArrowUp}');
          expect(options[2]).toHaveFocus();

          await user.keyboard('{ArrowDown}');
          expect(trigger).toHaveFocus();
        });

        it('traps focus using Tab and Tab+Shift keys', async () => {
          const { trigger, getSingleOptions, user } = renderComponent({
            options: mockSelectOptions,
          });

          await user.click(trigger);
          const options = await getSingleOptions();
          expect(options).toHaveLength(3);

          await user.keyboard('{Tab}');
          expect(options[0]).toHaveFocus();

          await user.keyboard('{Shift>}{Tab}{/Shift}');
          expect(trigger).toHaveFocus();

          await user.keyboard('{Shift>}{Tab}{/Shift}');
          expect(options[2]).toHaveFocus();

          await user.keyboard('{Tab}');
          expect(trigger).toHaveFocus();
        });
      });

      describe('multiselect', () => {
        it('traps focus using arrow keys', async () => {
          const { trigger, getMultiOptions, user } = renderComponent({
            multiselect: true,
            options: mockSelectOptions,
          });

          await user.click(trigger);
          const options = await getMultiOptions();
          expect(options).toHaveLength(1 + 3);

          await user.keyboard('{ArrowDown}');
          expect(options[0]).toHaveFocus();

          await user.keyboard('{ArrowUp}');
          expect(trigger).toHaveFocus();

          await user.keyboard('{ArrowUp}');
          expect(options[3]).toHaveFocus();

          await user.keyboard('{ArrowDown}');
          expect(trigger).toHaveFocus();
        });

        it('traps focus using Tab and Tab+Shift keys', async () => {
          const { trigger, getMultiOptions, user } = renderComponent({
            multiselect: true,
            options: mockSelectOptions,
          });

          await user.click(trigger);
          const options = await getMultiOptions();
          expect(options).toHaveLength(4);

          await user.keyboard('{Tab}');
          expect(options[0]).toHaveFocus();

          await user.keyboard('{Shift>}{Tab}{/Shift}');
          expect(trigger).toHaveFocus();

          await user.keyboard('{Shift>}{Tab}{/Shift}');
          expect(options[3]).toHaveFocus();

          await user.keyboard('{Tab}');
          expect(trigger).toHaveFocus();
        });
      });
    });
  });
});
