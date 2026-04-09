import { create } from 'zustand';

import { adultConfig } from '../odontogram/config/adultConfig';
import { createEmptyOdontogramData, type OdontogramData } from '../odontogram/types/odontogram';

export type OdontogramFindingSource = 'tooth' | 'spacing' | 'legend';

export interface OdontogramFindingRecord {
  id: string;
  findingId: number;
  source: OdontogramFindingSource;
  toothId?: number;
  leftToothId?: number;
  rightToothId?: number;
  subOptionId?: number;
  colorId?: number;
  colorName?: string;
  designNumber?: number | null;
}

type OdontogramDataState = {
  currentPatientUuid: string | null;
  data: OdontogramData;
  setData: (nextData: OdontogramData) => void;
  setPatient: (patientUuid: string) => void;
  getAllFindings: () => OdontogramFindingRecord[];
  resetData: () => void;
};

const useOdontogramDataStore = create<OdontogramDataState>((set, get) => ({
  currentPatientUuid: null,
  data: createEmptyOdontogramData(adultConfig),
  setData: (nextData) => set({ data: nextData }),
  setPatient: (patientUuid) => {
    if (get().currentPatientUuid !== patientUuid) {
      set({ currentPatientUuid: patientUuid, data: createEmptyOdontogramData(adultConfig) });
    }
  },
  getAllFindings: () => {
    const { data } = get();

    const toothFindings: OdontogramFindingRecord[] = data.teeth.flatMap((tooth) =>
      tooth.findings.map((finding) => ({
        id: finding.id,
        findingId: finding.findingId,
        source: 'tooth',
        toothId: tooth.toothId,
        subOptionId: finding.subOptionId,
        colorId: finding.color?.id,
        colorName: finding.color?.name,
        designNumber: finding.designNumber,
      })),
    );

    const spacingFindings: OdontogramFindingRecord[] = Object.values(data.spacingFindings).flatMap((spaces) =>
      spaces.flatMap((space) =>
        space.findings.map((finding) => ({
          id: finding.id,
          findingId: finding.findingId,
          source: 'spacing',
          leftToothId: space.leftToothId,
          rightToothId: space.rightToothId,
          colorId: finding.color?.id,
          colorName: finding.color?.name,
          designNumber: finding.designNumber,
        })),
      ),
    );

    const legendFindings: OdontogramFindingRecord[] = data.legendSpaces.flatMap((space) =>
      space.findings.map((finding) => ({
        id: finding.id,
        findingId: finding.findingId,
        source: 'legend',
        leftToothId: space.leftToothId,
        rightToothId: space.rightToothId,
        colorId: finding.color?.id,
        colorName: finding.color?.name,
        designNumber: finding.designNumber,
      })),
    );

    return [...toothFindings, ...spacingFindings, ...legendFindings];
  },
  resetData: () => set({ data: createEmptyOdontogramData(adultConfig) }),
}));

export default useOdontogramDataStore;
