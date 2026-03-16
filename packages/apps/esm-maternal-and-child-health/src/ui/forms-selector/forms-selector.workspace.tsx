import { Button, ButtonSet, Form } from '@carbon/react';
import { ArrowLeftIcon, useLayoutType, launchWorkspace2 } from '@openmrs/esm-framework';
import { type DefaultPatientWorkspaceProps, type CompletedFormInfo } from '../../types';
import React, { type ComponentProps, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormsList from './forms-list.component';
import styles from './forms-selector.scss';

// Generic type for form launch function
export type FormLaunchHandler = (form: { uuid: string; name?: string; display?: string }, encounterUuid: string) => void;

export interface FormsSelectorWorkspaceAdditionalProps {
  availableForms: Array<CompletedFormInfo>;
  patientAge: string;
  controlNumber: number;
  title?: string;
  subtitle?: string;
  backWorkspace?: string;
  onComplete?: () => void;
  onFormLaunch: FormLaunchHandler; // Generic form launcher function
}

export interface FormsSelectorWorkspace extends DefaultPatientWorkspaceProps, FormsSelectorWorkspaceAdditionalProps {}

export default function FormsSelectorWorkspace({
  availableForms,
  patientAge,
  controlNumber,
  title,
  subtitle,
  backWorkspace = 'wellchild-control-form',
  onComplete,
  onFormLaunch,
  closeWorkspace,
}: FormsSelectorWorkspace) {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const [completedForms, setCompletedForms] = useState<Set<string>>(new Set());

  const backToPreviousWorkspace = useCallback(() => {
    launchWorkspace2(backWorkspace);
  }, [backWorkspace]);

  const handleFormOpen = useCallback(
    (form: { uuid: string; name?: string; display?: string }, encounterUuid: string) => {
      setCompletedForms((prev) => new Set(prev).add(form.uuid));

      onFormLaunch(form, encounterUuid);
    },
    [onFormLaunch],
  );

  const handleFinishControl = useCallback(() => {
    if (onComplete) {
      onComplete();
    }

    closeWorkspace({ discardUnsavedChanges: true });
  }, [closeWorkspace, onComplete]);

  const isAnyFormCompleted = completedForms.size > 0;

  return (
    <Form className={styles.form}>
      <div className={styles.grid}>
        {/* Back button */}
        {!isTablet && (
          <div>
            <Button
              iconDescription={t('backToPrevious', 'Volver')}
              kind="ghost"
              onClick={backToPreviousWorkspace}
              renderIcon={(props: ComponentProps<typeof ArrowLeftIcon>) => <ArrowLeftIcon size={24} {...props} />}
              size="sm">
              <span>{t('backToPrevious', 'Volver')}</span>
            </Button>
          </div>
        )}

        {/* Header info */}
        <div>
          <div className={styles.sectionTitle}>{title || t('formsSelection', 'Selección de Formularios')}</div>
          <div className={styles.controlInfoRow}>
            <span>
              {t('patientAge', 'Edad del paciente')}: {patientAge}
            </span>
            <span>
              {t('controlNumber', 'Control number')}: {controlNumber}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div>
          <p>
            {subtitle ||
              t(
                'formsInstructions',
                'Seleccione los formularios que desea completar. Puede completar múltiples formularios según las necesidades del paciente.',
              )}
          </p>
        </div>

        {/* Forms table */}
        <div>
          <FormsList
            completedForms={availableForms}
            handleFormOpen={handleFormOpen}
            sectionName={t('availableForms', 'Formularios Disponibles')}
          />
        </div>

        {/* Completed forms counter */}
        {isAnyFormCompleted && (
          <div>
            <p>
              {t('formsCompleted', 'Formularios completados')}: {completedForms.size}
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <ButtonSet className={isTablet ? styles.tablet : styles.desktop}>
        <Button kind="secondary" onClick={backToPreviousWorkspace} className={styles.button}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="primary" onClick={handleFinishControl} disabled={!isAnyFormCompleted} className={styles.button}>
          {t('finishAndSign', 'Guardar y Firmar')}
        </Button>
      </ButtonSet>
    </Form>
  );
}
