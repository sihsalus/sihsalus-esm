/**
 * Tipos centralizados para el sistema de Odontograma
 * Este archivo unifica todos los tipos usados en el sistema
 */

// ============================================================================
// TIPOS BÁSICOS
// ============================================================================

export interface Color {
  id: number;
  name: string;
}

export interface Design {
  number: number;
  nombre: string;
  componente: string;
  zones?: number | number[];
}

export interface Suboption {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Option {
  id: number;
  nombre: string;
  identificador?: string;
  colores?: Color[];
  subopciones?: Suboption[];
  designs?: Design[];
}

// ============================================================================
// TIPOS DE HALLAZGOS (FINDINGS)
// ============================================================================

/**
 * Hallazgo clínico aplicado a un diente o espacio
 * Representa una condición dental específica
 */
export interface Finding {
  uniqueId: number;
  optionId: number;
  subOptionId?: number;
  color?: Color;
  dynamicDesign?: number | null;
}

// ============================================================================
// TIPOS DE DIENTES
// ============================================================================

export type ToothPosition = "upper" | "lower";
export type ToothType = "molar" | "premolar" | "canino" | "incisivo" | "incisor";

export interface Zone {
  id: string;
  findings: Finding[];
}

export interface ToothDisplayProperties {
  design: string;
  spaceBetweenLegendsLeftId?: number | null;
  spaceBetweenLegendsRightId?: number | null;
}

export interface Tooth {
  id: number;
  uuid: string;
  position: ToothPosition;
  type: ToothType;
  zones: Zone[];
  findings: Finding[];
  displayProperties: ToothDisplayProperties;
}

// ============================================================================
// TIPOS DE ESPACIOS
// ============================================================================

export interface SpaceData {
  id: number;
  uuid: string;
  leftToothId: number;
  leftToothUuid: string;
  rightToothId: number;
  rightToothUuid: string;
  dynamicDesign: string | null;
  color: string | null;
  findings: Finding[];
}

// ============================================================================
// TIPOS DE STORES
// ============================================================================

/**
 * Estado del formulario de selección de hallazgos
 */
export interface DentalFormState {
  opciones: Option[];
  selectedOption: number | null;
  selectedColor: Color | null;
  selectedSuboption: Suboption | null;
  isComplete: boolean;
  selectedDesign: Design | null;
  setSelectedOption: (optionId: number | null) => void;
  setSelectedColor: (color: Color | null) => void;
  setSelectedSuboption: (suboption: Suboption | null) => void;
  setSelectedDesign: (design: Design | null) => void;
  resetSelection: () => void;
}

/**
 * Parámetros para registrar un hallazgo
 */
export interface RegisterFindingParams {
  toothId: number;
  zoneId?: string;
  optionId: number;
  subOptionId?: number;
  color?: Color;
  design?: Design | null;
}

/**
 * Parámetros para remover un hallazgo
 */
export interface RemoveFindingParams {
  toothId: number;
  optionId: number;
  subOptionId?: number;
  dynamicDesign?: number | null;
}

/**
 * Estado del store de datos dentales
 */
export interface DentalDataState {
  teeth: Tooth[];
  registerFinding: (params: RegisterFindingParams) => void;
  removeFinding: (params: RemoveFindingParams) => void;
}

// ============================================================================
// TIPOS DE COMPONENTES
// ============================================================================

export interface SpacingComponentProps {
  id: string | number;
  odontogramType?: "adult" | "child";
}

export type SpacingComponent = React.ComponentType<SpacingComponentProps>;

export interface SpacingDataItem {
  id: string | number;
}

export interface ToothRowConfig {
  optionId: number;
  component: SpacingComponent;
  data: SpacingDataItem[];
  description?: string;
}

export interface MainSectionOnTheCanvasProps {
  idTooth: string;
  optionId: number;
  odontogramType?: "adult" | "child";
}

export interface ToothRowProps {
  optionId: number;
  spacingComponent: SpacingComponent;
  spacingData: SpacingDataItem[];
  spaceBetweenLegends: SpacingDataItem[];
}

export interface ToothDetailsProps {
  idTooth: number;
  initialText?: string;
  legend?: string;
  odontogramType?: "adult" | "child";
}

// ============================================================================
// TIPOS DE PROPS PÚBLICOS (Para exportación NPM)
// ============================================================================

export interface BaseOdontogramProps {
  findings?: Finding[];
  onUpdate?: (findings: Finding[]) => void;
  onSave?: (data: any) => void;
  readOnly?: boolean;
  showForm?: boolean;
  config?: OdontogramConfig;
}

export interface AdultOdontogramProps extends BaseOdontogramProps {
  // Props específicas de adultos
}

export interface ChildOdontogramProps extends BaseOdontogramProps {
  // Props específicas de niños
}

export interface OdontogramConfig {
  // Configuración del odontograma
  dimensions?: {
    toothWidth?: number;
    toothHeight?: number;
    spacingWidth?: number;
    spacingHeight?: number;
  };
  colors?: {
    selected?: string;
    default?: string;
    border?: string;
  };
}

// ============================================================================
// RE-EXPORTS (Compatibilidad con código existente)
// ============================================================================

// Para mantener compatibilidad, re-exportamos con nombres anteriores
export type { Tooth as ToothData };
export type { SpaceData as SpaceBetweenData };
