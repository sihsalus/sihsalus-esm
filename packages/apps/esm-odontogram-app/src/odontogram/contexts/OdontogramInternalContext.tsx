/**
 * Context interno para el Odontograma (Controlled Component Pattern)
 * 
 * Este context provee el estado y callbacks a los componentes hijos
 * sin necesidad de prop drilling. El estado es controlado por el padre
 * que usa el hook useOdontogramState().
 */

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import type { Tooth, SpaceData, Finding, RegisterFindingParams, RemoveFindingParams, Color } from '../types';

// ============================================================================
// TIPOS DEL CONTEXT
// ============================================================================

export interface OdontogramContextValue {
  // Datos
  teeth: Tooth[];
  spaceBetween: SpaceData[];
  
  // Funciones helper
  getToothById: (toothId: number) => Tooth | undefined;
  getTeethByPosition: (position: 'upper' | 'lower') => Tooth[];
  getSpaceById: (spaceId: number) => SpaceData | undefined;
  
  // Callbacks para modificar estado
  registerFinding: (params: RegisterFindingParams) => void;
  removeFinding: (params: RemoveFindingParams) => void;
  registerSpaceFinding: (params: SpaceFindingParams) => void;
  removeSpaceFinding: (params: RemoveSpaceFindingParams) => void;
  updateToothDisplay: (params: UpdateToothDisplayParams) => void;
  
  // Callbacks específicos para spacing store (compatibilidad)
  toggleColorSpaceBetweenLegends: (params: ToggleColorParams) => void;
  toggleColorSpaceBetweenFinding1: (params: ToggleColorParams) => void;
  toggleColorSpaceBetweenFinding2: (params: ToggleColorParams) => void;
  toggleColorSpaceBetweenFinding6: (params: ToggleColorParams) => void;
  toggleColorSpaceBetweenFinding7: (params: ToggleColorParams) => void;
  toggleColorSpaceBetweenFinding13: (params: ToggleColorParams) => void;
  toggleColorSpaceBetweenFinding24: (params: ToggleColorParams) => void;
  toggleColorSpaceBetweenFinding25: (params: ToggleColorParams) => void;
  toggleColorSpaceBetweenFinding26: (params: ToggleColorParams) => void;
  toggleColorSpaceBetweenFinding30: (params: ToggleColorParams) => void;
  toggleColorSpaceBetweenFinding31: (params: ToggleColorParams) => void;
  toggleColorSpaceBetweenFinding32: (params: ToggleColorParams) => void;
  toggleColorSpaceBetweenFinding39: (params: ToggleColorParams) => void;
}

export interface SpaceFindingParams {
  spaceId: number;
  optionId: number;
  subOptionId?: number;
  color?: Color;
  design?: { number: number } | null;
}

export interface RemoveSpaceFindingParams {
  spaceId: number;
  optionId: number;
  dynamicDesign?: number | null;
}

export interface UpdateToothDisplayParams {
  toothId: number;
  design?: string;
  spaceBetweenLegendsLeftId?: number | null;
  spaceBetweenLegendsRightId?: number | null;
}

export interface ToggleColorParams {
  id: number;
  newColor: Color | null;
  optionId: number;
  subOptionId?: number;
}

// ============================================================================
// CONTEXT
// ============================================================================

const OdontogramInternalContext = createContext<OdontogramContextValue | null>(null);

// ============================================================================
// PROVIDER PROPS
// ============================================================================

interface OdontogramInternalProviderProps {
  children: React.ReactNode;
  teeth: Tooth[];
  spaceBetween: SpaceData[];
  onTeethChange: (newTeeth: Tooth[]) => void;
  onSpaceBetweenChange: (newSpaceBetween: SpaceData[]) => void;
}

// ============================================================================
// PROVIDER
// ============================================================================

