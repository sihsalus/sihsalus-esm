// @ts-nocheck
import { createStore, StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { teeth as initialTeeth } from "../data/odontogramData.json";
import { PositionUtils } from "../config/odontogramConfig";

// Función para deshabilitar console.log en este archivo
const debugLog = (...args: any[]) => {
};

export type AdultSpaceBetweenDataState = any;

export function createAdultDentalDataStore(
  getSpaceBetweenDataStore: () => StoreApi<AdultSpaceBetweenDataState>,
) {
  return createStore((set: any, get: any) => ({
  teeth: initialTeeth || [],

  registerFinding: (params) => {
    const { toothId, zoneId, optionId, subOptionId, color, design } = params;

    // El dynamicDesign que usaremos para el nuevo hallazgo
    const dynamicDesignValue = design?.number || null;

    // Crear el nuevo hallazgo con un ID único
    const newFinding = {
      uniqueId: Math.floor(Math.random() * 1000000),
      optionId,
      subOptionId,
      color,
      dynamicDesign: dynamicDesignValue,
    };



    set((state) => {
      // Caso especial para optionId = 31 o optionId = 7: aplicar solo a dientes de la misma posición
      if ((optionId === 31 || optionId === 7) && !zoneId) {

        
        // Obtener la posición del diente que se está modificando
        const targetTooth = state.teeth.find(t => t.id === toothId);
        const targetPosition = targetTooth?.position;
        
        if (!targetPosition) {
          return state; // Si no se encuentra el diente, no hacer nada
        }

        // Filtrar solo los dientes de la misma posición
        const updatedTeeth = state.teeth.map((tooth) => {
          if (tooth.position !== targetPosition) {
            return tooth; // No modificar dientes de otra posición
          }

          // Verificar si ya existe un hallazgo con mismo optionId y dynamicDesign
          const existingFindingIndex = tooth.findings.findIndex(
            (f) =>
              f.optionId === optionId && f.dynamicDesign === dynamicDesignValue
          );

          let updatedFindings;
          if (existingFindingIndex !== -1) {
            // Si existe, actualizar ese hallazgo
            debugLog('🔄 UPDATING EXISTING FINDING for tooth:', tooth.id);
            updatedFindings = [...tooth.findings];
            updatedFindings[existingFindingIndex] = newFinding;
          } else {
            // Si no existe, agregar uno nuevo
            debugLog('➕ ADDING NEW FINDING for tooth:', tooth.id);
            updatedFindings = [...tooth.findings, newFinding];
          }

          return {
            ...tooth,
            findings: updatedFindings,
          };
        });

        debugLog('✅ ROW FINDING APPLIED to', updatedTeeth.filter(t => t.position === targetPosition).length, 'teeth');
        return { teeth: updatedTeeth };
      }

      // Lógica para todos los demás casos
      const updatedTeeth = state.teeth.map((tooth) => {
        if (tooth.id === toothId) {
          debugLog('🎯 PROCESSING TOOTH:', toothId);
          
          if (zoneId) {
            debugLog('📍 PROCESSING ZONE:', zoneId);
            const updatedZones = tooth.zones.map((zone) => {
              if (zone.id === zoneId) {
                // Verificar si ya existe un hallazgo con mismo optionId y dynamicDesign
                const existingFindingIndex = zone.findings.findIndex(
                  (f) =>
                    f.optionId === optionId &&
                    f.dynamicDesign === dynamicDesignValue
                );

                if (existingFindingIndex !== -1) {
                  // Si existe, actualizar ese hallazgo
                  debugLog('🔄 UPDATING EXISTING ZONE FINDING');
                  const updatedFindings = [...zone.findings];
                  updatedFindings[existingFindingIndex] = newFinding;
                  return { ...zone, findings: updatedFindings };
                }

                // Si no existe, agregar uno nuevo
                debugLog('➕ ADDING NEW ZONE FINDING');
                return {
                  ...zone,
                  findings: [...zone.findings, newFinding],
                };
              }
              return zone;
            });

            return {
              ...tooth,
              zones: updatedZones,
            };
          }

          // Verificar si ya existe un hallazgo con mismo optionId y dynamicDesign
          const existingFindingIndex = tooth.findings.findIndex(
            (f) =>
              f.optionId === optionId && f.dynamicDesign === dynamicDesignValue
          );

          let updatedFindings;
          if (existingFindingIndex !== -1) {
            // Si existe, actualizar ese hallazgo
            debugLog('🔄 UPDATING EXISTING TOOTH FINDING');
            updatedFindings = [...tooth.findings];
            updatedFindings[existingFindingIndex] = newFinding;
          } else {
            // Si no existe, agregar uno nuevo
            debugLog('➕ ADDING NEW TOOTH FINDING');
            updatedFindings = [...tooth.findings, newFinding];
          }

          const updatedTooth = {
            ...tooth,
            findings: updatedFindings,
          };

          debugLog('✅ TOOTH UPDATED:', {
            toothId,
            findingsCount: updatedFindings.length,
            findings: updatedFindings
          });

          return updatedTooth;
        }
        return tooth;
      });

      return { teeth: updatedTeeth };
    });

    // Para el caso de optionId 31 o 7 aplicado a dientes de la misma posición
    if ((optionId === 31 || optionId === 7) && !zoneId) {
      debugLog('🎯 PROCESSING ROW FINDING CALCULATIONS');
      
      // Obtener la posición del diente que se está modificando
      const targetTooth = get().teeth.find(t => t.id === toothId);
      const targetPosition = targetTooth?.position;
      
      if (targetPosition) {
        // Filtrar solo los dientes de la misma posición
        const teethOfSamePosition = get().teeth.filter(t => t.position === targetPosition);
        
        debugLog('🦷 TEETH OF SAME POSITION:', teethOfSamePosition.map(t => t.id));
        
        teethOfSamePosition.forEach((tooth) => {
          if (optionId === 31) {
            debugLog('🎯 CALCULATING FINDING 31 DESIGN for tooth:', tooth.id);
            get().calculateFinding31Design({
              toothId: tooth.id,
              zoneId: null,
              optionId,
              subOptionId,
              color,
              origin: "tooth",
            });
          } else if (optionId === 7) {
            debugLog('🎯 CALCULATING FINDING 7 DESIGN for tooth:', tooth.id);
            get().calculateFinding7Design({
              toothId: tooth.id,
              zoneId: null,
              optionId,
              subOptionId,
              color,
              origin: "tooth",
            });
          }
        });
      }
    } else {
      // Solo calcular el diseño si no se proporcionó uno específico
      if (!design) {
        debugLog('🎨 CALCULATING DESIGN for optionId:', optionId);
        
        // Llamar a la función de cálculo de diseño específica según el optionId
        switch (optionId) {
          case 11:
            get().calculateFinding11Design({
              toothId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
            });
            break;
          case 1:
            get().calculateFinding1Design({
              toothId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
            });
            break;
          case 2:
            get().calculateFinding2Design({
              toothId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
            });
            break;
          case 3:
            get().calculateFinding3Design({
              toothId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
            });
            break;
          case 4:
            get().calculateFinding4Design({
              toothId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
            });
            break;
          case 7:
            get().calculateFinding7Design({
              toothId,
              zoneId,
              optionId,
              subOptionId,
              color,
              origin: "tooth",
            });
            break;
          case 20:
            get().calculateFinding20Design({
              toothId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
            });
            break;
          case 21:
            get().calculateFinding21Design({
              toothId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
            });
            break;
          case 23:
            get().calculateFinding23Design({
              toothId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
            });
            break;
          case 24:
            // Determinar si es diente inferior basándose en el ID del diente
            const isLowerTeeth = toothId >= 31 && toothId <= 48;
            get().calculateFinding24Design({
              toothId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
              isLowerTeeth,
            });
            break;
          case 25:
            get().calculateFinding25Design({
              toothId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
              isLowerTeeth: PositionUtils.isLowerTooth(String(toothId)),
            });
            break;
          case 28:
            get().calculateFinding28Design({
              toothId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
            });
            break;
          case 30:
            get().calculateFinding30Design({
              toothId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
            });
            break;
          case 31:
            get().calculateFinding31Design({
              toothId,
              zoneId,
              optionId,
              subOptionId,
              color,
              origin: "tooth",
            });
            break;
          case 32:
            get().calculateFinding32Design({
              toothId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
            });
            break;
          case 38:
            get().calculateFinding38Design({
              toothId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
            });
            break;
          case 39:
            get().calculateFinding39Design({
              toothId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
            });
            break;
          case 12:
            get().calculateFinding12Design({
              toothId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
            });
            break;
          default:
            break;
        }
      }
    }
  },

  removeFinding: (params) => {
    const { toothId, zoneId, optionId, subOptionId, dynamicDesign } = params;

    set((state) => {
      // Caso especial para optionId = 31 o optionId = 7: eliminar solo de dientes de la misma posición
      if ((optionId === 31 || optionId === 7) && !zoneId) {
        // Obtener la posición del diente que se está modificando
        const targetTooth = state.teeth.find(t => t.id === toothId);
        const targetPosition = targetTooth?.position;
        
        if (!targetPosition) {
          return state; // Si no se encuentra el diente, no hacer nada
        }

        const updatedTeeth = state.teeth.map((tooth) => {
          // Solo procesar dientes de la misma posición
          if (tooth.position !== targetPosition) {
            return tooth; // No modificar dientes de otra posición
          }

          // Si se especificó un dynamicDesign, solo eliminar esa combinación específica
          const updatedFindings = tooth.findings.filter(
            (f) =>
              !(
                f.optionId === optionId &&
                f.subOptionId === subOptionId &&
                (dynamicDesign === undefined ||
                  f.dynamicDesign === dynamicDesign)
              )
          );

          const updatedTooth = {
            ...tooth,
            findings: updatedFindings,
          };

          // Verificar si se eliminó un hallazgo con color
          const hadColor = tooth.findings.some(
            (f) =>
              f.optionId === optionId &&
              f.subOptionId === subOptionId &&
              (dynamicDesign === undefined ||
                f.dynamicDesign === dynamicDesign) &&
              f.color
          );

          if (hadColor) {
            updatedTooth.displayProperties = {
              ...updatedTooth.displayProperties,
              legendDesignColor: null,
            };
          }

          return updatedTooth;
        });

        return { teeth: updatedTeeth };
      }

      // Lógica para todos los demás casos
      const updatedTeeth = state.teeth.map((tooth) => {
        if (tooth.id === toothId) {
          if (zoneId) {
            const updatedZones = tooth.zones.map((zone) => {
              if (zone.id === zoneId) {
                return {
                  ...zone,
                  findings: zone.findings.filter(
                    (f) =>
                      !(
                        f.optionId === optionId &&
                        f.subOptionId === subOptionId &&
                        (dynamicDesign === undefined ||
                          f.dynamicDesign === dynamicDesign)
                      )
                  ),
                };
              }
              return zone;
            });
            return {
              ...tooth,
              zones: updatedZones,
            };
          }

          // Si se especificó un dynamicDesign, solo eliminar esa combinación específica
          const updatedFindings = tooth.findings.filter(
            (f) =>
              !(
                f.optionId === optionId &&
                f.subOptionId === subOptionId &&
                (dynamicDesign === undefined ||
                  f.dynamicDesign === dynamicDesign)
              )
          );

          const updatedTooth = {
            ...tooth,
            findings: updatedFindings,
          };

          // Verificar si se eliminó un hallazgo con color
          const hadColor = tooth.findings.some(
            (f) =>
              f.optionId === optionId &&
              f.subOptionId === subOptionId &&
              (dynamicDesign === undefined ||
                f.dynamicDesign === dynamicDesign) &&
              f.color
          );

          if (hadColor) {
            updatedTooth.displayProperties = {
              ...updatedTooth.displayProperties,
              legendDesignColor: null,
            };
          }

          return updatedTooth;
        }
        return tooth;
      });

      return { teeth: updatedTeeth };
    });

    // Para el caso de optionId 31 o 7 removido de todos los dientes
    if ((optionId === 31 || optionId === 7) && !zoneId) {
      // Obtener la posición del diente que se está modificando
      const targetTooth = get().teeth.find(t => t.id === toothId);
      const targetPosition = targetTooth?.position;
      
      if (targetPosition) {
        // Filtrar solo los dientes de la misma posición
        const teethOfSamePosition = get().teeth.filter(t => t.position === targetPosition);
        
        teethOfSamePosition.forEach((tooth) => {
          if (optionId === 31) {
            get().calculateFinding31Design({
              toothId: tooth.id,
              zoneId: null,
              optionId,
              subOptionId,
              color: null,
              origin: "tooth",
            });
          } else if (optionId === 7) {
            get().calculateFinding7Design({
              toothId: tooth.id,
              zoneId: null,
              optionId,
              subOptionId,
              origin: "tooth",
            });
          }
        });
      }
    } else {
      // Llamar a la función de cálculo de diseño específica según el optionId
      switch (optionId) {
        case 11:
          get().calculateFinding11Design({
            toothId,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
          });
          break;
        case 1:
          get().calculateFinding1Design({
            toothId,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
          });
          break;
        case 2:
          get().calculateFinding2Design({
            toothId,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
          });
          break;
        case 7:
          get().calculateFinding7Design({
            toothId,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
          });
          break;
        case 12:
          get().calculateFinding12Design({
            toothId,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
          });
          break;
        case 21:
          get().calculateFinding21Design({
            toothId,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
          });
          break;
        case 24:
          // Determinar si es diente inferior basándose en el ID del diente
          const isLowerTeeth = toothId >= 31 && toothId <= 48;
          get().calculateFinding24Design({
            toothId,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
            isLowerTeeth,
          });
          break;
        case 25:
          get().calculateFinding25Design({
            toothId,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
            isLowerTeeth: PositionUtils.isLowerTooth(String(toothId)),
          });
          break;
        case 30:
          get().calculateFinding30Design({
            toothId,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
          });
          break;
        case 31:
          get().calculateFinding31Design({
            toothId,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
          });
          break;
        case 32:
          get().calculateFinding32Design({
            toothId,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
          });
          break;
        case 39:
          get().calculateFinding39Design({
            toothId,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
          });
          break;
        default:
          break;
      }
    }
  },

  // Función para calcular el diseño del hallazgo 11 de la leyenda
  calculateFinding11Design: (params) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state) => {
      // Determinar si es diente inferior basándose en el ID (IDs de dientes inferiores empiezan con 3 o 4)
      const isLowerTeeth = PositionUtils.isLowerTooth(String(toothId));
      
      // Usar los datos correctos según la posición del diente
      const spaceBetweenLegends = isLowerTeeth 
  ? getSpaceBetweenDataStore().getState().spaceBetweenLegendsLower
  : getSpaceBetweenDataStore().getState().spaceBetweenLegends;
      
      const tooth = state.teeth.find((t) => t.id === toothId);

      if (!tooth) return state;

      // Obtener información de las leyendas
      const leftLegend = spaceBetweenLegends.find(
        (legend) =>
          legend.id === tooth.displayProperties.spaceBetweenLegendsLeftId
      );
      const rightLegend = spaceBetweenLegends.find(
        (legend) =>
          legend.id === tooth.displayProperties.spaceBetweenLegendsRightId
      );

      const hasLeftColor = leftLegend?.color !== null;
      const hasRightColor = rightLegend?.color !== null;

      // Calcular el diseño
      let newDynamicDesign = 1;
      if (!leftLegend) newDynamicDesign = 1;
      else if (!rightLegend) newDynamicDesign = 2;
      else if (hasLeftColor && hasRightColor) newDynamicDesign = 3;
      else if (hasLeftColor) newDynamicDesign = 2;
      else if (hasRightColor) newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding) => {
                  if (
                    finding.optionId === optionId &&
                    finding.subOptionId === subOptionId
                  ) {
                    return {
                      ...finding,
                      dynamicDesign: newDynamicDesign,
                    };
                  }
                  return finding;
                });
                return { ...zone, findings: updatedFindings };
              }
              return zone;
            });
            return { ...t, zones: updatedZones };
          } else {
            // Actualizar hallazgo a nivel de diente
            const updatedFindings = t.findings.map((finding) => {
              if (
                finding.optionId === optionId &&
                finding.subOptionId === subOptionId
              ) {
                return {
                  ...finding,
                  dynamicDesign: newDynamicDesign,
                };
              }
              return finding;
            });
            return { ...t, findings: updatedFindings };
          }
        }
        return t;
      });

      return { teeth: updatedTeeth };
    });

    // Solo notificar a las leyendas si el origen es 'tooth'
    if (origin === "tooth") {
      const state = get();
      const tooth = state.teeth.find((t) => t.id === toothId);
      if (tooth) {
        // Determinar si es diente inferior basándose en el ID
        const isLowerTeeth = PositionUtils.isLowerTooth(String(toothId));
        
        // Notificar a la leyenda izquierda si existe
        if (tooth.displayProperties.spaceBetweenLegendsLeftId) {
          getSpaceBetweenDataStore()
            .getState()
            .calculateDynamicDesignForLegend({
              legendId: tooth.displayProperties.spaceBetweenLegendsLeftId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
              isLowerTeeth,
            });
        }
        // Notificar a la leyenda derecha si existe
        if (tooth.displayProperties.spaceBetweenLegendsRightId) {
          getSpaceBetweenDataStore()
            .getState()
            .calculateDynamicDesignForLegend({
              legendId: tooth.displayProperties.spaceBetweenLegendsRightId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
              isLowerTeeth,
            });
        }
      }
    }
  },
  // Función para calcular el diseño del hallazgo 1
  calculateFinding1Design: (params) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state) => {
      // Determinar si es diente inferior basándose en el ID (IDs de dientes inferiores empiezan con 3 o 4)
      const isLowerTeeth = PositionUtils.isLowerTooth(String(toothId));
      
      // Usar los datos correctos según la posición del diente
      const intermediateSpaceOnTheCanvasOfFinding1 = isLowerTeeth
  ? getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding1Lower
  : getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding1;
      
      const tooth = state.teeth.find((t) => t.id === toothId);

      if (!tooth) return state;

      // Buscar los espacios intermedios para el diente actual
      const leftLegend =
        intermediateSpaceOnTheCanvasOfFinding1.find(
          (space) => space.rightToothId === toothId
        ) || null;

      const rightLegend =
        intermediateSpaceOnTheCanvasOfFinding1.find(
          (space) => space.leftToothId === toothId
        ) || null;

      const hasLeftColor = leftLegend?.color !== null;
      const hasRightColor = rightLegend?.color !== null;

      // Calcular el diseño
      let newDynamicDesign = 1;
      if (!leftLegend) newDynamicDesign = 1;
      else if (!rightLegend) newDynamicDesign = 2;
      else if (hasLeftColor && hasRightColor) newDynamicDesign = 3;
      else if (hasLeftColor) newDynamicDesign = 2;
      else if (hasRightColor) newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding) => {
                  if (
                    finding.optionId === optionId &&
                    finding.subOptionId === subOptionId
                  ) {
                    return {
                      ...finding,
                      dynamicDesign: newDynamicDesign,
                    };
                  }
                  return finding;
                });
                return { ...zone, findings: updatedFindings };
              }
              return zone;
            });
            return { ...t, zones: updatedZones };
          } else {
            // Actualizar hallazgo a nivel de diente
            const updatedFindings = t.findings.map((finding) => {
              if (
                finding.optionId === optionId &&
                finding.subOptionId === subOptionId
              ) {
                return {
                  ...finding,
                  dynamicDesign: newDynamicDesign,
                };
              }
              return finding;
            });
            return { ...t, findings: updatedFindings };
          }
        }
        return t;
      });

      return { teeth: updatedTeeth };
    });

    // Solo notificar a las leyendas si el origen es 'tooth'
    if (origin === "tooth") {
      // Determinar si es diente inferior basándose en el ID
      const isLowerTeeth = PositionUtils.isLowerTooth(String(toothId));
      
      // Usar los datos correctos según la posición del diente
      const intermediateSpaceOnTheCanvasOfFinding1 = isLowerTeeth
  ? getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding1Lower
  : getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding1;
      
      // Buscar los espacios intermedios para el diente actual
      const leftSpace = intermediateSpaceOnTheCanvasOfFinding1.find(
        (space) => space.rightToothId === toothId
      );
      const rightSpace = intermediateSpaceOnTheCanvasOfFinding1.find(
        (space) => space.leftToothId === toothId
      );
      // Notificar al espacio izquierdo si existe
      if (leftSpace) {
  getSpaceBetweenDataStore()
          .getState()
          .calculateDynamicDesignFinding1({
            id: leftSpace.id,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
            isLowerTeeth,
          });
      }

      // Notificar al espacio derecho si existe
      if (rightSpace) {
  getSpaceBetweenDataStore()
          .getState()
          .calculateDynamicDesignFinding1({
            id: rightSpace.id,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
            isLowerTeeth,
          });
      }
    }
  },
  calculateFinding2Design: (params) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    debugLog('🎯 CALCULATING FINDING 2 DESIGN:', {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin
    });

    set((state) => {
      // Determinar si es diente inferior basándose en el ID (IDs de dientes inferiores empiezan con 3 o 4)
      const isLowerTeeth = PositionUtils.isLowerTooth(String(toothId));
      
      // Usar los datos correctos según la posición del diente
      const intermediateSpaceOnTheCanvasOfFinding2 = isLowerTeeth
  ? getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding2Lower
  : getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding2;
      
      const tooth = state.teeth.find((t) => t.id === toothId);

      if (!tooth) return state;

      // Buscar los espacios intermedios para el diente actual
      const leftLegend =
        intermediateSpaceOnTheCanvasOfFinding2.find(
          (space) => space.rightToothId === toothId
        ) || null;

      const rightLegend =
        intermediateSpaceOnTheCanvasOfFinding2.find(
          (space) => space.leftToothId === toothId
        ) || null;

      const hasLeftColor = leftLegend?.color !== null;
      const hasRightColor = rightLegend?.color !== null;

      // Calcular el diseño
      let newDynamicDesign = 1;
      if (!leftLegend) newDynamicDesign = 1;
      else if (!rightLegend) newDynamicDesign = 2;
      else if (hasLeftColor && hasRightColor) newDynamicDesign = 3;
      else if (hasLeftColor) newDynamicDesign = 2;
      else if (hasRightColor) newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding) => {
                  if (
                    finding.optionId === optionId &&
                    finding.subOptionId === subOptionId
                  ) {
                    return {
                      ...finding,
                      dynamicDesign: newDynamicDesign,
                    };
                  }
                  return finding;
                });
                return { ...zone, findings: updatedFindings };
              }
              return zone;
            });
            return { ...t, zones: updatedZones };
          } else {
            // Actualizar hallazgo a nivel de diente
            const updatedFindings = t.findings.map((finding) => {
              if (
                finding.optionId === optionId &&
                finding.subOptionId === subOptionId
              ) {
                return {
                  ...finding,
                  dynamicDesign: newDynamicDesign,
                };
              }
              return finding;
            });
            return { ...t, findings: updatedFindings };
          }
        }
        return t;
      });

      return { teeth: updatedTeeth };
    });

    // ELIMINADO: Comportamiento bidireccional - ya no notifica a espacios adyacentes
    debugLog('🎯 HALLAZGO 2: Comportamiento bidireccional eliminado - solo afecta al diente específico');
  },
  calculateFinding3Design: (params) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t) => t.id === toothId);

      if (!tooth) return state;

      // Siempre asignamos el diseño 1
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding) => {
                  if (
                    finding.optionId === optionId &&
                    finding.subOptionId === subOptionId
                  ) {
                    return {
                      ...finding,
                      dynamicDesign: newDynamicDesign,
                    };
                  }
                  return finding;
                });
                return { ...zone, findings: updatedFindings };
              }
              return zone;
            });
            return { ...t, zones: updatedZones };
          } else {
            // Actualizar hallazgo a nivel de diente
            const updatedFindings = t.findings.map((finding) => {
              if (
                finding.optionId === optionId &&
                finding.subOptionId === subOptionId
              ) {
                return {
                  ...finding,
                  dynamicDesign: newDynamicDesign,
                };
              }
              return finding;
            });
            return { ...t, findings: updatedFindings };
          }
        }
        return t;
      });

      return { teeth: updatedTeeth };
    });

    // Solo notificar a las leyendas si el origen es 'tooth'
  },
  calculateFinding4Design: (params) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t) => t.id === toothId);

      if (!tooth) return state;

      // Siempre asignamos el diseño 1
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding) => {
                  if (
                    finding.optionId === optionId &&
                    finding.subOptionId === subOptionId
                  ) {
                    return {
                      ...finding,
                      dynamicDesign: newDynamicDesign,
                    };
                  }
                  return finding;
                });
                return { ...zone, findings: updatedFindings };
              }
              return zone;
            });
            return { ...t, zones: updatedZones };
          } else {
            // Actualizar hallazgo a nivel de diente
            const updatedFindings = t.findings.map((finding) => {
              if (
                finding.optionId === optionId &&
                finding.subOptionId === subOptionId
              ) {
                return {
                  ...finding,
                  dynamicDesign: newDynamicDesign,
                };
              }
              return finding;
            });
            return { ...t, findings: updatedFindings };
          }
        }
        return t;
      });

      return { teeth: updatedTeeth };
    });

    // Solo notificar a las leyendas si el origen es 'tooth'
  },
  calculateFinding7Design: (params) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      color,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;
    
    debugLog('🎯 CALCULATING FINDING 7 DESIGN:', {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      color,
      origin
    });
    
    set((state) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t) => t.id === toothId);

      if (!tooth) return state;

      // Siempre asignamos el diseño 1
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding) => {
                  if (
                    finding.optionId === optionId &&
                    finding.subOptionId === subOptionId
                  ) {
                    return {
                      ...finding,
                      dynamicDesign: newDynamicDesign,
                    };
                  }
                  return finding;
                });
                return { ...zone, findings: updatedFindings };
              }
              return zone;
            });
            return { ...t, zones: updatedZones };
          } else {
            // Actualizar hallazgo a nivel de diente
            const updatedFindings = t.findings.map((finding) => {
              if (
                finding.optionId === optionId &&
                finding.subOptionId === subOptionId
              ) {
                return {
                  ...finding,
                  dynamicDesign: newDynamicDesign,
                };
              }
              return finding;
            });
            return { ...t, findings: updatedFindings };
          }
        }
        return t;
      });

      return { teeth: updatedTeeth };
    });

    // Solo notificar a las leyendas si el origen es 'tooth'
    if (origin === "tooth") {
      debugLog("🎯 ENTRANDO A ACTUALIZAR ESPACIOS PARA HALLAZGO 7");
      
      // Determinar si es diente inferior basándose en el ID (IDs de dientes inferiores empiezan con 3 o 4)
      const isLowerTeeth = PositionUtils.isLowerTooth(String(toothId));
      
      debugLog('📍 IS LOWER TEETH:', isLowerTeeth);
      
      // Usar los datos correctos según la posición del diente
      const intermediateSpaceOnTheCanvasOfFinding7 = isLowerTeeth
  ? getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding7Lower
  : getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding7;
      
      debugLog('📊 ESPACIOS DISPONIBLES:', {
        count: intermediateSpaceOnTheCanvasOfFinding7.length,
        spaces: intermediateSpaceOnTheCanvasOfFinding7.map(s => ({ id: s.id, leftToothId: s.leftToothId, rightToothId: s.rightToothId }))
      });
      
      // Buscar los espacios intermedios para el diente actual
      const leftSpace = intermediateSpaceOnTheCanvasOfFinding7.find(
        (space) => space.rightToothId === toothId
      );
      debugLog("📏 LEFT SPACE:", leftSpace ? { id: leftSpace.id, leftToothId: leftSpace.leftToothId, rightToothId: leftSpace.rightToothId } : 'NO ENCONTRADO');
      
      const rightSpace = intermediateSpaceOnTheCanvasOfFinding7.find(
        (space) => space.leftToothId === toothId
      );
      debugLog("📏 RIGHT SPACE:", rightSpace ? { id: rightSpace.id, leftToothId: rightSpace.leftToothId, rightToothId: rightSpace.rightToothId } : 'NO ENCONTRADO');
      
      // Notificar al espacio izquierdo si existe
      if (leftSpace) {
        debugLog('🔄 ACTUALIZANDO ESPACIO IZQUIERDO:', leftSpace.id);
  getSpaceBetweenDataStore()
          .getState()
          .calculateDynamicDesignFinding7({
            id: leftSpace.id,
            zoneId,
            optionId,
            subOptionId,
            color,
            origin: "tooth",
            isLowerTeeth,
          });
      }

      // Notificar al espacio derecho si existe
      if (rightSpace) {
        debugLog('🔄 ACTUALIZANDO ESPACIO DERECHO:', rightSpace.id);
  getSpaceBetweenDataStore()
          .getState()
          .calculateDynamicDesignFinding7({
            id: rightSpace.id,
            zoneId,
            optionId,
            subOptionId,
            color,
            origin: "tooth",
            isLowerTeeth,
          });
      }
      
      debugLog('✅ ACTUALIZACIÓN DE ESPACIOS COMPLETADA');
    }
  },
  calculateFinding20Design: (params) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t) => t.id === toothId);

      if (!tooth) return state;

      // Siempre asignamos el diseño 1
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding) => {
                  if (
                    finding.optionId === optionId &&
                    finding.subOptionId === subOptionId
                  ) {
                    return {
                      ...finding,
                      dynamicDesign: newDynamicDesign,
                    };
                  }
                  return finding;
                });
                return { ...zone, findings: updatedFindings };
              }
              return zone;
            });
            return { ...t, zones: updatedZones };
          } else {
            // Actualizar hallazgo a nivel de diente
            const updatedFindings = t.findings.map((finding) => {
              if (
                finding.optionId === optionId &&
                finding.subOptionId === subOptionId
              ) {
                return {
                  ...finding,
                  dynamicDesign: newDynamicDesign,
                };
              }
              return finding;
            });
            return { ...t, findings: updatedFindings };
          }
        }
        return t;
      });

      return { teeth: updatedTeeth };
    });

    // Solo notificar a las leyendas si el origen es 'tooth'
  },
  calculateFinding23Design: (params) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t) => t.id === toothId);

      if (!tooth) return state;

      // Siempre asignamos el diseño 1
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding) => {
                  if (
                    finding.optionId === optionId &&
                    finding.subOptionId === subOptionId
                  ) {
                    return {
                      ...finding,
                      dynamicDesign: newDynamicDesign,
                    };
                  }
                  return finding;
                });
                return { ...zone, findings: updatedFindings };
              }
              return zone;
            });
            return { ...t, zones: updatedZones };
          } else {
            // Actualizar hallazgo a nivel de diente
            const updatedFindings = t.findings.map((finding) => {
              if (
                finding.optionId === optionId &&
                finding.subOptionId === subOptionId
              ) {
                return {
                  ...finding,
                  dynamicDesign: newDynamicDesign,
                };
              }
              return finding;
            });
            return { ...t, findings: updatedFindings };
          }
        }
        return t;
      });

      return { teeth: updatedTeeth };
    });

    // Solo notificar a las leyendas si el origen es 'tooth'
  },

  calculateFinding24Design: (params) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
      isLowerTeeth = false,
    } = params;

    set((state) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t) => t.id === toothId);

      if (!tooth) return state;

      // Lógica de inversión: 1 para superior (flecha hacia abajo), 2 para inferior (flecha hacia arriba)
      let newDynamicDesign = isLowerTeeth ? 2 : 1;
      
      debugLog('🎨 CALCULATING FINDING 24 DESIGN (Tooth):', {
        toothId,
        isLowerTeeth,
        newDynamicDesign,
        designMeaning: newDynamicDesign === 1 ? 'Flecha hacia abajo (Superior)' : 'Flecha hacia arriba (Inferior)',
        condition: `isLowerTeeth ? 2 : 1 = ${isLowerTeeth ? 2 : 1}`
      });

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding) => {
                  if (
                    finding.optionId === optionId &&
                    finding.subOptionId === subOptionId
                  ) {
                    return {
                      ...finding,
                      dynamicDesign: newDynamicDesign,
                    };
                  }
                  return finding;
                });
                return { ...zone, findings: updatedFindings };
              }
              return zone;
            });
            return { ...t, zones: updatedZones };
          } else {
            // Actualizar hallazgo a nivel de diente
            const updatedFindings = t.findings.map((finding) => {
              if (
                finding.optionId === optionId &&
                finding.subOptionId === subOptionId
              ) {
                return {
                  ...finding,
                  dynamicDesign: newDynamicDesign,
                };
              }
              return finding;
            });
            return { ...t, findings: updatedFindings };
          }
        }
        return t;
      });

      return { teeth: updatedTeeth };
    });

    // Solo notificar a las leyendas si el origen es 'tooth'
  },
  calculateFinding25Design: (params) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
      isLowerTeeth = false,
    } = params;

    debugLog('🎯 CALCULATING FINDING 25 DESIGN (Tooth):', {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin,
      isLowerTeeth,
    });

    set((state) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t) => t.id === toothId);

      if (!tooth) return state;

      // Determinar el diseño basado en la posición: 1 para superiores (flecha arriba), 2 para inferiores (flecha abajo)
      let newDynamicDesign = isLowerTeeth ? 2 : 1;

      debugLog('🎨 NEW DYNAMIC DESIGN (Tooth) - FINDING 25:', {
        toothId,
        isLowerTeeth,
        newDynamicDesign,
        designMeaning: newDynamicDesign === 1 ? 'Flecha hacia arriba (Superior)' : 'Flecha hacia abajo (Inferior)',
        condition: `isLowerTeeth ? 2 : 1 = ${isLowerTeeth ? 2 : 1}`
      });

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding) => {
                  if (
                    finding.optionId === optionId &&
                    finding.subOptionId === subOptionId
                  ) {
                    return {
                      ...finding,
                      dynamicDesign: newDynamicDesign,
                    };
                  }
                  return finding;
                });
                return { ...zone, findings: updatedFindings };
              }
              return zone;
            });
            return { ...t, zones: updatedZones };
          } else {
            // Actualizar hallazgo a nivel de diente
            const updatedFindings = t.findings.map((finding) => {
              if (
                finding.optionId === optionId &&
                finding.subOptionId === subOptionId
              ) {
                return {
                  ...finding,
                  dynamicDesign: newDynamicDesign,
                };
              }
              return finding;
            });
            return { ...t, findings: updatedFindings };
          }
        }
        return t;
      });

      return { teeth: updatedTeeth };
    });

    // Solo notificar a las leyendas si el origen es 'tooth'
  },
  calculateFinding12Design: (params) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t) => t.id === toothId);

      if (!tooth) return state;

      // Siempre asignamos el diseño 1
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding) => {
                  if (
                    finding.optionId === optionId &&
                    finding.subOptionId === subOptionId
                  ) {
                    return {
                      ...finding,
                      dynamicDesign: newDynamicDesign,
                    };
                  }
                  return finding;
                });
                return { ...zone, findings: updatedFindings };
              }
              return zone;
            });
            return { ...t, zones: updatedZones };
          } else {
            // Actualizar hallazgo a nivel de diente
            const updatedFindings = t.findings.map((finding) => {
              if (
                finding.optionId === optionId &&
                finding.subOptionId === subOptionId
              ) {
                return {
                  ...finding,
                  dynamicDesign: newDynamicDesign,
                };
              }
              return finding;
            });
            return { ...t, findings: updatedFindings };
          }
        }
        return t;
      });

      return { teeth: updatedTeeth };
    });

    // Solo notificar a las leyendas si el origen es 'tooth'. No se hace porque no hay espacio de diseño a los lados
  },
  calculateFinding21Design: (params) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t) => t.id === toothId);

      if (!tooth) return state;

      // Siempre asignamos el diseño 1
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding) => {
                  if (
                    finding.optionId === optionId &&
                    finding.subOptionId === subOptionId
                  ) {
                    return {
                      ...finding,
                      dynamicDesign: newDynamicDesign,
                    };
                  }
                  return finding;
                });
                return { ...zone, findings: updatedFindings };
              }
              return zone;
            });
            return { ...t, zones: updatedZones };
          } else {
            // Actualizar hallazgo a nivel de diente
            const updatedFindings = t.findings.map((finding) => {
              if (
                finding.optionId === optionId &&
                finding.subOptionId === subOptionId
              ) {
                return {
                  ...finding,
                  dynamicDesign: newDynamicDesign,
                };
              }
              return finding;
            });
            return { ...t, findings: updatedFindings };
          }
        }
        return t;
      });

      return { teeth: updatedTeeth };
    });

    // Solo notificar a las leyendas si el origen es 'tooth'. No se hace porque no hay espacio de diseño a los lados
  },
  calculateFinding28Design: (params) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t) => t.id === toothId);

      if (!tooth) return state;

      // Siempre asignamos el diseño 1
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding) => {
                  if (
                    finding.optionId === optionId &&
                    finding.subOptionId === subOptionId
                  ) {
                    return {
                      ...finding,
                      dynamicDesign: newDynamicDesign,
                    };
                  }
                  return finding;
                });
                return { ...zone, findings: updatedFindings };
              }
              return zone;
            });
            return { ...t, zones: updatedZones };
          } else {
            // Actualizar hallazgo a nivel de diente
            const updatedFindings = t.findings.map((finding) => {
              if (
                finding.optionId === optionId &&
                finding.subOptionId === subOptionId
              ) {
                return {
                  ...finding,
                  dynamicDesign: newDynamicDesign,
                };
              }
              return finding;
            });
            return { ...t, findings: updatedFindings };
          }
        }
        return t;
      });

      return { teeth: updatedTeeth };
    });

    // Solo notificar a las leyendas si el origen es 'tooth'
  },
  calculateFinding30Design: (params) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state) => {
      // Determinar si es diente inferior basándose en el ID (IDs de dientes inferiores empiezan con 3 o 4)
      const isLowerTeeth = PositionUtils.isLowerTooth(String(toothId));
      
      // Usar los datos correctos según la posición del diente
      const intermediateSpaceOnTheCanvasOfFinding30 = isLowerTeeth
  ? getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding30Lower
  : getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding30;
      
      const tooth = state.teeth.find((t) => t.id === toothId);

      if (!tooth) return state;

      // Buscar los espacios intermedios para el diente actual
      const leftLegend =
        intermediateSpaceOnTheCanvasOfFinding30.find(
          (space) => space.rightToothId === toothId
        ) || null;

      const rightLegend =
        intermediateSpaceOnTheCanvasOfFinding30.find(
          (space) => space.leftToothId === toothId
        ) || null;

      const hasLeftColor = leftLegend?.color !== null;
      const hasRightColor = rightLegend?.color !== null;

      // Calcular el diseño
      let newDynamicDesign = 1;
      if (!leftLegend) newDynamicDesign = 1;
      else if (!rightLegend) newDynamicDesign = 2;
      else if (hasLeftColor && hasRightColor) newDynamicDesign = 3;
      else if (hasLeftColor) newDynamicDesign = 2;
      else if (hasRightColor) newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding) => {
                  if (
                    finding.optionId === optionId &&
                    finding.subOptionId === subOptionId
                  ) {
                    return {
                      ...finding,
                      dynamicDesign: newDynamicDesign,
                    };
                  }
                  return finding;
                });
                return { ...zone, findings: updatedFindings };
              }
              return zone;
            });
            return { ...t, zones: updatedZones };
          } else {
            // Actualizar hallazgo a nivel de diente
            const updatedFindings = t.findings.map((finding) => {
              if (
                finding.optionId === optionId &&
                finding.subOptionId === subOptionId
              ) {
                return {
                  ...finding,
                  dynamicDesign: newDynamicDesign,
                };
              }
              return finding;
            });
            return { ...t, findings: updatedFindings };
          }
        }
        return t;
      });

      return { teeth: updatedTeeth };
    });

    // Solo notificar a las leyendas si el origen es 'tooth'
    if (origin === "tooth") {
      // Determinar si es diente inferior basándose en el ID
      const isLowerTeeth = PositionUtils.isLowerTooth(String(toothId));
      
      // Usar los datos correctos según la posición del diente
      const intermediateSpaceOnTheCanvasOfFinding30 = isLowerTeeth
  ? getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding30Lower
  : getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding30;
      
      // Buscar los espacios intermedios para el diente actual
      const leftSpace = intermediateSpaceOnTheCanvasOfFinding30.find(
        (space) => space.rightToothId === toothId
      );
      const rightSpace = intermediateSpaceOnTheCanvasOfFinding30.find(
        (space) => space.leftToothId === toothId
      );
      // Notificar al espacio izquierdo si existe
      if (leftSpace) {
  getSpaceBetweenDataStore()
          .getState()
          .calculateDynamicDesignFinding30({
            id: leftSpace.id,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
            isLowerTeeth,
          });
      }

      // Notificar al espacio derecho si existe
      if (rightSpace) {
  getSpaceBetweenDataStore()
          .getState()
          .calculateDynamicDesignFinding30({
            id: rightSpace.id,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
            isLowerTeeth,
          });
      }
    }
  },
  calculateFinding31Design: (params) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      color,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t) => t.id === toothId);

      if (!tooth) return state;

      // Calcular el diseño
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding) => {
                  if (
                    finding.optionId === optionId &&
                    finding.subOptionId === subOptionId
                  ) {
                    return {
                      ...finding,
                      dynamicDesign: newDynamicDesign,
                    };
                  }
                  return finding;
                });
                return { ...zone, findings: updatedFindings };
              }
              return zone;
            });
            return { ...t, zones: updatedZones };
          } else {
            // Actualizar hallazgo a nivel de diente
            const updatedFindings = t.findings.map((finding) => {
              if (
                finding.optionId === optionId &&
                finding.subOptionId === subOptionId
              ) {
                return {
                  ...finding,
                  dynamicDesign: newDynamicDesign,
                };
              }
              return finding;
            });
            return { ...t, findings: updatedFindings };
          }
        }
        return t;
      });

      return { teeth: updatedTeeth };
    });

    // Solo notificar a las leyendas si el origen es 'tooth'. El color que viene como parámetro les paso
    if (origin === "tooth") {
      
      // Determinar si es diente inferior basándose en el ID (IDs de dientes inferiores empiezan con 3 o 4)
      const isLowerTeeth = PositionUtils.isLowerTooth(String(toothId));
      
      // Usar los datos correctos según la posición del diente
      const intermediateSpaceOnTheCanvasOfFinding31 = isLowerTeeth
  ? getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding31Lower
  : getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding31;
      
      // Buscar los espacios intermedios para el diente actual
      const leftSpace = intermediateSpaceOnTheCanvasOfFinding31.find(
        (space) => space.rightToothId === toothId
      );
      const rightSpace = intermediateSpaceOnTheCanvasOfFinding31.find(
        (space) => space.leftToothId === toothId
      );
      // Notificar al espacio izquierdo si existe
      if (leftSpace) {
  getSpaceBetweenDataStore()
          .getState()
          .calculateDynamicDesignFinding31({
            id: leftSpace.id,
            zoneId,
            optionId,
            subOptionId,
            color,
            origin: "tooth",
            isLowerTeeth,
          });
      }

      // Notificar al espacio derecho si existe
      if (rightSpace) {
  getSpaceBetweenDataStore()
          .getState()
          .calculateDynamicDesignFinding31({
            id: rightSpace.id,
            zoneId,
            optionId,
            subOptionId,
            color,
            origin: "tooth",
            isLowerTeeth,
          });
      }
    }
  },
  calculateFinding32Design: (params) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state) => {
      // Determinar si es diente inferior basándose en el ID (IDs de dientes inferiores empiezan con 3 o 4)
      const isLowerTeeth = PositionUtils.isLowerTooth(String(toothId));
      
      // Usar los datos correctos según la posición del diente
      const intermediateSpaceOnTheCanvasOfFinding32 = isLowerTeeth
  ? getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding32Lower
  : getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding32;
      
      const tooth = state.teeth.find((t) => t.id === toothId);

      if (!tooth) return state;

      // Buscar los espacios intermedios para el diente actual
      const leftLegend =
        intermediateSpaceOnTheCanvasOfFinding32.find(
          (space) => space.rightToothId === toothId
        ) || null;

      const rightLegend =
        intermediateSpaceOnTheCanvasOfFinding32.find(
          (space) => space.leftToothId === toothId
        ) || null;

      const hasLeftColor = leftLegend?.color !== null;
      const hasRightColor = rightLegend?.color !== null;

      // Calcular el diseño
      let newDynamicDesign = 1;
      if (!leftLegend) newDynamicDesign = 1;
      else if (!rightLegend) newDynamicDesign = 2;
      else if (hasLeftColor && hasRightColor) newDynamicDesign = 3;
      else if (hasLeftColor) newDynamicDesign = 2;
      else if (hasRightColor) newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding) => {
                  if (
                    finding.optionId === optionId &&
                    finding.subOptionId === subOptionId
                  ) {
                    return {
                      ...finding,
                      dynamicDesign: newDynamicDesign,
                    };
                  }
                  return finding;
                });
                return { ...zone, findings: updatedFindings };
              }
              return zone;
            });
            return { ...t, zones: updatedZones };
          } else {
            // Actualizar hallazgo a nivel de diente
            const updatedFindings = t.findings.map((finding) => {
              if (
                finding.optionId === optionId &&
                finding.subOptionId === subOptionId
              ) {
                return {
                  ...finding,
                  dynamicDesign: newDynamicDesign,
                };
              }
              return finding;
            });
            return { ...t, findings: updatedFindings };
          }
        }
        return t;
      });

      return { teeth: updatedTeeth };
    });

    // Solo notificar a las leyendas si el origen es 'tooth'
    if (origin === "tooth") {
      // Determinar si es diente inferior basándose en el ID
      const isLowerTeeth = PositionUtils.isLowerTooth(String(toothId));
      
      // Usar los datos correctos según la posición del diente
      const intermediateSpaceOnTheCanvasOfFinding32 = isLowerTeeth
  ? getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding32Lower
  : getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding32;
      
      // Buscar los espacios intermedios para el diente actual
      const leftSpace = intermediateSpaceOnTheCanvasOfFinding32.find(
        (space) => space.rightToothId === toothId
      );
      const rightSpace = intermediateSpaceOnTheCanvasOfFinding32.find(
        (space) => space.leftToothId === toothId
      );
      // Notificar al espacio izquierdo si existe
      if (leftSpace) {
  getSpaceBetweenDataStore()
          .getState()
          .calculateDynamicDesignFinding32({
            id: leftSpace.id,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
            isLowerTeeth,
          });
      }

      // Notificar al espacio derecho si existe
      if (rightSpace) {
  getSpaceBetweenDataStore()
          .getState()
          .calculateDynamicDesignFinding32({
            id: rightSpace.id,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
            isLowerTeeth,
          });
      }
    }
  },
  calculateFinding38Design: (params) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t) => t.id === toothId);

      if (!tooth) return state;

      // Siempre asignamos el diseño 1
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding) => {
                  if (
                    finding.optionId === optionId &&
                    finding.subOptionId === subOptionId
                  ) {
                    return {
                      ...finding,
                      dynamicDesign: newDynamicDesign,
                    };
                  }
                  return finding;
                });
                return { ...zone, findings: updatedFindings };
              }
              return zone;
            });
            return { ...t, zones: updatedZones };
          } else {
            // Actualizar hallazgo a nivel de diente
            const updatedFindings = t.findings.map((finding) => {
              if (
                finding.optionId === optionId &&
                finding.subOptionId === subOptionId
              ) {
                return {
                  ...finding,
                  dynamicDesign: newDynamicDesign,
                };
              }
              return finding;
            });
            return { ...t, findings: updatedFindings };
          }
        }
        return t;
      });

      return { teeth: updatedTeeth };
    });

    // Solo notificar a las leyendas si el origen es 'tooth'
  },
  calculateFinding39Design: (params) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state) => {
      // Determinar si es diente inferior basándose en el ID (IDs de dientes inferiores empiezan con 3 o 4)
      const isLowerTeeth = PositionUtils.isLowerTooth(String(toothId));
      
      // Usar los datos correctos según la posición del diente
      const intermediateSpaceOnTheCanvasOfFinding39 = isLowerTeeth
  ? getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding39Lower
  : getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding39;
      
      const tooth = state.teeth.find((t) => t.id === toothId);

      if (!tooth) return state;

      // Buscar los espacios intermedios para el diente actual
      const leftLegend =
        intermediateSpaceOnTheCanvasOfFinding39.find(
          (space) => space.rightToothId === toothId
        ) || null;

      const rightLegend =
        intermediateSpaceOnTheCanvasOfFinding39.find(
          (space) => space.leftToothId === toothId
        ) || null;

      // Verificar si hay hallazgos (findings) en los espacios
      const hasLeftFindings =
        leftLegend?.findings && leftLegend.findings.length > 0;
      const hasRightFindings =
        rightLegend?.findings && rightLegend.findings.length > 0;

      // Calcular el diseño basado en la existencia de findings en lugar de color
      let newDynamicDesign = 1;
      if (!leftLegend) newDynamicDesign = 1;
      else if (!rightLegend) newDynamicDesign = 2;
      else if (hasLeftFindings && hasRightFindings) newDynamicDesign = 3;
      else if (hasLeftFindings) newDynamicDesign = 2;
      else if (hasRightFindings) newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding) => {
                  if (
                    finding.optionId === optionId &&
                    finding.subOptionId === subOptionId
                  ) {
                    return {
                      ...finding,
                      dynamicDesign: newDynamicDesign,
                    };
                  }
                  return finding;
                });
                return { ...zone, findings: updatedFindings };
              }
              return zone;
            });
            return { ...t, zones: updatedZones };
          } else {
            // Actualizar hallazgo a nivel de diente
            const updatedFindings = t.findings.map((finding) => {
              if (
                finding.optionId === optionId &&
                finding.subOptionId === subOptionId
              ) {
                return {
                  ...finding,
                  dynamicDesign: newDynamicDesign,
                };
              }
              return finding;
            });
            return { ...t, findings: updatedFindings };
          }
        }
        return t;
      });

      return { teeth: updatedTeeth };
    });

    // Solo notificar a las leyendas si el origen es 'tooth'
    if (origin === "tooth") {
      // Determinar si es diente inferior basándose en el ID
      const isLowerTeeth = PositionUtils.isLowerTooth(String(toothId));
      
      // Usar los datos correctos según la posición del diente
      const intermediateSpaceOnTheCanvasOfFinding39 = isLowerTeeth
  ? getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding39Lower
  : getSpaceBetweenDataStore().getState().intermediateSpaceOnTheCanvasOfFinding39;
      
      // Buscar los espacios intermedios para el diente actual
      const leftSpace = intermediateSpaceOnTheCanvasOfFinding39.find(
        (space) => space.rightToothId === toothId
      );
      
      const rightSpace = intermediateSpaceOnTheCanvasOfFinding39.find(
        (space) => space.leftToothId === toothId
      );
      
      // Notificar al espacio izquierdo si existe
      if (leftSpace) {
  getSpaceBetweenDataStore()
          .getState()
          .calculateDynamicDesignFinding39({
            id: leftSpace.id,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
            isLowerTeeth,
          });
      }

      // Notificar al espacio derecho si existe
      if (rightSpace) {
  getSpaceBetweenDataStore()
          .getState()
          .calculateDynamicDesignFinding39({
            id: rightSpace.id,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
            isLowerTeeth,
          });
      }
    }
  },
  }));
}

// Backward-compatible default export: wrap the vanilla store in a hook-like API
// and lazily wire the space-between dependency to avoid circular init issues.
let __adultSpaceBetweenStoreRef: any;
const __getSpaceBetweenStore = () => __adultSpaceBetweenStoreRef as StoreApi<any>;

const __adultDentalVanillaStore = createAdultDentalDataStore(__getSpaceBetweenStore);

type ZustandHookLike = (<T>(selector: (state: any) => T) => T) & {
  getState: typeof __adultDentalVanillaStore.getState;
};

const useAdultDentalDataStore: ZustandHookLike = ((selector: any) =>
  useStore(__adultDentalVanillaStore as any, selector)) as any;
useAdultDentalDataStore.getState = __adultDentalVanillaStore.getState;

// Lazy link to spaceBetween store to break circular imports at module eval time
import("./adultSpaceBetweenMainSectionsOnTheCanvasData")
  .then((m) => {
    __adultSpaceBetweenStoreRef = (m as any).default;
  })
  .catch(() => {
    // ignore; will stay undefined until module loads
  });

export default useAdultDentalDataStore;
