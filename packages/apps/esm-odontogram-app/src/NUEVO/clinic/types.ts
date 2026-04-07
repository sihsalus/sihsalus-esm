import type { OdontogramData } from "../types/odontogram";

export interface Patient {
  id: string;
  name: string;
  age: number;
  documentId: string;
  phone?: string;
}

export interface OdontogramRecord {
  id: string;
  patientId: string;
  type: "initial" | "visit";
  /** For visits: ID of the initial odontogram this visit derives from */
  parentId?: string;
  status: "in-progress" | "completed";
  createdAt: string;
  completedAt?: string;
  notes?: string;
  data: OdontogramData;
}

export type Route =
  | { page: "patients" }
  | { page: "patient"; patientId: string }
  | { page: "odontogram"; recordId: string; readOnly?: boolean };
