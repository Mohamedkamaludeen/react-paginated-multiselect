import * as React from 'react';

export interface Option {
  [key: string]: any;
}

export interface PaginationResponse<T = Option> {
  data: T[];
  onPage?: number;
  pageSize?: number;
  totalPages?: number | null;
  totalRecords?: number | null;
  isSearch?: boolean;
  searchTerms?: string[];
}

export interface PaginationDetails {
  onPage: number;
  pageSize: number;
  totalPages: number | null;
  totalRecords: number | null;
}

export interface LoadPageParams {
  searchTerms: string[];
  onPage: number;
  pageSize: number;
}

export type SelectAllState = "none" | "some" | "all";

export interface PaginatedMultiSelectProps<T = Option> {
  // Data fetching
  onLoadPage: (params: LoadPageParams) => Promise<PaginationResponse<T> | T[]>;
  onSearch?: (searchTerms: string[]) => Promise<PaginationResponse<T> | T[]>;
  initialData?: PaginationResponse<T> | T[] | null;
  
  // Selection
  value?: any | any[];
  onChange?: (value: any | any[]) => void;
  onBlur?: (value: any | any[]) => void;
  multiple?: boolean;
  
  // Options configuration
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => any;
  renderOption?: (option: T, isSelected: boolean) => React.ReactNode;
  
  // UI customization
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  searchDebounce?: number;
  defaultPageSize?: number;
  maxVisibleItems?: number;
  
  // Advanced features
  limitTags?: number;
  showSelectAll?: boolean;
  selectAllLabel?: string;
  clearable?: boolean;
  
  // Styling
  className?: string;
  classNames?: {
    container?: string;
    input?: string;
    dropdown?: string;
    option?: string;
    selectedOption?: string;
    chip?: string;
    checkbox?: string;
    loader?: string;
    noResults?: string;
    selectAll?: string;
  };
  styles?: {
    container?: React.CSSProperties;
    input?: React.CSSProperties;
    dropdown?: React.CSSProperties;
    option?: React.CSSProperties;
    chip?: React.CSSProperties;
  };
  
  // Callbacks
  onOpen?: () => void;
  onClose?: () => void;
  onSelectOption?: (option: T | T[]) => void;
}
