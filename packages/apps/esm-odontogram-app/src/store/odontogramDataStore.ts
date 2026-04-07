import { create } from 'zustand';

import { adultConfig } from '../odontogram/config/adultConfig';
import { createEmptyOdontogramData, type OdontogramData } from '../odontogram/types/odontogram';

type OdontogramDataState = {
  data: OdontogramData;
  setData: (nextData: OdontogramData) => void;
  resetData: () => void;
};

const initialData = createEmptyOdontogramData(adultConfig);

const useOdontogramDataStore = create<OdontogramDataState>((set) => ({
  data: initialData,
  setData: (nextData) => set({ data: nextData }),
  resetData: () => set({ data: createEmptyOdontogramData(adultConfig) }),
}));

export default useOdontogramDataStore;
