import React from "react";
import useDentalFormStore from "../../store/dentalFormData";
import useSpaceBetweenLegendsDataStore from "../../store/adultSpaceBetweenMainSectionsOnTheCanvasData";
import { Finding39Design1, Finding39Design1Inverted } from "../../designs/figuras";
import './SpaceBetweenStyles.css';

const SpacingBetweenFinding39 = ({ id, odontogramType = "adult" }) => {
  // Determinar el store a utilizar

  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state) => state.isComplete);
  const selectedOption = useDentalFormStore((state) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state) => state.selectedColor);
  
  // Opciones que activan la selección
  const predefinedMarkedOptions = [39];
  
  // Verificar si la opción seleccionada es la 39 para activar el sombreado
  const shouldShade = predefinedMarkedOptions.includes(selectedOption);
  
  // Store useDataStore
  const intermediateSpaceOnTheCanvasOfFinding39 = useSpaceBetweenLegendsDataStore(
    (state) => state.intermediateSpaceOnTheCanvasOfFinding39
  );
  const intermediateSpaceOnTheCanvasOfFinding39Lower = useSpaceBetweenLegendsDataStore(
    (state) => state.intermediateSpaceOnTheCanvasOfFinding39Lower
  );
  const toggleColorSpaceBetweenFinding39 = useSpaceBetweenLegendsDataStore(
    (state) => state.toggleColorSpaceBetweenFinding39
  );

  // Determinar si es diente inferior basándose en el ID y tipo de odontograma
  const isLowerTeeth = (id >= 5100000);
    (id >= 5390000) ||
    (id >= 53900000);
  
  // Obtener los datos correctos según la posición
  const findingData = isLowerTeeth ? intermediateSpaceOnTheCanvasOfFinding39Lower : intermediateSpaceOnTheCanvasOfFinding39;
  
  // Obtener los datos guardados para este espacio
  const legend = findingData?.find((item) => item.id === id);
  const findings = legend?.findings || [];
  
  const handleClick = () => {
    // Solo permitir el click si la opción seleccionada es 39
    if (!isComplete || !predefinedMarkedOptions.includes(selectedOption)) return;
    
    toggleColorSpaceBetweenFinding39({
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
      {/* Fondo con sombreado si la opción seleccionada es 39 */}
      <rect
        width="20"
        height="20"
        fill={shouldShade ? "lightgray" : "white"}
      />
      
      {/* Renderiza los hallazgos de la opción 39 */}
      {findings.length > 0 && (
        <>
          {findings.map((finding) => (
            <React.Fragment key={finding.uniqueId}>
              {finding.color && (
                isLowerTeeth ? (
                  <Finding39Design1Inverted strokeColor={finding.color.name} />
                ) : (
                  <Finding39Design1 strokeColor={finding.color.name} />
                )
              )}
            </React.Fragment>
          ))}
        </>
      )}
    </svg>
  );
};

export default SpacingBetweenFinding39;