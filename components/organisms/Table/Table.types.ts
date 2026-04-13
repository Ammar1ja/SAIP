export interface TableColumn<T> {
  key: keyof T;
  header: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface TableProps<T> {
  title?: string;
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
  showFilter?: boolean;
  showSort?: boolean;
  onFilter?: () => void;
  onSort?: () => void;
  filterLabel?: string;
  sortLabel?: string;
}
