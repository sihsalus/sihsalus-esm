import { ConfigurableLink, useConfig, usePatient } from '@openmrs/esm-framework';
import React from 'react';

import type { ConfigObject } from '../../config-schema';

export const basePath = '${openmrsSpaBase}/patient/';

const GenericNavLinks: React.FC = () => {
  const { specialClinics } = useConfig<ConfigObject>();
  const { patientUuid } = usePatient();

  return (
    <>
      {specialClinics.map((clinic) => (
        <GenericLink key={clinic.id} title={clinic.title} path={clinic.id} patientUuid={patientUuid} />
      ))}
    </>
  );
};

export default GenericNavLinks;

const GenericLink: React.FC<{ title: string; path: string; patientUuid: string }> = ({ title, path, patientUuid }) => {
  return (
    <ConfigurableLink
      style={{ paddingLeft: '2rem' }}
      className={`cds--side-nav__link`}
      to={`${basePath}${patientUuid}/chart/${encodeURIComponent('special-clinics-dashboard')}?clinic=${path}`}
    >
      {title}
    </ConfigurableLink>
  );
};
