// @ts-nocheck
import { create } from 'zustand';
import { PositionUtils, ID_MAPPING } from '../config/odontogramConfig';

// Tipos para la data centralizada
export interface ToothData {
  id: string;
  position: 'upper' | 'lower';
  type: string;
  findings: Finding[];
  displayProperties: any;
  zones: number;
}

export interface SpaceData {
  id: string;
  position: 'upper' | 'lower';
  leftToothId: string;
  rightToothId: string;
  findings: Finding[];
}

export interface Finding {
  id: number;
  design: number;
  zone?: number;
  color: any;
  position: 'upper' | 'lower';
  uniqueId: string;
  optionId?: number;
  subOptionId?: number;
}

interface OdontogramDataState {
  // Data centralizada
  teeth: ToothData[];
  spaces: SpaceData[];
  
  // Inicialización
  initializeData: () => void;
  
  // Operaciones de dientes
  getToothById: (id: string) => ToothData | undefined;
  getTeethByPosition: (position: 'upper' | 'lower') => ToothData[];
  updateTooth: (id: string, updates: Partial<ToothData>) => void;
  addFindingToTooth: (toothId: string, finding: Finding) => void;
  removeFindingFromTooth: (toothId: string, findingId: string) => void;
  
  // Operaciones de espacios
  getSpaceById: (id: string) => SpaceData | undefined;
  getSpacesByPosition: (position: 'upper' | 'lower') => SpaceData[];
  updateSpace: (id: string, updates: Partial<SpaceData>) => void;
  addFindingToSpace: (spaceId: string, finding: Finding) => void;
  removeFindingFromSpace: (spaceId: string, findingId: string) => void;
  
  // Operaciones de hallazgos de fila completa
  applyRowFinding: (findingId: number, position: 'upper' | 'lower') => void;
  removeRowFinding: (findingId: number, position: 'upper' | 'lower') => void;
  
  // Operaciones bidireccionales
  notifyAdjacentEntities: (entityId: string, findingId: number, isTooth: boolean) => void;
  
  // Exportación
  exportData: () => any;
  exportForOpenMRS: () => any;
}

