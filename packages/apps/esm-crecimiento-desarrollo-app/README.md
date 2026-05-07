# esm-cred-app

Este microfrontend vive en la carpeta `packages/apps/esm-crecimiento-desarrollo-app` y se publica como `@sihsalus/esm-cred-app`.

App orientada al seguimiento de CRED y control preventivo infantil.

Terminología de dominio: visita = consulta, encounter = atención, appointment = cita.

## Marco normativo
- Ley N.° 26842, Ley General de Salud (Perú).

## Límites funcionales
- Gestiona flujos de crecimiento y desarrollo, así como planes de inmunización asociados.
- Expone vistas para seguimiento pediátrico preventivo y cuidado del niño sano.
- No cubre atención de adulto, hospitalización ni gestión general de farmacia.
- No reemplaza el módulo de vacunación; solo consume y presenta el contexto CRED cuando aplica.

## Integraciones
- APIs clínicas de seguimiento infantil e inmunizaciones.
- Vistas de grupo clínico, cuidado del niño sano y plan de inmunización.
- Configuración y tipos compartidos del frontend.

## TODO content/backend

- Completar en content los conceptos del Test Peruano de Desarrollo Infantil. En `config-schema.ts`, `testPeruano` todavía tiene UUIDs vacíos para puntajes, clasificación, observaciones, contexto cultural e idioma.
- Validar los UUIDs de CRED Controls. `consultationTime`, `controlNumber` y `attendedAge` comparten el mismo UUID por copy-paste y deben apuntar a conceptos distintos.
- Definir el concept set real para `CRED.perinatalConceptSetUuid`; actualmente queda vacío y marcado pendiente de OCL.
- Confirmar que el guardado de reacción adversa ESAVI tenga en content el encounter type, form y conceptos configurados en `adverseReactionReporting`.
- Probar edición vs creación en los widgets que abren form engine con `encounterUuid: ''`; varios resúmenes todavía crean nuevos registros en vez de editar el encounter existente.

## TODO QA/QLTY

- Probar formulario por formulario en QLTY: abrir, completar campos obligatorios, guardar, recargar, editar si aplica y confirmar que el widget correspondiente lee los datos persistidos.
- Probar en QLTY el flujo end-to-end de CRED neonatal: abrir formulario, guardar, recargar la historia y confirmar que los widgets leen el encounter y las obs guardadas.
- Probar balance de líquidos, biometría, evaluación cefalocaudal, alojamiento conjunto y consejería de lactancia con datos reales.
- Validar que los formularios de nutrición infantil, estimulación temprana y control de niño sano persistan con el `encounterType`, `formUuid` y conceptos esperados.
- Confirmar permisos de usuario para crear y editar formularios CRED en QLTY, no solo para renderizar los dashboards.
- Mantener un set de pacientes de prueba para CRED con casos vacío, recién nacido, lactante y niño con controles previos.

## TODO i18n/UI

- Agregar smoke tests que detecten claves crudas visibles en dashboards, por ejemplo `NeonatalCare`, `newbornVitals`, `wellChildCare` o `childNutrition`.
- Agregar smoke test para textos duplicados de estados vacíos, por ejemplo `No hay no hay`.
- Revisar componentes CRED que usan `useTranslation()` sin namespace explícito cuando se renderizan dentro de slots compartidos.
- Acortar labels largos en tabs para evitar truncamiento visual; por ejemplo, evaluar `Consejería en lactancia materna` como `Lactancia`.
- Revisar `en.json` porque aún conserva textos heredados en español y puede confundir validaciones bilingües.
