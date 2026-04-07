import React from "react";
import useDentalFormStore from "../../store/dentalFormData";
import useSpaceBetweenLegendsDataStore from "../../store/adultSpaceBetweenMainSectionsOnTheCanvasData";
import { Finding1Design4, Finding1Design5, Finding1Design6 } from "../../designs/figuras";
import './SpaceBetweenStyles.css'

const SpaceBetweenFinding1 = ({ id, odontogramType = "adult" }) => {
  // Determinar el store a utilizar
  
  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state) => state.isComplete);
  const selectedOption = useDentalFormStore((state) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state) => state.selectedColor);
  const predefinedMarkedOptions = [1]; // Opciones que activan la selección

  // Store dinámico
  const intermediateSpaceOnTheCanvasOfFinding1 = useSpaceBetweenLegendsDataStore((state) => state.intermediateSpaceOnTheCanvasOfFinding1);
  const intermediateSpaceOnTheCanvasOfFinding1Lower = useSpaceBetweenLegendsDataStore((state) => state.intermediateSpaceOnTheCanvasOfFinding1Lower);
  const toggleColorSpaceBetweenFinding1 = useSpaceBetweenLegendsDataStore((state) => state.toggleColorSpaceBetweenFinding1);

  // Determinar si es diente inferior basándose en el ID
  const isLowerTeeth = (id >= 5100000);
  
  // Obtener los datos correctos según la posición
  const findingData = isLowerTeeth ? intermediateSpaceOnTheCanvasOfFinding1Lower : intermediateSpaceOnTheCanvasOfFinding1;
  
  // Obtener el color guardado para este espacio
  const legend = findingData.find((item) => item.id === id);
  const storedColor = legend?.color;
  const intermediateSpaceOnTheCanvasOfFinding1DynamicDesign = legend?.dynamicDesign;

  const handleClick = () => {
    if (!isComplete || !predefinedMarkedOptions.includes(selectedOption)) return;
  
    toggleColorSpaceBetweenFinding1({
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
            <Finding1Design5 strokeColor={storedColor.name} />
          )}
          {intermediateSpaceOnTheCanvasOfFinding1DynamicDesign === 2 && (
            <Finding1Design4 strokeColor={storedColor.name} />
          )}
          {intermediateSpaceOnTheCanvasOfFinding1DynamicDesign === 3 && (
            <Finding1Design6 strokeColor={storedColor.name} />
          )}
        </>
      )}
    </svg>
  );
};

export default SpaceBetweenFinding1;