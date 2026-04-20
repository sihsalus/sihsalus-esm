/**
 * Espacio entre las leyendas/labels de dientes.
 * Maneja los hallazgos 11 (Fusión) y 12 (Geminación) que se renderizan
 * en el espacio entre labels de dientes adyacentes.
 */

import React from 'react';
import { useOdontogramContext } from '../../providers/OdontogramProvider';
import { EllipseDesignCenter, EllipseDesignLeftCenter, EllipseDesignRightCenter } from '../../designs/figuras';
import './SpaceBetweenStyles.css';

interface SpaceBetweenLegendsProps {
  leftToothId: number;
  rightToothId: number;
}

const SpaceBetweenLegends: React.FC<SpaceBetweenLegendsProps> = ({ leftToothId, rightToothId }) => {
  const { data, formSelection, legendActions, readOnly } = useOdontogramContext();

  const { selectedFindingId, selectedColor, isComplete } = formSelection;

  // Hallazgos que activan la selección en este espacio
  const LEGEND_FINDING_IDS = [11, 12];
  const isSelected = LEGEND_FINDING_IDS.includes(selectedFindingId!);
  // Finding 12 desactiva la interacción en este espacio
  const isDisabled = selectedFindingId === 12;

  // Obtener datos del legendSpace para este par
  const legendSpace = data.legendSpaces.find(
    (ls) => ls.leftToothId === leftToothId && ls.rightToothId === rightToothId,
  );

  // Finding 11 - Fusión (con diseños de adyacencia)
  const finding11 = legendSpace?.findings.find((f) => f.findingId === 11);

  const handleClick = () => {
    if (readOnly || isDisabled || !isComplete || !isSelected || !selectedColor) return;

    legendActions.toggleLegendFinding({
      leftToothId,
      rightToothId,
      findingId: selectedFindingId!,
      color: selectedColor,
    });
  };

  const renderDesign = () => {
    if (!finding11?.color || !finding11?.designNumber) return null;

    const color = finding11.color.name;
    switch (finding11.designNumber) {
      case 1:
        return <EllipseDesignLeftCenter strokeColor={color} />;
      case 2:
        return <EllipseDesignRightCenter strokeColor={color} />;
      case 3:
        return <EllipseDesignCenter strokeColor={color} />;
      default:
        return null;
    }
  };

  return (
    <svg
      width="20"
      height="30"
      onClick={handleClick}
      style={{ cursor: readOnly || isDisabled ? 'default' : 'pointer' }}
      className={isSelected && !isDisabled && !readOnly ? 'interactive-svg' : ''}
    >
      <rect width="20" height="30" fill={isDisabled || readOnly ? 'white' : isSelected ? 'lightgray' : 'white'} />
      {renderDesign()}
    </svg>
  );
};

export default SpaceBetweenLegends;
