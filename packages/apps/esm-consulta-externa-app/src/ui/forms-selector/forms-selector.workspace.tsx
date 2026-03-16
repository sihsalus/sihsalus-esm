import { Button, ButtonSet, Form } from '@carbon/react';
import { ArrowLeftIcon, useLayoutType, launchWorkspace } from '@openmrs/esm-framework';
import { type DefaultPatientWorkspaceProps } from '@openmrs/esm-patient-common-lib';
import React, { type ComponentProps, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormsList from './forms-list.component';
import type { Form as FormSchema, CompletedFormInfo } from './types';
import styles from './forms-selector.scss';

// Generic type for form launch function
export type FormLaunchHandler = (form: FormSchema, encounterUuid: string) => void;

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
  patientUuid,
  closeWorkspace,
  closeWorkspaceWithSavedChanges,
}: FormsSelectorWorkspace) {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const [completedForms, setCompletedForms] = useState<Set<string>>(new Set());

  const backToPreviousWorkspace = useCallback(() => {
    closeWorkspace({
      onWorkspaceClose: () => launchWorkspace(backWorkspace),
      closeWorkspaceGroup: false,
    });
  }, [closeWorkspace, backWorkspace]);

  const handleFormOpen = useCallback(
    (form: FormSchema, encounterUuid: string) => {
      setCompletedForms((prev) => new Set(prev).add(form.uuid));

      onFormLaunch(form, encounterUuid);
    },
    [onFormLaunch],
  );

  const handleFinishControl = useCallback(() => {
    if (onComplete) {
      onComplete();
    }

    closeWorkspaceWithSavedChanges({
      onWorkspaceClose: () => {},
    });
  }, [closeWorkspaceWithSavedChanges, onComplete]);

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
              {t('controlNumber', 'Control #')}: {controlNumber}
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
          {t('cancel', 'Cancelar')}
        </Button>
        <Button kind="primary" onClick={handleFinishControl} disabled={!isAnyFormCompleted} className={styles.button}>
          {t('finishAndSign', 'Guardar y Firmar')}
        </Button>
      </ButtonSet>
    </Form>
  );
}
