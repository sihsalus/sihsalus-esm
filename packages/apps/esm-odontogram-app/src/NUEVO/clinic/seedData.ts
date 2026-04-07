import type { Patient, OdontogramRecord } from "./types";
import type { OdontogramData } from "../types/odontogram";
import { adultConfig } from "../config/adultConfig";
import { createEmptyOdontogramData } from "../types/odontogram";
import { mergeOdontogramData } from "../utils/mergeOdontogramData";

// ── Shortcuts ─────────────────────────────────────────────────────────────────
const B = { id: 101, name: "blue" };
const R = { id: 102, name: "red" };

function m(partial: Partial<OdontogramData>): OdontogramData {
  return mergeOdontogramData(adultConfig, partial);
}
function empty(): OdontogramData {
  return createEmptyOdontogramData(adultConfig);
}

// ── Patients ──────────────────────────────────────────────────────────────────
export const SEED_PATIENTS: Patient[] = [
  { id: "p1", name: "Sofía Mendoza Ríos",    age: 31, documentId: "10234567", phone: "987 112 233" },
  { id: "p2", name: "Diego Castillo Vega",   age: 45, documentId: "20345678", phone: "916 445 566" },
  { id: "p3", name: "Lucía Herrera Salinas", age: 38, documentId: "30456789", phone: "955 778 899" },
];

// =============================================================================
// PATIENT 3 — Lucía Herrera, 38
// Historia: múltiples caries activas en 1.6 y 2.6, obturaciones previas,
// remanentes radiculares, desgastes, fluorosis y algunas ausencias.
// =============================================================================

