import { TextInput, Select, SelectItem } from '@carbon/react';
import { OpenmrsDatePicker } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ConceptSearchInput from './concept-search/concept-search-input.component';
import styles from './report-parameter.scss';

type DateReportParameter = 'java.util.Date';
type InputReportParameter = 'java.lang.String' | 'java.lang.Integer';
type SelectReportParameter = 'org.openmrs.Location';
type ReportParameterType = DateReportParameter | InputReportParameter | SelectReportParameter | string;

interface ReportParameterInterface {
  name: string;
  type: ReportParameterType;
  label: string;
}

interface ReportParameterPropsBase {
  parameter: ReportParameterInterface;
  reportUuid: string;
  reportParameters: Record<string, unknown>;
  locations: Array<{ uuid: string; display: string }>;
}

type ReportParameterProps = ReportParameterPropsBase &
  (
    | {
        handleOnChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
        handleOnDateChange: undefined;
      }
    | {
        handleOnChange: undefined;
        handleOnDateChange: (fieldName: string, dateValue: Date) => void;
      }
  );

const ReportParameter: React.FC<ReportParameterProps> = ({
  parameter,
  reportParameters,
  locations,
  handleOnChange,
  handleOnDateChange,
}) => {
  const { t } = useTranslation();

  const handleConceptSelect = (conceptUuid: string, _conceptDisplay: string) => {
    if (handleOnChange) {
      const syntheticEvent = {
        target: {
          name: parameter.name,
          value: conceptUuid,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      handleOnChange(syntheticEvent);
    }
  };

  switch (parameter.type) {
    case 'java.util.Date':
      return (
        <div>
          <OpenmrsDatePicker
            id={parameter.name}
            labelText={parameter.label}
            onChange={(date) => {
              if (handleOnDateChange) {
                handleOnDateChange(parameter.name, date);
              }
            }}
            value={reportParameters[parameter.name]}
          />
        </div>
      );
    case 'java.lang.String':
    case 'java.lang.Integer':
      return (
        <div>
          <TextInput
            id={parameter.name}
            name={parameter.name}
            labelText={parameter.label}
            onChange={handleOnChange}
            value={reportParameters[parameter.name] ?? ''}
          />
        </div>
      );
    case 'org.openmrs.Location':
      return (
        <div>
          <Select
            id={parameter.name}
            name={parameter.name}
            labelText={parameter.label}
            onChange={handleOnChange}
            value={reportParameters[parameter.name] ?? ''}
          >
            <SelectItem text="" value="" />
            {locations?.map((location) => (
              <SelectItem key={location.uuid} text={location.display} value={location.uuid}>
                {location.display}
              </SelectItem>
            ))}
          </Select>
        </div>
      );
    case 'org.openmrs.Concept':
      return (
        <ConceptSearchInput
          parameterName={parameter.name}
          labelText={parameter.label}
          placeholder={t('searchFieldPlaceholder', 'Search for a concept')}
          onConceptSelect={handleConceptSelect}
        />
      );
    default:
      return (
        <div>
          <span className={styles.unknownParameterTypeSpan}>
            {t('unknownParameterType', 'Unknown parameter type: {type} for parameter: {label}', {
              type: parameter.type,
              label: parameter.label,
            })}
          </span>
        </div>
      );
  }
};

export default ReportParameter;
