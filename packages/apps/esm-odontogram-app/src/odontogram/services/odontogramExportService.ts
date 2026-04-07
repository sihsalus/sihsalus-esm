/**
 * Servicio para exportar y formatear datos del odontograma.
 *
 * Usa SOLO los tipos públicos — sin dependencias de stores Zustand.
 * Todas las funciones son puras: reciben OdontogramData y devuelven resultado.
 */

import type {
  OdontogramData,
  OdontogramConfig,
} from "../types/odontogram";

// ---------------------------------------------------------------------------
// Export types
// ---------------------------------------------------------------------------

export interface OdontogramExportMetadata {
  uuid: string;
  type: string;
  description: string;
  lastModified: string;
  sessionId: string;
}

export interface OdontogramExportPayload {
  metadata: OdontogramExportMetadata;
  data: OdontogramData;
}

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

/** Build a JSON-serialisable payload from the current data + config. */
export function buildExportPayload(
  data: OdontogramData,
  config: OdontogramConfig,
): OdontogramExportPayload {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

  return {
    metadata: {
      uuid: `uuid_${Math.random().toString(36).substring(2, 11)}`,
      type: config.type,
      description: `${config.name} — exported data`,
      lastModified: new Date().toISOString(),
      sessionId,
    },
    data,
  };
}

/** Count basic statistics from the odontogram data. */
export function getOdontogramStats(data: OdontogramData) {
  const totalToothFindings = data.teeth.reduce(
    (sum, t) => sum + t.findings.length,
    0,
  );

  const totalSpacingFindings = Object.values(data.spacingFindings).reduce(
    (sum, spaces) =>
      sum + spaces.reduce((s2, space) => s2 + space.findings.length, 0),
    0,
  );

  const totalLegendFindings = data.legendSpaces.reduce(
    (sum, ls) => sum + ls.findings.length,
    0,
  );

  return {
    totalTeeth: data.teeth.length,
    teethWithFindings: data.teeth.filter((t) => t.findings.length > 0).length,
    totalToothFindings,
    totalSpacingFindings,
    totalLegendFindings,
    totalFindings:
      totalToothFindings + totalSpacingFindings + totalLegendFindings,
  };
}

/** Download data as a JSON file in the browser. */
export function downloadAsJson(payload: OdontogramExportPayload): void {
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `odontogram-${payload.metadata.type}-${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Copy data JSON to clipboard. Returns a promise. */
export async function copyToClipboard(
  payload: OdontogramExportPayload,
): Promise<void> {
  const json = JSON.stringify(payload, null, 2);
  await navigator.clipboard.writeText(json);
}
