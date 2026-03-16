import { createGlobalStore, useStore } from '@openmrs/esm-framework';
import { teeth as initialTeeth } from '../data/teethData.json';

interface ToothZone {
  id: number;
  findings: Array<ToothFinding>;
}

interface ToothFinding {
  uniqueId: number;
  optionId: number;
  subOptionId: number | null;
  color: string | null;
  dynamicDesign: number | null;
}

interface Tooth {
  id: number;
  position: string;
  type: string;
  zones: Array<ToothZone>;
  findings: Array<ToothFinding>;
  displayProperties: Record<string, unknown>;
}

interface RegisterFindingParams {
  toothId: number;
  optionId: number;
  subOptionId: number | null;
  color: string | null;
  design: { number: number } | null;
}

interface RemoveFindingParams {
  toothId: number;
  optionId: number;
  subOptionId: number | null;
  dynamicDesign?: number | null;
}

interface DentalDataState {
  teeth: Tooth[];
}

const dentalDataStore = createGlobalStore<DentalDataState>('dentalDataStore', {
  teeth: (initialTeeth as Tooth[]) || [],
});

export const useDentalDataStore = () => useStore(dentalDataStore, (state) => state.teeth);

export const registerFinding = (params: RegisterFindingParams) => {
  dentalDataStore.setState((state) => {
    const { toothId, optionId, subOptionId, color, design } = params;
    const dynamicDesignValue = design?.number || null;

    const newFinding: ToothFinding = {
      uniqueId: Math.floor(Math.random() * 1000000),
      optionId,
      subOptionId,
      color,
      dynamicDesign: dynamicDesignValue,
    };

    const updatedTeeth = state.teeth.map((tooth: Tooth) => {
      if (tooth.id === toothId) {
        const updatedFindings = [...tooth.findings, newFinding];
        return { ...tooth, findings: updatedFindings };
      }
      return tooth;
    });

    return { teeth: updatedTeeth };
  });
};

export const removeFinding = (params: RemoveFindingParams) => {
  dentalDataStore.setState((state) => {
    const { toothId, optionId, subOptionId, dynamicDesign } = params;

    const updatedTeeth = state.teeth.map((tooth: Tooth) => {
      if (tooth.id === toothId) {
        const updatedFindings = tooth.findings.filter(
          (f: ToothFinding) =>
            !(
              f.optionId === optionId &&
              f.subOptionId === subOptionId &&
              (dynamicDesign === undefined || f.dynamicDesign === dynamicDesign)
            ),
        );
        return { ...tooth, findings: updatedFindings };
      }
      return tooth;
    });

    return { teeth: updatedTeeth };
  });
};

export default dentalDataStore;
