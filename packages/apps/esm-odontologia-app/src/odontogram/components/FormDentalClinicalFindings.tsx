import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useOdontogramContext } from '../providers/OdontogramProvider';
import type { FindingColor, FindingSuboption } from '../types/odontogram';
import { COLOR_CSS, COLOR_LABEL } from './constants';

// ─── Datos de referencia de siglas clínicas por hallazgo ─────────────────────
interface SiglaEntry {
  sigla: string;
  significado: string;
}
interface SiglaGroup {
  hallazgo: string;
  nota?: string;
  siglas: SiglaEntry[];
}

const SIGLAS_MAP: Record<number, SiglaGroup> = {
  3: {
    hallazgo: 'Corona',
    nota: 'En especificaciones: detallar color del metal u otras características.',
    siglas: [
      { sigla: 'CM', significado: 'Corona Metálica' },
      { sigla: 'CF', significado: 'Corona Fenestrada' },
      { sigla: 'CMC', significado: 'Corona Metal Cerámica' },
      { sigla: 'CV', significado: 'Corona Veneer' },
      { sigla: 'CLM', significado: 'Corona Libre de Metal' },
    ],
  },
  4: {
    hallazgo: 'Corona Temporal',
    siglas: [{ sigla: 'CT', significado: 'Corona Temporal' }],
  },
  5: {
    hallazgo: 'Defectos de Desarrollo del Esmalte (DDE)',
    nota: 'Colocar siglas en rojo. Fluorosis: detallar en especificaciones con clasificación.',
    siglas: [
      { sigla: 'O', significado: 'Opacidades' },
      { sigla: 'PE', significado: 'Pigmentación' },
      { sigla: 'Fluorosis', significado: 'Detallar en especificaciones' },
    ],
  },
  9: {
    hallazgo: 'Fosas y Fisuras Profundas',
    siglas: [{ sigla: 'FFP', significado: 'Fosas y Fisuras Profundas' }],
  },
  13: {
    hallazgo: 'Giroversión',
    nota: 'Flecha curva azul en sentido de rotación a nivel oclusal.',
    siglas: [],
  },
  14: {
    hallazgo: 'Impactación',
    siglas: [{ sigla: 'I', significado: 'Impactación' }],
  },
  15: {
    hallazgo: 'Implante Dental',
    siglas: [{ sigla: 'IMP', significado: 'Implante Dental' }],
  },
  16: {
    hallazgo: 'Lesión de Caries Dental',
    siglas: [
      { sigla: 'MB', significado: 'Mancha Blanca' },
      { sigla: 'CE', significado: 'Caries en Esmalte' },
      { sigla: 'CD', significado: 'Caries en Dentina' },
      { sigla: 'CDP', significado: 'Compromiso Pulpar' },
    ],
  },
  17: {
    hallazgo: 'Macrodoncia',
    siglas: [{ sigla: 'MAC', significado: 'Macrodoncia' }],
  },
  18: {
    hallazgo: 'Microdoncia',
    siglas: [{ sigla: 'MIC', significado: 'Microdoncia' }],
  },
  19: {
    hallazgo: 'Movilidad Patológica',
    nota: 'Colocar M + número de grado.',
    siglas: [
      { sigla: 'M1', significado: 'Movilidad grado 1' },
      { sigla: 'M2', significado: 'Movilidad grado 2' },
      { sigla: 'M3', significado: 'Movilidad grado 3' },
    ],
  },
  20: {
    hallazgo: 'Pieza Dentaria Ausente',
    siglas: [
      { sigla: 'DNE', significado: 'No Erupcionado' },
      { sigla: 'DEX', significado: 'Extracción por Caries' },
      { sigla: 'DAO', significado: 'Ausente por Otra Causa' },
    ],
  },
  22: {
    hallazgo: 'Pieza Ectópica',
    siglas: [{ sigla: 'E', significado: 'Ectópica' }],
  },
  23: {
    hallazgo: 'Pieza en Erupción',
    nota: 'Flecha en zigzag azul dirigida al plano oclusal.',
    siglas: [],
  },
  24: {
    hallazgo: 'Pieza Extruida',
    nota: 'Flecha recta vertical azul hacia externo.',
    siglas: [],
  },
  25: {
    hallazgo: 'Pieza Intruida',
    nota: 'Flecha recta vertical azul hacia incisal/oclusal.',
    siglas: [],
  },
  27: {
    hallazgo: 'Pulpotomía',
    nota: 'Azul: buen estado. Rojo: mal estado.',
    siglas: [{ sigla: 'PP', significado: 'Pulpotomía' }],
  },
  28: {
    hallazgo: 'Pulpectomía',
    siglas: [{ sigla: 'PC', significado: 'Pulpectomía' }],
  },
  29: {
    hallazgo: 'Posición Anormal Dentaria',
    nota: 'Siglas en azul.',
    siglas: [
      { sigla: 'M', significado: 'Mesializado' },
      { sigla: 'D', significado: 'Distalizado' },
      { sigla: 'V', significado: 'Vestibularizado' },
      { sigla: 'P', significado: 'Palatinizado' },
      { sigla: 'L', significado: 'Lingualizado' },
    ],
  },
  33: {
    hallazgo: 'Remanente Radicular',
    siglas: [{ sigla: 'RR', significado: 'Remanente Radicular' }],
  },
  34: {
    hallazgo: 'Restauración Definitiva',
    nota: 'Azul: buen estado. Rojo: mal estado.',
    siglas: [
      { sigla: 'AM', significado: 'Amalgama' },
      { sigla: 'R', significado: 'Resina' },
      { sigla: 'IV', significado: 'Ionómero' },
      { sigla: 'IM', significado: 'Incrustación Metálica' },
      { sigla: 'IE', significado: 'Incrustación Estética' },
      { sigla: 'C', significado: 'Carilla' },
    ],
  },
  36: {
    hallazgo: 'Sellantes',
    siglas: [{ sigla: 'S', significado: 'Sellantes' }],
  },
  37: {
    hallazgo: 'Superficie Desgastada',
    nota: 'Sigla en rojo.',
    siglas: [{ sigla: 'DES', significado: 'Superficie Desgastada' }],
  },
  38: {
    hallazgo: 'Tratamiento de Conducto',
    nota: 'Azul: buen estado. Rojo: mal estado.',
    siglas: [
      { sigla: 'TC', significado: 'Tratamiento de Conductos' },
      { sigla: 'PC', significado: 'Pulpectomía' },
    ],
  },
};

