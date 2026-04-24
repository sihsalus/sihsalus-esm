import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTranslation } from 'react-i18next';

import { type Encounter } from '../../types';

dayjs.extend(relativeTime);

export interface WardPatientTimeSinceAdmissionProps {
  firstAdmissionOrTransferEncounter: Encounter;
}

const WardPatientTimeSinceAdmission: React.FC<WardPatientTimeSinceAdmissionProps> = ({
  firstAdmissionOrTransferEncounter,
}) => {
  const { t } = useTranslation();
  if (!firstAdmissionOrTransferEncounter?.encounterDatetime) {
    return null;
  }

  const timeSinceAdmission = dayjs(firstAdmissionOrTransferEncounter.encounterDatetime).fromNow();

  return <div>{t('timeSinceAdmission', 'Admitted: {{timeSinceAdmission}}', { timeSinceAdmission })}</div>;
};

export default WardPatientTimeSinceAdmission;
