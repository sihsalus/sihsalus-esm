import React from 'react';
import Tooth from './Tooth';
import ToothDesigns from './ToothDesigns';
import DesignSelector from './DesignSelector';
import { useOdontogramContext } from '../providers/OdontogramProvider';
import { isMultiDesignFinding } from '../logic/findingDesignLogic';
import { TOOTH_DESIGN_COMPONENT_MAP } from './constants';
import type { FindingDesign } from '../types/odontogram';

interface ToothVisualizationProps {
  idTooth: number;
  zones?: number;
  design?: string;
  position?: 'upper' | 'lower';
}

const ToothVisualization = ({
  idTooth,
  zones = 8,
  design = 'default',
  position = 'upper',
}: ToothVisualizationProps) => {
  const [showDesignSelector, setShowDesignSelector] = React.useState(false);

  const { data, config, formSelection, toothActions, readOnly, showToast } = useOdontogramContext();
  const { selectedFindingId, selectedSuboption, selectedColor, isComplete } = formSelection;

  // Opciones predefinidas que activan el marcado
  const predefinedMarkedOptions = [
    3, 4, 8, 20, 23, 38, 7, 28, 37, 36, 10, 5, 16, 27, 34, 35, 9, 14, 15, 17, 18, 19, 22, 29, 33,
  ];

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
        const opt = config.findingOptions.find((o) => o.id === selectedFindingId);
        const needsColor = (opt?.colores?.length ?? 0) > 0 && !selectedColor;
        const needsSub = (opt?.subopciones?.length ?? 0) > 0 && !selectedSuboption;
        const parts: string[] = [];
        if (needsSub) parts.push('tipo');
        if (needsColor) parts.push('color');
        if (parts.length) showToast(`Seleccione ${parts.join(' y ')} para "${opt?.nombre}"`);
      } else if (!selectedFindingId) {
        showToast('Seleccione un hallazgo clínico en el formulario');
      }
      return;
    }

    // Filtrar diseños según las zonas del diente
    const filteredDesigns: FindingDesign[] =
      selectedItem?.designs?.filter((design) => {
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
  const handleDesignSelect = (design: FindingDesign) => {
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
      const designComponents = TOOTH_DESIGN_COMPONENT_MAP[findingKey];
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
  const transform = position === 'lower' ? `scale(1,-1) translate(0,-${SVG_HEIGHT})` : undefined;

  // Obtener hallazgos existentes para el hallazgo actual
  const existingFindings = tooth?.findings.filter((f) => f.findingId === selectedFindingId) || [];

  // Filtrar diseños según las zonas del diente
  const filteredDesigns =
    selectedItem?.designs?.filter((design) => {
      if (!design.zones) return true;
      if (Array.isArray(design.zones)) return design.zones.includes(toothZones);
      return design.zones === toothZones;
    }) || [];

  // Determine if multi-design (modal stays open)
  const isMultiDesign = selectedFindingId ? isMultiDesignFinding(selectedFindingId) : false;

  return (
    <>
      <svg width="60" height="120" onClick={handleFindingToggle} cursor={'pointer'}>
        <g transform={transform}>
          <ToothDesigns design={design as 'default' | 'design2' | 'design3' | 'design4'} />
          <Tooth zones={toothZones} />
          {/* Renderizar todos los hallazgos */}
          {renderAllFindings()}
          {/* Sombreado cuando se selecciona una opción predefinida */}
          {selectedFindingId != null && predefinedMarkedOptions.includes(selectedFindingId) && (
            <rect width="60" height="120" fill="lightgray" opacity="0.45" pointerEvents="none" />
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
