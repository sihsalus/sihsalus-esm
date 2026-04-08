import { useState } from "react";
import Tooth from "./Tooth";
import ToothDesigns from "./ToothDesigns";
import DesignSelector from "./DesignSelector";
import {
  Finding3Design1,
  Finding4Design1,
  Finding8Design1,
  Finding8Design2,
  Finding8Design3,
  Finding20Design1,
  Finding23Design1,
  Finding38Design1,
  Finding7Design1,
  Finding28Design1,
  Finding37Design1,
  Finding37Design2,
  Finding37Design3,
  Finding37Design4,
  Finding37Design5,
  Finding36Design1,
  Finding36Design2,
  Finding10Design1,
  Finding10Design2,
  Finding10Design3,
  Finding10Design4,
  Finding10Design5,
  Finding10Design6,
  Finding10Design7,
  Finding10Design8,
  Finding5Design1,
  Finding5Design2,
  Finding5Design3,
  Finding5Design4,
  Finding5Design5,
  Finding5Design6,
  Finding5Design7,
  Finding5Design8,
  Finding5Design9,
  Finding5Design10,
  Finding5Design11,
  Finding5Design12,
  Finding5Design13,
  Finding5Design14,
  Finding27Design9,
  Finding35Design1,
  Finding35Design2,
  Finding35Design3,
  Finding35Design4,
  Finding35Design5,
  Finding35Design6,
  Finding35Design7,
  Finding35Design8,
  Finding35Design9,
  Finding35Design10,
  Finding35Design11,
  Finding35Design12,
  Finding35Design13,
  Finding35Design14,
} from "../designs/figuras";
import { useOdontogramContext } from "../providers/OdontogramProvider";
import { isMultiDesignFinding } from "../logic/findingDesignLogic";

// Mapeo de optionId y dynamicDesign a componentes visuales
const designComponentMap = {
  '3': {
    '1': Finding3Design1,
  },
  '4': {
    '1': Finding4Design1,
  },
  '8': {
    '1': Finding8Design1,
    '2': Finding8Design2,
    '3': Finding8Design3,
  },
  '20': {
    '1': Finding20Design1
  },
  '23': {
    '1': Finding23Design1
  },
  '38': {
    '1': Finding38Design1
  },
  '7': {
    '1': Finding7Design1
  },
  '28': {
    '1': Finding28Design1
  },
  '37': {
    '1': Finding37Design1,
    '2': Finding37Design2,
    '3': Finding37Design3,
    '4': Finding37Design4,
    '5': Finding37Design5
  },
  '36': {
    '1': Finding36Design1,
    '2': Finding36Design2,
  },
  '10': {
    '1': Finding10Design1,
    '2': Finding10Design2,
    '3': Finding10Design3,
    '4': Finding10Design4,
    '5': Finding10Design5,
    '6': Finding10Design6,
    '7': Finding10Design7,
    '8': Finding10Design8,
  },
  '5': {
    '1': Finding5Design1,
    '2': Finding5Design2,
    '3': Finding5Design3,
    '4': Finding5Design4,
    '5': Finding5Design5,
    '6': Finding5Design6,
    '7': Finding5Design7,
    '8': Finding5Design8,
    '9': Finding5Design9,
    '10': Finding5Design10,
    '11': Finding5Design11,
    '12': Finding5Design12,
    '13': Finding5Design13,
    '14': Finding5Design14,
  },
  '16': {
    '1': Finding5Design1,
    '2': Finding5Design2,
    '3': Finding5Design3,
    '4': Finding5Design4,
    '5': Finding5Design5,
    '6': Finding5Design6,
    '7': Finding5Design7,
    '8': Finding5Design8,
    '9': Finding5Design9,
    '10': Finding5Design10,
    '11': Finding5Design11,
    '12': Finding5Design12,
    '13': Finding5Design13,
    '14': Finding5Design14,
  },
  '27': {
    '1': Finding5Design1,
    '2': Finding5Design2,
    '3': Finding5Design3,
    '4': Finding5Design4,
    '5': Finding5Design5,
    '6': Finding5Design6,
    '7': Finding5Design7,
    '8': Finding5Design8,
    '9': Finding27Design9,
  },
  '34': {
    '1': Finding5Design1,
    '2': Finding5Design2,
    '3': Finding5Design3,
    '4': Finding5Design4,
    '5': Finding5Design5,
    '6': Finding5Design6,
    '7': Finding5Design7,
    '8': Finding5Design8,
    '9': Finding5Design9,
    '10': Finding5Design10,
    '11': Finding5Design11,
    '12': Finding5Design12,
    '13': Finding5Design13,
    '14': Finding5Design14,
  },
  '35': {
    '1': Finding35Design1,
    '2': Finding35Design2,
    '3': Finding35Design3,
    '4': Finding35Design4,
    '5': Finding35Design5,
    '6': Finding35Design6,
    '7': Finding35Design7,
    '8': Finding35Design8,
    '9': Finding35Design9,
    '10': Finding35Design10,
    '11': Finding35Design11,
    '12': Finding35Design12,
    '13': Finding35Design13,
    '14': Finding35Design14,
  },
};

interface ToothVisualizationProps {
  idTooth: number;
  zones?: number;
  design?: string;
  position?: "upper" | "lower";
}

