import React from "react";
import type { Patient, OdontogramRecord } from "./types";

interface Props {
  patients: Patient[];
  records: OdontogramRecord[];
  onSelect: (id: string) => void;
}

export default function PatientList({ patients, records, onSelect }: Props) {
  // Sort: patients with records first, then alphabetically
  const sorted = [...patients].sort((a, b) => {
    const aHas = records.some((r) => r.patientId === a.id) ? 0 : 1;
    const bHas = records.some((r) => r.patientId === b.id) ? 0 : 1;
    if (aHas !== bHas) return aHas - bHas;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="cl-patient-grid">
      {sorted.map((p) => {
        const pRecords = records.filter((r) => r.patientId === p.id);
        const initialCount = pRecords.filter((r) => r.type === "initial").length;
        const visitCount = pRecords.filter((r) => r.type === "visit").length;
        const hasInProgress = pRecords.some((r) => r.status === "in-progress");
        const hasRecords = pRecords.length > 0;
        const lastVisit = pRecords
          .filter((r) => r.type === "visit")
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

        return (
          <div
            key={p.id}
            className={`cl-patient-card${!hasRecords ? " cl-patient-card--empty" : ""}`}
            onClick={() => onSelect(p.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onSelect(p.id)}
          >
            <div className="cl-patient-card-top">
              <div className="cl-patient-avatar">{p.name.charAt(0)}</div>
              <div className="cl-patient-info">
                <div className="cl-patient-name">{p.name}</div>
                <div className="cl-patient-meta">DNI {p.documentId} · {p.age} años</div>
              </div>
            </div>

            <div className="cl-patient-card-body">
              {lastVisit ? (
                <div className="cl-patient-last">Última atención: {fmtDate(lastVisit.createdAt)}</div>
              ) : hasRecords ? (
                <div className="cl-patient-last">Sin atenciones aún</div>
              ) : (
                <div className="cl-patient-no-records">Sin odontograma registrado</div>
              )}
            </div>

            <div className="cl-patient-card-footer">
              <div className="cl-patient-stats">
                {hasRecords ? (
                  <>
                    {visitCount > 0 && (
                      <span className="cl-patient-stat-pill cl-patient-stat-pill--green">
                        {visitCount} atención{visitCount !== 1 ? "es" : ""}
                      </span>
                    )}
                    {hasInProgress && (
                      <span className="cl-status cl-status--active" style={{ fontSize: 11 }}>En curso</span>
                    )}
                    {!hasInProgress && visitCount === 0 && (
                      <span className="cl-patient-stat-pill">Con odontograma</span>
                    )}
                  </>
                ) : (
                  <span className="cl-patient-stat-pill">Nuevo paciente</span>
                )}
              </div>
              {p.phone && (
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{p.phone}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
