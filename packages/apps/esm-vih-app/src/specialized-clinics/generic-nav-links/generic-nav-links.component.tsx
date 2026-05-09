import { Tooltip } from '@carbon/react';
import { ConfigurableLink, useConfig } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ConfigObject } from '../../config-schema';

const specialClinicsDashboardPath = 'vih-special-clinics-dashboard';

interface GenericNavLinksProps {
  basePath: string;
}

const GenericNavLinks: React.FC<GenericNavLinksProps> = ({ basePath }) => {
  const { specialClinics } = useConfig<ConfigObject>();
  const { t } = useTranslation();

  return (
    <>
      {specialClinics.map((clinic) => (
        <GenericLink
          key={clinic.id}
          title={clinic.title}
          path={clinic.id}
          basePath={basePath}
          tooltip={t(`${clinic.id}Tooltip`, getDefaultTooltip(clinic.id))}
        />
      ))}
    </>
  );
};

export default GenericNavLinks;

const GenericLink: React.FC<{ title: string; path: string; basePath: string; tooltip: string }> = ({
  title,
  path,
  basePath,
  tooltip,
}) => {
  const link = (
    <ConfigurableLink
      className={`cds--side-nav__link`}
      to={`${basePath}/${encodeURIComponent(specialClinicsDashboardPath)}?clinic=${path}`}
      title={tooltip}
    >
      {title}
    </ConfigurableLink>
  );

  return (
    <div>
      <Tooltip align="right" label={tooltip} enterDelayMs={400} leaveDelayMs={100}>
        {link}
      </Tooltip>
    </div>
  );
};

function getDefaultTooltip(clinicId: string) {
  switch (clinicId) {
    case 'psicologia-clinic':
      return 'Registra evaluación, consejería y seguimiento de salud mental dentro de la atención integral.';
    case 'physiotherapy-clinic':
      return 'Registra evaluación funcional, terapia física, rehabilitación y seguimiento del plan terapéutico.';
    default:
      return 'Registra y revisa atenciones especializadas del paciente.';
  }
}
