import { Button, ComposedModal, FormLabel, ModalBody, ModalFooter, ModalHeader, TextInput } from '@carbon/react';
import { TrashCan } from '@carbon/react/icons';
import {
  ExtensionSlot,
  fetchCurrentPatient,
  showSnackbar,
  useConfig,
  usePatient,
  useSession,
} from '@openmrs/esm-framework';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './styles.scss';
import GroupFormWorkflowContext from '../context/GroupFormWorkflowContext';
import PatientLocationMismatchModal from '../form-entry-workflow/patient-search-header/PatienMismatchedLocationModal';
import { usePostCohort } from '../hooks';
import { useHsuIdIdentifier } from '../hooks/location-tag.resource';

interface PatientSummary {
  uuid: string;
  name?: Array<{ given?: Array<string>; family?: string }>;
  identifier?: Array<{ value?: string }>;
  [key: string]: unknown;
}

interface FormErrors {
  name?: string | null;
  patientList?: string | null;
  [key: string]: string | null | undefined;
}

interface NewGroupFormProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  patientList: Array<PatientSummary>;
  updatePatientList: (patientUuid: string) => void;
  errors: FormErrors;
  validate: (field?: 'name' | 'patientList') => boolean;
  removePatient: (patientUuid: string) => void;
}

interface AddGroupModalProps {
  patients?: Array<PatientSummary>;
  isCreate?: boolean;
  groupName?: string;
  cohortUuid?: string;
  isOpen: boolean;
  onPostCancel?: () => void;
  onPostSubmit?: () => void;
}

interface CohortPostPayload {
  uuid?: string;
  name: string;
  cohortType?: string;
  location?: string;
  cohortMembers: Array<{ patient: string; startDate: string }>;
}

interface CohortPostError {
  message?: string;
  fieldErrors?: Record<string, Array<{ message?: string }>>;
}

interface SessionLocation {
  uuid: string;
  display?: string;
}

const PatientRow = ({ patient, removePatient }: { patient: PatientSummary; removePatient: (uuid: string) => void }) => {
  const { t } = useTranslation();
  const { patient: patientInfo, error, isLoading } = usePatient(patient?.uuid);
  const onClickHandler = useCallback(() => removePatient(patient?.uuid), [patient, removePatient]);

  const patientDisplay = useMemo(() => {
    if (isLoading || error || !patientInfo) return '';

    const { identifier, name } = patientInfo;
    const displayIdentifier = identifier?.[0]?.value || '';
    const nameObj = name?.[0];
    const fullName = nameObj?.text || [nameObj?.family, ...(nameObj?.given ?? [])].filter(Boolean).join(' ');

    return `${displayIdentifier ? `${displayIdentifier} -` : ''}${fullName ? ` ${fullName}` : ''}`.trim();
  }, [isLoading, error, patientInfo]);

  return (
    <li className="patientRow">
      <span>
        <Button
          kind="tertiary"
          size="sm"
          hasIconOnly
          onClick={onClickHandler}
          renderIcon={TrashCan}
          tooltipAlignment="start"
          tooltipPosition="top"
          iconDescription={t('remove', 'Remove')}
        />
      </span>
      <span className="patientName">{patientDisplay}</span>
    </li>
  );
};

const NewGroupForm = (props: NewGroupFormProps) => {
  const { name, setName, patientList, updatePatientList, errors, validate, removePatient } = props;
  const { t } = useTranslation();

  const extensionSlotState = useMemo(
    () => ({
      selectPatientAction: updatePatientList,
      buttonProps: {
        kind: 'secondary',
      },
    }),
    [updatePatientList],
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: '1rem',
      }}
    >
      <TextInput
        id="newGroupName"
        labelText={t('newGroupName', 'New Group Name')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => validate('name')}
      />
      {errors?.name && (
        <p className="formError">
          {errors.name === 'required' ? t('groupNameError', 'Please enter a group name.') : errors.name}
        </p>
      )}
      <FormLabel>
        {patientList.length} {t('patientsInGroup', 'Patients in group')}
      </FormLabel>
      {errors?.patientList && <p className="formError">{t('noPatientError', 'Please enter at least one patient.')}</p>}
      {!errors?.patientList && (
        <ul className="patientList">
          {patientList?.map((patient) => (
            <PatientRow patient={patient} removePatient={removePatient} key={patient.uuid} />
          ))}
        </ul>
      )}

      <FormLabel>{t('searchForPatientsToAddToGroup', 'Search for patients to add to group')}</FormLabel>
      <div className="searchBar">
        <ExtensionSlot name="patient-search-bar-slot" state={extensionSlotState} />
      </div>
    </div>
  );
};

