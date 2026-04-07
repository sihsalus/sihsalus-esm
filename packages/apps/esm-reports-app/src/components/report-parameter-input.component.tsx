import { DatePicker, DatePickerInput, Select, SelectItem, TextInput, Search } from '@carbon/react';
import { useDebounce } from '@openmrs/esm-framework';
import { isEqual } from 'lodash-es';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ReportParameter } from '../types/report-definition';

import ConceptSearchResults from './concept-search/concept-search-results';
import { useLocations } from './reports.resource';
import styles from './run-report/run-report-form.scss';

interface ReportParameterInputProps {
  parameter: ReportParameter;
  value: unknown;
  onChange: (value: unknown) => void;
}

function getInitialValue(parameter: ReportParameter, value: unknown) {
  if (parameter.type === 'java.util.Date') {
    return new Date(value);
  } else if (parameter.type === 'org.openmrs.Location') {
    return value?.uuid;
  } else {
    return value;
  }
}

const ReportParameterInput: React.FC<ReportParameterInputProps> = ({ parameter, value, onChange }) => {
  const { t } = useTranslation();
  const { locations } = useLocations();
  const [valueInternal, setValueInternal] = useState<string | number>(getInitialValue(parameter, value));
  const searchInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConcept, setSelectedConcept] = useState<{ uuid: string; display?: string } | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const focusAndClearSearchInput = useCallback(() => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  }, [setSearchTerm]);

  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const target = event.target as HTMLInputElement | HTMLSelectElement;
      const eventValue = (target as HTMLInputElement).type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;

      setValueInternal(eventValue);

      if (parameter.type === 'java.util.Date') {
        onChange(new Date(eventValue).toLocaleDateString());
      } else {
        onChange(eventValue);
      }
    },
    [onChange, parameter.type],
  );

  const handleConceptSelect = useCallback(
    (concept: { uuid: string; display?: string }) => {
      setSelectedConcept(concept);
      setSearchTerm(concept.display || '');
      if (handleOnChange) {
        const syntheticEvent = {
          target: {
            name: parameter.name,
            value: concept.uuid,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        handleOnChange(syntheticEvent);
      }
    },
    [handleOnChange, parameter.name],
  );

  const isValueEqual = useCallback(
    (valueA, valueB) => {
      if (parameter.type === 'java.util.Date') {
        return isEqual(new Date(valueA), new Date(valueB));
      } else {
        return isEqual(valueA, valueB);
      }
    },
    [parameter.type],
  );

  const handleSearchTermChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value ?? '');
      // Clear selected concept when user starts typing again
      if (selectedConcept) {
        setSelectedConcept(null);
      }
    },
    [setSearchTerm, selectedConcept],
  );

  useEffect(() => {
    const newInternalValue = getInitialValue(parameter, value);
    setValueInternal((prevValue) => {
      if (!isValueEqual(newInternalValue, prevValue)) {
        return newInternalValue;
      }
      return prevValue;
    });
  }, [value, isValueEqual, parameter]);

  const renderParameterElementBasedOnType = () => {
    switch (parameter.type) {
      case 'java.util.Date':
        return (
          <DatePicker
            datePickerType="single"
            onChange={([dateValue]) => handleOnDateChange(dateValue)}
            className={styles.datePicker}
            value={valueInternal}
          >
            <DatePickerInput id={parameter.name} labelText={parameter.label} type="date" />
          </DatePicker>
        );
      case 'java.lang.String':
      case 'java.lang.Integer':
        return (
          <TextInput
            id={parameter.name}
            name={parameter.name}
            labelText={parameter.label}
            className={styles.basicInputElement}
            onChange={(e) => handleOnChange(e)}
            value={valueInternal}
          />
        );
      case 'org.openmrs.Location':
        return (
          <Select
            id={parameter.name}
            name={parameter.name}
            labelText={parameter.label}
            className={styles.basicInputElement}
            onChange={(e) => handleOnChange(e)}
            value={valueInternal}
          >
            <SelectItem text="" value={''} />
            {locations?.map((location) => (
              <SelectItem key={location.uuid} text={location.display} value={location.uuid}>
                {location.display}
              </SelectItem>
            ))}
          </Select>
        );
      case 'org.openmrs.Concept':
        return (
          <div>
            <Search
              size="lg"
              placeholder={t('searchFieldPlaceholder', 'Search for a concept')}
              labelText={t('searchFieldPlaceholder', 'Search for a concept')}
              onChange={handleSearchTermChange}
              ref={searchInputRef}
              value={searchTerm}
            />
            {!selectedConcept && (
              <ConceptSearchResults
                searchTerm={debouncedSearchTerm}
                focusAndClearSearchInput={focusAndClearSearchInput}
                onConceptSelect={handleConceptSelect}
              />
            )}
          </div>
        );
      default:
        return (
          <span className={styles.unknownParameterTypeSpan}>
            {`Unknown parameter type: ${parameter.type} for parameter: ${parameter.label}`}
          </span>
        );
    }
  };

  function handleOnDateChange(dateValue) {
    const newDate = new Date(dateValue);
    setValueInternal(newDate.toISOString());
    onChange(newDate.toISOString());
  }

  return <div className={styles.runReportInnerDivElement}>{renderParameterElementBasedOnType()}</div>;
};

export default ReportParameterInput;
