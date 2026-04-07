import { useMemo } from 'react';
import type { Tooth, ToothPosition, Finding } from '../types';
import useAdultDentalDataStore from '../store/adultDentalData';
import useAdultSpaceBetweenLegendsDataStore from '../store/adultSpaceBetweenMainSectionsOnTheCanvasData';
import useDentalFormStore from '../store/dentalFormData';

/**
 * Hook para detectar si hay datos registrados para un hallazgo específico
 * @param optionId - ID del hallazgo a verificar
 * @param position - Posición de los dientes ('upper' | 'lower')
 * @returns {boolean} - true si hay datos registrados, false si no
 */
export const useHasFindingData = (
  optionId: number, 
  position: ToothPosition = 'upper'
): boolean => {
  const teeth = useAdultDentalDataStore((state: { teeth: Tooth[] }) => state.teeth);
  const spaceBetweenData = useAdultSpaceBetweenLegendsDataStore((state: any) => state);
  
  return useMemo(() => {
    
    // Filtrar dientes por posición
    const filteredTeeth = teeth.filter((tooth: Tooth) => tooth.position === position);
    
    // Verificar si hay hallazgos en dientes
    const hasToothFindings = filteredTeeth.some((tooth: Tooth) => {
      // Verificar findings a nivel de diente
      const hasToothLevelFindings = tooth.findings?.some((finding: Finding) => finding.optionId === optionId);
      
      // En la estructura actual, zones es un array de zonas
      // Los hallazgos de zonas se almacenan a nivel de diente con información de zona
      return hasToothLevelFindings;
    });
    
    if (hasToothFindings) return true;
    
    // Verificar hallazgos en espacios interdentales
    const spaceKeys = [
      'intermediateSpaceOnTheCanvasOfFinding1',
      'intermediateSpaceOnTheCanvasOfFinding2',
      'intermediateSpaceOnTheCanvasOfFinding7',
      'intermediateSpaceOnTheCanvasOfFinding13',
      'intermediateSpaceOnTheCanvasOfFinding24',
      'intermediateSpaceOnTheCanvasOfFinding25',
      'intermediateSpaceOnTheCanvasOfFinding26',
      'intermediateSpaceOnTheCanvasOfFinding30',
      'intermediateSpaceOnTheCanvasOfFinding31',
      'intermediateSpaceOnTheCanvasOfFinding32',
      'intermediateSpaceOnTheCanvasOfFinding39'
    ];
    
    // Agregar claves para dientes inferiores
    const lowerSpaceKeys = spaceKeys.map(key => `${key}Lower`);
    const allSpaceKeys = position === 'lower' ? lowerSpaceKeys : spaceKeys;
    
    // Verificar si hay hallazgos en espacios
    const hasSpaceFindings = allSpaceKeys.some(spaceKey => {
      const spaceData = (spaceBetweenData as any)[spaceKey];
      if (!spaceData || !Array.isArray(spaceData)) return false;
      
      return spaceData.some((space: any) => 
        space.findings?.some((finding: any) => finding.optionId === optionId)
      );
    });
    
    return hasSpaceFindings;
  }, [teeth, spaceBetweenData, optionId, position]);
};

/**
 * Hook para detectar si un hallazgo está seleccionado actualmente
 * @param optionId - ID del hallazgo a verificar
 * @returns {boolean} - true si está seleccionado, false si no
 */
export const useIsFindingSelected = (optionId: number): boolean => {
  const selectedOption = useDentalFormStore((state: { selectedOption: number | null }) => state.selectedOption);
  
  return useMemo(() => {
    return selectedOption === optionId;
  }, [selectedOption, optionId]);
};

/**
 * Hook combinado para determinar si una fila de hallazgo debe renderizarse
 * @param optionId - ID del hallazgo a verificar
 * @param position - Posición de los dientes ('upper' | 'lower')
 * @returns {boolean} - true si debe renderizarse, false si no
 */
export const useShouldRenderFindingRow = (
  optionId: number, 
  position: ToothPosition = 'upper'
): boolean => {
  const hasData = useHasFindingData(optionId, position);
  const isSelected = useIsFindingSelected(optionId);
  
  return useMemo(() => {
    // Mostrar la fila solo si:
    // 1. Tiene datos registrados, O
    // 2. Está seleccionada actualmente
    return hasData || isSelected;
  }, [hasData, isSelected]);
};
