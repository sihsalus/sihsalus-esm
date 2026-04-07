import React, { createContext, useContext, useMemo } from 'react';
import { useStore, StoreApi } from 'zustand';
import { createAdultDentalDataStore } from '../store/adultDentalData';
import { createChildDentalDataStore } from '../store/childDentalData';
import { createAdultSpaceBetweenDataStore } from '../store/adultSpaceBetweenMainSectionsOnTheCanvasData';
import { createChildSpaceBetweenDataStore } from '../store/childSpaceBetweenMainSectionsOnTheCanvasData';

// Tipos para los stores
type DentalStoreApi = StoreApi<any>;
type SpaceStoreApi = StoreApi<any>;

interface OdontogramStore {
  dental: DentalStoreApi;
  space: SpaceStoreApi;
}

const OdontogramContext = createContext<OdontogramStore | undefined>(undefined);

interface OdontogramProviderProps {
  children: React.ReactNode;
  type: 'adult' | 'child';
}

export const OdontogramProvider: React.FC<OdontogramProviderProps> = ({ children, type }) => {
  const value = useMemo(() => {
    if (type === 'adult') {
      // Lazy DI wiring for circular deps
      let dentalRef: DentalStoreApi;
      let spaceRef: SpaceStoreApi;
      const getSpace = () => spaceRef;
      const getDental = () => dentalRef;
      dentalRef = createAdultDentalDataStore(getSpace);
      spaceRef = createAdultSpaceBetweenDataStore(getDental);
      return { dental: dentalRef, space: spaceRef };
    } else {
      let dentalRef: DentalStoreApi;
      let spaceRef: SpaceStoreApi;
      const getSpace = () => spaceRef;
      const getDental = () => dentalRef;
      dentalRef = createChildDentalDataStore(getSpace);
      spaceRef = createChildSpaceBetweenDataStore(getDental);
      return { dental: dentalRef, space: spaceRef };
    }
  }, [type]);

  return (
    <OdontogramContext.Provider value={value}>
      {children}
    </OdontogramContext.Provider>
  );
};

function useCtx(): OdontogramStore {
  const ctx = useContext(OdontogramContext);
  if (!ctx) throw new Error('useDentalDataStore must be used within OdontogramProvider');
  return ctx;
}

export function useDentalDataStore<T>(selector: (state: any) => T): T {
  const { dental } = useCtx();
  return useStore(dental, selector);
}

export function useSpaceBetweenDataStore<T>(selector: (state: any) => T): T {
  const { space } = useCtx();
  return useStore(space, selector);
}
