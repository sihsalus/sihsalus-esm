import { useMemo } from "react";
import type { Tooth, ToothPosition } from "../types";
import useDentalDataStore from '../store/adultDentalData';

/**
 * Hook personalizado para obtener dientes filtrados por posición
 * @param position - Posición de los dientes ('upper' | 'lower')
 * @returns Array de dientes de la posición especificada
 */
export const useTeethByPosition = (position: ToothPosition): Tooth[] => {
  const teeth = useDentalDataStore((state: { teeth: Tooth[] }) => state.teeth);

  const filteredTeeth = useMemo(() => {
    return teeth.filter((tooth: Tooth) => tooth.position === position);
  }, [teeth, position]);

  return filteredTeeth;
};

/**
 * Hook para obtener solo dientes superiores
 */
export const useUpperTeeth = (): Tooth[] => {
  return useTeethByPosition('upper');
};

/**
 * Hook para obtener solo dientes inferiores
 */
export const useLowerTeeth = (): Tooth[] => {
  return useTeethByPosition('lower');
};
