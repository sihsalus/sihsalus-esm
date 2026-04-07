/**
 * Exports públicos del paquete react-odontogram.
 *
 * Uso básico:
 * ```tsx
 * import {
 *   Odontogram,
 *   adultConfig,
 *   createEmptyOdontogramData,
 *   type OdontogramData
 * } from 'react-odontogram';
 *
 * const [data, setData] = useState(() => createEmptyOdontogramData(adultConfig));
 * <Odontogram config={adultConfig} data={data} onChange={setData} />
 * ```
 */

// --- Componente principal ---
export { default as Odontogram } from "./components/Odontogram";
export type { OdontogramProps } from "./components/Odontogram";

// --- Provider + hook (advanced usage) ---
export { OdontogramProvider, useOdontogramContext } from "./providers/OdontogramProvider";

// --- Responsive wrapper (advanced usage) ---
export { default as ResponsiveOdontogramWrapper } from "./components/ResponsiveOdontogramWrapper";

// --- Configuraciones ---
export { adultConfig } from "./config/adultConfig";

// --- Factory ---
export { createEmptyOdontogramData } from "./types/odontogram";

// --- Servicios de exportación ---
export {
  buildExportPayload,
  getOdontogramStats,
  downloadAsJson,
  copyToClipboard,
} from "./services/odontogramExportService";
export type {
  OdontogramExportMetadata,
  OdontogramExportPayload,
} from "./services/odontogramExportService";

// --- Tipos públicos ---
export type {
  OdontogramData,
  OdontogramConfig,
  ToothData,
  ToothFinding,
  SpaceData,
  SpaceFinding,
  LegendSpaceData,
  FindingColor,
  FindingDesign,
  FindingSuboption,
  FindingOptionConfig,
  FindingRenderCategory,
  ToothConfig,
  ToothPosition,
  ToothType,
} from "./types/odontogram";
