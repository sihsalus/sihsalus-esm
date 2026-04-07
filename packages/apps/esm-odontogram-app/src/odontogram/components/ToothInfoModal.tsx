import React, { useState, useCallback, useEffect } from "react";
import Tooth from "./Tooth";
import ToothDesigns from "./ToothDesigns";
import {
  Finding3Design1,
  Finding4Design1,
  Finding8Design1, Finding8Design2, Finding8Design3,
  Finding20Design1, Finding23Design1, Finding38Design1,
  Finding7Design1, Finding28Design1,
  Finding37Design1, Finding37Design2, Finding37Design3, Finding37Design4, Finding37Design5,
  Finding36Design1, Finding36Design2,
  Finding10Design1, Finding10Design2, Finding10Design3, Finding10Design4,
  Finding10Design5, Finding10Design6, Finding10Design7, Finding10Design8,
  Finding5Design1, Finding5Design2, Finding5Design3, Finding5Design4,
  Finding5Design5, Finding5Design6, Finding5Design7, Finding5Design8,
  Finding5Design9, Finding5Design10, Finding5Design11, Finding5Design12,
  Finding5Design13, Finding5Design14,
  Finding27Design9,
  Finding35Design1, Finding35Design2, Finding35Design3, Finding35Design4,
  Finding35Design5, Finding35Design6, Finding35Design7, Finding35Design8,
  Finding35Design9, Finding35Design10, Finding35Design11, Finding35Design12,
  Finding35Design13, Finding35Design14,
  EllipseDesignLeft, EllipseDesignRight, EllipseDesignLeftAndRight,
  Finding12Design1, Finding21Design1,
  Finding13Design1, Finding13Design2,
} from "../designs/figuras";
import type { ToothFinding, FindingOptionConfig, ToothAnnotation } from "../types/odontogram";
import "./ToothInfoModal.css";

// Design component map (same as ToothVisualization)
const designComponentMap: Record<string, Record<string, React.ComponentType<{ strokeColor: string }>>> = {
  '3':  { '1': Finding3Design1 },
  '4':  { '1': Finding4Design1 },
  '8':  { '1': Finding8Design1, '2': Finding8Design2, '3': Finding8Design3 },
  '20': { '1': Finding20Design1 },
  '23': { '1': Finding23Design1 },
  '38': { '1': Finding38Design1 },
  '7':  { '1': Finding7Design1 },
  '28': { '1': Finding28Design1 },
  '37': { '1': Finding37Design1, '2': Finding37Design2, '3': Finding37Design3, '4': Finding37Design4, '5': Finding37Design5 },
  '36': { '1': Finding36Design1, '2': Finding36Design2 },
  '10': { '1': Finding10Design1, '2': Finding10Design2, '3': Finding10Design3, '4': Finding10Design4, '5': Finding10Design5, '6': Finding10Design6, '7': Finding10Design7, '8': Finding10Design8 },
  '5':  { '1': Finding5Design1, '2': Finding5Design2, '3': Finding5Design3, '4': Finding5Design4, '5': Finding5Design5, '6': Finding5Design6, '7': Finding5Design7, '8': Finding5Design8, '9': Finding5Design9, '10': Finding5Design10, '11': Finding5Design11, '12': Finding5Design12, '13': Finding5Design13, '14': Finding5Design14 },
  '16': { '1': Finding5Design1, '2': Finding5Design2, '3': Finding5Design3, '4': Finding5Design4, '5': Finding5Design5, '6': Finding5Design6, '7': Finding5Design7, '8': Finding5Design8, '9': Finding5Design9, '10': Finding5Design10, '11': Finding5Design11, '12': Finding5Design12, '13': Finding5Design13, '14': Finding5Design14 },
  '27': { '1': Finding5Design1, '2': Finding5Design2, '3': Finding5Design3, '4': Finding5Design4, '5': Finding5Design5, '6': Finding5Design6, '7': Finding5Design7, '8': Finding5Design8, '9': Finding27Design9 },
  '34': { '1': Finding5Design1, '2': Finding5Design2, '3': Finding5Design3, '4': Finding5Design4, '5': Finding5Design5, '6': Finding5Design6, '7': Finding5Design7, '8': Finding5Design8, '9': Finding5Design9, '10': Finding5Design10, '11': Finding5Design11, '12': Finding5Design12, '13': Finding5Design13, '14': Finding5Design14 },
  '35': { '1': Finding35Design1, '2': Finding35Design2, '3': Finding35Design3, '4': Finding35Design4, '5': Finding35Design5, '6': Finding35Design6, '7': Finding35Design7, '8': Finding35Design8, '9': Finding35Design9, '10': Finding35Design10, '11': Finding35Design11, '12': Finding35Design12, '13': Finding35Design13, '14': Finding35Design14 },
  '11': { '1': EllipseDesignLeft as any, '2': EllipseDesignRight as any, '3': EllipseDesignLeftAndRight as any },
  '12': { '1': Finding12Design1 },
  '21': { '1': Finding21Design1 },
  '13': { '1': Finding13Design1, '2': Finding13Design2 },
};

