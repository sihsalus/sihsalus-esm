# esm-vacunacion-app

Microfrontend consolidado de vacunacion para SIHSALUS.

Este modulo vive en `packages/apps/esm-vacunacion-app`, se publica como `@sihsalus/esm-vacunacion-app` y reemplaza al upstream `esm-patient-immunizations-app` con adaptaciones para el esquema MINSA.

Base tecnica:

- upstream OpenMRS `openmrs-esm-patient-chart` `v12.1.0`
- ajustes funcionales locales preservados del fork de inmunizaciones
- configuracion de secuencias y etiquetas adaptadas a vacunacion MINSA

Estado de alineamiento:

- El tag upstream OpenMRS mas reciente verificado es `v12.1.0`.
- La configuracion normativa local usa NTS N.° 196-MINSA/DGIESP-2022, aprobada por RM 884-2022-MINSA.
- Modificatorias consideradas en configuracion: RM 218-2024, RM 474-2025, RM 709-2025 y RM 403-2026-MINSA.
- RM 403-2026-MINSA incorpora VRS/Nirsevimab de forma progresiva. Antes de habilitarlo como vacuna seleccionable, deben existir los conceptos/medicamentos correspondientes en el content package.
- El formulario muestra advertencias cuando una dosis configurada se registra fuera de la ventana de edad MINSA. No bloquea el guardado porque pueden existir rescates, campañas o indicaciones especiales.

Configuracion de conceptos:

- `immunizationConceptSet`: default `CIEL:984`. Debe resolver a un set/concepto con las vacunas seleccionables como respuestas.
- `fhirConceptMappings.immunizationResourceConcept`: default `CIEL:1421`. Debe existir como mapping unico en el content package para que el recurso FHIR2 `Immunization` pueda leer y guardar.

TODO content/backend:

- Validar en el content reference application que `CIEL:1421` exista como mapping unico para FHIR2 `Immunization`.
- Validar que `CIEL:984` resuelva al set local correcto de vacunas, o sobreescribir `immunizationConceptSet` en config con el mapping/UUID local.
