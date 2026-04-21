import { create } from 'zustand';

import { adultConfig } from '../odontogram/config/adultConfig';
import { createEmptyOdontogramData, type OdontogramData } from '../odontogram/types/odontogram';
import type { OdontogramRecordType } from '../types/odontogram-record';

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
  /** UUID of the encounter being viewed in the dashboard selector */
  selectedEncounterUuid: string | null;
  /**
   * UUID of the base odontogram that is currently "active" in the dashboard.
   * When creating a new attention, it will be associated to this base.
   * Follows the selected record: if the user picks an attention, the active base
   * is its parent; if the user picks a base, the active base is that base.
   */
  activeBaseEncounterUuid: string | null;
  /** Whether the workspace is creating/editing a base or attention odontogram */
  workspaceMode: OdontogramRecordType;
  data: OdontogramData;
  setData: (nextData: OdontogramData) => void;
  setPatient: (patientUuid: string) => void;
  setSelectedEncounterUuid: (uuid: string | null) => void;
  setActiveBaseEncounterUuid: (uuid: string | null) => void;
  setWorkspaceMode: (mode: OdontogramRecordType) => void;
  getAllFindings: () => OdontogramFindingRecord[];
  resetData: () => void;
};

const useOdontogramDataStore = create<OdontogramDataState>((set, get) => ({
  currentPatientUuid: null,
  selectedEncounterUuid: null,
  activeBaseEncounterUuid: null,
  workspaceMode: 'base',
  data: createEmptyOdontogramData(adultConfig),
  setData: (nextData) => set({ data: nextData }),
  setPatient: (patientUuid) => {
    if (get().currentPatientUuid !== patientUuid) {
      set({
        currentPatientUuid: patientUuid,
        selectedEncounterUuid: null,
        activeBaseEncounterUuid: null,
        data: createEmptyOdontogramData(adultConfig),
      });
    }
  },
  setSelectedEncounterUuid: (uuid) => set({ selectedEncounterUuid: uuid }),
  setActiveBaseEncounterUuid: (uuid) => set({ activeBaseEncounterUuid: uuid }),
  setWorkspaceMode: (mode) => set({ workspaceMode: mode }),
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
