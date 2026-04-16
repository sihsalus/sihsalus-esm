import React from 'react';
import styles from './value.scss';
import { useTranslation } from 'react-i18next';
import { type FormFieldValue } from '../../types';

type ScalarValue = Exclude<FormFieldValue, Array<unknown> | null> | undefined;
type ListValue = Extract<FormFieldValue, Array<unknown>>;

const stringifyValue = (value: ScalarValue): string => {
  if (value instanceof Date) {
    return value.toLocaleString();
  }
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return `${value}`;
  }
  return '';
};

export const ValueEmpty = (): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <div>
      <span className={styles.empty}>({t('blank', 'Blank')})</span>
    </div>
  );
};

export const ValueDisplay = ({ value }: { value: FormFieldValue | string | undefined }): React.JSX.Element => {
  if (Array.isArray(value)) {
    return <ListDisplay valueArray={value} />;
  }
  return <div className={styles.value}>{stringifyValue(value)}</div>;
};

const ListDisplay = ({ valueArray }: { valueArray: ListValue }): React.JSX.Element => {
  return (
    <ul>
      {valueArray.map((item, index) => (
        <li className={styles.item} key={`${stringifyValue(item)}-${index}`}>
          {stringifyValue(item)}
        </li>
      ))}
    </ul>
  );
};
