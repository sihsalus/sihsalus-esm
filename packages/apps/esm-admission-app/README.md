# SIH Salus Admission App

Microfrontend de admision para concentrar flujos y evidencia funcional del perfil `N1.ADM` de la acreditacion SIHCE MINSA 373-2025.

## Funcionalidad

- Reporte de admisiones por UPS/servicio en `/admission`.
- Fusion de historias clinicas duplicadas en `/admission/merge`, delegando al flujo legacy de OpenMRS `mergePatients.form`.
- Resumen de identificacion minima del paciente para pantallas clinicas que consumen `patient-info-slot`.
- Accesos desde menu de aplicaciones, dashboard de inicio y acciones superiores.

## Evidencia MINSA

Los documentos usados para la auditoria de admision viven en `accreditation/`:

- [`accreditation/requerimientos_acreditacion_SIHCE_MINSA_373-2025.csv`](accreditation/requerimientos_acreditacion_SIHCE_MINSA_373-2025.csv): matriz completa extraida de la norma.
- [`accreditation/requerimientos_admision_SIHCE_MINSA_373-2025.csv`](accreditation/requerimientos_admision_SIHCE_MINSA_373-2025.csv): subconjunto del perfil de admision.
- [`accreditation/validacion_admision_SIHCE_MINSA_373-2025.md`](accreditation/validacion_admision_SIHCE_MINSA_373-2025.md): validacion funcional, brechas y puntaje proyectado.

Puntaje proyectado actual: `16/24` al desplegar la app y el content package asociado.

## Desarrollo

```sh
SIHSALUS_DEV_APPS=esm-admission-app,esm-patient-registration-app yarn start
```

## Validacion

```sh
yarn turbo run typescript --filter=@sihsalus/esm-admission-app --concurrency=1
yarn turbo run build --filter=@sihsalus/esm-admission-app --concurrency=1
CI=1 E2E_BASE_URL=http://localhost:8080/openmrs/spa E2E_API_BASE_URL=http://localhost:8080/openmrs yarn playwright test e2e/tests/admission-validation.spec.ts --project=desktop -g "duplicate patient merge|admission report"
```

La prueba completa de campos de admision requiere que el content package este desplegado, porque varios campos dependen de `personattributetypes` y conceptos nuevos.
