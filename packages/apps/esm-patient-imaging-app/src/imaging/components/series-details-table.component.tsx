import React, { useState, useRef } from 'react';
import {
  DataTable,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';

import { compare, PatientChartPagination, EmptyState } from '@openmrs/esm-patient-common-lib';

import { useTranslation } from 'react-i18next';
import { getBrowserUrl, type OrthancConfiguration, type Series } from '../../types';
import stoneview from '../../assets/stoneViewer.png';
import orthancExplorer from '../../assets/orthanc.png';
import { useLayoutType, usePagination, TrashCanIcon, showModal } from '@openmrs/esm-framework';
import { useStudySeries } from '../../api';
import InstancesDetailsTable from './instances-details-table.component';
import { seriesCount, seriesDeleteConfirmationDialog } from '../constants';
import styles from './details-table.scss';
import { buildURL } from '../utils/help';

export interface SeriesDetailsTableProps {
  studyId: number;
  studyInstanceUID: string;
  patientUuid: string;
  orthancConfig: OrthancConfiguration;
}

const SeriesDetailsTable: React.FC<SeriesDetailsTableProps> = ({
  studyId,
  studyInstanceUID,
  patientUuid,
  orthancConfig,
}) => {
  const {
    data: seriesList,
    error: seriesError,
    isLoading: isLoadingSeries,
    isValidating: isValidatingSeries,
  } = useStudySeries(studyId);

  const { t } = useTranslation();
  const displayText = t('NoSeriesAvailable', 'No series available');
  const headerTitle = t('series', 'Series');
  const { results, goTo, currentPage } = usePagination(seriesList, seriesCount);
  const [expandedRows, setExpandedRows] = useState({});
  const layout = useLayoutType();
  const isTablet = layout === 'tablet';
  const shouldOnClickBeCalled = useRef(true);
  const seriesMap = useRef<Map<string, Series>>(new Map());

  results?.forEach((series) => {
    seriesMap.current.set(String(series.seriesInstanceUID), series);
  });

  const launchDeleteSeriesDialog = (orthancSeriesUID: string, studyId: number) => {
    const dispose = showModal(seriesDeleteConfirmationDialog, {
      closeDeleteModal: () => dispose(),
      orthancSeriesUID,
      studyId,
      patientUuid,
    });
  };

  const tableHeaders = [
    { key: 'seriesInstanceUID', header: t('seriesUID', 'Series UID'), isSortable: true },
    { key: 'modality', header: t('modality', 'Modality'), isSortable: true },
    { key: 'seriesDate', header: t('seriesDate', 'Series date'), isSortable: true, isVisible: true },
    { key: 'seriesDescription', header: t('description', 'description'), isSortable: true },
    { key: 'action', header: t('action', 'Action'), isSortable: false },
  ];

  const tableRows = results?.map((series) => ({
    id: series.seriesInstanceUID,
    seriesInstanceUID: <div className={styles.subTableWrapText}>{series.seriesInstanceUID}</div>,
    modality: series.modality,
    seriesDate: (
      <div className={'seriesDateColumn'}>
        <span>{series.seriesDate}</span>
      </div>
    ),
    seriesDescription: series.seriesDescription,
    action: {
      content: (
        <div className="seriesActionDiv" style={{ display: 'flex' }}>
          <IconButton
            kind="ghost"
            align="left"
            size={isTablet ? 'lg' : 'sm'}
            label={t('removeSeries', 'Remove series')}
            onClick={() => {
              shouldOnClickBeCalled.current = false;
              launchDeleteSeriesDialog(series.orthancSeriesUID, studyId);
            }}
          >
            <TrashCanIcon className={styles.removeButton} />
          </IconButton>
          <IconButton
            kind="ghost"
            align="left"
            size={isTablet ? 'lg' : 'sm'}
            label={t('stoneviewer', 'Stone viewer of Orthanc')}
            onClick={() =>
              (window.location.href = buildURL(getBrowserUrl(orthancConfig), 'stone-webviewer/index.html', [
                { code: 'study', value: studyInstanceUID },
                { code: 'series', value: series.seriesInstanceUID },
              ]))
            }
          >
            <img className="stone-img" src={stoneview} style={{ width: 23, height: 14, marginTop: 4 }}></img>
          </IconButton>
          <IconButton
            kind="ghost"
            align="left"
            size={isTablet ? 'lg' : 'sm'}
            label={t('orthancExplorer2', 'Show data in orthanc explorere')}
            onClick={() =>
              (window.location.href = `${getBrowserUrl(orthancConfig)}/ui/app/#/filtered-studies?StudyInstanceUID=${studyInstanceUID}&expand=series`)
            }
          >
            <img className="orthanc-img" src={orthancExplorer} style={{ width: 26, height: 26, marginTop: 0 }}></img>
          </IconButton>
        </div>
      ),
    },
  }));

  const sortRow = (cellA, cellB, { sortDirection, sortStates }) => {
    return sortDirection === sortStates.DESC
      ? compare(cellB.sortKey, cellA.sortKey)
      : compare(cellA.sortKey, cellB.sortKey);
  };

  if (seriesList?.length) {
    return (
      <div className={'dataTableDiv'}>
        <DataTable
          rows={tableRows}
          headers={tableHeaders}
          sortRow={sortRow}
          isSortable
          useZebraStyles
          data-floating-menu-container
          size={isTablet ? 'lg' : 'sm'}
        >
          {({ rows, headers, getHeaderProps, getTableProps, getRowProps }) => (
            <TableContainer>
              <Table aria-label="Series summary" className={styles.table} {...getTableProps()} />
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader key={header.key} {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                  <TableHeader />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  const seriesData = seriesMap.current.get(row.id);
                  const isExpanded = expandedRows[row.id];
                  return (
                    <React.Fragment key={row.id}>
                      <TableRow
                        className={styles.row}
                        {...getRowProps({ row })}
                        onDoubleClick={() =>
                          setExpandedRows((prev) => ({
                            ...prev,
                            [row.id]: !prev[row.id],
                          }))
                        }
                      >
                        {row.cells.map((cell) => (
                          <TableCell
                            className={styles.tableCell}
                            key={cell.id}
                            style={cell.id === 'action' ? { width: '15%' } : { width: '22%' }}
                          >
                            {cell.value?.content ?? cell.value}
                          </TableCell>
                        ))}
                      </TableRow>
                      {isExpanded && seriesData && (
                        <TableRow className={styles.expandedRow}>
                          <TableCell colSpan={headers.length}>
                            <div className={styles.instanceTableDiv}>
                              <InstancesDetailsTable
                                studyId={studyId}
                                studyInstanceUID={studyInstanceUID}
                                seriesInstanceUID={seriesData.seriesInstanceUID}
                                orthancConfig={orthancConfig}
                                seriesModality={seriesData.modality}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </TableContainer>
          )}
        </DataTable>
        <PatientChartPagination
          pageNumber={currentPage}
          totalItems={seriesList.length}
          currentItems={results.length}
          pageSize={seriesCount}
          onPageNumberChange={({ page }) => goTo(page)}
        />
      </div>
    );
  }
  return <EmptyState displayText={displayText} headerTitle={headerTitle} />;
};

export default SeriesDetailsTable;
