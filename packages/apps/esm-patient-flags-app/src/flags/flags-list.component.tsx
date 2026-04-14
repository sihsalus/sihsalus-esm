import { Button, ButtonSet, Dropdown, Form, InlineLoading, Search, Tile, Toggle, Stack } from '@carbon/react';
import { useLayoutType, showSnackbar, parseDate, formatDate, ResponsiveWrapper } from '@openmrs/esm-framework';
import { type DefaultPatientWorkspaceProps } from '@openmrs/esm-patient-common-lib';
import debounce from 'lodash-es/debounce';
import isEmpty from 'lodash-es/isEmpty';
import orderBy from 'lodash-es/orderBy';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './flags-list.scss';
import { usePatientFlags, enablePatientFlag, disablePatientFlag, type PatientFlag } from './hooks/usePatientFlags';
import { getFlagType } from './utils';

type dropdownFilter = 'A - Z' | 'Active first' | 'Retired first';

const FlagsList: React.FC<DefaultPatientWorkspaceProps> = (props) => {
  const { patientUuid } = props;
  const { t } = useTranslation();
  const { flags, isLoading, error, mutate } = usePatientFlags(patientUuid);
  const isTablet = useLayoutType() === 'tablet';

  const searchRef = useRef<HTMLInputElement>(null);
  const [isEnabling, setIsEnabling] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<dropdownFilter>('A - Z');

  const sortedRows = useMemo(() => {
    if (!sortBy) {
      return flags;
    }
    if (sortBy === 'Active first') {
      return orderBy(flags, [(item: PatientFlag) => Number(item.voided)], 'asc');
    }
    if (sortBy === 'Retired first') {
      return orderBy(flags, [(item: PatientFlag) => Number(item.voided)], 'desc');
    }
    return orderBy(flags, (f: PatientFlag) => f.flag.display, 'asc');
  }, [sortBy, flags]);

  const searchResults = useMemo(() => {
    if (!isEmpty(searchTerm)) {
      return sortedRows.filter((f: PatientFlag) => f.flag.display.toLowerCase().search(searchTerm.toLowerCase()) !== -1);
    } else {
      return sortedRows;
    }
  }, [searchTerm, sortedRows]);

  const handleSearch = useMemo(() => debounce((term: string) => setSearchTerm(term), 300), [setSearchTerm]);

  const handleSortByChange = ({ selectedItem }: { selectedItem: dropdownFilter }) => setSortBy(selectedItem);

  const handleEnableFlag = async (flagUuid: string) => {
    setIsEnabling(true);
    const res = await enablePatientFlag(flagUuid);

    if (res.status === 200) {
      void mutate();
      setIsEnabling(false);
      showSnackbar({
        isLowContrast: true,
        kind: 'success',
        subtitle: t('flagEnabledSuccessfully', 'Flag successfully enabled'),
        title: t('enabledFlag', 'Enabled flag'),
      });
    } else {
      showSnackbar({
        isLowContrast: false,
        kind: 'error',
        subtitle: t('flagEnableError', 'Error enabling flag'),
        title: t('flagEnabled', 'flag enabled'),
      });
    }
  };

  const handleDisableFlag = async (flagUuid: string) => {
    setIsDisabling(true);
    const res = await disablePatientFlag(flagUuid);

    if (res.status === 204) {
      void mutate();
      setIsDisabling(false);
      showSnackbar({
        isLowContrast: true,
        kind: 'success',
        subtitle: t('flagDisabledSuccessfully', 'Flag successfully disabled'),
        title: t('flagDisabled', 'Flag disabled'),
      });
    } else {
      showSnackbar({
        isLowContrast: false,
        kind: 'error',
        subtitle: t('flagDisableError', 'Error disabling the flag'),
        title: t('disableFlagError', 'Disable flag error'),
      });
    }
  };

  if (isLoading) {
    return <InlineLoading className={styles.loading} description={`${t('loading', 'Loading')} ...`} />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <Form className={styles.formWrapper}>
      {/* The <div> below is required to maintain the page layout styling */}
      <div>
        <ResponsiveWrapper>
          <Search
            labelText={t('searchForAFlag', 'Search for a flag')}
            placeholder={t('searchForAFlag', 'Search for a flag')}
            ref={searchRef}
            size={isTablet ? 'lg' : 'md'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
          />
        </ResponsiveWrapper>
        <Stack gap={4}>
          <div className={styles.listWrapper}>
            <div className={styles.flagsHeaderInfo}>
              {searchResults.length > 0 ? (
                <>
                  <span className={styles.resultsCount}>
                    {t('matchesForSearchTerm', '{{count}} flags', {
                      count: searchResults.length,
                    })}
                  </span>
                  <Dropdown
                    className={styles.sortDropdown}
                    id="sortBy"
                    initialSelectedItem={'A - Z'}
                    label=""
                    type="inline"
                    items={[
                      t('alphabetically', 'A - Z'),
                      t('activeFirst', 'Active first'),
                      t('retiredFirst', 'Retired first'),
                    ]}
                    onChange={handleSortByChange}
                    titleText="Sort by"
                  />
                </>
              ) : null}
            </div>
            {searchResults.length > 0
              ? searchResults.map((result) => (
                  <div className={styles.flagTile} key={result.uuid}>
                    <div className={styles.flagHeader}>
                      <div className={styles.titleAndType}>
                        <div className={styles.flagTitle}>{result.flag.display}</div>&middot;
                        <span className={styles.type}>{getFlagType(result.tags)}</span>
                      </div>
                      <Toggle
                        className={styles.flagToggle}
                        defaultToggled={!result.voided}
                        id={result.uuid}
                        labelA=""
                        labelB=""
                        onToggle={(on) => {
                          if (on) {
                            void handleEnableFlag(result.uuid);
                          } else {
                            void handleDisableFlag(result.uuid);
                          }
                        }}
                        size="sm"
                      />
                    </div>
                    {result.voided ? null : (
                      <div className={styles.secondRow}>
                        <div className={styles.metadata}>
                          <span className={styles.label}>Assigned</span>
                          <span className={styles.value}>
                            {formatDate(parseDate(result.auditInfo?.dateCreated), { time: false })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              : null}

            {searchResults.length === 0 ? (
              <div className={styles.emptyState}>
                <Tile className={styles.tile}>
                  <p className={styles.content}>{t('noFlagsFound', 'Sorry, no flags found matching your search')}</p>
                  <p className={styles.helper}>
                    <Button
                      kind="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchTerm('');
                        if (searchRef.current) {
                          searchRef.current.value = '';
                          searchRef.current.focus();
                        }
                      }}
                    >
                      {t('clearSearch', 'Clear search')}
                    </Button>
                  </p>
                </Tile>
              </div>
            ) : null}
          </div>
        </Stack>
      </div>
      <ButtonSet className={isTablet ? styles.tabletButtonSet : styles.desktopButtonSet}>
        <Button className={styles.button} kind="secondary" onClick={() => props.closeWorkspace()}>
          {t('discard', 'Discard')}
        </Button>
        <Button
          className={styles.button}
          disabled={isEnabling || isDisabling}
          kind="primary"
          type="submit"
          onClick={() => {
            void props.closeWorkspaceWithSavedChanges();
          }}
        >
          {(() => {
            if (isEnabling) return t('enablingFlag', 'Enabling flag...');
            if (isDisabling) return t('disablingFlag', 'Disabling flag...');
            return t('saveAndClose', 'Save & close');
          })()}
        </Button>
      </ButtonSet>
    </Form>
  );
};

export default FlagsList;
