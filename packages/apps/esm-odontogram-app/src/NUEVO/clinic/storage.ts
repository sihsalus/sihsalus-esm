import type { Patient, OdontogramRecord } from "./types";

const PK = "odonto_clinic_patients";
const RK = "odonto_clinic_records";
const VK = "odonto_clinic_seed_version";

/** Increment this whenever seed data changes to force a reset. */
export const SEED_VERSION = "v7";

export function initStorage(patients: Patient[], records: OdontogramRecord[]): void {
  const storedVersion = localStorage.getItem(VK);
  if (storedVersion === SEED_VERSION && localStorage.getItem(PK)) return;
  // Version mismatch or first run — reset to new seed
  localStorage.setItem(PK, JSON.stringify(patients));
  localStorage.setItem(RK, JSON.stringify(records));
  localStorage.setItem(VK, SEED_VERSION);
}

export function resetStorage(patients: Patient[], records: OdontogramRecord[]): void {
  localStorage.setItem(PK, JSON.stringify(patients));
  localStorage.setItem(RK, JSON.stringify(records));
}

export function loadPatients(): Patient[] {
  return JSON.parse(localStorage.getItem(PK) || "[]");
}

export function loadRecords(): OdontogramRecord[] {
  return JSON.parse(localStorage.getItem(RK) || "[]");
}

export function saveRecords(records: OdontogramRecord[]): void {
  localStorage.setItem(RK, JSON.stringify(records));
}

export function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
