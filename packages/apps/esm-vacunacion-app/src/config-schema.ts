import { Type } from '@openmrs/esm-framework';

/**
 * Esquema Nacional de Vacunación — NTS N.° 196-MINSA/DGIESP-2022
 * (RM 884-2022, modificada por RM 218-2024, RM 474-2025, RM 709-2025)
 *
 * Sequence convention: doses [1…9], boosters [11…19].
 * CIEL concept UUIDs follow the pattern {CIEL_ID}AAAAAAAAAAAAAAA…
 * Adjust UUIDs to match the concepts loaded on your OpenMRS server.
 *
 * Cambios clave:
 * - RM 218-2024: IPV reemplaza a APO (esquema 100% IPV inyectable);
 *                VPH dosis única para niños y niñas 9-13 años.
 * - RM 474-2025: PCV13 → PCV20; VPH tetravalente → nonavalente.
 * - RM 709-2025: Hexavalente celular (futuro reemplazo de Penta + IPV).
 */
export const configSchema = {
  immunizationConceptSet: {
    _type: Type.String,
    _default: 'CIEL:984',
    _description: 'A UUID or concept mapping which will have all the possible vaccines as set-members.',
  },
  sequenceDefinitions: {
    _type: Type.Array,
    _elements: {
      _type: Type.Object,
      vaccineConceptUuid: {
        _type: Type.UUID,
        _description: 'The UUID of the individual vaccine concept',
      },
      sequences: {
        _type: Type.Array,
        _elements: {
          _type: Type.Object,
          sequenceLabel: {
            _type: Type.String,
            _description: 'Name of the dose/booster/schedule.. This will be used as a translation key as well.',
          },
          sequenceNumber: {
            _type: Type.Number,
            _description:
              'The dose number in the vaccines. Convention for doses is [1...9] and for boosters is [11...19]',
          },
          intervalInDaysAfterPreviousDose: {
            _type: Type.Number,
            _description:
              'Days after the previous dose when this dose should be administered. Used to auto-suggest the next dose date. Omit for first doses or single-dose vaccines.',
          },
        },
      },
    },
    _description:
      'Doses/Schedules definitions for each vaccine configured if applicable. If not provided the vaccine would be treated as a vaccine without schedules',
    _default: [
      // ── BCG (RN) — 1 dosis única ──
      {
        vaccineConceptUuid: '886AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [{ sequenceLabel: 'Dosis-Única', sequenceNumber: 1 }],
      },
      // ── Hepatitis B (HvB) — RN (primeras 24 h) ──
      {
        vaccineConceptUuid: '782AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [{ sequenceLabel: 'Dosis-RN', sequenceNumber: 1 }],
      },
      // ── Pentavalente (DPT-HvB-Hib) — 2m, 4m, 6m ──
      {
        vaccineConceptUuid: '1685AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [
          { sequenceLabel: '1.ª Dosis', sequenceNumber: 1 },
          { sequenceLabel: '2.ª Dosis', sequenceNumber: 2, intervalInDaysAfterPreviousDose: 60 },
          { sequenceLabel: '3.ª Dosis', sequenceNumber: 3, intervalInDaysAfterPreviousDose: 60 },
        ],
      },
      // ── IPV (Polio Inactivada) — 2m, 4m, 6m, 18m + ref 4a (RM 218-2024: 100% IPV, sin APO) ──
      {
        vaccineConceptUuid: '783AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [
          { sequenceLabel: '1.ª Dosis', sequenceNumber: 1 },
          { sequenceLabel: '2.ª Dosis', sequenceNumber: 2, intervalInDaysAfterPreviousDose: 60 },
          { sequenceLabel: '3.ª Dosis', sequenceNumber: 3, intervalInDaysAfterPreviousDose: 60 },
          { sequenceLabel: '1.er Refuerzo', sequenceNumber: 11, intervalInDaysAfterPreviousDose: 365 },
          { sequenceLabel: '2.° Refuerzo', sequenceNumber: 12, intervalInDaysAfterPreviousDose: 913 },
        ],
      },
      // ── Rotavirus — 2m, 4m ──
      {
        vaccineConceptUuid: '83531AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [
          { sequenceLabel: '1.ª Dosis', sequenceNumber: 1 },
          { sequenceLabel: '2.ª Dosis', sequenceNumber: 2, intervalInDaysAfterPreviousDose: 60 },
        ],
      },
      // ── Neumococo (PCV) — 2m, 4m + refuerzo 12m ──
      {
        vaccineConceptUuid: '162342AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [
          { sequenceLabel: '1.ª Dosis', sequenceNumber: 1 },
          { sequenceLabel: '2.ª Dosis', sequenceNumber: 2, intervalInDaysAfterPreviousDose: 60 },
          { sequenceLabel: 'Refuerzo', sequenceNumber: 11, intervalInDaysAfterPreviousDose: 240 },
        ],
      },
      // ── Influenza pediátrica — 7m, 8m (anual) ──
      {
        vaccineConceptUuid: '5261AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [
          { sequenceLabel: '1.ª Dosis', sequenceNumber: 1 },
          { sequenceLabel: '2.ª Dosis', sequenceNumber: 2, intervalInDaysAfterPreviousDose: 30 },
        ],
      },
      // ── SPR (Sarampión, Paperas, Rubéola) — 12m + refuerzo 18m ──
      {
        vaccineConceptUuid: '36AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [
          { sequenceLabel: '1.ª Dosis', sequenceNumber: 1 },
          { sequenceLabel: 'Refuerzo', sequenceNumber: 11, intervalInDaysAfterPreviousDose: 180 },
        ],
      },
      // ── Varicela — 12m (1 dosis) ──
      {
        vaccineConceptUuid: '5859AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [{ sequenceLabel: 'Dosis-Única', sequenceNumber: 1 }],
      },
      // ── Fiebre Amarilla (AMA) — 15m (1 dosis) ──
      {
        vaccineConceptUuid: '5864AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [{ sequenceLabel: 'Dosis-Única', sequenceNumber: 1 }],
      },
      // ── Hepatitis A — 15m (1 dosis) ──
      {
        vaccineConceptUuid: '5857AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [{ sequenceLabel: 'Dosis-Única', sequenceNumber: 1 }],
      },
      // ── DPT (refuerzo) — 18m + 2.° refuerzo 4a ──
      {
        vaccineConceptUuid: '781AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [
          { sequenceLabel: '1.er Refuerzo', sequenceNumber: 11 },
          { sequenceLabel: '2.° Refuerzo', sequenceNumber: 12, intervalInDaysAfterPreviousDose: 913 },
        ],
      },
      // ── VPH (Virus del Papiloma Humano) — dosis única 9-13a (RM 218-2024) ──
      {
        vaccineConceptUuid: '5856AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        sequences: [{ sequenceLabel: 'Dosis-Única', sequenceNumber: 1 }],
      },
    ],
  },
};

export interface ImmunizationConfigObject {
  immunizationConceptSet: string;
  sequenceDefinitions: Array<{
    vaccineConceptUuid: string;
    sequences: Array<{
      sequenceLabel: string;
      sequenceNumber: number;
      intervalInDaysAfterPreviousDose?: number;
    }>;
  }>;
}
