import React, { useState, useEffect, useCallback } from "react";
import type { Patient, OdontogramRecord, Route } from "./types";
import type { OdontogramData } from "../types/odontogram";
import { adultConfig } from "../config/adultConfig";
import { createEmptyOdontogramData } from "../types/odontogram";
import { SEED_PATIENTS, getSeedRecords } from "./seedData";
import { initStorage, resetStorage, loadPatients, loadRecords, saveRecords, genId } from "./storage";
import PatientList from "./PatientList";
import PatientDetail from "./PatientDetail";
import OdontogramEditor from "./OdontogramEditor";
import "./clinic.css";

export default function ClinicApp() {
  const [route, setRoute] = useState<Route>({ page: "patients" });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [records, setRecords] = useState<OdontogramRecord[]>([]);

  useEffect(() => {
    initStorage(SEED_PATIENTS, getSeedRecords());
    setPatients(loadPatients());
    setRecords(loadRecords());
  }, []);

  // ── Navigation ──────────────────────────────────────────────────────────────

  const goPatients = useCallback(() => setRoute({ page: "patients" }), []);
  const goPatient = useCallback((patientId: string) => setRoute({ page: "patient", patientId }), []);
  const goOdontogram = useCallback(
    (recordId: string, readOnly = false) => setRoute({ page: "odontogram", recordId, readOnly }),
    []
  );

  // ── Actions ─────────────────────────────────────────────────────────────────

  const createInitial = useCallback(
    (patientId: string) => {
      const rec: OdontogramRecord = {
        id: genId(),
        patientId,
        type: "initial",
        status: "in-progress",
        createdAt: new Date().toISOString(),
        data: createEmptyOdontogramData(adultConfig),
      };
      const updated = [...records, rec];
      saveRecords(updated);
      setRecords(updated);
      goOdontogram(rec.id);
    },
    [records, goOdontogram]
  );

  const createVisit = useCallback(
    (initialId: string) => {
      const initial = records.find((r) => r.id === initialId);
      if (!initial) return;
      const rec: OdontogramRecord = {
        id: genId(),
        patientId: initial.patientId,
        type: "visit",
        parentId: initialId,
        status: "in-progress",
        createdAt: new Date().toISOString(),
        data: createEmptyOdontogramData(adultConfig), // new visits start empty
      };
      const updated = [...records, rec];
      saveRecords(updated);
      setRecords(updated);
      goOdontogram(rec.id);
    },
    [records, goOdontogram]
  );

  /** Explicit save — called from OdontogramEditor "Guardar" button */
  const saveRecordData = useCallback((recordId: string, data: OdontogramData) => {
    setRecords((prev) => {
      const updated = prev.map((r) => (r.id === recordId ? { ...r, data } : r));
      saveRecords(updated);
      return updated;
    });
  }, []);

  /** Mark record as completed */
  const completeRecord = useCallback((recordId: string) => {
    setRecords((prev) => {
      const updated = prev.map((r) =>
        r.id === recordId
          ? { ...r, status: "completed" as const, completedAt: new Date().toISOString() }
          : r
      );
      saveRecords(updated);
      return updated;
    });
    // Navigate back to patient
    const record = records.find((r) => r.id === recordId);
    if (record) goPatient(record.patientId);
  }, [records, goPatient]);

  const handleReset = useCallback(() => {
    const seeds = getSeedRecords();
    resetStorage(SEED_PATIENTS, seeds);
    setPatients(SEED_PATIENTS);
    setRecords(seeds);
    setRoute({ page: "patients" });
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────

  if (route.page === "patient") {
    const patient = patients.find((p) => p.id === route.patientId);
    if (!patient) {
      goPatients();
      return null;
    }
    const pRecords = records.filter((r) => r.patientId === patient.id);
    return (
      <div className="cl-container">
        <PatientDetail
          patient={patient}
          records={pRecords}
          onBack={goPatients}
          onViewRecord={(id) => goOdontogram(id, true)}
          onEditRecord={(id) => goOdontogram(id, false)}
          onCreateInitial={() => createInitial(patient.id)}
          onCreateVisit={(initialId) => createVisit(initialId)}
        />
      </div>
    );
  }

  if (route.page === "odontogram") {
    const record = records.find((r) => r.id === route.recordId);
    if (!record) {
      goPatients();
      return null;
    }
    const patient = patients.find((p) => p.id === record.patientId);
    if (!patient) {
      goPatients();
      return null;
    }

    // Find initial record (for visits: via parentId, for initials: itself)
    const initialRecord =
      record.type === "visit" ? records.find((r) => r.id === record.parentId) : undefined;

    // Context initial ID (for visits: parentId, for initials: record.id)
    const contextInitialId = record.type === "visit" ? record.parentId : record.id;

    // All sibling visits for this initial (newest first)
    const siblingVisits = records
      .filter((r) => r.type === "visit" && r.parentId === contextInitialId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Editability:
    // - Initial: always editable unless opened in read-only mode (Ver)
    // - Visit: editable only if status is "in-progress"
    const isEditable =
      (record.type === "initial" || record.status === "in-progress") &&
      !route.readOnly;

    return (
      <div className="cl-container">
        <OdontogramEditor
          key={record.id}
          record={record}
          patient={patient}
          initialRecord={initialRecord}
          siblingVisits={siblingVisits}
          isEditable={isEditable}
          onSave={(data) => saveRecordData(record.id, data)}
          onComplete={() => completeRecord(record.id)}
          onNavigate={(id) => goOdontogram(id)}
          onBack={() => goPatient(patient.id)}
        />
      </div>
    );
  }

  // ── Patient List (default) ──────────────────────────────────────────────────
  return (
    <div className="cl-container">
      <div className="cl-page-header">
        <h1 className="cl-page-title">Odontograma Clínico</h1>
        <p className="cl-page-subtitle">
          Gestión de odontogramas por paciente · Datos en localStorage
        </p>
      </div>

      <PatientList patients={patients} records={records} onSelect={goPatient} />

      <div className="cl-footer">
        <span className="cl-footer-text">
          {patients.length} pacientes · {records.length} registros
        </span>
        <button className="cl-btn cl-btn--ghost cl-btn--sm" onClick={handleReset}>
          Restaurar datos de ejemplo
        </button>
      </div>
    </div>
  );
}
