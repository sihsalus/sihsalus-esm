import React from 'react';
import { useTranslation } from 'react-i18next';

const infoStyle: React.CSSProperties = {
  color: '#525252',
  fontSize: '0.875rem',
  lineHeight: 1.5,
  padding: '0.5rem 0 0.25rem',
};

export default function KidUpperTeeth() {
  const { t } = useTranslation();

  return (
    <div style={infoStyle}>
      <strong>{t('kidUpperTeethTitle', 'Dentición decidua superior (51–65)')}</strong>
      <div>{t('kidUpperTeethDescription', 'La vista detallada de la arcada superior decidua está pendiente de implementación.')}</div>
    </div>
  );
}