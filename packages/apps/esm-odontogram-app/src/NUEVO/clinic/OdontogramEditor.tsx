import React, { useState, useCallback, useEffect, useRef } from "react";
import { Modal } from "@carbon/react";
import Odontogram from "../components/Odontogram";
import { adultConfig } from "../config/adultConfig";
import type { Patient, OdontogramRecord } from "./types";
import type { OdontogramData } from "../types/odontogram";
import { serializeOdontogramData, getOdontogramStats } from "../utils/serializeOdontogramData";

interface Props {
  record: OdontogramRecord;
  patient: Patient;
  initialRecord?: OdontogramRecord;
  /** All visits for the same initial (sorted newest-first) */
  siblingVisits: OdontogramRecord[];
  isEditable: boolean;
  onSave: (data: OdontogramData) => void;
  onComplete: () => void;
  onNavigate: (recordId: string) => void;
  onBack: () => void;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const noop = () => {};

export default function OdontogramEditor({
  record,
  patient,
  initialRecord,
  siblingVisits,
  isEditable,
  onSave,
  onComplete,
  onNavigate,
  onBack,
}: Props) {
  // ── Working copy for dirty tracking ──────────────────────────────────────────
  const [workingData, setWorkingData] = useState<OdontogramData>(record.data);
  const savedDataRef = useRef<string>(JSON.stringify(record.data));
  const isDirty = JSON.stringify(workingData) !== savedDataRef.current;

  // Reset working data when record changes (sidebar navigation)
  useEffect(() => {
    setWorkingData(record.data);
    savedDataRef.current = JSON.stringify(record.data);
  }, [record.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Viewing mode (sidebar clicks) ──────────────────────────────────────────
  type ViewTarget = { kind: "current" } | { kind: "initial" } | { kind: "visit"; id: string };
  const [viewTarget, setViewTarget] = useState<ViewTarget>({ kind: "current" });

  // Reset view when record changes
  useEffect(() => {
    setViewTarget({ kind: "current" });
  }, [record.id]);

  // ── Confirmation modals ────────────────────────────────────────────────────
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ── beforeunload ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // ── Action helpers ─────────────────────────────────────────────────────────
  const guardNavigation = useCallback(
    (action: () => void) => {
      if (isDirty) {
        setPendingAction(() => action);
      } else {
        action();
      }
    },
    [isDirty]
  );

  const handleSave = useCallback(() => {
    onSave(workingData);
    savedDataRef.current = JSON.stringify(workingData);
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2000);
  }, [workingData, onSave]);

  const handleComplete = useCallback(() => {
    if (isDirty) {
      // Save first, then show complete confirmation
      onSave(workingData);
      savedDataRef.current = JSON.stringify(workingData);
    }
    setShowCompleteConfirm(true);
  }, [isDirty, workingData, onSave]);

  const handleCopy = useCallback(() => {
    const pruned = serializeOdontogramData(workingData);
    navigator.clipboard.writeText(JSON.stringify(pruned, null, 2)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [workingData]);

  const handleBack = useCallback(() => guardNavigation(onBack), [guardNavigation, onBack]);

  const handleSidebarNav = useCallback(
    (target: ViewTarget) => {
      // If switching to a non-current view or different record, guard for dirty
      if (target.kind === "current") {
        setViewTarget(target);
        return;
      }
      // If viewing reference (initial or sibling) — no editing, just set view
      setViewTarget(target);
    },
    []
  );

  const handleSwitchRecord = useCallback(
    (recordId: string) => {
      guardNavigation(() => onNavigate(recordId));
    },
    [guardNavigation, onNavigate]
  );

  // ── Determine what to display ──────────────────────────────────────────────
  let displayData: OdontogramData;
  let displayReadOnly: boolean;
  let displayTitle: string;
  let displayBanner: string | null = null;

  if (viewTarget.kind === "initial" && initialRecord) {
    displayData = initialRecord.data;
    displayReadOnly = true;
    displayTitle = "Odontograma Inicial (referencia)";
    displayBanner = `Solo lectura — Odontograma Inicial del ${fmtDate(initialRecord.createdAt)}`;
  } else if (viewTarget.kind === "visit") {
    const sibling = siblingVisits.find((v) => v.id === viewTarget.id);
    if (sibling) {
      displayData = sibling.data;
      displayReadOnly = true;
      displayTitle = `Atención del ${fmtDate(sibling.createdAt)}`;
      displayBanner = `Solo lectura — Atención del ${fmtDate(sibling.createdAt)}`;
    } else {
      displayData = workingData;
      displayReadOnly = !isEditable;
      displayTitle = record.type === "initial"
        ? "Odontograma Inicial"
        : record.status === "in-progress"
          ? "Atención Actual"
          : `Atención del ${fmtDate(record.createdAt)}`;
    }
  } else {
    // current
    displayData = workingData;
    displayReadOnly = !isEditable;
    if (record.type === "initial") {
      displayTitle = "Odontograma Inicial";
      if (!isEditable) {
        displayBanner = `Solo lectura — Odontograma Inicial del ${fmtDate(record.createdAt)}`;
      }
    } else {
      // visit: show "Atención Actual" only if in-progress, otherwise show date
      displayTitle = record.status === "in-progress"
        ? "Atención Actual"
        : `Atención del ${fmtDate(record.createdAt)}`;
    }
  }

  const stats = getOdontogramStats(workingData);
  const isVisit = record.type === "visit";
  const showSidebar = isVisit && !!initialRecord;

  return (
    <div>
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div className="cl-editor-topbar">
        <button className="cl-back" onClick={handleBack}>
          ← {patient.name}
        </button>
        <div className="cl-editor-topbar-right">
          {isDirty && <span className="cl-unsaved-badge">Sin guardar</span>}
          <button className="cl-btn cl-btn--ghost cl-btn--sm" onClick={handleCopy}>
            {copied ? "Copiado" : "JSON"}
          </button>
        </div>
      </div>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="cl-editor-header">
        <div>
          <h2 className="cl-editor-title">
            {record.type === "initial" ? "Odontograma Inicial" : "Atención"}
            {record.type === "visit" && record.status === "completed" && (
              <span className="cl-status cl-status--done">Terminado</span>
            )}
            {record.type === "visit" && record.status === "in-progress" && (
              <span className="cl-status cl-status--active">En curso</span>
            )}
          </h2>
          <div className="cl-editor-meta">
            {patient.name} · {fmtDate(record.createdAt)}
            {record.notes && ` · ${record.notes}`}
            {" · "}
            {stats.totalFindings} hallazgo{stats.totalFindings !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* ── Layout: Sidebar + Main ──────────────────────────────────── */}
      <div className={showSidebar ? "cl-editor-layout" : ""}>
        {/* Sidebar */}
        {showSidebar && (
          <aside className={`cl-sidebar${sidebarCollapsed ? " cl-sidebar--collapsed" : ""}`}>
            {sidebarCollapsed ? (
              /* Collapsed strip — just the expand button */
              <button
                className="cl-sidebar-expand-btn"
                onClick={() => setSidebarCollapsed(false)}
                title="Mostrar navegación"
                aria-label="Mostrar navegación"
              >
                <span className="cl-sidebar-expand-icon">›</span>
              </button>
            ) : (
              <>
                <div className="cl-sidebar-title">
                  Navegación
                  <button
                    className="cl-sidebar-collapse-btn"
                    onClick={() => setSidebarCollapsed(true)}
                    title="Ocultar navegación"
                    aria-label="Ocultar navegación"
                  >
                    ‹
                  </button>
                </div>

            {/* Initial */}
            <button
              className={`cl-sidebar-item ${viewTarget.kind === "initial" ? "cl-sidebar-item--active" : ""}`}
              onClick={() => handleSidebarNav({ kind: "initial" })}
            >
              <span className="cl-sidebar-label">
                Odontograma Inicial
                <span className="cl-sidebar-date">{fmtDate(initialRecord!.createdAt)}</span>
              </span>
            </button>

            <div className="cl-sidebar-divider" />
            <div className="cl-sidebar-subtitle">Atenciones</div>

            {/* Visits */}
            {siblingVisits.map((v) => {
              const isCurrent = v.id === record.id;
              const isViewing =
                (viewTarget.kind === "current" && isCurrent) ||
                (viewTarget.kind === "visit" && viewTarget.id === v.id);
              return (
                <button
                  key={v.id}
                  className={`cl-sidebar-item ${isViewing ? "cl-sidebar-item--active" : ""} ${isCurrent ? "cl-sidebar-item--current" : ""}`}
                  onClick={() => {
                    if (isCurrent) {
                      setViewTarget({ kind: "current" });
                    } else {
                      handleSidebarNav({ kind: "visit", id: v.id });
                    }
                  }}
                  onDoubleClick={() => {
                    if (!isCurrent) handleSwitchRecord(v.id);
                  }}
                  title={isCurrent ? "Atención actual" : "Doble clic para navegar a esta atención"}
                >
                  <span className="cl-sidebar-label">
                    {isCurrent ? "Atención actual" : "Atención"}
                    <span className="cl-sidebar-date">
                      {fmtDate(v.createdAt)}
                      {v.notes && ` · ${v.notes}`}
                    </span>
                  </span>
                </button>
              );
            })}
              </>
            )}
          </aside>
        )}

        {/* Main content */}
        <div className="cl-editor-main">
          {/* Reference banner */}
          {displayBanner && (
            <div className="cl-ref-banner">{displayBanner}</div>
          )}

          {/* Odontogram */}
          <div className="cl-editor-body">
            <Odontogram
              config={adultConfig}
              data={displayData}
              onChange={displayReadOnly ? noop : setWorkingData}
              readOnly={displayReadOnly}
              title={displayTitle}
            />
          </div>

          {/* ── Action bar ──────────────────────────────────────────── */}
          {isEditable && viewTarget.kind === "current" && (
            <div className="cl-action-bar">
              {record.status === "in-progress" && (
                <button className="cl-btn cl-btn--danger" onClick={handleComplete}>
                  Terminar {record.type === "initial" ? "Odontograma" : "Atención"}
                </button>
              )}
              <button
                className={`cl-btn cl-btn--primary ${saveFlash ? "cl-btn--flash" : ""}`}
                onClick={handleSave}
                disabled={!isDirty}
              >
                {saveFlash ? "Guardado" : "Guardar"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Unsaved changes confirmation modal ──────────────────────── */}
      <Modal
        open={pendingAction !== null}
        modalHeading="Cambios sin guardar"
        primaryButtonText="Descartar cambios"
        secondaryButtonText="Cancelar"
        onRequestClose={() => setPendingAction(null)}
        onRequestSubmit={() => {
          const action = pendingAction;
          setPendingAction(null);
          action?.();
        }}
        onSecondarySubmit={() => setPendingAction(null)}
        danger
        size="sm"
      >
        <p style={{ marginBottom: 16 }}>
          Tienes cambios sin guardar. Si sales ahora, se perderán.
        </p>
      </Modal>

      {/* ── Complete confirmation modal ──────────────────────────────── */}
      <Modal
        open={showCompleteConfirm}
        modalHeading={`Terminar ${record.type === "initial" ? "Odontograma Inicial" : "Atención"}`}
        primaryButtonText="Sí, terminar"
        secondaryButtonText="Cancelar"
        onRequestClose={() => setShowCompleteConfirm(false)}
        onRequestSubmit={() => {
          setShowCompleteConfirm(false);
          onComplete();
        }}
        onSecondarySubmit={() => setShowCompleteConfirm(false)}
        danger
        size="sm"
      >
        <p style={{ marginBottom: 16 }}>
          {record.type === "initial"
            ? "Al terminar el odontograma inicial quedará marcado como completo. Podrá seguir editándolo en cualquier momento y a partir de él se podrán crear atenciones."
            : "Al terminar la atención, ya no podrá editarse. Se podrá crear una nueva atención después."}
        </p>
      </Modal>
    </div>
  );
}
