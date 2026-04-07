import React from "react";
import type { Patient, OdontogramRecord } from "./types";
import { getOdontogramStats } from "../utils/serializeOdontogramData";

interface Props {
  patient: Patient;
  records: OdontogramRecord[];
  onBack: () => void;
  onViewRecord: (id: string) => void;
  onEditRecord: (id: string) => void;
  onCreateInitial: () => void;
  onCreateVisit: (initialId: string) => void;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: "in-progress" | "completed" }) {
  return (
    <span className={`cl-status ${status === "completed" ? "cl-status--done" : "cl-status--active"}`}>
      {status === "completed" ? "Terminado" : "En curso"}
    </span>
  );
}

export default function PatientDetail({
  patient,
  records,
  onBack,
  onViewRecord,
  onEditRecord,
  onCreateInitial,
  onCreateVisit,
}: Props) {
  const initials = records
    .filter((r) => r.type === "initial")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalVisits = records.filter((r) => r.type === "visit").length;

  return (
    <div>
      <button className="cl-back" onClick={onBack}>← Pacientes</button>

      {/* Patient header */}
      <div className="cl-patient-header">
        <div className="cl-patient-avatar cl-patient-avatar--lg">
          {patient.name.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <h2 className="cl-patient-header-name">{patient.name}</h2>
          <div className="cl-patient-header-meta">
            DNI: {patient.documentId} · {patient.age} años
            {patient.phone && ` · Tel: ${patient.phone}`}
            {" · "}
            {initials.length} odontograma{initials.length !== 1 ? "s" : ""} · {totalVisits} atenci{totalVisits !== 1 ? "ones" : "ón"}
          </div>
        </div>
        <button className="cl-btn cl-btn--primary" onClick={onCreateInitial}>
          + Nuevo Odontograma Inicial
        </button>
      </div>

      {/* ── No initials yet ─────────────────────────────────────────── */}
      {initials.length === 0 && (
        <div className="cl-initial-empty">
          <p>Aún no se ha creado ningún odontograma para este paciente.</p>
          <button className="cl-btn cl-btn--primary" onClick={onCreateInitial}>
            + Crear Odontograma Inicial
          </button>
        </div>
      )}

      {/* ── Each initial with its visits ────────────────────────────── */}
      {initials.map((initial, idx) => {
        const visits = records
          .filter((r) => r.type === "visit" && r.parentId === initial.id)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const initStats = getOdontogramStats(initial.data);
        const hasInProgressVisit = visits.some((v) => v.status === "in-progress");

        return (
          <div key={initial.id} className="cl-init-group">
            {/* Initial header */}
            <div className="cl-init-group-header">
              <div className="cl-init-group-badge">OI {initials.length - idx}</div>
              <div className="cl-init-group-info">
                <div className="cl-init-group-title">
                  Odontograma Inicial #{initials.length - idx}
                </div>
                <div className="cl-init-group-meta">
                  {fmtDate(initial.createdAt)} · {initStats.totalFindings} hallazgo{initStats.totalFindings !== 1 ? "s" : ""}
                  {" · "}{visits.length} atenci{visits.length !== 1 ? "ones" : "ón"}
                </div>
              </div>
              <div className="cl-init-group-actions">
                <button
                  className="cl-btn cl-btn--ghost"
                  onClick={() => onViewRecord(initial.id)}
                >
                  Ver
                </button>
                <button
                  className="cl-btn cl-btn--accent"
                  onClick={() => onEditRecord(initial.id)}
                >
                  Editar
                </button>
                {initial.status === "completed" && !hasInProgressVisit && (
                  <button className="cl-btn cl-btn--primary cl-btn--sm" onClick={() => onCreateVisit(initial.id)}>
                    + Nueva Atención
                  </button>
                )}
              </div>
            </div>

            {/* Visits for this initial */}
            {visits.length > 0 && (
              <div className="cl-init-group-visits">
                <div className="cl-visits-section-header">Atenciones</div>
                {visits.map((v) => {
                  const vStats = getOdontogramStats(v.data);
                  const code = v.id.slice(-6).toUpperCase();
                  return (
                    <div key={v.id} className={`cl-visit-item ${v.status === "in-progress" ? "cl-visit-item--active" : ""}`}>
                      <div className="cl-visit-code">AT-{code}</div>
                      <div className="cl-visit-info">
                        <div className="cl-visit-date">
                          {fmtDate(v.createdAt)}
                          <StatusBadge status={v.status} />
                        </div>
                        {v.notes && <div className="cl-visit-notes">{v.notes}</div>}
                        <div className="cl-visit-stats">
                          {vStats.totalFindings} hallazgo{vStats.totalFindings !== 1 ? "s" : ""}
                        </div>
                      </div>
                      <button
                        className={`cl-btn ${v.status === "in-progress" ? "cl-btn--accent" : "cl-btn--ghost"}`}
                        onClick={() => v.status === "in-progress" ? onEditRecord(v.id) : onViewRecord(v.id)}
                      >
                        {v.status === "in-progress" ? "Editar" : "Ver"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
