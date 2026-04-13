export interface FilterToggleProps {
  fields: any[];
  values: Record<string, any>;
  onChange?: (fieldId: string, value: any) => void;
  onClear?: () => void;
  onToggle: () => void;
  isOpen: boolean;
}
