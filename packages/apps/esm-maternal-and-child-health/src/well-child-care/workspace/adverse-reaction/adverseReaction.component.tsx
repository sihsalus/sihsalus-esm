import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonSet,
  Form,
  TextArea,
  Select,
  SelectItem,
  InlineNotification,
} from '@carbon/react';
import { OpenmrsDatePicker, showSnackbar, useLayoutType } from '@openmrs/esm-framework';
import type { DefaultPatientWorkspaceProps } from '../../../types';
import styles from './adverse-reaction-form.scss';

interface AdverseReaction {
  vaccineName: string;
  reactionDescription: string;
  severity: 'mild' | 'moderate' | 'severe' | '';
  occurrenceDate: Date | null;
}

const VACCINE_OPTIONS = [
  'HiB RN',
  'BCG',
  'Pentavalente (DPT, HB, Hib)',
  'Polio',
  'Rotavirus',
  'Neumococo',
  'Influenza pediátrica',
  'SPR',
  'Varicela',
];

const AdverseReactionFormWorkspace: React.FC<DefaultPatientWorkspaceProps> = ({ closeWorkspace }) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const [formData, setFormData] = useState<AdverseReaction>({
    vaccineName: '',
    reactionDescription: '',
    severity: '',
    occurrenceDate: null,
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = useCallback((field: keyof AdverseReaction, value: string | boolean | Date | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!formData.vaccineName) {
      setError(t('vaccineRequired', 'Debe seleccionar una vacuna'));
      return false;
    }
    if (!formData.reactionDescription.trim()) {
      setError(t('descriptionRequired', 'Debe ingresar una descripción de la reacción'));
      return false;
    }
    if (!formData.severity) {
      setError(t('severityRequired', 'Debe seleccionar la severidad'));
      return false;
    }
    if (!formData.occurrenceDate) {
      setError(t('dateRequired', 'Debe seleccionar la fecha de ocurrencia'));
      return false;
    }
    return true;
  }, [formData, t]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (validateForm()) {
        // TODO: Save to backend via REST API
        showSnackbar({
          kind: 'success',
          title: t('reactionSaved', 'Reacción registrada'),
          subtitle: t('reactionSavedSubtitle', 'La reacción adversa ha sido registrada exitosamente'),
          isLowContrast: true,
        });
        closeWorkspace({ discardUnsavedChanges: true });
      }
    },
    [closeWorkspace, validateForm, t],
  );

  return (
    <Form className={styles.adverseReactionForm} onSubmit={handleSubmit}>
      <div style={{ padding: '1rem' }}>
        {error && (
          <InlineNotification
            kind="error"
            title={t('validationError', 'Error de validación')}
            subtitle={error}
            lowContrast
            className={styles.errorNotification}
          />
        )}

        <Select
          id="vaccine-select"
          labelText={t('vaccine', 'Vacuna')}
          value={formData.vaccineName}
          onChange={(e) => handleInputChange('vaccineName', e.target.value)}
          className={styles.formField}>
          <SelectItem text={t('selectVaccine', 'Seleccione una vacuna')} value="" />
          {VACCINE_OPTIONS.map((vaccine) => (
            <SelectItem key={vaccine} text={vaccine} value={vaccine} />
          ))}
        </Select>

        <TextArea
          id="reaction-description"
          labelText={t('reactionDescription', 'Descripción de la reacción')}
          value={formData.reactionDescription}
          onChange={(e) => handleInputChange('reactionDescription', e.target.value)}
          rows={4}
          placeholder={t('reactionPlaceholder', 'Describa los síntomas observados...')}
          className={styles.formField}
        />

        <Select
          id="severity-select"
          labelText={t('severity', 'Severidad')}
          value={formData.severity}
          onChange={(e) => handleInputChange('severity', e.target.value)}
          className={styles.formField}>
          <SelectItem text={t('selectSeverity', 'Seleccione severidad')} value="" />
          <SelectItem text={t('mild', 'Leve')} value="mild" />
          <SelectItem text={t('moderate', 'Moderada')} value="moderate" />
          <SelectItem text={t('severe', 'Severa')} value="severe" />
        </Select>

        <div className={styles.formField}>
          <OpenmrsDatePicker
            id="occurrence-date"
            labelText={t('occurrenceDate', 'Fecha de ocurrencia del evento')}
            maxDate={new Date()}
            value={formData.occurrenceDate}
            onChange={(date) => handleInputChange('occurrenceDate', date)}
          />
        </div>
      </div>

      <ButtonSet className={isTablet ? styles.tablet : styles.desktop}>
        <Button kind="secondary" onClick={closeWorkspace}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="primary" type="submit">
          {t('registerReaction', 'Registrar Reacción')}
        </Button>
      </ButtonSet>
    </Form>
  );
};

export default AdverseReactionFormWorkspace;
