import { ReportData } from '@carbon/react/icons';
import { ConfigurableLink } from '@openmrs/esm-framework';
import classNames from 'classnames';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { basePath, moduleName } from '../constants';

export default function AdmissionDashboardLink() {
  const { t } = useTranslation(moduleName);
  const href = `${globalThis.getOpenmrsSpaBase().slice(0, -1)}${basePath}`;

  const isActive = useMemo(() => window.location.pathname.includes(basePath), []);

  return (
    <ConfigurableLink
      aria-label={`${t('admission', 'Admisión')} ${t('admissionReportByUps', 'Reporte de admisiones por UPS')}`}
      className={classNames('cds--side-nav__link', { 'active-left-nav-link': isActive })}
      to={href}
    >
      <span className="sihsalus-side-nav__item">
        <ReportData aria-hidden="true" className="sihsalus-side-nav__icon" size={20} />
        <span className="sihsalus-side-nav__text">{t('admissionReportByUps', 'Reporte de admisiones por UPS')}</span>
      </span>
    </ConfigurableLink>
  );
}
