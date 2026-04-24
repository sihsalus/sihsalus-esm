import { attach, ExtensionSlot } from '@openmrs/esm-framework/src/internal';
import React, { useEffect, useMemo } from 'react';
import { BehaviorSubject } from 'rxjs';
import { useFormProviderContext } from '../../provider/form-provider';
import { type FormFieldInputProps } from '../../types';

const ExtensionParcel: React.FC<FormFieldInputProps> = ({ field }) => {
  const submissionNotifier = useMemo(() => new BehaviorSubject<{ isSubmitting: boolean }>({ isSubmitting: false }), []);
  const { isSubmitting, patient } = useFormProviderContext();

  const state = useMemo(() => ({ patientUuid: patient.id, submissionNotifier }), [patient.id, submissionNotifier]);

  useEffect(() => {
    if (field.questionOptions.extensionSlotName && field.questionOptions.extensionId) {
      attach(field.questionOptions.extensionSlotName, field.questionOptions.extensionId);
    }
  }, [field.questionOptions.extensionId, field.questionOptions.extensionSlotName]);

  useEffect(() => {
    submissionNotifier.next({ isSubmitting: isSubmitting });
  }, [isSubmitting, submissionNotifier]);

  return (
    <>
      {field.questionOptions.extensionSlotName && (
        <ExtensionSlot name={field.questionOptions.extensionSlotName} state={state} />
      )}
    </>
  );
};

export default ExtensionParcel;
