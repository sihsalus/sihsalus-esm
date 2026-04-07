// @ts-nocheck
import { createStore, StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { spacingData } from "../data/odontogramData.json";
// We'll inject the dental store via getter at runtime to avoid circular deps

// Extract spacing data for convenience
const {
  upper: {
    spaceBetweenLegends: initialSpaceBetweenLegends,
    findingSpaces: {
      finding1: initialIntermediateSpaceOnTheCanvasOfFinding1,
      finding2: initialIntermediateSpaceOnTheCanvasOfFinding2,
      finding6: initialIntermediateSpaceOnTheCanvasOfFinding6,
      finding7: initialIntermediateSpaceOnTheCanvasOfFinding7,
      finding13: initialIntermediateSpaceOnTheCanvasOfFinding13,
      finding24: initialIntermediateSpaceOnTheCanvasOfFinding24,
      finding25: initialIntermediateSpaceOnTheCanvasOfFinding25,
      finding26: initialIntermediateSpaceOnTheCanvasOfFinding26,
      finding30: initialIntermediateSpaceOnTheCanvasOfFinding30,
      finding31: initialIntermediateSpaceOnTheCanvasOfFinding31,
      finding32: initialIntermediateSpaceOnTheCanvasOfFinding32,
      finding39: initialIntermediateSpaceOnTheCanvasOfFinding39,
    }
  },
  lower: {
    spaceBetweenLegends: initialSpaceBetweenLegendsLower,
    findingSpaces: {
      finding1: initialIntermediateSpaceOnTheCanvasOfFinding1Lower,
      finding2: initialIntermediateSpaceOnTheCanvasOfFinding2Lower,
      finding6: initialIntermediateSpaceOnTheCanvasOfFinding6Lower,
      finding7: initialIntermediateSpaceOnTheCanvasOfFinding7Lower,
      finding13: initialIntermediateSpaceOnTheCanvasOfFinding13Lower,
      finding24: initialIntermediateSpaceOnTheCanvasOfFinding24Lower,
      finding25: initialIntermediateSpaceOnTheCanvasOfFinding25Lower,
      finding26: initialIntermediateSpaceOnTheCanvasOfFinding26Lower,
      finding30: initialIntermediateSpaceOnTheCanvasOfFinding30Lower,
      finding31: initialIntermediateSpaceOnTheCanvasOfFinding31Lower,
      finding32: initialIntermediateSpaceOnTheCanvasOfFinding32Lower,
      finding39: initialIntermediateSpaceOnTheCanvasOfFinding39Lower,
    }
  }
} = spacingData;
export type AdultDentalDataState = any;

export function createAdultSpaceBetweenDataStore(
  getDentalDataStore: () => StoreApi<AdultDentalDataState>,
) {
  // Local alias keeping the same identifier the body expects
  const useDentalDataStore = {
    getState: () => getDentalDataStore().getState(),
  } as any;

  // Archivo para definir los diseños. Se tendrán dos funciones para cada hallazgo: toggleColor y calculateDynamicDesign
  return createStore((set: any, get: any) => ({
  // Datos de dientes superiores
  spaceBetweenLegends: initialSpaceBetweenLegends || [],
  intermediateSpaceOnTheCanvasOfFinding1:
    initialIntermediateSpaceOnTheCanvasOfFinding1 || [],
  intermediateSpaceOnTheCanvasOfFinding2:
    initialIntermediateSpaceOnTheCanvasOfFinding2,
  intermediateSpaceOnTheCanvasOfFinding24:
    initialIntermediateSpaceOnTheCanvasOfFinding24,
  intermediateSpaceOnTheCanvasOfFinding25:
    initialIntermediateSpaceOnTheCanvasOfFinding25,
  intermediateSpaceOnTheCanvasOfFinding30:
    initialIntermediateSpaceOnTheCanvasOfFinding30,
  intermediateSpaceOnTheCanvasOfFinding31:
    initialIntermediateSpaceOnTheCanvasOfFinding31,
  intermediateSpaceOnTheCanvasOfFinding32:
    initialIntermediateSpaceOnTheCanvasOfFinding32,
  intermediateSpaceOnTheCanvasOfFinding7:
    initialIntermediateSpaceOnTheCanvasOfFinding7,
  intermediateSpaceOnTheCanvasOfFinding6:
    initialIntermediateSpaceOnTheCanvasOfFinding6 || [],
  intermediateSpaceOnTheCanvasOfFinding26:
    initialIntermediateSpaceOnTheCanvasOfFinding26 || [],
  intermediateSpaceOnTheCanvasOfFinding39:
    initialIntermediateSpaceOnTheCanvasOfFinding39 || [],
  
  // Datos de dientes inferiores
  spaceBetweenLegendsLower: initialSpaceBetweenLegendsLower || [],
  intermediateSpaceOnTheCanvasOfFinding1Lower:
    initialIntermediateSpaceOnTheCanvasOfFinding1Lower || [],
  intermediateSpaceOnTheCanvasOfFinding2Lower:
    initialIntermediateSpaceOnTheCanvasOfFinding2Lower,
  intermediateSpaceOnTheCanvasOfFinding24Lower:
    initialIntermediateSpaceOnTheCanvasOfFinding24Lower,
  intermediateSpaceOnTheCanvasOfFinding25Lower:
    initialIntermediateSpaceOnTheCanvasOfFinding25Lower,
  intermediateSpaceOnTheCanvasOfFinding30Lower:
    initialIntermediateSpaceOnTheCanvasOfFinding30Lower,
  intermediateSpaceOnTheCanvasOfFinding31Lower:
    initialIntermediateSpaceOnTheCanvasOfFinding31Lower,
  intermediateSpaceOnTheCanvasOfFinding32Lower:
    initialIntermediateSpaceOnTheCanvasOfFinding32Lower,
  intermediateSpaceOnTheCanvasOfFinding7Lower:
    initialIntermediateSpaceOnTheCanvasOfFinding7Lower,
  intermediateSpaceOnTheCanvasOfFinding6Lower:
    initialIntermediateSpaceOnTheCanvasOfFinding6Lower || [],
  intermediateSpaceOnTheCanvasOfFinding26Lower:
    initialIntermediateSpaceOnTheCanvasOfFinding26Lower || [],
  intermediateSpaceOnTheCanvasOfFinding39Lower:
    initialIntermediateSpaceOnTheCanvasOfFinding39Lower || [],
  toggleColorSpaceBetweenFinding6: (params) => {
    const {
      idIntermediateSpaceOnTheCanvasOfFinding6,
      newColor,
      optionId,
      subOptionId,
    } = params;

    // Determinar si es diente inferior basándose en el ID (IDs de dientes inferiores empiezan con 5)
    const isLowerTeeth = idIntermediateSpaceOnTheCanvasOfFinding6 >= 5600000;
    
    
    set((state) => {
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding6Lower' : 'intermediateSpaceOnTheCanvasOfFinding6';
      const currentFindings = state[findingKey] || [];
      
      
      const updatedFindings = currentFindings.map((legend) => {
        if (legend.id === idIntermediateSpaceOnTheCanvasOfFinding6) {
          
          // Verificamos si ya existe un finding con estos valores
          const existingFindingIndex = legend.findings.findIndex(
            (f) => f.optionId === optionId && f.subOptionId === subOptionId
          );


          // Si ya existe un finding igual y tiene el mismo color, lo eliminamos (toggle off)
          if (
            existingFindingIndex !== -1 &&
            JSON.stringify(legend.findings[existingFindingIndex].color) ===
              JSON.stringify(newColor)
          ) {
            
            // Filtrar el finding a eliminar
            const updatedFindings = legend.findings.filter(
              (_, index) => index !== existingFindingIndex
            );

            return {
              ...legend,
              findings: updatedFindings,
            };
          }
          // Si no existe o tiene diferente color, lo agregamos o actualizamos
          else {
            // Crear nuevo finding con datos clínicos
            const newFinding = {
              uniqueId: Math.floor(Math.random() * 1000000),
              optionId,
              subOptionId,
              color: newColor,
              dynamicDesign: 1,
            };


            // Si ya existe un finding similar, lo actualizamos
            if (existingFindingIndex !== -1) {
              const updatedFindings = [...legend.findings];
              updatedFindings[existingFindingIndex] = newFinding;

              return {
                ...legend,
                findings: updatedFindings,
              };
            }
            // Si no existe, lo agregamos
            else {
              return {
                ...legend,
                findings: [...legend.findings, newFinding],
              };
            }
          }
        }
        return legend;
      });

      return {
        [findingKey]: updatedFindings,
      };
    });
  },

  // Función para calcular el diseño dinámico para la opción 6
  calculateDynamicDesignFinding6: (params) => {
    const {
      idIntermediateSpaceOnTheCanvasOfFinding6,
      origin = "spaceBetweenFinding6",
      optionId,
      subOptionId,
      color,
    } = params;

    // Determinar si es diente inferior basándose en el ID (IDs de dientes inferiores empiezan con 5)
    const isLowerTeeth = idIntermediateSpaceOnTheCanvasOfFinding6 >= 5600000;

    set((state) => {
      const teeth = useDentalDataStore.getState().teeth;
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding6Lower' : 'intermediateSpaceOnTheCanvasOfFinding6';
      const currentFindings = state[findingKey] || [];

      const updatedFindings = currentFindings.map((legend) => {
        if (legend.id === idIntermediateSpaceOnTheCanvasOfFinding6) {
          let newDynamicDesign = 1; // valor por defecto

          // Puedes agregar lógica aquí para determinar el diseño basado en los findings
          // Por ejemplo, podrías evaluar todos los findings y seleccionar un diseño basado en ellos

          return {
            ...legend,
            dynamicDesign: newDynamicDesign,
          };
        }
        return legend;
      });

      return {
        [findingKey]: updatedFindings,
      };
    });
  },
  toggleColorSpaceBetweenLegends: (params) => {
    // Sección de la gestión del diseño del hallazgo 11
    const { id, newColor, optionId, subOptionId } = params;

    // Determinar si es diente inferior basándose en el ID (IDs de dientes inferiores van de 2000 a 2014)
    const isLowerTeeth = id >= 2000 && id <= 2014;
    
    set((state) => {
      const legendsKey = isLowerTeeth ? 'spaceBetweenLegendsLower' : 'spaceBetweenLegends';
      const currentLegends = state[legendsKey] || [];
      
      const updatedLegends = currentLegends.map((legend) => {
        if (legend.id === id) {
          const updatedColor =
            JSON.stringify(legend.color) === JSON.stringify(newColor)
              ? null
              : newColor;
          return {
            ...legend,
            color: updatedColor,
          };
        }
        return legend;
      });

      return {
        [legendsKey]: updatedLegends,
      };
    });

    get().calculateDynamicDesignForLegend({
      legendId: id,
      optionId,
      subOptionId,
      color: newColor,
      origin: "legend",
      isLowerTeeth,
    });
  },

  calculateDynamicDesignForLegend: (params) => {
    const {
      legendId,
      origin = "legend",
      optionId,
      subOptionId,
      color,
      isLowerTeeth = false,
    } = params;

    set((state) => {
      const teeth = useDentalDataStore.getState().teeth;
      const legendsKey = isLowerTeeth ? 'spaceBetweenLegendsLower' : 'spaceBetweenLegends';
      const currentLegends = state[legendsKey] || [];
      
      const updatedLegends = currentLegends.map((legend) => {
        if (legend.id === legendId) {
          const leftTooth = teeth.find(
            (tooth) => tooth.id === legend.leftToothId
          );
          const rightTooth = teeth.find(
            (tooth) => tooth.id === legend.rightToothId
          );

          // Encontrar los hallazgos específicos
          const leftFinding = leftTooth?.findings.find(
            (f) => f.optionId === optionId
          );
          const rightFinding = rightTooth?.findings.find(
            (f) => f.optionId === optionId
          );

          // Validar explícitamente si hay color en cada caso
          const leftColor =
            leftFinding?.color != null &&
            Object.keys(leftFinding.color).length > 0;
          const rightColor =
            rightFinding?.color != null &&
            Object.keys(rightFinding.color).length > 0;
          const hasColor =
            legend.color != null && Object.keys(legend.color).length > 0;

          let newDynamicDesign = 2; // valor por defecto

          if (hasColor) {
            if (leftColor && rightColor) {
              newDynamicDesign = 3;
            } else if (leftColor) {
              newDynamicDesign = 1;
            } else if (rightColor) {
              newDynamicDesign = 2;
            }
          }

          return { ...legend, dynamicDesign: newDynamicDesign };
        }
        return legend;
      });

      return { [legendsKey]: updatedLegends };
    });

    if (origin === "legend") {
      const legendsKey = isLowerTeeth ? 'spaceBetweenLegendsLower' : 'spaceBetweenLegends';
      const legend = get()[legendsKey]?.find((l) => l.id === legendId);
      if (legend) {
        if (legend.leftToothId) {
          useDentalDataStore.getState().calculateFinding11Design({
            toothId: legend.leftToothId,
            optionId,
            subOptionId,
            color,
            origin: "legend",
          });
        }
        if (legend.rightToothId) {
          useDentalDataStore.getState().calculateFinding11Design({
            toothId: legend.rightToothId,
            optionId,
            subOptionId,
            color,
            origin: "legend",
          });
        }
      }
    }
  },

  toggleColorSpaceBetweenFinding1: (params) => {
    // Sección de la gestión del diseño del hallazgo 1
    const { id, newColor, optionId, subOptionId } = params;

    // Determinar si es diente inferior basándose en el ID (IDs de dientes inferiores empiezan con 5)
    const isLowerTeeth = id >= 5100000;
    
    
    set((state) => {
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding1Lower' : 'intermediateSpaceOnTheCanvasOfFinding1';
      const currentFindings = state[findingKey] || [];
      
      const updatedFindings = currentFindings.map((legend) => {
        if (legend.id === id) {
          
          const updatedColor =
            JSON.stringify(legend.color) === JSON.stringify(newColor)
              ? null
              : newColor;
              
          
          return {
            ...legend,
            color: updatedColor,
          };
        }
        return legend;
      });

      return {
        [findingKey]: updatedFindings,
      };
    });

    get().calculateDynamicDesignFinding1({
      id,
      optionId,
      subOptionId,
      color: newColor,
      origin: "spaceBetweenFinding1",
      isLowerTeeth,
    });
  },

  calculateDynamicDesignFinding1: (params) => {
    const {
      id,
      origin = "spaceBetweenFinding1",
      optionId,
      subOptionId,
      color,
      isLowerTeeth = false,
    } = params;

    set((state) => {
      const teeth = useDentalDataStore.getState().teeth;
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding1Lower' : 'intermediateSpaceOnTheCanvasOfFinding1';
      const currentFindings = state[findingKey] || [];
      
      const updatedFindings = currentFindings.map((legend) => {
        if (legend.id === id) {
          const leftTooth = teeth.find(
            (tooth) => tooth.id === legend.leftToothId
          );
          const rightTooth = teeth.find(
            (tooth) => tooth.id === legend.rightToothId
          );

          // Encontrar los hallazgos específicos
          const leftFinding = leftTooth?.findings.find(
            (f) => f.optionId === optionId
          );
          const rightFinding = rightTooth?.findings.find(
            (f) => f.optionId === optionId
          );

          // Validar explícitamente si hay color en cada caso
          const leftColor =
            leftFinding?.color != null &&
            Object.keys(leftFinding.color).length > 0;
          const rightColor =
            rightFinding?.color != null &&
            Object.keys(rightFinding.color).length > 0;
          const hasColor =
            legend.color != null && Object.keys(legend.color).length > 0;

          let newDynamicDesign = 2; // valor por defecto

          if (hasColor) {
            if (leftColor && rightColor) {
              newDynamicDesign = 3;
            } else if (leftColor) {
              newDynamicDesign = 1;
            } else if (rightColor) {
              newDynamicDesign = 2;
            }
          }

          return { ...legend, dynamicDesign: newDynamicDesign };
        }
        return legend;
      });

      return {
        [findingKey]: updatedFindings,
      };
    });
    // Falta modificar el calculateFindingDesign

    if (origin === "spaceBetweenFinding1") {
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding1Lower' : 'intermediateSpaceOnTheCanvasOfFinding1';
      const legend = get()[findingKey]?.find((l) => l.id === id);
      if (legend) {
        if (legend.leftToothId) {
          useDentalDataStore.getState().calculateFinding1Design({
            toothId: legend.leftToothId,
            optionId,
            subOptionId,
            color,
            origin: "spaceBetweenFinding1",
          });
        }
        if (legend.rightToothId) {
          useDentalDataStore.getState().calculateFinding1Design({
            toothId: legend.rightToothId,
            optionId,
            subOptionId,
            color,
            origin: "spaceBetweenFinding1",
          });
        }
      }
    }
  },
  toggleColorSpaceBetweenFinding2: (params) => {
    // Sección de la gestión del diseño del hallazgo 2
    const { id, newColor, optionId, subOptionId } = params;

    // Determinar si es diente inferior basándose en el ID (IDs de dientes inferiores empiezan con 5)
    const isLowerTeeth = id >= 5200000;
    
    
    set((state) => {
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding2Lower' : 'intermediateSpaceOnTheCanvasOfFinding2';
      const currentFindings = state[findingKey] || [];
      
      const updatedFindings = currentFindings.map((legend) => {
        if (legend.id === id) {
          
          const updatedColor =
            JSON.stringify(legend.color) === JSON.stringify(newColor)
              ? null
              : newColor;
              
          
          return {
            ...legend,
            color: updatedColor,
          };
        }
        return legend;
      });

      return {
        [findingKey]: updatedFindings,
      };
    });

    // Solo llamar calculateDynamicDesignFinding2 si no se está eliminando (color no es null)
    const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding2Lower' : 'intermediateSpaceOnTheCanvasOfFinding2';
    const currentState = get();
    const legend = currentState[findingKey]?.find((l) => l.id === id);
    
    if (legend && legend.color !== null) {
      get().calculateDynamicDesignFinding2({
        id,
        optionId,
        subOptionId,
        color: legend.color, // Usar el color actual del legend, no newColor
        origin: "spaceBetweenFinding2",
        isLowerTeeth,
      });
    } else {
    }
  },

  calculateDynamicDesignFinding2: (params) => {
    const {
      id,
      origin = "spaceBetweenFinding2",
      optionId,
      subOptionId,
      color,
      isLowerTeeth = false,
    } = params;


    set((state) => {
      const teeth = useDentalDataStore.getState().teeth;
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding2Lower' : 'intermediateSpaceOnTheCanvasOfFinding2';
      const currentFindings = state[findingKey] || [];
      
      const updatedFindings = currentFindings.map((legend) => {
        if (legend.id === id) {
          
          const leftTooth = teeth.find(
            (tooth) => tooth.id === legend.leftToothId
          );
          const rightTooth = teeth.find(
            (tooth) => tooth.id === legend.rightToothId
          );

          // Encontrar los hallazgos específicos
          const leftFinding = leftTooth?.findings.find(
            (f) => f.optionId === optionId
          );
          const rightFinding = rightTooth?.findings.find(
            (f) => f.optionId === optionId
          );

          // Validar explícitamente si hay color en cada caso
          const leftColor =
            leftFinding?.color != null &&
            Object.keys(leftFinding.color).length > 0;
          const rightColor =
            rightFinding?.color != null &&
            Object.keys(rightFinding.color).length > 0;
          const hasColor =
            legend.color != null && Object.keys(legend.color).length > 0;

          let newDynamicDesign = 2; // valor por defecto

          if (hasColor) {
            if (leftColor && rightColor) {
              newDynamicDesign = 3;
            } else if (leftColor) {
              newDynamicDesign = 1;
            } else if (rightColor) {
              newDynamicDesign = 2;
            }
          }

          // Actualizar tanto el diseño como el color
          const updatedLegend = { 
            ...legend, 
            dynamicDesign: newDynamicDesign,
            color: color // Importante: actualizar el color
          };
          
          return updatedLegend;
        }
        return legend;
      });

      return {
        [findingKey]: updatedFindings,
      };
    });

    // ELIMINADO: Comportamiento bidireccional - ya no notifica a dientes adyacentes
  },
  toggleColorSpaceBetweenFinding7: (params) => {
    // Sección de la gestión del diseño del hallazgo 7
    // Los hallazgos 7 y 31 solo funcionan cuando se hace click en dientes, no en espacios
    // Por lo tanto, esta función no debe hacer nada
    return;
  },

  calculateDynamicDesignFinding7: (params) => {
    const {
      id,
      origin = "spaceBetweenFinding7",
      optionId,
      subOptionId,
      color,
      isLowerTeeth = false,
    } = params;
    
    set((state) => {
      const teeth = useDentalDataStore.getState().teeth;
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding7Lower' : 'intermediateSpaceOnTheCanvasOfFinding7';
      const currentFindings = state[findingKey] || [];
      
      const updatedFindings = currentFindings.map((legend) => {
        if (legend.id === id) {
          
          let newDynamicDesign = 1; // valor por defecto
          
          // Actualizar tanto el diseño como el color
          const updatedLegend = { 
            ...legend, 
            dynamicDesign: newDynamicDesign, 
            color: color // Importante: actualizar el color
          };
          
          return updatedLegend;
        }
        return legend;
      });

      return {
        [findingKey]: updatedFindings,
      };
    });

    if (origin === "spaceBetweenFinding7") {
      
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding7Lower' : 'intermediateSpaceOnTheCanvasOfFinding7';
      const legend = get()[findingKey]?.find((l) => l.id === id);
      
      if (legend) {
        if (legend.leftToothId) {
          useDentalDataStore.getState().calculateFinding7Design({
            toothId: legend.leftToothId,
            optionId,
            subOptionId,
            color,
            origin: "spaceBetweenFinding7",
          });
        }
        if (legend.rightToothId) {
          useDentalDataStore.getState().calculateFinding7Design({
            toothId: legend.rightToothId,
            optionId,
            subOptionId,
            color,
            origin: "spaceBetweenFinding7",
          });
        }
      } else {
      }
    }
  },
  toggleColorSpaceBetweenFinding24: (params) => {
    // Sección de la gestión del diseño del hallazgo 24
    const { id, newColor, optionId, subOptionId } = params;

    const isLowerTeeth = id >= 52400000;

    set((state) => {
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding24Lower' : 'intermediateSpaceOnTheCanvasOfFinding24';
      const currentFindings = state[findingKey] || [];
      
      const updatedFindings = currentFindings.map((legend) => {
        if (legend.id === id) {
          const updatedColor =
            JSON.stringify(legend.color) === JSON.stringify(newColor)
              ? null
              : newColor;
          return {
            ...legend,
            color: updatedColor,
          };
        }
        return legend;
      });

      return {
        [findingKey]: updatedFindings,
      };
    });

    get().calculateDynamicDesignFinding24({
      id,
      optionId,
      subOptionId,
      color: newColor,
      origin: "spaceBetweenFinding24",
      isLowerTeeth,
    });
  },

  calculateDynamicDesignFinding24: (params) => {
    const {
      id,
      origin = "spaceBetweenFinding24",
      optionId,
      subOptionId,
      color,
      isLowerTeeth = false,
    } = params;

    set((state) => {
      const teeth = useDentalDataStore.getState().teeth;
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding24Lower' : 'intermediateSpaceOnTheCanvasOfFinding24';
      const currentFindings = state[findingKey] || [];

      const updatedIntermediateSpaceOnTheCanvasOfFinding24 =
      currentFindings.map((legend) => {
          if (legend.id === id) {
            const leftTooth = teeth.find(
              (tooth) => tooth.id === legend.leftToothId
            );
            const rightTooth = teeth.find(
              (tooth) => tooth.id === legend.rightToothId
            );

            // Encontrar los hallazgos específicos
            const leftFinding = leftTooth?.findings.find(
              (f) => f.optionId === optionId
            );
            const rightFinding = rightTooth?.findings.find(
              (f) => f.optionId === optionId
            );

            // Validar explícitamente si hay color en cada caso
            const leftColor =
              leftFinding?.color != null &&
              Object.keys(leftFinding.color).length > 0;
            const rightColor =
              rightFinding?.color != null &&
              Object.keys(rightFinding.color).length > 0;
            const hasColor =
              legend.color != null && Object.keys(legend.color).length > 0;

            // Lógica de inversión: 1 para superior (flecha hacia abajo), 2 para inferior (flecha hacia arriba)
            let newDynamicDesign = isLowerTeeth ? 2 : 1;

            if (hasColor) {
              newDynamicDesign = isLowerTeeth ? 2 : 1;
            }
            
            return { ...legend, dynamicDesign: newDynamicDesign };
          }
          return legend;
        });

      return {
        [findingKey]:
        updatedIntermediateSpaceOnTheCanvasOfFinding24,
      };
    });

    if (origin === "spaceBetweenFinding24") {
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding24Lower' : 'intermediateSpaceOnTheCanvasOfFinding24';
      const legend = get()[findingKey]?.find((l) => l.id === id);

      if (legend) {
        if (legend.leftToothId) {
          useDentalDataStore.getState().calculateFinding24Design({
            toothId: legend.leftToothId,
            optionId,
            subOptionId,
            color,
            origin: "spaceBetweenFinding24",
            isLowerTeeth,
          });
        }
        if (legend.rightToothId) {
          useDentalDataStore.getState().calculateFinding24Design({
            toothId: legend.rightToothId,
            optionId,
            subOptionId,
            color,
            origin: "spaceBetweenFinding24",
            isLowerTeeth,
          });
        }
      }
    }
  },
  toggleColorSpaceBetweenFinding25: (params) => {
    // Sección de la gestión del diseño del hallazgo 25
    const { id, newColor, optionId, subOptionId } = params;


    const isLowerTeeth = id >= 52500000;

    set((state) => {
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding25Lower' : 'intermediateSpaceOnTheCanvasOfFinding25';
      const currentFindings = state[findingKey] || [];
      
      const updatedFindings = currentFindings.map((legend) => {
        if (legend.id === id) {
          const updatedColor =
            JSON.stringify(legend.color) === JSON.stringify(newColor)
              ? null
              : newColor;
          return {
            ...legend,
            color: updatedColor,
          };
        }
        return legend;
      });

      return {
        [findingKey]: updatedFindings,
      };
    });

    get().calculateDynamicDesignFinding25({
      id,
      optionId,
      subOptionId,
      color: newColor,
      origin: "spaceBetweenFinding25",
      isLowerTeeth,
    });
  },
  calculateDynamicDesignFinding25: (params) => {
    const {
      id,
      origin = "spaceBetweenFinding25",
      optionId,
      subOptionId,
      color,
      isLowerTeeth = false,
    } = params;

    set((state) => {
      const teeth = useDentalDataStore.getState().teeth;
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding25Lower' : 'intermediateSpaceOnTheCanvasOfFinding25';
      const currentFindings = state[findingKey] || [];

      const updatedFindings = currentFindings.map((legend) => {
        if (legend.id === id) {
          const leftTooth = teeth.find(
            (tooth) => tooth.id === legend.leftToothId
          );
          const rightTooth = teeth.find(
            (tooth) => tooth.id === legend.rightToothId
          );

          // Encontrar los hallazgos específicos
          const leftFinding = leftTooth?.findings.find(
            (f) => f.optionId === optionId
          );
          const rightFinding = rightTooth?.findings.find(
            (f) => f.optionId === optionId
          );

          // Validar explícitamente si hay color en cada caso
          const leftColor =
            leftFinding?.color != null &&
            Object.keys(leftFinding.color).length > 0;
          const rightColor =
            rightFinding?.color != null &&
            Object.keys(rightFinding.color).length > 0;
          const hasColor =
            legend.color != null && Object.keys(legend.color).length > 0;

          // Lógica de inversión: 1 para superior (flecha hacia arriba), 2 para inferior (flecha hacia abajo)
          let newDynamicDesign = isLowerTeeth ? 2 : 1;

          if (hasColor) {
            newDynamicDesign = isLowerTeeth ? 2 : 1;
          }
          
          return { ...legend, dynamicDesign: newDynamicDesign };
        }
        return legend;
      });

      return {
        [findingKey]: updatedFindings,
      };
    });

    if (origin === "spaceBetweenFinding25") {
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding25Lower' : 'intermediateSpaceOnTheCanvasOfFinding25';
      const legend = get()[findingKey]?.find((l) => l.id === id);
      if (legend) {
        if (legend.leftToothId) {
          useDentalDataStore.getState().calculateFinding25Design({
            toothId: legend.leftToothId,
            optionId,
            subOptionId,
            color,
            origin: "spaceBetweenFinding25",
            isLowerTeeth,
          });
        }
        if (legend.rightToothId) {
          useDentalDataStore.getState().calculateFinding25Design({
            toothId: legend.rightToothId,
            optionId,
            subOptionId,
            color,
            origin: "spaceBetweenFinding25",
            isLowerTeeth,
          });
        }
      }
    }
  },
  toggleColorSpaceBetweenFinding26: (params) => {
    const {
      id,
      newColor,
      optionId,
      subOptionId,
    } = params;

    // Determinar si es diente inferior basándose en el ID (IDs de dientes inferiores empiezan con 526)
    const isLowerTeeth = id >= 52600000;
    
    set((state) => {
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding26Lower' : 'intermediateSpaceOnTheCanvasOfFinding26';
      const currentFindings = state[findingKey] || [];
      
      const updatedFindings = currentFindings.map((legend) => {
        if (legend.id === id) {
          // Verificamos si ya existe un finding con estos valores
          const existingFindingIndex = legend.findings.findIndex(
            (f) => f.optionId === optionId && f.subOptionId === subOptionId
          );

          // Si ya existe un finding igual y tiene el mismo color, lo eliminamos (toggle off)
          if (
            existingFindingIndex !== -1 &&
            JSON.stringify(legend.findings[existingFindingIndex].color) ===
              JSON.stringify(newColor)
          ) {
            // Filtrar el finding a eliminar
            const updatedFindings = legend.findings.filter(
              (_, index) => index !== existingFindingIndex
            );

            return {
              ...legend,
              findings: updatedFindings,
            };
          }
          // Si no existe o tiene diferente color, lo agregamos o actualizamos
          else {
            // Crear nuevo finding con datos clínicos
            const newFinding = {
              uniqueId: Math.floor(Math.random() * 1000000),
              optionId,
              subOptionId,
              color: newColor,
              dynamicDesign: 1,
            };

            // Si ya existe un finding similar, lo actualizamos
            if (existingFindingIndex !== -1) {
              const updatedFindings = [...legend.findings];
              updatedFindings[existingFindingIndex] = newFinding;

              return {
                ...legend,
                findings: updatedFindings,
              };
            }
            // Si no existe, lo agregamos
            else {
              return {
                ...legend,
                findings: [...legend.findings, newFinding],
              };
            }
          }
        }
        return legend;
      });

      return {
        [findingKey]: updatedFindings,
      };
    });
  },

  // Función para calcular el diseño dinámico para la opción 26
  calculateDynamicDesignFinding26: (params) => {
    const {
      id,
      origin = "spaceBetweenFinding26",
      optionId,
      subOptionId,
      color,
      isLowerTeeth = false,
    } = params;

    set((state) => {
      const teeth = useDentalDataStore.getState().teeth;
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding26Lower' : 'intermediateSpaceOnTheCanvasOfFinding26';
      const currentFindings = state[findingKey] || [];

      const updatedFindings = currentFindings.map((legend) => {
        if (legend.id === id) {
          let newDynamicDesign = 1; // valor por defecto

          // Puedes agregar lógica aquí para determinar el diseño basado en los findings
          // Por ejemplo, podrías evaluar todos los findings y seleccionar un diseño basado en ellos

          return {
            ...legend,
            dynamicDesign: newDynamicDesign,
          };
        }
        return legend;
      });

      return {
        [findingKey]: updatedFindings,
      };
    });
  },
  toggleColorSpaceBetweenFinding30: (params) => {
    // Sección de la gestión del diseño del hallazgo 30
    const { id, newColor, optionId, subOptionId } = params;

    // Determinar si es diente inferior basándose en el ID (IDs de dientes inferiores empiezan con 5)
    const isLowerTeeth = id >= 53000000;
    
    set((state) => {
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding30Lower' : 'intermediateSpaceOnTheCanvasOfFinding30';
      const currentFindings = state[findingKey] || [];
      
      const updatedFindings = currentFindings.map((legend) => {
        if (legend.id === id) {
          const updatedColor =
            JSON.stringify(legend.color) === JSON.stringify(newColor)
              ? null
              : newColor;
          return {
            ...legend,
            color: updatedColor,
          };
        }
        return legend;
      });

      return {
        [findingKey]: updatedFindings,
      };
    });

    get().calculateDynamicDesignFinding30({
      id,
      optionId,
      subOptionId,
      color: newColor,
      origin: "spaceBetweenFinding30",
      isLowerTeeth,
    });
  },

  calculateDynamicDesignFinding30: (params) => {
    const {
      id,
      origin = "spaceBetweenFinding30",
      optionId,
      subOptionId,
      color,
      isLowerTeeth = false,
    } = params;

    set((state) => {
      const teeth = useDentalDataStore.getState().teeth;
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding30Lower' : 'intermediateSpaceOnTheCanvasOfFinding30';
      const currentFindings = state[findingKey] || [];
      
      const updatedFindings = currentFindings.map((legend) => {
        if (legend.id === id) {
          const leftTooth = teeth.find(
            (tooth) => tooth.id === legend.leftToothId
          );
          const rightTooth = teeth.find(
            (tooth) => tooth.id === legend.rightToothId
          );

          // Encontrar los hallazgos específicos
          const leftFinding = leftTooth?.findings.find(
            (f) => f.optionId === optionId
          );
          const rightFinding = rightTooth?.findings.find(
            (f) => f.optionId === optionId
          );

          // Validar explícitamente si hay color en cada caso
          const leftColor =
            leftFinding?.color != null &&
            Object.keys(leftFinding.color).length > 0;
          const rightColor =
            rightFinding?.color != null &&
            Object.keys(rightFinding.color).length > 0;
          const hasColor =
            legend.color != null && Object.keys(legend.color).length > 0;

          let newDynamicDesign = 2; // valor por defecto

          if (hasColor) {
            if (leftColor && rightColor) {
              newDynamicDesign = 3;
            } else if (leftColor) {
              newDynamicDesign = 1;
            } else if (rightColor) {
              newDynamicDesign = 2;
            }
          }

          return { ...legend, dynamicDesign: newDynamicDesign };
        }
        return legend;
      });

      return {
        [findingKey]: updatedFindings,
      };
    });

    if (origin === "spaceBetweenFinding30") {
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding30Lower' : 'intermediateSpaceOnTheCanvasOfFinding30';
      const legend = get()[findingKey]?.find((l) => l.id === id);
      if (legend) {
        if (legend.leftToothId) {
          useDentalDataStore.getState().calculateFinding30Design({
            toothId: legend.leftToothId,
            optionId,
            subOptionId,
            color,
            origin: "spaceBetweenFinding30",
          });
        }
        if (legend.rightToothId) {
          useDentalDataStore.getState().calculateFinding30Design({
            toothId: legend.rightToothId,
            optionId,
            subOptionId,
            color,
            origin: "spaceBetweenFinding30",
          });
        }
      }
    }
  },
  toggleColorSpaceBetweenFinding31: (params) => {
    // Sección de la gestión del diseño del hallazgo 31
    // Los hallazgos 7 y 31 solo funcionan cuando se hace click en dientes, no en espacios
    // Por lo tanto, esta función no debe hacer nada
    return;
  },

  calculateDynamicDesignFinding31: (params) => {
    const {
      id,
      origin = "spaceBetweenFinding31",
      optionId,
      subOptionId,
      color,
      isLowerTeeth = false,
    } = params;

    set((state) => {
      const teeth = useDentalDataStore.getState().teeth;
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding31Lower' : 'intermediateSpaceOnTheCanvasOfFinding31';
      const currentFindings = state[findingKey] || [];
      
      const updatedFindings = currentFindings.map((legend) => {
        if (legend.id === id) {
          const leftTooth = teeth.find(
            (tooth) => tooth.id === legend.leftToothId
          );
          const rightTooth = teeth.find(
            (tooth) => tooth.id === legend.rightToothId
          );

          // Encontrar los hallazgos específicos
          const leftFinding = leftTooth?.findings.find(
            (f) => f.optionId === optionId
          );
          const rightFinding = rightTooth?.findings.find(
            (f) => f.optionId === optionId
          );
          // Validar explícitamente si hay color en cada caso
          const leftColor =
            leftFinding?.color != null &&
            Object.keys(leftFinding.color).length > 0;
          const rightColor =
            rightFinding?.color != null &&
            Object.keys(rightFinding.color).length > 0;
          const hasColor =
            legend.color != null && Object.keys(legend.color).length > 0;

          let newDynamicDesign = 2; // valor por defecto

          if (hasColor) {
            if (leftColor && rightColor) {
              newDynamicDesign = 3;
            } else if (leftColor) {
              newDynamicDesign = 1;
            } else if (rightColor) {
              newDynamicDesign = 2;
            }
          }
          return { ...legend, dynamicDesign: newDynamicDesign, color };
        }
        return legend;
      });

      return {
        [findingKey]: updatedFindings,
      };
    });

    if (origin === "spaceBetweenFinding31") {
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding31Lower' : 'intermediateSpaceOnTheCanvasOfFinding31';
      const legend = get()[findingKey]?.find((l) => l.id === id);
      if (legend) {
        if (legend.leftToothId) {
          useDentalDataStore.getState().calculateFinding31Design({
            toothId: legend.leftToothId,
            optionId,
            subOptionId,
            color,
            origin: "spaceBetweenFinding31",
          });
        }
        if (legend.rightToothId) {
          useDentalDataStore.getState().calculateFinding31Design({
            toothId: legend.rightToothId,
            optionId,
            subOptionId,
            color,
            origin: "spaceBetweenFinding31",
          });
        }
      }
    }
  },
  toggleColorSpaceBetweenFinding32: (params) => {
    // Sección de la gestión del diseño del hallazgo 32
    const { id, newColor, optionId, subOptionId } = params;

    // Determinar si es diente inferior basándose en el ID (IDs de dientes inferiores empiezan con 5)
    const isLowerTeeth = id >= 53200000;
    
    set((state) => {
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding32Lower' : 'intermediateSpaceOnTheCanvasOfFinding32';
      const currentFindings = state[findingKey] || [];
      
      const updatedFindings = currentFindings.map((legend) => {
        if (legend.id === id) {
          const updatedColor =
            JSON.stringify(legend.color) === JSON.stringify(newColor)
              ? null
              : newColor;
          return {
            ...legend,
            color: updatedColor,
          };
        }
        return legend;
      });

      return {
        [findingKey]: updatedFindings,
      };
    });

    get().calculateDynamicDesignFinding32({
      id,
      optionId,
      subOptionId,
      color: newColor,
      origin: "spaceBetweenFinding32",
      isLowerTeeth,
    });
  },

  calculateDynamicDesignFinding32: (params) => {
    const {
      id,
      origin = "spaceBetweenFinding32",
      optionId,
      subOptionId,
      color,
      isLowerTeeth = false,
    } = params;

    set((state) => {
      const teeth = useDentalDataStore.getState().teeth;
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding32Lower' : 'intermediateSpaceOnTheCanvasOfFinding32';
      const currentFindings = state[findingKey] || [];
      
      const updatedFindings = currentFindings.map((legend) => {
        if (legend.id === id) {
          const leftTooth = teeth.find(
            (tooth) => tooth.id === legend.leftToothId
          );
          const rightTooth = teeth.find(
            (tooth) => tooth.id === legend.rightToothId
          );

          // Encontrar los hallazgos específicos
          const leftFinding = leftTooth?.findings.find(
            (f) => f.optionId === optionId
          );
          const rightFinding = rightTooth?.findings.find(
            (f) => f.optionId === optionId
          );

          // Validar explícitamente si hay color en cada caso
          const leftColor =
            leftFinding?.color != null &&
            Object.keys(leftFinding.color).length > 0;
          const rightColor =
            rightFinding?.color != null &&
            Object.keys(rightFinding.color).length > 0;
          const hasColor =
            legend.color != null && Object.keys(legend.color).length > 0;

          let newDynamicDesign = 2; // valor por defecto

          if (hasColor) {
            if (leftColor && rightColor) {
              newDynamicDesign = 3;
            } else if (leftColor) {
              newDynamicDesign = 1;
            } else if (rightColor) {
              newDynamicDesign = 2;
            }
          }

          return { ...legend, dynamicDesign: newDynamicDesign };
        }
        return legend;
      });

      return {
        [findingKey]: updatedFindings,
      };
    });

    if (origin === "spaceBetweenFinding32") {
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding32Lower' : 'intermediateSpaceOnTheCanvasOfFinding32';
      const legend = get()[findingKey]?.find((l) => l.id === id);
      if (legend) {
        if (legend.leftToothId) {
          useDentalDataStore.getState().calculateFinding32Design({
            toothId: legend.leftToothId,
            optionId,
            subOptionId,
            color,
            origin: "spaceBetweenFinding32",
          });
        }
        if (legend.rightToothId) {
          useDentalDataStore.getState().calculateFinding32Design({
            toothId: legend.rightToothId,
            optionId,
            subOptionId,
            color,
            origin: "spaceBetweenFinding32",
          });
        }
      }
    }
  },
  toggleColorSpaceBetweenFinding39: (params) => {
    const {
      id,
      newColor,
      optionId,
      subOptionId,
    } = params;

    // Determinar si es diente inferior basándose en el ID (IDs de dientes inferiores empiezan con 5)
    const isLowerTeeth = id >= 53900000;

    set((state) => {
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding39Lower' : 'intermediateSpaceOnTheCanvasOfFinding39';
      const currentFindings = state[findingKey] || [];
      
      const updatedFindings = currentFindings.map((legend) => {
        if (legend.id === id) {
          // Verificamos si ya existe un finding con estos valores
          const existingFindingIndex = legend.findings.findIndex(
            (f) => f.optionId === optionId && f.subOptionId === subOptionId
          );

          // Si ya existe un finding igual y tiene el mismo color, lo eliminamos (toggle off)
          if (
            existingFindingIndex !== -1 &&
            JSON.stringify(legend.findings[existingFindingIndex].color) ===
              JSON.stringify(newColor)
          ) {
            // Filtrar el finding a eliminar
            const updatedFindings = legend.findings.filter(
              (_, index) => index !== existingFindingIndex
            );

            return {
              ...legend,
              findings: updatedFindings,
            };
          }
          // Si no existe o tiene diferente color, lo agregamos o actualizamos
          else {
            // Crear nuevo finding con datos clínicos
            const newFinding = {
              uniqueId: Math.floor(Math.random() * 1000000),
              optionId,
              subOptionId,
              color: newColor,
              dynamicDesign: 1,
            };

            // Si ya existe un finding similar, lo actualizamos
            if (existingFindingIndex !== -1) {
              const updatedFindings = [...legend.findings];
              updatedFindings[existingFindingIndex] = newFinding;

              return {
                ...legend,
                findings: updatedFindings,
              };
            }
            // Si no existe, lo agregamos
            else {
              return {
                ...legend,
                findings: [...legend.findings, newFinding],
              };
            }
          }
        }
        return legend;
      });

      return {
        [findingKey]: updatedFindings,
      };
    });
    
    get().calculateDynamicDesignFinding39({
      id,
      optionId,
      subOptionId,
      color: newColor,
      origin: "spaceBetweenFinding39",
      isLowerTeeth,
    });
  },

  // Función para calcular el diseño dinámico para la opción 39
  calculateDynamicDesignFinding39: (params) => {
    const {
      id,
      origin = "spaceBetweenFinding39",
      optionId,
      subOptionId,
      color,
      isLowerTeeth = false,
    } = params;
    
    set((state) => {
      const teeth = useDentalDataStore.getState().teeth;
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding39Lower' : 'intermediateSpaceOnTheCanvasOfFinding39';
      const currentFindings = state[findingKey] || [];
      
      const updatedFindings = currentFindings.map((legend) => {
        if (legend.id === id) {
          // Para el hallazgo 39, siempre usamos diseño 1 (el componente se encarga de la inversión)
          let newDynamicDesign = 1;
          
          return {
            ...legend,
            dynamicDesign: newDynamicDesign,
          };
        }
        return legend;
      });
      
      return {
        [findingKey]: updatedFindings,
      };
    });
  
    // Notificar a los dientes si el origen es desde el espacio intermedio
    if (origin === "spaceBetweenFinding39") {
      const findingKey = isLowerTeeth ? 'intermediateSpaceOnTheCanvasOfFinding39Lower' : 'intermediateSpaceOnTheCanvasOfFinding39';
      const legend = get()[findingKey]?.find((l) => l.id === id);
      
      if (legend) {
        if (legend.leftToothId) {
          useDentalDataStore.getState().calculateFinding39Design({
            toothId: legend.leftToothId,
            optionId,
            subOptionId,
            color,
            // Corregido: usar el origen correcto
            origin: "spaceBetweenFinding39",
          });
        }
        
        if (legend.rightToothId) {
          useDentalDataStore.getState().calculateFinding39Design({
            toothId: legend.rightToothId,
            optionId,
            subOptionId,
            color,
            // Corregido: usar el origen correcto
            origin: "spaceBetweenFinding39",
          });
        }
      }
    }
  },
  
  // ===== FUNCIONES PARA DIENTES INFERIORES =====
  
  // Función para manejar clicks en espacios de dientes inferiores
  toggleColorSpaceBetweenFindingLower: (params: any) => {
    const {
      id,
      newColor,
      optionId,
      subOptionId,
      findingType, // 'finding1', 'finding2', etc.
    } = params;

    set((state: any) => {
      const findingKey = `intermediateSpaceOnTheCanvasOfFinding${findingType}Lower`;
      const currentFindings = state[findingKey] || [];

      const updatedFindings = currentFindings.map((legend: any) => {
        if (legend.id === id) {
          // Verificamos si ya existe un finding con estos valores
          const existingFindingIndex = legend.findings.findIndex(
            (f: any) => f.optionId === optionId && f.subOptionId === subOptionId
          );

          // Si ya existe un finding igual y tiene el mismo color, lo eliminamos (toggle off)
          if (
            existingFindingIndex !== -1 &&
            JSON.stringify(legend.findings[existingFindingIndex].color) ===
              JSON.stringify(newColor)
          ) {
            // Filtrar el finding a eliminar
            const updatedFindings = legend.findings.filter(
              (_: any, index: number) => index !== existingFindingIndex
            );

            return {
              ...legend,
              findings: updatedFindings,
            };
          }
          // Si no existe o tiene diferente color, lo agregamos o actualizamos
          else {
            // Crear nuevo finding con datos clínicos
            const newFinding = {
              uniqueId: Math.floor(Math.random() * 1000000),
              optionId,
              subOptionId,
              color: newColor,
              dynamicDesign: 1,
            };

            // Si ya existe un finding similar, lo actualizamos
            if (existingFindingIndex !== -1) {
              const updatedFindings = [...legend.findings];
              updatedFindings[existingFindingIndex] = newFinding;

              return {
                ...legend,
                findings: updatedFindings,
              };
            }
            // Si no existe, lo agregamos
            else {
              return {
                ...legend,
                findings: [...legend.findings, newFinding],
              };
            }
          }
        }
        return legend;
      });

      return {
        [findingKey]: updatedFindings,
      };
    });
  },

  // Función para calcular el diseño dinámico para dientes inferiores
  calculateDynamicDesignFindingLower: (params: any) => {
    const {
      id,
      origin = "spaceBetweenFindingLower",
      optionId,
      subOptionId,
      color,
      findingType, // 'finding1', 'finding2', etc.
    } = params;
    
    set((state: any) => {
      const teeth = useDentalDataStore.getState().teeth;
      
      const findingKey = `intermediateSpaceOnTheCanvasOfFinding${findingType}Lower`;
      const currentFindings = state[findingKey] || [];
      
      const updatedFindings = currentFindings.map((legend: any) => {
        if (legend.id === id) {
          let newDynamicDesign = 1; // valor por defecto
          // Puedes agregar lógica aquí para determinar el diseño basado en los findings
          return {
            ...legend,
            dynamicDesign: newDynamicDesign,
          };
        }
        return legend;
      });
      
      return {
        [findingKey]: updatedFindings,
      };
    });
  
    // Notificar a los dientes si el origen es desde el espacio intermedio
    if (origin === "spaceBetweenFindingLower") {
      const findingKey = `intermediateSpaceOnTheCanvasOfFinding${findingType}Lower`;
      const legend = get()[findingKey]?.find((l: any) => l.id === id);
      
      if (legend) {
        if (legend.leftToothId) {
          useDentalDataStore.getState().registerFinding({
            toothId: legend.leftToothId,
            optionId,
            subOptionId,
            color,
            origin: "spaceBetweenFindingLower",
          });
        }
        
        if (legend.rightToothId) {
          useDentalDataStore.getState().registerFinding({
            toothId: legend.rightToothId,
            optionId,
            subOptionId,
            color,
            origin: "spaceBetweenFindingLower",
          });
        }
      }
    }
  },
  }));
}

// Backward-compatible default export: wrap the vanilla store in a hook-like API
let __adultDentalStoreRef: any;
const __getDentalStore = () => __adultDentalStoreRef as StoreApi<any>;
const __adultSpaceBetweenVanilla = createAdultSpaceBetweenDataStore(__getDentalStore);

type ZustandHookLike = (<T>(selector: (state: any) => T) => T) & {
  getState: typeof __adultSpaceBetweenVanilla.getState;
};

const useAdultSpaceBetweenLegendsDataStore: ZustandHookLike = ((selector: any) =>
  useStore(__adultSpaceBetweenVanilla as any, selector)) as any;
useAdultSpaceBetweenLegendsDataStore.getState = __adultSpaceBetweenVanilla.getState;

// Lazy link to adult dental default to resolve circular dependency at runtime
import("./adultDentalData")
  .then((m) => {
    __adultDentalStoreRef = (m as any).default;
  })
  .catch(() => {});

export default useAdultSpaceBetweenLegendsDataStore;
