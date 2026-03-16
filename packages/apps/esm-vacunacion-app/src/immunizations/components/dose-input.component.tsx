import React, { useCallback, useMemo } from 'react';
import { Dropdown, NumberInput } from '@carbon/react';
import { useController, type Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { type ImmunizationSequenceDefinition } from '../../types/fhir-immunization-domain';
import styles from './../immunizations-form.scss';

export const DoseInput: React.FC<{
  vaccine: string;
  sequences: ImmunizationSequenceDefinition[];
  control: Control;
  existingDoseNumbers?: number[];
}> = ({ vaccine, sequences, control, existingDoseNumbers = [] }) => {
  const { t } = useTranslation();
  const { field } = useController({ name: 'doseNumber', control });

  const vaccineSequences = useMemo(
    () => sequences?.find((sequence) => sequence.vaccineConceptUuid === vaccine)?.sequences || [],
    [sequences, vaccine],
  );

  const availableSequences = useMemo(
    () => vaccineSequences.filter((s) => !existingDoseNumbers.includes(s.sequenceNumber)),
    [vaccineSequences, existingDoseNumbers],
  );

  const handleChange = useCallback(
    (event, { value }) => {
      const parsedValue =
        value === '' || value === null || (typeof value === 'string' && !value.trim()) ? undefined : Number(value);
      field.onChange(isNaN(parsedValue) ? undefined : parsedValue);
    },
    [field],
  );

  return (
    <div className={styles.row}>
      {vaccineSequences.length ? (
        availableSequences.length === 0 ? (
          <p>{t('allDosesAdministered', 'All doses for this vaccine have already been recorded')}</p>
        ) : (
          <Dropdown
            id="sequence"
            items={availableSequences.map((sequence) => sequence.sequenceNumber)}
            itemToString={(item) => availableSequences.find((s) => s.sequenceNumber === item)?.sequenceLabel}
            label={t('pleaseSelect', 'Please select')}
            onChange={(val) => field.onChange(parseInt(val.selectedItem || 0))}
            selectedItem={field.value}
            titleText={t('sequence', 'Sequence')}
          />
        )
      ) : (
        <NumberInput
          allowEmpty
          disableWheel
          hideSteppers
          id="doseNumber"
          label={t('doseNumberWithinSeries', 'Dose number within series')}
          min={1}
          onChange={handleChange}
          required
          value={field.value}
        />
      )}
    </div>
  );
};
