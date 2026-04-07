import React from 'react';
import { useTranslation } from 'react-i18next';

const infoStyle: React.CSSProperties = {
  color: '#525252',
  fontSize: '0.875rem',
  lineHeight: 1.5,
  padding: '0.5rem 0 1rem',
};

export default function AdultLowerTeeth() {
  const { t } = useTranslation();

  return (
    <div style={infoStyle}>
      <strong>{t('adultLowerTeethTitle', 'Cuadrantes 3 y 4')}</strong>
      <div>{t('adultLowerTeethDescription', 'La representación detallada de 31–48 está pendiente de conexión con la data de cuadrante inferior.')}</div>
    </div>
  );
}// @ts-expect-error TS(1208): 'AdultLowerTeeth.tsx' cannot be compiled under '--... Remove this comment to see the full error message
