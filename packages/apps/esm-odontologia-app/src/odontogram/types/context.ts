/**
 * Tipos internos del contexto del odontograma.
 *
 * Estos tipos NO son parte de la API pública.
 * Definen el estado UI efímero (selección actual, modales, etc.)
 * y las acciones internas que los sub-componentes pueden invocar.
 */

import type {
  OdontogramData,
  OdontogramConfig,
  FindingColor,
  FindingSuboption,
  FindingDesign,
  FindingOptionConfig,
  ToothPosition,
  ToothConfig,
} from './odontogram';

// =============================================================================
// ESTADO UI EFÍMERO — No se guarda en BBDD
// =============================================================================

/**
 * Estado de la selección actual en el formulario de hallazgos.
 * Es efímero: si el usuario navega y vuelve, se resetea.
 */
export interface FormSelectionState {
  /** ID del hallazgo seleccionado (1-39), null si ninguno */
  selectedFindingId: number | null;
  /** Color seleccionado */
  selectedColor: FindingColor | null;
  /** Subopción seleccionada */
  selectedSuboption: FindingSuboption | null;
  /** Diseño seleccionado (para hallazgos con DesignSelector) */
  selectedDesign: FindingDesign | null;
  /** Si la selección está completa (hallazgo + color + subopción requerida) */
  isComplete: boolean;
}

// =============================================================================
// ACCIONES DEL CONTEXTO
// =============================================================================

/** Acciones para el formulario de selección */
export interface FormActions {
  selectFinding: (findingId: number | null) => void;
  selectColor: (color: FindingColor | null) => void;
  selectSuboption: (suboption: FindingSuboption | null) => void;
  selectDesign: (design: FindingDesign | null) => void;
  resetSelection: () => void;
}

/** Acciones para registrar/remover hallazgos en dientes */
export interface ToothActions {
  registerToothFinding: (params: {
    toothId: number;
    findingId: number;
    color: FindingColor;
    subOptionId?: number;
    designNumber?: number | null;
  }) => void;
  removeToothFinding: (params: {
    toothId: number;
    findingId: number;
    /** Si se quiere remover una instancia específica */
    instanceId?: string;
  }) => void;
  /** Actualiza el texto libre del cuadro de anotaciones del diente */
  updateToothNotes: (toothId: number, notes: string) => void;
}

/** Acciones para hallazgos de spacing entre dientes */
export interface SpacingActions {
  toggleSpacingFinding: (params: {
    findingId: number;
    leftToothId: number;
    rightToothId: number;
    color: FindingColor;
    designNumber?: number | null;
  }) => void;
}

/** Acciones para hallazgos en leyendas */
export interface LegendActions {
  toggleLegendFinding: (params: {
    leftToothId: number;
    rightToothId: number;
    findingId: number;
    color: FindingColor;
  }) => void;
}

// =============================================================================
// CONTEXTO COMPLETO
// =============================================================================

/**
 * Valor completo que el OdontogramProvider expone vía React Context.
 * Todos los sub-componentes acceden a esto vía useOdontogramContext().
 */
export interface OdontogramContextValue {
  // --- Configuración (inmutable para la instancia) ---
  config: OdontogramConfig;
  readOnly: boolean;

  // --- Datos persistentes (controlados por el padre) ---
  data: OdontogramData;

  // --- Estado UI efímero ---
  formSelection: FormSelectionState;

  // --- Acciones ---
  formActions: FormActions;
  toothActions: ToothActions;
  spacingActions: SpacingActions;
  legendActions: LegendActions;

  // --- Helpers de consulta (derivados de config) ---
  getToothConfig: (toothId: number) => ToothConfig | undefined;
  getTeethByPosition: (position: ToothPosition) => ToothConfig[];
  getFindingOption: (findingId: number) => FindingOptionConfig | undefined;

  // --- Toast ---
  showToast: (message: string) => void;
}
