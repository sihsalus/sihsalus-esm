import React, { Fragment, useState } from 'react';
import {
  Column,
  DataTable,
  DataTableSkeleton,
  Grid,
  Pagination,
  PaginationSkeleton,
  SkeletonText,
  Table,
  TableBody,
  TableCell,
  TableExpandedRow,
  TableExpandHeader,
  TableExpandRow,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { formatDatetime, showNotification, usePagination } from '@openmrs/esm-framework';
import { type Import } from '../types';
import { usePreviousImports } from './previous-imports.resource';
import ImportOverview from './import-overview/import-overview.component';
import styles from './previous-imports.scss';

const PreviousImports: React.FC = () => {
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(10);

  const { data: prevImports, isLoading, error } = usePreviousImports();
  const { results, currentPage, goTo } = usePagination(prevImports, pageSize);

  if (isLoading) {
    return (
      <Grid className={styles.grid}>
        <Column sm={4} md={8} lg={10}>
          <SkeletonText className={styles.productiveHeading03} />
          <DataTableSkeleton showHeader={false} showToolbar={false} rowCount={10} columnCount={3} />
          <PaginationSkeleton />
        </Column>
      </Grid>
    );
  }

  if (error) {
    showNotification({
      kind: 'error',
      description: t('previousImportsFetchError', 'Error occured while fetching the imports'),
    });
  }

  const headerData = [
    {
      header: t('dateAndTime', 'Date and Time'),
      key: 'localDateStarted',
    },
    {
      header: t('duration', 'Duration'),
      key: 'importTime',
    },
    {
      header: t('status', 'Status'),
      key: 'status',
    },
  ];

  const rowData = results?.map((prevImport) => {
    return {
      id: prevImport.uuid,
      localDateStarted: formatDatetime(new Date(prevImport.localDateStarted)),
      importTime: prevImport.importTime,
      status: prevImport.status,
    };
  });

  return (
    !isLoading &&
    !error && (
      <Grid className={styles.grid}>
        <Column sm={4} md={8} lg={10}>
          <h3 className={styles.productiveHeading03}>{t('previousImports', 'Previous Imports')}</h3>

          <DataTable rows={rowData} headers={headerData} size="sm">
            {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
              <Table {...getTableProps()} className={styles.tableBordered}>
                <TableHead>
                  <TableRow>
                    <TableExpandHeader />
                    {headers.map((header, i) => (
                      <TableHeader key={i} {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <Fragment key={row.id}>
                      <TableExpandRow {...getRowProps({ row })} className={styles.tableRow}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableExpandRow>
                      {row.isExpanded && (
                        <TableExpandedRow colSpan={headers.length + 1} className={styles.tableExpandedRow}>
                          <ImportOverview
                            selectedImportObject={prevImports.find((importItem: Import) => importItem.uuid === row.id)}
                          />
                        </TableExpandedRow>
                      )}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            )}
          </DataTable>
          <Pagination
            className={styles.pagination}
            size="sm"
            page={currentPage}
            pageSize={pageSize}
            pageSizes={[10, 20, 50, 100]}
            totalItems={prevImports.length}
            onChange={({ page, pageSize }) => {
              goTo(page);
              setPageSize(pageSize);
            }}
          />
        </Column>
      </Grid>
    )
  );
};

export default PreviousImports;