const ToothVisualization = ({ idTooth, zones = 8, design = "default", position = "upper" }: ToothVisualizationProps) => {
  const [showDesignSelector, setShowDesignSelector] = useState(false);
  
  const { data, config, formSelection, toothActions, readOnly, showToast } = useOdontogramContext();
  const { selectedFindingId, selectedSuboption, selectedColor, isComplete } = formSelection;

  // Opciones predefinidas que activan el marcado
  const predefinedMarkedOptions = [3, 4, 8, 20, 23, 38, 7, 28, 37, 36, 10, 5, 16, 27, 34, 35, 9, 14, 15, 17, 18, 19, 22, 29, 33];

  // Obtener el diente
  const tooth = data.teeth.find((item) => item.toothId === idTooth);
  
  // Obtener las zonas del diente: prop zones ya viene de config, use it as-is
  const toothZones = zones || 4;
  
  // Obtener información del hallazgo seleccionado
  const selectedItem = config.findingOptions.find((op) => op.id === selectedFindingId);

  // Función para gestionar los hallazgos
  const handleFindingToggle = () => {
    if (readOnly) return;
    if (!isComplete || !selectedFindingId || !predefinedMarkedOptions.includes(selectedFindingId)) {
      if (selectedFindingId && !isComplete) {
        const opt = config.findingOptions.find(o => o.id === selectedFindingId);
        const needsColor = (opt?.colores?.length ?? 0) > 0 && !selectedColor;
        const needsSub = (opt?.subopciones?.length ?? 0) > 0 && !selectedSuboption;
        const parts: string[] = [];
        if (needsSub) parts.push("tipo");
        if (needsColor) parts.push("color");
        if (parts.length) showToast(`Seleccione ${parts.join(" y ")} para "${opt?.nombre}"`);
      } else if (!selectedFindingId) {
        showToast("Seleccione un hallazgo clínico en el formulario");
      }
      return;
    }

    // Filtrar diseños según las zonas del diente
    const filteredDesigns = selectedItem?.designs?.filter((design: any) => {
      if (!design.zones) return true;
      if (Array.isArray(design.zones)) return design.zones.includes(toothZones);
      return design.zones === toothZones;
    }) || [];

    // Si el hallazgo tiene diseños disponibles para este tipo de diente, mostrar selector
    if (filteredDesigns.length > 0) {
      setShowDesignSelector(true);
      return;
    }

    // Si no tiene diseños compatibles, proceder con la lógica normal (sin diseño)
    // For all non-design findings (including row findings like 7),
    // always use registerToothFinding which handles row/toggle logic properly.
    toothActions.registerToothFinding({
      toothId: idTooth,
      findingId: selectedFindingId,
      subOptionId: selectedSuboption?.id,
      color: selectedColor!,
    });
  };

  // Función para manejar la selección de diseño
  // registerToothFinding handles replace vs toggle-off logic:
  // - same design → toggle off
  // - different design → replace
  // - no existing → add
  const handleDesignSelect = (design: any) => {
    if (readOnly || !selectedFindingId) return;

    toothActions.registerToothFinding({
      toothId: idTooth,
      findingId: selectedFindingId,
      subOptionId: selectedSuboption?.id,
      color: selectedColor!,
      designNumber: design.number,
    });
  };

  // Renderizar todos los hallazgos
  const renderAllFindings = () => {
    if (!tooth?.findings || tooth.findings.length === 0) {
      return null;
    }


    return tooth.findings.map((finding, index: number) => {
      const findingKey = String(finding.findingId);
      const designKey = String(finding.designNumber);
      const designComponents = (designComponentMap as Record<string, Record<string, any>>)[findingKey];
      if (!designComponents) {
        return null;
      }

      const DesignComponent = designComponents[designKey];
      if (!DesignComponent) {
        return null;
      }

      return (
        <g key={`finding-${finding.id || index}`}>
          <DesignComponent strokeColor={finding.color?.name || 'black'} />
        </g>
      );
    });
  };

  // Definir altura SVG para la transformación
  const SVG_HEIGHT = 120;
  const transform = position === "lower" ? `scale(1,-1) translate(0,-${SVG_HEIGHT})` : undefined;

  // Obtener hallazgos existentes para el hallazgo actual
  const existingFindings = tooth?.findings.filter((f) => f.findingId === selectedFindingId) || [];

  // Filtrar diseños según las zonas del diente
  const filteredDesigns = selectedItem?.designs?.filter((design: any) => {
    if (!design.zones) return true;
    if (Array.isArray(design.zones)) return design.zones.includes(toothZones);
    return design.zones === toothZones;
  }) || [];

  // Determine if multi-design (modal stays open)
  const isMultiDesign = selectedFindingId ? isMultiDesignFinding(selectedFindingId) : false;

  return (
    <>
      <svg width="60" height="120" onClick={handleFindingToggle} cursor={"pointer"}>
        <g transform={transform}>
          <ToothDesigns design={design as "default" | "design2" | "design3" | "design4"} />
          <Tooth zones={toothZones} />
        {/* Renderizar todos los hallazgos */}
        {renderAllFindings()}
        {/* Sombreado cuando se selecciona una opción predefinida */}
        {selectedFindingId != null && predefinedMarkedOptions.includes(selectedFindingId) && (
          <rect
            width="60"
            height="120"
            fill="lightgray"
            opacity="0.45"
            pointerEvents="none"
          />
        )}
        </g>
      </svg>
      
      {/* Selector de diseños */}
      <DesignSelector
        isOpen={showDesignSelector}
        onClose={() => setShowDesignSelector(false)}
        designs={filteredDesigns}
        selectedColor={selectedColor}
        findingName={selectedItem?.nombre || ''}
        toothId={idTooth}
        toothZones={toothZones}
        onDesignSelect={handleDesignSelect}
        existingFindings={existingFindings}
        keepOpen={isMultiDesign}
        suboptions={selectedItem?.subopciones}
      />
    </>
  );
};

export default ToothVisualization;