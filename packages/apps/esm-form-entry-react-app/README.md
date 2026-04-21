# esm-form-entry-react-app

App base para la captura y renderizado de formularios clínicos.

Terminología de dominio: visita = consulta, encounter = atención, appointment = cita.

## Marco normativo
- Ley N.° 26842, Ley General de Salud (Perú).

## Límites funcionales
- Renderiza formularios, secciones, controles y lógica de entrada de datos de la atención.
- Centraliza la experiencia de captura para otros módulos que reutilizan el motor de formularios.
- No define reglas clínicas específicas de un dominio ni casos de negocio de alto nivel.
- No implementa flujos del paciente por sí misma; actúa como capa de presentación y entrada.

## Integraciones
- Fuentes de datos, esquema de formularios y almacenamiento local/remoto.
- Hooks, store y componentes de renderizado compartidos.
- Módulos consumidores que montan formularios clínicos sobre este motor.