const COLOR_CSS: Record<string, string> = {
  red: "#dc2626", blue: "#2563eb", black: "#0f172a",
  yellow: "#ca8a04", green: "#16a34a", white: "#e2e8f0",
  gray: "#64748b", grey: "#64748b",
};
const COLOR_LABEL: Record<string, string> = {
  red: "Rojo", blue: "Azul", black: "Negro",
  yellow: "Amarillo", green: "Verde", white: "Blanco",
  gray: "Gris", grey: "Gris",
};

interface ToothInfoModalProps {
  toothId: number;
  findings: ToothFinding[];
  annotations: ToothAnnotation[];
  findingOptions: FindingOptionConfig[];
  zones: number;
  rootDesign: string;
  readOnly: boolean;
  onRemoveFinding: (params: { toothId: number; findingId: number; instanceId?: string }) => void;
  onRegisterFinding: (params: { toothId: number; findingId: number; subOptionId?: number; color: { id: number; name: string }; designNumber?: number | null }) => void;
  onClose: () => void;
}

const ToothInfoModal: React.FC<ToothInfoModalProps> = ({
  toothId,
  findings,
  annotations,
  findingOptions,
  zones,
  rootDesign,
  readOnly,
  onRemoveFinding,
  onRegisterFinding,
  onClose,
}) => {
  // Map of instanceId → finding for inline undo rows (no timeout — stays until user acts)
  const [removedItems, setRemovedItems] = useState<Map<string, ToothFinding>>(new Map());

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);



  const getFindingName = useCallback(
    (findingId: number) => findingOptions.find((o) => o.id === findingId)?.nombre ?? `Hallazgo ${findingId}`,
    [findingOptions]
  );

  const getSuboptionName = useCallback(
    (findingId: number, subOptionId?: number) => {
      if (subOptionId == null) return null;
      const cfg = findingOptions.find((o) => o.id === findingId);
      return cfg?.subopciones?.find((s) => s.id === subOptionId)?.nombre ?? null;
    },
    [findingOptions]
  );

  const handleDelete = useCallback(
    (finding: ToothFinding) => {
      onRemoveFinding({ toothId, findingId: finding.findingId, instanceId: finding.id });
      setRemovedItems((prev) => new Map(prev).set(finding.id, finding));
    },
    [toothId, onRemoveFinding]
  );

  const handleUndo = useCallback(
    (instanceId: string) => {
      const f = removedItems.get(instanceId);
      if (!f) return;
      onRegisterFinding({
        toothId,
        findingId: f.findingId,
        subOptionId: f.subOptionId,
        color: f.color,
        designNumber: f.designNumber,
      });
      setRemovedItems((prev) => {
        const next = new Map(prev);
        next.delete(instanceId);
        return next;
      });
    },
    [removedItems, onRegisterFinding, toothId]
  );

  // Render design preview for a finding
  const renderDesignPreview = (finding: ToothFinding) => {
    const fKey = String(finding.findingId);
    const dKey = String(finding.designNumber);
    const comps = designComponentMap[fKey];
    const Comp = comps?.[dKey];
    if (!Comp) return null;
    return (
      <svg width="40" height="80" viewBox="0 0 60 120" className="tim-design-preview">
        <ToothDesigns design={rootDesign as any} />
        <Tooth zones={zones} />
        <Comp strokeColor={finding.color?.name || "black"} />
      </svg>
    );
  };

  // Group findings by findingId for clearer display
  const groupedFindings = React.useMemo(() => {
    const map = new Map<number, ToothFinding[]>();
    for (const f of findings) {
      let arr = map.get(f.findingId);
      if (!arr) { arr = []; map.set(f.findingId, arr); }
      arr.push(f);
    }
    return Array.from(map.entries()).map(([fId, items]) => ({
      findingId: fId,
      name: getFindingName(fId),
      items,
    }));
  }, [findings, getFindingName]);

  return (
    <div className="tim-backdrop" onClick={onClose}>
      <div className="tim-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="tim-header">
          <div className="tim-header-left">
            <span className="tim-tooth-id">Diente {toothId}</span>
            <span className="tim-finding-count">{findings.length} hallazgo{findings.length !== 1 ? "s" : ""}</span>
          </div>
          <button className="tim-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        {/* Body */}
        <div className="tim-body">
          {/* Overview section: tooth preview + annotations */}
          <div className="tim-overview">
            <div className="tim-tooth-preview">
              <svg width="60" height="120" viewBox="0 0 60 120">
                <ToothDesigns design={rootDesign as any} />
                <Tooth zones={zones} />
                {findings.map((f, i) => {
                  const comps = designComponentMap[String(f.findingId)];
                  const Comp = comps?.[String(f.designNumber)];
                  if (!Comp) return null;
                  return (
                    <g key={f.id || i}>
                      <Comp strokeColor={f.color?.name || "black"} />
                    </g>
                  );
                })}
              </svg>
            </div>
            {annotations.length > 0 && (
              <div className="tim-annotations">
                <span className="tim-section-label">Anotaciones</span>
                <div className="tim-annotation-chips">
                  {annotations.map((ann, i) => (
                    <span
                      key={`${ann.findingId}-${ann.text}-${i}`}
                      className="tim-annotation-chip"
                      style={{ color: COLOR_CSS[ann.color] ?? ann.color }}
                    >
                      {ann.text}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Findings list */}
          {groupedFindings.length === 0 && removedItems.size === 0 ? (
            <div className="tim-empty">Sin hallazgos aplicados</div>
          ) : (
            <div className="tim-findings-list">
              {groupedFindings.map((group) => {
                // Removed items that belong to this group
                const ghostsForGroup = Array.from(removedItems.values()).filter(
                  (f) => f.findingId === group.findingId
                );
                return (
                  <div key={group.findingId} className="tim-finding-group">
                    <div className="tim-group-header">
                      <span className="tim-group-name">{group.name}</span>
                      <span className="tim-group-count">{group.items.length}</span>
                    </div>
                    {group.items.map((f) => {
                      const subName = getSuboptionName(f.findingId, f.subOptionId);
                      return (
                        <div key={f.id} className="tim-finding-row">
                          <div className="tim-finding-info">
                            {renderDesignPreview(f)}
                            <div className="tim-finding-meta">
                              {f.designNumber != null && (
                                <span className="tim-meta-tag">Diseño {f.designNumber}</span>
                              )}
                              {subName && (
                                <span className="tim-meta-tag tim-meta-tag--tipo">Tipo: {subName}</span>
                              )}
                              <span className="tim-meta-color" style={{ "--dot-color": COLOR_CSS[f.color?.name] ?? "#888" } as React.CSSProperties}>
                                <span className="tim-color-dot" />
                                {COLOR_LABEL[f.color?.name] ?? f.color?.name}
                              </span>
                            </div>
                          </div>
                          {!readOnly && (
                            <div className="tim-finding-actions">
                              <button
                                className="tim-btn tim-btn--remove"
                                onClick={() => handleDelete(f)}
                                title="Eliminar hallazgo"
                              >
                                ×
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {/* Ghost rows for recently removed items in this group */}
                    {ghostsForGroup.map((f) => {
                      const subName = getSuboptionName(f.findingId, f.subOptionId);
                      return (
                        <div key={f.id} className="tim-finding-row tim-finding-row--ghost">
                          <div className="tim-finding-info">
                            {renderDesignPreview(f)}
                            <div className="tim-finding-meta">
                              {f.designNumber != null && (
                                <span className="tim-meta-tag">Diseño {f.designNumber}</span>
                              )}
                              {subName && (
                                <span className="tim-meta-tag tim-meta-tag--tipo">Tipo: {subName}</span>
                              )}
                              <span className="tim-meta-color" style={{ "--dot-color": COLOR_CSS[f.color?.name] ?? "#888" } as React.CSSProperties}>
                                <span className="tim-color-dot" />
                                {COLOR_LABEL[f.color?.name] ?? f.color?.name}
                              </span>
                            </div>
                          </div>
                          <div className="tim-finding-actions">
                            <span className="tim-ghost-label">Eliminado</span>
                            <button className="tim-btn tim-btn--undo" onClick={() => handleUndo(f.id)}>Deshacer</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {/* Ghost groups for removed items whose findingId no longer has a group */}
              {(() => {
                const existingFindingIds = new Set(groupedFindings.map((g) => g.findingId));
                const orphanGroups = new Map<number, ToothFinding[]>();
                removedItems.forEach((f) => {
                  if (!existingFindingIds.has(f.findingId)) {
                    const arr = orphanGroups.get(f.findingId) ?? [];
                    arr.push(f);
                    orphanGroups.set(f.findingId, arr);
                  }
                });
                return Array.from(orphanGroups.entries()).map(([fId, entries]) => (
                  <div key={`ghost-group-${fId}`} className="tim-finding-group tim-finding-group--ghost">
                    <div className="tim-group-header">
                      <span className="tim-group-name">{getFindingName(fId)}</span>
                      <span className="tim-group-count tim-group-count--ghost">0</span>
                    </div>
                    {entries.map((f) => {
                      const subName = getSuboptionName(f.findingId, f.subOptionId);
                      return (
                        <div key={f.id} className="tim-finding-row tim-finding-row--ghost">
                          <div className="tim-finding-info">
                            {renderDesignPreview(f)}
                            <div className="tim-finding-meta">
                              {f.designNumber != null && (
                                <span className="tim-meta-tag">Diseño {f.designNumber}</span>
                              )}
                              {subName && (
                                <span className="tim-meta-tag tim-meta-tag--tipo">Tipo: {subName}</span>
                              )}
                              <span className="tim-meta-color" style={{ "--dot-color": COLOR_CSS[f.color?.name] ?? "#888" } as React.CSSProperties}>
                                <span className="tim-color-dot" />
                                {COLOR_LABEL[f.color?.name] ?? f.color?.name}
                              </span>
                            </div>
                          </div>
                          <div className="tim-finding-actions">
                            <span className="tim-ghost-label">Eliminado</span>
                            <button className="tim-btn tim-btn--undo" onClick={() => handleUndo(f.id)}>Deshacer</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ));
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToothInfoModal;
