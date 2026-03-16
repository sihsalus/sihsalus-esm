import React, { useMemo, useState } from 'react';
import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';
import { useLayoutType, usePagination } from '@openmrs/esm-framework';
import { PatientChartPagination } from '@openmrs/esm-patient-common-lib';
import styles from './paginated-clinical-data.scss';

interface PaginatedTableRow {
  id: string;
  [key: string]: string | number | React.ReactNode;
}

interface PaginatedTableHeader {
  key: string;
  header: string;
  isSortable?: boolean;
  sortFunc?: (a: PaginatedTableRow, b: PaginatedTableRow) => number;
}

interface PaginatedClinicalDataProps {
  isPrinting?: boolean;
  pageSize: number;
  tableHeaders: Array<PaginatedTableHeader>;
  tableRows: Array<PaginatedTableRow>;
}

const PaginatedClinicalData: React.FC<PaginatedClinicalDataProps> = ({
  isPrinting,
  pageSize,
  tableHeaders,
  tableRows,
}) => {
  const isTablet = useLayoutType() === 'tablet';

  const StyledTableCell = ({ interpretation, children }: { interpretation: string; children: React.ReactNode }) => {
    switch (interpretation) {
      case 'critically_high':
        return <TableCell className={styles.criticallyHigh}>{children}</TableCell>;
      case 'critically_low':
        return <TableCell className={styles.criticallyLow}>{children}</TableCell>;
      case 'high':
        return <TableCell className={styles.high}>{children}</TableCell>;
      case 'low':
        return <TableCell className={styles.low}>{children}</TableCell>;
      default:
        return <TableCell>{children}</TableCell>;
    }
  };

  const [sortParams, setSortParams] = useState<{ key: string; sortDirection: 'ASC' | 'DESC' | 'NONE' }>({
    key: '',
    sortDirection: 'NONE',
  });

  const handleSorting = (
    cellA,
    cellB,
    { key, sortDirection }: { key: string; sortDirection: 'ASC' | 'DESC' | 'NONE' },
  ) => {
    if (sortDirection === 'NONE') {
      setSortParams({ key: '', sortDirection });
    } else {
      setSortParams({ key, sortDirection });
    }
  };

  const sortedData = useMemo(() => {
    if (sortParams.sortDirection === 'NONE') {
      return tableRows;
    }

    const header = tableHeaders.find((header) => header.key === sortParams.key);

    if (!header || !header.sortFunc) {
      return tableRows;
    }

    const sortedRows = tableRows.slice().sort((rowA, rowB) => {
      const sortingNum = header.sortFunc(rowA, rowB);
      return sortParams.sortDirection === 'DESC' ? sortingNum : -sortingNum;
    });

    return sortedRows;
  }, [tableHeaders, tableRows, sortParams]);

  const { results: paginatedData, goTo, currentPage } = usePagination(sortedData, pageSize);

  const rows = isPrinting ? sortedData : paginatedData;

  return (
    <>
      <DataTable
        rows={rows}
        headers={tableHeaders}
        size={isTablet ? 'lg' : 'sm'}
        useZebraStyles
        sortRow={handleSorting}
        isSortable>
        {({ rows, headers, getTableProps, getHeaderProps }) => (
          <TableContainer className={styles.tableContainer}>
            <Table className={styles.table} aria-label="clinical-data" {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header, isSortable: header.isSortable })} key={header.key}>
                      {header.header?.content ?? header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.cells.map((cell) => {
                      const dataObj = paginatedData.find((obj) => obj.id === row.id);
                      const interpretationKey = `${cell.id.substring(2)}Interpretation`;
                      const vitalSignInterpretation = dataObj && dataObj[interpretationKey];

                      return (
                        <StyledTableCell key={`styled-cell-${cell.id}`} interpretation={vitalSignInterpretation}>
                          {cell.value?.content ?? cell.value}
                        </StyledTableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
      {!isPrinting ? (
        <PatientChartPagination
          pageNumber={currentPage}
          totalItems={tableRows.length}
          currentItems={paginatedData.length}
          pageSize={pageSize}
          onPageNumberChange={({ page }) => goTo(page)}
        />
      ) : null}
    </>
  );
};

export default PaginatedClinicalData;
