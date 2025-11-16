import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  forwardRef,
} from 'react';
import { VariableSizeList as List } from 'react-window';
import { Checkbox } from './components/Checkbox';
import { Chip } from './components/Chip';
import { Spinner } from './components/Spinner';
import type {
  Option,
  PaginationResponse,
  PaginationDetails,
  LoadPageParams,
  SelectAllState,
  PaginatedMultiSelectProps,
} from './types';
import './styles.css';

// Constants
const ITEM_SIZE = 36;
const MAX_VISIBLE_ITEMS = 8;
const DEFAULT_SEARCH_DEBOUNCE_MS = 300;
const SCROLL_THRESHOLD = 50;
const FOCUS_DELAY_MS = 10;
const SCROLL_SETUP_DELAY_MS = 100;

// Virtual List Component
interface ListboxComponentProps {
  children?: React.ReactNode[];
  onScroll: (scrollInfo: any) => void;
  extraContent: React.ReactNode;
  selectAllState: SelectAllState;
  onSelectAll: () => void;
  multiple: boolean;
  showSelectAll: boolean;
}

const ListboxComponent = forwardRef<HTMLDivElement, ListboxComponentProps>(
  function ListboxComponent(props, ref) {
    const {
      children = [],
      onScroll,
      extraContent,
      selectAllState,
      onSelectAll,
      multiple,
      showSelectAll,
    } = props;

    const selectAllItem =
      showSelectAll && multiple ? (
        <div
          key="select-all"
          onClick={onSelectAll}
          className="rpms-select-all-item"
          style={{ height: ITEM_SIZE }}
        >
          <Checkbox
            checked={selectAllState === 'all'}
            indeterminate={selectAllState === 'some'}
          />
          <span className="rpms-select-all-label">Select All</span>
        </div>
      ) : null;

    const dividerItem =
      showSelectAll && multiple ? (
        <div key="divider" className="rpms-divider" data-item-type="divider" />
      ) : null;

    const extraContentItem = extraContent ? (
      <div
        key="extra-content"
        className="rpms-extra-content"
        style={{ height: ITEM_SIZE }}
      >
        {extraContent}
      </div>
    ) : null;

    const itemData = [
      ...(selectAllItem ? [selectAllItem] : []),
      ...(dividerItem ? [dividerItem] : []),
      ...(extraContentItem ? [extraContentItem] : []),
      ...children,
    ];

    const itemCount = itemData.length;
    const maxHeight = MAX_VISIBLE_ITEMS * ITEM_SIZE;

    const getItemSize = (index: number) => {
      const item = itemData[index];
      if (
        item &&
        typeof item === 'object' &&
        'props' in item &&
        item.props?.['data-item-type'] === 'divider'
      ) {
        return 1;
      }
      return ITEM_SIZE;
    };

    return (
      <div ref={ref} className="rpms-virtual-list-container">
        <List
          height={Math.min(maxHeight, itemCount * ITEM_SIZE)}
          width="100%"
          itemCount={itemCount}
          itemSize={getItemSize}
          itemData={itemData}
          onScroll={onScroll}
        >
          {({ index, style, data }) => <div style={style}>{data[index]}</div>}
        </List>
      </div>
    );
  }
);