// Store centralizado
export const useOdontogramDataStore = create<OdontogramDataState>((set, get) => ({
  teeth: [],
  spaces: [],
  
  // Inicialización automática de la data
  initializeData: () => {
    const teeth: ToothData[] = [];
    const spaces: SpaceData[] = [];
    
    // Inicializar dientes
    ID_MAPPING.teeth.upper.forEach(id => {
      teeth.push({
        id,
        position: 'upper',
        type: 'adult',
        findings: [],
        displayProperties: {},
        zones: 4 // Por defecto, se puede ajustar según el tipo
      });
    });
    
    ID_MAPPING.teeth.lower.forEach(id => {
      teeth.push({
        id,
        position: 'lower',
        type: 'adult',
        findings: [],
        displayProperties: {},
        zones: 4
      });
    });
    
    // Inicializar espacios
    ID_MAPPING.spaces.upper.forEach((id, index) => {
      const leftToothId = ID_MAPPING.teeth.upper[index];
      const rightToothId = ID_MAPPING.teeth.upper[index + 1];
      if (leftToothId && rightToothId) {
        spaces.push({
          id,
          position: 'upper',
          leftToothId,
          rightToothId,
          findings: []
        });
      }
    });
    
    ID_MAPPING.spaces.lower.forEach((id, index) => {
      const leftToothId = ID_MAPPING.teeth.lower[index];
      const rightToothId = ID_MAPPING.teeth.lower[index + 1];
      if (leftToothId && rightToothId) {
        spaces.push({
          id,
          position: 'lower',
          leftToothId,
          rightToothId,
          findings: []
        });
      }
    });
    
    set({ teeth, spaces });
  },
  
  // Operaciones de dientes
  getToothById: (id: string) => {
    return get().teeth.find(tooth => tooth.id === id);
  },
  
  getTeethByPosition: (position: 'upper' | 'lower') => {
    return get().teeth.filter(tooth => tooth.position === position);
  },
  
  updateTooth: (id: string, updates: Partial<ToothData>) => {
    set(state => ({
      teeth: state.teeth.map(tooth => 
        tooth.id === id ? { ...tooth, ...updates } : tooth
      )
    }));
  },
  
  addFindingToTooth: (toothId: string, finding: Finding) => {
    set(state => ({
      teeth: state.teeth.map(tooth => 
        tooth.id === toothId 
          ? { ...tooth, findings: [...tooth.findings, finding] }
          : tooth
      )
    }));
  },
  
  removeFindingFromTooth: (toothId: string, findingId: string) => {
    set(state => ({
      teeth: state.teeth.map(tooth => 
        tooth.id === toothId 
          ? { ...tooth, findings: tooth.findings.filter(f => f.uniqueId !== findingId) }
          : tooth
      )
    }));
  },
  
  // Operaciones de espacios
  getSpaceById: (id: string) => {
    return get().spaces.find(space => space.id === id);
  },
  
  getSpacesByPosition: (position: 'upper' | 'lower') => {
    return get().spaces.filter(space => space.position === position);
  },
  
  updateSpace: (id: string, updates: Partial<SpaceData>) => {
    set(state => ({
      spaces: state.spaces.map(space => 
        space.id === id ? { ...space, ...updates } : space
      )
    }));
  },
  
  addFindingToSpace: (spaceId: string, finding: Finding) => {
    set(state => ({
      spaces: state.spaces.map(space => 
        space.id === spaceId 
          ? { ...space, findings: [...space.findings, finding] }
          : space
      )
    }));
  },
  
  removeFindingFromSpace: (spaceId: string, findingId: string) => {
    set(state => ({
      spaces: state.spaces.map(space => 
        space.id === spaceId 
          ? { ...space, findings: space.findings.filter(f => f.uniqueId !== findingId) }
          : space
      )
    }));
  },
  
  // Operaciones de hallazgos de fila completa
  applyRowFinding: (findingId: number, position: 'upper' | 'lower') => {
    const teeth = get().getTeethByPosition(position);
    teeth.forEach(tooth => {
      const finding: Finding = {
        id: findingId,
        design: 1,
        color: { name: 'blue' },
        position,
        uniqueId: `${tooth.id}-${findingId}-${Date.now()}`
      };
      get().addFindingToTooth(tooth.id, finding);
    });
  },
  
  removeRowFinding: (findingId: number, position: 'upper' | 'lower') => {
    set(state => ({
      teeth: state.teeth.map(tooth => 
        tooth.position === position 
          ? { ...tooth, findings: tooth.findings.filter(f => f.id !== findingId) }
          : tooth
      )
    }));
  },
  
  // Operaciones bidireccionales
  notifyAdjacentEntities: (entityId: string, findingId: number, isTooth: boolean) => {
    if (isTooth) {
      // Si es un diente, notificar espacios adyacentes
      const tooth = get().getToothById(entityId);
      if (tooth) {
        const adjacentSpaces = get().spaces.filter(space => 
          space.leftToothId === entityId || space.rightToothId === entityId
        );
        // Aquí se implementaría la lógica específica de cada hallazgo
      }
    } else {
      // Si es un espacio, notificar dientes adyacentes
      const space = get().getSpaceById(entityId);
      if (space) {
        const leftTooth = get().getToothById(space.leftToothId);
        const rightTooth = get().getToothById(space.rightToothId);
        // Aquí se implementaría la lógica específica de cada hallazgo
      }
    }
  },
  
  // Exportación de datos
  exportData: () => {
    const state = get();
    return {
      teeth: state.teeth,
      spaces: state.spaces,
      timestamp: new Date().toISOString()
    };
  },
  
  exportForOpenMRS: () => {
    const state = get();
    return {
      observations: state.teeth.flatMap(tooth => 
        tooth.findings.map(finding => ({
          concept: `TOOTH_${tooth.id}_FINDING_${finding.id}`,
          value: finding.design,
          location: tooth.position,
          timestamp: new Date().toISOString()
        }))
      ),
      spaces: state.spaces.flatMap(space => 
        space.findings.map(finding => ({
          concept: `SPACE_${space.id}_FINDING_${finding.id}`,
          value: finding.design,
          location: space.position,
          timestamp: new Date().toISOString()
        }))
      )
    };
  }
})); 