/**
 * ToothColumn — wraps a single tooth column with an info button + modal trigger.
 *
 * Shows a small "i" button on hover. Clicking it opens the ToothInfoModal
 * with all findings for that tooth, allowing viewing details and removing findings.
 */

import React, { useCallback, useState } from 'react';
import { useOdontogramContext } from '../providers/OdontogramProvider';
import ToothInfoModal from './ToothInfoModal';
import './ToothInfoModal.css';

interface ToothColumnProps {
  toothId: number;
  children: React.ReactNode;
}

const ToothColumn: React.FC<ToothColumnProps> = ({ toothId, children }) => {
  const [showModal, setShowModal] = useState(false);
  const { data, config, toothActions, readOnly } = useOdontogramContext();

  const tooth = data.teeth.find((t) => t.toothId === toothId);
  const findingsCount = tooth?.findings?.length ?? 0;
  const toothConfig = [...config.teeth.upper, ...config.teeth.lower].find((t) => t.id === toothId);

  const handleOpen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
  }, []);

  const handleClose = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleRemoveFinding = useCallback(
    (params: { toothId: number; findingId: number; instanceId?: string }) => {
      toothActions.removeToothFinding(params);
    },
    [toothActions],
  );

  const handleRegisterFinding = useCallback(
    (params: {
      toothId: number;
      findingId: number;
      subOptionId?: number;
      color: { id: number; name: string };
      designNumber?: number | null;
    }) => {
      toothActions.registerToothFinding(params);
    },
    [toothActions],
  );

  return (
    <div className="tim-tooth-col">
      {/* Info button — visible on hover */}
      <button
        className="tim-info-btn"
        onClick={handleOpen}
        title={`Ver detalle del diente ${toothId}`}
        aria-label={`Detalle diente ${toothId}`}
      >
        i
      </button>

      {/* Finding count badge */}
      {findingsCount > 0 && <span className="tim-badge">{findingsCount}</span>}

      {children}

      {/* Touch-friendly eye button — rendered below the tooth, only visible on touch devices */}
      <button className="tim-eye-btn" onClick={handleOpen} aria-label={`Detalle diente ${toothId}`} tabIndex={-1}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M1 8C2 5.5 4.5 3 8 3C11.5 3 14 5.5 15 8C14 10.5 11.5 13 8 13C4.5 13 2 10.5 1 8Z" />
          <circle cx="8" cy="8" r="2.2" />
        </svg>
        {findingsCount > 0 && <span className="tim-eye-count">{findingsCount}</span>}
      </button>
      {showModal && tooth && toothConfig && (
        <ToothInfoModal
          toothId={toothId}
          findings={tooth.findings}
          annotations={tooth.annotations ?? []}
          findingOptions={config.findingOptions}
          zones={toothConfig.zones}
          rootDesign={toothConfig.rootDesign}
          readOnly={readOnly}
          onRemoveFinding={handleRemoveFinding}
          onRegisterFinding={handleRegisterFinding}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default ToothColumn;
