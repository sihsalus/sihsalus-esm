![Node.js CI](https://github.com/sihsalus/openmrs-esm-sihsalus-modules/workflows/Node.js%20CI/badge.svg)

# SIH SALUS ESM Modules

Colección de módulos microfrontend para SIH SALUS, una distribución especializada de OpenMRS 3.x adaptada al ecosistema de salud peruano y las directrices del MINSA.

## TODO content/backend

- Validar los UUIDs de controles CRED copiados en `config-schema.ts`; `consultationTime`, `controlNumber` y `attendedAge` no deben compartir el mismo concepto.
- Completar `CRED.perinatalConceptSetUuid` con el concept set real del content package o desactivar las vistas que dependen de ese set.
- Completar `legendConceptSetUuid` cuando exista el set real en OCL/content.
- Conectar los componentes placeholder de prevención de cáncer y planificación familiar a hooks SWR reales cuando estén definidos los conceptos clínicos.
- Probar formularios de salud materna contra backend actualizado: prenatal, postnatal, partograma, planificación familiar y prevención de cáncer.

## 🏥 Características Principales

- **SIH SALUS Library**: Componentes UI y servicios comunes optimizados para el flujo de trabajo peruano
