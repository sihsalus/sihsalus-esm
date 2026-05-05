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
