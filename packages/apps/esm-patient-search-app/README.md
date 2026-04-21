# esm-patient-search-app

App para búsqueda de pacientes y selección contextual.

Terminología de dominio: visita = consulta, encounter = atención, appointment = cita.

## Marco normativo
- Ley N.° 29733, Ley de Protección de Datos Personales (Perú).

## Límites funcionales
- Proporciona búsqueda compacta, overlay y página de resultados.
- Facilita la selección de paciente para otros módulos del portal.
- No crea ni modifica el registro del paciente.
- No reemplaza módulos de admisión, listas o atención clínica.

## Integraciones
- API de búsqueda y datos básicos del paciente.
- Componentes compactos, overlays y extensiones del buscador.
- Contexto compartido para interoperar con otros flujos del frontend.
