import React from "react";
import useDentalFormStore from "../../store/dentalFormData";
import useSpaceBetweenLegendsDataStore from "../../store/adultSpaceBetweenMainSectionsOnTheCanvasData";
import { Finding26Design1 } from "../../designs/figuras";
import './SpaceBetweenStyles.css';

const SpacingBetweenFinding26 = ({ id, odontogramType = "adult" }) => {
  // Determinar el store a utilizar
  
  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state) => state.isComplete);
  const selectedOption = useDentalFormStore((state) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state) => state.selectedColor);
  
  // Opciones que activan la selección
  const predefinedMarkedOptions = [26];
  
  // Verificar si la opción seleccionada es la 26 para activar el sombreado
  const shouldShade = predefinedMarkedOptions.includes(selectedOption);
  
  // Determinar si es diente inferior basándose en el ID y tipo de odontograma
  const isLowerTeeth = (id >= 5100000);
    (id >= 5260000) ||
    (id >= 52600000);
  
  // Store dinámico - usar los datos correctos según la posición
  const intermediateSpaceOnTheCanvasOfFinding26 = useSpaceBetweenLegendsDataStore(
    (state) => isLowerTeeth 
      ? state.intermediateSpaceOnTheCanvasOfFinding26Lower 
      : state.intermediateSpaceOnTheCanvasOfFinding26
  );
  const toggleColorSpaceBetweenFinding26 = useSpaceBetweenLegendsDataStore(
    (state) => state.toggleColorSpaceBetweenFinding26
  );
  
  // Obtener los datos guardados para este espacio
  const legend = intermediateSpaceOnTheCanvasOfFinding26?.find((item) => item.id === id);
  const findings = legend?.findings || [];
  
  const handleClick = () => {
    // Solo permitir el click si la opción seleccionada es 26
    if (!isComplete || !predefinedMarkedOptions.includes(selectedOption)) return;
    
    toggleColorSpaceBetweenFinding26({
      id,
      newColor: selectedColor,
      optionId: selectedOption,
      subOptionId: selectedSuboption?.id,
    });
  };

  return (
    <svg
      width="20"
      height="20"
      onClick={handleClick}
      style={{ cursor: shouldShade ? "pointer" : "default" }}
      className={shouldShade ? "interactive-svg" : ""}
    >
      {/* Fondo con sombreado si la opción seleccionada es 26 */}
      <rect
        width="20"
        height="20"
        fill={shouldShade ? "lightgray" : "white"}
      />
      
      {/* Renderiza los hallazgos de la opción 26 */}
      {findings.length > 0 && (
        <>
          {findings.map((finding) => (
            <React.Fragment key={finding.uniqueId}>
              {finding.dynamicDesign === 1 && finding.color && (
                <Finding26Design1 strokeColor={finding.color.name} />
              )}
            </React.Fragment>
          ))}
        </>
      )}
    </svg>
  );
};

export default SpacingBetweenFinding26;