// @ts-expect-error TS(2792): Cannot find module 'zustand'. Did you mean to set ... Remove this comment to see the full error message
import { create } from "zustand";
import teethData from "../data/teethData.json";
import useSpaceBetweenLegendsDataStore from "./spaceBetweenMainSectionsOnTheCanvasData";

const buildZones = (toothId: number, zonesCount: number) =>
  Array.from({ length: zonesCount }, (_, index) => ({
    id: Number(`${toothId}${index + 1}`),
    findings: [],
  }));

const normalizeTeeth = (sourceTeeth: any[]) =>
  (sourceTeeth || []).map((tooth: any) => ({
    ...tooth,
    zones: Array.isArray(tooth?.zones)
      ? tooth.zones
      : buildZones(tooth.id, Number(tooth?.zones) || 4),
    findings: Array.isArray(tooth?.findings) ? tooth.findings : [],
  }));

const ensureToothSet = (sourceTeeth: any[]) => {
  const teeth = [...normalizeTeeth(sourceTeeth)];

  const defaults = [
    // Permanentes inferiores
    { id: 48, position: 'lower', type: 'molar', zones: 8, design: 'default' },
    { id: 47, position: 'lower', type: 'molar', zones: 8, design: 'default' },
    { id: 46, position: 'lower', type: 'molar', zones: 8, design: 'default' },
    { id: 45, position: 'lower', type: 'premolar', zones: 6, design: 'design2' },
    { id: 44, position: 'lower', type: 'premolar', zones: 6, design: 'design2' },
    { id: 43, position: 'lower', type: 'canino', zones: 4, design: 'design2' },
    { id: 42, position: 'lower', type: 'incisivo', zones: 4, design: 'design2' },
    { id: 41, position: 'lower', type: 'incisivo', zones: 4, design: 'design2' },
    { id: 31, position: 'lower', type: 'incisivo', zones: 4, design: 'design2' },
    { id: 32, position: 'lower', type: 'incisivo', zones: 4, design: 'design2' },
    { id: 33, position: 'lower', type: 'canino', zones: 4, design: 'design2' },
    { id: 34, position: 'lower', type: 'premolar', zones: 6, design: 'design2' },
    { id: 35, position: 'lower', type: 'premolar', zones: 6, design: 'design2' },
    { id: 36, position: 'lower', type: 'molar', zones: 8, design: 'default' },
    { id: 37, position: 'lower', type: 'molar', zones: 8, design: 'default' },
    { id: 38, position: 'lower', type: 'molar', zones: 8, design: 'default' },
    // Deciduos superiores
    { id: 55, position: 'upper', type: 'molar', zones: 6, design: 'default' },
    { id: 54, position: 'upper', type: 'molar', zones: 6, design: 'default' },
    { id: 53, position: 'upper', type: 'canino', zones: 4, design: 'design2' },
    { id: 52, position: 'upper', type: 'incisivo', zones: 4, design: 'design2' },
    { id: 51, position: 'upper', type: 'incisivo', zones: 4, design: 'design2' },
    { id: 61, position: 'upper', type: 'incisivo', zones: 4, design: 'design2' },
    { id: 62, position: 'upper', type: 'incisivo', zones: 4, design: 'design2' },
    { id: 63, position: 'upper', type: 'canino', zones: 4, design: 'design2' },
    { id: 64, position: 'upper', type: 'molar', zones: 6, design: 'default' },
    { id: 65, position: 'upper', type: 'molar', zones: 6, design: 'default' },
    // Deciduos inferiores
    { id: 85, position: 'lower', type: 'molar', zones: 6, design: 'default' },
    { id: 84, position: 'lower', type: 'molar', zones: 6, design: 'default' },
    { id: 83, position: 'lower', type: 'canino', zones: 4, design: 'design2' },
    { id: 82, position: 'lower', type: 'incisivo', zones: 4, design: 'design2' },
    { id: 81, position: 'lower', type: 'incisivo', zones: 4, design: 'design2' },
    { id: 71, position: 'lower', type: 'incisivo', zones: 4, design: 'design2' },
    { id: 72, position: 'lower', type: 'incisivo', zones: 4, design: 'design2' },
    { id: 73, position: 'lower', type: 'canino', zones: 4, design: 'design2' },
    { id: 74, position: 'lower', type: 'molar', zones: 6, design: 'default' },
    { id: 75, position: 'lower', type: 'molar', zones: 6, design: 'default' },
  ];

  defaults.forEach((cfg) => {
    const exists = teeth.some((tooth: any) => tooth.id === cfg.id);
    if (!exists) {
      teeth.push({
        id: cfg.id,
        position: cfg.position,
        type: cfg.type,
        zones: buildZones(cfg.id, cfg.zones),
        findings: [],
        displayProperties: {
          design: cfg.design,
          spaceBetweenLegendsLeftId: null,
          spaceBetweenLegendsRightId: null,
        },
      });
    }
  });

  return teeth;
};

