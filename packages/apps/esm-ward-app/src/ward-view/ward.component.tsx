import { InlineNotification } from '@carbon/react';
import { useAppContext, useFeatureFlag } from '@openmrs/esm-framework';
import classNames from 'classnames';
import React, { type ReactNode, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import EmptyBedSkeleton from '../beds/empty-bed-skeleton.component';
import useWardLocation from '../hooks/useWardLocation';
import { type WardViewContext } from '../types';

import styles from './ward-view.scss';

const Ward = ({
  wardBeds,
  wardUnassignedPatients,
}: {
  wardBeds: ReactNode;
  wardUnassignedPatients: ReactNode;
}) => {
  const { location } = useWardLocation();
  const { t } = useTranslation();

  const { wardPatientGroupDetails } = useAppContext<WardViewContext>('ward-view-context') ?? {};
  const { bedLayouts } = wardPatientGroupDetails ?? {};
  const { isLoading: isLoadingAdmissionLocation, error: errorLoadingAdmissionLocation } =
    wardPatientGroupDetails?.admissionLocationResponse ?? {};
  const {
    isLoading: isLoadingInpatientAdmissions,
    error: errorLoadingInpatientAdmissions,
    hasMore: hasMoreInpatientAdmissions,
    loadMore: loadMoreInpatientAdmissions,
  } = wardPatientGroupDetails?.inpatientAdmissionResponse ?? {};
  const isBedManagementModuleInstalled = useFeatureFlag('bedmanagement-module');

  const scrollToLoadMoreTrigger = useRef<HTMLDivElement>(null);
  useEffect(
    function scrollToLoadMore() {
      const triggerElement = scrollToLoadMoreTrigger.current;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (hasMoreInpatientAdmissions && !errorLoadingInpatientAdmissions && !isLoadingInpatientAdmissions) {
                loadMoreInpatientAdmissions();
              }
            }
          });
        },
        { threshold: 1 },
      );

      if (triggerElement) {
        observer.observe(triggerElement);
      }

      return () => {
        if (triggerElement) {
          observer.unobserve(triggerElement);
        }
      };
    },
    [
      errorLoadingInpatientAdmissions,
      hasMoreInpatientAdmissions,
      isLoadingInpatientAdmissions,
      loadMoreInpatientAdmissions,
      scrollToLoadMoreTrigger,
    ],
  );

  if (!wardPatientGroupDetails) return <></>;

  return (
    <div className={classNames(styles.wardViewMain, styles.verticalTiling)}>
      {wardBeds}
      {bedLayouts?.length == 0 && isBedManagementModuleInstalled && (
        <InlineNotification
          kind="warning"
          lowContrast={true}
          title={t('noBedsConfigured', 'No beds configured for this location')}
        />
      )}
      {wardUnassignedPatients}
      {(isLoadingAdmissionLocation || isLoadingInpatientAdmissions) && <EmptyBeds />}
      {errorLoadingAdmissionLocation && (
        <InlineNotification
          kind="error"
          lowContrast={true}
          title={t('errorLoadingWardLocation', 'Error loading ward location')}
          subtitle={
            errorLoadingAdmissionLocation?.message ??
            t('invalidWardLocation', 'Invalid ward location: {{location}}', {
              location: location.display,
            })
          }
        />
      )}
      {errorLoadingInpatientAdmissions && (
        <InlineNotification
          kind="error"
          lowContrast={true}
          title={t('errorLoadingPatients', 'Error loading admitted patients')}
          subtitle={errorLoadingInpatientAdmissions?.message}
        />
      )}
      <div ref={scrollToLoadMoreTrigger}></div>
    </div>
  );
};

const emptyBedSkeletonKeys = Array.from({ length: 20 }, (_, index) => `empty-bed-${index}`);

const EmptyBeds = () => {
  return (
    <>
      {emptyBedSkeletonKeys.map((key) => (
        <EmptyBedSkeleton key={key} />
      ))}
    </>
  );
};

export default Ward;
