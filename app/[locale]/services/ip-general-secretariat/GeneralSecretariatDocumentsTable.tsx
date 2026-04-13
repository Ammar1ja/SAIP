'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { DocumentData } from '@/lib/drupal/services/ip-general-secretariat.service';
import { Table, TableColumn } from '@/components/organisms/Table';
import Pagination from '@/components/atoms/Pagination';
import { Filters } from '@/components/molecules/Filters';
import { MobileFilters } from '@/components/molecules/MobileFilters';
import { useIsMobile } from '@/hooks/useIsMobile';
import { FilterField } from '@/components/molecules/Filters/Filters.types';
import Section from '@/components/atoms/Section';
import Button from '@/components/atoms/Button';
import ViewFigmaIcon from '@/components/icons/actions/ViewFigmaIcon';
import { getUniqueOptions } from '@/lib/utils/getUniqueOptions';
import { normalizeServiceTypeKey } from '@/lib/drupal/utils';

interface GeneralSecretariatDocumentsTableProps {
  documents: DocumentData[];
  title: string;
  noDocumentsText: string;
  viewDocumentText: string;
}

export function GeneralSecretariatDocumentsTable({
  documents,
  title,
  noDocumentsText,
  viewDocumentText,
}: GeneralSecretariatDocumentsTableProps) {
  const t = useTranslations('common.filters');
  const tServiceTypeOptions = useTranslations('common.filters.serviceTypeOptions');
  const tTargetGroups = useTranslations('common.filters.targetGroupOptions');
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValues, setFilterValues] = useState<Record<string, string | string[]>>({
    search: '',
    serviceType: '',
    targetGroup: '',
  });

  const itemsPerPage = 10;

  // Get unique options for filters with translations
  const isKnownServiceTypeKey = (value: string) =>
    ['protection', 'management', 'guidance', 'enforcement'].includes(value);

  const isKnownTargetGroupKey = (value: string) => ['individuals', 'enterprises'].includes(value);

  const addAllOption = (options: Array<{ value: string; label: string }>) => [
    { value: '', label: t('all') },
    ...options,
  ];

  const serviceTypeOptions = useMemo(() => {
    const uniqueValues = getUniqueOptions(documents, 'serviceType');
    const mapped = uniqueValues
      .map((opt) => {
        const normalizedKey = normalizeServiceTypeKey(opt.value) || opt.value;
        return {
          value: normalizedKey,
          label: isKnownServiceTypeKey(normalizedKey)
            ? tServiceTypeOptions(normalizedKey as any)
            : opt.label,
        };
      })
      .filter((opt) => Boolean(opt.value));
    const seen = new Set<string>();
    const deduped = mapped.filter((opt) => {
      const key = opt.value.trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return addAllOption(deduped);
  }, [documents, tServiceTypeOptions, t]);

  const extractTargetGroupKeys = (value: string): string[] => {
    const normalized = value.toLowerCase().trim();
    const hasIndividuals =
      normalized.includes('individual') ||
      normalized.includes('أفراد') ||
      normalized.includes('فرد');
    const hasEnterprises =
      normalized.includes('enterprise') ||
      normalized.includes('منش') ||
      normalized.includes('منشآت');

    if (hasIndividuals && hasEnterprises) {
      return ['individuals', 'enterprises'];
    }
    if (hasIndividuals) return ['individuals'];
    if (hasEnterprises) return ['enterprises'];
    return [value];
  };

  const targetGroupOptions = useMemo(() => {
    const uniqueNormalized = new Map<string, string>();
    documents.forEach((doc) => {
      doc.targetGroups?.forEach((group) => {
        if (!group) return;
        const keys = extractTargetGroupKeys(group);
        keys.forEach((key) => {
          if (!uniqueNormalized.has(key)) {
            uniqueNormalized.set(key, group);
          }
        });
      });
    });

    const options = Array.from(uniqueNormalized.entries())
      .map(([value, originalLabel]) => ({
        value,
        label: isKnownTargetGroupKey(value) ? tTargetGroups(value as any) : originalLabel,
      }))
      .filter((opt) => Boolean(opt.value));

    if (options.length === 0) {
      return addAllOption([
        { value: 'individuals', label: tTargetGroups('individuals') },
        { value: 'enterprises', label: tTargetGroups('enterprises') },
      ]);
    }

    return addAllOption(options);
  }, [documents, tTargetGroups, t]);

  // Filter data
  const filteredData = useMemo(() => {
    return documents.filter((row) => {
      const searchValue = filterValues.search;
      if (typeof searchValue === 'string' && searchValue.trim() !== '') {
        const search = searchValue.toLowerCase();
        if (
          !row.name.toLowerCase().includes(search) &&
          !row.committeeType.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      if (filterValues.serviceType) {
        const rowServiceType = normalizeServiceTypeKey(row.serviceType) || row.serviceType;
        const serviceTypeValue = Array.isArray(filterValues.serviceType)
          ? filterValues.serviceType[0] || ''
          : filterValues.serviceType;
        if (rowServiceType !== serviceTypeValue) return false;
      }
      if (filterValues.targetGroup) {
        const normalizedRowGroups =
          row.targetGroups
            ?.flatMap((group) => extractTargetGroupKeys(group))
            .map((group) => group.toLowerCase()) || [];
        const targetGroupValue = Array.isArray(filterValues.targetGroup)
          ? filterValues.targetGroup[0] || ''
          : filterValues.targetGroup;
        const normalizedFilter = extractTargetGroupKeys(targetGroupValue)[0].toLowerCase();
        if (!normalizedRowGroups.includes(normalizedFilter)) return false;
      }

      return true;
    });
  }, [documents, filterValues]);

  const handleFilterChange = (fieldId: string, value: string | string[]) => {
    setFilterValues((prev) => ({ ...prev, [fieldId]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleClearFilters = () => {
    setFilterValues({
      search: '',
      serviceType: '',
      targetGroup: '',
    });
    setCurrentPage(1);
  };

  // Define filter fields
  const filterFields: FilterField[] = [
    {
      id: 'search',
      label: t('search'),
      type: 'search',
      placeholder: t('search'),
    },
    {
      id: 'serviceType',
      label: t('serviceType', { defaultValue: 'Service type' }),
      type: 'select',
      placeholder: t('select'),
      options: serviceTypeOptions,
    },
    {
      id: 'targetGroup',
      label: t('targetGroup', { defaultValue: 'Target group' }),
      type: 'select',
      placeholder: t('select'),
      options: targetGroupOptions,
    },
  ];

  // Define table columns
  const columns: TableColumn<DocumentData>[] = [
    {
      key: 'name',
      header: t('documentName', { defaultValue: 'Document name' }),
      align: 'left',
      width: 'w-[32%]',
    },
    {
      key: 'committeeType',
      header: t('committeeType', { defaultValue: 'Committee type' }),
      align: 'left',
      width: 'w-[28%]',
    },
    {
      key: 'date',
      header: t('date', { defaultValue: 'Date' }),
      align: 'left',
      width: 'w-[20%]',
      renderCell: (value, row) => (
        <div>
          <div className="text-sm">{row.date}</div>
          <div className="text-xs text-gray-500">{row.hijriDate}</div>
        </div>
      ),
    },
    {
      key: 'fileUrl',
      header: t('preview', { defaultValue: 'Preview' }),
      align: 'center',
      width: 'w-[20%]',
      renderCell: (value, row) => (
        <Button
          href={row.fileUrl}
          intent="secondary"
          size="sm"
          className="inline-flex items-center gap-2 px-4 py-2"
          target="_blank"
          rel="noopener noreferrer"
          ariaLabel={viewDocumentText}
        >
          <ViewFigmaIcon className="w-4 h-4 text-current" />
          {viewDocumentText}
        </Button>
      ),
    },
  ];

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  return (
    <>
      <Section background="primary-25" padding="medium" constrain={false}>
        <div className="w-full max-w-7xl mx-auto px-4 md:px-0 relative z-10 pt-12 md:pt-20 pb-16 -mb-24">
          <h1 className="text-[36px] md:text-[72px] leading-[44px] md:leading-[90px] tracking-[-0.72px] md:tracking-[-1.44px] font-medium text-left rtl:text-right">
            {title}
          </h1>

          <div className="mt-6">
            {isMobile ? (
              <MobileFilters
                fields={filterFields}
                values={filterValues}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
                searchFieldId="search"
              />
            ) : (
              <Filters
                fields={filterFields}
                values={filterValues}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
                columns={3}
                className="p-10 mt-6 rounded-3xl border border-[#d2d6db] shadow-none max-w-[1062px] mx-auto"
              />
            )}
          </div>
        </div>
      </Section>

      <Section background="white" padding="medium" constrain={false}>
        <div className="max-w-7xl mx-auto px-4 md:px-0 pt-24">
          {filteredData.length === 0 ? (
            <p className="text-gray-600 text-center py-8">{noDocumentsText}</p>
          ) : isMobile ? (
            <div className="space-y-4">
              {paginatedData.map((row) => (
                <article
                  key={row.id}
                  className="rounded-2xl border border-[#D2D6DB] bg-white p-4 space-y-4"
                >
                  <div className="min-h-[118px] rounded-md bg-primary-50 p-4 flex items-end">
                    <h3 className="text-[18px] leading-[28px] font-medium text-[#161616] line-clamp-3">
                      {row.name}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[16px] leading-[24px] text-[#384250] line-clamp-3">
                      {row.committeeType}
                    </p>
                    <p className="text-[14px] leading-[20px] text-[#6C737F]">
                      {t('date', { defaultValue: 'Date' })}: {row.date}
                      {row.hijriDate ? ` / ${row.hijriDate}` : ''}
                    </p>
                  </div>

                  <Button
                    href={row.fileUrl}
                    size="md"
                    className="w-full justify-center h-11"
                    target="_blank"
                    rel="noopener noreferrer"
                    ariaLabel={viewDocumentText}
                  >
                    <ViewFigmaIcon className="w-5 h-5 text-current" />
                    {viewDocumentText}
                  </Button>
                </article>
              ))}

              {totalPages > 1 && (
                <div className="pt-2">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          ) : (
            <Table
              columns={columns}
              data={filteredData}
              pageSize={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              className="documents-table"
            />
          )}
        </div>
      </Section>
    </>
  );
}
