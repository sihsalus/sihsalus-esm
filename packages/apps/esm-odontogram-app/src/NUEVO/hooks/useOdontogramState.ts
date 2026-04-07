/**
 * Hook para gestionar el estado de un Odontograma como Controlled Component
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const adult1 = useOdontogramState();
 *   const adult2 = useOdontogramState();
 *   
 *   return (
 *     <>
 *       <AdultOdontogram {...adult1.props} />
 *       <AdultOdontogram {...adult2.props} />
 *     </>
 *   );
 * }
 * ```
 */

import { useState, useCallback, useMemo } from 'react';
import type { Tooth, SpaceData } from '../types';

// Importar datos iniciales
import adultData from '../data/odontogramData.json';

// ============================================================================
// TIPOS
// ============================================================================

export interface OdontogramValue {
  teeth: Tooth[];
  spaceBetween: SpaceData[];
}

export interface OdontogramInitialConfig {
  initialTeeth?: Tooth[];
  initialSpaces?: SpaceData[];
}

export interface UseOdontogramStateResult {
  /** Estado actual */
  value: OdontogramValue;
  
  /** Función para actualizar el estado completo */
  setValue: React.Dispatch<React.SetStateAction<OdontogramValue>>;
  
  /** Props listas para pasar al componente */
  props: {
    value: OdontogramValue;
    onChange: React.Dispatch<React.SetStateAction<OdontogramValue>>;
  };
  
  /** Funciones helper */
  setTeeth: (teeth: Tooth[]) => void;
  setSpaceBetween: (spaceBetween: SpaceData[]) => void;
  reset: () => void;
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Consolida todos los espacios de findingSpaces en un array plano
 */
function consolidateSpaces(spacingData: any): SpaceData[] {
  const allSpaces: SpaceData[] = [];
  
  if (!spacingData) return allSpaces;
  
  // Procesar upper y lower
  ['upper', 'lower'].forEach(position => {
    const positionData = spacingData[position];
    if (!positionData) return;
    
    // Agregar spaceBetweenLegends
    if (positionData.spaceBetweenLegends) {
      allSpaces.push(...positionData.spaceBetweenLegends.map((item: any) => ({
        ...item,
        findings: item.findings || []
      })));
    }
    
    // Agregar todos los findingSpaces
    if (positionData.findingSpaces) {
      Object.values(positionData.findingSpaces).forEach((spaces: any) => {
        if (Array.isArray(spaces)) {
          spaces.forEach((space: any) => {
            // Evitar duplicados por ID
            if (!allSpaces.find(s => s.id === space.id)) {
              allSpaces.push({
                ...space,
                findings: space.findings || []
              });
            }
          });
        }
      });
    }
  });
  
  return allSpaces;
}

/**
 * Obtiene los datos iniciales del odontograma adulto
 */
function getInitialData(): OdontogramValue {
  const data = adultData;
  
  // Consolidar todos los espacios de spacingData
  const spaceBetween = consolidateSpaces((data as any).spacingData);
  
  console.log('🔍 getInitialData:', {
    teethCount: data.teeth?.length,
    spaceBetweenCount: spaceBetween.length,
    hasSpacingData: !!(data as any).spacingData,
    firstSpace: spaceBetween[0]
  });
  
  return {
    teeth: (data.teeth as unknown as Tooth[]) || [],
    spaceBetween,
  };
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useOdontogramState(config?: OdontogramInitialConfig): UseOdontogramStateResult {
  const { initialTeeth, initialSpaces } = config || {};
  
  // Estado inicial memoizado
  const initialValue = useMemo(() => {
    if (initialTeeth && initialSpaces) {
      return { teeth: initialTeeth, spaceBetween: initialSpaces };
    }
    return getInitialData();
  }, []); // Solo se calcula una vez
  
  // Estado principal
  const [value, setValue] = useState<OdontogramValue>(initialValue);

  // ============================================================================
  // HELPERS
  // ============================================================================

  const setTeeth = useCallback((teeth: Tooth[]) => {
    setValue(prev => ({ ...prev, teeth }));
  }, []);

  const setSpaceBetween = useCallback((spaceBetween: SpaceData[]) => {
    setValue(prev => ({ ...prev, spaceBetween }));
  }, []);

  const reset = useCallback(() => {
    setValue(getInitialData());
  }, []);

  // ============================================================================
  // PROPS PARA COMPONENTE
  // ============================================================================

  const props = useMemo(() => ({
    value,
    onChange: setValue,
  }), [value]);

  return {
    value,
    setValue,
    props,
    setTeeth,
    setSpaceBetween,
    reset,
  };
}