const p3Init: Partial<OdontogramData> = {
  teeth: [
    {
      toothId: 18,
      findings: [
        { id: "1771633519692-ejo4pkont", findingId: 5, color: R, subOptionId: 503, designNumber: 6 },
        { id: "1771633519984-31stqc764", findingId: 5, color: R, subOptionId: 503, designNumber: 7 },
      ],
    },
    {
      toothId: 17,
      findings: [
        { id: "1771633441434-v2lsip69w", findingId: 13, color: B, designNumber: 2 },
        { id: "1771633451020-mw8nj2hy4", findingId: 17, color: B, designNumber: 1 },
        { id: "1771633497603-8ymjjhmky", findingId: 37, color: R, designNumber: 3 },
        { id: "1771633498549-xdfrbstoi", findingId: 37, color: R, designNumber: 2 },
        { id: "1771633503384-3u1veti2f", findingId: 37, color: R, designNumber: 5 },
      ],
    },
    {
      toothId: 16,
      findings: [
        { id: "1771633329444-o63t4j2gc", findingId: 1, color: B, designNumber: 1 },
      ],
    },
    {
      toothId: 15,
      findings: [
        { id: "1771633329986-gk9ldu4sr", findingId: 1, color: B, designNumber: 3 },
      ],
    },
    {
      toothId: 14,
      findings: [
        { id: "1771633330738-t8hrzw77c", findingId: 1, color: B, designNumber: 3 },
      ],
    },
    {
      toothId: 13,
      findings: [
        { id: "1771633331583-18n6tfvc9", findingId: 1, color: B, designNumber: 3 },
      ],
    },
    {
      toothId: 12,
      findings: [
        { id: "1771633332282-6y43tko0k", findingId: 1, color: B, designNumber: 2 },
      ],
    },
    {
      toothId: 11,
      findings: [
        { id: "1771633468773-p317ciase", findingId: 24, color: B, designNumber: 1 },
      ],
    },
    {
      toothId: 21,
      findings: [
        { id: "1771633435501-crelwd3vr", findingId: 33, color: R, designNumber: 1 },
        { id: "1771633446316-h4ikzuoxh", findingId: 28, color: R, designNumber: 1 },
      ],
    },
    {
      toothId: 23,
      findings: [
        { id: "1771633336834-e82ti972i", findingId: 11, color: B, designNumber: 1 },
      ],
    },
    {
      toothId: 24,
      findings: [
        { id: "1771633336293-7u8jzss3r", findingId: 11, color: B, designNumber: 3 },
      ],
    },
    {
      toothId: 25,
      findings: [
        { id: "1771633337122-4doa2h401", findingId: 11, color: B, designNumber: 2 },
        { id: "1771633553933-13b5v2zgr", findingId: 32, color: R, designNumber: 1 },
      ],
    },
    {
      toothId: 26,
      findings: [
        { id: "1771633414939-smb1fc0nx", findingId: 16, color: R, subOptionId: 1604, designNumber: 8 },
        { id: "1771633415461-ohtkxk9it", findingId: 16, color: R, subOptionId: 1604, designNumber: 11 },
        { id: "1771633554611-7yeaytc6h", findingId: 32, color: R, designNumber: 3 },
      ],
    },
    {
      toothId: 27,
      findings: [
        { id: "1771633554862-brt8fekua", findingId: 32, color: R, designNumber: 3 },
      ],
    },
    {
      toothId: 28,
      findings: [
        { id: "1771633429764-4zdlbvk9m", findingId: 20, color: B, subOptionId: 2003, designNumber: 1 },
        { id: "1771633556339-5jhmn45hg", findingId: 32, color: R, designNumber: 2 },
      ],
    },
    {
      toothId: 48,
      findings: [
        { id: "1771633491541-qlzrufu4q", findingId: 23, color: B, designNumber: 1 },
      ],
    },
    {
      toothId: 45,
      findings: [
        { id: "1771633352886-x5fuxk4cw", findingId: 8, color: R, designNumber: 2 },
      ],
    },
    {
      toothId: 44,
      findings: [
        { id: "1771633462283-jfrocawrk", findingId: 36, color: R, designNumber: 1 },
      ],
    },
    {
      toothId: 43,
      findings: [
        { id: "1771633478027-clboq6aa3", findingId: 2, color: B, designNumber: 1 },
      ],
    },
    {
      toothId: 42,
      findings: [
        { id: "1771633436988-vbqgiys9o", findingId: 33, color: R, designNumber: 1 },
        { id: "1771633478644-kc6ezl6x4", findingId: 2, color: B, designNumber: 3 },
      ],
    },
    {
      toothId: 41,
      findings: [
        { id: "1771633459738-hkppqna8g", findingId: 36, color: R, designNumber: 2 },
      ],
    },
    {
      toothId: 33,
      findings: [
        { id: "1771633348003-1t3p6nzk7", findingId: 8, color: B, designNumber: 3 },
      ],
    },
    {
      toothId: 36,
      findings: [
        { id: "1771633534858-bm3l5pa66", findingId: 10, color: R, designNumber: 6 },
      ],
    },
    {
      toothId: 38,
      findings: [
        { id: "1771633471506-ptt30w08l", findingId: 24, color: B, designNumber: 2 },
      ],
    },
  ],
  spacingFindings: {
    1: [
      { leftToothId: 16, rightToothId: 15, findings: [{ id: "1771633329789-tgm4fgiyp", findingId: 1, color: B, designNumber: 3 }] },
      { leftToothId: 15, rightToothId: 14, findings: [{ id: "1771633330522-gil7gjzss", findingId: 1, color: B, designNumber: 3 }] },
      { leftToothId: 14, rightToothId: 13, findings: [{ id: "1771633331348-x9b7kvtlh", findingId: 1, color: B, designNumber: 3 }] },
      { leftToothId: 13, rightToothId: 12, findings: [{ id: "1771633332100-6jg4q1xud", findingId: 1, color: B, designNumber: 3 }] },
    ],
    2: [
      { leftToothId: 43, rightToothId: 42, findings: [{ id: "1771633478390-tif1zgjns", findingId: 2, color: B, designNumber: 3 }] },
      { leftToothId: 42, rightToothId: 41, findings: [{ id: "1771633479101-n8em4jnjq", findingId: 2, color: B, designNumber: 1 }] },
    ],
    6: [
      { leftToothId: 37, rightToothId: 38, findings: [{ id: "1771633340766-vjpbon2gw", findingId: 6, color: B, designNumber: 1 }] },
    ],
    32: [
      { leftToothId: 25, rightToothId: 26, findings: [{ id: "1771633554374-txrh78lff", findingId: 32, color: R, designNumber: 3 }] },
      { leftToothId: 26, rightToothId: 27, findings: [{ id: "1771633555620-nuhp0u1um", findingId: 32, color: R, designNumber: 3 }] },
      { leftToothId: 27, rightToothId: 28, findings: [{ id: "1771633556125-l6qpdc1co", findingId: 32, color: R, designNumber: 3 }] },
    ],
  },
  legendSpaces: [
    { leftToothId: 23, rightToothId: 24, findings: [{ id: "1771633336610-pzarazq1i", findingId: 11, color: B, designNumber: 3 }] },
    { leftToothId: 24, rightToothId: 25, findings: [{ id: "1771633337619-0wfgpm8z6", findingId: 11, color: B, designNumber: 3 }] },
  ],
  observaciones:
    "Paciente presenta múltiples lesiones cariosas activas en piezas 1.6 y 2.6, comprometiendo superficies oclusales y distales. Se evidencia obturación previa en pieza 3.6 en buen estado, sin signos de filtración marginal.",
};

