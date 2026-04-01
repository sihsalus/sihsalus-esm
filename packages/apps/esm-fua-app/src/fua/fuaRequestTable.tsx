import {
  DataTable,
  DataTableSkeleton,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Pagination,
  Layer,
  Tile,
  Button,
  OverflowMenu,
  OverflowMenuItem,
  Tag,
  Tooltip,
} from '@carbon/react';
import { View, Download, EventSchedule } from '@carbon/react/icons';
import { formatDate, launchWorkspace, showModal, showSnackbar, usePagination } from '@openmrs/esm-framework';
import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import useFuaRequests, { setFuaEstado, type FuaRequest } from '../hooks/useFuaRequests';
import { useVisit } from '../hooks/useVisit';
import { FUA_ESTADOS } from '../modals/change-fua-status.modal';
import { exportFuasToExcel } from '../utils/fua-export';

import { FuaDateRangePicker } from './fua-date-range-picker.component';
import styles from './fua-request-table.scss';

interface FuaRequestTableProps {
  statusFilter?: string;
}

type TagType =
  | 'blue'
  | 'cyan'
  | 'gray'
  | 'green'
  | 'magenta'
  | 'red'
  | 'teal'
  | 'warm-gray'
  | 'cool-gray'
  | 'high-contrast'
  | 'outline';

const estadoTagType: Record<string, TagType> = {
  Pendiente: 'gray',
  'En Proceso': 'blue',
  Completado: 'green',
  'Enviado a SETI-SIS': 'cyan',
  Rechazado: 'red',
  Cancelado: 'magenta',
};

/** Resolves visitUuid → patient name + DNI inline with SWR */
const PatientCell: React.FC<{ visitUuid: string }> = ({ visitUuid }) => {
  const { patient, dni, isLoading } = useVisit(visitUuid);
  if (isLoading) return <span>—</span>;
  if (!patient) return <span title={visitUuid}>—</span>;
  return (
    <div>
      <div>{patient.display}</div>
      {dni && <div style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>{dni}</div>}
    </div>
  );
};

