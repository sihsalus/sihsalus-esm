import { Button, InlineLoading } from '@carbon/react';
import { navigate, openmrsFetch, showSnackbar, useConfig } from '@openmrs/esm-framework';
import { useVisitOrOfflineVisit } from '@openmrs/esm-patient-common-lib';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { Config } from '../config-schema';
import FuaHtmlViewer from '../components/fua-html-viewer.component';

interface FuaEncounterWorkspaceProps {
  patientUuid: string;
  encounterUuid?: string;
  visitUuid?: string;
}

interface FuaPatientOrder {
  uuid: string;
  visitUuid?: string | null;
}

const FuaEncounterWorkspace: React.FC<FuaEncounterWorkspaceProps> = ({ patientUuid, encounterUuid, visitUuid }) => {
  const { t } = useTranslation();
  const config = useConfig<Config>();
  const { currentVisit, activeVisit, isLoading: isLoadingVisit } = useVisitOrOfflineVisit(patientUuid);
  const [isInitializing, setIsInitializing] = useState(true);
  const [fuaId, setFuaId] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retrySeed, setRetrySeed] = useState(0);

  useEffect(() => {
    if (isLoadingVisit) {
      return;
    }

    const effectiveVisitUuid = visitUuid ?? currentVisit?.uuid ?? activeVisit?.uuid;

    if (!effectiveVisitUuid) {
      const message = t('noActiveVisitForFua', 'No hay una visita activa para crear FUA');
      setErrorMessage(message);
      setIsInitializing(false);
      return;
    }

    const loadExistingFua = async () => {
      try {
        setIsInitializing(true);
        setErrorMessage(null);

        const fuaResponse = await openmrsFetch<Array<FuaPatientOrder>>(
          `${config.fuaApiBasePath}/patient/${patientUuid}`,
        );
        const fuaOrders = fuaResponse?.data ?? [];
        const matchingFua =
          fuaOrders.find((fua) => fua.visitUuid === effectiveVisitUuid) ??
          fuaOrders.find((fua) => fua.uuid === encounterUuid);

        if (!matchingFua?.uuid) {
          setErrorMessage(
            t(
              'noFuaForCurrentVisit',
              'No hay un FUA registrado para la visita actual. Abra la gestión FUA para revisar o generar el documento en el backend.',
            ),
          );
          setFuaId(undefined);
          return;
        }

        setFuaId(matchingFua.uuid);
      } catch (error) {
        const message = error instanceof Error ? error.message : t('errorLoadingFua', 'Error al cargar FUA');
        setErrorMessage(message);
        showSnackbar({
          title: t('errorLoadingFua', 'Error al cargar FUA'),
          subtitle: message,
          kind: 'error',
        });
      } finally {
        setIsInitializing(false);
      }
    };

    void loadExistingFua();
  }, [
    config.fuaApiBasePath,
    encounterUuid,
    activeVisit?.uuid,
    currentVisit?.uuid,
    isLoadingVisit,
    patientUuid,
    retrySeed,
    t,
    visitUuid,
  ]);

  if (isInitializing) {
    return (
      <div style={{ padding: '1rem' }}>
        <InlineLoading description={t('creatingFua', 'Creando FUA...')} />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div style={{ padding: '1rem', display: 'grid', gap: '1rem' }}>
        <p>{errorMessage}</p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button kind="primary" onClick={() => setRetrySeed((seed) => seed + 1)}>
            {t('retry', 'Reintentar')}
          </Button>
          <Button kind="secondary" onClick={() => navigate({ to: '${openmrsSpaBase}/fua-request' })}>
            {t('openFuaManagement', 'Abrir gestión FUA')}
          </Button>
        </div>
      </div>
    );
  }

  if (!fuaId) {
    return (
      <div style={{ padding: '1rem', display: 'grid', gap: '1rem' }}>
        <p>
          {t(
            'noFuaForCurrentVisit',
            'No hay un FUA registrado para la visita actual. Abra la gestión FUA para revisar o generar el documento en el backend.',
          )}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button kind="secondary" onClick={() => navigate({ to: '${openmrsSpaBase}/fua-request' })}>
            {t('openFuaManagement', 'Abrir gestión FUA')}
          </Button>
          <Button kind="primary" onClick={() => setRetrySeed((seed) => seed + 1)}>
            {t('retry', 'Reintentar')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <FuaHtmlViewer fuaId={fuaId} />
    </div>
  );
};

export default FuaEncounterWorkspace;
