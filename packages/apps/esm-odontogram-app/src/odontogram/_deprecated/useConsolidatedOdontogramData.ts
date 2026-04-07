import { useMemo } from 'react';
import type { Tooth, SpaceData, ToothPosition } from '../types';
import odontogramData from '../data/odontogramData.json';

interface OdontogramData {
  metadata: any;
  teeth: Tooth[];
  spacingData: {
    upper: SpacingPosition;
    lower: SpacingPosition;
  };
}

interface SpacingPosition {
  spaceBetweenLegends: SpaceData[];
  findingSpaces: Record<string, SpaceData[]>;
}

/**
 * Hook principal para acceder a todos los datos del odontograma consolidado
 */
export const useOdontogramData = (): OdontogramData => {
  return useMemo(() => odontogramData as any, []);
};

/**
 * Hook para obtener los datos de los dientes
 */
export const useTeethData = (): Tooth[] => {
  const data = useOdontogramData();
  return useMemo(() => data.teeth, [data]);
};

/**
 * Hook para obtener dientes por posición
 */
export const useTeethByPosition = (position: ToothPosition): Tooth[] => {
  const teeth = useTeethData();
  return useMemo(() => {
    return teeth.filter(tooth => tooth.position === position);
  }, [teeth, position]);
};

/**
 * Hook para obtener dientes superiores
 */
export const useUpperTeeth = (): Tooth[] => {
  return useTeethByPosition('upper');
};

/**
 * Hook para obtener dientes inferiores
 */
export const useLowerTeeth = (): Tooth[] => {
  return useTeethByPosition('lower');
};

/**
 * Hook para obtener un diente específico por ID
 */
export const useToothById = (id: number): Tooth | undefined => {
  const teeth = useTeethData();
  return useMemo(() => {
    return teeth.find(tooth => tooth.id === id);
  }, [teeth, id]);
};

/**
 * Hook para obtener datos de espaciado por posición
 */
export const useSpacingData = (position: ToothPosition): SpacingPosition => {
  const data = useOdontogramData();
  return useMemo(() => {
    return data.spacingData[position];
  }, [data, position]);
};

/**
 * Hook para obtener espacios entre leyendas
 */
export const useSpaceBetweenLegends = (position: ToothPosition): SpaceData[] => {
  const spacingData = useSpacingData(position);
  return useMemo(() => spacingData.spaceBetweenLegends, [spacingData]);
};

/**
 * Hook para obtener espacios superiores entre leyendas
 */
export const useUpperSpaceBetweenLegends = (): SpaceData[] => {
  return useSpaceBetweenLegends('upper');
};

/**
 * Hook para obtener espacios inferiores entre leyendas
 */
export const useLowerSpaceBetweenLegends = (): SpaceData[] => {
  return useSpaceBetweenLegends('lower');
};

/**
 * Hook para obtener espacios de un hallazgo específico
 */
export const useFindingSpaces = (position: ToothPosition, findingName: string): SpaceData[] => {
  const spacingData = useSpacingData(position);
  return useMemo(() => {
    return spacingData.findingSpaces[findingName] || [];
  }, [spacingData, findingName]);
};

/**
 * Hook para obtener espacios de hallazgo superiores
 */
export const useUpperFindingSpaces = (findingName: string): SpaceData[] => {
  return useFindingSpaces('upper', findingName);
};

/**
 * Hook para obtener espacios de hallazgo inferiores
 */
export const useLowerFindingSpaces = (findingName: string) => {
  return useFindingSpaces('lower', findingName);
};

/**
 * Hook para obtener metadata del odontograma
 */
export const useOdontogramMetadata = () => {
  const data = useOdontogramData();
  return useMemo(() => data.metadata, [data]);
};

/**
 * Hook para obtener todos los espacios de hallazgos disponibles por posición
 */
export const useAvailableFindingSpaces = (position: 'upper' | 'lower') => {
  const spacingData = useSpacingData(position);
  return useMemo(() => {
    return Object.keys(spacingData.findingSpaces);
  }, [spacingData]);
};

/**
 * Hook para exportar datos en diferentes formatos
 */
export const useDataExport = () => {
  const data = useOdontogramData();
  
  return useMemo(() => ({
    // Exportar todo el odontograma
    exportComplete: () => data,
    
    // Exportar solo dientes
    exportTeeth: () => data.teeth,
    
    // Exportar solo datos de espaciado
    exportSpacing: () => data.spacingData,
    
    // Exportar por posición
    exportByPosition: (position: 'upper' | 'lower') => ({
      teeth: data.teeth.filter(tooth => tooth.position === position),
      spacing: data.spacingData[position]
    }),
    
    // Formato para OpenMRS (ejemplo)
    exportForOpenMRS: () => ({
      observations: data.teeth.flatMap(tooth => 
        tooth.findings.map(finding => ({
          concept: `TOOTH_${tooth.id}_FINDING_${finding.id}`,
          value: finding.design,
          location: tooth.position,
          timestamp: new Date().toISOString()
        }))
      )
    })
  }), [data]);
};

/**
 * Hook para utilidades de búsqueda y filtrado
 */
export const useOdontogramSearch = () => {
  const teeth = useTeethData();
  
  return useMemo(() => ({
    // Buscar dientes por tipo
    getTeethByType: (type: string) => 
      teeth.filter(tooth => tooth.type === type),
    
    // Buscar dientes con hallazgos
    getTeethWithFindings: () => 
      teeth.filter(tooth => tooth.findings && tooth.findings.length > 0),
    
    // Buscar dientes por rango de IDs
    getTeethByIdRange: (startId: number, endId: number) => 
      teeth.filter(tooth => tooth.id >= startId && tooth.id <= endId),
    
    // Obtener estadísticas
    getStatistics: () => ({
      totalTeeth: teeth.length,
      upperTeeth: teeth.filter(tooth => tooth.position === 'upper').length,
      lowerTeeth: teeth.filter(tooth => tooth.position === 'lower').length,
      teethWithFindings: teeth.filter(tooth => tooth.findings && tooth.findings.length > 0).length,
      teethByType: teeth.reduce((acc, tooth) => {
        acc[tooth.type] = (acc[tooth.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    })
  }), [teeth]);
};
