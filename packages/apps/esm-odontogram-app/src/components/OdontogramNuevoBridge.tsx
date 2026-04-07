import React, { useCallback, useMemo, useState } from 'react';

import Odontogram from '../NUEVO/components/Odontogram';
import { adultConfig } from '../NUEVO/config/adultConfig';
import { createEmptyOdontogramData, type OdontogramData } from '../NUEVO/types/odontogram';
import useDentalDataStore from '../store/dentalData';

const adultToothIds = new Set([
  ...adultConfig.teeth.upper.map((tooth) => tooth.id),
  ...adultConfig.teeth.lower.map((tooth) => tooth.id),
]);

const toFindingColor = (color: any) => {
  if (color && typeof color === 'object') {
    const id = Number(color.id);
    const name = String(color.name ?? color.nombre ?? '').trim();

    if (Number.isFinite(id) && name) {
      return { id, name };
    }
  }

  return { id: 101, name: 'blue' };
};

const fromLegacyStoreToOdontogramData = (): OdontogramData => {
  const base = createEmptyOdontogramData(adultConfig);
  const legacyTeeth = (useDentalDataStore.getState().teeth ?? []) as Array<any>;

  const legacyMap = new Map(legacyTeeth.map((tooth) => [Number(tooth.id), tooth]));

  const teeth = base.teeth.map((tooth) => {
    const legacyTooth = legacyMap.get(tooth.toothId);
    if (!legacyTooth || !adultToothIds.has(tooth.toothId)) {
      return tooth;
    }

    const findings = Array.isArray(legacyTooth.findings)
      ? legacyTooth.findings.map((finding: any, index: number) => ({
          id: String(finding.uniqueId ?? `${tooth.toothId}-${finding.optionId ?? 'f'}-${index}`),
          findingId: Number(finding.optionId),
          subOptionId: finding.subOptionId,
          color: toFindingColor(finding.color),
          designNumber: finding.dynamicDesign ?? null,
        }))
      : [];

    return {
      ...tooth,
      findings,
      notes: legacyTooth.notes ?? '',
    };
  });

  return {
    ...base,
    teeth,
  };
};

const syncOdontogramDataToLegacyStore = (data: OdontogramData) => {
  const findingsByTooth = new Map(
    data.teeth.map((tooth) => [
      tooth.toothId,
      tooth.findings.map((finding) => ({
        uniqueId: Number.parseInt(String(finding.id).replace(/\D/g, ''), 10) || Date.now(),
        optionId: finding.findingId,
        subOptionId: finding.subOptionId,
        color: finding.color,
        dynamicDesign: finding.designNumber ?? null,
      })),
    ]),
  );

  useDentalDataStore.setState((state: any) => ({
    teeth: (state.teeth ?? []).map((tooth: any) => {
      const toothId = Number(tooth.id);
      if (!adultToothIds.has(toothId)) {
        return tooth;
      }

      return {
        ...tooth,
        findings: findingsByTooth.get(toothId) ?? [],
      };
    }),
  }));
};

export default function OdontogramNuevoBridge() {
  const initialData = useMemo(() => fromLegacyStoreToOdontogramData(), []);
  const [data, setData] = useState(initialData);

  const handleChange = useCallback((nextData: OdontogramData) => {
    setData(nextData);
    syncOdontogramDataToLegacyStore(nextData);
  }, []);

  return (
    <Odontogram
      config={adultConfig}
      data={data}
      onChange={handleChange}
      title="Odontograma"
      description="Versión integrada desde responsive-odontogram"
    />
  );
}
