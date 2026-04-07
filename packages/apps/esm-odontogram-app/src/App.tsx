import React from 'react';
import { useTranslation } from 'react-i18next';
import AdultUpperTeeth from './components/AdultUpperTeeth';
import AdultLowerTeeth from './components/AdultLowerTeeth';
import FormDentalClinicalFindings from './components/FormDentalClinicalFindings';
import KidLowerTeeth from './components/KidLowerTeeth';
import KidUpperTeeth from './components/KidUpperTeeth';

const sectionLabel: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#525252',
  marginBottom: '0.25rem',
  marginTop: '1rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const divider: React.CSSProperties = {
  borderTop: '1px dashed #c6c6c6',
  margin: '0.75rem 0',
};

export default function App() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '1rem 0' }}>
      <FormDentalClinicalFindings />

      <div style={sectionLabel}>{t('permanentUpperTeethSection', 'Dientes permanentes — arcada superior (11–28)')}</div>
      <AdultUpperTeeth />

      <div style={divider} />

      <div style={sectionLabel}>{t('permanentLowerTeethSection', 'Dientes permanentes — arcada inferior (31–48)')}</div>
      <AdultLowerTeeth />

      <div style={divider} />

      <div style={sectionLabel}>{t('deciduousTeethSection', 'Dientes deciduos — superior (51–65) e inferior (71–85)')}</div>
      <KidUpperTeeth />
      <KidLowerTeeth />
    </div>
  );
}
