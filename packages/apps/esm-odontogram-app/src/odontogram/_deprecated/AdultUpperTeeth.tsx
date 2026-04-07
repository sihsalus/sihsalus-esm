import React from "react";
import SpaceBetweenLegends from "./spacingBetweenMainSectionsOnTheCanvas/SpaceBetweenLegends";
import SpaceBetweenTeeth from "./spacingBetweenMainSectionsOnTheCanvas/SpaceBetweenTeeth";
import ToothDetails from "./ToothDetails";
import ToothVisualization from "./ToothVisualization";
import ToothRow from "./ToothRow";
import { spacingData } from "../data/odontogramData.json";

// Extract upper spacing data
const {
  spaceBetweenLegends,
  findingSpaces: {
    finding1: intermediateSpaceOnTheCanvasOfFinding1,
    finding2: intermediateSpaceOnTheCanvasOfFinding2,
    finding6: intermediateSpaceOnTheCanvasOfFinding6,
    finding7: intermediateSpaceOnTheCanvasOfFinding7,
    finding13: intermediateSpaceOnTheCanvasOfFinding13,
    finding24: intermediateSpaceOnTheCanvasOfFinding24,
    finding25: intermediateSpaceOnTheCanvasOfFinding25,
    finding26: intermediateSpaceOnTheCanvasOfFinding26,
    finding30: intermediateSpaceOnTheCanvasOfFinding30,
    finding31: intermediateSpaceOnTheCanvasOfFinding31,
    finding32: intermediateSpaceOnTheCanvasOfFinding32,
    finding39: intermediateSpaceOnTheCanvasOfFinding39,
  }
} = spacingData.upper;
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
import { useUpperTeeth } from "../hooks/useTeethByPosition";
import { useShouldRenderFindingRow } from "../hooks/useFindingVisibility";

// Configuración de filas de hallazgos para evitar repetición
const FINDING_ROWS_CONFIG = [
  { 
    optionId: FINDING_OPTIONS.APARATO_ORTODONTICO_FIJO, 
    component: SpaceBetweenFinding1, 
    data: intermediateSpaceOnTheCanvasOfFinding1,
    description: "Aparato ortodóntico fijo"
  },
  { 
    optionId: FINDING_OPTIONS.APARATO_ORTODONTICO_REMOVIBLE, 
    component: SpaceBetweenFinding2, 
    data: intermediateSpaceOnTheCanvasOfFinding2,
    description: "Aparato ortodóntico removible"
  },
  { 
    optionId: FINDING_OPTIONS.MOVILIDAD_PATOLOGICA, 
    component: SpaceBetweenFinding30, 
    data: intermediateSpaceOnTheCanvasOfFinding30,
    description: "Movilidad patológica"
  },
  { 
    optionId: FINDING_OPTIONS.EDENTULO_TOTAL, 
    component: SpaceBetweenFinding31, 
    data: intermediateSpaceOnTheCanvasOfFinding31,
    description: "Edéntulo total"
  },
  { 
    optionId: FINDING_OPTIONS.PIEZA_DENTARIA_AUSENTE, 
    component: SpaceBetweenFinding32, 
    data: intermediateSpaceOnTheCanvasOfFinding32,
    description: "Pieza dentaria ausente"
  },
  { 
    optionId: FINDING_OPTIONS.DIENTE_AUSENTE, 
    component: SpacingBetweenFinding26, 
    data: intermediateSpaceOnTheCanvasOfFinding26,
    description: "Diente ausente"
  },
  { 
    optionId: FINDING_OPTIONS.TRANSPOSICION_DENTARIA, 
    component: SpacingBetweenFinding39, 
    data: intermediateSpaceOnTheCanvasOfFinding39,
    description: "Transposición dentaria"
  },
  { 
    optionId: FINDING_OPTIONS.CORONA_TEMPORAL, 
    component: SpaceBetweenFinding24, 
    data: intermediateSpaceOnTheCanvasOfFinding24,
    description: "Corona temporal"
  },
  { 
    optionId: FINDING_OPTIONS.CORONA, 
    component: SpaceBetweenFinding25, 
    data: intermediateSpaceOnTheCanvasOfFinding25,
    description: "Corona"
  },
  { 
    optionId: FINDING_OPTIONS.GIROVERSION, 
    component: SpaceBetweenFinding13, 
    data: intermediateSpaceOnTheCanvasOfFinding13,
    description: "Giroversión"
  },
];

const AdultUpperTeeth: React.FC = () => {
  // Usar el hook para obtener solo dientes superiores
  const upperTeeth = useUpperTeeth();

  return (
    <>
      {/* Renderizar ToothDetails con SpaceBetweenLegends */}
      <div style={ODONTOGRAM_CONFIG.styles.rowContainer}>
        {upperTeeth.map((tooth: any, index: number) => (
          <React.Fragment key={tooth.id}>
            <ToothDetails idTooth={tooth.id as string | number} initialText={""} legend={tooth.id} odontogramType="adult" />
            {index < spaceBetweenLegends.length && (
              <SpaceBetweenLegends
                id={spaceBetweenLegends[index].id}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Renderizar filas de hallazgos usando el componente genérico */}
      {FINDING_ROWS_CONFIG.map(({ optionId, component: SpacingComponent, data }) => {
        const shouldRender = useShouldRenderFindingRow(optionId, 'upper');
        
        if (!shouldRender) {
          return null;
        }
        
        return (
          <ToothRow
            key={optionId}
            optionId={optionId}
            spacingComponent={SpacingComponent}
            spacingData={data}
            spaceBetweenLegends={spaceBetweenLegends}
          />
        );
      })}

      {/* Renderizar ToothVisualization con SpaceBetweenTeeth */}
      <div style={ODONTOGRAM_CONFIG.styles.rowContainerUpper}>
        {upperTeeth.map((tooth: any, index: number) => (
          <React.Fragment key={tooth.id}>
            <ToothVisualization 
              idTooth={tooth.id as string | number} 
              zones={tooth.zones} 
              design={tooth.displayProperties.design} 
              position="upper"
              isChild={false}
            />
            {index < spaceBetweenLegends.length && (
              <SpaceBetweenTeeth
                idIntermediateSpaceOnTheCanvasOfFinding7={intermediateSpaceOnTheCanvasOfFinding7[index].id}
                idIntermediateSpaceOnTheCanvasOfFinding6={intermediateSpaceOnTheCanvasOfFinding6[index].id} 
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default AdultUpperTeeth;