import React from "react";
import useDentalFormStore from "../../store/dentalFormData";
import useSpaceBetweenLegendsDataStore from "../../store/adultSpaceBetweenMainSectionsOnTheCanvasData";
import { EllipseDesignCenter, EllipseDesignLeftCenter, EllipseDesignRightCenter } from "../../designs/figuras";
import './SpaceBetweenStyles.css'

const SpaceBetweenLegends = ({ id, odontogramType = "adult" }) => {
  // Determinar el store a utilizar
  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state) => state.isComplete);
  const selectedOption = useDentalFormStore((state) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state) => state.selectedColor);
  const predefinedMarkedOptions = [11, 12]; // Opciones que activan la selección
  
  // Store useSpaceBetweenLegendsDataStore
  const spaceBetweenLegends = useSpaceBetweenLegendsDataStore((state) => state.spaceBetweenLegends);
  const spaceBetweenLegendsLower = useSpaceBetweenLegendsDataStore((state) => state.spaceBetweenLegendsLower);
  const toggleColorSpaceBetweenLegends = useSpaceBetweenLegendsDataStore((state) => state.toggleColorSpaceBetweenLegends);
  
  // Determinar si es diente inferior basándose en el ID
  const isLowerTeeth = (id >= 2000 && id <= 2014);
  
  // Obtener los datos correctos según la posición
  const legendsData = isLowerTeeth ? spaceBetweenLegendsLower : spaceBetweenLegends;
  
  // Obtener el color guardado para este espacio
  const legend = legendsData.find((item) => item.id === id);
  const storedColor = legend?.color;
  const spaceBetweenLegendsDynamicDesign = legend?.dynamicDesign;
  
  // Determinar si debe aplicarse la clase interactive-svg
  const svgClassName = selectedOption === 12 ? "" : "interactive-svg";
  
  // Verificar si el componente está deshabilitado (cuando selectedOption es 12)
  const isDisabled = selectedOption === 12;
  
  const handleClick = () => {
    // No ejecutar la función si está deshabilitado o no cumple las condiciones
    if (isDisabled || !isComplete || !predefinedMarkedOptions.includes(selectedOption)) return;
    
    toggleColorSpaceBetweenLegends({
      id,
      newColor: selectedColor,
      optionId: selectedOption,
      subOptionId: selectedSuboption?.id
    });
  };
  
  return (
    <svg
      width="20"
      height="30"
      onClick={handleClick}
      style={{ cursor: isDisabled ? "default" : "pointer" }}
      className={svgClassName}
    >
      {/* Fondo siempre blanco si está deshabilitado, de lo contrario sigue la lógica original */}
      <rect
        width="20"
        height="30"
        fill={isDisabled ? "white" : (predefinedMarkedOptions.includes(selectedOption) ? "lightgray" : "white")}
      />
      
      {/* Si tiene un color guardado y no está deshabilitado, dibuja el diseño correspondiente */}
      {storedColor && spaceBetweenLegendsDynamicDesign  && (
        <>
          {spaceBetweenLegendsDynamicDesign === 1 && (
            <EllipseDesignLeftCenter strokeColor={storedColor.name} />
          )}
          {spaceBetweenLegendsDynamicDesign === 2 && (
            <EllipseDesignRightCenter strokeColor={storedColor.name} />
          )}
          {spaceBetweenLegendsDynamicDesign === 3 && (
            <EllipseDesignCenter strokeColor={storedColor.name} />
          )}
        </>
      )}
    </svg>
  );
};

export default SpaceBetweenLegends;