import { useOdontogramDataStore } from '../store/odontogramDataStore';
import { PositionUtils } from '../config/odontogramConfig';

// Hook para obtener dientes por posición
export const useTeethByPosition = (position: 'upper' | 'lower') => {
  return useOdontogramDataStore(state => state.getTeethByPosition(position));
};

// Hook para obtener dientes superiores
export const useUpperTeeth = () => {
  return useTeethByPosition('upper');
};

// Hook para obtener dientes inferiores
export const useLowerTeeth = () => {
  return useTeethByPosition('lower');
};

// Hook para obtener espacios por posición
export const useSpacesByPosition = (position: 'upper' | 'lower') => {
  return useOdontogramDataStore(state => state.getSpacesByPosition(position));
};

// Hook para obtener espacios superiores
export const useUpperSpaces = () => {
  return useSpacesByPosition('upper');
};

// Hook para obtener espacios inferiores
export const useLowerSpaces = () => {
  return useSpacesByPosition('lower');
};

// Hook para obtener un diente específico
export const useTooth = (id: string) => {
  return useOdontogramDataStore(state => state.getToothById(id));
};

// Hook para obtener un espacio específico
export const useSpace = (id: string) => {
  return useOdontogramDataStore(state => state.getSpaceById(id));
};

// Hook para operaciones de dientes
export const useToothOperations = () => {
  const store = useOdontogramDataStore();
  
  return {
    updateTooth: store.updateTooth,
    addFindingToTooth: store.addFindingToTooth,
    removeFindingFromTooth: store.removeFindingFromTooth,
    applyRowFinding: store.applyRowFinding,
    removeRowFinding: store.removeRowFinding
  };
};

// Hook para operaciones de espacios
export const useSpaceOperations = () => {
  const store = useOdontogramDataStore();
  
  return {
    updateSpace: store.updateSpace,
    addFindingToSpace: store.addFindingToSpace,
    removeFindingFromSpace: store.removeFindingFromSpace
  };
};

// Hook para exportación de datos
export const useDataExport = () => {
  const store = useOdontogramDataStore();
  
  return {
    exportData: store.exportData,
    exportForOpenMRS: store.exportForOpenMRS
  };
};

// Hook para inicialización
export const useOdontogramInitialization = () => {
  const store = useOdontogramDataStore();
  
  return {
    initializeData: store.initializeData
  };
};

// Hook para determinar posición de una entidad
export const usePositionUtils = () => {
  return {
    isUpperTooth: PositionUtils.isUpperTooth,
    isLowerTooth: PositionUtils.isLowerTooth,
    isUpperSpace: PositionUtils.isUpperSpace,
    isLowerSpace: PositionUtils.isLowerSpace,
    getToothPosition: PositionUtils.getToothPosition,
    getSpacePosition: PositionUtils.getSpacePosition
  };
}; 