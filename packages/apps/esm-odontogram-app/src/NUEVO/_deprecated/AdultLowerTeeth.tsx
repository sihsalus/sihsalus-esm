import React from "react";
import SpaceBetweenLegends from "./spacingBetweenMainSectionsOnTheCanvas/SpaceBetweenLegends";
import SpaceBetweenTeeth from "./spacingBetweenMainSectionsOnTheCanvas/SpaceBetweenTeeth";
import ToothDetails from "./ToothDetails";
import ToothVisualization from "./ToothVisualization";
import ToothRow from "./ToothRow";
import { spacingData } from "../data/odontogramData.json";

// Extract lower spacing data
const {
  spaceBetweenLegends: spaceBetweenLegendsLower,
  findingSpaces: {
    finding1: intermediateSpaceOnTheCanvasOfFinding1Lower,
    finding2: intermediateSpaceOnTheCanvasOfFinding2Lower,
    finding6: intermediateSpaceOnTheCanvasOfFinding6Lower,
    finding7: intermediateSpaceOnTheCanvasOfFinding7Lower,
    finding13: intermediateSpaceOnTheCanvasOfFinding13Lower,
    finding24: intermediateSpaceOnTheCanvasOfFinding24Lower,
    finding25: intermediateSpaceOnTheCanvasOfFinding25Lower,
    finding26: intermediateSpaceOnTheCanvasOfFinding26Lower,
    finding30: intermediateSpaceOnTheCanvasOfFinding30Lower,
    finding31: intermediateSpaceOnTheCanvasOfFinding31Lower,
    finding32: intermediateSpaceOnTheCanvasOfFinding32Lower,
    finding39: intermediateSpaceOnTheCanvasOfFinding39Lower,
  }
} = spacingData.lower;
import SpaceBetweenFinding1 from "./spacingBetweenMainSectionsOnTheCanvas/SpacingBetweenFinding1";
import SpaceBetweenFinding2 from "./spacingBetweenMainSectionsOnTheCanvas/SpacingBetweenFinding2";
import SpaceBetweenFinding24 from "./spacingBetweenMainSectionsOnTheCanvas/SpacingBetweenFinding24";
import SpaceBetweenFinding25 from "./spacingBetweenMainSectionsOnTheCanvas/SpacingBetweenFinding25";
import SpaceBetweenFinding30 from "./spacingBetweenMainSectionsOnTheCanvas/SpacingBetweenFinding30";
import SpaceBetweenFinding31 from "./spacingBetweenMainSectionsOnTheCanvas/SpacingBetweenFinding31";
import SpaceBetweenFinding32 from "./spacingBetweenMainSectionsOnTheCanvas/SpacingBetweenFinding32";
import SpaceBetweenFinding13 from "./spacingBetweenMainSectionsOnTheCanvas/SpacingBetweenFinding13";
import SpacingBetweenFinding26 from "./spacingBetweenMainSectionsOnTheCanvas/SpacingBetweenFinding26";
import SpacingBetweenFinding39 from "./spacingBetweenMainSectionsOnTheCanvas/SpacingBetweenFinding39";
import { ODONTOGRAM_CONFIG, FINDING_OPTIONS } from "../config/odontogramConfig";
import { useLowerTeeth } from "../hooks/useTeethByPosition";
import { useShouldRenderFindingRow } from "../hooks/useFindingVisibility";

