import { create } from 'zustand';

import { adultConfig } from '../odontogram/config/adultConfig';
import { createEmptyOdontogramData, type OdontogramData } from '../odontogram/types/odontogram';

type OdontogramDataState = {
  currentPatientUuid: string | null;
  data: OdontogramData;
  setData: (nextData: OdontogramData) => void;
  setPatient: (patientUuid: string) => void;
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
  resetData: () => set({ data: createEmptyOdontogramData(adultConfig) }),
}));

export default useOdontogramDataStore;
