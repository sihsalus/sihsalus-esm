import { TimePicker } from '@carbon/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { parseTime, TIME_PATTERN, TIME_PATTERN_REG_EXP, to24HTime, type Time } from '../../utils/time-utils';


interface CronTimePickerProps {
  value: Time;
  onChange: (time: Time) => void;
}

interface ValidationState {
  invalid: boolean;
  invalidText: string;
}

const CronTimePicker: React.FC<CronTimePickerProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  const [valueInternal, setValueInternal] = useState(to24HTime(value));
  const [validationState, setValidationState] = useState<ValidationState>({
    invalid: false,
    invalidText: null,
  });

  const validate = useCallback(() => {
    if (TIME_PATTERN_REG_EXP.test(valueInternal)) {
      setValidationState({ invalid: false, invalidText: null });
      onChange(parseTime(valueInternal));
    } else {
      setValidationState({ invalid: true, invalidText: t('notATimeText', 'hh:mm 24-hr pattern required') });
      onChange(null);
    }
  }, [t, valueInternal, onChange]);

  useEffect(() => {
    const newInternalValue = to24HTime(value);
    setValueInternal(newInternalValue);
  }, [value]);

  return (
    <TimePicker
      id="cronTimePicker"
      hideLabel
      invalid={validationState.invalid}
      invalidText={t(validationState.invalidText)}
      onBlur={validate}
      onChange={(event) => setValueInternal(event.target.value)}
      pattern={TIME_PATTERN}
      value={valueInternal}
    />
  );
};

export default CronTimePicker;
