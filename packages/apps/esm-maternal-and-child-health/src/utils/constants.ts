// ── Encounter representation ──
export const encounterRepresentation =
  'custom:(uuid,encounterDatetime,encounterType,location:(uuid,name),' +
  'patient:(uuid,display),encounterProviders:(uuid,provider:(uuid,name)),' +
  'obs:(uuid,obsDatetime,voided,groupMembers,concept:(uuid,name:(uuid,name)),value:(uuid,name:(uuid,name),' +
  'names:(uuid,conceptNameType,name))),form:(uuid,name))';

// ── Encounter types (encountertypes.csv) ──
export const MchEncounterType_UUID = 'b212032f-9903-4696-ab31-173d432d1d3d'; // Atención en Sala de Partos — NTS 050

// ── Forms ──
export const PartographEncounterFormUuid = 'd4c4dcfa-5c7b-4727-a7a6-f79a3b2c2735';
export const DeliveryForm_UUID = 'OBST-005-PARTO O ABORTO'; // Nombre del formulario Ampath (UUID generado al importar)

// ── Delivery / Parto concepts (CIEL) ──
export const ModeOfDelivery_UUID = '5630AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';    // CIEL 5630 — Modo de parto
export const GestationalSize_UUID = '1789AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';   // CIEL 1789 — Edad gestacional
export const BirthAbnormally_UUID = '164122AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';   // CIEL 164122 — Anomalía al nacer
export const BloodLoss_UUID = '161928AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';         // CIEL 161928 — Pérdida de sangre
export const GivenVitaminK_UUID = '984AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';     // CIEL 984 — Vitamina K administrada

// ── Partograph concepts ──
export const Progress_UUID = '160116AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const OneTime_UUID = '162135AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';       // CIEL 162135 — Descenso 1/5
export const Tier_UUID = '166065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';          // CIEL 166065 — Descenso 2/5
export const TierThree_UUID = '166066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';     // CIEL 166066 — Descenso 3/5
export const TierFour_UUID = '166067AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';      // CIEL 166067 — Descenso 4/5
export const Hours72To120 = '163734AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';       // CIEL 163734 — Descenso 5/5
export const DeviceRecorded = '163286AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const FetalHeartRate = '1440AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const CervicalDilation = '162261AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const SurgicalProcedure = '1810AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const ContractionFrequency = '163749AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const ContractionDuration = '163750AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const descentOfHeadObj = {
  '162135AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '1/5',
  '166065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '2/5',
  '166066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '3/5',
  '166067AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '4/5',
  '163734AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA': '5/5',
};

// ── Boolean concepts ──
export const TRUE_CONCEPT_UUID = 'cf82933b-3f3f-45e7-a5ab-5d31aaee3da3';

// ── Formatting ──
export const omrsDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';

// ── App info ──
export const moduleName = '@sihsalus/esm-maternal-and-child-health-app';
