import { Button, Tabs, Tab, TabList, TabPanels, TabPanel } from '@carbon/react';
import { WhitePaper } from '@carbon/react/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { type Procedure } from '../../hooks/use-get-procedures';
import PageHeader from '../ui/PageHeader/pageHeader';

import { ProcedureAutocomplete } from './autocomplete/procedure-autocomplete';
import styles from './form.scss';
import { costStructureSchema, type CostStructureFormValues } from './schema/costructure-schema';
import EquipmentTab from './tabs/equipment-tab';
import GeneralServiceTab from './tabs/general-service-tab';
import HumanResourceTab from './tabs/humanresource-tab';
import InfrastructureTab from './tabs/infrastructure-tab';
import PublicServicesTab from './tabs/public-service-tab';
import SummaryTab from './tabs/summary-tab';
import SupplyTab from './tabs/supply-tab';

export default function CostStructureForm() {
  const [selectedTab, setSelectedTab] = useState(0);
  const { t } = useTranslation();

  const form = useForm<CostStructureFormValues>({
    resolver: zodResolver(costStructureSchema),
    defaultValues: {
      procedure: { conceptId: 0, nameFull: '', code: '' },
      infrastructures: [],
      publicServices: [],
      supplyCost: [],
      equipmentCost: [],
      humanResourceCost: [],
      annualServicesCost: {
        annualAdministrativeCost: 0,
        annualEnergyCost: 0,
        annualGeneralCost: 0,
        annualPhoneNetCost: 0,
        annualWaterCost: 0,
      },
    },
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;
  const onSubmit = (_data: CostStructureFormValues) => {
    // TODO: Implementar guardado via API (POST al OMOD de coststructure)
  };

  const onError = (_formErrors: Record<string, unknown>) => {
    // TODO: Mostrar notificación de errores de validación al usuario
  };

  const handleTanbChange = (state: { selectedIndex: number }) => {
    setSelectedTab((_index) => state.selectedIndex);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="">
      <PageHeader
        icon={<WhitePaper size={48} />}
        title={t('createCostStructureCpms', 'Create Cost Structure – CPMS')}
        subtitle={t('costing', 'Costing')}
      />
      <div className="">
        <section className={styles['header-form']}>
          <h3 className={styles.title}>{t('procedureInfo', 'Procedure Information')}</h3>

          <Controller
            name="procedure"
            control={control}
            render={({ field }) => (
              <ProcedureAutocomplete
                value={field.value as Procedure}
                onChange={(proc) => setValue('procedure', proc)}
                error={errors.procedure?.nameFull?.message}
              />
            )}
          />
        </section>

        {/* Tabs de costos */}
        <section className={styles['body-form']}>
          <h3 className={styles.title}>{t('detailedCostStructure', 'Detailed Cost Structure')}</h3>
          <Tabs selectedIndex={selectedTab} onChange={handleTanbChange}>
            <TabList>
              <Tab>{t('suppliesAndMedicines', 'Supplies and Medicines')}</Tab>
              <Tab>{t('equipmentAndFurniture', 'Equipment and Furniture')}</Tab>
              <Tab>{t('humanResources', 'Human Resources')}</Tab>
              <Tab>{t('infrastructure', 'Infrastructure')}</Tab>
              <Tab>{t('publicServices', 'Public Services')}</Tab>
              <Tab>{t('generalServices', 'General Services')}</Tab>
              <Tab>{t('summary', 'Summary')}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <SupplyTab form={form} />
              </TabPanel>
              <TabPanel>
                <EquipmentTab form={form} />
              </TabPanel>
              <TabPanel>
                <HumanResourceTab form={form} />
              </TabPanel>
              <TabPanel>
                <InfrastructureTab form={form} />
              </TabPanel>
              <TabPanel>
                <PublicServicesTab form={form} />
              </TabPanel>
              <TabPanel>
                <GeneralServiceTab form={form} />
              </TabPanel>
              <TabPanel>
                <SummaryTab form={form} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </section>

        <div className="flex gap-2">
          <Button kind="primary" type="submit">
            {t('saveStructure', 'Save structure')}
          </Button>
          <Button kind="secondary" type="reset">
            {t('clear', 'Clear')}
          </Button>
        </div>
      </div>
    </form>
  );
}
