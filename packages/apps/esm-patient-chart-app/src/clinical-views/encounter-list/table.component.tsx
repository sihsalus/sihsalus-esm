import {
  DataTable,
  Table,
  TableCell,
  TableContainer,
  TableBody,
  TableHead,
  TableHeader,
  TableRow as CarbonTableRow,
} from '@carbon/react';
import React from 'react';

import type { ColumnValue, FormattedColumn, NamedColumn, FormColumn, TableRow as EncounterTableRow } from '../types';
import styles from './table.scss';

interface TableProps {
  tableHeaders: Array<Pick<FormattedColumn, 'header' | 'key'>>;
  tableRows: Array<EncounterTableRow & Record<string, ColumnValue>>;
}

const isNamedColumn = (value: ColumnValue): value is NamedColumn =>
  typeof value === 'object' &&
  value !== null &&
  !React.isValidElement(value) &&
  !Array.isArray(value) &&
  'name' in value;

const isFormColumn = (value: unknown): value is FormColumn =>
  typeof value === 'object' && value !== null && 'label' in value;

const getNamedDisplay = (value: unknown) => {
  if (typeof value === 'object' && value !== null) {
    const namedValue = value as { display?: string; name?: string | { display?: string; name?: string } };
    if (typeof namedValue.display === 'string') {
      return namedValue.display;
    }
    if (typeof namedValue.name === 'string') {
      return namedValue.name;
    }
    if (typeof namedValue.name === 'object' && namedValue.name !== null) {
      return namedValue.name.display ?? namedValue.name.name ?? '--';
    }
  }

  return '--';
};

const renderCellValue = (value: ColumnValue) => {
  if (value == null) {
    return null;
  }

  if (React.isValidElement(value) || typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'string') {
          return item;
        }

        return isFormColumn(item) ? item.label : getNamedDisplay(item);
      })
      .join(', ');
  }

  return isNamedColumn(value) ? getNamedDisplay(value) : null;
};

export const EncounterListDataTable: React.FC<TableProps> = ({ tableHeaders, tableRows }) => {
  return (
    <TableContainer>
      <DataTable rows={tableRows} headers={tableHeaders} isSortable={true} size="md">
        {({ rows, headers, getHeaderProps, getTableProps }) => (
          <Table {...getTableProps()}>
            <TableHead>
              <CarbonTableRow>
                {headers.map((header, index) => (
                  <TableHeader
                    key={index}
                    className={`${styles.productiveHeading01} ${styles.text02}`}
                    {...getHeaderProps({
                      header,
                      isSortable: header.isSortable,
                    })}
                  >
                    {typeof header.header === 'string' ? header.header : null}
                  </TableHeader>
                ))}
              </CarbonTableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <CarbonTableRow key={row.id}>
                  {row.cells.map((cell: { id: string; value: ColumnValue }) => (
                    <TableCell key={cell.id}>{renderCellValue(cell.value)}</TableCell>
                  ))}
                </CarbonTableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>
    </TableContainer>
  );
};
