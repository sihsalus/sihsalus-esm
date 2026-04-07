import React from "react";
import useDentalFormStore from "../../store/dentalFormData";
import useSpaceBetweenLegendsDataStore from "../../store/adultSpaceBetweenMainSectionsOnTheCanvasData";
import { Finding24Design1, Finding24Design2 } from "../../designs/figuras";
import './SpaceBetweenStyles.css'

interface SpaceBetweenFinding24Props {
  id: number;
  odontogramType?: string;
}

const SpaceBetweenFinding24: React.FC<SpaceBetweenFinding24Props> = ({ id, odontogramType = "adult" }) => {
  // Determinar el store a utilizar

  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state: any) => state.isComplete);
  const selectedOption = useDentalFormStore((state: any) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state: any) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state: any) => state.selectedColor);
  const predefinedMarkedOptions = [24]; // Opciones que activan la selección

  // Store useDataStore
  const intermediateSpaceOnTheCanvasOfFinding24 = useSpaceBetweenLegendsDataStore((state: any) => state.intermediateSpaceOnTheCanvasOfFinding24);
  const intermediateSpaceOnTheCanvasOfFinding24Lower = useSpaceBetweenLegendsDataStore((state: any) => state.intermediateSpaceOnTheCanvasOfFinding24Lower);
  const toggleColorSpaceBetweenFinding24 = useSpaceBetweenLegendsDataStore((state: any) => state.toggleColorSpaceBetweenFinding24);

  // Determinar si es diente inferior basándose en el ID y tipo de odontograma
  const isLowerTeeth = (id >= 5100000) ||
    (id >= 5240000) ||
    (id >= 52400000);
  
  
  // Obtener los datos correctos según la posición
  const findingData = isLowerTeeth ? intermediateSpaceOnTheCanvasOfFinding24Lower : intermediateSpaceOnTheCanvasOfFinding24;
  
  
  // Obtener el color guardado para este espacio
  const legend = findingData.find((item: any) => item.id === id);
  const storedColor = legend?.color;
  const intermediateSpaceOnTheCanvasOfFinding24DynamicDesign = legend?.dynamicDesign;
  

  const handleClick = () => {
    if (!isComplete || !predefinedMarkedOptions.includes(selectedOption)) return;
  
    toggleColorSpaceBetweenFinding24({
      id,
      newColor: selectedColor,
      optionId: selectedOption,
      subOptionId: selectedSuboption?.id
    });
  };

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
      {storedColor && intermediateSpaceOnTheCanvasOfFinding24DynamicDesign && (
        <>
          {intermediateSpaceOnTheCanvasOfFinding24DynamicDesign === 1 && (
            <Finding24Design1 strokeColor={storedColor.name} />
          )}
          {intermediateSpaceOnTheCanvasOfFinding24DynamicDesign === 2 && (
            <Finding24Design2 strokeColor={storedColor.name} />
          )}
        </>
      )}
    </svg>
  );
};

export default SpaceBetweenFinding24;