export const PaginatedMultiSelect = <T extends Option = Option>({
  // Data fetching
  onLoadPage,
  onSearch,
  initialData = null,

  // Selection
  value,
  onChange,
  onBlur,
  multiple = false,

  // Options configuration
  getOptionLabel,
  getOptionValue,
  renderOption,

  // UI customization
  placeholder = 'Type to search...',
  label,
  disabled = false,
  loading = false,
  searchDebounce = DEFAULT_SEARCH_DEBOUNCE_MS,
  defaultPageSize = 50,
  maxVisibleItems = MAX_VISIBLE_ITEMS,

  // Advanced features
  limitTags = 2,
  showSelectAll = true,
  selectAllLabel = 'Select All',
  clearable = true,

  // Styling
  className = '',
  classNames = {},
  styles = {},

  // Callbacks
  onOpen,
  onClose,
  onSelectOption,
}: PaginatedMultiSelectProps<T>) => {
  // State
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [paginationDetails, setPaginationDetails] = useState<PaginationDetails>({
    onPage: 1,
    pageSize: defaultPageSize,
    totalPages: null,
    totalRecords: null,
  });
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [shouldPreserveFocus, setShouldPreserveFocus] = useState(false);
  const [optionsMap, setOptionsMap] = useState<Map<any, T>>(new Map());
  const [searchResults, setSearchResults] = useState<T[]>([]);

  // Refs
  const searchTimeoutRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);
  const lastInitialDataRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper functions
  const stableGetOptionValue = useCallback(
    (option: T): any => {
      if (typeof getOptionValue === 'function') {
        return getOptionValue(option);
      }
      return option?.value || option?.id || option;
    },
    [getOptionValue]
  );

  const stableGetOptionLabel = useCallback(
    (option: T): string => {
      if (typeof getOptionLabel === 'function') {
        return getOptionLabel(option);
      }
      return option?.label || option?.name || String(option);
    },
    [getOptionLabel]
  );

  const isSearchResponse = useCallback((response: any): boolean => {
    return response?.isSearch || (response?.searchTerms?.length ?? 0) > 0;
  }, []);

  const parseResponseData = useCallback(
    (response: PaginationResponse<T> | T[] | null) => {
      if (!response) return null;

      if (Array.isArray(response)) {
        return {
          data: response,
          pagination: {
            onPage: 1,
            pageSize: defaultPageSize,
            totalPages: null,
            totalRecords: response.length,
          },
          isSearch: false,
        };
      }

      if ('data' in response && Array.isArray(response.data)) {
        return {
          data: response.data,
          pagination: {
            onPage: response.onPage || 1,
            pageSize: response.pageSize || defaultPageSize,
            totalPages: response.totalPages ?? null,
            totalRecords: response.totalRecords ?? null,
          },
          isSearch: isSearchResponse(response),
        };
      }

      return null;
    },
    [defaultPageSize, isSearchResponse]
  );

  const updateOptionsMap = useCallback(
    (data: T[]) => {
      setOptionsMap((prevMap) => {
        const newMap = new Map(prevMap);
        data.forEach((option) => {
          const key = stableGetOptionValue(option);
          newMap.set(key, option);
        });
        return newMap;
      });
    },
    [stableGetOptionValue]
  );

  // Handle initial data
  useEffect(() => {
    if (!initialData || lastInitialDataRef.current === initialData) {
      return;
    }

    lastInitialDataRef.current = initialData;

    const wasInputFocused =
      document.activeElement?.tagName === 'INPUT' &&
      document.activeElement?.getAttribute('aria-autocomplete') === 'list';

    if (wasInputFocused) {
      setShouldPreserveFocus(true);
    }

    const parsedData = parseResponseData(initialData);
    if (!parsedData || !Array.isArray(parsedData.data) || parsedData.data.length === 0)
      return;

    const { data, pagination, isSearch } = parsedData;

    if (isSearch || inputValue.trim()) {
      setSearchResults(data);
      setSearchMode(true);
      setIsSearching(false);
    } else {
      updateOptionsMap(data);
      if (!isInitializedRef.current) {
        isInitializedRef.current = true;
      }

      setPaginationDetails(pagination);
      setHasNextPage(
        pagination.totalPages !== null
          ? pagination.onPage < pagination.totalPages
          : data.length === pagination.pageSize
      );
    }

    setIsLoadingMore(false);
  }, [initialData, parseResponseData, updateOptionsMap, inputValue]);

  // Current options
  const currentOptions = useMemo(() => {
    let baseOptions: T[] = searchMode
      ? searchResults.flat()
      : Array.from(optionsMap.values()).flat();

    // Ensure selected options are in the list
    const valuesToCheck = Array.isArray(value) ? value : value ? [value] : [];

    valuesToCheck.forEach((val) => {
      const exists = baseOptions.some((opt) => stableGetOptionValue(opt) === val);

      if (!exists) {
        // Try to find the option from the options map
        const option = optionsMap.get(val);
        if (option) {
          baseOptions = [option, ...baseOptions];
        }
      }
    });

    return baseOptions.filter((option) => {
      const optionValue = stableGetOptionValue(option);
      return (
        option && optionValue !== null && optionValue !== undefined && optionValue !== ''
      );
    });
  }, [optionsMap, searchResults, searchMode, value, stableGetOptionValue]);

  // Focus preservation
  useEffect(() => {
    if (shouldPreserveFocus && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        setShouldPreserveFocus(false);
      }, FOCUS_DELAY_MS);

      return () => clearTimeout(timer);
    }
  }, [shouldPreserveFocus]);

  // Selected options
  const selectedOptions = useMemo(() => {
    if (multiple) {
      const values = Array.isArray(value) ? value : value ? [value] : [];
      return currentOptions.filter((option) =>
        values.includes(stableGetOptionValue(option))
      );
    }

    return (
      currentOptions.find((option) => stableGetOptionValue(option) === value) || null
    );
  }, [currentOptions, value, stableGetOptionValue, multiple]);

  // Select all state
  const selectAllState: SelectAllState = useMemo(() => {
    if (!multiple || !currentOptions.length) return 'none';

    const selectedValues = Array.isArray(value) ? value : [];
    const currentOptionValues = currentOptions.map(stableGetOptionValue);
    const selectedCount = currentOptionValues.filter((val) =>
      selectedValues.includes(val)
    ).length;

    if (selectedCount === 0) return 'none';
    if (selectedCount === currentOptions.length) return 'all';
    return 'some';
  }, [multiple, currentOptions, value, stableGetOptionValue]);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (!multiple) return;

    const currentValues = Array.isArray(value) ? value : [];
    const allOptionValues = currentOptions.map(stableGetOptionValue);

    let newValues: any[];

    if (selectAllState === 'all') {
      newValues = currentValues.filter((val) => !allOptionValues.includes(val));
    } else {
      const uniqueValues = new Set([...currentValues, ...allOptionValues]);
      newValues = Array.from(uniqueValues);
    }

    onChange?.(newValues);
    onBlur?.(newValues);
    onSelectOption?.(currentOptions);
  }, [
    multiple,
    value,
    currentOptions,
    stableGetOptionValue,
    selectAllState,
    onChange,
    onBlur,
    onSelectOption,
  ]);

  // Load next page
  const loadNextPage = useCallback(async () => {
    if (!hasNextPage || isLoadingMore || searchMode || !onLoadPage) return;

    setIsLoadingMore(true);
    try {
      if (
        paginationDetails.totalPages === null ||
        paginationDetails.onPage < paginationDetails.totalPages
      ) {
        await onLoadPage({
          searchTerms: [],
          onPage: paginationDetails.onPage + 1,
          pageSize: paginationDetails.pageSize,
        });
      }
    } catch (error) {
      console.error('Error loading next page:', error);
      setHasNextPage(false);
      setIsLoadingMore(false);
    }
  }, [hasNextPage, isLoadingMore, searchMode, paginationDetails, onLoadPage]);

  // Scroll handling
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const scrollableElement = dropdownRef.current?.querySelector(
        '.rpms-virtual-list-container'
      );

      if (!scrollableElement) return;

      const handleDirectScroll = (e: Event) => {
        const target = e.target as HTMLElement;
        const { scrollTop, scrollHeight, clientHeight } = target;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        const hasScrolledSignificantly = scrollTop > ITEM_SIZE;

        if (
          hasScrolledSignificantly &&
          distanceFromBottom <= SCROLL_THRESHOLD &&
          hasNextPage &&
          !isLoadingMore &&
          !searchMode
        ) {
          loadNextPage();
        }
      };

      scrollableElement.addEventListener('scroll', handleDirectScroll, {
        passive: true,
      });
      return () => scrollableElement.removeEventListener('scroll', handleDirectScroll);
    }, SCROLL_SETUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isOpen, hasNextPage, isLoadingMore, searchMode, loadNextPage]);

  // Virtual scroll callback
  const handleScroll = useCallback(
    (scrollInfo: any) => {
      if (scrollInfo.scrollUpdateWasRequested || scrollInfo.scrollDirection !== 'forward')
        return;

      const { scrollOffset } = scrollInfo;
      const totalItems = currentOptions.length;
      const visibleItemsCount = Math.min(maxVisibleItems, totalItems);
      const maxScrollOffset = Math.max(0, (totalItems - visibleItemsCount) * ITEM_SIZE);
      const distanceFromBottom = maxScrollOffset - scrollOffset;
      const threshold = ITEM_SIZE * 2;
      const hasScrolledSignificantly = scrollOffset > ITEM_SIZE;
      const isNearBottom = distanceFromBottom <= threshold;

      if (
        hasScrolledSignificantly &&
        isNearBottom &&
        hasNextPage &&
        !isLoadingMore &&
        !searchMode
      ) {
        loadNextPage();
      }
    },
    [
      hasNextPage,
      isLoadingMore,
      searchMode,
      loadNextPage,
      currentOptions.length,
      maxVisibleItems,
    ]
  );

  // Search functionality
  const performSearch = useCallback(
    async (searchValue: string) => {
      setIsSearching(true);
      setSearchMode(true);

      try {
        const searchTerms = searchValue
          .split(';')
          .map((term) => term.trim())
          .filter((term) => term.length > 0);

        if (onSearch && searchTerms.length > 0) {
          await onSearch(searchTerms);
        }
        setIsSearching(false);
      } catch (error) {
        console.error('Error searching options:', error);
        setSearchResults([]);
        setIsSearching(false);
      }
    },
    [onSearch]
  );

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newInputValue = e.target.value;
      setInputValue(newInputValue);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (newInputValue.trim()) {
        searchTimeoutRef.current = setTimeout(() => {
          performSearch(newInputValue);
        }, searchDebounce);
      } else {
        setSearchMode(false);
        setSearchResults([]);
      }
    },
    [performSearch, searchDebounce]
  );

  // Handle option selection
  const handleOptionClick = useCallback(
    (option: T) => {
      if (disabled) return;

      const optionValue = stableGetOptionValue(option);

      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        const isSelected = currentValues.includes(optionValue);

        const newValues = isSelected
          ? currentValues.filter((v) => v !== optionValue)
          : [...currentValues, optionValue];

        onChange?.(newValues);
        onBlur?.(newValues);
        onSelectOption?.(option);
      } else {
        onChange?.(optionValue);
        onBlur?.(optionValue);
        onSelectOption?.(option);
        setIsOpen(false);
        setInputValue(stableGetOptionLabel(option));
        onClose?.();
      }
    },
    [
      disabled,
      multiple,
      value,
      stableGetOptionValue,
      stableGetOptionLabel,
      onChange,
      onBlur,
      onSelectOption,
      onClose,
    ]
  );

  // Handle open/close
  const handleOpen = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    onOpen?.();
  }, [disabled, onOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchResults([]);
    setSearchMode(false);

    if (!multiple && selectedOptions && !Array.isArray(selectedOptions)) {
      setInputValue(stableGetOptionLabel(selectedOptions));
    } else if (!multiple) {
      setInputValue('');
    }

    setShouldPreserveFocus(false);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    onClose?.();
  }, [multiple, selectedOptions, stableGetOptionLabel, onClose]);

  // Handle clear
  const handleClear = useCallback(() => {
    onChange?.(multiple ? [] : '');
    onBlur?.(multiple ? [] : '');
    setInputValue('');
    setSearchResults([]);
    setSearchMode(false);
  }, [multiple, onChange, onBlur]);

  // Handle chip delete
  const handleChipDelete = useCallback(
    (optionValue: any) => {
      if (!multiple) return;

      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.filter((v) => v !== optionValue);

      onChange?.(newValues);
      onBlur?.(newValues);
    },
    [multiple, value, onChange, onBlur]
  );

  // Cleanup
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Click outside handler
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, handleClose]);

  // Extra content for dropdown
  const extraContent = useMemo(() => {
    if (isLoadingMore && !isSearching) {
      return (
        <span className="rpms-loading-text">
          Loading more options...
          {paginationDetails.totalPages && (
            <>
              {' '}
              ({paginationDetails.onPage + 1}/{paginationDetails.totalPages})
            </>
          )}
        </span>
      );
    }

    if (searchMode && !isSearching && searchResults.length === 0 && inputValue) {
      return <span className="rpms-no-results">No results found for "{inputValue}"</span>;
    }

    if (!searchMode && paginationDetails.totalRecords !== null) {
      return (
        <span className="rpms-items-count">
          {optionsMap.size} of {paginationDetails.totalRecords} items loaded
        </span>
      );
    }

    return null;
  }, [
    isLoadingMore,
    isSearching,
    searchMode,
    searchResults,
    inputValue,
    paginationDetails,
    optionsMap.size,
  ]);

  // Enhanced listbox component
  const EnhancedListboxComponent = useMemo(
    () =>
      forwardRef<HTMLDivElement, any>(function EnhancedListboxComponent(props, ref) {
        return (
          <ListboxComponent
            {...props}
            ref={ref}
            onScroll={handleScroll}
            extraContent={extraContent}
            selectAllState={selectAllState}
            onSelectAll={handleSelectAll}
            multiple={multiple}
            showSelectAll={showSelectAll && multiple && currentOptions.length > 0}
          />
        );
      }),
    [
      handleScroll,
      extraContent,
      selectAllState,
      handleSelectAll,
      multiple,
      showSelectAll,
      currentOptions.length,
    ]
  );

  // Render option
  const defaultRenderOption = useCallback(
    (option: T, isSelected: boolean) => {
      if (multiple) {
        return (
          <div className="rpms-option-content">
            <Checkbox checked={isSelected} />
            <span className="rpms-option-label">{stableGetOptionLabel(option)}</span>
          </div>
        );
      }
      return <span className="rpms-option-label">{stableGetOptionLabel(option)}</span>;
    },
    [multiple, stableGetOptionLabel]
  );

  const optionRenderer = renderOption || defaultRenderOption;

  // Render selected chips
  const renderSelectedChips = () => {
    if (!multiple || !Array.isArray(selectedOptions) || selectedOptions.length === 0) {
      return null;
    }

    const displayChips = limitTags
      ? selectedOptions.slice(0, limitTags)
      : selectedOptions;
    const remainingCount = selectedOptions.length - displayChips.length;

    return (
      <div className={`rpms-chips-container ${classNames.chip || ''}`}>
        {displayChips.map((option) => {
          const optionValue = stableGetOptionValue(option);
          return (
            <Chip
              key={optionValue}
              label={stableGetOptionLabel(option)}
              onDelete={() => handleChipDelete(optionValue)}
              disabled={disabled}
            />
          );
        })}
        {remainingCount > 0 && (
          <span className="rpms-chips-more">+{remainingCount} more</span>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`rpms-container ${className} ${classNames.container || ''} ${
        disabled ? 'rpms-disabled' : ''
      }`}
      style={styles.container}
    >
      {label && <label className="rpms-label">{label}</label>}

      {renderSelectedChips()}

      <div className="rpms-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className={`rpms-input ${classNames.input || ''} ${
            isOpen ? 'rpms-input-focused' : ''
          }`}
          style={styles.input}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleOpen}
          disabled={disabled}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="rpms-dropdown"
          role="combobox"
        />

        <div className="rpms-input-actions">
          {(loading || isSearching || isLoadingMore) && (
            <Spinner className={classNames.loader} />
          )}
          {clearable && (value || inputValue) && !disabled && (
            <button
              className="rpms-clear-button"
              onClick={handleClear}
              type="button"
              aria-label="Clear"
            >
              ×
            </button>
          )}
          <button
            className={`rpms-dropdown-arrow ${isOpen ? 'rpms-dropdown-arrow-open' : ''}`}
            onClick={() => (isOpen ? handleClose() : handleOpen())}
            type="button"
            aria-label={isOpen ? 'Close dropdown' : 'Open dropdown'}
            disabled={disabled}
          >
            ▼
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          id="rpms-dropdown"
          className={`rpms-dropdown ${classNames.dropdown || ''}`}
          style={styles.dropdown}
          role="listbox"
        >
          {currentOptions.length > 0 ? (
            <EnhancedListboxComponent ref={null}>
              {currentOptions.map((option) => {
                const optionValue = stableGetOptionValue(option);
                const isSelected = multiple
                  ? Array.isArray(value) && value.includes(optionValue)
                  : value === optionValue;

                return (
                  <div
                    key={optionValue}
                    className={`rpms-option ${classNames.option || ''} ${
                      isSelected
                        ? `rpms-option-selected ${classNames.selectedOption || ''}`
                        : ''
                    }`}
                    style={{
                      ...styles.option,
                      height: ITEM_SIZE,
                    }}
                    onClick={() => handleOptionClick(option)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {optionRenderer(option, isSelected)}
                  </div>
                );
              })}
            </EnhancedListboxComponent>
          ) : (
            <div className={`rpms-no-options ${classNames.noResults || ''}`}>
              {isSearching ? 'Searching...' : 'No options available'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
