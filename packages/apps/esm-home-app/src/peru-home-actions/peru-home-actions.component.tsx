import {
  Calendar,
  Document,
  Microscope,
  Search,
  UserFollow,
  WatsonHealthStackedScrolling_1,
} from '@carbon/react/icons';
import {
  AppointmentsPictogram,
  Assessment1Pictogram,
  ConfigurableLink,
  LaboratoryPictogram,
  PatientSearchPictogram,
  RegistrationPictogram,
  ServiceQueuesPictogram,
} from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './peru-home-actions.scss';

type ActionIllustration = React.ComponentType<{ className?: string; size?: number }>;
type ActionIcon = React.ComponentType<{ className?: string; size?: number | string }>;

type Action = {
  key: string;
  descriptionKey: string;
  href: string;
  icon: ActionIcon;
  illustration: ActionIllustration;
  toneClass: string;
};

// t('searchPatient', 'Search patient')
// t('searchPatientDescription', 'Find an existing patient record')
// t('registerPatient', 'Register patient')
// t('registerPatientDescription', 'Create a new patient record')
// t('careQueues', 'Care queues')
// t('careQueuesDescription', 'Manage patient service queues')
// t('appointments', 'Appointments')
// t('appointmentsDescription', 'View and manage appointments')
// t('laboratory', 'Laboratory')
// t('laboratoryDescription', 'Review lab orders and results')
// t('fua', 'FUA')
// t('fuaDescription', 'Manage Formato Unico de Atencion')
const actions = [
  {
    key: 'searchPatient',
    descriptionKey: 'searchPatientDescription',
    href: '/search',
    icon: Search,
    illustration: PatientSearchPictogram,
    toneClass: 'patientSearchAction',
  },
  {
    key: 'registerPatient',
    descriptionKey: 'registerPatientDescription',
    href: '/patient-registration',
    icon: UserFollow,
    illustration: RegistrationPictogram,
    toneClass: 'registrationAction',
  },
  {
    key: 'careQueues',
    descriptionKey: 'careQueuesDescription',
    href: '/home/service-queues',
    icon: WatsonHealthStackedScrolling_1,
    illustration: ServiceQueuesPictogram,
    toneClass: 'queuesAction',
  },
  {
    key: 'appointments',
    descriptionKey: 'appointmentsDescription',
    href: '/home/appointments',
    icon: Calendar,
    illustration: AppointmentsPictogram,
    toneClass: 'appointmentsAction',
  },
  {
    key: 'laboratory',
    descriptionKey: 'laboratoryDescription',
    href: '/home/laboratory',
    icon: Microscope,
    illustration: LaboratoryPictogram,
    toneClass: 'laboratoryAction',
  },
  {
    key: 'fua',
    descriptionKey: 'fuaDescription',
    href: '/home/fua-request',
    icon: Document,
    /*No encontré un ícono que representara esta acción xd*/
    illustration: Assessment1Pictogram,
    toneClass: 'fuaAction',
  },
] satisfies Array<Action>;

const PeruHomeActions: React.FC = () => {
  const { t } = useTranslation();
  const spaBase = globalThis.spaBase ?? globalThis.getOpenmrsSpaBase?.() ?? '/openmrs/spa';

  return (
    <section className={styles.quickActions} aria-label={t('peruHomeActions', 'Accesos de admisión')}>
      {actions.map(({ key, descriptionKey, href, icon: Icon, illustration: Illustration, toneClass }) => (
        <ConfigurableLink key={key} className={`${styles.actionLink} ${styles[toneClass]}`} to={`${spaBase}${href}`}>
          <span className={styles.actionHeader}>
            <Icon size={24} />
            <span className={styles.actionText}>
              <strong>{t(key)}</strong>
              <span>{t(descriptionKey)}</span>
            </span>
          </span>
          <span className={styles.illustrationArea} aria-hidden="true">
            <Illustration className={styles.actionIllustration} size={128} />
          </span>
        </ConfigurableLink>
      ))}
    </section>
  );
};

export default PeruHomeActions;
