import type { OdontogramData } from "../types/odontogram";

/**
 * Serializa OdontogramData eliminando todos los registros vacíos.
 *
 * Reglas de poda:
 * - teeth: solo incluye dientes con al menos un hallazgo o notas
 * - spacingFindings: solo incluye entradas (findingId) con al menos un espacio
 *   activo, y dentro de cada entrada solo los espacios con findings
 * - legendSpaces: solo incluye espacios con al menos un finding
 *
 * El resultado es lo mínimo necesario para reconstruir el estado completo
 * cuando se cargue de vuelta con createEmptyOdontogramData + merge.
 */
export function serializeOdontogramData(data: OdontogramData): OdontogramData {
  // ── teeth ────────────────────────────────────────────────────────────────
  const teeth = data.teeth
    .filter((t) => t.findings.length > 0 || (t.notes && t.notes.trim() !== "") || (t.annotations && t.annotations.length > 0))
    .map((t) => ({
      toothId: t.toothId,
      findings: t.findings,
      ...(t.annotations && t.annotations.length > 0 ? { annotations: t.annotations } : {}),
      ...(t.notes && t.notes.trim() !== "" ? { notes: t.notes } : {}),
    }));

  // ── spacingFindings ───────────────────────────────────────────────────────
  const spacingFindings: Record<number, typeof data.spacingFindings[number]> = {};
  for (const [key, spaces] of Object.entries(data.spacingFindings)) {
    const activeSpaces = spaces.filter((s) => s.findings.length > 0);
    if (activeSpaces.length > 0) {
      spacingFindings[Number(key)] = activeSpaces;
    }
  }

  // ── legendSpaces ──────────────────────────────────────────────────────────
  const legendSpaces = data.legendSpaces.filter((ls) => ls.findings.length > 0);

  return {
    teeth,
    spacingFindings,
    legendSpaces,
    ...(data.especificaciones && data.especificaciones.trim() !== "" ? { especificaciones: data.especificaciones } : {}),
    ...(data.observaciones && data.observaciones.trim() !== "" ? { observaciones: data.observaciones } : {}),
  };
}

/**
 * Cuenta el total de hallazgos registrados en un odontograma.
 */
export function countFindings(data: OdontogramData): number {
  const toothFindings = data.teeth.reduce((acc, t) => acc + t.findings.length, 0);
  const spacingCount = Object.values(data.spacingFindings).reduce(
    (acc, spaces) =>
      acc + spaces.reduce((a, s) => a + s.findings.length, 0),
    0
  );
  const legendCount = data.legendSpaces.reduce(
    (acc, ls) => acc + ls.findings.length,
    0
  );
  return toothFindings + spacingCount + legendCount;
}

/**
 * Devuelve estadísticas resumidas del odontograma.
 */
export function getOdontogramStats(data: OdontogramData) {
  const teethWithFindings = data.teeth.filter((t) => t.findings.length > 0).length;
  const toothFindingsTotal = data.teeth.reduce((acc, t) => acc + t.findings.length, 0);
  const spacingFindingsTotal = Object.values(data.spacingFindings).reduce(
    (acc, spaces) => acc + spaces.reduce((a, s) => a + s.findings.length, 0),
    0
  );
  const legendFindingsTotal = data.legendSpaces.reduce(
    (acc, ls) => acc + ls.findings.length,
    0
  );
  const totalFindings = toothFindingsTotal + spacingFindingsTotal + legendFindingsTotal;
  return { teethWithFindings, toothFindingsTotal, spacingFindingsTotal, legendFindingsTotal, totalFindings };
}