// Visit 1 — Obturación de caries activas en pieza 2.6 (CDP)
const p3V1Data: Partial<OdontogramData> = {
  teeth: [
    {
      toothId: 26,
      findings: [
        { id: "p3v1-26a", findingId: 34, color: B, subOptionId: 3401, designNumber: 8 },
        { id: "p3v1-26b", findingId: 34, color: B, subOptionId: 3401, designNumber: 11 },
      ],
    },
  ],
  observaciones:
    "Se realizaron obturaciones en amalgama en superficies oclusal y distal de pieza 2.6. Paciente tolera bien el procedimiento. Se indica control a los 7 días.",
};

// Visit 2 — Exodoncia del remanente radicular 2.1 y obturación pieza 4.5
const p3V2Data: Partial<OdontogramData> = {
  teeth: [
    {
      toothId: 21,
      findings: [
        { id: "p3v2-21a", findingId: 20, color: B, subOptionId: 2002, designNumber: 1 },
      ],
    },
    {
      toothId: 45,
      findings: [
        { id: "p3v2-45a", findingId: 34, color: B, subOptionId: 3401, designNumber: 2 },
      ],
    },
  ],
  observaciones:
    "Exodoncia de remanente radicular 2.1 sin complicaciones. Obturación en amalgama de caries oclusal pieza 4.5. Se entrega indicaciones post-operatorias.",
};

// =============================================================================
// BUILD RECORDS
// =============================================================================
export function getSeedRecords(): OdontogramRecord[] {
  return [
    // p1 and p2 have no records — new patients, no odontogram yet

    // ── Patient 3 ── Initial (completed) + 2 completed visits
    {
      id: "r-p3-init",
      patientId: "p3",
      type: "initial",
      status: "completed",
      createdAt: "2026-01-15T09:00:00.000Z",
      completedAt: "2026-01-15T10:30:00.000Z",
      data: m(p3Init),
    },
    {
      id: "r-p3-v1",
      patientId: "p3",
      type: "visit",
      parentId: "r-p3-init",
      status: "completed",
      createdAt: "2026-01-29T10:00:00.000Z",
      completedAt: "2026-01-29T11:00:00.000Z",
      notes: "Obturación piezas 2.6 (CDP)",
      data: m(p3V1Data),
    },
    {
      id: "r-p3-v2",
      patientId: "p3",
      type: "visit",
      parentId: "r-p3-init",
      status: "completed",
      createdAt: "2026-02-12T09:30:00.000Z",
      completedAt: "2026-02-12T10:30:00.000Z",
      notes: "Exodoncia remanente 2.1 + obturación 4.5",
      data: m(p3V2Data),
    },
  ];
}
