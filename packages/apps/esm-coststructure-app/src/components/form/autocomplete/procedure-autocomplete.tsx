import React, { useState } from 'react';
import { TextInput } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import useGetProcedures from '../../../hooks/use-get-procedures';
import type { Procedure } from '../../../hooks/use-get-procedures';
import styles from './styles.scss';
interface Props {
  value: Procedure;
  onChange: (value: Procedure) => void;
  error?: string;
}

export const ProcedureAutocomplete: React.FC<Props> = ({ value, onChange, error }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { procedures, isLoading } = useGetProcedures(value.nameFull);
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <TextInput
        id="procedureName"
        labelText={t('procedureName', 'Procedure name')}
        value={value.nameFull}
        onChange={(e) => {
          onChange({ ...value, nameFull: e.target.value });
          setShowSuggestions(true);
        }}
        placeholder={t('enterProcedureName', 'Enter the procedure name')}
        invalid={!!error}
        invalidText={error}
        autoComplete="off"
      />

      {showSuggestions && value.nameFull.length >= 2 && (
        <div className={styles['procedure-list']}>
          {isLoading && <div className="p-2 text-sm text-muted-foreground">{t('loading', 'Loading')}...</div>}

          {!isLoading &&
            procedures.map((p) => (
              <div
                key={p.conceptId}
                onClick={() => {
                  onChange(p);
                  setShowSuggestions(false);
                }}
                className={styles.procedure}
              >
                <p>{p.nameFull}</p>
                {p.code && (
                  <p>
                    {t('code', 'Code')}: {p.code}
                  </p>
                )}
              </div>
            ))}
        </div>
      )}

      <TextInput
        id="procedureCode"
        labelText={t('cpmsCode', 'CPMS Code')}
        value={value.code || ''}
        readOnly
        placeholder={t('cpmsCodeExample', 'E.g.: 00906')}
      />
    </div>
  );
};
