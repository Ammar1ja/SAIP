'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Filter, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { FilterField } from '../Filters/Filters.types';
import { FilterOptionsScreen } from './FilterOptionsScreen';
import { useDirection } from '@/context/DirectionContext';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  fields: FilterField[];
  values: Record<string, string | string[]>;
  onChange: (fieldId: string, value: string | string[]) => void;
  onClear: () => void;
}

export const FilterModal = ({
  isOpen,
  onClose,
  fields,
  values,
  onChange,
  onClear,
}: FilterModalProps) => {
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [hasSelectionInCurrentField, setHasSelectionInCurrentField] = useState(false);
  const t = useTranslations('common.filters');
  const dir = useDirection() || 'ltr';
  const isRtl = dir === 'rtl';
  const hasModalHistoryEntryRef = useRef(false);

  // Translation helper for showResults
  const showResultsLabel = t('showResults');

  // Count active filters
  const activeFiltersCount = fields.reduce((count, field) => {
    const value = values[field.id];
    if (field.type === 'select' && field.multiselect) {
      return count + (Array.isArray(value) && value.length > 0 ? 1 : 0);
    }
    return count + (value && value !== '' ? 1 : 0);
  }, 0);

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  const handleFieldClick = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field?.disabled) {
      return;
    }
    setSelectedFieldId(fieldId);

    if (field && field.type === 'select') {
      const value = values[field.id];
      const hasValue = field.multiselect
        ? Array.isArray(value) && value.length > 0
        : Boolean(value && value !== '');
      setHasSelectionInCurrentField(hasValue);
    } else {
      setHasSelectionInCurrentField(false);
    }
  };

  const handleBack = () => {
    setSelectedFieldId(null);
    setHasSelectionInCurrentField(false);
  };

  const handleShowResults = () => {
    closeModal();
  };

  const handleClear = () => {
    onClear();
    setSelectedFieldId(null);
  };

  const closeModal = useCallback(() => {
    setSelectedFieldId(null);
    setHasSelectionInCurrentField(false);
    onClose();

    // Remove the synthetic history entry created when modal opened.
    if (
      hasModalHistoryEntryRef.current &&
      typeof window !== 'undefined' &&
      typeof window.history !== 'undefined'
    ) {
      hasModalHistoryEntryRef.current = false;
      window.history.back();
    }
  }, [onClose]);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : '';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (selectedFieldId) {
          setSelectedFieldId(null);
        } else {
          closeModal();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, selectedFieldId, closeModal]);

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined' || typeof window.history === 'undefined') {
      return;
    }

    if (!hasModalHistoryEntryRef.current) {
      window.history.pushState(
        { ...(window.history.state || {}), __mobileFilterModal: true },
        '',
        window.location.href,
      );
      hasModalHistoryEntryRef.current = true;
    }

    const handlePopState = () => {
      if (!hasModalHistoryEntryRef.current) return;

      hasModalHistoryEntryRef.current = false;
      setSelectedFieldId(null);
      setHasSelectionInCurrentField(false);
      onClose();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300"
        onClick={closeModal}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-0 z-[100] flex flex-col bg-white ${isRtl ? 'right-0' : 'left-0'}`}
        role="dialog"
        aria-label="Filters"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-gray-50">
          {selectedFieldId ? (
            <button
              onClick={handleBack}
              className="rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-colors"
              aria-label="Back"
            >
              {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          ) : (
            <button
              onClick={closeModal}
              className="rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <h2 className="text-lg font-semibold text-gray-900">
            {selectedField ? selectedField.label : 'Filters'}
          </h2>

          <div className="relative">
            <button
              className="rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-colors"
              aria-label="Filters"
            >
              <Filter className="w-5 h-5" />
            </button>
            {activeFiltersCount > 0 && !selectedFieldId && (
              <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {selectedFieldId && selectedField ? (
            <FilterOptionsScreen
              field={selectedField}
              value={values[selectedField.id]}
              onChange={(value) => {
                onChange(selectedField.id, value);
                // Update selection state
                const hasValue = selectedField.multiselect
                  ? Array.isArray(value) && value.length > 0
                  : Boolean(value && value !== '');
                setHasSelectionInCurrentField(hasValue);
              }}
              onHasSelectionChange={setHasSelectionInCurrentField}
            />
          ) : (
            <div className="p-4">
              {fields.map((field) => {
                const value = values[field.id];
                const isDisabled = Boolean(field.disabled);
                const hasValue =
                  field.type === 'select' && field.multiselect
                    ? Array.isArray(value) && value.length > 0
                    : value && value !== '';

                return (
                  <button
                    key={field.id}
                    onClick={() => handleFieldClick(field.id)}
                    disabled={isDisabled}
                    className={`w-full flex items-center justify-between py-4 border-b border-gray-200 transition-colors ${
                      isDisabled ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className={`text-base ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
                      {field.label}
                    </span>
                    <div className="flex items-center gap-2">
                      {hasValue && (
                        <span className="text-sm text-primary-700 font-medium">
                          {field.type === 'select' && field.multiselect && Array.isArray(value)
                            ? `${value.length} ${t('selected')}`
                            : ''}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-5 h-5 text-gray-400 ${isRtl ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-auto mb-[calc(env(safe-area-inset-bottom,0px)+72px)] border-t border-gray-200 p-4 bg-white shrink-0">
          <button
            onClick={handleShowResults}
            className="w-full py-3 rounded-lg font-medium transition-colors bg-primary-700 text-white hover:bg-primary-800"
          >
            {showResultsLabel}
          </button>
        </div>
      </div>
    </>
  );
};
