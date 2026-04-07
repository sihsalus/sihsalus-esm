import React from 'react';
import { useTranslation } from 'react-i18next';

const infoStyle: React.CSSProperties = {
  color: '#525252',
  fontSize: '0.875rem',
  lineHeight: 1.5,
  padding: '0.25rem 0 1rem',
};

export default function KidLowerTeeth() {
  const { t } = useTranslation();

  return (
    <div style={infoStyle}>
      <strong>{t('kidLowerTeethTitle', 'Dentición decidua inferior (71–85)')}</strong>
      <div>{t('kidLowerTeethDescription', 'La vista detallada de la arcada inferior decidua está pendiente de implementación.')}</div>
    </div>
  );
}