const initialTeeth = ensureToothSet((teethData as any).teeth ?? teethData ?? []);

// @ts-expect-error TS(7006): Parameter 'set' implicitly has an 'any' type.
const useDentalDataStore = create((set, get) => ({
  teeth: initialTeeth || [],

  registerFinding: (params: any) => {
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

    set((state: any) => {
      // Caso especial para optionId = 31 o optionId = 7: aplicar a todos los dientes cuando no hay zona especificada
      if ((optionId === 31 || optionId === 7) && !zoneId) {
        const updatedTeeth = state.teeth.map((tooth: any) => {
          // Verificar si ya existe un hallazgo con mismo optionId y dynamicDesign
          const existingFindingIndex = tooth.findings.findIndex(
            (f: any) => f.optionId === optionId && f.dynamicDesign === dynamicDesignValue
          );

          let updatedFindings;
          if (existingFindingIndex !== -1) {
            // Si existe, actualizar ese hallazgo
            updatedFindings = [...tooth.findings];
            updatedFindings[existingFindingIndex] = newFinding;
          } else {
            // Si no existe, agregar uno nuevo
            updatedFindings = [...tooth.findings, newFinding];
          }

          return {
            ...tooth,
            findings: updatedFindings,
          };
        });

        return { teeth: updatedTeeth };
      }

      // Lógica para todos los demás casos
      const updatedTeeth = state.teeth.map((tooth: any) => {
        if (tooth.id === toothId) {
          if (zoneId) {
            const updatedZones = tooth.zones.map((zone: any) => {
              if (zone.id === zoneId) {
                // Verificar si ya existe un hallazgo con mismo optionId y dynamicDesign
                const existingFindingIndex = zone.findings.findIndex(
                  (f: any) => f.optionId === optionId &&
                  f.dynamicDesign === dynamicDesignValue
                );

                if (existingFindingIndex !== -1) {
                  // Si existe, actualizar ese hallazgo
                  const updatedFindings = [...zone.findings];
                  updatedFindings[existingFindingIndex] = newFinding;
                  return { ...zone, findings: updatedFindings };
                }

                // Si no existe, agregar uno nuevo
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
            (f: any) => f.optionId === optionId && f.dynamicDesign === dynamicDesignValue
          );

          let updatedFindings;
          if (existingFindingIndex !== -1) {
            // Si existe, actualizar ese hallazgo
            updatedFindings = [...tooth.findings];
            updatedFindings[existingFindingIndex] = newFinding;
          } else {
            // Si no existe, agregar uno nuevo
            updatedFindings = [...tooth.findings, newFinding];
          }

          const updatedTooth = {
            ...tooth,
            findings: updatedFindings,
          };

          return updatedTooth;
        }
        return tooth;
      });

      return { teeth: updatedTeeth };
    });

    // Para el caso de optionId 31 o 7 aplicado a todos los dientes
    if ((optionId === 31 || optionId === 7) && !zoneId) {
      // Obtenemos todos los dientes para aplicar el cálculo de diseño a cada uno
      const allTeeth = get().teeth;
      allTeeth.forEach((tooth: any) => {
        if (optionId === 31) {
          get().calculateFinding31Design({
            toothId: tooth.id,
            zoneId: null,
            optionId,
            subOptionId,
            color,
            origin: "tooth",
          });
        } else if (optionId === 7) {
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
    } else {
      // Solo calcular el diseño si no se proporcionó uno específico
      if (!design) {
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
            get().calculateFinding24Design({
              toothId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
            });
            break;
          case 25:
            get().calculateFinding25Design({
              toothId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
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

  removeFinding: (params: any) => {
    const { toothId, zoneId, optionId, subOptionId, dynamicDesign } = params;

    set((state: any) => {
      // Caso especial para optionId = 31 o optionId = 7: eliminar de todos los dientes cuando no hay zona especificada
      if ((optionId === 31 || optionId === 7) && !zoneId) {
        const updatedTeeth = state.teeth.map((tooth: any) => {
          // Si se especificó un dynamicDesign, solo eliminar esa combinación específica
          const updatedFindings = tooth.findings.filter(
            (f: any) => !(
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
            (f: any) => f.optionId === optionId &&
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
      const updatedTeeth = state.teeth.map((tooth: any) => {
        if (tooth.id === toothId) {
          if (zoneId) {
            const updatedZones = tooth.zones.map((zone: any) => {
              if (zone.id === zoneId) {
                return {
                  ...zone,
                  findings: zone.findings.filter(
                    (f: any) => !(
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

          // Filtrar hallazgos según optionId, subOptionId y dynamicDesign si se especifica
          const updatedFindings = tooth.findings.filter(
            (f: any) => !(
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
            (f: any) => f.optionId === optionId &&
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
      // Obtenemos todos los dientes para actualizar el diseño de cada uno
      const allTeeth = get().teeth;
      allTeeth.forEach((tooth: any) => {
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
          get().calculateFinding24Design({
            toothId,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
          });
          break;
        case 25:
          get().calculateFinding25Design({
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
  calculateFinding11Design: (params: any) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state: any) => {
      const spaceBetweenLegends =
        useSpaceBetweenLegendsDataStore.getState().spaceBetweenLegends;
      const tooth = state.teeth.find((t: any) => t.id === toothId);

      if (!tooth) return state;

      // Obtener información de las leyendas
      const leftLegend = spaceBetweenLegends.find(
        (legend: any) => legend.id === tooth.displayProperties.spaceBetweenLegendsLeftId
      );
      const rightLegend = spaceBetweenLegends.find(
        (legend: any) => legend.id === tooth.displayProperties.spaceBetweenLegendsRightId
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
      const updatedTeeth = state.teeth.map((t: any) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone: any) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding: any) => {
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
            const updatedFindings = t.findings.map((finding: any) => {
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
      const tooth = state.teeth.find((t: any) => t.id === toothId);
      if (tooth) {
        // Notificar a la leyenda izquierda si existe
        if (tooth.displayProperties.spaceBetweenLegendsLeftId) {
          useSpaceBetweenLegendsDataStore
            .getState()
            .calculateDynamicDesignForLegend({
              legendId: tooth.displayProperties.spaceBetweenLegendsLeftId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
            });
        }
        // Notificar a la leyenda derecha si existe
        if (tooth.displayProperties.spaceBetweenLegendsRightId) {
          useSpaceBetweenLegendsDataStore
            .getState()
            .calculateDynamicDesignForLegend({
              legendId: tooth.displayProperties.spaceBetweenLegendsRightId,
              zoneId,
              optionId,
              subOptionId,
              origin: "tooth",
            });
        }
      }
    }
  },

  // Función para calcular el diseño del hallazgo 1
  calculateFinding1Design: (params: any) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state: any) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const intermediateSpaceOnTheCanvasOfFinding1 =
        useSpaceBetweenLegendsDataStore.getState()
          .intermediateSpaceOnTheCanvasOfFinding1;
      const tooth = state.teeth.find((t: any) => t.id === toothId);

      if (!tooth) return state;

      // Buscar los espacios intermedios para el diente actual
      const leftLegend =
        intermediateSpaceOnTheCanvasOfFinding1.find(
          (space: any) => space.rightToothId === toothId
        ) || null;

      const rightLegend =
        intermediateSpaceOnTheCanvasOfFinding1.find(
          (space: any) => space.leftToothId === toothId
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
      const updatedTeeth = state.teeth.map((t: any) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone: any) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding: any) => {
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
            const updatedFindings = t.findings.map((finding: any) => {
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
      console.log("Entrando a zona ");
      const intermediateSpaceOnTheCanvasOfFinding1 =
        useSpaceBetweenLegendsDataStore.getState()
          .intermediateSpaceOnTheCanvasOfFinding1;
      console.log(
        "intermediateSpaceOnTheCanvasOfFinding1: " +
          JSON.stringify(intermediateSpaceOnTheCanvasOfFinding1)
      );
      // Buscar los espacios intermedios para el diente actual
      const leftSpace = intermediateSpaceOnTheCanvasOfFinding1.find(
        (space: any) => space.rightToothId === toothId
      );
      console.log("leftSpace: " + JSON.stringify(leftSpace));
      const rightSpace = intermediateSpaceOnTheCanvasOfFinding1.find(
        (space: any) => space.leftToothId === toothId
      );
      console.log("rightSpace: " + JSON.stringify(rightSpace));
      // Notificar al espacio izquierdo si existe
      if (leftSpace) {
        useSpaceBetweenLegendsDataStore
          .getState()
          .calculateDynamicDesignFinding1({
            id: leftSpace.id,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
          });
      }

      // Notificar al espacio derecho si existe
      if (rightSpace) {
        useSpaceBetweenLegendsDataStore
          .getState()
          .calculateDynamicDesignFinding1({
            id: rightSpace.id,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
          });
      }
    }
  },

  calculateFinding2Design: (params: any) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state: any) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const intermediateSpaceOnTheCanvasOfFinding2 =
        useSpaceBetweenLegendsDataStore.getState()
          .intermediateSpaceOnTheCanvasOfFinding2;
      const tooth = state.teeth.find((t: any) => t.id === toothId);

      if (!tooth) return state;

      // Buscar los espacios intermedios para el diente actual
      const leftLegend =
        intermediateSpaceOnTheCanvasOfFinding2.find(
          (space: any) => space.rightToothId === toothId
        ) || null;

      const rightLegend =
        intermediateSpaceOnTheCanvasOfFinding2.find(
          (space: any) => space.leftToothId === toothId
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
      const updatedTeeth = state.teeth.map((t: any) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone: any) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding: any) => {
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
            const updatedFindings = t.findings.map((finding: any) => {
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
      console.log("Entrando a zona ");
      const intermediateSpaceOnTheCanvasOfFinding2 =
        useSpaceBetweenLegendsDataStore.getState()
          .intermediateSpaceOnTheCanvasOfFinding2;
      // Buscar los espacios intermedios para el diente actual
      const leftSpace = intermediateSpaceOnTheCanvasOfFinding2.find(
        (space: any) => space.rightToothId === toothId
      );
      console.log("leftSpace: " + JSON.stringify(leftSpace));
      const rightSpace = intermediateSpaceOnTheCanvasOfFinding2.find(
        (space: any) => space.leftToothId === toothId
      );
      console.log("rightSpace: " + JSON.stringify(rightSpace));
      // Notificar al espacio izquierdo si existe
      if (leftSpace) {
        useSpaceBetweenLegendsDataStore
          .getState()
          .calculateDynamicDesignFinding2({
            id: leftSpace.id,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
          });
      }

      // Notificar al espacio derecho si existe
      if (rightSpace) {
        useSpaceBetweenLegendsDataStore
          .getState()
          .calculateDynamicDesignFinding2({
            id: rightSpace.id,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
          });
      }
    }
  },

  calculateFinding3Design: (params: any) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      // @ts-expect-error TS(6133): 'origin' is declared but its value is never read.
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state: any) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t: any) => t.id === toothId);

      if (!tooth) return state;

      // Siempre asignamos el diseño 1
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t: any) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone: any) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding: any) => {
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
            const updatedFindings = t.findings.map((finding: any) => {
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

  calculateFinding4Design: (params: any) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      // @ts-expect-error TS(6133): 'origin' is declared but its value is never read.
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state: any) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t: any) => t.id === toothId);

      if (!tooth) return state;

      // Siempre asignamos el diseño 1
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t: any) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone: any) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding: any) => {
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
            const updatedFindings = t.findings.map((finding: any) => {
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

  calculateFinding7Design: (params: any) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      color,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;
    set((state: any) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t: any) => t.id === toothId);

      if (!tooth) return state;

      // Siempre asignamos el diseño 1
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t: any) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone: any) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding: any) => {
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
            const updatedFindings = t.findings.map((finding: any) => {
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
      console.log("Entrando a zona ");
      const intermediateSpaceOnTheCanvasOfFinding7 =
        useSpaceBetweenLegendsDataStore.getState()
          .intermediateSpaceOnTheCanvasOfFinding7;
      // Buscar los espacios intermedios para el diente actual
      const leftSpace = intermediateSpaceOnTheCanvasOfFinding7.find(
        (space: any) => space.rightToothId === toothId
      );
      console.log("leftSpace: " + JSON.stringify(leftSpace));
      const rightSpace = intermediateSpaceOnTheCanvasOfFinding7.find(
        (space: any) => space.leftToothId === toothId
      );
      console.log("rightSpace: " + JSON.stringify(rightSpace));
      // Notificar al espacio izquierdo si existe
      if (leftSpace) {
        useSpaceBetweenLegendsDataStore
          .getState()
          .calculateDynamicDesignFinding7({
            id: leftSpace.id,
            zoneId,
            optionId,
            subOptionId,
            color,
            origin: "tooth",
          });
      }

      // Notificar al espacio derecho si existe
      if (rightSpace) {
        useSpaceBetweenLegendsDataStore
          .getState()
          .calculateDynamicDesignFinding7({
            id: rightSpace.id,
            zoneId,
            optionId,
            subOptionId,
            color,
            origin: "tooth",
          });
      }
    }
  },

  calculateFinding20Design: (params: any) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      // @ts-expect-error TS(6133): 'origin' is declared but its value is never read.
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state: any) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t: any) => t.id === toothId);

      if (!tooth) return state;

      // Siempre asignamos el diseño 1
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t: any) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone: any) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding: any) => {
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
            const updatedFindings = t.findings.map((finding: any) => {
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

  calculateFinding23Design: (params: any) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      // @ts-expect-error TS(6133): 'origin' is declared but its value is never read.
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state: any) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t: any) => t.id === toothId);

      if (!tooth) return state;

      // Siempre asignamos el diseño 1
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t: any) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone: any) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding: any) => {
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
            const updatedFindings = t.findings.map((finding: any) => {
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

  calculateFinding24Design: (params: any) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      // @ts-expect-error TS(6133): 'origin' is declared but its value is never read.
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state: any) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t: any) => t.id === toothId);

      if (!tooth) return state;

      // Siempre asignamos el diseño 1
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t: any) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone: any) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding: any) => {
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
            const updatedFindings = t.findings.map((finding: any) => {
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

  calculateFinding25Design: (params: any) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      // @ts-expect-error TS(6133): 'origin' is declared but its value is never read.
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state: any) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t: any) => t.id === toothId);

      if (!tooth) return state;

      // Siempre asignamos el diseño 1
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t: any) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone: any) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding: any) => {
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
            const updatedFindings = t.findings.map((finding: any) => {
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

  calculateFinding12Design: (params: any) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      // @ts-expect-error TS(6133): 'origin' is declared but its value is never read.
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state: any) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t: any) => t.id === toothId);

      if (!tooth) return state;

      // Siempre asignamos el diseño 1
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t: any) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone: any) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding: any) => {
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
            const updatedFindings = t.findings.map((finding: any) => {
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

  calculateFinding21Design: (params: any) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      // @ts-expect-error TS(6133): 'origin' is declared but its value is never read.
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state: any) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t: any) => t.id === toothId);

      if (!tooth) return state;

      // Siempre asignamos el diseño 1
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t: any) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone: any) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding: any) => {
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
            const updatedFindings = t.findings.map((finding: any) => {
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

  calculateFinding28Design: (params: any) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      // @ts-expect-error TS(6133): 'origin' is declared but its value is never read.
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state: any) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t: any) => t.id === toothId);

      if (!tooth) return state;

      // Siempre asignamos el diseño 1
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t: any) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone: any) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding: any) => {
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
            const updatedFindings = t.findings.map((finding: any) => {
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

  calculateFinding30Design: (params: any) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state: any) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const intermediateSpaceOnTheCanvasOfFinding30 =
        useSpaceBetweenLegendsDataStore.getState()
          .intermediateSpaceOnTheCanvasOfFinding30;
      const tooth = state.teeth.find((t: any) => t.id === toothId);

      if (!tooth) return state;

      // Buscar los espacios intermedios para el diente actual
      const leftLegend =
        intermediateSpaceOnTheCanvasOfFinding30.find(
          (space: any) => space.rightToothId === toothId
        ) || null;

      const rightLegend =
        intermediateSpaceOnTheCanvasOfFinding30.find(
          (space: any) => space.leftToothId === toothId
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
      const updatedTeeth = state.teeth.map((t: any) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone: any) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding: any) => {
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
            const updatedFindings = t.findings.map((finding: any) => {
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
      console.log("Entrando a zona ");
      const intermediateSpaceOnTheCanvasOfFinding30 =
        useSpaceBetweenLegendsDataStore.getState()
          .intermediateSpaceOnTheCanvasOfFinding30;
      console.log(
        "intermediateSpaceOnTheCanvasOfFinding1: " +
          JSON.stringify(intermediateSpaceOnTheCanvasOfFinding30)
      );
      // Buscar los espacios intermedios para el diente actual
      const leftSpace = intermediateSpaceOnTheCanvasOfFinding30.find(
        (space: any) => space.rightToothId === toothId
      );
      console.log("leftSpace: " + JSON.stringify(leftSpace));
      const rightSpace = intermediateSpaceOnTheCanvasOfFinding30.find(
        (space: any) => space.leftToothId === toothId
      );
      console.log("rightSpace: " + JSON.stringify(rightSpace));
      // Notificar al espacio izquierdo si existe
      if (leftSpace) {
        useSpaceBetweenLegendsDataStore
          .getState()
          .calculateDynamicDesignFinding30({
            id: leftSpace.id,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
          });
      }

      // Notificar al espacio derecho si existe
      if (rightSpace) {
        useSpaceBetweenLegendsDataStore
          .getState()
          .calculateDynamicDesignFinding30({
            id: rightSpace.id,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
          });
      }
    }
  },

  calculateFinding31Design: (params: any) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      color,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state: any) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      // @ts-expect-error TS(6133): 'intermediateSpaceOnTheCanvasOfFinding31' is decla... Remove this comment to see the full error message
      const intermediateSpaceOnTheCanvasOfFinding31 =
        useSpaceBetweenLegendsDataStore.getState()
          .intermediateSpaceOnTheCanvasOfFinding31;
      const tooth = state.teeth.find((t: any) => t.id === toothId);

      if (!tooth) return state;

      // Calcular el diseño
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t: any) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone: any) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding: any) => {
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
            const updatedFindings = t.findings.map((finding: any) => {
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
      console.log("Entrando a zona ");
      const intermediateSpaceOnTheCanvasOfFinding31 =
        useSpaceBetweenLegendsDataStore.getState()
          .intermediateSpaceOnTheCanvasOfFinding31;
      // Buscar los espacios intermedios para el diente actual
      const leftSpace = intermediateSpaceOnTheCanvasOfFinding31.find(
        (space: any) => space.rightToothId === toothId
      );
      console.log("leftSpace: " + JSON.stringify(leftSpace));
      const rightSpace = intermediateSpaceOnTheCanvasOfFinding31.find(
        (space: any) => space.leftToothId === toothId
      );
      console.log("rightSpace: " + JSON.stringify(rightSpace));
      // Notificar al espacio izquierdo si existe
      if (leftSpace) {
        useSpaceBetweenLegendsDataStore
          .getState()
          .calculateDynamicDesignFinding31({
            id: leftSpace.id,
            zoneId,
            optionId,
            subOptionId,
            color,
            origin: "tooth",
          });
      }

      // Notificar al espacio derecho si existe
      if (rightSpace) {
        useSpaceBetweenLegendsDataStore
          .getState()
          .calculateDynamicDesignFinding31({
            id: rightSpace.id,
            zoneId,
            optionId,
            subOptionId,
            color,
            origin: "tooth",
          });
      }
    }
  },

  calculateFinding32Design: (params: any) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state: any) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const intermediateSpaceOnTheCanvasOfFinding32 =
        useSpaceBetweenLegendsDataStore.getState()
          .intermediateSpaceOnTheCanvasOfFinding32;
      const tooth = state.teeth.find((t: any) => t.id === toothId);

      if (!tooth) return state;

      // Buscar los espacios intermedios para el diente actual
      const leftLegend =
        intermediateSpaceOnTheCanvasOfFinding32.find(
          (space: any) => space.rightToothId === toothId
        ) || null;

      const rightLegend =
        intermediateSpaceOnTheCanvasOfFinding32.find(
          (space: any) => space.leftToothId === toothId
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
      const updatedTeeth = state.teeth.map((t: any) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone: any) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding: any) => {
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
            const updatedFindings = t.findings.map((finding: any) => {
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
      console.log("Entrando a zona ");
      const intermediateSpaceOnTheCanvasOfFinding32 =
        useSpaceBetweenLegendsDataStore.getState()
          .intermediateSpaceOnTheCanvasOfFinding32;
      // Buscar los espacios intermedios para el diente actual
      const leftSpace = intermediateSpaceOnTheCanvasOfFinding32.find(
        (space: any) => space.rightToothId === toothId
      );
      console.log("leftSpace: " + JSON.stringify(leftSpace));
      const rightSpace = intermediateSpaceOnTheCanvasOfFinding32.find(
        (space: any) => space.leftToothId === toothId
      );
      console.log("rightSpace: " + JSON.stringify(rightSpace));
      // Notificar al espacio izquierdo si existe
      if (leftSpace) {
        useSpaceBetweenLegendsDataStore
          .getState()
          .calculateDynamicDesignFinding32({
            id: leftSpace.id,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
          });
      }

      // Notificar al espacio derecho si existe
      if (rightSpace) {
        useSpaceBetweenLegendsDataStore
          .getState()
          .calculateDynamicDesignFinding32({
            id: rightSpace.id,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
          });
      }
    }
  },

  calculateFinding38Design: (params: any) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      // @ts-expect-error TS(6133): 'origin' is declared but its value is never read.
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state: any) => {
      //Acá debo llamar a la data respectiva, no al spaceBetweenLegends
      const tooth = state.teeth.find((t: any) => t.id === toothId);

      if (!tooth) return state;

      // Siempre asignamos el diseño 1
      let newDynamicDesign = 1;

      // Actualizar el hallazgo específico con el nuevo diseño
      const updatedTeeth = state.teeth.map((t: any) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone: any) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding: any) => {
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
            const updatedFindings = t.findings.map((finding: any) => {
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

  calculateFinding39Design: (params: any) => {
    const {
      toothId,
      zoneId,
      optionId,
      subOptionId,
      // @ts-expect-error TS(6133): 'origin' is declared but its value is never read.
      origin = "tooth", // Valor por defecto 'tooth', similar a la función original
    } = params;

    set((state: any) => {
      // Obtener los espacios intermedios
      const intermediateSpaceOnTheCanvasOfFinding39 =
        useSpaceBetweenLegendsDataStore.getState()
          .intermediateSpaceOnTheCanvasOfFinding39;
      const tooth = state.teeth.find((t: any) => t.id === toothId);

      if (!tooth) return state;

      // Buscar los espacios intermedios para el diente actual
      const leftLegend =
        intermediateSpaceOnTheCanvasOfFinding39.find(
          (space: any) => space.rightToothId === toothId
        ) || null;

      const rightLegend =
        intermediateSpaceOnTheCanvasOfFinding39.find(
          (space: any) => space.leftToothId === toothId
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
      const updatedTeeth = state.teeth.map((t: any) => {
        if (t.id === toothId) {
          if (zoneId) {
            // Actualizar hallazgo en zona específica
            const updatedZones = t.zones.map((zone: any) => {
              if (zone.id === zoneId) {
                const updatedFindings = zone.findings.map((finding: any) => {
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
            const updatedFindings = t.findings.map((finding: any) => {
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

    /* // Solo notificar a las leyendas si el origen es 'tooth'
    if (origin === "tooth") {
      console.log("Entrando a zona ");
      const intermediateSpaceOnTheCanvasOfFinding39 =
        useSpaceBetweenLegendsDataStore.getState()
          .intermediateSpaceOnTheCanvasOfFinding39;
      
      // Buscar los espacios intermedios para el diente actual
      const leftSpace = intermediateSpaceOnTheCanvasOfFinding39.find(
        (space) => space.rightToothId === toothId
      );
      console.log("leftSpace: " + JSON.stringify(leftSpace));
      
      const rightSpace = intermediateSpaceOnTheCanvasOfFinding39.find(
        (space) => space.leftToothId === toothId
      );
      console.log("rightSpace: " + JSON.stringify(rightSpace));
      
      // Notificar al espacio izquierdo si existe
      if (leftSpace) {
        useSpaceBetweenLegendsDataStore
          .getState()
          .calculateDynamicDesignFinding39({
            id: leftSpace.id,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
          });
      }
  
      // Notificar al espacio derecho si existe
      if (rightSpace) {
        useSpaceBetweenLegendsDataStore
          .getState()
          .calculateDynamicDesignFinding39({
            id: rightSpace.id,
            zoneId,
            optionId,
            subOptionId,
            origin: "tooth",
          });
      }
    } */
  }
}));

export default useDentalDataStore;
