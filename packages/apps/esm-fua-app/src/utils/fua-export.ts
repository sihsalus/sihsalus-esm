import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import type { FuaRequest } from '../hooks/useFuaRequests';

export interface FuaExportRow {
  'N° FUA': string;
  Nombre: string;
  Estado: string;
  'UUID Visita': string;
  'Obs. SETI-SIS': string;
  'Fecha Creación': string;
  'Fecha Actualización': string;
}

export function buildExportRows(fuaOrders: Array<FuaRequest>): Array<FuaExportRow> {
  return fuaOrders.map((req) => ({
    'N° FUA': req.numeroFua ?? req.uuid,
    Nombre: req.name ?? '',
    Estado: req.fuaEstado?.nombre ?? 'Sin estado',
    'UUID Visita': req.visitUuid ?? '',
    'Obs. SETI-SIS': req.observacionesSetiSis ?? '',
    'Fecha Creación': req.fechaCreacion ? dayjs(req.fechaCreacion).format('YYYY-MM-DD HH:mm') : '',
    'Fecha Actualización': req.fechaActualizacion ? dayjs(req.fechaActualizacion).format('YYYY-MM-DD HH:mm') : '',
  }));
}

export function exportFuasToExcel(fuaOrders: Array<FuaRequest>, filename?: string): void {
  const rows = buildExportRows(fuaOrders);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'FUAs');

  // Column widths
  worksheet['!cols'] = [
    { wch: 20 }, // N° FUA
    { wch: 40 }, // Nombre
    { wch: 20 }, // Estado
    { wch: 38 }, // UUID Visita
    { wch: 50 }, // Obs. SETI-SIS
    { wch: 18 }, // Fecha Creación
    { wch: 18 }, // Fecha Actualización
  ];

  const exportFilename = filename ?? `FUAs_${dayjs().format('YYYYMMDD_HHmm')}.xlsx`;
  XLSX.writeFile(workbook, exportFilename);
}