const FormDentalClinicalFindings = () => {
  const { config, formSelection, formActions } = useOdontogramContext();

  const opciones = config.findingOptions;
  const selectedOption = formSelection.selectedFindingId;
  const selectedColor = formSelection.selectedColor;
  const selectedSuboption = formSelection.selectedSuboption;
  const selectedItem = opciones.find((op) => op.id === selectedOption) ?? null;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 30);
  }, [open]);

  // Close docs modal when finding selection changes
  useEffect(() => {
    setShowInfo(false);
  }, [selectedOption]);

  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return opciones;
    return opciones.filter((op) => norm(op.nombre).includes(q) || String(op.id).includes(q));
  }, [opciones, query]);

  const handleSelectFinding = useCallback(
    (id: number) => {
      formActions.selectFinding(selectedOption === id ? null : id);
      setOpen(false);
      setQuery('');
    },
    [formActions, selectedOption],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      formActions.selectFinding(null);
      setQuery('');
      setOpen(false);
    },
    [formActions],
  );

  const handleSelectColor = useCallback((c: FindingColor) => formActions.selectColor(c), [formActions]);

  const handleSelectSuboption = useCallback(
    (sub: FindingSuboption) => formActions.selectSuboption(selectedSuboption?.id === sub.id ? null : sub),
    [formActions, selectedSuboption],
  );

  return (
    <div className="odon-form">
      <div className="odon-form-body">
        {/* Hallazgo */}
        <div className="odon-form-section odon-form-section--finding">
          <span className="odon-form-label">
            Hallazgo
            {selectedOption && <span className="odon-check">✓</span>}
          </span>
          <div className="odon-dropdown-wrap" ref={wrapperRef}>
            <button
              type="button"
              className={[
                'odon-trigger',
                open ? 'odon-trigger--open' : '',
                selectedItem ? 'odon-trigger--filled' : '',
              ].join(' ')}
              onClick={() => setOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={open}
            >
              {selectedItem ? (
                <>
                  <span className="odon-trigger-text">{selectedItem.nombre}</span>
                  <span className="odon-trigger-clear" onClick={handleClear} role="button" aria-label="Limpiar">
                    ×
                  </span>
                </>
              ) : (
                <span className="odon-trigger-placeholder">Seleccionar hallazgo…</span>
              )}
              <span className="odon-trigger-chevron">{open ? '▲' : '▼'}</span>
            </button>

            {open && (
              <div className="odon-popover" role="listbox">
                <div className="odon-popover-search-wrap">
                  <input
                    ref={searchRef}
                    className="odon-popover-search"
                    type="text"
                    placeholder="Buscar hallazgo…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
                  />
                  {query && (
                    <button className="odon-popover-clear-btn" type="button" onClick={() => setQuery('')}>
                      ×
                    </button>
                  )}
                </div>
                <div className="odon-popover-grid">
                  {filtered.map((op) => (
                    <button
                      key={op.id}
                      type="button"
                      role="option"
                      aria-selected={op.id === selectedOption}
                      className={['odon-pill', op.id === selectedOption ? 'odon-pill--selected' : ''].join(' ')}
                      onClick={() => handleSelectFinding(op.id)}
                      title={op.nombre}
                    >
                      <span className="odon-pill-name">{op.nombre}</span>
                    </button>
                  ))}
                  {filtered.length === 0 && <p className="odon-pill-empty">Sin coincidencias</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tipo */}
        {selectedItem && (selectedItem.subopciones?.length ?? 0) > 0 && (
          <div className="odon-form-section">
            <span className="odon-form-label">
              Tipo
              {selectedSuboption && <span className="odon-check">✓</span>}
            </span>
            <div className="odon-subchoice-row">
              {selectedItem.subopciones!.map((sub: FindingSuboption) => (
                <button
                  key={sub.id}
                  type="button"
                  className={['odon-subchoice', selectedSuboption?.id === sub.id ? 'odon-subchoice--active' : ''].join(
                    ' ',
                  )}
                  onClick={() => handleSelectSuboption(sub)}
                  title={sub.descripcion}
                >
                  {sub.nombre}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Color */}
        {selectedItem && (selectedItem.colores?.length ?? 0) > 0 && (
          <div className="odon-form-section">
            <span className="odon-form-label">
              Color
              {selectedColor && <span className="odon-check">✓</span>}
            </span>
            <div className="odon-color-row">
              {selectedItem.colores.map((color: FindingColor) => (
                <button
                  key={color.id}
                  type="button"
                  className={[
                    'odon-color-swatch',
                    selectedColor?.name === color.name ? 'odon-color-swatch--active' : '',
                  ].join(' ')}
                  style={{ '--swatch-color': COLOR_CSS[color.name] ?? '#888' } as React.CSSProperties}
                  onClick={() => handleSelectColor(color)}
                  title={COLOR_LABEL[color.name] ?? color.name}
                  aria-label={COLOR_LABEL[color.name] ?? color.name}
                >
                  <span className="odon-color-dot" />
                  <span className="odon-color-label">{COLOR_LABEL[color.name] ?? color.name}</span>
                </button>
              ))}
              {/* Documentación button — inline with color swatches */}
              {selectedOption && SIGLAS_MAP[selectedOption] && (
                <button
                  type="button"
                  className="odon-info-btn"
                  onClick={() => setShowInfo(true)}
                  title="Documentación del hallazgo"
                  aria-label="Documentación"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Documentación</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Documentación button when there is no color section */}
        {selectedItem && (selectedItem.colores?.length ?? 0) === 0 && selectedOption && SIGLAS_MAP[selectedOption] && (
          <div className="odon-form-section odon-form-section--info">
            <span className="odon-form-label">&nbsp;</span>
            <button
              type="button"
              className="odon-info-btn"
              onClick={() => setShowInfo(true)}
              title="Documentación del hallazgo"
              aria-label="Documentación"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Documentación</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Documentación modal — contextual to selected finding ── */}
      {showInfo &&
        selectedOption &&
        SIGLAS_MAP[selectedOption] &&
        (() => {
          const group = SIGLAS_MAP[selectedOption];
          return (
            <div className="odon-siglas-overlay" onClick={() => setShowInfo(false)}>
              <div className="odon-siglas-modal" onClick={(e) => e.stopPropagation()}>
                <div className="odon-siglas-header">
                  <h3 className="odon-siglas-title">{group.hallazgo}</h3>
                  <button
                    type="button"
                    className="odon-siglas-close"
                    onClick={() => setShowInfo(false)}
                    aria-label="Cerrar"
                  >
                    ×
                  </button>
                </div>
                <div className="odon-siglas-body">
                  {group.nota && <p className="odon-siglas-nota">{group.nota}</p>}
                  {group.siglas.length > 0 && (
                    <table className="odon-siglas-table">
                      <tbody>
                        {group.siglas.map((s) => (
                          <tr key={s.sigla}>
                            <td className="odon-siglas-code">{s.sigla}</td>
                            <td className="odon-siglas-desc">{s.significado}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default FormDentalClinicalFindings;
