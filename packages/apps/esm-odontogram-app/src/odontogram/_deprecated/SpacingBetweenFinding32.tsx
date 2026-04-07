import React from "react";
import useDentalFormStore from "../../store/dentalFormData";
import useSpaceBetweenLegendsDataStore from "../../store/adultSpaceBetweenMainSectionsOnTheCanvasData";
import { TwoHorizontalLines20x20 } from "../../designs/figuras";
import './SpaceBetweenStyles.css'
const SpaceBetweenFinding32 = ({ id, odontogramType = "adult" }) => {
  // Determinar el store a utilizar

  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state) => state.isComplete);
  const selectedOption = useDentalFormStore((state) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state) => state.selectedColor);
  const predefinedMarkedOptions = [32]; // Opciones que activan la selección

  // Store useDataStore CAMBIA
  const intermediateSpaceOnTheCanvasOfFinding32 = useSpaceBetweenLegendsDataStore((state) => state.intermediateSpaceOnTheCanvasOfFinding32);
  const intermediateSpaceOnTheCanvasOfFinding32Lower = useSpaceBetweenLegendsDataStore((state) => state.intermediateSpaceOnTheCanvasOfFinding32Lower);
  const toggleColorSpaceBetweenFinding32 = useSpaceBetweenLegendsDataStore((state) => state.toggleColorSpaceBetweenFinding32);

  // Obtener el color guardado para este espacio
  
  // Determinar si es diente inferior basándose en el ID y tipo de odontograma
  const isLowerTeeth = (id >= 5100000);
    (id >= 5320000) ||
    (id >= 53200000);
  
  // Obtener los datos correctos según la posición
  const findingData = isLowerTeeth ? intermediateSpaceOnTheCanvasOfFinding32Lower : intermediateSpaceOnTheCanvasOfFinding32;
  
  // Obtener el color guardado para este espacio
  const legend = findingData.find((item) => item.id === id);
  const storedColor = legend?.color;
  const intermediateSpaceOnTheCanvasOfFinding1DynamicDesign = legend?.dynamicDesign;

  const handleClick = () => {
    if (!isComplete || !predefinedMarkedOptions.includes(selectedOption)) return;
  
    toggleColorSpaceBetweenFinding32({
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
      {storedColor && intermediateSpaceOnTheCanvasOfFinding1DynamicDesign && (
        <>
          {intermediateSpaceOnTheCanvasOfFinding1DynamicDesign === 1 && (
            <TwoHorizontalLines20x20 strokeColor={storedColor.name} />
          )}
          {intermediateSpaceOnTheCanvasOfFinding1DynamicDesign === 2 && (
            <TwoHorizontalLines20x20 strokeColor={storedColor.name} />
          )}
          {intermediateSpaceOnTheCanvasOfFinding1DynamicDesign === 3 && (
            <TwoHorizontalLines20x20 strokeColor={storedColor.name} />
          )}
        </>
      )}
    </svg>
  );
};

export default SpaceBetweenFinding32;