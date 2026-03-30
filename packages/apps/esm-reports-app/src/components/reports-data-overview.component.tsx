import { Select, SelectItem, Button } from '@carbon/react';
import { ExtensionSlot, showSnackbar, getCoreTranslation } from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Overlay from './overlay.component';
import ReportDataViewer from './report-data-viewer.component';
import ReportParameter from './report-parameter.component';
import { useReportDefinitions, useReportData, useLocations } from './reports.resource';
import styles from './reports.scss';

const ReportsDataOverviewComponent: React.FC = () => {
  const { t } = useTranslation();
  const { locations } = useLocations();
  const [selectedReport, setSelectedReport] = useState('');
  const [reportParameters, setReportParameters] = useState<Record<string, string>>({});

  const { reportDefinitions } = useReportDefinitions();
  const { reportData, error, isLoading, mutate } = useReportData(selectedReport, reportParameters);

  const selectedReportDefinition = useMemo(() => {
    return reportDefinitions?.find((report) => report.uuid === selectedReport);
  }, [selectedReport, reportDefinitions]);

  const handleDateChange = (parameterName: string, value: Date) => {
    const formattedDate = value ? dayjs(value).format('YYYY-MM-DDTHH:mm:ss.SSSZ') : '';
    setReportParameters((prev) => ({
      ...prev,
      [parameterName]: formattedDate,
    }));
  };
  function handleParameterValueChange(event) {
    const key = event.target.name;
    let value = null;
    if (event.target.type === 'checkbox') {
      value = event.target.checked;
    } else {
      value = event.target.value;
    }

    setReportParameters((state) => ({ ...state, [key]: value }));
  }

  const handleReportChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newReportUuid = event.target.value;
    if (newReportUuid !== selectedReport) {
      // Clear all parameters first
      setReportParameters({});
      // Then set the new report UUID
      setSelectedReport(newReportUuid);
    }
  };

  const handleFetchReport = () => {
    if (!selectedReport) {
      showSnackbar({
        kind: 'error',
        title: getCoreTranslation('error'),
        subtitle: t('selectReportFirst', 'Please select a report first'),
      });
      return;
    }

    // Check if the report has parameters in its definition
    const hasParameters = selectedReportDefinition?.parameters?.length > 0;

    if (hasParameters) {
      // Check if all parameters have values
      const missingParameters = selectedReportDefinition?.parameters
        ?.filter((param) => !reportParameters[param.name] && param.required)
        .map((param) => param.label);

      if (missingParameters?.length > 0) {
        showSnackbar({
          kind: 'error',
          title: getCoreTranslation('error'),
          subtitle: t('missingParameters', 'Please provide the following parameters: {parameters}', {
            parameters: missingParameters.join(', '),
          }),
        });
        return;
      }
    }

    // Only fetch when explicitly requested and parameters are valid
    mutate();
  };

  // Remove the automatic fetch effect
  useEffect(() => {
    if (error) {
      showSnackbar({
        kind: 'error',
        title: getCoreTranslation('error'),
        subtitle: error?.message || t('errorFetchingReport', 'Error fetching report'),
      });
    }
  }, [error, t]);

  useEffect(() => {
    if (reportData) {
      showSnackbar({
        kind: 'success',
        title: t('reportFetched', 'Report fetched successfully'),
      });
    }
  }, [reportData, t]);

  return (
    <div>
      <ExtensionSlot name="breadcrumbs-slot" className={styles.breadcrumb} />
      <div className={styles.mainPanelDiv}>
        <div className={styles.reportsLabelDiv}>
          <h3>{t('reports', 'Reports')}</h3>
        </div>
        <div className={styles.filterForm}>
          <div className={styles.formField}>
            <Select
              id="report-select"
              labelText={t('selectReport', 'Select Report')}
              value={selectedReport}
              onChange={handleReportChange}
            >
              <SelectItem text={t('selectReport', 'Select Report')} value="" />
              {reportDefinitions?.map((report) => (
                <SelectItem key={report.uuid} text={report.name} value={report.uuid} />
              ))}
            </Select>
          </div>
          {selectedReportDefinition?.parameters?.map((parameter) => {
            return parameter.type === 'java.util.Date' ? (
              <div key={parameter.name + selectedReportDefinition.uuid} className={styles.formField}>
                <ReportParameter
                  parameter={parameter}
                  reportUuid={selectedReport}
                  reportParameters={reportParameters}
                  locations={locations}
                  handleOnDateChange={handleDateChange}
                  handleOnChange={undefined}
                />
              </div>
            ) : (
              <div key={parameter.name + selectedReportDefinition.uuid} className={styles.formField}>
                <ReportParameter
                  parameter={parameter}
                  reportUuid={selectedReport}
                  reportParameters={reportParameters}
                  locations={locations}
                  handleOnChange={handleParameterValueChange}
                  handleOnDateChange={undefined}
                />
              </div>
            );
          })}
          <div className={styles.formField}>
            <Button onClick={handleFetchReport} disabled={isLoading}>
              {isLoading ? getCoreTranslation('loading') : t('fetchReport', 'Fetch Report')}
            </Button>
          </div>
        </div>
        {reportData && (
          <div className={styles.reportDataViewerContainer}>
            <ReportDataViewer reportData={reportData} />
          </div>
        )}
      </div>
      <Overlay />
    </div>
  );
};

export default ReportsDataOverviewComponent;