const AddGroupModal = ({
  patients = undefined,
  isCreate = undefined,
  groupName = '',
  cohortUuid = undefined,
  isOpen,
  onPostCancel,
  onPostSubmit,
}: AddGroupModalProps) => {
  const { setGroup } = useContext(GroupFormWorkflowContext);
  const { t } = useTranslation();
  const [errors, setErrors] = useState<FormErrors>({});
  const [name, setName] = useState(groupName);
  const [patientList, setPatientList] = useState<Array<PatientSummary>>(patients || []);
  const { post, result, error } = usePostCohort() as {
    post: (payload: CohortPostPayload) => Promise<unknown>;
    result: Record<string, unknown> | null;
    error: CohortPostError | null;
  };
  const config = useConfig<{
    enforcePatientListLocationMatch?: boolean;
    patientLocationMismatchCheck?: boolean;
    groupSessionConcepts?: {
      cohortTypeId?: string;
    };
  }>();
  const [patientLocationMismatchModalOpen, setPatientLocationMismatchModalOpen] = useState(false);
  const [selectedPatientUuid, setSelectedPatientUuid] = useState<string | null>(null);
  const { hsuIdentifier } = useHsuIdIdentifier(selectedPatientUuid ?? '');
  const { sessionLocation } = useSession() as { sessionLocation: SessionLocation };

  const removePatient = useCallback(
    (patientUuid: string) =>
      setPatientList((patientList) => patientList.filter((patient) => patient.uuid !== patientUuid)),
    [setPatientList],
  );

  const validate = useCallback(
    (field?: 'name' | 'patientList') => {
      let valid = true;
      if (field) {
        valid = field === 'name' ? !!name : !!patientList.length;
        setErrors((errors) => ({
          ...errors,
          [field]: valid ? null : 'required',
        }));
      } else {
        if (!name) {
          setErrors((errors) => ({ ...errors, name: 'required' }));
          valid = false;
        } else {
          setErrors((errors) => ({ ...errors, name: null }));
        }
        if (!patientList.length) {
          setErrors((errors) => ({ ...errors, patientList: 'required' }));
          valid = false;
        } else {
          setErrors((errors) => ({ ...errors, patientList: null }));
        }
      }
      return valid;
    },
    [name, patientList.length],
  );

  const addSelectedPatientToList = useCallback(() => {
    function getPatientName(patient: PatientSummary) {
      return [patient?.name?.[0]?.given, patient?.name?.[0]?.family].join(' ');
    }
    if (!selectedPatientUuid) {
      return;
    }

    if (!patientList.find((p) => p.uuid === selectedPatientUuid)) {
      void fetchCurrentPatient(selectedPatientUuid).then((result: unknown) => {
        const newPatient = { uuid: selectedPatientUuid, ...(result as Record<string, unknown>) } as PatientSummary;
        setPatientList(
          [...patientList, newPatient].sort((a, b) =>
            getPatientName(a).localeCompare(getPatientName(b), undefined, {
              sensitivity: 'base',
            }),
          ),
        );
      });
    }
    setErrors((errors) => ({ ...errors, patientList: null }));
    setSelectedPatientUuid(null);
  }, [selectedPatientUuid, patientList, setPatientList]);

  const updatePatientList = (patientUuid: string) => {
    setSelectedPatientUuid(patientUuid);
  };

  useEffect(() => {
    if (!selectedPatientUuid || !hsuIdentifier) return;

    const locationMismatch = sessionLocation.uuid != hsuIdentifier.location.uuid;

    if (locationMismatch && config.enforcePatientListLocationMatch) {
      showSnackbar({
        kind: 'error',
        title: t('locationMismatch', 'Location Mismatch'),
        subtitle: t(
          'patientLocationMismatchEnforced',
          'Cannot add patient from {{hsuLocation}} to a session at {{sessionLocation}}',
          {
            hsuLocation: hsuIdentifier.location?.display,
            sessionLocation: sessionLocation?.display,
          },
        ),
      });
      setSelectedPatientUuid(null);
    } else if (config.patientLocationMismatchCheck && locationMismatch) {
      setPatientLocationMismatchModalOpen(true);
    } else {
      addSelectedPatientToList();
    }
  }, [
    selectedPatientUuid,
    sessionLocation,
    hsuIdentifier,
    addSelectedPatientToList,
    config.patientLocationMismatchCheck,
    config.enforcePatientListLocationMatch,
    t,
  ]);

  const handleSubmit = () => {
    if (validate()) {
      void post({
        uuid: cohortUuid,
        name: name,
        cohortType: config.groupSessionConcepts?.cohortTypeId,
        location: sessionLocation?.uuid,
        cohortMembers: patientList.map((p) => ({ patient: p.uuid, startDate: new Date().toISOString() })),
      });
      if (onPostSubmit) {
        onPostSubmit();
      }
    }
  };

  const handleCancel = () => {
    setPatientList(patients || []);
    if (onPostCancel) {
      onPostCancel();
    }
  };

  useEffect(() => {
    if (result) {
      const resultGroup = result as { uuid?: string; name?: string };
      setGroup({
        id: resultGroup.uuid ?? '',
        name: resultGroup.name ?? name,
        members: [],
        ...result,
        // the result doesn't come with cohortMembers.
        // need to add it in based on our local state
        cohortMembers: patientList.map((p) => ({ patient: { uuid: p.uuid } })),
      });
    }
  }, [result, setGroup, patientList, name]);

  useEffect(() => {
    if (error) {
      showSnackbar({
        kind: 'error',
        title: t('postError', 'POST Error'),
        subtitle: error.message ?? t('unknownPostError', 'An unknown error occurred while saving data'),
      });
      if (error.fieldErrors) {
        setErrors(
          Object.fromEntries(Object.entries(error.fieldErrors).map(([key, value]) => [key, value?.[0]?.message])),
        );
      }
    }
  }, [error, t]);

  const onPatientLocationMismatchModalCancel = () => {
    setSelectedPatientUuid(null);
  };

  return (
    <>
      <div className="modal">
        <ComposedModal open={isOpen} onClose={handleCancel}>
          <ModalHeader>{isCreate ? t('createNewGroup', 'Create New Group') : t('editGroup', 'Edit Group')}</ModalHeader>
          <ModalBody>
            <NewGroupForm
              {...{
                name,
                setName,
                patientList,
                updatePatientList,
                errors,
                validate,
                removePatient,
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button kind="secondary" onClick={handleCancel}>
              {t('cancel', 'Cancel')}
            </Button>
            <Button kind="primary" onClick={handleSubmit}>
              {isCreate ? t('createGroup', 'Create Group') : t('save', 'Save')}
            </Button>
          </ModalFooter>
        </ComposedModal>
      </div>
      <PatientLocationMismatchModal
        open={patientLocationMismatchModalOpen}
        setOpen={setPatientLocationMismatchModalOpen}
        onConfirm={addSelectedPatientToList}
        onCancel={onPatientLocationMismatchModalCancel}
        sessionLocation={sessionLocation}
        hsuLocation={hsuIdentifier?.location}
      />
    </>
  );
};

export default AddGroupModal;