// Configuración de filas de hallazgos para evitar repetición
const FINDING_ROWS_CONFIG = [
  { 
    optionId: FINDING_OPTIONS.APARATO_ORTODONTICO_FIJO, 
    component: SpaceBetweenFinding1, 
    data: intermediateSpaceOnTheCanvasOfFinding1Lower,
    description: "Aparato ortodóntico fijo"
  },
  { 
    optionId: FINDING_OPTIONS.APARATO_ORTODONTICO_REMOVIBLE, 
    component: SpaceBetweenFinding2, 
    data: intermediateSpaceOnTheCanvasOfFinding2Lower,
    description: "Aparato ortodóntico removible"
  },
  { 
    optionId: FINDING_OPTIONS.MOVILIDAD_PATOLOGICA, 
    component: SpaceBetweenFinding30, 
    data: intermediateSpaceOnTheCanvasOfFinding30Lower,
    description: "Movilidad patológica"
  },
  { 
    optionId: FINDING_OPTIONS.EDENTULO_TOTAL, 
    component: SpaceBetweenFinding31, 
    data: intermediateSpaceOnTheCanvasOfFinding31Lower,
    description: "Edéntulo total"
  },
  { 
    optionId: FINDING_OPTIONS.PIEZA_DENTARIA_AUSENTE, 
    component: SpaceBetweenFinding32, 
    data: intermediateSpaceOnTheCanvasOfFinding32Lower,
    description: "Pieza dentaria ausente"
  },
  { 
    optionId: FINDING_OPTIONS.DIENTE_AUSENTE, 
    component: SpacingBetweenFinding26, 
    data: intermediateSpaceOnTheCanvasOfFinding26Lower,
    description: "Diente ausente"
  },
  { 
    optionId: FINDING_OPTIONS.TRANSPOSICION_DENTARIA, 
    component: SpacingBetweenFinding39, 
    data: intermediateSpaceOnTheCanvasOfFinding39Lower,
    description: "Transposición dentaria"
  },
  { 
    optionId: FINDING_OPTIONS.CORONA_TEMPORAL, 
    component: SpaceBetweenFinding24, 
    data: intermediateSpaceOnTheCanvasOfFinding24Lower,
    description: "Corona temporal"
  },
  { 
    optionId: FINDING_OPTIONS.CORONA, 
    component: SpaceBetweenFinding25, 
    data: intermediateSpaceOnTheCanvasOfFinding25Lower,
    description: "Corona"
  },
  { 
    optionId: FINDING_OPTIONS.GIROVERSION, 
    component: SpaceBetweenFinding13, 
    data: intermediateSpaceOnTheCanvasOfFinding13Lower,
    description: "Giroversión"
  },
];

const AdultLowerTeeth: React.FC = () => {
  // Usar el hook para obtener solo dientes inferiores
  const lowerTeeth = useLowerTeeth();

  return (
    <>

      {/* Renderizar ToothVisualization con SpaceBetweenTeeth */}
      <div style={ODONTOGRAM_CONFIG.styles.rowContainerLower}>
        {lowerTeeth.map((tooth: any, index: number) => (
          <React.Fragment key={tooth.id}>
            <ToothVisualization 
              idTooth={tooth.id as string | number} 
              zones={tooth.zones} 
              design={tooth.displayProperties.design} 
              position="lower"
              isChild={false}
            />
            {index < spaceBetweenLegendsLower.length && (
              <SpaceBetweenTeeth
                idIntermediateSpaceOnTheCanvasOfFinding7={intermediateSpaceOnTheCanvasOfFinding7Lower[index].id}
                idIntermediateSpaceOnTheCanvasOfFinding6={intermediateSpaceOnTheCanvasOfFinding6Lower[index].id} 
              />
            )}
          </React.Fragment>
        ))}
      </div>
    {/* Renderizar filas de hallazgos usando el componente genérico */}
    {FINDING_ROWS_CONFIG.slice().reverse().map(({ optionId, component: SpacingComponent, data }) => {
      const shouldRender = useShouldRenderFindingRow(optionId, 'lower');
      
      if (!shouldRender) {
        return null;
      }
      
      return (
        <ToothRow
          key={optionId}
          optionId={optionId}
          spacingComponent={SpacingComponent}
          spacingData={data}
          spaceBetweenLegends={spaceBetweenLegendsLower}
          position="lower"
        />
      );
    })}

      {/* Renderizar ToothDetails con SpaceBetweenLegends */}
      <div style={ODONTOGRAM_CONFIG.styles.rowContainer}>
        {lowerTeeth.map((tooth: any, index: number) => (
          <React.Fragment key={tooth.id}>
            <ToothDetails idTooth={tooth.id as string | number} initialText={""} legend={tooth.id} odontogramType="adult" />
            {index < spaceBetweenLegendsLower.length && (
              <SpaceBetweenLegends
                id={spaceBetweenLegendsLower[index].id}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      
    </>
  );
};

export default AdultLowerTeeth;
