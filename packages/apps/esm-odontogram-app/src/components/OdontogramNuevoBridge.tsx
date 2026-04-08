import React, { useCallback } from 'react';

import Odontogram from '../odontogram/components/Odontogram';
import { adultConfig } from '../odontogram/config/adultConfig';
import type { OdontogramData } from '../odontogram/types/odontogram';
import useOdontogramDataStore from '../store/odontogramDataStore';

interface OdontogramNuevoBridgeProps {
  readOnly?: boolean;
}

export default function OdontogramNuevoBridge({ readOnly = false }: OdontogramNuevoBridgeProps) {
  const data = useOdontogramDataStore((state) => state.data);
  const setData = useOdontogramDataStore((state) => state.setData);

  const handleChange = useCallback((nextData: OdontogramData) => {
    setData(nextData);
  }, [setData]);

  return (
    <Odontogram
      config={adultConfig}
      data={data}
      onChange={handleChange}
      readOnly={readOnly}
    />
  );
}
