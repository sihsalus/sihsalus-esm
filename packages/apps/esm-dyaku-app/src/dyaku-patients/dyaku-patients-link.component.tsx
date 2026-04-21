import { ClickableTile, Layer } from '@carbon/react';
import { ArrowRight } from '@carbon/react/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';

const DyakuPatientsLink: React.FC = () => {
  const { t } = useTranslation();
  const href = `${globalThis.spaBase ?? '/openmrs/spa'}/dyaku-patients`;

  return (
    <Layer>
      <ClickableTile
        href={href}
        onClick={(event) => {
          event.preventDefault();
          globalThis.open(href, '_blank', 'noopener,noreferrer');
        }}
      >
        <div>
          <div className="heading">{t('dyakuPatients', 'Pacientes Dyaku MINSA')}</div>
          <div className="content">
            {t('dyakuPatientsDescription', 'Consultar pacientes del sistema FHIR Dyaku del MINSA')}
          </div>
        </div>
        <div className="iconWrapper">
          <ArrowRight size={16} />
        </div>
      </ClickableTile>
    </Layer>
  );
};

export default DyakuPatientsLink;
