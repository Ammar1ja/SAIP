'use client';

import { useTranslations } from 'next-intl';
import { MovablesPlatformTable } from '@/lib/drupal/services/movables-platform.service';
import { Table, TableColumn } from '@/components/organisms/Table';
import Label from '@/components/atoms/Label/Label';
import { Link } from '@/i18n/navigation';
import Tooltip from '@/components/atoms/Tooltip';
import React, { useEffect, useState, useMemo } from 'react';
import { getUniqueOptions } from '@/lib/utils/getUniqueOptions';
import { Filters } from '@/components/molecules/Filters';
import { MobileFilters } from '@/components/molecules/MobileFilters';
import { useIsMobile } from '@/hooks/useIsMobile';
import { FilterField } from '@/components/molecules/Filters/Filters.types';
import Pagination from '@/components/atoms/Pagination';
import ServiceCard from '@/components/molecules/ServiceCard';
import { getProxyUrl } from '@/lib/drupal/utils';

interface MovablesPlatformContentProps {
  data: MovablesPlatformTable[];
}

export default function MovablesPlatformContent({ data }: MovablesPlatformContentProps) {
  const t = useTranslations('movablesPlatform');

  const initialValues = {
    search: '',
    postingDate: '',
    status: '',
  };

  const statusToVariant = (stage?: string) => {
    switch ((stage || '').toLowerCase()) {
      case 'open':
        return 'success';
      case 'closed':
        return 'default';
      case 'awarded':
        return 'warning';
      default:
        return 'default';
    }
  };

  const translateStatus = (status: string) => {
    const knownKeys = ['open', 'closed', 'awarded'];
    const key = status.toLowerCase();
    if (knownKeys.includes(key)) {
      return t(`status.${key}`);
    }
    return status;
  };

  const handleFilterChange = (fieldId: string, value: string | string[]) => {
    setFilterValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleClearFilters = () => {
    setFilterValues({});
  };

  const [currentPage, setCurrentPage] = React.useState(1);
  const [filterValues, setFilterValues] =
    useState<Record<string, string | string[]>>(initialValues);
  const itemsPerPage = 10;

  const statusOptions = useMemo(() => {
    const uniqueStatuses = getUniqueOptions(data, 'status');
    return [
      { label: t('filters.all'), value: '' },
      ...uniqueStatuses.map((opt) => ({
        ...opt,
        label: translateStatus(opt.label),
      })),
    ];
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const searchValue = filterValues.search;
      if (typeof searchValue === 'string' && searchValue.trim() !== '') {
        const search = searchValue.toLowerCase();
        if (
          !row.movable_name.toLowerCase().includes(search) &&
          !row.posting_duration.toLowerCase().includes(search) &&
          !row.comm_officer.toLowerCase().includes(search)
        )
          return false;
      }

      if (filterValues.status && row.status !== filterValues.status) return false;

      const dateValue = filterValues.postingDate;
      let start: Date | undefined;
      let end: Date | undefined;

      if (dateValue) {
        if (Array.isArray(dateValue)) {
          [start, end] = dateValue.map((v) => new Date(v)) as [Date, Date];
        } else {
          if (dateValue.includes('|')) {
            const [s, e] = dateValue.split('|');
            start = new Date(s);
            end = new Date(e);
          } else {
            start = end = new Date(dateValue);
          }
        }
      }

      if (start && end) {
        const normalizeDate = (date: Date) => {
          const normalized = new Date(date);
          normalized.setHours(0, 0, 0, 0);
          return normalized;
        };

        const normalizedStart = normalizeDate(start);
        const normalizedEnd = normalizeDate(end);

        const [day, month, year] = row.posting_date.split('.');
        const rowDate = normalizeDate(new Date(Number(year), Number(month) - 1, Number(day)));

        if (rowDate < normalizedStart || rowDate > normalizedEnd) return false;
      }

      return true;
    });
  }, [data, filterValues]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const filterFields: FilterField[] = [
    {
      id: 'search',
      label: t('filters.search'),
      type: 'search' as const,
      placeholder: t('filters.searchPlaceholder'),
    },
    {
      id: 'postingDate',
      label: t('filters.postingDate'),
      type: 'date' as const,
      variant: 'range',
    },
    {
      id: 'status',
      label: t('filters.status'),
      type: 'select' as const,
      options: statusOptions,
      multiselect: false,
    },
  ];

  const columns: TableColumn<MovablesPlatformTable>[] = [
    {
      key: 'number',
      header: t('table.number'),
      align: 'left',
    },
    {
      key: 'movable_name',
      header: t('table.movableName'),
      align: 'left',
      renderCell: (value) => (
        <span className="block max-w-[200px] truncate" title={value.toString()}>
          {value}
        </span>
      ),
    },
    {
      key: 'posting_duration',
      header: t('table.postingDuration'),
      align: 'left',
    },
    {
      key: 'posting_date',
      header: t('table.postingDate'),
      align: 'left',
    },
    {
      key: 'status',
      header: t('table.status'),
      align: 'left',
      renderCell: (value) => {
        return (
          <Label variant={statusToVariant(value.toString())}>
            {translateStatus(value.toString())}
          </Label>
        );
      },
    },
    {
      key: 'comm_officer',
      header: t('table.commOfficer'),
      align: 'left',
      renderCell: (value) => (
        <span className="block max-w-[150px] truncate" title={value.toString()}>
          {value}
        </span>
      ),
    },
    {
      key: 'phone_number',
      header: t('table.phoneNumber'),
      align: 'left',
    },
    {
      key: 'email',
      header: t('table.email'),
      align: 'left',
      renderCell: (value) => (
        <span className="block max-w-[180px] truncate" title={value.toString()}>
          {value}
        </span>
      ),
    },
    {
      key: 'details',
      header: t('table.details'),
      align: 'left',
      renderCell: (value, row) => {
        const href = row.details ? getProxyUrl(row.details, 'view') : '';
        return (
          <div className={'flex flex-col items-center'}>
            <Tooltip text={t('viewDetails')} position="top">
              <Link href={href || '#'} target={href ? '_blank' : undefined}>
                <svg
                  width="18"
                  height="17"
                  viewBox="0 0 18 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label={t('viewDetails')}
                >
                  <path
                    d="M16.8263 5.20882L16.8254 5.20782L16.8193 5.20118C16.8135 5.19484 16.8042 5.18472 16.7915 5.17106C16.766 5.14374 16.7269 5.10231 16.6747 5.04879C16.5704 4.9417 16.4143 4.78647 16.2121 4.59913C15.807 4.22388 15.22 3.7229 14.4957 3.22258C13.0351 2.21372 11.0776 1.25 8.95834 1.25C6.83905 1.25 4.88153 2.21372 3.42099 3.22258C2.69668 3.7229 2.10971 4.22388 1.70461 4.59913C1.50237 4.78647 1.34629 4.9417 1.24196 5.04879C1.18981 5.10231 1.15066 5.14374 1.12519 5.17106C1.11245 5.18472 1.10315 5.19484 1.09736 5.20118L1.09132 5.20782L1.09062 5.20859C0.860309 5.46537 0.465101 5.48743 0.20808 5.25728C-0.0490721 5.02702 -0.0708715 4.63189 0.15939 4.37474C0.159326 4.37483 0.16005 4.37548 0.217381 4.42678C0.275498 4.47878 0.391781 4.58283 0.624369 4.7911L0.15939 4.37474L0.161078 4.37286L0.164138 4.36947L0.174342 4.35824C0.182951 4.34882 0.195156 4.33555 0.210873 4.31869C0.242302 4.28497 0.287797 4.23688 0.346658 4.17647C0.464339 4.05569 0.635701 3.8854 0.855149 3.68212C1.29343 3.27612 1.92685 2.73544 2.71057 2.19409C4.26611 1.11961 6.47526 0 8.95834 0C11.4414 0 13.6506 1.11961 15.2061 2.19409C15.9898 2.73544 16.6232 3.27612 17.0615 3.68212C17.281 3.8854 17.4523 4.05569 17.57 4.17647C17.6289 4.23688 17.6744 4.28497 17.7058 4.31869C17.7215 4.33555 17.7337 4.34882 17.7423 4.35824L17.7525 4.36947L17.7556 4.37286L17.7566 4.37399C17.7568 4.37416 17.7573 4.37474 17.2917 4.79167L17.7573 4.37474C17.9875 4.63189 17.9658 5.02702 17.7086 5.25728C17.4515 5.48747 17.0566 5.46576 16.8263 5.20882Z"
                    fill="#161616"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.95835 12.9167C7.23246 12.9167 5.83334 11.5176 5.83334 9.79167C5.83334 8.06578 7.23246 6.66667 8.95835 6.66667C10.6842 6.66667 12.0833 8.06578 12.0833 9.79167C12.0833 11.5176 10.6842 12.9167 8.95835 12.9167ZM7.08334 9.79167C7.08334 10.8272 7.92281 11.6667 8.95835 11.6667C9.99388 11.6667 10.8333 10.8272 10.8333 9.79167C10.8333 8.75613 9.99388 7.91667 8.95835 7.91667C7.92281 7.91667 7.08334 8.75613 7.08334 9.79167Z"
                    fill="#161616"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.5586 5.38582C4.97997 4.27617 6.81621 3.33333 8.95835 3.33333C11.1005 3.33333 12.9367 4.27617 14.3581 5.38582C15.7807 6.49646 16.8323 7.80812 17.4205 8.63293L17.4649 8.69478C17.6758 8.98818 17.9167 9.32316 17.9167 9.79167C17.9167 10.2602 17.6758 10.5952 17.4649 10.8886L17.4205 10.9504C16.8323 11.7752 15.7807 13.0869 14.3581 14.1975C12.9367 15.3072 11.1005 16.25 8.95835 16.25C6.81621 16.25 4.97997 15.3072 3.5586 14.1975C2.13595 13.0869 1.0844 11.7752 0.496188 10.9504L0.451839 10.8886C0.240875 10.5952 1.1962e-05 10.2602 1.1962e-05 9.79167C1.1962e-05 9.32316 0.240875 8.98818 0.451838 8.69478L0.496187 8.63293C1.0844 7.80812 2.13595 6.49646 3.5586 5.38582ZM4.32781 6.37112C3.03533 7.38015 2.06407 8.58724 1.5139 9.35871C1.3778 9.54956 1.31303 9.64275 1.27441 9.71694C1.24987 9.76409 1.24994 9.77702 1.25 9.78967L1.25001 9.79167L1.25 9.79366C1.24994 9.80632 1.24987 9.81924 1.27441 9.8664C1.31303 9.94058 1.3778 10.0338 1.5139 10.2246C2.06407 10.9961 3.03533 12.2032 4.32781 13.2122C5.62157 14.2222 7.1928 15 8.95835 15C10.7239 15 12.2951 14.2222 13.5889 13.2122C14.8814 12.2032 15.8526 10.9961 16.4028 10.2246C16.5389 10.0338 16.6037 9.94058 16.6423 9.8664C16.6668 9.81924 16.6668 9.80632 16.6667 9.79366L16.6667 9.79167L16.6667 9.78967C16.6668 9.77702 16.6668 9.76409 16.6423 9.71694C16.6037 9.64275 16.5389 9.54956 16.4028 9.35871C15.8526 8.58724 14.8814 7.38015 13.5889 6.37112C12.2951 5.36109 10.7239 4.58333 8.95835 4.58333C7.1928 4.58333 5.62157 5.36109 4.32781 6.37112Z"
                    fill="#161616"
                  />
                </svg>
              </Link>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  // Empty state
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <p className="text-lg text-gray-600">{t('noData')}</p>
      </div>
    );
  }

  const isMobile = useIsMobile();
  const [isUnder900, setIsUnder900] = useState(false);
  useEffect(() => {
    const checkViewport = () => setIsUnder900(window.innerWidth < 1050);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);
  const enableTabletHorizontalScroll = !isMobile && isUnder900;
  const tButtons = useTranslations('buttons');

  return (
    <div className="flex flex-col space-y-6 lg:space-y-10">
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
          showHideFilters={false}
        />
      )}
      <div className={enableTabletHorizontalScroll ? 'overflow-x-auto' : ''}>
        {isMobile ? (
          <>
            {paginatedData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-lg text-neutral-600">{t('noData')}</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4">
                  <h2 className="text-3xl sm:text-4xl font-medium py-2 leading-[60px] tracking-[-0.96px]">
                    {t('filters.totalNumber')}: {filteredData.length}
                  </h2>
                  {paginatedData.map((row, idx) => (
                    <ServiceCard
                      key={`${row.number}-${idx}`}
                      title={row.movable_name}
                      variant="movables"
                      postingDuration={row.posting_duration}
                      postingDate={row.posting_date}
                      labels={[translateStatus(row.status)]}
                      labelVariants={[
                        statusToVariant(row.status) as 'default' | 'success' | 'warning' | 'error',
                      ]}
                      primaryButtonLabel={tButtons('downloadFile')}
                      primaryButtonHref={
                        row.details ? getProxyUrl(row.details, 'download') : undefined
                      }
                      primaryButtonDownload={true}
                      className="max-w-none"
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      ariaLabel={t('paginationAriaLabel')}
                    />
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <Table
            columns={columns}
            data={filteredData}
            rules="horizontal"
            className={enableTabletHorizontalScroll ? 'table-auto min-w-[1280px]' : 'table-auto'}
            pageSize={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </div>
    </div>
  );
}
