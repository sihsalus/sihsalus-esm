/**
 * Re-export de tipos desde el archivo centralizado
 * @deprecated Importar desde './index' en su lugar
 */
export type {
  Color,
  Design,
  Suboption,
  Tooth as ToothData,
  Finding,
  SpaceData,
  ToothPosition,
  ToothType,
  Zone,
  ToothDisplayProperties,
  Option
} from './index';

/**
 * Estructura de datos de espacios entre hallazgos
 * @deprecated Este tipo será refactorizado en una próxima versión
 */
export interface SpaceBetweenLegendsData {
  spaceBetweenLegends: SpaceData[];
  intermediateSpaceOnTheCanvasOfFinding1: SpaceData[];
  intermediateSpaceOnTheCanvasOfFinding2: SpaceData[];
  intermediateSpaceOnTheCanvasOfFinding1Lower: SpaceData[];
  intermediateSpaceOnTheCanvasOfFinding2Lower: SpaceData[];
  intermediateSpaceOnTheCanvasOfFinding6: SpaceData[];
  intermediateSpaceOnTheCanvasOfFinding7: SpaceData[];
  intermediateSpaceOnTheCanvasOfFinding13: SpaceData[];
  intermediateSpaceOnTheCanvasOfFinding24: SpaceData[];
  intermediateSpaceOnTheCanvasOfFinding25: SpaceData[];
  intermediateSpaceOnTheCanvasOfFinding26: SpaceData[];
  intermediateSpaceOnTheCanvasOfFinding30: SpaceData[];
  intermediateSpaceOnTheCanvasOfFinding31: SpaceData[];
  intermediateSpaceOnTheCanvasOfFinding32: SpaceData[];
  intermediateSpaceOnTheCanvasOfFinding39: SpaceData[];
}

// Importar SpaceData para la definición anterior
import type { SpaceData } from './index'; 