import React from "react";
import useDentalFormStore from "../../store/dentalFormData";
import useSpaceBetweenLegendsDataStore from "../../store/adultSpaceBetweenMainSectionsOnTheCanvasData";
import { getDesignComponent } from "../../config/designMapping";
import './SpaceBetweenStyles.css';

interface SpaceBetweenFinding25Props {
  id: number;
  odontogramType?: string;
}

const SpaceBetweenFinding25: React.FC<SpaceBetweenFinding25Props> = ({ id, odontogramType = "adult" }) => {
  // Determinar el store a utilizar

  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state: any) => state.isComplete);
  const selectedOption = useDentalFormStore((state: any) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state: any) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state: any) => state.selectedColor);
  const predefinedMarkedOptions = [25]; // Opciones que activan la selección

  // Store useDataStore
  const intermediateSpaceOnTheCanvasOfFinding25 = useSpaceBetweenLegendsDataStore((state: any) => state.intermediateSpaceOnTheCanvasOfFinding25);
  const intermediateSpaceOnTheCanvasOfFinding25Lower = useSpaceBetweenLegendsDataStore((state: any) => state.intermediateSpaceOnTheCanvasOfFinding25Lower);
  const toggleColorSpaceBetweenFinding25 = useSpaceBetweenLegendsDataStore((state: any) => state.toggleColorSpaceBetweenFinding25);

  // Determinar si es diente inferior basándose en el ID y tipo de odontograma
  const isLowerTeeth = (id >= 5100000);
    (id >= 5250000) ||
    (id >= 52500000);
  
  
  // Obtener los datos correctos según la posición
  const findingData = isLowerTeeth ? intermediateSpaceOnTheCanvasOfFinding25Lower : intermediateSpaceOnTheCanvasOfFinding25;
  
  // Obtener el color guardado para este espacio
  const legend = findingData.find((item: any) => item.id === id);
  const storedColor = legend?.color;
  const intermediateSpaceOnTheCanvasOfFinding25DynamicDesign = legend?.dynamicDesign;


  const handleClick = () => {
    if (!isComplete || !predefinedMarkedOptions.includes(selectedOption)) return;
  
    toggleColorSpaceBetweenFinding25({
      id,
      newColor: selectedColor,
      optionId: selectedOption,
      subOptionId: selectedSuboption?.id
    });
  };

  // Determinar el diseño basado en la posición
  const designNumber = isLowerTeeth ? 2 : 1; // 1 para superiores (flecha arriba), 2 para inferiores (flecha abajo)
  const DesignComponent = getDesignComponent(25, designNumber);


  if (!DesignComponent) {
    return null;
  }

  return (
    <svg
      width="20"
      height="20"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
      className="interactive-svg"
    >
      {/* Fondo con sombreado si selectedOption está en predefinedMarkedOptions */}
      <rect
        width="20"
        height="20"
        fill={predefinedMarkedOptions.includes(selectedOption) ? "lightgray" : "white"}
      />

      {/* Si tiene un color guardado, dibuja el diseño correspondiente */}
      {storedColor && intermediateSpaceOnTheCanvasOfFinding25DynamicDesign && (
        <>
          {intermediateSpaceOnTheCanvasOfFinding25DynamicDesign === 1 && (
            <DesignComponent strokeColor={storedColor.name} />
          )}
          {intermediateSpaceOnTheCanvasOfFinding25DynamicDesign === 2 && (
            <DesignComponent strokeColor={storedColor.name} />
          )}
        </>
      )}
    </svg>
  );
};

export default SpaceBetweenFinding25;