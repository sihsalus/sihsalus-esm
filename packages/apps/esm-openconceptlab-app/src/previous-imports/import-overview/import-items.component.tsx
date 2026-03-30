import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DataTableSkeleton,
  Link,
  Pagination,
  PaginationSkeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';
import { showNotification, usePagination } from '@openmrs/esm-framework';
import { type ImportItem } from '../../types';
import { getImportDetails } from './import-items.resource';
import styles from './import-items.scss';

interface ImportItemsProps {
  importUuid: string;
}

const ImportItems: React.FC<ImportItemsProps> = ({ importUuid }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<Boolean>();
  const [pageSize, setPageSize] = useState(5);
  const [selectedImportItems, setSelectedImportItems] = useState<ImportItem[]>([]);

  const { results, currentPage, goTo } = usePagination(selectedImportItems, pageSize);

  const handleImportDetails = useCallback(
    async (uuid: string) => {
      setIsLoading(true);
      const abortController = new AbortController();

      const response = await getImportDetails(uuid, abortController);

      if (response.ok) {
        setSelectedImportItems(response.data.results);
      } else {
        showNotification({
          title: t('importItemsFetchError', 'Error occured while fetching the import items'),
          kind: 'error',
          critical: true,
          description: JSON.stringify(response.data),
        });
      }
      setIsLoading(false);
      return () => abortController.abort();
    },
    [t],
  );

  useEffect(() => {
    handleImportDetails(importUuid);
  }, [handleImportDetails, importUuid]);

  if (isLoading) {
    return (
      <div>
        <DataTableSkeleton showHeader={false} showToolbar={false} columnCount={2} />
        <PaginationSkeleton />
      </div>
    );
  }

  const headerData = [
    {
      header: t('conceptOrMapping', 'Concept/Mapping'),
      key: 'uuid',
    },
    {
      header: t('message', 'Message'),
      key: 'errorMessage',
    },
  ];

  return (
    !isLoading && (
      <div>
        <Table size="sm" className={styles.tableBordered}>
          <TableHead>
            <TableRow className={styles.tableHeaderRow}>
              {headerData.map((header, i) => (
                <TableHeader key={i} isSortable={true}>
                  {header.header}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {results?.map((row) => (
              <Fragment key={row.uuid}>
                <TableRow className={styles.tableDataRow}>
                  <TableCell>
                    <Link href={row.versionUrl}>
                      {row.type} {row.uuid}
                    </Link>
                  </TableCell>
                  <TableCell>{row.errorMessage}</TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
        <Pagination
          className={styles.pagination}
          size="sm"
          page={currentPage}
          pageSize={pageSize}
          pageSizes={[5, 10, 20, 50, 100]}
          totalItems={selectedImportItems?.length}
          onChange={({ page, pageSize }) => {
            goTo(page);
            setPageSize(pageSize);
          }}
        />
      </div>
    )
  );
};

export default ImportItems;
