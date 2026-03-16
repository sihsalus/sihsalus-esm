import { Search } from '@carbon/react';
import { useDebounce } from '@openmrs/esm-framework';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './dyaku-patients-overview.scss';
import DyakuPatientsTable from './dyaku-patients-table.component';

interface DyakuPatientsOverviewProps {
  pageSize?: number;
}

const DyakuPatientsOverview: React.FC<DyakuPatientsOverviewProps> = ({ pageSize = 10 }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms debounce

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <Search
          className={styles.searchInput}
          id="dyaku-patient-search"
          labelText={t('searchByDni', 'Buscar por DNI')}
          placeholder={t('searchByDniPlaceholder', 'Ingrese el DNI del paciente (mínimo 8 dígitos)')}
          value={searchTerm}
          onChange={handleSearchChange}
          onClear={clearSearch}
          size="lg"
        />
        {debouncedSearchTerm && (
          <div className={styles.searchInfo}>
            <span className={styles.searchLabel}>
              {t('searchingFor', 'Buscando por DNI:')} <strong>{debouncedSearchTerm}</strong>
            </span>
          </div>
        )}
      </div>

      <DyakuPatientsTable pageSize={pageSize} searchDni={debouncedSearchTerm} />
    </div>
  );
};

export default DyakuPatientsOverview;
