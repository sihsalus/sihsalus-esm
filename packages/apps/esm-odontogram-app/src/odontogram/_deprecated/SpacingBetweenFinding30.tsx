import React from "react";
import useDentalFormStore from "../../store/dentalFormData";
import useSpaceBetweenLegendsDataStore from "../../store/adultSpaceBetweenMainSectionsOnTheCanvasData";
import { 
  Finding30Design4, 
  Finding30Design5, 
  Finding30Design6,
  Finding30Design4Inverted,
  Finding30Design5Inverted,
  Finding30Design6Inverted
} from "../../designs/figuras";
import './SpaceBetweenStyles.css'

const SpaceBetweenFinding30 = ({ id, odontogramType = "adult" }) => {
  // Determinar el store a utilizar

  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state) => state.isComplete);
  const selectedOption = useDentalFormStore((state) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state) => state.selectedColor);
  const predefinedMarkedOptions = [30]; // Opciones que activan la selección

  // Store useDataStore
  const intermediateSpaceOnTheCanvasOfFinding30 = useSpaceBetweenLegendsDataStore((state) => state.intermediateSpaceOnTheCanvasOfFinding30);
  const intermediateSpaceOnTheCanvasOfFinding30Lower = useSpaceBetweenLegendsDataStore((state) => state.intermediateSpaceOnTheCanvasOfFinding30Lower);
  const toggleColorSpaceBetweenFinding30 = useSpaceBetweenLegendsDataStore((state) => state.toggleColorSpaceBetweenFinding30);

  // Determinar si es diente inferior basándose en el ID y tipo de odontograma
  const isLowerTeeth = (id >= 5100000);
    (id >= 5300000) ||
    (id >= 53000000);
  
  // Obtener los datos correctos según la posición
  const findingData = isLowerTeeth ? intermediateSpaceOnTheCanvasOfFinding30Lower : intermediateSpaceOnTheCanvasOfFinding30;
  
  // Obtener el color guardado para este espacio
  const legend = findingData.find((item) => item.id === id);
  const storedColor = legend?.color;
  const intermediateSpaceOnTheCanvasOfFinding1DynamicDesign = legend?.dynamicDesign;

  const handleClick = () => {
    if (!isComplete || !predefinedMarkedOptions.includes(selectedOption)) return;
  
    toggleColorSpaceBetweenFinding30({
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
            isLowerTeeth ? (
              <Finding30Design4Inverted strokeColor={storedColor.name} />
            ) : (
              <Finding30Design4 strokeColor={storedColor.name} />
            )
          )}
          {intermediateSpaceOnTheCanvasOfFinding1DynamicDesign === 3 && (
            isLowerTeeth ? (
              <Finding30Design5Inverted strokeColor={storedColor.name} />
            ) : (
              <Finding30Design5 strokeColor={storedColor.name} />
            )
          )}
          {intermediateSpaceOnTheCanvasOfFinding1DynamicDesign === 2 && (
            isLowerTeeth ? (
              <Finding30Design6Inverted strokeColor={storedColor.name} />
            ) : (
              <Finding30Design6 strokeColor={storedColor.name} />
            )
          )}
        </>
      )}
    </svg>
  );
};

export default SpaceBetweenFinding30;