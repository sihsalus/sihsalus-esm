import { DataTableSkeleton } from '@carbon/react';
import { formatDatetime, ResponsiveWrapper, useLayoutType } from '@openmrs/esm-framework';
import fuzzy from 'fuzzy';
import { debounce } from 'lodash-es';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { CompletedFormInfo, Form } from '../types';

import styles from './forms-list.scss';
import FormsTable from './forms-table.component';

export type FormsListProps = {
  forms?: Array<CompletedFormInfo>;
  error?: unknown;
  sectionName?: string;
  handleFormOpen: (form: Form, encounterUuid?: string) => void;
};

/*
 * For the benefit of our automated translations:
 * t('forms', 'Forms')
 */

const FormsList: React.FC<FormsListProps> = ({ forms, error, sectionName, handleFormOpen }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const isTablet = useLayoutType() === 'tablet';
  const [, setLocale] = useState(globalThis.i18next?.language ?? navigator.language);

  useEffect(() => {
    if (globalThis.i18next?.on) {
      const languageChanged = (lng: string) => setLocale(lng);
      globalThis.i18next.on('languageChanged', languageChanged);
      return () => globalThis.i18next.off('languageChanged', languageChanged);
    }
  }, []);

  const handleSearch = useMemo(() => debounce((searchTerm) => setSearchTerm(searchTerm), 300), []);

  const filteredForms = useMemo(() => {
    if (!searchTerm) {
      return forms;
    }

    return fuzzy
      .filter(searchTerm, forms, { extract: (formInfo) => formInfo.form.display ?? formInfo.form.name })
      .sort((r1, r2) => r1.score - r2.score)
      .map((result) => result.original);
  }, [forms, searchTerm]);

  const tableHeaders = useMemo(() => {
    return [
      {
        header: t('formName', 'Form name (A-Z)'),
        key: 'formName',
      },
      {
        header: t('lastCompleted', 'Last completed'),
        key: 'lastCompleted',
      },
    ];
  }, [t]);

  const tableRows = useMemo(
    () =>
      filteredForms?.map((formData) => {
        return {
          id: formData.form.uuid,
          lastCompleted: formData.lastCompletedDate ? formatDatetime(formData.lastCompletedDate) : undefined,
          formName: formData.form.display ?? formData.form.name,
          formUuid: formData.form.uuid,
          encounterUuid: formData?.associatedEncounters[0]?.uuid,
          form: formData.form,
        };
      }) ?? [],
    [filteredForms],
  );

  if (!forms && !error) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (forms?.length === 0) {
    return <></>;
  }

  return (
    <ResponsiveWrapper>
      {sectionName && (
        <div className={isTablet ? styles.tabletHeading : styles.desktopHeading}>
          <h4>{t(sectionName)}</h4>
        </div>
      )}
      <FormsTable
        tableHeaders={tableHeaders}
        tableRows={tableRows}
        isTablet={isTablet}
        handleSearch={handleSearch}
        handleFormOpen={handleFormOpen}
      />
    </ResponsiveWrapper>
  );
};

export default FormsList;
