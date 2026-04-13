'use client';

import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { Search as SearchIcon } from 'lucide-react';
import { SearchProps } from './Search.types';
import {
  searchContainer,
  searchWrapper,
  searchLabel,
  searchInput,
  searchLeadingIcon,
} from './Search.styles';

export const Search = forwardRef<HTMLInputElement, SearchProps>(
  (
    {
      className,
      label,
      placeholder = 'Search',
      value,
      onChange,
      onSearch,
      disabled,
      ariaLabel = 'Search',
      ...props
    },
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && value) {
        onSearch?.(value);
      }
    };

    const inputId = props.id || 'search-input';

    return (
      <div className={twMerge(searchContainer(), className)}>
        {label && (
          <label htmlFor={inputId} className={searchLabel()}>
            {label}
          </label>
        )}
        <div className={searchWrapper()}>
          <SearchIcon className={searchLeadingIcon()} aria-hidden="true" />
          <input
            ref={ref}
            id={inputId}
            type="search"
            className={searchInput()}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-label={ariaLabel}
            {...props}
          />
        </div>
      </div>
    );
  },
);

Search.displayName = 'Search';
