import type { OdontogramData, OdontogramConfig } from "../types/odontogram";
import { createEmptyOdontogramData } from "../types/odontogram";
import { computeToothAnnotations } from "./computeToothAnnotations";

/**
 * Hidrata un OdontogramData completo a partir de un JSON guardado en BBDD.
 *
 * El JSON de BBDD puede ser:
 *   - Vacío:  { teeth: [], spacingFindings: {}, legendSpaces: [] }
 *   - Parcial: solo contiene los dientes/espacios que tienen hallazgos
 *
 * El proceso:
 *   1. Genera el esqueleto completo con createEmptyOdontogramData(config)
 *      → todos los dientes, todos los slots de spacing, todos los legendSpaces vacíos
 *   2. Sobreescribe cada entrada del esqueleto con los datos guardados
 *      → los dientes sin datos en BBDD quedan vacíos (findings: [])
 *      → los espacios sin datos en BBDD quedan vacíos (findings: [])
 *
 * Así el componente siempre recibe la estructura completa que espera.
 */
export function mergeOdontogramData(
  config: OdontogramConfig,
  savedData: Partial<OdontogramData>
): OdontogramData {
  // Esqueleto completo vacío
  const skeleton = createEmptyOdontogramData(config);

  // ── teeth ────────────────────────────────────────────────────────────────
  const teeth = skeleton.teeth.map((skTooth) => {
    const saved = (savedData.teeth ?? []).find(
      (t) => t.toothId === skTooth.toothId
    );
    if (!saved) return skTooth;
    const findings = saved.findings ?? [];
    return {
      ...skTooth,
      findings,
      annotations: computeToothAnnotations(findings, config.findingOptions),
      notes: saved.notes ?? skTooth.notes,
    };
  });

  // ── spacingFindings ───────────────────────────────────────────────────────
  // El esqueleto ya tiene todos los findingIds y todos sus espacios vacíos.
  // Sobreescribimos solo los espacios que tengan data en BBDD.
  const spacingFindings = { ...skeleton.spacingFindings };

  for (const [key, savedSpaces] of Object.entries(savedData.spacingFindings ?? {})) {
    const findingId = Number(key);
    if (!spacingFindings[findingId]) continue; // findingId no reconocido → ignorar

    spacingFindings[findingId] = skeleton.spacingFindings[findingId].map(
      (skSpace) => {
        const saved = savedSpaces.find(
          (s) =>
            s.leftToothId === skSpace.leftToothId &&
            s.rightToothId === skSpace.rightToothId
        );
        if (!saved) return skSpace;
        return { ...skSpace, findings: saved.findings ?? [] };
      }
    );
  }

  // ── legendSpaces ──────────────────────────────────────────────────────────
  const legendSpaces = skeleton.legendSpaces.map((skLs) => {
    const saved = (savedData.legendSpaces ?? []).find(
      (ls) =>
        ls.leftToothId === skLs.leftToothId &&
        ls.rightToothId === skLs.rightToothId
    );
    if (!saved) return skLs;
    return { ...skLs, findings: saved.findings ?? [] };
  });

  return { teeth, spacingFindings, legendSpaces, especificaciones: savedData.especificaciones ?? "", observaciones: savedData.observaciones ?? "" };
}
