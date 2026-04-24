import { Button, ButtonSet, Form, Select, SelectItem, Stack } from '@carbon/react';
import { getCoreTranslation, showSnackbar, useLayoutType } from '@openmrs/esm-framework';
import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { take } from 'rxjs/operators';

import ReportParameterInput from '../report-parameter-input.component';
import { runReportObservable, useReportDefinition, useReportDesigns, useReportRequest } from '../reports.resource';
import SimpleCronEditor from '../simple-cron-editor/simple-cron-editor.component';

import styles from './edit-scheduled-report-form.scss';

type ReportParameterValue = string | number | boolean | null;

interface EditScheduledReportFormProps {
  reportDefinitionUuid: string;
  reportRequestUuid: string;
  closePanel: () => void;
}

const EditScheduledReportForm: React.FC<EditScheduledReportFormProps> = ({
  reportDefinitionUuid,
  reportRequestUuid,
  closePanel,
}) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';

  const reportDefinition = useReportDefinition(reportDefinitionUuid);
  const { reportDesigns } = useReportDesigns(reportDefinitionUuid);
  const { reportRequest } = useReportRequest(reportRequestUuid);

  const [reportParameters, setReportParameters] = useState<Record<string, ReportParameterValue>>(
    (reportRequest?.parameterMappings as Record<string, ReportParameterValue>) || {},
  );
  const [renderModeUuid, setRenderModeUuid] = useState<string>();
  const [initialCron, setInitialCron] = useState<string | undefined>(undefined);
  const [schedule, setSchedule] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittable, setIsSubmittable] = useState(false);
  const [, setIgnoreChanges] = useState(true);

  useEffect(() => {
    setInitialCron(reportRequest?.schedule);
    setRenderModeUuid(reportRequest?.renderingMode?.argument);

    if (reportRequest?.parameterMappings) {
      setReportParameters(reportRequest.parameterMappings as Record<string, ReportParameterValue>);
    }
  }, [reportRequest]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      setIsSubmitting(true);

      const scheduleRequest = {
        uuid: reportRequestUuid ? reportRequestUuid : null,
        reportDefinition: {
          parameterizable: {
            uuid: reportDefinitionUuid,
          },
          parameterMappings: reportParameters,
        },
        renderingMode: {
          argument: renderModeUuid,
        },
        schedule,
      };

      runReportObservable(scheduleRequest)
        .pipe(take(1))
        .subscribe(
          () => {
            showSnackbar({
              kind: 'success',
              title: t('reportScheduled', 'Report scheduled'),
              subtitle: t('reportScheduledSuccessfullyMsg', 'Report scheduled successfully'),
            });
            closePanel();
            setIsSubmitting(false);
          },
          () => {
            showSnackbar({
              kind: 'error',
              title: t('reportScheduledErrorMsg', 'Failed to schedule a report'),
              subtitle: t('reportScheduledErrorMsg', 'Failed to schedule a report'),
            });
            closePanel();
            setIsSubmitting(false);
          },
        );
    },
    [reportRequestUuid, reportDefinitionUuid, reportParameters, renderModeUuid, schedule, t, closePanel],
  );

  const handleOnChange = () => {
    setIgnoreChanges((prevState) => !prevState);
  };

  const handleCronEditorChange = (cron: string, isValid: boolean) => {
    setSchedule(isValid ? cron : '');
  };

  useEffect(() => {
    setIsSubmittable(!!schedule && !!renderModeUuid);
  }, [schedule, renderModeUuid]);

  return (
    <Form className={styles.desktopEditSchedule} onChange={handleOnChange} onSubmit={handleSubmit}>
      <Stack gap={8} className={styles.container}>
        <SimpleCronEditor initialCron={initialCron} onChange={handleCronEditorChange} />
        {reportDefinition?.parameters.map((parameter) => (
          <ReportParameterInput
            key={`${reportDefinition.name}-${parameter.name}-param-input`}
            parameter={parameter}
            onChange={(parameterValue) => {
              setReportParameters((state) => ({
                ...state,
                [parameter.name]: parameterValue as ReportParameterValue,
              }));
            }}
            value={reportRequest?.parameterMappings[parameter.name]}
          />
        ))}
        <div className={styles.outputFormatDiv}>
          <Select
            id="outputFormat"
            className={styles.basicInputElement}
            labelText={t('outputFormat', 'Output format')}
            onChange={(e) => setRenderModeUuid(e.target.value)}
            value={renderModeUuid}
          >
            <SelectItem text="" value={''} />
            {reportDesigns?.map((reportDesign) => (
              <SelectItem key={reportDesign.uuid} text={reportDesign.name} value={reportDesign.uuid}>
                {reportDesign.name}
              </SelectItem>
            ))}
          </Select>
        </div>
      </Stack>
      <div className={styles.buttonsDiv}>
        <ButtonSet className={classNames({ [styles.tablet]: isTablet, [styles.desktop]: !isTablet })}>
          <Button className={styles.button} kind="secondary" onClick={closePanel}>
            {getCoreTranslation('cancel')}
          </Button>
          <Button className={styles.button} disabled={isSubmitting || !isSubmittable} kind="primary" type="submit">
            {getCoreTranslation('save')}
          </Button>
        </ButtonSet>
      </div>
    </Form>
  );
};

export default EditScheduledReportForm;
