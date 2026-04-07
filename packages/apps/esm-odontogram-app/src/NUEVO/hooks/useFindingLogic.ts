import { useCallback } from "react";
import type { DentalFormState, Finding, Tooth, Color, Suboption, Design } from "../types";
import useDentalFormStore from "../store/dentalFormData";
import useDentalDataStore from "../store/adultDentalData";

export const useFindingLogic = (idTooth: string, optionId: number) => {
  // Store useDentalFormStore
  const isComplete = useDentalFormStore((state: DentalFormState) => state.isComplete);
  const selectedOption = useDentalFormStore((state: DentalFormState) => state.selectedOption);
  const selectedSuboption = useDentalFormStore((state: DentalFormState) => state.selectedSuboption);
  const selectedColor = useDentalFormStore((state: DentalFormState) => state.selectedColor);
  const selectedDesign = useDentalFormStore((state: DentalFormState) => state.selectedDesign);
  
  // Store useDentalDataStore
  const teeth = useDentalDataStore((state: { teeth: Tooth[] }) => state.teeth);
  const registerFinding = useDentalDataStore((state: any) => state.registerFinding);
  const removeFinding = useDentalDataStore((state: any) => state.removeFinding);

  // Convertir idTooth a número para comparación
  const toothIdNumber = parseInt(idTooth, 10);
  
  // Obtener el diente
  const tooth = teeth.find((item: Tooth) => item.id === toothIdNumber);

  // Buscar el hallazgo específico para la opción seleccionada
  const currentFinding = tooth?.findings.find(
    (f: Finding) => f.optionId === optionId
  );

  const handleLegendClick = useCallback(() => {
    if (isComplete && optionId === selectedOption) {
      if (currentFinding) {
        // Si existe el hallazgo, lo eliminamos
        removeFinding({
          toothId: toothIdNumber,
          optionId: selectedOption,
          subOptionId: selectedSuboption?.id,
          dynamicDesign: selectedDesign?.number
        });
      } else {
        // Si no existe, registramos uno nuevo
        registerFinding({
          toothId: toothIdNumber,
          optionId: selectedOption,
          subOptionId: selectedSuboption?.id,
          color: selectedColor,
          design: selectedDesign ?? null
        });
      }
    }
  }, [
    isComplete,
    optionId,
    selectedOption,
    currentFinding,
    removeFinding,
    toothIdNumber,
    selectedSuboption?.id,
    selectedDesign?.number,
    registerFinding,
    selectedColor,
    selectedDesign
  ]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLegendClick();
    }
  }, [handleLegendClick]);

  return {
    currentFinding,
    isSelected: selectedOption === optionId,
    handleLegendClick,
    handleKeyDown,
  };
}; 