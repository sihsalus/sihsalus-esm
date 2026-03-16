import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layer, Tab, TabList, TabPanel, TabPanels, Tabs, Tile } from '@carbon/react';
import {
  Activity,
  Chat,
  Catalog,
  DocumentMultiple_01,
  Finance,
  ListChecked,
  UserIdentification,
} from '@carbon/react/icons';
import styles from './consulta-externa-dashboard.scss';
import TriageSummary from './triage-summary.component';
import MotivoConsulta from './motivo-consulta.component';
import DiagnosticoClasificado from './diagnostico-clasificado.component';
import NotasSoap from './notas-soap.component';
import PlanTratamiento from './plan-tratamiento.component';
import Financiador from './financiador.component';
import PertenenciaEtnica from './pertenencia-etnica.component';

interface ConsultaExternaDashboardProps {
  patientUuid: string;
}

const ConsultaExternaDashboard: React.FC<ConsultaExternaDashboardProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  return (
    <div>
      <Layer>
        <Tile>
          <div className={styles.desktopHeading}>
            <h4>{t('consultaExterna', 'Consulta Externa')}</h4>
          </div>
        </Tile>
      </Layer>

      <Layer className={styles.tabsContainer}>
        <Tabs>
          <TabList contained activation="manual" aria-label={t('consultaExternaTabs', 'Consulta Externa tabs')}>
            <Tab renderIcon={Activity}>{t('triage', 'Triaje')}</Tab>
            <Tab renderIcon={Chat}>{t('chiefComplaint', 'Motivo de Consulta')}</Tab>
            <Tab renderIcon={Catalog}>{t('diagnosisClassification', 'Diagnóstico')}</Tab>
            <Tab renderIcon={DocumentMultiple_01}>{t('soapNotes', 'Notas SOAP')}</Tab>
            <Tab renderIcon={ListChecked}>{t('treatmentPlan', 'Plan de Tratamiento')}</Tab>
            <Tab renderIcon={Finance}>{t('insuranceProvider', 'Financiador')}</Tab>
            <Tab renderIcon={UserIdentification}>{t('ethnicIdentity', 'Pertenencia Étnica')}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <TriageSummary patientUuid={patientUuid} />
            </TabPanel>
            <TabPanel>
              <MotivoConsulta patientUuid={patientUuid} />
            </TabPanel>
            <TabPanel>
              <DiagnosticoClasificado patientUuid={patientUuid} />
            </TabPanel>
            <TabPanel>
              <NotasSoap patientUuid={patientUuid} />
            </TabPanel>
            <TabPanel>
              <PlanTratamiento patientUuid={patientUuid} />
            </TabPanel>
            <TabPanel>
              <Financiador patientUuid={patientUuid} />
            </TabPanel>
            <TabPanel>
              <PertenenciaEtnica patientUuid={patientUuid} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Layer>
    </div>
  );
};

export default ConsultaExternaDashboard;
