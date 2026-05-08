![Node.js CI](https://github.com/sihsalus/openmrs-esm-sihsalus-modules/workflows/Node.js%20CI/badge.svg)

# SIH SALUS ESM Modules

Colección de módulos microfrontend para SIH SALUS, una distribución especializada de OpenMRS 3.x adaptada al ecosistema de salud peruano y las directrices del MINSA.

## TODO content/backend

- Validar los UUIDs de controles CRED copiados en `config-schema.ts`; `consultationTime`, `controlNumber` y `attendedAge` no deben compartir el mismo concepto.
- Completar `CRED.perinatalConceptSetUuid` con el concept set real del content package o desactivar las vistas que dependen de ese set.
- Completar `legendConceptSetUuid` cuando exista el set real en OCL/content.
- Conectar los componentes placeholder de prevención de cáncer y planificación familiar a hooks SWR reales cuando estén definidos los conceptos clínicos.
- Probar formularios de salud materna contra backend actualizado: prenatal, postnatal, partograma, planificación familiar y prevención de cáncer.

## TODO QA/QLTY

- Probar formulario por formulario en QLTY: abrir, completar campos obligatorios, guardar, recargar, editar si aplica y confirmar que el widget correspondiente lee los datos persistidos.
- Probar en QLTY el flujo end-to-end de salud materna: abrir formulario, guardar, recargar la historia y confirmar que las tablas/widgets leen el encounter y las obs guardadas.
- Validar prenatal: historia materna, embarazo actual, atención prenatal, suplementación, plan de parto, psicoprofilaxis y clasificación de riesgo.
- Validar parto: resumen de labor y puerperio, parto/aborto y partograma con datos reales.
- Validar puerperio: puerperio inmediato, controles postnatales y seguimiento.
- Validar planificación familiar y prevención de cáncer cuando los conceptos clínicos y formularios reales estén completos en content.
- Confirmar permisos de usuario para crear y editar formularios de salud materna en QLTY, no solo para visualizar dashboards.

## TODO i18n/UI

- Agregar smoke tests que detecten claves crudas visibles en dashboards, por ejemplo `PrenatalCare`, `maternalHistory`, `prenatalAttention`, `familyPlanning` o `postnatalCare`.
- Agregar smoke test para textos duplicados de estados vacíos, por ejemplo `No hay no hay`.
- Revisar componentes de salud materna que usan `useTranslation()` sin namespace explícito cuando se renderizan dentro de slots compartidos.
- Revisar labels largos de tabs y tarjetas para que no se corten en 1280px ni en tablet.
- Revisar `en.json` porque aún conserva textos heredados en español y puede confundir validaciones bilingües.

## 🏥 Características Principales

- **SIH SALUS Library**: Componentes UI y servicios comunes optimizados para el flujo de trabajo peruano
