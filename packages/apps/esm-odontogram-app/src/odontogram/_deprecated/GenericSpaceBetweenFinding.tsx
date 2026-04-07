import React from "react";
import useDentalFormStore from "../../store/dentalFormData";
import useSpaceBetweenLegendsDataStore from "../../store/adultSpaceBetweenMainSectionsOnTheCanvasData";
import './SpaceBetweenStyles.css';

interface GenericSpaceBetweenFindingProps {
  id: number;
  findingNumber: number;
  lowerIdThreshold: number;
  storeKey: string;
  storeKeyLower: string;
  functionName: string;
  designs: {
    [key: number]: React.ComponentType<{ strokeColor: string }>;
  };
  odontogramType?: string;
}

const GenericSpaceBetweenFinding: React.FC<GenericSpaceBetweenFindingProps> = ({
  id,
  findingNumber,
  lowerIdThreshold,
  storeKey,
  storeKeyLower,
  functionName,
  designs,
  odontogramType = "adult"
}) => {
  // Determinar el store a utilizar
  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state) => state.isComplete);
  const selectedOption = useDentalFormStore((state) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state) => state.selectedColor);
  const predefinedMarkedOptions = [findingNumber]; // Opciones que activan la selección
  
  // Store dinámico
  const store = useSpaceBetweenLegendsDataStore((state) => state);
  const findingDataUpper = store[storeKey] || [];
  const findingDataLower = store[storeKeyLower] || [];
  const toggleFunction = store[functionName];

  // Determinar si es diente inferior basándose en el ID
  const isLowerTeeth = id >= lowerIdThreshold;
  
  // Obtener los datos correctos según la posición
  const findingData = isLowerTeeth ? findingDataLower : findingDataUpper;
  
  // Obtener el color guardado para este espacio
  const legend = findingData.find((item) => item.id === id);
  const storedColor = legend?.color;
  const dynamicDesign = legend?.dynamicDesign;

  const handleClick = () => {
    if (!isComplete || !predefinedMarkedOptions.includes(selectedOption)) return;
  
    toggleFunction({
      id,
      newColor: selectedColor,
      optionId: selectedOption,
      subOptionId: selectedSuboption?.id
    });
  };

  // Obtener el componente de diseño correspondiente
  const DesignComponent = designs[dynamicDesign];

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
      {storedColor && dynamicDesign && DesignComponent && (
        <DesignComponent strokeColor={storedColor.name} />
      )}
    </svg>
  );
};

export default GenericSpaceBetweenFinding; 