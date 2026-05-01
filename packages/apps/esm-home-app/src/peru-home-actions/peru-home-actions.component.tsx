import {
  Calendar,
  Document,
  Microscope,
  Search,
  UserFollow,
  WatsonHealthStackedScrolling_1,
} from '@carbon/react/icons';
import { ConfigurableLink } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './peru-home-actions.scss';

const actions = [
  {
    key: 'searchPatient',
    descriptionKey: 'searchPatientDescription',
    href: '/search',
    icon: Search,
  },
  {
    key: 'registerPatient',
    descriptionKey: 'registerPatientDescription',
    href: '/patient-registration',
    icon: UserFollow,
  },
  {
    key: 'careQueues',
    descriptionKey: 'careQueuesDescription',
    href: '/home/service-queues',
    icon: WatsonHealthStackedScrolling_1,
  },
  {
    key: 'appointments',
    descriptionKey: 'appointmentsDescription',
    href: '/home/appointments',
    icon: Calendar,
  },
  {
    key: 'laboratory',
    descriptionKey: 'laboratoryDescription',
    href: '/home/laboratory',
    icon: Microscope,
  },
  {
    key: 'fua',
    descriptionKey: 'fuaDescription',
    href: '/home/fua-request',
    icon: Document,
  },
];

const PeruHomeActions: React.FC = () => {
  const { t } = useTranslation();
  const spaBase = globalThis.spaBase ?? globalThis.getOpenmrsSpaBase?.() ?? '/openmrs/spa';

  return (
    <section className={styles.quickActions} aria-label={t('peruHomeActions', 'Accesos de admisión')}>
      {actions.map(({ key, descriptionKey, href, icon: Icon }) => (
        <ConfigurableLink key={key} className={styles.actionLink} to={`${spaBase}${href}`}>
          <Icon size={24} />
          <span className={styles.actionText}>
            <strong>{t(key)}</strong>
            <span>{t(descriptionKey)}</span>
          </span>
        </ConfigurableLink>
      ))}
    </section>
  );
};

export default PeruHomeActions;
