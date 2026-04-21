# esm-active-visits-app

App encargada de la vista operativa de visitas activas.

Terminología de dominio: visita = consulta, encounter = atención, appointment = cita.

## Marco normativo
- Ley N.° 26842, Ley General de Salud (Perú).

## Límites funcionales
- Muestra y organiza el estado actual de las consultas activas del paciente.
- Consulta contexto clínico, resúmenes y widgets asociados a la atención en curso.
- No gestiona registro, facturación ni historial longitudinal completo.
- No reemplaza otros módulos clínicos; solo expone la capa operativa de visitas activas.

## Integraciones
- Frontend modular de OpenMRS/SIHSalus.
- APIs de visitas, encuentros y contexto del paciente.
- Componentes compartidos de navegación, estado y UI.