export const OdontogramInternalProvider: React.FC<OdontogramInternalProviderProps> = ({
  children,
  teeth,
  spaceBetween,
  onTeethChange,
  onSpaceBetweenChange,
}) => {
  // ============================================================================
  // HELPERS
  // ============================================================================

  const getToothById = useCallback((toothId: number) => {
    return teeth.find(t => t.id === toothId);
  }, [teeth]);

  const getTeethByPosition = useCallback((position: 'upper' | 'lower') => {
    return teeth.filter(t => t.position === position);
  }, [teeth]);

  const getSpaceById = useCallback((spaceId: number) => {
    return spaceBetween.find(s => s.id === spaceId);
  }, [spaceBetween]);

  // ============================================================================
  // CALLBACKS PARA DIENTES
  // ============================================================================

  const registerFinding = useCallback((params: RegisterFindingParams) => {
    const { toothId, zoneId, optionId, subOptionId, color, design } = params;
    const dynamicDesignValue = design?.number || null;

    const newFinding: Finding = {
      uniqueId: Math.floor(Math.random() * 1000000),
      optionId,
      subOptionId,
      color,
      dynamicDesign: dynamicDesignValue,
    };

    // Caso especial: optionId 31 o 7 (aplicar a toda la fila)
    if ((optionId === 31 || optionId === 7) && !zoneId) {
      const targetTooth = teeth.find(t => t.id === toothId);
      const targetPosition = targetTooth?.position;
      
      if (!targetPosition) return;

      const updatedTeeth = teeth.map((tooth) => {
        if (tooth.position !== targetPosition) return tooth;

        const existingFindingIndex = tooth.findings.findIndex(
          (f) => f.optionId === optionId && f.dynamicDesign === dynamicDesignValue
        );

        const updatedFindings = existingFindingIndex !== -1
          ? tooth.findings.map((f, i) => i === existingFindingIndex ? newFinding : f)
          : [...tooth.findings, newFinding];

        return { ...tooth, findings: updatedFindings };
      });

      onTeethChange(updatedTeeth);
      return;
    }

    // Caso normal
    const updatedTeeth = teeth.map((tooth) => {
      if (tooth.id !== toothId) return tooth;

      if (zoneId && Array.isArray(tooth.zones)) {
        const updatedZones = tooth.zones.map((zone) => {
          if (zone.id !== zoneId) return zone;

          const existingFindingIndex = zone.findings.findIndex(
            (f) => f.optionId === optionId && f.dynamicDesign === dynamicDesignValue
          );

          const updatedFindings = existingFindingIndex !== -1
            ? zone.findings.map((f, i) => i === existingFindingIndex ? newFinding : f)
            : [...zone.findings, newFinding];

          return { ...zone, findings: updatedFindings };
        });

        return { ...tooth, zones: updatedZones };
      } else {
        const existingFindingIndex = tooth.findings.findIndex(
          (f) => f.optionId === optionId && f.dynamicDesign === dynamicDesignValue
        );

        const updatedFindings = existingFindingIndex !== -1
          ? tooth.findings.map((f, i) => i === existingFindingIndex ? newFinding : f)
          : [...tooth.findings, newFinding];

        // Calcular dynamicDesign basándose en espacios adyacentes
        let calculatedDynamicDesign = dynamicDesignValue || 1;
        const leftSpace = spaceBetween.find(s => s.rightToothId === toothId);
        const rightSpace = spaceBetween.find(s => s.leftToothId === toothId);
        
        const leftHasColor = leftSpace?.findings?.some(f => f.optionId === optionId && f.color);
        const rightHasColor = rightSpace?.findings?.some(f => f.optionId === optionId && f.color);
        
        if (color) {
          if (leftHasColor && rightHasColor) {
            calculatedDynamicDesign = 3;
          } else if (leftHasColor) {
            calculatedDynamicDesign = 1;
          } else if (rightHasColor) {
            calculatedDynamicDesign = 2;
          } else {
            calculatedDynamicDesign = 1;
          }
        }

        return { 
          ...tooth, 
          findings: updatedFindings.map(f => 
            f.uniqueId === newFinding.uniqueId 
              ? { ...f, dynamicDesign: calculatedDynamicDesign }
              : f
          )
        };
      }
    });

    onTeethChange(updatedTeeth);
    
    // PROPAGACIÓN: Actualizar diseños de espacios adyacentes
    if (!zoneId) {
      const updatedSpaces = spaceBetween.map(space => {
        if (space.leftToothId === toothId || space.rightToothId === toothId) {
          const leftTooth = updatedTeeth.find(t => t.id === space.leftToothId);
          const rightTooth = updatedTeeth.find(t => t.id === space.rightToothId);
          
          const leftHasFinding = leftTooth?.findings.some(f => f.optionId === optionId && f.color);
          const rightHasFinding = rightTooth?.findings.some(f => f.optionId === optionId && f.color);
          
          return {
            ...space,
            findings: space.findings.map(f => {
              // Actualizar TODOS los findings con este optionId
              if (f.optionId === optionId && f.color) {
                let newDynamicDesign = f.dynamicDesign;
                if (leftHasFinding && rightHasFinding) {
                  newDynamicDesign = 3;
                } else if (leftHasFinding) {
                  newDynamicDesign = 1;
                } else if (rightHasFinding) {
                  newDynamicDesign = 2;
                }
                return { ...f, dynamicDesign: newDynamicDesign };
              }
              return f;
            })
          };
        }
        return space;
      });
      
      onSpaceBetweenChange(updatedSpaces);
    }
  }, [teeth, spaceBetween, onTeethChange, onSpaceBetweenChange]);

  const removeFinding = useCallback((params: RemoveFindingParams) => {
    const { toothId, optionId, subOptionId, dynamicDesign } = params;

    const updatedTeeth = teeth.map((tooth) => {
      if (tooth.id !== toothId) return tooth;

      // Solo procesar zones si es un array (no un número)
      const updatedZones = Array.isArray(tooth.zones)
        ? tooth.zones.map((zone) => ({
            ...zone,
            findings: zone.findings.filter((f) =>
              !(f.optionId === optionId &&
                (subOptionId === undefined || f.subOptionId === subOptionId) &&
                (dynamicDesign === undefined || f.dynamicDesign === dynamicDesign))
            ),
          }))
        : tooth.zones; // Mantener el valor original si es número

      const updatedFindings = tooth.findings.filter((f) =>
        !(f.optionId === optionId &&
          (subOptionId === undefined || f.subOptionId === subOptionId) &&
          (dynamicDesign === undefined || f.dynamicDesign === dynamicDesign))
      );

      return { ...tooth, zones: updatedZones, findings: updatedFindings };
    });

    onTeethChange(updatedTeeth);
    
    // PROPAGACIÓN: Actualizar diseños de espacios adyacentes
    const updatedSpaces = spaceBetween.map(space => {
      if (space.leftToothId === toothId || space.rightToothId === toothId) {
        const leftTooth = updatedTeeth.find(t => t.id === space.leftToothId);
        const rightTooth = updatedTeeth.find(t => t.id === space.rightToothId);
        
        const leftHasFinding = leftTooth?.findings.some(f => f.optionId === optionId && f.color);
        const rightHasFinding = rightTooth?.findings.some(f => f.optionId === optionId && f.color);
        
        return {
          ...space,
          findings: space.findings.map(f => {
            // Actualizar TODOS los findings con este optionId
            if (f.optionId === optionId && f.color) {
              let newDynamicDesign = f.dynamicDesign;
              if (leftHasFinding && rightHasFinding) {
                newDynamicDesign = 3;
              } else if (leftHasFinding) {
                newDynamicDesign = 1;
              } else if (rightHasFinding) {
                newDynamicDesign = 2;
              }
              return { ...f, dynamicDesign: newDynamicDesign };
            }
            return f;
          })
        };
      }
      return space;
    });
    
    onSpaceBetweenChange(updatedSpaces);
  }, [teeth, spaceBetween, onTeethChange, onSpaceBetweenChange]);

  // ============================================================================
  // CALLBACKS PARA ESPACIOS
  // ============================================================================

  const registerSpaceFinding = useCallback((params: SpaceFindingParams) => {
    const { spaceId, optionId, subOptionId, color, design } = params;
    const dynamicDesignValue = design?.number || null;

    const newFinding: Finding = {
      uniqueId: Math.floor(Math.random() * 1000000),
      optionId,
      subOptionId,
      color,
      dynamicDesign: dynamicDesignValue,
    };

    const space = spaceBetween.find(s => s.id === spaceId);
    
    // Actualizar el espacio
    const updatedSpaces = spaceBetween.map((s) => {
      if (s.id !== spaceId) return s;

      const existingFindingIndex = s.findings.findIndex(
        (f) => f.optionId === optionId && f.dynamicDesign === dynamicDesignValue
      );

      const updatedFindings = existingFindingIndex !== -1
        ? s.findings.map((f, i) => i === existingFindingIndex ? newFinding : f)
        : [...s.findings, newFinding];

      // Calcular dynamicDesign basándose en dientes adyacentes
      let calculatedDynamicDesign = dynamicDesignValue;
      if (space) {
        const leftTooth = teeth.find(t => t.id === space.leftToothId);
        const rightTooth = teeth.find(t => t.id === space.rightToothId);
        
        const leftHasFinding = leftTooth?.findings.some(f => f.optionId === optionId && f.color);
        const rightHasFinding = rightTooth?.findings.some(f => f.optionId === optionId && f.color);
        
        if (color) {
          if (leftHasFinding && rightHasFinding) {
            calculatedDynamicDesign = 3;
          } else if (leftHasFinding) {
            calculatedDynamicDesign = 1;
          } else if (rightHasFinding) {
            calculatedDynamicDesign = 2;
          }
        }
      }

      return { 
        ...s, 
        findings: updatedFindings.map(f => 
          f.uniqueId === newFinding.uniqueId 
            ? { ...f, dynamicDesign: calculatedDynamicDesign }
            : f
        )
      };
    });

    onSpaceBetweenChange(updatedSpaces);
    
    // PROPAGACIÓN: Actualizar diseños de dientes adyacentes
    if (space) {
      const updatedTeeth = teeth.map(tooth => {
        if (tooth.id === space.leftToothId || tooth.id === space.rightToothId) {
          // Recalcular dynamicDesign del diente basándose en espacios adyacentes (usando updatedSpaces)
          const leftSpace = updatedSpaces.find(s => s.rightToothId === tooth.id);
          const rightSpace = updatedSpaces.find(s => s.leftToothId === tooth.id);
          
          const leftHasFinding = leftSpace?.findings?.some(f => f.optionId === optionId && f.color);
          const rightHasFinding = rightSpace?.findings?.some(f => f.optionId === optionId && f.color);
          
          // Calcular el nuevo diseño:
          // - Ambos lados con hallazgo: diseño 3
          // - Solo izquierda con hallazgo: diseño 2  
          // - Solo derecha con hallazgo: diseño 1
          // - Ninguno: diseño 1 (default)
          let newDynamicDesign = 1;
          if (leftHasFinding && rightHasFinding) {
            newDynamicDesign = 3;
          } else if (leftHasFinding) {
            newDynamicDesign = 2;
          } else if (rightHasFinding) {
            newDynamicDesign = 1;
          }
          
          return {
            ...tooth,
            findings: tooth.findings.map(f => {
              // Actualizar TODOS los findings con este optionId
              if (f.optionId === optionId) {
                return { ...f, dynamicDesign: newDynamicDesign };
              }
              return f;
            })
          };
        }
        return tooth;
      });
      
      onTeethChange(updatedTeeth);
    }
  }, [spaceBetween, teeth, onSpaceBetweenChange, onTeethChange]);

  const removeSpaceFinding = useCallback((params: RemoveSpaceFindingParams) => {
    const { spaceId, optionId, dynamicDesign } = params;

    const space = spaceBetween.find(s => s.id === spaceId);
    
    const updatedSpaces = spaceBetween.map((s) => {
      if (s.id !== spaceId) return s;

      const updatedFindings = s.findings.filter((f) =>
        !(f.optionId === optionId &&
          (dynamicDesign === undefined || f.dynamicDesign === dynamicDesign))
      );

      return { ...s, findings: updatedFindings };
    });

    onSpaceBetweenChange(updatedSpaces);
    
    // PROPAGACIÓN: Actualizar diseños de dientes adyacentes después de remover
    if (space) {
      const updatedTeeth = teeth.map(tooth => {
        if (tooth.id === space.leftToothId || tooth.id === space.rightToothId) {
          // Recalcular dynamicDesign del diente basándose en espacios adyacentes (usando updatedSpaces)
          const leftSpace = updatedSpaces.find(s => s.rightToothId === tooth.id);
          const rightSpace = updatedSpaces.find(s => s.leftToothId === tooth.id);
          
          const leftHasFinding = leftSpace?.findings?.some(f => f.optionId === optionId && f.color);
          const rightHasFinding = rightSpace?.findings?.some(f => f.optionId === optionId && f.color);
          
          // Calcular el nuevo diseño:
          // - Ambos lados con hallazgo: diseño 3
          // - Solo izquierda con hallazgo: diseño 2
          // - Solo derecha con hallazgo: diseño 1
          // - Ninguno: diseño 1 (default)
          let newDynamicDesign = 1;
          if (leftHasFinding && rightHasFinding) {
            newDynamicDesign = 3;
          } else if (leftHasFinding) {
            newDynamicDesign = 2;
          } else if (rightHasFinding) {
            newDynamicDesign = 1;
          }
          
          return {
            ...tooth,
            findings: tooth.findings.map(f => {
              // Actualizar TODOS los findings con este optionId
              if (f.optionId === optionId) {
                return { ...f, dynamicDesign: newDynamicDesign };
              }
              return f;
            })
          };
        }
        return tooth;
      });
      
      onTeethChange(updatedTeeth);
    }
  }, [spaceBetween, teeth, onSpaceBetweenChange, onTeethChange]);

  const updateToothDisplay = useCallback((params: UpdateToothDisplayParams) => {
    const { toothId, ...updates } = params;

    const updatedTeeth = teeth.map((tooth) => {
      if (tooth.id !== toothId) return tooth;

      return {
        ...tooth,
        displayProperties: {
          ...tooth.displayProperties,
          ...updates,
        },
      };
    });

    onTeethChange(updatedTeeth);
  }, [teeth, onTeethChange]);

  // ============================================================================
  // TOGGLE FUNCTIONS PARA COMPATIBILIDAD CON SPACING COMPONENTS
  // ============================================================================

  const createToggleFunction = useCallback((findingNumber: number) => {
    return (params: ToggleColorParams) => {
      const { id, newColor, optionId, subOptionId } = params;
      
      const space = spaceBetween.find(s => s.id === id);
      if (!space) return;

      const existingFinding = space.findings.find(f => f.optionId === optionId);
      
      if (existingFinding) {
        removeSpaceFinding({ spaceId: id, optionId, dynamicDesign: existingFinding.dynamicDesign });
      } else {
        registerSpaceFinding({
          spaceId: id,
          optionId,
          subOptionId,
          color: newColor || undefined,
          design: { number: 1 },
        });
      }
    };
  }, [spaceBetween, registerSpaceFinding, removeSpaceFinding]);

  // ============================================================================
  // MEMOIZE VALUE
  // ============================================================================

  const value = useMemo<OdontogramContextValue>(() => ({
    teeth,
    spaceBetween,
    getToothById,
    getTeethByPosition,
    getSpaceById,
    registerFinding,
    removeFinding,
    registerSpaceFinding,
    removeSpaceFinding,
    updateToothDisplay,
    toggleColorSpaceBetweenLegends: createToggleFunction(11),
    toggleColorSpaceBetweenFinding1: createToggleFunction(1),
    toggleColorSpaceBetweenFinding2: createToggleFunction(2),
    toggleColorSpaceBetweenFinding6: createToggleFunction(6),
    toggleColorSpaceBetweenFinding7: createToggleFunction(7),
    toggleColorSpaceBetweenFinding13: createToggleFunction(13),
    toggleColorSpaceBetweenFinding24: createToggleFunction(24),
    toggleColorSpaceBetweenFinding25: createToggleFunction(25),
    toggleColorSpaceBetweenFinding26: createToggleFunction(26),
    toggleColorSpaceBetweenFinding30: createToggleFunction(30),
    toggleColorSpaceBetweenFinding31: createToggleFunction(31),
    toggleColorSpaceBetweenFinding32: createToggleFunction(32),
    toggleColorSpaceBetweenFinding39: createToggleFunction(39),
  }), [
    teeth,
    spaceBetween,
    getToothById,
    getTeethByPosition,
    getSpaceById,
    registerFinding,
    removeFinding,
    registerSpaceFinding,
    removeSpaceFinding,
    updateToothDisplay,
    createToggleFunction,
  ]);

  return (
    <OdontogramInternalContext.Provider value={value}>
      {children}
    </OdontogramInternalContext.Provider>
  );
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook para acceder al context interno del odontograma
 */
export function useOdontogramContext(): OdontogramContextValue {
  const context = useContext(OdontogramInternalContext);
  if (!context) {
    throw new Error('useOdontogramContext must be used within an OdontogramInternalProvider');
  }
  return context;
}

/**
 * Hook para obtener dientes (reemplazo de useDentalDataStore)
 */
export function useTeeth(): Tooth[] {
  const { teeth } = useOdontogramContext();
  return teeth;
}

/**
 * Hook para obtener dientes superiores
 */
export function useUpperTeeth(): Tooth[] {
  const { getTeethByPosition } = useOdontogramContext();
  return getTeethByPosition('upper');
}

/**
 * Hook para obtener dientes inferiores
 */
export function useLowerTeeth(): Tooth[] {
  const { getTeethByPosition } = useOdontogramContext();
  return getTeethByPosition('lower');
}

/**
 * Hook para obtener espacios entre dientes
 */
export function useSpaceBetween(): SpaceData[] {
  const { spaceBetween } = useOdontogramContext();
  return spaceBetween;
}

/**
 * Hook para registrar hallazgos (reemplazo de store.registerFinding)
 */
export function useRegisterFinding() {
  const { registerFinding } = useOdontogramContext();
  return registerFinding;
}

/**
 * Hook para remover hallazgos (reemplazo de store.removeFinding)
 */
export function useRemoveFinding() {
  const { removeFinding } = useOdontogramContext();
  return removeFinding;
}

/**
 * Hook que simula el store de spacing para compatibilidad
 */
export function useSpacingStore() {
  const context = useOdontogramContext();
  return context;
}
