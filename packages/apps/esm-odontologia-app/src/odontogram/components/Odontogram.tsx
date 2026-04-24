/**
 * Componente público del Odontograma.
 *
 * Envuelve todo el árbol en un OdontogramProvider (estado por instancia)
 * y renderiza la UI: formulario de hallazgos, arcada superior e inferior.
 *
 * Uso:
 * ```tsx
 * <Odontogram config={adultConfig} data={data} onChange={setData} />
 * ```
 */

import React from 'react';
import { OdontogramProvider } from '../providers/OdontogramProvider';
import FormDentalClinicalFindings from './FormDentalClinicalFindings';
import ResponsiveOdontogramWrapper from './ResponsiveOdontogramWrapper';
import TeethArch from './TeethArch';
import './AdultOdontogram.css';

import type { OdontogramConfig, OdontogramData } from '../types/odontogram';

export interface OdontogramProps {
  /** Structural config (adult / child) */
  config: OdontogramConfig;
  /** Current data (controlled) */
  data: OdontogramData;
  /** Callback when data changes */
  onChange: (data: OdontogramData) => void;
  /** Disables all interactions */
  readOnly?: boolean;
  /** Optional title */
  title?: string;
  /** Optional description */
  description?: string;
}

const Odontogram: React.FC<OdontogramProps> = ({ config, data, onChange, readOnly = false, title, description }) => {
  return (
    <OdontogramProvider config={config} data={data} onChange={onChange} readOnly={readOnly}>
      <div className="adult-odontogram-container">
        {(title || description) && (
          <div className="odontogram-header">
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        )}

        <div className="odontogram-content">
          {/* Formulario de hallazgos clínicos */}
          {!readOnly && (
            <div className="form-section">
              <FormDentalClinicalFindings />
            </div>
          )}

          {/* Visualización del odontograma — responsive wrapper */}
          <div className="teeth-visualization">
            <ResponsiveOdontogramWrapper>
              <div className="upper-teeth-section">
                <TeethArch position="upper" />
              </div>

              <div className="lower-teeth-section">
                <TeethArch position="lower" />
              </div>
            </ResponsiveOdontogramWrapper>
          </div>
        </div>

        {/* Campos de texto adicionales */}
        <div className="odontogram-text-fields">
          <div className="odontogram-text-field">
            <label className="odontogram-text-label" htmlFor="odon-especificaciones">
              Especificaciones
            </label>
            <textarea
              id="odon-especificaciones"
              className="odontogram-textarea"
              value={data.especificaciones ?? ''}
              onChange={(e) => onChange({ ...data, especificaciones: e.target.value })}
              disabled={readOnly}
              rows={3}
            />
          </div>
          <div className="odontogram-text-field">
            <label className="odontogram-text-label" htmlFor="odon-observaciones">
              Observaciones
            </label>
            <textarea
              id="odon-observaciones"
              className="odontogram-textarea"
              value={data.observaciones ?? ''}
              onChange={(e) => onChange({ ...data, observaciones: e.target.value })}
              disabled={readOnly}
              rows={3}
            />
          </div>
        </div>
      </div>
    </OdontogramProvider>
  );
};

export default Odontogram;