const FuaRequestTable: React.FC<FuaRequestTableProps> = ({ statusFilter = 'all' }) => {
  const { t } = useTranslation();

  const { fuaOrders, isLoading, mutate } = useFuaRequests({
    status: statusFilter !== 'all' ? statusFilter : null,
    excludeCanceled: true,
  });

  const [searchString, setSearchString] = useState('');

  const filteredData = useMemo(() => {
    if (!fuaOrders) return [];
    if (!searchString) return fuaOrders;
    const search = searchString.toLowerCase();
    return fuaOrders.filter(
      (req) =>
        req.name?.toLowerCase().includes(search) ||
        req.uuid?.toLowerCase().includes(search) ||
        req.numeroFua?.toLowerCase().includes(search) ||
        req.fuaEstado?.nombre?.toLowerCase().includes(search),
    );
  }, [fuaOrders, searchString]);

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);
  const { results, goTo, currentPage } = usePagination(filteredData ?? [], currentPageSize);

  const handleViewFua = useCallback((fuaId: string) => {
    launchWorkspace('fua-viewer-workspace', { fuaId });
  }, []);

  const handleChangeStatus = useCallback(
    (fuaRequest: FuaRequest) => {
      const dispose = showModal('change-fua-status-modal', {
        fuaRequest,
        onStatusChanged: () => mutate(),
        closeModal: () => dispose(),
      });
    },
    [mutate],
  );

  const handleCancelFua = useCallback(
    (fuaRequest: FuaRequest) => {
      const dispose = showModal('cancel-fua-modal', {
        fuaRequest,
        onCancelled: () => mutate(),
        closeModal: () => dispose(),
      });
    },
    [mutate],
  );

  const handleViewHistorial = useCallback((fuaRequest: FuaRequest) => {
    const dispose = showModal('fua-historial-modal', {
      fuaRequest,
      closeModal: () => dispose(),
    });
  }, []);

  const handleReenviar = useCallback(
    async (fuaRequest: FuaRequest) => {
      const abortController = new AbortController();
      try {
        await setFuaEstado(fuaRequest.id, FUA_ESTADOS.PENDIENTE.id, abortController);
        mutate();
        showSnackbar({
          kind: 'success',
          title: t('success', 'Éxito'),
          subtitle: t('fuaReset', 'FUA devuelto a Pendiente para corrección'),
        });
      } catch {
        showSnackbar({
          kind: 'error',
          title: t('error', 'Error'),
          subtitle: t('errorChangingStatus', 'Ocurrió un error al cambiar el estado del FUA'),
        });
      }
    },
    [mutate, t],
  );

  const handleExport = useCallback(() => {
    exportFuasToExcel(filteredData);
  }, [filteredData]);

  const headers = [
    { key: 'patient', header: t('patient', 'Paciente') },
    { key: 'name', header: t('fuaName', 'Nombre del FUA') },
    { key: 'estado', header: t('status', 'Estado') },
    { key: 'fechaCreacion', header: t('creationDate', 'Fecha de Creación') },
    { key: 'actions', header: t('actions', 'Acciones') },
  ];

  const rows =
    results?.map((request: FuaRequest, index: number) => ({
      id: String(index),
      patient: request.visitUuid,
      name: request.numeroFua ? `${request.numeroFua} — ${request.name || ''}` : request.name || 'N/A',
      estado: request.fuaEstado?.nombre || t('noStatus', 'Sin estado'),
      fechaCreacion: formatDate(new Date(request.fechaCreacion), { mode: 'standard' }),
      actions: request,
    })) ?? [];

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" showHeader={false} showToolbar={false} />;
  }

  return (
    <div className={styles.tableContainer}>
      <DataTable rows={rows} headers={headers} isSortable useZebraStyles size="sm">
        {({ rows, headers, getHeaderProps, getTableProps, getRowProps }) => (
          <TableContainer className={styles.tableContainer}>
            <TableToolbar>
              <TableToolbarContent className={styles.toolbarContent}>
                <Layer className={styles.toolbarItem}>
                  <FuaDateRangePicker />
                </Layer>
                <Layer className={styles.toolbarItem}>
                  <TableToolbarSearch
                    expanded
                    onChange={(e) => {
                      setSearchString(typeof e === 'string' ? e : e.target.value);
                    }}
                    placeholder={t('searchThisList', 'Buscar en esta lista')}
                    size="sm"
                  />
                </Layer>
                <Button
                  kind="ghost"
                  size="sm"
                  renderIcon={Download}
                  onClick={handleExport}
                  disabled={filteredData.length === 0}
                >
                  {t('exportExcel', 'Exportar a Excel')}
                </Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()} className={styles.table} aria-label={t('fuaRequests', 'Solicitudes FUA')}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader key={header.key} {...getHeaderProps({ header })} className={styles.tableHeader}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, rowIndex) => {
                  const fuaRequest = results[rowIndex];
                  return (
                    <TableRow key={row.id} {...getRowProps({ row })}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id} className={styles.tableCell}>
                          {cell.info.header === 'patient' ? (
                            <PatientCell visitUuid={cell.value} />
                          ) : cell.info.header === 'estado' ? (
                            <div>
                              <Tag type={estadoTagType[cell.value] || 'gray'} size="sm">
                                {cell.value}
                              </Tag>
                              {fuaRequest?.observacionesSetiSis && (
                                <Tooltip align="bottom" label={fuaRequest.observacionesSetiSis}>
                                  <span
                                    aria-label={t('setiSisObservation', 'Observación SETI-SIS')}
                                    style={{
                                      marginLeft: '4px',
                                      fontSize: '0.75rem',
                                      color: 'var(--cds-text-error)',
                                      cursor: 'help',
                                    }}
                                  >
                                    ⚠ SETI-SIS
                                  </span>
                                </Tooltip>
                              )}
                            </div>
                          ) : cell.info.header === 'actions' ? (
                            <div className={styles.actionsCell}>
                              <Button
                                kind="ghost"
                                size="sm"
                                renderIcon={View}
                                iconDescription={t('viewFua', 'Ver FUA')}
                                hasIconOnly
                                onClick={() => handleViewFua(fuaRequest.uuid)}
                                tooltipPosition="left"
                              />
                              <Button
                                kind="ghost"
                                size="sm"
                                renderIcon={EventSchedule}
                                iconDescription={t('viewHistory', 'Ver historial')}
                                hasIconOnly
                                onClick={() => handleViewHistorial(fuaRequest)}
                                tooltipPosition="left"
                              />
                              <OverflowMenu size="sm" flipped ariaLabel={t('actions', 'Acciones')}>
                                <OverflowMenuItem
                                  itemText={t('changeStatus', 'Cambiar Estado')}
                                  onClick={() => handleChangeStatus(fuaRequest)}
                                />
                                {fuaRequest?.fuaEstado?.nombre === FUA_ESTADOS.RECHAZADO.nombre && (
                                  <OverflowMenuItem
                                    itemText={t('resend', 'Reenviar a SETI-SIS')}
                                    onClick={() => handleReenviar(fuaRequest)}
                                  />
                                )}
                                <OverflowMenuItem
                                  itemText={t('cancelFua', 'Cancelar FUA')}
                                  onClick={() => handleCancelFua(fuaRequest)}
                                  isDelete
                                  hasDivider
                                />
                              </OverflowMenu>
                            </div>
                          ) : (
                            cell.value
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {rows.length === 0 ? (
              <div className={styles.tileContainer}>
                <Tile className={styles.tile}>
                  <div className={styles.tileContent}>
                    <p className={styles.content}>{t('noFuaRequestsFound', 'No se encontraron solicitudes FUA')}</p>
                    <p className={styles.emptyStateHelperText}>
                      {t('checkFilters', 'Por favor revisa los filtros de arriba e intenta de nuevo')}
                    </p>
                  </div>
                </Tile>
              </div>
            ) : null}
          </TableContainer>
        )}
      </DataTable>
      {filteredData.length > 0 && (
        <Pagination
          page={currentPage}
          pageSize={currentPageSize}
          pageSizes={pageSizes}
          totalItems={filteredData.length}
          onChange={({ page, pageSize }) => {
            if (pageSize !== currentPageSize) setPageSize(pageSize);
            goTo(page);
          }}
          className={styles.pagination}
        />
      )}
    </div>
  );
};

export default FuaRequestTable;
